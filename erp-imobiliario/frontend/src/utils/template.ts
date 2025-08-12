import { MessageTemplate } from '../services/whatsapp';

const STORAGE_KEY = 'crm_message_templates';

export function getTemplates(): MessageTemplate[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getTemplateById(id: string): MessageTemplate | undefined {
  return getTemplates().find(t => t.id === id);
}

export function saveTemplate(template: MessageTemplate) {
  const templates = getTemplates();
  const idx = templates.findIndex(t => t.id === template.id);
  if (idx >= 0) {
    templates[idx] = template;
  } else {
    templates.push(template);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

/** Tutorial
 * 1. Call saveTemplate({id: 'welcome', content: 'Olá {{nome}}'}) to persist a new template.
 * 2. Use the template in chat typing /template welcome
 * 3. The command will replace the input by the template content before sending.
 */