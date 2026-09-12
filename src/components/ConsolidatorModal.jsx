import React, { useState } from 'react';
import { X, Layers, CheckSquare, Square, ShoppingBag, ExternalLink, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ConsolidatorModal({ carts, consultant, onClose, onExportOfficialCart }) {
  const [selectedCartIds, setSelectedCartIds] = useState(carts.map(c => c.id));
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState(null);

  const toggleCartSelection = (cartId) => {
    if (selectedCartIds.includes(cartId)) {
      setSelectedCartIds(selectedCartIds.filter(id => id !== cartId));
    } else {
      setSelectedCartIds([...selectedCartIds, cartId]);
    }
  };

  // Agrupar itens dos carrinhos selecionados
  const selectedCarts = carts.filter(c => selectedCartIds.includes(c.id));
  const combinedMap = {};

  selectedCarts.forEach(cart => {
    cart.items.forEach(item => {
      if (!combinedMap[item.sku]) {
        combinedMap[item.sku] = { ...item, quantity: 0 };
      }
      combinedMap[item.sku].quantity += item.quantity;
    });
  });

  const combinedItems = Object.values(combinedMap);
  const totalCatalogValue = combinedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Níveis de desconto da consultora Mary Kay (35% ou 40%)
  const discountTier = totalCatalogValue >= 500 ? 0.40 : 0.35;
  const estimatedCost = totalCatalogValue * (1 - discountTier);
  const estimatedProfit = totalCatalogValue - estimatedCost;

  const handleConfirmExport = async () => {
    setIsExporting(true);
    try {
      const res = await onExportOfficialCart(selectedCartIds);
      setExportResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E899AC]/40 overflow-hidden my-8 animate-scale-up">
        
        {/* Top Header */}
        <div className="bg-[#1A1A1A] text-white p-5 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E899AC]/20 flex items-center justify-center text-[#E899AC]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm font-serif-mk">Consolidador de Pedidos de Clientes</h3>
              <p className="text-[11px] text-gray-400">Agrupar carrinhos para compra no site oficial Mary Kay®</p>
            </div>
          </div>

          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 bg-[#FAF7F5]">
          
          {/* Seleção de Carrinhos para Incluir */}
          <div className="bg-white p-4 rounded-2xl border border-[#E899AC]/30 space-y-3 shadow-sm">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-[#B76E79]" />
              <span>Selecione os Carrinhos para Incluir no Pedido Oficial:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {carts.map(cart => {
                const isSelected = selectedCartIds.includes(cart.id);
                const cartTotal = cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
                return (
                  <div
                    key={cart.id}
                    onClick={() => toggleCartSelection(cart.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#F8E8E8] border-[#E899AC] text-gray-900'
                        : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#B76E79]" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400" />
                      )}
                      <div>
                        <span className="text-xs font-bold block">{cart.clientName}</span>
                        <span className="text-[10px] text-gray-500">{cart.items.reduce((a, b) => a + b.quantity, 0)} itens</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#B76E79]">R$ {cartTotal.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resumo da Consolidação (Itens Agrupados) */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Lista Consolidada para Pedido Oficial ({combinedItems.length} SKUs distintos)
              </h4>
              <span className="text-xs text-[#B76E79] font-bold">
                {combinedItems.reduce((acc, i) => acc + i.quantity, 0)} unidades totais
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {combinedItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2">
                    <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded-md border border-gray-200" />
                    <div>
                      <span className="font-semibold text-gray-900 block leading-tight">{item.name}</span>
                      <span className="text-[10px] text-gray-400">SKU: {item.sku}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#B76E79] block">{item.quantity}x unidades</span>
                    <span className="text-[10px] text-gray-500">R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cálculo de Desconto da Consultora */}
          <div className="bg-[#1A1A1A] text-white p-5 rounded-2xl space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-300 font-semibold">Desconto Estimado da Consultora:</span>
              <span className="bg-emerald-950 text-emerald-400 text-xs font-bold px-3 py-0.5 rounded-full border border-emerald-800">
                {(discountTier * 100)}% Desconto Mary Kay®
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-gray-800">
              <div>
                <span className="text-[10px] text-gray-400 block">Total Catálogo</span>
                <span className="text-sm font-bold text-white">R$ {totalCatalogValue.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Seu Custo do Pedido</span>
                <span className="text-sm font-bold text-emerald-400">R$ {estimatedCost.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Lucro Previsto</span>
                <span className="text-sm font-bold text-[#E899AC]">R$ {estimatedProfit.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Resultado da Exportação */}
          {exportResult && (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs space-y-2 animate-fade-in">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{exportResult.message}</span>
              </div>
              <p className="text-emerald-700 text-[11px]">
                O assistente de automação conectou com a conta NW7527 no portal EmSintonia. Clique no botão abaixo para conferir no site oficial!
              </p>
              <a
                href={exportResult.checkoutUrl || "https://mk.marykayintouch.com.br/s/login/?language=pt_BR"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 underline hover:text-emerald-950 pt-1"
              >
                <span>Ir para a tela de pagamento no site da Mary Kay®</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Botão Principal de Transferência */}
          <div className="pt-2">
            <button
              onClick={handleConfirmExport}
              disabled={isExporting || combinedItems.length === 0}
              className="w-full mk-gold-gradient text-white font-bold text-xs py-3.5 px-6 rounded-2xl shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isExporting ? 'animate-spin' : ''}`} />
              <span>
                {isExporting
                  ? 'Transferindo produtos para o site oficial...'
                  : 'Preencher Carrinho no Site Oficial Mary Kay®'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
