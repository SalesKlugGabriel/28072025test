// Serviço de Tracking de Navegação entre Empreendimentos

interface VisitaEmpreendimento {
  empreendimentoId: string;
  nomeEmpreendimento: string;
  clienteInfo?: {
    ip: string;
    userAgent: string;
    origem?: string; // 'comparacao' | 'landing' | 'busca' | 'recomendacao'
  };
  timestamp: number;
  tempoInicioVisita: number;
  tempoFimVisita?: number;
  duracaoSegundos?: number;
  acoes: Array<{
    tipo: 'view' | 'click_planta' | 'click_galeria' | 'click_contato' | 'download_material' | 'interesse' | 'navegacao_relacionado';
    timestamp: number;
    detalhes?: any;
  }>;
  origemVisita?: {
    empreendimentoAnterior?: string;
    tipoNavegacao?: 'relacionado' | 'comparacao' | 'busca';
  };
}

interface DadosCorretor {
  corretorId: string;
  clienteId?: string;
  sessionId: string;
}

class TrackingService {
  private visitaAtual: VisitaEmpreendimento | null = null;
  private sessionId: string;
  private dadosCorretor: DadosCorretor | null = null;

  constructor() {
    this.sessionId = this.gerarSessionId();
    this.inicializarTracking();
  }

  private gerarSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async obterInfoCliente() {
    try {
      // Simulação - em produção usar API real para IP
      const userAgent = navigator.userAgent;
      const ip = await this.obterIP();
      
      return {
        ip,
        userAgent
      };
    } catch (error) {
      console.warn('Erro ao obter informações do cliente:', error);
      return {
        ip: 'unknown',
        userAgent: navigator.userAgent
      };
    }
  }

  private async obterIP(): Promise<string> {
    try {
      // Em produção, usar serviço real de IP
      return 'demo_ip_' + Math.random().toString(36).substr(2, 8);
    } catch {
      return 'unknown';
    }
  }

