import { WhatsAppConnection, WhatsAppMessage, SendMessageParams, EvolutionAPIConfig } from '../types/whatsapp';

export interface UserWhatsAppConfig {
  userId: string;
  userName: string;
  evolutionConfig: EvolutionAPIConfig;
  connection?: WhatsAppConnection;
}

class MultiUserWhatsAppService {
  private userConfigs: Map<string, UserWhatsAppConfig> = new Map();
  private messageListeners: ((message: WhatsAppMessage) => void)[] = [];
  private connectionListeners: ((connection: WhatsAppConnection) => void)[] = [];

  // Configurar Evolution API para um usuário específico
  async configureUserEvolutionAPI(userId: string, userName: string, config: EvolutionAPIConfig): Promise<void> {
    const userConfig: UserWhatsAppConfig = {
      userId,
      userName,
      evolutionConfig: config
    };

    this.userConfigs.set(userId, userConfig);
    
    // Salvar configuração no localStorage
    const userConfigs = Array.from(this.userConfigs.values());
    localStorage.setItem('whatsapp_user_configs', JSON.stringify(userConfigs));
  }

  // Carregar configurações do localStorage
  loadUserConfigs(): void {
    try {
      const saved = localStorage.getItem('whatsapp_user_configs');
      if (saved) {
        const configs: UserWhatsAppConfig[] = JSON.parse(saved);
        configs.forEach(config => {
          this.userConfigs.set(config.userId, config);
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  }

  // Obter configuração de um usuário
  getUserConfig(userId: string): UserWhatsAppConfig | undefined {
    return this.userConfigs.get(userId);
  }

  // Listar todas as configurações
  getAllUserConfigs(): UserWhatsAppConfig[] {
    return Array.from(this.userConfigs.values());
  }

  // Conectar WhatsApp para um usuário específico
  async connectWhatsApp(userId: string, phoneNumber: string): Promise<WhatsAppConnection> {
    const userConfig = this.userConfigs.get(userId);
    
    if (!userConfig) {
      throw new Error('Configuração Evolution API não encontrada para este usuário');
    }

    const { evolutionConfig } = userConfig;

    // Verificar se a API está configurada
    if (!evolutionConfig.isActive) {
      return this.createDemoConnection(userId, phoneNumber, userConfig.userName);
    }

    try {
      // Tentar conectar com Evolution API real
      const response = await fetch(`${evolutionConfig.apiUrl}/instance/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${evolutionConfig.token}`
        },
        body: JSON.stringify({
          instanceName: evolutionConfig.instanceId,
          token: evolutionConfig.token,
          qrcode: true,
          webhook: evolutionConfig.webhookUrl
        })
      });

      if (!response.ok) {
        throw new Error('Falha na conexão com Evolution API');
      }

      const data = await response.json();

      const connection: WhatsAppConnection = {
        id: crypto.randomUUID(),
        userId,
        userName: userConfig.userName,
        phoneNumber,
        status: 'qr_pending',
        qrCode: data.qrcode,
        sessionId: evolutionConfig.instanceId,
        evolutionConfig
      };

      // Atualizar configuração do usuário
      userConfig.connection = connection;
      this.userConfigs.set(userId, userConfig);

      // Notificar listeners
      this.notifyConnectionListeners(connection);

      return connection;

    } catch (error) {
      console.error('Erro na conexão Evolution API:', error);
      // Fallback para modo demo
      return this.createDemoConnection(userId, phoneNumber, userConfig.userName);
    }
  }

  // Criar conexão demo
  private createDemoConnection(userId: string, phoneNumber: string, userName: string): WhatsAppConnection {
    const connection: WhatsAppConnection = {
      id: crypto.randomUUID(),
      userId,
      userName,
      phoneNumber,
      status: 'connecting',
      sessionId: `demo_${userId}_${Date.now()}`
    };

    // Simular conexão bem-sucedida após 2 segundos
    setTimeout(() => {
      connection.status = 'connected';
      connection.lastConnection = new Date().toISOString();
      
      const userConfig = this.userConfigs.get(userId);
      if (userConfig) {
        userConfig.connection = connection;
        this.userConfigs.set(userId, userConfig);
      }

      this.notifyConnectionListeners(connection);
    }, 2000);

    return connection;
  }

  // Desconectar WhatsApp de um usuário
  async disconnectWhatsApp(userId: string): Promise<void> {
    const userConfig = this.userConfigs.get(userId);
    
    if (!userConfig?.connection) {
      return;
    }

    const { connection, evolutionConfig } = userConfig;

    if (evolutionConfig.isActive) {
      try {
        await fetch(`${evolutionConfig.apiUrl}/instance/delete/${evolutionConfig.instanceId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${evolutionConfig.token}`
          }
        });
      } catch (error) {
        console.error('Erro ao desconectar Evolution API:', error);
      }
    }

    // Atualizar status da conexão
    connection.status = 'disconnected';
    userConfig.connection = connection;
    this.userConfigs.set(userId, userConfig);

    this.notifyConnectionListeners(connection);
  }

