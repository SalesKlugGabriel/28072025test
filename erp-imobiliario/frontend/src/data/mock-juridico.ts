// Mock data para o módulo jurídico
import { 
  ContratoJuridico, 
  MapaDisponibilidade, 
  UnidadeContrato, 
  DisponibilidadeUnidade,
  PagamentoContrato,
  HistoricoValorizacao
} from '../types/juridico';

// Dados mock de clientes
const mockClientes = [
  {
    id: '1',
    nome: 'João Silva Santos',
    cpfCnpj: '123.456.789-00',
    email: 'joao.silva@email.com',
    telefone: '(11) 99999-9999',
    endereco: 'Rua das Flores, 123 - Jardim Primavera - São Paulo/SP',
    pessoaFisica: true,
    pf: {
      rg: '12.345.678-9',
      dataNascimento: '1985-03-15',
      estadoCivil: 'casado' as const,
      profissao: 'Engenheiro Civil',
      rendaMensal: 15000
    }
  },
  {
    id: '2',
    nome: 'Maria Oliveira Costa',
    cpfCnpj: '987.654.321-00',
    email: 'maria.costa@email.com',
    telefone: '(11) 98888-8888',
    endereco: 'Av. Paulista, 456 - Bela Vista - São Paulo/SP',
    pessoaFisica: true,
    pf: {
      rg: '98.765.432-1',
      dataNascimento: '1992-07-22',
      estadoCivil: 'solteiro' as const,
      profissao: 'Médica',
      rendaMensal: 20000
    }
  },
  {
    id: '3',
    nome: 'Construtora ABC Ltda',
    cpfCnpj: '12.345.678/0001-90',
    email: 'contato@construtorabc.com.br',
    telefone: '(11) 3333-3333',
    endereco: 'Rua Industrial, 789 - Vila Madalena - São Paulo/SP',
    pessoaFisica: false,
    pj: {
      nomeFantasia: 'ABC Construções',
      inscricaoEstadual: '123.456.789.123',
      responsavelLegal: {
        nome: 'Carlos Alberto Silva',
        cpf: '111.222.333-44',
        cargo: 'Diretor Geral'
      }
    }
  },
  {
    id: '4',
    nome: 'Ana Paula Ferreira',
    cpfCnpj: '456.789.123-00',
    email: 'ana.ferreira@email.com',
    telefone: '(11) 97777-7777',
    endereco: 'Rua dos Pinheiros, 321 - Pinheiros - São Paulo/SP',
    pessoaFisica: true,
    pf: {
      rg: '45.678.912-3',
      dataNascimento: '1988-11-10',
      estadoCivil: 'divorciado' as const,
      profissao: 'Arquiteta',
      rendaMensal: 18000
    }
  }
];

// Função para gerar histórico de valorização
const gerarHistoricoValorizacao = (valorInicial: number): HistoricoValorizacao[] => {
  const historico: HistoricoValorizacao[] = [];
  let valorAtual = valorInicial;
  const dataInicio = new Date('2023-01-01');
  
  for (let i = 0; i < 12; i++) {
    const data = new Date(dataInicio);
    data.setMonth(data.getMonth() + i);
    
    // Simula variação de -2% a +5% por mês
    const variacao = (Math.random() - 0.3) * 0.07;
    valorAtual = valorAtual * (1 + variacao);
    
    const percentualValorizacao = ((valorAtual - valorInicial) / valorInicial) * 100;
    
    historico.push({
      id: `hist_${i}`,
      data: data.toISOString().split('T')[0],
      valorAvaliacao: valorAtual,
      fonte: i % 4 === 0 ? 'perito' : i % 3 === 0 ? 'mercado' : 'sistema',
      percentualValorizacao,
      observacoes: i % 6 === 0 ? 'Avaliação para refinanciamento' : undefined
    });
  }
  
  return historico;
};

