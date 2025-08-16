import React, { useState } from 'react';
import { 
  X, Plus, Zap, MessageSquare, Clock, ArrowRight, 
  Settings, Play, Pause, Trash2, Edit3, Copy,
  Calendar, Phone, Mail, Target, Users
} from 'lucide-react';
import { Automacao, TipoAcao, CondicaoAutomacao, AcaoAutomacao } from '../types/crm-boards';

interface AutomationManagerProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  automacoes: Automacao[];
  onSaveAutomacao: (automacao: Automacao) => void;
  onDeleteAutomacao: (id: string) => void;
  onToggleAutomacao: (id: string, ativo: boolean) => void;
}

const mockAutomacoes: Automacao[] = [
  {
    id: 'auto-1',
    nome: 'Mensagem de Boas-vindas',
    descricao: 'Envia mensagem automática quando lead entra no sistema',
    ativo: true,
    boardId: 'vendas-principais',
    condicoes: [
      {
        tipo: 'entrada_estagio',
        estagioId: 'lead',
        operador: 'igual'
      }
    ],
    acoes: [
      {
        tipo: 'enviar_mensagem',
        template: 'Olá {{nome}}! Obrigado pelo seu interesse. Em breve entraremos em contato.',
        canal: 'whatsapp',
        delay: 0
      }
    ],
    estatisticas: {
      execucoes: 45,
      sucessos: 43,
      falhas: 2,
      taxaSucesso: 95.6
    }
  },
  {
    id: 'auto-2',
    nome: 'Follow-up Automático',
    descricao: 'Agenda follow-up depois de 3 dias sem resposta',
    ativo: true,
    boardId: 'vendas-principais',
    condicoes: [
      {
        tipo: 'tempo_sem_atividade',
        valor: 3,
        unidade: 'dias',
        operador: 'maior_que'
      }
    ],
    acoes: [
      {
        tipo: 'agendar_followup',
        prazo: 1,
        unidadePrazo: 'dias',
        responsavel: 'auto',
        titulo: 'Follow-up automático'
      }
    ],
    estatisticas: {
      execucoes: 28,
      sucessos: 28,
      falhas: 0,
      taxaSucesso: 100
    }
  },
  {
    id: 'auto-3',
    nome: 'Mover para Perdido',
    descricao: 'Move leads inativos há mais de 30 dias para perdido',
    ativo: false,
    boardId: 'vendas-principais',
    condicoes: [
      {
        tipo: 'tempo_sem_atividade',
        valor: 30,
        unidade: 'dias',
        operador: 'maior_que'
      },
      {
        tipo: 'estagio_atual',
        estagioId: 'interessado',
        operador: 'igual'
      }
    ],
    acoes: [
      {
        tipo: 'mover_estagio',
        estagioDestinoId: 'perdido',
        observacao: 'Movido automaticamente por inatividade'
      }
    ],
    estatisticas: {
      execucoes: 12,
      sucessos: 12,
      falhas: 0,
      taxaSucesso: 100
    }
  }
];

const tiposCondicao = [
  { value: 'entrada_estagio', label: 'Entrada em estágio', icon: ArrowRight },
  { value: 'tempo_sem_atividade', label: 'Tempo sem atividade', icon: Clock },
  { value: 'estagio_atual', label: 'Estágio atual', icon: Target },
  { value: 'valor_lead', label: 'Valor do lead', icon: Target },
  { value: 'origem_lead', label: 'Origem do lead', icon: Users }
];

const tiposAcao = [
  { value: 'enviar_mensagem', label: 'Enviar mensagem', icon: MessageSquare },
  { value: 'agendar_followup', label: 'Agendar follow-up', icon: Calendar },
  { value: 'mover_estagio', label: 'Mover para estágio', icon: ArrowRight },
  { value: 'atribuir_responsavel', label: 'Atribuir responsável', icon: Users },
  { value: 'adicionar_tag', label: 'Adicionar tag', icon: Target },
  { value: 'fazer_ligacao', label: 'Agendar ligação', icon: Phone },
  { value: 'enviar_email', label: 'Enviar e-mail', icon: Mail }
];

