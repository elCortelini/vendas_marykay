import React, { useState } from 'react';
import { Gift, Star, Plus, Trash2, Check, Award, Users, Search, Minus, Heart, ShieldCheck, Upload, Box } from 'lucide-react';

export default function LoyaltyManagerView({ rewards = [], clients = [], products = [], onAddReward, onDeleteReward, onUpdateClientPoints }) {
  const [clientSearch, setClientSearch] = useState('');
  const [skuInput, setSkuInput] = useState('');
  const [newRewardForm, setNewRewardForm] = useState({
    name: '',
    pointsRequired: '',
    description: '',
    image: '',
    sku: ''
  });
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [redemptionNotice, setRedemptionNotice] = useState(null);

  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewRewardForm(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSkuLookup = () => {
    const cleanSku = skuInput.trim();
    if (!cleanSku) return;

    const found = (products || []).find(p => p.sku === cleanSku || p.id === cleanSku || (p.sku && p.sku.toUpperCase() === cleanSku.toUpperCase()));
    if (found) {
      setNewRewardForm(prev => ({
        ...prev,
        sku: found.sku || cleanSku,
        name: found.name,
        pointsRequired: String(Math.round(found.price || 100)),
        description: found.description || `Brinde exclusivo Mary Kay® (SKU #${found.sku}).`,
        image: found.image || prev.image
      }));
    } else {
      alert(`Produto com SKU #${cleanSku} não encontrado no catálogo local. Você pode preencher os dados manualmente.`);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    (c.phone && c.phone.toLowerCase().includes(clientSearch.toLowerCase()))
  );

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newRewardForm.name || !newRewardForm.pointsRequired) return;
    if (onAddReward) {
      onAddReward({
        name: newRewardForm.name,
        sku: newRewardForm.sku || '',
        pointsRequired: parseInt(newRewardForm.pointsRequired),
        description: newRewardForm.description,
        image: newRewardForm.image || 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80'
      });
    }
    setNewRewardForm({ name: '', pointsRequired: '', description: '', image: '', sku: '' });
    setSkuInput('');
    setIsAddFormOpen(false);
  };

  const handleRedeemRewardForClient = (client, reward) => {
    const currentPoints = client.loyaltyPoints || Math.floor((client.totalSpent || 0) / 10);
    if (currentPoints < reward.pointsRequired) {
      alert(`A cliente ${client.name} possui ${currentPoints} pontos, mas necessita de ${reward.pointsRequired} pontos para resgatar este brinde.`);
      return;
    }

    if (onUpdateClientPoints) {
      onUpdateClientPoints(client.id, currentPoints - reward.pointsRequired);
    }
    setRedemptionNotice(`Brinde "${reward.name}" resgatado com sucesso para ${client.name}!`);
    setTimeout(() => setRedemptionNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Toast de Resgate */}
      {redemptionNotice && (
        <div className="bg-emerald-900 text-white p-4 rounded-2xl shadow-lg border border-emerald-500 font-bold text-xs flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-emerald-300" />
            <span>{redemptionNotice}</span>
          </div>
          <button onClick={() => setRedemptionNotice(null)} className="text-white hover:text-emerald-200">×</button>
        </div>
      )}

      {/* Cabeçalho da Seção */}
      <div className="bg-white p-6 rounded-3xl border border-[#E899AC]/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F8E8E8] text-[#B76E79] flex items-center justify-center border border-[#E899AC]/40 shadow-sm shrink-0">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif-mk text-xl font-bold text-gray-900 flex items-center gap-2">
              <span>Área de Fidelidade VIP & Recompensas</span>
              <span className="bg-[#1A1A1A] text-[#E899AC] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                1 Ponto por R$ 1,00 Gasto (R$ 1 = 1 Ponto)
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Gerencie a pontuação acumulada das clientes e configure os mimos e brindes exclusivos para resgate!
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddFormOpen(!isAddFormOpen)}
          className="mk-gold-gradient text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ Cadastrar Novo Brinde / Prêmio</span>
        </button>
      </div>

      {/* Form de Cadastro de Novo Brinde */}
      {isAddFormOpen && (
        <form onSubmit={handleAddSubmit} className="bg-white p-6 rounded-3xl border-2 border-[#E899AC] shadow-xl space-y-4 text-xs animate-fade-in">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2 border-b pb-3">
            <Award className="w-5 h-5 text-[#B76E79]" />
            <span>Cadastrar Novo Brinde para o Programa de Fidelidade</span>
          </h3>

          {/* Busca Rápida por Código SKU */}
          <div className="bg-[#FAF7F5] p-3.5 rounded-2xl border border-[#E899AC]/30 space-y-2">
            <label className="block font-bold text-gray-800 flex items-center gap-1.5">
              <Box className="w-4 h-4 text-[#B76E79]" />
              <span>Incluir Produto por Código SKU (Preenchimento Automático):</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Digite o código SKU do produto (ex: 101903)..."
                value={skuInput}
                onChange={(e) => setSkuInput(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={handleSkuLookup}
                className="bg-[#1A1A1A] hover:bg-black text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shrink-0 cursor-pointer"
              >
                Buscar Código
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Nome do Brinde / Recompensa *</label>
              <input
                type="text"
                required
                placeholder="Ex: Batom Gel Semi-Matte (Cor à Escolha)"
                value={newRewardForm.name}
                onChange={(e) => setNewRewardForm({ ...newRewardForm, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Pontos Necessários para Resgate *</label>
              <input
                type="number"
                required
                placeholder="Ex: 100"
                value={newRewardForm.pointsRequired}
                onChange={(e) => setNewRewardForm({ ...newRewardForm, pointsRequired: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">Foto do Brinde (Upload do Computador ou URL)</label>
              <div className="flex items-center gap-2">
                <label className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm">
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
                  value={newRewardForm.image}
                  onChange={(e) => setNewRewardForm({ ...newRewardForm, image: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
                />
              </div>
              {newRewardForm.image && (
                <div className="mt-2 flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
                  <img src={newRewardForm.image} alt="Preview Brinde" className="w-10 h-10 object-cover rounded-lg border" />
                  <span className="text-[10px] text-gray-500 font-bold">Foto selecionada para o brinde</span>
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">Descrição Curta</label>
              <input
                type="text"
                placeholder="Ex: Ganhe 1 batom em gel exclusivo nas compras acumuladas."
                value={newRewardForm.description}
                onChange={(e) => setNewRewardForm({ ...newRewardForm, description: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => setIsAddFormOpen(false)}
              className="px-4 py-2 text-gray-500 hover:bg-gray-200 rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="mk-gold-gradient text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md cursor-pointer"
            >
              Salvar Brinde no Sistema
            </button>
          </div>
        </form>
      )}

      {/* Grid em 2 Colunas: Esquerda (Brindes) e Direita (Pontos por Cliente) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Coluna Esquerda: Brindes Disponíveis */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-[#E899AC]/30 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm font-serif-mk text-gray-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#B76E79]" />
                <span>Brindes e Recompensas ({rewards.length})</span>
              </h3>
            </div>

            {rewards.length === 0 ? (
              <div className="text-center py-8 text-xs text-gray-400 border border-dashed rounded-2xl">
                Nenhum brinde configurado ainda. Clique no botão acima para adicionar!
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {rewards.map(reward => (
                  <div key={reward.id} className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-3 hover:border-[#E899AC]/40 transition-all">
                    <div className="flex items-center gap-3">
                      <img src={reward.image} alt={reward.name} className="w-14 h-14 object-cover rounded-xl border border-gray-200 shrink-0" />
                      <div>
                        <span className="bg-[#1A1A1A] text-[#E899AC] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 w-max">
                          <Star className="w-3 h-3 fill-[#E899AC]" /> {reward.pointsRequired} Pontos
                        </span>
                        <h4 className="font-bold text-xs text-gray-900 leading-tight mt-1">{reward.name}</h4>
                        {reward.description && <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{reward.description}</p>}
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteReward && onDeleteReward(reward.id)}
                      className="text-gray-300 hover:text-red-500 p-2 rounded-lg cursor-pointer transition-colors shrink-0"
                      title="Remover este brinde"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Coluna Direita: Clientes & Resgate de Pontos */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-[#E899AC]/30 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-3">
              <h3 className="font-bold text-sm font-serif-mk text-gray-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#B76E79]" />
                <span>Pontuação Acumulada das Clientes ({clients.length})</span>
              </h3>

              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar cliente..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredClients.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-400 border border-dashed rounded-2xl">
                  Nenhuma cliente encontrada.
                </div>
              ) : (
                filteredClients.map(c => {
                  const points = c.loyaltyPoints !== undefined ? c.loyaltyPoints : Math.floor((c.totalSpent || 0) / 10);
                  
                  return (
                    <div key={c.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#F8E8E8] text-[#B76E79] font-bold text-sm flex items-center justify-center border border-[#E899AC]/40 shrink-0">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-gray-900">{c.name}</h4>
                            <p className="text-[10px] text-gray-500">Total Comprado: R$ {(c.totalSpent || 0).toFixed(2)} • Tel: {c.phone || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="bg-[#1A1A1A] text-[#E899AC] text-xs font-black px-3.5 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                            <Star className="w-3.5 h-3.5 fill-[#E899AC]" />
                            <span>{points} Pontos</span>
                          </span>
                        </div>
                      </div>

                      {/* Botões de Resgate Rápido para esta Cliente */}
                      {rewards.length > 0 && (
                        <div className="pt-2 border-t border-gray-200 flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-bold text-gray-600 block mr-1">Resgatar Brinde:</span>
                          {rewards.map(reward => {
                            const canRedeem = points >= reward.pointsRequired;
                            return (
                              <button
                                key={reward.id}
                                disabled={!canRedeem}
                                onClick={() => handleRedeemRewardForClient(c, reward)}
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                                  canRedeem
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                                    : 'bg-gray-200 text-gray-400 opacity-60 cursor-not-allowed'
                                }`}
                                title={canRedeem ? `Resgatar ${reward.name}` : `Faltam ${reward.pointsRequired - points} pontos`}
                              >
                                <Gift className="w-3 h-3" />
                                <span>{reward.name} ({reward.pointsRequired} pts)</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
