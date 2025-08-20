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
const createRegiaoSchema = z.object({
  nome: z.string().min(2).max(100),
  ddds: z.array(z.string().regex(/^\d{2}$/)),
  estados: z.array(z.string().length(2)),
  cidades: z.array(z.string()).optional(),
  distribuicaoTipo: z.enum(['ROUND_ROBIN', 'PRIORIDADE', 'DISPONIBILIDADE', 'MANUAL']).default('ROUND_ROBIN'),
  corretorIds: z.array(z.string().uuid())
});

const updateRegiaoSchema = z.object({
  nome: z.string().min(2).max(100).optional(),
  ddds: z.array(z.string().regex(/^\d{2}$/)).optional(),
  estados: z.array(z.string().length(2)).optional(),
  cidades: z.array(z.string()).optional(),
  distribuicaoTipo: z.enum(['ROUND_ROBIN', 'PRIORIDADE', 'DISPONIBILIDADE', 'MANUAL']).optional(),
  ativo: z.boolean().optional(),
  corretorIds: z.array(z.string().uuid()).optional()
});

// Mapa de DDDs para estados brasileiros
const DDD_ESTADOS: { [key: string]: string } = {
  '11': 'SP', '12': 'SP', '13': 'SP', '14': 'SP', '15': 'SP', '16': 'SP', '17': 'SP', '18': 'SP', '19': 'SP',
  '21': 'RJ', '22': 'RJ', '24': 'RJ',
  '27': 'ES', '28': 'ES',
  '31': 'MG', '32': 'MG', '33': 'MG', '34': 'MG', '35': 'MG', '37': 'MG', '38': 'MG',
  '41': 'PR', '42': 'PR', '43': 'PR', '44': 'PR', '45': 'PR', '46': 'PR',
  '47': 'SC', '48': 'SC', '49': 'SC',
  '51': 'RS', '53': 'RS', '54': 'RS', '55': 'RS',
  '61': 'DF', '62': 'GO', '64': 'GO',
  '63': 'TO',
  '65': 'MT', '66': 'MT',
  '67': 'MS',
  '68': 'AC',
  '69': 'RO',
  '71': 'BA', '73': 'BA', '74': 'BA', '75': 'BA', '77': 'BA',
  '79': 'SE',
  '81': 'PE', '87': 'PE',
  '82': 'AL',
  '83': 'PB',
  '84': 'RN',
  '85': 'CE', '88': 'CE',
  '86': 'PI', '89': 'PI',
  '91': 'PA', '93': 'PA', '94': 'PA',
  '92': 'AM', '97': 'AM',
  '95': 'RR',
  '96': 'AP',
  '98': 'MA', '99': 'MA'
};

// Extrair DDD de um telefone
const extrairDDD = (telefone: string): string | null => {
  const numeroLimpo = telefone.replace(/\D/g, '');
  
  if (numeroLimpo.length >= 10) {
    const ddd = numeroLimpo.substring(numeroLimpo.length - 10, numeroLimpo.length - 8);
    return ddd;
  }
  
  return null;
};

// ========================================
// CRUD DE REGIÕES
// ========================================

// Criar região
export const createRegiao = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const data = createRegiaoSchema.parse(req.body);
    const { organizacaoId } = req.user!;

    // Verificar se todos os corretores pertencem à organização
    const corretores = await prisma.user.findMany({
      where: {
        id: { in: data.corretorIds },
        organizacaoId,
        ativo: true
      }
    });

    if (corretores.length !== data.corretorIds.length) {
      res.status(400).json({
        error: 'Corretores inválidos',
        message: 'Alguns corretores especificados não foram encontrados na sua organização'
      });
      return;
    }

    const regiao = await prisma.regiaoAtendimento.create({
      data: {
        nome: data.nome,
        ddds: data.ddds,
        estados: data.estados,
        cidades: data.cidades || [],
        distribuicaoTipo: data.distribuicaoTipo,
        organizacaoId,
        corretores: {
          connect: data.corretorIds.map(id => ({ id }))
        }
      },
      include: {
        corretores: {
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
      message: 'Região criada com sucesso',
      data: regiao
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Dados inválidos',
        details: error.errors
      });
      return;
    }

    console.error('Erro ao criar região:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao criar região de atendimento'
    });
  }
};

// Listar regiões
export const getRegioes = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { organizacaoId } = req.user!;
    const {
      page = 1,
      limit = 20,
      ativo,
      ddd,
      estado
    } = req.query;

    const where: any = { organizacaoId };

    if (ativo === 'true' || ativo === 'false') {
      where.ativo = ativo === 'true';
    }

    if (ddd) {
      where.ddds = {
        has: ddd as string
      };
    }

    if (estado) {
      where.estados = {
        has: estado as string
      };
    }

    const [regioes, total] = await Promise.all([
      prisma.regiaoAtendimento.findMany({
        where,
        include: {
          corretores: {
            select: {
              id: true,
              nome: true,
              email: true,
              statusAtendimento: true
            }
          },
          _count: {
            select: {
              corretores: true,
              distribuicoes: true
            }
          }
        },
        orderBy: { nome: 'asc' },
        skip: (parseInt(page as string) - 1) * parseInt(limit as string),
        take: parseInt(limit as string)
      }),
      prisma.regiaoAtendimento.count({ where })
    ]);

    res.json({
      data: regioes,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Erro ao listar regiões:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao listar regiões'
    });
  }
};

