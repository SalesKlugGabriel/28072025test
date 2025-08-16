// Sistema de Ações em Massa para Leads/Clientes

export interface BulkActionType {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'stage' | 'assignment' | 'communication' | 'data' | 'export' | 'delete';
  requiresConfirmation: boolean;
  requiresInput?: {
    type: 'text' | 'select' | 'date' | 'number' | 'multiselect';
    label: string;
    options?: Array<{ value: string; label: string }>;
    required: boolean;
    placeholder?: string;
  }[];
  permissions?: string[];
  maxItems?: number;
  estimatedTime?: number; // em segundos
}

export interface BulkActionExecution {
  id: string;
  actionId: string;
  itemIds: string[];
  parameters: Record<string, any>;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: string;
  endTime?: string;
  progress: {
    total: number;
    processed: number;
    successful: number;
    failed: number;
  };
  results: Array<{
    itemId: string;
    status: 'success' | 'failed' | 'skipped';
    message?: string;
    error?: string;
  }>;
  executedBy: string;
  estimatedCompletion?: string;
}

export interface BulkActionFilter {
  field: string;
  operator: 'equals' | 'contains' | 'starts_with' | 'greater_than' | 'less_than' | 'in_range' | 'is_empty' | 'is_not_empty';
  value: any;
  label: string;
}

class BulkActionsService {
  private actions: Map<string, BulkActionType> = new Map();
  private executions: BulkActionExecution[] = [];
  private runningExecutions: Map<string, BulkActionExecution> = new Map();

  constructor() {
    this.initializeDefaultActions();
    this.loadSavedData();
  }

