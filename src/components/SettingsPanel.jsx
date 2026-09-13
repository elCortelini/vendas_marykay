import React, { useState, useEffect } from 'react';
import { Settings, Save, DollarSign, Truck, Package, ShieldCheck, Sparkles, Edit2, User, Key, Eye, EyeOff, Plus, Trash2, Phone, MapPin, Check, Upload } from 'lucide-react';

export default function SettingsPanel({
  isAdmin = false,
  consultant,
  consultants = [],
  settings,
  products = [],
  onSaveSettings,
  onUpdateProductPricing,
  onSaveConsultant,
  onSelectConsultant,
  onDeleteConsultant
}) {
  const [currentSettings, setCurrentSettings] = useState(settings || {
    defaultDiscount: 40,
    packagingCost: 5.0,
    shippingRates: [
      { region: "Itajaí - Centro / Fazenda", fee: 0.0 },
      { region: "Itajaí - Outros Bairros", fee: 10.0 },
      { region: "Balneário Camboriú", fee: 15.0 },
      { region: "Navegantes / Camboriú", fee: 20.0 }
    ]
  });

  const [consultantForm, setConsultantForm] = useState(consultant || {
    name: "Tailise",
    title: "Consultora de Beleza Independente Mary Kay®",
    region: "Itajaí e região",
    code: "NW7527",
    phone: "(47) 99999-8888",
    pixKey: "47999998888",
    avatar: "/images/tailise_avatar.png",
    loginMaryKay: "NW7527",
    passwordMaryKay: "@Tata8282selena"
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isEditingConsultant, setIsEditingConsultant] = useState(false);
  const [consultantNotice, setConsultantNotice] = useState(null);

  useEffect(() => {
    if (consultant) setConsultantForm(consultant);
  }, [consultant]);

  const showToast = (msg) => {
    setConsultantNotice(msg);
    setTimeout(() => setConsultantNotice(null), 3500);
  };

  const handleConsultantFormSubmit = (e) => {
    e.preventDefault();
    if (onSaveConsultant) {
      onSaveConsultant(consultantForm);
      showToast('Dados da vendedora salvos com sucesso!');
      setIsEditingConsultant(false);
    }
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(currentSettings);
    showToast('Configurações financeiras e frete salvas!');
  };

  const handleShippingRateChange = (index, field, value) => {
    const updatedRates = [...currentSettings.shippingRates];
    updatedRates[index][field] = field === 'fee' ? parseFloat(value) || 0 : value;
    setCurrentSettings({ ...currentSettings, shippingRates: updatedRates });
  };

  const handleAddShippingRate = () => {
    const updatedRates = [...currentSettings.shippingRates, { region: "Nova Região", fee: 10.0 }];
    setCurrentSettings({ ...currentSettings, shippingRates: updatedRates });
  };

  const handleRemoveShippingRate = (index) => {
    const updatedRates = currentSettings.shippingRates.filter((_, i) => i !== index);
    setCurrentSettings({ ...currentSettings, shippingRates: updatedRates });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {consultantNotice && (
        <div className="bg-emerald-900 text-white p-4 rounded-2xl shadow-lg border border-emerald-500 font-bold text-xs flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-300" />
            <span>{consultantNotice}</span>
          </div>
          <button onClick={() => setConsultantNotice(null)} className="text-white hover:text-emerald-200">×</button>
        </div>
      )}

      {/* Cabeçalho da Seção */}
      <div className="bg-white p-6 rounded-3xl border border-[#E899AC]/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif-mk text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#B76E79]" />
            <span>{isAdmin ? 'Perfil da Consultora de Beleza & Configurações Mary Kay®' : 'Minhas Configurações & Perfil Mary Kay®'}</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {isAdmin 
              ? 'Cadastre e edite os dados das consultoras de beleza, chave PIX, foto, logins oficiais e tabela de frete!' 
              : 'Edite suas informações pessoais, chave PIX, foto de perfil, dados de acesso e tabela de frete!'}
          </p>
        </div>
      </div>

      {/* 1. Módulo de Perfil da Consultora de Beleza Ativa */}
      <div className="bg-white p-6 rounded-3xl border border-[#E899AC]/40 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full mk-gold-gradient p-0.5 shadow-md shrink-0">
              <img src={consultantForm.avatar || "/images/tailise_avatar.png"} alt={consultantForm.name} className="w-full h-full object-cover rounded-full border-2 border-white" />
            </div>
            <div>
              <h3 className="font-serif-mk text-base font-bold text-gray-900 flex items-center gap-2">
                <span>Consultora Ativa: {consultantForm.name || "Tailise"}</span>
                <span className="bg-[#F8E8E8] text-[#B76E79] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#E899AC]/40">
                  Cód: {consultantForm.code || "NW7527"}
                </span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {consultantForm.title || "Consultora de Beleza Independente Mary Kay®"} • {consultantForm.region || "Itajaí e região"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditingConsultant(!isEditingConsultant)}
              className="mk-gold-gradient text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Edit2 className="w-4 h-4" />
              <span>{isEditingConsultant ? 'Fechar Edição' : 'Editar Dados da Consultora'}</span>
            </button>
          </div>
        </div>

        {/* Card Separado Exclusivo para Cadastrar Nova Consultora de Beleza (Apenas Admin) */}
        {isAdmin && (
          <>
            <div className="bg-[#FAF7F5] p-4 rounded-2xl border border-[#E899AC]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F8E8E8] text-[#B76E79] flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-xs">Cadastrar Outra Consultora de Beleza</h4>
                  <p className="text-[11px] text-gray-500">Adicione uma nova consultora à rede de vendas do sistema.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setConsultantForm({
                    id: 'c-' + Date.now(),
                    name: '',
                    title: 'Consultora de Beleza Independente Mary Kay®',
                    region: 'Itajaí e região',
                    code: '',
                    phone: '',
                    pixKey: '',
                    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
                    loginMaryKay: '',
                    passwordMaryKay: ''
                  });
                  setIsEditingConsultant(true);
                }}
                className="bg-[#1A1A1A] hover:bg-black text-[#E899AC] text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Cadastrar Nova Consultora</span>
              </button>
            </div>

            {/* Seleção de Vendedora Ativa */}
            {consultants && consultants.length >= 1 && (
              <div className="bg-[#FAF7F5] p-4 rounded-2xl border border-[#E899AC]/30 space-y-2 text-xs">
                <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#B76E79]" />
                  <span>Vendedoras Cadastradas no Sistema ({consultants.length})</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                  {consultants.map(c => {
                    const isActive = c.id === consultantForm.id || c.code === consultantForm.code;
                    return (
                      <div
                        key={c.id || c.code}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                          isActive ? 'bg-white border-[#E899AC] shadow-md ring-2 ring-[#E899AC]/40' : 'bg-gray-50 border-gray-200 hover:bg-white'
                        }`}
                        onClick={() => {
                          if (onSelectConsultant) onSelectConsultant(c.id);
                          setConsultantForm(c);
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={c.avatar || '/images/tailise_avatar.png'} alt={c.name} className="w-9 h-9 rounded-full object-cover border shrink-0" />
                          <div>
                            <h5 className="font-bold text-gray-900 text-xs">{c.name}</h5>
                            <span className="text-[10px] text-gray-500">Cód: {c.code}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {isActive && (
                            <span className="bg-emerald-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                              ATIVA
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConsultantForm(c);
                              setIsEditingConsultant(true);
                            }}
                            className="p-1 hover:bg-gray-200 text-gray-600 rounded-lg text-[10px] font-bold"
                            title="Editar esta vendedora"
                          >
                            ✏️ Editar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* Formulário de Edição de Vendedora */}
        {isEditingConsultant && (
          <form onSubmit={handleConsultantFormSubmit} className="bg-[#FAF7F5] p-5 rounded-2xl border border-[#E899AC]/40 space-y-4 text-xs animate-fade-in">
            <h4 className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#B76E79]" />
              <span>Dados Personalizados da Vendedora & Acessos Oficial Mary Kay®</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nome da Vendedora *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Tailise"
                  value={consultantForm.name}
                  onChange={(e) => setConsultantForm({ ...consultantForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Código de Consultora Mary Kay® *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: NW7527"
                  value={consultantForm.code}
                  onChange={(e) => setConsultantForm({ ...consultantForm, code: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC] font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Título / Cargo</label>
                <input
                  type="text"
                  placeholder="Ex: Consultora de Beleza Independente Mary Kay®"
                  value={consultantForm.title}
                  onChange={(e) => setConsultantForm({ ...consultantForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Região de Atuação</label>
                <input
                  type="text"
                  placeholder="Ex: Itajaí e região"
                  value={consultantForm.region}
                  onChange={(e) => setConsultantForm({ ...consultantForm, region: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Celular / WhatsApp *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: (47) 99999-8888"
                  value={consultantForm.phone}
                  onChange={(e) => setConsultantForm({ ...consultantForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Chave PIX para Recebimentos *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 47999998888 ou CPF/E-mail"
                  value={consultantForm.pixKey}
                  onChange={(e) => setConsultantForm({ ...consultantForm, pixKey: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC] font-semibold text-[#B76E79]"
                />
              </div>

              <div className="sm:col-span-2 space-y-2">
                <label className="block font-semibold text-gray-700 mb-1">Foto de Perfil / Avatar</label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
                    {consultantForm.avatar ? (
                      <img src={consultantForm.avatar} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm flex items-center gap-2 transition-all">
                        <Upload className="w-4 h-4 text-[#B76E79]" />
                        <span>Carregar Foto do Computador</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setConsultantForm({ ...consultantForm, avatar: reader.result });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <span className="text-xs text-gray-400 font-medium">ou insira o link/caminho</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Ex: /images/tailise_avatar.png ou link..."
                      value={consultantForm.avatar || ''}
                      onChange={(e) => setConsultantForm({ ...consultantForm, avatar: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E899AC] text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Seção de Login e Senha do Site Oficial Mary Kay */}
              <div className="sm:col-span-2 bg-white p-4 rounded-2xl border border-[#E899AC]/40 space-y-3">
                <h5 className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-[#B76E79]" />
                  <span>Acessos do Site Oficial Mary Kay® (Portal EmSintonia)</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Login / Código do Portal</label>
                    <input
                      type="text"
                      placeholder="Ex: NW7527"
                      value={consultantForm.loginMaryKay || consultantForm.code}
                      onChange={(e) => setConsultantForm({ ...consultantForm, loginMaryKay: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Senha do Portal EmSintonia</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Sua senha do site..."
                        value={consultantForm.passwordMaryKay || "@Tata8282selena"}
                        onChange={(e) => setConsultantForm({ ...consultantForm, passwordMaryKay: e.target.value })}
                        className="w-full pl-3 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setIsEditingConsultant(false)}
                className="px-4 py-2 text-gray-500 hover:bg-gray-200 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="mk-gold-gradient text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Dados da Vendedora</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 2. Configurações Financeiras & Tabela de Fretes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form onSubmit={handleSettingsSubmit} className="lg:col-span-6 bg-white p-6 rounded-3xl border border-[#E899AC]/30 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-serif-mk text-base font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#B76E79]" />
              <span>Desconto Padrão & Parâmetros Financeiros</span>
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Desconto Padrão da Consultora (%)</label>
            <select
              value={currentSettings.defaultDiscount}
              onChange={(e) => setCurrentSettings({ ...currentSettings, defaultDiscount: parseFloat(e.target.value) || 40 })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC] bg-white font-semibold"
            >
              <option value="30">30% (Pedido Bronze)</option>
              <option value="35">35% (Pedido Prata)</option>
              <option value="40">40% (Pedido Ouro / Estrela)</option>
            </select>
          </div>

          {/* Tabela de Fretes */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#B76E79]" />
                <span>Taxas de Entrega / Frete por Bairro e Cidade</span>
              </h4>
              <button
                type="button"
                onClick={handleAddShippingRate}
                className="text-[11px] font-bold text-[#B76E79] hover:underline flex items-center gap-1 cursor-pointer"
              >
                + Adicionar Região
              </button>
            </div>

            <div className="space-y-2">
              {currentSettings.shippingRates.map((rate, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={rate.region}
                    onChange={(e) => handleShippingRateChange(index, 'region', e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-gray-200 rounded-xl text-xs"
                    placeholder="Nome da região/bairro..."
                  />
                  <div className="w-24">
                    <input
                      type="number"
                      step="0.5"
                      value={rate.fee}
                      onChange={(e) => handleShippingRateChange(index, 'fee', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded-xl text-xs font-bold text-center"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveShippingRate(index)}
                    className="text-gray-400 hover:text-red-600 p-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mk-gold-gradient text-white text-xs font-bold py-3 rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Configurações Financeiras</span>
          </button>
        </form>

        {/* Backup & Exportação */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-[#E899AC]/30 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-serif-mk text-base font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#B76E79]" />
              <span>Backup de Segurança & Planilhas Excel</span>
            </h3>
          </div>

          <p className="text-xs text-gray-500">
            Baixe cópias de segurança do seu banco de dados ou exporte planilhas de clientes e estoque em formato CSV/Excel.
          </p>

          <div className="space-y-3">
            <a
              href="/api/backup"
              download
              className="w-full bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold p-3.5 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <Package className="w-4 h-4" />
              <span>Baixar Backup Completo do Sistema (JSON)</span>
            </a>

            <a
              href="/api/export/csv?type=clients"
              download
              className="w-full bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold p-3.5 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Exportar Fichas das Clientes para Excel (CSV)</span>
            </a>

            <a
              href="/api/export/csv?type=products"
              download
              className="w-full bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold p-3.5 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Exportar Tabela de Estoque & Produtos (CSV)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