function AutomationCard({ 
  automacao, 
  onEdit, 
  onDelete, 
  onToggle, 
  onDuplicate 
}: { 
  automacao: Automacao;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
  onDuplicate: () => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${automacao.ativo ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{automacao.nome}</h3>
            <p className="text-sm text-gray-600">{automacao.descricao}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={onToggle}
            className={`p-1.5 rounded-lg ${automacao.ativo ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
            title={automacao.ativo ? 'Pausar automação' : 'Ativar automação'}
          >
            {automacao.ativo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-50"
            title="Editar automação"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={onDuplicate}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-50"
            title="Duplicar automação"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
            title="Excluir automação"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Fluxo visual simplificado */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Quando:</span>
          <div className="flex flex-wrap gap-1">
            {automacao.condicoes.map((condicao, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                {tiposCondicao.find(t => t.value === condicao.tipo)?.label || condicao.tipo}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm mt-2">
          <span className="font-medium">Então:</span>
          <div className="flex flex-wrap gap-1">
            {automacao.acoes.map((acao, index) => (
              <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                {tiposAcao.find(t => t.value === acao.tipo)?.label || acao.tipo}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      {automacao.estatisticas && (
        <div className="grid grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-sm font-semibold">{automacao.estatisticas.execucoes}</div>
            <div className="text-xs text-gray-500">Execuções</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-green-600">{automacao.estatisticas.sucessos}</div>
            <div className="text-xs text-gray-500">Sucessos</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-red-600">{automacao.estatisticas.falhas}</div>
            <div className="text-xs text-gray-500">Falhas</div>
          </div>
          <div>
            <div className="text-sm font-semibold">{automacao.estatisticas.taxaSucesso.toFixed(1)}%</div>
            <div className="text-xs text-gray-500">Taxa</div>
          </div>
        </div>
      )}
    </div>
  );
}

function AutomationForm({ 
  isOpen, 
  onClose, 
  onSave, 
  editingAutomacao,
  boardId 
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (automacao: Automacao) => void;
  editingAutomacao?: Automacao;
  boardId: string;
}) {
  const [form, setForm] = useState<Partial<Automacao>>(editingAutomacao || {
    nome: '',
    descricao: '',
    ativo: true,
    boardId,
    condicoes: [],
    acoes: []
  });

  if (!isOpen) return null;

  const addCondicao = () => {
    setForm(prev => ({
      ...prev,
      condicoes: [
        ...(prev.condicoes || []),
        { tipo: 'entrada_estagio', operador: 'igual' } as CondicaoAutomacao
      ]
    }));
  };

  const addAcao = () => {
    setForm(prev => ({
      ...prev,
      acoes: [
        ...(prev.acoes || []),
        { tipo: 'enviar_mensagem' } as AcaoAutomacao
      ]
    }));
  };

  const updateCondicao = (index: number, condicao: Partial<CondicaoAutomacao>) => {
    setForm(prev => ({
      ...prev,
      condicoes: prev.condicoes?.map((c, i) => i === index ? { ...c, ...condicao } : c) || []
    }));
  };

  const updateAcao = (index: number, acao: Partial<AcaoAutomacao>) => {
    setForm(prev => ({
      ...prev,
      acoes: prev.acoes?.map((a, i) => i === index ? { ...a, ...acao } : a) || []
    }));
  };

  const removeCondicao = (index: number) => {
    setForm(prev => ({
      ...prev,
      condicoes: prev.condicoes?.filter((_, i) => i !== index) || []
    }));
  };

  const removeAcao = (index: number) => {
    setForm(prev => ({
      ...prev,
      acoes: prev.acoes?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSave = () => {
    if (!form.nome || !form.descricao || !form.condicoes?.length || !form.acoes?.length) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const automacao: Automacao = {
      id: editingAutomacao?.id || `auto-${Date.now()}`,
      nome: form.nome!,
      descricao: form.descricao!,
      ativo: form.ativo ?? true,
      boardId: form.boardId!,
      condicoes: form.condicoes!,
      acoes: form.acoes!,
      estatisticas: editingAutomacao?.estatisticas
    };

    onSave(automacao);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {editingAutomacao ? 'Editar Automação' : 'Nova Automação'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Informações básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome da Automação *</label>
                <input
                  type="text"
                  value={form.nome || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, nome: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Ex: Mensagem de boas-vindas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={form.ativo ? 'ativo' : 'inativo'}
                  onChange={(e) => setForm(prev => ({ ...prev, ativo: e.target.value === 'ativo' }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descrição *</label>
              <textarea
                value={form.descricao || ''}
                onChange={(e) => setForm(prev => ({ ...prev, descricao: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                rows={3}
                placeholder="Descreva o que esta automação faz..."
              />
            </div>

            {/* Condições */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium">Condições (Quando)</h3>
                <button
                  onClick={addCondicao}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" /> Adicionar Condição
                </button>
              </div>
              
              <div className="space-y-3">
                {form.condicoes?.map((condicao, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">Condição {index + 1}</span>
                      <button
                        onClick={() => removeCondicao(index)}
                        className="text-red-500 hover:bg-red-50 p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Tipo</label>
                        <select
                          value={condicao.tipo}
                          onChange={(e) => updateCondicao(index, { tipo: e.target.value as any })}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        >
                          {tiposCondicao.map(tipo => (
                            <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Operador</label>
                        <select
                          value={condicao.operador}
                          onChange={(e) => updateCondicao(index, { operador: e.target.value as any })}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        >
                          <option value="igual">Igual a</option>
                          <option value="diferente">Diferente de</option>
                          <option value="maior_que">Maior que</option>
                          <option value="menor_que">Menor que</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Valor</label>
                        <input
                          type="text"
                          value={condicao.valor || ''}
                          onChange={(e) => updateCondicao(index, { valor: e.target.value })}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          placeholder="Valor da condição"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {(!form.condicoes || form.condicoes.length === 0) && (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    Nenhuma condição adicionada. Clique em "Adicionar Condição" para começar.
                  </div>
                )}
              </div>
            </div>

            {/* Ações */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium">Ações (Então)</h3>
                <button
                  onClick={addAcao}
                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4" /> Adicionar Ação
                </button>
              </div>
              
              <div className="space-y-3">
                {form.acoes?.map((acao, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">Ação {index + 1}</span>
                      <button
                        onClick={() => removeAcao(index)}
                        className="text-red-500 hover:bg-red-50 p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Tipo de Ação</label>
                        <select
                          value={acao.tipo}
                          onChange={(e) => updateAcao(index, { tipo: e.target.value as TipoAcao })}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        >
                          {tiposAcao.map(tipo => (
                            <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      {acao.tipo === 'enviar_mensagem' && (
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Template da Mensagem</label>
                          <textarea
                            value={acao.template || ''}
                            onChange={(e) => updateAcao(index, { template: e.target.value })}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            rows={3}
                            placeholder="Use {{nome}}, {{email}}, etc. para personalizar"
                          />
                        </div>
                      )}
                      
                      {acao.tipo === 'agendar_followup' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Prazo</label>
                            <input
                              type="number"
                              value={acao.prazo || ''}
                              onChange={(e) => updateAcao(index, { prazo: parseInt(e.target.value) })}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Unidade</label>
                            <select
                              value={acao.unidadePrazo || 'dias'}
                              onChange={(e) => updateAcao(index, { unidadePrazo: e.target.value as any })}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            >
                              <option value="horas">Horas</option>
                              <option value="dias">Dias</option>
                              <option value="semanas">Semanas</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {(!form.acoes || form.acoes.length === 0) && (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    Nenhuma ação adicionada. Clique em "Adicionar Ação" para começar.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editingAutomacao ? 'Salvar Alterações' : 'Criar Automação'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AutomationManager({
  isOpen,
  onClose,
  boardId,
  automacoes: initialAutomacoes = [],
  onSaveAutomacao,
  onDeleteAutomacao,
  onToggleAutomacao
}: AutomationManagerProps) {
  const [automacoes, setAutomacoes] = useState<Automacao[]>(mockAutomacoes);
  const [showForm, setShowForm] = useState(false);
  const [editingAutomacao, setEditingAutomacao] = useState<Automacao | undefined>();
  const [filter, setFilter] = useState<'todos' | 'ativo' | 'inativo'>('todos');

  const filteredAutomacoes = automacoes.filter(auto => {
    if (filter === 'todos') return true;
    return filter === 'ativo' ? auto.ativo : !auto.ativo;
  });

  const handleEdit = (automacao: Automacao) => {
    setEditingAutomacao(automacao);
    setShowForm(true);
  };

  const handleDuplicate = (automacao: Automacao) => {
    const duplicated: Automacao = {
      ...automacao,
      id: `auto-${Date.now()}`,
      nome: `${automacao.nome} (Cópia)`,
      ativo: false,
      estatisticas: undefined
    };
    setAutomacoes(prev => [...prev, duplicated]);
  };

  const handleSave = (automacao: Automacao) => {
    setAutomacoes(prev => {
      const existing = prev.find(a => a.id === automacao.id);
      if (existing) {
        return prev.map(a => a.id === automacao.id ? automacao : a);
      }
      return [...prev, automacao];
    });
    onSaveAutomacao(automacao);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta automação?')) {
      setAutomacoes(prev => prev.filter(a => a.id !== id));
      onDeleteAutomacao(id);
    }
  };

  const handleToggle = (id: string) => {
    setAutomacoes(prev => 
      prev.map(a => a.id === id ? { ...a, ativo: !a.ativo } : a)
    );
    const automacao = automacoes.find(a => a.id === id);
    if (automacao) {
      onToggleAutomacao(id, !automacao.ativo);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Gerenciar Automações</h2>
                <p className="text-gray-600 text-sm">Configure automações para o seu pipeline</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                {[
                  { key: 'todos', label: 'Todas' },
                  { key: 'ativo', label: 'Ativas' },
                  { key: 'inativo', label: 'Inativas' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key as any)}
                    className={`px-3 py-1.5 rounded-lg text-sm ${
                      filter === key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setEditingAutomacao(undefined);
                  setShowForm(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Nova Automação
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredAutomacoes.map(automacao => (
                <AutomationCard
                  key={automacao.id}
                  automacao={automacao}
                  onEdit={() => handleEdit(automacao)}
                  onDelete={() => handleDelete(automacao.id)}
                  onToggle={() => handleToggle(automacao.id)}
                  onDuplicate={() => handleDuplicate(automacao)}
                />
              ))}
            </div>

            {filteredAutomacoes.length === 0 && (
              <div className="text-center py-12">
                <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filter === 'todos' ? 'Nenhuma automação criada' : `Nenhuma automação ${filter === 'ativo' ? 'ativa' : 'inativa'}`}
                </h3>
                <p className="text-gray-500 mb-4">
                  {filter === 'todos' ? 'Crie sua primeira automação para otimizar seu workflow' : `Altere o filtro ou ${filter === 'ativo' ? 'ative' : 'desative'} algumas automações`}
                </p>
                {filter === 'todos' && (
                  <button
                    onClick={() => {
                      setEditingAutomacao(undefined);
                      setShowForm(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Criar Primeira Automação
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <AutomationForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSave={handleSave}
        editingAutomacao={editingAutomacao}
        boardId={boardId}
      />
    </>
  );
}