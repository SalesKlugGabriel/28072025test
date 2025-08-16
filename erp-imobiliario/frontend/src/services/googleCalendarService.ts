export interface GoogleCalendarConfig {
  clientId: string;
  apiKey: string;
  scopes: string[];
}

export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
  conferenceData?: {
    createRequest: {
      requestId: string;
      conferenceSolutionKey: {
        type: string;
      };
    };
  };
  hangoutLink?: string;
}

export interface CreateEventParams {
  titulo: string;
  descricao: string;
  dataInicio: string; // ISO string
  dataFim: string; // ISO string
  emailsConvidados: string[];
  incluirGoogleMeet: boolean;
  timeZone?: string;
}

class GoogleCalendarService {
  private config: GoogleCalendarConfig;
  private gapi: any = null;
  private isInitialized = false;
  private isSignedIn = false;

  constructor(config: GoogleCalendarConfig) {
    this.config = config;
  }

  // Inicializar Google API
  async initialize(): Promise<boolean> {
    try {
      // Carregar Google API
      if (!window.gapi) {
        await this.loadGoogleAPI();
      }

      this.gapi = window.gapi;

      // Inicializar cliente
      await this.gapi.load('client:auth2', async () => {
        await this.gapi.client.init({
          apiKey: this.config.apiKey,
          clientId: this.config.clientId,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
          scope: this.config.scopes.join(' ')
        });

        this.isInitialized = true;
        
        // Verificar se já está autenticado
        const authInstance = this.gapi.auth2.getAuthInstance();
        this.isSignedIn = authInstance.isSignedIn.get();
      });

      return true;
    } catch (error) {
      console.error('Erro ao inicializar Google Calendar API:', error);
      return false;
    }
  }

