# 🏢 LegaSys ERP - Sistema ERP Imobiliário Completo

[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0+-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Sistema ERP completo para empresas imobiliárias**, desenvolvido com tecnologias modernas e foco na experiência do usuário.

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Roadmap](#-roadmap)
- [Status do Desenvolvimento](#-status-do-desenvolvimento)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

O **LegaSys ERP** é uma solução completa de gestão empresarial desenvolvida especificamente para o mercado imobiliário. O sistema integra todas as operações essenciais da empresa em uma plataforma moderna, intuitiva e altamente eficiente.

### 🌟 Diferenciais

- **Interface Moderna**: Design responsivo e intuitivo com Tailwind CSS
- **Performance Otimizada**: Construído com Vite para desenvolvimento e build rápidos
- **Type-Safe**: Desenvolvido 100% em TypeScript para máxima confiabilidade
- **Modular**: Arquitetura componentizada e reutilizável
- **Escalável**: Preparado para crescer junto com sua empresa

---

## ✨ Funcionalidades

### 🏠 **Módulos Principais**

| Módulo | Descrição | Status |
|--------|-----------|---------|
| 📊 **Dashboard** | Visão geral de KPIs, métricas e atividades | 🔄 Em desenvolvimento |
| 👥 **Cadastros** | Gestão de clientes, fornecedores e usuários | 🔄 Em desenvolvimento |
| 🏢 **Empreendimentos** | Controle completo de projetos imobiliários | 🔄 Em desenvolvimento |
| 💼 **CRM** | Sistema de relacionamento com clientes | 🔄 Em desenvolvimento |
| 💰 **Financeiro** | Controle financeiro e fluxo de caixa | 🔄 Em desenvolvimento |
| 📈 **Relatórios** | Relatórios gerenciais e analíticos | 🔄 Em desenvolvimento |
| ⚙️ **Configurações** | Personalização e configurações do sistema | 🔄 Em desenvolvimento |

### 🚀 **Funcionalidades Avançadas**

- **Dashboard Interativo** com widgets personalizáveis
- **CRM com Kanban Board** para gestão de leads
- **Upload e Processamento** de planilhas e documentos
- **Mapa Visual** para localização de empreendimentos
- **Chat Integrado** para comunicação interna
- **Integração WhatsApp** para atendimento ao cliente
- **Sistema de Tags** para categorização avançada
- **Relatórios Exportáveis** em PDF e Excel

---

## 🛠 Tecnologias

### **Frontend**
- **React 18+** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS utilitário
- **React Router DOM** - Roteamento para aplicações React
- **Lucide React** - Biblioteca de ícones moderna
- **React Hot Toast** - Sistema de notificações
- **Recharts** - Biblioteca para gráficos e dashboards

### **Desenvolvimento**
- **ESLint** - Linter para código JavaScript/TypeScript
- **Git** - Controle de versão
- **GitHub Codespaces** - Ambiente de desenvolvimento na nuvem

### **Planejado para Futuras Versões**
- **Node.js + Express** - Backend API
- **PostgreSQL** - Banco de dados relacional
- **Prisma ORM** - ORM moderno para TypeScript
- **JWT** - Autenticação e autorização

---

## 📋 Pré-requisitos

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0 ou **yarn** >= 1.22.0
- **Git** para controle de versão

---

## 🚀 Instalação

### **1. Clone o Repositório**
```bash
git clone https://github.com/SalesKlugGabriel/28072025test.git
cd 28072025test
```

### **2. Instale as Dependências**
```bash
npm install
# ou
yarn install
```

### **3. Execute o Projeto**
```bash
npm run dev
# ou
yarn dev
```

### **4. Abra no Navegador**
```
http://localhost:5173
```

---

## 📁 Estrutura do Projeto

```
LegaSys ERP/
├── 📁 public/                 # Arquivos estáticos
├── 📁 src/                    # Código fonte principal
│   ├── 📁 components/         # Componentes reutilizáveis
│   ├── 📁 pages/             # Páginas da aplicação
│   ├── 📁 hooks/             # Hooks customizados
│   ├── 📁 services/          # Serviços e APIs
│   ├── 📁 contexts/          # Contextos React
│   ├── 📁 utils/             # Funções utilitárias
│   ├── 📁 types/             # Definições de tipos TypeScript
│   └── 📁 assets/            # Imagens, ícones, etc.
├── 📁 erp-imobiliario/       # Módulos específicos do ERP
│   ├── 📁 components/        # Componentes específicos do ERP
│   ├── 📁 modules/           # Módulos do sistema
│   └── 📁 utils/             # Utilitários específicos
├── 📄 package.json           # Dependências e scripts
├── 📄 vite.config.ts         # Configuração do Vite
├── 📄 tsconfig.json          # Configuração do TypeScript
├── 📄 tailwind.config.js     # Configuração do Tailwind
└── 📄 README.md              # Este arquivo
```

---

## 🔧 Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| **Desenvolvimento** | `npm run dev` | Inicia servidor de desenvolvimento |
| **Build** | `npm run build` | Gera build de produção |
| **Preview** | `npm run preview` | Visualiza build de produção |
| **Lint** | `npm run lint` | Executa verificação de código |
| **Type Check** | `npm run type-check` | Verifica tipos TypeScript |

### **Scripts Personalizados**

```bash
# Diagnóstico do sistema
node status-checker.js

# Diagnóstico rápido
./quick-status.sh
```

---

## 🗺 Roadmap

### **📅 Fase 1 - Fundação (Em andamento)**
- [x] Setup inicial do projeto
- [x] Configuração TypeScript + Vite + Tailwind
- [x] Estrutura de pastas e arquivos
- [ ] Layout base e navegação
- [ ] Sistema de roteamento
- [ ] Componentes base (Button, Input, Modal, etc.)

### **📅 Fase 2 - Módulos Core**
- [ ] Dashboard principal com KPIs
- [ ] Sistema de autenticação
- [ ] Módulo de Cadastros (CRUD completo)
- [ ] Módulo CRM com Kanban
- [ ] Sistema de upload de arquivos

### **📅 Fase 3 - Funcionalidades Avançadas**
- [ ] Módulo de Empreendimentos
- [ ] Integração com mapas
- [ ] Chat interno
- [ ] Sistema de relatórios
- [ ] Módulo Financeiro

### **📅 Fase 4 - Integrações**
- [ ] API Backend (Node.js + PostgreSQL)
- [ ] Integração WhatsApp
- [ ] Export de relatórios
- [ ] Sistema de notificações
- [ ] PWA (Progressive Web App)

---

## 📊 Status do Desenvolvimento

### **🎯 Progresso Geral: 15%**

| Área | Progresso | Status |
|------|-----------|---------|
| Setup e Configuração | 100% | ✅ Concluído |
| Estrutura Base | 80% | 🔄 Em progresso |
| Componentes UI | 10% | ⏳ Planejado |
| Módulos ERP | 0% | ⏳ Aguardando |
| Backend API | 0% | ⏳ Futuro |
| Testes | 0% | ⏳ Futuro |

### **📋 Diagnóstico Atual**

**✅ Configurado:**
- React + TypeScript + Vite + Tailwind
- Dependências instaladas
- Scripts de build e desenvolvimento

**⚠️ Pendente:**
- Estrutura de componentes
- Páginas principais
- Hooks customizados
- Serviços de API
- Implementação dos módulos ERP

---

## 🎨 Design System

O LegaSys segue um design system consistente:

### **🎨 Cores Principais**
- **Primária**: Azul (#3B82F6)
- **Secundária**: Verde (#10B981)
- **Acento**: Roxo (#8B5CF6)
- **Neutra**: Cinza (#6B7280)

### **📝 Tipografia**
- **Font Family**: Inter (Google Fonts)
- **Tamanhos**: 12px, 14px, 16px, 18px, 24px, 32px

### **🎯 Componentes**
- Design consistente em todos os módulos
- Acessibilidade (WCAG 2.1)
- Responsividade mobile-first
- Dark mode (planejado)

---

## 👨‍💻 Contribuição

### **Como Contribuir**

1. **Fork** o projeto
2. **Clone** sua fork: `git clone https://github.com/SEU_USERNAME/28072025test.git`
3. **Crie** uma branch: `git checkout -b feature/nova-funcionalidade`
4. **Commit** suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
5. **Push** para a branch: `git push origin feature/nova-funcionalidade`
6. **Abra** um Pull Request

### **📝 Padrões de Código**

- Use **TypeScript** para todo código
- Siga as convenções do **ESLint**
- **Componentes** em PascalCase
- **Hooks** começam com "use"
- **Commits** em português, descritivos

### **🐛 Reportar Bugs**

Abra uma [issue](https://github.com/SalesKlugGabriel/28072025test/issues) com:
- Descrição detalhada do problema
- Passos para reproduzir
- Screenshots (se aplicável)
- Informações do ambiente

---

## 🚀 Deploy

### **Vercel (Recomendado)**
```bash
npm install -g vercel
vercel --prod
```

### **Netlify**
```bash
npm run build
# Upload da pasta dist/
```

### **GitHub Pages**
```bash
npm run build
# Configure GitHub Pages para usar a pasta dist/
```

---

## 📞 Suporte

- **Email**: saleskluggabriel@gmail.com
- **GitHub Issues**: [Abrir Issue](https://github.com/SalesKlugGabriel/28072025test/issues)
- **Documentação**: [Wiki do Projeto](https://github.com/SalesKlugGabriel/28072025test/wiki)

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 🙏 Agradecimentos

- **React Team** pela excelente biblioteca
- **Vercel** pela ferramenta Vite incrível
- **Tailwind Labs** pelo framework CSS fantástico
- **TypeScript Team** pela tipagem robusta
- **Comunidade Open Source** pelo suporte contínuo

---

## 📈 Analytics

### **Últimas Atualizações**
- **06/08/2025**: Setup inicial do projeto
- **06/08/2025**: Configuração TypeScript + Vite + Tailwind
- **06/08/2025**: Script de diagnóstico implementado
- **06/08/2025**: README.md criado

### **Próximas Milestone**
- **07/08/2025**: Estrutura de componentes base
- **08/08/2025**: Layout principal e navegação
- **10/08/2025**: Primeiro módulo (Dashboard) funcional

---

**🚀 Feito com ❤️ para revolucionar a gestão imobiliária**

*LegaSys ERP - Transformando negócios, um código de cada vez.*
