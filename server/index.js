import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { syncMaryKayCatalog, exportToOfficialCart, fetchProductBySkuFromMaryKay } from './scraper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data', 'db.json');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Helper functions for reading/writing JSON DB
function readDb() {
  const data = fs.readFileSync(DB_FILE, 'utf8');
  return JSON.parse(data);
}

function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// REST API Endpoints

// 1. Obter todos os dados (Consultora, Produtos, Clientes, Carrinhos)
app.get('/api/data', (req, res) => {
  try {
    const db = readDb();
    res.json(db);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler banco de dados local.' });
  }
});

// 2. Atualizar perfil da consultora principal
app.post('/api/consultant', (req, res) => {
  try {
    const db = readDb();
    db.consultant = { ...db.consultant, ...req.body };
    
    // Garantir sincronização na lista de consultoras
    if (!db.consultants) db.consultants = [];
    const existingIdx = db.consultants.findIndex(c => c.id === db.consultant.id || c.code === db.consultant.code);
    if (existingIdx !== -1) {
      db.consultants[existingIdx] = db.consultant;
    } else {
      if (!db.consultant.id) db.consultant.id = 'consultant-' + Date.now();
      db.consultants.push(db.consultant);
    }

    writeDb(db);
    res.json({ success: true, consultant: db.consultant, consultants: db.consultants });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar dados da consultora.' });
  }
});

// 2.1 Gestão de Múltiplas Vendedoras / Consultoras
app.get('/api/consultants', (req, res) => {
  try {
    const db = readDb();
    if (!db.consultants || db.consultants.length === 0) {
      db.consultants = [db.consultant];
    }
    res.json({ consultants: db.consultants, activeConsultant: db.consultant });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar vendedoras.' });
  }
});

app.post('/api/consultants', (req, res) => {
  try {
    const db = readDb();
    if (!db.consultants) db.consultants = [];
    const consultantData = req.body;

    if (consultantData.id) {
      const idx = db.consultants.findIndex(c => c.id === consultantData.id);
      if (idx !== -1) db.consultants[idx] = consultantData;
      else db.consultants.push(consultantData);
    } else {
      consultantData.id = 'consultant-' + Date.now();
      db.consultants.push(consultantData);
    }

    // Se for marcada como ativa ou se for a única, atualizar consultora ativa
    if (consultantData.isActive || db.consultants.length === 1) {
      db.consultant = consultantData;
    }

    writeDb(db);
    res.json({ success: true, consultant: consultantData, consultants: db.consultants });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar vendedora.' });
  }
});

app.post('/api/consultants/approve', (req, res) => {
  try {
    const db = readDb();
    const { consultantId } = req.body;
    if (!db.consultants) db.consultants = [];
    const idx = db.consultants.findIndex(c => c.id === consultantId);
    if (idx !== -1) {
      db.consultants[idx].status = 'approved';
      writeDb(db);
      return res.json({ success: true, consultant: db.consultants[idx], consultants: db.consultants });
    }
    res.status(404).json({ error: 'Vendedora não encontrada.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao aprovar vendedora.' });
  }
});

app.post('/api/consultants/select', (req, res) => {
  try {
    const db = readDb();
    const { consultantId } = req.body;
    const found = (db.consultants || []).find(c => c.id === consultantId);
    if (found) {
      db.consultant = found;
      writeDb(db);
      return res.json({ success: true, consultant: db.consultant, consultants: db.consultants });
    }
    res.status(404).json({ error: 'Vendedora não encontrada.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao selecionar vendedora.' });
  }
});

app.delete('/api/consultants/:id', (req, res) => {
  try {
    const db = readDb();
    if (!db.consultants) db.consultants = [];
    db.consultants = db.consultants.filter(c => c.id !== req.params.id && c.email !== req.params.id);
    if (db.consultant && (db.consultant.id === req.params.id || db.consultant.email === req.params.id)) {
      db.consultant = db.consultants[0] || null;
    }
    writeDb(db);
    return res.json({ success: true, consultants: db.consultants, activeConsultant: db.consultant });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir vendedora.' });
  }
});

// 3. Cadastrar / Editar Cliente
app.post('/api/clients', (req, res) => {
  try {
    const db = readDb();
    const newClient = req.body;
    
    if (newClient.id) {
      const idx = db.clients.findIndex(c => c.id === newClient.id);
      if (idx !== -1) db.clients[idx] = newClient;
    } else {
      newClient.id = 'c-' + Date.now();
      newClient.totalSpent = 0;
      db.clients.push(newClient);
    }

    writeDb(db);
    res.json({ success: true, client: newClient, clients: db.clients });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar cliente.' });
  }
});

