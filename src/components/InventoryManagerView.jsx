import React, { useState } from 'react';
import { Package, Search, Plus, Minus, Check, ArrowDownRight, Tag, RefreshCw, Box, AlertCircle, ShoppingBag, DollarSign, Calendar } from 'lucide-react';

export default function InventoryManagerView({ products = [], clients = [], onUpdateInventory, onRecordPayment }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [skuAddInput, setSkuAddInput] = useState('');
  const [stockAddCount, setStockAddCount] = useState('1');
  const [selectedFilter, setSelectedFilter] = useState('inStock'); // 'all', 'inStock', 'outOfStock'
  const [noticeMessage, setNoticeMessage] = useState(null);

  // Estado para Modal de Dar Baixa / Venda no Estoque
  const [baixaModalProduct, setBaixaModalProduct] = useState(null);
  const [baixaQuantity, setBaixaQuantity] = useState('1');
  const [baixaReason, setBaixaReason] = useState('Venda'); // 'Venda', 'Uso Pessoal', 'Amostra Grátis', 'Perda/Validade'
  const [baixaSelectedClient, setBaixaSelectedClient] = useState(clients[0]?.id || '');
  const [baixaSalePrice, setBaixaSalePrice] = useState('');

  // Produtos filtrados
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchesSearch) return false;

    if (selectedFilter === 'inStock') return (p.stockCount || 0) > 0;
    if (selectedFilter === 'outOfStock') return (p.stockCount || 0) === 0;
    return true;
  });

  // Métricas do Estoque Físico
  const productsWithStock = products.filter(p => (p.stockCount || 0) > 0);
  const totalStockUnits = productsWithStock.reduce((sum, p) => sum + (p.stockCount || 0), 0);
  const totalRetailValue = productsWithStock.reduce((sum, p) => sum + ((p.price || 0) * (p.stockCount || 0)), 0);
  const totalCostValue = productsWithStock.reduce((sum, p) => sum + ((p.costPrice || (p.price * 0.6)) * (p.stockCount || 0)), 0);
  const totalProjectedProfit = totalRetailValue - totalCostValue;

  const showToast = (msg) => {
    setNoticeMessage(msg);
    setTimeout(() => setNoticeMessage(null), 3500);
  };

  // Entrada no Estoque por Código SKU
  const handleSkuStockSubmit = (e) => {
    e.preventDefault();
    const cleanSku = skuAddInput.trim();
    if (!cleanSku) return;

    const prod = products.find(p => p.sku === cleanSku || p.id === cleanSku || p.sku === cleanSku.toUpperCase());
    if (prod) {
      const addQty = parseInt(stockAddCount) || 1;
      const newTotal = (prod.stockCount || 0) + addQty;
      if (onUpdateInventory) {
        onUpdateInventory(prod.id, newTotal);
      }
      showToast(`Adicionado +${addQty} unidade(s) do produto "${prod.name}" no estoque físico!`);
      setSkuAddInput('');
      setStockAddCount('1');
    } else {
      alert(`Produto com código SKU "${cleanSku}" não foi encontrado no catálogo local. Busque por nome ou sincronize o catálogo.`);
    }
  };

  // Ajuste rápido +/-
  const handleQuickStockAdjust = (product, delta) => {
    const current = product.stockCount || 0;
    const nextVal = Math.max(0, current + delta);
    if (onUpdateInventory) {
      onUpdateInventory(product.id, nextVal);
    }
  };

  // Confirmar Baixa / Venda no Estoque
  const handleConfirmBaixa = (e) => {
    e.preventDefault();
    if (!baixaModalProduct) return;

    const qtyToReduce = parseInt(baixaQuantity) || 1;
    const currentStock = baixaModalProduct.stockCount || 0;
    if (qtyToReduce > currentStock) {
      alert(`A quantidade de baixa (${qtyToReduce}) é maior do que o estoque físico atual (${currentStock}).`);
      return;
    }

    const newStock = currentStock - qtyToReduce;
    if (onUpdateInventory) {
      onUpdateInventory(baixaModalProduct.id, newStock);
    }

    // Se for Venda, registrar pagamento/recebimento se solicitado
    if (baixaReason === 'Venda' && onRecordPayment) {
      const unitPrice = parseFloat(baixaSalePrice) || baixaModalProduct.price || 0;
      const totalSale = unitPrice * qtyToReduce;
      onRecordPayment({
        clientId: baixaSelectedClient || clients[0]?.id || 'venda-balcao',
        amount: totalSale,
        method: 'PIX',
        notes: `Baixa em Estoque: ${qtyToReduce}x ${baixaModalProduct.name}`
      });
    }

    showToast(`Baixa de ${qtyToReduce}x "${baixaModalProduct.name}" registrada por motivos de: ${baixaReason}!`);
    setBaixaModalProduct(null);
    setBaixaQuantity('1');
    setBaixaSalePrice('');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {noticeMessage && (
        <div className="bg-emerald-900 text-white p-4 rounded-2xl shadow-lg border border-emerald-500 font-bold text-xs flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-300" />
            <span>{noticeMessage}</span>
          </div>
          <button onClick={() => setNoticeMessage(null)} className="text-white hover:text-emerald-200">×</button>
        </div>
      )}

      {/* Cabeçalho da Seção de Estoque */}
      <div className="bg-white p-6 rounded-3xl border border-[#E899AC]/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl mk-gold-gradient text-white flex items-center justify-center shadow-md shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif-mk text-xl font-bold text-gray-900 flex items-center gap-2">
              <span>Gestão de Estoque Físico & Pronta-Entrega</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300">
                {totalStockUnits} Unidades em Mãos
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Cadastre entradas por código SKU, controle produtos em mãos e dê baixa por vendas ou uso pessoal!
            </p>
          </div>
        </div>
      </div>

      {/* Cards com Métricas Financeiras do Estoque */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Total de Itens com Estoque</span>
          <div className="text-2xl font-extrabold text-gray-900 font-serif-mk">{productsWithStock.length} produtos</div>
          <span className="text-[10px] text-emerald-600 font-semibold">{totalStockUnits} unidades físicas</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Valor Total em Venda (R$)</span>
          <div className="text-2xl font-extrabold text-gray-900 font-serif-mk">R$ {totalRetailValue.toFixed(2)}</div>
          <span className="text-[10px] text-gray-500">Preço de Tabela Mary Kay®</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Seu Custo de Aquisição (R$)</span>
          <div className="text-2xl font-extrabold text-gray-700 font-serif-mk">R$ {totalCostValue.toFixed(2)}</div>
          <span className="text-[10px] text-gray-500">Com Desconto MK 40%</span>
        </div>

        <div className="bg-emerald-900 text-white p-5 rounded-2xl shadow-md space-y-1 border border-emerald-700">
          <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">Lucro Projetado em Estoque</span>
          <div className="text-2xl font-black text-emerald-300 font-serif-mk">R$ {totalProjectedProfit.toFixed(2)}</div>
          <span className="text-[10px] text-emerald-200">Margem estimada ao vender 100%</span>
        </div>
      </div>

      {/* Formulário: Entrada Rápida por Código SKU */}
      <div className="bg-white p-6 rounded-3xl border border-[#E899AC]/40 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <Box className="w-5 h-5 text-[#B76E79]" />
          <span>Dar Entrada no Estoque por Código SKU (ex: 10248713)</span>
        </h3>

        <form onSubmit={handleSkuStockSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 text-xs">
          <div className="flex-1">
            <input
              type="text"
              required
              placeholder="Digite o código SKU do produto (ex: 10248713, 101902)..."
              value={skuAddInput}
              onChange={(e) => setSkuAddInput(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC] focus:outline-none"
            />
          </div>

          <div className="w-full sm:w-32">
            <input
              type="number"
              min="1"
              required
              placeholder="Qtd"
              value={stockAddCount}
              onChange={(e) => setStockAddCount(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC] text-center font-bold"
            />
          </div>

          <button
            type="submit"
            className="mk-gold-gradient text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>+ Adicionar Entrada</span>
          </button>
        </form>
      </div>

      {/* Filtros e Lista de Produtos para Controle de Estoque */}
      <div className="bg-white p-6 rounded-3xl border border-[#E899AC]/30 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome ou código no estoque..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedFilter('inStock')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                selectedFilter === 'inStock'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📦 Com Estoque ({productsWithStock.length})
            </button>

            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                selectedFilter === 'all'
                  ? 'bg-[#E899AC] text-white shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todos ({products.length})
            </button>

            <button
              onClick={() => setSelectedFilter('outOfStock')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                selectedFilter === 'outOfStock'
                  ? 'bg-rose-600 text-white shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Sem Estoque ({products.length - productsWithStock.length})
            </button>
          </div>
        </div>

        {/* Tabela/Grid de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {filteredProducts.map(product => {
            const stock = product.stockCount || 0;
            const hasStock = stock > 0;

            return (
              <div
                key={product.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                  hasStock ? 'bg-white border-emerald-200 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-14 h-14 object-cover rounded-xl border border-gray-200 shrink-0" />
                    <div>
                      <span className="text-[10px] font-mono text-gray-400 block">Cód: {product.sku || product.id}</span>
                      <h4 className="font-bold text-xs text-gray-900 line-clamp-2 leading-tight">{product.name}</h4>
                      <div className="text-xs font-bold text-[#B76E79] mt-0.5">R$ {Number(product.price || 0).toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                {/* Controles de Estoque & Baixa */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-700">Estoque:</span>
                    <div className="flex items-center border rounded-xl bg-gray-50">
                      <button
                        onClick={() => handleQuickStockAdjust(product, -1)}
                        className="px-2 py-1 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-l-xl cursor-pointer"
                      >
                        -
                      </button>
                      <span className={`px-3 py-1 font-extrabold text-xs ${hasStock ? 'text-emerald-700' : 'text-gray-400'}`}>
                        {stock}
                      </span>
                      <button
                        onClick={() => handleQuickStockAdjust(product, 1)}
                        className="px-2 py-1 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-r-xl cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {hasStock && (
                    <button
                      onClick={() => {
                        setBaixaModalProduct(product);
                        setBaixaQuantity('1');
                        setBaixaSalePrice(String(product.price || ''));
                      }}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-rose-200 transition-all flex items-center gap-1 cursor-pointer"
                      title="Dar baixa por venda ou uso"
                    >
                      <ArrowDownRight className="w-3.5 h-3.5" />
                      <span>Dar Baixa</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Baixa / Venda no Estoque */}
      {baixaModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleConfirmBaixa} className="bg-white w-full max-w-md p-6 rounded-3xl shadow-2xl border border-[#E899AC]/40 space-y-4 text-xs animate-scale-up">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif-mk text-base font-bold text-gray-900 flex items-center gap-2">
                <ArrowDownRight className="w-5 h-5 text-rose-600" />
                <span>Registrar Baixa de Estoque</span>
              </h3>
              <button
                type="button"
                onClick={() => setBaixaModalProduct(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border">
              <img src={baixaModalProduct.image} alt={baixaModalProduct.name} className="w-12 h-12 object-cover rounded-xl border" />
              <div>
                <h4 className="font-bold text-gray-900">{baixaModalProduct.name}</h4>
                <p className="text-[11px] text-gray-500">Estoque atual: <strong className="text-emerald-600">{baixaModalProduct.stockCount} unidades</strong></p>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Motivo da Baixa *</label>
              <select
                value={baixaReason}
                onChange={(e) => setBaixaReason(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border rounded-xl font-semibold"
              >
                <option value="Venda">Venda Realizada para Cliente</option>
                <option value="Uso Pessoal">Uso Pessoal da Consultora</option>
                <option value="Amostra Grátis">Demonstração / Amostra Grátis</option>
                <option value="Perda/Validade">Troca / Perda / Validade</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Quantidade a Baixar *</label>
              <input
                type="number"
                min="1"
                max={baixaModalProduct.stockCount}
                required
                value={baixaQuantity}
                onChange={(e) => setBaixaQuantity(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border rounded-xl font-bold text-center"
              />
            </div>

            {baixaReason === 'Venda' && (
              <>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Cliente Compradora (Opcional)</label>
                  <select
                    value={baixaSelectedClient}
                    onChange={(e) => setBaixaSelectedClient(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Preço Praticado na Venda (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={baixaSalePrice}
                    onChange={(e) => setBaixaSalePrice(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl font-bold text-emerald-700"
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setBaixaModalProduct(null)}
                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2 rounded-xl shadow cursor-pointer"
              >
                Confirmar Baixa
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
