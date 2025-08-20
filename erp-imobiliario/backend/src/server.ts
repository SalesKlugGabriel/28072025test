import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

// Importar rotas
import authRoutes from './routes/auth';
import pessoaRoutes from './routes/pessoas';
import crmRoutes from './routes/crm';
import automacaoRoutes from './routes/automacoes';
import empreendimentoRoutes from './routes/empreendimentos';
import relatorioRoutes from './routes/relatorios';
import whatsappRoutes from './routes/whatsapp';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ===== MIDDLEWARES DE SEGURANÇA =====
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Máximo 100 requests por IP
  message: {
    error: 'Muitas requisições. Tente novamente em alguns minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// ===== CORS =====
const corsOrigins = process.env.CORS_ORIGINS?.split(',') || [
  'http://localhost:5173', 
  'http://localhost:3000',
  'https://localhost:5173',
  'https://localhost:3000'
];

// Adicionar URLs do GitHub Codespaces se disponível
if (process.env.CODESPACE_NAME) {
  const codespaceName = process.env.CODESPACE_NAME;
  const domain = process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN || 'app.github.dev';
  corsOrigins.push(
    `https://${codespaceName}-5173.${domain}`,
    `https://${codespaceName}-3001.${domain}`,
    `https://${codespaceName}-3000.${domain}`
  );
}

app.use(cors({
  origin: true, // Permitir todas as origens temporariamente
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
}));

// ===== MIDDLEWARES GERAIS =====
app.use(compression()); // Compressão de respostas
app.use(express.json({ limit: '10mb' })); // Parser JSON
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parser URL encoded
app.use(requestLogger); // Log de requisições

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '3.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// ===== ROTAS DA API =====
app.use('/api/auth', authRoutes);
app.use('/api/pessoas', pessoaRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/automacoes', automacaoRoutes);
app.use('/api/empreendimentos', empreendimentoRoutes);
app.use('/api/relatorios', relatorioRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// ===== ROTA PRINCIPAL =====
app.get('/', (req, res) => {
  res.json({
    message: '🏢 LegaSys ERP 3.0 API',
    version: '3.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      pessoas: '/api/pessoas',
      crm: '/api/crm',
      automacoes: '/api/automacoes',
      empreendimentos: '/api/empreendimentos',
      relatorios: '/api/relatorios',
      whatsapp: '/api/whatsapp',
    },
  });
});

// ===== MIDDLEWARE DE ERRO =====
app.use(errorHandler);

// ===== ROTA 404 =====
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado',
    path: req.originalUrl,
  });
});

// ===== INICIALIZAÇÃO DO SERVIDOR =====
async function startServer() {
  try {
    // Testar conexão com banco de dados
    const dbConnected = await testConnection();
    if (!dbConnected) {
      logger.error('❌ Falha na conexão com o banco de dados');
      process.exit(1);
    }

    // Iniciar servidor (0.0.0.0 para Codespaces)
    const HOST = process.env.HOST || '0.0.0.0';
    const server = app.listen(PORT, HOST, () => {
      logger.info(`🚀 Servidor LegaSys ERP 3.0 rodando na porta ${PORT}`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🏠 Host: ${HOST}:${PORT}`);
      logger.info(`📋 Health check: http://localhost:${PORT}/health`);
      
      if (process.env.CODESPACE_NAME) {
        const codespaceName = process.env.CODESPACE_NAME;
        const domain = process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN || 'app.github.dev';
        logger.info(`🌐 Codespaces URL: https://${codespaceName}-${PORT}.${domain}`);
      }
      
      logger.info(`🔗 API Documentation: http://localhost:${PORT}/`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      logger.info(`${signal} recebido. Encerrando servidor...`);
      server.close(() => {
        logger.info('✅ Servidor encerrado com sucesso');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// ===== TRATAMENTO DE ERROS NÃO CAPTURADOS =====
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception thrown:', error);
  process.exit(1);
});

// Iniciar servidor
startServer();

export default app;