  private initializeDefaultActions() {
    const defaultActions: BulkActionType[] = [
      // Ações de Estágio
      {
        id: 'change_stage',
        name: 'Alterar Estágio',
        description: 'Mover leads selecionados para outro estágio',
        icon: '🔄',
        category: 'stage',
        requiresConfirmation: true,
        requiresInput: [{
          type: 'select',
          label: 'Novo Estágio',
          options: [
            { value: 'lead', label: '🆕 Lead' },
            { value: 'interessado', label: '👀 Interessado' },
            { value: 'negociacao', label: '💬 Negociação' },
            { value: 'proposta', label: '📄 Proposta' },
            { value: 'fechado', label: '🎉 Fechado' },
            { value: 'perdido', label: '❌ Perdido' }
          ],
          required: true
        }, {
          type: 'text',
          label: 'Motivo da Alteração',
          required: false,
          placeholder: 'Descreva o motivo da mudança...'
        }],
        maxItems: 50
      },
      {
        id: 'mark_as_lost',
        name: 'Marcar como Perdido',
        description: 'Marcar leads selecionados como perdidos',
        icon: '❌',
        category: 'stage',
        requiresConfirmation: true,
        requiresInput: [{
          type: 'select',
          label: 'Motivo da Perda',
          options: [
            { value: 'preco', label: 'Preço muito alto' },
            { value: 'localizacao', label: 'Localização não agradou' },
            { value: 'concorrencia', label: 'Escolheu concorrente' },
            { value: 'financiamento', label: 'Problemas no financiamento' },
            { value: 'desistencia', label: 'Desistiu da compra' },
            { value: 'sem_retorno', label: 'Não retornou contato' },
            { value: 'outro', label: 'Outro motivo' }
          ],
          required: true
        }, {
          type: 'text',
          label: 'Observações Adicionais',
          required: false,
          placeholder: 'Detalhes sobre a perda...'
        }],
        maxItems: 100
      },

      // Ações de Atribuição
      {
        id: 'assign_user',
        name: 'Atribuir Responsável',
        description: 'Atribuir leads a um corretor específico',
        icon: '👨‍💼',
        category: 'assignment',
        requiresConfirmation: true,
        requiresInput: [{
          type: 'select',
          label: 'Novo Responsável',
          options: [
            { value: '1', label: 'Maria Silva' },
            { value: '2', label: 'João Santos' },
            { value: '3', label: 'Ana Costa' },
            { value: '4', label: 'Carlos Oliveira' }
          ],
          required: true
        }, {
          type: 'text',
          label: 'Observações para o Corretor',
          required: false,
          placeholder: 'Instruções ou observações...'
        }],
        maxItems: 30
      },
      {
        id: 'redistribute_leads',
        name: 'Redistribuir Automaticamente',
        description: 'Redistribuir leads usando as regras automáticas',
        icon: '⚖️',
        category: 'assignment',
        requiresConfirmation: true,
        requiresInput: [{
          type: 'select',
          label: 'Método de Distribuição',
          options: [
            { value: 'round_robin', label: 'Round Robin' },
            { value: 'menor_carga', label: 'Menor Carga' },
            { value: 'melhor_performance', label: 'Melhor Performance' },
            { value: 'especialidade', label: 'Por Especialidade' }
          ],
          required: true
        }],
        maxItems: 50
      },

      // Ações de Comunicação
      {
        id: 'send_whatsapp',
        name: 'Enviar WhatsApp',
        description: 'Enviar mensagem WhatsApp para leads selecionados',
        icon: '💬',
        category: 'communication',
        requiresConfirmation: true,
        requiresInput: [{
          type: 'select',
          label: 'Template de Mensagem',
          options: [
            { value: 'follow_up', label: '📞 Follow-up Padrão' },
            { value: 'agendamento', label: '📅 Convite para Agendamento' },
            { value: 'promocao', label: '🏷️ Promoção Especial' },
            { value: 'lancamento', label: '🚀 Novo Lançamento' },
            { value: 'personalizada', label: '✏️ Mensagem Personalizada' }
          ],
          required: true
        }, {
          type: 'text',
          label: 'Mensagem Personalizada',
          required: false,
          placeholder: 'Digite sua mensagem...'
        }],
        maxItems: 100,
        estimatedTime: 2 // 2 segundos por item
      },
      {
        id: 'send_email',
        name: 'Enviar Email',
        description: 'Enviar email marketing para leads selecionados',
        icon: '📧',
        category: 'communication',
        requiresConfirmation: true,
        requiresInput: [{
          type: 'select',
          label: 'Template de Email',
          options: [
            { value: 'newsletter', label: '📰 Newsletter' },
            { value: 'catalogo', label: '📖 Catálogo de Imóveis' },
            { value: 'convite_evento', label: '🎉 Convite para Evento' },
            { value: 'follow_up', label: '📞 Follow-up' },
            { value: 'personalizado', label: '✏️ Email Personalizado' }
          ],
          required: true
        }, {
          type: 'text',
          label: 'Assunto do Email',
          required: true,
          placeholder: 'Assunto do email...'
        }],
        maxItems: 500,
        estimatedTime: 1
      },
      {
        id: 'schedule_callback',
        name: 'Agendar Follow-up',
        description: 'Agendar follow-up para leads selecionados',
        icon: '📅',
        category: 'communication',
        requiresConfirmation: false,
        requiresInput: [{
          type: 'date',
          label: 'Data do Follow-up',
          required: true
        }, {
          type: 'select',
          label: 'Tipo de Follow-up',
          options: [
            { value: 'ligacao', label: '📞 Ligação' },
            { value: 'whatsapp', label: '💬 WhatsApp' },
            { value: 'email', label: '📧 Email' },
            { value: 'visita', label: '🏠 Visita' }
          ],
          required: true
        }, {
          type: 'text',
          label: 'Observações',
          required: false,
          placeholder: 'Lembrete para o follow-up...'
        }],
        maxItems: 200
      },

      // Ações de Dados
      {
        id: 'add_tags',
        name: 'Adicionar Tags',
        description: 'Adicionar tags aos leads selecionados',
        icon: '🏷️',
        category: 'data',
        requiresConfirmation: false,
        requiresInput: [{
          type: 'multiselect',
          label: 'Tags para Adicionar',
          options: [
            { value: 'vip', label: '⭐ VIP' },
            { value: 'urgente', label: '🔥 Urgente' },
            { value: 'qualificado', label: '✅ Qualificado' },
            { value: 'investidor', label: '💼 Investidor' },
            { value: 'primeira_casa', label: '🏠 Primeira Casa' },
            { value: 'alto_padrao', label: '👑 Alto Padrão' },
            { value: 'financiamento', label: '🏦 Financiamento' },
            { value: 'vista', label: '💰 À Vista' }
          ],
          required: true
        }],
        maxItems: 500
      },
      {
        id: 'remove_tags',
        name: 'Remover Tags',
        description: 'Remover tags dos leads selecionados',
        icon: '🗑️',
        category: 'data',
        requiresConfirmation: false,
        requiresInput: [{
          type: 'multiselect',
          label: 'Tags para Remover',
          options: [
            { value: 'vip', label: '⭐ VIP' },
            { value: 'urgente', label: '🔥 Urgente' },
            { value: 'qualificado', label: '✅ Qualificado' },
            { value: 'investidor', label: '💼 Investidor' },
            { value: 'primeira_casa', label: '🏠 Primeira Casa' },
            { value: 'alto_padrao', label: '👑 Alto Padrão' },
            { value: 'financiamento', label: '🏦 Financiamento' },
            { value: 'vista', label: '💰 À Vista' }
          ],
          required: true
        }],
        maxItems: 500
      },
      {
        id: 'update_priority',
        name: 'Alterar Prioridade',
        description: 'Alterar prioridade dos leads selecionados',
        icon: '⚡',
        category: 'data',
        requiresConfirmation: false,
        requiresInput: [{
          type: 'select',
          label: 'Nova Prioridade',
          options: [
            { value: 'baixa', label: '🟢 Baixa' },
            { value: 'media', label: '🟡 Média' },
            { value: 'alta', label: '🟠 Alta' },
            { value: 'urgente', label: '🔴 Urgente' }
          ],
          required: true
        }],
        maxItems: 500
      },

      // Ações de Exportação
      {
        id: 'export_excel',
        name: 'Exportar para Excel',
        description: 'Exportar leads selecionados para arquivo Excel',
        icon: '📊',
        category: 'export',
        requiresConfirmation: false,
        requiresInput: [{
          type: 'multiselect',
          label: 'Campos para Exportar',
          options: [
            { value: 'nome', label: 'Nome' },
            { value: 'email', label: 'Email' },
            { value: 'telefone', label: 'Telefone' },
            { value: 'origem', label: 'Origem' },
            { value: 'estagio', label: 'Estágio' },
            { value: 'responsavel', label: 'Responsável' },
            { value: 'valor', label: 'Valor Interesse' },
            { value: 'data_criacao', label: 'Data Criação' },
            { value: 'ultimo_contato', label: 'Último Contato' },
            { value: 'tags', label: 'Tags' },
            { value: 'observacoes', label: 'Observações' }
          ],
          required: true
        }],
        maxItems: 1000,
        estimatedTime: 0.1
      },
      {
        id: 'export_labels',
        name: 'Gerar Etiquetas',
        description: 'Gerar etiquetas de endereço para envios',
        icon: '🏷️',
        category: 'export',
        requiresConfirmation: false,
        requiresInput: [{
          type: 'select',
          label: 'Formato da Etiqueta',
          options: [
            { value: 'pimaco_6182', label: 'Pimaco 6182 (25.4x101.6mm)' },
            { value: 'pimaco_6283', label: 'Pimaco 6283 (25.4x66.7mm)' },
            { value: 'a4_custom', label: 'A4 Personalizado' }
          ],
          required: true
        }],
        maxItems: 500
      },

      // Ações de Exclusão
      {
        id: 'soft_delete',
        name: 'Arquivar Leads',
        description: 'Arquivar leads selecionados (podem ser restaurados)',
        icon: '📦',
        category: 'delete',
        requiresConfirmation: true,
        requiresInput: [{
          type: 'text',
          label: 'Motivo do Arquivamento',
          required: true,
          placeholder: 'Por que estes leads estão sendo arquivados?'
        }],
        maxItems: 100
      },
      {
        id: 'hard_delete',
        name: 'Excluir Permanentemente',
        description: 'Excluir leads permanentemente (IRREVERSÍVEL)',
        icon: '🗑️',
        category: 'delete',
        requiresConfirmation: true,
        requiresInput: [{
          type: 'text',
          label: 'Confirmação',
          required: true,
          placeholder: 'Digite "CONFIRMAR" para prosseguir'
        }],
        maxItems: 50,
        permissions: ['admin', 'super_admin']
      }
    ];

    defaultActions.forEach(action => {
      this.actions.set(action.id, action);
    });
  }

