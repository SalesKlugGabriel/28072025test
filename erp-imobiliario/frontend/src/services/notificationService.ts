// Sistema de Notificações Multi-Canal
// WhatsApp, Email, SMS, Push, Sistema

export interface NotificationChannel {
  id: string;
  name: string;
  type: 'whatsapp' | 'email' | 'sms' | 'push' | 'sistema' | 'webhook';
  enabled: boolean;
  priority: number;
  config: {
    apiUrl?: string;
    apiKey?: string;
    template?: string;
    phoneNumber?: string;
    email?: string;
    retryAttempts: number;
    timeout: number;
  };
  status: 'active' | 'inactive' | 'error';
  lastUsed?: string;
  totalSent?: number;
  successRate?: number;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: 'lead_novo' | 'lead_distribuido' | 'lead_aceito' | 'lead_perdido' | 'reuniao' | 'tarefa' | 'follow_up' | 'custom';
  channels: string[];
  subject?: string;
  message: string;
  variables: string[];
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  schedule?: {
    immediate?: boolean;
    delay?: number; // em minutos
    specificTime?: string;
    recurring?: {
      type: 'daily' | 'weekly' | 'monthly';
      interval: number;
    };
  };
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  channels: string[];
  recipients: {
    userId: string;
    name: string;
    phone?: string;
    email?: string;
    pushToken?: string;
  }[];
  data?: any;
  scheduledFor?: string;
  status: 'pending' | 'sending' | 'sent' | 'failed' | 'cancelled';
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  sentAt?: string;
  results: Array<{
    channel: string;
    recipient: string;
    status: 'success' | 'failed';
    timestamp: string;
    error?: string;
    messageId?: string;
  }>;
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
}

export interface NotificationRule {
  id: string;
  name: string;
  enabled: boolean;
  triggers: {
    event: string;
    conditions?: Record<string, any>;
  }[];
  template: string;
  channels: string[];
  recipients: {
    type: 'specific' | 'role' | 'department' | 'all';
    targets: string[];
  };
  schedule?: {
    immediate: boolean;
    delay?: number;
    businessHoursOnly?: boolean;
    timezone?: string;
  };
  throttling?: {
    maxPerHour?: number;
    maxPerDay?: number;
    cooldownMinutes?: number;
  };
}

class NotificationService {
  private channels: Map<string, NotificationChannel> = new Map();
  private templates: Map<string, NotificationTemplate> = new Map();
  private rules: Map<string, NotificationRule> = new Map();
  private notifications: Notification[] = [];
  private queue: Notification[] = [];
  private processing = false;
  private throttleCounters: Map<string, { hour: number; day: number; lastReset: number }> = new Map();

  constructor() {
    this.initializeDefaultChannels();
    this.initializeDefaultTemplates();
    this.initializeDefaultRules();
    this.startQueueProcessor();
    this.loadSavedData();
  }

  private initializeDefaultChannels() {
    const defaultChannels: NotificationChannel[] = [
      {
        id: 'whatsapp',
        name: 'WhatsApp',
        type: 'whatsapp',
        enabled: true,
        priority: 1,
        config: {
          apiUrl: 'https://api.whatsapp.com/send',
          retryAttempts: 3,
          timeout: 30000
        },
        status: 'active',
        totalSent: 0,
        successRate: 95
      },
      {
        id: 'email',
        name: 'Email',
        type: 'email',
        enabled: true,
        priority: 2,
        config: {
          retryAttempts: 2,
          timeout: 60000
        },
        status: 'active',
        totalSent: 0,
        successRate: 98
      },
      {
        id: 'sms',
        name: 'SMS',
        type: 'sms',
        enabled: true,
        priority: 3,
        config: {
          retryAttempts: 2,
          timeout: 15000
        },
        status: 'active',
        totalSent: 0,
        successRate: 92
      },
      {
        id: 'push',
        name: 'Push Notification',
        type: 'push',
        enabled: true,
        priority: 4,
        config: {
          retryAttempts: 1,
          timeout: 10000
        },
        status: 'active',
        totalSent: 0,
        successRate: 85
      },
      {
        id: 'sistema',
        name: 'Sistema Interno',
        type: 'sistema',
        enabled: true,
        priority: 5,
        config: {
          retryAttempts: 1,
          timeout: 5000
        },
        status: 'active',
        totalSent: 0,
        successRate: 100
      }
    ];

    defaultChannels.forEach(channel => {
      this.channels.set(channel.id, channel);
    });
  }

