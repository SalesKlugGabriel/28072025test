import { Request, Response, NextFunction } from 'express';
import { logError } from '../utils/logger';
import { ApiResponse } from '../types';

// Interface para erros customizados
export interface CustomError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  details?: any;
}

// Classe para erros de aplicação
export class AppError extends Error implements CustomError {
  public statusCode: number;
  public isOperational: boolean;
  public details?: any;

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Classe para erros de validação
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, details);
    this.name = 'ValidationError';
  }
}

// Classe para erros de autorização
export class AuthorizationError extends AppError {
  constructor(message: string = 'Acesso negado') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

// Classe para erros de autenticação
export class AuthenticationError extends AppError {
  constructor(message: string = 'Token inválido ou expirado') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

// Classe para erros de não encontrado
export class NotFoundError extends AppError {
  constructor(resource: string = 'Recurso') {
    super(`${resource} não encontrado`, 404);
    this.name = 'NotFoundError';
  }
}

// Classe para erros de conflito
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

// Função para determinar se o erro é operacional
const isOperationalError = (error: CustomError): boolean => {
  return error.isOperational || false;
};

// Função para tratar erros do banco de dados
const handleDatabaseError = (error: any): AppError => {
  // Erro de violação de chave única (duplicate key)
  if (error.code === '23505') {
    const match = error.detail?.match(/Key \((.+)\)=\((.+)\) already exists/);
    if (match) {
      const field = match[1];
      const value = match[2];
      return new ConflictError(`${field} '${value}' já está em uso`);
    }
    return new ConflictError('Dados duplicados');
  }

  // Erro de violação de foreign key
  if (error.code === '23503') {
    return new ValidationError('Referência inválida nos dados fornecidos');
  }

  // Erro de violação de not null
  if (error.code === '23502') {
    const column = error.column || 'campo obrigatório';
    return new ValidationError(`${column} é obrigatório`);
  }

  // Erro de tipo de dados inválido
  if (error.code === '22P02') {
    return new ValidationError('Formato de dados inválido');
  }

  // Erro genérico de banco
  return new AppError('Erro interno do banco de dados', 500);
};

// Função para tratar erros de JWT
const handleJWTError = (error: any): AppError => {
  if (error.name === 'JsonWebTokenError') {
    return new AuthenticationError('Token inválido');
  }
  
  if (error.name === 'TokenExpiredError') {
    return new AuthenticationError('Token expirado');
  }
  
  return new AuthenticationError('Erro de autenticação');
};

// Função para tratar erros de validação do Joi/Zod
const handleValidationError = (error: any): AppError => {
  const errors = error.details || error.errors || [];
  const messages = errors.map((err: any) => {
    return err.message || err.path?.join('.') + ' é inválido';
  });
  
  return new ValidationError('Dados inválidos', {
    fields: messages,
    original: error
  });
};

// Middleware principal de tratamento de erros
export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let handledError: AppError;

  // Log do erro original
  logError(error, req);

  // Determinar o tipo de erro e criar resposta apropriada
  if (error instanceof AppError) {
    handledError = error;
  } else if (error.name === 'ValidationError' || error.name === 'ZodError') {
    handledError = handleValidationError(error);
  } else if (error.name?.includes('JWT') || error.name?.includes('Token')) {
    handledError = handleJWTError(error);
  } else if (error.code && error.code.startsWith('23')) {
    handledError = handleDatabaseError(error);
  } else {
    // Erro não tratado - não expor detalhes em produção
    const message = process.env.NODE_ENV === 'production' 
      ? 'Erro interno do servidor' 
      : error.message || 'Erro desconhecido';
    
    handledError = new AppError(message, 500);
  }

  // Construir resposta de erro
  const response: ApiResponse = {
    success: false,
    message: handledError.message,
  };

  // Adicionar detalhes em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    response.errors = [handledError.stack || ''];
    if (handledError.details) {
      response.data = handledError.details;
    }
  } else if (handledError.details && isOperationalError(handledError)) {
    // Em produção, só mostrar detalhes de erros operacionais
    response.data = handledError.details;
  }

  // Enviar resposta
  res.status(handledError.statusCode).json(response);
};

// Middleware para capturar erros assíncronos
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Middleware 404
export const notFoundHandler = (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: false,
    message: `Rota ${req.method} ${req.path} não encontrada`,
  };
  
  res.status(404).json(response);
};