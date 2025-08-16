import { 
  Pessoa, 
  Cliente, 
  Lead, 
  Fornecedor, 
  ColaboradorPF, 
  ColaboradorPJ,
  UnidadeAdquirida,
  Documento 
} from '../types/pessoa';

// Dados mock para desenvolvimento
const nomesPessoas = [
  'João Silva Santos', 'Maria Oliveira Costa', 'Pedro Souza Lima', 'Ana Paula Ferreira',
  'Carlos Eduardo Silva', 'Juliana Santos Rocha', 'Ricardo Almeida Pereira', 'Fernanda Costa Lima',
  'Roberto Carlos Santos', 'Patrícia Oliveira Silva', 'Eduardo Ferreira Costa', 'Camila Santos Lima',
  'Leonardo Silva Rocha', 'Mariana Costa Santos', 'Gabriel Oliveira Lima', 'Isabela Santos Costa'
];

const empresas = [
  'Tech Solutions Ltda', 'Construtora Horizonte S.A.', 'Agro Invest Participações',
  'Digital Marketing Pro', 'Engenharia Avançada Ltda', 'Consultoria Financeira Plus',
  'Imóveis Prime S.A.', 'Desenvolvedora Web Tech', 'Arquitetura Moderna Ltda',
  'Investimentos Smart S.A.', 'Construções Elite Ltda', 'Tecnologia Inovadora S.A.'
];

const cidades = [
  { cidade: 'São Paulo', estado: 'SP', cep: '01000000' },
  { cidade: 'Rio de Janeiro', estado: 'RJ', cep: '20000000' },
  { cidade: 'Belo Horizonte', estado: 'MG', cep: '30000000' },
  { cidade: 'Brasília', estado: 'DF', cep: '70000000' },
  { cidade: 'Porto Alegre', estado: 'RS', cep: '90000000' },
  { cidade: 'Salvador', estado: 'BA', cep: '40000000' },
  { cidade: 'Curitiba', estado: 'PR', cep: '80000000' },
  { cidade: 'Fortaleza', estado: 'CE', cep: '60000000' }
];

const tags = [
  'vip', 'investidor', 'primeira_compra', 'referencia', 'pagamento_vista',
  'financiamento', 'corporativo', 'recorrente', 'premium', 'parceiro'
];

const interessesImoveis = [
  'Apartamento 2 quartos', 'Apartamento 3 quartos', 'Casa térrea', 'Sobrado',
  'Cobertura', 'Studio', 'Loft', 'Sala comercial', 'Terreno', 'Galpão'
];

const departamentos = [
  'Vendas', 'Marketing', 'Financeiro', 'Jurídico', 'Engenharia', 
  'Arquitetura', 'RH', 'TI', 'Atendimento', 'Administrativo'
];

const cargos = [
  'Vendedor', 'Consultor', 'Gerente', 'Diretor', 'Analista', 
  'Coordenador', 'Supervisor', 'Assistente', 'Especialista', 'Técnico'
];

// Função para gerar CPF válido (apenas para mock)
function gerarCPF(): string {
  const nums = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += nums[i] * (10 - i);
  }
  const dig1 = ((soma * 10) % 11) % 10;
  nums.push(dig1);
  
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += nums[i] * (11 - i);
  }
  const dig2 = ((soma * 10) % 11) % 10;
  nums.push(dig2);
  
  return nums.join('').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Função para gerar CNPJ válido (apenas para mock)
function gerarCNPJ(): string {
  const nums = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10));
  
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let soma = 0;
  for (let i = 0; i < 12; i++) {
    soma += nums[i] * weights1[i];
  }
  const dig1 = ((soma % 11) < 2) ? 0 : 11 - (soma % 11);
  nums.push(dig1);
  
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  soma = 0;
  for (let i = 0; i < 13; i++) {
    soma += nums[i] * weights2[i];
  }
  const dig2 = ((soma % 11) < 2) ? 0 : 11 - (soma % 11);
  nums.push(dig2);
  
  return nums.join('').replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

function gerarTelefone(): string {
  const ddd = Math.floor(Math.random() * 89) + 11;
  const numero = Math.floor(Math.random() * 900000000) + 100000000;
  return `(${ddd}) 9${numero.toString().substring(0, 4)}-${numero.toString().substring(4, 8)}`;
}

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomChoices<T>(array: T[], count: number = 2): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

function gerarData(diasAtras: number = 365): string {
  const data = new Date();
  data.setDate(data.getDate() - Math.floor(Math.random() * diasAtras));
  return data.toISOString().split('T')[0];
}

