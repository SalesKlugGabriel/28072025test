import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { z } from 'zod';

// Interfaces
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    organizacaoId: string;
    perfil: string;
  };
}

// Schemas de validação
const createEscalaSchema = z.object({
  usuarioId: z.string().uuid(),
  dataInicio: z.string().datetime(),
  dataFim: z.string().datetime(),
  diaSemana: z.number().min(1).max(7), // 1=segunda, 7=domingo
  receberLeads: z.boolean().default(true),
  prioridade: z.number().min(1).max(10).default(1),
  observacoes: z.string().optional()
});

const updateEscalaSchema = z.object({
  usuarioId: z.string().uuid().optional(),
  dataInicio: z.string().datetime().optional(),
  dataFim: z.string().datetime().optional(),
  diaSemana: z.number().min(1).max(7).optional(),
  receberLeads: z.boolean().optional(),
  prioridade: z.number().min(1).max(10).optional(),
  status: z.enum(['AGENDADO', 'ATIVO', 'CONCLUIDO', 'CANCELADO']).optional(),
  observacoes: z.string().optional()
});

// Criar escala de plantão
export const createEscala = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const data = createEscalaSchema.parse(req.body);
    const { organizacaoId, id: userId } = req.user!;

    // Verificar se o usuário existe na mesma organização
    const usuario = await prisma.user.findFirst({
      where: {
        id: data.usuarioId,
        organizacaoId,
        ativo: true
      }
    });

    if (!usuario) {
      res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'O usuário especificado não foi encontrado na sua organização'
      });
      return;
    }

    // Verificar conflitos de horário
    const conflito = await prisma.escalaPlantao.findFirst({
      where: {
        usuarioId: data.usuarioId,
        organizacaoId,
        ativo: true,
        status: { in: ['AGENDADO', 'ATIVO'] },
        OR: [
          {
            AND: [
              { dataInicio: { lte: new Date(data.dataInicio) } },
              { dataFim: { gte: new Date(data.dataInicio) } }
            ]
          },
          {
            AND: [
              { dataInicio: { lte: new Date(data.dataFim) } },
              { dataFim: { gte: new Date(data.dataFim) } }
            ]
          }
        ]
      }
    });

    if (conflito) {
      res.status(409).json({
        error: 'Conflito de horário',
        message: 'Já existe uma escala agendada para este usuário no horário especificado'
      });
      return;
    }

    const escala = await prisma.escalaPlantao.create({
      data: {
        ...data,
        organizacaoId,
        createdBy: userId,
        dataInicio: new Date(data.dataInicio),
        dataFim: new Date(data.dataFim)
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            statusAtendimento: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Escala criada com sucesso',
      data: escala
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Dados inválidos',
        details: error.errors
      });
      return;
    }

    console.error('Erro ao criar escala:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao criar escala de plantão'
    });
  }
};

// Listar escalas
export const getEscalas = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { organizacaoId } = req.user!;
    const {
      page = 1,
      limit = 20,
      usuarioId,
      status,
      dataInicio,
      dataFim,
      diaSemana,
      ativas
    } = req.query;

    const where: any = { organizacaoId };

    if (usuarioId) {
      where.usuarioId = usuarioId as string;
    }

    if (status) {
      where.status = status as string;
    }

    if (diaSemana) {
      where.diaSemana = parseInt(diaSemana as string);
    }

    if (ativas === 'true') {
      where.ativo = true;
      where.status = { in: ['AGENDADO', 'ATIVO'] };
    }

    if (dataInicio || dataFim) {
      where.AND = [];
      
      if (dataInicio) {
        where.AND.push({
          dataFim: { gte: new Date(dataInicio as string) }
        });
      }
      
      if (dataFim) {
        where.AND.push({
          dataInicio: { lte: new Date(dataFim as string) }
        });
      }
    }

    const [escalas, total] = await Promise.all([
      prisma.escalaPlantao.findMany({
        where,
        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
              telefone: true,
              statusAtendimento: true,
              perfil: true
            }
          }
        },
        orderBy: [
          { dataInicio: 'asc' },
          { prioridade: 'desc' }
        ],
        skip: (parseInt(page as string) - 1) * parseInt(limit as string),
        take: parseInt(limit as string)
      }),
      prisma.escalaPlantao.count({ where })
    ]);

    res.json({
      data: escalas,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Erro ao listar escalas:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao listar escalas'
    });
  }
};

// Obter escala por ID
export const getEscalaById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { organizacaoId } = req.user!;

    const escala = await prisma.escalaPlantao.findFirst({
      where: {
        id,
        organizacaoId
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            statusAtendimento: true,
            perfil: true
          }
        }
      }
    });

    if (!escala) {
      res.status(404).json({
        error: 'Escala não encontrada',
        message: 'A escala especificada não foi encontrada'
      });
      return;
    }

    res.json({ data: escala });
  } catch (error) {
    console.error('Erro ao buscar escala:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao buscar escala'
    });
  }
};

