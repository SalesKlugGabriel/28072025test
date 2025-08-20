import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

// Middleware para validação de schemas Zod
export const validateSchema = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        res.status(400).json({
          error: 'Dados inválidos',
          details: errors
        });
        return;
      }
      next(error);
    }
  };
};

// Middleware para validação de query parameters
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        res.status(400).json({
          error: 'Parâmetros de consulta inválidos',
          details: errors
        });
        return;
      }
      next(error);
    }
  };
};

// Middleware para validação de parâmetros da URL
export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        res.status(400).json({
          error: 'Parâmetros da URL inválidos',
          details: errors
        });
        return;
      }
      next(error);
    }
  };
};

// Schemas comuns para reutilização
export const commonSchemas = {
  // ID UUID
  id: z.object({
    id: z.string().uuid('ID deve ser um UUID válido')
  }),

  // Paginação
  pagination: z.object({
    page: z.string().transform(val => parseInt(val) || 1).refine(val => val > 0, 'Página deve ser maior que 0'),
    limit: z.string().transform(val => parseInt(val) || 10).refine(val => val > 0 && val <= 100, 'Limite deve estar entre 1 e 100')
  }),

  // Filtros de data
  dateFilter: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional()
  }).refine(data => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  }, 'Data inicial deve ser anterior à data final'),

  // Busca de texto
  search: z.object({
    q: z.string().min(1, 'Termo de busca deve ter pelo menos 1 caracter').optional()
  })
};

// Middleware para sanitização básica
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Remover propriedades que começam com $ (prevenção de NoSQL injection)
  const sanitizeObject = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (!key.startsWith('$') && !key.startsWith('_')) {
        sanitized[key] = sanitizeObject(value);
      }
    }
    return sanitized;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  next();
};

// Middleware para limitar tamanho de uploads
export const limitFileSize = (maxSize: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.headers['content-length']) {
      const contentLength = parseInt(req.headers['content-length']);
      if (contentLength > maxSize) {
        res.status(413).json({
          error: 'Arquivo muito grande',
          maxSize: `${maxSize / 1024 / 1024}MB`
        });
        return;
      }
    }
    next();
  };
};