export function gerarDocumentos(count: number, categoria: Documento['categoria']): Documento[] {
  const tipos = {
    documentacao_pessoal: ['RG', 'CNH', 'CPF', 'Passaporte', 'Comprovante Residência'],
    contratos: ['Contrato Trabalho', 'Contrato Prestação', 'Termo Adesão', 'Aditivo'],
    advertencias: ['Advertência Verbal', 'Advertência Escrita', 'Suspensão'],
    atestados_medicos: ['Atestado Médico', 'Exame Admissional', 'Exame Periódico'],
    outros: ['Certidão', 'Comprovante', 'Declaração', 'Laudo']
  };
  
  return Array.from({ length: count }, (_, i) => ({
    id: `doc-${Date.now()}-${i}`,
    tipo: randomChoice(tipos[categoria]),
    categoria,
    nomeArquivo: `documento_${i + 1}.pdf`,
    dataUpload: gerarData(90),
    tamanho: Math.floor(Math.random() * 5000000) + 100000, // 100KB a 5MB
    blobUrl: `blob:mock-${Date.now()}-${i}`
  }));
}

export function gerarUnidadesAdquiridas(count: number): UnidadeAdquirida[] {
  const empreendimentos = [
    'Residencial Primavera', 'Edifício São Paulo', 'Condomínio Horizonte',
    'Torres do Parque', 'Vila Moderna', 'Residencial Elite'
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const valorCompra = Math.floor(Math.random() * 800000) + 200000;
    const valorizacao = (Math.random() * 30) - 5; // -5% a +25%
    const valorAtual = Math.floor(valorCompra * (1 + valorizacao / 100));
    
    return {
      id: `unidade-${Date.now()}-${i}`,
      empreendimentoId: `emp-${i + 1}`,
      empreendimentoNome: randomChoice(empreendimentos),
      unidade: `${Math.floor(Math.random() * 20) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 4))}`,
      bloco: Math.random() > 0.5 ? `Bloco ${String.fromCharCode(65 + Math.floor(Math.random() * 3))}` : undefined,
      andar: Math.floor(Math.random() * 15) + 1,
      valorCompra,
      valorAtual,
      valorizacao: Number(((valorAtual - valorCompra) / valorCompra * 100).toFixed(2)),
      status: randomChoice(['quitado', 'financiamento', 'contrato', 'pendente']),
      dataAquisicao: gerarData(1000),
      historicoValores: Array.from({ length: 12 }, (_, j) => ({
        data: gerarData(365 - j * 30),
        valor: Math.floor(valorCompra * (0.95 + (j * 0.02) + Math.random() * 0.1))
      }))
    };
  });
}

export function gerarCliente(): Cliente {
  const localizacao = randomChoice(cidades);
  const pessoaFisica = Math.random() > 0.3;
  
  return {
    id: `cliente-${Date.now()}-${Math.random()}`,
    tipo: 'cliente',
    pessoaFisica,
    nome: pessoaFisica ? randomChoice(nomesPessoas) : randomChoice(empresas),
    cpfCnpj: pessoaFisica ? gerarCPF() : gerarCNPJ(),
    telefone: gerarTelefone(),
    email: `cliente${Math.floor(Math.random() * 1000)}@email.com`,
    endereco: {
      logradouro: `Rua ${randomChoice(['das Flores', 'dos Ipês', 'Principal', 'Central', 'do Comércio'])}`,
      numero: String(Math.floor(Math.random() * 999) + 1),
      bairro: randomChoice(['Centro', 'Vila Nova', 'Jardim América', 'Alto da Boa Vista']),
      cidade: localizacao.cidade,
      estado: localizacao.estado,
      cep: localizacao.cep
    },
    tags: randomChoices(tags, 2),
    observacoes: 'Cliente de longa data. Excelente histórico de pagamentos.',
    documentos: gerarDocumentos(3, 'documentacao_pessoal'),
    dataInclusao: gerarData(365),
    dataAtualizacao: gerarData(30),
    status: 'ativo',
    unidadesAdquiridas: gerarUnidadesAdquiridas(Math.floor(Math.random() * 3) + 1),
    valorTotalInvestido: 0, // Será calculado
    valorPatrimonioAtual: 0, // Será calculado
    origemContato: randomChoice(['indicacao', 'site', 'whatsapp', 'redes_sociais', 'evento']),
    classificacao: randomChoice(['bronze', 'prata', 'ouro', 'diamante'])
  };
}