// Função para gerar pagamentos
const gerarPagamentos = (contratoId: string, valorTotal: number, numeroParcelas: number, valorParcela: number): PagamentoContrato[] => {
  const pagamentos: PagamentoContrato[] = [];
  const dataInicio = new Date('2024-01-15');
  
  for (let i = 1; i <= numeroParcelas; i++) {
    const dataVencimento = new Date(dataInicio);
    dataVencimento.setMonth(dataInicio.getMonth() + i - 1);
    
    const hoje = new Date();
    const diasAtraso = Math.max(0, Math.floor((hoje.getTime() - dataVencimento.getTime()) / (1000 * 60 * 60 * 24)));
    
    let status: 'em_dia' | 'atraso' | 'vencido' | 'quitado' = 'em_dia';
    let valorPago: number | undefined;
    let dataPagamento: string | undefined;
    let juros = 0;
    let multa = 0;
    
    // Simula pagamentos realizados para parcelas passadas
    if (dataVencimento < hoje) {
      const probabilidadePagamento = Math.random();
      if (probabilidadePagamento > 0.1) { // 90% chance de ter sido pago
        status = 'quitado';
        valorPago = valorParcela;
        const pagamentoDias = Math.floor(Math.random() * (diasAtraso + 5));
        const dataPag = new Date(dataVencimento);
        dataPag.setDate(dataPag.getDate() + pagamentoDias);
        dataPagamento = dataPag.toISOString().split('T')[0];
        
        if (pagamentoDias > 0) {
          juros = valorParcela * 0.01; // 1% de juros
          multa = valorParcela * 0.02; // 2% de multa
        }
      } else {
        status = diasAtraso > 30 ? 'vencido' : 'atraso';
        juros = valorParcela * (diasAtraso * 0.001); // 0.1% ao dia
        multa = valorParcela * 0.02;
      }
    }
    
    pagamentos.push({
      id: `pag_${contratoId}_${i}`,
      numeroContrato: contratoId,
      numeroParcela: i,
      valorPrevisto: valorParcela,
      valorPago,
      dataVencimento: dataVencimento.toISOString().split('T')[0],
      dataPagamento,
      diasAtraso,
      juros,
      multa,
      status,
      observacoes: status === 'atraso' ? 'Parcela em atraso - entrar em contato com cliente' : undefined
    });
  }
  
  return pagamentos;
};

