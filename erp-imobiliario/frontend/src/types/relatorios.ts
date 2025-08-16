// Tipos para o módulo de relatórios

export interface PeriodoAnalise {
  dataInicio: string;
  dataFim: string;
}

export interface FiltrosRelatorio extends PeriodoAnalise {
  corretor?: string[];
  empreendimento?: string[];
  fonte?: string[];
  status?: string[];
}

// Relatório de Movimentações do CRM
export interface MovimentacaoCRM {
  id: string;
  data: string;
  tipo: 'entrada' | 'mudanca_estagio' | 'follow_up' | 'ligacao' | 'email' | 'reuniao';
  leadId: string;
  leadNome: string;
  corretor: string;
  estagioOrigem?: string;
  estagioDestino?: string;
  observacoes?: string;
  fonte?: string;
}

export interface RelatorioMovimentacoesCRM {
  periodo: PeriodoAnalise;
  totalMovimentacoes: number;
  movimentacoesPorTipo: Record<string, number>;
  movimentacoesPorCorretor: Record<string, number>;
  movimentacoesPorDia: Array<{
    data: string;
    total: number;
    tipos: Record<string, number>;
  }>;
  detalhes: MovimentacaoCRM[];
}

// Relatório de Contratos Assinados
export interface ContratoAssinado {
  id: string;
  numero: string;
  dataAssinatura: string;
  cliente: string;
  corretor: string;
  empreendimento: string;
  unidade: string;
  valor: number;
  comissao: number;
  fonte: string;
  tempoConversao: number; // dias desde primeiro contato
}

export interface RelatorioContratosAssinados {
  periodo: PeriodoAnalise;
  totalContratos: number;
  valorTotalVendas: number;
  valorMedioContrato: number;
  totalComissoes: number;
  contratosPorCorretor: Record<string, {
    quantidade: number;
    valor: number;
    comissao: number;
  }>;
  contratosPorEmpreendimento: Record<string, {
    quantidade: number;
    valor: number;
  }>;
  contratosPorMes: Array<{
    mes: string;
    quantidade: number;
    valor: number;
  }>;
  detalhes: ContratoAssinado[];
}

// Relatório de Ligações
export interface LigacaoEfetuada {
  id: string;
  data: string;
  hora: string;
  leadId: string;
  leadNome: string;
  corretor: string;
  duracao: number; // em segundos
  resultado: 'atendeu' | 'nao_atendeu' | 'ocupado' | 'caixa_postal' | 'numero_inexistente';
  observacoes?: string;
  proximoFollowUp?: string;
}

export interface RelatorioLigacoes {
  periodo: PeriodoAnalise;
  totalLigacoes: number;
  totalMinutos: number;
  mediaMinutosPorLigacao: number;
  ligacoesPorResultado: Record<string, number>;
  ligacoesPorCorretor: Record<string, {
    quantidade: number;
    minutos: number;
    taxaAtendimento: number;
  }>;
  ligacoesPorDia: Array<{
    data: string;
    quantidade: number;
    minutos: number;
  }>;
  detalhes: LigacaoEfetuada[];
}

// Relatório de Prospecções
export interface ProspeccaoRealizada {
  id: string;
  data: string;
  tipo: 'ligacao_fria' | 'email_marketing' | 'whatsapp' | 'redes_sociais' | 'evento' | 'indicacao';
  corretor: string;
  quantidadeContatos: number;
  leadsGerados: number;
  investimento?: number;
  canal: string;
  campanha?: string;
}

export interface RelatorioProspeccoes {
  periodo: PeriodoAnalise;
  totalProspeccoes: number;
  totalContatos: number;
  totalLeadsGerados: number;
  totalInvestimento: number;
  taxaConversaoGeral: number;
  custoPorLead: number;
  prospeccoesPorTipo: Record<string, {
    quantidade: number;
    contatos: number;
    leads: number;
    investimento: number;
    taxaConversao: number;
  }>;
  prospeccoesPorCorretor: Record<string, {
    quantidade: number;
    contatos: number;
    leads: number;
    taxaConversao: number;
  }>;
  detalhes: ProspeccaoRealizada[];
}

// Relatório de Novos Leads
export interface NovoLead {
  id: string;
  nome: string;
  dataEntrada: string;
  fonte: string;
  corretor: string;
  empreendimentoInteresse?: string;
  orcamento?: number;
  status: string;
  origem: 'prospeccao' | 'organico' | 'indicacao' | 'evento';
}

