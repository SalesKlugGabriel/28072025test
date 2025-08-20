import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  BuildingOffice2Icon,
  CurrencyDollarIcon,
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  PlusIcon,
  XMarkIcon,
  PaperClipIcon,
  TrashIcon,
  EyeIcon,
  PencilIcon,
  CheckIcon,
  StarIcon,
  TagIcon,
  ChatBubbleLeftRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  telefoneSecundario?: string;
  emailSecundario?: string;
  endereco: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  origemContato: string;
  interesseImovel: string[];
  orcamentoMinimo?: number;
  orcamentoMaximo?: number;
  prazoCompra?: string;
  observacoes?: string;
  pontuacao: number;
  tags: string[];
  status: string;
  responsavel?: string;
  ultimaInteracao?: Date;
  documentos: Documento[];
  interacoes: Interacao[];
  createdAt: Date;
  updatedAt: Date;
}

interface Documento {
  id: string;
  nome: string;
  tipo: string;
  url: string;
  tamanho: number;
  uploadedAt: Date;
}

interface Interacao {
  id: string;
  tipo: 'ligacao' | 'email' | 'whatsapp' | 'reuniao' | 'visita' | 'nota';
  descricao: string;
  data: Date;
  usuario: string;
  anexos?: string[];
}

const LeadEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('dados');
  const [novaInteracao, setNovaInteracao] = useState({
    tipo: 'nota',
    descricao: '',
    data: new Date().toISOString().slice(0, 16)
  });
  const [showNovaInteracao, setShowNovaInteracao] = useState(false);
  const [novosDocumentos, setNovosDocumentos] = useState<File[]>([]);

  // TODO: Replace with API integration to fetch lead edit data
  // Remove mock data and implement proper API calls to backend lead service
  useEffect(() => {
    // API call to fetch lead by ID for editing should go here
    // For now, setting null to prevent errors until API is integrated
    setTimeout(() => {
      setLead(null); // This will show loading state until API is integrated
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleSave = async () => {
    if (!lead) return;
    
    setSaving(true);
    try {
      // Aqui faria a chamada para a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Lead salvo:', lead);
      // Mostrar notificação de sucesso
    } catch (error) {
      console.error('Erro ao salvar lead:', error);
      // Mostrar notificação de erro
    } finally {
      setSaving(false);
    }
  };

  const adicionarInteracao = () => {
    if (!lead || !novaInteracao.descricao.trim()) return;

    const interacao: Interacao = {
      id: Date.now().toString(),
      tipo: novaInteracao.tipo as any,
      descricao: novaInteracao.descricao,
      data: new Date(novaInteracao.data),
      usuario: 'Usuário Atual'
    };

    setLead({
      ...lead,
      interacoes: [interacao, ...lead.interacoes],
      ultimaInteracao: new Date()
    });

    setNovaInteracao({
      tipo: 'nota',
      descricao: '',
      data: new Date().toISOString().slice(0, 16)
    });
    setShowNovaInteracao(false);
  };

  const adicionarTag = (novaTag: string) => {
    if (!lead || !novaTag.trim() || lead.tags.includes(novaTag)) return;
    
    setLead({
      ...lead,
      tags: [...lead.tags, novaTag]
    });
  };

  const removerTag = (tag: string) => {
    if (!lead) return;
    
    setLead({
      ...lead,
      tags: lead.tags.filter(t => t !== tag)
    });
  };

  const formatarTamanho = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getIconeInteracao = (tipo: string) => {
    switch (tipo) {
      case 'ligacao': return PhoneIcon;
      case 'email': return EnvelopeIcon;
      case 'whatsapp': return ChatBubbleLeftRightIcon;
      case 'reuniao': return UserIcon;
      case 'visita': return BuildingOffice2Icon;
      default: return DocumentTextIcon;
    }
  };

  const getCorInteracao = (tipo: string) => {
    switch (tipo) {
      case 'ligacao': return 'bg-blue-100 text-blue-600';
      case 'email': return 'bg-purple-100 text-purple-600';
      case 'whatsapp': return 'bg-green-100 text-green-600';
      case 'reuniao': return 'bg-orange-100 text-orange-600';
      case 'visita': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados do lead...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-600">Lead não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{lead.nome}</h1>
                <div className="flex items-center space-x-4 mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    lead.status === 'Qualificado' ? 'bg-green-100 text-green-800' :
                    lead.status === 'Contactado' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {lead.status}
                  </span>
                  <div className="flex items-center space-x-1">
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-gray-600">{lead.pontuacao}/100</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Salvar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: 'dados', name: 'Dados Pessoais', icon: UserIcon },
              { id: 'interesse', name: 'Interesse', icon: BuildingOffice2Icon },
              { id: 'interacoes', name: 'Interações', icon: ChatBubbleLeftRightIcon },
              { id: 'documentos', name: 'Documentos', icon: DocumentTextIcon }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          {/* Tab: Dados Pessoais */}
          {activeTab === 'dados' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Informações Básicas */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Informações Básicas</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                    <input
                      type="text"
                      value={lead.nome}
                      onChange={(e) => setLead({ ...lead, nome: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Principal</label>
                      <input
                        type="email"
                        value={lead.email}
                        onChange={(e) => setLead({ ...lead, email: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Secundário</label>
                      <input
                        type="email"
                        value={lead.emailSecundario || ''}
                        onChange={(e) => setLead({ ...lead, emailSecundario: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefone Principal</label>
                      <input
                        type="tel"
                        value={lead.telefone}
                        onChange={(e) => setLead({ ...lead, telefone: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefone Secundário</label>
                      <input
                        type="tel"
                        value={lead.telefoneSecundario || ''}
                        onChange={(e) => setLead({ ...lead, telefoneSecundario: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Endereço */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Endereço</h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
                      <input
                        type="text"
                        value={lead.endereco.rua}
                        onChange={(e) => setLead({
                          ...lead,
                          endereco: { ...lead.endereco, rua: e.target.value }
                        })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                      <input
                        type="text"
                        value={lead.endereco.numero}
                        onChange={(e) => setLead({
                          ...lead,
                          endereco: { ...lead.endereco, numero: e.target.value }
                        })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                    <input
                      type="text"
                      value={lead.endereco.complemento || ''}
                      onChange={(e) => setLead({
                        ...lead,
                        endereco: { ...lead.endereco, complemento: e.target.value }
                      })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                      <input
                        type="text"
                        value={lead.endereco.bairro}
                        onChange={(e) => setLead({
                          ...lead,
                          endereco: { ...lead.endereco, bairro: e.target.value }
                        })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                      <input
                        type="text"
                        value={lead.endereco.cep}
                        onChange={(e) => setLead({
                          ...lead,
                          endereco: { ...lead.endereco, cep: e.target.value }
                        })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                      <input
                        type="text"
                        value={lead.endereco.cidade}
                        onChange={(e) => setLead({
                          ...lead,
                          endereco: { ...lead.endereco, cidade: e.target.value }
                        })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                      <select
                        value={lead.endereco.estado}
                        onChange={(e) => setLead({
                          ...lead,
                          endereco: { ...lead.endereco, estado: e.target.value }
                        })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="SP">São Paulo</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="PR">Paraná</option>
                        <option value="SC">Santa Catarina</option>
                        {/* Adicionar outros estados */}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {lead.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removerTag(tag)}
                        className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const novaTag = prompt('Nova tag:');
                      if (novaTag) adicionarTag(novaTag);
                    }}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Adicionar Tag
                  </button>
                </div>
              </div>

              {/* Observações */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea
                  rows={4}
                  value={lead.observacoes || ''}
                  onChange={(e) => setLead({ ...lead, observacoes: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Observações sobre o lead..."
                />
              </div>
            </div>
          )}

          {/* Tab: Interesse */}
          {activeTab === 'interesse' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Interesse Imobiliário</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Origem do Contato</label>
                    <select
                      value={lead.origemContato}
                      onChange={(e) => setLead({ ...lead, origemContato: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Facebook Ads">Facebook Ads</option>
                      <option value="Google Ads">Google Ads</option>
                      <option value="Instagram">Instagram</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Indicação">Indicação</option>
                      <option value="Site">Site</option>
                      <option value="Telefone">Telefone</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prazo para Compra</label>
                    <select
                      value={lead.prazoCompra || ''}
                      onChange={(e) => setLead({ ...lead, prazoCompra: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="Imediato">Imediato</option>
                      <option value="3 meses">Até 3 meses</option>
                      <option value="6 meses">Até 6 meses</option>
                      <option value="1 ano">Até 1 ano</option>
                      <option value="Mais de 1 ano">Mais de 1 ano</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
                    <select
                      value={lead.responsavel || ''}
                      onChange={(e) => setLead({ ...lead, responsavel: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione um responsável...</option>
                      <option value="Maria Comercial">Maria Comercial</option>
                      <option value="João Vendas">João Vendas</option>
                      <option value="Ana Corretora">Ana Corretora</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Orçamento</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Valor Mínimo</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">R$</span>
                        </div>
                        <input
                          type="number"
                          value={lead.orcamentoMinimo || ''}
                          onChange={(e) => setLead({ ...lead, orcamentoMinimo: Number(e.target.value) })}
                          className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="300.000"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Valor Máximo</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">R$</span>
                        </div>
                        <input
                          type="number"
                          value={lead.orcamentoMaximo || ''}
                          onChange={(e) => setLead({ ...lead, orcamentoMaximo: Number(e.target.value) })}
                          className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="500.000"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pontuação</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={lead.pontuacao}
                        onChange={(e) => setLead({ ...lead, pontuacao: Number(e.target.value) })}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium text-gray-900 w-12">{lead.pontuacao}/100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interesse em Imóveis */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Interesse em Imóveis</h3>
                <div className="space-y-2">
                  {lead.interesseImovel.map((interesse, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-900">{interesse}</span>
                      <button
                        onClick={() => {
                          const novosInteresses = lead.interesseImovel.filter((_, i) => i !== index);
                          setLead({ ...lead, interesseImovel: novosInteresses });
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const novoInteresse = prompt('Novo interesse:');
                      if (novoInteresse) {
                        setLead({
                          ...lead,
                          interesseImovel: [...lead.interesseImovel, novoInteresse]
                        });
                      }
                    }}
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors duration-200"
                  >
                    <PlusIcon className="h-5 w-5 mx-auto mb-1" />
                    Adicionar Interesse
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Interações */}
          {activeTab === 'interacoes' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-lg font-medium text-gray-900">Histórico de Interações</h3>
                <button
                  onClick={() => setShowNovaInteracao(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Nova Interação
                </button>
              </div>

              {/* Nova Interação */}
              {showNovaInteracao && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">Nova Interação</h4>
                    <button
                      onClick={() => setShowNovaInteracao(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                      <select
                        value={novaInteracao.tipo}
                        onChange={(e) => setNovaInteracao({ ...novaInteracao, tipo: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="nota">Nota</option>
                        <option value="ligacao">Ligação</option>
                        <option value="email">Email</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="reuniao">Reunião</option>
                        <option value="visita">Visita</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data/Hora</label>
                      <input
                        type="datetime-local"
                        value={novaInteracao.data}
                        onChange={(e) => setNovaInteracao({ ...novaInteracao, data: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <textarea
                      rows={3}
                      value={novaInteracao.descricao}
                      onChange={(e) => setNovaInteracao({ ...novaInteracao, descricao: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Descreva a interação..."
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowNovaInteracao(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={adicionarInteracao}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              )}

              {/* Lista de Interações */}
              <div className="space-y-4">
                {lead.interacoes.map((interacao) => {
                  const IconeInteracao = getIconeInteracao(interacao.tipo);
                  return (
                    <div key={interacao.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getCorInteracao(interacao.tipo)}`}>
                          <IconeInteracao className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 capitalize">{interacao.tipo}</p>
                            <time className="text-xs text-gray-500">
                              {interacao.data.toLocaleDateString('pt-BR')} às {interacao.data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </time>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{interacao.descricao}</p>
                          <p className="text-xs text-gray-500 mt-2">Por: {interacao.usuario}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab: Documentos */}
          {activeTab === 'documentos' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-lg font-medium text-gray-900">Documentos</h3>
                <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 cursor-pointer">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Adicionar Documento
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        setNovosDocumentos(Array.from(e.target.files));
                      }
                    }}
                  />
                </label>
              </div>

              {/* Lista de Documentos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {lead.documentos.map((documento) => (
                  <div key={documento.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <PaperClipIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{documento.nome}</p>
                        <p className="text-xs text-gray-500">{documento.tipo}</p>
                        <p className="text-xs text-gray-500">{formatarTamanho(documento.tamanho)}</p>
                        <p className="text-xs text-gray-500">{documento.uploadedAt.toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <button className="text-blue-600 hover:text-blue-700 text-sm">
                        <EyeIcon className="h-4 w-4 inline mr-1" />
                        Visualizar
                      </button>
                      <button className="text-red-600 hover:text-red-700 text-sm">
                        <TrashIcon className="h-4 w-4 inline mr-1" />
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Placeholder para novos documentos */}
                {novosDocumentos.map((arquivo, index) => (
                  <div key={`novo-${index}`} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <PaperClipIcon className="h-8 w-8 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-900 truncate">{arquivo.name}</p>
                        <p className="text-xs text-blue-600">Novo arquivo</p>
                        <p className="text-xs text-blue-600">{formatarTamanho(arquivo.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end mt-4">
                      <button
                        onClick={() => {
                          setNovosDocumentos(novosDocumentos.filter((_, i) => i !== index));
                        }}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        <XMarkIcon className="h-4 w-4 inline mr-1" />
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadEditPage;