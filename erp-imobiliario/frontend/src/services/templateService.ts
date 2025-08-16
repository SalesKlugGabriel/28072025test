export interface Template {
  id: string;
  nome: string;
  tipo: 'whatsapp' | 'email' | 'sms' | 'follow-up' | 'notificacao';
  categoria: 'boas-vindas' | 'follow-up' | 'proposta' | 'agendamento' | 'pos-venda' | 'abandono';
  conteudo: string;
  variaveis: string[];
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
  configuracoes?: {
    agendarParaMinutos?: number;
    condicoes?: string[];
    gatilhos?: string[];
  };
}

export interface FollowUpTask {
  id: string;
  leadId: string;
  tipo: 'ligacao' | 'whatsapp' | 'email' | 'reuniao' | 'visita';
  titulo: string;
  descricao: string;
  dataAgendada: string;
  status: 'pendente' | 'concluido' | 'cancelado';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  responsavel: string;
  templateUsado?: string;
  lembretes: {
    15: boolean; // 15 minutos antes
    60: boolean; // 1 hora antes
    1440: boolean; // 1 dia antes
  };
}

export class TemplateService {
  private static instance: TemplateService;
  private templates: Template[] = [];
  private followUpTasks: FollowUpTask[] = [];

  static getInstance(): TemplateService {
    if (!TemplateService.instance) {
      TemplateService.instance = new TemplateService();
      TemplateService.instance.initializeDefaultTemplates();
    }
    return TemplateService.instance;
  }

  private initializeDefaultTemplates(): void {
    const defaultTemplates: Template[] = [
      {
        id: 'whatsapp-boas-vindas',
        nome: 'Boas-vindas WhatsApp',
        tipo: 'whatsapp',
        categoria: 'boas-vindas',
        conteudo: `Olá {{nome}}! 👋

Obrigado pelo seu interesse em nossos empreendimentos! 

Sou {{responsavel}} da {{empresa}} e vou te ajudar a encontrar o imóvel ideal.

Gostaria de agendar uma conversa para conhecer melhor suas necessidades?`,
        variaveis: ['nome', 'responsavel', 'empresa'],
        ativo: true,
        dataCriacao: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString(),
        configuracoes: {
          agendarParaMinutos: 5,
          gatilhos: ['novo_lead', 'primeiro_contato']
        }
      },
      {
        id: 'email-follow-up-1',
        nome: 'Follow-up Email - 1º contato',
        tipo: 'email',
        categoria: 'follow-up',
        conteudo: `Assunto: Sobre seu interesse em nossos empreendimentos

Olá {{nome}},

Percebi que demonstrou interesse em nossos empreendimentos e gostaria de compartilhar algumas informações que podem ser úteis:

🏢 **{{empreendimento}}**
📍 Localização: {{localizacao}}
💰 A partir de: {{valor_inicial}}
📅 Entrega: {{previsao_entrega}}

Gostaria de agendar uma visita ou tem alguma dúvida específica?

Atenciosamente,
{{responsavel}}
{{empresa}}
{{telefone}}`,
        variaveis: ['nome', 'empreendimento', 'localizacao', 'valor_inicial', 'previsao_entrega', 'responsavel', 'empresa', 'telefone'],
        ativo: true,
        dataCriacao: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString(),
        configuracoes: {
          agendarParaMinutos: 1440, // 24 horas
          condicoes: ['sem_resposta_24h'],
          gatilhos: ['primeiro_contato_sem_resposta']
        }
      },
      {
        id: 'whatsapp-proposta',
        nome: 'Envio de Proposta WhatsApp',
        tipo: 'whatsapp',
        categoria: 'proposta',
        conteudo: `{{nome}}, conforme nossa conversa, segue a proposta personalizada para você! 📋

🏢 **{{empreendimento}}**
🏠 {{tipo_unidade}} - {{metragem}}m²
💰 Valor: {{valor_total}}
💳 Entrada: {{valor_entrada}} ({{percentual_entrada}}%)
📅 Financiamento: {{parcelas}}x de {{valor_parcela}}

✨ **Condições especiais válidas até {{data_validade}}**

Gostaria de agendar uma reunião para esclarecer dúvidas?`,
        variaveis: ['nome', 'empreendimento', 'tipo_unidade', 'metragem', 'valor_total', 'valor_entrada', 'percentual_entrada', 'parcelas', 'valor_parcela', 'data_validade'],
        ativo: true,
        dataCriacao: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString(),
        configuracoes: {
          gatilhos: ['gerar_proposta', 'proposta_personalizada']
        }
      },
      {
        id: 'follow-up-agendamento',
        nome: 'Follow-up para Agendamento',
        tipo: 'follow-up',
        categoria: 'agendamento',
        conteudo: `Lembrete: Reunião agendada com {{nome}}

📅 Data: {{data_reuniao}}
⏰ Horário: {{horario_reuniao}}
📍 Local: {{local_reuniao}}
📞 Contato: {{telefone_cliente}}

Itens a abordar:
- {{item_1}}
- {{item_2}}
- {{item_3}}

Documentos necessários:
- {{doc_1}}
- {{doc_2}}`,
        variaveis: ['nome', 'data_reuniao', 'horario_reuniao', 'local_reuniao', 'telefone_cliente', 'item_1', 'item_2', 'item_3', 'doc_1', 'doc_2'],
        ativo: true,
        dataCriacao: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString(),
        configuracoes: {
          agendarParaMinutos: 60,
          lembretes: { 15: true, 60: true, 1440: false }
        }
      },
      {
        id: 'whatsapp-abandono',
        nome: 'Recuperação de Lead Inativo',
        tipo: 'whatsapp',
        categoria: 'abandono',
        conteudo: `Oi {{nome}}! 😊

Notei que faz um tempo que não conversamos sobre seu interesse em nossos empreendimentos.

Temos algumas novidades que podem te interessar:

🆕 {{novidade_1}}
🎁 {{promocao_ativa}}
📅 {{evento_especial}}

Que tal retomarmos nossa conversa? Posso te ajudar com alguma coisa específica?`,
        variaveis: ['nome', 'novidade_1', 'promocao_ativa', 'evento_especial'],
        ativo: true,
        dataCriacao: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString(),
        configuracoes: {
          agendarParaMinutos: 10080, // 7 dias
          condicoes: ['sem_interacao_7_dias'],
          gatilhos: ['lead_inativo']
        }
      },
      {
        id: 'email-pos-venda',
        nome: 'Pós-venda - Satisfação',
        tipo: 'email',
        categoria: 'pos-venda',
        conteudo: `Assunto: Como está sua experiência com {{empreendimento}}?

Olá {{nome}},

Esperamos que esteja satisfeito(a) com sua escolha do {{empreendimento}}!

Gostaríamos de saber como está sendo sua experiência:

📝 **Pesquisa de Satisfação** (2 minutos)
{{link_pesquisa}}

Sua opinião é muito importante para continuarmos melhorando nossos serviços.

Em caso de dúvidas ou necessidades, nossa equipe está sempre disponível.

Atenciosamente,
{{responsavel}}
Equipe {{empresa}}`,
        variaveis: ['nome', 'empreendimento', 'link_pesquisa', 'responsavel', 'empresa'],
        ativo: true,
        dataCriacao: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString(),
        configuracoes: {
          agendarParaMinutos: 43200, // 30 dias
          gatilhos: ['venda_concluida']
        }
      }
    ];

    this.templates = defaultTemplates;
    this.salvarTemplates();
  }

