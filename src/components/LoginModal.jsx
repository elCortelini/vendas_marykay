import React, { useState } from 'react';
import { Sparkles, ShieldCheck, LogOut, X, ArrowRight, Mail, UserCheck } from 'lucide-react';
import { loginWithGoogle, loginWithGoogleEmail, logoutUser, ADMIN_EMAIL } from '../services/firebase';

export default function LoginModal({ isOpen, onClose, currentUser, onLoginSuccess, onLogoutSuccess }) {
  const [loading, setLoading] = useState(false);
  const [customEmail, setCustomEmail] = useState('');

  if (!isOpen) return null;

  const handleSelectUser = (user) => {
    if (user && onLoginSuccess) {
      onLoginSuccess(user);
      onClose();
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      if (user) {
        handleSelectUser(user);
      }
    } catch (err) {
      console.warn("Popup do Google indisponível ou bloqueado:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomEmailSubmit = (e) => {
    e.preventDefault();
    if (!customEmail || !customEmail.trim()) return;
    const user = loginWithGoogleEmail(customEmail);
    handleSelectUser(user);
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
          <h3 className="text-xl font-bold font-serif-mk">Autenticação com o Google</h3>
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
            </div>
          </div>
        ) : (
          /* NÃO CONECTADO: Opções de Login */
          <div className="space-y-5 py-1 text-left">
            <div className="bg-[#FAF7F5] p-4 rounded-2xl border border-[#E899AC]/30 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-gray-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-[#B76E79]" />
                <span>Autenticação Oficial do Google</span>
              </div>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                Acesse o sistema com sua conta do Google para entrar direto no seu painel.
              </p>
            </div>

            {/* Botão Principal de Login do Google */}
            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full bg-white hover:bg-gray-50 text-gray-900 font-extrabold py-4 px-5 rounded-2xl border border-gray-300 shadow-xl transition-all flex items-center justify-center gap-3 text-base cursor-pointer group hover:border-[#E899AC] hover:scale-[1.01] disabled:opacity-60"
            >
              <svg className="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{loading ? 'Conectando ao Google...' : '🔑 Entrar com o Google (Popup)'}</span>
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
