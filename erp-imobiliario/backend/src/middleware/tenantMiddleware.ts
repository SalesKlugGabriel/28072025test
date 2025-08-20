import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    organizacaoId: string;
    perfil: string;
    email: string;
    nome: string;
  };
  organizacao?: {
    id: string;
    nome: string;
    ativa: boolean;
    plano: string;
  };
}

// Middleware para autenticação e isolamento de tenant
export const authenticateAndIsolateTenant = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        error: 'Token não fornecido',
        message: 'Acesso negado. Token de autenticação obrigatório.'
      });
      return;
    }

    // Verificar token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;

    // Buscar usuário completo com organização
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.id,
        ativo: true
      },
      include: {
        organizacao: {
          select: {
            id: true,
            nome: true,
            ativa: true,
            plano: true,
            limiteUsuarios: true,
            _count: {
              select: {
                usuarios: {
                  where: { ativo: true }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      res.status(401).json({
        error: 'Usuário não encontrado',
        message: 'Token inválido ou usuário inativo'
      });
      return;
    }

    if (!user.organizacao) {
      res.status(401).json({
        error: 'Organização não encontrada',
        message: 'Usuário não está associado a uma organização ativa'
      });
      return;
    }

    if (!user.organizacao.ativa) {
      res.status(403).json({
        error: 'Organização inativa',
        message: 'Sua organização está suspensa. Entre em contato com o suporte.'
      });
      return;
    }

    // Adicionar informações do usuário e organização à requisição
    req.user = {
      id: user.id,
      organizacaoId: user.organizacaoId,
      perfil: user.perfil,
      email: user.email,
      nome: user.nome
    };

    req.organizacao = {
      id: user.organizacao.id,
      nome: user.organizacao.nome,
      ativa: user.organizacao.ativa,
      plano: user.organizacao.plano
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        error: 'Token inválido',
        message: 'Token de autenticação inválido ou expirado'
      });
      return;
    }

    console.error('Erro no middleware de autenticação:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao processar autenticação'
    });
  }
};

// Middleware para verificar permissões administrativas
export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      error: 'Usuário não autenticado',
      message: 'Faça login para continuar'
    });
    return;
  }

  if (req.user.perfil !== 'ADMINISTRADOR' && req.user.perfil !== 'GERENTE') {
    res.status(403).json({
      error: 'Acesso negado',
      message: 'Apenas administradores e gerentes podem acessar este recurso'
    });
    return;
  }

  next();
};

// Middleware para verificar permissões gerenciais
export const requireManager = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      error: 'Usuário não autenticado',
      message: 'Faça login para continuar'
    });
    return;
  }

  if (!['ADMINISTRADOR', 'GERENTE', 'SUPERVISOR'].includes(req.user.perfil)) {
    res.status(403).json({
      error: 'Acesso negado',
      message: 'Permissões insuficientes para acessar este recurso'
    });
    return;
  }

  next();
};

