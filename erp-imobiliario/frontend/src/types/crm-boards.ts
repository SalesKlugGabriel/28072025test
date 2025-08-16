// Tipos para o sistema de boards e automações do CRM
export type BoardType = 'vendas' | 'pos-venda' | 'automacao';

export interface Estagio {
  id: string;
  nome: string;
  cor: string;
  ordem: number;
}

export interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  whatsapp?: string;
  estagioId: string;
  responsavel: string;
  valor?: number;
  origem: string;
  prioridade: 'baixa' | 'media' | 'alta';
  temperatura: 'frio' | 'morno' | 'quente';
  dataCriacao: string;
  ultimoContato?: string;
  proximoFollowUp?: string;
  empreendimento?: string;
  tags?: string[];
  score?: number;
  observacoes?: string;
}

export interface Board {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
  icone: string;
  ordem: number;
  ativo: boolean;
  tipo: BoardType;
  estagios: Estagio[];
  automacoes: Automacao[];
}

export interface EstagioBoard {
  id: string;
  boardId: string;
  nome: string;
  descricao?: string;
  cor: string;
  ordem: number;
  tipo: 'inicial' | 'intermediario' | 'final' | 'perdido';
  configuracoes: {
    tempoLimite?: number; // dias
    acaoAutomatica?: string;
    obrigatorioPreenchimento: string[]; // campos obrigatórios
  };
}

export interface LeadBoard {
  id: string;
  leadId: string;
  boardId: string;
  estagioId: string;
  posicao: number;
  dataEntrada: string;
  dataUltimaMovimentacao: string;
  historico: MovimentacaoLead[];
}

export interface MovimentacaoLead {
  id: string;
  leadId: string;
  boardId: string;
  estagioOrigem: string;
  estagioDestino: string;
  motivo?: string;
  observacoes?: string;
  data: string;
  usuario: string;
  automatica: boolean;
}

// Automações
export interface Automacao {
  id: string;
  nome: string;
  descricao: string;
  ativo: boolean;
  boardId: string;
  condicoes: CondicaoAutomacao[];
  acoes: AcaoAutomacao[];
  estatisticas?: {
    execucoes: number;
    sucessos: number;
    falhas: number;
    taxaSucesso: number;
  };
}

export interface AutomacaoBoard {
  id: string;
  nome: string;
  descricao: string;
  boardId: string;
  ativa: boolean;
  condicoes: CondicaoAutomacao[];
  acoes: AcaoAutomacao[];
  configuracoes: {
    executarApenas: 'uma_vez' | 'sempre';
    aguardarTempo: number; // minutos
    diasSemana?: number[]; // 0-6 (domingo-sabado)
    horario?: string; // HH:mm
  };
  dataInclusao: string;
  dataAtualizacao: string;
  estatisticas: {
    totalExecucoes: number;
    ultimaExecucao?: string;
    sucessos: number;
    erros: number;
  };
}

export interface CondicaoAutomacao {
  id?: string;
  tipo: 'entrada_estagio' | 'tempo_sem_atividade' | 'estagio_atual' | 'valor_lead' | 'origem_lead';
  estagioId?: string;
  operador: 'igual' | 'diferente' | 'maior_que' | 'menor_que';
  valor?: string | number;
  unidade?: 'dias' | 'horas' | 'minutos';
}

export type TipoAcao = 'enviar_mensagem' | 'agendar_followup' | 'mover_estagio' | 'atribuir_responsavel' | 'adicionar_tag' | 'fazer_ligacao' | 'enviar_email';

export interface AcaoAutomacao {
  id?: string;
  tipo: TipoAcao;
  template?: string;
  canal?: 'whatsapp' | 'email';
  delay?: number;
  prazo?: number;
  unidadePrazo?: 'horas' | 'dias' | 'semanas';
  responsavel?: string;
  titulo?: string;
  estagioDestinoId?: string;
  observacao?: string;
  parametros?: Record<string, any>;
  ordem?: number;
  aguardarAntes?: number; // minutos
}

// Templates para automações
export interface TemplateAutomacao {
  id: string;
  nome: string;
  categoria: 'followup' | 'nutricao' | 'conversao' | 'reativacao';
  descricao: string;
  configuracao: Omit<AutomacaoBoard, 'id' | 'boardId' | 'dataInclusao' | 'dataAtualizacao' | 'estatisticas'>;
}