// 4. Deletar Cliente
app.delete('/api/clients/:id', (req, res) => {
  try {
    const db = readDb();
    db.clients = db.clients.filter(c => c.id !== req.params.id);
    db.carts = db.carts.filter(cart => cart.clientId !== req.params.id);
    writeDb(db);
    res.json({ success: true, clients: db.clients });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover cliente.' });
  }
});

// 5. Salvar / Atualizar Carrinho
app.post('/api/carts', (req, res) => {
  try {
    const db = readDb();
    const cart = req.body;

    if (cart.id) {
      const idx = db.carts.findIndex(c => c.id === cart.id);
      if (idx !== -1) db.carts[idx] = cart;
      else db.carts.push(cart);
    } else {
      cart.id = 'cart-' + Date.now();
      cart.createdAt = new Date().toISOString();
      db.carts.push(cart);
    }

    writeDb(db);
    res.json({ success: true, cart, carts: db.carts });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar carrinho.' });
  }
});

// 6. Deletar Carrinho
app.delete('/api/carts/:id', (req, res) => {
  try {
    const db = readDb();
    db.carts = db.carts.filter(c => c.id !== req.params.id);
    writeDb(db);
    res.json({ success: true, carts: db.carts });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover carrinho.' });
  }
});

// 7. Sincronizar com o Portal Mary Kay (Importar todos os 604 produtos do catálogo oficial)
app.post('/api/sync-mk', async (req, res) => {
  try {
    const db = readDb();
    const mapPath = path.join(__dirname, 'data', 'official_mk_catalog_map.json');

    if (fs.existsSync(mapPath)) {
      const fullCatalogMap = JSON.parse(fs.readFileSync(mapPath, 'utf-8'));
      let addedCount = 0;
      let updatedCount = 0;

      Object.keys(fullCatalogMap).forEach(sku => {
        const officialItem = fullCatalogMap[sku];
        const existingIndex = db.products.findIndex(p => p.sku === officialItem.sku || (p.sku && p.sku.replace(/\D/g, '') === officialItem.sku.replace(/\D/g, '')));
        
        if (existingIndex !== -1) {
          // Preservar estoque e personalizações da consultora, atualizando nome, categoria e preços oficiais
          db.products[existingIndex] = {
            ...db.products[existingIndex],
            name: officialItem.name,
            category: officialItem.category,
            price: officialItem.price,
            costPrice: officialItem.costPrice,
            image: officialItem.image || db.products[existingIndex].image
          };
          updatedCount++;
        } else {
          // Adiciona novo produto oficial ao catálogo da consultora
          db.products.push({
            id: 'mk-' + officialItem.sku.toLowerCase(),
            sku: officialItem.sku,
            name: officialItem.name,
            category: officialItem.category,
            price: officialItem.price,
            costPrice: officialItem.costPrice,
            image: officialItem.image,
            description: officialItem.description,
            isBestSeller: false
          });
          addedCount++;
        }
      });

      writeDb(db);
      return res.json({
        success: true,
        message: `Catálogo Mary Kay® 100% Sincronizado! ${addedCount} novos produtos adicionados. Total: ${db.products.length} produtos no seu catálogo!`,
        products: db.products
      });
    }

    const result = await syncMaryKayCatalog(db.consultant.code, req.body.password || '@Tata8282selena');
    res.json(result);
  } catch (error) {
    console.error('Erro na sincronização:', error);
    res.status(500).json({ error: 'Erro na sincronização Mary Kay.' });
  }
});

// 7.1. Atualizar Foto de Produto do Catálogo
app.post('/api/products/update-image', (req, res) => {
  try {
    const db = readDb();
    const { productId, newImageUrl } = req.body;
    const prod = db.products.find(p => p.id === productId);
    if (prod) {
      prod.image = newImageUrl;
      writeDb(db);
      return res.json({ success: true, product: prod, products: db.products });
    }
    res.status(404).json({ error: 'Produto não encontrado.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar foto do produto.' });
  }
});

// 7.2. Salvar Configurações da Consultora
app.post('/api/settings', (req, res) => {
  try {
    const db = readDb();
    db.settings = { ...db.settings, ...req.body };
    writeDb(db);
    res.json({ success: true, settings: db.settings });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar configurações.' });
  }
});

// 7.3. Atualizar Preço e Custo de Produto
app.post('/api/products/update-pricing', (req, res) => {
  try {
    const db = readDb();
    const { productId, price, costPrice } = req.body;
    const prod = db.products.find(p => p.id === productId);
    if (prod) {
      if (price !== undefined) prod.price = price;
      if (costPrice !== undefined) prod.costPrice = costPrice;
      writeDb(db);
      return res.json({ success: true, product: prod, products: db.products });
    }
    res.status(404).json({ error: 'Produto não encontrado.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar preços do produto.' });
  }
});

