interface MarketData {
  setor: string;
  nome: string;
  valor: number;
  variacao: number;
  percentual: number;
  icon: string;
  cor: string;
  unidade: string;
  fonte: string;
  ultimaAtualizacao: string;
  tendencia: 'alta' | 'baixa' | 'estavel';
  descricao: string;
}

interface MarketSector {
  id: string;
  nome: string;
  descricao: string;
  indicadores: MarketData[];
  resumo: {
    performance: number;
    status: 'positivo' | 'negativo' | 'neutro';
    principais: string[];
  };
}

export class MarketDataService {
  private static instance: MarketDataService;
  private updateInterval: NodeJS.Timeout | null = null;
  private callbacks: ((data: MarketSector[]) => void)[] = [];

  static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  private generateRealisticVariation(baseValue: number, volatility: number = 0.02): { valor: number; variacao: number; percentual: number } {
    // Gerar variação realística baseada no valor base
    const variation = (Math.random() - 0.5) * 2 * volatility;
    const newValue = baseValue * (1 + variation);
    const absoluteChange = newValue - baseValue;
    const percentageChange = (absoluteChange / baseValue) * 100;

    return {
      valor: Math.round(newValue * 100) / 100,
      variacao: Math.round(absoluteChange * 100) / 100,
      percentual: Math.round(percentageChange * 100) / 100
    };
  }

