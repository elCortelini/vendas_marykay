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
  currentUser,
  isAdmin,
  onOpenLoginModal,
  onLogout
}) {
  return (
    <header className="bg-white border-b border-[#E899AC]/30 sticky top-0 z-40 shadow-sm">
      {/* Top Banner Elegante */}
      <div className={`${isAdmin ? 'bg-gradient-to-r from-gray-900 via-amber-700 to-gray-900 text-amber-300 font-bold' : 'mk-gold-gradient text-white'} text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2`}>
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>
          {isAdmin 
            ? "🛡️ MODO ADMINISTRADOR MASTER • Gestão Geral da Rede Mary Kay® (elcortelini@gmail.com)" 
            : `Atendimento Personalizado Mary Kay® • Consultora ${consultant?.name || "Tailise"} (${consultant?.region || "Itajaí e Região"})`}
        </span>
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Perfil Ativo (Administrador Master vs Vendedora) */}
          <div
            onClick={() => setActiveTab(isAdmin ? 'admin' : 'settings')}
            className="flex items-center gap-4 cursor-pointer group p-1.5 rounded-2xl hover:bg-[#F8E8E8]/50 transition-all"
            title={isAdmin ? "Clique para acessar a Área do Administrador Master" : "Clique para Editar Perfil da Vendedora"}
          >
            <div className="relative">
              <div className={`w-14 h-14 rounded-full p-0.5 ${isAdmin ? 'bg-amber-500' : 'mk-gold-gradient'} shadow-md transition-transform group-hover:scale-105`}>
                <img 
                  src={isAdmin ? (currentUser?.photoURL || "/images/tailise_avatar.png") : (consultant?.avatar || "/images/tailise_avatar.png")} 
                  alt={isAdmin ? "Administrador Master" : (consultant?.name || "Consultora Tailise")} 
                  className="w-full h-full object-cover rounded-full border-2 border-white"
                />
              </div>
              <span className={`absolute bottom-0 right-0 w-4 h-4 ${isAdmin ? 'bg-amber-400' : 'bg-emerald-500'} border-2 border-white rounded-full`} title="Status da Conta"></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-serif-mk text-gray-900 tracking-tight group-hover:text-[#B76E79] transition-colors">
                  {isAdmin ? "Administrador Master" : (consultant?.name || "Tailise")}
                </h1>
                {isAdmin ? (
                  <span className="bg-amber-500 text-gray-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow-sm border border-amber-600 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-gray-950" />
                    elcortelini@gmail.com
                  </span>
                ) : (
                  <span className="bg-[#F8E8E8] text-[#B76E79] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#E899AC]/40 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#B76E79]" />
                    Código {consultant?.code || "NW7527"}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 font-medium flex items-center gap-2 mt-0.5">
                <span>{isAdmin ? "Gestão de Vendedoras, Catálogo & Permissões da Rede" : (consultant?.title || "Consultora de Beleza Independente Mary Kay®")}</span>
                {!isAdmin && (
                  <>
                    <span className="inline-block w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="text-[#B76E79] flex items-center gap-0.5">
                      <MapPin className="w-3.5 h-3.5 inline" /> {consultant?.region || "Itajaí e região"}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Botões de Ação Rápida & Status de Login com Google */}
          <div className="flex items-center gap-2 flex-wrap md:flex-nowrap justify-end w-full md:w-auto">
            {currentUser ? (
              <div className="flex items-center gap-2 bg-[#FAF7F5] border border-gray-200 px-3 py-1.5 rounded-xl text-xs">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt={currentUser.displayName} className="w-6 h-6 rounded-full border" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#B76E79] text-white font-bold flex items-center justify-center text-[10px]">
                    {currentUser.email?.[0].toUpperCase()}
                  </div>
                )}
                <div className="text-left hidden sm:block">
                  <p className="font-bold text-gray-900 line-clamp-1">{currentUser.displayName || currentUser.email}</p>
                  <p className="text-[10px] text-gray-500 line-clamp-1">{currentUser.email}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="text-xs text-red-500 hover:underline font-semibold ml-1 cursor-pointer"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold px-3.5 py-2 rounded-xl border border-gray-300 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Entrar com o Google</span>
              </button>
            )}

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
          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-amber-500 text-gray-950 shadow-md font-black'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
              }`}
            >
              <span>🛡️ Área do Administrador</span>
            </button>
          )}

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
