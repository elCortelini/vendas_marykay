import React, { useState } from 'react';
import { Calculator, DollarSign, Heart, Sparkles, TrendingUp, Gift, Award, HelpCircle } from 'lucide-react';

export default function ConsultantCalculator({ consultant }) {
  const [salePrice, setSalePrice] = useState(350);
  const [discountRate, setDiscountRate] = useState(40);
  const [extraExpenses, setExtraExpenses] = useState(15);

  const costPrice = salePrice * (1 - (discountRate / 100));
  const netProfit = salePrice - costPrice - extraExpenses;
  const profitMarginPercent = salePrice > 0 ? ((netProfit / salePrice) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Banner da Consultora */}
      <div className="bg-white p-6 rounded-2xl border border-[#E899AC]/30 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={consultant?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=MaryKay"}
            alt={`Consultora ${consultant?.name || "Mary Kay®"}`}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#E899AC] shadow-md"
          />
          <div>
            <h2 className="text-xl font-bold font-serif-mk text-gray-900">
              Painel de Gestão da Consultora {consultant?.name || "Mary Kay®"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Simulações financeiras, cálculo de retorno sobre vendas e estratégias de atendimento para {consultant?.region || "Itajaí e região"}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#FAF7F5] p-3 rounded-2xl border border-[#E899AC]/30">
          <Award className="w-8 h-8 text-[#B76E79]" />
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Nível de Desconto Ativo</span>
            <span className="text-sm font-bold text-gray-900 font-serif-mk">40% Desconto Oficial MK®</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Simulador Financeiro */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E899AC]/30 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-3 border-gray-100">
            <h3 className="text-base font-bold font-serif-mk text-gray-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#B76E79]" />
              <span>Simulador de Lucratividade por Venda</span>
            </h3>
            <span className="text-xs text-[#B76E79] font-semibold">Cálculo em Tempo Real</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Preço de Venda (R$)</label>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Faixa Desconto MK (%)</label>
              <select
                value={discountRate}
                onChange={(e) => setDiscountRate(parseFloat(e.target.value) || 40)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC] bg-white"
              >
                <option value="30">30% (Pedido Bronze)</option>
                <option value="35">35% (Pedido Prata)</option>
                <option value="40">40% (Pedido Ouro / Estrela)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Custos Extras / Embalagem (R$)</label>
              <input
                type="number"
                value={extraExpenses}
                onChange={(e) => setExtraExpenses(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC]"
              />
            </div>
          </div>

          {/* Cards de Resultado */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
              <span className="text-[10px] text-gray-400 font-bold block">Preço de Custo</span>
              <span className="text-base font-bold text-gray-800">R$ {costPrice.toFixed(2)}</span>
            </div>

            <div className="bg-[#F8E8E8] p-4 rounded-xl border border-[#E899AC]/40 text-center">
              <span className="text-[10px] text-[#B76E79] font-bold block">Lucro Líquido</span>
              <span className="text-lg font-bold text-[#B76E79]">R$ {netProfit.toFixed(2)}</span>
            </div>

            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-center">
              <span className="text-[10px] text-emerald-600 font-bold block">Margem Real</span>
              <span className="text-base font-bold text-emerald-700">{profitMarginPercent.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Dicas e Estratégias da Consultora */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E899AC]/30 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-serif-mk text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#B76E79]" />
            <span>Dicas para Alavancar Suas Vendas</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#FAF7F5] rounded-xl border border-[#E899AC]/30 space-y-1">
              <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-[#B76E79]" />
                <span>Kits Presenteáveis & Combos</span>
              </h4>
              <p className="text-gray-600 text-[11px]">
                Ofereça o Kit TimeWise 3D agrupado com a Base Matte para aumentar o valor médio por orçamento.
              </p>
            </div>

            <div className="p-3 bg-[#FAF7F5] rounded-xl border border-[#E899AC]/30 space-y-1">
              <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#B76E79]" />
                <span>Ciclo de Reposição de Cuidados</span>
              </h4>
              <p className="text-gray-600 text-[11px]">
                Entre em contato com suas clientes após 60 dias da compra para checar os resultados e oferecer reposição.
              </p>
            </div>

            <div className="p-3 bg-[#FAF7F5] rounded-xl border border-[#E899AC]/30 space-y-1">
              <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#B76E79]" />
                <span>Meta de Pedido Estrela</span>
              </h4>
              <p className="text-gray-600 text-[11px]">
                Consolide os carrinhos semanais para sempre atingir o patamar de 40% de desconto no site oficial EmSintonia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
