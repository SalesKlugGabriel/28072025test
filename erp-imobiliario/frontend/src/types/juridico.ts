// Tipos para o módulo jurídico com gestão de contratos e disponibilidade

export type StatusContrato = 'rascunho' | 'ativo' | 'suspenso' | 'quitado' | 'distratado' | 'rescindido';
export type TipoContrato = 'venda' | 'reserva' | 'locacao' | 'permuta' | 'administracao';
export type StatusPagamento = 'em_dia' | 'atraso' | 'vencido' | 'quitado';
export type TipoUnidade = 'apartamento' | 'casa' | 'loja' | 'sala' | 'terreno' | 'galpao';

// Interface para dados financeiros do contrato
export interface DadosFinanceiros {
  valorTotal: number;
  valorPago: number;
  saldoDevedor: number;
  valorEntrada: number;
  numeroParcelas: number;
  valorParcela: number;
  dataVencimento: string;
  proximoVencimento: string;
  jurosAtraso: number;
  multaAtraso: number;
  indiceCorrecao: 'IPCA' | 'INCC' | 'IGP-M' | 'CDI' | 'fixo';
  periodicidadeReajuste: 'mensal' | 'trimestral' | 'semestral' | 'anual';
}

// Interface para histórico de pagamentos
export interface PagamentoContrato {
  id: string;
  numeroContrato: string;
  numeroParcela: number;
  valorPrevisto: number;
  valorPago?: number;
  dataVencimento: string;
  dataPagamento?: string;
  diasAtraso: number;
  juros?: number;
  multa?: number;
  desconto?: number;
  status: StatusPagamento;
  observacoes?: string;
}

// Interface para valorização da unidade
export interface HistoricoValorizacao {
  id: string;
  data: string;
  valorAvaliacao: number;
  fonte: 'mercado' | 'perito' | 'corretora' | 'sistema';
  observacoes?: string;
  percentualValorizacao: number;
}

// Interface para dados da unidade
export interface UnidadeContrato {
  id: string;
  codigo: string;
  empreendimentoId: string;
  empreendimentoNome: string;
  bloco?: string;
  andar?: number;
  numero: string;
  tipo: TipoUnidade;
  areaPrivativa: number;
  areaTotal: number;
  vagas: number;
  posicao: 'norte' | 'sul' | 'leste' | 'oeste' | 'nordeste' | 'noroeste' | 'sudeste' | 'sudoeste';
  vista: string[];
  caracteristicas: string[];
  
  // Dados de localização no mapa
  coordenadas?: {
    x: number;
    y: number;
  };
  
  // Histórico de valorização
  historicoValorizacao: HistoricoValorizacao[];
  valorAtual: number;
  percentualValorizacao: number;
}

// Interface para dados do cliente no contrato
export interface ClienteContrato {
  id: string;
  nome: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  pessoaFisica: boolean;
  
  // Dados específicos PF
  pf?: {
    rg: string;
    dataNascimento: string;
    estadoCivil: 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel';
    profissao: string;
    rendaMensal: number;
  };
  
  // Dados específicos PJ
  pj?: {
    nomeFantasia: string;
    inscricaoEstadual: string;
    responsavelLegal: {
      nome: string;
      cpf: string;
      cargo: string;
    };
  };
}

// Interface principal do contrato
export interface ContratoJuridico {
  id: string;
  numero: string;
  tipo: TipoContrato;
  status: StatusContrato;
  
  // Relacionamentos
  cliente: ClienteContrato;
  unidade: UnidadeContrato;
  
  // Dados financeiros
  financeiro: DadosFinanceiros;
  pagamentos: PagamentoContrato[];
  
  // Datas importantes
  datas: {
    assinatura: string;
    inicioVigencia: string;
    fimVigencia?: string;
    entregaChaves?: string;
    ultimoReajuste?: string;
    proximoReajuste?: string;
    dataRevenda?: string;
  };
  
  // Documentos
  documentos: {
    contrato: string;
    escritura?: string;
    documentosCliente: string[];
    documentosImovel: string[];
    aditivos: string[];
  };
  
  // Clausulas e observações
  clausulas: {
    reajuste: string;
    multa: string;
    tolerancia: string;
    entrega: string;
    observacoes?: string;
  };
  
  // Metadados
  versao: number;
  dataInclusao: string;
  dataAtualizacao: string;
  responsavel: string;
  
  // Integração com comercial
  vendedor?: string;
  comissao?: {
    percentual: number;
    valor: number;
    pago: boolean;
    dataPagamento?: string;
  };
}

// Interface para disponibilidade no mapa
export interface DisponibilidadeUnidade {
  unidadeId: string;
  status: 'disponivel' | 'reservado' | 'vendido' | 'entregue' | 'bloqueado';
  contrato?: {
    id: string;
    numero: string;
    cliente: string;
    tipo: TipoContrato;
    statusPagamento: StatusPagamento;
    percentualPago: number;
  };
  preco: number;
  desconto?: number;
  promocao?: {
    titulo: string;
    descricao: string;
    validoAte: string;
  };
}

