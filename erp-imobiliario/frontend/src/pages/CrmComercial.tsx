import React, { useState, useEffect, useMemo, useCallback, createContext, useContext, useReducer } from 'react';
import {
  Users, Target, Phone, Mail, MessageSquare, Eye, Edit2, Plus, X, Search,
  DollarSign, Calendar, Clock, Building, MapPin, Tag, User, Star, Filter,
  AlertTriangle, CheckCircle, TrendingUp, MoreVertical, Download, RefreshCw,
  ArrowUpRight, ArrowDownRight, BarChart3, PieChart, Activity, Award, Zap
} from 'lucide-react';

// ==================== INTERFACES E TIPOS ====================

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  whatsapp?: string;
  origem: 'site' | 'indicacao' | 'telemarketing' | 'redes-sociais' | 'evento' | 'outros';
  status: 'lead' | 'contato' | 'interessado' | 'negociacao' | 'proposta' | 'vendido' | 'perdido';
  prioridade: 'baixa' | 'media' | 'alta';
  valorOrcamento?: number;
  observacoes?: string;
  responsavel: string;
  dataCriacao: string;
  ultimoContato?: string;
  proximoFollowUp?: string;
  empreendimentoInteresse?: string;
  tags?: string[];
  score?: number;
  temperatura: 'frio' | 'morno' | 'quente';
  tempoResposta?: number;
  numeroContatos?: number;
  cidade?: string;
}

interface Atividade {
  id: string;
  clienteId: string;
  tipo: 'ligacao' | 'email' | 'whatsapp' | 'reuniao' | 'visita' | 'proposta' | 'follow-up' | 'nota';
  descricao: string;
  data: string;
  responsavel: string;
  status: 'agendado' | 'concluido' | 'cancelado' | 'em-andamento';
  observacoes?: string;
  duracao?: number;
  resultado?: 'positivo' | 'neutro' | 'negativo';
  proximaAcao?: string;
  dataProximaAcao?: string;
  prioridade?: 'baixa' | 'media' | 'alta';
}

interface FiltrosCRM {
  busca: string;
  status: string;
  origem: string;
  responsavel: string;
  prioridade: string;
  temperatura: string;
  dataInicio: string;
  dataFim: string;
  valorMinimo: string;
  valorMaximo: string;
  empreendimento: string;
  cidade: string;
  tags: string[];
}

interface CRMState {
  clientes: Cliente[];
  atividades: Atividade[];
  filtros: FiltrosCRM;
  loading: boolean;
  error: string | null;
  clienteSelecionado: Cliente | null;
  modalAtivo: string | null;
  notificacoes: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
  }>;
}

// ==================== DADOS MOCK ====================