  // Carregar Google API Script
  private loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Falha ao carregar Google API'));
      document.head.appendChild(script);
    });
  }

  // Fazer login no Google
  async signIn(): Promise<boolean> {
    if (!this.isInitialized) {
      throw new Error('Google Calendar API não inicializada');
    }

    try {
      const authInstance = this.gapi.auth2.getAuthInstance();
      await authInstance.signIn();
      this.isSignedIn = true;
      return true;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  }

  // Fazer logout
  async signOut(): Promise<void> {
    if (!this.isInitialized) return;

    try {
      const authInstance = this.gapi.auth2.getAuthInstance();
      await authInstance.signOut();
      this.isSignedIn = false;
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    return this.isInitialized && this.isSignedIn;
  }

  // Obter informações do usuário
  getUserInfo(): any {
    if (!this.isAuthenticated()) return null;

    const authInstance = this.gapi.auth2.getAuthInstance();
    const user = authInstance.currentUser.get();
    const profile = user.getBasicProfile();

    return {
      id: profile.getId(),
      nome: profile.getName(),
      email: profile.getEmail(),
      foto: profile.getImageUrl()
    };
  }

  // Criar evento no calendário
  async createEvent(params: CreateEventParams): Promise<{ success: boolean; event?: CalendarEvent; meetLink?: string; error?: string }> {
    if (!this.isAuthenticated()) {
      return { success: false, error: 'Não autenticado no Google' };
    }

    try {
      const timeZone = params.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      const event: CalendarEvent = {
        summary: params.titulo,
        description: params.descricao,
        start: {
          dateTime: params.dataInicio,
          timeZone: timeZone
        },
        end: {
          dateTime: params.dataFim,
          timeZone: timeZone
        },
        attendees: params.emailsConvidados.map(email => ({ email }))
      };

      // Adicionar Google Meet se solicitado
      if (params.incluirGoogleMeet) {
        event.conferenceData = {
          createRequest: {
            requestId: crypto.randomUUID(),
            conferenceSolutionKey: {
              type: 'hangoutsMeet'
            }
          }
        };
      }

      const response = await this.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: params.incluirGoogleMeet ? 1 : 0,
        sendUpdates: 'all' // Enviar convites para todos os participantes
      });

      const createdEvent = response.result;

      return {
        success: true,
        event: createdEvent,
        meetLink: createdEvent.hangoutLink || createdEvent.conferenceData?.entryPoints?.[0]?.uri
      };
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      return { 
        success: false, 
        error: 'Erro ao criar evento no Google Calendar' 
      };
    }
  }

  // Atualizar evento existente
  async updateEvent(eventId: string, params: Partial<CreateEventParams>): Promise<{ success: boolean; event?: CalendarEvent; error?: string }> {
    if (!this.isAuthenticated()) {
      return { success: false, error: 'Não autenticado no Google' };
    }

    try {
      const timeZone = params.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      const updateData: Partial<CalendarEvent> = {};

      if (params.titulo) updateData.summary = params.titulo;
      if (params.descricao) updateData.description = params.descricao;
      if (params.dataInicio) {
        updateData.start = {
          dateTime: params.dataInicio,
          timeZone: timeZone
        };
      }
      if (params.dataFim) {
        updateData.end = {
          dateTime: params.dataFim,
          timeZone: timeZone
        };
      }
      if (params.emailsConvidados) {
        updateData.attendees = params.emailsConvidados.map(email => ({ email }));
      }

      const response = await this.gapi.client.calendar.events.patch({
        calendarId: 'primary',
        eventId: eventId,
        resource: updateData,
        sendUpdates: 'all'
      });

      return {
        success: true,
        event: response.result
      };
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      return { 
        success: false, 
        error: 'Erro ao atualizar evento no Google Calendar' 
      };
    }
  }

  // Deletar evento
  async deleteEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    if (!this.isAuthenticated()) {
      return { success: false, error: 'Não autenticado no Google' };
    }

    try {
      await this.gapi.client.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
        sendUpdates: 'all'
      });

      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      return { 
        success: false, 
        error: 'Erro ao deletar evento do Google Calendar' 
      };
    }
  }

  // Listar eventos de um período
  async listEvents(dataInicio: string, dataFim: string): Promise<{ success: boolean; events?: CalendarEvent[]; error?: string }> {
    if (!this.isAuthenticated()) {
      return { success: false, error: 'Não autenticado no Google' };
    }

    try {
      const response = await this.gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: dataInicio,
        timeMax: dataFim,
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 100
      });

      return {
        success: true,
        events: response.result.items || []
      };
    } catch (error) {
      console.error('Erro ao listar eventos:', error);
      return { 
        success: false, 
        error: 'Erro ao listar eventos do Google Calendar' 
      };
    }
  }

  // Criar link do Google Meet independente
  async createMeetLink(): Promise<{ success: boolean; meetLink?: string; error?: string }> {
    try {
      // Criar um evento temporário apenas para gerar o link do Meet
      const now = new Date();
      const endTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hora depois

      const result = await this.createEvent({
        titulo: 'Link de Videoconferência - Temporário',
        descricao: 'Evento temporário para geração de link do Google Meet',
        dataInicio: now.toISOString(),
        dataFim: endTime.toISOString(),
        emailsConvidados: [],
        incluirGoogleMeet: true
      });

      if (result.success && result.meetLink) {
        // Deletar o evento temporário, mas manter o link do Meet
        if (result.event?.id) {
          await this.deleteEvent(result.event.id);
        }

        return {
          success: true,
          meetLink: result.meetLink
        };
      }

      return {
        success: false,
        error: 'Não foi possível gerar link do Google Meet'
      };
    } catch (error) {
      console.error('Erro ao criar link do Meet:', error);
      return {
        success: false,
        error: 'Erro ao criar link do Google Meet'
      };
    }
  }

  // Verificar disponibilidade em horários específicos
  async checkAvailability(emails: string[], dataInicio: string, dataFim: string): Promise<{ success: boolean; availability?: any; error?: string }> {
    if (!this.isAuthenticated()) {
      return { success: false, error: 'Não autenticado no Google' };
    }

    try {
      const response = await this.gapi.client.calendar.freebusy.query({
        resource: {
          timeMin: dataInicio,
          timeMax: dataFim,
          items: emails.map(email => ({ id: email }))
        }
      });

      return {
        success: true,
        availability: response.result
      };
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      return {
        success: false,
        error: 'Erro ao verificar disponibilidade'
      };
    }
  }
}

// Singleton instance
export const googleCalendarService = new GoogleCalendarService({
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
  scopes: [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ]
});

export default googleCalendarService;