export function gerarLead(): Lead {
  const localizacao = randomChoice(cidades);
  const pessoaFisica = Math.random() > 0.2;
  
  return {
    id: `lead-${Date.now()}-${Math.random()}`,
    tipo: 'lead',
    pessoaFisica,
    nome: pessoaFisica ? randomChoice(nomesPessoas) : randomChoice(empresas),
    cpfCnpj: pessoaFisica ? gerarCPF() : gerarCNPJ(),
    telefone: gerarTelefone(),
    email: `lead${Math.floor(Math.random() * 1000)}@email.com`,
    endereco: {
      logradouro: `Rua ${randomChoice(['das Palmeiras', 'dos Eucaliptos', 'da Liberdade', 'do Progresso'])}`,
      numero: String(Math.floor(Math.random() * 999) + 1),
      bairro: randomChoice(['Centro', 'Vila São João', 'Jardim Europa', 'Bela Vista']),
      cidade: localizacao.cidade,
      estado: localizacao.estado,
      cep: localizacao.cep
    },
    tags: randomChoices(['lead_quente', 'primeira_compra', 'investidor_iniciante'], 1),
    observacoes: 'Lead qualificado com interesse em apartamento de 2 quartos.',
    documentos: [],
    dataInclusao: gerarData(90),
    dataAtualizacao: gerarData(7),
    status: 'ativo',
    origemContato: randomChoice(['indicacao', 'site', 'whatsapp', 'redes_sociais', 'evento']),
    interesseImovel: randomChoices(interessesImoveis, 2),
    orcamentoMinimo: Math.floor(Math.random() * 300000) + 200000,
    orcamentoMaximo: Math.floor(Math.random() * 500000) + 400000,
    prazoCompra: randomChoice(['30 dias', '60 dias', '90 dias', '6 meses', '1 ano']),
    pontuacao: Math.floor(Math.random() * 100),
    ultimaInteracao: gerarData(7)
  };
}

export function gerarFornecedor(): Fornecedor {
  const localizacao = randomChoice(cidades);
  
  return {
    id: `fornecedor-${Date.now()}-${Math.random()}`,
    tipo: 'fornecedor',
    pessoaFisica: Math.random() > 0.7,
    nome: randomChoice(empresas),
    cpfCnpj: gerarCNPJ(),
    telefone: gerarTelefone(),
    email: `fornecedor${Math.floor(Math.random() * 1000)}@empresa.com`,
    endereco: {
      logradouro: `Av. ${randomChoice(['Industrial', 'Comercial', 'Empresarial', 'dos Negócios'])}`,
      numero: String(Math.floor(Math.random() * 9999) + 100),
      bairro: randomChoice(['Distrito Industrial', 'Centro Empresarial', 'Vila Industrial']),
      cidade: localizacao.cidade,
      estado: localizacao.estado,
      cep: localizacao.cep
    },
    tags: randomChoices(['fornecedor_premium', 'pagamento_vista', 'entrega_rapida'], 1),
    observacoes: 'Fornecedor confiável com ótimo prazo de entrega.',
    documentos: gerarDocumentos(2, 'contratos'),
    dataInclusao: gerarData(730),
    dataAtualizacao: gerarData(30),
    status: 'ativo',
    produtosServicos: randomChoices(['Material de construção', 'Ferramentas', 'Equipamentos', 'Serviços'], 2),
    categoria: randomChoice(['Construção', 'Tecnologia', 'Serviços', 'Materiais']),
    contratoVigente: Math.random() > 0.3,
    avaliacaoQualidade: Math.floor(Math.random() * 5) + 1,
    tempoMedioPagamento: Math.floor(Math.random() * 30) + 15,
    condicoesPagamento: randomChoice(['À vista', '30 dias', '45 dias', '60 dias'])
  };
}

export function gerarColaboradorPF(): ColaboradorPF {
  const localizacao = randomChoice(cidades);
  
  return {
    id: `colaborador-pf-${Date.now()}-${Math.random()}`,
    tipo: 'colaborador_pf',
    pessoaFisica: true,
    nome: randomChoice(nomesPessoas),
    cpfCnpj: gerarCPF(),
    telefone: gerarTelefone(),
    email: `colaborador${Math.floor(Math.random() * 1000)}@empresa.com`,
    endereco: {
      logradouro: `Rua ${randomChoice(['dos Trabalhadores', 'da Esperança', 'do Trabalho', 'da União'])}`,
      numero: String(Math.floor(Math.random() * 999) + 1),
      bairro: randomChoice(['Vila Operária', 'Jardim Trabalhador', 'Bairro Novo']),
      cidade: localizacao.cidade,
      estado: localizacao.estado,
      cep: localizacao.cep
    },
    tags: randomChoices(['colaborador_senior', 'lideranca', 'destaque'], 1),
    observacoes: 'Funcionário dedicado e pontual.',
    documentos: gerarDocumentos(2, 'documentacao_pessoal'),
    dataInclusao: gerarData(365),
    dataAtualizacao: gerarData(30),
    status: 'ativo',
    cargo: randomChoice(cargos),
    departamento: randomChoice(departamentos),
    dataAdmissao: gerarData(1000),
    salario: Math.floor(Math.random() * 10000) + 2000,
    beneficios: randomChoices(['Vale transporte', 'Vale refeição', 'Plano de saúde', 'Seguro de vida'], 2),
    advertencias: gerarDocumentos(0, 'advertencias'),
    atestadosMedicos: gerarDocumentos(1, 'atestados_medicos'),
    situacaoTrabalhista: 'ativo',
    dadosTrabalho: {
      rg: `${Math.floor(Math.random() * 99999999)}-${Math.floor(Math.random() * 9)}`,
      ctps: `${Math.floor(Math.random() * 9999999)}`,
      pis: `${Math.floor(Math.random() * 99999999999)}`
    }
  };
}

