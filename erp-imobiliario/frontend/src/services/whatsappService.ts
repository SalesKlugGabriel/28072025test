import { WhatsAppConnection, WhatsAppMessage, SendMessageParams } from '../types/whatsapp';
import EvolutionAPIService, { EvolutionAPIConfig } from './evolutionAPI';

class WhatsAppService {
  private connections: WhatsAppConnection[] = [];
  private messages: WhatsAppMessage[] = [];
  private messageListeners: ((message: WhatsAppMessage) => void)[] = [];
  private evolutionAPI: EvolutionAPIService | null = null;
  private isEvolutionConnected = false;

  // Configurar Evolution API
  setupEvolutionAPI(config: EvolutionAPIConfig) {
    this.evolutionAPI = new EvolutionAPIService(config);
    
    // Adicionar listener para mensagens da Evolution API
    this.evolutionAPI.addMessageListener((message) => {
      this.messages.push(message);
      this.notifyMessageListeners(message);
    });
  }

  // Conectar à Evolution API
  async connectEvolutionAPI(): Promise<{ success: boolean; qrCode?: string; error?: string }> {
    if (!this.evolutionAPI) {
      return { success: false, error: 'Evolution API não configurada' };
    }

    try {
      // Verificar se já está conectado
      const status = await this.evolutionAPI.getConnectionStatus();
      
      if (status.status === 'connected') {
        this.isEvolutionConnected = true;
        this.connections = [status];
        return { success: true };
      }

      // Se não está conectado, criar/conectar instância
      const result = await this.evolutionAPI.createInstance();
      
      if (result.success) {
        if (result.qrCode) {
          // Ainda precisa escanear QR Code
          return { success: false, qrCode: result.qrCode };
        } else {
          // Conectado com sucesso
          this.isEvolutionConnected = true;
          const connectionStatus = await this.evolutionAPI.getConnectionStatus();
          this.connections = [connectionStatus];
          return { success: true };
        }
      }

      return { success: false, error: 'Falha ao conectar à Evolution API' };
    } catch (error) {
      console.error('Erro ao conectar Evolution API:', error);
      return { success: false, error: 'Erro de conexão' };
    }
  }

  // Verificar status da conexão Evolution
  async checkEvolutionStatus(): Promise<WhatsAppConnection | null> {
    if (!this.evolutionAPI) return null;
    
    try {
      const status = await this.evolutionAPI.getConnectionStatus();
      this.isEvolutionConnected = status.status === 'connected';
      
      if (this.isEvolutionConnected) {
        this.connections = [status];
      }
      
      return status;
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      return null;
    }
  }

  // Configurar conexões disponíveis
  setConnections(connections: WhatsAppConnection[]) {
    this.connections = connections;
  }

  // Obter conexões ativas
  getActiveConnections(): WhatsAppConnection[] {
    return this.connections.filter(c => c.status === 'connected');
  }

  // Obter conexão do usuário atual
  getUserConnection(userId: string): WhatsAppConnection | null {
    return this.connections.find(c => c.userId === userId && c.status === 'connected') || null;
  }

  // Enviar mensagem (prioriza Evolution API se disponível)
  async sendMessage(params: SendMessageParams): Promise<WhatsAppMessage> {
    // Usar Evolution API se disponível
    if (this.evolutionAPI && this.isEvolutionConnected) {
      try {
        const message = await this.evolutionAPI.sendTextMessage(params.phoneNumber, params.message);
        
        if (message) {
          message.clienteId = params.clienteId;
          this.messages.push(message);
          this.notifyMessageListeners(message);
          return message;
        }
      } catch (error) {
        console.error('Erro ao enviar via Evolution API:', error);
      }
    }

    // Fallback para o método simulado original
    return this.sendMessageFallback(params);
  }

  // Método de fallback (simulado) para quando Evolution API não está disponível
  private async sendMessageFallback(params: SendMessageParams): Promise<WhatsAppMessage> {
    const connection = this.connections.find(c => c.id === params.connectionId) || {
      id: 'fallback',
      userId: 'system',
      userName: 'Sistema',
      phoneNumber: 'system',
      status: 'connected' as const,
      sessionId: 'fallback'
    };

    const message: WhatsAppMessage = {
      id: crypto.randomUUID(),
      connectionId: params.connectionId || 'fallback',
      from: connection.phoneNumber,
      to: params.phoneNumber,
      message: params.message,
      timestamp: new Date().toISOString(),
      status: 'sending',
      direction: 'outgoing',
      clienteId: params.clienteId
    };

    this.messages.push(message);

    // Simular envio
    setTimeout(() => {
      this.updateMessageStatus(message.id, 'sent');
      
      // Simular resposta automática em alguns casos (para demonstração)
      if (Math.random() > 0.7) {
        setTimeout(() => {
          this.simulateIncomingMessage({
            connectionId: params.connectionId || 'fallback',
            from: params.phoneNumber,
            to: connection.phoneNumber,
            message: this.generateAutoReply(params.message),
            clienteId: params.clienteId
          });
        }, 2000 + Math.random() * 3000);
      }
    }, 1000);

    // Notificar listeners
    this.notifyMessageListeners(message);

    return message;
  }