export interface RelatorioNovosLeads {
  periodo: PeriodoAnalise;
  totalNovosLeads: number;
  leadsPorFonte: Record<string, number>;
  leadsPorCorretor: Record<string, number>;
  leadsPorOrigem: Record<string, number>;
  leadsPorDia: Array<{
    data: string;
    quantidade: number;
    fontes: Record<string, number>;
  }>;
  crescimentoPercentual: number;
  detalhes: NovoLead[];
}

// Relatório de Taxa de Conversão
export interface DadosConversao {
  corretor: string;
  totalLeads: number;
  leadsQualificados: number;
  reunioesAgendadas: number;
  reunioesRealizadas: number;
  propostas: number;
  negociacoes: number;
  contratos: number;
  
  // Taxas de conversão
  taxaQualificacao: number; // leads → qualificados
  taxaAgendamento: number; // qualificados → reuniões
  taxaRealizacao: number; // agendadas → realizadas
  taxaProposta: number; // realizadas → propostas
  taxaNegociacao: number; // propostas → negociação
  taxaFechamento: number; // negociação → contrato
  taxaGeralConversao: number; // leads → contratos
  
  tempoMedioConversao: number; // dias
}

export interface RelatorioTaxaConversao {
  periodo: PeriodoAnalise;
  conversaoGeral: {
    totalLeads: number;
    totalContratos: number;
    taxaConversao: number;
    tempoMedioConversao: number;
  };
  conversaoPorCorretor: Record<string, DadosConversao>;
  conversaoPorEstagio: Array<{
    estagio: string;
    entrada: number;
    saida: number;
    taxa: number;
    tempoMedio: number;
  }>;
  funil: Array<{
    estagio: string;
    quantidade: number;
    percentual: number;
  }>;
}

// VGV (Valor Geral de Vendas)
export interface DadosVGV {
  periodo: PeriodoAnalise;
  vgvTotal: number;
  vgvPorEmpreendimento: Record<string, {
    valor: number;
    unidades: number;
    percentual: number;
  }>;
  vgvPorCorretor: Record<string, {
    valor: number;
    contratos: number;
    meta: number;
    percentualMeta: number;
  }>;
  vgvPorMes: Array<{
    mes: string;
    valor: number;
    contratos: number;
    meta: number;
  }>;
  comparativoAnterior: {
    periodoAnterior: PeriodoAnalise;
    vgvAnterior: number;
    crescimento: number;
    crescimentoPercentual: number;
  };
}

// Relatório de Comissões
export interface DadosComissao {
  id: string;
  contratoId: string;
  corretor: string;
  cliente: string;
  empreendimento: string;
  valorContrato: number;
  percentualComissao: number;
  valorComissao: number;
  dataVenda: string;
  dataPagamento?: string;
  status: 'pendente' | 'pago' | 'cancelado';
  observacoes?: string;
}

export interface RelatorioComissoes {
  periodo: PeriodoAnalise;
  totalComissoes: number;
  comissoesPagas: number;
  comissoesPendentes: number;
  comissoesCanceladas: number;
  comissoesPorCorretor: Record<string, {
    total: number;
    pago: number;
    pendente: number;
    contratos: number;
  }>;
  comissoesPorMes: Array<{
    mes: string;
    total: number;
    pago: number;
    pendente: number;
  }>;
  detalhes: DadosComissao[];
}

// Projeção de Vendas
export interface ProjecaoVenda {
  corretor: string;
  leadsPipeline: number;
  reunioesAgendadas: number;
  propostas: number;
  negociacoes: number;
  valorPotencial: number;
  probabilidadeMedia: number;
  valorProjetado: number;
  previsaoFechamento: string;
}

export interface RelatorioProjecaoVendas {
  periodo: PeriodoAnalise;
  projecaoTotal: {
    valorPotencial: number;
    valorProjetado: number;
    contratosPotenciais: number;
    contratosProjetados: number;
  };
  projecaoPorCorretor: Record<string, ProjecaoVenda>;
  projecaoPorMes: Array<{
    mes: string;
    valorProjetado: number;
    contratos: number;
    probabilidade: number;
  }>;
  cenarios: {
    otimista: number;
    realista: number;
    pessimista: number;
  };
}

// União de todos os tipos de relatório
export type TipoRelatorio = 
  | 'movimentacoes_crm'
  | 'contratos_assinados'
  | 'ligacoes'
  | 'prospeccoes'
  | 'novos_leads'
  | 'taxa_conversao'
  | 'vgv'
  | 'comissoes'
  | 'projecao_vendas';