// Mock de unidades
const mockUnidades: (UnidadeContrato & DisponibilidadeUnidade)[] = [
  // Residencial Jardim das Flores - Bloco A
  ...Array.from({ length: 20 }, (_, i) => {
    const numero = `10${(i + 1).toString().padStart(1, '0')}`;
    const valorBase = 450000 + (Math.random() * 100000);
    const status = ['disponivel', 'vendido', 'reservado', 'entregue'][Math.floor(Math.random() * 4)] as 'disponivel' | 'vendido' | 'reservado' | 'entregue';
    
    return {
      id: `unidade_a_${i + 1}`,
      unidadeId: `unidade_a_${i + 1}`,
      codigo: `AP-${numero}-A`,
      empreendimentoId: 'emp_1',
      empreendimentoNome: 'Residencial Jardim das Flores',
      bloco: 'A',
      andar: Math.floor(i / 4) + 1,
      numero,
      tipo: 'apartamento' as const,
      areaPrivativa: 65 + Math.floor(Math.random() * 25),
      areaTotal: 85 + Math.floor(Math.random() * 35),
      vagas: Math.floor(Math.random() * 2) + 1,
      posicao: ['norte', 'sul', 'leste', 'oeste'][Math.floor(Math.random() * 4)] as 'norte' | 'sul' | 'leste' | 'oeste',
      vista: ['cidade', 'parque', 'piscina'].slice(0, Math.floor(Math.random() * 3) + 1),
      caracteristicas: ['2 quartos', '1 suíte', 'varanda', 'área de serviço'],
      coordenadas: { x: (i % 4) * 100 + 50, y: Math.floor(i / 4) * 100 + 50 },
      historicoValorizacao: status === 'vendido' ? gerarHistoricoValorizacao(valorBase) : [],
      valorAtual: valorBase * (1 + (Math.random() - 0.3) * 0.15),
      percentualValorizacao: (Math.random() - 0.3) * 15,
      
      // Dados de disponibilidade
      status,
      preco: valorBase,
      desconto: Math.random() > 0.7 ? Math.random() * 20000 : 0,
      contrato: status === 'vendido' ? {
        id: `contrato_${i + 1}`,
        numero: `CT-2024-${(i + 1).toString().padStart(3, '0')}`,
        cliente: mockClientes[i % mockClientes.length].nome,
        tipo: 'venda' as const,
        statusPagamento: ['em_dia', 'atraso', 'quitado'][Math.floor(Math.random() * 3)] as 'em_dia' | 'atraso' | 'quitado',
        percentualPago: Math.floor(Math.random() * 80) + 20
      } : undefined
    };
  }),
  
  // Edifício Harmony - Bloco B
  ...Array.from({ length: 30 }, (_, i) => {
    const numero = `20${(i + 1).toString().padStart(2, '0')}`;
    const valorBase = 380000 + (Math.random() * 80000);
    const status = ['disponivel', 'vendido', 'reservado', 'entregue', 'bloqueado'][Math.floor(Math.random() * 5)] as 'disponivel' | 'vendido' | 'reservado' | 'entregue' | 'bloqueado';
    
    return {
      id: `unidade_b_${i + 1}`,
      unidadeId: `unidade_b_${i + 1}`,
      codigo: `AP-${numero}-B`,
      empreendimentoId: 'emp_2',
      empreendimentoNome: 'Edifício Harmony',
      bloco: 'B',
      andar: Math.floor(i / 6) + 1,
      numero,
      tipo: 'apartamento' as const,
      areaPrivativa: 55 + Math.floor(Math.random() * 20),
      areaTotal: 75 + Math.floor(Math.random() * 25),
      vagas: Math.floor(Math.random() * 3) + 1,
      posicao: ['nordeste', 'noroeste', 'sudeste', 'sudoeste'][Math.floor(Math.random() * 4)] as 'nordeste' | 'noroeste' | 'sudeste' | 'sudoeste',
      vista: ['mar', 'montanha', 'cidade'].slice(0, Math.floor(Math.random() * 2) + 1),
      caracteristicas: ['1 quarto', 'varanda gourmet', 'lavabo'],
      coordenadas: { x: (i % 6) * 80 + 40, y: Math.floor(i / 6) * 90 + 45 },
      historicoValorizacao: status === 'vendido' ? gerarHistoricoValorizacao(valorBase) : [],
      valorAtual: valorBase * (1 + (Math.random() - 0.2) * 0.12),
      percentualValorizacao: (Math.random() - 0.2) * 12,
      
      status,
      preco: valorBase,
      desconto: Math.random() > 0.8 ? Math.random() * 15000 : 0,
      promocao: Math.random() > 0.9 ? {
        titulo: 'Black Friday Imobiliária',
        descricao: 'Desconto especial para pagamento à vista',
        validoAte: '2024-12-31'
      } : undefined,
      contrato: status === 'vendido' ? {
        id: `contrato_b_${i + 1}`,
        numero: `CT-2024-${(i + 100).toString().padStart(3, '0')}`,
        cliente: mockClientes[i % mockClientes.length].nome,
        tipo: 'venda' as const,
        statusPagamento: ['em_dia', 'atraso', 'quitado'][Math.floor(Math.random() * 3)] as 'em_dia' | 'atraso' | 'quitado',
        percentualPago: Math.floor(Math.random() * 70) + 30
      } : undefined
    };
  })
];