  private initializeDefaultTemplates() {
    const defaultTemplates: NotificationTemplate[] = [
      {
        id: 'lead_novo',
        name: 'Novo Lead Recebido',
        type: 'lead_novo',
        channels: ['whatsapp', 'push', 'sistema'],
        subject: '🎯 Novo Lead Recebido',
        message: '🎯 *NOVO LEAD*\n\n👤 *Nome:* {{nome}}\n📧 *Email:* {{email}}\n📞 *Telefone:* {{telefone}}\n🌐 *Origem:* {{origem}}\n💰 *Interesse:* {{interesse}}\n\n_Acesse o sistema para mais detalhes_',
        variables: ['nome', 'email', 'telefone', 'origem', 'interesse'],
        priority: 'alta',
        schedule: {
          immediate: true
        }
      },
      {
        id: 'lead_distribuido',
        name: 'Lead Distribuído',
        type: 'lead_distribuido',
        channels: ['whatsapp', 'push'],
        subject: '📤 Lead Atribuído',
        message: '📤 *LEAD ATRIBUÍDO*\n\n👤 *Cliente:* {{cliente}}\n👨‍💼 *Corretor:* {{corretor}}\n⏰ *Tempo para resposta:* {{tempo_limite}} minutos\n\n_Responda rapidamente para manter sua performance!_',
        variables: ['cliente', 'corretor', 'tempo_limite'],
        priority: 'alta',
        schedule: {
          immediate: true
        }
      },
      {
        id: 'lead_aceito',
        name: 'Lead Aceito',
        type: 'lead_aceito',
        channels: ['sistema', 'email'],
        subject: '✅ Lead Aceito',
        message: '✅ Lead {{cliente}} foi aceito por {{corretor}} em {{tempo_resposta}} minutos.',
        variables: ['cliente', 'corretor', 'tempo_resposta'],
        priority: 'media',
        schedule: {
          immediate: true
        }
      },
      {
        id: 'reuniao_agendada',
        name: 'Reunião Agendada',
        type: 'reuniao',
        channels: ['whatsapp', 'email', 'push'],
        subject: '📅 Reunião Agendada',
        message: '📅 *REUNIÃO AGENDADA*\n\n👤 *Cliente:* {{cliente}}\n📅 *Data:* {{data}}\n⏰ *Hora:* {{hora}}\n📍 *Local:* {{local}}\n\n_Lembrete: 30 minutos antes_',
        variables: ['cliente', 'data', 'hora', 'local'],
        priority: 'media',
        schedule: {
          immediate: true
        }
      },
      {
        id: 'follow_up',
        name: 'Follow-up Agendado',
        type: 'follow_up',
        channels: ['whatsapp', 'push'],
        subject: '🔔 Follow-up Necessário',
        message: '🔔 *FOLLOW-UP*\n\n👤 *Cliente:* {{cliente}}\n📝 *Ação:* {{acao}}\n⏰ *Prazo:* {{prazo}}\n\n_Não deixe seu cliente esperando!_',
        variables: ['cliente', 'acao', 'prazo'],
        priority: 'media',
        schedule: {
          immediate: false,
          delay: 30
        }
      },
      {
        id: 'meta_atingida',
        name: 'Meta Atingida',
        type: 'custom',
        channels: ['whatsapp', 'email', 'push'],
        subject: '🎉 Meta Atingida!',
        message: '🎉 *PARABÉNS!*\n\n🎯 Meta de {{periodo}} atingida!\n📊 *Resultado:* {{valor}} ({{percentual}}%)\n🏆 *Posição:* {{ranking}}º lugar\n\n_Continue assim!_',
        variables: ['periodo', 'valor', 'percentual', 'ranking'],
        priority: 'baixa',
        schedule: {
          immediate: true
        }
      }
    ];

    defaultTemplates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  private initializeDefaultRules() {
    const defaultRules: NotificationRule[] = [
      {
        id: 'novo_lead_todos',
        name: 'Notificar Todos - Novo Lead',
        enabled: true,
        triggers: [{
          event: 'lead_created'
        }],
        template: 'lead_novo',
        channels: ['sistema', 'push'],
        recipients: {
          type: 'role',
          targets: ['gestor', 'coordenador']
        },
        schedule: {
          immediate: true,
          businessHoursOnly: false
        }
      },
      {
        id: 'lead_distribuido_corretor',
        name: 'Notificar Corretor - Lead Distribuído',
        enabled: true,
        triggers: [{
          event: 'lead_distributed'
        }],
        template: 'lead_distribuido',
        channels: ['whatsapp', 'push'],
        recipients: {
          type: 'specific',
          targets: [] // Será preenchido dinamicamente
        },
        schedule: {
          immediate: true
        },
        throttling: {
          maxPerHour: 10,
          cooldownMinutes: 5
        }
      },
      {
        id: 'lead_nao_respondido',
        name: 'Escalação - Lead Não Respondido',
        enabled: true,
        triggers: [{
          event: 'lead_timeout'
        }],
        template: 'lead_novo',
        channels: ['whatsapp', 'email'],
        recipients: {
          type: 'role',
          targets: ['gestor']
        },
        schedule: {
          immediate: true
        }
      },
      {
        id: 'reuniao_lembrete',
        name: 'Lembrete de Reunião',
        enabled: true,
        triggers: [{
          event: 'meeting_reminder'
        }],
        template: 'reuniao_agendada',
        channels: ['whatsapp', 'push'],
        recipients: {
          type: 'specific',
          targets: []
        },
        schedule: {
          immediate: false,
          delay: -30 // 30 minutos antes
        }
      }
    ];

    defaultRules.forEach(rule => {
      this.rules.set(rule.id, rule);
    });
  }

  // Método principal para enviar notificações
  async sendNotification(
    type: string,
    recipients: string[] | { userId: string; name: string; phone?: string; email?: string }[],
    data: Record<string, any>,
    options?: {
      channels?: string[];
      template?: string;
      priority?: 'baixa' | 'media' | 'alta' | 'urgente';
      scheduledFor?: string;
      immediate?: boolean;
    }
  ): Promise<string> {
    try {
      // Processar destinatários
      const processedRecipients = Array.isArray(recipients[0]) && typeof recipients[0] === 'string'
        ? (recipients as string[]).map(id => ({ userId: id, name: `User ${id}` }))
        : recipients as { userId: string; name: string; phone?: string; email?: string }[];

      // Encontrar template
      const templateId = options?.template || type;
      const template = this.templates.get(templateId);
      if (!template) {
        throw new Error(`Template não encontrado: ${templateId}`);
      }

      // Processar mensagem com variáveis
      const message = this.processTemplate(template.message, data);
      const subject = template.subject ? this.processTemplate(template.subject, data) : undefined;

      // Determinar canais
      const channels = options?.channels || template.channels;

      // Criar notificação
      const notification: Notification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        title: subject || template.name,
        message,
        channels,
        recipients: processedRecipients,
        data,
        scheduledFor: options?.scheduledFor,
        status: 'pending',
        attempts: 0,
        maxAttempts: 3,
        createdAt: new Date().toISOString(),
        results: [],
        priority: options?.priority || template.priority
      };

      // Adicionar à lista
      this.notifications.push(notification);

      // Verificar se deve enviar imediatamente
      if (options?.immediate !== false && (!options?.scheduledFor || new Date(options.scheduledFor) <= new Date())) {
        this.queue.push(notification);
        this.processQueue();
      } else if (options?.scheduledFor) {
        this.scheduleNotification(notification);
      }

      this.saveData();
      
      console.log(`📨 Notificação criada: ${notification.id}`);
      return notification.id;

    } catch (error) {
      console.error('❌ Erro ao criar notificação:', error);
      throw error;
    }
  }

