import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth';

// Schemas de validação
const empreendimentoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  descricao: z.string().optional(),
  endereco: z.object({
    logradouro: z.string().min(5, 'Logradouro deve ter pelo menos 5 caracteres'),
    numero: z.string().optional(),
    complemento: z.string().optional(),
    bairro: z.string().min(2, 'Bairro deve ter pelo menos 2 caracteres'),
    cidade: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
    estado: z.string().length(2, 'Estado deve ter 2 caracteres'),
    cep: z.string().optional()
  }),
  tipoEmpreendimento: z.string().min(2, 'Tipo é obrigatório'),
  status: z.enum(['PLANEJAMENTO', 'LANCAMENTO', 'CONSTRUCAO', 'ENTREGUE', 'FINALIZADO']).default('PLANEJAMENTO'),
  dataLancamento: z.string().datetime().optional(),
  dataEntrega: z.string().datetime().optional(),
  valorM2: z.number().positive('Valor por m² deve ser positivo').optional(),
  totalUnidades: z.number().int().positive('Total de unidades deve ser positivo').optional(),
  areaTotal: z.number().positive('Área total deve ser positiva').optional()
});

const unidadeSchema = z.object({
  numero: z.string().min(1, 'Número da unidade é obrigatório'),
  bloco: z.string().optional(),
  andar: z.number().int().optional(),
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  area: z.number().positive('Área deve ser positiva').optional(),
  vagas: z.number().int().min(0).optional(),
  valorBase: z.number().positive('Valor base deve ser positivo'),
  valorAtual: z.number().positive('Valor atual deve ser positivo'),
  status: z.enum(['DISPONIVEL', 'RESERVADA', 'VENDIDA', 'ENTREGUE']).default('DISPONIVEL')
});

const unidadeAdquiridaSchema = z.object({
  unidadeId: z.string().uuid().optional(),
  clienteId: z.string().uuid(),
  empreendimentoId: z.string().uuid(),
  unidadeNumero: z.string().min(1, 'Número da unidade é obrigatório'),
  bloco: z.string().optional(),
  andar: z.number().int().optional(),
  valorCompra: z.number().positive('Valor de compra deve ser positivo'),
  valorAtual: z.number().positive('Valor atual deve ser positivo'),
  dataAquisicao: z.string().datetime(),
  dataEntrega: z.string().datetime().optional(),
  historicoValores: z.array(z.object({}).passthrough()).default([])
});

const querySchema = z.object({
  page: z.string().transform(val => parseInt(val) || 1),
  limit: z.string().transform(val => parseInt(val) || 10),
  search: z.string().optional(),
  status: z.enum(['PLANEJAMENTO', 'LANCAMENTO', 'CONSTRUCAO', 'ENTREGUE', 'FINALIZADO']).optional()
});

// ===== EMPREENDIMENTOS =====

// Criar empreendimento
export const createEmpreendimento = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const data = empreendimentoSchema.parse(req.body);

  const empreendimento = await prisma.empreendimento.create({
    data: {
      ...data,
      userId: req.user!.id,
      dataLancamento: data.dataLancamento ? new Date(data.dataLancamento) : null,
      dataEntrega: data.dataEntrega ? new Date(data.dataEntrega) : null
    },
    include: {
      _count: {
        select: { unidades: true }
      }
    }
  });

  res.status(201).json({ empreendimento });
      return;
};