const mockClientes: Cliente[] = [
  {
    id: '1',
    nome: 'Maria Silva Santos',
    email: 'maria.silva@email.com',
    telefone: '(48) 99999-1234',
    whatsapp: '48999991234',
    origem: 'site',
    status: 'interessado',
    prioridade: 'alta',
    valorOrcamento: 450000,
    responsavel: 'João Corretor',
    dataCriacao: '2025-01-15',
    ultimoContato: '2025-01-28',
    proximoFollowUp: '2025-01-31',
    empreendimentoInteresse: 'Residencial Solar das Flores',
    tags: ['qualificado', 'urgente', 'financiamento-aprovado'],
    score: 85,
    temperatura: 'quente',
    tempoResposta: 2,
    numeroContatos: 5,
    cidade: 'Florianópolis'
  },
  {
    id: '2',
    nome: 'Carlos Eduardo Lima',
    email: 'carlos.lima@empresa.com',
    telefone: '(48) 98888-5678',
    whatsapp: '48988885678',
    origem: 'indicacao',
    status: 'negociacao',
    prioridade: 'alta',
    valorOrcamento: 680000,
    responsavel: 'Ana Corretora',
    dataCriacao: '2025-01-10',
    ultimoContato: '2025-01-29',
    proximoFollowUp: '2025-02-01',
    empreendimentoInteresse: 'Comercial Business Center',
    tags: ['investidor', 'decisor', 'alta-renda'],
    score: 92,
    temperatura: 'quente',
    tempoResposta: 1,
    numeroContatos: 8,
    cidade: 'Florianópolis'
  },
  {
    id: '3',
    nome: 'Pedro Santos Oliveira',
    email: 'pedro.oliveira@gmail.com',
    telefone: '(48) 97777-9012',
    origem: 'redes-sociais',
    status: 'lead',
    prioridade: 'media',
    responsavel: 'Maria Corretora',
    dataCriacao: '2025-01-25',
    ultimoContato: '2025-01-26',
    proximoFollowUp: '2025-01-30',
    tags: ['novo', 'primeira-conversa'],
    score: 45,
    temperatura: 'morno',
    tempoResposta: 12,
    numeroContatos: 1,
    cidade: 'São José'
  },
  {
    id: '4',
    nome: 'Ana Paula Costa',
    email: 'anapaula@email.com',
    telefone: '(48) 96666-3456',
    whatsapp: '48966663456',
    origem: 'telemarketing',
    status: 'proposta',
    prioridade: 'alta',
    valorOrcamento: 320000,
    responsavel: 'João Corretor',
    dataCriacao: '2025-01-20',
    ultimoContato: '2025-01-29',
    proximoFollowUp: '2025-02-02',
    empreendimentoInteresse: 'Residencial Solar das Flores',
    tags: ['financiamento', 'primeira-casa', 'jovem'],
    score: 78,
    temperatura: 'quente',
    tempoResposta: 3,
    numeroContatos: 6,
    cidade: 'Florianópolis'
  },
  {
    id: '5',
    nome: 'Roberto Ferreira',
    email: 'roberto.ferreira@gmail.com',
    telefone: '(48) 95555-7890',
    origem: 'evento',
    status: 'contato',
    prioridade: 'media',
    valorOrcamento: 280000,
    responsavel: 'Ana Corretora',
    dataCriacao: '2025-01-22',
    ultimoContato: '2025-01-27',
    proximoFollowUp: '2025-01-31',
    empreendimentoInteresse: 'Residencial Jardim das Águas',
    tags: ['primeira-compra', 'evento-feira'],
    score: 62,
    temperatura: 'morno',
    tempoResposta: 6,
    numeroContatos: 3,
    cidade: 'São José'
  },
  {
    id: '6',
    nome: 'Fernanda Costa',
    email: 'fernanda.costa@outlook.com',
    telefone: '(48) 94444-5678',
    whatsapp: '48944445678',
    origem: 'site',
    status: 'vendido',
    prioridade: 'alta',
    valorOrcamento: 550000,
    responsavel: 'João Corretor',
    dataCriacao: '2024-12-15',
    ultimoContato: '2025-01-25',
    empreendimentoInteresse: 'Residencial Solar das Flores',
    tags: ['cliente-vip', 'concluido', 'indicadora'],
    score: 95,
    temperatura: 'quente',
    tempoResposta: 1,
    numeroContatos: 12,
    cidade: 'Florianópolis'
  }
];

const mockAtividades: Atividade[] = [
  {
    id: '1',
    clienteId: '1',
    tipo: 'ligacao',
    descricao: 'Follow-up sobre interesse no apartamento tipo 2',
    data: '2025-01-28T14:30:00',
    responsavel: 'João Corretor',
    status: 'concluido',
    observacoes: 'Cliente confirmou interesse e agendou visita',
    duracao: 15,
    resultado: 'positivo',
    proximaAcao: 'Agendar visita ao apartamento decorado',
    dataProximaAcao: '2025-02-02',
    prioridade: 'alta'
  },
  {
    id: '2',
    clienteId: '2',
    tipo: 'reuniao',
    descricao: 'Apresentação da proposta comercial',
    data: '2025-02-01T10:00:00',
    responsavel: 'Ana Corretora',
    status: 'agendado',
    observacoes: 'Preparar material completo sobre ROI',
    duracao: 60,
    prioridade: 'alta'
  }
];

// ==================== CONTEXT E ESTADO ====================

type CRMAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CLIENTES'; payload: Cliente[] }
  | { type: 'ADD_CLIENTE'; payload: Cliente }
  | { type: 'UPDATE_CLIENTE'; payload: Cliente }
  | { type: 'DELETE_CLIENTE'; payload: string }
  | { type: 'SET_CLIENTE_SELECIONADO'; payload: Cliente | null }
  | { type: 'SET_ATIVIDADES'; payload: Atividade[] }
  | { type: 'ADD_ATIVIDADE'; payload: Atividade }
  | { type: 'SET_FILTROS'; payload: Partial<FiltrosCRM> }
  | { type: 'CLEAR_FILTROS' }
  | { type: 'SET_MODAL_ATIVO'; payload: string | null }
  | { type: 'ADD_NOTIFICACAO'; payload: Omit<CRMState['notificacoes'][0], 'id' | 'timestamp' | 'read'> };

