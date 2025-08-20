import { z } from 'zod';

// ===== VALIDAÇÃO DE AUTENTICAÇÃO =====
export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const changePasswordSchema = z.object({
  senhaAtual: z.string().min(1, 'Senha atual é obrigatória'),
  novaSenha: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
  confirmarSenha: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.novaSenha === data.confirmarSenha, {
  message: 'Senhas não coincidem',
  path: ['confirmarSenha'],
});

// ===== VALIDAÇÃO DE USUÁRIOS =====
export const createUserSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  perfil: z.enum(['corretor', 'gerente', 'administrador']),
  telefone: z.string().optional(),
  departamento: z.string().min(1, 'Departamento é obrigatório'),
  dataAdmissao: z.string().datetime('Data de admissão inválida'),
});

export const updateUserSchema = createUserSchema.partial().omit({ senha: true });

// ===== VALIDAÇÃO DE LEADS =====
export const createLeadSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  whatsapp: z.string().optional(),
  origem: z.string().min(1, 'Origem é obrigatória'),
  pipeline: z.string().default('vendas'),
  etapa: z.string().default('novos_leads'),
  investimentoPretendido: z.object({
    valorMinimo: z.number().min(0, 'Valor mínimo deve ser positivo'),
    valorMaximo: z.number().min(0, 'Valor máximo deve ser positivo'),
  }).optional(),
  perfilImovel: z.object({
    dormitorios: z.number().optional(),
    suites: z.number().optional(),
    vagas: z.number().optional(),
    localizacao: z.string().optional(),
    localizacaoPreferida: z.string().optional(),
    proximidadeMar: z.number().optional(),
    andaresPrefere: z.enum(['baixos', 'intermediarios', 'altos', 'indiferente']).optional(),
    posicaoSolar: z.enum(['nascente', 'poente', 'norte', 'sul', 'indiferente']).optional(),
    finalidadeInvestimento: z.enum(['moradia', 'investimento', 'aluguel', 'revenda']).optional(),
    tempoMudanca: z.enum(['imediato', '6_meses', '1_ano', 'mais_1_ano']).optional(),
    observacoes: z.string().optional(),
  }).optional(),
  tags: z.array(z.string()).optional(),
  observacoes: z.string().optional(),
});

export const updateLeadSchema = createLeadSchema.partial();

export const updateLeadPipelineSchema = z.object({
  pipeline: z.string().min(1, 'Pipeline é obrigatório'),
  etapa: z.string().min(1, 'Etapa é obrigatória'),
});

export const updateLeadStatusSchema = z.object({
  status: z.enum(['ativo', 'convertido', 'perdido', 'inativo']),
});

// ===== VALIDAÇÃO DE CLIENTES =====
export const createClienteSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  cpfCnpj: z.string().min(11, 'CPF/CNPJ inválido'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  email: z.string().email('E-mail inválido'),
  endereco: z.object({
    logradouro: z.string().min(1, 'Logradouro é obrigatório'),
    numero: z.string().min(1, 'Número é obrigatório'),
    complemento: z.string().optional(),
    bairro: z.string().min(1, 'Bairro é obrigatório'),
    cidade: z.string().min(1, 'Cidade é obrigatória'),
    cep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
    estado: z.string().length(2, 'Estado deve ter 2 caracteres'),
  }),
  tags: z.array(z.string()).optional(),
  observacoes: z.string().optional(),
  origemContato: z.string().min(1, 'Origem do contato é obrigatória'),
  classificacao: z.enum(['bronze', 'prata', 'ouro', 'diamante']).default('bronze'),
});

export const updateClienteSchema = createClienteSchema.partial();

// ===== VALIDAÇÃO DE EMPREENDIMENTOS =====
export const createEmpreendimentoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  descricao: z.string().optional(),
  endereco: z.object({
    logradouro: z.string().min(1, 'Logradouro é obrigatório'),
    numero: z.string().min(1, 'Número é obrigatório'),
    complemento: z.string().optional(),
    bairro: z.string().min(1, 'Bairro é obrigatório'),
    cidade: z.string().min(1, 'Cidade é obrigatória'),
    cep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
    estado: z.string().length(2, 'Estado deve ter 2 caracteres'),
  }),
  incorporadora: z.string().min(1, 'Incorporadora é obrigatória'),
  construtora: z.string().min(1, 'Construtora é obrigatória'),
  dataLancamento: z.string().datetime('Data de lançamento inválida'),
  dataEntrega: z.string().datetime('Data de entrega inválida').optional(),
  status: z.enum(['lancamento', 'construcao', 'pronto', 'entregue']).default('lancamento'),
  condicoesPagamento: z.string().optional(),
  valorMinimo: z.number().min(0, 'Valor mínimo deve ser positivo'),
  valorMaximo: z.number().min(0, 'Valor máximo deve ser positivo'),
  valorM2: z.number().min(0, 'Valor por m² deve ser positivo'),
});

