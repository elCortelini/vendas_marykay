import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  Award, 
  Calendar, 
  Printer, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  Star, 
  Zap, 
  PieChart, 
  Layers,
  Percent,
  TrendingDown
} from 'lucide-react';

export default function SalesDashboardView({ products = [], clients = [], carts = [], payments = [] }) {
  const [periodFilter, setPeriodFilter] = useState('all'); // 'all', 'month', '30days', '7days'
  const [categoryFilter, setCategoryFilter] = useState('all');

  // 1. Filtragem por período
  const getFilteredCarts = () => {
    if (!carts) return [];
    const now = new Date();

    return carts.filter(cart => {
      if (!cart.items || cart.items.length === 0) return false;
      if (periodFilter === 'all') return true;

      const cartDate = cart.createdAt ? new Date(cart.createdAt) : now;
      const diffDays = (now - cartDate) / (1000 * 60 * 60 * 24);

      if (periodFilter === '7days') return diffDays <= 7;
      if (periodFilter === '30days') return diffDays <= 30;
      if (periodFilter === 'month') {
        return cartDate.getMonth() === now.getMonth() && cartDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const activeCarts = getFilteredCarts();

  // 2. Cálculos de Vendas Gerais & Lucro
  let totalRevenue = 0;
  let totalCost = 0;
  let totalItemsSold = 0;
  let totalShippingFees = 0;
  let totalPackagingCosts = 0;

  activeCarts.forEach(cart => {
    (cart.items || []).forEach(item => {
      const qty = item.quantity || 1;
      const price = item.price || 0;
      const cost = item.costPrice || (price * 0.6); // Margem padrão consultora (40% de desconto)

      totalRevenue += price * qty;
      totalCost += cost * qty;
      totalItemsSold += qty;
    });

    totalShippingFees += cart.shippingFee || 0;
    totalPackagingCosts += 5; // Custo médio de embalagem presente/sacola
  });

  const grossProfit = totalRevenue - totalCost;
  const netProfit = grossProfit - totalShippingFees - totalPackagingCosts;
  const profitMarginPercent = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;
  const averageTicket = activeCarts.length > 0 ? (totalRevenue / activeCarts.length).toFixed(2) : 0;

  // 3. Ranking de Produtos Mais Vendidos
  const productSalesMap = {};

  activeCarts.forEach(cart => {
    (cart.items || []).forEach(item => {
      const key = item.productId || item.sku || item.name;
      if (!productSalesMap[key]) {
        // Buscar categoria no catálogo original se disponível
        const catalogProd = products.find(p => p.id === item.productId || p.sku === item.sku);
        const category = catalogProd?.category || 'Geral';

        productSalesMap[key] = {
          id: item.productId,
          sku: item.sku || 'SKU-N/A',
          name: item.name,
          image: item.image || catalogProd?.image || 'https://via.placeholder.com/150',
          category,
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
      productSalesMap[key].totalRevenue += price * qty;
      productSalesMap[key].totalCost += cost * qty;
      productSalesMap[key].totalProfit += (price - cost) * qty;
    });
  });

  let topSellingProducts = Object.values(productSalesMap).sort((a, b) => b.totalRevenue - a.totalRevenue);

  if (categoryFilter !== 'all') {
    topSellingProducts = topSellingProducts.filter(p => p.category.toLowerCase().includes(categoryFilter.toLowerCase()));
  }

  const maxRevenueProduct = topSellingProducts[0]?.totalRevenue || 1;

  // 4. Desempenho de Vendas por Categoria
  const categorySalesMap = {};
  Object.values(productSalesMap).forEach(prod => {
    const cat = prod.category || 'Outros';
    if (!categorySalesMap[cat]) {
      categorySalesMap[cat] = {
        name: cat,
        revenue: 0,
        units: 0,
        profit: 0
      };
    }
    categorySalesMap[cat].revenue += prod.totalRevenue;
    categorySalesMap[cat].units += prod.unitsSold;
    categorySalesMap[cat].profit += prod.totalProfit;
  });

  const categorySalesList = Object.values(categorySalesMap).sort((a, b) => b.revenue - a.revenue);

  // 5. Ranking das Clientes que Mais Compraram
  const clientPurchasesMap = {};
  activeCarts.forEach(cart => {
    const cId = cart.clientId || cart.clientName;
    if (!clientPurchasesMap[cId]) {
      clientPurchasesMap[cId] = {
        id: cart.clientId,
        name: cart.clientName || 'Cliente Diversas',
        ordersCount: 0,
        totalSpent: 0,
        itemsCount: 0
      };
    }
    clientPurchasesMap[cId].ordersCount += 1;
    clientPurchasesMap[cId].itemsCount += (cart.items || []).reduce((acc, i) => acc + (i.quantity || 1), 0);
    clientPurchasesMap[cId].totalSpent += (cart.items || []).reduce((acc, i) => acc + ((i.price || 0) * (i.quantity || 1)), 0);
  });

  const topClientsList = Object.values(clientPurchasesMap).sort((a, b) => b.totalSpent - a.totalSpent);

  // 6. Impressão / Exportar PDF
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho da Página Específica do Dashboard */}
      <div className="bg-white p-6 rounded-3xl border border-[#E899AC]/30 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#F8E8E8] text-[#B76E79] text-xs font-bold px-3 py-1 rounded-full border border-[#E899AC]/40 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" />
              Painel de Inteligência de Negócio
            </span>
          </div>
          <h2 className="text-2xl font-bold font-serif-mk text-gray-900 mt-2 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-[#B76E79]" />
            <span>Dashboard de Vendas & Lucratividade</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Relatórios em tempo real do desempenho financeiro, produtos mais vendidos, lucratividade e hábitos das clientes Mary Kay®.
          </p>
        </div>

        {/* Controles: Filtro de Período & Botão de Impressão */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-[#FAF7F5] border border-gray-200 rounded-xl p-1 text-xs font-semibold">
            <button
              onClick={() => setPeriodFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                periodFilter === 'all' ? 'bg-[#B76E79] text-white shadow-sm font-bold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Todos os Tempos
            </button>
            <button
              onClick={() => setPeriodFilter('month')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                periodFilter === 'month' ? 'bg-[#B76E79] text-white shadow-sm font-bold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Este Mês
            </button>
            <button
              onClick={() => setPeriodFilter('30days')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                periodFilter === '30days' ? 'bg-[#B76E79] text-white shadow-sm font-bold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Últimos 30 dias
            </button>
            <button
              onClick={() => setPeriodFilter('7days')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                periodFilter === '7days' ? 'bg-[#B76E79] text-white shadow-sm font-bold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              7 dias
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="mk-gold-gradient text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer print:hidden"
            title="Imprimir ou Salvar Dashboard em PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>

      {/* Cards de Métricas Principais (KPIs Executivos) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Faturamento Bruto */}
        <div className="bg-white p-5 rounded-2xl border border-[#E899AC]/30 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Faturamento Bruto</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">
            R$ {totalRevenue.toFixed(2)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{activeCarts.length} pedidos realizados</span>
          </div>
          <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
        </div>

        {/* Card 2: Lucro Líquido Real */}
        <div className="bg-white p-5 rounded-2xl border border-[#E899AC]/30 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Lucro Líquido Real</span>
            <div className="w-8 h-8 rounded-full bg-[#F8E8E8] text-[#B76E79] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#B76E79]">
            R$ {netProfit.toFixed(2)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#B76E79] font-bold">
            <Percent className="w-3 h-3" />
            <span>Margem Líquida: {profitMarginPercent}%</span>
          </div>
          <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-[#B76E79]/5 rounded-full blur-xl pointer-events-none"></div>
        </div>

        {/* Card 3: Ticket Médio */}
        <div className="bg-white p-5 rounded-2xl border border-[#E899AC]/30 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Ticket Médio por Venda</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">
            R$ {averageTicket}
          </div>
          <div className="text-[11px] text-gray-500 font-medium">
            Média gasta por cliente por pedido
          </div>
        </div>

        {/* Card 4: Unidades Vendidas */}
        <div className="bg-white p-5 rounded-2xl border border-[#E899AC]/30 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Produtos Vendidos</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">
            {totalItemsSold} <span className="text-xs font-normal text-gray-500">itens</span>
          </div>
          <div className="text-[11px] text-gray-500 font-medium">
            Volume físico de pronta-entrega
          </div>
        </div>

        {/* Card 5: Clientes Atendidas */}
        <div className="bg-white p-5 rounded-2xl border border-[#E899AC]/30 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Clientes Compradoras</span>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">
            {topClientsList.length} <span className="text-xs font-normal text-gray-500">fichas</span>
          </div>
          <div className="text-[11px] text-purple-600 font-semibold">
            Clientes ativas no período
          </div>
        </div>

      </div>

      {/* Grid Principal: Ranking de Produtos Mais Vendidos & Vendas por Categoria */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Coluna Esquerda (2/3): Ranking de Produtos Mais Vendidos */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#E899AC]/30 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
            <div>
              <h3 className="font-serif-mk text-lg font-bold text-gray-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Top Produtos Mais Vendidos & Lucrativos</span>
              </h3>
              <p className="text-xs text-gray-500">
                Classificação dos itens com maior receita gerada para sua consultoria.
              </p>
            </div>

            {/* Filtro por Categoria de Produto */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl border border-gray-200 bg-white font-semibold text-gray-700 focus:ring-2 focus:ring-[#E899AC]"
            >
              <option value="all">Todas as Categorias</option>
              <option value="Cuidados">Cuidados com a Pele</option>
              <option value="Maquiagem">Maquiagem</option>
              <option value="Fragrâncias">Fragrâncias</option>
              <option value="Corpo">Corpo & Sol</option>
              <option value="Kits">Kits & Combos</option>
            </select>
          </div>

          {topSellingProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-400 space-y-2">
              <Package className="w-10 h-10 mx-auto text-gray-300" />
              <p className="text-xs">Nenhum dado de venda encontrado para o período selecionado.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topSellingProducts.slice(0, 10).map((prod, index) => {
                const percentOfTop = Math.round((prod.totalRevenue / maxRevenueProduct) * 100);
                const isTop1 = index === 0;
                const isTop2 = index === 1;
                const isTop3 = index === 2;

                return (
                  <div 
                    key={prod.id || index}
                    className={`p-4 rounded-2xl border transition-all space-y-2 ${
                      isTop1 
                        ? 'bg-amber-50/40 border-amber-200 shadow-sm' 
                        : isTop2 
                        ? 'bg-gray-50/60 border-gray-200' 
                        : isTop3 
                        ? 'bg-orange-50/30 border-orange-200' 
                        : 'bg-white border-gray-100 hover:border-[#E899AC]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        {/* Posição no Ranking */}
                        <div className="flex-shrink-0">
                          {isTop1 && (
                            <span className="w-7 h-7 rounded-full bg-amber-500 text-white font-black flex items-center justify-center text-xs shadow-md">
                              🥇
                            </span>
                          )}
                          {isTop2 && (
                            <span className="w-7 h-7 rounded-full bg-slate-400 text-white font-black flex items-center justify-center text-xs shadow-md">
                              🥈
                            </span>
                          )}
                          {isTop3 && (
                            <span className="w-7 h-7 rounded-full bg-amber-700 text-white font-black flex items-center justify-center text-xs shadow-md">
                              🥉
                            </span>
                          )}
                          {!isTop1 && !isTop2 && !isTop3 && (
                            <span className="w-7 h-7 rounded-full bg-gray-100 text-gray-700 font-bold flex items-center justify-center text-xs">
                              #{index + 1}
                            </span>
                          )}
                        </div>

                        {/* Imagem do Produto */}
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          className="w-11 h-11 object-cover rounded-xl border border-gray-200 bg-white"
                        />

                        {/* Nome & SKU */}
                        <div>
                          <h4 className="font-bold text-gray-900 line-clamp-1">{prod.name}</h4>
                          <span className="text-[10px] text-gray-400">SKU: {prod.sku} • Categoria: <strong className="text-gray-600">{prod.category}</strong></span>
                        </div>
                      </div>

                      {/* Métricas de Receita e Unidades */}
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-black text-gray-900">
                          R$ {prod.totalRevenue.toFixed(2)}
                        </div>
                        <div className="text-[10px] font-semibold text-emerald-600">
                          {prod.unitsSold} un. vendidas • Lucro R$ {prod.totalProfit.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Barra de Progresso Relativa ao #1 */}
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isTop1 ? 'bg-amber-500' : 'bg-[#B76E79]'
                        }`}
                        style={{ width: `${percentOfTop}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Coluna Direita (1/3): Vendas por Categoria & Clientes TOP */}
        <div className="space-y-6">
          
          {/* Card: Desempenho de Vendas por Categoria */}
          <div className="bg-white p-6 rounded-3xl border border-[#E899AC]/30 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif-mk text-base font-bold text-gray-900 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-[#B76E79]" />
                <span>Vendas por Categoria</span>
              </h3>
              <span className="text-[10px] bg-[#F8E8E8] text-[#B76E79] font-bold px-2 py-0.5 rounded-full">
                {categorySalesList.length} Linhas
              </span>
            </div>

            <div className="space-y-3">
              {categorySalesList.map((cat, idx) => {
                const sharePercent = totalRevenue > 0 ? ((cat.revenue / totalRevenue) * 100).toFixed(1) : 0;
                return (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold text-gray-800">
                      <span>{cat.name}</span>
                      <span className="font-bold text-gray-900">R$ {cat.revenue.toFixed(2)} ({sharePercent}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${sharePercent}%` }}
                      ></div>
                    </div>
                    <div className="text-[10px] text-gray-400 flex justify-between">
                      <span>{cat.units} unidades vendidas</span>
                      <span className="text-emerald-600 font-semibold">Lucro: R$ {cat.profit.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card: Top Clientes Furtivas / VIPs no Período */}
          <div className="bg-white p-6 rounded-3xl border border-[#E899AC]/30 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif-mk text-base font-bold text-gray-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                <span>Top Clientes Compradoras</span>
              </h3>
              <span className="text-[10px] text-gray-400">Ranking em R$</span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {topClientsList.slice(0, 5).map((client, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-[#FAF7F5] rounded-2xl border border-gray-100 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#E899AC]/20 text-[#B76E79] font-bold flex items-center justify-center text-xs">
                      #{idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 line-clamp-1">{client.name}</h4>
                      <span className="text-[10px] text-gray-400">{client.ordersCount} pedido(s) • {client.itemsCount} itens</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-[#B76E79]">R$ {client.totalSpent.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Dicas Estratégicas de Vendas Mary Kay */}
      <div className="bg-gradient-to-r from-[#F8E8E8] to-[#FAF7F5] p-6 rounded-3xl border border-[#E899AC]/40 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="w-12 h-12 rounded-2xl mk-gold-gradient text-white flex items-center justify-center flex-shrink-0 shadow-md">
          <Zap className="w-6 h-6" />
        </div>
        <div className="text-xs space-y-1">
          <h4 className="font-bold font-serif-mk text-gray-900 text-sm">💡 Dica de Ouro da Consultora de Beleza</h4>
          <p className="text-gray-600 leading-relaxed">
            Seus produtos **Classe A** representam a maior fonte de renda. Garanta sempre reposição em pronta-entrega desses itens para não perder vendas imediatas. Aproveite os relatórios para sugerir aos clientes complementos de rotina de cuidados com a pele (Sessão de Beleza MK)!
          </p>
        </div>
      </div>

    </div>
  );
}
