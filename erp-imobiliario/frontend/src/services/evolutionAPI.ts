import { WhatsAppConnection, WhatsAppMessage, SendMessageParams } from '../types/whatsapp';

export interface EvolutionAPIConfig {
  baseUrl: string;
  apiKey: string;
  instanceName: string;
}

export interface EvolutionWebhookMessage {
  key: {
    remoteJid: string;
    fromMe: boolean;
    id: string;
  };
  message: {
    conversation?: string;
    extendedTextMessage?: {
      text: string;
    };
  };
  messageTimestamp: number;
  pushName?: string;
  instance: string;
}

export interface EvolutionInstanceInfo {
  instance: {
    instanceName: string;
    status: string;
  };
  qrcode?: {
    base64: string;
  };
}

class EvolutionAPIService {
  private config: EvolutionAPIConfig;
  private messageListeners: ((message: WhatsAppMessage) => void)[] = [];

  constructor(config: EvolutionAPIConfig) {
    this.config = config;
  }

  // Configurar webhook para receber mensagens
  async setupWebhook(webhookUrl: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/webhook/${this.config.instanceName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.config.apiKey,
        },
        body: JSON.stringify({
          webhook: {
            url: webhookUrl,
            events: ['MESSAGES_UPSERT', 'CONNECTION_UPDATE']
          }
        })
      });
      
      return response.ok;
    } catch (error) {
      console.error('Erro ao configurar webhook:', error);
      return false;
    }
  }

  // Obter informações da instância
  async getInstanceInfo(): Promise<EvolutionInstanceInfo | null> {
    try {
      const response = await fetch(`${this.config.baseUrl}/instance/connect/${this.config.instanceName}`, {
        headers: {
          'apikey': this.config.apiKey,
        }
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Erro ao obter informações da instância:', error);
      return null;
    }
  }

  // Criar/conectar instância
  async createInstance(): Promise<{ qrCode?: string; success: boolean }> {
    try {
      const response = await fetch(`${this.config.baseUrl}/instance/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.config.apiKey,
        },
        body: JSON.stringify({
          instanceName: this.config.instanceName,
          token: this.config.apiKey,
          qrcode: true,
          webhookUrl: `${window.location.origin}/api/webhook/evolution`
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          qrCode: data.qrcode?.base64,
          success: true
        };
      }

      return { success: false };
    } catch (error) {
      console.error('Erro ao criar instância:', error);
      return { success: false };
    }
  }

  // Enviar mensagem de texto
  async sendTextMessage(to: string, text: string): Promise<WhatsAppMessage | null> {
    try {
      const phoneNumber = this.formatPhoneNumber(to);
      
      const response = await fetch(`${this.config.baseUrl}/message/sendText/${this.config.instanceName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.config.apiKey,
        },
        body: JSON.stringify({
          number: phoneNumber,
          textMessage: {
            text: text
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        const message: WhatsAppMessage = {
          id: result.key?.id || crypto.randomUUID(),
          connectionId: this.config.instanceName,
          from: result.key?.participant || 'me',
          to: phoneNumber,
          message: text,
          timestamp: new Date().toISOString(),
          status: 'sent',
          direction: 'outgoing'
        };

        return message;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      return null;
    }
  }

  // Enviar mídia (imagem, documento, etc.)
  async sendMediaMessage(to: string, mediaUrl: string, caption?: string, mediaType: 'image' | 'document' | 'audio' | 'video' = 'image'): Promise<WhatsAppMessage | null> {
    try {
      const phoneNumber = this.formatPhoneNumber(to);
      
      const endpoint = {
        image: 'sendMedia',
        document: 'sendMedia',
        audio: 'sendWhatsAppAudio',
        video: 'sendMedia'
      }[mediaType];

      const response = await fetch(`${this.config.baseUrl}/message/${endpoint}/${this.config.instanceName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.config.apiKey,
        },
        body: JSON.stringify({
          number: phoneNumber,
          mediaMessage: {
            mediatype: mediaType,
            media: mediaUrl,
            caption: caption || ''
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        const message: WhatsAppMessage = {
          id: result.key?.id || crypto.randomUUID(),
          connectionId: this.config.instanceName,
          from: result.key?.participant || 'me',
          to: phoneNumber,
          message: caption || `[${mediaType.toUpperCase()}]`,
          timestamp: new Date().toISOString(),
          status: 'sent',
          direction: 'outgoing',
          attachments: [{
            id: crypto.randomUUID(),
            type: mediaType,
            url: mediaUrl,
            filename: caption
          }]
        };

        return message;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao enviar mídia:', error);
      return null;
    }
  }

  // Verificar se um número existe no WhatsApp
  async checkNumberExists(phoneNumber: string): Promise<boolean> {
    try {
      const formattedNumber = this.formatPhoneNumber(phoneNumber);
      
      const response = await fetch(`${this.config.baseUrl}/chat/whatsappNumbers/${this.config.instanceName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.config.apiKey,
        },
        body: JSON.stringify({
          numbers: [formattedNumber]
        })
      });

      if (response.ok) {
        const result = await response.json();
        return result.length > 0 && result[0].exists;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao verificar número:', error);
      return false;
    }
  }

  // Obter conversas/chats
  async fetchChats(): Promise<any[]> {
    try {
      const response = await fetch(`${this.config.baseUrl}/chat/findChats/${this.config.instanceName}`, {
        headers: {
          'apikey': this.config.apiKey,
        }
      });

      if (response.ok) {
        return await response.json();
      }
      
      return [];
    } catch (error) {
      console.error('Erro ao buscar chats:', error);
      return [];
    }
  }

  // Obter mensagens de uma conversa
  async fetchMessages(chatId: string, limit: number = 50): Promise<WhatsAppMessage[]> {
    try {
      const response = await fetch(`${this.config.baseUrl}/chat/findMessages/${this.config.instanceName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.config.apiKey,
        },
        body: JSON.stringify({
          where: {
            key: {
              remoteJid: chatId
            }
          },
          limit: limit
        })
      });

      if (response.ok) {
        const messages = await response.json();
        return messages.map((msg: any) => this.transformEvolutionMessage(msg));
      }
      
      return [];
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      return [];
    }
  }

  // Processar webhook recebido
  processWebhookMessage(webhookData: EvolutionWebhookMessage): WhatsAppMessage | null {
    try {
      const message = this.transformEvolutionMessage(webhookData);
      
      // Notificar listeners
      this.messageListeners.forEach(listener => listener(message));
      
      return message;
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      return null;
    }
  }

  // Transformar mensagem do formato Evolution para o nosso formato
  private transformEvolutionMessage(evolutionMessage: any): WhatsAppMessage {
    const messageText = evolutionMessage.message?.conversation || 
                       evolutionMessage.message?.extendedTextMessage?.text || 
                       '[Mensagem não suportada]';

    return {
      id: evolutionMessage.key.id,
      connectionId: this.config.instanceName,
      from: evolutionMessage.key.remoteJid,
      to: evolutionMessage.key.fromMe ? evolutionMessage.key.remoteJid : 'me',
      message: messageText,
      timestamp: new Date(evolutionMessage.messageTimestamp * 1000).toISOString(),
      status: 'delivered',
      direction: evolutionMessage.key.fromMe ? 'outgoing' : 'incoming'
    };
  }

  // Formatar número de telefone para WhatsApp
  private formatPhoneNumber(phone: string): string {
    // Remove todos os caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '');
    
    // Se já tem código do país, retorna com @s.whatsapp.net
    if (cleaned.length >= 10) {
      let formatted = cleaned;
      
      // Adiciona código do Brasil se necessário
      if (!cleaned.startsWith('55') && cleaned.length <= 11) {
        formatted = '55' + cleaned;
      }
      
      return formatted + '@s.whatsapp.net';
    }
    
    return phone + '@s.whatsapp.net';
  }

  // Adicionar listener para mensagens
  addMessageListener(listener: (message: WhatsAppMessage) => void) {
    this.messageListeners.push(listener);
  }

  // Remover listener
  removeMessageListener(listener: (message: WhatsAppMessage) => void) {
    const index = this.messageListeners.indexOf(listener);
    if (index >= 0) {
      this.messageListeners.splice(index, 1);
    }
  }

  // Obter status da conexão
  async getConnectionStatus(): Promise<WhatsAppConnection> {
    const info = await this.getInstanceInfo();
    
    return {
      id: this.config.instanceName,
      userId: 'current_user',
      userName: 'Evolution API',
      phoneNumber: '',
      status: info?.instance.status === 'open' ? 'connected' : 'disconnected',
      qrCode: info?.qrcode?.base64,
      lastConnection: new Date().toISOString(),
      sessionId: this.config.instanceName
    };
  }

  // Desconectar instância
  async disconnect(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/instance/logout/${this.config.instanceName}`, {
        method: 'DELETE',
        headers: {
          'apikey': this.config.apiKey,
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Erro ao desconectar:', error);
      return false;
    }
  }

  // Deletar instância
  async deleteInstance(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/instance/delete/${this.config.instanceName}`, {
        method: 'DELETE',
        headers: {
          'apikey': this.config.apiKey,
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Erro ao deletar instância:', error);
      return false;
    }
  }
}

export default EvolutionAPIService;