// Listar empreendimentos
export const listEmpreendimentos = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { page, limit, search, status } = querySchema.parse(req.query);
  
  const skip = (page - 1) * limit;
  
  const where: any = {
    userId: req.user!.id,
    ativo: true,
    ...(status && { status }),
    ...(search && {
      OR: [
        { nome: { contains: search, mode: 'insensitive' } },
        { descricao: { contains: search, mode: 'insensitive' } }
      ]
    })
  };

  const [empreendimentos, total] = await Promise.all([
    prisma.empreendimento.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            unidades: true
          }
        }
      }
    }),
    prisma.empreendimento.count({ where })
  ]);

  // Calcular estatísticas para cada empreendimento
  const empreendimentosComStats = await Promise.all(
    empreendimentos.map(async (emp) => {
      const stats = await calculateEmpreendimentoStats(emp.id);
      return {
        ...emp,
        stats
      };
    })
  );

  res.json({
    empreendimentos: empreendimentosComStats,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
};

// Obter empreendimento por ID
export const getEmpreendimentoById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const empreendimento = await prisma.empreendimento.findFirst({
    where: {
      id,
      ativo: true
    },
    include: {
      unidades: {
        include: {
          unidadesAdquiridas: {
            include: {
              cliente: {
                include: {
                  pessoa: {
                    select: {
                      id: true,
                      nome: true,
                      email: true,
                      telefone: true
                    }
                  }
                }
              }
            }
          }
        }
      },
      _count: {
        select: { unidades: true }
      }
    }
  });

  if (!empreendimento) {
    res.status(404).json({ error: 'Empreendimento não encontrado' });
      return;
  }

  // Calcular estatísticas detalhadas
  const stats = await calculateEmpreendimentoStats(empreendimento.id);

  res.json({ 
    empreendimento: {
      ...empreendimento,
      stats
    }
  });
};

// Atualizar empreendimento
export const updateEmpreendimento = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const data = empreendimentoSchema.partial().parse(req.body);

  const empreendimento = await prisma.empreendimento.findFirst({
    where: {
      id,
      ativo: true
    }
  });

  if (!empreendimento) {
    res.status(404).json({ error: 'Empreendimento não encontrado' });
      return;
  }

  const updatedEmpreendimento = await prisma.empreendimento.update({
    where: { id },
    data: {
      ...data,
      dataLancamento: data.dataLancamento ? new Date(data.dataLancamento) : undefined,
      dataEntrega: data.dataEntrega ? new Date(data.dataEntrega) : undefined
    },
    include: {
      _count: {
        select: { unidades: true }
      }
    }
  });

  res.json({ empreendimento: updatedEmpreendimento });
};

// Deletar empreendimento
export const deleteEmpreendimento = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const empreendimento = await prisma.empreendimento.findFirst({
    where: {
      id,
      ativo: true
    },
    include: {
      _count: {
        select: { unidades: true }
      }
    }
  });

  if (!empreendimento) {
    res.status(404).json({ error: 'Empreendimento não encontrado' });
      return;
  }

  if (empreendimento._count.unidades > 0) {
    res.status(400).json({ 
      error: 'Não é possível excluir empreendimento com unidades cadastradas' 
    });
    return;
  }

  await prisma.empreendimento.update({
    where: { id },
    data: { ativo: false }
  });

  res.json({ message: 'Empreendimento excluído com sucesso' });
};

// ===== UNIDADES =====

// Criar unidade
export const createUnidade = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { empreendimentoId } = req.params;
  const data = unidadeSchema.parse(req.body);

  // Verificar se o empreendimento pertence ao usuário
  const empreendimento = await prisma.empreendimento.findFirst({
    where: {
      id: empreendimentoId,
      ativo: true
    }
  });

  if (!empreendimento) {
    res.status(404).json({ error: 'Empreendimento não encontrado' });
      return;
  }

  // Verificar se já existe unidade com mesmo número
  const existingUnidade = await prisma.unidade.findFirst({
    where: {
      empreendimentoId,
      numero: data.numero
    }
  });

  if (existingUnidade) {
    res.status(400).json({ error: 'Já existe uma unidade com este número' });
      return;
  }

  const unidade = await prisma.unidade.create({
    data: {
      ...data,
      empreendimentoId
    },
    include: {
      empreendimento: {
        select: { id: true, nome: true }
      }
    }
  });

  res.status(201).json({ unidade });
      return;
};

