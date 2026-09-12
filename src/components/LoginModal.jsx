import React, { useState } from 'react';
import { Sparkles, ShieldCheck, LogOut, X, ArrowRight, Mail } from 'lucide-react';
import { loginWithGoogleEmail, logoutUser, ADMIN_EMAIL } from '../services/firebase';

export default function LoginModal({ isOpen, onClose, currentUser, onLoginSuccess, onLogoutSuccess }) {
  const [emailInput, setEmailInput] = useState('');
  const [errorText, setErrorText] = useState('');

  if (!isOpen) return null;

  const handleSelectAccount = (email) => {
    const user = loginWithGoogleEmail(email);
    if (user && onLoginSuccess) {
      onLoginSuccess(user);
      onClose();
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!emailInput || !emailInput.trim()) {
      setErrorText("Por favor, digite seu e-mail do Google.");
      return;
    }
    handleSelectAccount(emailInput);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      if (onLogoutSuccess) {
        onLogoutSuccess();
      }
      onClose();
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  };

  const isAdmin = currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-3xl shadow-2xl border border-[#E899AC]/40 space-y-6 text-center relative overflow-hidden">
        
        {/* Botão Fechar Modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-all cursor-pointer"
          title="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Banner */}
        <div className="mk-gold-gradient -mx-6 -mt-6 p-6 text-white text-center space-y-1">
          <Sparkles className="w-8 h-8 mx-auto animate-bounce" />
          <h3 className="text-xl font-bold font-serif-mk">Login com Conta Google</h3>
          <p className="text-xs text-white/90">Gestão de Conta do Sistema Mary Kay® Cloud</p>
        </div>

        {currentUser ? (
          /* CONECTADO: Opção de Logout e Status */
          <div className="space-y-5">
            <div className="bg-[#FAF7F5] p-5 rounded-2xl border border-[#E899AC]/40 space-y-3">
              <div className="relative w-16 h-16 mx-auto">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt={currentUser.displayName} className="w-16 h-16 rounded-full border-2 border-[#B76E79] object-cover shadow-md mx-auto" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#B76E79] text-white font-black flex items-center justify-center text-xl shadow-md mx-auto">
                    {currentUser.email?.[0].toUpperCase()}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-base">{currentUser.displayName || "Usuário Conectado"}</h4>
                <p className="text-xs text-gray-500 font-medium">{currentUser.email}</p>
                <div className="mt-2">
                  <span className={`inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full shadow-sm ${
                    isAdmin ? 'bg-amber-500 text-gray-950 border border-amber-600' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {isAdmin ? '🛡️ Administrador Master' : '👩‍💼 Consultora de Beleza Conectada'}
                  </span>
                </div>
              </div>
            </div>

            {/* Botão de Logout */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span>🔴 SAIR DA CONTA (LOGOUT)</span>
              </button>

              <button
                onClick={onClose}
                className="text-xs text-gray-500 hover:text-gray-700 font-semibold cursor-pointer underline"
              >
                Fechar / Voltar ao Sistema
              </button>
            </div>
          </div>
        ) : (
          /* NÃO CONECTADO: Escolha de Conta do Google */
          <div className="space-y-5 text-left">
            <div className="bg-[#FAF7F5] p-4 rounded-2xl border border-[#E899AC]/30 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-gray-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-[#B76E79]" />
                <span>Autenticação de Conta Google</span>
              </div>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                Selecione sua conta do Google abaixo para entrar no sistema e ser direcionada(o) à sua área de acesso.
              </p>
            </div>

            {/* Opções Rápidas de Conta Google */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-700 block uppercase tracking-wider">
                Seleção de Conta Google:
              </label>

              <button
                type="button"
                onClick={() => handleSelectAccount('tailiseroza@gmail.com')}
                className="w-full bg-white hover:bg-[#FAF7F5] text-gray-900 font-bold p-3.5 rounded-2xl border border-gray-200 hover:border-[#E899AC] shadow-sm transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#F8E8E8] text-[#B76E79] font-black flex items-center justify-center text-xs shrink-0">
                    TR
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-gray-900 block group-hover:text-[#B76E79]">
                      tailiseroza@gmail.com
                    </span>
                    <span className="text-[10px] text-gray-500 block">Consultora de Beleza Mary Kay®</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#B76E79] transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectAccount(ADMIN_EMAIL)}
                className="w-full bg-white hover:bg-[#FAF7F5] text-gray-900 font-bold p-3.5 rounded-2xl border border-gray-200 hover:border-amber-400 shadow-sm transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 font-black flex items-center justify-center text-xs shrink-0">
                    AD
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-gray-900 block group-hover:text-amber-700">
                      {ADMIN_EMAIL}
                    </span>
                    <span className="text-[10px] text-amber-700 font-semibold block">Administrador Master</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className="relative my-2 flex items-center justify-center">
              <div className="border-t border-gray-200 w-full"></div>
              <span className="bg-white px-3 text-[10px] text-gray-400 font-bold uppercase shrink-0">Ou Digite Outra Conta</span>
              <div className="border-t border-gray-200 w-full"></div>
            </div>

            {/* Digitar Qualquer E-mail do Google */}
            <form onSubmit={handleEmailSubmit} className="space-y-2">
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    setErrorText('');
                  }}
                  placeholder="Digite seu e-mail do Google..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC] focus:border-[#E899AC] outline-none"
                />
              </div>

              {errorText && (
                <p className="text-[11px] text-red-600 font-semibold">{errorText}</p>
              )}

              <button
                type="submit"
                className="w-full mk-gold-gradient hover:opacity-95 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                </svg>
                <span>Entrar com esta Conta Google</span>
              </button>
            </form>

          </div>
        )}

      </div>
    </div>
  );
}
