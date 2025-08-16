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

  const faqs: FAQItem[] = [
    {
      id: '1',
      category: 'crm',
      question: 'Como criar um novo lead no sistema?',
      answer: 'Para criar um novo lead, acesse o módulo CRM Comercial, clique no botão "Criar Novo Lead" no topo do pipeline. Preencha as informações básicas como nome, telefone, email e fonte do lead. O lead será automaticamente adicionado à primeira coluna do pipeline.'
    },
    {
      id: '2',
      category: 'crm',
      question: 'Como mover leads entre as etapas do pipeline?',
      answer: 'Você pode mover leads de duas formas: 1) Arrastar e soltar (drag & drop) diretamente no quadro Kanban, ou 2) Abrir o lead e usar os botões de ação para mudar o estágio. As mudanças são salvas automaticamente.'
    },
    {
      id: '3',
      category: 'whatsapp',
      question: 'Como configurar o WhatsApp no sistema?',
      answer: 'Acesse Configurações > Integrações > WhatsApp. Escaneie o QR Code que aparece na tela com seu WhatsApp Business. Uma vez conectado, as mensagens aparecerão automaticamente no módulo WhatsApp do sistema.'
    },
    {
      id: '4',
      category: 'pessoas',
      question: 'Como cadastrar um novo cliente?',
      answer: 'Vá em Cadastros > Pessoas, clique em "Novo Cliente". Preencha os dados pessoais, informações de contato e dados bancários. O sistema salva automaticamente e permite edição inline dos campos.'
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
    { id: 'relatorios', name: 'Relatórios', count: faqs.filter(f => f.category === 'relatorios').length },
    { id: 'automacoes', name: 'Automações', count: faqs.filter(f => f.category === 'automacoes').length },
    { id: 'juridico', name: 'Jurídico', count: faqs.filter(f => f.category === 'juridico').length }
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <QuestionMarkCircleIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Central de Ajuda</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Encontre respostas, guias e suporte para usar o LegaSys ERP da melhor forma
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <VideoCameraIcon className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Vídeo Tutoriais</h3>
            <p className="text-gray-600 text-sm">Aprenda com vídeos práticos</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <ChatBubbleLeftEllipsisIcon className="h-8 w-8 text-green-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Chat ao Vivo</h3>
            <p className="text-gray-600 text-sm">Fale com nossa equipe</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <PhoneIcon className="h-8 w-8 text-purple-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Suporte Técnico</h3>
            <p className="text-gray-600 text-sm">(11) 99999-9999</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <DocumentTextIcon className="h-8 w-8 text-orange-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Documentação</h3>
            <p className="text-gray-600 text-sm">Guia completo do sistema</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Guides */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Guias Rápidos</h2>
              <div className="space-y-3">
                {guides.map((guide) => (
                  <div
                    key={guide.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <guide.icon className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-900">{guide.title}</h3>
                      <p className="text-sm text-gray-600">{guide.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - FAQs */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Perguntas Frequentes</h2>
              
              {/* Search */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Buscar perguntas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Categories */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* FAQ List */}
              <div className="space-y-3">
                {filteredFAQs.map((faq) => (
                  <div
                    key={faq.id}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      {expandedFAQ === faq.id ? (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredFAQs.length === 0 && (
                <div className="text-center py-8">
                  <QuestionMarkCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Nenhuma pergunta encontrada para sua busca.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Contact */}
        <div className="mt-8 bg-blue-600 rounded-xl p-6 text-white">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Não encontrou o que procurava?</h3>
            <p className="mb-4">Nossa equipe está pronta para ajudar você</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Abrir Chamado
              </button>
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-400 transition-colors">
                Agendar Demonstração
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ajuda;