// Listar unidades de um empreendimento
export const listUnidades = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { empreendimentoId } = req.params;
  const { status, tipo } = req.query;

  // Verificar se o empreendimento pertence ao usuário
  const empreendimento = await prisma.empreendimento.findFirst({
    where: {
      id: empreendimentoId,
      ativo: true
    }
  });

  if (!empreendimento) {
    res.status(404).json({ error: 'Empreendimento não encontrado' });
      return;
  }

  const where: any = {
    empreendimentoId,
    deletedAt: null,
    ...(status && { status }),
    ...(tipo && { tipo })
  };

  const unidades = await prisma.unidade.findMany({
    where,
    include: {
      unidadesAdquiridas: {
        include: {
          cliente: {
            include: {
              pessoa: {
                select: {
                  id: true,
                  nome: true,
                  email: true,
                  telefone: true
                }
              }
            }
          }
        }
      }
    },
    orderBy: [
      { andar: 'asc' },
      { numero: 'asc' }
    ]
  });

  res.json({ unidades });
};

// Atualizar unidade
export const updateUnidade = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const data = unidadeSchema.partial().parse(req.body);

  const unidade = await prisma.unidade.findFirst({
    where: {
      id
    }
  });

  if (!unidade) {
    res.status(404).json({ error: 'Unidade não encontrada' });
      return;
  }

  const updatedUnidade = await prisma.unidade.update({
    where: { id },
    data,
    include: {
      empreendimento: {
        select: { id: true, nome: true }
      }
    }
  });

  res.json({ unidade: updatedUnidade });
};

// ===== UNIDADES ADQUIRIDAS =====

// Registrar venda de unidade
export const registrarVenda = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const data = unidadeAdquiridaSchema.parse(req.body);

  // Verificar se a unidade pertence ao usuário
  const unidade = await prisma.unidade.findFirst({
    where: {
      id: data.unidadeId
    },
    include: {
      empreendimento: true
    }
  });

  if (!unidade) {
    res.status(404).json({ error: 'Unidade não encontrada' });
      return;
  }

  if (unidade.status === 'VENDIDA') {
    res.status(400).json({ error: 'Unidade já foi vendida' });
      return;
  }

  // Verificar se o cliente pertence ao usuário
  const cliente = await prisma.cliente.findFirst({
    where: {
      pessoaId: data.clienteId,
      userId: req.user!.id
    }
  });

  if (!cliente) {
    res.status(404).json({ error: 'Cliente não encontrado' });
      return;
  }

  // Transação para registrar venda
  const result = await prisma.$transaction(async (tx) => {
    // Criar registro de unidade adquirida
    const unidadeAdquirida = await tx.unidadeAdquirida.create({
      data: {
        ...data,
        dataAquisicao: new Date(data.dataAquisicao),
        dataEntrega: data.dataEntrega ? new Date(data.dataEntrega) : null
      },
      include: {
        unidade: {
          include: {
            empreendimento: true
          }
        },
        cliente: {
          include: {
            pessoa: {
              select: {
                id: true,
                nome: true,
                email: true,
                telefone: true
              }
            }
          }
        }
      }
    });

    // Atualizar status da unidade
    await tx.unidade.update({
      where: { id: data.unidadeId },
      data: { status: 'VENDIDA' }
    });

    return unidadeAdquirida;
  });

  res.status(201).json({ unidadeAdquirida: result });
      return;
};

// Listar vendas
export const listVendas = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { empreendimentoId, clienteId } = req.query;

  const where: any = {
    userId: req.user!.id,
    deletedAt: null,
    ...(empreendimentoId && {
      unidade: {
        empreendimentoId
      }
    }),
    ...(clienteId && { clienteId })
  };

  const vendas = await prisma.unidadeAdquirida.findMany({
    where,
    include: {
      unidade: {
        include: {
          empreendimento: {
            select: {
              id: true,
              nome: true,
              tipoEmpreendimento: true
            }
          }
        }
      },
      cliente: {
        include: {
          pessoa: {
            select: {
              id: true,
              nome: true,
              email: true,
              telefone: true
            }
          }
        }
      }
    },
    orderBy: { dataAquisicao: 'desc' }
  });

  res.json({ vendas });
};