// Interface para o mapa de disponibilidade
export interface MapaDisponibilidade {
  empreendimentoId: string;
  empreendimentoNome: string;
  totalUnidades: number;
  unidades: Array<UnidadeContrato & DisponibilidadeUnidade>;
  blocos: Array<{
    id: string;
    nome: string;
    andares: number;
    unidadesPorAndar: number;
    coordenadas: { x: number; y: number };
  }>;
  estatisticas: {
    disponiveis: number;
    reservados: number;
    vendidos: number;
    entregues: number;
    bloqueados: number;
    valorTotalVendas: number;
    valorMedioM2: number;
  };
}

// Interface para filtros do módulo jurídico
export interface FiltrosJuridico {
  empreendimento?: string[];
  status?: StatusContrato[];
  tipo?: TipoContrato[];
  statusPagamento?: StatusPagamento[];
  cliente?: string;
  vendedor?: string;
  dataAssinaturaInicio?: string;
  dataAssinaturaFim?: string;
  valorMinimo?: number;
  valorMaximo?: number;
  diasAtraso?: number;
  apenasComAtraso?: boolean;
}

// Interface para relatórios jurídicos
export interface RelatorioJuridico {
  totalContratos: number;
  contratosPorStatus: Record<StatusContrato, number>;
  contratosPorTipo: Record<TipoContrato, number>;
  valorTotalCarteira: number;
  valorRecebido: number;
  valorPendente: number;
  contratosComAtraso: number;
  valorEmAtraso: number;
  mediaValorizacaoUnidades: number;
  unidadesMaisValorizadas: Array<{
    unidade: string;
    empreendimento: string;
    valorizacao: number;
  }>;
}

// Interface para acompanhamento de revenda
export interface AcompanhamentoRevenda {
  contratoId: string;
  dataRevenda?: string;
  valorRevenda?: number;
  compradorNovo?: ClienteContrato;
  status: 'interesse' | 'negociando' | 'documentacao' | 'finalizado' | 'cancelado';
  motivo?: string;
  observacoes?: string;
  documentosTransferencia: string[];
  taxasCartorio: number;
  comissaoRevenda?: {
    percentual: number;
    valor: number;
  };
}

// Interface para histórico de alterações no contrato
export interface HistoricoAlteracao {
  id: string;
  contratoId: string;
  data: string;
  usuario: string;
  tipo: 'criacao' | 'edicao' | 'pagamento' | 'aditivo' | 'rescisao' | 'reativacao';
  descricao: string;
  camposAlterados?: string[];
  valorAnterior?: unknown;
  valorNovo?: unknown;
}

// Estado do módulo jurídico
export interface JuridicoState {
  contratos: ContratoJuridico[];
  contratoSelecionado: ContratoJuridico | null;
  mapaDisponibilidade: MapaDisponibilidade | null;
  filtros: FiltrosJuridico;
  loading: boolean;
  error: string | null;
  
  // Modais e UI
  modalDetalhesAberto: boolean;
  modalMapaAberto: boolean;
  modalPagamentoAberto: boolean;
  empreendimentoSelecionado: string | null;
  
  // Relatórios
  relatorio: RelatorioJuridico | null;
  
  // Cache
  empreendimentos: Array<{ id: string; nome: string }>;
  vendedores: Array<{ id: string; nome: string }>;
}

// Actions do reducer
export type JuridicoAction =
  | { type: 'SET_CONTRATOS'; payload: ContratoJuridico[] }
  | { type: 'ADD_CONTRATO'; payload: ContratoJuridico }
  | { type: 'UPDATE_CONTRATO'; payload: ContratoJuridico }
  | { type: 'DELETE_CONTRATO'; payload: string }
  | { type: 'SET_CONTRATO_SELECIONADO'; payload: ContratoJuridico | null }
  | { type: 'SET_MAPA_DISPONIBILIDADE'; payload: MapaDisponibilidade }
  | { type: 'SET_FILTROS'; payload: FiltrosJuridico }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MODAL_DETALHES'; payload: boolean }
  | { type: 'SET_MODAL_MAPA'; payload: boolean }
  | { type: 'SET_MODAL_PAGAMENTO'; payload: boolean }
  | { type: 'SET_EMPREENDIMENTO_SELECIONADO'; payload: string | null }
  | { type: 'ADD_PAGAMENTO'; payload: { contratoId: string; pagamento: PagamentoContrato } }
  | { type: 'UPDATE_PAGAMENTO'; payload: { contratoId: string; pagamento: PagamentoContrato } }
  | { type: 'SET_RELATORIO'; payload: RelatorioJuridico }
  | { type: 'UPDATE_VALORIZACAO'; payload: { unidadeId: string; valorizacao: HistoricoValorizacao } };

// Utilitários para cálculos
export interface CalculosFinanceiros {
  calcularSaldoDevedor: (contrato: ContratoJuridico) => number;
  calcularPercentualPago: (contrato: ContratoJuridico) => number;
  calcularProximoVencimento: (contrato: ContratoJuridico) => string | null;
  calcularJurosAtraso: (pagamento: PagamentoContrato) => number;
  calcularValorizacao: (unidade: UnidadeContrato) => number;
  projetarFluxoPagamentos: (contrato: ContratoJuridico, meses: number) => PagamentoContrato[];
}

// Mock data para desenvolvimento
export interface MockJuridicoData {
  contratos: ContratoJuridico[];
  empreendimentos: Array<{ id: string; nome: string; unidades: UnidadeContrato[] }>;
  pagamentos: PagamentoContrato[];
}