  private inicializarTracking() {
    // Escutar eventos de saída da página
    window.addEventListener('beforeunload', () => {
      this.finalizarVisitaAtual();
    });

    // Escutar mudanças de visibilidade (quando usuário troca de aba)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.registrarAcao('pause', { motivo: 'tab_hidden' });
      } else {
        this.registrarAcao('resume', { motivo: 'tab_visible' });
      }
    });
  }

  async iniciarVisita(
    empreendimentoId: string, 
    nomeEmpreendimento: string, 
    origem?: string,
    empreendimentoAnterior?: string
  ) {
    // Finalizar visita anterior se existir
    this.finalizarVisitaAtual();

    const clienteInfo = await this.obterInfoCliente();
    const agora = Date.now();

    this.visitaAtual = {
      empreendimentoId,
      nomeEmpreendimento,
      clienteInfo: {
        ...clienteInfo,
        origem
      },
      timestamp: agora,
      tempoInicioVisita: agora,
      acoes: [],
      origemVisita: empreendimentoAnterior ? {
        empreendimentoAnterior,
        tipoNavegacao: origem as any
      } : undefined
    };

    // Registrar evento de início
    this.registrarAcao('view', { 
      origem,
      empreendimentoAnterior 
    });

    // Notificar corretor se configurado
    this.notificarCorretor('inicio_visita', {
      empreendimento: nomeEmpreendimento,
      origem,
      timestamp: new Date().toLocaleString('pt-BR')
    });

    console.log('📊 Tracking iniciado:', {
      empreendimento: nomeEmpreendimento,
      origem,
      sessionId: this.sessionId
    });
  }

  registrarAcao(tipo: string, detalhes?: any) {
    if (!this.visitaAtual) return;

    const acao = {
      tipo: tipo as any,
      timestamp: Date.now(),
      detalhes
    };

    this.visitaAtual.acoes.push(acao);

    // Log para desenvolvimento
    console.log('📈 Ação registrada:', tipo, detalhes);

    // Notificações especiais para corretor
    if (['click_contato', 'download_material', 'interesse'].includes(tipo)) {
      this.notificarCorretor('acao_interesse', {
        acao: tipo,
        empreendimento: this.visitaAtual.nomeEmpreendimento,
        detalhes,
        timestamp: new Date().toLocaleString('pt-BR')
      });
    }
  }

  finalizarVisitaAtual() {
    if (!this.visitaAtual) return;

    const agora = Date.now();
    this.visitaAtual.tempoFimVisita = agora;
    this.visitaAtual.duracaoSegundos = Math.round((agora - this.visitaAtual.tempoInicioVisita) / 1000);

    // Salvar dados da visita
    this.salvarVisita(this.visitaAtual);

    // Notificar corretor sobre duração se significativa (mais de 30 segundos)
    if (this.visitaAtual.duracaoSegundos > 30) {
      this.notificarCorretor('fim_visita', {
        empreendimento: this.visitaAtual.nomeEmpreendimento,
        duracao: this.formatarDuracao(this.visitaAtual.duracaoSegundos),
        acoes: this.visitaAtual.acoes.length,
        timestamp: new Date().toLocaleString('pt-BR')
      });
    }

    console.log('📊 Visita finalizada:', {
      empreendimento: this.visitaAtual.nomeEmpreendimento,
      duracao: this.visitaAtual.duracaoSegundos + 's',
      acoes: this.visitaAtual.acoes.length
    });

    this.visitaAtual = null;
  }

  private formatarDuracao(segundos: number): string {
    if (segundos < 60) return `${segundos}s`;
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos}m ${segundosRestantes}s`;
  }

  private salvarVisita(visita: VisitaEmpreendimento) {
    try {
      // Em produção, enviar para API
      const visitas = this.obterVisitasLocalStorage();
      visitas.push(visita);
      
      // Manter apenas últimas 100 visitas no localStorage
      if (visitas.length > 100) {
        visitas.splice(0, visitas.length - 100);
      }
      
      localStorage.setItem('tracking_visitas', JSON.stringify(visitas));
      
      // Também enviar para API em produção
      this.enviarParaAPI(visita);
    } catch (error) {
      console.error('Erro ao salvar visita:', error);
    }
  }

  private obterVisitasLocalStorage(): VisitaEmpreendimento[] {
    try {
      const visitasStr = localStorage.getItem('tracking_visitas');
      return visitasStr ? JSON.parse(visitasStr) : [];
    } catch {
      return [];
    }
  }

  private async enviarParaAPI(visita: VisitaEmpreendimento) {
    try {
      // Em produção, fazer POST para API
      console.log('📡 Enviaria para API:', visita);
      
      // Simulação de envio
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Erro ao enviar tracking para API:', error);
    }
  }

  configurarCorretor(corretorId: string, clienteId?: string) {
    this.dadosCorretor = {
      corretorId,
      clienteId,
      sessionId: this.sessionId
    };
  }

  private notificarCorretor(tipo: string, dados: any) {
    if (!this.dadosCorretor) return;

    // Em produção, enviar notificação via WebSocket ou API
    console.log('🔔 Notificação para corretor:', {
      corretor: this.dadosCorretor.corretorId,
      tipo,
      dados,
      sessionId: this.sessionId
    });

    // Simular notificação visual (em produção seria WebSocket)
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'tracking_notification',
        data: { tipo, dados, corretorId: this.dadosCorretor.corretorId }
      }, '*');
    }
  }

  // Métodos para análise de dados
  obterEstatisticasVisita(): any {
    if (!this.visitaAtual) return null;

    const agora = Date.now();
    const duracaoAtual = Math.round((agora - this.visitaAtual.tempoInicioVisita) / 1000);

    return {
      empreendimento: this.visitaAtual.nomeEmpreendimento,
      duracaoAtual: this.formatarDuracao(duracaoAtual),
      totalAcoes: this.visitaAtual.acoes.length,
      acoesRealizadas: this.visitaAtual.acoes.map(a => a.tipo),
      origemVisita: this.visitaAtual.origemVisita
    };
  }

  obterHistoricoVisitas(limite = 10): VisitaEmpreendimento[] {
    const visitas = this.obterVisitasLocalStorage();
    return visitas.slice(-limite).reverse();
  }

  obterRelatorioNavegacao(): any {
    const visitas = this.obterVisitasLocalStorage();
    
    if (visitas.length === 0) return null;

    const empreendimentosMaisVisitados = this.contarFrequencia(
      visitas.map(v => v.nomeEmpreendimento)
    );

    const duracaoMedia = visitas.reduce((acc, v) => acc + (v.duracaoSegundos || 0), 0) / visitas.length;

    const origemMaisComum = this.contarFrequencia(
      visitas.map(v => v.clienteInfo?.origem).filter(Boolean)
    );

    return {
      totalVisitas: visitas.length,
      empreendimentosMaisVisitados,
      duracaoMediaSegundos: Math.round(duracaoMedia),
      duracaoMediaFormatada: this.formatarDuracao(Math.round(duracaoMedia)),
      origemMaisComum,
      ultimaVisita: visitas[visitas.length - 1]?.timestamp
    };
  }

  private contarFrequencia(array: string[]): Record<string, number> {
    return array.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}

// Instância singleton
export const trackingService = new TrackingService();

// Hooks para React
export const useTracking = () => {
  return {
    iniciarVisita: trackingService.iniciarVisita.bind(trackingService),
    registrarAcao: trackingService.registrarAcao.bind(trackingService),
    configurarCorretor: trackingService.configurarCorretor.bind(trackingService),
    obterEstatisticas: trackingService.obterEstatisticasVisita.bind(trackingService),
    obterHistorico: trackingService.obterHistoricoVisitas.bind(trackingService),
    obterRelatorio: trackingService.obterRelatorioNavegacao.bind(trackingService)
  };
};

export default trackingService;