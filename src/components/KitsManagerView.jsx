import React, { useState } from 'react';
import { Package, Sparkles, Plus, Trash2, ShoppingBag, Check, Tag, Search, DollarSign, X, Edit2, Upload } from 'lucide-react';

const PRESET_KITS = [
  {
    id: 'kit-timewise-3d',
    name: 'Kit Sistema TimeWise® 3D 4 em 1',
    category: 'Cuidados com a Pele (TimeWise 3D)',
    originalPrice: 389.60,
    bundlePrice: 349.90,
    savings: 39.70,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    description: 'Tratamento facial completo de 4 passos: Gel de Limpeza 4 em 1 + Hidratante Antioxidante + Solução Diurna FPS 30 + Solução Noturna.',
    items: [
      { sku: '101903', name: 'Gel de Limpeza 4 em 1 TimeWise® 3D', price: 79.90 },
      { sku: '101905', name: 'Hidratante Antioxidante TimeWise® 3D', price: 99.90 },
      { sku: '101912', name: 'Solução Diurna FPS 30 TimeWise® 3D', price: 104.90 },
      { sku: '101913', name: 'Solução Noturna TimeWise® 3D', price: 104.90 }
    ]
  },
  {
    id: 'kit-labios-de-seda',
    name: 'Kit Lábios de Seda Satin Lips®',
    category: 'Corpo & Lábios de Seda',
    originalPrice: 114.80,
    bundlePrice: 99.90,
    savings: 14.90,
    image: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=600&q=80',
    description: 'Renovação labial em 2 passos simples: Esfoliante com Cristais de Açúcar + Bálsamo com Manteiga de Karité.',
    items: [
      { sku: '10123401', name: 'Esfoliante para os Lábios Satin Lips®', price: 57.40 },
      { sku: '10123402', name: 'Bálsamo para os Lábios Satin Lips®', price: 57.40 }
    ]
  },
  {
    id: 'kit-maos-de-seda',
    name: 'Kit Mãos de Seda Satin Hands® Karité',
    category: 'Corpo & Lábios de Seda',
    originalPrice: 199.90,
    bundlePrice: 169.90,
    savings: 30.00,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    description: 'Tratamento SPA de mãos em 3 passos com Manteiga de Karité: Cera Protetora + Esfoliante em Gel + Creme para Mãos.',
    items: [
      { sku: '10123403', name: 'Cera Protetora para Mãos Satin Hands®', price: 59.90 },
      { sku: '10123404', name: 'Esfoliante em Gel para Mãos Karité', price: 69.90 },
      { sku: '10123405', name: 'Creme para Mãos Karité Satin Hands®', price: 69.90 }
    ]
  },
  {
    id: 'kit-microdermoabrasao',
    name: 'Kit Microdermoabrasão TimeWise®',
    category: 'Cuidados com a Pele (TimeWise 3D)',
    originalPrice: 279.80,
    bundlePrice: 249.90,
    savings: 29.90,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    description: 'Peeling de Cristais de Alumina profissional em casa: Passo 1 Refinar + Passo 2 Restaurar Sérum Nutritivo.',
    items: [
      { sku: '100724', name: 'Microdermoabrasão Passo 1 Refinar', price: 139.90 },
      { sku: '100725', name: 'Microdermoabrasão Passo 2 Restaurar', price: 139.90 }
    ]
  },
  {
    id: 'kit-make-perfeita',
    name: 'Kit Maquiagem Pele Impecável Mary Kay®',
    category: 'Maquiagem (Bases, Batons, Olhos)',
    originalPrice: 190.70,
    bundlePrice: 169.90,
    savings: 20.80,
    image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=600&q=80',
    description: 'O tridente indispensável da maquiagem: Base TimeWise 3D + Esponja Ergonômica em Gota + Corretivo Amarelo Yellow.',
    items: [
      { sku: '10142659', name: 'Base TimeWise 3D® 30ml (Tom à escolha)', price: 84.90 },
      { sku: '10248713', name: 'Esponja para Maquiagem Mary Kay®', price: 39.90 },
      { sku: '10214615', name: 'Corretivo Mary Kay® - Yellow', price: 65.90 }
    ]
  },
  {
    id: 'kit-volufirm-repair',
    name: 'Kit Volu-Firm® TimeWise Repair® Antissinais Avançado',
    category: 'Linha Repair & Volu-Firm',
    originalPrice: 629.50,
    bundlePrice: 549.90,
    savings: 79.60,
    image: 'https://images.unsplash.com/photo-1512290900676-26c2a4d495c8?auto=format&fit=crop&w=600&q=80',
    description: 'Tratamento de alta firmeza antissinais profundo: Espuma de Limpeza + Sérum Lifting + Cremes Diurno FPS 30 e Noturno com Retinol + Olhos.',
    items: [
      { sku: '100901', name: 'Espuma de Limpeza Volu-Firm® Repair®', price: 95.90 },
      { sku: '100903', name: 'Creme Diurno FPS 30 Volu-Firm® Repair®', price: 169.90 },
      { sku: '100904', name: 'Creme Noturno Volu-Firm® Repair® com Retinol', price: 169.90 },
      { sku: '100905', name: 'Creme para Área dos Olhos Volu-Firm® Repair®', price: 149.90 }
    ]
  }
];