// Mock de contratos
export const mockContratos: ContratoJuridico[] = [
  {
    id: 'contrato_1',
    numero: 'CT-2024-001',
    tipo: 'venda',
    status: 'ativo',
    cliente: mockClientes[0],
    unidade: mockUnidades.find(u => u.id === 'unidade_a_1')!,
    financeiro: {
      valorTotal: 450000,
      valorPago: 180000,
      saldoDevedor: 270000,
      valorEntrada: 90000,
      numeroParcelas: 60,
      valorParcela: 6000,
      dataVencimento: '2024-12-15',
      proximoVencimento: '2024-08-15',
      jurosAtraso: 0.01,
      multaAtraso: 0.02,
      indiceCorrecao: 'IPCA',
      periodicidadeReajuste: 'anual'
    },
    pagamentos: gerarPagamentos('CT-2024-001', 450000, 60, 6000),
    datas: {
      assinatura: '2024-01-15',
      inicioVigencia: '2024-01-15',
      fimVigencia: '2029-01-15',
      entregaChaves: '2025-12-15',
      proximoReajuste: '2025-01-15'
    },
    documentos: {
      contrato: 'CT-2024-001_assinado.pdf',
      escritura: 'escritura_unidade_a_101.pdf',
      documentosCliente: ['cpf_joao.pdf', 'rg_joao.pdf', 'comp_residencia_joao.pdf'],
      documentosImovel: ['memorial_descritivo.pdf', 'planta_unidade.pdf'],
      aditivos: []
    },
    clausulas: {
      reajuste: 'IPCA acumulado nos últimos 12 meses, aplicado anualmente na data de aniversário do contrato',
      multa: 'Multa de 2% sobre o valor da parcela em atraso, após 30 dias do vencimento',
      tolerancia: 'Tolerância de 15 dias para pagamento sem incidência de juros',
      entrega: 'Prazo de entrega: dezembro/2025, com tolerância de 180 dias conforme lei',
      observacoes: 'Unidade com vista para o parque. Cliente optou por acabamento premium.'
    },
    versao: 2,
    dataInclusao: '2024-01-10',
    dataAtualizacao: '2024-07-20',
    responsavel: 'Maria Santos - Depto Jurídico',
    vendedor: 'Carlos Vendas',
    comissao: {
      percentual: 3,
      valor: 13500,
      pago: true,
      dataPagamento: '2024-02-15'
    }
  },
  {
    id: 'contrato_2',
    numero: 'TR-2024-005',
    tipo: 'reserva',
    status: 'ativo',
    cliente: mockClientes[1],
    unidade: mockUnidades.find(u => u.id === 'unidade_b_5')!,
    financeiro: {
      valorTotal: 380000,
      valorPago: 38000,
      saldoDevedor: 342000,
      valorEntrada: 76000,
      numeroParcelas: 48,
      valorParcela: 6333.33,
      dataVencimento: '2024-08-20',
      proximoVencimento: '2024-08-20',
      jurosAtraso: 0.015,
      multaAtraso: 0.02,
      indiceCorrecao: 'INCC',
      periodicidadeReajuste: 'anual'
    },
    pagamentos: gerarPagamentos('TR-2024-005', 380000, 48, 6333.33).slice(0, 6), // Apenas algumas parcelas para reserva
    datas: {
      assinatura: '2024-07-20',
      inicioVigencia: '2024-07-20',
      fimVigencia: '2024-08-20', // Reserva por 30 dias
      proximoReajuste: '2025-07-20'
    },
    documentos: {
      contrato: 'TR-2024-005_termo_reserva.pdf',
      documentosCliente: ['cpf_maria.pdf', 'comp_renda_maria.pdf'],
      documentosImovel: ['planta_unidade_b205.pdf'],
      aditivos: []
    },
    clausulas: {
      reajuste: 'Não se aplica para termo de reserva',
      multa: 'Em caso de desistência, perda de 50% do valor pago',
      tolerancia: 'Não há tolerância para termo de reserva',
      entrega: 'Conversão em contrato definitivo em até 30 dias',
      observacoes: 'Reserva válida por 30 dias. Cliente demonstrou interesse em financiamento bancário.'
    },
    versao: 1,
    dataInclusao: '2024-07-20',
    dataAtualizacao: '2024-07-20',
    responsavel: 'Ana Jurídico',
    vendedor: 'Pedro Corretor',
    comissao: {
      percentual: 2.5,
      valor: 9500,
      pago: false
    }
  },
  {
    id: 'contrato_3',
    numero: 'CT-2024-003',
    tipo: 'venda',
    status: 'quitado',
    cliente: mockClientes[3],
    unidade: mockUnidades.find(u => u.id === 'unidade_a_10')!,
    financeiro: {
      valorTotal: 520000,
      valorPago: 520000,
      saldoDevedor: 0,
      valorEntrada: 520000, // Pagamento à vista
      numeroParcelas: 1,
      valorParcela: 520000,
      dataVencimento: '2024-06-15',
      proximoVencimento: '2024-06-15',
      jurosAtraso: 0,
      multaAtraso: 0,
      indiceCorrecao: 'fixo',
      periodicidadeReajuste: 'anual'
    },
    pagamentos: [{
      id: 'pag_ct3_1',
      numeroContrato: 'CT-2024-003',
      numeroParcela: 1,
      valorPrevisto: 520000,
      valorPago: 520000,
      dataVencimento: '2024-06-15',
      dataPagamento: '2024-06-10',
      diasAtraso: 0,
      status: 'quitado',
      observacoes: 'Pagamento à vista com desconto de 5%'
    }],
    datas: {
      assinatura: '2024-06-01',
      inicioVigencia: '2024-06-01',
      entregaChaves: '2024-06-15'
    },
    documentos: {
      contrato: 'CT-2024-003_quitado.pdf',
      escritura: 'escritura_definitiva_a110.pdf',
      documentosCliente: ['cpf_ana.pdf', 'rg_ana.pdf', 'certidao_casamento_ana.pdf'],
      documentosImovel: ['habite_se.pdf', 'memorial_descritivo.pdf'],
      aditivos: []
    },
    clausulas: {
      reajuste: 'Não se aplica - contrato quitado',
      multa: 'Não se aplica - contrato quitado',
      tolerancia: 'Não se aplica - contrato quitado',
      entrega: 'Entrega imediata após quitação',
      observacoes: 'Contrato quitado à vista. Cliente recebeu desconto de 5% sobre o valor de tabela.'
    },
    versao: 1,
    dataInclusao: '2024-05-15',
    dataAtualizacao: '2024-06-15',
    responsavel: 'José Jurídico',
    vendedor: 'Ana Vendedora',
    comissao: {
      percentual: 4,
      valor: 20800,
      pago: true,
      dataPagamento: '2024-06-20'
    }
  }
];

