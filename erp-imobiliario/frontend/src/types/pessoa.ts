
export type TipoPessoa = 'cliente' | 'lead' | 'fornecedor' | 'colaborador'
export type StatusPessoa = 'ativo' | 'inativo' | 'suspenso'

export interface Endereco {
  cep: string; logradouro: string; numero: string; bairro: string; cidade: string; estado: string;
}

export interface Documento {
  id: string
  tipo: string                 // ex: RG, CNH, Contrato, Atestado
  categoria: string            // Pessoal, Contrato, Advertência, Atestado, Fiscal
  nomeArquivo: string
  sizeBytes?: number
  mime?: string
  uploadedAt: string
  // Para o MVP, guardamos apenas metadados + blobURL (sem backend):
  blobUrl?: string
}

export interface ClientePF {
  rg?: string
  dataNascimento?: string
  sexo?: 'masculino'|'feminino'|'outro'
  estadoCivil?: string
  profissao?: string
  rendaMensal?: number
  nomeMae?: string
  bancario?: { banco?: string; agencia?: string; conta?: string }
}
export interface ClientePJ {
  inscricaoEstadual?: string
  inscricaoMunicipal?: string
  cnae?: string
  naturezaJuridica?: string
  nomeFantasia?: string
  responsavelLegal?: { nome?: string; cpf?: string }
  contatoFinanceiro?: { nome?: string; telefone?: string; email?: string }
  bancario?: { banco?: string; agencia?: string; conta?: string }
}

export interface UnidadeAdquirida {
  id: string
  empreendimento: string
  unidade: string
  valorCompra: number
  valorAtual?: number
  status: 'quitado' | 'financiamento' | 'contrato' | 'pendente'
  dataAquisicao: string
}

export interface PessoaBase {
  id: string
  tipo: TipoPessoa
  pessoaFisica: boolean
  nome: string
  cpfCnpj: string
  telefone?: string
  whatsapp?: string
  email?: string
  endereco?: Endereco
  tags?: string[]
  observacoes?: string
  documentos?: Documento[]
  dataInclusao: string
  dataAtualizacao: string
  status: StatusPessoa
  // Extras técnicos
  flags?: {
    enviadoFinanceiro?: boolean
    sincronizadoContabil?: boolean
    integracaoFiscal?: boolean
  }
  // Log simples
  _log?: Array<{ at: string; action: string; by?: string }>
}

export interface PessoaCliente extends PessoaBase {
  tipo: 'cliente'
  pf?: ClientePF
  pj?: ClientePJ
  unidadesAdquiridas?: UnidadeAdquirida[]
}

export interface PessoaLead extends PessoaBase {
  tipo: 'lead'
  origem?: string           // site, indicação, etc.
  etapa?: 'lead-frio'|'qualificado'|'negociacao'|'cliente'
  ticketMedio?: number
  prazoCompra?: string      // ex: 30 dias, 60 dias
  canalPreferencial?: string
  docsRecebidos?: boolean
  interesses?: string[]     // ex: apartamento 2D, bairro X
  responsavel?: string      // corretor
}

export interface PessoaFornecedor extends PessoaBase {
  tipo: 'fornecedor'
  nomeFantasia?: string
  tipoFornecimento?: 'produto'|'servico'|'ambos'
  categoria?: string        // logística, TI, matéria-prima
  termosContrato?: { possui: boolean; vigente?: boolean }
  dadosBancarios?: { banco?: string; agencia?: string; conta?: string }
  condicaoPagamento?: string
  valorMinimoPedido?: number
  certificadoRegularidade?: boolean
}

export interface PessoaColaborador extends PessoaBase {
  tipo: 'colaborador'
  subTipo: 'clt'|'prestador-pj'|'autonomo-pf'
  cargo?: string
  setor?: string
  responsavelDireto?: string
  dataInicio?: string
  cargaHorariaSemanal?: number
  localAtuacao?: 'remoto'|'hibrido'|'sede'|'obra'
  // CLT
  clt?: { rg?: string; ctps?: string; pis?: string; tituloEleitor?: string; reservista?: string; beneficios?: string[] }
  // Prestador PJ
  prestadorPJ?: { contratoUpload?: string; atividades?: string; periodicidadePgto?: string; responsavelFinanceiro?: string; certidoesNegativas?: string[]; rpaOuNF?: 'RPA'|'NF' }
}

export type Pessoa = PessoaCliente | PessoaLead | PessoaFornecedor | PessoaColaborador