// Obter região por ID
export const getRegiaoById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { organizacaoId } = req.user!;

    const regiao = await prisma.regiaoAtendimento.findFirst({
      where: {
        id,
        organizacaoId
      },
      include: {
        corretores: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            statusAtendimento: true,
            perfil: true
          }
        },
        _count: {
          select: {
            distribuicoes: true
          }
        }
      }
    });

    if (!regiao) {
      res.status(404).json({
        error: 'Região não encontrada',
        message: 'A região especificada não foi encontrada'
      });
      return;
    }

    res.json({ data: regiao });
  } catch (error) {
    console.error('Erro ao buscar região:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao buscar região'
    });
  }
};

// Atualizar região
export const updateRegiao = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = updateRegiaoSchema.parse(req.body);
    const { organizacaoId } = req.user!;

    const regiao = await prisma.regiaoAtendimento.findFirst({
      where: {
        id,
        organizacaoId
      }
    });

    if (!regiao) {
      res.status(404).json({
        error: 'Região não encontrada',
        message: 'A região especificada não foi encontrada'
      });
      return;
    }

    // Preparar dados de atualização
    const updateData: any = {};
    
    if (data.nome) updateData.nome = data.nome;
    if (data.ddds) updateData.ddds = data.ddds;
    if (data.estados) updateData.estados = data.estados;
    if (data.cidades !== undefined) updateData.cidades = data.cidades;
    if (data.distribuicaoTipo) updateData.distribuicaoTipo = data.distribuicaoTipo;
    if (data.ativo !== undefined) updateData.ativo = data.ativo;

    // Se atualizando corretores, fazer em transação
    if (data.corretorIds) {
      // Verificar se todos os corretores pertencem à organização
      const corretores = await prisma.user.findMany({
        where: {
          id: { in: data.corretorIds },
          organizacaoId,
          ativo: true
        }
      });

      if (corretores.length !== data.corretorIds.length) {
        res.status(400).json({
          error: 'Corretores inválidos',
          message: 'Alguns corretores especificados não foram encontrados'
        });
        return;
      }

      const regiaoAtualizada = await prisma.regiaoAtendimento.update({
        where: { id },
        data: {
          ...updateData,
          corretores: {
            set: data.corretorIds.map(corretorId => ({ id: corretorId }))
          }
        },
        include: {
          corretores: {
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

      res.json({
        message: 'Região atualizada com sucesso',
        data: regiaoAtualizada
      });
    } else {
      const regiaoAtualizada = await prisma.regiaoAtendimento.update({
        where: { id },
        data: updateData,
        include: {
          corretores: {
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

      res.json({
        message: 'Região atualizada com sucesso',
        data: regiaoAtualizada
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Dados inválidos',
        details: error.errors
      });
      return;
    }

    console.error('Erro ao atualizar região:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao atualizar região'
    });
  }
};

// Deletar região
export const deleteRegiao = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { organizacaoId } = req.user!;

    const regiao = await prisma.regiaoAtendimento.findFirst({
      where: {
        id,
        organizacaoId
      }
    });

    if (!regiao) {
      res.status(404).json({
        error: 'Região não encontrada',
        message: 'A região especificada não foi encontrada'
      });
      return;
    }

    await prisma.regiaoAtendimento.delete({
      where: { id }
    });

    res.json({
      message: 'Região removida com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar região:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao remover região'
    });
  }
};

// ========================================
// SISTEMA DE DISTRIBUIÇÃO
// ========================================

// Distribuir lead automaticamente
export const distribuirLead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { leadId } = req.params;
    const { organizacaoId } = req.user!;

    const lead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        organizacaoId
      },
      include: {
        pessoa: true,
        distribuicao: true
      }
    });

    if (!lead) {
      res.status(404).json({
        error: 'Lead não encontrado',
        message: 'O lead especificado não foi encontrado'
      });
      return;
    }

    if (lead.distribuicao) {
      res.status(400).json({
        error: 'Lead já distribuído',
        message: 'Este lead já foi distribuído para um corretor'
      });
      return;
    }

    // Extrair DDD do telefone do lead
    const ddd = extrairDDD(lead.pessoa.telefone);
    if (!ddd) {
      res.status(400).json({
        error: 'Telefone inválido',
        message: 'Não foi possível extrair o DDD do telefone do lead'
      });
      return;
    }

    // Buscar região que atende este DDD
    const regiao = await prisma.regiaoAtendimento.findFirst({
      where: {
        organizacaoId,
        ativo: true,
        ddds: {
          has: ddd
        }
      },
      include: {
        corretores: {
          where: {
            ativo: true,
            recebendoLeads: true,
            statusAtendimento: { in: ['DISPONIVEL', 'OCUPADO'] }
          }
        }
      }
    });

    if (!regiao || regiao.corretores.length === 0) {
      res.status(404).json({
        error: 'Nenhum corretor disponível',
        message: `Não há corretores disponíveis para atender leads da região (DDD ${ddd})`
      });
      return;
    }

    // Verificar se há plantonistas ativos
    const agora = new Date();
    const diaSemanaAtual = agora.getDay() || 7;

    const plantonistaAtivos = await prisma.escalaPlantao.findMany({
      where: {
        organizacaoId,
        ativo: true,
        status: 'ATIVO',
        receberLeads: true,
        dataInicio: { lte: agora },
        dataFim: { gte: agora },
        diaSemana: diaSemanaAtual,
        usuario: {
          id: { in: regiao.corretores.map(c => c.id) }
        }
      },
      include: {
        usuario: true
      },
      orderBy: { prioridade: 'desc' }
    });

    // Definir lista de corretores candidatos (plantonistas primeiro)
    const corretoresCandidatos = plantonistaAtivos.length > 0 
      ? plantonistaAtivos.map(p => p.usuario)
      : regiao.corretores;

    // Selecionar corretor baseado no tipo de distribuição
    let corretorSelecionado;

    switch (regiao.distribuicaoTipo) {
      case 'ROUND_ROBIN':
        corretorSelecionado = await selecionarCorretorRoundRobin(corretoresCandidatos, organizacaoId);
        break;
      case 'PRIORIDADE':
        corretorSelecionado = await selecionarCorretorPorPrioridade(corretoresCandidatos, organizacaoId);
        break;
      case 'DISPONIBILIDADE':
        corretorSelecionado = selecionarCorretorPorDisponibilidade(corretoresCandidatos);
        break;
      default:
        corretorSelecionado = corretoresCandidatos[0];
    }

    if (!corretorSelecionado) {
      res.status(404).json({
        error: 'Nenhum corretor disponível',
        message: 'Não foi possível encontrar um corretor disponível para distribuição'
      });
      return;
    }

    // Criar registro de distribuição
    const distribuicao = await prisma.distribuicaoLead.create({
      data: {
        leadId,
        usuarioId: corretorSelecionado.id,
        regiaoId: regiao.id,
        automatica: true,
        emPlantao: plantonistaAtivos.length > 0,
        escalaId: plantonistaAtivos.find(p => p.usuario.id === corretorSelecionado.id)?.id
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
        },
        regiao: {
          select: {
            id: true,
            nome: true,
            distribuicaoTipo: true
          }
        }
      }
    });

    res.json({
      message: 'Lead distribuído com sucesso',
      data: distribuicao
    });
  } catch (error) {
    console.error('Erro ao distribuir lead:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao distribuir lead'
    });
  }
};

