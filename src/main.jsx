import React, { Component, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Erro capturado:', error, errorInfo);
  }

  handleReloadKeepData = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleFullReset = () => {
    if (window.confirm("Atenção: Deseja realmente resetar o banco de dados local para os dados iniciais de fábrica?")) {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {}
      this.setState({ hasError: false, error: null });
      window.location.href = window.location.origin + window.location.pathname;
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF7F5] flex items-center justify-center p-6 text-center font-sans">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-[#E899AC]/40 max-w-md space-y-5">
            <div className="w-16 h-16 bg-[#F8E8E8] text-[#B76E79] rounded-2xl flex items-center justify-center mx-auto text-3xl font-bold shadow-inner">
              👑
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 font-serif-mk">
                Gestor de Vendas Mary Kay®
              </h1>
              <p className="text-xs text-gray-600 leading-relaxed">
                Ocorreu uma pequena oscilação no navegador. Clique abaixo para recarregar preservando todos os seus dados e cadastros.
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={this.handleReloadKeepData}
                className="mk-gold-gradient text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-lg transition-all hover:scale-105 cursor-pointer text-sm w-full"
              >
                🔄 Recarregar & Preservar Meus Dados
              </button>
              <button
                onClick={this.handleFullReset}
                className="text-gray-400 hover:text-red-500 font-semibold text-[11px] underline cursor-pointer pt-2 block mx-auto"
              >
                ⚠️ Resetar Banco de Dados Local (Dados Iniciais)
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

