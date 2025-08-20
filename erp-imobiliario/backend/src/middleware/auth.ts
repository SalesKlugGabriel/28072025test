import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';

// Interface estendida para Request com usuário
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    perfil: string;
  };
}

// Middleware de autenticação JWT
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ error: 'Token de acesso requerido' });
      return;
    }

    // Verificar e decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Buscar usuário no banco de dados
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, perfil: true, ativo: true }
    });
    
    if (!user || !user.ativo) {
      res.status(401).json({ error: 'Usuário inválido ou inativo' });
      return;
    }

    // Anexar usuário à requisição
    req.user = { id: user.id, email: user.email, perfil: user.perfil };
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token inválido' });
    return;
  }
};

// Middleware para verificar perfis específicos  
export const requireRole = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Usuário não autenticado' });
      return;
    }

    if (!roles.includes(req.user.perfil)) {
      res.status(403).json({ error: `Acesso restrito aos perfis: ${roles.join(', ')}` });
      return;
    }

    next();
  };
};

// Middleware para verificar se é gerente ou administrador
export const requireManagerOrAdmin = requireRole('GERENTE', 'ADMIN');

// Middleware para verificar se é apenas administrador
export const requireAdmin = requireRole('ADMIN');

// Alias para compatibilidade
export const requirePermission = requireRole;

// Middleware para verificar propriedade de recursos
export const requireOwnership = (resourceUserField: string = 'userId') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Usuário não autenticado' });
      return;
    }

    // Administradores podem acessar tudo
    if (req.user.perfil === 'ADMIN') {
      next();
      return;
    }

    // Verificar se o usuário pode acessar o recurso
    const resourceUserId = req.body[resourceUserField] || req.params.userId || req.query.userId;
    
    if (resourceUserId === req.user.id) {
      next();
      return;
    }

    res.status(403).json({ error: 'Acesso negado a este recurso' });
    return;
  };
};

// Middleware opcional de autenticação (não falha se não houver token)
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, perfil: true, ativo: true }
      });
      
      if (user && user.ativo) {
        req.user = { id: user.id, email: user.email, perfil: user.perfil };
      }
    }
  } catch (error) {
    // Ignorar erros de token em autenticação opcional
  }
  
  next();
};

