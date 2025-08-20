import winston from 'winston';
import path from 'path';

// Formato customizado para logs
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    // Adicionar stack trace para erros
    if (stack) {
      log += `\n${stack}`;
    }
    
    // Adicionar metadados se existirem
    if (Object.keys(meta).length > 0) {
      log += `\n${JSON.stringify(meta, null, 2)}`;
    }
    
    return log;
  })
);

// Configuração dos transportes
const transports: winston.transport[] = [
  // Console (desenvolvimento)
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      logFormat
    )
  })
];

// Em produção, adicionar arquivo de log
if (process.env.NODE_ENV === 'production') {
  const logDir = process.env.LOG_DIR || 'logs';
  
  transports.push(
    // Arquivo para todos os logs
    new winston.transports.File({
      filename: path.join(logDir, 'app.log'),
      format: logFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // Arquivo específico para erros
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: logFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

// Criar instância do logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports,
  exitOnError: false
});

// Função auxiliar para log de requisições
export const logRequest = (req: any, res: any, responseTime: number) => {
  const { method, url, ip, headers } = req;
  const { statusCode } = res;
  
  logger.info('HTTP Request', {
    method,
    url,
    ip,
    userAgent: headers['user-agent'],
    statusCode,
    responseTime: `${responseTime}ms`,
    userId: req.user?.id || 'anonymous'
  });
};

// Função auxiliar para log de erros
export const logError = (error: Error, req?: any) => {
  const errorLog: any = {
    message: error.message,
    stack: error.stack,
  };
  
  if (req) {
    errorLog.request = {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      userId: req.user?.id || 'anonymous'
    };
  }
  
  logger.error('Application Error', errorLog);
};

// Função auxiliar para log de auditoria
export const logAudit = (action: string, resource: string, userId?: string, details?: any) => {
  logger.info('Audit Log', {
    action,
    resource,
    userId: userId || 'system',
    details,
    timestamp: new Date().toISOString()
  });
};

// Aliases para compatibilidade
export const logInfo = (message: string, meta?: any) => logger.info(message, meta);
export const logWarn = (message: string, meta?: any) => logger.warn(message, meta);
export const logDebug = (message: string, meta?: any) => logger.debug(message, meta);

export default logger;