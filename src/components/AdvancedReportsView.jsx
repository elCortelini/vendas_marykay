import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Package, Award, ArrowUpRight, DollarSign, Calendar, Download, Printer, AlertTriangle, Sparkles, ShoppingBag, CheckCircle2, ChevronRight } from 'lucide-react';

export default function AdvancedReportsView({ products = [], clients = [], carts = [], payments = [] }) {
  const [periodFilter, setPeriodFilter] = useState('all'); // 'all', 'month', 'quarter', 'year'

  // Helper para filtrar carrinhos por período
  const getFilteredCarts = () => {
    if (!carts) return [];
    if (periodFilter === 'all') return carts;

    const now = new Date();
    return carts.filter(cart => {
      const cartDate = cart.createdAt ? new Date(cart.createdAt) : now;
      const diffDays = (now - cartDate) / (1000 * 60 * 60 * 24);
      if (periodFilter === 'month') return diffDays <= 30;
      if (periodFilter === 'quarter') return diffDays <= 90;
      if (periodFilter === 'year') return diffDays <= 365;
      return true;
    });
  };

  const activeCarts = getFilteredCarts();

  // 1. CURVA ABC DE PRODUTOS (Agregação por item vendido)
  const productSalesMap = {};

  activeCarts.forEach(cart => {
    (cart.items || []).forEach(item => {
      const key = item.productId || item.sku || item.name;
      if (!productSalesMap[key]) {
        productSalesMap[key] = {
          id: item.productId,
          sku: item.sku || 'N/A',
          name: item.name,
          image: item.image,
          unitsSold: 0,
          totalRevenue: 0,
          totalCost: 0,
          totalProfit: 0
        };
      }
      const qty = item.quantity || 1;
      const price = item.price || 0;
      const cost = item.costPrice || (price * 0.6);

      productSalesMap[key].unitsSold += qty;
      productSalesMap[key].totalRevenue += (price * qty);
      productSalesMap[key].totalCost += (cost * qty);
      productSalesMap[key].totalProfit += ((price - cost) * qty);
    });
  });

  const productSalesList = Object.values(productSalesMap).sort((a, b) => b.totalRevenue - a.totalRevenue);
  const totalRevenueSum = productSalesList.reduce((sum, p) => sum + p.totalRevenue, 0);

  // Atribuir Classe ABC (A = até 70% do acumulado, B = até 90%, C = restante)
  let accumRevenue = 0;
  const abcProducts = productSalesList.map(p => {
    accumRevenue += p.totalRevenue;
    const accumPercent = totalRevenueSum > 0 ? (accumRevenue / totalRevenueSum) * 100 : 0;
    let abcClass = 'C';
    if (accumPercent <= 70) abcClass = 'A';
    else if (accumPercent <= 90) abcClass = 'B';
    return { ...p, accumPercent, abcClass };
  });

  // 2. RANKING DE TOP CLIENTES VIP (Curva ABC de Clientes)
  const sortedClients = [...clients].sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0));
  const totalClientSpendSum = sortedClients.reduce((sum, c) => sum + (c.totalSpent || 0), 0);

  let accumClientSpend = 0;
  const abcClients = sortedClients.map(c => {
    accumClientSpend += (c.totalSpent || 0);
    const accumPercent = totalClientSpendSum > 0 ? (accumClientSpend / totalClientSpendSum) * 100 : 0;
    let rankTier = 'VIP Prata';
    if (accumPercent <= 60) rankTier = 'VIP Diamante';
    else if (accumPercent <= 85) rankTier = 'VIP Ouro';
    return { ...c, rankTier };
  });

  // 3. ENVELHECIMENTO DE ESTOQUE (Produtos Parados > 60 dias)
  const now = new Date().getTime();
  const stockAgeList = products.map(p => {
    const entryDate = p.stockEntryDate ? new Date(p.stockEntryDate).getTime() : (now - (30 * 24 * 60 * 60 * 1000));
    const daysInStock = Math.floor((now - entryDate) / (1000 * 60 * 60 * 24));
    const stockCount = p.stockCount || 0;
    return {
      ...p,
      daysInStock,
      stockValue: stockCount * (p.price || 0),
      costValue: stockCount * (p.costPrice || (p.price * 0.6))
    };
  });

  const agedStockOver60 = stockAgeList.filter(p => p.daysInStock > 60 && (p.stockCount || 0) > 0);
  const totalAgedValue = agedStockOver60.reduce((sum, p) => sum + p.stockValue, 0);

  // 4. INDICADORES CHAVE (KPIs)
  const totalCartsCount = activeCarts.length;
  const totalItemsSoldUnits = productSalesList.reduce((sum, p) => sum + p.unitsSold, 0);
  const totalGrossProfit = productSalesList.reduce((sum, p) => sum + p.totalProfit, 0);
  const ticketMedioCarrinho = totalCartsCount > 0 ? totalRevenueSum / totalCartsCount : 0;
  const ticketMedioCliente = clients.length > 0 ? totalRevenueSum / clients.length : 0;

  // Handler de Impressão / Salvar PDF
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Relatório Avançado */}
      <div className="bg-white p-6 rounded-3xl border border-[#E899AC]/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl mk-gold-gradient text-white flex items-center justify-center shadow-md shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif-mk text-xl font-bold text-gray-900 flex items-center gap-2">
              <span>Relatórios Avançados & Curva ABC</span>
              <span className="bg-[#1A1A1A] text-[#E899AC] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                Análise Estratégica
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Análise de Curva ABC de produtos, ranking de Clientes VIP, giro de estoque e métricas de desempenho.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Filtro de Período */}
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:ring-2 focus:ring-[#E899AC]"
          >
            <option value="all">📅 Todo o Período</option>
            <option value="month">📅 Últimos 30 Dias</option>
            <option value="quarter">📅 Últimos 90 Dias</option>
            <option value="year">📅 Este Ano</option>
          </select>

          <button
            onClick={handlePrintReport}
            className="bg-[#1A1A1A] hover:bg-black text-[#E899AC] text-xs font-bold px-4 py-2.5 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 border border-[#E899AC]/30"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Gerar PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Cards de Performance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E899AC]/30 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Faturamento Acumulado</span>
          <div className="text-2xl font-black text-gray-900 font-serif-mk">R$ {totalRevenueSum.toFixed(2)}</div>
          <span className="text-[10px] text-emerald-600 font-bold">{totalItemsSoldUnits} unidades vendidas</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E899AC]/30 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Lucro Bruto Total</span>
          <div className="text-2xl font-black text-[#B76E79] font-serif-mk">R$ {totalGrossProfit.toFixed(2)}</div>
          <span className="text-[10px] text-gray-500 font-medium">Desconto Médio MK 40%</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E899AC]/30 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Ticket Médio por Carrinho</span>
          <div className="text-2xl font-black text-gray-800 font-serif-mk">R$ {ticketMedioCarrinho.toFixed(2)}</div>
          <span className="text-[10px] text-gray-500">{totalCartsCount} pedidos finalizados</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E899AC]/30 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Ticket Médio por Cliente</span>
          <div className="text-2xl font-black text-emerald-700 font-serif-mk">R$ {ticketMedioCliente.toFixed(2)}</div>
          <span className="text-[10px] text-gray-500">{clients.length} clientes cadastradas</span>
        </div>
      </div>

      {/* Grid de Relatórios Detalhados */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* 1. RELATÓRIO CURVA ABC DE PRODUTOS */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#E899AC]/30 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
            <h3 className="font-serif-mk text-base font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#B76E79]" />
              <span>Curva ABC de Produtos (Mais Vendidos & Lucrativos)</span>
            </h3>
            <span className="text-[10px] text-gray-500 font-medium">
              Classe A (70% faturamento) • Classe B (20%) • Classe C (10%)
            </span>
          </div>

          {abcProducts.length === 0 ? (
            <div className="text-center py-10 text-xs text-gray-400 border border-dashed rounded-2xl">
              Nenhuma venda registrada no período selecionado. Adicione produtos aos carrinhos das clientes!
            </div>
          ) : (
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {abcProducts.map(p => {
                const abcColor = p.abcClass === 'A' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                                 p.abcClass === 'B' ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-gray-100 text-gray-700 border-gray-300';
                return (
                  <div key={p.id} className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between gap-3 text-xs hover:bg-[#FAF7F5] transition-all">
                    <div className="flex items-center gap-3">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-11 h-11 object-cover rounded-xl border border-gray-200 shrink-0" />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-gray-200 flex items-center justify-center font-bold text-gray-500 text-xs shrink-0">
                          MK
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${abcColor}`}>
                            CLASSE {p.abcClass}
                          </span>
                          <span className="text-[10px] font-mono text-gray-400">SKU: {p.sku}</span>
                        </div>
                        <h4 className="font-bold text-gray-900 line-clamp-1 mt-0.5">{p.name}</h4>
                        <span className="text-[10px] text-gray-500 font-medium">
                          {p.unitsSold} un. vendidas • Lucro: R$ {p.totalProfit.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-black text-gray-900 text-sm">R$ {p.totalRevenue.toFixed(2)}</div>
                      <span className="text-[10px] text-gray-400 block font-mono">
                        {totalRevenueSum > 0 ? ((p.totalRevenue / totalRevenueSum) * 100).toFixed(1) : 0}% do total
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. RANKING DE CLIENTES VIP (TOP COMPRADORAS) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#E899AC]/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-serif-mk text-base font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Ranking de Clientes VIP (Top Compradoras)</span>
            </h3>
          </div>

          {abcClients.length === 0 ? (
            <div className="text-center py-10 text-xs text-gray-400 border border-dashed rounded-2xl">
              Nenhuma cliente cadastrada ainda.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {abcClients.map((c, index) => {
                const tierColor = c.rankTier === 'VIP Diamante' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                                 c.rankTier === 'VIP Ouro' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'bg-gray-100 text-gray-700 border-gray-300';
                
                const points = c.loyaltyPoints !== undefined ? c.loyaltyPoints : Math.floor(c.totalSpent || 0);

                return (
                  <div key={c.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-[#E899AC] font-black text-xs flex items-center justify-center shrink-0">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9px] font-bold px-2 py-0.2 rounded-full border ${tierColor}`}>
                            {c.rankTier}
                          </span>
                          <span className="text-[10px] text-gray-400">{points} pts</span>
                        </div>
                        <h4 className="font-bold text-gray-900 mt-0.5">{c.name}</h4>
                        <span className="text-[10px] text-gray-500">{c.phone || 'Sem telefone'}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-black text-[#B76E79] text-xs">R$ {(c.totalSpent || 0).toFixed(2)}</div>
                      <span className="text-[9px] text-gray-400 block">Total Comprado</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* 3. ALERTA DE GIRO E ENVELHECIMENTO DE ESTOQUE (PRODUTOS PARADOS > 60 DIAS) */}
      <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-serif-mk text-base font-bold text-gray-900">
              Análise de Giro de Estoque & Produtos Parados (&gt; 60 dias)
            </h3>
          </div>

          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-300">
            R$ {totalAgedValue.toFixed(2)} retidos em produtos parados
          </span>
        </div>

        <p className="text-xs text-gray-500">
          Estes produtos estão em estoque há mais de 60 dias. Monte **Kits Promocionais** ou incline-os em **Panfletos** para acelerar o giro!
        </p>

        {agedStockOver60.length === 0 ? (
          <div className="text-center py-6 text-xs text-emerald-700 bg-emerald-50 rounded-2xl border border-emerald-200 font-bold">
            🎉 Parabéns! Você não possui produtos parados há mais de 60 dias no estoque físico!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {agedStockOver60.map(p => (
              <div key={p.id} className="p-3 bg-amber-50/50 rounded-2xl border border-amber-200 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-amber-200" />
                  <div>
                    <h5 className="font-bold text-gray-900 line-clamp-1">{p.name}</h5>
                    <span className="text-[10px] text-amber-800 font-semibold">{p.daysInStock} dias em estoque</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="bg-amber-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full block">
                    {p.stockCount} un.
                  </span>
                  <span className="text-[10px] font-bold text-gray-700 block mt-0.5">R$ {p.stockValue.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
