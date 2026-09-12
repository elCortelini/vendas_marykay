import React, { useState } from 'react';
import { Sparkles, UserCheck, ShieldCheck, Phone, MapPin, CreditCard, Award, Heart, CheckCircle2 } from 'lucide-react';

export default function SelfRegisterModal({ isOpen, googleUser, onSubmitRegistration, onClose }) {
  const [formData, setFormData] = useState({
    name: googleUser?.displayName || '',
    email: googleUser?.email || '',
    code: '',
    title: 'Consultora de Beleza Independente Mary Kay®',
    region: 'Itajaí e Região',
    phone: '',
    pixKey: '',
    bio: 'Dicas de beleza, produtos à pronta-entrega e atendimento personalizado Mary Kay®'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !googleUser) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setIsSubmitting(true);

    if (onSubmitRegistration) {
      onSubmitRegistration({
        ...formData,
        email: googleUser.email,
        avatar: googleUser.photoURL || '/images/tailise_avatar.png',
        status: 'pending',
        createdAt: new Date().toISOString()
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#E899AC]/40 overflow-hidden relative space-y-5 my-8">
        
        {/* Cabeçalho de Boas-Vindas */}
        <div className="mk-gold-gradient p-6 text-white text-center space-y-2 relative">
          <div className="w-16 h-16 mx-auto rounded-full p-0.5 bg-white shadow-lg">
            <img 
              src={googleUser.photoURL || "https://api.dicebear.com/7.x/initials/svg?seed=MaryKay"} 
              alt={googleUser.displayName} 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h3 className="text-xl font-bold font-serif-mk">✨ Bem-vinda à Rede Mary Kay®!</h3>
          <p className="text-xs text-white/90">
            Complete seu cadastro inicial de consultora. Seu acesso ficará registrado aguardando a liberação do Administrador.
          </p>
        </div>

        {/* Formulário de Cadastro Inicial */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 pt-0">
          
          <div className="bg-[#FAF7F5] p-3.5 rounded-2xl border border-[#E899AC]/30 space-y-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">E-mail Conectado (Google)</span>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{googleUser.email}</span>
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="text-xs font-bold text-gray-700">Seu Nome Completo *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Maria Silva"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Código Consultora MK</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="Ex: NW7527"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs uppercase focus:ring-2 focus:ring-[#E899AC] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Telefone / WhatsApp *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Ex: (47) 99999-8888"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Região de Atendimento</label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                placeholder="Ex: Itajaí e Região"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Chave Pix para Recebimentos</label>
              <input
                type="text"
                value={formData.pixKey}
                onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
                placeholder="Ex: CPF ou Celular"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC] outline-none"
              />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-[11px] text-amber-900 leading-relaxed space-y-1 text-left">
            <span className="font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Aprovação de Segurança
            </span>
            <p>
              Ao enviar, seu cadastro será encaminhado para o **Administrador Master (elcortelini@gmail.com)** para validação e liberação de acesso ao painel completo de vendas.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-2xl text-xs transition-all cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 mk-gold-gradient text-white font-bold py-3 rounded-2xl shadow-md hover:opacity-95 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Cadastrando...' : 'Finalizar Cadastro Inicial'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