const initialFiltros: FiltrosCRM = {
  busca: '',
  status: '',
  origem: '',
  responsavel: '',
  prioridade: '',
  temperatura: '',
  dataInicio: '',
  dataFim: '',
  valorMinimo: '',
  valorMaximo: '',
  empreendimento: '',
  cidade: '',
  tags: []
};

const initialState: CRMState = {
  clientes: mockClientes,
  atividades: mockAtividades,
  filtros: initialFiltros,
  loading: false,
  error: null,
  clienteSelecionado: null,
  modalAtivo: null,
  notificacoes: []
};

function crmReducer(state: CRMState, action: CRMAction): CRMState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_CLIENTES':
      return { ...state, clientes: action.payload, loading: false };
    
    case 'ADD_CLIENTE':
      return { 
        ...state, 
        clientes: [...state.clientes, action.payload],
        notificacoes: [
          {
            id: Date.now().toString(),
            type: 'success',
            title: 'Cliente Adicionado',
            message: `${action.payload.nome} foi adicionado com sucesso`,
            timestamp: new Date(),
            read: false
          },
          ...state.notificacoes
        ]
      };
    
    case 'UPDATE_CLIENTE':
      return {
        ...state,
        clientes: state.clientes.map(cliente => 
          cliente.id === action.payload.id ? action.payload : cliente
        ),
        clienteSelecionado: state.clienteSelecionado?.id === action.payload.id 
          ? action.payload 
          : state.clienteSelecionado
      };
    
    case 'DELETE_CLIENTE':
      return {
        ...state,
        clientes: state.clientes.filter(cliente => cliente.id !== action.payload),
        clienteSelecionado: state.clienteSelecionado?.id === action.payload 
          ? null 
          : state.clienteSelecionado
      };
    
    case 'SET_CLIENTE_SELECIONADO':
      return { ...state, clienteSelecionado: action.payload };
    
    case 'SET_ATIVIDADES':
      return { ...state, atividades: action.payload };
    
    case 'ADD_ATIVIDADE':
      return { 
        ...state, 
        atividades: [...state.atividades, action.payload]
      };
    
    case 'SET_FILTROS':
      return { 
        ...state, 
        filtros: { ...state.filtros, ...action.payload } 
      };
    
    case 'CLEAR_FILTROS':
      return { ...state, filtros: initialFiltros };
    
    case 'SET_MODAL_ATIVO':
      return { ...state, modalAtivo: action.payload };
    
    case 'ADD_NOTIFICACAO':
      return {
        ...state,
        notificacoes: [
          {
            ...action.payload,
            id: Date.now().toString(),
            timestamp: new Date(),
            read: false
          },
          ...state.notificacoes
        ]
      };
    
    default:
      return state;
  }
}

const CRMContext = createContext<{
  state: CRMState;
  dispatch: React.Dispatch<CRMAction>;
} | null>(null);

function useCRM() {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM deve ser usado dentro de um CRMProvider');
  }
  return context;
}

// ==================== HOOKS UTILITÁRIOS ====================

function useFormatters() {
  const formatCurrency = useCallback((value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }, []);

  const formatDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }, []);

  const formatPhone = useCallback((phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  }, []);

  return { formatCurrency, formatDate, formatPhone };
}

