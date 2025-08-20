import React, { useState } from 'react';
import {
  X, 
  BookOpen, 
  MessageSquare, 
  Settings, 
  Users,
  Send,
  Tag,
  FileText,
  Phone,
  Video,
  CheckCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronRight,
  Search,
  Play
} from 'lucide-react';

interface WhatsAppHelpManualProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HelpSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  subsections: {
    id: string;
    title: string;
    content: string;
    steps?: string[];
    tips?: string[];
    warning?: string;
  }[];
}

export default function WhatsAppHelpManual({ isOpen, onClose }: WhatsAppHelpManualProps) {
  const [activeSection, setActiveSection] = useState<string>('primeiros-passos');
  const [expandedSections, setExpandedSections] = useState<string[]>(['primeiros-passos']);
  const [searchTerm, setSearchTerm] = useState('');

  const helpSections: HelpSection[] = [
    {
      id: 'primeiros-passos',
      title: 'Primeiros Passos',
      icon: Play,
      subsections: [
        {
          id: 'configuracao-inicial',
          title: 'Configuração Inicial',
          content: 'Configure sua conexão com WhatsApp Evolution API para começar a usar o CRM integrado.',
          steps: [
            'Clique no ícone de configuração (engrenagem) no canto superior direito',
            'Insira a URL da sua Evolution API (ex: https://api.evolution.com)',
            'Adicione sua chave de autenticação fornecida pelo provedor',
            'Digite o nome da instância do WhatsApp que você quer usar',
            'Clique em "Salvar e Conectar"',
            'Escaneie o QR Code com seu WhatsApp para conectar'
          ],
          tips: [
            'Mantenha sua chave de API segura e não compartilhe',
            'Use um nome de instância único e descritivo',
            'Teste a conexão antes de começar a usar'
          ]
        },
        {
          id: 'primeiro-contato',
          title: 'Enviando Primeiro Contato',
          content: 'Aprenda a enviar sua primeira mensagem através do CRM.',
          steps: [
            'Acesse a lista de leads no CRM',
            'Selecione um lead que tenha WhatsApp cadastrado',
            'Clique no ícone do WhatsApp no card do lead',
            'Digite sua mensagem no campo de texto',
            'Clique em "Enviar" ou pressione Enter'
          ],
          tips: [
            'Personalize suas mensagens com o nome do lead',
            'Use templates pré-definidos para agilizar o atendimento',
            'Sempre se identifique na primeira mensagem'
          ]
        }
      ]
    },
    {
      id: 'gerenciamento-leads',
      title: 'Gerenciamento de Leads',
      icon: Users,
      subsections: [
        {
          id: 'organizacao-tags',
          title: 'Organizando por Tags',
          content: 'Use tags para categorizar e filtrar seus leads de forma eficiente.',
          steps: [
            'Abra o detalhes de um lead',
            'Na seção "Tags", digite uma nova tag no campo',
            'Pressione Enter ou clique em "Adicionar"',
            'Use tags como "quente", "interessado", "agendado", etc.',
            'Filtre leads por tags na tela principal do CRM'
          ],
          tips: [
            'Use cores diferentes para cada categoria',
            'Crie um padrão de tags para toda a equipe',
            'Tags ajudam na automação de mensagens'
          ]
        },
        {
          id: 'acompanhamento-historico',
          title: 'Acompanhamento e Histórico',
          content: 'Mantenha o controle completo das interações com cada lead.',
          steps: [
            'Acesse o card do lead e clique em "Ver Detalhes"',
            'Navegue pela aba "Histórico & WhatsApp"',
            'Veja todas as mensagens automaticamente sincronizadas',
            'Adicione novas interações manualmente se necessário',
            'Use a aba "Anotações" para observações importantes'
          ],
          tips: [
            'Todas as mensagens do WhatsApp são salvas automaticamente',
            'Use anotações para registrar ligações e reuniões',
            'O histórico ajuda a personalizar o atendimento'
          ]
        }
      ]
    },
    {
      id: 'automacoes',
      title: 'Automações e Templates',
      icon: Settings,
      subsections: [
        {
          id: 'criando-templates',
          title: 'Criando Templates de Mensagem',
          content: 'Crie templates personalizados para agilizar seu atendimento.',
          steps: [
            'Acesse "Configurações" > "Templates de Mensagem"',
            'Clique em "Novo Template"',
            'Digite um nome para o template',
            'Escreva o conteúdo da mensagem',
            'Use variáveis como {{nome}} para personalização',
            'Salve e teste o template'
          ],
          tips: [
            'Use variáveis para personalizar automaticamente',
            'Crie templates para diferentes situações',
            'Mantenha as mensagens profissionais e claras'
          ]
        },
        {
          id: 'mensagens-massa',
          title: 'Mensagens em Massa',
          content: 'Envie mensagens para múltiplos leads simultaneamente.',
          steps: [
            'Na tela do CRM, selecione múltiplos leads',
            'Clique em "Ações em Massa" > "Enviar WhatsApp"',
            'Escolha um template ou digite uma mensagem',
            'Revise a lista de destinatários',
            'Clique em "Enviar para Todos"'
          ],
          warning: 'Use com moderação para evitar spam. Respeite a LGPD.',
          tips: [
            'Segmente bem sua lista antes de enviar',
            'Teste com um pequeno grupo primeiro',
            'Monitore as respostas e ajuste a estratégia'
          ]
        }
      ]
    },
    {
      id: 'funcionalidades-avancadas',
      title: 'Funcionalidades Avançadas',
      icon: Settings,
      subsections: [
        {
          id: 'integracao-crm',
          title: 'Integração com Pipeline CRM',
          content: 'Sincronize automaticamente conversas do WhatsApp com o funil de vendas.',
          steps: [
            'Configure tags automáticas baseadas em palavras-chave',
            'Defina regras para movimentar leads no pipeline',
            'Configure notificações para novos contatos',
            'Use gatilhos para envio automático de follow-up'
          ],
          tips: [
            'Automatize apenas processos bem definidos',
            'Monitore regularmente as automações',
            'Mantenha sempre o controle humano nas decisões importantes'
          ]
        },
        {
          id: 'relatorios-metricas',
          title: 'Relatórios e Métricas',
          content: 'Acompanhe o desempenho das suas conversas e vendas.',
          steps: [
            'Acesse "Relatórios" > "WhatsApp Analytics"',
            'Visualize métricas de resposta e conversão',
            'Analise os melhores horários de contato',
            'Acompanhe a evolução dos leads no pipeline',
            'Exporte relatórios para análise detalhada'
          ],
          tips: [
            'Use os dados para otimizar sua estratégia',
            'Identifique padrões de comportamento dos leads',
            'Ajuste horários de contato baseado nas métricas'
          ]
        }
      ]
    },
    {
      id: 'solucao-problemas',
      title: 'Solução de Problemas',
      icon: AlertTriangle,
      subsections: [
        {
          id: 'problemas-conexao',
          title: 'Problemas de Conexão',
          content: 'Resolva os problemas mais comuns de conectividade.',
          steps: [
            'Verifique se a URL da API está correta',
            'Confirme se a chave de autenticação não expirou',
            'Teste a conexão de internet',
            'Reinicie a instância do WhatsApp se necessário',
            'Entre em contato com o suporte se o problema persistir'
          ],
          warning: 'Nunca compartilhe suas credenciais de API.',
          tips: [
            'Mantenha backup das configurações',
            'Monitore o status da conexão regularmente',
            'Tenha um plano de contingência para falhas'
          ]
        },
        {
          id: 'mensagens-nao-enviadas',
          title: 'Mensagens Não Enviadas',
          content: 'O que fazer quando mensagens falham ao enviar.',
          steps: [
            'Verifique se o número está correto e ativo',
            'Confirme se o WhatsApp do destinatário está funcionando',
            'Verifique se há bloqueios ou restrições',
            'Tente reenviar após alguns minutos',
            'Use canais alternativos se necessário'
          ],
          tips: [
            'Sempre valide números antes de enviar',
            'Mantenha uma lista atualizada de contatos',
            'Use múltiplos canais de comunicação'
          ]
        }
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const filteredSections = helpSections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.subsections.some(sub => 
      sub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-200 bg-gray-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Manual WhatsApp CRM</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar ajuda..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="p-4 overflow-y-auto max-h-[calc(90vh-200px)]">
            <nav className="space-y-2">
              {filteredSections.map((section) => {
                const Icon = section.icon;
                const isExpanded = expandedSections.includes(section.id);
                
                return (
                  <div key={section.id}>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between p-2 text-left rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">{section.title}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="ml-6 mt-1 space-y-1">
                        {section.subsections.map((subsection) => (
                          <button
                            key={subsection.id}
                            onClick={() => setActiveSection(subsection.id)}
                            className={`w-full text-left p-2 text-sm rounded-md transition-colors ${
                              activeSection === subsection.id
                                ? 'bg-green-100 text-green-700'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {subsection.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto max-h-[90vh]">
          {(() => {
            const activeSubsection = filteredSections
              .flatMap(section => section.subsections)
              .find(sub => sub.id === activeSection);
            
            if (!activeSubsection) {
              return (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Bem-vindo ao Manual do WhatsApp CRM
                  </h3>
                  <p className="text-gray-600">
                    Selecione um tópico no menu lateral para começar
                  </p>
                </div>
              );
            }

            return (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {activeSubsection.title}
                  </h1>
                  <p className="text-gray-600 leading-relaxed">
                    {activeSubsection.content}
                  </p>
                </div>

                {activeSubsection.warning && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-800 mb-1">Atenção</h4>
                        <p className="text-red-700 text-sm">{activeSubsection.warning}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeSubsection.steps && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Passo a Passo
                    </h3>
                    <ol className="space-y-3">
                      {activeSubsection.steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white text-sm font-medium rounded-full flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {activeSubsection.tips && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800 mb-2">Dicas Importantes</h4>
                        <ul className="space-y-1">
                          {activeSubsection.tips.map((tip, index) => (
                            <li key={index} className="text-blue-700 text-sm flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}