// Atualizar valorização
export const atualizarValorizacao = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { novoValor, observacoes } = req.body;

  if (!novoValor || novoValor <= 0) {
    res.status(400).json({ error: 'Novo valor deve ser positivo' });
      return;
  }

  const unidadeAdquirida = await prisma.unidadeAdquirida.findFirst({
    where: {
      id,
      ativo: true
    }
  });

  if (!unidadeAdquirida) {
    res.status(404).json({ error: 'Unidade adquirida não encontrada' });
      return;
  }

  // Calcular valorização
  const valorizacao = ((novoValor - unidadeAdquirida.valorCompra) / unidadeAdquirida.valorCompra) * 100;

  const updated = await prisma.unidadeAdquirida.update({
    where: { id },
    data: {
      valorAtual: novoValor,
      valorizacao,
      observacoes: observacoes || unidadeAdquirida.observacoes,
      updatedAt: new Date()
    },
    include: {
      unidade: {
        include: {
          empreendimento: true
        }
      },
      cliente: {
        include: {
          pessoa: {
            select: {
              id: true,
              nome: true,
              email: true,
              telefone: true
            }
          }
        }
      }
    }
  });

  res.json({ unidadeAdquirida: updated });
};

// ===== ESTATÍSTICAS =====

// Estatísticas gerais de empreendimentos
export const getEmpreendimentosStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.id;

  const [
    totalEmpreendimentos,
    empreendimentosAtivos,
    totalUnidades,
    unidades,
    valorTotalVendas,
    valorizacaoMedia
  ] = await Promise.all([
    prisma.empreendimento.count({
      where: { userId, deletedAt: null }
    }),
    prisma.empreendimento.count({
      where: { 
        userId, 
        ativo: true,
        status: { in: ['LANCAMENTO', 'CONSTRUCAO'] }
      }
    }),
    prisma.unidade.count({
      where: { userId, deletedAt: null }
    }),
    prisma.unidade.count({
      where: { 
        userId, 
        ativo: true,
        status: 'VENDIDA'
      }
    }),
    prisma.unidadeAdquirida.aggregate({
      where: { userId, deletedAt: null },
      _sum: { valorCompra: true }
    }),
    prisma.unidadeAdquirida.aggregate({
      where: { userId, deletedAt: null },
      _avg: { valorizacao: true }
    })
  ]);

  // Top 5 empreendimentos por vendas
  const topEmpreendimentos = await prisma.empreendimento.findMany({
    where: { userId, deletedAt: null },
    include: {
      _count: {
        select: {
          unidades: {
            where: { status: 'VENDIDA' }
          }
        }
      }
    },
    orderBy: {
      unidades: {
        _count: 'desc'
      }
    },
    take: 5
  });

  res.json({
    totalEmpreendimentos,
    empreendimentosAtivos,
    totalUnidades,
    unidades,
    percentualVendas: totalUnidades > 0 ? (unidades / totalUnidades) * 100 : 0,
    valorTotalVendas: valorTotalVendas._sum.valorCompra || 0,
    valorizacaoMedia: valorizacaoMedia._avg.valorizacao || 0,
    topEmpreendimentos
  });
};

// ===== FUNÇÕES AUXILIARES =====

async function calculateEmpreendimentoStats(empreendimentoId: string) {
  const [
    totalUnidades,
    unidadesDisponiveis,
    unidades,
    valorTotalVendas,
    valorizacaoMedia
  ] = await Promise.all([
    prisma.unidade.count({
      where: { empreendimentoId, deletedAt: null }
    }),
    prisma.unidade.count({
      where: { 
        empreendimentoId, 
        ativo: true,
        status: 'DISPONIVEL'
      }
    }),
    prisma.unidade.count({
      where: { 
        empreendimentoId, 
        ativo: true,
        status: 'VENDIDA'
      }
    }),
    prisma.unidadeAdquirida.aggregate({
      where: { 
        unidade: { empreendimentoId },
        ativo: true 
      },
      _sum: { valorCompra: true }
    }),
    prisma.unidadeAdquirida.aggregate({
      where: { 
        unidade: { empreendimentoId },
        ativo: true 
      },
      _avg: { valorizacao: true }
    })
  ]);

  return {
    totalUnidades,
    unidadesDisponiveis,
    unidades,
    percentualVendas: totalUnidades > 0 ? (unidades / totalUnidades) * 100 : 0,
    valorTotalVendas: valorTotalVendas._sum.valorCompra || 0,
    valorizacaoMedia: valorizacaoMedia._avg.valorizacao || 0
  };
}