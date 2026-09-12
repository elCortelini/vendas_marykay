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
import defaultDb from '../server/data/db.json';
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
  const [currentUser, setCurrentUser] = useState(null);
  const [notification, setNotification] = useState(null);

  const isAdmin = isUserAdmin(currentUser);

  // Monitorar Autenticação do Google
  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setCurrentUser(user);
      if (user) {
        showToast(`Bem-vinda(o), ${user.displayName || user.email}!`);
        if (user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
          setActiveTab('admin');
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const setActiveTab = (tab) => {
    localStorage.setItem('mk_active_tab', tab);
    setActiveTabState(tab);
  };

  // Carregar dados da API ou do Banco de Dados em Nuvem (GitHub Pages)
  const fetchData = async () => {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.carts && json.carts.length > 0 && !activeCartId) {
          setActiveCartId(json.carts[0].id);
        }
        setLoading(false);
        return;
      }
    } catch (err) {
      console.log('Ambiente estático ou offline (GitHub Pages). Carregando banco de dados da nuvem.');
    }

    // Buscar dados atualizados do Banco em Nuvem em tempo real
    const cloudData = await fetchFromCloud();
    const loadedData = cloudData || defaultDb;

    setData(loadedData);
    if (loadedData.carts && loadedData.carts.length > 0 && !activeCartId) {
      setActiveCartId(loadedData.carts[0].id);
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

  // 1. Sincronizar catálogo Mary Kay
  const handleSyncCatalog = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/sync-mk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: '@Tata8282selena' })
      });
      const json = await res.json();
      showToast(json.message || 'Catálogo Mary Kay® sincronizado com sucesso!');
      await fetchData();
    } catch (err) {
      showToast('Erro ao sincronizar com o site Mary Kay.');
    } finally {
      setIsSyncing(false);
    }
  };

  // 2. Salvar / Editar Cliente
  const handleSaveClient = async (clientData) => {
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
      });
      if (res.ok) {
        showToast('Ficha da cliente salva com sucesso!');
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 3. Remover Cliente
  const handleDeleteClient = async (clientId) => {
    try {
      const res = await fetch(`/api/clients/${clientId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Cliente removida.');
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 4. Criar Carrinho para Cliente Específica
  const handleCreateCartForClient = async (client, customTitle) => {
    const newCart = {
      clientId: client.id,
      clientName: client.name,
      title: customTitle || `Carrinho - ${new Date().toLocaleDateString('pt-BR')}`,
      status: 'Em Aberto',
      discountPercent: data?.settings?.defaultDiscount || 0,
      shippingFee: 0,
      items: []
    };

    try {
      const res = await fetch('/api/carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCart)
      });
      if (res.ok) {
        const json = await res.json();
        showToast(`Novo carrinho criado para ${client.name}!`);
        await fetchData();
        setActiveCartId(json.cart.id);
        setActiveTab('carts');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 5. Salvar / Atualizar Carrinho
  const handleUpdateCart = async (cartData) => {
    try {
      // Manter rigorosamente o carrinho ativo selecionado
      setActiveCartId(cartData.id);

      // Atualização otimista no estado local
      setData(prev => ({
        ...prev,
        carts: prev.carts.map(c => c.id === cartData.id ? cartData : c)
      }));

      await fetch('/api/carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartData)
      });
    } catch (err) {
      console.error(err);
    }
  };

  // 6. Remover Carrinho
  const handleDeleteCart = async (cartId) => {
    try {
      const res = await fetch(`/api/carts/${cartId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Carrinho removido.');
        const updatedCarts = data.carts.filter(c => c.id !== cartId);
        await fetchData();
        if (updatedCarts.length > 0) setActiveCartId(updatedCarts[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 7. Atualizar foto do produto do catálogo
  const handleUpdateProductImage = async (productId, newImageUrl) => {
    try {
      const res = await fetch('/api/products/update-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, newImageUrl })
      });
      if (res.ok) {
        showToast('Foto do produto atualizada!');
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 8. Salvar Configurações
  const handleSaveSettings = async (settingsData) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsData)
      });
      if (res.ok) {
        showToast('Configurações salvas!');
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 9. Atualizar Preço e Custo do Produto
  const handleUpdateProductPricing = async (productId, price, costPrice) => {
    try {
      const res = await fetch('/api/products/update-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, price, costPrice })
      });
      if (res.ok) {
        showToast('Preços do produto atualizados!');
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 9.1. Cadastrar Novo Produto
  const handleAddProduct = async (productData) => {
    try {
      const res = await fetch('/api/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        showToast('Novo produto cadastrado no catálogo!');
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 9.2. Buscar Produto no Site Oficial Mary Kay por Código SKU
  const handleFetchProductBySku = async (sku) => {
    try {
      const res = await fetch('/api/products/fetch-by-sku', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku })
      });
      const json = await res.json();
      if (json.success) {
        showToast(json.message);
        await fetchData();
      } else {
        showToast(json.error || 'Produto não encontrado.');
      }
      return json;
    } catch (err) {
      console.error(err);
      showToast('Erro ao consultar site oficial da Mary Kay.');
    }
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

  // 17. Salvar Perfil / Cadastrar Vendedora
  const handleSaveConsultant = async (consultantData) => {
    try {
      const res = await fetch('/api/consultants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consultantData)
      });
      if (res.ok) {
        showToast('Perfil da vendedora salvo!');
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
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

  // 19. Deletar Vendedora
  const handleDeleteConsultant = async (consultantId) => {
    try {
      const res = await fetch(`/api/consultants/${consultantId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Vendedora removida.');
        await fetchData();
      }
    } catch (err) {
      console.error(err);
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
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#1A1A1A] text-white px-5 py-3 rounded-2xl shadow-xl border border-[#E899AC]/40 text-xs font-semibold animate-bounce">
          {notification}
        </div>
      )}

      <Header
        consultant={data?.consultant}
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
          await logoutUser();
          showToast('Sessão encerrada.');
        }}
        onOpenKitsModal={() => setIsKitsModalOpen(true)}
        onOpenLoyaltyModal={() => setIsLoyaltyModalOpen(true)}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'admin' && isAdmin && (
          <AdminControlPanel
            adminUser={currentUser}
            consultants={data?.consultants || [data?.consultant]}
            products={data?.products || []}
            carts={data?.carts || []}
            clients={data?.clients || []}
            onSaveConsultant={handleSaveConsultant}
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
          <ConsultantCalculator consultant={data?.consultant} />
        )}

        {activeTab === 'settings' && (
          <SettingsPanel
            consultant={data?.consultant}
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
      </main>

      {/* Modais */}
      {quoteModalCart && (
        <ClientQuoteModal
          cart={quoteModalCart}
          consultant={data?.consultant}
          client={data?.clients?.find(c => c.id === quoteModalCart.clientId)}
          onClose={() => setQuoteModalCart(null)}
        />
      )}

      {isConsolidatorOpen && (
        <ConsolidatorModal
          carts={data?.carts || []}
          consultant={data?.consultant}
          onClose={() => setIsConsolidatorOpen(false)}
          onExportOfficialCart={handleExportOfficialCart}
        />
      )}

      {isFlyerModalOpen && (
        <MarketingFlyerModal
          products={data?.products || []}
          consultant={data?.consultant}
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

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={() => showToast('Login com o Google realizado com sucesso!')}
        onLogoutSuccess={async () => {
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
