// Sistema de Distribuição Automática de Leads

export interface CorretoDisponivel {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  status: 'online' | 'ocupado' | 'ausente' | 'offline';
  capacidadeMaxima: number;
  leadsAtivos: number;
  especialidades: string[];
  horarioTrabalho: {
    inicio: string;
    fim: string;
    diasSemana: number[]; // 0=domingo, 1=segunda...
  };
  performance: {
    conversaoMedia: number;
    tempoResposta: number; // em minutos
    satisfacaoCliente: number; // 1-5
    metaMensal: number;
    vendidoMes: number;
  };
  localizacao?: {
    latitude: number;
    longitude: number;
    regiaoAtendimento: string[];
  };
  ultimaAtividade: string;
  configuracoes: {
    receberLeadsWhatsApp: boolean;
    receberLeadsTelefone: boolean;
    receberLeadsEmail: boolean;
    tiposImovelPreferidos: string[];
    faixaValorMin: number;
    faixaValorMax: number;
  };
}

export interface RegraDistribuicao {
  id: string;
  nome: string;
  ativa: boolean;
  prioridade: number;
  criterios: {
    origemLead?: string[];
    valorImovel?: { min: number; max: number };
    localizacao?: string[];
    tipoImovel?: string[];
    horario?: { inicio: string; fim: string };
    diasSemana?: number[];
  };
  metodoDistribuicao: 'round_robin' | 'menor_carga' | 'melhor_performance' | 'proximidade' | 'especialidade';
  corretoresEspecificos?: string[];
  configuracoes: {
    tentativasMaximas: number;
    tempoLimiteResposta: number; // em minutos
    redistribuirSeNaoResponder: boolean;
    notificarGestor: boolean;
  };
}

export interface DistribuicaoLead {
  id: string;
  leadId: string;
  corretorId: string;
  dataDistribuicao: string;
  regraAplicada: string;
  status: 'enviado' | 'aceito' | 'rejeitado' | 'expirado' | 'redistribuido';
  tentativa: number;
  tempoResposta?: number;
  motivoRejeicao?: string;
  historico: Array<{
    corretorId: string;
    status: string;
    timestamp: string;
    observacoes?: string;
  }>;
}

class DistribuicaoLeadsService {
  private corretores: CorretoDisponivel[] = [];
  private regras: RegraDistribuicao[] = [];
  private distribuicoes: DistribuicaoLead[] = [];
  private filaDistribuicao: Map<string, number> = new Map(); // Round robin

  constructor() {
    this.inicializarDados();
    this.configurarMonitoramento();
  }

  private inicializarDados() {
    // Carregar dados salvos ou criar dados mock
    const corretoresSalvos = localStorage.getItem('corretores_distribuicao');
    if (corretoresSalvos) {
      this.corretores = JSON.parse(corretoresSalvos);
    } else {
      this.criarCorretoresMock();
    }

    const regrasSalvas = localStorage.getItem('regras_distribuicao');
    if (regrasSalvas) {
      this.regras = JSON.parse(regrasSalvas);
    } else {
      this.criarRegrasPadrao();
    }

    const distribuicoesSalvas = localStorage.getItem('distribuicoes_leads');
    if (distribuicoesSalvas) {
      this.distribuicoes = JSON.parse(distribuicoesSalvas);
    }
  }

