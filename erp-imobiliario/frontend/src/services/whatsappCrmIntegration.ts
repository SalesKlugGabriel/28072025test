// Integração WhatsApp com CRM - Comandos para Anotações e Mudança de Estágio

export interface WhatsAppCommand {
  comando: string;
  leadId: string;
  texto: string;
  remetente: string;
  timestamp: number;
}

export interface CrmAction {
  type: 'anotacao' | 'mudanca_estagio' | 'agendar_tarefa' | 'atribuir_responsavel';
  leadId: string;
  dados: any;
  autorId: string;
  timestamp: number;
}

class WhatsAppCrmIntegration {
  private comandosDisponiveis = {
    // Anotações
    '/nota': { acao: 'anotacao', descricao: 'Adicionar anotação ao lead' },
    '/obs': { acao: 'anotacao', descricao: 'Adicionar observação ao lead' },
    
    // Mudanças de estágio
    '/lead': { acao: 'mudanca_estagio', estagio: 'lead', descricao: 'Mover para Lead' },
    '/interessado': { acao: 'mudanca_estagio', estagio: 'interessado', descricao: 'Mover para Interessado' },
    '/negociacao': { acao: 'mudanca_estagio', estagio: 'negociacao', descricao: 'Mover para Negociação' },
    '/proposta': { acao: 'mudanca_estagio', estagio: 'proposta', descricao: 'Mover para Proposta' },
    '/fechado': { acao: 'mudanca_estagio', estagio: 'fechado', descricao: 'Mover para Fechado' },
    '/perdido': { acao: 'mudanca_estagio', estagio: 'perdido', descricao: 'Mover para Perdido' },
    
    // Tarefas e responsáveis
    '/agendar': { acao: 'agendar_tarefa', descricao: 'Agendar tarefa/follow-up' },
    '/responsavel': { acao: 'atribuir_responsavel', descricao: 'Alterar responsável' },
    
    // Comandos especiais
    '/status': { acao: 'consultar_status', descricao: 'Consultar status do lead' },
    '/help': { acao: 'ajuda', descricao: 'Mostrar comandos disponíveis' }
  };

  private emojisEstagios = {
    'lead': '🆕',
    'interessado': '👀',
    'negociacao': '💬',
    'proposta': '📄',
    'fechado': '🎉',
    'perdido': '❌'
  };

  processarMensagemWhatsApp(mensagem: string, remetente: string, leadId?: string): CrmAction | null {
    const agora = Date.now();
    
    // Verificar se a mensagem contém um comando
    const comando = this.extrairComando(mensagem);
    if (!comando) return null;

    // Se não há leadId, tentar extrair da mensagem
    if (!leadId) {
      leadId = this.extrairLeadId(mensagem);
      if (!leadId) return null;
    }

    const acao = this.comandosDisponiveis[comando.comando as keyof typeof this.comandosDisponiveis];
    if (!acao) return null;

    switch (acao.acao) {
      case 'anotacao':
        return this.criarAcaoAnotacao(comando, leadId, remetente, agora);
      
      case 'mudanca_estagio':
        return this.criarAcaoMudancaEstagio(comando, leadId, remetente, agora, acao);
      
      case 'agendar_tarefa':
        return this.criarAcaoAgendarTarefa(comando, leadId, remetente, agora);
      
      case 'atribuir_responsavel':
        return this.criarAcaoAtribuirResponsavel(comando, leadId, remetente, agora);
      
      default:
        return null;
    }
  }

  private extrairComando(mensagem: string): { comando: string; texto: string } | null {
    const regex = /^(\/\w+)\s*(.*)/;
    const match = mensagem.trim().match(regex);
    
    if (match) {
      return {
        comando: match[1],
        texto: match[2].trim()
      };
    }
    
    return null;
  }

  private extrairLeadId(mensagem: string): string | null {
    // Buscar padrões como #LEAD123 ou @lead123
    const patterns = [
      /#LEAD(\d+)/i,
      /@lead(\d+)/i,
      /lead[:\s]+(\d+)/i
    ];
    
    for (const pattern of patterns) {
      const match = mensagem.match(pattern);
      if (match) {
        return match[1];
      }
    }
    
    return null;
  }

