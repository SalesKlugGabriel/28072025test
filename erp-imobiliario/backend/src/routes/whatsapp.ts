import { Router } from 'express';
import { z } from 'zod';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateSchema, validateParams, validateQuery, commonSchemas } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import * as whatsappController from '../controllers/whatsappController';

const router = Router();

// ===== WEBHOOK (PÚBLICO) =====

// POST /api/whatsapp/webhook - Receber mensagens da Evolution API
router.post('/webhook', asyncHandler(whatsappController.handleWebhook));

// ===== ROTAS AUTENTICADAS =====
router.use(authenticateToken);

// ===== GESTÃO DE INSTÂNCIA =====

// GET /api/whatsapp/status - Status da instância WhatsApp
router.get('/status', asyncHandler(whatsappController.getInstanceStatus));

// GET /api/whatsapp/qr - QR Code para conexão
router.get('/qr', asyncHandler(whatsappController.getQRCode));

// POST /api/whatsapp/instance - Criar instância
router.post('/instance',
  requireRole('ADMIN', 'GERENTE'),
  asyncHandler(whatsappController.createInstance)
);

// ===== ENVIO DE MENSAGENS =====

// POST /api/whatsapp/send - Enviar mensagem
router.post('/send', asyncHandler(whatsappController.sendMessage));

// ===== CONVERSAS =====

// GET /api/whatsapp/conversations - Listar conversas
router.get('/conversations', asyncHandler(whatsappController.getConversations));

// POST /api/whatsapp/conversations - Criar conversa
router.post('/conversations', asyncHandler(whatsappController.createConversation));

// GET /api/whatsapp/conversations/:conversationId/messages - Mensagens de uma conversa
router.get('/conversations/:conversationId/messages',
  validateParams(z.object({ conversationId: z.string().uuid() })),
  validateQuery(z.object({
    limit: z.string().transform(val => parseInt(val) || 50).optional(),
    offset: z.string().transform(val => parseInt(val) || 0).optional()
  })),
  asyncHandler(whatsappController.getMessages)
);

export default router;