  private criarCorretoresMock() {
    this.corretores = [
      {
        id: '1',
        nome: 'Maria Silva',
        email: 'maria@empresa.com',
        telefone: '(48) 99999-1111',
        status: 'online',
        capacidadeMaxima: 20,
        leadsAtivos: 8,
        especialidades: ['apartamentos', 'alto-padrao'],
        horarioTrabalho: {
          inicio: '08:00',
          fim: '18:00',
          diasSemana: [1, 2, 3, 4, 5, 6]
        },
        performance: {
          conversaoMedia: 15.5,
          tempoResposta: 12,
          satisfacaoCliente: 4.8,
          metaMensal: 10,
          vendidoMes: 7
        },
        localizacao: {
          latitude: -27.5954,
          longitude: -48.5480,
          regiaoAtendimento: ['Centro', 'Trindade', 'Córrego Grande']
        },
        ultimaAtividade: new Date().toISOString(),
        configuracoes: {
          receberLeadsWhatsApp: true,
          receberLeadsTelefone: true,
          receberLeadsEmail: true,
          tiposImovelPreferidos: ['apartamento', 'cobertura'],
          faixaValorMin: 300000,
          faixaValorMax: 1500000
        }
      },
      {
        id: '2',
        nome: 'João Santos',
        email: 'joao@empresa.com',
        telefone: '(48) 99999-2222',
        status: 'online',
        capacidadeMaxima: 15,
        leadsAtivos: 12,
        especialidades: ['casas', 'primeiro-imovel'],
        horarioTrabalho: {
          inicio: '09:00',
          fim: '19:00',
          diasSemana: [1, 2, 3, 4, 5]
        },
        performance: {
          conversaoMedia: 18.2,
          tempoResposta: 8,
          satisfacaoCliente: 4.9,
          metaMensal: 8,
          vendidoMes: 9
        },
        localizacao: {
          latitude: -27.6108,
          longitude: -48.6326,
          regiaoAtendimento: ['Kobrasol', 'Campinas', 'São José']
        },
        ultimaAtividade: new Date().toISOString(),
        configuracoes: {
          receberLeadsWhatsApp: true,
          receberLeadsTelefone: true,
          receberLeadsEmail: false,
          tiposImovelPreferidos: ['casa', 'sobrado'],
          faixaValorMin: 200000,
          faixaValorMax: 800000
        }
      },
      {
        id: '3',
        nome: 'Ana Costa',
        email: 'ana@empresa.com',
        telefone: '(48) 99999-3333',
        status: 'ocupado',
        capacidadeMaxima: 25,
        leadsAtivos: 22,
        especialidades: ['comercial', 'investimento'],
        horarioTrabalho: {
          inicio: '08:30',
          fim: '17:30',
          diasSemana: [1, 2, 3, 4, 5]
        },
        performance: {
          conversaoMedia: 12.8,
          tempoResposta: 15,
          satisfacaoCliente: 4.6,
          metaMensal: 12,
          vendidoMes: 5
        },
        ultimaAtividade: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min atrás
        configuracoes: {
          receberLeadsWhatsApp: true,
          receberLeadsTelefone: false,
          receberLeadsEmail: true,
          tiposImovelPreferidos: ['comercial', 'sala'],
          faixaValorMin: 100000,
          faixaValorMax: 2000000
        }
      }
    ];
  }

  private criarRegrasPadrao() {
    this.regras = [
      {
        id: '1',
        nome: 'Horário Comercial - Round Robin',
        ativa: true,
        prioridade: 1,
        criterios: {
          horario: { inicio: '08:00', fim: '18:00' },
          diasSemana: [1, 2, 3, 4, 5]
        },
        metodoDistribuicao: 'round_robin',
        configuracoes: {
          tentativasMaximas: 3,
          tempoLimiteResposta: 15,
          redistribuirSeNaoResponder: true,
          notificarGestor: false
        }
      },
      {
        id: '2',
        nome: 'Alto Padrão - Melhor Performance',
        ativa: true,
        prioridade: 2,
        criterios: {
          valorImovel: { min: 800000, max: 999999999 }
        },
        metodoDistribuicao: 'melhor_performance',
        configuracoes: {
          tentativasMaximas: 2,
          tempoLimiteResposta: 10,
          redistribuirSeNaoResponder: true,
          notificarGestor: true
        }
      },
      {
        id: '3',
        nome: 'Primeira Casa - Especialista',
        ativa: true,
        prioridade: 3,
        criterios: {
          valorImovel: { min: 150000, max: 500000 },
          tipoImovel: ['apartamento', 'casa']
        },
        metodoDistribuicao: 'especialidade',
        configuracoes: {
          tentativasMaximas: 2,
          tempoLimiteResposta: 20,
          redistribuirSeNaoResponder: true,
          notificarGestor: false
        }
      },
      {
        id: '4',
        nome: 'Plantão Noturno - Menor Carga',
        ativa: true,
        prioridade: 4,
        criterios: {
          horario: { inicio: '18:01', fim: '07:59' }
        },
        metodoDistribuicao: 'menor_carga',
        configuracoes: {
          tentativasMaximas: 1,
          tempoLimiteResposta: 60,
          redistribuirSeNaoResponder: false,
          notificarGestor: true
        }
      }
    ];
  }