  private criarAcaoAnotacao(comando: { comando: string; texto: string }, leadId: string, remetente: string, timestamp: number): CrmAction {
    return {
      type: 'anotacao',
      leadId,
      dados: {
        texto: comando.texto,
        emoji: this.selecionarEmojiAutomatico(comando.texto),
        origem: 'whatsapp'
      },
      autorId: remetente,
      timestamp
    };
  }

  private criarAcaoMudancaEstagio(comando: { comando: string; texto: string }, leadId: string, remetente: string, timestamp: number, acao: any): CrmAction {
    return {
      type: 'mudanca_estagio',
      leadId,
      dados: {
        novoEstagio: acao.estagio,
        motivo: comando.texto || 'Alterado via WhatsApp',
        emoji: this.emojisEstagios[acao.estagio as keyof typeof this.emojisEstagios]
      },
      autorId: remetente,
      timestamp
    };
  }

  private criarAcaoAgendarTarefa(comando: { comando: string; texto: string }, leadId: string, remetente: string, timestamp: number): CrmAction {
    const dataHora = this.extrairDataHora(comando.texto);
    
    return {
      type: 'agendar_tarefa',
      leadId,
      dados: {
        descricao: comando.texto,
        dataHora: dataHora || new Date(timestamp + 24 * 60 * 60 * 1000), // Padrão: amanhã
        origem: 'whatsapp'
      },
      autorId: remetente,
      timestamp
    };
  }

  private criarAcaoAtribuirResponsavel(comando: { comando: string; texto: string }, leadId: string, remetente: string, timestamp: number): CrmAction {
    return {
      type: 'atribuir_responsavel',
      leadId,
      dados: {
        novoResponsavel: comando.texto,
        motivo: 'Atribuído via WhatsApp'
      },
      autorId: remetente,
      timestamp
    };
  }

  private selecionarEmojiAutomatico(texto: string): string {
    const palavrasChave = {
      '💰': ['dinheiro', 'valor', 'preço', 'financiamento', 'pagamento', 'orçamento'],
      '🏦': ['banco', 'financiamento', 'crédito', 'empréstimo', 'aprovação'],
      '⏰': ['prazo', 'urgente', 'deadline', 'data', 'quando'],
      '📞': ['ligar', 'telefone', 'contato', 'retornar'],
      '📅': ['agendar', 'reunião', 'visita', 'encontro'],
      '🔥': ['interessado', 'quente', 'urgente', 'motivado'],
      '😊': ['satisfeito', 'feliz', 'positivo', 'gostou'],
      '🤔': ['dúvida', 'pensando', 'considerando', 'analisando'],
      '🏢': ['imóvel', 'apartamento', 'casa', 'propriedade'],
      '📝': ['observação', 'nota', 'lembrar', 'importante']
    };

    const textoLower = texto.toLowerCase();
    
    for (const [emoji, palavras] of Object.entries(palavrasChave)) {
      if (palavras.some(palavra => textoLower.includes(palavra))) {
        return emoji;
      }
    }
    
    return '📝'; // Emoji padrão
  }