function useClienteFilter() {
  const { state } = useCRM();
  const { clientes, filtros } = state;

  const clientesFiltrados = useMemo(() => {
    return clientes.filter(cliente => {
      const matchBusca = !filtros.busca || 
        cliente.nome.toLowerCase().includes(filtros.busca.toLowerCase()) ||
        cliente.email.toLowerCase().includes(filtros.busca.toLowerCase()) ||
        cliente.telefone.includes(filtros.busca);
      
      const matchStatus = !filtros.status || cliente.status === filtros.status;
      const matchOrigem = !filtros.origem || cliente.origem === filtros.origem;
      const matchResponsavel = !filtros.responsavel || cliente.responsavel === filtros.responsavel;
      const matchPrioridade = !filtros.prioridade || cliente.prioridade === filtros.prioridade;
      const matchTemperatura = !filtros.temperatura || cliente.temperatura === filtros.temperatura;
      const matchCidade = !filtros.cidade || cliente.cidade === filtros.cidade;
      
      const matchValor = (
        (!filtros.valorMinimo || !cliente.valorOrcamento || 
         cliente.valorOrcamento >= parseInt(filtros.valorMinimo)) &&
        (!filtros.valorMaximo || !cliente.valorOrcamento || 
         cliente.valorOrcamento <= parseInt(filtros.valorMaximo))
      );
      
      const matchData = (
        (!filtros.dataInicio || new Date(cliente.dataCriacao) >= new Date(filtros.dataInicio)) &&
        (!filtros.dataFim || new Date(cliente.dataCriacao) <= new Date(filtros.dataFim))
      );
      
      return matchBusca && matchStatus && matchOrigem && matchResponsavel && 
             matchPrioridade && matchTemperatura && matchCidade && 
             matchValor && matchData;
    });
  }, [clientes, filtros]);

  const contadoresPorStatus = useMemo(() => {
    return clientesFiltrados.reduce((acc, cliente) => {
      acc[cliente.status] = (acc[cliente.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [clientesFiltrados]);

  return {
    clientesFiltrados,
    contadoresPorStatus,
    totalClientes: clientesFiltrados.length
  };
}

// ==================== COMPONENTES PRINCIPAIS ====================

function DashboardMetricas() {
  const { clientesFiltrados } = useClienteFilter();
  const { formatCurrency } = useFormatters();

  const metricas = useMemo(() => {
    const total = clientesFiltrados.length;
    const leads = clientesFiltrados.filter(c => c.status === 'lead').length;
    const ativo = clientesFiltrados.filter(c => 
      ['interessado', 'negociacao', 'proposta'].includes(c.status)
    ).length;
    const vendas = clientesFiltrados.filter(c => c.status === 'vendido').length;
    const valorPipeline = clientesFiltrados
      .filter(c => c.valorOrcamento && ['interessado', 'negociacao', 'proposta'].includes(c.status))
      .reduce((sum, c) => sum + (c.valorOrcamento || 0), 0);

    return { total, leads, ativo, vendas, valorPipeline };
  }, [clientesFiltrados]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-blue-50">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Total Leads</h3>
            <div className="text-2xl font-bold">{metricas.total}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-yellow-50">
            <Target className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Pipeline Ativo</h3>
            <div className="text-2xl font-bold">{metricas.ativo}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-green-50">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Vendas</h3>
            <div className="text-2xl font-bold">{metricas.vendas}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-purple-50">
            <BarChart3 className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Pipeline Valor</h3>
            <div className="text-lg font-bold text-green-600">
              {formatCurrency(metricas.valorPipeline)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FiltrosCRM() {
  const { state, dispatch } = useCRM();
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleFiltroChange = (key: keyof FiltrosCRM, value: any) => {
    dispatch({
      type: 'SET_FILTROS',
      payload: { [key]: value }
    });
  };

  const limparFiltros = () => {
    dispatch({ type: 'CLEAR_FILTROS' });
  };

  return (
    <div className="bg-white rounded-lg border p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Busca */}
          <div className="relative min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar leads..."
              value={state.filtros.busca}
              onChange={(e) => handleFiltroChange('busca', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtros rápidos */}
          <select
            value={state.filtros.status}
            onChange={(e) => handleFiltroChange('status', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300"
          >
            <option value="">Todos os status</option>
            <option value="lead">Lead</option>
            <option value="contato">Contato</option>
            <option value="interessado">Interessado</option>
            <option value="negociacao">Negociação</option>
            <option value="proposta">Proposta</option>
            <option value="vendido">Vendido</option>
            <option value="perdido">Perdido</option>
          </select>

          <select
            value={state.filtros.responsavel}
            onChange={(e) => handleFiltroChange('responsavel', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300"
          >
            <option value="">Todos os corretores</option>
            <option value="João Corretor">João Corretor</option>
            <option value="Ana Corretora">Ana Corretora</option>
            <option value="Maria Corretora">Maria Corretora</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Mais filtros
          </button>

          <button
            onClick={limparFiltros}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Filtros expandidos */}
      {mostrarFiltros && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
          <select
            value={state.filtros.origem}
            onChange={(e) => handleFiltroChange('origem', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300"
          >
            <option value="">Todas as origens</option>
            <option value="site">Site</option>
            <option value="indicacao">Indicação</option>
            <option value="telemarketing">Telemarketing</option>
            <option value="redes-sociais">Redes Sociais</option>
            <option value="evento">Evento</option>
          </select>

          <select
            value={state.filtros.prioridade}
            onChange={(e) => handleFiltroChange('prioridade', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300"
          >
            <option value="">Todas prioridades</option>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>

          <select
            value={state.filtros.temperatura}
            onChange={(e) => handleFiltroChange('temperatura', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300"
          >
            <option value="">Todas temperaturas</option>
            <option value="quente">Quente</option>
            <option value="morno">Morno</option>
            <option value="frio">Frio</option>
          </select>

          <input
            type="text"
            placeholder="Cidade"
            value={state.filtros.cidade}
            onChange={(e) => handleFiltroChange('cidade', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300"
          />
        </div>
      )}
    </div>
  );
}

function TabelaClientes() {
  const { clientesFiltrados } = useClienteFilter();
  const { formatCurrency, formatDate, formatPhone } = useFormatters();
  const { dispatch } = useCRM();

  const handleClienteClick = (cliente: Cliente) => {
    dispatch({ type: 'SET_CLIENTE_SELECIONADO', payload: cliente });
    dispatch({ type: 'SET_MODAL_ATIVO', payload: 'detalhes-cliente' });
  };

  return (
    <div className="bg-white rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Origem
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Responsável
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clientesFiltrados.map((cliente) => (
              <tr
                key={cliente.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleClienteClick(cliente)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-medium ${
                        cliente.temperatura === 'quente' ? 'bg-red-500' :
                        cliente.temperatura === 'morno' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}>
                        {cliente.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{cliente.nome}</div>
                      <div className="text-sm text-gray-500">{cliente.email}</div>
                      <div className="text-sm text-gray-500">{formatPhone(cliente.telefone)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                    cliente.status === 'vendido' ? 'bg-green-100 text-green-800' :
                    cliente.status === 'perdido' ? 'bg-red-100 text-red-800' :
                    cliente.status === 'proposta' ? 'bg-purple-100 text-purple-800' :
                    cliente.status === 'negociacao' ? 'bg-orange-100 text-orange-800' :
                    cliente.status === 'interessado' ? 'bg-yellow-100 text-yellow-800' :
                    cliente.status === 'contato' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {cliente.status}
                  </span>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      cliente.prioridade === 'alta' ? 'bg-red-100 text-red-800' :
                      cliente.prioridade === 'media' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {cliente.prioridade}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                    cliente.origem === 'site' ? 'bg-blue-100 text-blue-800' :
                    cliente.origem === 'indicacao' ? 'bg-green-100 text-green-800' :
                    cliente.origem === 'telemarketing' ? 'bg-purple-100 text-purple-800' :
                    cliente.origem === 'redes-sociais' ? 'bg-pink-100 text-pink-800' :
                    cliente.origem === 'evento' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {cliente.origem === 'redes-sociais' ? 'social' : cliente.origem}
                  </span>
                  {cliente.score && (
                    <div className="text-xs text-gray-500 mt-1">
                      Score: {cliente.score}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {cliente.valorOrcamento ? formatCurrency(cliente.valorOrcamento) : '-'}
                  </div>
                  {cliente.empreendimentoInteresse && (
                    <div className="text-sm text-gray-500 truncate max-w-32">
                      {cliente.empreendimentoInteresse}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{cliente.responsavel}</div>
                  <div className="text-sm text-gray-500">
                    {formatDate(cliente.dataCriacao)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Ligar para', cliente.telefone);
                      }}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                      title="Ligar"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Email para', cliente.email);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Email"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    {cliente.whatsapp && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('WhatsApp para', cliente.whatsapp);
                        }}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClienteClick(cliente);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Ver detalhes"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Estado vazio */}
      {clientesFiltrados.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum cliente encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tente ajustar os filtros ou adicionar novos leads.
          </p>
        </div>
      )}
    </div>
  );
}

function ModalDetalhesCliente() {
  const { state, dispatch } = useCRM();
  const { formatCurrency, formatDate, formatPhone } = useFormatters();

  if (state.modalAtivo !== 'detalhes-cliente' || !state.clienteSelecionado) {
    return null;
  }

  const cliente = state.clienteSelecionado;

  const fecharModal = () => {
    dispatch({ type: 'SET_MODAL_ATIVO', payload: null });
    dispatch({ type: 'SET_CLIENTE_SELECIONADO', payload: null });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header do Modal */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                cliente.temperatura === 'quente' ? 'bg-red-500' :
                cliente.temperatura === 'morno' ? 'bg-yellow-500' : 'bg-blue-500'
              }`}>
                {cliente.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{cliente.nome}</h2>
                <p className="text-gray-600">{cliente.email}</p>
                <p className="text-gray-600">{formatPhone(cliente.telefone)}</p>
              </div>
            </div>
            <button
              onClick={fecharModal}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Informações principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
                    cliente.status === 'vendido' ? 'bg-green-100 text-green-800' :
                    cliente.status === 'perdido' ? 'bg-red-100 text-red-800' :
                    cliente.status === 'proposta' ? 'bg-purple-100 text-purple-800' :
                    cliente.status === 'negociacao' ? 'bg-orange-100 text-orange-800' :
                    cliente.status === 'interessado' ? 'bg-yellow-100 text-yellow-800' :
                    cliente.status === 'contato' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {cliente.status}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Prioridade:</label>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
                    cliente.prioridade === 'alta' ? 'bg-red-100 text-red-800' :
                    cliente.prioridade === 'media' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {cliente.prioridade}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Temperatura:</label>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
                    cliente.temperatura === 'quente' ? 'bg-red-100 text-red-800' :
                    cliente.temperatura === 'morno' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {cliente.temperatura}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Origem:</label>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
                    cliente.origem === 'site' ? 'bg-blue-100 text-blue-800' :
                    cliente.origem === 'indicacao' ? 'bg-green-100 text-green-800' :
                    cliente.origem === 'telemarketing' ? 'bg-purple-100 text-purple-800' :
                    cliente.origem === 'redes-sociais' ? 'bg-pink-100 text-pink-800' :
                    cliente.origem === 'evento' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {cliente.origem === 'redes-sociais' ? 'social' : cliente.origem}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Responsável:</label>
                <p className="mt-1 text-sm text-gray-900">{cliente.responsavel}</p>
              </div>

              {cliente.valorOrcamento && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Valor do Orçamento:</label>
                  <p className="mt-1 text-lg font-semibold text-green-600">
                    {formatCurrency(cliente.valorOrcamento)}
                  </p>
                </div>
              )}

              {cliente.cidade && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Cidade:</label>
                  <p className="mt-1 text-sm text-gray-900">{cliente.cidade}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700">Data de Criação:</label>
                <p className="mt-1 text-sm text-gray-900">{formatDate(cliente.dataCriacao)}</p>
              </div>

              {cliente.ultimoContato && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Último Contato:</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(cliente.ultimoContato)}</p>
                </div>
              )}

              {cliente.proximoFollowUp && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Próximo Follow-up:</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(cliente.proximoFollowUp)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Empreendimento e Tags */}
          {(cliente.empreendimentoInteresse || cliente.tags) && (
            <div className="mb-6">
              {cliente.empreendimentoInteresse && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700">Empreendimento de Interesse:</label>
                  <p className="mt-1 text-sm text-gray-900">{cliente.empreendimentoInteresse}</p>
                </div>
              )}

              {cliente.tags && cliente.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Tags:</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {cliente.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Observações */}
          {cliente.observacoes && (
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700">Observações:</label>
              <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {cliente.observacoes}
              </p>
            </div>
          )}

          {/* Métricas adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {cliente.score && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Score</p>
                    <p className="text-lg font-bold text-blue-600">{cliente.score}</p>
                  </div>
                </div>
              </div>
            )}

            {cliente.numeroContatos && (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Contatos</p>
                    <p className="text-lg font-bold text-green-600">{cliente.numeroContatos}</p>
                  </div>
                </div>
              </div>
            )}

            {cliente.tempoResposta && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-orange-900">Tempo Resposta</p>
                    <p className="text-lg font-bold text-orange-600">{cliente.tempoResposta}h</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex gap-3 pt-6 border-t">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Phone className="w-4 h-4" />
              Ligar
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Mail className="w-4 h-4" />
              Email
            </button>
            {cliente.whatsapp && (
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <MessageSquare className="w-4 h-4" />
                WhatsApp
              </button>
            )}
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Edit2 className="w-4 h-4" />
              Editar
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              <Calendar className="w-4 h-4" />
              Agendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== COMPONENTE PRINCIPAL ====================

function CRMProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(crmReducer, initialState);

  return (
    <CRMContext.Provider value={{ state, dispatch }}>
      {children}
    </CRMContext.Provider>
  );
}

export default function CrmComercial() {
  return (
    <CRMProvider>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CRM Comercial</h1>
            <p className="mt-1 text-gray-600">
              Gerencie seus leads e oportunidades de venda
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              Novo Lead
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>

        {/* Métricas Dashboard */}
        <DashboardMetricas />

        {/* Filtros */}
        <FiltrosCRM />

        {/* Tabela de Clientes */}
        <TabelaClientes />

        {/* Modal de Detalhes */}
        <ModalDetalhesCliente />
      </div>
    </CRMProvider>
  );
}