  private configurarMonitoramento() {
    // Verificar distribuições pendentes a cada 5 minutos
    setInterval(() => {
      this.verificarDistribuicoesPendentes();
    }, 5 * 60 * 1000);

    // Atualizar status dos corretores a cada minuto
    setInterval(() => {
      this.atualizarStatusCorretores();
    }, 60 * 1000);
  }

  // Método principal de distribuição
  async distribuirLead(lead: any): Promise<DistribuicaoLead | null> {
    try {
      console.log('🎯 Iniciando distribuição do lead:', lead.id);

      // Encontrar regra aplicável
      const regra = this.encontrarRegraAplicavel(lead);
      if (!regra) {
        console.warn('❌ Nenhuma regra aplicável encontrada para o lead');
        return null;
      }

      console.log('📋 Regra aplicada:', regra.nome);

      // Encontrar corretor apropriado
      const corretor = await this.encontrarCorretor(lead, regra);
      if (!corretor) {
        console.warn('❌ Nenhum corretor disponível encontrado');
        this.notificarGestor('Nenhum corretor disponível', lead);
        return null;
      }

      // Criar distribuição
      const distribuicao: DistribuicaoLead = {
        id: `dist_${Date.now()}`,
        leadId: lead.id,
        corretorId: corretor.id,
        dataDistribuicao: new Date().toISOString(),
        regraAplicada: regra.id,
        status: 'enviado',
        tentativa: 1,
        historico: [{
          corretorId: corretor.id,
          status: 'enviado',
          timestamp: new Date().toISOString()
        }]
      };

      // Salvar distribuição
      this.distribuicoes.push(distribuicao);
      this.salvarDados();

      // Atualizar carga do corretor
      this.atualizarCargaCorretor(corretor.id, 1);

      // Enviar notificação
      await this.enviarNotificacaoCorretor(corretor, lead, distribuicao);

      // Configurar timeout para verificar resposta
      this.configurarTimeoutResposta(distribuicao, regra);

      console.log(`✅ Lead ${lead.id} distribuído para ${corretor.nome}`);
      return distribuicao;

    } catch (error) {
      console.error('❌ Erro na distribuição do lead:', error);
      return null;
    }
  }

  private encontrarRegraAplicavel(lead: any): RegraDistribuicao | null {
    const agora = new Date();
    const horaAtual = agora.toTimeString().slice(0, 5);
    const diaSemana = agora.getDay();

    return this.regras
      .filter(regra => regra.ativa)
      .sort((a, b) => a.prioridade - b.prioridade)
      .find(regra => {
        // Verificar critérios da regra
        if (regra.criterios.origemLead && !regra.criterios.origemLead.includes(lead.origem)) {
          return false;
        }

        if (regra.criterios.valorImovel && lead.valor) {
          const { min, max } = regra.criterios.valorImovel;
          if (lead.valor < min || lead.valor > max) {
            return false;
          }
        }

        if (regra.criterios.tipoImovel && lead.tipoImovel) {
          if (!regra.criterios.tipoImovel.includes(lead.tipoImovel)) {
            return false;
          }
        }

        if (regra.criterios.horario) {
          const { inicio, fim } = regra.criterios.horario;
          if (horaAtual < inicio || horaAtual > fim) {
            return false;
          }
        }

        if (regra.criterios.diasSemana && !regra.criterios.diasSemana.includes(diaSemana)) {
          return false;
        }

        return true;
      }) || null;
  }

