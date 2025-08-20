import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth';

// Mock WhatsAppService para desenvolvimento
class WhatsAppService {
  async getInstanceStatus() {
    return { status: 'disconnected', instance: 'default' };
  }

  async getQRCode() {
    return { qr: 'mock-qr-code-data' };
  }

  async createInstance() {
    return { instance: 'default', status: 'created' };
  }

  async sendTextMessage(to: string, message: string) {
    return { messageId: `msg_${Date.now()}`, to, message };
  }

  async sendMediaMessage(to: string, mediaUrl: string, caption?: string, type?: string) {
    return { messageId: `msg_${Date.now()}`, to, mediaUrl, caption, type };
  }
}

const whatsappService = new WhatsAppService();

// Schemas de validação
const webhookSchema = z.object({
  event: z.string(),
  instance: z.string(),
  data: z.any()
});

const sendMessageSchema = z.object({
  to: z.string().min(10, 'Número deve ter pelo menos 10 dígitos'),
  message: z.string().min(1, 'Mensagem não pode estar vazia'),
  type: z.enum(['text', 'image', 'audio', 'video', 'document']).default('text'),
  mediaUrl: z.string().url().optional(),
  caption: z.string().optional()
});

const conversationSchema = z.object({
  phoneNumber: z.string().min(10, 'Número deve ter pelo menos 10 dígitos'),
  name: z.string().optional(),
  pessoaId: z.string().uuid().optional()
});

// ===== WEBHOOK - RECEBER MENSAGENS =====

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    // Validar estrutura do webhook
    const validatedData = webhookSchema.parse(req.body);
    
    // Verificar secret do webhook (segurança)
    const webhookSecret = req.headers['x-webhook-secret'];
    if (webhookSecret !== process.env.EVOLUTION_WEBHOOK_SECRET) {
      res.status(401).json({ error: 'Unauthorized webhook' });
      return;
    }

    // Processar webhook em background
    processWebhookData(validatedData).catch(error => {
      console.error('Erro ao processar webhook em background:', error);
    });

    // Resposta rápida para Evolution API
    res.status(200).json({ status: 'received' });
      return;
    
  } catch (error) {
    console.error('Erro no webhook WhatsApp:', error);
    res.status(400).json({ error: 'Invalid webhook data' });
      return;
  }
};

// ===== GESTÃO DE INSTÂNCIA =====

export const getInstanceStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const status = await whatsappService.getInstanceStatus();
    res.json(status);
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    res.status(500).json({ error: 'Failed to get instance status' });
      return;
  }
};

export const getQRCode = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const qrData = await whatsappService.getQRCode();
    res.json(qrData);
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    res.status(500).json({ error: 'Failed to generate QR Code' });
      return;
  }
};

export const createInstance = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const instance = await whatsappService.createInstance();
    res.json(instance);
  } catch (error) {
    console.error('Erro ao criar instância:', error);
    res.status(500).json({ error: 'Failed to create instance' });
      return;
  }
};

// ===== ENVIO DE MENSAGENS =====

export const sendMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { to, message, type = 'text', mediaUrl, caption } = sendMessageSchema.parse(req.body);

    let result;
    if (type === 'text') {
      result = await whatsappService.sendTextMessage(to, message);
    } else {
      result = await whatsappService.sendMediaMessage(to, mediaUrl, caption, type);
    }

    // Salvar mensagem no banco
    await saveOutgoingMessage(req.user!.id, to, message, type, result);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ error: 'Failed to send message' });
      return;
  }
};

// ===== CONVERSAS E MENSAGENS =====

export const getConversations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const conversations = await prisma.whatsAppConversation.findMany({
      where: {
        messages: {
          some: {
            // Conversas que têm mensagens relacionadas ao usuário
            // Pode ser via session ou associação direta
          }
        }
      },
      include: {
        messages: {
          take: 1,
          orderBy: { timestamp: 'desc' }
        },
        _count: {
          select: { messages: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
    
    res.json({ conversations });
  } catch (error) {
    console.error('Erro ao buscar conversas:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
      return;
  }
};

export const getMessages = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const messages = await prisma.whatsAppMessage.findMany({
      where: { conversationId },
      skip: Number(offset),
      take: Number(limit),
      orderBy: { timestamp: 'desc' },
      include: {
        conversation: {
          select: {
            phoneNumber: true,
            contactName: true
          }
        }
      }
    });

    const total = await prisma.whatsAppMessage.count({
      where: { conversationId }
    });
    
    res.json({
      messages: messages.reverse(), // Mostrar mais antigas primeiro
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        total
      }
    });
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ error: 'Failed to get messages' });
      return;
  }
};

export const createConversation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { phoneNumber, name, pessoaId } = conversationSchema.parse(req.body);

    // Verificar se já existe conversa com este número
    let conversation = await prisma.whatsAppConversation.findFirst({
      where: { phoneNumber }
    });

    if (!conversation) {
      conversation = await prisma.whatsAppConversation.create({
        data: {
          phoneNumber,
          contactName: name,
          status: 'ATIVA'
        }
      });
    }

    // Se foi fornecido pessoaId, associar
    if (pessoaId) {
      await associateConversationToPessoa(conversation.id, pessoaId, req.user!.id);
    }

    res.status(201).json({ conversation });
      return;
  } catch (error) {
    console.error('Erro ao criar conversa:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
      return;
  }
};

