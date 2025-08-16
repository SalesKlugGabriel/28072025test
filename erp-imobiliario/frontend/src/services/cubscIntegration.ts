// CUBSC Integration Service
// Serviço para integração com CUBSC (Custo Unitário Básico de Santa Catarina)
// para correção de valores mensais

export interface CUBSCData {
  mes: string;
  ano: number;
  valor: number;
  percentualVariacao: number;
  dataPublicacao: string;
}

export interface ValorCorrigido {
  valorOriginal: number;
  valorCorrigido: number;
  fatorCorrecao: number;
  periodoInicial: string;
  periodoFinal: string;
  detalhes: {
    cubscInicial: number;
    cubscFinal: number;
    variacao: number;
  };
}

class CUBSCIntegrationService {
  private readonly baseUrl = 'https://api.cubsc.sc.gov.br'; // URL fictícia para demonstração
  private cache: Map<string, CUBSCData> = new Map();
  private readonly cacheDuration = 24 * 60 * 60 * 1000; // 24 horas

  /**
   * Busca dados do CUBSC para um período específico
   */
  async obterCUBSC(mes: number, ano: number): Promise<CUBSCData> {
    const chaveCache = `${ano}-${mes.toString().padStart(2, '0')}`;
    
    // Verifica cache primeiro
    if (this.cache.has(chaveCache)) {
      const dadosCache = this.cache.get(chaveCache)!;
      // Se os dados não são muito antigos, retorna do cache
      const agora = new Date().getTime();
      const dataPublicacao = new Date(dadosCache.dataPublicacao).getTime();
      if (agora - dataPublicacao < this.cacheDuration) {
        return dadosCache;
      }
    }

    try {
      // Simulação de chamada API real
      // Em produção, seria uma chamada HTTP real para a API do CUBSC
      const dadosCUBSC = await this.simularChamadaAPI(mes, ano);
      
      // Cache os dados
      this.cache.set(chaveCache, dadosCUBSC);
      
      return dadosCUBSC;
    } catch (error) {
      console.error('Erro ao obter dados do CUBSC:', error);
      throw new Error('Falha ao obter dados do CUBSC. Tente novamente mais tarde.');
    }
  }

  /**
   * Calcula correção de valor usando CUBSC
   */
  async calcularCorrecao(
    valorOriginal: number,
    mesInicial: number,
    anoInicial: number,
    mesFinal: number,
    anoFinal: number
  ): Promise<ValorCorrigido> {
    try {
      const cubscInicial = await this.obterCUBSC(mesInicial, anoInicial);
      const cubscFinal = await this.obterCUBSC(mesFinal, anoFinal);

      const fatorCorrecao = cubscFinal.valor / cubscInicial.valor;
      const valorCorrigido = valorOriginal * fatorCorrecao;
      const variacao = ((fatorCorrecao - 1) * 100);

      return {
        valorOriginal,
        valorCorrigido,
        fatorCorrecao,
        periodoInicial: `${mesInicial.toString().padStart(2, '0')}/${anoInicial}`,
        periodoFinal: `${mesFinal.toString().padStart(2, '0')}/${anoFinal}`,
        detalhes: {
          cubscInicial: cubscInicial.valor,
          cubscFinal: cubscFinal.valor,
          variacao
        }
      };
    } catch (error) {
      console.error('Erro ao calcular correção CUBSC:', error);
      throw new Error('Falha ao calcular correção. Verifique os dados informados.');
    }
  }

  /**
   * Obtém histórico de variações do CUBSC
   */
  async obterHistorico(anoInicial: number, anoFinal?: number): Promise<CUBSCData[]> {
    const anoFim = anoFinal || new Date().getFullYear();
    const historico: CUBSCData[] = [];

    for (let ano = anoInicial; ano <= anoFim; ano++) {
      const mesesParaBuscar = ano === anoFim ? new Date().getMonth() + 1 : 12;
      
      for (let mes = 1; mes <= mesesParaBuscar; mes++) {
        try {
          const dados = await this.obterCUBSC(mes, ano);
          historico.push(dados);
        } catch (error) {
          console.warn(`Erro ao obter CUBSC para ${mes}/${ano}:`, error);
        }
      }
    }

    return historico.sort((a, b) => {
      const dataA = new Date(a.ano, parseInt(a.mes.split('/')[0]) - 1);
      const dataB = new Date(b.ano, parseInt(b.mes.split('/')[0]) - 1);
      return dataB.getTime() - dataA.getTime();
    });
  }

  /**
   * Simulação de chamada para API do CUBSC
   * Em produção, seria substituída por uma chamada HTTP real
   */
  private async simularChamadaAPI(mes: number, ano: number): Promise<CUBSCData> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));

    // Dados simulados baseados em valores realísticos
    const valorBase = 1856.23; // Valor base fictício
    const variacao = (Math.random() - 0.5) * 0.1; // Variação entre -5% e +5%
    const fatorTempo = (ano - 2020) * 0.05 + (mes - 1) * 0.003; // Crescimento simulado ao longo do tempo
    
    const valor = valorBase * (1 + fatorTempo + variacao);
    const percentualVariacao = variacao * 100;

    return {
      mes: `${mes.toString().padStart(2, '0')}/${ano}`,
      ano,
      valor: Math.round(valor * 100) / 100,
      percentualVariacao: Math.round(percentualVariacao * 100) / 100,
      dataPublicacao: new Date(ano, mes - 1, 15).toISOString()
    };
  }

  /**
   * Limpa cache de dados
   */
  limparCache(): void {
    this.cache.clear();
  }

  /**
   * Valida se um período é válido para consulta
   */
  validarPeriodo(mes: number, ano: number): boolean {
    const agora = new Date();
    const anoAtual = agora.getFullYear();
    const mesAtual = agora.getMonth() + 1;

    // Não pode ser no futuro
    if (ano > anoAtual || (ano === anoAtual && mes > mesAtual)) {
      return false;
    }

    // Não pode ser muito antigo (dados disponíveis a partir de 2010)
    if (ano < 2010) {
      return false;
    }

    // Mês deve estar entre 1 e 12
    if (mes < 1 || mes > 12) {
      return false;
    }

    return true;
  }
}

// Singleton instance
export const cubscService = new CUBSCIntegrationService();

// Utility functions for common operations
export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

export const formatarPercentual = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor / 100);
};

export const obterMesesDisponiveis = (): Array<{valor: number, nome: string}> => {
  return [
    { valor: 1, nome: 'Janeiro' },
    { valor: 2, nome: 'Fevereiro' },
    { valor: 3, nome: 'Março' },
    { valor: 4, nome: 'Abril' },
    { valor: 5, nome: 'Maio' },
    { valor: 6, nome: 'Junho' },
    { valor: 7, nome: 'Julho' },
    { valor: 8, nome: 'Agosto' },
    { valor: 9, nome: 'Setembro' },
    { valor: 10, nome: 'Outubro' },
    { valor: 11, nome: 'Novembro' },
    { valor: 12, nome: 'Dezembro' }
  ];
};