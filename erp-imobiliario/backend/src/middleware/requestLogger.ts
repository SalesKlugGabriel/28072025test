import { Request, Response, NextFunction } from 'express';
import { logRequest } from '../utils/logger';

// Interface estendida para Request com timing
interface TimedRequest extends Request {
  startTime?: number;
}

// Middleware para logging de requisições
export const requestLogger = (req: TimedRequest, res: Response, next: NextFunction): void => {
  // Marcar início da requisição
  req.startTime = Date.now();

  // Capturar o final da resposta
  const originalSend = res.send;
  
  res.send = function(body: any) {
    const responseTime = Date.now() - (req.startTime || 0);
    
    // Log da requisição apenas se não for health check
    if (!req.path.includes('/health')) {
      logRequest(req, res, responseTime);
    }
    
    // Restaurar método original e enviar resposta
    return originalSend.call(this, body);
  };

  next();
};