import { Router } from 'express';
import { z } from 'zod';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateSchema, validateQuery } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import * as relatorioController from '../controllers/relatorioController';

const router = Router();

// Aplicar autenticação em todas as rotas
router.use(authenticateToken);

// ===== DASHBOARD =====

// GET /api/relatorios/dashboard - Dashboard principal
router.get('/dashboard',
  validateQuery(z.object({
    periodo: z.enum(['7d', '30d', '90d', '1y']).default('30d')
  })),
  asyncHandler(relatorioController.getDashboard)
);

// ===== RELATÓRIOS DE VENDAS =====

// GET /api/relatorios/vendas - Relatório de vendas
router.get('/vendas',
  validateQuery(z.object({
    dataInicio: z.string().datetime(),
    dataFim: z.string().datetime(),
    empreendimentoId: z.string().uuid().optional(),
    tipo: z.enum(['RESUMO', 'DETALHADO']).default('RESUMO')
  })),
  requireRole('ADMIN', 'GERENTE', 'CORRETOR'),
  asyncHandler(relatorioController.getRelatorioVendas)
);

// ===== RELATÓRIOS DE LEADS =====

// GET /api/relatorios/leads - Relatório de leads
router.get('/leads',
  validateQuery(z.object({
    dataInicio: z.string().datetime(),
    dataFim: z.string().datetime(),
    origem: z.enum(['SITE', 'WHATSAPP', 'TELEFONE', 'INDICACAO', 'REDES_SOCIAIS', 'OUTROS']).optional(),
    status: z.enum(['NOVO', 'CONTATO_REALIZADO', 'AGUARDANDO_RESPOSTA', 'INTERESSADO', 'NAO_INTERESSADO']).optional()
  })),
  requireRole('ADMIN', 'GERENTE', 'CORRETOR'),
  asyncHandler(relatorioController.getRelatorioLeads)
);

// ===== RELATÓRIOS DE EMPREENDIMENTOS =====

// GET /api/relatorios/empreendimentos - Relatório de empreendimentos
router.get('/empreendimentos',
  validateQuery(z.object({
    dataInicio: z.string().datetime(),
    dataFim: z.string().datetime()
  })),
  requireRole('ADMIN', 'GERENTE'),
  asyncHandler(relatorioController.getRelatorioEmpreendimentos)
);

// ===== TEMPLATES E EXPORTS =====

// GET /api/relatorios/templates - Listar templates
router.get('/templates',
  requireRole('ADMIN', 'GERENTE', 'CORRETOR'),
  asyncHandler(relatorioController.getTemplatesRelatorios)
);

// POST /api/relatorios/gerar - Gerar relatório
router.post('/gerar',
  validateSchema(z.object({
    templateId: z.string(),
    formato: z.enum(['PDF', 'EXCEL']),
    parametros: z.record(z.any())
  })),
  requireRole('ADMIN', 'GERENTE', 'CORRETOR'),
  asyncHandler(relatorioController.gerarRelatorio)
);

export default router;