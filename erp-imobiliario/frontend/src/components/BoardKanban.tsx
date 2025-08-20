import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Settings, Filter, Plus, MoreVertical, 
  AlertTriangle, Clock, DollarSign, Phone, Mail, 
  MessageSquare, Edit2, Search, ChevronDown, Target,
  X, Calendar, User, Building, Tag, FileText, Save, Smile
} from 'lucide-react';
import { Board, Lead, Estagio, Automacao } from '../types/crm-boards';
import AutomationManager from './AutomationManager';
import LeadDetailsModal from './LeadDetailsModal';
import QuickNotesPanel from './QuickNotesPanel';
import WhatsAppCrmDemo from './WhatsAppCrmDemo';
import LeadImportModal from './LeadImportModal';

interface BoardKanbanProps {
  board: Board;
  onBack: () => void;
  onOpenAutomations: () => void;
  onOpenSettings: () => void;
}

// Mock de leads para demonstração
// TODO: Replace with API integration to fetch leads for board
// Remove mock data and implement proper API calls to backend lead service
const mockLeads: Lead[] = [];

const formatCurrency = (value?: number) => {
  if (!value) return '-';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(value);
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('pt-BR');
};

const initials = (nome: string) => {
  return nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

function LeadCard({ lead, onSelect, onQuickNote }: { lead: Lead; onSelect: (lead: Lead) => void; onQuickNote: (lead: Lead) => void }) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', lead.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const getTemperaturaColor = (temp: string) => {
    switch (temp) {
      case 'quente': return 'bg-red-500';
      case 'morno': return 'bg-yellow-500';
      case 'frio': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'text-red-600 bg-red-50';
      case 'media': return 'text-yellow-600 bg-yellow-50';
      case 'baixa': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDoubleClick={() => onSelect(lead)}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
    >
      {/* Header do card */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full ${getTemperaturaColor(lead.temperatura)} text-white text-xs flex items-center justify-center font-semibold`}>
            {initials(lead.nome)}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-gray-900 truncate text-sm">{lead.nome}</h4>
            <p className="text-xs text-gray-500 truncate">{lead.email}</p>
          </div>
        </div>
        <button
          onClick={() => onSelect(lead)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Informações principais */}
      {lead.empreendimento && (
        <div className="text-xs text-gray-600 mb-2 truncate">
          🏢 {lead.empreendimento}
        </div>
      )}

      {/* Valor */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-green-600">
          {formatCurrency(lead.valor)}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full ${getPrioridadeColor(lead.prioridade)}`}>
          {lead.prioridade}
        </span>
      </div>

      {/* Tags */}
      {lead.tags && lead.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {lead.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full"
            >
              {tag}
            </span>
          ))}
          {lead.tags.length > 2 && (
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
              +{lead.tags.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{lead.responsavel}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickNote(lead);
            }}
            className="p-1 hover:bg-blue-100 rounded text-blue-600 hover:text-blue-700 transition-colors"
            title="Anotação rápida"
          >
            <Smile className="w-3 h-3" />
          </button>
          {lead.proximoFollowUp && (
            <div className="flex items-center gap-1 text-orange-600">
              <Clock className="w-3 h-3" />
              <span>{formatDate(lead.proximoFollowUp)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Score */}
      {lead.score && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Score</span>
            <div className="flex items-center gap-2">
              <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    lead.score >= 80 ? 'bg-green-500' :
                    lead.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${lead.score}%` }}
                />
              </div>
              <span className="text-xs font-medium">{lead.score}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EstagioColumn({ 
  estagio, 
  leads, 
  onDrop, 
  onAddLead,
  onSelectLead,
  onQuickNote,
  onColumnDragStart,
  onColumnDragOver,
  onColumnDrop,
  onRemoveEstagio,
  isDragging
}: { 
  estagio: Estagio; 
  leads: Lead[]; 
  onDrop: (leadId: string, estagioId: string) => void;
  onAddLead: (estagioId: string) => void;
  onSelectLead: (lead: Lead) => void;
  onQuickNote: (lead: Lead) => void;
  onColumnDragStart: (estagioId: string) => void;
  onColumnDragOver: (e: React.DragEvent) => void;
  onColumnDrop: (estagioId: string) => void;
  onRemoveEstagio?: (estagioId: string) => void;
  isDragging: boolean;
}) {
  const [editandoNome, setEditandoNome] = useState(false);
  const [nomeTemp, setNomeTemp] = useState(estagio.nome);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain');
    if (leadId) {
      onDrop(leadId, estagio.id);
    }
  };

  const valorTotal = leads.reduce((total, lead) => total + (lead.valor || 0), 0);

  const handleSalvarNome = () => {
    if (nomeTemp.trim() && nomeTemp.trim() !== estagio.nome) {
      // Aqui você pode implementar a lógica para salvar o nome
      console.log('Alterando nome de', estagio.nome, 'para', nomeTemp.trim());
      // estagio.nome = nomeTemp.trim(); // Esta linha seria feita via prop ou context
    }
    setEditandoNome(false);
  };

  const handleCancelarEdicao = () => {
    setNomeTemp(estagio.nome);
    setEditandoNome(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSalvarNome();
    } else if (e.key === 'Escape') {
      handleCancelarEdicao();
    }
  };

  return (
    <div
      draggable
      onDragStart={() => onColumnDragStart(estagio.id)}
      onDragOver={(e) => {
        handleDragOver(e);
        onColumnDragOver(e);
      }}
      onDrop={(e) => {
        handleDrop(e);
        onColumnDrop(estagio.id);
      }}
      className={`bg-gray-50 rounded-lg p-4 flex flex-col h-full transition-all cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50 scale-95' : ''
      } hover:shadow-md`}
    >
      {/* Header da coluna */}
      <div className="flex items-center justify-between mb-4 group">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: estagio.cor }}
          />
          {editandoNome ? (
            <input
              type="text"
              value={nomeTemp}
              onChange={(e) => setNomeTemp(e.target.value)}
              onBlur={handleSalvarNome}
              onKeyDown={handleKeyDown}
              className="font-semibold text-gray-900 bg-transparent border-b border-blue-500 focus:outline-none px-1"
              autoFocus
            />
          ) : (
            <h3 
              className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors flex items-center gap-1"
              onDoubleClick={() => setEditandoNome(true)}
              title="Duplo clique para editar"
            >
              {estagio.nome}
              <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-50" />
            </h3>
          )}
          <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
            {leads.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onAddLead(estagio.id)}
            className="p-1 hover:bg-white rounded text-gray-500 hover:text-gray-700"
            title="Adicionar lead"
          >
            <Plus className="w-4 h-4" />
          </button>
          {onRemoveEstagio && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Tem certeza que deseja remover o estágio "${estagio.nome}"?`)) {
                  onRemoveEstagio(estagio.id);
                }
              }}
              className="p-1 hover:bg-red-100 rounded text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remover estágio"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Valor total da coluna */}
      {valorTotal > 0 && (
        <div className="mb-4 p-2 bg-white rounded border">
          <div className="text-xs text-gray-500">Valor total</div>
          <div className="font-semibold text-green-600">{formatCurrency(valorTotal)}</div>
        </div>
      )}

      {/* Cards dos leads */}
      <div className="space-y-3 flex-1 overflow-y-auto min-h-0">
        {leads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onSelect={onSelectLead}
            onQuickNote={onQuickNote}
          />
        ))}
        
        {leads.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-300 rounded-lg">
            Arraste leads para cá ou clique no + para adicionar
          </div>
        )}
      </div>
    </div>
  );
}