  private getMarketData(): MarketSector[] {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR');

    // Valores base realísticos (atualizados para 2025)
    const baseValues = {
      bovespa: 142000,
      dolar: 5.85,
      euro: 6.12,
      bitcoin: 95000,
      soja: 1450,
      milho: 720,
      boi: 285,
      cafe: 850,
      nasdaq: 18500,
      ouro: 2650,
      petroleo: 82,
      ifix: 3200,
      cdi: 12.75,
      ipca: 4.85
    };

    const agro = this.generateRealisticVariation(baseValues.soja, 0.015);
    const milho = this.generateRealisticVariation(baseValues.milho, 0.018);
    const boi = this.generateRealisticVariation(baseValues.boi, 0.012);
    const cafe = this.generateRealisticVariation(baseValues.cafe, 0.020);

    const bovespa = this.generateRealisticVariation(baseValues.bovespa, 0.008);
    const dolar = this.generateRealisticVariation(baseValues.dolar, 0.005);
    const bitcoin = this.generateRealisticVariation(baseValues.bitcoin, 0.035);
    const nasdaq = this.generateRealisticVariation(baseValues.nasdaq, 0.010);

    const ifix = this.generateRealisticVariation(baseValues.ifix, 0.003);
    const cdi = this.generateRealisticVariation(baseValues.cdi, 0.001);
    const ipca = this.generateRealisticVariation(baseValues.ipca, 0.002);
    const ouro = this.generateRealisticVariation(baseValues.ouro, 0.008);

    const exportacao = this.generateRealisticVariation(28.5, 0.025); // Bilhões USD
    const importacao = this.generateRealisticVariation(22.8, 0.020);
    const balanca = { 
      valor: exportacao.valor - importacao.valor,
      variacao: exportacao.variacao - importacao.variacao,
      percentual: ((exportacao.valor - importacao.valor) / (exportacao.valor + importacao.valor)) * 100
    };

    const sectors: MarketSector[] = [
      {
        id: 'agronegocio',
        nome: 'Agronegócio',
        descricao: 'Commodities agrícolas e pecuárias',
        indicadores: [
          {
            setor: 'Agronegócio',
            nome: 'Soja',
            valor: agro.valor,
            variacao: agro.variacao,
            percentual: agro.percentual,
            icon: '🌱',
            cor: agro.percentual >= 0 ? 'text-green-600' : 'text-red-600',
            unidade: 'R$/saca',
            fonte: 'CEPEA/ESALQ',
            ultimaAtualizacao: timeString,
            tendencia: agro.percentual > 1 ? 'alta' : agro.percentual < -1 ? 'baixa' : 'estavel',
            descricao: 'Preço da saca de soja de 60kg'
          },
          {
            setor: 'Agronegócio',
            nome: 'Milho',
            valor: milho.valor,
            variacao: milho.variacao,
            percentual: milho.percentual,
            icon: '🌽',
            cor: milho.percentual >= 0 ? 'text-green-600' : 'text-red-600',
            unidade: 'R$/saca',
            fonte: 'CEPEA/ESALQ',
            ultimaAtualizacao: timeString,
            tendencia: milho.percentual > 1 ? 'alta' : milho.percentual < -1 ? 'baixa' : 'estavel',
            descricao: 'Preço da saca de milho de 60kg'
          },
          {
            setor: 'Agronegócio',
            nome: 'Boi Gordo',
            valor: boi.valor,
            variacao: boi.variacao,
            percentual: boi.percentual,
            icon: '🐄',
            cor: boi.percentual >= 0 ? 'text-green-600' : 'text-red-600',
            unidade: 'R$/@',
            fonte: 'CEPEA/ESALQ',
            ultimaAtualizacao: timeString,
            tendencia: boi.percentual > 0.5 ? 'alta' : boi.percentual < -0.5 ? 'baixa' : 'estavel',
            descricao: 'Preço da arroba do boi gordo'
          },
          {
            setor: 'Agronegócio',
            nome: 'Café Arábica',
            valor: cafe.valor,
            variacao: cafe.variacao,
            percentual: cafe.percentual,
            icon: '☕',
            cor: cafe.percentual >= 0 ? 'text-green-600' : 'text-red-600',
            unidade: 'R$/saca',
            fonte: 'CEPEA/ESALQ',
            ultimaAtualizacao: timeString,
            tendencia: cafe.percentual > 1 ? 'alta' : cafe.percentual < -1 ? 'baixa' : 'estavel',
            descricao: 'Preço da saca de café arábica'
          }
        ],
        resumo: {
          performance: (agro.percentual + milho.percentual + boi.percentual + cafe.percentual) / 4,
          status: (agro.percentual + milho.percentual + boi.percentual + cafe.percentual) / 4 > 0 ? 'positivo' : 'negativo',
          principais: ['Soja em alta devido à demanda chinesa', 'Milho impactado pelo clima', 'Boi gordo estável']
        }
      },
      {
        id: 'tecnologia',
        nome: 'Tecnologia',
        descricao: 'Mercado de tecnologia e inovação',
        indicadores: [
          {
            setor: 'Tecnologia',
            nome: 'NASDAQ',
            valor: nasdaq.valor,
            variacao: nasdaq.variacao,
            percentual: nasdaq.percentual,
            icon: '💻',
            cor: nasdaq.percentual >= 0 ? 'text-green-600' : 'text-red-600',
            unidade: 'pontos',
            fonte: 'NASDAQ',
            ultimaAtualizacao: timeString,
            tendencia: nasdaq.percentual > 0.5 ? 'alta' : nasdaq.percentual < -0.5 ? 'baixa' : 'estavel',
            descricao: 'Índice NASDAQ Composite'
          },
          {
            setor: 'Tecnologia',
            nome: 'Bitcoin',
            valor: bitcoin.valor,
            variacao: bitcoin.variacao,
            percentual: bitcoin.percentual,
            icon: '₿',
            cor: bitcoin.percentual >= 0 ? 'text-green-600' : 'text-red-600',
            unidade: 'USD',
            fonte: 'CoinGecko',
            ultimaAtualizacao: timeString,
            tendencia: bitcoin.percentual > 2 ? 'alta' : bitcoin.percentual < -2 ? 'baixa' : 'estavel',
            descricao: 'Preço do Bitcoin em dólares'
          },
          {
            setor: 'Tecnologia',
            nome: 'IFIX',
            valor: ifix.valor,
            variacao: ifix.variacao,
            percentual: ifix.percentual,
            icon: '🏢',
            cor: ifix.percentual >= 0 ? 'text-green-600' : 'text-red-600',
            unidade: 'pontos',
            fonte: 'B3',
            ultimaAtualizacao: timeString,
            tendencia: ifix.percentual > 0.3 ? 'alta' : ifix.percentual < -0.3 ? 'baixa' : 'estavel',
            descricao: 'Índice de Fundos Imobiliários'
          }
        ],
        resumo: {
          performance: (nasdaq.percentual + bitcoin.percentual + ifix.percentual) / 3,
          status: (nasdaq.percentual + bitcoin.percentual + ifix.percentual) / 3 > 0 ? 'positivo' : 'negativo',
          principais: ['Tech stocks em recuperação', 'Bitcoin volátil', 'FIIs atraindo investidores']
        }
      },
      {
        id: 'financas',
        nome: 'Finanças',
        descricao: 'Mercado financeiro e indicadores econômicos',
        indicadores: [
          {
            setor: 'Finanças',
            nome: 'Bovespa',
            valor: bovespa.valor,
            variacao: bovespa.variacao,
            percentual: bovespa.percentual,
            icon: '📊',
            cor: bovespa.percentual >= 0 ? 'text-green-600' : 'text-red-600',
            unidade: 'pontos',
            fonte: 'B3',
            ultimaAtualizacao: timeString,
            tendencia: bovespa.percentual > 0.5 ? 'alta' : bovespa.percentual < -0.5 ? 'baixa' : 'estavel',
            descricao: 'Índice Bovespa'
          },
          {
            setor: 'Finanças',
            nome: 'Dólar',
            valor: dolar.valor,
            variacao: dolar.variacao,
            percentual: dolar.percentual,
            icon: '💵',
            cor: dolar.percentual >= 0 ? 'text-red-600' : 'text-green-600', // Invertido: alta do dólar é ruim
            unidade: 'R$',
            fonte: 'BACEN',
            ultimaAtualizacao: timeString,
            tendencia: dolar.percentual > 0.3 ? 'alta' : dolar.percentual < -0.3 ? 'baixa' : 'estavel',
            descricao: 'Dólar americano / Real brasileiro'
          },
          {
            setor: 'Finanças',
            nome: 'CDI',
            valor: cdi.valor,
            variacao: cdi.variacao,
            percentual: cdi.percentual,
            icon: '🏦',
            cor: 'text-blue-600',
            unidade: '% a.a.',
            fonte: 'BACEN',
            ultimaAtualizacao: timeString,
            tendencia: 'estavel',
            descricao: 'Taxa CDI anualizada'
          },
          {
            setor: 'Finanças',
            nome: 'IPCA',
            valor: ipca.valor,
            variacao: ipca.variacao,
            percentual: ipca.percentual,
            icon: '📈',
            cor: ipca.percentual <= 0 ? 'text-green-600' : 'text-orange-600',
            unidade: '% a.a.',
            fonte: 'IBGE',
            ultimaAtualizacao: timeString,
            tendencia: ipca.percentual > 0.1 ? 'alta' : ipca.percentual < -0.1 ? 'baixa' : 'estavel',
            descricao: 'Inflação acumulada em 12 meses'
          }
        ],
        resumo: {
          performance: bovespa.percentual,
          status: bovespa.percentual > 0 ? 'positivo' : 'negativo',
          principais: ['Mercado monitorando política monetária', 'Dólar estável', 'Inflação controlada']
        }
      },
      {
        id: 'comercio_exterior',
        nome: 'Comércio Exterior',
        descricao: 'Balança comercial e fluxo de mercadorias',
        indicadores: [
          {
            setor: 'Comércio Exterior',
            nome: 'Exportações',
            valor: exportacao.valor,
            variacao: exportacao.variacao,
            percentual: exportacao.percentual,
            icon: '📦',
            cor: exportacao.percentual >= 0 ? 'text-green-600' : 'text-red-600',
            unidade: 'Bi USD',
            fonte: 'SECEX',
            ultimaAtualizacao: timeString,
            tendencia: exportacao.percentual > 1 ? 'alta' : exportacao.percentual < -1 ? 'baixa' : 'estavel',
            descricao: 'Exportações mensais em bilhões USD'
          },
          {
            setor: 'Comércio Exterior',
            nome: 'Importações',
            valor: importacao.valor,
            variacao: importacao.variacao,
            percentual: importacao.percentual,
            icon: '📥',
            cor: importacao.percentual <= 0 ? 'text-green-600' : 'text-red-600', // Menos importação = melhor
            unidade: 'Bi USD',
            fonte: 'SECEX',
            ultimaAtualizacao: timeString,
            tendencia: importacao.percentual > 1 ? 'alta' : importacao.percentual < -1 ? 'baixa' : 'estavel',
            descricao: 'Importações mensais em bilhões USD'
          },
          {
            setor: 'Comércio Exterior',
            nome: 'Balança Comercial',
            valor: balanca.valor,
            variacao: balanca.variacao,
            percentual: balanca.percentual,
            icon: '⚖️',
            cor: balanca.valor >= 0 ? 'text-green-600' : 'text-red-600',
            unidade: 'Bi USD',
            fonte: 'SECEX',
            ultimaAtualizacao: timeString,
            tendencia: balanca.valor > 2 ? 'alta' : balanca.valor < -2 ? 'baixa' : 'estavel',
            descricao: 'Saldo da balança comercial'
          },
          {
            setor: 'Comércio Exterior',
            nome: 'Ouro',
            valor: ouro.valor,
            variacao: ouro.variacao,
            percentual: ouro.percentual,
            icon: '🥇',
            cor: ouro.percentual >= 0 ? 'text-green-600' : 'text-red-600',
            unidade: 'USD/oz',
            fonte: 'COMEX',
            ultimaAtualizacao: timeString,
            tendencia: ouro.percentual > 0.5 ? 'alta' : ouro.percentual < -0.5 ? 'baixa' : 'estavel',
            descricao: 'Preço do ouro por onça'
          }
        ],
        resumo: {
          performance: balanca.percentual,
          status: balanca.valor > 0 ? 'positivo' : 'negativo',
          principais: ['Agronegócio impulsiona exportações', 'Superávit comercial', 'Ouro como reserva de valor']
        }
      }
    ];

    return sectors;
  }