// Mensagens automáticas
export interface MensagemAutomatica {
  id: string;
  nome: string;
  tipo: 'whatsapp' | 'email' | 'sms';
  assunto?: string; // para email
  conteudo: string;
  variaveis: string[]; // variáveis disponíveis como {{nome}}, {{empreendimento}}
  configuracoes: {
    formatoRico: boolean;
    anexos?: string[];
    agendarEnvio: boolean;
  };
}

// Follow-ups automáticos
export interface FollowUpAutomatico {
  id: string;
  leadId: string;
  tipo: 'ligacao' | 'whatsapp' | 'email' | 'reuniao' | 'visita';
  titulo: string;
  descricao?: string;
  dataAgendamento: string;
  status: 'agendado' | 'executado' | 'cancelado' | 'reagendado';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  responsavel: string;
  automacaoId?: string; // se foi criado por automação
  configuracoes: {
    notificarAntes: number; // minutos
    repetir: boolean;
    intervaloRepeticao?: number; // dias
  };
}

// Estado do CRM
export interface CRMBoardsState {
  boards: Board[];
  boardAtual: string | null;
  estagios: Record<string, EstagioBoard[]>; // boardId -> estagios
  leadsBoard: Record<string, LeadBoard[]>; // boardId -> leads
  automacoes: AutomacaoBoard[];
  templatesAutomacao: TemplateAutomacao[];
  mensagensAutomaticas: MensagemAutomatica[];
  followUpsAutomaticos: FollowUpAutomatico[];
  
  // UI State
  modoVisualizacao: 'kanban' | 'lista' | 'calendario';
  filtros: {
    corretor?: string[];
    fonte?: string[];
    tags?: string[];
    dataInicio?: string;
    dataFim?: string;
  };
  
  loading: boolean;
  error: string | null;
}