// Middleware para verificar limites do plano
export const checkPlanLimits = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.organizacao) {
      res.status(400).json({
        error: 'Organização não identificada',
        message: 'Não foi possível identificar a organização'
      });
      return;
    }

    // Definir limites por plano
    const planLimits: { [key: string]: { usuarios: number; leads: number; } } = {
      'BASICO': { usuarios: 5, leads: 1000 },
      'PROFISSIONAL': { usuarios: 25, leads: 5000 },
      'EMPRESARIAL': { usuarios: 100, leads: -1 }, // -1 = ilimitado
      'TESTE': { usuarios: 3, leads: 100 }
    };

    const limites = planLimits[req.organizacao.plano] || planLimits['BASICO'];

    // Verificar limite de usuários (apenas para rotas de criação de usuário)
    if (req.method === 'POST' && req.path.includes('/users')) {
      const totalUsuarios = await prisma.user.count({
        where: {
          organizacaoId: req.organizacao.id,
          ativo: true
        }
      });

      if (totalUsuarios >= limites.usuarios) {
        res.status(403).json({
          error: 'Limite de usuários excedido',
          message: `Seu plano ${req.organizacao.plano} permite até ${limites.usuarios} usuários. Faça upgrade para adicionar mais usuários.`,
          currentCount: totalUsuarios,
          maxAllowed: limites.usuarios
        });
        return;
      }
    }

    // Verificar limite de leads (apenas para rotas de criação de lead)
    if (req.method === 'POST' && req.path.includes('/leads') && limites.leads > 0) {
      const totalLeads = await prisma.lead.count({
        where: {
          organizacaoId: req.organizacao.id,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) // Este mês
          }
        }
      });

      if (totalLeads >= limites.leads) {
        res.status(403).json({
          error: 'Limite mensal de leads excedido',
          message: `Seu plano ${req.organizacao.plano} permite até ${limites.leads} leads por mês. Faça upgrade para processar mais leads.`,
          currentCount: totalLeads,
          maxAllowed: limites.leads
        });
        return;
      }
    }

    next();
  } catch (error) {
    console.error('Erro ao verificar limites do plano:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao verificar limites do plano'
    });
  }
};

// Middleware para log de auditoria
export const auditLog = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  // Capturar dados da resposta para log
  const originalSend = res.send;
  const originalJson = res.json;

  res.send = function(data) {
    logAction(req, res.statusCode, data);
    return originalSend.call(this, data);
  };

  res.json = function(data) {
    logAction(req, res.statusCode, data);
    return originalJson.call(this, data);
  };

  next();
};

// Função auxiliar para log de auditoria
const logAction = async (req: AuthenticatedRequest, statusCode: number, responseData: any) => {
  try {
    if (!req.user || statusCode >= 500) return; // Não logar erros internos

    // Apenas logar operações importantes (CREATE, UPDATE, DELETE)
    const importantActions = ['POST', 'PUT', 'PATCH', 'DELETE'];
    if (!importantActions.includes(req.method)) return;

    // Extrair ID do recurso da URL ou do body
    const resourceId = req.params.id || 
                      (req.body && req.body.id) || 
                      (responseData && typeof responseData === 'object' && responseData.data && responseData.data.id);

    await prisma.auditLog.create({
      data: {
        usuarioId: req.user.id,
        organizacaoId: req.user.organizacaoId,
        acao: `${req.method} ${req.path}`,
        recurso: req.path.split('/')[1] || 'unknown',
        recursoId: resourceId || null,
        dadosAntigos: null, // Implementar se necessário
        dadosNovos: req.method !== 'DELETE' ? JSON.stringify(req.body) : null,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent') || null,
        statusCode
      }
    }).catch(error => {
      console.error('Erro ao salvar log de auditoria:', error);
    });
  } catch (error) {
    console.error('Erro no log de auditoria:', error);
  }
};

// Middleware para rate limiting por organização
export const rateLimitByOrganization = (requestsPerMinute: number = 100) => {
  const requestCounts: { [key: string]: { count: number; resetTime: number } } = {};

  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.organizacao) {
      res.status(400).json({
        error: 'Organização não identificada',
        message: 'Não foi possível identificar a organização'
      });
      return;
    }

    const now = Date.now();
    const windowStart = Math.floor(now / 60000) * 60000; // Janela de 1 minuto
    const key = req.organizacao.id;

    if (!requestCounts[key] || requestCounts[key].resetTime !== windowStart) {
      requestCounts[key] = { count: 1, resetTime: windowStart };
    } else {
      requestCounts[key].count++;
    }

    if (requestCounts[key].count > requestsPerMinute) {
      res.status(429).json({
        error: 'Muitas requisições',
        message: `Limite de ${requestsPerMinute} requisições por minuto excedido`,
        resetTime: new Date(windowStart + 60000).toISOString()
      });
      return;
    }

    next();
  };
};

export default {
  authenticateAndIsolateTenant,
  requireAdmin,
  requireManager,
  checkPlanLimits,
  auditLog,
  rateLimitByOrganization
};