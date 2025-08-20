import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth';

// Schemas de validação
const pessoaBaseSchema = z.object({
  tipo: z.enum(['CLIENTE', 'LEAD', 'FORNECEDOR', 'COLABORADOR_PF', 'COLABORADOR_PJ']),
  pessoaFisica: z.boolean().default(true),
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  cpfCnpj: z.string().min(11, 'CPF/CNPJ deve ter pelo menos 11 dígitos'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  email: z.string().email('Email inválido'),
  nomeFantasia: z.string().optional(),
  rgInscricaoEstadual: z.string().optional(),
  telefoneSecundario: z.string().optional(),
  emailSecundario: z.string().optional(),
  endereco: z.object({}).passthrough(),
  tags: z.array(z.string()).default([]),
  observacoes: z.string().optional(),
  linkVideoCall: z.string().optional(),
  responsavel: z.string().optional()
});

const leadSchema = z.object({
  origemContato: z.string().min(1, 'Origem do contato é obrigatória'),
  interesseImovel: z.array(z.string()).default([]),
  orcamentoMinimo: z.number().positive().optional(),
  orcamentoMaximo: z.number().positive().optional(),
  prazoCompra: z.string().optional(),
  statusLeadCrm: z.string().optional(),
  ultimaInteracao: z.string().datetime().optional(),
  pontuacao: z.number().int().min(0).default(0),
  responsavelCRM: z.string().optional()
});

const clienteSchema = z.object({
  valorTotalInvestido: z.number().min(0).default(0),
  valorPatrimonioAtual: z.number().min(0).default(0),
  dataUltimaCompra: z.string().datetime().optional(),
  origemContato: z.string().min(1, 'Origem do contato é obrigatória'),
  classificacao: z.enum(['BRONZE', 'PRATA', 'OURO', 'DIAMANTE']).default('BRONZE'),
  dadosPF: z.object({}).passthrough().optional(),
  dadosPJ: z.object({}).passthrough().optional()
});

const querySchema = z.object({
  page: z.string().transform(val => parseInt(val) || 1),
  limit: z.string().transform(val => parseInt(val) || 10),
  search: z.string().optional(),
  tipo: z.enum(['LEAD', 'CLIENTE', 'FORNECEDOR', 'COLABORADOR_PF', 'COLABORADOR_PJ']).optional(),
  cidade: z.string().optional(),
  estado: z.string().optional()
});

// Criar pessoa
export const createPessoa = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { tipo } = req.params;
  
  if (!['lead', 'cliente', 'fornecedor'].includes(tipo)) {
    res.status(400).json({ error: 'Tipo de pessoa inválido' });
      return;
  }

  let validatedData;
  
  // Validar dados baseado no tipo
  if (tipo === 'lead') {
    validatedData = leadSchema.parse(req.body);
  } else if (tipo === 'cliente') {
    validatedData = clienteSchema.parse(req.body);
  } else {
    validatedData = pessoaBaseSchema.parse(req.body);
  }

  // Criar pessoa base
  const pessoa = await prisma.pessoa.create({
    data: {
      ...validatedData,
      userId: req.user!.id,
      tipo: tipo.toUpperCase() as any
    }
  });

  // Criar registro específico do tipo
  let specificRecord;
  
  if (tipo === 'lead') {
    specificRecord = await prisma.lead.create({
      data: {
        pessoaId: pessoa.id,
        userId: req.user!.id,
        origem: validatedData.origem,
        interesse: validatedData.interesse,
        orcamento: validatedData.orcamento,
        prioridade: validatedData.prioridade,
        status: validatedData.status
      }
    });
  } else if (tipo === 'cliente') {
    specificRecord = await prisma.cliente.create({
      data: {
        pessoaId: pessoa.id,
        userId: req.user!.id,
        tipoCliente: validatedData.tipoCliente,
        score: validatedData.score,
        observacoesFinanceiras: validatedData.observacoesFinanceiras
      }
    });
  }

  res.status(201).json({
    pessoa,
    [tipo]: specificRecord
  });
  return;
};

// Listar pessoas
export const listPessoas = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { page, limit, search, tipo, cidade, estado } = querySchema.parse(req.query);
  
  const skip = (page - 1) * limit;
  
  const where: any = {
    userId: req.user!.id,
    ...(tipo && { tipo }),
    ...(cidade && { cidade: { contains: cidade, mode: 'insensitive' } }),
    ...(estado && { estado }),
    ...(search && {
      OR: [
        { nome: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { telefone: { contains: search, mode: 'insensitive' } },
        { cpfCnpj: { contains: search, mode: 'insensitive' } }
      ]
    })
  };

  const [pessoas, total] = await Promise.all([
    prisma.pessoa.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        lead: true,
        cliente: true,
        fornecedor: true,
        colaboradorPF: true,
        colaboradorPJ: true,
        documentos: {
          select: {
            id: true,
            nome: true,
            categoria: true,
            createdAt: true
          }
        }
      }
    }),
    prisma.pessoa.count({ where })
  ]);

  res.json({
    pessoas,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
};

// Obter pessoa por ID
export const getPessoaById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const pessoa = await prisma.pessoa.findFirst({
    where: {
      id,
      userId: req.user!.id
    },
    include: {
      lead: true,
      cliente: true,
      fornecedor: true,
      colaboradorPF: true,
      colaboradorPJ: true,
      documentos: true,
      unidadesAdquiridas: {
        include: {
          unidade: {
            include: {
              empreendimento: true
            }
          }
        }
      }
    }
  });

  if (!pessoa) {
    res.status(404).json({ error: 'Pessoa não encontrada' });
      return;
  }

  res.json({ pessoa });
};

