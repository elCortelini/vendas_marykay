import React from 'react';
import { Sparkles, RefreshCw, ShoppingBag, Users, ShieldCheck, Heart, MapPin, Phone, Settings, BarChart3 } from 'lucide-react';

export default function Header({
  consultant,
  activeTab,
  setActiveTab,
  onSyncCatalog,
  isSyncing,
  cartsCount,
  clientsCount,
  onOpenKitsModal,
  onOpenLoyaltyModal,
  onOpenQuoteModal
}) {
  return (
    <header className="bg-white border-b border-[#E899AC]/30 sticky top-0 z-40 shadow-sm">
      {/* Top Banner Elegante */}
      <div className="mk-gold-gradient text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>Atendimento Personalizado Mary Kay® • Consultora Tailise (Itajaí e Região)</span>
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Perfil da Consultora Tailise */}
          <div
            onClick={() => setActiveTab('settings')}
            className="flex items-center gap-4 cursor-pointer group p-1.5 rounded-2xl hover:bg-[#F8E8E8]/50 transition-all"
            title="Clique para Cadastrar/Editar Vendedoras e Dados do Perfil"
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-full p-0.5 mk-gold-gradient shadow-md transition-transform group-hover:scale-105">
                <img 
                  src={consultant?.avatar || "/images/tailise_avatar.png"} 
                  alt="Consultora Tailise" 
                  className="w-full h-full object-cover rounded-full border-2 border-white"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="Online no Portal EmSintonia"></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-serif-mk text-gray-900 tracking-tight group-hover:text-[#B76E79] transition-colors">
                  {consultant?.name || "Tailise"}
                </h1>
                <span className="bg-[#F8E8E8] text-[#B76E79] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#E899AC]/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#B76E79]" />
                  Código {consultant?.code || "NW7527"}
                </span>
              </div>
              <p className="text-xs text-gray-600 font-medium flex items-center gap-2 mt-0.5">
                <span>{consultant?.title || "Consultora de Beleza Independente Mary Kay®"}</span>
                <span className="inline-block w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="text-[#B76E79] flex items-center gap-0.5">
                  <MapPin className="w-3 h-3 inline" /> {consultant?.region || "Itajaí e região"}
                </span>
              </p>
            </div>
          </div>

          {/* Botões de Ação Rápida */}
          <div className="flex items-center gap-2 flex-wrap md:flex-nowrap justify-end w-full md:w-auto">
            <button
              onClick={onSyncCatalog}
              disabled={isSyncing}
              className="mk-glass hover:bg-[#F8E8E8] text-[#B76E79] text-xs font-semibold px-3.5 py-2 rounded-xl border border-[#E899AC]/40 transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
              title="Sincronizar preços e produtos do site oficial Mary Kay"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar MK'}</span>
            </button>

            <a
              href="https://mk.marykayintouch.com.br/s/login/?language=pt_BR"
              target="_blank"
              rel="noreferrer"
              className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>EmSintonia</span>
            </a>
          </div>
        </div>

        {/* Abas de Navegação Principal (100% Visíveis Sem Rolagem Lateral) */}
        <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={() => setActiveTab('carts')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'carts'
                ? 'bg-[#E899AC] text-white shadow-md shadow-[#E899AC]/20 font-bold'
                : 'bg-gray-50 text-gray-700 hover:bg-[#F8E8E8]/60 hover:text-[#B76E79] border border-gray-100'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Carrinhos & Orçamentos</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === 'carts' ? 'bg-white/30 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              {cartsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#E899AC] text-white shadow-md shadow-[#E899AC]/20 font-bold'
                : 'bg-gray-50 text-gray-700 hover:bg-[#F8E8E8]/60 hover:text-[#B76E79] border border-gray-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>📊 Dashboard de Vendas</span>
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'clients'
                ? 'bg-[#E899AC] text-white shadow-md shadow-[#E899AC]/20 font-bold'
                : 'bg-gray-50 text-gray-700 hover:bg-[#F8E8E8]/60 hover:text-[#B76E79] border border-gray-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Clientes & Fichas</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === 'clients' ? 'bg-white/30 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              {clientsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-[#E899AC] text-white shadow-md shadow-[#E899AC]/20 font-bold'
                : 'bg-gray-50 text-gray-700 hover:bg-[#F8E8E8]/60 hover:text-[#B76E79] border border-gray-100'
            }`}
          >
            <span>📦 Controle de Estoque</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-[#E899AC] text-white shadow-md shadow-[#E899AC]/20 font-bold'
                : 'bg-gray-50 text-gray-700 hover:bg-[#F8E8E8]/60 hover:text-[#B76E79] border border-gray-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Catálogo Mary Kay®</span>
          </button>

          <button
            onClick={() => setActiveTab('kits')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'kits'
                ? 'bg-[#E899AC] text-white shadow-md shadow-[#E899AC]/20 font-bold'
                : 'bg-gray-50 text-gray-700 hover:bg-[#F8E8E8]/60 hover:text-[#B76E79] border border-gray-100'
            }`}
          >
            <span>🎁 Pacotes & Kits</span>
          </button>

          <button
            onClick={() => setActiveTab('loyalty')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'loyalty'
                ? 'bg-[#E899AC] text-white shadow-md shadow-[#E899AC]/20 font-bold'
                : 'bg-gray-50 text-gray-700 hover:bg-[#F8E8E8]/60 hover:text-[#B76E79] border border-gray-100'
            }`}
          >
            <span>💎 Fidelidade VIP</span>
          </button>

          <button
            onClick={() => setActiveTab('financial')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'financial'
                ? 'bg-[#E899AC] text-white shadow-md shadow-[#E899AC]/20 font-bold'
                : 'bg-gray-50 text-gray-700 hover:bg-[#F8E8E8]/60 hover:text-[#B76E79] border border-gray-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Financeiro & DRE</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-[#E899AC] text-white shadow-md shadow-[#E899AC]/20 font-bold'
                : 'bg-gray-50 text-gray-700 hover:bg-[#F8E8E8]/60 hover:text-[#B76E79] border border-gray-100'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Calculadora & Dicas</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#E899AC] text-white shadow-md shadow-[#E899AC]/20 font-bold'
                : 'bg-gray-50 text-gray-700 hover:bg-[#F8E8E8]/60 hover:text-[#B76E79] border border-gray-100'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>👩‍💼 Vendedoras & Configurações</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