export function gerarColaboradorPJ(): ColaboradorPJ {
  const localizacao = randomChoice(cidades);
  
  return {
    id: `colaborador-pj-${Date.now()}-${Math.random()}`,
    tipo: 'colaborador_pj',
    pessoaFisica: false,
    nome: randomChoice(empresas),
    cpfCnpj: gerarCNPJ(),
    telefone: gerarTelefone(),
    email: `prestador${Math.floor(Math.random() * 1000)}@empresa.com`,
    endereco: {
      logradouro: `Av. ${randomChoice(['dos Prestadores', 'Empresarial', 'dos Serviços'])}`,
      numero: String(Math.floor(Math.random() * 999) + 1),
      bairro: randomChoice(['Setor Comercial', 'Vila Empresarial', 'Centro de Negócios']),
      cidade: localizacao.cidade,
      estado: localizacao.estado,
      cep: localizacao.cep
    },
    tags: randomChoices(['prestador_premium', 'servico_especializado'], 1),
    observacoes: 'Prestador de serviços especializado.',
    documentos: gerarDocumentos(3, 'contratos'),
    dataInclusao: gerarData(365),
    dataAtualizacao: gerarData(30),
    status: 'ativo',
    servicosPrestados: randomChoices(['Consultoria', 'Desenvolvimento', 'Marketing', 'Design'], 2),
    valorContrato: Math.floor(Math.random() * 50000) + 10000,
    dataInicioContrato: gerarData(365),
    contratosPrestacao: gerarDocumentos(2, 'contratos'),
    avaliacaoServico: Math.floor(Math.random() * 5) + 1,
    renovacaoAutomatica: Math.random() > 0.5,
    dadosPJ: {
      inscricaoEstadual: `${Math.floor(Math.random() * 999999999)}`,
      cnae: `${Math.floor(Math.random() * 9999)}-${Math.floor(Math.random() * 9)}/99`,
      responsavelLegal: {
        nome: randomChoice(nomesPessoas),
        cpf: gerarCPF()
      }
    }
  };
}

export function gerarMockPessoas(count: number = 50): Pessoa[] {
  const pessoas: Pessoa[] = [];
  
  // Distribuição: 40% clientes, 30% leads, 15% fornecedores, 10% colaboradores PF, 5% colaboradores PJ
  const tipos = [
    { tipo: 'cliente', count: Math.floor(count * 0.4) },
    { tipo: 'lead', count: Math.floor(count * 0.3) },
    { tipo: 'fornecedor', count: Math.floor(count * 0.15) },
    { tipo: 'colaborador_pf', count: Math.floor(count * 0.1) },
    { tipo: 'colaborador_pj', count: Math.floor(count * 0.05) }
  ];
  
  tipos.forEach(({ tipo, count: tipoCount }) => {
    for (let i = 0; i < tipoCount; i++) {
      switch (tipo) {
        case 'cliente':
          const cliente = gerarCliente();
          // Calcular valores totais
          cliente.valorTotalInvestido = cliente.unidadesAdquiridas.reduce((total, unidade) => total + unidade.valorCompra, 0);
          cliente.valorPatrimonioAtual = cliente.unidadesAdquiridas.reduce((total, unidade) => total + unidade.valorAtual, 0);
          pessoas.push(cliente);
          break;
        case 'lead':
          pessoas.push(gerarLead());
          break;
        case 'fornecedor':
          pessoas.push(gerarFornecedor());
          break;
        case 'colaborador_pf':
          pessoas.push(gerarColaboradorPF());
          break;
        case 'colaborador_pj':
          pessoas.push(gerarColaboradorPJ());
          break;
      }
    }
  });
  
  return pessoas;
}