// ===== FUNÇÕES AUXILIARES =====

async function processWebhookData(webhookData: any) {
  try {
    const { event, data } = webhookData;

    switch (event) {
      case 'messages.upsert':
        await processIncomingMessage(data);
        break;
      
      case 'connection.update':
        await processConnectionUpdate(data);
        break;
      
      default:
        console.log('Evento webhook não tratado:', event);
    }
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
  }
}

async function processIncomingMessage(messageData: any) {
  try {
    const { key, message, messageTimestamp } = messageData;
    const phoneNumber = key.remoteJid.replace('@s.whatsapp.net', '');
    
    // Encontrar ou criar conversa
    let conversation = await prisma.whatsAppConversation.findFirst({
      where: { phoneNumber }
    });

    if (!conversation) {
      conversation = await prisma.whatsAppConversation.create({
        data: {
          phoneNumber,
          contactName: key.pushName || phoneNumber,
          status: 'ATIVA'
        }
      });
    }

    // Salvar mensagem
    const messageContent = message.conversation || message.extendedTextMessage?.text || '[Media]';
    
    await prisma.whatsAppMessage.create({
      data: {
        conversationId: conversation.id,
        messageId: key.id,
        fromNumber: phoneNumber,
        toNumber: 'self', // Número da instância
        content: messageContent,
        messageType: getMessageType(message),
        isFromMe: false,
        status: 'READ',
        timestamp: new Date(messageTimestamp * 1000)
      }
    });

    // Processar auto-resposta se configurada
    await processAutoResponse(conversation, messageContent);

  } catch (error) {
    console.error('Erro ao processar mensagem recebida:', error);
  }
}

async function processConnectionUpdate(connectionData: any) {
  try {
    // Atualizar status da sessão no banco
    await prisma.whatsAppSession.upsert({
      where: { sessionName: 'default' },
      update: { 
        status: mapConnectionStatus(connectionData.connection),
        updatedAt: new Date()
      },
      create: {
        sessionName: 'default',
        status: mapConnectionStatus(connectionData.connection),
        qrCode: connectionData.qr || null
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar status de conexão:', error);
  }
}

async function saveOutgoingMessage(userId: string, to: string, content: string, type: string, result: any) {
  try {
    // Encontrar conversa
    let conversation = await prisma.whatsAppConversation.findFirst({
      where: { phoneNumber: to }
    });

    if (!conversation) {
      conversation = await prisma.whatsAppConversation.create({
        data: {
          phoneNumber: to,
          contactName: to,
          status: 'ATIVA'
        }
      });
    }

    // Salvar mensagem enviada
    await prisma.whatsAppMessage.create({
      data: {
        conversationId: conversation.id,
        messageId: result.messageId || `out_${Date.now()}`,
        fromNumber: 'self',
        toNumber: to,
        content,
        messageType: type.toUpperCase() as any,
        isFromMe: true,
        status: 'SENT',
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Erro ao salvar mensagem enviada:', error);
  }
}

async function associateConversationToPessoa(conversationId: string, pessoaId: string, userId: string) {
  try {
    // Verificar se a pessoa pertence ao usuário
    const pessoa = await prisma.pessoa.findFirst({
      where: { id: pessoaId, userId }
    });

    if (pessoa) {
      // Atualizar conversa com associação
      await prisma.whatsAppConversation.update({
        where: { id: conversationId },
        data: { 
          contactName: pessoa.nome,
          // Adicionar campo pessoaId no schema se necessário
        }
      });
    }
  } catch (error) {
    console.error('Erro ao associar conversa à pessoa:', error);
  }
}

async function processAutoResponse(conversation: any, messageContent: string) {
  try {
    // Implementar lógica de auto-resposta básica
    // Por exemplo, resposta de boas-vindas para novos contatos
    
    const isFirstMessage = await prisma.whatsAppMessage.count({
      where: { 
        conversationId: conversation.id,
        isFromMe: false 
      }
    }) === 1;

    if (isFirstMessage) {
      const welcomeMessage = "Olá! Obrigado por entrar em contato. Em breve retornaremos sua mensagem.";
      
      // Enviar resposta automática
      await whatsappService.sendTextMessage(conversation.phoneNumber, welcomeMessage);
      
      // Salvar resposta no banco
      await prisma.whatsAppMessage.create({
        data: {
          conversationId: conversation.id,
          messageId: `auto_${Date.now()}`,
          fromNumber: 'self',
          toNumber: conversation.phoneNumber,
          content: welcomeMessage,
          messageType: 'TEXT',
          isFromMe: true,
          status: 'SENT',
          timestamp: new Date()
        }
      });
    }
  } catch (error) {
    console.error('Erro ao processar auto-resposta:', error);
  }
}

function getMessageType(message: any): string {
  if (message.conversation || message.extendedTextMessage) return 'TEXT';
  if (message.imageMessage) return 'IMAGE';
  if (message.audioMessage) return 'AUDIO';
  if (message.videoMessage) return 'VIDEO';
  if (message.documentMessage) return 'DOCUMENT';
  return 'TEXT';
}

function mapConnectionStatus(connectionStatus: string): string {
  switch (connectionStatus) {
    case 'open': return 'CONNECTED';
    case 'close': return 'DISCONNECTED';
    case 'connecting': return 'CONNECTING';
    default: return 'DISCONNECTED';
  }
}