import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs/promises';
import path from 'path';

interface DocumentAnalysisResult {
  extractedText: string;
  documentType: string;
  keyInformation: Record<string, any>;
  summary: string;
}

interface LeadScoringResult {
  score: number;
  reasoning: string;
  recommendations: string[];
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
}

class ClaudeService {
  private anthropic: Anthropic;
  private model: string;
  private maxTokens: number;

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY || '',
    });
    this.model = process.env.CLAUDE_MODEL || 'claude-3-sonnet-20240229';
    this.maxTokens = parseInt(process.env.CLAUDE_MAX_TOKENS || '4000');
  }

  // ========================================
  // ANÁLISE DE DOCUMENTOS
  // ========================================

  async analyzeDocument(filePath: string, documentType?: string): Promise<DocumentAnalysisResult> {
    try {
      // Ler arquivo
      const fileBuffer = await fs.readFile(filePath);
      const fileExtension = path.extname(filePath).toLowerCase();
      
      let prompt = this.getDocumentAnalysisPrompt(documentType);
      
      // Preparar mensagem baseada no tipo de arquivo
      let message: any = {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt
          }
        ]
      };

      // Se for imagem, adicionar ao conteúdo
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(fileExtension)) {
        const base64Image = fileBuffer.toString('base64');
        message.content.push({
          type: 'image',
          source: {
            type: 'base64',
            media_type: `image/${fileExtension.slice(1)}`,
            data: base64Image
          }
        });
      } else {
        // Para PDFs e documentos de texto, primeiro extrair texto
        const extractedText = await this.extractTextFromFile(filePath);
        message.content.push({
          type: 'text',
          text: `Documento para análise:\n\n${extractedText}`
        });
      }

      const response = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        messages: [message]
      });

      const analysis = this.parseDocumentAnalysis(response.content[0].text);
      
      return {
        extractedText: 'Texto extraído do documento', // Implementar extração real
        documentType: analysis.documentType || 'desconhecido',
        keyInformation: analysis.keyInformation || {},
        summary: analysis.summary || ''
      };

    } catch (error) {
      console.error('Erro na análise de documento:', error);
      throw new Error('Falha na análise do documento');
    }
  }

  // ========================================
  // LEAD SCORING INTELIGENTE
  // ========================================

  async scoreLeadWithAI(leadData: any): Promise<LeadScoringResult> {
    try {
      const prompt = `
Analise este lead e forneça uma pontuação de qualidade (0-100) baseada nos dados fornecidos.

Dados do Lead:
- Nome: ${leadData.nome}
- Email: ${leadData.email}
- Telefone: ${leadData.telefone}
- Origem: ${leadData.origem}
- Interesse: ${leadData.interesseImovel?.join(', ') || 'Não especificado'}
- Orçamento: R$ ${leadData.orcamentoMinimo || 'Não informado'} - R$ ${leadData.orcamentoMaximo || 'Não informado'}
- Prazo: ${leadData.prazoCompra || 'Não especificado'}
- Observações: ${leadData.observacoes || 'Nenhuma'}
- Última interação: ${leadData.ultimaInteracao || 'Nunca'}

Forneça sua resposta no formato JSON:
{
  "score": 0-100,
  "reasoning": "explicação detalhada da pontuação",
  "recommendations": ["recomendação 1", "recomendação 2", "recomendação 3"],
  "priority": "baixa|media|alta|urgente"
}

Considere fatores como:
- Completude dos dados
- Qualidade das informações de contato
- Orçamento definido
- Prazo de compra
- Origem do lead
- Histórico de interações
`;

      const response = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const result = JSON.parse(response.content[0].text);
      
      return {
        score: result.score,
        reasoning: result.reasoning,
        recommendations: result.recommendations,
        priority: result.priority
      };

    } catch (error) {
      console.error('Erro no lead scoring:', error);
      // Fallback para scoring básico
      return this.basicLeadScoring(leadData);
    }
  }

  // ========================================
  // AUTO-RESPOSTA INTELIGENTE
  // ========================================

  async generateAutoReply(messageText: string, leadContext?: any): Promise<string> {
    try {
      const prompt = `
Você é um assistente virtual de uma imobiliária. Gere uma resposta educada e profissional para esta mensagem:

Mensagem recebida: "${messageText}"

${leadContext ? `
Contexto do lead:
- Nome: ${leadContext.nome}
- Interesse: ${leadContext.interesseImovel?.join(', ') || 'Não especificado'}
- Orçamento: R$ ${leadContext.orcamentoMinimo || '?'} - R$ ${leadContext.orcamentoMaximo || '?'}
` : ''}

Diretrizes:
- Seja cordial e profissional
- Mantenha a resposta concisa (máximo 2-3 frases)
- Ofereça ajuda específica se possível
- Mencione que um corretor entrará em contato em breve
- Use emojis apropriados (máximo 1-2)

Responda APENAS com a mensagem, sem explicações adicionais.
`;

      const response = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: 200,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      return response.content[0].text.trim();

    } catch (error) {
      console.error('Erro na geração de auto-resposta:', error);
      return 'Olá! Obrigado pelo seu contato. Um dos nossos corretores entrará em contato com você em breve! 🏠';
    }
  }

  // ========================================
  // RESUMO DE CONVERSAS
  // ========================================

  async summarizeConversation(messages: any[]): Promise<string> {
    try {
      const conversationText = messages
        .map(msg => `${msg.isFromMe ? 'Empresa' : 'Cliente'}: ${msg.content}`)
        .join('\n');

      const prompt = `
Resuma esta conversa de WhatsApp entre uma imobiliária e um cliente potencial:

${conversationText}

Forneça um resumo conciso incluindo:
- Principais pontos de interesse do cliente
- Necessidades identificadas
- Próximos passos sugeridos
- Status atual da negociação

Mantenha o resumo profissional e objetivo (máximo 150 palavras).
`;

      const response = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      return response.content[0].text.trim();

    } catch (error) {
      console.error('Erro no resumo de conversa:', error);
      return 'Não foi possível gerar resumo da conversa.';
    }
  }

  // ========================================
  // MÉTODOS PRIVADOS
  // ========================================

  private getDocumentAnalysisPrompt(documentType?: string): string {
    const basePrompt = `
Analise este documento e extraia as informações mais importantes.

Forneça sua resposta no formato JSON:
{
  "documentType": "tipo do documento identificado",
  "keyInformation": {
    "campo1": "valor1",
    "campo2": "valor2"
  },
  "summary": "resumo do documento em 2-3 frases"
}
`;

    if (documentType === 'rg' || documentType === 'cnh') {
      return basePrompt + `
Documento de identificação detectado. Extraia:
- Nome completo
- Número do documento
- Data de nascimento
- Órgão emissor
- Data de emissão
- Validade (se aplicável)
`;
    }

    if (documentType === 'comprovante_renda') {
      return basePrompt + `
Comprovante de renda detectado. Extraia:
- Nome do beneficiário
- Valor da renda
- Período de referência
- Empresa/fonte pagadora
- Data de emissão
`;
    }

    return basePrompt;
  }

  private parseDocumentAnalysis(responseText: string): any {
    try {
      return JSON.parse(responseText);
    } catch {
      // Fallback se JSON for inválido
      return {
        documentType: 'desconhecido',
        keyInformation: {},
        summary: responseText.substring(0, 200) + '...'
      };
    }
  }

  private async extractTextFromFile(filePath: string): Promise<string> {
    // Implementação placeholder - substituir por OCR real (Tesseract, etc.)
    const fileExtension = path.extname(filePath).toLowerCase();
    
    if (['.txt'].includes(fileExtension)) {
      return await fs.readFile(filePath, 'utf-8');
    }
    
    // Para PDFs e outros formatos, implementar extração real
    return '[Texto extraído do documento]';
  }

  private basicLeadScoring(leadData: any): LeadScoringResult {
    let score = 0;
    const recommendations: string[] = [];

    // Scoring básico
    if (leadData.email) score += 20;
    if (leadData.telefone) score += 20;
    if (leadData.orcamentoMinimo && leadData.orcamentoMaximo) score += 30;
    if (leadData.prazoCompra && leadData.prazoCompra !== 'indefinido') score += 20;
    if (leadData.interesseImovel?.length > 0) score += 10;

    // Recomendações
    if (!leadData.orcamentoMinimo) recommendations.push('Qualificar orçamento disponível');
    if (!leadData.prazoCompra) recommendations.push('Identificar prazo para compra');
    if (score < 50) recommendations.push('Lead necessita qualificação adicional');

    const priority = score >= 80 ? 'urgente' : score >= 60 ? 'alta' : score >= 40 ? 'media' : 'baixa';

    return {
      score,
      reasoning: 'Pontuação baseada em completude dos dados e qualificação básica',
      recommendations,
      priority
    };
  }
}

export default ClaudeService;