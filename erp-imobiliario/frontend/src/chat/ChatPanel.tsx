import React, { useState } from 'react';
import { WhatsAppService, getConversation, saveConversation } from '../services/whatsapp';
import { formatEmpreendimentoSummary } from '../utils/empreendimentos';
import { getTemplateById } from '../utils/templates';

interface ChatPanelProps {
  leadId: string;
  token: string;
}

interface Command {
  type: 'empreendimento' | 'manager' | 'template' | 'none';
  payload?: string;
}

function parseCommand(text: string): Command {
  if (text.startsWith('/@')) {
    return { type: 'manager', payload: text.substring(2) };
  }
  if (text.startsWith('/"') && text.endsWith('"')) {
    return { type: 'empreendimento', payload: text.slice(2, -1) };
  }
  if (text.startsWith('/template ')) {
    return { type: 'template', payload: text.replace('/template ', '') };
  }
  return { type: 'none' };
}

/**
 * ChatPanel renders a full screen chat interface with command parsing,
 * tag support and message templates.
 */
export default function ChatPanel({ leadId, token }: ChatPanelProps) {
  const service = new WhatsAppService(token);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => getConversation(leadId));

  const handleSend = async () => {
    const cmd = parseCommand(input);
    let text = input;
    if (cmd.type === 'empreendimento' && cmd.payload) {
      text = formatEmpreendimentoSummary(cmd.payload);
    } else if (cmd.type === 'template' && cmd.payload) {
      const tpl = getTemplateById(cmd.payload);
      if (tpl) text = tpl.content;
    }

    await service.sendMessage(leadId, text);
    const msg = { from: 'me', to: leadId, text, timestamp: new Date().toISOString() };
    saveConversation(leadId, msg);
    setMessages([...messages, msg]);
    setInput('');
  };

  return (
    <div className="chat-panel-full">
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={m.from === 'me' ? 'me' : 'them'}>
            <span>{m.text}</span>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Digite uma mensagem ou comando" />
        <button onClick={handleSend}>Enviar</button>
      </div>
    </div>
  );
}