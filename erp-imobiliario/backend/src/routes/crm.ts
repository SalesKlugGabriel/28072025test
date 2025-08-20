import { Router } from 'express';
import { z } from 'zod';
import { authenticateToken, requireOwnership } from '../middleware/auth';
import { validateSchema, validateParams, validateQuery, commonSchemas } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import * as crmController from '../controllers/crmController';

const router = Router();

// Aplicar autenticação em todas as rotas
router.use(authenticateToken);

// ===== DASHBOARD =====

// GET /api/crm/stats - Estatísticas do CRM
router.get('/stats', asyncHandler(crmController.getCrmStats));

// ===== BOARDS =====

// GET /api/crm/boards - Listar boards
router.get('/boards', asyncHandler(crmController.listBoards));

// POST /api/crm/boards - Criar board
router.post('/boards', asyncHandler(crmController.createBoard));

// GET /api/crm/boards/:id - Obter board por ID
router.get('/boards/:id',
  validateParams(commonSchemas.id),
  asyncHandler(crmController.getBoardById)
);

// PUT /api/crm/boards/:id - Atualizar board
router.put('/boards/:id',
  validateParams(commonSchemas.id),
  asyncHandler(crmController.updateBoard)
);

// DELETE /api/crm/boards/:id - Deletar board
router.delete('/boards/:id',
  validateParams(commonSchemas.id),
  asyncHandler(crmController.deleteBoard)
);

// ===== ESTÁGIOS =====

// GET /api/crm/boards/:boardId/estagios - Listar estágios de um board
router.get('/boards/:boardId/estagios',
  validateParams(z.object({ boardId: z.string().uuid() })),
  asyncHandler(crmController.listEstagios)
);

// POST /api/crm/estagios - Criar estágio
router.post('/estagios', asyncHandler(crmController.createEstagio));

// PUT /api/crm/estagios/:id - Atualizar estágio
router.put('/estagios/:id',
  validateParams(commonSchemas.id),
  asyncHandler(crmController.updateEstagio)
);

// DELETE /api/crm/estagios/:id - Deletar estágio
router.delete('/estagios/:id',
  validateParams(commonSchemas.id),
  asyncHandler(crmController.deleteEstagio)
);

// ===== MOVIMENTAÇÕES =====

// POST /api/crm/movimentacoes - Mover lead entre estágios
router.post('/movimentacoes', asyncHandler(crmController.moveLeadToStage));

// GET /api/crm/leads/:leadId/movimentacoes - Listar movimentações de um lead
router.get('/leads/:leadId/movimentacoes',
  validateParams(z.object({ leadId: z.string().uuid() })),
  asyncHandler(crmController.getLeadMovimentacoes)
);

// ===== FOLLOW-UPS =====

// GET /api/crm/followups - Listar follow-ups
router.get('/followups',
  validateQuery(z.object({
    leadId: z.string().uuid().optional(),
    concluido: z.enum(['true', 'false']).optional()
  })),
  asyncHandler(crmController.listFollowUps)
);

// POST /api/crm/followups - Criar follow-up
router.post('/followups', asyncHandler(crmController.createFollowUp));

// PUT /api/crm/followups/:id/complete - Marcar follow-up como concluído
router.put('/followups/:id/complete',
  validateParams(commonSchemas.id),
  asyncHandler(crmController.completeFollowUp)
);

export default router;