export const updateEmpreendimentoSchema = createEmpreendimentoSchema.partial();

// ===== VALIDAÇÃO DE UNIDADES =====
export const createUnidadeSchema = z.object({
  empreendimentoId: z.string().uuid('ID do empreendimento inválido'),
  codigo: z.string().min(1, 'Código é obrigatório'),
  tipo: z.enum(['apartamento', 'casa', 'sala', 'loja']),
  dormitorios: z.number().min(0, 'Dormitórios deve ser positivo'),
  suites: z.number().min(0, 'Suítes deve ser positivo'),
  vagas: z.number().min(0, 'Vagas deve ser positivo'),
  area: z.number().min(1, 'Área deve ser positiva'),
  andar: z.number().optional(),
  bloco: z.string().optional(),
  posicao: z.string().min(1, 'Posição é obrigatória'),
  valor: z.number().min(0, 'Valor deve ser positivo'),
  status: z.enum(['disponivel', 'reservado', 'vendido', 'bloqueado']).default('disponivel'),
  isTerceiro: z.boolean().default(false),
  proprietarioTerceiro: z.object({
    nome: z.string().min(1, 'Nome do proprietário é obrigatório'),
    telefone: z.string().min(10, 'Telefone do proprietário inválido'),
    email: z.string().email('E-mail do proprietário inválido'),
    comissao: z.number().min(0, 'Comissão deve ser positiva'),
  }).optional(),
});

export const updateUnidadeSchema = createUnidadeSchema.partial();

// ===== VALIDAÇÃO DE PROSPECÇÕES =====
export const createProspeccaoSchema = z.object({
  plataforma: z.enum(['olx', 'webmotors', 'mercadolivre', 'whatsapp', 'facebook', 'instagram', 'linkedin', 'outros']),
  quantidade: z.number().min(1, 'Quantidade deve ser positiva'),
  data: z.string().datetime('Data inválida'),
  observacoes: z.string().optional(),
});

export const updateProspeccaoSchema = createProspeccaoSchema.partial();

export const createRespostaProspeccaoSchema = z.object({
  prospeccaoId: z.string().uuid('ID da prospecção inválido').optional(),
  plataforma: z.string().min(1, 'Plataforma é obrigatória'),
  mensagemEnviada: z.string().min(1, 'Mensagem enviada é obrigatória'),
  mensagemRecebida: z.string().min(1, 'Mensagem recebida é obrigatória'),
  sentimento: z.enum(['positivo', 'negativo']),
  data: z.string().datetime('Data inválida'),
});

// ===== VALIDAÇÃO DE PAGINAÇÃO =====
export const paginationSchema = z.object({
  page: z.coerce.number().min(1, 'Página deve ser maior que 0').default(1),
  limit: z.coerce.number().min(1, 'Limite deve ser maior que 0').max(100, 'Limite máximo é 100').default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['ASC', 'DESC']).default('DESC'),
});

// ===== VALIDAÇÃO DE FILTROS =====
export const leadFiltersSchema = paginationSchema.extend({
  pipeline: z.string().optional(),
  etapa: z.string().optional(),
  responsavel: z.string().optional(),
  origem: z.string().optional(),
  dataInicio: z.string().datetime().optional(),
  dataFim: z.string().datetime().optional(),
  investimentoMin: z.coerce.number().optional(),
  investimentoMax: z.coerce.number().optional(),
});

export const empreendimentoFiltersSchema = paginationSchema.extend({
  status: z.string().optional(),
  cidade: z.string().optional(),
  valorMin: z.coerce.number().optional(),
  valorMax: z.coerce.number().optional(),
  incorporadora: z.string().optional(),
});

export const prospeccaoFiltersSchema = paginationSchema.extend({
  plataforma: z.string().optional(),
  usuario: z.string().optional(),
  dataInicio: z.string().datetime().optional(),
  dataFim: z.string().datetime().optional(),
  status: z.string().optional(),
});

// ===== UTILITÁRIOS DE VALIDAÇÃO =====
export const validateUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

export const validateCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(10))) return false;
  
  return true;
};

export const validateCNPJ = (cnpj: string): boolean => {
  cnpj = cnpj.replace(/[^\d]/g, '');
  
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;
  
  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  let digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;
  
  size = size + 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;
  
  return true;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  return phoneRegex.test(phone) || /^\d{10,11}$/.test(phone.replace(/\D/g, ''));
};