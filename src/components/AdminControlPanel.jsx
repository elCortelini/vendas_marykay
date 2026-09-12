import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  DollarSign, 
  Package, 
  Plus, 
  Settings, 
  CheckCircle2, 
  AlertCircle, 
  UserPlus, 
  Eye, 
  Trash2, 
  Sparkles, 
  Key, 
  Lock, 
  Unlock,
  RefreshCw,
  TrendingUp
} from 'lucide-react';

export default function AdminControlPanel({ 
  adminUser, 
  consultants = [], 
  products = [], 
  carts = [], 
  clients = [],
  onSaveConsultant,
  onDeleteConsultant,
  onSelectConsultantToInspect,
  onUpdateGlobalSettings,
  onSyncCatalog
}) {
  const [activeSubTab, setActiveSubTab] = useState('sellers'); // 'sellers', 'settings', 'logs'
  const [isAddConsultantModalOpen, setIsAddConsultantModalOpen] = useState(false);
  const [newConsultantForm, setNewConsultantForm] = useState({
    name: '',
    email: '',
    code: '',
    title: 'Consultora de Beleza Independente Mary Kay®',
    region: 'Itajaí e Região',
    phone: '',
    pixKey: ''
  });

  // Métricas Globais da Rede de Vendedoras
  let totalNetworkRevenue = 0;
  carts.forEach(cart => {
    (cart.items || []).forEach(item => {
      totalNetworkRevenue += ((item.price || 0) * (item.quantity || 1));
    });
  });

  const handleCreateConsultant = (e) => {
    e.preventDefault();
    if (!newConsultantForm.name || !newConsultantForm.email) return;

    if (onSaveConsultant) {
      onSaveConsultant({
        ...newConsultantForm,
        id: `consultant-${Date.now()}`,
        active: true,
        createdAt: new Date().toISOString()
      });
    }

    setIsAddConsultantModalOpen(false);
    setNewConsultantForm({
      name: '',
      email: '',
      code: '',
      title: 'Consultora de Beleza Independente Mary Kay®',
      region: 'Itajaí e Região',
      phone: '',
      pixKey: ''
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho do Administrador Master */}
      <div className="bg-gray-900 text-white p-6 rounded-3xl shadow-xl border border-amber-500/30 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-gray-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Painel Administrativo Master
              </span>
              <span className="text-xs text-amber-300 font-medium">Acesso Restrito</span>
            </div>
            <h2 className="text-2xl font-bold font-serif-mk text-white mt-2 flex items-center gap-2">
              <span>Gestão Central do Sistema Mary Kay®</span>
            </h2>
            <p className="text-xs text-gray-300 mt-1 flex items-center gap-2">
              <span>Administrador Conectado: <strong className="text-amber-300">{adminUser?.email || "elcortelini@gmail.com"}</strong></span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddConsultantModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Nova Vendedora</span>
            </button>
          </div>
        </div>

        {/* Glow Decorativo */}
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Cards de Métricas Globais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Total de Vendedoras</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">{consultants.length}</div>
          <p className="text-[10px] text-gray-400">Áreas de vendas ativas</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Faturamento Global da Rede</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">R$ {totalNetworkRevenue.toFixed(2)}</div>
          <p className="text-[10px] text-gray-400">Soma de todas as vendedoras</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Catálogo Geral de Produtos</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">{products.length}</div>
          <p className="text-[10px] text-gray-400">Itens cadastrados no sistema</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Total de Clientes no Sistema</span>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">{clients.length}</div>
          <p className="text-[10px] text-gray-400">Fichas de clientes cadastradas</p>
        </div>

      </div>

      {/* Sub-abas de Navegação Administrativa */}
      <div className="flex border-b border-gray-200 bg-white p-2 rounded-2xl shadow-sm space-x-2">
        <button
          onClick={() => setActiveSubTab('sellers')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'sellers'
              ? 'bg-gray-900 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>👩‍💼 Gerenciar Vendedoras ({consultants.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('settings')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'settings'
              ? 'bg-gray-900 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>⚙️ Configurações Globais & Catálogo</span>
        </button>
      </div>

      {/* Conteúdo Sub-aba 1: Gerenciar Vendedoras */}
      {activeSubTab === 'sellers' && (
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-serif-mk text-lg font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-600" />
                <span>Lista de Vendedoras & Acesso às Áreas de Vendas</span>
              </h3>
              <p className="text-xs text-gray-500">
                Cada vendedora possui sua própria área de vendas isolada. Como administrador, você pode inspecionar e gerenciar qualquer vendedora.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {consultants.map(c => (
              <div 
                key={c.id}
                className="bg-[#FAF7F5] border border-gray-200 rounded-2xl p-5 space-y-4 hover:border-amber-400 transition-all shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={c.avatar || "/images/tailise_avatar.png"} 
                      alt={c.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-sm"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                        <span>{c.name}</span>
                        {c.email === 'elcortelini@gmail.com' && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                            Admin
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-gray-500">{c.email || "Sem e-mail cadastrado"}</p>
                      <span className="text-[10px] text-amber-700 font-semibold">Código MK: {c.code || "N/A"}</span>
                    </div>
                  </div>

                  <div className="text-xs space-y-1 bg-white p-3 rounded-xl border border-gray-100">
                    <p className="text-gray-600"><strong>Título:</strong> {c.title || "Consultora Mary Kay®"}</p>
                    <p className="text-gray-600"><strong>Região:</strong> {c.region || "Itajaí e Região"}</p>
                    <p className="text-gray-600"><strong>Chave PIX:</strong> {c.pixKey || "Não cadastrada"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                  <button
                    onClick={() => onSelectConsultantToInspect && onSelectConsultantToInspect(c.id)}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Acessar Área de Vendas desta vendedora"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>Entrar na Área</span>
                  </button>

                  {c.email !== 'elcortelini@gmail.com' && (
                    <button
                      onClick={() => onDeleteConsultant && onDeleteConsultant(c.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                      title="Excluir Vendedora"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conteúdo Sub-aba 2: Configurações Globais */}
      {activeSubTab === 'settings' && (
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div className="border-b pb-3">
            <h3 className="font-serif-mk text-lg font-bold text-gray-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-amber-600" />
              <span>Configurações Máster do Sistema</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Defina regras de faturamento, margem padrão e mantenha o catálogo atualizado para todas as vendedoras.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#FAF7F5] p-5 rounded-2xl border space-y-3">
              <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-amber-600" />
                <span>Sincronização de Catálogo Oficial Mary Kay®</span>
              </h4>
              <p className="text-xs text-gray-600">
                Sincronize automaticamente novos lançamentos, códigos de SKU e preços atualizados direto do site oficial Mary Kay®.
              </p>
              <button
                onClick={onSyncCatalog}
                className="bg-amber-500 hover:bg-amber-400 text-gray-950 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Sincronizar Catálogo Geral Agora</span>
              </button>
            </div>

            <div className="bg-[#FAF7F5] p-5 rounded-2xl border space-y-3">
              <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600" />
                <span>Nível de Acesso & Segurança</span>
              </h4>
              <p className="text-xs text-gray-600">
                O administrador master registrado é <strong>elcortelini@gmail.com</strong>. Apenas esta conta pode acessar esta tela administrativa.
              </p>
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Proteção de Administrador Ativa</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Cadastrar Nova Vendedora */}
      {isAddConsultantModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateConsultant} className="bg-white w-full max-w-lg p-6 rounded-3xl shadow-2xl space-y-4 border border-amber-500/40">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif-mk text-lg font-bold text-gray-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-600" />
                <span>Cadastrar Nova Vendedora no Sistema</span>
              </h3>
              <button type="button" onClick={() => setIsAddConsultantModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Tailise Santos"
                  value={newConsultantForm.name}
                  onChange={(e) => setNewConsultantForm({ ...newConsultantForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">E-mail do Google *</label>
                <input
                  type="email"
                  required
                  placeholder="vendedora@gmail.com"
                  value={newConsultantForm.email}
                  onChange={(e) => setNewConsultantForm({ ...newConsultantForm, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Código de Consultora MK</label>
                <input
                  type="text"
                  placeholder="Ex: NW7527"
                  value={newConsultantForm.code}
                  onChange={(e) => setNewConsultantForm({ ...newConsultantForm, code: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Telefone / WhatsApp</label>
                <input
                  type="text"
                  placeholder="(47) 99999-8888"
                  value={newConsultantForm.phone}
                  onChange={(e) => setNewConsultantForm({ ...newConsultantForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Região de Atendimento</label>
                <input
                  type="text"
                  placeholder="Ex: Itajaí e Região"
                  value={newConsultantForm.region}
                  onChange={(e) => setNewConsultantForm({ ...newConsultantForm, region: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Chave PIX</label>
                <input
                  type="text"
                  placeholder="Chave PIX da vendedora"
                  value={newConsultantForm.pixKey}
                  onChange={(e) => setNewConsultantForm({ ...newConsultantForm, pixKey: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setIsAddConsultantModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-gray-950 text-xs font-bold px-5 py-2 rounded-xl shadow-md cursor-pointer"
              >
                Salvar Vendedora
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
