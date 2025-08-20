// Tipos centralizados do sistema - baseados no frontend

// ===== AUTENTICAÇÃO =====
export type PerfilUsuario = 'corretor' | 'gerente' | 'administrador';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha?: string; // Apenas para criação, não retornado nas consultas
  perfil: PerfilUsuario;
  avatar?: string;
  telefone?: string;
  departamento: string;
  dataAdmissao: Date;
  status: 'ativo' | 'inativo';
  configuracoes: {
    notificacoes: boolean;
    tema: 'claro' | 'escuro' | 'auto';
    idioma: 'pt-BR' | 'en-US';
  };
  
  // Dados específicos do corretor
  corretor?: {
    creci: string;
    equipeId?: string;
    gerenteId?: string;
    metaMensal?: number;
    comissaoBase?: number;
  };
  
  // Dados específicos do gerente
  gerente?: {
    equipesGerenciadas: string[];
    corretoresGerenciados: string[];
    metaEquipe?: number;
  };

  // Metadados
  createdAt: Date;
  updatedAt: Date;
}

// ===== CRM/LEADS =====
export interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  whatsapp?: string;
  origem: string;
  pipeline: string;
  etapa: string;
  responsavelCRM: string; // ID do usuário
  responsavel: string; // Nome do usuário
  dataCreated: Date;
  
  // Investimento pretendido
  investimentoPretendido: {
    valorMinimo: number;
    valorMaximo: number;
  };
  
  // Perfil do imóvel desejado
  perfilImovel: {
    dormitorios?: number;
    suites?: number;
    vagas?: number;
    localizacao?: string;
    localizacaoPreferida?: string;
    proximidadeMar?: number;
    andaresPrefere?: 'baixos' | 'intermediarios' | 'altos' | 'indiferente';
    posicaoSolar?: 'nascente' | 'poente' | 'norte' | 'sul' | 'indiferente';
    finalidadeInvestimento?: 'moradia' | 'investimento' | 'aluguel' | 'revenda';
    tempoMudanca?: 'imediato' | '6_meses' | '1_ano' | 'mais_1_ano';
    observacoes?: string;
  };

  // Metadados
  status: 'ativo' | 'convertido' | 'perdido' | 'inativo';
  tags?: string[];
  observacoes?: string;
  ultimaInteracao?: Date;
  pontuacao?: number;
  createdAt: Date;
  updatedAt: Date;
}

// ===== PESSOAS =====
export type TipoPessoa = 'cliente' | 'lead' | 'fornecedor' | 'colaborador_pf' | 'colaborador_pj';

export interface Endereco {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  cep: string;
  estado: string;
}

export interface Documento {
  id: string;
  tipo: string;
  categoria: 'documentacao_pessoal' | 'contratos' | 'advertencias' | 'atestados_medicos' | 'outros';
  nomeArquivo: string;
  arquivoUrl: string;
  dataUpload: Date;
  tamanho: number;
  mime: string;
  uploadedBy: string;
}

export interface Cliente {
  id: string;
  tipo: 'cliente';
  nome: string;
  cpfCnpj: string;
  telefone: string;
  email: string;
  endereco: Endereco;
  tags: string[];
  observacoes: string;
  documentos: Documento[];
  responsavel: string;
  status: 'ativo' | 'inativo' | 'suspenso';
  
  // Específicos do cliente
  valorTotalInvestido: number;
  valorPatrimonioAtual: number;
  dataUltimaCompra?: Date;
  origemContato: string;
  classificacao: 'bronze' | 'prata' | 'ouro' | 'diamante';
  
  createdAt: Date;
  updatedAt: Date;
}

// ===== EMPREENDIMENTOS =====
export interface Empreendimento {
  id: string;
  nome: string;
  descricao: string;
  endereco: Endereco;
  incorporadora: string;
  construtora: string;
  dataLancamento: Date;
  dataEntrega?: Date;
  status: 'lancamento' | 'construcao' | 'pronto' | 'entregue';
  
  // Condições de pagamento
  condicoesPagamento?: string;
  tabelaPrecos?: {
    arquivoUrl: string;
    processamentoIA?: {
      status: 'pending' | 'processing' | 'completed' | 'error';
      condicoesExtraidas?: string;
      confianca?: number;
      processedAt?: Date;
    };
  };
  
  // Características
  totalUnidades: number;
  unidadesDisponiveis: number;
  unidadesVendidas: number;
  unidadesReservadas: number;
  