  // Processar templates com variáveis
  private processTemplate(template: string, data: Record<string, any>): string {
    let processed = template;
    
    Object.entries(data).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processed = processed.replace(regex, String(value));
    });

    return processed;
  }

  // Processar fila de notificações
  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const notification = this.queue.shift();
      if (notification) {
        await this.processNotification(notification);
      }
    }

    this.processing = false;
  }

  // Processar notificação individual
  private async processNotification(notification: Notification): Promise<void> {
    try {
      console.log(`📤 Processando notificação: ${notification.id}`);
      
      notification.status = 'sending';
      notification.attempts++;

      // Verificar throttling
      if (!this.checkThrottling(notification)) {
        console.log(`⏸️ Notificação ${notification.id} pausada por throttling`);
        notification.status = 'pending';
        this.queue.push(notification); // Reagendar
        return;
      }

      const promises: Promise<void>[] = [];

      // Enviar por cada canal
      for (const channelId of notification.channels) {
        const channel = this.channels.get(channelId);
        if (!channel || !channel.enabled) {
          continue;
        }

        // Enviar para cada destinatário
        for (const recipient of notification.recipients) {
          promises.push(
            this.sendToChannel(notification, channel, recipient)
          );
        }
      }

      // Aguardar todos os envios
      await Promise.allSettled(promises);

      // Verificar resultados
      const successCount = notification.results.filter(r => r.status === 'success').length;
      const totalCount = notification.results.length;

      if (successCount > 0) {
        notification.status = 'sent';
        notification.sentAt = new Date().toISOString();
        console.log(`✅ Notificação ${notification.id} enviada: ${successCount}/${totalCount} sucessos`);
      } else {
        notification.status = 'failed';
        console.log(`❌ Notificação ${notification.id} falhou completamente`);
        
        // Tentar novamente se não excedeu tentativas
        if (notification.attempts < notification.maxAttempts) {
          notification.status = 'pending';
          setTimeout(() => {
            this.queue.push(notification);
            this.processQueue();
          }, 60000 * notification.attempts); // Backoff exponencial
        }
      }

      this.saveData();

    } catch (error) {
      console.error(`❌ Erro ao processar notificação ${notification.id}:`, error);
      notification.status = 'failed';
    }
  }

  // Enviar para canal específico
  private async sendToChannel(
    notification: Notification,
    channel: NotificationChannel,
    recipient: { userId: string; name: string; phone?: string; email?: string }
  ): Promise<void> {
    try {
      let success = false;
      let messageId: string | undefined;
      let error: string | undefined;

      switch (channel.type) {
        case 'whatsapp':
          ({ success, messageId, error } = await this.sendWhatsApp(notification, recipient));
          break;
        case 'email':
          ({ success, messageId, error } = await this.sendEmail(notification, recipient));
          break;
        case 'sms':
          ({ success, messageId, error } = await this.sendSMS(notification, recipient));
          break;
        case 'push':
          ({ success, messageId, error } = await this.sendPush(notification, recipient));
          break;
        case 'sistema':
          ({ success, messageId, error } = await this.sendSystem(notification, recipient));
          break;
        default:
          error = 'Canal não suportado';
      }

      // Registrar resultado
      notification.results.push({
        channel: channel.id,
        recipient: recipient.userId,
        status: success ? 'success' : 'failed',
        timestamp: new Date().toISOString(),
        error,
        messageId
      });

      // Atualizar estatísticas do canal
      channel.totalSent = (channel.totalSent || 0) + 1;
      channel.lastUsed = new Date().toISOString();
      
      if (success) {
        const successRate = notification.results.filter(r => r.channel === channel.id && r.status === 'success').length /
                          notification.results.filter(r => r.channel === channel.id).length * 100;
        channel.successRate = successRate;
      }

    } catch (error) {
      notification.results.push({
        channel: channel.id,
        recipient: recipient.userId,
        status: 'failed',
        timestamp: new Date().toISOString(),
        error: String(error)
      });
    }
  }

  // Implementações específicas por canal
  private async sendWhatsApp(
    notification: Notification,
    recipient: { userId: string; name: string; phone?: string; email?: string }
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!recipient.phone) {
        return { success: false, error: 'Telefone não informado' };
      }

      // Simular envio WhatsApp (em produção usar API real)
      console.log(`📱 WhatsApp para ${recipient.phone}:`);
      console.log(notification.message);

      // Simular delay e possível falha
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (Math.random() > 0.05) { // 95% de sucesso
        return { 
          success: true, 
          messageId: `wa_${Date.now()}_${Math.random().toString(36).substr(2, 6)}` 
        };
      } else {
        return { success: false, error: 'Falha na API do WhatsApp' };
      }

    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  private async sendEmail(
    notification: Notification,
    recipient: { userId: string; name: string; phone?: string; email?: string }
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!recipient.email) {
        return { success: false, error: 'Email não informado' };
      }

      // Simular envio de email
      console.log(`📧 Email para ${recipient.email}:`);
      console.log(`Assunto: ${notification.title}`);
      console.log(notification.message);

      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (Math.random() > 0.02) { // 98% de sucesso
        return { 
          success: true, 
          messageId: `email_${Date.now()}_${Math.random().toString(36).substr(2, 6)}` 
        };
      } else {
        return { success: false, error: 'Falha no servidor de email' };
      }

    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  private async sendSMS(
    notification: Notification,
    recipient: { userId: string; name: string; phone?: string; email?: string }
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!recipient.phone) {
        return { success: false, error: 'Telefone não informado' };
      }

      // Simular envio SMS
      console.log(`📱 SMS para ${recipient.phone}:`);
      console.log(notification.message.substring(0, 160)); // Limitar a 160 caracteres

      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (Math.random() > 0.08) { // 92% de sucesso
        return { 
          success: true, 
          messageId: `sms_${Date.now()}_${Math.random().toString(36).substr(2, 6)}` 
        };
      } else {
        return { success: false, error: 'Falha na operadora SMS' };
      }

    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  private async sendPush(
    notification: Notification,
    recipient: { userId: string; name: string; phone?: string; email?: string }
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Simular push notification
      console.log(`🔔 Push para ${recipient.name}:`);
      console.log(`${notification.title}: ${notification.message.substring(0, 100)}`);

      await new Promise(resolve => setTimeout(resolve, 200));
      
      if (Math.random() > 0.15) { // 85% de sucesso
        // Disparar evento para mostrar no sistema
        this.dispatchSystemNotification(notification, recipient);
        
        return { 
          success: true, 
          messageId: `push_${Date.now()}_${Math.random().toString(36).substr(2, 6)}` 
        };
      } else {
        return { success: false, error: 'Dispositivo offline' };
      }

    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  private async sendSystem(
    notification: Notification,
    recipient: { userId: string; name: string; phone?: string; email?: string }
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Notificação do sistema sempre funciona
      console.log(`🖥️ Sistema para ${recipient.name}:`);
      console.log(`${notification.title}: ${notification.message}`);

      // Disparar evento para interface
      this.dispatchSystemNotification(notification, recipient);

      return { 
        success: true, 
        messageId: `sys_${Date.now()}_${Math.random().toString(36).substr(2, 6)}` 
      };

    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  // Disparar notificação no sistema
  private dispatchSystemNotification(
    notification: Notification,
    recipient: { userId: string; name: string; phone?: string; email?: string }
  ): void {
    const evento = new CustomEvent('systemNotification', {
      detail: {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        priority: notification.priority,
        recipient: recipient.userId,
        timestamp: new Date().toISOString(),
        data: notification.data
      }
    });
    
    window.dispatchEvent(evento);
  }

  // Verificar throttling
  private checkThrottling(notification: Notification): boolean {
    const now = Date.now();
    const hour = 60 * 60 * 1000;
    const day = 24 * hour;

    for (const ruleId of this.rules.keys()) {
      const rule = this.rules.get(ruleId);
      if (!rule?.throttling) continue;

      const key = `${ruleId}_${notification.type}`;
      let counter = this.throttleCounters.get(key);

      if (!counter) {
        counter = { hour: 0, day: 0, lastReset: now };
        this.throttleCounters.set(key, counter);
      }

      // Reset contadores se necessário
      if (now - counter.lastReset > hour) {
        counter.hour = 0;
        if (now - counter.lastReset > day) {
          counter.day = 0;
        }
        counter.lastReset = now;
      }

      // Verificar limites
      if (rule.throttling.maxPerHour && counter.hour >= rule.throttling.maxPerHour) {
        return false;
      }
      if (rule.throttling.maxPerDay && counter.day >= rule.throttling.maxPerDay) {
        return false;
      }

      // Incrementar contadores
      counter.hour++;
      counter.day++;
    }

    return true;
  }

  // Agendar notificação
  private scheduleNotification(notification: Notification): void {
    if (!notification.scheduledFor) return;

    const scheduledTime = new Date(notification.scheduledFor).getTime();
    const now = Date.now();
    const delay = scheduledTime - now;

    if (delay > 0) {
      setTimeout(() => {
        this.queue.push(notification);
        this.processQueue();
      }, delay);
      
      console.log(`⏰ Notificação ${notification.id} agendada para ${notification.scheduledFor}`);
    }
  }

  // Iniciar processador de fila
  private startQueueProcessor(): void {
    // Processar fila a cada 30 segundos
    setInterval(() => {
      this.processQueue();
    }, 30000);

    // Verificar notificações agendadas a cada minuto
    setInterval(() => {
      this.checkScheduledNotifications();
    }, 60000);
  }

  // Verificar notificações agendadas
  private checkScheduledNotifications(): void {
    const now = new Date();
    
    this.notifications
      .filter(n => n.status === 'pending' && n.scheduledFor)
      .forEach(notification => {
        if (new Date(notification.scheduledFor!) <= now) {
          this.queue.push(notification);
        }
      });
  }

  // Processar evento e disparar regras
  async processEvent(event: string, data: any): Promise<void> {
    console.log(`🎪 Processando evento: ${event}`, data);

    for (const rule of this.rules.values()) {
      if (!rule.enabled) continue;

      const shouldTrigger = rule.triggers.some(trigger => {
        if (trigger.event !== event) return false;
        
        // Verificar condições se existirem
        if (trigger.conditions) {
          return Object.entries(trigger.conditions).every(([key, value]) => {
            return data[key] === value;
          });
        }
        
        return true;
      });

      if (shouldTrigger) {
        await this.executeRule(rule, data);
      }
    }
  }

  // Executar regra
  private async executeRule(rule: NotificationRule, data: any): Promise<void> {
    try {
      console.log(`📋 Executando regra: ${rule.name}`);

      // Determinar destinatários
      let recipients: string[] = [];
      
      switch (rule.recipients.type) {
        case 'specific':
          recipients = rule.recipients.targets;
          break;
        case 'role':
          recipients = await this.getUsersByRole(rule.recipients.targets);
          break;
        case 'department':
          recipients = await this.getUsersByDepartment(rule.recipients.targets);
          break;
        case 'all':
          recipients = await this.getAllUsers();
          break;
      }

      if (data.recipientId) {
        recipients = [data.recipientId];
      }

      // Calcular agendamento
      let scheduledFor: string | undefined;
      if (rule.schedule?.delay) {
        const delay = rule.schedule.delay * 60 * 1000; // converter para ms
        scheduledFor = new Date(Date.now() + delay).toISOString();
      }

      // Enviar notificação
      await this.sendNotification(
        rule.template,
        recipients,
        data,
        {
          channels: rule.channels,
          template: rule.template,
          scheduledFor,
          immediate: rule.schedule?.immediate
        }
      );

    } catch (error) {
      console.error(`❌ Erro ao executar regra ${rule.name}:`, error);
    }
  }

  // Métodos auxiliares para buscar usuários
  private async getUsersByRole(roles: string[]): Promise<string[]> {
    // Simular busca por roles
    const mockUsers: Record<string, string[]> = {
      'gestor': ['1', '2'],
      'coordenador': ['3', '4'],
      'corretor': ['5', '6', '7', '8']
    };

    return roles.flatMap(role => mockUsers[role] || []);
  }

  private async getUsersByDepartment(departments: string[]): Promise<string[]> {
    // Simular busca por departamentos
    return ['1', '2', '3'];
  }

  private async getAllUsers(): Promise<string[]> {
    // Simular busca de todos os usuários
    return ['1', '2', '3', '4', '5', '6', '7', '8'];
  }

  // Salvar e carregar dados
  private saveData(): void {
    try {
      localStorage.setItem('notification_channels', JSON.stringify(Array.from(this.channels.entries())));
      localStorage.setItem('notification_templates', JSON.stringify(Array.from(this.templates.entries())));
      localStorage.setItem('notification_rules', JSON.stringify(Array.from(this.rules.entries())));
      localStorage.setItem('notifications', JSON.stringify(this.notifications.slice(-100))); // Manter últimas 100
    } catch (error) {
      console.error('Erro ao salvar dados de notificação:', error);
    }
  }

  private loadSavedData(): void {
    try {
      const channels = localStorage.getItem('notification_channels');
      if (channels) {
        this.channels = new Map(JSON.parse(channels));
      }

      const templates = localStorage.getItem('notification_templates');
      if (templates) {
        this.templates = new Map(JSON.parse(templates));
      }

      const rules = localStorage.getItem('notification_rules');
      if (rules) {
        this.rules = new Map(JSON.parse(rules));
      }

      const notifications = localStorage.getItem('notifications');
      if (notifications) {
        this.notifications = JSON.parse(notifications);
      }
    } catch (error) {
      console.error('Erro ao carregar dados salvos:', error);
    }
  }

  // Métodos públicos para gerenciamento
  getStatistics() {
    const total = this.notifications.length;
    const sent = this.notifications.filter(n => n.status === 'sent').length;
    const failed = this.notifications.filter(n => n.status === 'failed').length;
    const pending = this.notifications.filter(n => n.status === 'pending').length;

    const channelStats = Array.from(this.channels.values()).map(channel => ({
      id: channel.id,
      name: channel.name,
      enabled: channel.enabled,
      totalSent: channel.totalSent || 0,
      successRate: channel.successRate || 0,
      status: channel.status
    }));

    return {
      total,
      sent,
      failed,
      pending,
      successRate: total > 0 ? (sent / total) * 100 : 0,
      channels: channelStats,
      queueSize: this.queue.length
    };
  }

  getNotifications(limit = 50) {
    return this.notifications
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  getChannels() {
    return Array.from(this.channels.values());
  }

  getTemplates() {
    return Array.from(this.templates.values());
  }

  getRules() {
    return Array.from(this.rules.values());
  }

  // Configurar canal
  configureChannel(channelId: string, config: Partial<NotificationChannel>): boolean {
    const channel = this.channels.get(channelId);
    if (!channel) return false;

    Object.assign(channel, config);
    this.saveData();
    return true;
  }

  // Criar template
  createTemplate(template: Omit<NotificationTemplate, 'id'>): string {
    const id = `template_${Date.now()}`;
    this.templates.set(id, { ...template, id });
    this.saveData();
    return id;
  }

  // Criar regra
  createRule(rule: Omit<NotificationRule, 'id'>): string {
    const id = `rule_${Date.now()}`;
    this.rules.set(id, { ...rule, id });
    this.saveData();
    return id;
  }
}

// Instância singleton
export const notificationService = new NotificationService();

// Hook para React
export const useNotifications = () => {
  return {
    send: notificationService.sendNotification.bind(notificationService),
    processEvent: notificationService.processEvent.bind(notificationService),
    getStatistics: notificationService.getStatistics.bind(notificationService),
    getNotifications: notificationService.getNotifications.bind(notificationService),
    getChannels: notificationService.getChannels.bind(notificationService),
    getTemplates: notificationService.getTemplates.bind(notificationService),
    getRules: notificationService.getRules.bind(notificationService),
    configureChannel: notificationService.configureChannel.bind(notificationService),
    createTemplate: notificationService.createTemplate.bind(notificationService),
    createRule: notificationService.createRule.bind(notificationService)
  };
};

export default notificationService;