export type CRMBoardsAction =
  | { type: 'SET_BOARDS'; payload: Board[] }
  | { type: 'SET_BOARD_ATUAL'; payload: string | null }
  | { type: 'SET_ESTAGIOS'; payload: { boardId: string; estagios: EstagioBoard[] } }
  | { type: 'SET_LEADS_BOARD'; payload: { boardId: string; leads: LeadBoard[] } }
  | { type: 'MOVE_LEAD'; payload: { leadId: string; novoEstagio: string; novaPosicao: number } }
  | { type: 'ADD_AUTOMACAO'; payload: AutomacaoBoard }
  | { type: 'UPDATE_AUTOMACAO'; payload: AutomacaoBoard }
  | { type: 'DELETE_AUTOMACAO'; payload: string }
  | { type: 'SET_MODO_VISUALIZACAO'; payload: 'kanban' | 'lista' | 'calendario' }
  | { type: 'SET_FILTROS'; payload: CRMBoardsState['filtros'] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Configurações de boards padrão
export const BOARDS_PADRAO: Board[] = [
  {
    id: 'board_vendas',
    nome: 'Pipeline de Vendas',
    descricao: 'Processo de vendas padrão com todos os estágios',
    cor: '#3B82F6',
    icone: 'trending-up',
    ordem: 1,
    ativo: true,
    tipo: 'vendas',
    estagios: [],
    automacoes: []
  },
  {
    id: 'board_leads_quentes',
    nome: 'Leads Quentes',
    descricao: 'Leads com alta probabilidade de conversão',
    cor: '#EF4444',
    icone: 'fire',
    ordem: 2,
    ativo: true,
    tipo: 'vendas',
    estagios: [],
    automacoes: []
  },
  {
    id: 'board_nutricao',
    nome: 'Nutrição de Leads',
    descricao: 'Processo de nutrição e educação de leads',
    cor: '#10B981',
    icone: 'academic-cap',
    ordem: 3,
    ativo: true,
    tipo: 'vendas',
    estagios: [],
    automacoes: []
  }
];

// Estágios padrão para o board de vendas
export const ESTAGIOS_VENDAS: EstagioBoard[] = [
  {
    id: 'estagio_novo',
    boardId: 'board_vendas',
    nome: 'Novo Lead',
    descricao: 'Leads recém-chegados ao sistema',
    cor: '#6B7280',
    ordem: 1,
    tipo: 'inicial',
    configuracoes: {
      tempoLimite: 2,
      obrigatorioPreenchimento: ['telefone', 'email']
    }
  },
  {
    id: 'estagio_qualificacao',
    boardId: 'board_vendas',
    nome: 'Qualificação',
    descricao: 'Validação de interesse e fit',
    cor: '#F59E0B',
    ordem: 2,
    tipo: 'intermediario',
    configuracoes: {
      tempoLimite: 3,
      obrigatorioPreenchimento: ['orcamento', 'prazoCompra']
    }
  },
  {
    id: 'estagio_apresentacao',
    boardId: 'board_vendas',
    nome: 'Apresentação',
    descricao: 'Apresentação do empreendimento',
    cor: '#3B82F6',
    ordem: 3,
    tipo: 'intermediario',
    configuracoes: {
      tempoLimite: 7,
      obrigatorioPreenchimento: ['empreendimentoInteresse']
    }
  },
  {
    id: 'estagio_proposta',
    boardId: 'board_vendas',
    nome: 'Proposta',
    descricao: 'Proposta comercial enviada',
    cor: '#8B5CF6',
    ordem: 4,
    tipo: 'intermediario',
    configuracoes: {
      tempoLimite: 5,
      obrigatorioPreenchimento: ['valorProposta']
    }
  },
  {
    id: 'estagio_negociacao',
    boardId: 'board_vendas',
    nome: 'Negociação',
    descricao: 'Em processo de negociação',
    cor: '#EF4444',
    ordem: 5,
    tipo: 'intermediario',
    configuracoes: {
      tempoLimite: 7,
      obrigatorioPreenchimento: []
    }
  },
  {
    id: 'estagio_fechado',
    boardId: 'board_vendas',
    nome: 'Fechado',
    descricao: 'Venda realizada com sucesso',
    cor: '#10B981',
    ordem: 6,
    tipo: 'final',
    configuracoes: {
      obrigatorioPreenchimento: ['dataFechamento', 'valorFinal']
    }
  },
  {
    id: 'estagio_perdido',
    boardId: 'board_vendas',
    nome: 'Perdido',
    descricao: 'Lead perdido ou desqualificado',
    cor: '#6B7280',
    ordem: 7,
    tipo: 'perdido',
    configuracoes: {
      obrigatorioPreenchimento: ['motivoPerdido']
    }
  }
];

// Templates de automações
export const TEMPLATES_AUTOMACAO: TemplateAutomacao[] = [
  {
    id: 'template_boas_vindas',
    nome: 'Boas-vindas para Novos Leads',
    categoria: 'followup',
    descricao: 'Mensagem automática de boas-vindas quando lead entra no sistema',
    configuracao: {
      nome: 'Boas-vindas Automático',
      descricao: 'Envio automático de mensagem de boas-vindas',
      ativa: true,
      condicoes: [{
        id: 'cond_1',
        tipo: 'entrada_estagio',
        operador: 'igual',
        valor: 'estagio_novo'
      }],
      acoes: [{
        id: 'acao_1',
        tipo: 'enviar_mensagem',
        parametros: {
          template: 'boas_vindas',
          mensagem: 'Olá {{nome}}, obrigado pelo interesse! Em breve entraremos em contato.'
        },
        ordem: 1,
        aguardarAntes: 0
      }],
      configuracoes: {
        executarApenas: 'uma_vez',
        aguardarTempo: 0
      }
    }
  },
  {
    id: 'template_followup_qualificacao',
    nome: 'Follow-up de Qualificação',
    categoria: 'followup',
    descricao: 'Follow-up automático após 24h em qualificação sem movimento',
    configuracao: {
      nome: 'Follow-up Qualificação',
      descricao: 'Follow-up após 24h parado em qualificação',
      ativa: true,
      condicoes: [{
        id: 'cond_1',
        tipo: 'tempo_sem_atividade',
        operador: 'maior_que',
        valor: 1,
        unidade: 'dias'
      }],
      acoes: [{
        id: 'acao_1',
        tipo: 'agendar_followup',
        parametros: {
          tipo: 'ligacao',
          titulo: 'Follow-up de qualificação',
          prioridade: 'media'
        },
        ordem: 1,
        aguardarAntes: 0
      }],
      configuracoes: {
        executarApenas: 'uma_vez',
        aguardarTempo: 1440 // 24h
      }
    }
  }
];