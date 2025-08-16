import React, { useState } from 'react';
import { 
  X, Calendar, User, Building, Tag, FileText, Save,
  Phone, Mail, MessageSquare, Edit2, Clock, Smile, Calculator, Plus
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

interface Interacao {
  id: string;
  tipo: 'chamada' | 'email' | 'whatsapp' | 'reuniao' | 'observacao';
  data: string;
  hora: string;
  descricao: string;
  autor: string;
}

function LeadDetailsModal({ lead, board, onClose, onUpdate }: LeadDetailsModalProps) {
  const [abaAtiva, setAbaAtiva] = useState<'historico' | 'anotacoes' | 'cubsc'>('historico');
  const [editando, setEditando] = useState(true); // Sempre iniciar em modo edição
  const [formData, setFormData] = useState(lead);
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
  const [novaTag, setNovaTag] = useState('');

  // Mock de histórico de interações integrado com WhatsApp
  const historico: Interacao[] = [
    {
      id: '1',
      tipo: 'whatsapp',
      data: '2025-01-28',
      hora: '14:30',
      descricao: '💬 WhatsApp: "Olá! Estou interessado no apartamento de 2 quartos com varanda. Poderia me enviar mais informações?"',
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
      hora: '14:40',
      descricao: '💬 WhatsApp: "Perfeito! Quando posso agendar uma visita? Tenho disponibilidade à tarde."',
      autor: lead.nome
    },
    {
      id: '4',
      tipo: 'chamada',
      data: '2025-01-26',
      hora: '10:15',
      descricao: '📞 Primeira conversa telefônica - Cliente busca investimento, tem pré-aprovação bancária',
      autor: 'João Corretor'
    },
    {
      id: '5',
      tipo: 'email',
      data: '2025-01-25',
      hora: '16:45',
      descricao: '📧 Enviado material completo do empreendimento com plantas e tabela de preços',
      autor: 'João Corretor'
    },
    {
      id: '6',
      tipo: 'whatsapp',
      data: '2025-01-25',
      hora: '17:20',
      descricao: '💬 WhatsApp: "Recebi o material! As plantas ficaram bem claras. Estou muito interessado!"',
      autor: lead.nome
    }
  ];

  // Mock de anotações
  const [anotacoes, setAnotacoes] = useState([
    {
      id: '1',
      data: '2025-01-28',
      hora: '15:00',
      texto: '🏦 Cliente tem financiamento pré-aprovado no valor de R$ 450.000 pelo Santander. Taxa negociada: TR + 9,5% a.a.',
      autor: 'João Corretor'
    },
    {
      id: '2',
      data: '2025-01-27',
      hora: '09:30',
      texto: '🏢 Prefere unidades nos andares mais altos, com vista para a cidade. Não quer unidades voltadas para o norte.',
      autor: 'João Corretor'
    },
    {
      id: '3',
      data: '2025-01-26',
      hora: '16:45',
      texto: '⏰ Cliente tem urgência para decidir até final de fevereiro. Motivo: casamento em março.',
      autor: 'João Corretor'
    }
  ]);

  const handleSave = () => {
    onUpdate(formData);
    setEditando(false);
  };

  const handleAddAnotacao = () => {
    if (!novaAnotacao.trim()) return;

    const agora = new Date();
    const novaAnotacaoObj = {
      id: Date.now().toString(),
      data: agora.toISOString().split('T')[0],
      hora: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      texto: novaAnotacao,
      autor: 'Usuário Atual'
    };

    setAnotacoes(prev => [novaAnotacaoObj, ...prev]);
    setNovaAnotacao('');
  };

  const handleEmojiSelect = (emoji: string) => {
    if (textareaRef) {
      const cursorPosition = textareaRef.selectionStart || 0;
      const textBefore = novaAnotacao.substring(0, cursorPosition);
      const textAfter = novaAnotacao.substring(cursorPosition);
      const newText = textBefore + emoji + ' ' + textAfter;
      
      setNovaAnotacao(newText);
      
      // Restore cursor position after emoji
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

  const handleAddInteracao = () => {
    if (!novaInteracao.descricao.trim()) return;

    const agora = new Date();
    const prefixos = {
      whatsapp: '💬 WhatsApp:',
      chamada: '📞',
      email: '📧',
      reuniao: '👥',
      observacao: '📝'
    };

    const novaInteracaoObj: Interacao = {
      id: Date.now().toString(),
      tipo: novaInteracao.tipo,
      data: agora.toISOString().split('T')[0],
      hora: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      descricao: `${prefixos[novaInteracao.tipo]} ${novaInteracao.descricao}`,
      autor: 'Usuário Atual'
    };

    console.log('Nova interação:', novaInteracaoObj);
    setNovaInteracao({ tipo: 'observacao', descricao: '' });
  };

  const handleAddTag = () => {
    if (!novaTag.trim()) return;
    
    const tagLimpa = novaTag.trim().toLowerCase();
    const tagsAtuais = formData.tags || [];
    
    if (!tagsAtuais.includes(tagLimpa)) {
      setFormData(prev => ({
        ...prev,
        tags: [...tagsAtuais, tagLimpa]
      }));
    }
    
    setNovaTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyDownTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const getIconeInteracao = (tipo: Interacao['tipo']) => {
    switch (tipo) {
      case 'chamada': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'whatsapp': return <MessageSquare className="w-4 h-4" />;
      case 'reuniao': return <Calendar className="w-4 h-4" />;
      case 'observacao': return <FileText className="w-4 h-4" />;
    }
  };

  const getCorInteracao = (tipo: Interacao['tipo']) => {
    switch (tipo) {
      case 'chamada': return 'text-blue-600 bg-blue-50';
      case 'email': return 'text-purple-600 bg-purple-50';
      case 'whatsapp': return 'text-green-600 bg-green-50';
      case 'reuniao': return 'text-orange-600 bg-orange-50';
      case 'observacao': return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${
                lead.temperatura === 'quente' ? 'bg-red-500' :
                lead.temperatura === 'morno' ? 'bg-yellow-500' :
                'bg-blue-500'
              } text-white text-lg font-semibold flex items-center justify-center`}>
                {lead.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
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

          {/* Abas para a área direita */}
          <div className="flex mt-4 border-b border-gray-200">
            {[
              { key: 'historico', label: 'Histórico & WhatsApp', icon: Clock },
              { key: 'anotacoes', label: 'Anotações', icon: FileText },
              { key: 'cubsc', label: 'Correção CUBSC', icon: Calculator }
            ].map(aba => {
              const Icon = aba.icon;
              return (
                <button
                  key={aba.key}
                  onClick={() => setAbaAtiva(aba.key as any)}
                  className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                    abaAtiva === aba.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {aba.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex">
            {/* Detalhes à esquerda (1/3) */}
            <div className="w-1/3 border-r border-gray-200 p-6 overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes do Cliente</h3>
              <div className="space-y-6">
                <div className="space-y-4">
                  {/* Informações Pessoais */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Informações Pessoais</h4>
                    <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                            Nome Completo
                            <Edit2 className="w-3 h-3 text-gray-400" />
                          </label>
                          <input
                            type="text"
                            value={formData.nome}
                            onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                            Email
                            <Edit2 className="w-3 h-3 text-gray-400" />
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                            Telefone
                            <Edit2 className="w-3 h-3 text-gray-400" />
                          </label>
                          <input
                            type="tel"
                            value={formData.telefone}
                            onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                            WhatsApp
                            <Edit2 className="w-3 h-3 text-gray-400" />
                          </label>
                          <input
                            type="tel"
                            value={formData.whatsapp || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            placeholder="Não informado"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Informações Comerciais</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                            Valor de Interesse
                            <Edit2 className="w-3 h-3 text-gray-400" />
                          </label>
                          <input
                            type="number"
                            value={formData.valor || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, valor: parseFloat(e.target.value) || 0 }))}
                            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: 450000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                            Empreendimento de Interesse
                            <Edit2 className="w-3 h-3 text-gray-400" />
                          </label>
                          <input
                            type="text"
                            value={formData.empreendimento || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, empreendimento: e.target.value }))}
                            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Residencial Solar das Flores"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Responsável</label>
                          <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{lead.responsavel}</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Origem do Lead</label>
                          <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded capitalize">{lead.origem}</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Temperatura</label>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            lead.temperatura === 'quente' ? 'bg-red-100 text-red-800' :
                            lead.temperatura === 'morno' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {lead.temperatura === 'quente' ? '🔥 Quente' :
                             lead.temperatura === 'morno' ? '🟡 Morno' : '🧊 Frio'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                      Tags
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </h3>
                    
                    {/* Tags existentes */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(formData.tags || []).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:bg-blue-200 rounded-full p-0.5 ml-1"
                            title="Remover tag"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    
                    {/* Adicionar nova tag */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={novaTag}
                        onChange={(e) => setNovaTag(e.target.value)}
                        onKeyDown={handleKeyDownTag}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="Digite uma nova tag..."
                      />
                      <button
                        onClick={handleAddTag}
                        disabled={!novaTag.trim()}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar
                      </button>
                    </div>
                    
                    {/* Tags sugeridas */}
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-2">Tags sugeridas:</p>
                      <div className="flex flex-wrap gap-1">
                        {['qualificado', 'urgente', 'investidor', 'primeira-compra', 'financiamento', 'vip', 'retorno'].map((tagSugerida) => (
                          <button
                            key={tagSugerida}
                            onClick={() => {
                              const tagsAtuais = formData.tags || [];
                              if (!tagsAtuais.includes(tagSugerida)) {
                                setFormData(prev => ({
                                  ...prev,
                                  tags: [...tagsAtuais, tagSugerida]
                                }));
                              }
                            }}
                            className="px-2 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50 text-gray-600 disabled:opacity-50"
                            disabled={(formData.tags || []).includes(tagSugerida)}
                          >
                            {tagSugerida}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Observações */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                      Observações Gerais
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </h3>
                    <textarea
                      value={formData.observacoes || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="Adicione observações sobre o lead..."
                    />
                  </div>
                </div>

                {/* Painel lateral com informações rápidas */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-3">Informações Rápidas</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Data de Criação:</span>
                        <span className="text-blue-900 font-medium">{lead.dataCriacao}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Último Contato:</span>
                        <span className="text-blue-900 font-medium">{lead.ultimoContato ? new Date(lead.ultimoContato).toLocaleDateString('pt-BR') : 'Não definido'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Próximo Follow-up:</span>
                        <span className="text-blue-900 font-medium">{lead.proximoFollowUp ? new Date(lead.proximoFollowUp).toLocaleDateString('pt-BR') : 'Não definido'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Prioridade:</span>
                        <span className={`font-medium ${
                          lead.prioridade === 'alta' ? 'text-red-600' :
                          lead.prioridade === 'media' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {lead.prioridade === 'alta' ? '🔴 Alta' :
                           lead.prioridade === 'media' ? '🟡 Média' : '🟢 Baixa'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                    <h4 className="font-medium text-green-900 mb-3">Status no Pipeline</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-green-700 text-sm">Estágio Atual:</span>
                      </div>
                      <div className="bg-white rounded px-3 py-2 border border-green-200">
                        <span className="text-green-900 font-medium text-sm">
                          {board.estagios.find(e => e.id === lead.estagioId)?.nome || 'Não definido'}
                        </span>
                      </div>
                      <div className="text-xs text-green-600 mt-2">
                        💡 O lead está progredindo bem no funil de vendas
                      </div>
                    </div>
                  </div>

                  {/* Unidades Compradas */}
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                    <h4 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Unidades Compradas
                    </h4>
                    
                    {/* Mock de unidades compradas */}
                    <div className="space-y-3">
                      <div className="bg-white rounded p-3 border border-purple-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-sm font-medium text-purple-900">Apto 801 - Torre A</p>
                            <p className="text-xs text-purple-700">Residencial Solar das Flores</p>
                          </div>
                          <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                            Ativo
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-purple-600">Valor:</span>
                            <p className="font-medium text-purple-900">R$ 450.000</p>
                          </div>
                          <div>
                            <span className="text-purple-600">Entrada:</span>
                            <p className="font-medium text-purple-900">R$ 90.000</p>
                          </div>
                          <div>
                            <span className="text-purple-600">Financiado:</span>
                            <p className="font-medium text-purple-900">R$ 360.000</p>
                          </div>
                          <div>
                            <span className="text-purple-600">Parcelas:</span>
                            <p className="font-medium text-purple-900">420x R$ 1.250</p>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-purple-200">
                          <div className="flex justify-between text-xs">
                            <span className="text-purple-600">Próximo vencimento:</span>
                            <span className="font-medium text-purple-900">15/02/2025</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Indicador quando não há unidades */}
                      <div className="text-center py-2 text-xs text-purple-600 opacity-75">
                        💡 Histórico de compras aparecerá automaticamente
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Histórico/Anotações à direita (2/3) */}
            <div className="w-2/3 p-6 overflow-y-auto">
              {abaAtiva === 'historico' && (
            <div className="space-y-6">
              {/* Adicionar nova interação */}
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

              {/* Lista de interações - Cronologia integrada */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  Histórico Completo - WhatsApp Integrado
                </h3>
                <div className="space-y-3">
                  {historico
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
                
                {historico.length === 0 && (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>Nenhuma interação registrada ainda</p>
                    <p className="text-sm text-gray-400">As conversas do WhatsApp aparecerão aqui automaticamente</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {abaAtiva === 'anotacoes' && (
            <div className="space-y-6">
              {/* Adicionar nova anotação */}
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
                  
                  {/* Emojis rápidos */}
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

              {/* Lista de anotações */}
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

          {abaAtiva === 'cubsc' && (
            <div className="space-y-6">
              <CubscCalculator 
                valorInicial={formData.valor || 0}
                onResultado={(resultado) => {
                  console.log('Resultado CUBSC:', resultado);
                  // Aqui você pode salvar o resultado ou fazer outras ações
                }}
              />
            </div>
          )}
          </div>
        </div>

        {/* Footer com ações */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            💡 Alterações são salvas automaticamente. Clique em "Salvar" para confirmar
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setFormData(lead);
              }}
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

export default LeadDetailsModal;