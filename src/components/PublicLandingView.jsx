import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  ShoppingBag, 
  Users, 
  Heart, 
  ArrowRight, 
  Lock, 
  FileText, 
  Package, 
  BarChart3, 
  Zap, 
  CheckCircle2, 
  Award, 
  DollarSign, 
  Gift 
} from 'lucide-react';

export default function PublicLandingView({ onOpenLoginModal }) {
  return (
    <div className="space-y-12 animate-fadeIn py-2">
      
      {/* Hero Banner de Luxo */}
      <div className="bg-gradient-to-r from-gray-900 via-[#2A1820] to-gray-900 text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden border border-[#E899AC]/30">
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#E899AC]/20 text-[#E899AC] border border-[#E899AC]/40 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 animate-pulse text-[#E899AC]" />
            <span>Exclusivo para Consultoras Independentes de Beleza</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif-mk leading-tight text-white">
            Gestor de Vendas <span className="text-[#E899AC] block sm:inline">Mary Kay®</span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-lg leading-relaxed max-w-2xl font-light">
            Aumente suas vendas, organize sua pronta-entrega e encante suas clientes com orçamentos de luxo personalizados, fichas de perfil e gestão financeira simplificada.
          </p>

          {/* Botões de Ação Principal */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={onOpenLoginModal}
              className="bg-white hover:bg-gray-100 text-gray-950 font-bold px-7 py-4 rounded-2xl shadow-2xl transition-all hover:scale-105 flex items-center gap-3 text-sm cursor-pointer group"
            >
              <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span className="text-base font-extrabold">Entrar com o Google</span>
            </button>

            <button
              onClick={onOpenLoginModal}
              className="mk-gold-gradient text-white font-bold px-7 py-4 rounded-2xl shadow-2xl transition-all hover:scale-105 flex items-center gap-2 text-sm cursor-pointer hover:opacity-95 border border-white/20"
            >
              <Sparkles className="w-5 h-5 text-amber-200" />
              <span className="text-base font-extrabold">Criar Conta de Consultora</span>
            </button>
          </div>

          <div className="pt-2 flex items-center gap-6 text-xs text-gray-400 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#E899AC]" /> Acesso Gratuito
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#E899AC]" /> Login via Google 1-Clique
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#E899AC]" /> Dados 100% Privados
            </span>
          </div>
        </div>

        {/* Efeito Visual Background */}
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#E899AC]/15 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Seção Por Que Escolher o Gestor de Vendas Mary Kay */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-mk text-gray-900">
            Tudo o que sua Consultoria precisa para Crescer
          </h2>
          <p className="text-sm text-gray-600">
            Desenvolvido especialmente para otimizar a rotina das Consultoras de Beleza Mary Kay®
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white p-7 rounded-3xl border border-[#E899AC]/30 shadow-sm space-y-4 hover:shadow-md hover:border-[#E899AC] transition-all">
            <div className="w-14 h-14 rounded-2xl bg-[#F8E8E8] text-[#B76E79] flex items-center justify-center font-bold">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold font-serif-mk text-gray-900">Orçamentos de Luxo em PDF & WhatsApp</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Monte propostas comerciais lindamente formatadas em segundos com fotos oficiais, cálculo automático de desconto e envio direto em 1-clique pelo WhatsApp da cliente.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-7 rounded-3xl border border-[#E899AC]/30 shadow-sm space-y-4 hover:shadow-md hover:border-[#E899AC] transition-all">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Package className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold font-serif-mk text-gray-900">Pronta-Entrega & Controle de Estoque</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Tenha controle total das unidades em mãos, histórico de entrada, produtos mais vendidos e alertas inteligentes para nunca deixar sua cliente sem o produto desejado.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-7 rounded-3xl border border-[#E899AC]/30 shadow-sm space-y-4 hover:shadow-md hover:border-[#E899AC] transition-all">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <BarChart3 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold font-serif-mk text-gray-900">Gestão Financeira & DRE 40%</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Visualização clara do seu lucro real (desconto de 40%), faturamento bruto, custos dos produtos e controle exato dos recebimentos via PIX, dinheiro ou cartão.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-7 rounded-3xl border border-[#E899AC]/30 shadow-sm space-y-4 hover:shadow-md hover:border-[#E899AC] transition-all">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold font-serif-mk text-gray-900">Fichas de Clientes & Tons de Base</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Cadastre tons de base TimeWise 3D, preferências da pele, histórico de compras anteriores, aniversários e acompanhamento de reposição da Regra 2/2/2.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-[#FAF7F5] p-7 rounded-3xl border border-[#E899AC]/40 shadow-sm space-y-4 hover:shadow-md transition-all">
            <div className="w-14 h-14 rounded-2xl bg-pink-100 text-[#B76E79] flex items-center justify-center font-bold">
              <Gift className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold font-serif-mk text-gray-900">Kits Promocionais & Clube VIP</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Crie combos promocionais de sucesso para datas comemorativas e recompense clientes fiéis com programa de pontos acumulativos e resgate de brindes.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-[#FAF7F5] p-7 rounded-3xl border border-[#E899AC]/40 shadow-sm space-y-4 hover:shadow-md transition-all">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold font-serif-mk text-gray-900">Sincronização com Catálogo Oficial</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Acesso a toda a linha Mary Kay® atualizada em tempo real (VTEX) com fotos HD, descrições oficiais, preços de tabela e códigos SKU de cada item.
            </p>
          </div>

        </div>
      </div>

      {/* Banner de Estatísticas e Vantagens */}
      <div className="bg-[#FAF7F5] border border-[#E899AC]/30 rounded-3xl p-8 sm:p-10 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold font-serif-mk text-[#B76E79]">100%</span>
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Focado em Mary Kay®</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold font-serif-mk text-[#B76E79]">40%</span>
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Cálculo de Margem Exata</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold font-serif-mk text-[#B76E79]">1-Clique</span>
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Envio para WhatsApp</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold font-serif-mk text-[#B76E79]">Google</span>
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Acesso Seguro & Rápido</p>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="bg-gradient-to-r from-[#2A1820] via-gray-900 to-[#2A1820] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl border border-[#E899AC]/40">
        <div className="max-w-2xl mx-auto space-y-3">
          <Sparkles className="w-8 h-8 text-[#E899AC] mx-auto animate-pulse" />
          <h2 className="text-2xl sm:text-4xl font-bold font-serif-mk">
            Pronta para Profissionalizar sua Gestão de Vendas?
          </h2>
          <p className="text-gray-300 text-sm sm:text-base">
            Faça login com sua conta do Google e comece a utilizar agora mesmo. Se for seu primeiro acesso, seu cadastro ficará salvo com total segurança.
          </p>
        </div>

        <div className="flex justify-center pt-2">
          <button
            onClick={onOpenLoginModal}
            className="bg-white hover:bg-gray-100 text-gray-950 font-extrabold px-8 py-4 rounded-2xl shadow-2xl transition-all hover:scale-105 flex items-center gap-3 text-base cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Acessar Gestor de Vendas Mary Kay®</span>
          </button>
        </div>
      </div>

    </div>
  );
}
