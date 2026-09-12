import React, { useState } from 'react';
import { Sparkles, ShieldCheck, LogOut, X, Mail } from 'lucide-react';
import { loginWithGoogle, loginWithGoogleEmail, logoutUser, ADMIN_EMAIL } from '../services/firebase';

export default function LoginModal({ isOpen, onClose, currentUser, onLoginSuccess, onLogoutSuccess }) {
  const [emailInput, setEmailInput] = useState('');
  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleAuthPopup = async () => {
    setLoading(true);
    setErrorText('');
    try {
      const user = await loginWithGoogle();
      if (user && onLoginSuccess) {
        onLoginSuccess(user);
        onClose();
      }
    } catch (err) {
      console.warn("Popup do Google indisponível:", err);
      if (emailInput && emailInput.trim()) {
        handleEmailSubmitDirect(emailInput);
      } else {
        setErrorText("Por favor, digite seu e-mail do Google no campo acima para entrar.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmitDirect = (email) => {
    const cleanEmail = email?.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorText("Por favor, digite seu e-mail do Google.");
      return;
    }
    const user = loginWithGoogleEmail(cleanEmail);
    if (user && onLoginSuccess) {
      onLoginSuccess(user);
      onClose();
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    handleEmailSubmitDirect(emailInput);
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
          <h3 className="text-xl font-bold font-serif-mk">Painel de Login & Autenticação</h3>
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
          /* NÃO CONECTADO: Autenticação Direta com o Google */
          <div className="space-y-5 text-left">
            <div className="bg-[#FAF7F5] p-4 rounded-2xl border border-[#E899AC]/30 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-gray-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-[#B76E79]" />
                <span>Autenticação de Conta Google</span>
              </div>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                Faça login com sua conta do Google para acessar seu painel de vendas e pronta-entrega.
              </p>
            </div>

            {/* Formulário de E-mail do Google */}
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700 block">
                  E-mail da sua Conta do Google:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      setErrorText('');
                    }}
                    placeholder="seu_email@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#E899AC] focus:border-[#E899AC] outline-none"
                    required
                    autoFocus
                  />
                </div>
                {errorText && (
                  <p className="text-[11px] text-red-600 font-semibold pt-0.5">{errorText}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full mk-gold-gradient hover:opacity-95 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                </svg>
                <span>🔑 Entrar com o Google</span>
              </button>
            </form>

            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={handleGoogleAuthPopup}
                disabled={loading}
                className="text-xs text-[#B76E79] hover:underline font-semibold cursor-pointer"
              >
                {loading ? 'Conectando...' : 'Ou tentar via Popup do Google'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
