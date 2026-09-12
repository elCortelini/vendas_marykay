import React, { useState } from 'react';
import { Sparkles, Download, Share2, X, Check, ShoppingBag, Heart, Star, Tag } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function MarketingFlyerModal({ isOpen, onClose, products, consultant }) {
  const [selectedProductIds, setSelectedProductIds] = useState(() => {
    return products.slice(0, 4).map(p => p.id);
  });
  const [flyerTitle, setFlyerTitle] = useState(`Queridinhos da Semana ${consultant?.name || 'Mary Kay®'}`);
  const [flyerSubtitle, setFlyerSubtitle] = useState('Edição Especial Itajaí e Região • Pronta-Entrega!');
  const [customBadgeText, setCustomBadgeText] = useState('Ofertas Imperdíveis');
  const [flyerProductSearch, setFlyerProductSearch] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const selectedProducts = products.filter(p => selectedProductIds.includes(p.id));

  const toggleProductSelection = (id) => {
    if (selectedProductIds.includes(id)) {
      if (selectedProductIds.length > 1) {
        setSelectedProductIds(selectedProductIds.filter(pId => pId !== id));
      }
    } else {
      if (selectedProductIds.length < 6) {
        setSelectedProductIds([...selectedProductIds, id]);
      }
    }
  };

  const handleDownloadFlyer = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById('marketing-flyer-canvas');
      if (!element) return;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#FAF7F5' });
      const link = document.createElement('a');
      link.download = `panfleto_marketing_marykay_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Erro ao gerar imagem do panfleto:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareWhatsapp = () => {
    let msg = `✨ *${flyerTitle}* ✨\n_${flyerSubtitle}_\n\n💖 *Confira os destaques da semana da Consultora ${consultant?.name || 'Mary Kay®'}:*\n\n`;
    selectedProducts.forEach(p => {
      msg += `• *${p.name}*: R$ ${p.price.toFixed(2)}\n`;
    });
    msg += `\n📲 *Garanta o seu na Pronta-Entrega!* Fale comigo no WhatsApp!`;
    const encoded = encodeURIComponent(msg);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-[#E899AC]/40 flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
        
        {/* Painel Esquerdo: Opções de Customização */}
        <div className="w-full md:w-1/2 p-5 border-b md:border-b-0 md:border-r border-gray-100 overflow-y-auto space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-mk text-base font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#B76E79]" />
              <span>Gerador de Panfletos & Marketing</span>
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Título do Panfleto</label>
              <input
                type="text"
                value={flyerTitle}
                onChange={(e) => setFlyerTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Subtítulo / Chamada</label>
              <input
                type="text"
                value={flyerSubtitle}
                onChange={(e) => setFlyerSubtitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Selo de Destaque</label>
              <input
                type="text"
                value={customBadgeText}
                onChange={(e) => setCustomBadgeText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Selecione até 6 produtos para o Panfleto ({selectedProductIds.length}/6 selecionados)
              </label>

              {/* Busca de Produtos para o Panfleto */}
              <div className="relative mb-2">
                <input
                  type="text"
                  placeholder="Pesquisar produto por nome, linha ou código..."
                  value={flyerProductSearch}
                  onChange={(e) => setFlyerProductSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC]"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              </div>

              <div className="max-h-52 overflow-y-auto space-y-1.5 border border-gray-200 p-2 rounded-xl bg-gray-50">
                {products
                  .filter(p => p.name.toLowerCase().includes(flyerProductSearch.toLowerCase()) || (p.sku && p.sku.includes(flyerProductSearch)))
                  .slice(0, 50)
                  .map(p => {
                    const isSelected = selectedProductIds.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggleProductSelection(p.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#F8E8E8] border border-[#E899AC] text-gray-900 font-bold shadow-sm'
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <img src={p.image} alt={p.name} className="w-8 h-8 object-cover rounded-md border border-gray-200 shrink-0" />
                          <div className="truncate">
                            <span className="block truncate font-semibold">{p.name}</span>
                            <span className="text-[10px] text-gray-400">R$ {Number(p.price || 0).toFixed(2)}</span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#B76E79] shrink-0 font-bold" />}
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            <button
              onClick={handleDownloadFlyer}
              disabled={isGenerating}
              className="mk-gold-gradient text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md hover:opacity-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Baixando Imagem...' : 'Baixar Panfleto em Imagem (PNG)'}</span>
            </button>

            <button
              onClick={handleShareWhatsapp}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Enviar Texto Promocional no WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Painel Direito: Preview do Panfleto Luxo */}
        <div className="w-full md:w-1/2 p-6 bg-[#FAF7F5] overflow-y-auto flex flex-col items-center justify-center">
          <div
            id="marketing-flyer-canvas"
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-xl border-2 border-[#E899AC]/40 space-y-4 relative overflow-hidden"
          >
            {/* Elementos Decorativos */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E899AC]/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#B76E79]/10 rounded-full blur-2xl"></div>

            {/* Cabeçalho do Panfleto */}
            <div className="text-center space-y-2 relative z-10">
              <div className="flex items-center justify-center gap-2">
                <img
                  src={consultant?.avatar || '/images/tailise_avatar.png'}
                  alt={consultant?.name || 'Tailise'}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#B76E79] shadow-md"
                />
                <div className="text-left">
                  <span className="bg-[#1A1A1A] text-[#E899AC] text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full inline-block">
                    {customBadgeText}
                  </span>
                  <h4 className="font-serif-mk text-xs font-bold text-gray-900 mt-0.5">Consultora {consultant?.name || 'Tailise'}</h4>
                  <p className="text-[10px] text-gray-500">{consultant?.region || 'Itajaí e região'}</p>
                </div>
              </div>

              <div className="border-t border-b border-[#E899AC]/30 py-2 my-1">
                <h2 className="font-serif-mk text-sm font-extrabold text-gray-900 leading-tight">
                  {flyerTitle}
                </h2>
                <p className="text-[10px] text-[#B76E79] font-medium mt-0.5">{flyerSubtitle}</p>
              </div>
            </div>

            {/* Grid dos Produtos no Panfleto */}
            <div className={`grid gap-3 relative z-10 ${selectedProducts.length > 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {selectedProducts.map(p => (
                <div key={p.id} className="bg-[#FAF7F5] rounded-xl p-2.5 border border-[#E899AC]/30 flex flex-col justify-between space-y-2 text-center group">
                  <div className="h-24 overflow-hidden rounded-lg bg-white flex items-center justify-center p-1 border border-gray-100">
                    <img src={p.image} alt={p.name} className="h-full object-cover rounded-md" />
                  </div>
                  <div>
                    <h5 className="font-bold text-[11px] text-gray-900 line-clamp-2 leading-tight">{p.name}</h5>
                    <span className="text-[9px] text-[#B76E79] font-semibold block uppercase mt-0.5">{p.category}</span>
                    <div className="text-xs font-black text-gray-900 mt-1">R$ {p.price.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Rodapé do Panfleto */}
            <div className="text-center pt-3 border-t border-gray-100 relative z-10 space-y-1">
              <p className="text-[10px] font-bold text-gray-800 flex items-center justify-center gap-1">
                <ShoppingBag className="w-3 h-3 text-[#B76E79]" />
                <span>Garanta o seu produto com entrega rápida em Itajaí!</span>
              </p>
              <p className="text-[9px] text-gray-500">
                WhatsApp: {consultant?.phone || '(47) 99999-8888'} • Mary Kay® Brasil
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