// Mock do mapa de disponibilidade
export const mockMapaDisponibilidade: MapaDisponibilidade[] = [
  {
    empreendimentoId: 'emp_1',
    empreendimentoNome: 'Residencial Jardim das Flores',
    totalUnidades: 20,
    unidades: mockUnidades.filter(u => u.empreendimentoId === 'emp_1'),
    blocos: [
      {
        id: 'bloco_a',
        nome: 'A',
        andares: 5,
        unidadesPorAndar: 4,
        coordenadas: { x: 100, y: 100 }
      }
    ],
    estatisticas: {
      disponiveis: mockUnidades.filter(u => u.empreendimentoId === 'emp_1' && u.status === 'disponivel').length,
      reservados: mockUnidades.filter(u => u.empreendimentoId === 'emp_1' && u.status === 'reservado').length,
      vendidos: mockUnidades.filter(u => u.empreendimentoId === 'emp_1' && u.status === 'vendido').length,
      entregues: mockUnidades.filter(u => u.empreendimentoId === 'emp_1' && u.status === 'entregue').length,
      bloqueados: mockUnidades.filter(u => u.empreendimentoId === 'emp_1' && u.status === 'bloqueado').length,
      valorTotalVendas: mockUnidades.filter(u => u.empreendimentoId === 'emp_1' && u.status === 'vendido').reduce((sum, u) => sum + u.preco, 0),
      valorMedioM2: 6500
    }
  },
  {
    empreendimentoId: 'emp_2',
    empreendimentoNome: 'Edifício Harmony',
    totalUnidades: 30,
    unidades: mockUnidades.filter(u => u.empreendimentoId === 'emp_2'),
    blocos: [
      {
        id: 'bloco_b',
        nome: 'B',
        andares: 5,
        unidadesPorAndar: 6,
        coordenadas: { x: 150, y: 150 }
      }
    ],
    estatisticas: {
      disponiveis: mockUnidades.filter(u => u.empreendimentoId === 'emp_2' && u.status === 'disponivel').length,
      reservados: mockUnidades.filter(u => u.empreendimentoId === 'emp_2' && u.status === 'reservado').length,
      vendidos: mockUnidades.filter(u => u.empreendimentoId === 'emp_2' && u.status === 'vendido').length,
      entregues: mockUnidades.filter(u => u.empreendimentoId === 'emp_2' && u.status === 'entregue').length,
      bloqueados: mockUnidades.filter(u => u.empreendimentoId === 'emp_2' && u.status === 'bloqueado').length,
      valorTotalVendas: mockUnidades.filter(u => u.empreendimentoId === 'emp_2' && u.status === 'vendido').reduce((sum, u) => sum + u.preco, 0),
      valorMedioM2: 5800
    }
  }
];

