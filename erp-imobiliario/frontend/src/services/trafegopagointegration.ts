// Integração com Plataformas de Tráfego Pago
// Instagram, Facebook, Google, LinkedIn, YouTube, TikTok

export interface CampanhaTrafegoPago {
  id: string;
  nome: string;
  plataforma: 'facebook' | 'instagram' | 'google' | 'linkedin' | 'youtube' | 'tiktok';
  tipo: 'lead_generation' | 'website_traffic' | 'brand_awareness' | 'video_views';
  status: 'ativa' | 'pausada' | 'finalizada' | 'rascunho';
  orcamento: {
    diario: number;
    total: number;
    gasto: number;
  };
  publico: {
    idade_min: number;
    idade_max: number;
    genero: 'todos' | 'masculino' | 'feminino';
    localizacao: string[];
    interesses: string[];
    comportamentos: string[];
  };
  criativos: {
    titulo: string;
    descricao: string;
    imagens: string[];
    videos: string[];
    call_to_action: string;
  };
  metricas: {
    impressoes: number;
    cliques: number;
    leads: number;
    ctr: number;
    cpc: number;
    cpl: number;
    conversoes: number;
  };
  dataInicio: string;
  dataFim?: string;
  integracao: {
    webhookUrl: string;
    tokenAcesso: string;
    contaId: string;
  };
}

export interface LeadTrafegoPago {
  id: string;
  campanhaId: string;
  plataforma: string;
  nome: string;
  email: string;
  telefone?: string;
  mensagem?: string;
  interesse: string;
  origem: string;
  dadosAdicionais: Record<string, any>;
  timestamp: number;
  processado: boolean;
}

export interface ConfiguracaoIntegracao {
  plataforma: string;
  ativa: boolean;
  credenciais: {
    accessToken: string;
    appId?: string;
    appSecret?: string;
    accountId?: string;
    pixelId?: string;
  };
  webhookConfig: {
    url: string;
    eventos: string[];
    verificacaoToken: string;
  };
  mapeamentoCampos: Record<string, string>;
}

class TrafegopagointegrationService {
  private configuracoes: Map<string, ConfiguracaoIntegracao> = new Map();
  private campanhas: CampanhaTrafegoPago[] = [];
  private leadsImportados: LeadTrafegoPago[] = [];

  // Configurações das plataformas
  async configurarPlataforma(plataforma: string, config: ConfiguracaoIntegracao): Promise<boolean> {
    try {
      // Validar credenciais
      const validacao = await this.validarCredenciais(plataforma, config.credenciais);
      if (!validacao.sucesso) {
        throw new Error(validacao.erro);
      }

      // Configurar webhook
      await this.configurarWebhook(plataforma, config.webhookConfig);

      // Salvar configuração
      this.configuracoes.set(plataforma, config);
      
      // Salvar no localStorage (em produção seria no backend)
      localStorage.setItem(`trafego_config_${plataforma}`, JSON.stringify(config));

      console.log(`✅ Plataforma ${plataforma} configurada com sucesso`);
      return true;
    } catch (error) {
      console.error(`❌ Erro ao configurar ${plataforma}:`, error);
      return false;
    }
  }

  private async validarCredenciais(plataforma: string, credenciais: any): Promise<{sucesso: boolean; erro?: string}> {
    try {
      switch (plataforma) {
        case 'facebook':
        case 'instagram':
          return await this.validarFacebookCredenciais(credenciais);
        case 'google':
          return await this.validarGoogleCredenciais(credenciais);
        case 'linkedin':
          return await this.validarLinkedInCredenciais(credenciais);
        case 'youtube':
          return await this.validarYouTubeCredenciais(credenciais);
        case 'tiktok':
          return await this.validarTikTokCredenciais(credenciais);
        default:
          return { sucesso: false, erro: 'Plataforma não suportada' };
      }
    } catch (error) {
      return { sucesso: false, erro: String(error) };
    }
  }

  private async validarFacebookCredenciais(credenciais: any): Promise<{sucesso: boolean; erro?: string}> {
    // Simulação - em produção fazer chamada real para API do Facebook
    console.log('🔍 Validando credenciais Facebook...');
    
    if (!credenciais.accessToken || !credenciais.appId) {
      return { sucesso: false, erro: 'Access Token e App ID são obrigatórios' };
    }

    // Simular chamada para API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { sucesso: true };
  }

