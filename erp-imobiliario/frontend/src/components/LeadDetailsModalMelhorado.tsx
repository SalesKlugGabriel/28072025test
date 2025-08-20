import React, { useState, useEffect } from 'react';
import { 
  X, Calendar, User, Building, Tag, FileText, Save,
  Phone, Mail, MessageSquare, Edit2, Clock, Smile, Calculator, Plus,
  Camera, MapPin, DollarSign, Home, Car, Users, Video, Coffee,
  CalendarPlus, TrendingUp, History
} from 'lucide-react';
import { Lead, Board } from '../types/crm-boards';
import EmojiSelector from './EmojiSelector';
import CubscCalculator from './CubscCalculator';

interface LeadDetailsModalProps {
  lead: Lead;
  board: Board;
  onClose: () => void;
  onUpdate: (lead: Lead) => void;
}

interface InvestimentoPretendido {
  valorMinimo: number;
  valorMaximo: number;
}

interface PerfilImovel {
  dormitorios: number;
  suites: number;
  vagas: number;
  localizacao: string;
  raioAbrangencia: number;
  distanciaMar: number;
  perfilInvestimento: 'moradia' | 'revenda' | 'locacao';
  dataEstimadaFechamento: string;
  estagioObra: 'entregue' | 'em_construcao' | 'lancamento' | 'pre_lancamento';
  dataEntregaObra?: string;
}

interface AgendamentoEvento {
  id: string;
  tipo: 'follow_up' | 'video_chamada' | 'ligacao' | 'visita' | 'jantar' | 'almoco' | 'cafe' | 'viagem';
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  local?: string;
}

interface HistoricoFinanceiro {
  id: string;
  tipo: 'parcela' | 'reforco' | 'entrada' | 'chaves';
  data: string;
  valorInicial: number;
  valorCorrigido: number;
  observacoes: string;
}

interface Interacao {
  id: string;
  tipo: 'chamada' | 'email' | 'whatsapp' | 'reuniao' | 'observacao' | 'agenda';
  data: string;
  hora: string;
  descricao: string;
  autor: string;
}

interface Anotacao {
  id: string;
  texto: string;
  data: string;
  hora: string;
  autor: string;
}