// Lista de empreendimentos para filtros
export const mockEmpreendimentos = [
  { id: 'emp_1', nome: 'Residencial Jardim das Flores' },
  { id: 'emp_2', nome: 'Edifício Harmony' },
  { id: 'emp_3', nome: 'Condomínio Vista Verde' },
  { id: 'emp_4', nome: 'Residencial Sunset' }
];

// Lista de vendedores
export const mockVendedores = [
  { id: 'vend_1', nome: 'Carlos Vendas' },
  { id: 'vend_2', nome: 'Pedro Corretor' },
  { id: 'vend_3', nome: 'Ana Vendedora' },
  { id: 'vend_4', nome: 'José Vendedor' }
];

// Função para buscar contrato por ID
export const buscarContratoPorId = (id: string): ContratoJuridico | null => {
  return mockContratos.find(c => c.id === id) || null;
};

// Função para buscar contratos por empreendimento
export const buscarContratosPorEmpreendimento = (empreendimentoId: string): ContratoJuridico[] => {
  return mockContratos.filter(c => c.unidade.empreendimentoId === empreendimentoId);
};

// Função para calcular relatório
export const calcularRelatorioJuridico = () => {
  const totalContratos = mockContratos.length;
  const contratosPorStatus = mockContratos.reduce((acc, contrato) => {
    acc[contrato.status] = (acc[contrato.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const contratosPorTipo = mockContratos.reduce((acc, contrato) => {
    acc[contrato.tipo] = (acc[contrato.tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const valorTotalCarteira = mockContratos.reduce((sum, c) => sum + c.financeiro.valorTotal, 0);
  const valorRecebido = mockContratos.reduce((sum, c) => sum + c.financeiro.valorPago, 0);
  const valorPendente = mockContratos.reduce((sum, c) => sum + c.financeiro.saldoDevedor, 0);
  
  const contratosComAtraso = mockContratos.filter(c => 
    c.pagamentos.some(p => p.status === 'atraso' || p.status === 'vencido')
  ).length;
  
  const valorEmAtraso = mockContratos.reduce((sum, c) => 
    sum + c.pagamentos.filter(p => p.status === 'atraso' || p.status === 'vencido')
      .reduce((pSum, p) => pSum + p.valorPrevisto, 0), 0
  );

  const unidadesComValorizacao = mockUnidades.filter(u => u.status === 'vendido' && u.percentualValorizacao > 0);
  const mediaValorizacaoUnidades = unidadesComValorizacao.length > 0 
    ? unidadesComValorizacao.reduce((sum, u) => sum + u.percentualValorizacao, 0) / unidadesComValorizacao.length
    : 0;

  const unidadesMaisValorizadas = mockUnidades
    .filter(u => u.status === 'vendido')
    .sort((a, b) => b.percentualValorizacao - a.percentualValorizacao)
    .slice(0, 5)
    .map(u => ({
      unidade: u.codigo,
      empreendimento: u.empreendimentoNome,
      valorizacao: u.percentualValorizacao
    }));

  return {
    totalContratos,
    contratosPorStatus,
    contratosPorTipo,
    valorTotalCarteira,
    valorRecebido,
    valorPendente,
    contratosComAtraso,
    valorEmAtraso,
    mediaValorizacaoUnidades,
    unidadesMaisValorizadas
  };
};