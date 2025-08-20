import { Router } from 'express';
import { z } from 'zod';
import { authenticateToken, requireOwnership } from '../middleware/auth';
import { validateSchema, validateParams, validateQuery, commonSchemas } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import * as pessoaController from '../controllers/pessoaController';

const router = Router();

// Aplicar autenticação em todas as rotas
router.use(authenticateToken);

// GET /api/pessoas/stats - Estatísticas de pessoas
router.get('/stats', asyncHandler(pessoaController.getPessoaStats));

// GET /api/pessoas - Listar pessoas com filtros
router.get('/', 
  validateQuery(commonSchemas.pagination.merge(commonSchemas.search)),
  asyncHandler(pessoaController.listPessoas)
);

// POST /api/pessoas/:tipo - Criar pessoa (lead, cliente, fornecedor)
router.post('/:tipo',
  validateParams(commonSchemas.id.partial().extend({
    tipo: z.enum(['lead', 'cliente', 'fornecedor'])
  })),
  asyncHandler(pessoaController.createPessoa)
);

// GET /api/pessoas/:id - Obter pessoa por ID
router.get('/:id',
  validateParams(commonSchemas.id),
  requireOwnership('userId'),
  asyncHandler(pessoaController.getPessoaById)
);

// PUT /api/pessoas/:id - Atualizar pessoa
router.put('/:id',
  validateParams(commonSchemas.id),
  requireOwnership('userId'),
  asyncHandler(pessoaController.updatePessoa)
);

// POST /api/pessoas/:id/convert - Converter lead para cliente
router.post('/:id/convert',
  validateParams(commonSchemas.id),
  requireOwnership('userId'),
  asyncHandler(pessoaController.convertLeadToClient)
);

// DELETE /api/pessoas/:id - Deletar pessoa (soft delete)
router.delete('/:id',
  validateParams(commonSchemas.id),
  requireOwnership('userId'),
  asyncHandler(pessoaController.deletePessoa)
);

export default router;