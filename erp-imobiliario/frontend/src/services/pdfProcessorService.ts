interface PDFData {
  unidade: string;
  valor: number;
  entrada: number;
  parcelas: number;
  valorParcela: number;
  chaves: number;
  metragem?: number;
  tipo?: string;
}

interface ProcessingResult {
  success: boolean;
  data: PDFData[];
  error?: string;
  totalProcessed: number;
}

export class PDFProcessorService {
  private static instance: PDFProcessorService;

  static getInstance(): PDFProcessorService {
    if (!PDFProcessorService.instance) {
      PDFProcessorService.instance = new PDFProcessorService();
    }
    return PDFProcessorService.instance;
  }

  async processFile(file: File): Promise<ProcessingResult> {
    try {
      if (file.type === 'application/pdf') {
        return await this.processPDF(file);
      } else if (this.isExcelFile(file)) {
        return await this.processExcel(file);
      } else if (file.type === 'text/csv') {
        return await this.processCSV(file);
      } else {
        throw new Error('Tipo de arquivo não suportado');
      }
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        totalProcessed: 0
      };
    }
  }

  private async processPDF(file: File): Promise<ProcessingResult> {
    // Simular processamento de PDF com delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulação de dados extraídos do PDF
    const mockData: PDFData[] = [
      {
        unidade: 'AP-101',
        valor: 350000,
        entrada: 105000, // 30%
        parcelas: 60,
        valorParcela: 4083.33,
        chaves: 35000, // 10%
        metragem: 65,
        tipo: 'Apartamento'
      },
      {
        unidade: 'AP-102',
        valor: 380000,
        entrada: 114000,
        parcelas: 60,
        valorParcela: 4433.33,
        chaves: 38000,
        metragem: 72,
        tipo: 'Apartamento'
      },
      {
        unidade: 'AP-201',
        valor: 420000,
        entrada: 126000,
        parcelas: 60,
        valorParcela: 4900.00,
        chaves: 42000,
        metragem: 80,
        tipo: 'Apartamento'
      },
      {
        unidade: 'CO-301',
        valor: 650000,
        entrada: 195000,
        parcelas: 60,
        valorParcela: 7583.33,
        chaves: 65000,
        metragem: 120,
        tipo: 'Cobertura'
      }
    ];

    return {
      success: true,
      data: mockData,
      totalProcessed: mockData.length
    };
  }

  private async processExcel(file: File): Promise<ProcessingResult> {
    // Simular processamento de Excel
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const data = await this.readExcelFile(file);
      return {
        success: true,
        data,
        totalProcessed: data.length
      };
    } catch (error) {
      throw new Error('Erro ao processar arquivo Excel: ' + error);
    }
  }

  private async processCSV(file: File): Promise<ProcessingResult> {
    // Simular processamento de CSV
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const data: PDFData[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row = this.parseRowData(headers, values);
        if (row) {
          data.push(row);
        }
      }

      return {
        success: true,
        data,
        totalProcessed: data.length
      };
    } catch (error) {
      throw new Error('Erro ao processar arquivo CSV: ' + error);
    }
  }

  private async readExcelFile(file: File): Promise<PDFData[]> {
    // Simulação de leitura de Excel
    // Em implementação real, usar bibliotecas como xlsx ou exceljs
    
    const mockData: PDFData[] = [
      {
        unidade: 'TORRE-A-101',
        valor: 320000,
        entrada: 96000,
        parcelas: 72,
        valorParcela: 3111.11,
        chaves: 32000,
        metragem: 58,
        tipo: 'Apartamento'
      },
      {
        unidade: 'TORRE-A-102',
        valor: 340000,
        entrada: 102000,
        parcelas: 72,
        valorParcela: 3305.56,
        chaves: 34000,
        metragem: 62,
        tipo: 'Apartamento'
      },
      {
        unidade: 'TORRE-B-201',
        valor: 450000,
        entrada: 135000,
        parcelas: 60,
        valorParcela: 5250.00,
        chaves: 45000,
        metragem: 85,
        tipo: 'Apartamento'
      }
    ];

    return mockData;
  }

  private parseRowData(headers: string[], values: string[]): PDFData | null {
    try {
      const row: any = {};
      
      headers.forEach((header, index) => {
        if (values[index]) {
          row[header] = values[index];
        }
      });

      // Mapear colunas comuns
      const unidade = this.findValue(row, ['unidade', 'apartamento', 'codigo', 'unit']);
      const valor = this.parseNumber(this.findValue(row, ['valor', 'preco', 'price', 'value']));
      const entrada = this.parseNumber(this.findValue(row, ['entrada', 'down', 'downpayment']));
      const parcelas = this.parseNumber(this.findValue(row, ['parcelas', 'installments', 'payments']));
      const valorParcela = this.parseNumber(this.findValue(row, ['valor_parcela', 'installment_value', 'monthly']));
      const chaves = this.parseNumber(this.findValue(row, ['chaves', 'keys', 'final']));
      const metragem = this.parseNumber(this.findValue(row, ['metragem', 'area', 'm2', 'sqm']));
      const tipo = this.findValue(row, ['tipo', 'type', 'category']);

      if (!unidade || !valor) {
        return null; // Linha inválida
      }

      return {
        unidade,
        valor,
        entrada: entrada || valor * 0.3, // 30% padrão
        parcelas: parcelas || 60, // 60 parcelas padrão
        valorParcela: valorParcela || ((valor - (entrada || valor * 0.3)) / (parcelas || 60)),
        chaves: chaves || valor * 0.1, // 10% padrão
        metragem,
        tipo
      };
    } catch (error) {
      console.error('Erro ao processar linha:', error);
      return null;
    }
  }

  private findValue(row: any, possibleKeys: string[]): string | undefined {
    for (const key of possibleKeys) {
      if (row[key] !== undefined) {
        return row[key];
      }
    }
    return undefined;
  }

  private parseNumber(value: string | undefined): number {
    if (!value) return 0;
    
    // Remover caracteres não numéricos exceto ponto e vírgula
    const cleanValue = value.toString()
      .replace(/[^\d.,\-]/g, '')
      .replace(',', '.');
    
    return parseFloat(cleanValue) || 0;
  }

  private isExcelFile(file: File): boolean {
    return file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
           file.type === 'application/vnd.ms-excel' ||
           file.name.endsWith('.xlsx') ||
           file.name.endsWith('.xls');
  }

  // Método para validar dados processados
  validateData(data: PDFData[]): { valid: PDFData[]; invalid: any[] } {
    const valid: PDFData[] = [];
    const invalid: any[] = [];

    data.forEach((item, index) => {
      const errors: string[] = [];

      if (!item.unidade || item.unidade.trim() === '') {
        errors.push('Unidade é obrigatória');
      }

      if (!item.valor || item.valor <= 0) {
        errors.push('Valor deve ser maior que zero');
      }

      if (item.entrada < 0) {
        errors.push('Entrada não pode ser negativa');
      }

      if (item.parcelas <= 0) {
        errors.push('Número de parcelas deve ser maior que zero');
      }

      if (item.valorParcela <= 0) {
        errors.push('Valor da parcela deve ser maior que zero');
      }

      if (errors.length === 0) {
        valid.push(item);
      } else {
        invalid.push({
          line: index + 1,
          data: item,
          errors
        });
      }
    });

    return { valid, invalid };
  }

  // Método para gerar preview dos dados
  generatePreview(data: PDFData[], maxItems: number = 5): PDFData[] {
    return data.slice(0, maxItems);
  }

  // Método para exportar dados processados
  exportToCSV(data: PDFData[]): string {
    const headers = [
      'Unidade',
      'Valor',
      'Entrada',
      'Parcelas',
      'Valor Parcela',
      'Chaves',
      'Metragem',
      'Tipo'
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        item.unidade,
        item.valor,
        item.entrada,
        item.parcelas,
        item.valorParcela,
        item.chaves,
        item.metragem || '',
        item.tipo || ''
      ].join(','))
    ].join('\n');

    return csvContent;
  }

  // Método para baixar arquivo CSV
  downloadCSV(data: PDFData[], filename: string = 'tabela_processada.csv'): void {
    const csvContent = this.exportToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

export const pdfProcessorService = PDFProcessorService.getInstance();