  // Executar ação em massa
  async executeAction(
    actionId: string,
    itemIds: string[],
    parameters: Record<string, any>,
    executedBy: string
  ): Promise<string> {
    const action = this.actions.get(actionId);
    if (!action) {
      throw new Error(`Ação não encontrada: ${actionId}`);
    }

    // Validar limites
    if (action.maxItems && itemIds.length > action.maxItems) {
      throw new Error(`Máximo de ${action.maxItems} itens permitidos para esta ação`);
    }

    // Validar parâmetros obrigatórios
    if (action.requiresInput) {
      for (const input of action.requiresInput) {
        if (input.required && !parameters[input.label]) {
          throw new Error(`Parâmetro obrigatório: ${input.label}`);
        }
      }
    }

    // Criar execução
    const execution: BulkActionExecution = {
      id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      actionId,
      itemIds,
      parameters,
      status: 'pending',
      startTime: new Date().toISOString(),
      progress: {
        total: itemIds.length,
        processed: 0,
        successful: 0,
        failed: 0
      },
      results: [],
      executedBy
    };

    // Calcular tempo estimado
    if (action.estimatedTime) {
      const estimatedMs = itemIds.length * action.estimatedTime * 1000;
      execution.estimatedCompletion = new Date(Date.now() + estimatedMs).toISOString();
    }

    // Adicionar à lista de execuções
    this.executions.push(execution);
    this.saveData();

    // Iniciar processamento
    this.processExecution(execution);

    console.log(`🚀 Iniciando execução em massa: ${action.name} para ${itemIds.length} itens`);
    return execution.id;
  }