  processarTemplate(templateId: string, variaveis: Record<string, string>): string {
    const template = this.templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error(`Template ${templateId} não encontrado`);
    }

    let conteudo = template.conteudo;
    
    // Substituir todas as variáveis
    Object.entries(variaveis).forEach(([chave, valor]) => {
      const regex = new RegExp(`{{${chave}}}`, 'g');
      conteudo = conteudo.replace(regex, valor || '');
    });

    return conteudo;
  }

  criarFollowUp(dados: {
    leadId: string;
    templateId: string;
    tipo: FollowUpTask['tipo'];
    minutosAdiante: number;
    responsavel: string;
    variaveis?: Record<string, string>;
  }): FollowUpTask {
    const template = this.templates.find(t => t.id === dados.templateId);
    if (!template) {
      throw new Error(`Template ${dados.templateId} não encontrado`);
    }

    const dataAgendada = new Date();
    dataAgendada.setMinutes(dataAgendada.getMinutes() + dados.minutosAdiante);

    const followUp: FollowUpTask = {
      id: `followup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      leadId: dados.leadId,
      tipo: dados.tipo,
      titulo: `Follow-up: ${template.nome}`,
      descricao: dados.variaveis ? 
        this.processarTemplate(dados.templateId, dados.variaveis) : 
        template.conteudo,
      dataAgendada: dataAgendada.toISOString(),
      status: 'pendente',
      prioridade: 'media',
      responsavel: dados.responsavel,
      templateUsado: dados.templateId,
      lembretes: {
        15: true,
        60: true,
        1440: false
      }
    };

    this.followUpTasks.push(followUp);
    this.salvarFollowUps();

    return followUp;
  }

  agendarMensagemAutomatica(dados: {
    leadId: string;
    templateId: string;
    minutosAdiante: number;
    variaveis: Record<string, string>;
    canal: 'whatsapp' | 'email' | 'sms';
  }): void {
    setTimeout(() => {
      this.enviarMensagemProcessada(dados);
    }, dados.minutosAdiante * 60 * 1000);

    // Salvar agendamento
    const agendamentos = JSON.parse(localStorage.getItem('mensagens_agendadas') || '[]');
    agendamentos.push({
      ...dados,
      agendadaEm: new Date().toISOString(),
      enviarEm: new Date(Date.now() + dados.minutosAdiante * 60 * 1000).toISOString()
    });
    localStorage.setItem('mensagens_agendadas', JSON.stringify(agendamentos));
  }

  private async enviarMensagemProcessada(dados: {
    leadId: string;
    templateId: string;
    variaveis: Record<string, string>;
    canal: 'whatsapp' | 'email' | 'sms';
  }): Promise<void> {
    try {
      const mensagem = this.processarTemplate(dados.templateId, dados.variaveis);
      
      // Simular envio baseado no canal
      switch (dados.canal) {
        case 'whatsapp':
          console.log(`[WhatsApp] Enviando para lead ${dados.leadId}:`, mensagem);
          break;
        case 'email':
          console.log(`[Email] Enviando para lead ${dados.leadId}:`, mensagem);
          break;
        case 'sms':
          console.log(`[SMS] Enviando para lead ${dados.leadId}:`, mensagem);
          break;
      }

      // Registrar no histórico
      this.registrarHistoricoMensagem({
        leadId: dados.leadId,
        templateId: dados.templateId,
        canal: dados.canal,
        mensagem,
        status: 'enviado',
        dataEnvio: new Date().toISOString()
      });

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      this.registrarHistoricoMensagem({
        leadId: dados.leadId,
        templateId: dados.templateId,
        canal: dados.canal,
        mensagem: '',
        status: 'erro',
        dataEnvio: new Date().toISOString(),
        erro: error.toString()
      });
    }
  }

  private registrarHistoricoMensagem(dados: any): void {
    const historico = JSON.parse(localStorage.getItem('historico_mensagens') || '[]');
    historico.push(dados);
    localStorage.setItem('historico_mensagens', JSON.stringify(historico));
  }

  // CRUD Templates
  listarTemplates(tipo?: Template['tipo']): Template[] {
    if (tipo) {
      return this.templates.filter(t => t.tipo === tipo && t.ativo);
    }
    return this.templates.filter(t => t.ativo);
  }

  obterTemplate(id: string): Template | undefined {
    return this.templates.find(t => t.id === id);
  }

  criarTemplate(template: Omit<Template, 'id' | 'dataCriacao' | 'dataAtualizacao'>): Template {
    const novoTemplate: Template = {
      ...template,
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString()
    };

    this.templates.push(novoTemplate);
    this.salvarTemplates();
    
    return novoTemplate;
  }

  atualizarTemplate(id: string, dados: Partial<Template>): Template {
    const index = this.templates.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Template não encontrado');
    }

    this.templates[index] = {
      ...this.templates[index],
      ...dados,
      dataAtualizacao: new Date().toISOString()
    };

    this.salvarTemplates();
    return this.templates[index];
  }

  // CRUD Follow-ups
  listarFollowUps(leadId?: string, status?: FollowUpTask['status']): FollowUpTask[] {
    let tasks = this.followUpTasks;
    
    if (leadId) {
      tasks = tasks.filter(t => t.leadId === leadId);
    }
    
    if (status) {
      tasks = tasks.filter(t => t.status === status);
    }
    
    return tasks.sort((a, b) => new Date(a.dataAgendada).getTime() - new Date(b.dataAgendada).getTime());
  }

  concluirFollowUp(id: string): void {
    const task = this.followUpTasks.find(t => t.id === id);
    if (task) {
      task.status = 'concluido';
      this.salvarFollowUps();
    }
  }

  // Persistência
  private salvarTemplates(): void {
    localStorage.setItem('message_templates', JSON.stringify(this.templates));
  }

  private salvarFollowUps(): void {
    localStorage.setItem('follow_up_tasks', JSON.stringify(this.followUpTasks));
  }

  carregarDados(): void {
    const templatesData = localStorage.getItem('message_templates');
    if (templatesData) {
      this.templates = JSON.parse(templatesData);
    }

    const followUpsData = localStorage.getItem('follow_up_tasks');
    if (followUpsData) {
      this.followUpTasks = JSON.parse(followUpsData);
    }
  }

  // Utilitários
  obterVariaveisTemplate(templateId: string): string[] {
    const template = this.obterTemplate(templateId);
    return template ? template.variaveis : [];
  }

  validarVariaveis(templateId: string, variaveis: Record<string, string>): { valido: boolean; faltando: string[] } {
    const variaveisNecessarias = this.obterVariaveisTemplate(templateId);
    const faltando = variaveisNecessarias.filter(v => !variaveis[v] || variaveis[v].trim() === '');
    
    return {
      valido: faltando.length === 0,
      faltando
    };
  }
}

export const templateService = TemplateService.getInstance();