  private async encontrarCorretor(lead: any, regra: RegraDistribuicao): Promise<CorretoDisponivel | null> {
    let corretoresDisponiveis = this.corretores.filter(corretor => {
      // Verificar disponibilidade básica
      if (corretor.status === 'offline' || corretor.leadsAtivos >= corretor.capacidadeMaxima) {
        return false;
      }

      // Verificar horário de trabalho
      const agora = new Date();
      const horaAtual = agora.toTimeString().slice(0, 5);
      const diaSemana = agora.getDay();
      
      if (!corretor.horarioTrabalho.diasSemana.includes(diaSemana)) {
        return false;
      }

      if (horaAtual < corretor.horarioTrabalho.inicio || horaAtual > corretor.horarioTrabalho.fim) {
        return false;
      }

      // Verificar configurações do corretor
      if (lead.valor) {
        if (lead.valor < corretor.configuracoes.faixaValorMin || 
            lead.valor > corretor.configuracoes.faixaValorMax) {
          return false;
        }
      }

      if (lead.tipoImovel && corretor.configuracoes.tiposImovelPreferidos.length > 0) {
        if (!corretor.configuracoes.tiposImovelPreferidos.includes(lead.tipoImovel)) {
          return false;
        }
      }

      return true;
    });

    // Filtrar por corretores específicos se definido
    if (regra.corretoresEspecificos && regra.corretoresEspecificos.length > 0) {
      corretoresDisponiveis = corretoresDisponiveis.filter(c => 
        regra.corretoresEspecificos!.includes(c.id)
      );
    }

    if (corretoresDisponiveis.length === 0) {
      return null;
    }

    // Aplicar método de distribuição
    switch (regra.metodoDistribuicao) {
      case 'round_robin':
        return this.distribuirRoundRobin(corretoresDisponiveis);
      
      case 'menor_carga':
        return this.distribuirMenorCarga(corretoresDisponiveis);
      
      case 'melhor_performance':
        return this.distribuirMelhorPerformance(corretoresDisponiveis);
      
      case 'proximidade':
        return this.distribuirProximidade(corretoresDisponiveis, lead);
      
      case 'especialidade':
        return this.distribuirEspecialidade(corretoresDisponiveis, lead);
      
      default:
        return corretoresDisponiveis[0];
    }
  }

  private distribuirRoundRobin(corretores: CorretoDisponivel[]): CorretoDisponivel {
    const chave = 'round_robin_global';
    const indiceAtual = this.filaDistribuicao.get(chave) || 0;
    const proximoIndice = (indiceAtual + 1) % corretores.length;
    
    this.filaDistribuicao.set(chave, proximoIndice);
    return corretores[indiceAtual];
  }

  private distribuirMenorCarga(corretores: CorretoDisponivel[]): CorretoDisponivel {
    return corretores.reduce((menor, atual) => 
      atual.leadsAtivos < menor.leadsAtivos ? atual : menor
    );
  }

  private distribuirMelhorPerformance(corretores: CorretoDisponivel[]): CorretoDisponivel {
    return corretores.reduce((melhor, atual) => {
      const scoreMelhor = this.calcularScorePerformance(melhor);
      const scoreAtual = this.calcularScorePerformance(atual);
      return scoreAtual > scoreMelhor ? atual : melhor;
    });
  }

  private calcularScorePerformance(corretor: CorretoDisponivel): number {
    const { conversaoMedia, tempoResposta, satisfacaoCliente } = corretor.performance;
    
    // Score ponderado (conversão 40%, tempo resposta 30%, satisfação 30%)
    const scoreConversao = conversaoMedia * 0.4;
    const scoreResposta = (60 - Math.min(tempoResposta, 60)) * 0.3; // Menor tempo = maior score
    const scoreSatisfacao = satisfacaoCliente * 6; // Converter escala 1-5 para 0-30
    
    return scoreConversao + scoreResposta + scoreSatisfacao;
  }

  private distribuirProximidade(corretores: CorretoDisponivel[], lead: any): CorretoDisponivel {
    if (!lead.localizacao || !lead.localizacao.latitude) {
      return this.distribuirMenorCarga(corretores);
    }

    return corretores.reduce((maisProximo, atual) => {
      if (!atual.localizacao) return maisProximo;
      
      const distAtual = this.calcularDistancia(
        lead.localizacao.latitude, lead.localizacao.longitude,
        atual.localizacao.latitude, atual.localizacao.longitude
      );
      
      if (!maisProximo.localizacao) return atual;
      
      const distMaisProximo = this.calcularDistancia(
        lead.localizacao.latitude, lead.localizacao.longitude,
        maisProximo.localizacao.latitude, maisProximo.localizacao.longitude
      );
      
      return distAtual < distMaisProximo ? atual : maisProximo;
    });
  }

  private distribuirEspecialidade(corretores: CorretoDisponivel[], lead: any): CorretoDisponivel {
    // Primeiro, tentar encontrar especialista
    const especialistas = corretores.filter(c => {
      if (lead.tipoImovel && c.especialidades.includes(lead.tipoImovel)) return true;
      if (lead.valor && lead.valor > 800000 && c.especialidades.includes('alto-padrao')) return true;
      if (lead.valor && lead.valor < 400000 && c.especialidades.includes('primeiro-imovel')) return true;
      return false;
    });

    if (especialistas.length > 0) {
      return this.distribuirMelhorPerformance(especialistas);
    }

    return this.distribuirMenorCarga(corretores);
  }

