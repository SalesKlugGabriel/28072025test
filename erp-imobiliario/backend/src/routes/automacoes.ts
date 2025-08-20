import { Router } from 'express';
import { z } from 'zod';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateSchema, validateParams, validateQuery, commonSchemas } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import * as automacaoController from '../controllers/automacaoController';

const router = Router();

// Aplicar autenticação em todas as rotas
router.use(authenticateToken);

// ===== AUTOMAÇÕES =====

// GET /api/automacoes - Listar automações
router.get('/',
  validateQuery(z.object({
    boardId: z.string().uuid().optional(),
    ativo: z.enum(['true', 'false']).optional()
  })),
  asyncHandler(automacaoController.listAutomacoes)
);

// POST /api/automacoes - Criar automação
router.post('/',
  requireRole('ADMIN', 'GERENTE'),
  asyncHandler(automacaoController.createAutomacao)
);

// GET /api/automacoes/:id - Obter automação por ID
router.get('/:id',
  validateParams(commonSchemas.id),
  asyncHandler(automacaoController.getAutomacaoById)
);

// PUT /api/automacoes/:id - Atualizar automação
router.put('/:id',
  validateParams(commonSchemas.id),
  requireRole('ADMIN', 'GERENTE'),
  asyncHandler(automacaoController.updateAutomacao)
);

// DELETE /api/automacoes/:id - Deletar automação
router.delete('/:id',
  validateParams(commonSchemas.id),
  requireRole('ADMIN', 'GERENTE'),
  asyncHandler(automacaoController.deleteAutomacao)
);

// POST /api/automacoes/:id/execute - Executar automação manualmente
router.post('/:id/execute',
  validateParams(commonSchemas.id),
  validateSchema(z.object({
    leadId: z.string().uuid()
  })),
  asyncHandler(automacaoController.executeAutomacao)
);

// ===== TEMPLATES =====

// GET /api/automacoes/templates - Listar templates
router.get('/templates/list',
  validateQuery(z.object({
    categoria: z.enum(['VENDAS', 'ATENDIMENTO', 'COBRANCA', 'FOLLOW_UP']).optional()
  })),
  asyncHandler(automacaoController.listTemplates)
);

// POST /api/automacoes/templates/create - Criar automação a partir de template
router.post('/templates/create',
  validateSchema(z.object({
    templateId: z.string().uuid(),
    boardId: z.string().uuid(),
    nome: z.string().optional(),
    personalizacoes: z.record(z.any()).optional()
  })),
  requireRole('ADMIN', 'GERENTE'),
  asyncHandler(automacaoController.createFromTemplate)
);

export default router;