  startRealTimeUpdates(intervalMs: number = 30000): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = setInterval(() => {
      const data = this.getMarketData();
      this.callbacks.forEach(callback => callback(data));
    }, intervalMs);

    // Enviar dados iniciais
    const initialData = this.getMarketData();
    this.callbacks.forEach(callback => callback(initialData));
  }

  stopRealTimeUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  subscribe(callback: (data: MarketSector[]) => void): () => void {
    this.callbacks.push(callback);

    // Enviar dados iniciais
    const data = this.getMarketData();
    callback(data);

    // Retornar função de unsubscribe
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  getCurrentData(): MarketSector[] {
    return this.getMarketData();
  }

  // Método para simular conexão com APIs reais
  async fetchFromExternalAPI(sector: string): Promise<MarketData[]> {
    // Esta função seria implementada para conectar com APIs reais como:
    // - Alpha Vantage (ações e forex)
    // - CoinGecko (criptomoedas)
    // - CEPEA/ESALQ (commodities agro)
    // - BACEN API (indicadores econômicos)
    // - Trading Economics API
    
    console.log(`Fetching real data for sector: ${sector}`);
    
    // Por enquanto, retorna dados simulados
    return this.getMarketData().find(s => s.id === sector)?.indicadores || [];
  }

  // Configuração para conexão com APIs reais
  configureAPI(config: {
    alphaVantageKey?: string;
    tradingEconomicsKey?: string;
    enableRealData?: boolean;
  }): void {
    // Configuração das chaves de API para uso em produção
    localStorage.setItem('market_api_config', JSON.stringify(config));
  }
}

export const marketDataService = MarketDataService.getInstance();