  private calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private async enviarNotificacaoCorretor(corretor: CorretoDisponivel, lead: any, distribuicao: DistribuicaoLead): Promise<void> {
    const notificacao = {
      tipo: 'novo_lead',
      titulo: '🎯 Novo Lead Atribuído',
      mensagem: `Lead: ${lead.nome}\nOrigem: ${lead.origem}\nInteresse: ${lead.interesse || 'Não especificado'}`,
      leadId: lead.id,
      distribuicaoId: distribuicao.id,
      timestamp: new Date().toISOString()
    };

    // Simular envio de notificações
    console.log(`📱 Notificação enviada para ${corretor.nome}:`, notificacao);

    // Em produção, enviar via:
    // - Push notification
    // - WhatsApp
    // - Email
    // - SMS

    // Simular envio WhatsApp se configurado
    if (corretor.configuracoes.receberLeadsWhatsApp) {
      const mensagemWhatsApp = `🎯 *NOVO LEAD ATRIBUÍDO*\n\n👤 *Cliente:* ${lead.nome}\n📧 *Email:* ${lead.email}\n📞 *Telefone:* ${lead.telefone}\n🌐 *Origem:* ${lead.origem}\n💰 *Valor Interesse:* ${lead.valor ? `R$ ${lead.valor.toLocaleString()}` : 'Não informado'}\n\n⏰ *Tempo para resposta:* 15 minutos\n\n_Responda este lead rapidamente para manter sua performance alta!_`;
      
      // Aqui integraria com API do WhatsApp
      console.log(`💬 WhatsApp para ${corretor.telefone}:`, mensagemWhatsApp);
    }

    // Disparar evento para o sistema
    this.dispararEventoDistribuicao('lead_distribuido', {
      corretor,
      lead,
      distribuicao
    });
  }

  private configurarTimeoutResposta(distribuicao: DistribuicaoLead, regra: RegraDistribuicao): void {
    setTimeout(() => {
      this.verificarRespostaDistribuicao(distribuicao.id, regra);
    }, regra.configuracoes.tempoLimiteResposta * 60 * 1000);
  }

  private verificarRespostaDistribuicao(distribuicaoId: string, regra: RegraDistribuicao): void {
    const distribuicao = this.distribuicoes.find(d => d.id === distribuicaoId);
    if (!distribuicao || distribuicao.status !== 'enviado') {
      return; // Já foi respondido ou processado
    }

    console.log(`⏰ Timeout na distribuição ${distribuicaoId}`);

    if (regra.configuracoes.redistribuirSeNaoResponder && distribuicao.tentativa < regra.configuracoes.tentativasMaximas) {
      this.redistribuirLead(distribuicao);
    } else {
      distribuicao.status = 'expirado';
      this.salvarDados();
      
      if (regra.configuracoes.notificarGestor) {
        this.notificarGestor('Lead não respondido', distribuicao);
      }
    }
  }

  private async redistribuirLead(distribuicao: DistribuicaoLead): Promise<void> {
    console.log(`🔄 Redistribuindo lead ${distribuicao.leadId}`);

    // Marcar corretor anterior como indisponível temporariamente
    const corretorAnterior = this.corretores.find(c => c.id === distribuicao.corretorId);
    if (corretorAnterior) {
      this.atualizarCargaCorretor(corretorAnterior.id, -1);
    }

    // Buscar lead original (simulado)
    const lead = { id: distribuicao.leadId, nome: 'Lead Redistribuído' };
    
    // Encontrar nova regra e corretor
    const regra = this.regras.find(r => r.id === distribuicao.regraAplicada);
    if (!regra) return;

    const novoCorretor = await this.encontrarCorretor(lead, regra);
    if (!novoCorretor) {
      distribuicao.status = 'expirado';
      this.notificarGestor('Falha na redistribuição', distribuicao);
      return;
    }

    // Atualizar distribuição
    distribuicao.corretorId = novoCorretor.id;
    distribuicao.tentativa++;
    distribuicao.status = 'enviado';
    distribuicao.historico.push({
      corretorId: novoCorretor.id,
      status: 'redistribuido',
      timestamp: new Date().toISOString(),
      observacoes: `Redistribuído - tentativa ${distribuicao.tentativa}`
    });

    this.atualizarCargaCorretor(novoCorretor.id, 1);
    await this.enviarNotificacaoCorretor(novoCorretor, lead, distribuicao);
    this.configurarTimeoutResposta(distribuicao, regra);
    
    this.salvarDados();
  }

