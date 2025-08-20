import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth';

// Schemas de validação
const boardSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  descricao: z.string().optional(),
  cor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor deve ser um hex válido'),
  icone: z.string().min(1, 'Ícone é obrigatório'),
  ordem: z.number().int().min(0),
  tipo: z.enum(['VENDAS', 'POS_VENDA', 'AUTOMACAO']),
  ativo: z.boolean().default(true)
});

const estagioSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  descricao: z.string().optional(),
  cor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor deve ser um hex válido'),
  ordem: z.number().int().min(0),
  tipo: z.enum(['INICIAL', 'INTERMEDIARIO', 'FINAL', 'PERDIDO']),
  configuracoes: z.object({}).passthrough(),
  boardId: z.string().uuid()
});

const movimentacaoSchema = z.object({
  leadId: z.string().uuid(),
  boardId: z.string().uuid(),
  estagioId: z.string().uuid(),
  estagioOrigem: z.string().optional(),
  motivo: z.string().optional(),
  observacoes: z.string().optional(),
  posicao: z.number().int().min(0).default(0),
  automatica: z.boolean().default(false)
});

const followUpSchema = z.object({
  leadId: z.string().uuid(),
  tipo: z.enum(['LIGACAO', 'EMAIL', 'WHATSAPP', 'REUNIAO', 'VISITA']),
  titulo: z.string().min(2, 'Título deve ter pelo menos 2 caracteres'),
  descricao: z.string().optional(),
  dataAgendamento: z.string().datetime(),
  prioridade: z.enum(['BAIXA', 'MEDIA', 'ALTA', 'URGENTE']).default('MEDIA'),
  configuracoes: z.object({}).passthrough().optional()
});

// ===== BOARDS =====

// Criar board
export const createBoard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const data = boardSchema.parse(req.body);

  const board = await prisma.board.create({
    data: {
      ...data,
      userId: req.user!.id
    },
    include: {
      estagios: {
        orderBy: { ordem: 'asc' }
      },
      _count: {
        select: { estagios: true }
      }
    }
  });

  res.status(201).json({ board });
      return;
};

// Listar boards
export const listBoards = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const boards = await prisma.board.findMany({
    where: {
      userId: req.user!.id,
      ativo: true
    },
    include: {
      estagios: {
        orderBy: { ordem: 'asc' },
        include: {
          _count: {
            select: { movimentacoes: true }
          }
        }
      },
      _count: {
        select: { 
          estagios: true,
          automacoes: true 
        }
      }
    },
    orderBy: { ordem: 'asc' }
  });

  res.json({ boards });
};

// Obter board por ID
export const getBoardById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const board = await prisma.board.findFirst({
    where: {
      id,
      userId: req.user!.id,
      ativo: true
    },
    include: {
      estagios: {
        orderBy: { ordem: 'asc' },
        include: {
          movimentacoes: {
            take: 10,
            orderBy: { data: 'desc' },
            include: {
              lead: {
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
          },
          _count: {
            select: { movimentacoes: true }
          }
        }
      },
      automacoes: {
        where: { ativo: true }
      }
    }
  });

  if (!board) {
    res.status(404).json({ error: 'Board não encontrado' });
      return;
  }

  res.json({ board });
};

// Atualizar board
export const updateBoard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const data = boardSchema.partial().parse(req.body);

  const board = await prisma.board.findFirst({
    where: {
      id,
      userId: req.user!.id,
      ativo: true
    }
  });

  if (!board) {
    res.status(404).json({ error: 'Board não encontrado' });
      return;
  }

  const updatedBoard = await prisma.board.update({
    where: { id },
    data,
    include: {
      estagios: {
        orderBy: { ordem: 'asc' }
      }
    }
  });

  res.json({ board: updatedBoard });
};

// Deletar board
export const deleteBoard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const board = await prisma.board.findFirst({
    where: {
      id,
      userId: req.user!.id,
      ativo: true
    }
  });

  if (!board) {
    res.status(404).json({ error: 'Board não encontrado' });
      return;
  }

  await prisma.board.update({
    where: { id },
    data: { ativo: false }
  });

  res.json({ message: 'Board excluído com sucesso' });
};

// ===== ESTÁGIOS =====

// Criar estágio
export const createEstagio = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const data = estagioSchema.parse(req.body);

  // Verificar se o board pertence ao usuário
  const board = await prisma.board.findFirst({
    where: {
      id: data.boardId,
      userId: req.user!.id,
      ativo: true
    }
  });

  if (!board) {
    res.status(404).json({ error: 'Board não encontrado' });
      return;
  }

  const estagio = await prisma.estagio.create({
    data: {
      ...data
    }
  });

  res.status(201).json({ estagio });
      return;
};

// Listar estágios de um board
export const listEstagios = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { boardId } = req.params;

  // Verificar se o board pertence ao usuário
  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
      userId: req.user!.id,
      ativo: true
    }
  });

  if (!board) {
    res.status(404).json({ error: 'Board não encontrado' });
      return;
  }

  const estagios = await prisma.estagio.findMany({
    where: {
      boardId
    },
    include: {
      _count: {
        select: { movimentacoes: true }
      }
    },
    orderBy: { ordem: 'asc' }
  });

  res.json({ estagios });
};

