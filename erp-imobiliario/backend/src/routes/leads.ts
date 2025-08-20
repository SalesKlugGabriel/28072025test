import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken, requirePermission, requireOwnership } from '../middleware/auth';
import * as leadController from '../controllers/leadController';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// ===== ROTAS DE LEADS =====
/**
 * @route GET /api/leads
 * @desc Listar leads com filtros e paginação
 * @access Private (CRM)
 */
router.get('/', 
  requirePermission('crm'),
  asyncHandler(leadController.getLeads)
);

/**
 * @route POST /api/leads
 * @desc Criar novo lead
 * @access Private (CRM)
 */
router.post('/', 
  requirePermission('crm'),
  asyncHandler(leadController.createLead)
);

/**
 * @route GET /api/leads/stats
 * @desc Estatísticas dos leads
 * @access Private (CRM)
 */
router.get('/stats',
  requirePermission('crm'),
  asyncHandler(leadController.getLeadStats)
);

/**
 * @route GET /api/leads/pipeline/:pipeline
 * @desc Leads de um pipeline específico
 * @access Private (CRM)
 */
router.get('/pipeline/:pipeline',
  requirePermission('crm'),
  asyncHandler(leadController.getLeadsByPipeline)
);

/**
 * @route GET /api/leads/:id
 * @desc Buscar lead por ID
 * @access Private (CRM)
 */
router.get('/:id',
  requirePermission('crm'),
  asyncHandler(leadController.getLeadById)
);

/**
 * @route PUT /api/leads/:id
 * @desc Atualizar lead
 * @access Private (CRM + Ownership)
 */
router.put('/:id',
  requirePermission('crm'),
  requireOwnership('responsavelCRM'),
  asyncHandler(leadController.updateLead)
);

/**
 * @route PATCH /api/leads/:id/pipeline
 * @desc Mover lead no pipeline
 * @access Private (CRM + Ownership)
 */
router.patch('/:id/pipeline',
  requirePermission('crm'),
  requireOwnership('responsavelCRM'),
  asyncHandler(leadController.updateLeadPipeline)
);

/**
 * @route PATCH /api/leads/:id/status
 * @desc Atualizar status do lead
 * @access Private (CRM + Ownership)
 */
router.patch('/:id/status',
  requirePermission('crm'),
  requireOwnership('responsavelCRM'),
  asyncHandler(leadController.updateLeadStatus)
);

/**
 * @route DELETE /api/leads/:id
 * @desc Deletar lead (soft delete)
 * @access Private (CRM + Ownership)
 */
router.delete('/:id',
  requirePermission('crm'),
  requireOwnership('responsavelCRM'),
  asyncHandler(leadController.deleteLead)
);

/**
 * @route POST /api/leads/:id/convert
 * @desc Converter lead para cliente
 * @access Private (CRM + Ownership)
 */
router.post('/:id/convert',
  requirePermission('crm'),
  requireOwnership('responsavelCRM'),
  asyncHandler(leadController.convertLeadToClient)
);

/**
 * @route GET /api/leads/:id/suggested-properties
 * @desc Buscar imóveis sugeridos para o lead
 * @access Private (CRM + Empreendimentos)
 */
router.get('/:id/suggested-properties',
  requirePermission('crm'),
  requirePermission('empreendimentos'),
  asyncHandler(leadController.getSuggestedProperties)
);

/**
 * @route POST /api/leads/:id/interaction
 * @desc Registrar interação com lead
 * @access Private (CRM + Ownership)
 */
router.post('/:id/interaction',
  requirePermission('crm'),
  requireOwnership('responsavelCRM'),
  asyncHandler(leadController.addInteraction)
);

/**
 * @route GET /api/leads/:id/interactions
 * @desc Buscar histórico de interações
 * @access Private (CRM + Ownership)
 */
router.get('/:id/interactions',
  requirePermission('crm'),
  requireOwnership('responsavelCRM'),
  asyncHandler(leadController.getInteractions)
);

/**
 * @route POST /api/leads/import
 * @desc Importar leads em lote
 * @access Private (CRM)
 */
router.post('/import',
  requirePermission('crm'),
  asyncHandler(leadController.importLeads)
);

/**
 * @route POST /api/leads/bulk-action
 * @desc Ações em massa nos leads
 * @access Private (CRM)
 */
router.post('/bulk-action',
  requirePermission('crm'),
  asyncHandler(leadController.bulkAction)
);

export default router;