  // Enviar mensagem através da conexão do usuário
  async sendMessage(params: SendMessageParams & { userId: string }): Promise<void> {
    const userConfig = this.userConfigs.get(params.userId);
    
    if (!userConfig?.connection) {
      throw new Error('Usuário não possui conexão WhatsApp ativa');
    }

    const { connection, evolutionConfig } = userConfig;

    if (connection.status !== 'connected') {
      throw new Error('WhatsApp não está conectado');
    }

    // Criar mensagem
    const message: WhatsAppMessage = {
      id: crypto.randomUUID(),
      connectionId: connection.id,
      from: connection.phoneNumber,
      to: params.phoneNumber,
      message: params.message,
      timestamp: new Date().toISOString(),
      status: 'sending',
      direction: 'outgoing',
      clienteId: params.clienteId
    };

    if (evolutionConfig?.isActive) {
      try {
        // Enviar via Evolution API
        const response = await fetch(`${evolutionConfig.apiUrl}/message/sendText/${evolutionConfig.instanceId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${evolutionConfig.token}`
          },
          body: JSON.stringify({
            number: params.phoneNumber,
            text: params.message
          })
        });

        if (response.ok) {
          message.status = 'sent';
        } else {
          message.status = 'failed';
        }
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        message.status = 'failed';
      }
    } else {
      // Modo demo - simular envio
      setTimeout(() => {
        message.status = 'sent';
        setTimeout(() => {
          message.status = 'delivered';
          this.notifyMessageListeners(message);
        }, 1000);
      }, 500);
    }

    this.notifyMessageListeners(message);
  }

  // Obter conexão ativa de um usuário
  getUserConnection(userId: string): WhatsAppConnection | null {
    const userConfig = this.userConfigs.get(userId);
    return userConfig?.connection || null;
  }

  // Verificar se usuário tem WhatsApp conectado
  isUserConnected(userId: string): boolean {
    const connection = this.getUserConnection(userId);
    return connection?.status === 'connected';
  }

  // Listeners para mensagens
  addMessageListener(listener: (message: WhatsAppMessage) => void): void {
    this.messageListeners.push(listener);
  }

  removeMessageListener(listener: (message: WhatsAppMessage) => void): void {
    const index = this.messageListeners.indexOf(listener);
    if (index > -1) {
      this.messageListeners.splice(index, 1);
    }
  }

  private notifyMessageListeners(message: WhatsAppMessage): void {
    this.messageListeners.forEach(listener => listener(message));
  }

  // Listeners para conexões
  addConnectionListener(listener: (connection: WhatsAppConnection) => void): void {
    this.connectionListeners.push(listener);
  }

  removeConnectionListener(listener: (connection: WhatsAppConnection) => void): void {
    const index = this.connectionListeners.indexOf(listener);
    if (index > -1) {
      this.connectionListeners.splice(index, 1);
    }
  }

  private notifyConnectionListeners(connection: WhatsAppConnection): void {
    this.connectionListeners.forEach(listener => listener(connection));
  }

  // Remover configuração de usuário
  removeUserConfig(userId: string): void {
    this.userConfigs.delete(userId);
    
    // Atualizar localStorage
    const userConfigs = Array.from(this.userConfigs.values());
    localStorage.setItem('whatsapp_user_configs', JSON.stringify(userConfigs));
  }

  // Inicialização do serviço
  initialize(): void {
    this.loadUserConfigs();
    
    // Simular recebimento de mensagens (em produção viria via webhook)
    if (import.meta.env.DEV) {
      this.simulateIncomingMessages();
    }
  }

  private simulateIncomingMessages(): void {
    // Simular mensagens recebidas a cada 30 segundos em modo demo
    setInterval(() => {
      const connectedUsers = Array.from(this.userConfigs.values())
        .filter(config => config.connection?.status === 'connected');
      
      if (connectedUsers.length > 0) {
        const randomUser = connectedUsers[Math.floor(Math.random() * connectedUsers.length)];
        const mockMessages = [
          'Olá, tenho interesse nos apartamentos.',
          'Qual o valor de entrada?',
          'Posso agendar uma visita?',
          'Já tem financiamento aprovado?',
          'Obrigado pelas informações!'
        ];

        const message: WhatsAppMessage = {
          id: crypto.randomUUID(),
          connectionId: randomUser.connection!.id,
          from: '+5511999999999',
          to: randomUser.connection!.phoneNumber,
          message: mockMessages[Math.floor(Math.random() * mockMessages.length)],
          timestamp: new Date().toISOString(),
          status: 'delivered',
          direction: 'incoming',
          clienteId: 'cliente-demo'
        };

        this.notifyMessageListeners(message);
      }
    }, 30000);
  }
}

// Instância singleton
export const multiUserWhatsAppService = new MultiUserWhatsAppService();

// Inicializar serviço
multiUserWhatsAppService.initialize();

export default multiUserWhatsAppService;