// Atualizar estágio
export const updateEstagio = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const data = estagioSchema.partial().parse(req.body);

  const estagio = await prisma.estagio.findFirst({
    where: {
      id,
      board: {
        userId: req.user!.id,
        ativo: true
      }
    }
  });

  if (!estagio) {
    res.status(404).json({ error: 'Estágio não encontrado' });
      return;
  }

  const updatedEstagio = await prisma.estagio.update({
    where: { id },
    data
  });

  res.json({ estagio: updatedEstagio });
};

// Deletar estágio
export const deleteEstagio = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const estagio = await prisma.estagio.findFirst({
    where: {
      id,
      board: {
        userId: req.user!.id,
        ativo: true
      }
    }
  });

  if (!estagio) {
    res.status(404).json({ error: 'Estágio não encontrado' });
      return;
  }

  // Verificar se há movimentações neste estágio
  const movimentacoes = await prisma.movimentacaoLead.count({
    where: { estagioId: id }
  });

  if (movimentacoes > 0) {
    res.status(400).json({ 
      error: 'Não é possível excluir estágio com movimentações' 
    });
    return;
  }

  await prisma.estagio.delete({
    where: { id }
  });

  res.json({ message: 'Estágio excluído com sucesso' });
};

// ===== MOVIMENTAÇÕES =====

// Mover lead entre estágios
export const moveLeadToStage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const data = movimentacaoSchema.parse(req.body);

  // Verificar se o lead pertence ao usuário
  const lead = await prisma.lead.findFirst({
    where: {
      pessoaId: data.leadId,
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

  // Verificar se o estágio pertence ao usuário
  const estagio = await prisma.estagio.findFirst({
    where: {
      id: data.estagioId,
      board: {
        userId: req.user!.id,
        ativo: true
      }
    }
  });

  if (!estagio) {
    res.status(404).json({ error: 'Estágio não encontrado' });
      return;
  }

  const movimentacao = await prisma.movimentacaoLead.create({
    data: {
      ...data,
      usuario: req.user!.id
    },
    include: {
      lead: {
        include: {
          pessoa: true
        }
      },
      estagio: true,
      board: true
    }
  });

  res.status(201).json({ movimentacao });
      return;
};

// Listar movimentações de um lead
export const getLeadMovimentacoes = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { leadId } = req.params;

  // Verificar se o lead pertence ao usuário
  const lead = await prisma.lead.findFirst({
    where: {
      pessoaId: leadId,
      userId: req.user!.id
    }
  });

  if (!lead) {
    res.status(404).json({ error: 'Lead não encontrado' });
      return;
  }

  const movimentacoes = await prisma.movimentacaoLead.findMany({
    where: { leadId },
    include: {
      estagio: true,
      board: true
    },
    orderBy: { data: 'desc' }
  });

  res.json({ movimentacoes });
};

// ===== FOLLOW-UPS =====

// Criar follow-up
export const createFollowUp = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const data = followUpSchema.parse(req.body);

  // Verificar se o lead pertence ao usuário
  const lead = await prisma.lead.findFirst({
    where: {
      pessoaId: data.leadId,
      userId: req.user!.id
    }
  });

  if (!lead) {
    res.status(404).json({ error: 'Lead não encontrado' });
      return;
  }

  const followUp = await prisma.followUp.create({
    data: {
      ...data,
      responsavel: req.user!.id,
      dataAgendamento: new Date(data.dataAgendamento)
    },
    include: {
      lead: {
        include: {
          pessoa: true
        }
      }
    }
  });

  res.status(201).json({ followUp });
      return;
};

// Listar follow-ups
export const listFollowUps = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { leadId, concluido } = req.query;

  const where: any = {
    userId: req.user!.id,
    ...(leadId && { leadId }),
    ...(concluido !== undefined && { concluido: concluido === 'true' })
  };

  const followUps = await prisma.followUp.findMany({
    where,
    include: {
      lead: {
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
    orderBy: { dataAgendamento: 'asc' }
  });

  res.json({ followUps });
};

// Marcar follow-up como concluído
export const completeFollowUp = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { observacoes } = req.body;

  const followUp = await prisma.followUp.findFirst({
    where: {
      id,
      lead: {
        userId: req.user!.id
      }
    }
  });

  if (!followUp) {
    res.status(404).json({ error: 'Follow-up não encontrado' });
      return;
  }

  const updatedFollowUp = await prisma.followUp.update({
    where: { id },
    data: {
      status: 'EXECUTADO'
    }
  });

  res.json({ followUp: updatedFollowUp });
};

// ===== DASHBOARD CRM =====

// Estatísticas do CRM
export const getCrmStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const stats = await Promise.all([
    // Total de leads por estágio
    prisma.movimentacaoLead.groupBy({
      by: ['estagioId'],
      where: { 
        lead: {
          userId 
        }
      },
      _count: { leadId: true }
    }),
    
    // Follow-ups pendentes
    prisma.followUp.count({
      where: {
        lead: {
          userId
        },
        status: { not: 'EXECUTADO' },
        dataAgendamento: { lte: new Date() }
      }
    }),
    
    // Total de leads
    prisma.lead.count({
      where: {
        userId
      }
    }),
    
    // Follow-ups criados esta semana
    prisma.followUp.count({
      where: {
        lead: {
          userId
        },
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }
    })
  ]);

  res.json({
    leadsPorEstagio: stats[0],
    followUpsPendentes: stats[1],
    totalLeads: stats[2],
    followUpsEstaSemana: stats[3]
  });
};