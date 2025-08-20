import { Router } from 'express';
import { z } from 'zod';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateSchema, validateParams, validateQuery, commonSchemas } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import * as empreendimentoController from '../controllers/empreendimentoController';

const router = Router();

// Aplicar autenticação em todas as rotas
router.use(authenticateToken);

// ===== ESTATÍSTICAS =====

// GET /api/empreendimentos/stats - Estatísticas gerais
router.get('/stats', asyncHandler(empreendimentoController.getEmpreendimentosStats));

// ===== EMPREENDIMENTOS =====

// GET /api/empreendimentos - Listar empreendimentos
router.get('/',
  validateQuery(commonSchemas.pagination.merge(commonSchemas.search).merge(z.object({
    tipo: z.enum(['RESIDENCIAL', 'COMERCIAL', 'MISTO']).optional(),
    status: z.enum(['LANCAMENTO', 'CONSTRUCAO', 'ENTREGA', 'CONCLUIDO']).optional(),
    cidade: z.string().optional(),
    estado: z.string().optional()
  }))),
  asyncHandler(empreendimentoController.listEmpreendimentos)
);

// POST /api/empreendimentos - Criar empreendimento
router.post('/',
  requireRole('ADMIN', 'GERENTE'),
  asyncHandler(empreendimentoController.createEmpreendimento)
);

// GET /api/empreendimentos/:id - Obter empreendimento por ID
router.get('/:id',
  validateParams(commonSchemas.id),
  asyncHandler(empreendimentoController.getEmpreendimentoById)
);

// PUT /api/empreendimentos/:id - Atualizar empreendimento
router.put('/:id',
  validateParams(commonSchemas.id),
  requireRole('ADMIN', 'GERENTE'),
  asyncHandler(empreendimentoController.updateEmpreendimento)
);

// DELETE /api/empreendimentos/:id - Deletar empreendimento
router.delete('/:id',
  validateParams(commonSchemas.id),
  requireRole('ADMIN', 'GERENTE'),
  asyncHandler(empreendimentoController.deleteEmpreendimento)
);

// ===== UNIDADES =====

// GET /api/empreendimentos/:empreendimentoId/unidades - Listar unidades
router.get('/:empreendimentoId/unidades',
  validateParams(z.object({ empreendimentoId: z.string().uuid() })),
  validateQuery(z.object({
    status: z.enum(['DISPONIVEL', 'RESERVADA', 'VENDIDA', 'INDISPONIVEL']).optional(),
    tipo: z.enum(['APARTAMENTO', 'CASA', 'LOJA', 'SALA', 'GALPAO']).optional()
  })),
  asyncHandler(empreendimentoController.listUnidades)
);

// POST /api/empreendimentos/:empreendimentoId/unidades - Criar unidade
router.post('/:empreendimentoId/unidades',
  validateParams(z.object({ empreendimentoId: z.string().uuid() })),
  requireRole('ADMIN', 'GERENTE'),
  asyncHandler(empreendimentoController.createUnidade)
);

// PUT /api/empreendimentos/unidades/:id - Atualizar unidade
router.put('/unidades/:id',
  validateParams(commonSchemas.id),
  requireRole('ADMIN', 'GERENTE'),
  asyncHandler(empreendimentoController.updateUnidade)
);

// ===== VENDAS =====

// GET /api/empreendimentos/vendas - Listar vendas
router.get('/vendas/list',
  validateQuery(z.object({
    empreendimentoId: z.string().uuid().optional(),
    clienteId: z.string().uuid().optional()
  })),
  asyncHandler(empreendimentoController.listVendas)
);

// POST /api/empreendimentos/vendas - Registrar venda
router.post('/vendas/registrar',
  requireRole('ADMIN', 'GERENTE', 'CORRETOR'),
  asyncHandler(empreendimentoController.registrarVenda)
);

// PUT /api/empreendimentos/vendas/:id/valorizacao - Atualizar valorização
router.put('/vendas/:id/valorizacao',
  validateParams(commonSchemas.id),
  validateSchema(z.object({
    novoValor: z.number().positive(),
    observacoes: z.string().optional()
  })),
  requireRole('ADMIN', 'GERENTE'),
  asyncHandler(empreendimentoController.atualizarValorizacao)
);

export default router;