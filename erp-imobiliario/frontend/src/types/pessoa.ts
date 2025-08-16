// Tipos para o módulo de Pessoas seguindo especificações LegaSys ERP

export type TipoPessoa = 'cliente' | 'lead' | 'fornecedor' | 'colaborador_pf' | 'colaborador_pj';
export type StatusPessoa = 'ativo' | 'inativo' | 'suspenso';

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
  tipo: string; // RG, CNH, Contrato, Atestado, Advertência, etc.
  categoria: 'documentacao_pessoal' | 'contratos' | 'advertencias' | 'atestados_medicos' | 'outros';
  nomeArquivo: string;
  arquivoUrl?: string; // Para upload real
  blobUrl?: string; // Para MVP sem backend
  dataUpload: string;
  tamanho?: number;
  mime?: string;
  uploadedBy?: string;
}

export interface UnidadeAdquirida {
  id: string;
  empreendimentoId: string;
  empreendimentoNome: string;
  unidade: string;
  bloco?: string;
  andar?: number;
  valorCompra: number;
  valorAtual: number;
  valorizacao: number; // Percentual de valorização
  status: 'quitado' | 'financiamento' | 'contrato' | 'pendente';
  dataAquisicao: string;
  dataEntrega?: string;
  historicoValores: Array<{
    data: string;
    valor: number;
  }>;
}

// Interface base para todas as pessoas
export interface PessoaBase {
  id: string;
  tipo: TipoPessoa;
  pessoaFisica: boolean;
  
  // Campos comuns obrigatórios
  nome: string; // Nome ou Razão Social
  cpfCnpj: string;
  telefone: string;
  email: string;
  endereco: Endereco;
  tags: string[];
  observacoes: string;
  documentos: Documento[];
  
  // Campos opcionais comuns
  nomeFantasia?: string; // Para PJ
  rgInscricaoEstadual?: string;
  telefoneSecundario?: string;
  emailSecundario?: string;
  
  // Metadados
  dataInclusao: string;
  dataAtualizacao: string;
  status: StatusPessoa;
  responsavel?: string; // Quem cadastrou/é responsável
  
  // Campo para videoconferência
  linkVideoCall?: string; // Link do Google Meet ou Zoom para videoconferências
}

// Clientes - Integração com Empreendimentos e CRM
export interface Cliente extends PessoaBase {
  tipo: 'cliente';
  unidadesAdquiridas: UnidadeAdquirida[];
  valorTotalInvestido: number;
  valorPatrimonioAtual: number;
  dataUltimaCompra?: string;
  origemContato: 'indicacao' | 'site' | 'whatsapp' | 'redes_sociais' | 'evento' | 'outros';
  classificacao: 'bronze' | 'prata' | 'ouro' | 'diamante';
  
  // Dados específicos PF
  pf?: {
    rg?: string;
    dataNascimento?: string;
    estadoCivil?: string;
    profissao?: string;
    rendaMensal?: number;
  };
  
  // Dados específicos PJ
  pj?: {
    inscricaoEstadual?: string;
    inscricaoMunicipal?: string;
    cnae?: string;
    nomeFantasia?: string;
    responsavelLegal?: {
      nome: string;
      cpf: string;
      telefone?: string;
    };
  };
}

// Leads - Sem dados de investimento, conversível para cliente
export interface Lead extends PessoaBase {
  tipo: 'lead';
  origemContato: 'indicacao' | 'site' | 'whatsapp' | 'redes_sociais' | 'evento' | 'outros';
  interesseImovel: string[];
  orcamentoMinimo?: number;
  orcamentoMaximo?: number;
  prazoCompra?: string;
  statusLeadCrm?: string; // Integração com CRM
  ultimaInteracao?: string;
  pontuacao?: number; // Score do lead
  responsavelCRM?: string; // Corretor responsável
}

// Fornecedores - Integração futura com Compras/Financeiro
export interface Fornecedor extends PessoaBase {
  tipo: 'fornecedor';
  produtosServicos: string[];
  categoria: string;
  contratoVigente: boolean;
  dataInicioContrato?: string;
  dataFimContrato?: string;
  avaliacaoQualidade?: number; // 1-5
  tempoMedioPagamento?: number; // Em dias
  condicoesPagamento: string;
  
  // Dados bancários
  dadosBancarios?: {
    banco: string;
    agencia: string;
    conta: string;
    pix?: string;
  };
}

// Colaboradores Pessoa Física
export interface ColaboradorPF extends PessoaBase {
  tipo: 'colaborador_pf';
  pessoaFisica: true;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  dataDemissao?: string;
  salario?: number;
  beneficios: string[];
  advertencias: Documento[];
  atestadosMedicos: Documento[];
  contratoTrabalho?: Documento;
  situacaoTrabalhista: 'ativo' | 'afastado' | 'demitido' | 'aposentado';
  supervisor?: string;
  
  // Documentos específicos CLT
  dadosTrabalho: {
    rg: string;
    ctps?: string;
    pis?: string;
    tituloEleitor?: string;
    certificadoReservista?: string;
  };
}