  // Valores
  valorMinimo: number;
  valorMaximo: number;
  valorM2: number;
  
  // Metadados
  responsavel: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UnidadeEmpreendimento {
  id: string;
  empreendimentoId: string;
  codigo: string;
  tipo: 'apartamento' | 'casa' | 'sala' | 'loja';
  dormitorios: number;
  suites: number;
  vagas: number;
  area: number;
  andar?: number;
  bloco?: string;
  posicao: string;
  valor: number;
  status: 'disponivel' | 'reservado' | 'vendido' | 'bloqueado';
  isTerceiro: boolean;
  
  // Se for de terceiro
  proprietarioTerceiro?: {
    nome: string;
    telefone: string;
    email: string;
    comissao: number;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

// ===== PROSPECÇÕES =====
export interface ProspeccaoItem {
  id: string;
  plataforma: 'olx' | 'webmotors' | 'mercadolivre' | 'whatsapp' | 'facebook' | 'instagram' | 'linkedin' | 'outros';
  quantidade: number;
  data: Date;
  usuario: string;
  usuarioId: string;
  status: 'ativa' | 'pausada' | 'concluida';
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RespostaProspeccao {
  id: string;
  prospeccaoId?: string;
  plataforma: string;
  mensagemEnviada: string;
  mensagemRecebida: string;
  sentimento: 'positivo' | 'negativo';
  data: Date;
  usuario: string;
  usuarioId: string;
  leadGerado: boolean;
  leadId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ===== WHATSAPP =====
export interface WhatsAppMessage {
  id: string;
  conversationId: string;
  from: string;
  to: string;
  body: string;
  type: 'text' | 'image' | 'document' | 'audio' | 'video';
  timestamp: Date;
  isFromMe: boolean;
  mediaUrl?: string;
  quotedMessageId?: string;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
}

export interface WhatsAppConversation {
  id: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number;
  tags: string[];
  assignedTo?: string;
  status: 'open' | 'closed' | 'pending';
}

// ===== UPLOADS E IA =====
export interface UploadFile {
  id: string;
  originalName: string;
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
  processedAt?: Date;
  
  // Processamento IA
  aiProcessing?: {
    status: 'pending' | 'processing' | 'completed' | 'error';
    result?: any;
    confidence?: number;
    processedAt?: Date;
    errorMessage?: string;
  };
}

// ===== PERMISSÕES =====
export interface PermissoesPerfil {
  pessoas: {
    clientes: 'own' | 'team' | 'all' | 'none';
    leads: 'own' | 'team' | 'all' | 'none';
    fornecedores: 'all' | 'none';
    colaboradores: 'all' | 'none';
  };
  
  modulos: {
    crm: boolean;
    juridico: boolean;
    financeiro: boolean;
    relatorios: boolean;
    configuracoes: boolean;
    empreendimentos: boolean;
  };
  
  acoes: {
    criarContrato: boolean;
    editarContrato: boolean;
    excluirContrato: boolean;
    gerenciarAutomacoes: boolean;
    acessarRelatoriosGerenciais: boolean;
    gerenciarUsuarios: boolean;
    configurarSistema: boolean;
  };
}

// ===== REQUESTS/RESPONSES =====
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  usuario: Omit<Usuario, 'senha'>;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// ===== FILTROS =====
export interface LeadFilters extends PaginationParams {
  pipeline?: string;
  etapa?: string;
  responsavel?: string;
  origem?: string;
  dataInicio?: string;
  dataFim?: string;
  investimentoMin?: number;
  investimentoMax?: number;
}

export interface EmpreendimentoFilters extends PaginationParams {
  status?: string;
  cidade?: string;
  valorMin?: number;
  valorMax?: number;
  incorporadora?: string;
}

export interface ProspeccaoFilters extends PaginationParams {
  plataforma?: string;
  usuario?: string;
  dataInicio?: string;
  dataFim?: string;
  status?: string;
}

// ===== LOGS E AUDITORIA =====
export interface LogEntry {
  id: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  meta?: any;
  userId?: string;
  action?: string;
  resource?: string;
  resourceId?: string;
  ip?: string;
  userAgent?: string;
  timestamp: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
  resource: string;
  resourceId: string;
  oldValues?: any;
  newValues?: any;
  ip: string;
  userAgent: string;
  timestamp: Date;
}