  // Métodos públicos para gerenciamento
  aceitarLead(distribuicaoId: string, corretorId: string): boolean {
    const distribuicao = this.distribuicoes.find(d => d.id === distribuicaoId);
    if (!distribuicao || distribuicao.corretorId !== corretorId) {
      return false;
    }

    distribuicao.status = 'aceito';
    distribuicao.tempoResposta = Math.floor((Date.now() - new Date(distribuicao.dataDistribuicao).getTime()) / 60000);
    distribuicao.historico.push({
      corretorId,
      status: 'aceito',
      timestamp: new Date().toISOString()
    });

    this.salvarDados();
    this.dispararEventoDistribuicao('lead_aceito', { distribuicao });
    
    console.log(`✅ Lead ${distribuicao.leadId} aceito por ${corretorId}`);
    return true;
  }

  rejeitarLead(distribuicaoId: string, corretorId: string, motivo: string): boolean {
    const distribuicao = this.distribuicoes.find(d => d.id === distribuicaoId);
    if (!distribuicao || distribuicao.corretorId !== corretorId) {
      return false;
    }

    distribuicao.status = 'rejeitado';
    distribuicao.motivoRejeicao = motivo;
    distribuicao.historico.push({
      corretorId,
      status: 'rejeitado',
      timestamp: new Date().toISOString(),
      observacoes: motivo
    });

    this.atualizarCargaCorretor(corretorId, -1);
    
    // Tentar redistribuir
    const regra = this.regras.find(r => r.id === distribuicao.regraAplicada);
    if (regra && distribuicao.tentativa < regra.configuracoes.tentativasMaximas) {
      setTimeout(() => this.redistribuirLead(distribuicao), 1000);
    }

    this.salvarDados();
    console.log(`❌ Lead ${distribuicao.leadId} rejeitado por ${corretorId}: ${motivo}`);
    return true;
  }

  atualizarStatusCorretor(corretorId: string, status: CorretoDisponivel['status']): void {
    const corretor = this.corretores.find(c => c.id === corretorId);
    if (corretor) {
      corretor.status = status;
      corretor.ultimaAtividade = new Date().toISOString();
      this.salvarDados();
    }
  }

  private atualizarCargaCorretor(corretorId: string, incremento: number): void {
    const corretor = this.corretores.find(c => c.id === corretorId);
    if (corretor) {
      corretor.leadsAtivos = Math.max(0, corretor.leadsAtivos + incremento);
      this.salvarDados();
    }
  }

  private verificarDistribuicoesPendentes(): void {
    const agora = Date.now();
    const quinzeMinutos = 15 * 60 * 1000;

    this.distribuicoes
      .filter(d => d.status === 'enviado')
      .forEach(distribuicao => {
        const tempoEspera = agora - new Date(distribuicao.dataDistribuicao).getTime();
        if (tempoEspera > quinzeMinutos) {
          const regra = this.regras.find(r => r.id === distribuicao.regraAplicada);
          if (regra) {
            this.verificarRespostaDistribuicao(distribuicao.id, regra);
          }
        }
      });
  }

  private atualizarStatusCorretores(): void {
    const agora = Date.now();
    const trintaMinutos = 30 * 60 * 1000;

    this.corretores.forEach(corretor => {
      const tempoInativo = agora - new Date(corretor.ultimaAtividade).getTime();
      if (tempoInativo > trintaMinutos && corretor.status === 'online') {
        corretor.status = 'ausente';
      }
    });

    this.salvarDados();
  }

  private notificarGestor(tipo: string, dados: any): void {
    console.log(`👔 Notificação para gestor - ${tipo}:`, dados);
    
    // Em produção, enviar notificação real para gestores
    this.dispararEventoDistribuicao('notificacao_gestor', { tipo, dados });
  }

  private dispararEventoDistribuicao(tipo: string, dados: any): void {
    const evento = new CustomEvent('distribuicaoLead', {
      detail: { tipo, dados, timestamp: new Date().toISOString() }
    });
    window.dispatchEvent(evento);
  }

