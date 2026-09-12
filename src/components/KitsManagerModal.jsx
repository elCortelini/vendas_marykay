import React, { useState } from 'react';
import { Package, Sparkles, Plus, Trash2, X, ShoppingBag, Check, Heart, ShieldCheck, Tag } from 'lucide-react';

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

export default function KitsManagerModal({ isOpen, onClose, onAddKitToCart }) {
  const [kits, setKits] = useState(PRESET_KITS);
  const [isCreatingCustomKit, setIsCreatingCustomKit] = useState(false);
  const [customKitForm, setCustomKitForm] = useState({
    name: '',
    bundlePrice: '',
    description: '',
    image: ''
  });
  const [addedKitNotice, setAddedKitNotice] = useState(null);

  if (!isOpen) return null;

  const handleAddKit = (kit) => {
    if (onAddKitToCart) {
      onAddKitToCart(kit);
      setAddedKitNotice(kit.id);
      setTimeout(() => setAddedKitNotice(null), 2500);
    }
  };

  const handleDeleteKit = (kitId) => {
    if (window.confirm('Deseja realmente excluir este kit promocional?')) {
      setKits(kits.filter(k => k.id !== kitId));
    }
  };

  const handleCreateCustomSubmit = (e) => {
    e.preventDefault();
    if (!customKitForm.name || !customKitForm.bundlePrice) return;

    const newKit = {
      id: 'custom-kit-' + Date.now(),
      name: customKitForm.name,
      category: 'Kits & Combos Especiais',
      bundlePrice: parseFloat(customKitForm.bundlePrice),
      originalPrice: parseFloat(customKitForm.bundlePrice) * 1.2,
      savings: parseFloat(customKitForm.bundlePrice) * 0.2,
      image: customKitForm.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
      description: customKitForm.description || 'Kit exclusivo personalizado criado pela consultora.',
      items: [
        { sku: 'KIT-CUSTOM', name: customKitForm.name, price: parseFloat(customKitForm.bundlePrice) }
      ]
    };

    setKits([newKit, ...kits]);
    setCustomKitForm({ name: '', bundlePrice: '', description: '', image: '' });
    setIsCreatingCustomKit(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-[#E899AC]/40 p-6 space-y-6 max-h-[90vh] overflow-y-auto my-auto animate-scale-up">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl mk-gold-gradient text-white flex items-center justify-center shadow-md">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif-mk text-xl font-bold text-gray-900 flex items-center gap-2">
                <span>Pacotes Promocionais & Kits de Presente</span>
                <span className="bg-[#F8E8E8] text-[#B76E79] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#E899AC]/40">
                  Ofertas Prontas
                </span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Selecione ou crie combos promocionais com descontos para incluir no carrinho do cliente com 1 clique!
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-full cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dica de Vendas & Botão Adicionar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#FAF7F5] p-4 rounded-2xl border border-[#E899AC]/30">
          <div>
            <h4 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#B76E79]" />
              <span>Dica de Vendas da Consultora Tailise</span>
            </h4>
            <p className="text-[11px] text-gray-600 mt-0.5">
              Kits possuem maior ticket médio e alta conversão para presentear em datas comemorativas!
            </p>
          </div>

          <button
            onClick={() => setIsCreatingCustomKit(!isCreatingCustomKit)}
            className="mk-gold-gradient text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Criar Novo Kit Personalizado</span>
          </button>
        </div>

        {/* Formulário de Novo Kit Customizado */}
        {isCreatingCustomKit && (
          <form onSubmit={handleCreateCustomSubmit} className="bg-white p-5 rounded-2xl border border-[#E899AC]/40 shadow-sm space-y-4 text-xs animate-fade-in">
            <h4 className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-[#B76E79]" />
              <span>Cadastrar Novo Kit Promocional Exclusivo</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nome do Kit / Combo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Kit Dia das Mães Radiante"
                  value={customKitForm.name}
                  onChange={(e) => setCustomKitForm({ ...customKitForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Preço do Combo (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="Ex: 199.90"
                  value={customKitForm.bundlePrice}
                  onChange={(e) => setCustomKitForm({ ...customKitForm, bundlePrice: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">URL da Imagem Ilustrativa</label>
                <input
                  type="text"
                  placeholder="Ex: https://images.unsplash.com/photo-1556228720-195a672e8a03"
                  value={customKitForm.image}
                  onChange={(e) => setCustomKitForm({ ...customKitForm, image: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">Descrição / Itens do Kit</label>
                <input
                  type="text"
                  placeholder="Ex: Inclui 1 Batom Gel Semi-Matte + 1 Sérum Vitaminado com desconto."
                  value={customKitForm.description}
                  onChange={(e) => setCustomKitForm({ ...customKitForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setIsCreatingCustomKit(false)}
                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-[#E899AC] text-white text-xs font-bold px-5 py-2 rounded-xl shadow-md cursor-pointer"
              >
                Salvar Kit no Sistema
              </button>
            </div>
          </form>
        )}

        {/* Lista de Kits Disponíveis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kits.map(kit => {
            const isAdded = addedKitNotice === kit.id;
            return (
              <div key={kit.id} className="bg-white p-5 rounded-3xl border border-[#E899AC]/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
                
                <div className="space-y-3">
                  {/* Foto & Imagem do Kit */}
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
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

                  {/* Lista de Itens do Combo */}
                  {kit.items && kit.items.length > 0 && (
                    <div className="bg-[#FAF7F5] p-3 rounded-xl border border-gray-100 space-y-1 text-[11px]">
                      <span className="font-bold text-gray-700 text-[10px] uppercase tracking-wider block">Itens Inclusos no Combo:</span>
                      {kit.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-gray-600">
                          <span className="truncate max-w-[200px]">• {it.name}</span>
                          <span className="font-semibold text-gray-800">R$ {it.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Preços e Ação de Adicionar ao Carrinho */}
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

                  <div className="flex items-center gap-1.5">
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
    </div>
  );
}
