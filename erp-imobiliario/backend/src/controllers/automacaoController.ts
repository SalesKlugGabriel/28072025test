import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth';

// Schemas de validação
const automacaoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  descricao: z.string().optional(),
  boardId: z.string().uuid(),
  triggerTipo: z.enum(['TEMPO', 'MUDANCA_ESTAGIO', 'CRIACAO_LEAD', 'INATIVIDADE']),
  triggerConfiguracao: z.record(z.any()),
  actionTipo: z.enum(['MOVER_ESTAGIO', 'ENVIAR_EMAIL', 'ENVIAR_WHATSAPP', 'CRIAR_FOLLOWUP', 'ATUALIZAR_LEAD']),
  actionConfiguracao: z.record(z.any()),
  ativo: z.boolean().default(true)
});

const templateSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  categoria: z.enum(['VENDAS', 'ATENDIMENTO', 'COBRANCA', 'FOLLOW_UP']),
  triggerTipo: z.enum(['TEMPO', 'MUDANCA_ESTAGIO', 'CRIACAO_LEAD', 'INATIVIDADE']),
  actionTipo: z.enum(['MOVER_ESTAGIO', 'ENVIAR_EMAIL', 'ENVIAR_WHATSAPP', 'CRIAR_FOLLOWUP', 'ATUALIZAR_LEAD']),
  configuracao: z.record(z.any()),
  descricao: z.string().optional()
});

// ===== AUTOMAÇÕES =====

// Criar automação
export const createAutomacao = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const data = automacaoSchema.parse(req.body);

    // Verificar se o board pertence ao usuário
    const board = await prisma.board.findFirst({
      where: {
        id: data.boardId,
        userId: req.user!.id
      }
    });

    if (!board) {
      res.status(404).json({ error: 'Board não encontrado' });
      return;
    }

    const automacao = await prisma.automacaoBoard.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        boardId: data.boardId,
        ativo: data.ativo,
        condicoes: [data.triggerConfiguracao],
        acoes: [data.actionConfiguracao],
        configuracoes: { triggerTipo: data.triggerTipo, actionTipo: data.actionTipo }
      },
      include: {
        board: {
          select: { id: true, nome: true }
        }
      }
    });

    res.status(201).json({ automacao });
      return;
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
      return;
  }
};

// Listar automações
export const listAutomacoes = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { boardId, ativo } = req.query;

    const where: any = {
      board: {
        userId: req.user!.id
      },
      ...(boardId && { boardId }),
      ...(ativo !== undefined && { ativo: ativo === 'true' })
    };

    const automacoes = await prisma.automacaoBoard.findMany({
      where,
      include: {
        board: {
          select: { id: true, nome: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ automacoes });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
      return;
  }
};

// Obter automação por ID
export const getAutomacaoById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const automacao = await prisma.automacaoBoard.findFirst({
      where: {
        id,
        board: {
          userId: req.user!.id
        }
      },
      include: {
        board: {
          select: { id: true, nome: true }
        }
      }
    });

    if (!automacao) {
      res.status(404).json({ error: 'Automação não encontrada' });
      return;
    }

    res.json({ automacao });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
      return;
  }
};

// Atualizar automação
export const updateAutomacao = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = automacaoSchema.parse(req.body);

    // Verificar se a automação pertence ao usuário
    const automacao = await prisma.automacaoBoard.findFirst({
      where: {
        id,
        board: {
          userId: req.user!.id
        }
      }
    });

    if (!automacao) {
      res.status(404).json({ error: 'Automação não encontrada' });
      return;
    }

    const automacaoAtualizada = await prisma.automacaoBoard.update({
      where: { id },
      data: {
        nome: data.nome,
        descricao: data.descricao,
        ativo: data.ativo,
        condicoes: [data.triggerConfiguracao],
        acoes: [data.actionConfiguracao],
        configuracoes: { triggerTipo: data.triggerTipo, actionTipo: data.actionTipo }
      },
      include: {
        board: {
          select: { id: true, nome: true }
        }
      }
    });

    res.json({ automacao: automacaoAtualizada });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
      return;
  }
};

// Deletar automação
export const deleteAutomacao = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Verificar se a automação pertence ao usuário
    const automacao = await prisma.automacaoBoard.findFirst({
      where: {
        id,
        board: {
          userId: req.user!.id
        }
      }
    });

    if (!automacao) {
      res.status(404).json({ error: 'Automação não encontrada' });
      return;
    }

    await prisma.automacaoBoard.delete({
      where: { id }
    });

    res.json({ message: 'Automação deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
      return;
  }
};

