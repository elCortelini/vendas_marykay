import React, { useState } from 'react';
import { ShoppingBag, Plus, Trash2, Send, DollarSign, Calculator, Layers, FileText, CheckCircle2, AlertCircle, Search, ExternalLink, Edit3, X, User } from 'lucide-react';

export default function MultiCart({
  carts,
  clients,
  products,
  activeCartId,
  setActiveCartId,
  onUpdateCart,
  onDeleteCart,
  onCreateNewCart,
  onOpenQuoteModal,
  onOpenConsolidator
}) {
  const [selectedProductToAdd, setSelectedProductToAdd] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [isNewCartModalOpen, setIsNewCartModalOpen] = useState(false);
  const [selectedClientIdForCart, setSelectedClientIdForCart] = useState(clients[0]?.id || '');
  const [cartTitleInput, setCartTitleInput] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [cartSortBy, setCartSortBy] = useState('date'); // 'date', 'value', 'client'

  const getCartTotal = (cart) => {
    const sub = (cart?.items || []).reduce((sum, item) => sum + (Number(item?.price || 0) * Number(item?.quantity || 1)), 0);
    const disc = (sub * Number(cart?.discountPercent || 0)) / 100;
    return Math.max(0, sub - disc + Number(cart?.shippingFee || 0));
  };

  const sortedCarts = [...(carts || [])].sort((a, b) => {
    if (cartSortBy === 'value') {
      return getCartTotal(b) - getCartTotal(a);
    }
    if (cartSortBy === 'client') {
      return (a.clientName || '').localeCompare(b.clientName || '');
    }
    // Default 'date' - newest first
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  const currentCart = carts.find(c => c.id === activeCartId) || sortedCarts[0] || carts[0];

  const handleQuantityChange = (productId, delta) => {
    if (!currentCart) return;
    const updatedItems = currentCart.items.map(item => {
      if (item.productId === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean);

    onUpdateCart({ ...currentCart, items: updatedItems });
  };

  const handleAddItemToCart = (product) => {
    if (!currentCart) return;
    const existingItem = currentCart.items.find(i => i.productId === product.id);
    let updatedItems = [];

    if (existingItem) {
      updatedItems = currentCart.items.map(i =>
        i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updatedItems = [...currentCart.items, {
        productId: product.id,
        sku: product.sku,
        name: product.name,
        price: product.price,
        costPrice: product.costPrice,
        quantity: 1,
        image: product.image
      }];
    }

    onUpdateCart({ ...currentCart, items: updatedItems });
  };

  const handleRemoveItem = (productId) => {
    if (!currentCart) return;
    const updatedItems = currentCart.items.filter(i => i.productId !== productId);
    onUpdateCart({ ...currentCart, items: updatedItems });
  };

  const handleCreateCartSubmit = (e) => {
    e.preventDefault();
    const client = clients.find(c => c.id === selectedClientIdForCart) || clients[0];
    if (!client) return;

    onCreateNewCart(client, cartTitleInput || `Carrinho - ${new Date().toLocaleDateString('pt-BR')}`);
    setIsNewCartModalOpen(false);
    setCartTitleInput('');
  };

  const handleSaveEditedTitle = () => {
    if (!currentCart || !editedTitle.trim()) return;
    onUpdateCart({ ...currentCart, title: editedTitle.trim() });
    setIsEditingTitle(false);
  };

  // Cálculos Financeiros
  const numFmt = (n) => Number(n || 0).toFixed(2);
  const subtotal = (currentCart?.items || []).reduce((sum, item) => sum + (Number(item?.price || 0) * Number(item?.quantity || 1)), 0);
  const totalCost = (currentCart?.items || []).reduce((sum, item) => sum + ((Number(item?.costPrice) || Number(item?.price || 0) * 0.6) * Number(item?.quantity || 1)), 0);
  const discountVal = (subtotal * Number(currentCart?.discountPercent || 0)) / 100;
  const totalFinal = Math.max(0, subtotal - discountVal + Number(currentCart?.shippingFee || 0));
  const estimatedProfit = totalFinal - totalCost;

  const filteredProducts = (products || []).filter(p => {
    if (!p) return false;
    const search = (productSearch || '').toLowerCase();
    return (p.name || '').toLowerCase().includes(search) ||
           (p.sku || '').toLowerCase().includes(search) ||
           (p.category || '').toLowerCase().includes(search);
  });

  return (
    <div className="space-y-6">
      {/* Lista Geral e Resumo dos Carrinhos em Aberto */}
      <div className="bg-white p-5 rounded-3xl border border-[#E899AC]/30 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#B76E79]" />
            <div>
              <h3 className="font-serif-mk text-base font-bold text-gray-900 flex items-center gap-2">
                <span>Lista de Carrinhos em Aberto</span>
                <span className="bg-[#1A1A1A] text-[#E899AC] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                  {sortedCarts.length} Carrinhos
                </span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Alterne entre os carrinhos ativos, confira o valor total de cada cliente e gere orçamentos de luxo.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            {/* Seletor de Ordenação de Carrinhos */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Ordenar:</span>
              <select
                value={cartSortBy}
                onChange={(e) => setCartSortBy(e.target.value)}
                className="bg-transparent font-bold text-[#B76E79] focus:outline-none cursor-pointer"
              >
                <option value="date">📅 Por Data</option>
                <option value="value">💰 Por Valor Total</option>
                <option value="client">👤 Por Nome do Cliente</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSelectedClientIdForCart(clients[0]?.id || '');
                setIsNewCartModalOpen(true);
              }}
              className="bg-[#F8E8E8] hover:bg-[#E899AC] text-[#B76E79] hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Carrinho</span>
            </button>

            {/* Botão Especial: Consolidador de Pedidos */}
            <button
              onClick={onOpenConsolidator}
              className="mk-gold-gradient text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Consolidar Pedidos</span>
            </button>
          </div>
        </div>

        {/* Grid Visual com a Lista de Todos os Carrinhos e seus Valores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {sortedCarts.map(cart => {
            const cartTotal = getCartTotal(cart);
            const cartItemsCount = cart.items.reduce((acc, i) => acc + i.quantity, 0);
            const isActive = cart.id === activeCartId;

            return (
              <div
                key={cart.id}
                onClick={() => setActiveCartId(cart.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isActive
                    ? 'bg-[#1A1A1A] text-white border-black shadow-lg ring-2 ring-[#E899AC]'
                    : 'bg-[#FAF7F5] hover:bg-white text-gray-800 border-gray-200 hover:border-[#E899AC]/50 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-xs block truncate leading-tight">{cart.clientName}</span>
                    {cart.title && (
                      <span className={`text-[10px] block truncate mt-0.5 ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                        {cart.title}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                    isActive ? 'bg-[#E899AC] text-white' : 'bg-[#F8E8E8] text-[#B76E79]'
                  }`}>
                    {cartItemsCount} {cartItemsCount === 1 ? 'item' : 'itens'}
                  </span>
                </div>

                <div className="pt-2 border-t border-current/10 flex items-center justify-between gap-2">
                  <div>
                    <span className={`text-[9px] uppercase font-bold tracking-wider block ${isActive ? 'text-gray-400' : 'text-gray-400'}`}>
                      Valor Total:
                    </span>
                    <span className={`text-base font-black font-serif-mk ${isActive ? 'text-[#E899AC]' : 'text-[#B76E79]'}`}>
                      R$ {numFmt(cartTotal)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenQuoteModal(cart);
                      }}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isActive ? 'hover:bg-white/20 text-white' : 'hover:bg-gray-100 text-gray-600'
                      }`}
                      title="Imprimir / Ver Orçamento"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCart(cart.id);
                      }}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isActive ? 'hover:bg-red-500/30 text-red-300' : 'hover:bg-red-50 text-red-500'
                      }`}
                      title="Excluir Carrinho"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal para Escolher Cliente ao Criar Novo Carrinho */}
      {isNewCartModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateCartSubmit} className="bg-white w-full max-w-md p-6 rounded-3xl shadow-2xl border border-[#E899AC]/40 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif-mk text-base font-bold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-[#B76E79]" />
                <span>Escolher Cliente para o Novo Carrinho</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsNewCartModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Selecione a Cliente *</label>
              <select
                value={selectedClientIdForCart}
                onChange={(e) => setSelectedClientIdForCart(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC] focus:outline-none bg-white"
              >
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} {client.phone ? `(${client.phone})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Nome/Título do Carrinho (Opcional)</label>
              <input
                type="text"
                placeholder="Ex: Encomenda Maquiagem, Presente de Aniversário..."
                value={cartTitleInput}
                onChange={(e) => setCartTitleInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC] focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsNewCartModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="mk-gold-gradient text-white text-xs font-semibold px-5 py-2 rounded-xl shadow-md cursor-pointer"
              >
                Criar Carrinho
              </button>
            </div>
          </form>
        </div>
      )}

      {currentCart ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Coluna Esquerda: Itens do Carrinho Ativo */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E899AC]/30 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold font-serif-mk text-gray-900">
                      Carrinho de {currentCart.clientName}
                    </h3>
                    <button
                      onClick={() => {
                        setEditedTitle(currentCart.title || '');
                        setIsEditingTitle(!isEditingTitle);
                      }}
                      className="text-gray-400 hover:text-[#B76E79] p-1 rounded-md transition-colors cursor-pointer"
                      title="Renomear este carrinho"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {isEditingTitle ? (
                    <div className="flex items-center gap-1.5 mt-1">
                      <input
                        type="text"
                        placeholder="Nome/Título do carrinho..."
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E899AC]"
                      />
                      <button
                        onClick={handleSaveEditedTitle}
                        className="bg-[#E899AC] text-white text-xs px-2 py-1 rounded-lg font-semibold cursor-pointer"
                      >
                        Salvar
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">
                      {currentCart.title ? `Título: ${currentCart.title} • ` : ''}Status: <span className="font-semibold text-[#B76E79]">{currentCart.status}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenQuoteModal(currentCart)}
                    className="mk-gold-gradient text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-sm hover:opacity-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Gerar Orçamento de Luxo</span>
                  </button>

                  <button
                    onClick={() => onDeleteCart(currentCart.id)}
                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    title="Excluir este carrinho"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lista de Itens no Carrinho */}
              {currentCart.items.length === 0 ? (
                <div className="text-center py-8 bg-[#FAF7F5] rounded-xl border border-dashed border-[#E899AC]/40">
                  <ShoppingBag className="w-8 h-8 text-[#B76E79]/50 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-600">Este carrinho está vazio.</p>
                  <p className="text-[11px] text-gray-400">Adicione produtos da lista ao lado para compor o orçamento.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {currentCart.items.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100 hover:border-[#E899AC]/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg border border-gray-200" />
                        <div>
                          <h4 className="text-xs font-bold text-gray-900 leading-tight">{item.name}</h4>
                          <span className="text-[10px] text-gray-400">SKU: {item.sku}</span>
                          <div className="text-xs font-semibold text-[#B76E79]">R$ {numFmt(item.price)}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
                          <button
                            onClick={() => handleQuantityChange(item.productId, -1)}
                            className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2.5 py-1 text-xs font-semibold text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.productId, 1)}
                            className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-xs font-bold text-gray-900 w-16 text-right">
                          R$ {numFmt(item.price * item.quantity)}
                        </span>

                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="text-gray-400 hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Ajustes de Desconto e Frete */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Desconto Especial (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={currentCart.discountPercent || 0}
                    onChange={(e) => onUpdateCart({ ...currentCart, discountPercent: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Taxa de Entrega / Frete (R$)</label>
                  <input
                    type="number"
                    min="0"
                    value={currentCart.shippingFee || 0}
                    onChange={(e) => onUpdateCart({ ...currentCart, shippingFee: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC]"
                  />
                </div>
              </div>
            </div>

            {/* Painel da Calculadora da Consultora Tailise */}
            <div className="bg-[#1A1A1A] text-white p-5 rounded-2xl shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#E899AC] flex items-center gap-1.5">
                  <Calculator className="w-4 h-4" />
                  <span>Calculadora de Lucro das Vendas</span>
                </h4>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-800">
                  Desconto MK 40%
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center py-1">
                <div className="bg-gray-900/60 p-2.5 rounded-xl border border-gray-800">
                  <span className="text-[10px] text-gray-400 block">Total Cliente</span>
                  <span className="text-sm font-bold text-white">R$ {numFmt(totalFinal)}</span>
                </div>
                <div className="bg-gray-900/60 p-2.5 rounded-xl border border-gray-800">
                  <span className="text-[10px] text-gray-400 block">Seu Custo Estimado</span>
                  <span className="text-sm font-bold text-gray-300">R$ {numFmt(totalCost)}</span>
                </div>
                <div className="bg-emerald-900/40 p-2.5 rounded-xl border border-emerald-700/50">
                  <span className="text-[10px] text-emerald-300 block">Seu Lucro Líquido</span>
                  <span className="text-base font-bold text-emerald-400">R$ {numFmt(estimatedProfit)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Catálogo para Adicionar Produtos ao Carrinho */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E899AC]/30 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm font-serif-mk text-gray-900">Adicionar Produtos do Catálogo</h3>
                <span className="text-xs text-[#B76E79] font-medium">{filteredProducts.length} itens</span>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquisar por nome, SKU ou linha..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC] focus:outline-none"
                />
              </div>

              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {filteredProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-2.5 bg-gray-50 hover:bg-[#F8E8E8]/50 rounded-xl border border-gray-100 transition-all">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-lg border border-gray-200" />
                      <div>
                        <h4 className="text-xs font-semibold text-gray-900 leading-tight">{product.name}</h4>
                        <span className="text-[10px] text-gray-400">{product.category}</span>
                        <div className="text-xs font-bold text-[#B76E79]">R$ {numFmt(product.price)}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddItemToCart(product)}
                      className="bg-[#E899AC] hover:bg-[#B76E79] text-white p-2 rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
                      title="Adicionar ao carrinho"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <p className="text-sm text-gray-500">Nenhum carrinho ativo. Clique em "Novo Carrinho" para escolher a cliente e começar.</p>
        </div>
      )}
    </div>
  );
}