// Função auxiliar: seleção Round Robin
const selecionarCorretorRoundRobin = async (corretores: any[], organizacaoId: string) => {
  // Buscar último corretor que recebeu lead
  const ultimaDistribuicao = await prisma.distribuicaoLead.findFirst({
    where: {
      usuario: {
        organizacaoId
      }
    },
    orderBy: { dataDistribuicao: 'desc' },
    include: { usuario: true }
  });

  if (!ultimaDistribuicao) {
    return corretores[0];
  }

  // Encontrar próximo corretor na lista
  const indiceAtual = corretores.findIndex(c => c.id === ultimaDistribuicao.usuarioId);
  const proximoIndice = (indiceAtual + 1) % corretores.length;
  
  return corretores[proximoIndice];
};

// Função auxiliar: seleção por prioridade
const selecionarCorretorPorPrioridade = async (corretores: any[], organizacaoId: string) => {
  // Buscar estatísticas de distribuição (quem recebeu menos leads)
  const estatisticas = await prisma.distribuicaoLead.groupBy({
    by: ['usuarioId'],
    where: {
      usuario: {
        organizacaoId,
        id: { in: corretores.map(c => c.id) }
      },
      dataDistribuicao: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Últimos 30 dias
      }
    },
    _count: {
      id: true
    },
    orderBy: {
      _count: {
        id: 'asc'
      }
    }
  });

  // Se nenhum corretor recebeu leads recentemente, usar primeiro da lista
  if (estatisticas.length === 0) {
    return corretores[0];
  }

  // Retornar corretor com menos leads distribuídos
  const corretorMenosLeads = corretores.find(c => 
    c.id === estatisticas[0].usuarioId
  );

  return corretorMenosLeads || corretores[0];
};

// Função auxiliar: seleção por disponibilidade
const selecionarCorretorPorDisponibilidade = (corretores: any[]) => {
  // Priorizar corretores com status "DISPONIVEL"
  const disponiveis = corretores.filter(c => c.statusAtendimento === 'DISPONIVEL');
  if (disponiveis.length > 0) {
    return disponiveis[0];
  }

  // Se nenhum disponível, usar qualquer um da lista
  return corretores[0];
};