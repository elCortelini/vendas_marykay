import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ClientManagement from './components/ClientManagement';
import MultiCart from './components/MultiCart';
import ClientQuoteModal from './components/ClientQuoteModal';
import CatalogSync from './components/CatalogSync';
import ConsolidatorModal from './components/ConsolidatorModal';
import ConsultantCalculator from './components/ConsultantCalculator';
import SettingsPanel from './components/SettingsPanel';
import MarketingFlyerModal from './components/MarketingFlyerModal';
import FinancialDashboard from './components/FinancialDashboard';
import LoyaltyManagerModal from './components/LoyaltyManagerModal';
import KitsManagerModal from './components/KitsManagerModal';
import KitsManagerView from './components/KitsManagerView';
import LoyaltyManagerView from './components/LoyaltyManagerView';
import InventoryManagerView from './components/InventoryManagerView';
import SalesDashboardView from './components/SalesDashboardView';
import AdminControlPanel from './components/AdminControlPanel';
import LoginModal from './components/LoginModal';
import SelfRegisterModal from './components/SelfRegisterModal';
import PublicLandingView from './components/PublicLandingView';
import defaultDb from '../server/data/db.json';
import officialCatalogMap from '../server/data/official_mk_catalog_map.json';
import { fetchAllVtexProductsClient, fetchVtexProductBySkuClient } from './services/vtexService';
import { subscribeToAuth, logoutUser, isUserAdmin, ADMIN_EMAIL } from './services/firebase';
import { saveToCloud, fetchFromCloud } from './services/cloudSync';

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTabState] = useState(() => localStorage.getItem('mk_active_tab') || 'carts');
  const [activeCartId, setActiveCartId] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [quoteModalCart, setQuoteModalCart] = useState(null);
  const [isConsolidatorOpen, setIsConsolidatorOpen] = useState(false);
  const [isFlyerModalOpen, setIsFlyerModalOpen] = useState(false);
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState(false);
  const [isKitsModalOpen, setIsKitsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSelfRegisterOpen, setIsSelfRegisterOpen] = useState(false);
  const [pendingGoogleUser, setPendingGoogleUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [notification, setNotification] = useState(null);

  const isAdmin = isUserAdmin(currentUser);

  // Determinar o Perfil da Consultora Ativa com base no Usuário Logado
  const activeConsultant = (() => {
    if (isAdmin) {
      return {
        id: 'admin-master',
        name: currentUser?.displayName || 'elCortelini',
        email: ADMIN_EMAIL,
        title: 'Administrador Master do Sistema',
        region: 'Rede Geral Mary Kay®',
        code: 'ADMIN-01',
        avatar: currentUser?.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=elcortelini'
      };
    }

    if (currentUser) {
      const email = currentUser.email?.toLowerCase();
      // 1. Procurar nas consultoras cadastradas pelo e-mail
      const foundInList = (data?.consultants || []).find(c => c.email?.toLowerCase() === email);
      if (foundInList) return foundInList;

      // 2. Se for o e-mail oficial da Tailise
      if (email === 'tailiseroza@gmail.com') {
        return data?.consultant || {
          id: 'consultant-tailise',
          name: 'Tailise',
          email: 'tailiseroza@gmail.com',
          title: 'Consultora de Beleza Independente Mary Kay®',
          region: 'Itajaí e região',
          code: 'NW7527',
          phone: '(47) 99999-8888',
          pixKey: '47999998888',
          avatar: '/images/tailise_avatar.png'
        };
      }

      // 3. Consultora genérica conectada via Google
      return {
        name: currentUser.displayName || currentUser.email.split('@')[0],
        email: currentUser.email,
        title: 'Consultora de Beleza Independente Mary Kay®',
        region: 'Itajaí e Região',
        code: 'MK-CONSULTORA',
        avatar: currentUser.photoURL || '/images/tailise_avatar.png'
      };
    }

    // Se ninguém estiver logado (Visitante)
    return null;
  })();

  // Redirecionamento automático após login conforme o perfil (Admin -> admin, Consultora -> carts)
  const handleUserLoginRedirect = (user) => {
    if (!user) return;
    const email = user.email?.toLowerCase();
    if (email === ADMIN_EMAIL.toLowerCase()) {
      setActiveTabState('admin');
      localStorage.setItem('mk_active_tab', 'admin');
    } else {
      setActiveTabState('carts');
      localStorage.setItem('mk_active_tab', 'carts');
    }
  };

  // Monitorar Autenticação do Google & Sessão Ativa
  useEffect(() => {
    // 1. Verificar se há sessão salva localmente
    const savedUser = localStorage.getItem('mk_auth_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
        handleUserLoginRedirect(parsedUser);
      } catch (e) {}
    }

    // 2. Monitorar Firebase Auth
    const unsubscribe = subscribeToAuth((user) => {
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('mk_auth_user', JSON.stringify(user));
        showToast(`Bem-vinda(o), ${user.displayName || user.email}!`);
        handleUserLoginRedirect(user);
      }
    });
    return () => unsubscribe();
  }, []);

  const setActiveTab = (tab) => {
    localStorage.setItem('mk_active_tab', tab);
    setActiveTabState(tab);
  };

  // Carregar dados da API ou do Banco de Dados Local / Nuvem
  const fetchData = async () => {
    // 1. Ler imediatamente do cache local para carregamento instantâneo
    const localRaw = localStorage.getItem('vendas_marykay_cloud_master_db_v1') || localStorage.getItem('mk_app_data');
    let localData = null;
    if (localRaw) {
      try {
        localData = JSON.parse(localRaw);
      } catch (e) {}
    }

    if (localData) {
      setData(localData);
      if (localData.carts && localData.carts.length > 0 && !activeCartId) {
        setActiveCartId(localData.carts[0].id);
      }
      setLoading(false);
    }

    // 2. Consultar servidor backend local se disponível
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const json = await res.json();
        if (!localData || (json.clients && json.clients.length >= (localData.clients?.length || 0))) {
          setData(json);
          localStorage.setItem('vendas_marykay_cloud_master_db_v1', JSON.stringify(json));
          if (json.carts && json.carts.length > 0 && !activeCartId) {
            setActiveCartId(json.carts[0].id);
          }
        }
        setLoading(false);
        return;
      }
    } catch (err) {
      console.log('Ambiente estático ou offline. Carregando dados locais/nuvem.');
    }

    // 3. Fallback em nuvem caso não haja nada salvo localmente
    if (!localData) {
      const cloudData = await fetchFromCloud();
      const loadedData = cloudData || defaultDb;
      setData(loadedData);
      localStorage.setItem('vendas_marykay_cloud_master_db_v1', JSON.stringify(loadedData));
      if (loadedData.carts && loadedData.carts.length > 0 && !activeCartId) {
        setActiveCartId(loadedData.carts[0].id);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3500);
  };

  // 1. Sincronizar catálogo Mary Kay (Via API Pública VTEX)
  const handleSyncCatalog = async () => {
    setIsSyncing(true);
    try {
      // 1. Tentar sincronização via API do servidor local se ativo
      const res = await fetch('/api/sync-mk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: '@Tata8282selena' })
      });
      if (res.ok) {
        const json = await res.json();
        showToast(json.message || 'Catálogo Mary Kay® sincronizado via API VTEX com sucesso!');
        await fetchData();
        return;
      }
    } catch (err) {
      console.log('Servidor backend offline. Sincronizando catálogo diretamente pela API VTEX...');
    }

    // 2. Sincronização direta via API VTEX pelo cliente
    try {
      const vtexProducts = await fetchAllVtexProductsClient(50, 8);
      if (vtexProducts && vtexProducts.length > 0) {
        const existingProductsMap = new Map();
        (data?.products || []).forEach(p => existingProductsMap.set(p.sku, p));
        vtexProducts.forEach(p => existingProductsMap.set(p.sku, p));

        const updatedProducts = Array.from(existingProductsMap.values());
        const newData = { ...data, products: updatedProducts };
        setData(newData);
        localStorage.setItem('vendas_marykay_cloud_master_db_v1', JSON.stringify(newData));
        await saveToCloud(newData);

        showToast(`Catálogo Mary Kay® Sincronizado via VTEX API! ${vtexProducts.length} produtos oficiais atualizados em tempo real!`);
        return;
      }
    } catch (e) {
      console.error('Erro na sincronização VTEX client:', e);
    } finally {
      setIsSyncing(false);
    }

    showToast('Catálogo Mary Kay® atualizado com sucesso!');
  };

  // 2. Salvar / Editar Cliente
  const handleSaveClient = async (clientData) => {
    try {
      const currentClients = data?.clients || [];
      let updatedClients = [];
      let savedClient = clientData;

      if (clientData.id) {
        updatedClients = currentClients.map(c => c.id === clientData.id ? { ...c, ...clientData } : c);
      } else {
        savedClient = { ...clientData, id: 'c-' + Date.now(), totalSpent: clientData.totalSpent || 0 };
        updatedClients = [...currentClients, savedClient];
      }

      const newData = { ...data, clients: updatedClients };
      setData(newData);
      localStorage.setItem('vendas_marykay_cloud_master_db_v1', JSON.stringify(newData));
      await saveToCloud(newData);

      showToast('Ficha da cliente salva com sucesso!');

      try {
        await fetch('/api/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clientData)
        });
      } catch (e) {}
    } catch (err) {
      console.error('Erro ao salvar cliente:', err);
      showToast('Erro ao salvar ficha da cliente.');
    }
  };

  // 3. Remover Cliente
  const handleDeleteClient = async (clientId) => {
    const targetClient = (data?.clients || []).find(c => c.id === clientId);
    const clientName = targetClient?.name || 'esta cliente';

    if (!window.confirm(`Tem certeza que deseja excluir a cliente "${clientName}" e todos os seus carrinhos?`)) {
      return;
    }

    try {
      const updatedClients = (data?.clients || []).filter(c => c.id !== clientId);
      const updatedCarts = (data?.carts || []).filter(c => c.clientId !== clientId);
      const newData = { ...data, clients: updatedClients, carts: updatedCarts };
      setData(newData);
      localStorage.setItem('vendas_marykay_cloud_master_db_v1', JSON.stringify(newData));
      await saveToCloud(newData);

      showToast(`Cliente "${clientName}" removida com sucesso.`);

      try {
        await fetch(`/api/clients/${clientId}`, { method: 'DELETE' });
      } catch (e) {}
    } catch (err) {
      console.error('Erro ao remover cliente:', err);
      showToast('Erro ao remover cliente.');
    }
  };

  // 4. Criar Carrinho para Cliente Específica
  const handleCreateCartForClient = async (client, customTitle) => {
    const newCart = {
      id: 'cart-' + Date.now(),
      clientId: client.id,
      clientName: client.name,
      title: customTitle || `Carrinho - ${new Date().toLocaleDateString('pt-BR')}`,
      status: 'Em Aberto',
      discountPercent: data?.settings?.defaultDiscount || 0,
      shippingFee: 0,
      items: [],
      createdAt: new Date().toISOString()
    };

    try {
      const updatedCarts = [...(data?.carts || []), newCart];
      const newData = { ...data, carts: updatedCarts };
      setData(newData);
      localStorage.setItem('vendas_marykay_cloud_master_db_v1', JSON.stringify(newData));
      await saveToCloud(newData);
      setActiveCartId(newCart.id);
      setActiveTab('carts');
      showToast(`Novo carrinho criado para ${client.name}!`);

      try {
        await fetch('/api/carts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCart)
        });
      } catch (e) {}
    } catch (err) {
      console.error('Erro ao criar carrinho:', err);
    }
  };

  // 5. Salvar / Atualizar Carrinho
  const handleUpdateCart = async (cartData) => {
    try {
      setActiveCartId(cartData.id);

      const updatedCarts = (data?.carts || []).map(c => c.id === cartData.id ? cartData : c);
      const newData = { ...data, carts: updatedCarts };
      setData(newData);
      localStorage.setItem('vendas_marykay_cloud_master_db_v1', JSON.stringify(newData));
      await saveToCloud(newData);

      try {
        await fetch('/api/carts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cartData)
        });
      } catch (e) {}
    } catch (err) {
      console.error('Erro ao atualizar carrinho:', err);
    }
  };

  // 6. Remover Carrinho
  const handleDeleteCart = async (cartId) => {
    const targetCart = (data?.carts || []).find(c => c.id === cartId);
    const title = targetCart?.title || targetCart?.clientName || 'este carrinho';

    if (!window.confirm(`Tem certeza que deseja excluir o carrinho "${title}"?`)) {
      return;
    }

    try {
      const updatedCarts = (data?.carts || []).filter(c => c.id !== cartId);
      const newData = { ...data, carts: updatedCarts };
      setData(newData);
      localStorage.setItem('vendas_marykay_cloud_master_db_v1', JSON.stringify(newData));
      await saveToCloud(newData);

      if (activeCartId === cartId) {
        if (updatedCarts.length > 0) setActiveCartId(updatedCarts[0].id);
        else setActiveCartId(null);
      }

      showToast('Carrinho removido com sucesso.');

      try {
        await fetch(`/api/carts/${cartId}`, { method: 'DELETE' });
      } catch (e) {}
    } catch (err) {
      console.error('Erro ao remover carrinho:', err);
      showToast('Erro ao remover carrinho.');
    }
  };

  // 7. Atualizar foto do produto do catálogo
  const handleUpdateProductImage = async (productId, newImageUrl) => {
    try {
      const updatedProducts = (data?.products || []).map(p => p.id === productId ? { ...p, image: newImageUrl } : p);
      const newData = { ...data, products: updatedProducts };
      setData(newData);
      localStorage.setItem('vendas_marykay_cloud_master_db_v1', JSON.stringify(newData));
      await saveToCloud(newData);
      showToast('Foto do produto atualizada!');

      try {
        await fetch('/api/products/update-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, newImageUrl })
        });
      } catch (e) {}
    } catch (err) {
      console.error('Erro ao atualizar foto:', err);
    }
  };

  // 8. Salvar Configurações
  const handleSaveSettings = async (settingsData) => {
    try {
      const newData = { ...data, settings: { ...data?.settings, ...settingsData } };
      setData(newData);
      localStorage.setItem('vendas_marykay_cloud_master_db_v1', JSON.stringify(newData));
      await saveToCloud(newData);
      showToast('Configurações salvas!');

      try {
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settingsData)
        });
      } catch (e) {}
    } catch (err) {
      console.error(err);
    }
  };

  // 9. Atualizar Preço e Custo do Produto
  const handleUpdateProductPricing = async (productId, price, costPrice) => {
    try {
      const updatedProducts = (data?.products || []).map(p => {
        if (p.id === productId) {
          return {
            ...p,
            price: price !== undefined ? price : p.price,
            costPrice: costPrice !== undefined ? costPrice : p.costPrice
          };
        }
        return p;
      });
      const newData = { ...data, products: updatedProducts };
      setData(newData);
      localStorage.setItem('vendas_marykay_cloud_master_db_v1', JSON.stringify(newData));
      await saveToCloud(newData);
      showToast('Preços do produto atualizados!');

      try {
        await fetch('/api/products/update-pricing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, price, costPrice })
        });
      } catch (e) {}
    } catch (err) {
      console.error(err);
    }
  };

  // 9.1. Cadastrar Novo Produto
  const handleAddProduct = async (productData) => {
    try {
      const newProduct = {
        id: 'mk-' + Date.now(),
        sku: productData.sku || 'SKU-' + Date.now().toString().slice(-6),
        name: productData.name,
        category: productData.category || 'Maquiagem (Bases, Batons, Olhos)',
        price: parseFloat(productData.price) || 0,
        costPrice: parseFloat(productData.costPrice) || (parseFloat(productData.price) * 0.6),
        image: productData.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
        description: productData.description || '',
        isBestSeller: !!productData.isBestSeller
      };

      const updatedProducts = [newProduct, ...(data?.products || [])];
      const newData = { ...data, products: updatedProducts };
      setData(newData);
      localStorage.setItem('vendas_marykay_cloud_master_db_v1', JSON.stringify(newData));
      await saveToCloud(newData);
      showToast('Novo produto cadastrado no catálogo!');

      try {
        await fetch('/api/products/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
      } catch (e) {}
    } catch (err) {
      console.error(err);
    }
  };

  // 9.2. Buscar Produto no Site Oficial Mary Kay por Código SKU (Integração Direta VTEX API + Fallback)
  const handleFetchProductBySku = async (sku) => {
    const cleanSku = String(sku || '').trim().toUpperCase();
    if (!cleanSku) {
      showToast('Código SKU não informado.');
      return { success: false, error: 'Código SKU não informado.' };
    }

    // 1. Tentar buscar via API Backend se estiver em execução
    try {
      const res = await fetch('/api/products/fetch-by-sku', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku: cleanSku })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.product) {
          showToast(json.message);
          await fetchData();
          return json;
        }
      }
    } catch (err) {
      console.log('Backend offline. Consultando código SKU diretamente via API VTEX...');
    }

    // 2. Tentar busca direta na API Pública VTEX pelo cliente
    try {
      const vtexProduct = await fetchVtexProductBySkuClient(cleanSku);
      if (vtexProduct) {
        const currentProducts = data?.products || [];
        const existingIdx = currentProducts.findIndex(p => p.sku === vtexProduct.sku || p.id === vtexProduct.id);
        
        let updatedProducts = [];
        if (existingIdx !== -1) {
          updatedProducts = [...currentProducts];
          updatedProducts[existingIdx] = { ...updatedProducts[existingIdx], ...vtexProduct };
        } else {
          updatedProducts = [vtexProduct, ...currentProducts];
        }

        const newData = { ...data, products: updatedProducts };
        setData(newData);
        localStorage.setItem('vendas_marykay_cloud_master_db_v1', JSON.stringify(newData));
        await saveToCloud(newData);

        showToast(`⚡ Produto #${cleanSku} ("${vtexProduct.name}") obtido diretamente da API VTEX! (R$ ${vtexProduct.price.toFixed(2)})`);
        return { success: true, product: vtexProduct, products: updatedProducts, message: `Produto #${cleanSku} ("${vtexProduct.name}") obtido via API VTEX!` };
      }
    } catch (e) {
      console.warn('Erro ao consultar VTEX client:', e);
    }

    // 3. Fallback Local em caso de falha de conexão
    const cleanDigits = cleanSku.replace(/\D/g, '');
    const currentProducts = data?.products || [];

    let existingProd = currentProducts.find(p => {
      const pSkuUpper = p.sku ? p.sku.toUpperCase() : '';
      const pDigits = p.sku ? p.sku.replace(/\D/g, '') : '';
      return pSkuUpper === cleanSku || (cleanDigits && pDigits === cleanDigits);
    });

    if (existingProd) {
      showToast(`Produto #${cleanSku} ("${existingProd.name}") localizado no catálogo!`);
      return { success: true, product: existingProd, products: currentProducts, alreadyExisted: true, message: `Produto #${cleanSku} ("${existingProd.name}") localizado no catálogo!` };
    }

    const matchedOfficial = officialCatalogMap[cleanSku] || 
                            officialCatalogMap[cleanDigits] ||
                            (cleanDigits && (officialCatalogMap[cleanDigits.replace(/^10/, '')] || officialCatalogMap[cleanDigits.replace(/^0+/, '')]));

    const newProduct = matchedOfficial ? {
      id: 'mk-' + (matchedOfficial.sku || cleanDigits || cleanSku.toLowerCase()),
      sku: matchedOfficial.sku || cleanSku,
      name: matchedOfficial.name,
      category: matchedOfficial.category || 'Maquiagem (Bases, Batons, Olhos)',
      price: matchedOfficial.price || 39.90,
      costPrice: matchedOfficial.costPrice || Number(((matchedOfficial.price || 39.90) * 0.6).toFixed(2)),
      image: matchedOfficial.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
      description: matchedOfficial.description || `Produto oficial Mary Kay® com código #${cleanSku}.`,
      isBestSeller: true
    } : {
      id: 'mk-' + (cleanDigits || cleanSku.toLowerCase()),
      sku: cleanSku,
      name: `Produto Mary Kay® (Código #${cleanSku})`,
      category: "Maquiagem (Bases, Batons, Olhos)",
      price: 39.90,
      costPrice: 23.94,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
      description: `Produto oficial Mary Kay® cadastrado via SKU #${cleanSku}.`,
      isBestSeller: true
    };

    const updatedProducts = [newProduct, ...currentProducts];
    const newData = { ...data, products: updatedProducts };
    setData(newData);
    localStorage.setItem('vendas_marykay_cloud_master_db_v1', JSON.stringify(newData));
    await saveToCloud(newData);

    showToast(`Produto #${cleanSku} ("${newProduct.name}") cadastrado no catálogo!`);
    return { success: true, product: newProduct, products: updatedProducts, message: `Produto #${cleanSku} ("${newProduct.name}") cadastrado no catálogo!` };
  };

  // 10. Exportar para Carrinho Oficial
  const handleExportOfficialCart = async (selectedCartIds) => {
    const res = await fetch('/api/export-official-cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartIds: selectedCartIds })
    });
    return await res.json();
  };

  // 11. Registrar Pagamento / Entrada de Cliente
  const handleRecordPayment = async (paymentData) => {
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });
      if (res.ok) {
        showToast('Pagamento registrado com sucesso!');
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 12. Cadastrar Brinde de Fidelidade
  const handleAddReward = async (rewardData) => {
    try {
      const res = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rewardData)
      });
      if (res.ok) {
        showToast('Novo brinde cadastrado!');
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 13. Remover Brinde
  const handleDeleteReward = async (rewardId) => {
    try {
      const res = await fetch(`/api/rewards/${rewardId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Brinde removido.');
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 14. Atualizar Estoque Físico Pronta-Entrega
  const handleUpdateInventory = async (productId, stockCount, stockEntryDate) => {
    try {
      const res = await fetch('/api/inventory/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, stockCount, stockEntryDate })
      });
      if (res.ok) {
        showToast('Estoque físico (Pronta-Entrega) atualizado!');
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 15. Incluir Kit Promocional no Carrinho Ativo
  const handleAddKitToCart = (kit) => {
    const targetCart = data?.carts?.find(c => c.id === activeCartId) || data?.carts[0];
    if (!targetCart) {
      showToast('Nenhum carrinho ativo selecionado!');
      return;
    }

    let updatedItems = [...targetCart.items];
    if (kit.items && kit.items.length > 0) {
      kit.items.forEach(it => {
        const prod = data?.products?.find(p => p.sku === it.sku) || { id: 'kit-' + it.sku, sku: it.sku, name: it.name, price: it.price, costPrice: it.price * 0.6 };
        const existingIdx = updatedItems.findIndex(i => i.productId === prod.id || i.sku === prod.sku);
        if (existingIdx !== -1) {
          updatedItems[existingIdx].quantity += 1;
        } else {
          updatedItems.push({
            productId: prod.id,
            sku: prod.sku,
            name: prod.name,
            price: prod.price,
            costPrice: prod.costPrice,
            quantity: 1,
            image: prod.image || kit.image
          });
        }
      });
    }
    handleUpdateCart({ ...targetCart, items: updatedItems });
    showToast(`Kit "${kit.name}" adicionado ao carrinho de ${targetCart.clientName}!`);
  };

  // 16. Atualizar Pontos de Fidelidade da Cliente
  const handleUpdateClientPoints = async (clientId, newPoints) => {
    try {
      const targetClient = data?.clients?.find(c => c.id === clientId);
      if (!targetClient) return;
      const updatedClient = { ...targetClient, loyaltyPoints: Math.max(0, newPoints) };
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedClient)
      });
      if (res.ok) {
        showToast('Pontuação da cliente atualizada!');
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 17. Salvar / Alterar Perfil de Vendedora
  const handleSaveConsultant = async (consultantData) => {
    try {
      const res = await fetch('/api/consultants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consultantData)
      });

      // Atualização otimista no estado local e nuvem
      const currentConsultants = data?.consultants || [];
      const idx = currentConsultants.findIndex(c => c.id === consultantData.id || (c.email && c.email.toLowerCase() === consultantData.email?.toLowerCase()));
      let updatedConsultants = [...currentConsultants];
      if (idx !== -1) {
        updatedConsultants[idx] = { ...updatedConsultants[idx], ...consultantData };
      } else {
        updatedConsultants.push(consultantData);
      }

      const newData = { ...data, consultants: updatedConsultants };
      setData(newData);
      await saveToCloud(newData);

      showToast('Perfil da vendedora salvo com sucesso!');
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // 17b. Aprovação 1-Clique de Consultora pelo Admin
  const handleApproveConsultant = async (consultantId) => {
    try {
      await fetch('/api/consultants/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consultantId })
      });

      const currentConsultants = data?.consultants || [];
      const updatedConsultants = currentConsultants.map(c => c.id === consultantId ? { ...c, status: 'approved' } : c);
      const newData = { ...data, consultants: updatedConsultants };
      setData(newData);
      await saveToCloud(newData);

      showToast('✅ Consultora aprovada e liberada com sucesso!');
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // 17c. Auto-Cadastro no Primeiro Acesso
  const handleSelfRegistration = async (registrationData) => {
    await handleSaveConsultant(registrationData);
    setIsSelfRegisterOpen(false);
    showToast('⏳ Cadastro enviado! Aguardando aprovação do Administrador Master.');
  };

  // 18. Alternar Vendedora Ativa
  const handleSelectConsultant = async (consultantId) => {
    try {
      const res = await fetch('/api/consultants/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consultantId })
      });
      if (res.ok) {
        showToast('Vendedora ativa alterada!');
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 19. Deletar Vendedora (Com Confirmação & Sincronização Garantida)
  const handleDeleteConsultant = async (consultantId) => {
    const targetConsultant = (data?.consultants || []).find(c => c.id === consultantId || c.email === consultantId);
    const consultantName = targetConsultant?.name || 'esta vendedora';

    if (!window.confirm(`Tem certeza que deseja excluir a vendedora "${consultantName}" da rede?`)) {
      return;
    }

    try {
      try {
        await fetch(`/api/consultants/${consultantId}`, { method: 'DELETE' });
      } catch (e) {
        // Fallback silencioso em ambiente estático GitHub Pages
      }

      const currentConsultants = (data?.consultants || []).filter(c => c.id !== consultantId && c.email !== consultantId);
      const newData = { 
        ...data, 
        consultants: currentConsultants,
        consultant: data?.consultant?.id === consultantId ? (currentConsultants[0] || null) : data?.consultant
      };
      
      setData(newData);
      localStorage.setItem('vendas_marykay_cloud_master_db_v1', JSON.stringify(newData));
      await saveToCloud(newData);

      showToast(`Vendedora "${consultantName}" removida com sucesso.`);
    } catch (err) {
      console.error('Erro ao excluir vendedora:', err);
      showToast('Erro ao remover vendedora.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F5] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#E899AC] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-serif-mk text-lg font-bold text-gray-800">Carregando Sistema Tailise Mary Kay®...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col font-sans">
      {/* Toast Notification de Luxo */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A]/95 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-[#E899AC]/50 text-xs font-bold backdrop-blur-md flex items-center gap-3 animate-fade-in transition-all">
          <div className="w-7 h-7 rounded-full bg-[#E899AC]/20 text-[#E899AC] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-[#E899AC]" />
          </div>
          <span>{notification}</span>
          <button 
            onClick={() => setNotification(null)}
            className="text-gray-400 hover:text-white ml-2 cursor-pointer font-bold text-sm"
            title="Fechar Notificação"
          >
            ×
          </button>
        </div>
      )}

      <Header
        consultant={activeConsultant}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSyncCatalog={handleSyncCatalog}
        isSyncing={isSyncing}
        cartsCount={data?.carts?.length || 0}
        clientsCount={data?.clients?.length || 0}
        currentUser={currentUser}
        isAdmin={isAdmin}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={async () => {
          localStorage.removeItem('mk_auth_user');
          setCurrentUser(null);
          await logoutUser();
          setActiveTab('carts');
          showToast('Sessão encerrada com sucesso.');
        }}
        onOpenKitsModal={() => setIsKitsModalOpen(true)}
        onOpenLoyaltyModal={() => setIsLoyaltyModalOpen(true)}
      />

      {/* Banner Informativo para Consultoras com Cadastro Pendente */}
      {activeConsultant?.status === 'pending' && !isAdmin && (
        <div className="bg-amber-500 text-gray-950 p-4 border-b border-amber-600 shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <span className="text-xl">⏳</span>
              <div>
                <h4 className="font-extrabold text-sm uppercase tracking-wide">Cadastro Aguardando Liberação do Administrador Master</h4>
                <p className="text-xs font-semibold text-gray-950/90 mt-0.5">
                  Seu cadastro inicial de consultora foi enviado e está sob análise do Administrador (elcortelini@gmail.com). Assim que aprovado, seu painel completo estará ativo!
                </p>
              </div>
            </div>
            <span className="bg-gray-950 text-amber-300 px-3.5 py-1 rounded-full font-black text-xs shrink-0 shadow-sm">
              Status: Em Análise
            </span>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!currentUser ? (
          <PublicLandingView
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
          />
        ) : (
          <>
            {activeTab === 'admin' && isAdmin && (
              <AdminControlPanel
                adminUser={currentUser}
                consultants={data?.consultants || [data?.consultant]}
                products={data?.products || []}
                carts={data?.carts || []}
                clients={data?.clients || []}
                onSaveConsultant={handleSaveConsultant}
                onApproveConsultant={handleApproveConsultant}
                onDeleteConsultant={handleDeleteConsultant}
                onSelectConsultantToInspect={(consultantId) => {
                  handleSelectConsultant(consultantId);
                  setActiveTab('carts');
                }}
                onSyncCatalog={handleSyncCatalog}
              />
            )}

            {activeTab === 'carts' && (
              <MultiCart
                carts={data?.carts || []}
                clients={data?.clients || []}
                products={data?.products || []}
                activeCartId={activeCartId}
                setActiveCartId={setActiveCartId}
                onUpdateCart={handleUpdateCart}
                onDeleteCart={handleDeleteCart}
                onCreateNewCart={handleCreateCartForClient}
                onOpenQuoteModal={(cart) => setQuoteModalCart(cart)}
                onOpenConsolidator={() => setIsConsolidatorOpen(true)}
              />
            )}

            {activeTab === 'dashboard' && (
              <SalesDashboardView
                products={data?.products || []}
                clients={data?.clients || []}
                carts={data?.carts || []}
                payments={data?.payments || []}
              />
            )}

            {activeTab === 'clients' && (
              <ClientManagement
                clients={data?.clients || []}
                carts={data?.carts || []}
                onSaveClient={handleSaveClient}
                onDeleteClient={handleDeleteClient}
                onCreateCartForClient={handleCreateCartForClient}
                onSelectCart={(cartId) => {
                  setActiveCartId(cartId);
                  setActiveTab('carts');
                }}
              />
            )}

            {activeTab === 'catalog' && (
              <CatalogSync
                products={data?.products || []}
                categories={data?.categories || []}
                onSyncCatalog={handleSyncCatalog}
                isSyncing={isSyncing}
                onUpdateProductImage={handleUpdateProductImage}
                onAddProduct={handleAddProduct}
                onFetchProductBySku={handleFetchProductBySku}
                onOpenFlyerModal={() => setIsFlyerModalOpen(true)}
                onOpenKitsModal={() => setIsKitsModalOpen(true)}
                onUpdateInventory={handleUpdateInventory}
                onQuickAddToCart={(product) => {
                  const targetCart = data?.carts?.find(c => c.id === activeCartId) || data?.carts[0];
                  if (targetCart) {
                    const existing = targetCart.items.find(i => i.productId === product.id);
                    let items = [];
                    if (existing) {
                      items = targetCart.items.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i);
                    } else {
                      items = [...targetCart.items, {
                        productId: product.id,
                        sku: product.sku,
                        name: product.name,
                        price: product.price,
                        costPrice: product.costPrice,
                        quantity: 1,
                        image: product.image
                      }];
                    }
                    handleUpdateCart({ ...targetCart, items });
                    showToast(`Adicionado ao carrinho de ${targetCart.clientName}!`);
                  }
                }}
              />
            )}

            {activeTab === 'inventory' && (
              <InventoryManagerView
                products={data?.products || []}
                clients={data?.clients || []}
                onUpdateInventory={handleUpdateInventory}
                onRecordPayment={handleRecordPayment}
              />
            )}

            {activeTab === 'kits' && (
              <KitsManagerView
                products={data?.products || []}
                onAddKitToCart={handleAddKitToCart}
              />
            )}

            {activeTab === 'loyalty' && (
              <LoyaltyManagerView
                rewards={data?.rewards || []}
                clients={data?.clients || []}
                onAddReward={handleAddReward}
                onDeleteReward={handleDeleteReward}
                onUpdateClientPoints={handleUpdateClientPoints}
              />
            )}

            {activeTab === 'financial' && (
              <FinancialDashboard
                products={data?.products || []}
                clients={data?.clients || []}
                carts={data?.carts || []}
                payments={data?.payments || []}
                onRecordPayment={handleRecordPayment}
                onOpenLoyalty={() => setIsLoyaltyModalOpen(true)}
              />
            )}

            {activeTab === 'calculator' && (
              <ConsultantCalculator consultant={activeConsultant} />
            )}

            {activeTab === 'settings' && (
              <SettingsPanel
                isAdmin={isAdmin}
                consultant={activeConsultant}
                consultants={data?.consultants || [data?.consultant]}
                settings={data?.settings}
                products={data?.products || []}
                onSaveSettings={handleSaveSettings}
                onUpdateProductPricing={handleUpdateProductPricing}
                onSaveConsultant={handleSaveConsultant}
                onSelectConsultant={handleSelectConsultant}
                onDeleteConsultant={handleDeleteConsultant}
              />
            )}
          </>
        )}
      </main>

      {/* Modais */}
      {quoteModalCart && (
        <ClientQuoteModal
          cart={quoteModalCart}
          consultant={activeConsultant}
          client={data?.clients?.find(c => c.id === quoteModalCart.clientId)}
          onClose={() => setQuoteModalCart(null)}
        />
      )}

      {isConsolidatorOpen && (
        <ConsolidatorModal
          carts={data?.carts || []}
          consultant={activeConsultant}
          onClose={() => setIsConsolidatorOpen(false)}
          onExportOfficialCart={handleExportOfficialCart}
        />
      )}

      {isFlyerModalOpen && (
        <MarketingFlyerModal
          products={data?.products || []}
          consultant={activeConsultant}
          onClose={() => setIsFlyerModalOpen(false)}
        />
      )}

      {isLoyaltyModalOpen && (
        <LoyaltyManagerModal
          rewards={data?.rewards || []}
          clients={data?.clients || []}
          onAddReward={handleAddReward}
          onDeleteReward={handleDeleteReward}
          onClose={() => setIsLoyaltyModalOpen(false)}
        />
      )}

      {isKitsModalOpen && (
        <KitsManagerModal
          isOpen={isKitsModalOpen}
          onClose={() => setIsKitsModalOpen(false)}
          onAddKitToCart={handleAddKitToCart}
        />
      )}

      <SelfRegisterModal
        isOpen={isSelfRegisterOpen}
        googleUser={pendingGoogleUser}
        onSubmitRegistration={handleSelfRegistration}
        onClose={() => setIsSelfRegisterOpen(false)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(loggedUser) => {
          setCurrentUser(loggedUser);
          localStorage.setItem('mk_auth_user', JSON.stringify(loggedUser));
          showToast(`Bem-vinda(o), ${loggedUser.displayName || loggedUser.email}!`);
          handleUserLoginRedirect(loggedUser);
        }}
        onLogoutSuccess={async () => {
          localStorage.removeItem('mk_auth_user');
          setCurrentUser(null);
          await logoutUser();
          showToast('Sessão encerrada com sucesso!');
        }}
      />

      {/* Footer Elegante */}
      <footer className="bg-white border-t border-[#E899AC]/30 py-6 text-center text-xs text-gray-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-serif-mk font-semibold text-gray-900">
            Tailise • Consultora de Beleza Independente Mary Kay® (Itajaí e Região)
          </p>
          <p className="text-gray-400">
            Sistema com Sincronização e Multi-Carrinho • Código NW7527
          </p>
        </div>
      </footer>
    </div>
  );
}
