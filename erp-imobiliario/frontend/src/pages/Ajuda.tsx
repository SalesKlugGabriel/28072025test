import React, { useState } from 'react';
import { QuestionMarkCircleIcon, ChevronRightIcon, ChevronDownIcon, BookOpenIcon, VideoCameraIcon, ChatBubbleLeftEllipsisIcon, PhoneIcon, DocumentTextIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface GuideItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  link: string;
}

const Ajuda: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [activeSection, setActiveSection] = useState('faq');

  const faqs: FAQItem[] = [
    {
      id: '1',
      category: 'crm',
      question: 'Como criar um novo lead no sistema?',
      answer: 'Para criar um novo lead, acesse o módulo CRM Comercial, clique no botão "Novo Lead" no topo do pipeline. Você pode escolher entre o formulário básico (nome, email, telefone, origem) ou completo (com seção de interesse expandida). O lead será vinculado automaticamente ao seu usuário.'
    },
    {
      id: '2',
      category: 'crm',
      question: 'Como usar a página individual do lead?',
      answer: 'Clique no botão "Detalhes" de qualquer lead no pipeline para ser redirecionado à página completa. Lá você pode: alterar pipeline e etapa no cabeçalho, definir investimento pretendido em formato monetário, configurar perfil do imóvel desejado, e usar o botão "Imóveis Sugeridos" para encontrar opções compatíveis.'
    },
    {
      id: '3',
      category: 'empreendimentos',
      question: 'Como funciona o sistema de terceiros?',
      answer: 'Imóveis de terceiros aparecem com cor verde e moldura dourada no mapa de disponibilidade. Na tabela, cada unidade de terceiro tem um botão "Acessar" para ver detalhes. O sistema diferencia visualmente terceiros de unidades próprias disponíveis.'
    },
    {
      id: '4',
      category: 'empreendimentos',
      question: 'Como adicionar condições de pagamento?',
      answer: 'No cadastro de empreendimento, há uma seção "Condições de Pagamento" onde você pode: 1) Digitar manualmente as condições, ou 2) Fazer upload de tabela (PDF, Excel, Word) que será processada automaticamente por IA para extrair as informações.'
    },
    {
      id: '5',
      category: 'prospeccoes',
      question: 'Como usar o módulo de Prospecções?',
      answer: 'Acesse Comercial > Prospecções. Registre suas ações em plataformas (OLX, WhatsApp, Facebook, etc.) informando quantidade enviada. Quando receber respostas, cadastre em "Respostas Recebidas" com sentimento positivo/negativo. Respostas positivas permitem conversão direta em lead.'
    },
    {
      id: '6',
      category: 'pessoas',
      question: 'Como funciona o controle de usuários nos cadastros?',
      answer: 'Cada lead/cliente é automaticamente vinculado ao usuário que o cadastrou. Você só visualiza pessoas que você cadastrou, impedindo duplicatas e garantindo privacidade. O sistema bloqueia cadastros duplicados baseado em nome+telefone ou email.'
    },
    {
      id: '5',
      category: 'empreendimentos',
      question: 'Como criar um novo empreendimento?',
      answer: 'Em Cadastros > Empreendimentos, clique em "Novo Empreendimento". Adicione informações como nome, descrição, localização, valores e características. Use o botão "Próxima Etapa" para avançar no cadastro.'
    },
    {
      id: '6',
      category: 'relatorios',
      question: 'Como gerar relatórios do sistema?',
      answer: 'Acesse Comercial > Relatórios. Escolha o tipo de relatório desejado (vendas, leads, comissões, etc.), defina o período e clique em "Gerar". Os relatórios podem ser exportados em CSV, Excel ou PDF.'
    },
    {
      id: '7',
      category: 'automacoes',
      question: 'Como configurar notificações automáticas?',
      answer: 'Em Automações > Notificações, configure os canais (WhatsApp, Email, SMS), crie templates de mensagem e defina regras de disparo. O sistema enviará notificações automaticamente conforme as regras definidas.'
    },
    {
      id: '8',
      category: 'juridico',
      question: 'Como gerenciar contratos no módulo jurídico?',
      answer: 'No módulo Jurídico, você pode criar minutas, gerenciar contratos ativos e acompanhar vencimentos. Use as abas para navegar entre diferentes tipos de documentos e configurar alertas de vencimento.'
    },
    {
      id: '9',
      category: 'agenda',
      question: 'Como criar um compromisso na agenda?',
      answer: 'Na Agenda, clique em "Novo Evento", escolha o tipo (reunião, ligação, visita), defina data/hora, adicione participantes e configurre lembretes. O evento aparecerá automaticamente no calendário.'
    },
    {
      id: '10',
      category: 'agenda',
      question: 'Como visualizar diferentes formatos de calendário?',
      answer: 'Use os botões no topo da agenda para alternar entre visualização diária, semanal, mensal ou lista. Cada visualização oferece diferentes níveis de detalhamento dos compromissos.'
    },
    {
      id: '11',
      category: 'financeiro',
      question: 'Como calcular correção monetária (CUBSC)?',
      answer: 'No perfil do cliente ou na aba de investimentos, use a calculadora CUBSC. Informe o valor inicial, data base e data final. O sistema calcula automaticamente a correção baseada no CUB.'
    },
    {
      id: '12',
      category: 'financeiro',
      question: 'Como acompanhar investimentos dos clientes?',
      answer: 'No perfil do cliente, vá na aba "Investimentos" para ver unidades adquiridas, valores contratuais, valor corrigido e valor atual de mercado. Inclui histórico completo e cálculo de valorização.'
    },
    {
      id: '13',
      category: 'colaboradores',
      question: 'Como registrar faltas e atestados de colaboradores?',
      answer: 'No perfil do colaborador, use as abas específicas (Faltas, Atestados) para registrar ocorrências. Cada aba tem formulários apropriados com campos para documentação e justificativas.'
    },
    {
      id: '14',
      category: 'colaboradores',
      question: 'Como gerenciar banco de horas?',
      answer: 'Na aba "Banco de Horas" do perfil do colaborador, registre lançamentos de crédito ou débito, especificando horas e motivo. O sistema mantém saldo atualizado automaticamente.'
    },
    {
      id: '15',
      category: 'dashboard',
      question: 'Como interpretar os dados do dashboard?',
      answer: 'O dashboard mostra informações dos setores econômicos, leads por categoria e tempo de contato. Clique nos cards dos setores para ver detalhes completos e lista de leads relacionados.'
    },
    {
      id: '16',
      category: 'configuracoes',
      question: 'Como personalizar notificações do sistema?',
      answer: 'Em Configurações > Notificações, defina preferências para email, WhatsApp e notificações push. Configure alertas para leads frios, vencimentos e follow-ups pendentes.'
    }
  ];

  const guides: GuideItem[] = [
    {
      id: '1',
      title: 'Primeiros Passos',
      description: 'Guia completo para começar a usar o LegaSys ERP',
      icon: BookOpenIcon,
      link: '#primeiros-passos'
    },
    {
      id: '2',
      title: 'Gestão de Leads',
      description: 'Como gerenciar leads do primeiro contato até a venda',
      icon: ComputerDesktopIcon,
      link: '#gestao-leads'
    },
    {
      id: '3',
      title: 'WhatsApp Business',
      description: 'Integração e uso do WhatsApp no atendimento',
      icon: ChatBubbleLeftEllipsisIcon,
      link: '#whatsapp-business'
    },
    {
      id: '4',
      title: 'Relatórios e Análises',
      description: 'Como extrair insights dos seus dados',
      icon: DocumentTextIcon,
      link: '#relatorios-analises'
    }
  ];

  const categories = [
    { id: 'todos', name: 'Todas as Categorias', count: faqs.length },
    { id: 'crm', name: 'CRM Comercial', count: faqs.filter(f => f.category === 'crm').length },
    { id: 'whatsapp', name: 'WhatsApp', count: faqs.filter(f => f.category === 'whatsapp').length },
    { id: 'pessoas', name: 'Pessoas', count: faqs.filter(f => f.category === 'pessoas').length },
    { id: 'empreendimentos', name: 'Empreendimentos', count: faqs.filter(f => f.category === 'empreendimentos').length },
    { id: 'prospeccoes', name: 'Prospecções', count: faqs.filter(f => f.category === 'prospeccoes').length },
    { id: 'agenda', name: 'Agenda', count: faqs.filter(f => f.category === 'agenda').length },
    { id: 'financeiro', name: 'Financeiro', count: faqs.filter(f => f.category === 'financeiro').length },
    { id: 'colaboradores', name: 'Colaboradores', count: faqs.filter(f => f.category === 'colaboradores').length },
    { id: 'dashboard', name: 'Dashboard', count: faqs.filter(f => f.category === 'dashboard').length },
    { id: 'relatorios', name: 'Relatórios', count: faqs.filter(f => f.category === 'relatorios').length },
    { id: 'automacoes', name: 'Automações', count: faqs.filter(f => f.category === 'automacoes').length },
    { id: 'juridico', name: 'Jurídico', count: faqs.filter(f => f.category === 'juridico').length },
    { id: 'configuracoes', name: 'Configurações', count: faqs.filter(f => f.category === 'configuracoes').length }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <QuestionMarkCircleIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Central de Ajuda LegaSys ERP</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Encontre respostas, guias e suporte para usar o LegaSys ERP da melhor forma
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'faq', name: 'Perguntas Frequentes', icon: QuestionMarkCircleIcon },
                { id: 'guides', name: 'Guias e Tutoriais', icon: BookOpenIcon },
                { id: 'videos', name: 'Vídeo Aulas', icon: VideoCameraIcon },
                { id: 'contact', name: 'Contato & Suporte', icon: ChatBubbleLeftEllipsisIcon }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id)}
                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeSection === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
          {activeSection === 'faq' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Categories Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorias</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{category.name}</span>
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                            {category.count}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* FAQ Content */}
              <div className="lg:col-span-3">
                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar nas perguntas frequentes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <QuestionMarkCircleIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                  {filteredFAQs.length === 0 ? (
                    <div className="text-center py-12">
                      <QuestionMarkCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma pergunta encontrada</h3>
                      <p className="text-gray-600">Tente buscar com outros termos ou selecione uma categoria diferente.</p>
                    </div>
                  ) : (
                    filteredFAQs.map((faq) => (
                      <div key={faq.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <button
                          onClick={() => toggleFAQ(faq.id)}
                          className="w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg"
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-medium text-gray-900 pr-4">{faq.question}</h3>
                            {expandedFAQ === faq.id ? (
                              <ChevronDownIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            ) : (
                              <ChevronRightIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            )}
                          </div>
                        </button>
                        {expandedFAQ === faq.id && (
                          <div className="px-6 pb-6">
                            <div className="border-t border-gray-200 pt-4">
                              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                              <div className="mt-3">
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                  {categories.find(c => c.id === faq.category)?.name || faq.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'guides' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Guias e Tutoriais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.map((guide) => {
                  const Icon = guide.icon;
                  return (
                    <div key={guide.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                      <Icon className="h-8 w-8 text-blue-600 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{guide.title}</h3>
                      <p className="text-gray-600 mb-4">{guide.description}</p>
                      <a
                        href={guide.link}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                      >
                        Acessar Guia
                        <ChevronRightIcon className="h-4 w-4" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeSection === 'videos' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Vídeo Aulas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { id: '1', title: 'Configuração Inicial do Sistema', duration: '12:30', thumbnail: '/api/placeholder/300/200' },
                  { id: '2', title: 'Gerenciamento de Leads no CRM', duration: '18:45', thumbnail: '/api/placeholder/300/200' },
                  { id: '3', title: 'Integração com WhatsApp Business', duration: '15:20', thumbnail: '/api/placeholder/300/200' },
                  { id: '4', title: 'Criando Relatórios Personalizados', duration: '22:10', thumbnail: '/api/placeholder/300/200' },
                  { id: '5', title: 'Automações e Workflows', duration: '16:55', thumbnail: '/api/placeholder/300/200' },
                  { id: '6', title: 'Gestão Financeira e CUBSC', duration: '19:30', thumbnail: '/api/placeholder/300/200' }
                ].map((video) => (
                  <div key={video.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                    <div className="aspect-video bg-gray-200 flex items-center justify-center">
                      <VideoCameraIcon className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Duração: {video.duration}</span>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Assistir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'contact' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contato & Suporte</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <PhoneIcon className="h-6 w-6 text-green-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Suporte Telefônico</h3>
                    </div>
                    <p className="text-gray-600 mb-3">Atendimento de segunda a sexta, das 8h às 18h</p>
                    <p className="text-lg font-medium text-gray-900">(11) 3000-0000</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <ChatBubbleLeftEllipsisIcon className="h-6 w-6 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Chat Online</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Atendimento imediato via chat</p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Iniciar Chat
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Envie uma Mensagem</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                      <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Assunto</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                        <option>Dúvida sobre funcionalidade</option>
                        <option>Problema técnico</option>
                        <option>Solicitação de recurso</option>
                        <option>Feedback</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem</label>
                      <textarea rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Enviar Mensagem
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ajuda;