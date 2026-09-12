import React, { useState } from 'react';
import { Sparkles, ShieldCheck, ShoppingBag, Users, Heart, ArrowRight, Search, CheckCircle2, Lock } from 'lucide-react';

export default function PublicLandingView({ onOpenLoginModal, products = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const categories = ['Todas', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'Todas' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Hero Banner de Luxo */}
      <div className="bg-gradient-to-r from-gray-900 via-[#2A1820] to-gray-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-[#E899AC]/30">
        <div className="max-w-3xl space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#E899AC]/20 text-[#E899AC] border border-[#E899AC]/40 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 animate-pulse text-[#E899AC]" />
            <span>Plataforma Oficial da Rede de Consultoras</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-serif-mk leading-tight text-white">
            Atendimento & Gestão de Vendas <span className="text-[#E899AC]">Mary Kay®</span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Consulte o catálogo oficial de produtos, acesse seu painel de vendas, monte orçamentos personalizados em PDF/WhatsApp e gerencie sua pronta-entrega com máxima sofisticação.
          </p>

          {/* Botões de Ação Principal */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={onOpenLoginModal}
              className="bg-white hover:bg-gray-100 text-gray-950 font-bold px-6 py-3.5 rounded-2xl shadow-xl transition-all flex items-center gap-3 text-sm cursor-pointer group"
            >
              <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>🔑 Entrar com o Google</span>
            </button>

            <button
              onClick={onOpenLoginModal}
              className="mk-gold-gradient text-white font-bold px-6 py-3.5 rounded-2xl shadow-xl transition-all flex items-center gap-2 text-sm cursor-pointer hover:opacity-95 border border-white/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>✨ Cadastrar-se como Consultora</span>
            </button>
          </div>
        </div>

        {/* Efeito Visual Background */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#E899AC]/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Cards de Recursos do Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-[#E899AC]/30 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F8E8E8] text-[#B76E79] flex items-center justify-center font-bold">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold font-serif-mk text-gray-900">Catálogo Oficial & Preços</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Consulte todo o portfólio oficial de cuidados com a pele, maquiagem e fragrâncias Mary Kay® com fotos em alta definição.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E899AC]/30 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold font-serif-mk text-gray-900">Orçamentos de Luxo</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Monte sacolas e orçamentos para suas clientes com envio rápido via WhatsApp ou download formatado em PDF.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E899AC]/30 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold font-serif-mk text-gray-900">Área Restrita & Segura</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            As fichas de clientes, carrinhos ativos e faturamento ficam restritos e visíveis apenas após o login da consultora responsável.
          </p>
        </div>
      </div>

      {/* Seção de Consulta Pública do Catálogo */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E899AC]/30 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <h2 className="text-xl font-bold font-serif-mk text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#B76E79]" />
              <span>Catálogo Geral de Produtos Mary Kay®</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Explore o portfólio completo com preços e descrições dos produtos.
            </p>
          </div>

          <button
            onClick={onOpenLoginModal}
            className="bg-[#FAF7F5] hover:bg-[#F8E8E8] text-[#B76E79] border border-[#E899AC]/40 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Faça Login para Criar Carrinhos</span>
          </button>
        </div>

        {/* Busca e Filtros */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar produto por nome ou código SKU..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC] outline-none"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-64 px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC] outline-none font-semibold text-gray-700"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
          {filteredProducts.slice(0, 16).map(product => (
            <div 
              key={product.id}
              className="bg-[#FAF7F5] border border-gray-100 rounded-2xl p-4 flex flex-col justify-between hover:border-[#E899AC] transition-all shadow-sm group"
            >
              <div className="space-y-3">
                <div className="w-full h-40 rounded-xl bg-white overflow-hidden p-2 flex items-center justify-center">
                  <img
                    src={product.image || "https://images.unsplash.com/photo-1556228722-d0499e74d15f?auto=format&fit=crop&w=400&q=80"}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-mono block">SKU: {product.sku}</span>
                  <h4 className="font-bold text-gray-900 text-xs line-clamp-2 mt-0.5">{product.name}</h4>
                  <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">{product.description}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 mt-3 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-gray-400 font-semibold block">Preço de Tabela</span>
                  <span className="text-sm font-black text-[#B76E79]">R$ {product.price?.toFixed(2)}</span>
                </div>

                <button
                  onClick={onOpenLoginModal}
                  className="bg-white hover:bg-gray-100 text-gray-800 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-[#B76E79]" />
                  <span>Logar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