function LeadDetailsModalMelhorado({ lead, board, onClose, onUpdate }: LeadDetailsModalProps) {
  const [abaAtiva, setAbaAtiva] = useState<'historico' | 'anotacoes' | 'cubsc' | 'agendamento'>('historico');
  const [formData, setFormData] = useState({
    ...lead,
    investimentoPretendido: { valorMinimo: 0, valorMaximo: 0 } as InvestimentoPretendido,
    perfilImovel: {
      dormitorios: 0,
      suites: 0,
      vagas: 0,
      localizacao: '',
      raioAbrangencia: 10,
      distanciaMar: 0,
      perfilInvestimento: 'moradia' as const,
      dataEstimadaFechamento: '',
      estagioObra: 'entregue' as const,
      dataEntregaObra: ''
    } as PerfilImovel,
    fotoPerfil: ''
  });
  
  // Estados para funcionalidades
  const [novaAnotacao, setNovaAnotacao] = useState('');
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null);
  const [novaInteracao, setNovaInteracao] = useState<{
    tipo: Interacao['tipo'];
    descricao: string;
  }>({
    tipo: 'observacao',
    descricao: ''
  });
  const [novoAgendamento, setNovoAgendamento] = useState<Partial<AgendamentoEvento>>({
    tipo: 'follow_up',
    titulo: '',
    descricao: '',
    data: '',
    hora: '',
    local: ''
  });

  // Mock de dados com integração WhatsApp
  const [historicoCompleto, setHistoricoCompleto] = useState<Interacao[]>([
    {
      id: '1',
      tipo: 'whatsapp',
      data: '2025-01-28',
      hora: '14:30',
      descricao: '💬 WhatsApp: "Olá! Estou interessado no apartamento de 2 quartos com varanda."',
      autor: lead.nome
    },
    {
      id: '2',
      tipo: 'whatsapp',
      data: '2025-01-28',
      hora: '14:35',
      descricao: '💬 WhatsApp: "Claro! Vou te enviar o material completo. O apartamento fica no 8º andar com vista para o mar."',
      autor: 'João Corretor'
    },
    {
      id: '3',
      tipo: 'whatsapp',
      data: '2025-01-28',
      hora: '15:00',
      descricao: '💬 WhatsApp: "Perfeito! Quando posso visitar o imóvel?"',
      autor: lead.nome
    }
  ]);

  const [anotacoes, setAnotacoes] = useState<Anotacao[]>([
    {
      id: '1',
      texto: '🏠 Cliente interessado em apartamentos na região central. Prioridade para vista para o mar.',
      data: '2025-01-28',
      hora: '10:00',
      autor: 'João Corretor'
    }
  ]);

  const [agendamentos, setAgendamentos] = useState<AgendamentoEvento[]>([]);
  const [historicoFinanceiro, setHistoricoFinanceiro] = useState<HistoricoFinanceiro[]>([]);

  // Função para detectar se é cliente
  const isCliente = () => {
    return lead.stage === 'Cliente' || lead.stage === 'Fechado' || historicoFinanceiro.length > 0;
  };

  const handleSave = () => {
    onUpdate(formData);
    onClose();
  };

  const handleAddAnotacao = () => {
    if (!novaAnotacao.trim()) return;
    
    const agora = new Date();
    const novaAnotacaoObj: Anotacao = {
      id: Date.now().toString(),
      texto: novaAnotacao,
      data: agora.toISOString().split('T')[0],
      hora: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      autor: 'Usuário Atual'
    };
    
    setAnotacoes(prev => [novaAnotacaoObj, ...prev]);
    setNovaAnotacao('');
  };

  const handleAddInteracao = () => {
    if (!novaInteracao.descricao.trim()) return;

    const agora = new Date();
    const prefixos = {
      whatsapp: '💬 WhatsApp:',
      chamada: '📞',
      email: '📧',
      reuniao: '👥',
      observacao: '📝',
      agenda: '📅'
    };

    const novaInteracaoObj: Interacao = {
      id: Date.now().toString(),
      tipo: novaInteracao.tipo,
      data: agora.toISOString().split('T')[0],
      hora: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      descricao: `${prefixos[novaInteracao.tipo]} ${novaInteracao.descricao}`,
      autor: 'Usuário Atual'
    };

    setHistoricoCompleto(prev => [novaInteracaoObj, ...prev]);
    setNovaInteracao({ tipo: 'observacao', descricao: '' });
  };

  const handleAddAgendamento = () => {
    if (!novoAgendamento.titulo?.trim() || !novoAgendamento.data || !novoAgendamento.hora) return;

    const agendamentoCompleto: AgendamentoEvento = {
      id: Date.now().toString(),
      tipo: novoAgendamento.tipo as AgendamentoEvento['tipo'],
      titulo: novoAgendamento.titulo,
      descricao: novoAgendamento.descricao || '',
      data: novoAgendamento.data,
      hora: novoAgendamento.hora,
      local: novoAgendamento.local
    };

    setAgendamentos(prev => [...prev, agendamentoCompleto]);
    
    // Adicionar ao histórico também
    const interacaoAgenda: Interacao = {
      id: Date.now().toString() + '_agenda',
      tipo: 'agenda',
      data: agendamentoCompleto.data,
      hora: agendamentoCompleto.hora,
      descricao: `📅 Agendamento: ${agendamentoCompleto.titulo} - ${agendamentoCompleto.descricao}`,
      autor: 'Sistema'
    };
    
    setHistoricoCompleto(prev => [interacaoAgenda, ...prev]);
    
    // Reset form
    setNovoAgendamento({
      tipo: 'follow_up',
      titulo: '',
      descricao: '',
      data: '',
      hora: '',
      local: ''
    });
  };

  const handleEmojiSelect = (emoji: string) => {
    if (textareaRef) {
      const cursorPosition = textareaRef.selectionStart;
      const currentValue = novaAnotacao;
      const newValue = currentValue.slice(0, cursorPosition) + emoji + ' ' + currentValue.slice(cursorPosition);
      setNovaAnotacao(newValue);
      
      setTimeout(() => {
        if (textareaRef) {
          textareaRef.focus();
          textareaRef.setSelectionRange(cursorPosition + emoji.length + 1, cursorPosition + emoji.length + 1);
        }
      }, 0);
    } else {
      setNovaAnotacao(prev => prev + emoji + ' ');
    }
  };

  const getIconeAgendamento = (tipo: AgendamentoEvento['tipo']) => {
    const icones = {
      follow_up: Phone,
      video_chamada: Video,
      ligacao: Phone,
      visita: Home,
      jantar: Users,
      almoco: Users,
      cafe: Coffee,
      viagem: Car
    };
    return icones[tipo];
  };

  const getCorAgendamento = (tipo: AgendamentoEvento['tipo']) => {
    const cores = {
      follow_up: 'bg-blue-100 text-blue-700',
      video_chamada: 'bg-purple-100 text-purple-700',
      ligacao: 'bg-green-100 text-green-700',
      visita: 'bg-orange-100 text-orange-700',
      jantar: 'bg-red-100 text-red-700',
      almoco: 'bg-yellow-100 text-yellow-700',
      cafe: 'bg-amber-100 text-amber-700',
      viagem: 'bg-indigo-100 text-indigo-700'
    };
    return cores[tipo];
  };

  const getIconeInteracao = (tipo: Interacao['tipo']) => {
    switch (tipo) {
      case 'chamada': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'whatsapp': return <MessageSquare className="w-4 h-4" />;
      case 'reuniao': return <Calendar className="w-4 h-4" />;
      case 'observacao': return <FileText className="w-4 h-4" />;
      case 'agenda': return <CalendarPlus className="w-4 h-4" />;
    }
  };

  const getCorInteracao = (tipo: Interacao['tipo']) => {
    switch (tipo) {
      case 'chamada': return 'text-blue-600 bg-blue-50';
      case 'email': return 'text-purple-600 bg-purple-50';
      case 'whatsapp': return 'text-green-600 bg-green-50';
      case 'reuniao': return 'text-orange-600 bg-orange-50';
      case 'observacao': return 'text-gray-600 bg-gray-50';
      case 'agenda': return 'text-indigo-600 bg-indigo-50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Foto de Perfil Personalizável */}
              <div className="relative">
                {formData.fotoPerfil ? (
                  <img 
                    src={formData.fotoPerfil} 
                    alt={lead.nome}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className={`w-12 h-12 rounded-full ${
                    lead.temperatura === 'quente' ? 'bg-red-500' :
                    lead.temperatura === 'morno' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  } text-white text-lg font-semibold flex items-center justify-center`}>
                    {lead.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                )}
                <button
                  className="absolute -bottom-1 -right-1 bg-gray-600 text-white rounded-full p-1 hover:bg-gray-700"
                  title="Alterar foto"
                >
                  <Camera className="w-3 h-3" />
                </button>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{lead.nome}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>{lead.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{lead.telefone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{lead.whatsapp}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 mr-4">
                <span className="text-sm text-gray-500">Score:</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${lead.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{lead.score}%</span>
                </div>
              </div>
              <button
                onClick={handleSave}
                className="px-3 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Salvar
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Abas */}
          <div className="flex mt-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            {[
              { key: 'historico', label: 'Histórico & WhatsApp', icon: Clock, badge: historicoCompleto.length },
              { key: 'anotacoes', label: 'Anotações', icon: FileText, badge: anotacoes.length },
              { key: 'agendamento', label: 'Agendamentos', icon: CalendarPlus, badge: agendamentos.length },
              ...(isCliente() ? [{ key: 'cubsc' as const, label: 'Correção CUBSC', icon: Calculator }] : [])
            ].map(aba => {
              const Icon = aba.icon;
              return (
                <button
                  key={aba.key}
                  onClick={() => setAbaAtiva(aba.key as any)}
                  className={`px-4 py-3 border-b-2 font-medium text-sm transition-all flex items-center gap-2 relative ${
                    abaAtiva === aba.key
                      ? 'border-blue-500 text-blue-600 bg-white shadow-sm'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {aba.label}
                  {aba.badge !== undefined && aba.badge > 0 && (
                    <span className="ml-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                      {aba.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex">
            {/* Detalhes à esquerda */}
            <div className="w-1/3 border-r border-gray-200 p-6 overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes do Cliente</h3>
              <div className="space-y-6">
                
                {/* Investimento Pretendido */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="text-md font-medium text-green-900 mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Investimento Pretendido
                  </h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-green-700 mb-1">De:</label>
                        <input
                          type="text"
                          value={formData.investimentoPretendido.valorMinimo ? 
                            new Intl.NumberFormat('pt-BR', { 
                              style: 'currency', 
                              currency: 'BRL',
                              minimumFractionDigits: 0 
                            }).format(formData.investimentoPretendido.valorMinimo) : ''}
                          onChange={(e) => {
                            const valor = e.target.value.replace(/\D/g, '');
                            setFormData(prev => ({
                              ...prev,
                              investimentoPretendido: {
                                ...prev.investimentoPretendido,
                                valorMinimo: Number(valor)
                              }
                            }));
                          }}
                          className="w-full border border-green-300 rounded px-2 py-1 text-sm"
                          placeholder="R$ 0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-green-700 mb-1">Até:</label>
                        <input
                          type="text"
                          value={formData.investimentoPretendido.valorMaximo ? 
                            new Intl.NumberFormat('pt-BR', { 
                              style: 'currency', 
                              currency: 'BRL',
                              minimumFractionDigits: 0 
                            }).format(formData.investimentoPretendido.valorMaximo) : ''}
                          onChange={(e) => {
                            const valor = e.target.value.replace(/\D/g, '');
                            setFormData(prev => ({
                              ...prev,
                              investimentoPretendido: {
                                ...prev.investimentoPretendido,
                                valorMaximo: Number(valor)
                              }
                            }));
                          }}
                          className="w-full border border-green-300 rounded px-2 py-1 text-sm"
                          placeholder="R$ 0"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Perfil do Imóvel Desejado */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="text-md font-medium text-blue-900 mb-3 flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Perfil do Imóvel Desejado
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-sm text-blue-700 mb-1">Dormitórios:</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.perfilImovel.dormitorios || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            perfilImovel: {
                              ...prev.perfilImovel,
                              dormitorios: Number(e.target.value)
                            }
                          }))}
                          className="w-full border border-blue-300 rounded px-2 py-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-blue-700 mb-1">Suítes:</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.perfilImovel.suites || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            perfilImovel: {
                              ...prev.perfilImovel,
                              suites: Number(e.target.value)
                            }
                          }))}
                          className="w-full border border-blue-300 rounded px-2 py-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-blue-700 mb-1">Vagas:</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.perfilImovel.vagas || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            perfilImovel: {
                              ...prev.perfilImovel,
                              vagas: Number(e.target.value)
                            }
                          }))}
                          className="w-full border border-blue-300 rounded px-2 py-1 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-blue-700 mb-1">Localização:</label>
                      <input
                        type="text"
                        value={formData.perfilImovel.localizacao}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          perfilImovel: {
                            ...prev.perfilImovel,
                            localizacao: e.target.value
                          }
                        }))}
                        className="w-full border border-blue-300 rounded px-2 py-1 text-sm"
                        placeholder="Bairro ou região preferida"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm text-blue-700 mb-1">Raio (km):</label>
                        <input
                          type="number"
                          min="1"
                          value={formData.perfilImovel.raioAbrangencia}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            perfilImovel: {
                              ...prev.perfilImovel,
                              raioAbrangencia: Number(e.target.value)
                            }
                          }))}
                          className="w-full border border-blue-300 rounded px-2 py-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-blue-700 mb-1">Dist. Mar (km):</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.perfilImovel.distanciaMar}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            perfilImovel: {
                              ...prev.perfilImovel,
                              distanciaMar: Number(e.target.value)
                            }
                          }))}
                          className="w-full border border-blue-300 rounded px-2 py-1 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-blue-700 mb-1">Perfil de Investimento:</label>
                      <select
                        value={formData.perfilImovel.perfilInvestimento}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          perfilImovel: {
                            ...prev.perfilImovel,
                            perfilInvestimento: e.target.value as PerfilImovel['perfilInvestimento']
                          }
                        }))}
                        className="w-full border border-blue-300 rounded px-2 py-1 text-sm"
                      >
                        <option value="moradia">Moradia</option>
                        <option value="revenda">Revenda</option>
                        <option value="locacao">Locação</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-blue-700 mb-1">Data Estimada de Fechamento:</label>
                      <input
                        type="date"
                        value={formData.perfilImovel.dataEstimadaFechamento}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          perfilImovel: {
                            ...prev.perfilImovel,
                            dataEstimadaFechamento: e.target.value
                          }
                        }))}
                        className="w-full border border-blue-300 rounded px-2 py-1 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-blue-700 mb-1">Estágio de Obra:</label>
                      <select
                        value={formData.perfilImovel.estagioObra}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          perfilImovel: {
                            ...prev.perfilImovel,
                            estagioObra: e.target.value as PerfilImovel['estagioObra']
                          }
                        }))}
                        className="w-full border border-blue-300 rounded px-2 py-1 text-sm"
                      >
                        <option value="entregue">Entregue</option>
                        <option value="em_construcao">Em Construção</option>
                        <option value="lancamento">Lançamento</option>
                        <option value="pre_lancamento">Pré-lançamento</option>
                      </select>
                    </div>

                    {formData.perfilImovel.estagioObra === 'em_construcao' && (
                      <div>
                        <label className="block text-sm text-blue-700 mb-1">Data de Entrega:</label>
                        <input
                          type="month"
                          value={formData.perfilImovel.dataEntregaObra}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            perfilImovel: {
                              ...prev.perfilImovel,
                              dataEntregaObra: e.target.value
                            }
                          }))}
                          className="w-full border border-blue-300 rounded px-2 py-1 text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(formData.tags || []).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1">
                        {tag}
                        <button 
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            tags: (prev.tags || []).filter(t => t !== tag)
                          }))}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Conteúdo das abas à direita */}
            <div className="w-2/3 p-6 overflow-y-auto">
              
              {/* Aba Histórico */}
              {abaAtiva === 'historico' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 border">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                      Nova Interação
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <select
                          value={novaInteracao.tipo}
                          onChange={(e) => setNovaInteracao(prev => ({ ...prev, tipo: e.target.value as Interacao['tipo'] }))}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="observacao">📝 Observação</option>
                          <option value="chamada">📞 Chamada</option>
                          <option value="email">📧 Email</option>
                          <option value="whatsapp">💬 WhatsApp</option>
                          <option value="reuniao">👥 Reunião</option>
                        </select>
                      </div>
                      <textarea
                        value={novaInteracao.descricao}
                        onChange={(e) => setNovaInteracao(prev => ({ ...prev, descricao: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Descreva a interação com detalhes..."
                      />
                      <button
                        onClick={handleAddInteracao}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        disabled={!novaInteracao.descricao.trim()}
                      >
                        Adicionar Interação
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-green-600" />
                      Histórico Completo - WhatsApp Integrado
                    </h3>
                    <div className="space-y-3">
                      {historicoCompleto
                        .sort((a, b) => new Date(b.data + ' ' + b.hora).getTime() - new Date(a.data + ' ' + a.hora).getTime())
                        .map((interacao, index) => (
                        <div key={interacao.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${getCorInteracao(interacao.tipo)} flex-shrink-0`}>
                              {getIconeInteracao(interacao.tipo)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-medium text-gray-900 capitalize">
                                    {interacao.tipo === 'whatsapp' ? 'WhatsApp' : interacao.tipo}
                                  </span>
                                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    {interacao.data} às {interacao.hora}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500 font-medium">{interacao.autor}</span>
                              </div>
                              <div className={`text-sm p-3 rounded-lg border-l-4 ${
                                interacao.tipo === 'whatsapp' 
                                  ? 'bg-green-50 border-green-400 text-green-800' 
                                  : 'bg-gray-50 border-gray-400 text-gray-700'
                              }`}>
                                {interacao.descricao}
                              </div>
                              {index === 0 && (
                                <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
                                  <Clock className="w-3 h-3" />
                                  Mais recente
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {historicoCompleto.length === 0 && (
                      <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p>Nenhuma interação registrada ainda</p>
                        <p className="text-sm text-gray-400">As conversas do WhatsApp aparecerão aqui automaticamente</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Aba Anotações */}
              {abaAtiva === 'anotacoes' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
                    <h3 className="text-lg font-medium text-yellow-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Nova Anotação
                    </h3>
                    <div className="space-y-4">
                      <div className="relative">
                        <textarea
                          ref={setTextareaRef}
                          value={novaAnotacao}
                          onChange={(e) => setNovaAnotacao(e.target.value)}
                          className="w-full border border-yellow-300 rounded-lg px-3 py-2 pr-12 focus:ring-2 focus:ring-yellow-500 bg-white"
                          rows={4}
                          placeholder="Digite sua anotação... 

💡 Dicas: Use emojis para categorizar suas anotações!"
                        />
                        <button
                          onClick={() => setShowEmojiSelector(true)}
                          className="absolute top-2 right-2 p-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 rounded-lg transition-colors"
                          title="Adicionar emoji"
                        >
                          <Smile className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-yellow-700 font-medium mr-2">Emojis rápidos:</span>
                        {['💰', '🏦', '⏰', '📞', '✅', '🔥', '📝', '🤝', '🏢', '⚡'].map((emoji, index) => (
                          <button
                            key={index}
                            onClick={() => handleEmojiSelect(emoji)}
                            className="w-8 h-8 rounded-lg hover:bg-yellow-200 transition-colors text-lg border border-yellow-300 bg-white"
                            title={`Adicionar ${emoji}`}
                          >
                            {emoji}
                          </button>
                        ))}
                        <button
                          onClick={() => setShowEmojiSelector(true)}
                          className="px-3 py-1 rounded-lg hover:bg-yellow-200 transition-colors text-xs text-yellow-700 border border-yellow-300 bg-white"
                        >
                          Mais...
                        </button>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleAddAnotacao}
                          className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                          disabled={!novaAnotacao.trim()}
                        >
                          <FileText className="w-4 h-4" />
                          Adicionar Anotação
                        </button>
                        <button
                          onClick={() => setShowEmojiSelector(true)}
                          className="px-4 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors flex items-center gap-2"
                        >
                          <Smile className="w-4 h-4" />
                          Emojis
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Todas as Anotações</h3>
                    <div className="space-y-4">
                      {anotacoes.map((anotacao, index) => (
                        <div key={anotacao.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-yellow-600" />
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {anotacao.data} às {anotacao.hora}
                              </span>
                              {index === 0 && (
                                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                  Mais recente
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500 font-medium">{anotacao.autor}</span>
                          </div>
                          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg">
                            <p className="text-sm text-gray-800 leading-relaxed">{anotacao.texto}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {anotacoes.length === 0 && (
                      <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                        <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p>Nenhuma anotação criada ainda</p>
                        <p className="text-sm text-gray-400">Adicione anotações importantes sobre este lead</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Aba Agendamento */}
              {abaAtiva === 'agendamento' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                    <h3 className="text-lg font-medium text-purple-900 mb-4 flex items-center gap-2">
                      <CalendarPlus className="w-5 h-5" />
                      Novo Agendamento - Conectado à Agenda
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-purple-700 mb-1">Tipo de Ação</label>
                          <select
                            value={novoAgendamento.tipo}
                            onChange={(e) => setNovoAgendamento(prev => ({ ...prev, tipo: e.target.value as AgendamentoEvento['tipo'] }))}
                            className="w-full border border-purple-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="follow_up">📞 Follow-up</option>
                            <option value="video_chamada">📹 Vídeo Chamada</option>
                            <option value="ligacao">☎️ Ligação</option>
                            <option value="visita">🏠 Visita</option>
                            <option value="jantar">🍽️ Jantar</option>
                            <option value="almoco">🍴 Almoço</option>
                            <option value="cafe">☕ Café de Negócios</option>
                            <option value="viagem">✈️ Viagem</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-purple-700 mb-1">Título</label>
                          <input
                            type="text"
                            value={novoAgendamento.titulo}
                            onChange={(e) => setNovoAgendamento(prev => ({ ...prev, titulo: e.target.value }))}
                            className="w-full border border-purple-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                            placeholder="Ex: Apresentar proposta apartamento"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-purple-700 mb-1">Data</label>
                          <input
                            type="date"
                            value={novoAgendamento.data}
                            onChange={(e) => setNovoAgendamento(prev => ({ ...prev, data: e.target.value }))}
                            className="w-full border border-purple-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-purple-700 mb-1">Hora</label>
                          <input
                            type="time"
                            value={novoAgendamento.hora}
                            onChange={(e) => setNovoAgendamento(prev => ({ ...prev, hora: e.target.value }))}
                            className="w-full border border-purple-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-purple-700 mb-1">Local (opcional)</label>
                          <input
                            type="text"
                            value={novoAgendamento.local}
                            onChange={(e) => setNovoAgendamento(prev => ({ ...prev, local: e.target.value }))}
                            className="w-full border border-purple-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                            placeholder="Endereço ou local do encontro"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-purple-700 mb-1">Descrição</label>
                        <textarea
                          value={novoAgendamento.descricao}
                          onChange={(e) => setNovoAgendamento(prev => ({ ...prev, descricao: e.target.value }))}
                          className="w-full border border-purple-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                          rows={3}
                          placeholder="Detalhes sobre o agendamento..."
                        />
                      </div>

                      <button
                        onClick={handleAddAgendamento}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        disabled={!novoAgendamento.titulo?.trim() || !novoAgendamento.data || !novoAgendamento.hora}
                      >
                        <CalendarPlus className="w-4 h-4" />
                        Adicionar à Agenda
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      Agendamentos Futuros
                    </h3>
                    <div className="space-y-3">
                      {agendamentos
                        .sort((a, b) => new Date(a.data + ' ' + a.hora).getTime() - new Date(b.data + ' ' + b.hora).getTime())
                        .map((agendamento) => {
                          const IconeAgendamento = getIconeAgendamento(agendamento.tipo);
                          return (
                            <div key={agendamento.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-full ${getCorAgendamento(agendamento.tipo)} flex-shrink-0`}>
                                  <IconeAgendamento className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-medium text-gray-900">{agendamento.titulo}</h4>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                      {agendamento.data} às {agendamento.hora}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{agendamento.descricao}</p>
                                  {agendamento.local && (
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                      <MapPin className="w-3 h-3" />
                                      {agendamento.local}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    {agendamentos.length === 0 && (
                      <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                        <CalendarPlus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p>Nenhum agendamento criado ainda</p>
                        <p className="text-sm text-gray-400">Agende ações e elas aparecerão automaticamente na sua agenda</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Aba CUBSC (apenas para clientes) */}
              {abaAtiva === 'cubsc' && isCliente() && (
                <div className="space-y-6">
                  {/* Histórico Financeiro para Clientes */}
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg p-6 border border-emerald-200">
                    <h3 className="text-lg font-medium text-emerald-900 mb-4 flex items-center gap-2">
                      <History className="w-5 h-5" />
                      Histórico de Parcelas - {lead.nome}
                    </h3>
                    
                    {historicoFinanceiro.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-emerald-300">
                              <th className="text-left py-2 text-emerald-800">Data</th>
                              <th className="text-left py-2 text-emerald-800">Tipo</th>
                              <th className="text-right py-2 text-emerald-800">Valor Inicial</th>
                              <th className="text-right py-2 text-emerald-800">Valor Corrigido</th>
                              <th className="text-left py-2 text-emerald-800">Observações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {historicoFinanceiro.map((item) => (
                              <tr key={item.id} className="border-b border-emerald-200">
                                <td className="py-2">{item.data}</td>
                                <td className="py-2">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    item.tipo === 'parcela' ? 'bg-blue-100 text-blue-800' :
                                    item.tipo === 'reforco' ? 'bg-orange-100 text-orange-800' :
                                    item.tipo === 'entrada' ? 'bg-green-100 text-green-800' :
                                    'bg-purple-100 text-purple-800'
                                  }`}>
                                    {item.tipo === 'parcela' ? '💳 Parcela' :
                                     item.tipo === 'reforco' ? '💰 Reforço' :
                                     item.tipo === 'entrada' ? '🏦 Entrada' : '🔑 Chaves'}
                                  </span>
                                </td>
                                <td className="py-2 text-right">R$ {item.valorInicial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                <td className="py-2 text-right font-medium">R$ {item.valorCorrigido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                <td className="py-2">{item.observacoes}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <TrendingUp className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                        <p className="text-emerald-700">Cliente ainda não possui histórico financeiro</p>
                        <p className="text-sm text-emerald-600">O histórico aparecerá aqui após o primeiro pagamento</p>
                      </div>
                    )}
                  </div>

                  {/* Calculadora CUBSC */}
                  <CubscCalculator 
                    valorInicial={formData.valor || 0}
                    onResultado={(resultado) => {
                      console.log('Resultado CUBSC:', resultado);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            💡 Alterações são salvas automaticamente. Agendamentos são sincronizados com a agenda.
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setFormData({ ...lead, investimentoPretendido: { valorMinimo: 0, valorMaximo: 0 }, perfilImovel: {
                dormitorios: 0,
                suites: 0,
                vagas: 0,
                localizacao: '',
                raioAbrangencia: 10,
                distanciaMar: 0,
                perfilInvestimento: 'moradia' as const,
                dataEstimadaFechamento: '',
                estagioObra: 'entregue' as const,
                dataEntregaObra: ''
              }, fotoPerfil: '' })}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Restaurar
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>

      {/* Seletor de Emojis */}
      <EmojiSelector
        isOpen={showEmojiSelector}
        onClose={() => setShowEmojiSelector(false)}
        onSelect={handleEmojiSelect}
      />
    </div>
  );
}

export default LeadDetailsModalMelhorado;