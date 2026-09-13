import React, { useState } from 'react';
import { Plus, User, Phone, Calendar, MapPin, Sparkles, Edit2, Trash2, Heart, Search, ShoppingBag, Clock, History, CheckCircle, Tag, ChevronRight } from 'lucide-react';

export default function ClientManagement({
  clients,
  carts,
  onSaveClient,
  onDeleteClient,
  onCreateCartForClient,
  onSelectCart
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedClientForHistory, setSelectedClientForHistory] = useState(null);
  const [newCartTitleModalClient, setNewCartTitleModalClient] = useState(null);
  const [customCartTitle, setCustomCartTitle] = useState('');
  const [newWishlistItem, setNewWishlistItem] = useState('');

  const [currentClient, setCurrentClient] = useState({
    name: '',
    phone: '',
    birthday: '',
    skinTone: 'Base 3D Beige W180',
    skinType: 'Mista a Oleosa',
    city: 'Itajaí - SC',
    notes: '',
    wishlist: []
  });

  const filteredClients = (clients || []).filter(c => {
    if (!c) return false;
    const search = (searchTerm || '').toLowerCase();
    return (c.name || '').toLowerCase().includes(search) ||
           (c.city || '').toLowerCase().includes(search) ||
           (c.skinTone || '').toLowerCase().includes(search) ||
           (c.phone || '').includes(search);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentClient.name) return;
    onSaveClient(currentClient);
    setIsEditing(false);
    setCurrentClient({
      name: '',
      phone: '',
      birthday: '',
      skinTone: 'Base 3D Beige W180',
      skinType: 'Mista a Oleosa',
      city: 'Itajaí - SC',
      notes: '',
      wishlist: []
    });
  };

  const handleEdit = (client) => {
    setCurrentClient(client);
    setIsEditing(true);
  };

  const handleCreateCustomCartSubmit = (client) => {
    onCreateCartForClient(client, customCartTitle || `Carrinho - ${new Date().toLocaleDateString('pt-BR')}`);
    setNewCartTitleModalClient(null);
    setCustomCartTitle('');
  };

  const handleAddWishlistItem = (client) => {
    if (!newWishlistItem.trim()) return;
    const updatedWishlist = [...(client.wishlist || []), newWishlistItem.trim()];
    onSaveClient({ ...client, wishlist: updatedWishlist });
    setNewWishlistItem('');
  };

  const handleRemoveWishlistItem = (client, itemToRemove) => {
    const updatedWishlist = (client.wishlist || []).filter(item => item !== itemToRemove);
    onSaveClient({ ...client, wishlist: updatedWishlist });
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E899AC]/30 shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-serif-mk text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-[#B76E79]" />
            <span>Minhas Clientes, Histórico & Fichas de Pele</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Veja o histórico de produtos escolhidos, adicione múltiplos carrinhos por cliente e acompanhe o que cada uma prefere comprar.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome, telefone, base ou cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC] focus:outline-none w-64"
            />
          </div>

          <button
            onClick={() => {
              setCurrentClient({
                name: '',
                phone: '',
                birthday: '',
                skinTone: 'Base 3D Beige W180',
                skinType: 'Mista a Oleosa',
                city: 'Itajaí - SC',
                notes: '',
                wishlist: []
              });
              setIsEditing(true);
            }}
            className="mk-gold-gradient text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Cliente</span>
          </button>
        </div>
      </div>

      {/* Form Modal / Painel de Cadastro */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-[#E899AC]/40 shadow-lg space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b pb-3 border-gray-100">
            <h3 className="font-serif-mk text-lg font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B76E79]" />
              <span>{currentClient.id ? 'Editar Ficha da Cliente' : 'Cadastrar Nova Cliente'}</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Nome Completo *</label>
              <input
                type="text"
                required
                placeholder="Ex: Ana Paula Silva"
                value={currentClient.name}
                onChange={(e) => setCurrentClient({ ...currentClient, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">WhatsApp / Telefone *</label>
              <input
                type="text"
                required
                placeholder="(47) 99999-9999"
                value={currentClient.phone}
                onChange={(e) => setCurrentClient({ ...currentClient, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Aniversário (Dia/Mês)</label>
              <input
                type="text"
                placeholder="Ex: 15/10"
                value={currentClient.birthday}
                onChange={(e) => setCurrentClient({ ...currentClient, birthday: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Tom da Base (TimeWise® 3D)</label>
              <input
                type="text"
                placeholder="Ex: Beige W180, Ivory N140..."
                value={currentClient.skinTone}
                onChange={(e) => setCurrentClient({ ...currentClient, skinTone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Tipo de Pele</label>
              <select
                value={currentClient.skinType}
                onChange={(e) => setCurrentClient({ ...currentClient, skinType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC] focus:outline-none bg-white"
              >
                <option value="Mista a Oleosa">Mista a Oleosa</option>
                <option value="Normal a Seca">Normal a Seca</option>
                <option value="Sensível">Sensível</option>
                <option value="Com Tendência à Acne">Com Tendência à Acne</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Rua / Logradouro</label>
              <input
                type="text"
                placeholder="Ex: Rua Lauro Müller"
                value={currentClient.street || ''}
                onChange={(e) => setCurrentClient({ ...currentClient, street: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Número & Bairro</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nº"
                  value={currentClient.number || ''}
                  onChange={(e) => setCurrentClient({ ...currentClient, number: e.target.value })}
                  className="w-20 px-2 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC]"
                />
                <input
                  type="text"
                  placeholder="Bairro (ex: Fazenda, Centro)"
                  value={currentClient.neighborhood || ''}
                  onChange={(e) => setCurrentClient({ ...currentClient, neighborhood: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Cidade & CEP (Auto-Preenchimento)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Cidade (ex: Itajaí)"
                  value={currentClient.city || ''}
                  onChange={(e) => setCurrentClient({ ...currentClient, city: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC]"
                />
                <input
                  type="text"
                  placeholder="CEP (ex: 88301400)"
                  value={currentClient.cep || ''}
                  onChange={async (e) => {
                    const val = e.target.value;
                    setCurrentClient(prev => ({ ...prev, cep: val }));
                    const clean = val.replace(/\D/g, '');
                    if (clean.length === 8) {
                      try {
                        const isLocalBackend = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
                        if (isLocalBackend) {
                          const res = await fetch(`/api/cep/${clean}`);
                          if (res.ok) {
                            const addr = await res.json();
                            setCurrentClient(prev => ({
                              ...prev,
                              street: addr.rua || prev.street,
                              neighborhood: addr.bairro || prev.neighborhood,
                              city: addr.cidade || prev.city
                            }));
                            return;
                          }
                        }
                        // Fallback gratuito ViaCEP para GitHub Pages / static
                        const viaRes = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
                        if (viaRes.ok) {
                          const addr = await viaRes.json();
                          if (!addr.erro) {
                            setCurrentClient(prev => ({
                              ...prev,
                              street: addr.logradouro || prev.street,
                              neighborhood: addr.bairro || prev.neighborhood,
                              city: addr.localidade || prev.city
                            }));
                          }
                        }
                      } catch (err) {
                        console.error('Erro CEP:', err);
                      }
                    }
                  }}
                  className="w-32 px-2 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC] font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Observações & Preferências da Cliente</label>
            <textarea
              rows="2"
              placeholder="Ex: Prefere batom nude, ama fragrâncias florais, comprou Kit TimeWise em Agosto..."
              value={currentClient.notes}
              onChange={(e) => setCurrentClient({ ...currentClient, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC] focus:outline-none"
            ></textarea>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="mk-gold-gradient text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-md hover:opacity-95 cursor-pointer"
            >
              Salvar Ficha da Cliente
            </button>
          </div>
        </form>
      )}

      {/* Modal para Criar Novo Carrinho com Título Customizado */}
      {newCartTitleModalClient && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-3xl shadow-2xl border border-[#E899AC]/40 space-y-4">
            <h3 className="font-serif-mk text-base font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#B76E79]" />
              <span>Criar Novo Carrinho para {newCartTitleModalClient.name}</span>
            </h3>
            <p className="text-xs text-gray-500">
              Dê um nome ao carrinho para organizar os pedidos desta cliente (ex: "Encomenda Mês de Outubro", "Kits Presentes").
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Nome/Título do Carrinho</label>
              <input
                type="text"
                placeholder="Ex: Encomenda Cuidados com a Pele 3D"
                value={customCartTitle}
                onChange={(e) => setCustomCartTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC] focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setNewCartTitleModalClient(null)}
                className="px-4 py-2 rounded-xl text-xs text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleCreateCustomCartSubmit(newCartTitleModalClient)}
                className="mk-gold-gradient text-white text-xs font-semibold px-5 py-2 rounded-xl shadow-md cursor-pointer"
              >
                Criar Carrinho
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Histórico Completo de Compras & Produtos Escolhidos */}
      {selectedClientForHistory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E899AC]/40 overflow-hidden my-8 space-y-4">
            <div className="bg-[#1A1A1A] text-white p-4 px-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#E899AC]" />
                <h3 className="font-bold text-sm font-serif-mk">
                  Histórico & Produtos Escolhidos de {selectedClientForHistory.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedClientForHistory(null)}
                className="text-gray-400 hover:text-white p-1 cursor-pointer text-xs"
              >
                Fechar (ESC)
              </button>
            </div>

            <div className="p-6 space-y-6 bg-[#FAF7F5] max-h-[500px] overflow-y-auto">
              
              {/* Produtos Escolhidos em Carrinhos e Orçamentos da Cliente */}
              <div className="bg-white p-4 rounded-2xl border border-[#E899AC]/30 space-y-3 shadow-sm">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-[#B76E79]" />
                  <span>Produtos Presentes nos Carrinhos / Orçamentos</span>
                </h4>

                {carts.filter(c => c.clientId === selectedClientForHistory.id).length === 0 ? (
                  <p className="text-xs text-gray-400 italic">Nenhum produto adicionado a carrinhos ainda.</p>
                ) : (
                  <div className="space-y-2">
                    {carts.filter(c => c.clientId === selectedClientForHistory.id).map(c => (
                      <div key={c.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-gray-900">
                          <span>{c.title || `Carrinho #${c.id.replace('cart-', '')}`} ({c.status})</span>
                          <span className="text-[#B76E79]">
                            Total: R$ {c.items.reduce((sum, i) => sum + (i.price * i.quantity), 0).toFixed(2)}
                          </span>
                        </div>
                        <ul className="text-[11px] text-gray-600 divide-y divide-gray-100">
                          {c.items.map((i, idx) => (
                            <li key={idx} className="py-1 flex justify-between">
                              <span>• {i.name} ({i.quantity}x)</span>
                              <span className="font-semibold text-gray-800">R$ {(i.price * i.quantity).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Lista de Preferências / Produtos de Interesse (Wishlist) */}
              <div className="bg-white p-4 rounded-2xl border border-[#E899AC]/30 space-y-3 shadow-sm">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-[#B76E79]" />
                  <span>Produtos de Interesse / Habitual da Cliente</span>
                </h4>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Adicionar produto que a cliente gosta (ex: Batom Semi-Matte Nude)..."
                    value={newWishlistItem}
                    onChange={(e) => setNewWishlistItem(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC]"
                  />
                  <button
                    onClick={() => handleAddWishlistItem(selectedClientForHistory)}
                    className="bg-[#E899AC] text-white text-xs font-semibold px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    Adicionar
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(selectedClientForHistory.wishlist || []).map((item, idx) => (
                    <span key={idx} className="bg-[#F8E8E8] text-[#B76E79] text-xs font-medium px-3 py-1 rounded-full border border-[#E899AC]/30 flex items-center gap-1.5">
                      <span>{item}</span>
                      <button
                        onClick={() => handleRemoveWishlistItem(selectedClientForHistory, item)}
                        className="hover:text-rose-700 font-bold text-xs cursor-pointer ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {(selectedClientForHistory.wishlist || []).length === 0 && (
                    <p className="text-xs text-gray-400 italic">Nenhum produto de interesse cadastrado.</p>
                  )}
                </div>
              </div>

              {/* Histórico de Compras Concluídas */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3 shadow-sm">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Histórico de Pedidos Concluídos</span>
                </h4>

                {(selectedClientForHistory.purchaseHistory || []).length === 0 ? (
                  <p className="text-xs text-gray-400 italic">Nenhuma compra passada registrada.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedClientForHistory.purchaseHistory.map((ph, idx) => (
                      <div key={idx} className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-emerald-900 block">{ph.date}</span>
                          <span className="text-[11px] text-gray-600">{ph.items}</span>
                        </div>
                        <span className="font-bold text-emerald-700">R$ {ph.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Grid de Cartões de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClients.map((client) => {
          const clientCarts = carts.filter(c => c.clientId === client.id);

          return (
            <div key={client.id} className="bg-white rounded-2xl p-5 border border-[#E899AC]/30 mk-card-shadow hover:border-[#E899AC] transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F8E8E8] text-[#B76E79] flex items-center justify-center font-serif-mk font-bold text-lg border border-[#E899AC]/30">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">{client.name}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#B76E79]" /> {client.phone || "Não informado"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(client)}
                      className="p-1.5 text-gray-400 hover:text-[#B76E79] hover:bg-[#F8E8E8] rounded-lg transition-colors cursor-pointer"
                      title="Editar ficha"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteClient(client.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remover cliente"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Badges de Perfil de Pele */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {client.skinTone && (
                    <span className="bg-[#FAF7F5] border border-[#E899AC]/40 text-[#B76E79] text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> {client.skinTone}
                    </span>
                  )}
                  {client.skinType && (
                    <span className="bg-gray-50 text-gray-600 border border-gray-200 text-[11px] font-medium px-2 py-0.5 rounded-full">
                      Pele {client.skinType}
                    </span>
                  )}
                  {client.birthday && (
                    <span className="bg-rose-50 text-rose-600 border border-rose-200 text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Niver: {client.birthday}
                    </span>
                  )}
                </div>

                {/* Seção de Carrinhos Ativos desta Cliente */}
                <div className="bg-[#FAF7F5] p-3 rounded-xl border border-[#E899AC]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                      <ShoppingBag className="w-3.5 h-3.5 text-[#B76E79]" /> Carrinhos da Cliente ({clientCarts.length})
                    </span>
                    <button
                      onClick={() => {
                        setNewCartTitleModalClient(client);
                        setCustomCartTitle('');
                      }}
                      className="text-[10px] bg-[#E899AC] text-white hover:bg-[#B76E79] font-bold px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                      title="Adicionar outro carrinho para esta cliente"
                    >
                      + Adicionar Carrinho
                    </button>
                  </div>

                  {clientCarts.length === 0 ? (
                    <p className="text-[11px] text-gray-400 italic">Nenhum carrinho aberto para esta cliente.</p>
                  ) : (
                    <div className="space-y-1">
                      {clientCarts.map(cart => (
                        <button
                          key={cart.id}
                          onClick={() => onSelectCart(cart.id)}
                          className="w-full text-left p-1.5 px-2 bg-white hover:bg-[#F8E8E8] border border-gray-200 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <span className="font-semibold text-gray-800 truncate">
                            {cart.title || `Carrinho #${cart.id.replace('cart-', '')}`}
                          </span>
                          <span className="text-[10px] text-[#B76E79] font-bold whitespace-nowrap ml-2">
                            {cart.items.reduce((acc, i) => acc + i.quantity, 0)} itens »
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Botões do Rodapé do Cartão */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedClientForHistory(client)}
                  className="text-xs font-semibold text-[#B76E79] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Ver Histórico & Escolhas</span>
                </button>

                <button
                  onClick={() => {
                    setNewCartTitleModalClient(client);
                    setCustomCartTitle('');
                  }}
                  className="bg-[#F8E8E8] hover:bg-[#E899AC] text-[#B76E79] hover:text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Novo Carrinho</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