  private extrairDataHora(texto: string): Date | null {
    // Padrões para extrair data e hora
    const patterns = [
      /(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\s+(\d{1,2}):(\d{2})/,
      /(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/,
      /(hoje|amanhã|segunda|terça|quarta|quinta|sexta|sábado|domingo)\s+(\d{1,2}):(\d{2})/i,
      /(hoje|amanhã)\s+(\d{1,2})h/i
    ];

    for (const pattern of patterns) {
      const match = texto.match(pattern);
      if (match) {
        // Implementar parsing de data baseado no padrão encontrado
        // Esta é uma implementação simplificada
        return new Date(); // Retornar data parseada
      }
    }

    return null;
  }

  // Gerar resposta automática para WhatsApp
  gerarRespostaWhatsApp(acao: CrmAction, leadNome?: string): string {
    const leadInfo = leadNome ? ` para ${leadNome}` : '';
    
    switch (acao.type) {
      case 'anotacao':
        return `✅ Anotação adicionada${leadInfo}\n\n${acao.dados.emoji} "${acao.dados.texto}"\n\n⏰ ${new Date(acao.timestamp).toLocaleString('pt-BR')}`;
      
      case 'mudanca_estagio':
        return `✅ Lead movido${leadInfo}\n\n${acao.dados.emoji} Novo estágio: ${acao.dados.novoEstagio}\n💬 Motivo: ${acao.dados.motivo}\n\n⏰ ${new Date(acao.timestamp).toLocaleString('pt-BR')}`;
      
      case 'agendar_tarefa':
        return `✅ Tarefa agendada${leadInfo}\n\n📅 ${acao.dados.descricao}\n⏰ ${new Date(acao.dados.dataHora).toLocaleString('pt-BR')}`;
      
      case 'atribuir_responsavel':
        return `✅ Responsável alterado${leadInfo}\n\n👤 Novo responsável: ${acao.dados.novoResponsavel}\n⏰ ${new Date(acao.timestamp).toLocaleString('pt-BR')}`;
      
      default:
        return '✅ Ação executada com sucesso!';
    }
  }

  // Gerar mensagem de ajuda
  gerarMensagemAjuda(): string {
    let mensagem = `🤖 *COMANDOS CRM via WhatsApp*\n\n`;
    mensagem += `📝 *ANOTAÇÕES:*\n`;
    mensagem += `/nota #LEAD123 Texto da anotação\n`;
    mensagem += `/obs #LEAD123 Observação importante\n\n`;
    
    mensagem += `🔄 *MUDANÇA DE ESTÁGIO:*\n`;
    mensagem += `/lead #LEAD123 Motivo\n`;
    mensagem += `/interessado #LEAD123 Motivo\n`;
    mensagem += `/negociacao #LEAD123 Motivo\n`;
    mensagem += `/proposta #LEAD123 Motivo\n`;
    mensagem += `/fechado #LEAD123 Motivo\n`;
    mensagem += `/perdido #LEAD123 Motivo\n\n`;
    
    mensagem += `📅 *TAREFAS:*\n`;
    mensagem += `/agendar #LEAD123 Visita amanhã 14:00\n`;
    mensagem += `/responsavel #LEAD123 João Silva\n\n`;
    
    mensagem += `ℹ️ *CONSULTAS:*\n`;
    mensagem += `/status #LEAD123\n`;
    mensagem += `/help\n\n`;
    
    mensagem += `💡 *Exemplo de uso:*\n`;
    mensagem += `/nota #LEAD123 🏦 Cliente tem financiamento pré-aprovado pelo Santander`;
    
    return mensagem;
  }

  // Processar webhook do WhatsApp
  async processarWebhookWhatsApp(dadosWebhook: any): Promise<CrmAction[]> {
    const acoes: CrmAction[] = [];
    
    try {
      // Processar mensagens recebidas
      if (dadosWebhook.messages) {
        for (const mensagem of dadosWebhook.messages) {
          const acao = this.processarMensagemWhatsApp(
            mensagem.body,
            mensagem.from,
            this.extrairLeadId(mensagem.body)
          );
          
          if (acao) {
            acoes.push(acao);
            
            // Enviar resposta automática
            const resposta = this.gerarRespostaWhatsApp(acao);
            await this.enviarMensagemWhatsApp(mensagem.from, resposta);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao processar webhook WhatsApp:', error);
    }
    
    return acoes;
  }

  // Simular envio de mensagem WhatsApp (integração com API real)
  private async enviarMensagemWhatsApp(numero: string, mensagem: string): Promise<void> {
    try {
      // Em produção, integrar com API do WhatsApp Business
      console.log(`📱 Enviando WhatsApp para ${numero}:`, mensagem);
      
      // Simular delay de envio
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Aqui faria a chamada real para a API
      // await fetch('/api/whatsapp/send', {
      //   method: 'POST',
      //   body: JSON.stringify({ numero, mensagem })
      // });
      
    } catch (error) {
      console.error('Erro ao enviar mensagem WhatsApp:', error);
    }
  }
}

// Instância singleton
export const whatsappCrmIntegration = new WhatsAppCrmIntegration();

// Hook para React
export const useWhatsAppCrm = () => {
  return {
    processarMensagem: whatsappCrmIntegration.processarMensagemWhatsApp.bind(whatsappCrmIntegration),
    gerarAjuda: whatsappCrmIntegration.gerarMensagemAjuda.bind(whatsappCrmIntegration),
    processarWebhook: whatsappCrmIntegration.processarWebhookWhatsApp.bind(whatsappCrmIntegration)
  };
};

export default whatsappCrmIntegration;