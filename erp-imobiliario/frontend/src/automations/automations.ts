import { MessageTemplate } from '../services/whatsapp';
import { getTemplateById } from '../utils/templates';
import { WhatsAppService } from '../services/whatsapp';

export interface Automation {
  id: string;
  stage: string; // stage id
  templateId: string; // message template
}

const STORAGE_KEY = 'crm_automations';

export function getAutomations(): Automation[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveAutomation(automation: Automation) {
  const autos = getAutomations();
  const idx = autos.findIndex(a => a.id === automation.id);
  if (idx >= 0) autos[idx] = automation; else autos.push(automation);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(autos));
}

export async function triggerStageAutomations(stage: string, leadId: string, token: string) {
  const autos = getAutomations().filter(a => a.stage === stage);
  const service = new WhatsAppService(token);
  for (const auto of autos) {
    const tpl: MessageTemplate | undefined = getTemplateById(auto.templateId);
    if (tpl) {
      await service.sendMessage(leadId, tpl.content);
    }
  }
}