  // Enviar mídia via Evolution API
  async sendMediaMessage(to: string, mediaUrl: string, caption?: string, mediaType: 'image' | 'document' | 'audio' | 'video' = 'image', clienteId?: string): Promise<WhatsAppMessage | null> {
    if (!this.evolutionAPI || !this.isEvolutionConnected) {
      throw new Error('Evolution API não está conectada');
    }

    try {
      const message = await this.evolutionAPI.sendMediaMessage(to, mediaUrl, caption, mediaType);
      
      if (message) {
        message.clienteId = clienteId;
        this.messages.push(message);
        this.notifyMessageListeners(message);
      }
      
      return message;
    } catch (error) {
      console.error('Erro ao enviar mídia:', error);
      return null;
    }
  }

  // Verificar se número existe no WhatsApp
  async checkNumberExists(phoneNumber: string): Promise<boolean> {
    if (this.evolutionAPI && this.isEvolutionConnected) {
      try {
        return await this.evolutionAPI.checkNumberExists(phoneNumber);
      } catch (error) {
        console.error('Erro ao verificar número:', error);
      }
    }

    // Fallback para verificação simulada
    return Math.random() > 0.2; // 80% de chance de estar conectado
  }

  // Carregar mensagens de uma conversa
  async loadConversationMessages(chatId: string, limit: number = 50): Promise<WhatsAppMessage[]> {
    if (this.evolutionAPI && this.isEvolutionConnected) {
      try {
        const messages = await this.evolutionAPI.fetchMessages(chatId, limit);
        // Adicionar às mensagens locais se ainda não existem
        messages.forEach(msg => {
          if (!this.messages.find(m => m.id === msg.id)) {
            this.messages.push(msg);
          }
        });
        return messages;
      } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
      }
    }

    return [];
  }

  // Simular mensagem recebida
  private simulateIncomingMessage(params: {
    connectionId: string;
    from: string;
    to: string;
    message: string;
    clienteId?: string;
  }) {
    const message: WhatsAppMessage = {
      id: crypto.randomUUID(),
      connectionId: params.connectionId,
      from: params.from,
      to: params.to,
      message: params.message,
      timestamp: new Date().toISOString(),
      status: 'delivered',
      direction: 'incoming',
      clienteId: params.clienteId
    };

    this.messages.push(message);
    this.notifyMessageListeners(message);
  }

  // Gerar resposta automática simples
  private generateAutoReply(originalMessage: string): string {
    const lowerMessage = originalMessage.toLowerCase();
    
    if (lowerMessage.includes('olá') || lowerMessage.includes('oi')) {
      return 'Olá! Obrigado pelo contato. Em que posso ajudá-lo?';
    }
    
    if (lowerMessage.includes('preço') || lowerMessage.includes('valor')) {
      return 'Posso sim te ajudar com informações sobre valores. Você tem interesse em algum empreendimento específico?';
    }
    
    if (lowerMessage.includes('disponível') || lowerMessage.includes('unidade')) {
      return 'Temos várias unidades disponíveis. Gostaria de agendar uma visita ou receber nossa tabela de preços?';
    }
    
    if (lowerMessage.includes('financiamento')) {
      return 'Trabalhamos com diversas modalidades de financiamento. Posso te passar mais detalhes sobre as condições.';
    }
    
    return 'Recebi sua mensagem! Vou verificar as informações e retorno em breve.';
  }

  // Atualizar status da mensagem
  private updateMessageStatus(messageId: string, status: WhatsAppMessage['status']) {
    const messageIndex = this.messages.findIndex(m => m.id === messageId);
    if (messageIndex >= 0) {
      this.messages[messageIndex].status = status;
      this.notifyMessageListeners(this.messages[messageIndex]);
    }
  }

  // Obter mensagens de um cliente
  getClientMessages(clienteId: string): WhatsAppMessage[] {
    return this.messages
      .filter(m => m.clienteId === clienteId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  // Obter todas as mensagens de uma conexão
  getConnectionMessages(connectionId: string): WhatsAppMessage[] {
    return this.messages
      .filter(m => m.connectionId === connectionId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Adicionar listener para novas mensagens
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

  // Notificar todos os listeners
  private notifyMessageListeners(message: WhatsAppMessage) {
    this.messageListeners.forEach(listener => listener(message));
  }

  // Verificar se um número está conectado via WhatsApp
  isNumberConnected(phoneNumber: string): boolean {
    // Simular verificação - na vida real seria uma consulta ao WhatsApp Business API
    return Math.random() > 0.2; // 80% de chance de estar conectado
  }

  // Formatar número para WhatsApp (método público)
  formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    
    // Se não tem código do país, assumir Brasil (+55)
    if (cleaned.length === 11 && (cleaned.startsWith('11') || cleaned.startsWith('21'))) {
      return `+55${cleaned}`;
    }
    
    if (cleaned.length === 10) {
      return `+55${cleaned}`;
    }
    
    if (cleaned.length === 13 && cleaned.startsWith('55')) {
      return `+${cleaned}`;
    }
    
    return phone;
  }
}

// Singleton instance
export const whatsappService = new WhatsAppService();

export type { WhatsAppMessage, SendMessageParams };
export default whatsappService;