import React, { useState } from 'react';
import { Sparkles, Search, RefreshCw, Star, Tag, ShoppingBag, Check, Image, Plus, X, PlusCircle, Globe, ArrowRight, Package, Box, ShieldCheck, ChevronUp, ChevronDown } from 'lucide-react';

export default function CatalogSync({
  products,
  categories,
  onSyncCatalog,
  isSyncing,
  onQuickAddToCart,
  onUpdateProductImage,
  onAddProduct,
  onFetchProductBySku,
  onOpenFlyerModal,
  onOpenKitsModal,
  onUpdateInventory
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);
  const [addedItemNotice, setAddedItemNotice] = useState(null);

  // Busca por SKU no site oficial
  const [skuQueryInput, setSkuQueryInput] = useState('');
  const [isSearchingOfficialSite, setIsSearchingOfficialSite] = useState(false);
  const [officialSiteSearchResult, setOfficialSiteSearchResult] = useState(null);

  // Modal de Adicionar Novo Produto
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    sku: '',
    category: categories[0] || 'Cuidados com a Pele (TimeWise 3D)',
    price: '',
    costPrice: '',
    image: '',
    description: '',
    isBestSeller: false
  });

  // Estado para editar foto do produto
  const [editingImageProductId, setEditingImageProductId] = useState(null);
  const [newImageUrlInput, setNewImageUrlInput] = useState('');

  // Métricas do estoque físico
  const inStockProducts = products.filter(p => (p.stockCount || p.stock || 0) > 0);
  const totalStockUnits = inStockProducts.reduce((sum, p) => sum + (p.stockCount || p.stock || 0), 0);
  const totalStockRetailValue = inStockProducts.reduce((sum, p) => sum + (p.price * (p.stockCount || p.stock || 0)), 0);

  const filteredProducts = (products || []).filter(product => {
    if (!product) return false;
    const stockQty = product.stockCount || product.stock || 0;
    if (showOnlyInStock && stockQty <= 0) return false;

    const cleanSearch = (searchTerm || '').trim().toLowerCase();
    if (!cleanSearch) {
      return selectedCategory === 'Todas' || product.category === selectedCategory;
    }

    const cleanDigits = cleanSearch.replace(/\D/g, '');
    const prodSku = (product.sku || '').toLowerCase();
    const prodDigits = product.sku ? String(product.sku).replace(/\D/g, '') : '';
    
    // Se a busca for numérica (Código SKU oficial)
    if (cleanDigits && cleanDigits.length >= 3) {
      if (prodSku === cleanSearch || prodDigits === cleanDigits) {
        return true;
      }
    }

    const matchesSearch = (product.name || '').toLowerCase().includes(cleanSearch) ||
                          prodSku.includes(cleanSearch) ||
                          (product.description || '').toLowerCase().includes(cleanSearch);
    const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleQuickAdd = (product) => {
    onQuickAddToCart(product);
    setAddedItemNotice(product.id);
    setTimeout(() => setAddedItemNotice(null), 2000);
  };

  const handleSearchSkuOfficial = async (e) => {
    e.preventDefault();
    if (!skuQueryInput.trim()) return;
    setIsSearchingOfficialSite(true);
    setOfficialSiteSearchResult(null);
    try {
      if (onFetchProductBySku) {
        const res = await onFetchProductBySku(skuQueryInput.trim());
        setOfficialSiteSearchResult(res);
        if (res && res.product) {
          setSelectedCategory('Todas'); // Abrir todas as categorias para garantir visualização
          setSearchTerm(res.product.sku); // Filtrar pelo código buscado
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingOfficialSite(false);
    }
  };

  const handleSaveImageUpdate = async (productId) => {
    if (!newImageUrlInput.trim()) return;
    if (onUpdateProductImage) {
      await onUpdateProductImage(productId, newImageUrlInput.trim());
    }
    setEditingImageProductId(null);
    setNewImageUrlInput('');
  };

  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.price) return;
    if (onAddProduct) {
      onAddProduct(newProductForm);
    }
    setIsAddModalOpen(false);
    setNewProductForm({
      name: '',
      sku: '',
      category: categories[0] || 'Cuidados com a Pele (TimeWise 3D)',
      price: '',
      costPrice: '',
      image: '',
      description: '',
      isBestSeller: false
    });
  };

  const handleStockChange = (product, delta) => {
    const current = product.stockCount || product.stock || 0;
    const nextVal = Math.max(0, current + delta);
    if (onUpdateInventory) {
      onUpdateInventory(product.id, nextVal);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Seção com Métricas de Estoque Pronta-Entrega */}
      <div className="bg-white p-6 rounded-2xl border border-[#E899AC]/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif-mk text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#B76E79]" />
            <span>Catálogo Completo Mary Kay® ({products.length} itens)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Preços e produtos oficiais. Gerencie seu estoque físico em mãos para exibir como **Pronta-Entrega**!
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Botão de Pacotes & Kits */}
          <button
            onClick={onOpenKitsModal}
            className="bg-[#1A1A1A] hover:bg-black text-[#E899AC] text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm border border-[#E899AC]/30"
          >
            <Package className="w-4 h-4 text-[#E899AC]" />
            <span>Pacotes & Kits</span>
          </button>

          <button
            onClick={onOpenFlyerModal}
            className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>Gerar Panfleto</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#F8E8E8] hover:bg-[#E899AC] text-[#B76E79] hover:text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Adicionar Produto</span>
          </button>

          <button
            onClick={onSyncCatalog}
            disabled={isSyncing}
            className="mk-gold-gradient text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar EmSintonia'}</span>
          </button>
        </div>
      </div>

      {/* Banner de Estoque Pronta-Entrega da Consultora */}
      <div className="bg-[#FAF7F5] border border-[#E899AC]/40 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full mk-gold-gradient text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
              <span>Seu Estoque Físico (Pronta-Entrega)</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                {totalStockUnits} unidades em mãos
              </span>
            </h4>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Valor total em estoque físico: <strong className="text-gray-900">R$ {totalStockRetailValue.toFixed(2)}</strong> em produtos a pronta-entrega.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowOnlyInStock(!showOnlyInStock)}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm text-xs ${
            showOnlyInStock
              ? 'bg-[#1A1A1A] text-[#E899AC] border border-[#E899AC]/40'
              : 'bg-white text-gray-700 hover:bg-[#F8E8E8] border border-gray-200'
          }`}
        >
          <Box className="w-4 h-4 text-[#B76E79]" />
          <span>{showOnlyInStock ? 'Exibindo: Apenas Pronta-Entrega' : 'Filtrar Pronta-Entrega'}</span>
        </button>
      </div>

      {/* FERRAMENTA PRINCIPAL: BUSCA POR CÓDIGO SKU NA API PÚBLICA VTEX */}
      <div className="bg-[#1A1A1A] text-white p-5 rounded-2xl shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E899AC]/20 flex items-center justify-center text-[#E899AC]">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm font-serif-mk text-white">
                  Buscar Código SKU na API Pública VTEX (loja.marykay.com.br)
                </h3>
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-700/60 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  VTEX API ⚡
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Digite qualquer código oficial (ex: 10142659) para puxar diretamente da loja online oficial Mary Kay® Brasil em tempo real!
              </p>
            </div>
          </div>

          <form onSubmit={handleSearchSkuOfficial} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Digite o código SKU (ex: 101902)..."
              value={skuQueryInput}
              onChange={(e) => setSkuQueryInput(e.target.value)}
              className="px-3.5 py-2 bg-gray-900 border border-gray-700 text-white rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC] focus:outline-none w-full sm:w-56"
            />
            <button
              type="submit"
              disabled={isSearchingOfficialSite || !skuQueryInput.trim()}
              className="mk-gold-gradient text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md hover:opacity-95 cursor-pointer whitespace-nowrap disabled:opacity-50 flex items-center gap-1.5"
            >
              <Search className={`w-3.5 h-3.5 ${isSearchingOfficialSite ? 'animate-spin' : ''}`} />
              <span>{isSearchingOfficialSite ? 'Buscando...' : 'Buscar no Site Oficial'}</span>
            </button>
          </form>
        </div>

        {/* Resultado da Busca do Site Oficial */}
        {officialSiteSearchResult && (
          <div className="mt-3 bg-gray-900/90 border border-[#E899AC]/50 p-4 rounded-xl text-xs space-y-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#E899AC] flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{officialSiteSearchResult.message}</span>
              </span>
              <button
                onClick={() => setOfficialSiteSearchResult(null)}
                className="text-gray-400 hover:text-white text-xs cursor-pointer"
              >
                ×
              </button>
            </div>

            {officialSiteSearchResult.product && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-black/40 p-3 rounded-lg border border-gray-800 gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={officialSiteSearchResult.product.image}
                    alt={officialSiteSearchResult.product.name}
                    className="w-12 h-12 object-cover rounded-lg border border-gray-700 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-white text-xs leading-tight">{officialSiteSearchResult.product.name}</h4>
                    <span className="text-[10px] text-gray-400">SKU: {officialSiteSearchResult.product.sku} • {officialSiteSearchResult.product.category}</span>
                    <div className="text-xs font-bold text-[#E899AC]">R$ {officialSiteSearchResult.product.price.toFixed(2)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setNewProductForm({
                        name: officialSiteSearchResult.product.name,
                        sku: officialSiteSearchResult.product.sku,
                        category: officialSiteSearchResult.product.category,
                        price: officialSiteSearchResult.product.price,
                        costPrice: officialSiteSearchResult.product.costPrice,
                        image: officialSiteSearchResult.product.image,
                        description: officialSiteSearchResult.product.description,
                        isBestSeller: true
                      });
                      setIsAddModalOpen(true);
                    }}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Editar / Personalizar
                  </button>

                  <button
                    onClick={() => handleQuickAdd(officialSiteSearchResult.product)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1 cursor-pointer shadow-md"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Adicionar ao Carrinho</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Cadastrar Novo Produto */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAddProductSubmit} className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 border border-[#E899AC]/40 animate-scale-up text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif-mk text-base font-bold text-gray-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-[#B76E79]" />
                <span>Cadastrar Produto Manualmente</span>
              </h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">Nome do Produto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Batom Matte Mary Kay® Favorito Nude"
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Código SKU Oficial</label>
                <input
                  type="text"
                  placeholder="Ex: 101902"
                  value={newProductForm.sku}
                  onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Categoria *</label>
                <select
                  value={newProductForm.category}
                  onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Preço de Venda (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="Ex: 84.90"
                  value={newProductForm.price}
                  onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value, costPrice: (parseFloat(e.target.value || 0) * 0.6).toFixed(2) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Preço de Custo (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ex: 50.94"
                  value={newProductForm.costPrice}
                  onChange={(e) => setNewProductForm({ ...newProductForm, costPrice: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">URL da Imagem</label>
                <input
                  type="text"
                  placeholder="Ex: https://images.unsplash.com/..."
                  value={newProductForm.image}
                  onChange={(e) => setNewProductForm({ ...newProductForm, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">Descrição Curta</label>
                <textarea
                  rows="2"
                  placeholder="Ex: Acabamento matte perfeito e controle de oleosidade por 12h."
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="mk-gold-gradient text-white text-xs font-bold px-5 py-2 rounded-xl shadow-md cursor-pointer"
              >
                Cadastrar Produto
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filtros e Busca Local */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Categorias */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedCategory('Todas')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === 'Todas'
                ? 'bg-[#1A1A1A] text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-[#F8E8E8] border border-gray-200'
            }`}
          >
            Todas ({products.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#E899AC] text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-[#F8E8E8] border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Input de Busca no Catálogo Local */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrar por nome ou SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC] focus:outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Grid de Produtos do Catálogo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredProducts.map((product) => {
          const stockQty = product.stockCount || product.stock || 0;
          return (
            <div
              key={product.id}
              className="bg-white rounded-3xl p-4 border border-[#E899AC]/30 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#E899AC] transition-all duration-300 flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-3">
                <div className="relative overflow-hidden rounded-xl bg-gray-50 h-44 border border-gray-100 flex items-center justify-center">
                  <img
                    src={product.image || 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=600&q=80'}
                    alt={product.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Badge de Pronta-Entrega em Destaque Rosa Dourado */}
                  {stockQty > 0 ? (
                    <span className="absolute top-2 left-2 bg-[#1A1A1A] text-[#E899AC] text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md border border-[#E899AC]/40">
                      <Box className="w-3 h-3 text-emerald-400" /> Pronta-Entrega ({stockQty} un.)
                    </span>
                  ) : product.isBestSeller && (
                    <span className="absolute top-2 left-2 bg-[#1A1A1A] text-[#E899AC] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                      <Star className="w-3 h-3 fill-[#E899AC]" /> Mais Vendido
                    </span>
                  )}
                  
                  {/* Botão de Alterar Foto */}
                  <button
                    onClick={() => {
                      setEditingImageProductId(product.id);
                      setNewImageUrlInput(product.image);
                    }}
                    className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-gray-700 p-1.5 rounded-lg shadow-sm text-[10px] flex items-center gap-1 font-semibold border border-gray-200 cursor-pointer"
                    title="Alterar Foto deste produto"
                  >
                    <Image className="w-3 h-3 text-[#B76E79]" />
                    <span>Foto</span>
                  </button>
                </div>

                {/* Modal para Editar URL da Imagem do Produto */}
                {editingImageProductId === product.id && (
                  <div className="p-3 bg-[#FAF7F5] rounded-xl border border-[#E899AC]/40 space-y-2 animate-fade-in text-xs">
                    <div className="flex items-center justify-between font-bold text-gray-800 text-[11px]">
                      <span>Nova URL da Imagem:</span>
                      <button onClick={() => setEditingImageProductId(null)} className="text-gray-400 hover:text-gray-600">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Cole o link da foto (https://...)..."
                      value={newImageUrlInput}
                      onChange={(e) => setNewImageUrlInput(e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-gray-300 rounded-lg text-[11px]"
                    />
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setEditingImageProductId(null)}
                        className="px-2 py-1 text-[10px] text-gray-500 hover:bg-gray-200 rounded-md cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleSaveImageUpdate(product.id)}
                        className="bg-[#E899AC] text-white text-[10px] font-bold px-2 py-1 rounded-md cursor-pointer"
                      >
                        Salvar Foto
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] text-[#B76E79] font-semibold uppercase tracking-wider block truncate">
                      {product.category}
                    </span>
                    <span className="bg-[#1A1A1A] text-[#E899AC] text-[10px] font-bold px-2 py-0.5 rounded-md font-mono shrink-0 shadow-xs">
                      Cód. #{product.sku}
                    </span>
                  </div>
                  <h3 className="font-bold text-xs text-gray-900 leading-snug line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                    {product.description}
                  </p>
                </div>

                {/* Controle de Estoque Físico em Mãos */}
                <div className="bg-[#FAF7F5] p-2.5 rounded-xl border border-gray-100 flex items-center justify-between gap-2 text-xs">
                  <span className="text-[10px] font-bold text-gray-600 flex items-center gap-1">
                    <Box className="w-3.5 h-3.5 text-[#B76E79]" />
                    <span>Em Estoque Mãos:</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleStockChange(product, -1)}
                      className="w-6 h-6 rounded-md bg-white border border-gray-200 text-gray-700 font-bold flex items-center justify-center hover:bg-gray-100 cursor-pointer text-xs"
                      title="Diminuir estoque"
                    >
                      -
                    </button>
                    <span className="font-bold font-mono text-gray-900 text-xs px-1">
                      {stockQty}
                    </span>
                    <button
                      onClick={() => handleStockChange(product, 1)}
                      className="w-6 h-6 rounded-md bg-[#E899AC] text-white font-bold flex items-center justify-center hover:bg-[#d8879a] cursor-pointer text-xs shadow-xs"
                      title="Adicionar ao estoque físico"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Preço e Ação */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block">Preço Oficial MK</span>
                  <span className="text-sm font-bold text-gray-900">R$ {product.price.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => handleQuickAdd(product)}
                  className={`p-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    addedItemNotice === product.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#F8E8E8] text-[#B76E79] hover:bg-[#E899AC] hover:text-white'
                  }`}
                  title="Adicionar ao carrinho ativo"
                >
                  {addedItemNotice === product.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="text-[10px]">Adicionado!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span className="text-[10px]">Adicionar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}