  // Processar execução
  private async processExecution(execution: BulkActionExecution): Promise<void> {
    try {
      execution.status = 'running';
      this.runningExecutions.set(execution.id, execution);

      const action = this.actions.get(execution.actionId);
      if (!action) {
        throw new Error('Ação não encontrada');
      }

      console.log(`⚡ Processando: ${action.name}`);

      // Processar cada item
      for (let i = 0; i < execution.itemIds.length; i++) {
        const itemId = execution.itemIds[i];
        
        try {
          const result = await this.processItem(action, itemId, execution.parameters);
          
          execution.results.push({
            itemId,
            status: result.success ? 'success' : 'failed',
            message: result.message,
            error: result.error
          });

          if (result.success) {
            execution.progress.successful++;
          } else {
            execution.progress.failed++;
          }

        } catch (error) {
          execution.results.push({
            itemId,
            status: 'failed',
            error: String(error)
          });
          execution.progress.failed++;
        }

        execution.progress.processed++;

        // Delay entre processamentos para não sobrecarregar
        if (i < execution.itemIds.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Salvar progresso a cada 10 itens
        if (i % 10 === 0) {
          this.saveData();
        }
      }

      execution.status = 'completed';
      execution.endTime = new Date().toISOString();

      console.log(`✅ Execução concluída: ${execution.progress.successful}/${execution.progress.total} sucessos`);

    } catch (error) {
      execution.status = 'failed';
      execution.endTime = new Date().toISOString();
      console.error(`❌ Execução falhou:`, error);

    } finally {
      this.runningExecutions.delete(execution.id);
      this.saveData();
      
      // Disparar evento de conclusão
      this.dispatchEvent('execution_completed', execution);
    }
  }

  // Processar item individual
  private async processItem(
    action: BulkActionType,
    itemId: string,
    parameters: Record<string, any>
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      switch (action.id) {
        case 'change_stage':
          return await this.processChangeStage(itemId, parameters);
        
        case 'mark_as_lost':
          return await this.processMarkAsLost(itemId, parameters);
        
        case 'assign_user':
          return await this.processAssignUser(itemId, parameters);
        
        case 'redistribute_leads':
          return await this.processRedistribute(itemId, parameters);
        
        case 'send_whatsapp':
          return await this.processSendWhatsApp(itemId, parameters);
        
        case 'send_email':
          return await this.processSendEmail(itemId, parameters);
        
        case 'schedule_callback':
          return await this.processScheduleCallback(itemId, parameters);
        
        case 'add_tags':
          return await this.processAddTags(itemId, parameters);
        
        case 'remove_tags':
          return await this.processRemoveTags(itemId, parameters);
        
        case 'update_priority':
          return await this.processUpdatePriority(itemId, parameters);
        
        case 'export_excel':
          return await this.processExportExcel(itemId, parameters);
        
        case 'export_labels':
          return await this.processExportLabels(itemId, parameters);
        
        case 'soft_delete':
          return await this.processSoftDelete(itemId, parameters);
        
        case 'hard_delete':
          return await this.processHardDelete(itemId, parameters);
        
        default:
          return { success: false, error: 'Ação não implementada' };
      }

    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  // Implementações específicas de cada ação
  private async processChangeStage(itemId: string, parameters: Record<string, any>) {
    console.log(`🔄 Alterando estágio do lead ${itemId} para ${parameters['Novo Estágio']}`);
    
    // Simular alteração de estágio
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Em produção, fazer chamada real para API
    return { 
      success: true, 
      message: `Estágio alterado para ${parameters['Novo Estágio']}` 
    };
  }

  private async processMarkAsLost(itemId: string, parameters: Record<string, any>) {
    console.log(`❌ Marcando lead ${itemId} como perdido: ${parameters['Motivo da Perda']}`);
    
    await new Promise(resolve => setTimeout(resolve, 150));
    
    return { 
      success: true, 
      message: `Marcado como perdido: ${parameters['Motivo da Perda']}` 
    };
  }

  private async processAssignUser(itemId: string, parameters: Record<string, any>) {
    console.log(`👨‍💼 Atribuindo lead ${itemId} para ${parameters['Novo Responsável']}`);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return { 
      success: true, 
      message: `Atribuído para corretor ${parameters['Novo Responsável']}` 
    };
  }

  private async processRedistribute(itemId: string, parameters: Record<string, any>) {
    console.log(`⚖️ Redistribuindo lead ${itemId} usando ${parameters['Método de Distribuição']}`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simular redistribuição
    const corretores = ['Maria Silva', 'João Santos', 'Ana Costa'];
    const corretorEscolhido = corretores[Math.floor(Math.random() * corretores.length)];
    
    return { 
      success: true, 
      message: `Redistribuído para ${corretorEscolhido}` 
    };
  }

  private async processSendWhatsApp(itemId: string, parameters: Record<string, any>) {
    console.log(`💬 Enviando WhatsApp para lead ${itemId}`);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simular envio com possibilidade de falha
    if (Math.random() > 0.1) { // 90% sucesso
      return { 
        success: true, 
        message: `WhatsApp enviado com template ${parameters['Template de Mensagem']}` 
      };
    } else {
      return { 
        success: false, 
        error: 'Número de telefone inválido ou bloqueado' 
      };
    }
  }

  private async processSendEmail(itemId: string, parameters: Record<string, any>) {
    console.log(`📧 Enviando email para lead ${itemId}`);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (Math.random() > 0.05) { // 95% sucesso
      return { 
        success: true, 
        message: `Email enviado: ${parameters['Assunto do Email']}` 
      };
    } else {
      return { 
        success: false, 
        error: 'Email inválido ou bounced' 
      };
    }
  }

  private async processScheduleCallback(itemId: string, parameters: Record<string, any>) {
    console.log(`📅 Agendando follow-up para lead ${itemId}`);
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return { 
      success: true, 
      message: `Follow-up agendado para ${parameters['Data do Follow-up']}` 
    };
  }

  private async processAddTags(itemId: string, parameters: Record<string, any>) {
    console.log(`🏷️ Adicionando tags ao lead ${itemId}`);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const tags = parameters['Tags para Adicionar'];
    return { 
      success: true, 
      message: `Tags adicionadas: ${Array.isArray(tags) ? tags.join(', ') : tags}` 
    };
  }

  private async processRemoveTags(itemId: string, parameters: Record<string, any>) {
    console.log(`🗑️ Removendo tags do lead ${itemId}`);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const tags = parameters['Tags para Remover'];
    return { 
      success: true, 
      message: `Tags removidas: ${Array.isArray(tags) ? tags.join(', ') : tags}` 
    };
  }

  private async processUpdatePriority(itemId: string, parameters: Record<string, any>) {
    console.log(`⚡ Alterando prioridade do lead ${itemId}`);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return { 
      success: true, 
      message: `Prioridade alterada para ${parameters['Nova Prioridade']}` 
    };
  }

  private async processExportExcel(itemId: string, parameters: Record<string, any>) {
    // Para exportação, não processamos item por item
    // Esta é apenas uma simulação
    return { 
      success: true, 
      message: 'Incluído na exportação' 
    };
  }

  private async processExportLabels(itemId: string, parameters: Record<string, any>) {
    return { 
      success: true, 
      message: 'Incluído nas etiquetas' 
    };
  }

  private async processSoftDelete(itemId: string, parameters: Record<string, any>) {
    console.log(`📦 Arquivando lead ${itemId}`);
    
    await new Promise(resolve => setTimeout(resolve, 150));
    
    return { 
      success: true, 
      message: `Arquivado: ${parameters['Motivo do Arquivamento']}` 
    };
  }

  private async processHardDelete(itemId: string, parameters: Record<string, any>) {
    if (parameters['Confirmação'] !== 'CONFIRMAR') {
      return { 
        success: false, 
        error: 'Confirmação inválida' 
      };
    }

    console.log(`🗑️ Excluindo permanentemente lead ${itemId}`);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return { 
      success: true, 
      message: 'Excluído permanentemente' 
    };
  }

  // Cancelar execução
  cancelExecution(executionId: string): boolean {
    const execution = this.runningExecutions.get(executionId);
    if (!execution) {
      return false;
    }

    execution.status = 'cancelled';
    execution.endTime = new Date().toISOString();
    this.runningExecutions.delete(executionId);
    this.saveData();

    console.log(`⏹️ Execução cancelada: ${executionId}`);
    return true;
  }

  // Aplicar filtros para seleção em massa
  applyFilters(items: any[], filters: BulkActionFilter[]): any[] {
    return items.filter(item => {
      return filters.every(filter => {
        const fieldValue = item[filter.field];
        
        switch (filter.operator) {
          case 'equals':
            return fieldValue === filter.value;
          
          case 'contains':
            return String(fieldValue).toLowerCase().includes(String(filter.value).toLowerCase());
          
          case 'starts_with':
            return String(fieldValue).toLowerCase().startsWith(String(filter.value).toLowerCase());
          
          case 'greater_than':
            return Number(fieldValue) > Number(filter.value);
          
          case 'less_than':
            return Number(fieldValue) < Number(filter.value);
          
          case 'in_range':
            const [min, max] = filter.value;
            const numValue = Number(fieldValue);
            return numValue >= min && numValue <= max;
          
          case 'is_empty':
            return !fieldValue || fieldValue === '';
          
          case 'is_not_empty':
            return fieldValue && fieldValue !== '';
          
          default:
            return true;
        }
      });
    });
  }

  // Validar seleção
  validateSelection(actionId: string, itemIds: string[]): { valid: boolean; message?: string } {
    const action = this.actions.get(actionId);
    if (!action) {
      return { valid: false, message: 'Ação não encontrada' };
    }

    if (itemIds.length === 0) {
      return { valid: false, message: 'Nenhum item selecionado' };
    }

    if (action.maxItems && itemIds.length > action.maxItems) {
      return { 
        valid: false, 
        message: `Máximo de ${action.maxItems} itens permitidos para esta ação` 
      };
    }

    return { valid: true };
  }

  // Disparar eventos
  private dispatchEvent(type: string, data: any): void {
    const event = new CustomEvent('bulkAction', {
      detail: { type, data, timestamp: new Date().toISOString() }
    });
    window.dispatchEvent(event);
  }

  // Salvar e carregar dados
  private saveData(): void {
    try {
      localStorage.setItem('bulk_executions', JSON.stringify(this.executions.slice(-50))); // Manter últimas 50
    } catch (error) {
      console.error('Erro ao salvar execuções:', error);
    }
  }

  private loadSavedData(): void {
    try {
      const executions = localStorage.getItem('bulk_executions');
      if (executions) {
        this.executions = JSON.parse(executions);
      }
    } catch (error) {
      console.error('Erro ao carregar execuções:', error);
    }
  }

  // Getters públicos
  getActions(): BulkActionType[] {
    return Array.from(this.actions.values());
  }

  getActionsByCategory(category: string): BulkActionType[] {
    return Array.from(this.actions.values()).filter(action => action.category === category);
  }

  getExecution(executionId: string): BulkActionExecution | undefined {
    return this.executions.find(e => e.id === executionId);
  }

  getExecutions(limit = 20): BulkActionExecution[] {
    return this.executions
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .slice(0, limit);
  }

  getRunningExecutions(): BulkActionExecution[] {
    return Array.from(this.runningExecutions.values());
  }

  getStatistics() {
    const total = this.executions.length;
    const completed = this.executions.filter(e => e.status === 'completed').length;
    const failed = this.executions.filter(e => e.status === 'failed').length;
    const running = this.runningExecutions.size;

    const totalItemsProcessed = this.executions.reduce((acc, e) => acc + e.progress.processed, 0);
    const totalItemsSuccessful = this.executions.reduce((acc, e) => acc + e.progress.successful, 0);

    return {
      total,
      completed,
      failed,
      running,
      successRate: totalItemsProcessed > 0 ? (totalItemsSuccessful / totalItemsProcessed) * 100 : 0,
      totalItemsProcessed,
      totalItemsSuccessful,
      actionUsage: this.getActionUsageStats()
    };
  }

  private getActionUsageStats() {
    const usage: Record<string, number> = {};
    
    this.executions.forEach(execution => {
      usage[execution.actionId] = (usage[execution.actionId] || 0) + 1;
    });

    return Object.entries(usage)
      .map(([actionId, count]) => ({
        actionId,
        actionName: this.actions.get(actionId)?.name || actionId,
        count
      }))
      .sort((a, b) => b.count - a.count);
  }
}

// Instância singleton
export const bulkActionsService = new BulkActionsService();

// Hook para React
export const useBulkActions = () => {
  return {
    getActions: bulkActionsService.getActions.bind(bulkActionsService),
    getActionsByCategory: bulkActionsService.getActionsByCategory.bind(bulkActionsService),
    executeAction: bulkActionsService.executeAction.bind(bulkActionsService),
    cancelExecution: bulkActionsService.cancelExecution.bind(bulkActionsService),
    getExecution: bulkActionsService.getExecution.bind(bulkActionsService),
    getExecutions: bulkActionsService.getExecutions.bind(bulkActionsService),
    getRunningExecutions: bulkActionsService.getRunningExecutions.bind(bulkActionsService),
    applyFilters: bulkActionsService.applyFilters.bind(bulkActionsService),
    validateSelection: bulkActionsService.validateSelection.bind(bulkActionsService),
    getStatistics: bulkActionsService.getStatistics.bind(bulkActionsService)
  };
};

export default bulkActionsService;