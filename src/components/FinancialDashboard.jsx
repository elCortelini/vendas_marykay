import React, { useState } from 'react';
import { DollarSign, TrendingUp, Clock, AlertTriangle, ShieldCheck, Wallet, Calendar, ArrowUpRight, ArrowDownRight, Package, UserCheck, Plus, BarChart3 } from 'lucide-react';
import AdvancedReportsView from './AdvancedReportsView';

export default function FinancialDashboard({ products, carts, clients, payments, onRecordPayment }) {
  const [activeSubTab, setActiveSubTab] = useState('reports'); // 'reports' or 'dre'
  const [paymentForm, setPaymentForm] = useState({
    clientId: clients[0]?.id || '',
    amount: '',
    method: 'PIX',
    notes: ''
  });
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // 1. Cálculo do Faturamento e Lucro DRE
  const completedCarts = carts.filter(c => c.status === 'Entregue' || c.status === 'Em Aberto');
  
  let totalRevenue = 0;
  let totalCost = 0;
  let totalShippingFees = 0;
  let totalPackagingCosts = 0;

  completedCarts.forEach(cart => {
    cart.items.forEach(item => {
      totalRevenue += (item.price * item.quantity);
      totalCost += ((item.costPrice || item.price * 0.6) * item.quantity);
    });
    totalShippingFees += (cart.shippingFee || 0);
    totalPackagingCosts += 5; // Custo estimado por embalagem de luxo
  });

  const grossProfit = totalRevenue - totalCost;
  const netProfit = grossProfit - totalShippingFees - totalPackagingCosts;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;

  // 2. Análise de Idade de Estoque (Tempo em Estoque em Dias)
  const now = new Date().getTime();
  const inventoryItems = products.map(p => {
    const entryDate = p.stockEntryDate ? new Date(p.stockEntryDate).getTime() : (now - (15 * 24 * 60 * 60 * 1000));
    const daysInStock = Math.floor((now - entryDate) / (1000 * 60 * 60 * 24));
    return {
      ...p,
      daysInStock,
      stockValue: (p.stockCount || 0) * p.price,
      costValue: (p.stockCount || 0) * (p.costPrice || p.price * 0.6)
    };
  });

  const totalStockItemsCount = inventoryItems.reduce((acc, i) => acc + (i.stockCount || 0), 0);
  const totalStockValueSum = inventoryItems.reduce((acc, i) => acc + i.stockValue, 0);

  // Itens parados há mais de 45 dias
  const agedStockItems = inventoryItems.filter(i => i.daysInStock > 45 && (i.stockCount || 0) > 0);

  // 3. Contas a Receber / Fiado
  const totalPaymentsReceived = (payments || []).reduce((acc, p) => acc + p.amount, 0);
  const pendingReceivables = Math.max(0, totalRevenue - totalPaymentsReceived);

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!paymentForm.clientId || !paymentForm.amount) return;
    if (onRecordPayment) {
      onRecordPayment(paymentForm);
    }
    setIsPaymentModalOpen(false);
    setPaymentForm({ clientId: clients[0]?.id || '', amount: '', method: 'PIX', notes: '' });
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Seção */}
      <div className="bg-white p-6 rounded-2xl border border-[#E899AC]/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif-mk text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#B76E79]" />
            <span>Gestão Financeira & DRE da Consultora Tailise</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Resumo de faturamento, lucro líquido real, saúde do seu estoque e controle de contas a receber.
          </p>
        </div>

        <button
          onClick={() => setIsPaymentModalOpen(true)}
          className="mk-gold-gradient text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Recebimento / Fiado</span>
        </button>
      </div>

      {/* Navegação por Sub-abas */}
      <div className="flex border-b border-[#E899AC]/30 space-x-2 bg-white p-2 rounded-2xl border shadow-sm">
        <button
          type="button"
          onClick={() => setActiveSubTab('reports')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'reports'
              ? 'bg-[#B76E79] text-white shadow-md'
              : 'text-gray-600 hover:bg-[#FAF7F5]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>📊 Relatórios Avançados & Curva ABC</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('dre')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'dre'
              ? 'bg-[#B76E79] text-white shadow-md'
              : 'text-gray-600 hover:bg-[#FAF7F5]'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>💰 DRE & Recebimentos</span>
        </button>
      </div>

      {activeSubTab === 'reports' ? (
        <AdvancedReportsView products={products} clients={clients} carts={carts} payments={payments} />
      ) : (
        <>
      {/* Cards de Métricas Financeiras */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E899AC]/30 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Faturamento Bruto</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">R$ {totalRevenue.toFixed(2)}</div>
          <p className="text-[10px] text-gray-400">Total acumulado nos carrinhos ativas</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E899AC]/30 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Lucro Líquido Real</span>
            <div className="w-8 h-8 rounded-full bg-[#F8E8E8] text-[#B76E79] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#B76E79]">R$ {netProfit.toFixed(2)}</div>
          <p className="text-[10px] text-emerald-600 font-semibold">Margem Líquida estimada: {profitMargin}%</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E899AC]/30 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Valor em Estoque</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">R$ {totalStockValueSum.toFixed(2)}</div>
          <p className="text-[10px] text-gray-400">{totalStockItemsCount} unidades em pronta-entrega</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E899AC]/30 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Contas a Receber / Fiados</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600">R$ {pendingReceivables.toFixed(2)}</div>
          <p className="text-[10px] text-gray-400">Saldo a receber das clientes</p>
        </div>
      </div>

      {/* Grid de Análises Detalhadas: Idade do Estoque & Extrato de Pagamentos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Painel 1: Análise de Tempo em Estoque (Idade do Estoque) */}
        <div className="bg-white p-6 rounded-2xl border border-[#E899AC]/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-serif-mk text-base font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#B76E79]" />
              <span>Tempo em Estoque (Idade dos Produtos)</span>
            </h3>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {agedStockItems.length} parados &gt; 45 dias
            </span>
          </div>

          <p className="text-xs text-gray-500">
            Acompanhe há quantos dias cada produto está na sua pronta-entrega. Produtos parados há mais tempo podem ser incluídos em promoções ou no Panfleto Semanal!
          </p>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {inventoryItems.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#E899AC]/50 transition-all text-xs"
              >
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg border" />
                  <div>
                    <h4 className="font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                    <span className="text-[10px] text-gray-400">SKU: {item.sku} • Qtd em Estoque: {item.stockCount || 0} un.</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg inline-block ${
                    item.daysInStock > 60 ? 'bg-red-100 text-red-700' : item.daysInStock > 30 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {item.daysInStock} dias em estoque
                  </span>
                  <div className="text-[10px] font-semibold text-gray-500 mt-0.5">R$ {item.stockValue.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Painel 2: Registro de Pagamentos & Contas a Receber */}
        <div className="bg-white p-6 rounded-2xl border border-[#E899AC]/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-serif-mk text-base font-bold text-gray-900 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-600" />
              <span>Histórico de Recebimentos & Fiados</span>
            </h3>
            <span className="text-xs font-bold text-emerald-600">Total Pago: R$ {totalPaymentsReceived.toFixed(2)}</span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {(!payments || payments.length === 0) ? (
              <div className="text-center py-8 text-xs text-gray-400">
                Nenhum pagamento registrado ainda. Clique em "+ Registrar Recebimento" para lançar pagamentos das clientes!
              </div>
            ) : (
              payments.map(pay => (
                <div key={pay.id} className="flex items-center justify-between p-3 bg-[#FAF7F5] rounded-xl border border-gray-100 text-xs">
                  <div>
                    <h4 className="font-bold text-gray-900">{pay.clientName}</h4>
                    <span className="text-[10px] text-gray-500">
                      {new Date(pay.date).toLocaleDateString('pt-BR')} • Modo: <strong className="text-gray-700">{pay.method}</strong>
                    </span>
                    {pay.notes && <p className="text-[10px] text-gray-400 italic mt-0.5">"{pay.notes}"</p>}
                  </div>
                  <div className="text-right font-black text-emerald-600 text-sm">
                    + R$ {pay.amount.toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
        </>
      )}

      {/* Modal para Registrar Pagamento / Fiado */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handlePaymentSubmit} className="bg-white w-full max-w-md p-6 rounded-3xl shadow-2xl border border-[#E899AC]/40 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif-mk text-base font-bold text-gray-900 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-600" />
                <span>Registrar Pagamento / Entrada de Cliente</span>
              </h3>
              <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Selecione a Cliente *</label>
                <select
                  value={paymentForm.clientId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, clientId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC] bg-white"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.phone || 'Sem fone'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Valor Recebido (R$) *</label>
                <input
                  type="number"
                  step="0.10"
                  required
                  placeholder="Ex: 150.00"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Forma de Pagamento</label>
                <select
                  value={paymentForm.method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC] bg-white"
                >
                  <option value="PIX">PIX</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Parcelado / Fiado">Parcelado / Fiado</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Observações (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Pagamento 1ª parcela de 2x"
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-md cursor-pointer"
              >
                Salvar Recebimento
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