  private async validarGoogleCredenciais(credenciais: any): Promise<{sucesso: boolean; erro?: string}> {
    console.log('🔍 Validando credenciais Google Ads...');
    
    if (!credenciais.accessToken) {
      return { sucesso: false, erro: 'Access Token é obrigatório' };
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    return { sucesso: true };
  }

  private async validarLinkedInCredenciais(credenciais: any): Promise<{sucesso: boolean; erro?: string}> {
    console.log('🔍 Validando credenciais LinkedIn...');
    
    if (!credenciais.accessToken) {
      return { sucesso: false, erro: 'Access Token é obrigatório' };
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    return { sucesso: true };
  }

  private async validarYouTubeCredenciais(credenciais: any): Promise<{sucesso: boolean; erro?: string}> {
    console.log('🔍 Validando credenciais YouTube...');
    
    if (!credenciais.accessToken) {
      return { sucesso: false, erro: 'Access Token é obrigatório' };
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    return { sucesso: true };
  }

  private async validarTikTokCredenciais(credenciais: any): Promise<{sucesso: boolean; erro?: string}> {
    console.log('🔍 Validando credenciais TikTok...');
    
    if (!credenciais.accessToken) {
      return { sucesso: false, erro: 'Access Token é obrigatório' };
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    return { sucesso: true };
  }

  private async configurarWebhook(plataforma: string, webhookConfig: any): Promise<void> {
    console.log(`🔗 Configurando webhook para ${plataforma}:`, webhookConfig);
    
    // Em produção, registrar webhook nas respectivas plataformas
    const webhookUrl = `${window.location.origin}/api/webhook/${plataforma}`;
    console.log(`Webhook URL: ${webhookUrl}`);
  }

  // Importação de campanhas
  async importarCampanhas(plataforma: string): Promise<CampanhaTrafegoPago[]> {
    const config = this.configuracoes.get(plataforma);
    if (!config) {
      throw new Error(`Plataforma ${plataforma} não configurada`);
    }

    try {
      const campanhas = await this.buscarCampanhas(plataforma, config);
      
      // Mesclar com campanhas existentes
      campanhas.forEach(campanha => {
        const index = this.campanhas.findIndex(c => c.id === campanha.id);
        if (index >= 0) {
          this.campanhas[index] = campanha;
        } else {
          this.campanhas.push(campanha);
        }
      });

      return campanhas;
    } catch (error) {
      console.error(`Erro ao importar campanhas de ${plataforma}:`, error);
      throw error;
    }
  }

  private async buscarCampanhas(plataforma: string, config: ConfiguracaoIntegracao): Promise<CampanhaTrafegoPago[]> {
    // Simulação de campanhas - em produção fazer chamadas reais às APIs
    console.log(`📊 Buscando campanhas de ${plataforma}...`);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const campanhasSimuladas: CampanhaTrafegoPago[] = [
      {
        id: `${plataforma}_001`,
        nome: `Campanha Imóveis - ${plataforma}`,
        plataforma: plataforma as any,
        tipo: 'lead_generation',
        status: 'ativa',
        orcamento: {
          diario: 100,
          total: 3000,
          gasto: 1250
        },
        publico: {
          idade_min: 25,
          idade_max: 55,
          genero: 'todos',
          localizacao: ['Florianópolis', 'São José', 'Palhoça'],
          interesses: ['Imóveis', 'Investimento', 'Casa própria'],
          comportamentos: ['Interessados em imóveis']
        },
        criativos: {
          titulo: 'Apartamento dos Sonhos te Espera',
          descricao: 'Encontre o imóvel perfeito com as melhores condições de financiamento',
          imagens: [],
          videos: [],
          call_to_action: 'Saiba Mais'
        },
        metricas: {
          impressoes: 45000,
          cliques: 890,
          leads: 67,
          ctr: 1.98,
          cpc: 1.40,
          cpl: 18.66,
          conversoes: 12
        },
        dataInicio: '2025-01-01',
        dataFim: '2025-01-31',
        integracao: {
          webhookUrl: config.webhookConfig.url,
          tokenAcesso: config.credenciais.accessToken,
          contaId: config.credenciais.accountId || ''
        }
      }
    ];

    return campanhasSimuladas;
  }

  // Processamento de webhooks
  async processarWebhook(plataforma: string, dados: any): Promise<LeadTrafegoPago | null> {
    try {
      const config = this.configuracoes.get(plataforma);
      if (!config) {
        console.warn(`Webhook recebido para plataforma não configurada: ${plataforma}`);
        return null;
      }

      const lead = await this.processarDadosLead(plataforma, dados, config);
      if (lead) {
        this.leadsImportados.push(lead);
        
        // Disparar evento para o sistema CRM
        this.notificarNovoLead(lead);
        
        return lead;
      }

      return null;
    } catch (error) {
      console.error(`Erro ao processar webhook de ${plataforma}:`, error);
      return null;
    }
  }

  private async processarDadosLead(plataforma: string, dados: any, config: ConfiguracaoIntegracao): Promise<LeadTrafegoPago> {
    // Mapear campos baseado na configuração
    const mapeamento = config.mapeamentoCampos;
    
    const lead: LeadTrafegoPago = {
      id: dados[mapeamento.id] || `lead_${Date.now()}`,
      campanhaId: dados[mapeamento.campanhaId] || '',
      plataforma,
      nome: dados[mapeamento.nome] || '',
      email: dados[mapeamento.email] || '',
      telefone: dados[mapeamento.telefone],
      mensagem: dados[mapeamento.mensagem],
      interesse: dados[mapeamento.interesse] || 'Imóveis',
      origem: `trafego_pago_${plataforma}`,
      dadosAdicionais: dados,
      timestamp: Date.now(),
      processado: false
    };

    console.log(`📨 Novo lead processado de ${plataforma}:`, lead);
    return lead;
  }

  private notificarNovoLead(lead: LeadTrafegoPago): void {
    // Disparar evento customizado para o sistema
    const evento = new CustomEvent('novoLeadTrafegoPago', {
      detail: lead
    });
    window.dispatchEvent(evento);

    // Também salvar no localStorage para recuperar depois
    const leadsExistentes = JSON.parse(localStorage.getItem('leads_trafego_pago') || '[]');
    leadsExistentes.unshift(lead);
    localStorage.setItem('leads_trafego_pago', JSON.stringify(leadsExistentes.slice(0, 100)));
  }

  // Criação de campanhas
  async criarCampanha(campanha: Omit<CampanhaTrafegoPago, 'id' | 'metricas'>): Promise<CampanhaTrafegoPago> {
    try {
      const config = this.configuracoes.get(campanha.plataforma);
      if (!config) {
        throw new Error(`Plataforma ${campanha.plataforma} não configurada`);
      }

      const novaCampanha = await this.enviarCampanhaParaPlataforma(campanha, config);
      this.campanhas.push(novaCampanha);
      
      return novaCampanha;
    } catch (error) {
      console.error('Erro ao criar campanha:', error);
      throw error;
    }
  }

  private async enviarCampanhaParaPlataforma(campanha: any, config: ConfiguracaoIntegracao): Promise<CampanhaTrafegoPago> {
    console.log(`🚀 Criando campanha na ${campanha.plataforma}...`);
    
    // Simulação - em produção fazer chamada real à API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const novaCampanha: CampanhaTrafegoPago = {
      ...campanha,
      id: `${campanha.plataforma}_${Date.now()}`,
      status: 'rascunho' as const,
      metricas: {
        impressoes: 0,
        cliques: 0,
        leads: 0,
        ctr: 0,
        cpc: 0,
        cpl: 0,
        conversoes: 0
      }
    };

    console.log(`✅ Campanha criada com ID: ${novaCampanha.id}`);
    return novaCampanha;
  }

  // Relatórios e análises
  obterRelatorioGeral(): any {
    const totalCampanhas = this.campanhas.length;
    const campanhasAtivas = this.campanhas.filter(c => c.status === 'ativa').length;
    const totalGasto = this.campanhas.reduce((acc, c) => acc + c.orcamento.gasto, 0);
    const totalLeads = this.campanhas.reduce((acc, c) => acc + c.metricas.leads, 0);
    const totalCliques = this.campanhas.reduce((acc, c) => acc + c.metricas.cliques, 0);
    const totalImpressoes = this.campanhas.reduce((acc, c) => acc + c.metricas.impressoes, 0);

    return {
      resumo: {
        totalCampanhas,
        campanhasAtivas,
        totalGasto,
        totalLeads,
        totalCliques,
        totalImpressoes,
        ctrMedio: totalImpressoes > 0 ? (totalCliques / totalImpressoes) * 100 : 0,
        cplMedio: totalLeads > 0 ? totalGasto / totalLeads : 0
      },
      porPlataforma: this.obterMetricasPorPlataforma(),
      campanhasMelhorPerformance: this.obterMelhoresCampanhas(),
      leadsRecentes: this.leadsImportados.slice(0, 10)
    };
  }

  private obterMetricasPorPlataforma(): Record<string, any> {
    const metricas: Record<string, any> = {};
    
    this.campanhas.forEach(campanha => {
      if (!metricas[campanha.plataforma]) {
        metricas[campanha.plataforma] = {
          campanhas: 0,
          gasto: 0,
          leads: 0,
          impressoes: 0,
          cliques: 0
        };
      }
      
      metricas[campanha.plataforma].campanhas++;
      metricas[campanha.plataforma].gasto += campanha.orcamento.gasto;
      metricas[campanha.plataforma].leads += campanha.metricas.leads;
      metricas[campanha.plataforma].impressoes += campanha.metricas.impressoes;
      metricas[campanha.plataforma].cliques += campanha.metricas.cliques;
    });

    return metricas;
  }

  private obterMelhoresCampanhas(): CampanhaTrafegoPago[] {
    return this.campanhas
      .filter(c => c.metricas.leads > 0)
      .sort((a, b) => {
        const roiA = a.metricas.conversoes / (a.orcamento.gasto || 1);
        const roiB = b.metricas.conversoes / (b.orcamento.gasto || 1);
        return roiB - roiA;
      })
      .slice(0, 5);
  }

  // Getters
  obterCampanhas(): CampanhaTrafegoPago[] {
    return this.campanhas;
  }

  obterLeadsImportados(): LeadTrafegoPago[] {
    return this.leadsImportados;
  }

  obterConfiguracoes(): Map<string, ConfiguracaoIntegracao> {
    return this.configuracoes;
  }

  // Inicializar com dados salvos
  async inicializar(): Promise<void> {
    try {
      // Carregar configurações salvas
      const plataformas = ['facebook', 'instagram', 'google', 'linkedin', 'youtube', 'tiktok'];
      
      for (const plataforma of plataformas) {
        const configSalva = localStorage.getItem(`trafego_config_${plataforma}`);
        if (configSalva) {
          const config = JSON.parse(configSalva);
          this.configuracoes.set(plataforma, config);
        }
      }

      // Carregar leads salvos
      const leadsSalvos = localStorage.getItem('leads_trafego_pago');
      if (leadsSalvos) {
        this.leadsImportados = JSON.parse(leadsSalvos);
      }

      console.log('🎯 Serviço de tráfego pago inicializado');
    } catch (error) {
      console.error('Erro ao inicializar serviço de tráfego pago:', error);
    }
  }
}

// Instância singleton
export const trafegopagointegrationService = new TrafegopagointegrationService();

// Hook para React
export const useTrafegopagointegration = () => {
  return {
    configurarPlataforma: trafegopagointegrationService.configurarPlataforma.bind(trafegopagointegrationService),
    importarCampanhas: trafegopagointegrationService.importarCampanhas.bind(trafegopagointegrationService),
    criarCampanha: trafegopagointegrationService.criarCampanha.bind(trafegopagointegrationService),
    processarWebhook: trafegopagointegrationService.processarWebhook.bind(trafegopagointegrationService),
    obterRelatorio: trafegopagointegrationService.obterRelatorioGeral.bind(trafegopagointegrationService),
    obterCampanhas: trafegopagointegrationService.obterCampanhas.bind(trafegopagointegrationService),
    obterLeads: trafegopagointegrationService.obterLeadsImportados.bind(trafegopagointegrationService)
  };
};

// Inicializar automaticamente
trafegopagointegrationService.inicializar();

export default trafegopagointegrationService;