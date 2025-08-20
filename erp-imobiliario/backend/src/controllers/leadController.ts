import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth';

// Schemas de validação
const leadSchema = z.object({
  pessoaId: z.string().uuid(),
  origemContato: z.string().min(2, 'Origem de contato deve ter pelo menos 2 caracteres'),
  interesseImovel: z.array(z.string()).default([]),
  orcamentoMinimo: z.number().positive().optional(),
  orcamentoMaximo: z.number().positive().optional(),
  prazoCompra: z.string().optional(),
  statusLeadCrm: z.string().optional(),
  pontuacao: z.number().int().min(0).max(100).default(0),
  responsavelCRM: z.string().optional()
});

const leadUpdateSchema = leadSchema.partial();

// Criar lead
export const createLead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const data = leadSchema.parse(req.body);

    // Verificar se a pessoa existe e pertence ao usuário
    const pessoa = await prisma.pessoa.findFirst({
      where: {
        id: data.pessoaId,
        userId: req.user!.id
      }
    });

    if (!pessoa) {
      res.status(404).json({ error: 'Pessoa não encontrada' });
      return;
    }

    const lead = await prisma.lead.create({
      data: {
        ...data,
        userId: req.user!.id,
        ultimaInteracao: new Date()
      },
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
    });

    res.status(201).json({ lead });
      return;
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
      return;
  }
};

// Listar leads
export const listLeads = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status, origem, responsavel, page = '1', limit = '10' } = req.query;
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = {
      userId: req.user!.id,
      ...(status && { statusLeadCrm: status }),
      ...(origem && { origemContato: origem }),
      ...(responsavel && { responsavelCRM: responsavel })
    };

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          pessoa: {
            select: {
              id: true,
              nome: true,
              email: true,
              telefone: true
            }
          },
          movimentacoes: {
            take: 5,
            orderBy: { data: 'desc' },
            include: {
              estagio: true
            }
          }
        },
        skip,
        take,
        orderBy: { ultimaInteracao: 'desc' }
      }),
      prisma.lead.count({ where })
    ]);

    res.json({
      leads,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
      return;
  }
};

// Obter lead por ID
export const getLeadById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const lead = await prisma.lead.findFirst({
      where: {
        id,
        userId: req.user!.id
      },
      include: {
        pessoa: true,
        movimentacoes: {
          include: {
            estagio: true,
            board: true
          },
          orderBy: { data: 'desc' }
        },
        followUps: {
          orderBy: { dataAgendamento: 'desc' }
        }
      }
    });

    if (!lead) {
      res.status(404).json({ error: 'Lead não encontrado' });
      return;
    }

    res.json({ lead });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
      return;
  }
};

// Atualizar lead
export const updateLead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = leadUpdateSchema.parse(req.body);

    const lead = await prisma.lead.findFirst({
      where: {
        id,
        userId: req.user!.id
      }
    });

    if (!lead) {
      res.status(404).json({ error: 'Lead não encontrado' });
      return;
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        ...data,
        ultimaInteracao: new Date()
      },
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
    });

    res.json({ lead: updatedLead });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
      return;
  }
};

// Deletar lead
export const deleteLead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const lead = await prisma.lead.findFirst({
      where: {
        id,
        userId: req.user!.id
      }
    });

    if (!lead) {
      res.status(404).json({ error: 'Lead não encontrado' });
      return;
    }

    await prisma.lead.delete({
      where: { id }
    });

    res.json({ message: 'Lead deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
      return;
  }
};

// Converter lead em cliente
export const convertLead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { classificacao = 'BRONZE', valorInvestido = 0 } = req.body;

    const lead = await prisma.lead.findFirst({
      where: {
        id,
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

    // Verificar se já existe um cliente para essa pessoa
    const existingClient = await prisma.cliente.findFirst({
      where: {
        pessoaId: lead.pessoaId
      }
    });

    if (existingClient) {
      res.status(400).json({ error: 'Essa pessoa já é um cliente' });
      return;
    }

    // Criar cliente
    const cliente = await prisma.cliente.create({
      data: {
        pessoaId: lead.pessoaId,
        userId: req.user!.id,
        origemContato: lead.origemContato,
        classificacao,
        valorTotalInvestido: valorInvestido,
        valorPatrimonioAtual: valorInvestido,
        dataUltimaCompra: new Date()
      },
      include: {
        pessoa: true
      }
    });

    res.json({ 
      message: 'Lead convertido em cliente com sucesso',
      cliente 
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
      return;
  }
};

// Estatísticas de leads
export const getLeadStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const [
      totalLeads,
      leadsEsteMes,
      leadsPorStatus,
      leadsPorOrigem,
      conversoes
    ] = await Promise.all([
      prisma.lead.count({ where: { userId } }),
      prisma.lead.count({ 
        where: { 
          userId,
          ultimaInteracao: { gte: startOfMonth }
        }
      }),
      prisma.lead.groupBy({
        by: ['statusLeadCrm'],
        where: { userId },
        _count: { id: true }
      }),
      prisma.lead.groupBy({
        by: ['origemContato'],
        where: { userId },
        _count: { id: true }
      }),
      prisma.cliente.count({
        where: {
          userId,
          pessoa: {
            leads: {
              some: { userId }
            }
          }
        }
      })
    ]);

    res.json({
      totalLeads,
      leadsEsteMes,
      leadsPorStatus,
      leadsPorOrigem,
      conversoes,
      taxaConversao: totalLeads > 0 ? (conversoes / totalLeads) * 100 : 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
      return;
  }
};