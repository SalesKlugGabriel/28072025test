export interface ChatMessage {
  from: string;
  to: string;
  text: string;
  timestamp: string;
}

export interface MessageTemplate {
  id: string;
  content: string;
}

interface IncomingPayload {
  from: string;
  to: string;
  text?: { body: string };
}

/**
 * WhatsAppService encapsulates the WhatsApp Business API calls.
 * The implementation here is a stub to illustrate how the integration
 * would be structured inside the project.
 */
export class WhatsAppService {
  constructor(private token: string) {}

  /**
   * Sends a text message through WhatsApp Business.
   * TODO: replace fetch with real WhatsApp Business endpoint
   */
  async sendMessage(to: string, text: string) {
    console.log('Sending message to', to, text);
    // await fetch('https://graph.facebook.com/v17.0/WHATSAPP_NUMBER/messages', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${this.token}`
    //   },
    //   body: JSON.stringify({ to, text: { body: text } })
    // });
  }

  /**
   * Handles an incoming webhook payload from WhatsApp and persists
   * the conversation to localStorage so leads keep their history.
   */
  async handleIncoming(payload: IncomingPayload) {
    const message: ChatMessage = {
      from: payload.from,
      to: payload.to,
      text: payload.text?.body || '',
      timestamp: new Date().toISOString()
    };
    saveConversation(payload.from, message);
  }
}

const STORAGE_KEY = 'crm_chat_history';

export function saveConversation(leadId: string, message: ChatMessage) {
  const raw = localStorage.getItem(STORAGE_KEY);
  const data: Record<string, ChatMessage[]> = raw ? JSON.parse(raw) : {};
  data[leadId] = data[leadId] || [];
  data[leadId].push(message);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getConversation(leadId: string): ChatMessage[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  const data: Record<string, ChatMessage[]> = raw ? JSON.parse(raw) : {};
  return data[leadId] || [];
}