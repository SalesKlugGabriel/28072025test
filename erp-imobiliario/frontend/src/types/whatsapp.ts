// Interfaces para WhatsApp
export interface WhatsAppConnection {
  id: string;
  userId: string;
  userName: string;
  phoneNumber: string;
  status: 'connected' | 'disconnected' | 'connecting' | 'qr_pending';
  qrCode?: string;
  lastConnection?: string;
  sessionId?: string;
  evolutionConfig?: EvolutionAPIConfig;
}

export interface EvolutionAPIConfig {
  apiUrl: string;
  token: string;
  instanceId: string;
  webhookUrl?: string;
  isActive: boolean;
}

export interface WhatsAppMessage {
  id: string;
  connectionId: string;
  from: string;
  to: string;
  message: string;
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  direction: 'incoming' | 'outgoing';
  clienteId?: string;
  attachments?: {
    id: string;
    type: 'image' | 'document' | 'audio' | 'video';
    url: string;
    filename?: string;
  }[];
}

export interface SendMessageParams {
  connectionId: string;
  phoneNumber: string;
  message: string;
  clienteId?: string;
}