// 7.4. Cadastrar Novo Produto no Catálogo
app.post('/api/products/add', (req, res) => {
  try {
    const db = readDb();
    const newProduct = {
      id: 'mk-' + Date.now(),
      sku: req.body.sku || 'SKU-' + Date.now().toString().slice(-6),
      name: req.body.name,
      category: req.body.category || 'Maquiagem (Bases, Batons, Olhos)',
      price: parseFloat(req.body.price) || 0,
      costPrice: parseFloat(req.body.costPrice) || (parseFloat(req.body.price) * 0.6),
      image: req.body.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
      description: req.body.description || '',
      isBestSeller: !!req.body.isBestSeller
    };

    db.products.push(newProduct);
    writeDb(db);
    res.json({ success: true, product: newProduct, products: db.products });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar produto.' });
  }
});

// 7.5. Buscar Produto no Site Oficial Mary Kay por SKU e Incluir Automaticamente no Catálogo
app.post('/api/products/fetch-by-sku', async (req, res) => {
  try {
    const db = readDb();
    const cleanSku = String(req.body.sku || '').trim().toUpperCase();
    if (!cleanSku) return res.status(400).json({ error: 'Código SKU não informado.' });

    const cleanSkuDigits = cleanSku.replace(/\D/g, '');

    // 1. Verificar se já existe no catálogo local (Busca Exata por SKU ou Dígitos)
    let existingIndex = db.products.findIndex(p => {
      const pSkuUpper = p.sku ? p.sku.toUpperCase() : '';
      const pDigits = p.sku ? p.sku.replace(/\D/g, '') : '';
      return pSkuUpper === cleanSku || (cleanSkuDigits && pDigits === cleanSkuDigits);
    });
    
    if (existingIndex !== -1) {
      const existingProd = db.products[existingIndex];
      const isPlaceholder = existingProd.name.includes('Produto Mary Kay®') ||
                            existingProd.name.includes('Produto Oficial') ||
                            existingProd.name.includes('(SKU #') ||
                            existingProd.name.includes('(Código #');
      
      // Se o produto já possui um nome completo e definitivo (não genérico), retornar os dados existentes
      if (!isPlaceholder) {
        return res.json({
          success: true,
          alreadyExisted: true,
          product: existingProd,
          products: db.products,
          message: `Produto #${cleanSku} ("${existingProd.name}") localizado no catálogo!`
        });
      }
    }

    // 2. Se for um item novo ou provisório, buscar definição oficial
    const scraperResult = await fetchProductBySkuFromMaryKay(cleanSku, db.consultant.code, db.consultant.password);
    if (!scraperResult.success || !scraperResult.fetchedProduct) {
      return res.status(404).json({ error: `Código SKU #${cleanSku} não encontrado.` });
    }

    const fetched = scraperResult.fetchedProduct;

    if (existingIndex !== -1) {
      // Atualiza o registro provisório antigo na base de dados
      db.products[existingIndex] = { ...db.products[existingIndex], ...fetched };
    } else {
      // Adiciona o novo produto oficial à base de dados
      db.products.push(fetched);
    }

    writeDb(db);

    res.json({
      success: true,
      alreadyExisted: existingIndex !== -1,
      product: fetched,
      products: db.products,
      message: `Produto #${cleanSku} localizado: "${fetched.name}" (R$ ${fetched.price.toFixed(2)})!`
    });
  } catch (error) {
    console.error('Erro no endpoint fetch-by-sku:', error);
    res.status(500).json({ error: 'Erro ao buscar código no site da Mary Kay.' });
  }
});

