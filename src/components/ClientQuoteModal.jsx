import React, { useRef, useState, useEffect } from 'react';
import { X, Share2, Download, Image, Sparkles, MapPin, Phone, CreditCard, Heart, CheckCircle2, ArrowLeft, Printer, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function ClientQuoteModal({ cart, consultant, client, onClose }) {
  const quoteRef = useRef(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingJPG, setIsExportingJPG] = useState(false);
  const [exportError, setExportError] = useState(null);

  // Fechar com a tecla ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!cart) return null;

  const numFmt = (n) => Number(n || 0).toFixed(2);
  const subtotal = (cart.items || []).reduce((sum, item) => sum + (Number(item?.price || 0) * Number(item?.quantity || 1)), 0);
  const discountVal = (subtotal * Number(cart?.discountPercent || 0)) / 100;
  const total = Math.max(0, subtotal - discountVal + Number(cart?.shippingFee || 0));

  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 7);
  const formattedValidUntil = validUntil.toLocaleDateString('pt-BR');

  // Limpar número de telefone para formato internacional WhatsApp
  const clientPhoneRaw = client?.phone || cart.clientPhone || '';
  const sanitizedPhone = clientPhoneRaw.replace(/\D/g, '');
  const formattedPhoneForWa = sanitizedPhone.length >= 10 ? (sanitizedPhone.startsWith('55') ? sanitizedPhone : `55${sanitizedPhone}`) : '';

  const generateWhatsAppMessage = () => {
    let msg = `✨ *ORÇAMENTO DE LUXO MARY KAY®* ✨\n\n`;
    msg += `👩‍💼 *Consultora:* ${consultant?.name || 'Tailise'}\n`;
    msg += `👤 *Cliente:* ${cart.clientName}\n`;
    if (client?.street || client?.city) {
      msg += `📍 *Entrega:* ${client.street || ''} ${client.number || ''} ${client.neighborhood ? `- ${client.neighborhood}` : ''} (${client.city || 'Itajaí'})\n`;
    }
    msg += `----------------------------------------\n\n`;

    (cart.items || []).forEach(item => {
      msg += `▪️ *${item.name}*\n`;
      msg += `   ${item.quantity}x R$ ${numFmt(item.price)} = R$ ${numFmt(Number(item.price || 0) * Number(item.quantity || 1))}\n`;
    });

    msg += `\n----------------------------------------\n`;
    msg += `Subtotal: R$ ${numFmt(subtotal)}\n`;
    if (cart.discountPercent > 0) {
      msg += `🎁 Desconto Especial (${cart.discountPercent}%): -R$ ${numFmt(discountVal)}\n`;
    }
    if (cart.shippingFee > 0) {
      msg += `🚚 Entrega / Frete: R$ ${numFmt(cart.shippingFee)}\n`;
    }
    msg += `💰 *TOTAL DO ORÇAMENTO: R$ ${numFmt(total)}*\n\n`;
    msg += `💳 *Formas de Pagamento:* Pix, Cartão de Crédito em até 3x ou Dinheiro.\n`;
    msg += `🔑 *Chave Pix:* ${consultant?.pixKey || "(47) 99999-8888"}\n\n`;
    msg += `Aguardamos sua confirmação para preparar seus produtos com todo carinho! 🥰`;

    return encodeURIComponent(msg);
  };

  const whatsappUrl = formattedPhoneForWa
    ? `https://api.whatsapp.com/send?phone=${formattedPhoneForWa}&text=${generateWhatsAppMessage()}`
    : `https://api.whatsapp.com/send?text=${generateWhatsAppMessage()}`;

  // Download PDF robusto com tratamento de imagens CORS
  const handleDownloadPDF = async () => {
    if (!quoteRef.current || isExportingPDF) return;
    setIsExportingPDF(true);
    setExportError(null);

    try {
      const element = quoteRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        scrollX: 0,
        scrollY: -window.scrollY
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
      pdf.save(`Orcamento_MaryKay_${cart.clientName.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      setExportError('Não foi possível gerar o arquivo PDF diretamente. Utilize a opção "Imprimir / PDF"!');
    } finally {
      setIsExportingPDF(false);
    }
  };

  // Download Imagem (JPG) robusto
  const handleDownloadJPG = async () => {
    if (!quoteRef.current || isExportingJPG) return;
    setIsExportingJPG(true);
    setExportError(null);

    try {
      const element = quoteRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        scrollX: 0,
        scrollY: -window.scrollY
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `Orcamento_MaryKay_${cart.clientName.replace(/\s+/g, '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Erro ao gerar JPG:', err);
      setExportError('Erro ao converter imagem JPG. Tente novamente ou utilize "Imprimir"!');
    } finally {
      setIsExportingJPG(false);
    }
  };

  // Impressão / Salvar em PDF Nativo do Navegador (Fail-proof)
  const handleNativePrint = () => {
    if (!quoteRef.current) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Por favor, permita pop-ups no seu navegador para abrir a tela de impressão!');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Orçamento Mary Kay - ${cart.clientName}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { font-family: sans-serif; background: #fff; padding: 20px; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="margin-bottom: 20px; text-align: center;">
            <button onclick="window.print()" style="background: #E899AC; color: white; border: none; padding: 10px 20px; font-weight: bold; border-radius: 8px; cursor: pointer;">
              🖨️ Clique Aqui para Imprimir ou Salvar como PDF
            </button>
          </div>
          <div>${quoteRef.current.innerHTML}</div>
          <script>
            setTimeout(() => { window.print(); }, 800);
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-[#E899AC]/40 overflow-hidden my-auto animate-scale-up">
        
        {/* Barra Superior de Ações & Sair */}
        <div className="bg-[#1A1A1A] text-white p-4 px-6 flex flex-wrap items-center justify-between gap-3 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E899AC]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-200">
              Orçamento de Luxo • {cart.clientName}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Opção WhatsApp Direta */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Enviar WhatsApp {clientPhoneRaw ? `(${clientPhoneRaw})` : ''}</span>
            </a>

            {/* Baixar PDF */}
            <button
              onClick={handleDownloadPDF}
              disabled={isExportingPDF}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-white/20 disabled:opacity-50"
              title="Baixar em documento PDF"
            >
              {isExportingPDF ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E899AC]" /> : <Download className="w-3.5 h-3.5" />}
              <span>{isExportingPDF ? 'Gerando PDF...' : 'Baixar PDF'}</span>
            </button>

            {/* Baixar JPG */}
            <button
              onClick={handleDownloadJPG}
              disabled={isExportingJPG}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-white/20 disabled:opacity-50"
              title="Baixar imagem JPG para enviar"
            >
              {isExportingJPG ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E899AC]" /> : <Image className="w-3.5 h-3.5" />}
              <span>{isExportingJPG ? 'Gerando JPG...' : 'Baixar JPG'}</span>
            </button>

            {/* Imprimir / Salvar PDF Nativo */}
            <button
              onClick={handleNativePrint}
              className="bg-[#E899AC] hover:bg-[#d8879a] text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Abrir janela de impressão do navegador"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>

            {/* Botão de Fechar */}
            <button
              onClick={onClose}
              className="bg-white/10 hover:bg-red-500/80 text-white p-2 rounded-xl transition-colors cursor-pointer ml-1"
              title="Fechar orçamento"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mensagem de Erro se Houver */}
        {exportError && (
          <div className="bg-red-50 text-red-600 text-xs px-6 py-2 flex items-center justify-between border-b border-red-100">
            <span>{exportError}</span>
            <button onClick={() => setExportError(null)} className="font-bold underline text-[10px]">Fechar</button>
          </div>
        )}

        {/* Documento de Orçamento Capturado pelo Ref */}
        <div className="p-6 sm:p-10 max-h-[80vh] overflow-y-auto bg-[#FAF7F5]">
          <div
            ref={quoteRef}
            className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-[#E899AC]/30 space-y-8 text-gray-800 max-w-2xl mx-auto"
          >
            {/* Header do Cartão de Orçamento */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#E899AC]/30">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full p-0.5 mk-gold-gradient shadow-md shrink-0">
                  <img
                    src={consultant?.avatar || "/images/tailise_avatar.png"}
                    alt="Consultora Tailise"
                    className="w-full h-full object-cover rounded-full border-2 border-white"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-serif-mk text-gray-900 leading-tight">
                    {consultant?.name || "Tailise"}
                  </h2>
                  <p className="text-xs text-[#B76E79] font-semibold">
                    {consultant?.title || "Consultora de Beleza Independente Mary Kay®"}
                  </p>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#B76E79]" /> {consultant?.region || "Itajaí e Região"}
                  </p>
                </div>
              </div>

              <div className="text-right sm:text-right w-full sm:w-auto bg-[#F8E8E8]/50 p-3.5 rounded-2xl border border-[#E899AC]/30">
                <span className="text-[10px] font-bold text-[#B76E79] uppercase tracking-widest block">
                  ORÇAMENTO EXCLUSIVO
                </span>
                <span className="text-xs font-semibold text-gray-700 block mt-0.5">
                  Válido até: {formattedValidUntil}
                </span>
              </div>
            </div>

            {/* Dados da Cliente */}
            <div className="bg-[#FAF7F5] p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Preparado Especialmente Para:</span>
                <h3 className="text-sm font-bold text-gray-900 mt-0.5">{cart.clientName}</h3>
                {clientPhoneRaw && <p className="text-gray-500 text-[11px] mt-0.5">📞 {clientPhoneRaw}</p>}
              </div>

              {(client?.street || client?.city) && (
                <div className="text-right sm:text-right">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Endereço de Entrega:</span>
                  <p className="text-gray-700 font-medium text-[11px] mt-0.5">
                    {client.street || ''} {client.number ? `, ${client.number}` : ''} {client.neighborhood ? `- ${client.neighborhood}` : ''}
                  </p>
                  <p className="text-gray-500 text-[10px]">
                    {client.city || 'Itajaí'} {client.state ? `/${client.state}` : ''}
                  </p>
                </div>
              )}
            </div>

            {/* Tabela de Itens Selecionados */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" />
                <span>Seus Produtos de Beleza Selecionados ({cart.items.length} itens)</span>
              </h4>

              <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
                {cart.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-white flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80"}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-xl border border-gray-100 shrink-0"
                      />
                      <div>
                        <h5 className="font-bold text-gray-900 text-xs">{item.name}</h5>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          SKU #{item.sku} • R$ {numFmt(item.price)} cada
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-bold text-gray-700 block">
                        {item.quantity}x R$ {numFmt(item.price)}
                      </span>
                      <span className="text-xs font-extrabold text-[#B76E79] block mt-0.5">
                        R$ {numFmt(Number(item.price || 0) * Number(item.quantity || 1))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumo Financeiro */}
            <div className="bg-[#FAF7F5] p-5 rounded-2xl border border-[#E899AC]/30 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal dos Produtos:</span>
                <span className="font-semibold">R$ {numFmt(subtotal)}</span>
              </div>

              {cart.discountPercent > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Desconto Especial ({cart.discountPercent}%):</span>
                  <span>-R$ {numFmt(discountVal)}</span>
                </div>
              )}

              {cart.shippingFee > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Taxa de Entrega / Frete:</span>
                  <span className="font-semibold">R$ {numFmt(cart.shippingFee)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-gray-900 block">VALOR TOTAL DO PEDIDO:</span>
                  <span className="text-[10px] text-gray-500">Com entrega garantida & atendimento exclusivo</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-[#B76E79] font-serif-mk block">
                    R$ {numFmt(total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Formas de Pagamento & Chave Pix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-white p-3.5 rounded-2xl border border-gray-200 space-y-1">
                <span className="font-bold text-gray-900 text-[11px] flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#B76E79]" />
                  <span>Formas de Pagamento</span>
                </span>
                <p className="text-gray-600 text-[10px]">
                  • Pix com aprovação imediata<br />
                  • Cartão de Crédito em até 3x sem juros<br />
                  • Dinheiro no momento da entrega
                </p>
              </div>

              <div className="bg-[#F8E8E8]/40 p-3.5 rounded-2xl border border-[#E899AC]/40 space-y-1">
                <span className="font-bold text-[#B76E79] text-[11px] flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-[#B76E79]" />
                  <span>Chave Pix da Consultora</span>
                </span>
                <p className="text-gray-800 font-mono font-bold text-[11px] select-all">
                  {consultant?.pixKey || "(47) 99999-8888"}
                </p>
                <p className="text-gray-500 text-[9px]">
                  Favorecido: {consultant?.name || "Consultora Mary Kay®"}
                </p>
              </div>
            </div>

            {/* Rodapé de Agradecimento */}
            <div className="text-center pt-4 border-t border-gray-100 space-y-1">
              <p className="font-serif-mk font-bold text-xs text-gray-900">
                Obrigada por escolher a Mary Kay®! ✨
              </p>
              <p className="text-[10px] text-gray-400">
                Sua beleza é nossa paixão. Dúvidas? Fale direto com sua consultora {consultant?.name || "Mary Kay®"}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
