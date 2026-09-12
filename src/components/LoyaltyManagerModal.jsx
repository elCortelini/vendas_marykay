import { useState } from 'react';
import { Gift, Star, Plus, Trash2, X, Check, Award, ShoppingBag, Users } from 'lucide-react';

export default function LoyaltyManagerModal({ isOpen, onClose, rewards, onAddReward, onDeleteReward, clients }) {
  const [newRewardForm, setNewRewardForm] = useState({
    name: '',
    pointsRequired: '',
    description: '',
    image: ''
  });
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  if (!isOpen) return null;

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newRewardForm.name || !newRewardForm.pointsRequired) return;
    if (onAddReward) {
      onAddReward({
        name: newRewardForm.name,
        pointsRequired: parseInt(newRewardForm.pointsRequired),
        description: newRewardForm.description,
        image: newRewardForm.image || 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80'
      });
    }
    setNewRewardForm({ name: '', pointsRequired: '', description: '', image: '' });
    setIsAddFormOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-[#E899AC]/40 p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F8E8E8] text-[#B76E79] flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-mk text-lg font-bold text-gray-900">
                Programa de Fidelidade & Configuração de Brindes
              </h3>
              <p className="text-xs text-gray-500">
                Cadastre os prêmios e mimos que suas clientes podem resgatar acumulando pontos nas compras!
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Botão de Adicionar Brinde */}
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-gray-700">
            Brindes Configurados ({rewards?.length || 0})
          </span>
          <button
            onClick={() => setIsAddFormOpen(!isAddFormOpen)}
            className="mk-gold-gradient text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Cadastrar Novo Brinde</span>
          </button>
        </div>

        {/* Formulário de Novo Brinde */}
        {isAddFormOpen && (
          <form onSubmit={handleAddSubmit} className="bg-[#FAF7F5] p-4 rounded-2xl border border-[#E899AC]/40 space-y-3 animate-fade-in text-xs">
            <h4 className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#B76E79]" />
              <span>Novo Brinde / Recompensa VIP</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nome do Brinde *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Batom Gel Semi-Matte (Cor à escolha)"
                  value={newRewardForm.name}
                  onChange={(e) => setNewRewardForm({ ...newRewardForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Pontos Necessários *</label>
                <input
                  type="number"
                  required
                  placeholder="Ex: 100"
                  value={newRewardForm.pointsRequired}
                  onChange={(e) => setNewRewardForm({ ...newRewardForm, pointsRequired: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">URL da Imagem do Brinde</label>
                <input
                  type="text"
                  placeholder="Ex: https://images.unsplash.com/..."
                  value={newRewardForm.image}
                  onChange={(e) => setNewRewardForm({ ...newRewardForm, image: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">Descrição Curta</label>
                <input
                  type="text"
                  placeholder="Ex: Ganhe 1 batom gel exclusivo nas compras acumuladas."
                  value={newRewardForm.description}
                  onChange={(e) => setNewRewardForm({ ...newRewardForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddFormOpen(false)}
                className="px-3 py-1.5 text-gray-500 hover:bg-gray-200 rounded-lg cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-[#E899AC] text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-sm cursor-pointer"
              >
                Salvar Brinde
              </button>
            </div>
          </form>
        )}

        {/* Lista de Brindes Cadastrados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(!rewards || rewards.length === 0) ? (
            <div className="sm:col-span-2 text-center py-8 text-xs text-gray-400 border border-dashed rounded-2xl">
              Nenhum brinde configurado ainda. Clique em "+ Cadastrar Novo Brinde" acima!
            </div>
          ) : (
            rewards.map(reward => (
              <div key={reward.id} className="bg-white p-4 rounded-2xl border border-[#E899AC]/30 shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={reward.image} alt={reward.name} className="w-14 h-14 object-cover rounded-xl border border-gray-100 shrink-0" />
                  <div>
                    <span className="bg-[#1A1A1A] text-[#E899AC] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-max">
                      <Star className="w-3 h-3 fill-[#E899AC]" /> {reward.pointsRequired} Pontos
                    </span>
                    <h4 className="font-bold text-xs text-gray-900 leading-tight mt-1">{reward.name}</h4>
                    {reward.description && <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{reward.description}</p>}
                  </div>
                </div>

                <button
                  onClick={() => onDeleteReward && onDeleteReward(reward.id)}
                  className="text-gray-300 hover:text-red-500 p-1.5 cursor-pointer transition-colors shrink-0"
                  title="Remover brinde"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Seção de Clientes e Pontos Acumulados */}
        <div className="pt-4 border-t border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#B76E79]" />
              <span>Pontuação Acumulada das Suas Clientes VIP</span>
            </h4>
            <span className="text-[10px] text-gray-500 font-medium">
              1 ponto acumulado a cada R$ 1,00 gasto (R$ 1 = 1 Ponto)
            </span>
          </div>

          <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100 max-h-56 overflow-y-auto">
            {(!clients || clients.length === 0) ? (
              <div className="p-4 text-center text-xs text-gray-400">Nenhuma cliente cadastrada.</div>
            ) : (
              clients.map(c => {
                const points = c.loyaltyPoints !== undefined ? c.loyaltyPoints : Math.floor(c.totalSpent || 0);
                return (
                  <div key={c.id} className="p-3 bg-white flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#F8E8E8] text-[#B76E79] font-bold text-xs flex items-center justify-center border border-[#E899AC]/30">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900">{c.name}</h5>
                        <p className="text-[10px] text-gray-400">Total Comprado: R$ {(c.totalSpent || 0).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="bg-[#1A1A1A] text-[#E899AC] text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#E899AC]" /> {points} Pontos
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
