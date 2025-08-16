// Serviço de Relatórios
// Geração e exportação de relatórios em diferentes formatos

import { FiltrosRelatorio, TipoRelatorio } from '../types/relatorios';

export interface DadosRelatorio {
  titulo: string;
  periodo: string;
  dados: any[];
  resumo: {
    total: number;
    valor?: number;
    comparativo?: {
      anterior: number;
      percentual: number;
    };
  };
}

export type FormatoExportacao = 'pdf' | 'excel' | 'csv';

class RelatoriosService {
  /**
   * Gera dados para relatório baseado no tipo e filtros
   */
  async gerarDadosRelatorio(tipo: TipoRelatorio, filtros: FiltrosRelatorio): Promise<DadosRelatorio> {
    try {
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1000));

      switch (tipo) {
        case 'leads-origem':
          return this.gerarRelatorioLeadsOrigem(filtros);
        case 'conversao-funil':
          return this.gerarRelatorioConversaoFunil(filtros);
        case 'performance-corretor':
          return this.gerarRelatorioPerformanceCorretor(filtros);
        case 'vendas-periodo':
          return this.gerarRelatorioVendasPeriodo(filtros);
        case 'receita-mensal':
          return this.gerarRelatorioReceitaMensal(filtros);
        case 'comissoes':
          return this.gerarRelatorioComissoes(filtros);
        case 'atividades-crm':
          return this.gerarRelatorioAtividadesCRM(filtros);
        case 'follow-ups':
          return this.gerarRelatorioFollowUps(filtros);
        default:
          throw new Error(`Tipo de relatório não suportado: ${tipo}`);
      }
    } catch (error) {
      console.error('Erro ao gerar dados do relatório:', error);
      throw error;
    }
  }

  /**
   * Exporta relatório no formato especificado
   */
  async exportarRelatorio(
    dados: DadosRelatorio, 
    formato: FormatoExportacao,
    nomeArquivo?: string
  ): Promise<void> {
    const nome = nomeArquivo || `relatorio_${dados.titulo.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;

    switch (formato) {
      case 'csv':
        this.exportarCSV(dados, `${nome}.csv`);
        break;
      case 'excel':
        this.exportarExcel(dados, `${nome}.xlsx`);
        break;
      case 'pdf':
        await this.exportarPDF(dados, `${nome}.pdf`);
        break;
      default:
        throw new Error(`Formato não suportado: ${formato}`);
    }
  }

  // Métodos privados para gerar dados específicos de cada relatório

  private gerarRelatorioLeadsOrigem(filtros: FiltrosRelatorio): DadosRelatorio {
    const dados = [
      { origem: 'Site', quantidade: 45, percentual: 35.4, conversao: 23.5 },
      { origem: 'Instagram', quantidade: 32, percentual: 25.2, conversao: 18.7 },
      { origem: 'Facebook', quantidade: 28, percentual: 22.0, conversao: 15.2 },
      { origem: 'Indicação', quantidade: 15, percentual: 11.8, conversao: 65.4 },
      { origem: 'Google Ads', quantidade: 7, percentual: 5.5, conversao: 28.6 }
    ];

    return {
      titulo: 'Leads por Origem',
      periodo: `${filtros.dataInicio} a ${filtros.dataFim}`,
      dados,
      resumo: {
        total: dados.reduce((acc, item) => acc + item.quantidade, 0),
        comparativo: {
          anterior: 98,
          percentual: 29.6
        }
      }
    };
  }

  private gerarRelatorioConversaoFunil(filtros: FiltrosRelatorio): DadosRelatorio {
    const dados = [
      { estagio: 'Lead', quantidade: 127, conversao: 100 },
      { estagio: 'Qualificado', quantidade: 89, conversao: 70.1 },
      { estagio: 'Interessado', quantidade: 56, conversao: 44.1 },
      { estagio: 'Proposta', quantidade: 32, conversao: 25.2 },
      { estagio: 'Negociação', quantidade: 18, conversao: 14.2 },
      { estagio: 'Fechado', quantidade: 12, conversao: 9.4 }
    ];

    return {
      titulo: 'Taxa de Conversão do Funil',
      periodo: `${filtros.dataInicio} a ${filtros.dataFim}`,
      dados,
      resumo: {
        total: dados[0].quantidade,
        comparativo: {
          anterior: 115,
          percentual: 10.4
        }
      }
    };
  }

  private gerarRelatorioPerformanceCorretor(filtros: FiltrosRelatorio): DadosRelatorio {
    const dados = [
      { 
        corretor: 'João Silva', 
        leads: 45, 
        vendas: 8, 
        conversao: 17.8, 
        receita: 1250000,
        comissao: 87500
      },
      { 
        corretor: 'Maria Santos', 
        leads: 38, 
        vendas: 6, 
        conversao: 15.8, 
        receita: 980000,
        comissao: 68600
      },
      { 
        corretor: 'Pedro Lima', 
        leads: 32, 
        vendas: 4, 
        conversao: 12.5, 
        receita: 720000,
        comissao: 50400
      }
    ];

    return {
      titulo: 'Performance por Corretor',
      periodo: `${filtros.dataInicio} a ${filtros.dataFim}`,
      dados,
      resumo: {
        total: dados.reduce((acc, item) => acc + item.vendas, 0),
        valor: dados.reduce((acc, item) => acc + item.receita, 0)
      }
    };
  }

  private gerarRelatorioVendasPeriodo(filtros: FiltrosRelatorio): DadosRelatorio {
    const dados = [
      { data: '2025-01-15', imovel: 'Apto 801 - Solar das Flores', valor: 450000, corretor: 'João Silva' },
      { data: '2025-01-18', imovel: 'Casa 15 - Residencial Vista Mar', valor: 680000, corretor: 'Maria Santos' },
      { data: '2025-01-22', imovel: 'Apto 1204 - Torre Azul', valor: 520000, corretor: 'João Silva' },
      { data: '2025-01-25', imovel: 'Casa 8 - Condomínio Flores', valor: 390000, corretor: 'Pedro Lima' }
    ];

    return {
      titulo: 'Vendas por Período',
      periodo: `${filtros.dataInicio} a ${filtros.dataFim}`,
      dados,
      resumo: {
        total: dados.length,
        valor: dados.reduce((acc, item) => acc + item.valor, 0),
        comparativo: {
          anterior: 3,
          percentual: 33.3
        }
      }
    };
  }

  private gerarRelatorioReceitaMensal(filtros: FiltrosRelatorio): DadosRelatorio {
    const dados = [
      { mes: '2024-09', receita: 2450000, vendas: 5, ticket: 490000 },
      { mes: '2024-10', receita: 1890000, vendas: 3, ticket: 630000 },
      { mes: '2024-11', receita: 3200000, vendas: 7, ticket: 457143 },
      { mes: '2024-12', receita: 2750000, vendas: 6, ticket: 458333 },
      { mes: '2025-01', receita: 2040000, vendas: 4, ticket: 510000 }
    ];

    return {
      titulo: 'Receita Mensal',
      periodo: `${filtros.dataInicio} a ${filtros.dataFim}`,
      dados,
      resumo: {
        total: dados.reduce((acc, item) => acc + item.vendas, 0),
        valor: dados.reduce((acc, item) => acc + item.receita, 0)
      }
    };
  }

  private gerarRelatorioComissoes(filtros: FiltrosRelatorio): DadosRelatorio {
    const dados = [
      { corretor: 'João Silva', vendas: 8, comissao_bruta: 87500, descontos: 5250, comissao_liquida: 82250 },
      { corretor: 'Maria Santos', vendas: 6, comissao_bruta: 68600, descontos: 3430, comissao_liquida: 65170 },
      { corretor: 'Pedro Lima', vendas: 4, comissao_bruta: 50400, descontos: 2520, comissao_liquida: 47880 }
    ];

    return {
      titulo: 'Relatório de Comissões',
      periodo: `${filtros.dataInicio} a ${filtros.dataFim}`,
      dados,
      resumo: {
        total: dados.reduce((acc, item) => acc + item.vendas, 0),
        valor: dados.reduce((acc, item) => acc + item.comissao_liquida, 0)
      }
    };
  }

  private gerarRelatorioAtividadesCRM(filtros: FiltrosRelatorio): DadosRelatorio {
    const dados = [
      { atividade: 'Ligações realizadas', quantidade: 245, meta: 300, percentual: 81.7 },
      { atividade: 'E-mails enviados', quantidade: 156, meta: 200, percentual: 78.0 },
      { atividade: 'WhatsApp enviados', quantidade: 423, meta: 400, percentual: 105.8 },
      { atividade: 'Visitas agendadas', quantidade: 67, meta: 80, percentual: 83.8 },
      { atividade: 'Follow-ups realizados', quantidade: 189, meta: 220, percentual: 85.9 }
    ];

    return {
      titulo: 'Atividades do CRM',
      periodo: `${filtros.dataInicio} a ${filtros.dataFim}`,
      dados,
      resumo: {
        total: dados.reduce((acc, item) => acc + item.quantidade, 0)
      }
    };
  }

  private gerarRelatorioFollowUps(filtros: FiltrosRelatorio): DadosRelatorio {
    const dados = [
      { lead: 'Carlos Silva', ultimo_contato: '2025-01-25', proximo_followup: '2025-01-30', status: 'Agendado' },
      { lead: 'Ana Costa', ultimo_contato: '2025-01-24', proximo_followup: '2025-01-28', status: 'Atrasado' },
      { lead: 'Roberto Santos', ultimo_contato: '2025-01-26', proximo_followup: '2025-01-31', status: 'Agendado' },
      { lead: 'Fernanda Lima', ultimo_contato: '2025-01-23', proximo_followup: '2025-01-27', status: 'Atrasado' }
    ];

    return {
      titulo: 'Follow-ups Pendentes',
      periodo: `${filtros.dataInicio} a ${filtros.dataFim}`,
      dados,
      resumo: {
        total: dados.length
      }
    };
  }

  // Métodos de exportação

  private exportarCSV(dados: DadosRelatorio, nomeArquivo: string): void {
    if (dados.dados.length === 0) {
      throw new Error('Não há dados para exportar');
    }

    const cabecalho = Object.keys(dados.dados[0]).join(',');
    const linhas = dados.dados.map(item => 
      Object.values(item).map(valor => 
        typeof valor === 'string' && valor.includes(',') ? `"${valor}"` : valor
      ).join(',')
    );

    const csv = [cabecalho, ...linhas].join('\n');
    this.baixarArquivo(csv, nomeArquivo, 'text/csv');
  }

  private exportarExcel(dados: DadosRelatorio, nomeArquivo: string): void {
    // Simulação de exportação Excel - em produção usaria bibliotecas como SheetJS
    const dadosJson = JSON.stringify(dados.dados, null, 2);
    this.baixarArquivo(dadosJson, nomeArquivo.replace('.xlsx', '.json'), 'application/json');
    console.log('Exportação Excel simulada - arquivo JSON baixado');
  }

  private async exportarPDF(dados: DadosRelatorio, nomeArquivo: string): Promise<void> {
    // Simulação de exportação PDF - em produção usaria bibliotecas como jsPDF
    const conteudoPDF = this.gerarConteudoPDF(dados);
    this.baixarArquivo(conteudoPDF, nomeArquivo.replace('.pdf', '.txt'), 'text/plain');
    console.log('Exportação PDF simulada - arquivo TXT baixado');
  }

  private gerarConteudoPDF(dados: DadosRelatorio): string {
    let conteudo = `${dados.titulo}\n`;
    conteudo += `Período: ${dados.periodo}\n\n`;
    conteudo += `Resumo:\n`;
    conteudo += `Total: ${dados.resumo.total}\n`;
    if (dados.resumo.valor) {
      conteudo += `Valor: R$ ${dados.resumo.valor.toLocaleString('pt-BR')}\n`;
    }
    conteudo += `\nDetalhes:\n`;
    
    dados.dados.forEach((item, index) => {
      conteudo += `\n${index + 1}. `;
      Object.entries(item).forEach(([key, value]) => {
        conteudo += `${key}: ${value} | `;
      });
      conteudo = conteudo.slice(0, -3) + '\n';
    });

    return conteudo;
  }

  private baixarArquivo(conteudo: string, nomeArquivo: string, tipoMime: string): void {
    const blob = new Blob([conteudo], { type: tipoMime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Formata valores monetários
   */
  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  /**
   * Formata percentuais
   */
  formatarPercentual(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 1
    }).format(valor / 100);
  }
}

// Instância singleton
export const relatoriosService = new RelatoriosService();