// Atualizar pessoa
export const updatePessoa = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  
  const pessoa = await prisma.pessoa.findFirst({
    where: {
      id,
      userId: req.user!.id
    },
    include: {
      lead: true,
      cliente: true
    }
  });

  if (!pessoa) {
    res.status(404).json({ error: 'Pessoa não encontrada' });
      return;
  }

  // Validar dados baseado no tipo
  let validatedData;
  const tipo = pessoa.tipo.toLowerCase();
  
  if (tipo === 'lead') {
    validatedData = leadSchema.partial().parse(req.body);
  } else if (tipo === 'cliente') {
    validatedData = clienteSchema.partial().parse(req.body);
  } else {
    validatedData = pessoaBaseSchema.partial().parse(req.body);
  }

  // Atualizar pessoa base
  const updatedPessoa = await prisma.pessoa.update({
    where: { id },
    data: validatedData
  });

  // Atualizar registro específico do tipo
  let updatedSpecific;
  
  if (tipo === 'lead' && pessoa.lead) {
    const leadData = {
      ...(validatedData.origem && { origem: validatedData.origem }),
      ...(validatedData.interesse && { interesse: validatedData.interesse }),
      ...(validatedData.orcamento && { orcamento: validatedData.orcamento }),
      ...(validatedData.prioridade && { prioridade: validatedData.prioridade }),
      ...(validatedData.status && { status: validatedData.status })
    };

    if (Object.keys(leadData).length > 0) {
      updatedSpecific = await prisma.lead.update({
        where: { pessoaId: id },
        data: leadData
      });
    }
  } else if (tipo === 'cliente' && pessoa.cliente) {
    const clienteData = {
      ...(validatedData.tipoCliente && { tipoCliente: validatedData.tipoCliente }),
      ...(validatedData.score !== undefined && { score: validatedData.score }),
      ...(validatedData.observacoesFinanceiras && { observacoesFinanceiras: validatedData.observacoesFinanceiras })
    };

    if (Object.keys(clienteData).length > 0) {
      updatedSpecific = await prisma.cliente.update({
        where: { pessoaId: id },
        data: clienteData
      });
    }
  }

  res.json({
    pessoa: updatedPessoa,
    [tipo]: updatedSpecific
  });
};

// Converter Lead para Cliente
export const convertLeadToClient = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const clienteData = clienteSchema.partial().parse(req.body);

  const lead = await prisma.lead.findFirst({
    where: {
      pessoaId: id,
      userId: req.user!.id
    },
    include: {
      pessoa: true
    }
  });

  if (!lead) {
    res.status(404).json({ error: 'Lead não encontrado' });
      return;
  }

  // Transação para converter lead em cliente
  const result = await prisma.$transaction(async (tx) => {
    // Atualizar tipo da pessoa
    const updatedPessoa = await tx.pessoa.update({
      where: { id },
      data: { tipo: 'CLIENTE' }
    });

    // Criar registro de cliente
    const cliente = await tx.cliente.create({
      data: {
        pessoaId: id,
        userId: req.user!.id,
        tipoCliente: clienteData.tipoCliente || 'COMPRADOR',
        score: clienteData.score,
        observacoesFinanceiras: clienteData.observacoesFinanceiras,
        dataConversao: new Date()
      }
    });

    // Arquivar o lead
    await tx.lead.update({
      where: { pessoaId: id },
      data: { 
        status: 'CONVERTIDO',
        dataConversao: new Date()
      }
    });

    return { pessoa: updatedPessoa, cliente };
  });

  res.json(result);
};

// Deletar pessoa (soft delete)
export const deletePessoa = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const pessoa = await prisma.pessoa.findFirst({
    where: {
      id,
      userId: req.user!.id
    }
  });

  if (!pessoa) {
    res.status(404).json({ error: 'Pessoa não encontrada' });
      return;
  }

  await prisma.pessoa.update({
    where: { id },
    data: { deletedAt: new Date() }
  });

  res.json({ message: 'Pessoa excluída com sucesso' });
};

// Estatísticas de pessoas
export const getPessoaStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.id;

  const stats = await Promise.all([
    prisma.pessoa.count({ where: { userId, tipo: 'LEAD', deletedAt: null } }),
    prisma.pessoa.count({ where: { userId, tipo: 'CLIENTE', deletedAt: null } }),
    prisma.pessoa.count({ where: { userId, tipo: 'FORNECEDOR', deletedAt: null } }),
    prisma.lead.count({ where: { userId, status: 'NOVO' } }),
    prisma.lead.count({ where: { userId, status: 'INTERESSADO' } }),
    prisma.lead.count({ 
      where: { 
        userId, 
        dataConversao: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      } 
    })
  ]);

  res.json({
    totalLeads: stats[0],
    totalClientes: stats[1],
    totalFornecedores: stats[2],
    leadsNovos: stats[3],
    leadsInteressados: stats[4],
    conversoesEsteMes: stats[5]
  });
};