  private salvarDados(): void {
    localStorage.setItem('corretores_distribuicao', JSON.stringify(this.corretores));
    localStorage.setItem('regras_distribuicao', JSON.stringify(this.regras));
    localStorage.setItem('distribuicoes_leads', JSON.stringify(this.distribuicoes));
  }

  // Getters para relatórios
  obterEstatisticas(): any {
    const agora = new Date();
    const hoje = agora.toISOString().split('T')[0];
    
    const distribuicoesHoje = this.distribuicoes.filter(d => 
      d.dataDistribuicao.startsWith(hoje)
    );

    return {
      resumo: {
        totalDistribuicoes: this.distribuicoes.length,
        distribuicoesHoje: distribuicoesHoje.length,
        corretoresOnline: this.corretores.filter(c => c.status === 'online').length,
        taxaAceitacao: this.calcularTaxaAceitacao(),
        tempoRespostaMedia: this.calcularTempoRespostaMedia()
      },
      porCorretor: this.obterEstatisticasPorCorretor(),
      regrasAtivas: this.regras.filter(r => r.ativa).length,
      distribuicoesPendentes: this.distribuicoes.filter(d => d.status === 'enviado').length
    };
  }

  private calcularTaxaAceitacao(): number {
    const distribuicoesFinalizadas = this.distribuicoes.filter(d => 
      ['aceito', 'rejeitado', 'expirado'].includes(d.status)
    );
    
    if (distribuicoesFinalizadas.length === 0) return 0;
    
    const aceitas = distribuicoesFinalizadas.filter(d => d.status === 'aceito').length;
    return (aceitas / distribuicoesFinalizadas.length) * 100;
  }

  private calcularTempoRespostaMedia(): number {
    const comResposta = this.distribuicoes.filter(d => d.tempoResposta !== undefined);
    if (comResposta.length === 0) return 0;
    
    const total = comResposta.reduce((acc, d) => acc + (d.tempoResposta || 0), 0);
    return total / comResposta.length;
  }

  private obterEstatisticasPorCorretor(): any {
    return this.corretores.map(corretor => {
      const distribuicoes = this.distribuicoes.filter(d => d.corretorId === corretor.id);
      const aceitas = distribuicoes.filter(d => d.status === 'aceito');
      
      return {
        id: corretor.id,
        nome: corretor.nome,
        status: corretor.status,
        leadsAtivos: corretor.leadsAtivos,
        distribuicoesRecebidas: distribuicoes.length,
        distribuicoesAceitas: aceitas.length,
        taxaAceitacao: distribuicoes.length > 0 ? (aceitas.length / distribuicoes.length) * 100 : 0,
        tempoRespostaMedia: this.calcularTempoRespostaCorretor(corretor.id)
      };
    });
  }

  private calcularTempoRespostaCorretor(corretorId: string): number {
    const distribuicoes = this.distribuicoes.filter(d => 
      d.corretorId === corretorId && d.tempoResposta !== undefined
    );
    
    if (distribuicoes.length === 0) return 0;
    
    const total = distribuicoes.reduce((acc, d) => acc + (d.tempoResposta || 0), 0);
    return total / distribuicoes.length;
  }

  // Getters públicos
  obterCorretores(): CorretoDisponivel[] {
    return this.corretores;
  }

  obterRegras(): RegraDistribuicao[] {
    return this.regras;
  }

  obterDistribuicoes(): DistribuicaoLead[] {
    return this.distribuicoes;
  }
}

// Instância singleton
export const distribuicaoLeadsService = new DistribuicaoLeadsService();

// Hook para React
export const useDistribuicaoLeads = () => {
  return {
    distribuirLead: distribuicaoLeadsService.distribuirLead.bind(distribuicaoLeadsService),
    aceitarLead: distribuicaoLeadsService.aceitarLead.bind(distribuicaoLeadsService),
    rejeitarLead: distribuicaoLeadsService.rejeitarLead.bind(distribuicaoLeadsService),
    atualizarStatus: distribuicaoLeadsService.atualizarStatusCorretor.bind(distribuicaoLeadsService),
    obterEstatisticas: distribuicaoLeadsService.obterEstatisticas.bind(distribuicaoLeadsService),
    obterCorretores: distribuicaoLeadsService.obterCorretores.bind(distribuicaoLeadsService),
    obterRegras: distribuicaoLeadsService.obterRegras.bind(distribuicaoLeadsService)
  };
};

export default distribuicaoLeadsService;