export default function KitsManagerView({ kits: kitsProp = [], products = [], onAddKitToCart, onSaveKit, onDeleteKit }) {
  const kits = (kitsProp && kitsProp.length > 0) ? kitsProp : PRESET_KITS;
  const [isCreatingCustomKit, setIsCreatingCustomKit] = useState(false);
  const [editingKitId, setEditingKitId] = useState(null);
  const [productSearch, setProductSearch] = useState('');
  const [selectedKitProducts, setSelectedKitProducts] = useState([]);
  const [customKitForm, setCustomKitForm] = useState({
    name: '',
    bundlePrice: '',
    description: '',
    image: ''
  });
  const [addedKitNotice, setAddedKitNotice] = useState(null);

  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomKitForm(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Filtrar produtos para selecionar no kit
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase())) ||
    (p.category && p.category.toLowerCase().includes(productSearch.toLowerCase()))
  );

  const handleAddProductToKit = (product) => {
    const existing = selectedKitProducts.find(p => p.id === product.id);
    if (existing) {
      setSelectedKitProducts(selectedKitProducts.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p));
    } else {
      setSelectedKitProducts([...selectedKitProducts, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveProductFromKit = (productId) => {
    setSelectedKitProducts(selectedKitProducts.filter(p => p.id !== productId));
  };

  const handleProductQuantityChange = (productId, delta) => {
    setSelectedKitProducts(selectedKitProducts.map(p => {
      if (p.id === productId) {
        const next = p.quantity + delta;
        return next > 0 ? { ...p, quantity: next } : null;
      }
      return p;
    }).filter(Boolean));
  };

  const totalOriginalPrice = selectedKitProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleAddKit = (kit) => {
    if (onAddKitToCart) {
      onAddKitToCart(kit);
      setAddedKitNotice(kit.id);
      setTimeout(() => setAddedKitNotice(null), 2500);
    }
  };

  const handleDeleteKit = (kitId) => {
    if (window.confirm('Deseja realmente excluir este kit promocional?')) {
      if (onDeleteKit) {
        onDeleteKit(kitId);
      }
    }
  };

  const handleCreateCustomSubmit = (e) => {
    e.preventDefault();
    if (!customKitForm.name) return;

    const bundleVal = parseFloat(customKitForm.bundlePrice) || (totalOriginalPrice > 0 ? totalOriginalPrice * 0.85 : 99.90);

    const kitPayload = {
      id: editingKitId || ('custom-kit-' + Date.now()),
      name: customKitForm.name,
      category: 'Kits & Combos Especiais',
      bundlePrice: bundleVal,
      originalPrice: totalOriginalPrice > 0 ? totalOriginalPrice : bundleVal * 1.15,
      savings: Math.max(0, (totalOriginalPrice > 0 ? totalOriginalPrice : bundleVal * 1.15) - bundleVal),
      image: customKitForm.image || (selectedKitProducts[0]?.image) || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
      description: customKitForm.description || `Kit promocional contendo ${selectedKitProducts.length} produtos selecionados.`,
      items: selectedKitProducts.length > 0 
        ? selectedKitProducts.map(p => ({ sku: p.sku || p.id, name: `${p.name} (x${p.quantity})`, price: p.price }))
        : [{ sku: 'KIT-CUSTOM', name: customKitForm.name, price: bundleVal }]
    };

    if (onSaveKit) {
      onSaveKit(kitPayload);
    }

    setCustomKitForm({ name: '', bundlePrice: '', description: '', image: '' });
    setSelectedKitProducts([]);
    setIsCreatingCustomKit(false);
    setEditingKitId(null);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Página */}
      <div className="bg-white p-6 rounded-3xl border border-[#E899AC]/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl mk-gold-gradient text-white flex items-center justify-center shadow-md shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif-mk text-xl font-bold text-gray-900 flex items-center gap-2">
              <span>Pacotes Promocionais & Criador de Kits</span>
              <span className="bg-[#F8E8E8] text-[#B76E79] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#E899AC]/40">
                {kits.length} Kits Ativos
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Monte combos promocionais com produtos reais do catálogo e insira direto no carrinho das clientes!
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreatingCustomKit(!isCreatingCustomKit)}
          className="mk-gold-gradient text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreatingCustomKit ? 'Fechar Criador de Kits' : '+ Criar Novo Kit Personalizado'}</span>
        </button>
      </div>

      {/* Painel de Criação de Kit Personalizado */}
      {isCreatingCustomKit && (
        <div className="bg-white p-6 rounded-3xl border-2 border-[#E899AC] shadow-xl space-y-6 animate-fade-in">
          <div className="border-b pb-3 flex items-center justify-between">
            <h3 className="font-serif-mk text-base font-bold text-gray-900 flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#B76E79]" />
              <span>Criar Novo Combo / Kit com Produtos do Catálogo</span>
            </h3>
            <span className="text-xs text-[#B76E79] font-bold bg-[#F8E8E8] px-3 py-1 rounded-full">
              {selectedKitProducts.length} produtos adicionados ao kit
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Coluna Esquerda: Buscar e Escolher Produtos do Catálogo */}
            <div className="lg:col-span-7 space-y-4">
              <h4 className="font-bold text-xs text-gray-800 uppercase tracking-wider">
                1. Selecione os produtos do catálogo para incluir neste kit:
              </h4>

              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquisar produto por nome ou código..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC] focus:outline-none"
                />
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 border border-gray-100 p-2 rounded-2xl bg-gray-50/50">
                {filteredProducts.map(p => {
                  const inKit = selectedKitProducts.find(item => item.id === p.id);
                  return (
                    <div key={p.id} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-[#E899AC]/50 transition-all">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-gray-100" />
                        <div>
                          <h5 className="font-semibold text-xs text-gray-900 leading-tight">{p.name}</h5>
                          <span className="text-[10px] text-gray-400">Cód: {p.sku || p.id} • R$ {Number(p.price || 0).toFixed(2)}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddProductToKit(p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          inKit ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-[#E899AC] text-white hover:bg-[#B76E79]'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{inKit ? `Incluso (${inKit.quantity})` : 'Adicionar'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Coluna Direita: Resumo do Kit & Definição de Preço */}
            <div className="lg:col-span-5 bg-[#FAF7F5] p-5 rounded-2xl border border-[#E899AC]/40 space-y-4">
              <h4 className="font-bold text-xs text-gray-800 uppercase tracking-wider">
                2. Configuração do Kit Personalizado:
              </h4>

              <form onSubmit={handleCreateCustomSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Nome do Kit / Combo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Kit Cuidados Anti-Idade Especial"
                    value={customKitForm.name}
                    onChange={(e) => setCustomKitForm({ ...customKitForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
                  />
                </div>

                {/* Produtos Incluídos */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Produtos no Combo ({selectedKitProducts.length}):</label>
                  {selectedKitProducts.length === 0 ? (
                    <p className="text-[11px] text-gray-400 italic bg-white p-3 rounded-xl border border-dashed text-center">
                      Nenhum produto selecionado. Clique em "Adicionar" na lista ao lado!
                    </p>
                  ) : (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto bg-white p-2 rounded-xl border border-gray-200">
                      {selectedKitProducts.map(item => (
                        <div key={item.id} className="flex items-center justify-between text-[11px] bg-gray-50 p-2 rounded-lg">
                          <span className="font-semibold text-gray-800 truncate max-w-[150px]">{item.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center border rounded bg-white">
                              <button type="button" onClick={() => handleProductQuantityChange(item.id, -1)} className="px-1 text-gray-600 font-bold">-</button>
                              <span className="px-1 font-bold">{item.quantity}</span>
                              <button type="button" onClick={() => handleProductQuantityChange(item.id, 1)} className="px-1 text-gray-600 font-bold">+</button>
                            </div>
                            <span className="font-bold text-[#B76E79]">R$ {(item.price * item.quantity).toFixed(2)}</span>
                            <button type="button" onClick={() => handleRemoveProductFromKit(item.id)} className="text-gray-400 hover:text-red-500">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Soma dos Preços Originais:</span>
                    <span className="font-bold text-gray-900">R$ {totalOriginalPrice.toFixed(2)}</span>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Preço Especial do Combo (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder={`Ex: ${(totalOriginalPrice * 0.85).toFixed(2)}`}
                      value={customKitForm.bundlePrice}
                      onChange={(e) => setCustomKitForm({ ...customKitForm, bundlePrice: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#E899AC] rounded-xl font-bold text-sm text-[#B76E79] focus:ring-2 focus:ring-[#E899AC]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Foto do Kit (Upload do Computador ou URL)</label>
                  <div className="flex items-center gap-2">
                    <label className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm">
                      <Upload className="w-4 h-4 text-[#B76E79]" />
                      <span>Subir Foto do PC</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Ou cole a URL da imagem aqui..."
                      value={customKitForm.image}
                      onChange={(e) => setCustomKitForm({ ...customKitForm, image: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC]"
                    />
                  </div>
                  {customKitForm.image && (
                    <div className="mt-2 flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-200">
                      <img src={customKitForm.image} alt="Preview Kit" className="w-10 h-10 object-cover rounded-lg border" />
                      <span className="text-[10px] text-gray-500 font-bold">Foto selecionada para o kit</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Descrição Curta (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ex: Combo exclusivo com 15% de desconto para presente."
                    value={customKitForm.description}
                    onChange={(e) => setCustomKitForm({ ...customKitForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingCustomKit(false);
                      setEditingKitId(null);
                    }}
                    className="px-4 py-2 text-gray-500 hover:bg-gray-200 rounded-xl cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="mk-gold-gradient text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md cursor-pointer"
                  >
                    {editingKitId ? 'Salvar Alterações no Kit' : 'Salvar Kit Promocional'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Grid dos Kits Disponíveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kits.map(kit => {
          const isAdded = addedKitNotice === kit.id;
          return (
            <div key={kit.id} className="bg-white p-5 rounded-3xl border border-[#E899AC]/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
              
              <div className="space-y-3">
                {/* Foto e Badge do Kit */}
                <div className="relative h-48 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
                  <img
                    src={kit.image}
                    alt={kit.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-[#1A1A1A]/80 backdrop-blur-md text-[#E899AC] text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-[#E899AC]/30">
                    <Sparkles className="w-3 h-3 fill-[#E899AC]" />
                    <span>{kit.category}</span>
                  </div>

                  {kit.savings > 0 && (
                    <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
                      Economia R$ {kit.savings.toFixed(2)}
                    </div>
                  )}
                </div>

                {/* Nome e Descrição */}
                <div>
                  <h4 className="font-bold text-sm text-gray-900 leading-snug">{kit.name}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{kit.description}</p>
                </div>

                {/* Itens Inclusos no Combo */}
                {kit.items && kit.items.length > 0 && (
                  <div className="bg-[#FAF7F5] p-3 rounded-xl border border-gray-100 space-y-1 text-[11px]">
                    <span className="font-bold text-gray-700 text-[10px] uppercase tracking-wider block">Produtos no Combo:</span>
                    {kit.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-gray-600">
                        <span className="truncate max-w-[200px]">• {it.name}</span>
                        <span className="font-semibold text-gray-800">R$ {Number(it.price || 0).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Preços e Ação */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <div>
                  {kit.originalPrice > kit.bundlePrice && (
                    <span className="text-xs text-gray-400 line-through block">
                      R$ {kit.originalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-lg font-black font-serif-mk text-[#B76E79]">
                    R$ {kit.bundlePrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingKitId(kit.id);
                      setCustomKitForm({
                        name: kit.name,
                        bundlePrice: String(kit.bundlePrice),
                        description: kit.description || '',
                        image: kit.image || ''
                      });
                      setIsCreatingCustomKit(true);
                    }}
                    className="p-2 text-gray-400 hover:text-[#B76E79] hover:bg-[#F8E8E8] rounded-xl transition-colors cursor-pointer"
                    title="Editar este kit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteKit(kit.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    title="Excluir este kit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleAddKit(kit)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'mk-gold-gradient hover:opacity-95 text-white'
                    }`}
                  >
                    {isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                    <span>{isAdded ? 'Kit Adicionado!' : 'Incluir'}</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