export type DadosRelatorio = 
  | RelatorioMovimentacoesCRM
  | RelatorioContratosAssinados
  | RelatorioLigacoes
  | RelatorioProspeccoes
  | RelatorioNovosLeads
  | RelatorioTaxaConversao
  | DadosVGV
  | RelatorioComissoes
  | RelatorioProjecaoVendas;

// Configuração dos relatórios
export interface ConfiguracaoRelatorio {
  id: TipoRelatorio;
  titulo: string;
  descricao: string;
  icone: string;
  categoria: 'crm' | 'vendas' | 'financeiro' | 'operacional';
  permissoes: Array<'corretor' | 'gerente' | 'administrador'>;
  formatosExportacao: Array<'pdf' | 'excel' | 'csv'>;
  atualizacaoAutomatica: boolean;
}

export const CONFIGURACOES_RELATORIOS: Record<TipoRelatorio, ConfiguracaoRelatorio> = {
  movimentacoes_crm: {
    id: 'movimentacoes_crm',
    titulo: 'Movimentações do CRM',
    descricao: 'Atividades e mudanças de estágio dos leads',
    icone: 'activity',
    categoria: 'crm',
    permissoes: ['corretor', 'gerente', 'administrador'],
    formatosExportacao: ['pdf', 'excel', 'csv'],
    atualizacaoAutomatica: true
  },
  contratos_assinados: {
    id: 'contratos_assinados',
    titulo: 'Contratos Assinados',
    descricao: 'Vendas efetivadas no período',
    icone: 'file-check',
    categoria: 'vendas',
    permissoes: ['corretor', 'gerente', 'administrador'],
    formatosExportacao: ['pdf', 'excel', 'csv'],
    atualizacaoAutomatica: true
  },
  ligacoes: {
    id: 'ligacoes',
    titulo: 'Ligações Efetuadas',
    descricao: 'Histórico de ligações e taxa de atendimento',
    icone: 'phone',
    categoria: 'operacional',
    permissoes: ['corretor', 'gerente', 'administrador'],
    formatosExportacao: ['pdf', 'excel', 'csv'],
    atualizacaoAutomatica: true
  },
  prospeccoes: {
    id: 'prospeccoes',
    titulo: 'Prospecções',
    descricao: 'Atividades de geração de leads',
    icone: 'search',
    categoria: 'crm',
    permissoes: ['corretor', 'gerente', 'administrador'],
    formatosExportacao: ['pdf', 'excel', 'csv'],
    atualizacaoAutomatica: true
  },
  novos_leads: {
    id: 'novos_leads',
    titulo: 'Novos Leads',
    descricao: 'Leads captados por fonte e período',
    icone: 'user-plus',
    categoria: 'crm',
    permissoes: ['corretor', 'gerente', 'administrador'],
    formatosExportacao: ['pdf', 'excel', 'csv'],
    atualizacaoAutomatica: true
  },
  taxa_conversao: {
    id: 'taxa_conversao',
    titulo: 'Taxa de Conversão',
    descricao: 'Funil de vendas e eficiência de conversão',
    icone: 'trending-up',
    categoria: 'vendas',
    permissoes: ['gerente', 'administrador'],
    formatosExportacao: ['pdf', 'excel'],
    atualizacaoAutomatica: true
  },
  vgv: {
    id: 'vgv',
    titulo: 'VGV (Valor Geral de Vendas)',
    descricao: 'Valor total das vendas por período',
    icone: 'dollar-sign',
    categoria: 'financeiro',
    permissoes: ['gerente', 'administrador'],
    formatosExportacao: ['pdf', 'excel'],
    atualizacaoAutomatica: true
  },
  comissoes: {
    id: 'comissoes',
    titulo: 'Comissões',
    descricao: 'Comissões pagas e pendentes por corretor',
    icone: 'percent',
    categoria: 'financeiro',
    permissoes: ['corretor', 'gerente', 'administrador'],
    formatosExportacao: ['pdf', 'excel', 'csv'],
    atualizacaoAutomatica: true
  },
  projecao_vendas: {
    id: 'projecao_vendas',
    titulo: 'Projeção de Vendas',
    descricao: 'Previsão de vendas baseada no pipeline',
    icone: 'bar-chart',
    categoria: 'vendas',
    permissoes: ['gerente', 'administrador'],
    formatosExportacao: ['pdf', 'excel'],
    atualizacaoAutomatica: false
  }
};