// Atualizar escala
export const updateEscala = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = updateEscalaSchema.parse(req.body);
    const { organizacaoId } = req.user!;

    const escala = await prisma.escalaPlantao.findFirst({
      where: {
        id,
        organizacaoId
      }
    });

    if (!escala) {
      res.status(404).json({
        error: 'Escala não encontrada',
        message: 'A escala especificada não foi encontrada'
      });
      return;
    }

    // Se alterando datas, verificar conflitos
    if (data.dataInicio || data.dataFim) {
      const novaDataInicio = data.dataInicio ? new Date(data.dataInicio) : escala.dataInicio;
      const novaDataFim = data.dataFim ? new Date(data.dataFim) : escala.dataFim;

      const conflito = await prisma.escalaPlantao.findFirst({
        where: {
          id: { not: id },
          usuarioId: data.usuarioId || escala.usuarioId,
          organizacaoId,
          ativo: true,
          status: { in: ['AGENDADO', 'ATIVO'] },
          OR: [
            {
              AND: [
                { dataInicio: { lte: novaDataInicio } },
                { dataFim: { gte: novaDataInicio } }
              ]
            },
            {
              AND: [
                { dataInicio: { lte: novaDataFim } },
                { dataFim: { gte: novaDataFim } }
              ]
            }
          ]
        }
      });

      if (conflito) {
        res.status(409).json({
          error: 'Conflito de horário',
          message: 'Já existe uma escala agendada para este horário'
        });
        return;
      }
    }

    const updateData: any = {};
    
    if (data.usuarioId) updateData.usuarioId = data.usuarioId;
    if (data.dataInicio) updateData.dataInicio = new Date(data.dataInicio);
    if (data.dataFim) updateData.dataFim = new Date(data.dataFim);
    if (data.diaSemana !== undefined) updateData.diaSemana = data.diaSemana;
    if (data.receberLeads !== undefined) updateData.receberLeads = data.receberLeads;
    if (data.prioridade !== undefined) updateData.prioridade = data.prioridade;
    if (data.status) updateData.status = data.status;
    if (data.observacoes !== undefined) updateData.observacoes = data.observacoes;

    const escalaAtualizada = await prisma.escalaPlantao.update({
      where: { id },
      data: updateData,
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            statusAtendimento: true,
            perfil: true
          }
        }
      }
    });

    res.json({
      message: 'Escala atualizada com sucesso',
      data: escalaAtualizada
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Dados inválidos',
        details: error.errors
      });
      return;
    }

    console.error('Erro ao atualizar escala:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao atualizar escala'
    });
  }
};

// Deletar escala
export const deleteEscala = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { organizacaoId } = req.user!;

    const escala = await prisma.escalaPlantao.findFirst({
      where: {
        id,
        organizacaoId
      }
    });

    if (!escala) {
      res.status(404).json({
        error: 'Escala não encontrada',
        message: 'A escala especificada não foi encontrada'
      });
      return;
    }

    await prisma.escalaPlantao.delete({
      where: { id }
    });

    res.json({
      message: 'Escala removida com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar escala:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao remover escala'
    });
  }
};

// Obter usuários de plantão atualmente
export const getUsuariosEmPlantao = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { organizacaoId } = req.user!;
    const agora = new Date();
    const diaSemanaAtual = agora.getDay() || 7; // Converte domingo (0) para 7

    const escalaAtivas = await prisma.escalaPlantao.findMany({
      where: {
        organizacaoId,
        ativo: true,
        status: 'ATIVO',
        receberLeads: true,
        dataInicio: { lte: agora },
        dataFim: { gte: agora },
        diaSemana: diaSemanaAtual
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            statusAtendimento: true,
            perfil: true
          }
        }
      },
      orderBy: { prioridade: 'desc' }
    });

    res.json({
      data: escalaAtivas,
      totalPlantonistas: escalaAtivas.length
    });
  } catch (error) {
    console.error('Erro ao buscar plantonistas:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao buscar usuários em plantão'
    });
  }
};

// Ativar plantão (usuário marca presença)
export const ativarPlantao = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { organizacaoId, id: userId } = req.user!;

    const escala = await prisma.escalaPlantao.findFirst({
      where: {
        id,
        organizacaoId,
        usuarioId: userId
      }
    });

    if (!escala) {
      res.status(404).json({
        error: 'Escala não encontrada',
        message: 'Você não possui escala agendada para este horário'
      });
      return;
    }

    if (escala.status !== 'AGENDADO') {
      res.status(400).json({
        error: 'Escala inválida',
        message: 'Esta escala não pode ser ativada'
      });
      return;
    }

    await prisma.$transaction(async (tx) => {
      // Ativar escala
      await tx.escalaPlantao.update({
        where: { id },
        data: { status: 'ATIVO' }
      });

      // Atualizar status do usuário
      await tx.user.update({
        where: { id: userId },
        data: { statusAtendimento: 'DISPONIVEL' }
      });
    });

    res.json({
      message: 'Plantão ativado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao ativar plantão:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao ativar plantão'
    });
  }
};

// Finalizar plantão
export const finalizarPlantao = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { organizacaoId, id: userId } = req.user!;

    const escala = await prisma.escalaPlantao.findFirst({
      where: {
        id,
        organizacaoId,
        usuarioId: userId
      }
    });

    if (!escala) {
      res.status(404).json({
        error: 'Escala não encontrada',
        message: 'Você não possui escala ativa'
      });
      return;
    }

    if (escala.status !== 'ATIVO') {
      res.status(400).json({
        error: 'Escala inválida',
        message: 'Esta escala não está ativa'
      });
      return;
    }

    await prisma.escalaPlantao.update({
      where: { id },
      data: { status: 'CONCLUIDO' }
    });

    res.json({
      message: 'Plantão finalizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao finalizar plantão:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao finalizar plantão'
    });
  }
};