export default function BoardKanban({ board, onBack, onOpenAutomations, onOpenSettings }: BoardKanbanProps) {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [estagios, setEstagios] = useState<Estagio[]>(board.estagios);
  const [filtros, setFiltros] = useState({
    busca: '',
    responsavel: '',
    prioridade: ''
  });
  const [filtrosExpanded, setFiltrosExpanded] = useState(false);
  const [showAutomations, setShowAutomations] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [quickNotesLead, setQuickNotesLead] = useState<Lead | null>(null);
  const [showWhatsAppDemo, setShowWhatsAppDemo] = useState(false);
  const [showLeadImport, setShowLeadImport] = useState(false);
  const [showNovoLead, setShowNovoLead] = useState(false);
  const [showNovoEstagio, setShowNovoEstagio] = useState(false);
  const [estagioDestino, setEstagioDestino] = useState<string>('lead');
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);

  // Filtrar leads
  const leadsFiltrados = useMemo(() => {
    return leads.filter(lead => {
      const matchBusca = !filtros.busca || 
        lead.nome.toLowerCase().includes(filtros.busca.toLowerCase()) ||
        lead.email.toLowerCase().includes(filtros.busca.toLowerCase()) ||
        lead.telefone.includes(filtros.busca);
      
      const matchResponsavel = !filtros.responsavel ||
        lead.responsavel.toLowerCase().includes(filtros.responsavel.toLowerCase());
        
      const matchPrioridade = !filtros.prioridade || lead.prioridade === filtros.prioridade;
      
      return matchBusca && matchResponsavel && matchPrioridade;
    });
  }, [leads, filtros]);

  // Agrupar leads por estágio
  const leadsPorEstagio = useMemo(() => {
    const grupos: Record<string, Lead[]> = {};
    estagios.forEach(estagio => {
      grupos[estagio.id] = leadsFiltrados.filter(lead => lead.estagioId === estagio.id);
    });
    return grupos;
  }, [leadsFiltrados, estagios]);

  const handleMoveLead = (leadId: string, estagioId: string) => {
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === leadId ? { ...lead, estagioId } : lead
      )
    );
  };

  const handleAddLead = (estagioId: string) => {
    setEstagioDestino(estagioId);
    setShowNovoLead(true);
  };

  const handleCreateLead = (leadData: Omit<Lead, 'id'>) => {
    const novoLead: Lead = {
      ...leadData,
      id: crypto.randomUUID(),
      estagioId: estagioDestino,
      dataCriacao: new Date().toISOString().split('T')[0],
    };
    
    setLeads(prev => [novoLead, ...prev]);
    setShowNovoLead(false);
    console.log('Novo lead criado:', novoLead);
  };

  const handleOpenAutomationsLocal = () => {
    setShowAutomations(true);
  };

  const handleSaveAutomacao = (automacao: Automacao) => {
    console.log('Salvando automação:', automacao);
    // Implementar salvamento da automação
  };

  const handleDeleteAutomacao = (id: string) => {
    console.log('Deletando automação:', id);
    // Implementar deleção da automação
  };

  const handleToggleAutomacao = (id: string, ativo: boolean) => {
    console.log('Alterando status da automação:', id, ativo);
    // Implementar alteração de status da automação
  };

  const handleImportLeads = (importedLeads: Lead[]) => {
    setLeads(prev => [...importedLeads, ...prev]);
    console.log(`${importedLeads.length} leads importados com sucesso!`);
  };

  // Funções para drag & drop de colunas
  const handleColumnDragStart = (estagioId: string) => {
    setDraggedColumn(estagioId);
  };

  const handleColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleColumnDrop = (targetEstagioId: string) => {
    if (!draggedColumn || draggedColumn === targetEstagioId) {
      setDraggedColumn(null);
      return;
    }

    const draggedIndex = estagios.findIndex(e => e.id === draggedColumn);
    const targetIndex = estagios.findIndex(e => e.id === targetEstagioId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedColumn(null);
      return;
    }

    const novosEstagios = [...estagios];
    const [draggedEstagio] = novosEstagios.splice(draggedIndex, 1);
    novosEstagios.splice(targetIndex, 0, draggedEstagio);

    setEstagios(novosEstagios);
    setDraggedColumn(null);
    console.log('Ordem das colunas alterada');
  };

  // Função para criar novo estágio
  const handleCreateEstagio = (nomeEstagio: string, cor: string) => {
    const novoEstagio: Estagio = {
      id: `estagio-${Date.now()}`,
      nome: nomeEstagio,
      cor: cor,
      ordem: estagios.length
    };

    setEstagios(prev => [...prev, novoEstagio]);
    setShowNovoEstagio(false);
    console.log('Novo estágio criado:', novoEstagio);
  };

  // Função para remover estágio
  const handleRemoveEstagio = (estagioId: string) => {
    const leadsNoEstagio = leads.filter(lead => lead.estagioId === estagioId);
    
    if (leadsNoEstagio.length > 0) {
      alert('Não é possível remover um estágio que contém leads. Mova os leads primeiro.');
      return;
    }

    setEstagios(prev => prev.filter(e => e.id !== estagioId));
    console.log('Estágio removido:', estagioId);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header fixo */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${board.cor}20`, color: board.cor }}
              >
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{board.nome}</h1>
                <p className="text-sm text-gray-500">{board.descricao}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAddLead('lead')}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              Criar Novo Lead
            </button>
            <button
              onClick={() => setShowLeadImport(true)}
              className="px-3 py-2 border border-blue-300 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Importar Leads
            </button>
            <button
              onClick={() => setShowWhatsAppDemo(true)}
              className="px-3 py-2 border border-green-300 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 text-sm"
            >
              💬 WhatsApp CRM
            </button>
            <button
              onClick={handleOpenAutomationsLocal}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              ⚡ Automações
            </button>
            <button
              onClick={() => setShowNovoEstagio(true)}
              className="px-3 py-2 border border-purple-300 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nova Coluna
            </button>
            <button
              onClick={onOpenSettings}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="mt-4">
          <button
            onClick={() => setFiltrosExpanded(!filtrosExpanded)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <Filter className="w-4 h-4" />
            Filtros
            <ChevronDown className={`w-4 h-4 transition-transform ${filtrosExpanded ? 'rotate-180' : ''}`} />
          </button>

          {filtrosExpanded && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar leads..."
                  value={filtros.busca}
                  onChange={(e) => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <input
                type="text"
                placeholder="Responsável"
                value={filtros.responsavel}
                onChange={(e) => setFiltros(prev => ({ ...prev, responsavel: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <select
                value={filtros.prioridade}
                onChange={(e) => setFiltros(prev => ({ ...prev, prioridade: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">Todas as prioridades</option>
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto min-h-0">
        <div className="h-full p-6">
          <div 
            className="grid gap-4 h-full min-h-[70vh]"
            style={{ gridTemplateColumns: `repeat(${estagios.length}, minmax(280px, 1fr))` }}
          >
            {estagios.map((estagio) => (
              <EstagioColumn
                key={estagio.id}
                estagio={estagio}
                leads={leadsPorEstagio[estagio.id] || []}
                onDrop={handleMoveLead}
                onAddLead={handleAddLead}
                onSelectLead={setSelectedLead}
                onQuickNote={setQuickNotesLead}
                onColumnDragStart={handleColumnDragStart}
                onColumnDragOver={handleColumnDragOver}
                onColumnDrop={handleColumnDrop}
                onRemoveEstagio={handleRemoveEstagio}
                isDragging={draggedColumn === estagio.id}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Automações */}
      <AutomationManager
        isOpen={showAutomations}
        onClose={() => setShowAutomations(false)}
        boardId={board.id}
        automacoes={board.automacoes}
        onSaveAutomacao={handleSaveAutomacao}
        onDeleteAutomacao={handleDeleteAutomacao}
        onToggleAutomacao={handleToggleAutomacao}
      />

      {/* Modal de Detalhes do Lead */}
      {selectedLead && (
        <LeadDetailsModal
          lead={selectedLead}
          board={board}
          onClose={() => setSelectedLead(null)}
          onUpdate={(updatedLead) => {
            // Implementar atualização do lead
            console.log('Atualizando lead:', updatedLead);
            setSelectedLead(null);
          }}
        />
      )}

      {/* Modal de Anotações Rápidas */}
      {quickNotesLead && (
        <QuickNotesPanel
          leadId={quickNotesLead.id}
          leadName={quickNotesLead.nome}
          isOpen={!!quickNotesLead}
          onClose={() => setQuickNotesLead(null)}
          onSave={(note) => {
            console.log('Nova anotação salva:', note);
            // Aqui você pode atualizar o estado dos leads ou fazer outras ações
          }}
        />
      )}

      {/* Modal de Demonstração WhatsApp CRM */}
      <WhatsAppCrmDemo
        isOpen={showWhatsAppDemo}
        onClose={() => setShowWhatsAppDemo(false)}
      />

      {/* Modal de Importação de Leads */}
      <LeadImportModal
        isOpen={showLeadImport}
        onClose={() => setShowLeadImport(false)}
        onImport={handleImportLeads}
      />

      {/* Modal de Novo Lead */}
      {showNovoLead && (
        <NovoLeadModal
          isOpen={showNovoLead}
          onClose={() => setShowNovoLead(false)}
          onCreate={handleCreateLead}
          estagioDestino={estagioDestino}
          board={board}
        />
      )}

      {/* Modal de Novo Estágio */}
      {showNovoEstagio && (
        <NovoEstagioModal
          isOpen={showNovoEstagio}
          onClose={() => setShowNovoEstagio(false)}
          onCreate={handleCreateEstagio}
        />
      )}
    </div>
  );
}

// Modal para criar novo lead
function NovoLeadModal({ 
  isOpen, 
  onClose, 
  onCreate, 
  estagioDestino, 
  board 
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (leadData: Omit<Lead, 'id'>) => void;
  estagioDestino: string;
  board: Board;
}) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    whatsapp: '',
    responsavel: '',
    valor: '',
    origem: 'site' as Lead['origem'],
    prioridade: 'media' as Lead['prioridade'],
    temperatura: 'morno' as Lead['temperatura'],
    empreendimento: '',
    observacoes: '',
    tags: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    if (!formData.responsavel.trim()) {
      newErrors.responsavel = 'Responsável é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const leadData: Omit<Lead, 'id'> = {
      nome: formData.nome.trim(),
      email: formData.email.trim(),
      telefone: formData.telefone.trim(),
      whatsapp: formData.whatsapp.trim() || undefined,
      estagioId: estagioDestino,
      responsavel: formData.responsavel.trim(),
      valor: formData.valor ? parseInt(formData.valor) : undefined,
      origem: formData.origem,
      prioridade: formData.prioridade,
      temperatura: formData.temperatura,
      dataCriacao: new Date().toISOString().split('T')[0],
      empreendimento: formData.empreendimento.trim() || undefined,
      tags: formData.tags.length > 0 ? formData.tags : undefined,
      observacoes: formData.observacoes.trim() || undefined,
      score: 50 // Score inicial padrão
    };

    onCreate(leadData);
    
    // Reset form
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      whatsapp: '',
      responsavel: '',
      valor: '',
      origem: 'site',
      prioridade: 'media',
      temperatura: 'morno',
      empreendimento: '',
      observacoes: '',
      tags: []
    });
    setErrors({});
  };

  const handleTagAdd = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const estagioAtual = board.estagios.find((e: any) => e.id === estagioDestino);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Criar Novo Lead</h2>
              <p className="text-sm text-gray-600">
                Será adicionado ao estágio: <span className="font-medium" style={{ color: estagioAtual?.cor }}>{estagioAtual?.nome}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.nome ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="Nome completo do lead"
                />
                {errors.nome && <p className="text-xs text-red-600 mt-1">{errors.nome}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="email@exemplo.com"
                />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone *
                </label>
                <input
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.telefone ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="(48) 99999-9999"
                />
                {errors.telefone && <p className="text-xs text-red-600 mt-1">{errors.telefone}</p>}
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="48999999999 (opcional)"
                />
              </div>

              {/* Responsável */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsável *
                </label>
                <input
                  type="text"
                  value={formData.responsavel}
                  onChange={(e) => setFormData(prev => ({ ...prev, responsavel: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.responsavel ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="Nome do corretor responsável"
                />
                {errors.responsavel && <p className="text-xs text-red-600 mt-1">{errors.responsavel}</p>}
              </div>

              {/* Valor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  value={formData.valor}
                  onChange={(e) => setFormData(prev => ({ ...prev, valor: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="450000"
                />
              </div>

              {/* Origem */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Origem
                </label>
                <select
                  value={formData.origem}
                  onChange={(e) => setFormData(prev => ({ ...prev, origem: e.target.value as Lead['origem'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="site">Site</option>
                  <option value="indicacao">Indicação</option>
                  <option value="telemarketing">Telemarketing</option>
                  <option value="redes-sociais">Redes Sociais</option>
                  <option value="evento">Evento</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              {/* Prioridade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prioridade
                </label>
                <select
                  value={formData.prioridade}
                  onChange={(e) => setFormData(prev => ({ ...prev, prioridade: e.target.value as Lead['prioridade'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              {/* Temperatura */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperatura
                </label>
                <select
                  value={formData.temperatura}
                  onChange={(e) => setFormData(prev => ({ ...prev, temperatura: e.target.value as Lead['temperatura'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="frio">Frio</option>
                  <option value="morno">Morno</option>
                  <option value="quente">Quente</option>
                </select>
              </div>

              {/* Empreendimento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Empreendimento
                </label>
                <input
                  type="text"
                  value={formData.empreendimento}
                  onChange={(e) => setFormData(prev => ({ ...prev, empreendimento: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Nome do empreendimento de interesse"
                />
              </div>
            </div>

            {/* Observações */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                rows={3}
                placeholder="Observações sobre o lead..."
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Digite uma tag e pressione Enter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleTagAdd(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Criar Lead
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Modal para criar novo estágio
function NovoEstagioModal({ 
  isOpen, 
  onClose, 
  onCreate 
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (nome: string, cor: string) => void;
}) {
  const [nome, setNome] = useState('');
  const [cor, setCor] = useState('#3B82F6');
  const [erro, setErro] = useState('');

  const coresPredefinidas = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // yellow
    '#EF4444', // red
    '#8B5CF6', // purple
    '#06B6D4', // cyan
    '#F97316', // orange
    '#84CC16', // lime
    '#EC4899', // pink
    '#6B7280'  // gray
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      setErro('Nome do estágio é obrigatório');
      return;
    }

    onCreate(nome.trim(), cor);
    
    // Reset form
    setNome('');
    setCor('#3B82F6');
    setErro('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Criar Nova Coluna</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome do estágio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Coluna *
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  setErro('');
                }}
                className={`w-full px-3 py-2 border rounded-lg text-sm ${erro ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500`}
                placeholder="Ex: Proposta Enviada"
                autoFocus
              />
              {erro && <p className="text-xs text-red-600 mt-1">{erro}</p>}
            </div>

            {/* Cor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor da Coluna
              </label>
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-8 h-8 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: cor }}
                />
                <input
                  type="color"
                  value={cor}
                  onChange={(e) => setCor(e.target.value)}
                  className="w-20 h-8 border border-gray-300 rounded cursor-pointer"
                />
              </div>
              
              {/* Cores predefinidas */}
              <div className="grid grid-cols-5 gap-2">
                {coresPredefinidas.map((corPredefinida) => (
                  <button
                    key={corPredefinida}
                    type="button"
                    onClick={() => setCor(corPredefinida)}
                    className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                      cor === corPredefinida ? 'border-gray-400 ring-2 ring-blue-500' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: corPredefinida }}
                    title={`Selecionar cor ${corPredefinida}`}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-xs text-gray-600 mb-2">Preview:</p>
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cor }}
                />
                <span className="font-medium text-gray-900">
                  {nome || 'Nome da Coluna'}
                </span>
                <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
                  0
                </span>
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Criar Coluna
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}