export interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  variables: string[];
}

export const templates: Template[] = [
  {
    id: 'welcome',
    name: 'Boas-vindas',
    description: 'Mensagem de boas-vindas para novos clientes',
    content: 'Olá {nome}! Bem-vindo(a) ao nosso sistema. Estamos aqui para ajudar você.',
    variables: ['nome']
  },
  {
    id: 'followup',
    name: 'Follow-up',
    description: 'Mensagem de acompanhamento para clientes',
    content: 'Olá {nome}, como você está? Gostaria de saber como podemos ajudar você hoje.',
    variables: ['nome']
  },
  {
    id: 'appointment',
    name: 'Agendamento',
    description: 'Confirmação de agendamento',
    content: 'Olá {nome}, confirmamos seu agendamento para {data} às {hora}. Te esperamos!',
    variables: ['nome', 'data', 'hora']
  }
];

export function getTemplate(id: string): Template | undefined {
  return templates.find(template => template.id === id);
}

export function processTemplate(templateContent: string, variables: Record<string, string>): string {
  let processed = templateContent;
  
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{${key}}`;
    processed = processed.replace(new RegExp(placeholder, 'g'), value);
  });
  
  return processed;
}

export function extractVariables(templateContent: string): string[] {
  const matches = templateContent.match(/{([^}]+)}/g);
  if (!matches) return [];
  
  return matches.map(match => match.slice(1, -1));
}