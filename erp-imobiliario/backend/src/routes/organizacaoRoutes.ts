import express from 'express';
import {
  createOrganizacao,
  getOrganizacoes,
  getOrganizacaoById,
  updateOrganizacao,
  deactivateOrganizacao,
  getEstatisticasOrganizacao
} from '../controllers/organizacaoController';

import {
  createEscala,
  getEscalas,
  getEscalaById,
  updateEscala,
  deleteEscala,
  getUsuariosEmPlantao,
  ativarPlantao,
  finalizarPlantao
} from '../controllers/escalaController';

import {
  createRegiao,
  getRegioes,
  getRegiaoById,
  updateRegiao,
  deleteRegiao,
  distribuirLead
} from '../controllers/distribuicaoController';

import {
  authenticateAndIsolateTenant,
  requireAdmin,
  requireManager,
  checkPlanLimits,
  auditLog,
  rateLimitByOrganization
} from '../middleware/tenantMiddleware';

const router = express.Router();

// Aplicar middleware de rate limiting em todas as rotas
router.use(rateLimitByOrganization(200)); // 200 requisições por minuto por organização

// ========================================
// ROTAS DE GESTÃO DE ORGANIZAÇÕES (Super Admin)
// ========================================

// Criar nova organização (apenas super admin - sem auth middleware)
router.post('/', createOrganizacao);

// Rotas protegidas (super admin)
router.get('/', getOrganizacoes);
router.get('/:id', getOrganizacaoById);
router.put('/:id', updateOrganizacao);
router.delete('/:id', deactivateOrganizacao);
router.get('/:id/estatisticas', getEstatisticasOrganizacao);

// ========================================
// ROTAS COM ISOLAMENTO DE TENANT
// ========================================

// Aplicar middleware de autenticação e isolamento
router.use(authenticateAndIsolateTenant);
router.use(auditLog);

// ========================================
// ROTAS DE ESCALA DE PLANTÃO
// ========================================

const escalaRouter = express.Router();

// Rotas para gerentes criarem escalas
escalaRouter.post('/', requireManager, checkPlanLimits, createEscala);
escalaRouter.get('/', getEscalas);
escalaRouter.get('/plantao/ativos', getUsuariosEmPlantao);
escalaRouter.get('/:id', getEscalaById);
escalaRouter.put('/:id', requireManager, updateEscala);
escalaRouter.delete('/:id', requireManager, deleteEscala);

// Rotas para corretores ativarem/finalizarem plantão
escalaRouter.post('/:id/ativar', ativarPlantao);
escalaRouter.post('/:id/finalizar', finalizarPlantao);

router.use('/escala', escalaRouter);

// ========================================
// ROTAS DE REGIÕES E DISTRIBUIÇÃO
// ========================================

const distribuicaoRouter = express.Router();

// Gestão de regiões (apenas gerentes)
distribuicaoRouter.post('/regioes', requireManager, checkPlanLimits, createRegiao);
distribuicaoRouter.get('/regioes', getRegioes);
distribuicaoRouter.get('/regioes/:id', getRegiaoById);
distribuicaoRouter.put('/regioes/:id', requireManager, updateRegiao);
distribuicaoRouter.delete('/regioes/:id', requireManager, deleteRegiao);

// Distribuição automática de leads
distribuicaoRouter.post('/leads/:leadId/distribuir', distribuirLead);

router.use('/distribuicao', distribuicaoRouter);

// ========================================
// ROTAS DE GESTÃO DE USUÁRIOS DA ORGANIZAÇÃO
// ========================================

const usuariosRouter = express.Router();

// Listar usuários da organização
usuariosRouter.get('/', (req, res) => {
  // Será implementado no controller organizacao
  res.json({ message: 'Lista de usuários da organização' });
});

// Criar novo usuário na organização (apenas admin/gerente)
usuariosRouter.post('/', requireManager, checkPlanLimits, (req, res) => {
  // Será implementado no controller organizacao
  res.json({ message: 'Criar usuário na organização' });
});

// Atualizar usuário
usuariosRouter.put('/:userId', requireManager, (req, res) => {
  // Será implementado no controller organizacao
  res.json({ message: 'Atualizar usuário da organização' });
});

// Desativar usuário
usuariosRouter.delete('/:userId', requireAdmin, (req, res) => {
  // Será implementado no controller organizacao
  res.json({ message: 'Desativar usuário da organização' });
});

router.use('/usuarios', usuariosRouter);

// ========================================
// ROTAS DE CONFIGURAÇÕES DA ORGANIZAÇÃO
// ========================================

const configRouter = express.Router();

// Obter configurações atuais
configRouter.get('/', (req, res) => {
  res.json({ message: 'Configurações da organização' });
});

// Atualizar configurações (apenas admin)
configRouter.put('/', requireAdmin, (req, res) => {
  res.json({ message: 'Atualizar configurações' });
});

// Configurações específicas
configRouter.get('/whatsapp', (req, res) => {
  res.json({ message: 'Configurações WhatsApp' });
});

configRouter.put('/whatsapp', requireAdmin, (req, res) => {
  res.json({ message: 'Atualizar configurações WhatsApp' });
});

configRouter.get('/leads', (req, res) => {
  res.json({ message: 'Configurações de distribuição de leads' });
});

configRouter.put('/leads', requireManager, (req, res) => {
  res.json({ message: 'Atualizar configurações de leads' });
});

router.use('/config', configRouter);

// ========================================
// ROTAS DE ESTATÍSTICAS E RELATÓRIOS
// ========================================

const relatoriosRouter = express.Router();

// Dashboard da organização
relatoriosRouter.get('/dashboard', (req, res) => {
  res.json({ message: 'Dashboard da organização' });
});

// Relatório de usuários
relatoriosRouter.get('/usuarios', requireManager, (req, res) => {
  res.json({ message: 'Relatório de usuários' });
});

// Relatório de leads
relatoriosRouter.get('/leads', requireManager, (req, res) => {
  res.json({ message: 'Relatório de leads' });
});

// Relatório de plantões
relatoriosRouter.get('/plantoes', requireManager, (req, res) => {
  res.json({ message: 'Relatório de plantões' });
});

// Relatório de distribuição por região
relatoriosRouter.get('/distribuicao', requireManager, (req, res) => {
  res.json({ message: 'Relatório de distribuição por região' });
});

router.use('/relatorios', relatoriosRouter);

// ========================================
// ROTAS DE AUDITORIA
// ========================================

const auditoriaRouter = express.Router();

// Apenas administradores podem ver logs de auditoria
auditoriaRouter.use(requireAdmin);

// Listar logs de auditoria
auditoriaRouter.get('/', (req, res) => {
  res.json({ message: 'Logs de auditoria' });
});

// Log específico por ID
auditoriaRouter.get('/:id', (req, res) => {
  res.json({ message: 'Log de auditoria específico' });
});

// Exportar logs
auditoriaRouter.get('/export/:format', (req, res) => {
  res.json({ message: 'Exportar logs de auditoria' });
});

router.use('/auditoria', auditoriaRouter);

export default router;