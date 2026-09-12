# 🌸 Sistema de Gestão Mary Kay® - Consultora Tailise

Sistema Web completo, moderno e elegante para gerenciamento de clientes, orçamentos, vendas, pronta-entrega/estoque, kits personalizados, programa de fidelidade VIP, panfletos de marketing e inteligência de negócios (Dashboard & DRE) para Consultoras de Beleza Independentes Mary Kay®.

![Mary Kay Banner](public/images/tailise_avatar.png)

---

## ✨ Funcionalidades Principais

- **🛒 Gestão de Carrinhos & Orçamentos**: Criação de múltiplos carrinhos por cliente, cálculo automático de descontos, frete, pontos de fidelidade e geração de orçamentos em PDF / Imagem JPG para envio por WhatsApp.
- **📊 Dashboard de Vendas & BI**: Visão em tempo real do faturamento bruto, lucro líquido real, ticket médio, unidades vendidas, ranking dos 10 produtos mais vendidos (Troféus 🥇 🥈 🥉) e vendas por categoria.
- **🛡️ Gestão Financeira & DRE**: Demonstração do Resultado do Exercício (DRE), controle de fiados/contas a receber e histórico de pagamentos por PIX, Cartão e Dinheiro.
- **📦 Controle de Pronta-Entrega (Estoque)**: Cadastro de produtos em estoque físico, indicador automático de pronta-entrega no catálogo, baixa automática por venda e alertas de produtos parados (> 60 dias).
- **🎁 Pacotes & Kits Personalizados**: Criação de kits com foto personalizada, composição flexível de produtos, desconto automático e adição direta aos carrinhos das clientes.
- **💎 Programa de Fidelidade VIP**: Sistema de pontuação (1 ponto por R$ 1 gasto), resgate de brindes e níveis de clientes (Diamante, Ouro, Prata).
- **🎨 Gerador de Panfletos Promocionais**: Seleção personalizada de produtos para criar panfletos em imagem de alta qualidade para redes sociais e status do WhatsApp.
- **👥 Gestão Multivendedoras & Configurações**: Cadastro de dados da consultora, chave PIX, telefone, trocas de login/senha e perfil personalizável.
- **🔄 Sincronização de Catálogo Mary Kay®**: Atualização de produtos, SKUs, preços de capa e imagens sincronizados com o site oficial.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React, Vite, Tailwind CSS, Lucide React (Ícones)
- **Backend**: Node.js, Express.js
- **Geração de Documentos**: html2pdf.js / html2canvas (Geração de PDFs e JPGs)

---

## 🚀 Como Executar o Projeto Localmente

1. **Clonar o Repositório**:
   ```bash
   git clone https://github.com/elCortelini/app-mary-kay-tailise.git
   cd app-mary-kay-tailise
   ```

2. **Instalar as Dependências**:
   ```bash
   npm install
   ```

3. **Iniciar o Servidor Backend (Node.js)**:
   ```bash
   node server/index.js
   ```

4. **Iniciar o Servidor Dev (Vite)**:
   ```bash
   npm run dev
   ```

5. **Acessar a Aplicação**:
   Abra o navegador em `http://localhost:5173`.

---

## 📄 Licença

Este projeto é desenvolvido para uso exclusivo de consultoria de beleza independente Mary Kay®.