// Colaboradores Pessoa Jurídica (Prestadores)
export interface ColaboradorPJ extends PessoaBase {
  tipo: 'colaborador_pj';
  pessoaFisica: false;
  servicosPrestados: string[];
  valorContrato?: number;
  dataInicioContrato: string;
  dataFimContrato?: string;
  contratosPrestacao: Documento[];
  avaliacaoServico?: number; // 1-5
  renovacaoAutomatica: boolean;
  
  // Dados específicos PJ
  dadosPJ: {
    inscricaoEstadual: string;
    cnae: string;
    responsavelLegal: {
      nome: string;
      cpf: string;
      telefone?: string;
    };
  };
}

export type Pessoa = Cliente | Lead | Fornecedor | ColaboradorPF | ColaboradorPJ;

// Formulário unificado para criação/edição
export interface FormularioPessoa {
  // Tipo da pessoa
  tipo: TipoPessoa;
  pessoaFisica: boolean;
  
  // Dados básicos
  nome: string;
  nomeFantasia?: string;
  cpfCnpj: string;
  rgInscricaoEstadual?: string;
  telefone: string;
  telefoneSecundario?: string;
  email: string;
  emailSecundario?: string;
  
  // Endereço
  endereco: Endereco;
  
  // Campos gerais
  tags: string[];
  observacoes: string;
  responsavel?: string;
  
  // Campos específicos Lead
  origemContato?: string;
  interesseImovel?: string[];
  orcamentoMinimo?: number;
  orcamentoMaximo?: number;
  prazoCompra?: string;
  
  // Campos específicos Fornecedor
  produtosServicos?: string[];
  categoria?: string;
  condicoesPagamento?: string;
  
  // Campos específicos Colaborador PF
  cargo?: string;
  departamento?: string;
  dataAdmissao?: string;
  salario?: number;
  beneficios?: string[];
  supervisor?: string;
  
  // Campos específicos Colaborador PJ
  servicosPrestados?: string[];
  valorContrato?: number;
  dataInicioContrato?: string;
  dataFimContrato?: string;
  renovacaoAutomatica?: boolean;
}

// Filtros para listagem
export interface FiltrosPessoas {
  tipo?: TipoPessoa[];
  status?: StatusPessoa[];
  tags?: string[];
  cidade?: string[];
  pessoaFisica?: boolean;
  dataInclusaoInicio?: string;
  dataInclusaoFim?: string;
  busca?: string;
}

// Estado do módulo
export interface PessoasState {
  pessoas: Pessoa[];
  pessoaSelecionada: Pessoa | null;
  filtros: FiltrosPessoas;
  loading: boolean;
  error: string | null;
  modalAberto: boolean;
  perfilAberto: boolean;
  modoEdicao: boolean;
  abaAtiva: TipoPessoa | 'todos';
}

// Actions do reducer
export type PessoasAction =
  | { type: 'SET_PESSOAS'; payload: Pessoa[] }
  | { type: 'ADD_PESSOA'; payload: Pessoa }
  | { type: 'UPDATE_PESSOA'; payload: Pessoa }
  | { type: 'DELETE_PESSOA'; payload: string }
  | { type: 'SET_PESSOA_SELECIONADA'; payload: Pessoa | null }
  | { type: 'SET_FILTROS'; payload: FiltrosPessoas }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MODAL_ABERTO'; payload: boolean }
  | { type: 'SET_PERFIL_ABERTO'; payload: boolean }
  | { type: 'SET_MODO_EDICAO'; payload: boolean }
  | { type: 'SET_ABA_ATIVA'; payload: TipoPessoa | 'todos' }
  | { type: 'CONVERTER_LEAD_CLIENTE'; payload: { leadId: string; dadosCliente: Partial<Cliente> } }
  | { type: 'ADD_DOCUMENTO'; payload: { pessoaId: string; documento: Documento } }
  | { type: 'REMOVE_DOCUMENTO'; payload: { pessoaId: string; documentoId: string } };

// Utilitários de validação
export interface ValidationResult {
  isValid: boolean;
  errors: PessoaFormErrors;
}

export interface PessoaFormErrors {
  [key: string]: string | undefined | Partial<Record<keyof Endereco, string>>;
  nome?: string;
  cpfCnpj?: string;
  telefone?: string;
  email?: string;
  endereco?: Partial<Record<keyof Endereco, string>>;
  origemContato?: string;
  produtosServicos?: string;
  categoria?: string;
  cargo?: string;
  departamento?: string;
  dataAdmissao?: string;
  servicosPrestados?: string;
  dataInicioContrato?: string;
}

// Dados mock para desenvolvimento
export interface MockDataConfig {
  generatePessoas: (count: number) => Pessoa[];
  generateUnidadesAdquiridas: (count: number) => UnidadeAdquirida[];
  generateDocumentos: (count: number, categoria: Documento['categoria']) => Documento[];
}