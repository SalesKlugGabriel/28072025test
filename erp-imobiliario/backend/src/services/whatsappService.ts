import axios from 'axios';
import { prisma } from '../config/database';

interface EvolutionAPIConfig {
  baseURL: string;
  apiKey: string;
  instanceName: string;
}

class WhatsAppService {
  private config: EvolutionAPIConfig;

  constructor() {
    this.config = {
      baseURL: process.env.EVOLUTION_API_URL || 'http://localhost:8080',
      apiKey: process.env.EVOLUTION_API_KEY || '',
      instanceName: process.env.EVOLUTION_INSTANCE_NAME || 'erp-whatsapp'
    };
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'apikey': this.config.apiKey
    };
  }

  // ========================================
  // GESTÃO DE INSTÂNCIA
  // ========================================
  
  async createInstance() {
    try {
      const response = await axios.post(
        `${this.config.baseURL}/manager/create`,
        {
          instanceName: this.config.instanceName,
          token: this.config.apiKey,
          qrcode: true,
          integration: 'WHATSAPP-BAILEYS'
        },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao criar instância:', error);
      throw error;
    }
  }

  async getInstanceStatus() {
    try {
      const response = await axios.get(
        `${this.config.baseURL}/instance/connectionState/${this.config.instanceName}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      return { state: 'disconnected' };
    }
  }

  async getQRCode() {
    try {
      const response = await axios.get(
        `${this.config.baseURL}/instance/connect/${this.config.instanceName}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      throw error;
    }
  }

  // ========================================
  // ENVIO DE MENSAGENS
  // ========================================

  async sendTextMessage(to: string, message: string) {
    try {
      const response = await axios.post(
        `${this.config.baseURL}/message/sendText/${this.config.instanceName}`,
        {
          number: to,
          textMessage: {
            text: message
          }
        },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  }

  async sendMediaMessage(to: string, mediaUrl: string, caption?: string, mediaType: 'image' | 'video' | 'audio' | 'document' = 'image') {
    try {
      const response = await axios.post(
        `${this.config.baseURL}/message/sendMedia/${this.config.instanceName}`,
        {
          number: to,
          mediaMessage: {
            mediatype: mediaType,
            media: mediaUrl,
            caption: caption || ''
          }
        },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar mídia:', error);
      throw error;
    }
  }

  // ========================================
  // PROCESSAMENTO DE WEBHOOKS
  // ========================================

  async processWebhook(webhookData: any) {
    try {
      const { event, instance, data } = webhookData;

      switch (event) {
        case 'MESSAGES_UPSERT':
          await this.handleNewMessage(data);
          break;
        
        case 'CONNECTION_UPDATE':
          await this.handleConnectionUpdate(data);
          break;
        
        case 'CONTACTS_UPSERT':
          await this.handleContactUpdate(data);
          break;
        
        default:
          console.log(`Evento não tratado: ${event}`);
      }
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
    }
  }

  private async handleNewMessage(messageData: any) {
    try {
      const message = messageData.messages[0];
      
      if (!message || message.fromMe) return; // Ignora mensagens próprias

      // Buscar ou criar conversa
      const conversation = await this.findOrCreateConversation(
        message.key.remoteJid,
        message.pushName || 'Desconhecido'
      );

      // Salvar mensagem
      await prisma.whatsAppMessage.create({
        data: {
          messageId: message.key.id,
          conversationId: conversation.id,
          fromNumber: message.key.remoteJid,
          toNumber: this.config.instanceName,
          content: message.message?.conversation || message.message?.extendedTextMessage?.text || '[Mídia]',
          messageType: this.getMessageType(message.message),
          isFromMe: false,
          status: 'DELIVERED',
          timestamp: new Date(message.messageTimestamp * 1000)
        }
      });

      // Processar auto-resposta se habilitada
      await this.processAutoReply(conversation.id, message);

    } catch (error) {
      console.error('Erro ao processar nova mensagem:', error);
    }
  }

  private async handleConnectionUpdate(connectionData: any) {
    try {
      const { state, qr } = connectionData;

      // Atualizar status da sessão no banco
      await prisma.whatsAppSession.upsert({
        where: { sessionName: this.config.instanceName },
        update: {
          status: this.mapConnectionState(state),
          qrCode: qr || null,
          connectedAt: state === 'open' ? new Date() : null
        },
        create: {
          userId: 'system', // Será substituído pelo usuário real
          sessionName: this.config.instanceName,
          status: this.mapConnectionState(state),
          qrCode: qr || null,
          connectedAt: state === 'open' ? new Date() : null
        }
      });

    } catch (error) {
      console.error('Erro ao atualizar status da conexão:', error);
    }
  }

  private async handleContactUpdate(contactData: any) {
    try {
      // Processar atualizações de contatos
      const contacts = contactData.contacts || [];
      
      for (const contact of contacts) {
        // Atualizar nome do contato nas conversas existentes
        await prisma.whatsAppConversation.updateMany({
          where: { phoneNumber: contact.id },
          data: { contactName: contact.name || contact.pushName }
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar contatos:', error);
    }
  }

  // ========================================
  // UTILITÁRIOS
  // ========================================

  private async findOrCreateConversation(phoneNumber: string, contactName: string) {
    // First try to find existing conversation
    const existingConversation = await prisma.whatsAppConversation.findFirst({
      where: {
        sessionId: 'default-session',
        phoneNumber: phoneNumber
      }
    });

    if (existingConversation) {
      // Update existing conversation
      return await prisma.whatsAppConversation.update({
        where: { id: existingConversation.id },
        data: {
          contactName: contactName,
          lastMessageAt: new Date()
        }
      });
    }

    // Create new conversation if not found
    return await prisma.whatsAppConversation.create({
      data: {
        sessionId: 'default-session',
        phoneNumber: phoneNumber,
        contactName: contactName,
        status: 'ATIVA',
        lastMessageAt: new Date()
      }
    });
  }

  private getMessageType(message: any): 'TEXT' | 'IMAGE' | 'AUDIO' | 'VIDEO' | 'DOCUMENT' {
    if (message.conversation || message.extendedTextMessage) return 'TEXT';
    if (message.imageMessage) return 'IMAGE';
    if (message.audioMessage) return 'AUDIO';
    if (message.videoMessage) return 'VIDEO';
    if (message.documentMessage) return 'DOCUMENT';
    return 'TEXT';
  }

  private mapConnectionState(state: string): 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING' | 'QR_CODE' | 'ERROR' {
    switch (state) {
      case 'open': return 'CONNECTED';
      case 'connecting': return 'CONNECTING';
      case 'close': return 'DISCONNECTED';
      case 'qr': return 'QR_CODE';
      default: return 'ERROR';
    }
  }

  private async processAutoReply(conversationId: string, message: any) {
    // Implementar lógica de auto-resposta
    // Pode incluir integração com Claude AI para respostas inteligentes
    
    const messageText = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    
    // Exemplo de auto-resposta simples
    if (messageText.toLowerCase().includes('oi') || messageText.toLowerCase().includes('olá')) {
      await this.sendTextMessage(
        message.key.remoteJid,
        'Olá! Obrigado pelo contato. Em breve um de nossos corretores entrará em contato com você! 🏠'
      );
    }
  }
}

export default WhatsAppService;