// Executar automação manualmente
export const executeAutomacao = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Verificar se a automação pertence ao usuário
    const automacao = await prisma.automacaoBoard.findFirst({
      where: {
        id,
        board: {
          userId: req.user!.id
        }
      }
    });

    if (!automacao) {
      res.status(404).json({ error: 'Automação não encontrada' });
      return;
    }

    if (!automacao.ativo) {
      res.status(400).json({ error: 'Automação não está ativa' });
      return;
    }

    // Aqui você implementaria a lógica de execução da automação
    // Por agora, vamos apenas atualizar as estatísticas

    await prisma.automacaoBoard.update({
      where: { id },
      data: {
        totalExecucoes: { increment: 1 },
        ultimaExecucao: new Date(),
        sucessos: { increment: 1 }
      }
    });

    res.json({ message: 'Automação executada com sucesso' });
  } catch (error) {
    await prisma.automacaoBoard.update({
      where: { id: req.params.id },
      data: {
        totalExecucoes: { increment: 1 },
        erros: { increment: 1 }
      }
    }).catch(() => {});

    res.status(500).json({ error: 'Erro interno do servidor' });
      return;
  }
};

// ===== TEMPLATES DE AUTOMAÇÃO =====

// Listar templates
export const listTemplates = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { categoria } = req.query;

    // Como não temos uma tabela de templates no schema, vamos retornar templates fixos
    const templates = [
      {
        id: 'template-1',
        nome: 'Follow-up Automático',
        categoria: 'FOLLOW_UP',
        triggerTipo: 'TEMPO',
        actionTipo: 'CRIAR_FOLLOWUP',
        descricao: 'Cria um follow-up automaticamente após 3 dias'
      },
      {
        id: 'template-2',
        nome: 'Email de Boas-vindas',
        categoria: 'VENDAS',
        triggerTipo: 'CRIACAO_LEAD',
        actionTipo: 'ENVIAR_EMAIL',
        descricao: 'Envia email de boas-vindas quando um novo lead é criado'
      }
    ].filter(template => !categoria || template.categoria === categoria);

    res.json({ templates });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
      return;
  }
};

// Criar automação a partir de template
export const createFromTemplate = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { templateId, boardId, configuracoes } = req.body;

    // Verificar se o board pertence ao usuário
    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
        userId: req.user!.id
      }
    });

    if (!board) {
      res.status(404).json({ error: 'Board não encontrado' });
      return;
    }

    // Templates fixos
    const templates: any = {
      'template-1': {
        nome: 'Follow-up Automático',
        triggerTipo: 'TEMPO',
        actionTipo: 'CRIAR_FOLLOWUP',
        triggerConfiguracao: { dias: 3 },
        actionConfiguracao: { tipo: 'LIGACAO', prioridade: 'MEDIA' }
      },
      'template-2': {
        nome: 'Email de Boas-vindas',
        triggerTipo: 'CRIACAO_LEAD',
        actionTipo: 'ENVIAR_EMAIL',
        triggerConfiguracao: {},
        actionConfiguracao: { template: 'bem-vindo' }
      }
    };

    const template = templates[templateId];
    if (!template) {
      res.status(404).json({ error: 'Template não encontrado' });
      return;
    }

    const automacao = await prisma.automacaoBoard.create({
      data: {
        nome: template.nome,
        descricao: `Criado a partir do template ${template.nome}`,
        boardId,
        ativo: true,
        condicoes: [template.triggerConfiguracao],
        acoes: [template.actionConfiguracao],
        configuracoes: { 
          triggerTipo: template.triggerTipo, 
          actionTipo: template.actionTipo,
          ...configuracoes 
        }
      },
      include: {
        board: {
          select: { id: true, nome: true }
        }
      }
    });

    res.status(201).json({ automacao });
      return;
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
      return;
  }
};

// Função para executar automações pendentes (para uso em CRON)
export const executeAutomacoesPendentes = async (): Promise<void> => {
  try {
    const automacoes = await prisma.automacaoBoard.findMany({
      where: {
        ativo: true
      },
      include: {
        board: true
      }
    });

    for (const automacao of automacoes) {
      // Aqui você implementaria a lógica para verificar se a automação deve ser executada
      // Por exemplo, verificar leads que atendem às condições da automação
      
      // Por agora, apenas logamos que a automação foi verificada
      console.log(`Verificando automação: ${automacao.nome}`);
    }
  } catch (error) {
    console.error('Erro ao executar automações pendentes:', error);
  }
};