// 8. Exportar Pedidos Selecionados para o Carrinho Oficial
app.post('/api/export-official-cart', async (req, res) => {
  try {
    const db = readDb();
    const { cartIds } = req.body;
    
    // Agrupar itens de todos os carrinhos selecionados
    const selectedCarts = db.carts.filter(c => cartIds.includes(c.id));
    const combinedItemsMap = {};

    selectedCarts.forEach(cart => {
      cart.items.forEach(item => {
        if (!combinedItemsMap[item.sku]) {
          combinedItemsMap[item.sku] = { ...item, quantity: 0 };
        }
        combinedItemsMap[item.sku].quantity += item.quantity;
      });
    });

    const combinedItems = Object.values(combinedItemsMap);
    const result = await exportToOfficialCart(db.consultant.code, '@Tata8282selena', combinedItems);
    
    res.json({
      ...result,
      combinedItems
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao exportar pedido para o site oficial.' });
  }
});

// 9. Consulta Automática de CEP (ViaCEP)
app.get('/api/cep/:cep', async (req, res) => {
  try {
    const cleanCep = String(req.params.cep || '').replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      return res.status(400).json({ error: 'CEP inválido. Digite 8 números.' });
    }
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();
    if (data.erro) {
      return res.status(404).json({ error: 'CEP não encontrado.' });
    }
    res.json({
      success: true,
      rua: data.logradouro || '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      estado: data.uf || ''
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao consultar serviço de CEP.' });
  }
});

// 10. Atualização de Estoque Físico & Idade do Estoque (Pronta-Entrega)
app.post('/api/inventory/update', (req, res) => {
  try {
    const db = readDb();
    const { productId, stockCount, stockEntryDate } = req.body;
    const prod = db.products.find(p => p.id === productId);
    if (prod) {
      if (stockCount !== undefined) prod.stockCount = Math.max(0, parseInt(stockCount) || 0);
      if (stockEntryDate) prod.stockEntryDate = stockEntryDate;
      else if (!prod.stockEntryDate) prod.stockEntryDate = new Date().toISOString();
      writeDb(db);
      return res.json({ success: true, product: prod, products: db.products });
    }
    res.status(404).json({ error: 'Produto não encontrado.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar estoque.' });
  }
});

// 11. Cadastro & Gestão de Brindes de Fidelidade
app.get('/api/rewards', (req, res) => {
  try {
    const db = readDb();
    res.json({ rewards: db.rewards || [] });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar brindes.' });
  }
});

app.post('/api/rewards', (req, res) => {
  try {
    const db = readDb();
    if (!db.rewards) db.rewards = [];
    const newReward = {
      id: 'rw-' + Date.now(),
      name: req.body.name,
      pointsRequired: parseInt(req.body.pointsRequired) || 100,
      description: req.body.description || '',
      image: req.body.image || 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80'
    };
    db.rewards.push(newReward);
    writeDb(db);
    res.json({ success: true, reward: newReward, rewards: db.rewards });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao cadastrar brinde.' });
  }
});

app.delete('/api/rewards/:id', (req, res) => {
  try {
    const db = readDb();
    if (db.rewards) {
      db.rewards = db.rewards.filter(r => r.id !== req.params.id);
      writeDb(db);
    }
    res.json({ success: true, rewards: db.rewards || [] });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover brinde.' });
  }
});

// 12. Controle de Pagamentos / Fiados & Contas a Receber
app.post('/api/payments', (req, res) => {
  try {
    const db = readDb();
    if (!db.payments) db.payments = [];
    const { clientId, amount, method, notes, date } = req.body;
    const client = db.clients.find(c => c.id === clientId);
    
    const paymentRecord = {
      id: 'pay-' + Date.now(),
      clientId,
      clientName: client ? client.name : 'Cliente',
      amount: parseFloat(amount) || 0,
      method: method || 'PIX',
      notes: notes || '',
      date: date || new Date().toISOString()
    };
    db.payments.push(paymentRecord);
    writeDb(db);
    res.json({ success: true, payment: paymentRecord, payments: db.payments });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registrar pagamento.' });
  }
});

// 13. Backup Completo dos Dados
app.get('/api/backup', (req, res) => {
  try {
    const db = readDb();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=backup_tailise_marykay_${new Date().toISOString().slice(0, 10)}.json`);
    res.send(JSON.stringify(db, null, 2));
  } catch (err) {
    res.status(500).json({ error: 'Erro ao gerar backup.' });
  }
});

// 14. Exportação para CSV / Excel
app.get('/api/export/csv', (req, res) => {
  try {
    const db = readDb();
    const type = req.query.type || 'clients';
    let csv = '';

    if (type === 'clients') {
      csv = 'Nome,Telefone,CEP,Rua,Numero,Bairro,Cidade,TomBase,PontosFidelidade\n';
      db.clients.forEach(c => {
        const addr = c.address || {};
        csv += `"${c.name || ''}","${c.phone || ''}","${addr.cep || ''}","${addr.rua || ''}","${addr.numero || ''}","${addr.bairro || ''}","${addr.cidade || ''}","${c.skinProfile?.foundationTone || ''}",${c.loyaltyPoints || 0}\n`;
      });
    } else {
      csv = 'SKU,Nome,Categoria,PrecoVenda,PrecoCusto,EstoqueQtd,DataEntradaEstoque\n';
      db.products.forEach(p => {
        csv += `"${p.sku || ''}","${p.name || ''}","${p.category || ''}",${p.price || 0},${p.costPrice || 0},${p.stockCount || 0},"${p.stockEntryDate || ''}"\n`;
      });
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=${type}_tailise_marykay_${new Date().toISOString().slice(0, 10)}.csv`);
    res.send('\uFEFF' + csv);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao exportar planilha.' });
  }
});

app.listen(PORT, () => {
  console.log(`[MaryKay Server] Servidor local executando na porta ${PORT}`);
});
