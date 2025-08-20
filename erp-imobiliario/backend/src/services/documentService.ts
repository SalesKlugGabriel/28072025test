import fs from 'fs/promises';
import path from 'path';
import pdfParse from 'pdf-parse';
import { logInfo, logError } from '../utils/logger';
import { prisma } from '../config/database';

// Interface para resultado do parse
interface ParseResult {
  success: boolean;
  content?: string;
  metadata?: {
    pages?: number;
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modificationDate?: Date;
  };
  error?: string;
}

class DocumentService {
  // Parse de arquivo PDF
  async parsePDF(filePath: string): Promise<ParseResult> {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const pdfData = await pdfParse(dataBuffer);

      return {
        success: true,
        content: pdfData.text,
        metadata: {
          pages: pdfData.numpages,
          title: pdfData.info?.Title,
          author: pdfData.info?.Author,
          subject: pdfData.info?.Subject,
          keywords: pdfData.info?.Keywords,
          creator: pdfData.info?.Creator,
          producer: pdfData.info?.Producer,
          creationDate: pdfData.info?.CreationDate ? new Date(pdfData.info.CreationDate) : undefined,
          modificationDate: pdfData.info?.ModDate ? new Date(pdfData.info.ModDate) : undefined,
        }
      };
    } catch (error: any) {
      logError(error, { context: 'PDF Parse', filePath });
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Parse de arquivo de texto
  async parseTextFile(filePath: string): Promise<ParseResult> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const stats = await fs.stat(filePath);

      return {
        success: true,
        content,
        metadata: {
          creationDate: stats.birthtime,
          modificationDate: stats.mtime
        }
      };
    } catch (error: any) {
      logError(error, { context: 'Text Parse', filePath });
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Detectar tipo de documento
  detectDocumentType(fileName: string, mimetype: string): string {
    const lowerName = fileName.toLowerCase();
    
    // Documentos de identidade
    if (lowerName.includes('rg') || lowerName.includes('identidade')) {
      return 'RG';
    }
    if (lowerName.includes('cpf')) {
      return 'CPF';
    }
    if (lowerName.includes('cnh') || lowerName.includes('habilitacao')) {
      return 'CNH';
    }
    
    // Comprovantes
    if (lowerName.includes('comprovante') && lowerName.includes('renda')) {
      return 'COMPROVANTE_RENDA';
    }
    if (lowerName.includes('comprovante') && lowerName.includes('residencia')) {
      return 'COMPROVANTE_RESIDENCIA';
    }
    
    // Contratos
    if (lowerName.includes('contrato')) {
      return 'CONTRATO';
    }
    
    // Por tipo MIME
    switch (mimetype) {
      case 'application/pdf':
        return 'PDF';
      case 'image/jpeg':
      case 'image/png':
        return 'IMAGEM';
      default:
        return 'DOCUMENTO';
    }
  }

  // Extrair informações de documento de identidade
  extractIdentityInfo(content: string): { cpf?: string; rg?: string; nome?: string } {
    const info: { cpf?: string; rg?: string; nome?: string } = {};

    // Regex para CPF
    const cpfRegex = /(\d{3}\.?\d{3}\.?\d{3}[-.]?\d{2})/g;
    const cpfMatch = content.match(cpfRegex);
    if (cpfMatch) {
      info.cpf = cpfMatch[0].replace(/[^\d]/g, '');
    }

    // Regex para RG
    const rgRegex = /(\d{1,2}\.?\d{3}\.?\d{3}[-.]?\w{1})/g;
    const rgMatch = content.match(rgRegex);
    if (rgMatch) {
      info.rg = rgMatch[0];
    }

    // Regex para nome (após palavras como "Nome:", "NOME:", etc.)
    const nomeRegex = /(?:nome|name):\s*([A-ZÀ-Ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ]+)*)/gi;
    const nomeMatch = content.match(nomeRegex);
    if (nomeMatch) {
      info.nome = nomeMatch[0].split(':')[1]?.trim();
    }

    return info;
  }

  // Salvar documento no banco
  async saveDocument(documentData: {
    pessoaId: string;
    originalName: string;
    fileName: string;
    filePath: string;
    mimetype: string;
    size: number;
    type: string;
    content?: string;
    metadata?: any;
    extractedInfo?: any;
  }) {
    try {
      const documento = await prisma.documento.create({
        data: {
          pessoaId: documentData.pessoaId,
          tipo: documentData.type,
          categoria: this.getCategoriaFromTipo(documentData.type),
          nomeArquivo: documentData.originalName,
          arquivoUrl: `/uploads/${documentData.fileName}`,
          tamanho: documentData.size,
          mimeType: documentData.mimetype,
          uploadedBy: 'system' // Em produção, pegar do usuário logado
        }
      });

      // Se há conteúdo extraído, salvar em tabela separada (opcional)
      if (documentData.content) {
        // Aqui poderia salvar o conteúdo em uma tabela de índice para busca
        logInfo(`Conteúdo extraído do documento ${documento.id}: ${documentData.content.substring(0, 100)}...`);
      }

      return documento;
    } catch (error: any) {
      logError(error, { context: 'Save Document', documentData });
      throw error;
    }
  }

  // Processar arquivo uploadado
  async processUploadedFile(file: Express.Multer.File, pessoaId: string) {
    try {
      // Detectar tipo do documento
      const documentType = this.detectDocumentType(file.originalname, file.mimetype);
      
      // Parse do conteúdo baseado no tipo
      let parseResult: ParseResult = { success: false };
      
      if (file.mimetype === 'application/pdf') {
        parseResult = await this.parsePDF(file.path);
      } else if (file.mimetype === 'text/plain') {
        parseResult = await this.parseTextFile(file.path);
      }

      // Extrair informações específicas se for documento de identidade
      let extractedInfo = {};
      if (parseResult.success && parseResult.content) {
        if (['RG', 'CPF', 'CNH'].includes(documentType)) {
          extractedInfo = this.extractIdentityInfo(parseResult.content);
        }
      }

      // Salvar no banco
      const documento = await this.saveDocument({
        pessoaId,
        originalName: file.originalname,
        fileName: file.filename,
        filePath: file.path,
        mimetype: file.mimetype,
        size: file.size,
        type: documentType,
        content: parseResult.content,
        metadata: parseResult.metadata,
        extractedInfo
      });

      return {
        success: true,
        documento,
        parseResult,
        extractedInfo
      };
    } catch (error: any) {
      logError(error, { context: 'Process Upload', file: file.originalname });
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Deletar arquivo físico
  async deleteFile(filePath: string): Promise<boolean> {
    try {
      await fs.unlink(filePath);
      logInfo(`Arquivo deletado: ${filePath}`);
      return true;
    } catch (error: any) {
      logError(error, { context: 'Delete File', filePath });
      return false;
    }
  }

  // Obter categoria baseada no tipo
  private getCategoriaFromTipo(tipo: string): 'DOCUMENTACAO_PESSOAL' | 'CONTRATOS' | 'ADVERTENCIAS' | 'ATESTADOS_MEDICOS' | 'OUTROS' {
    switch (tipo) {
      case 'RG':
      case 'CPF':
      case 'CNH':
      case 'COMPROVANTE_RENDA':
      case 'COMPROVANTE_RESIDENCIA':
        return 'DOCUMENTACAO_PESSOAL';
      case 'CONTRATO':
        return 'CONTRATOS';
      default:
        return 'OUTROS';
    }
  }

  // Buscar documentos com conteúdo
  async searchDocuments(pessoaId: string, searchTerm: string) {
    try {
      // Em uma implementação completa, isso seria feito com busca full-text no banco
      // Por ora, vamos fazer uma busca simples
      const documentos = await prisma.documento.findMany({
        where: {
          pessoaId,
          OR: [
            { nomeArquivo: { contains: searchTerm, mode: 'insensitive' } },
            { tipo: { contains: searchTerm, mode: 'insensitive' } }
          ]
        }
      });

      return documentos;
    } catch (error: any) {
      logError(error, { context: 'Search Documents', pessoaId, searchTerm });
      throw error;
    }
  }

  // Obter estatísticas de documentos
  async getDocumentStats(pessoaId: string) {
    try {
      const stats = await prisma.documento.groupBy({
        by: ['categoria'],
        where: { pessoaId },
        _count: { categoria: true },
        _sum: { tamanho: true }
      });

      const totalDocs = await prisma.documento.count({
        where: { pessoaId }
      });

      const totalSize = await prisma.documento.aggregate({
        where: { pessoaId },
        _sum: { tamanho: true }
      });

      return {
        totalDocuments: totalDocs,
        totalSize: totalSize._sum.tamanho || 0,
        byCategory: stats.map(stat => ({
          categoria: stat.categoria,
          count: stat._count.categoria,
          size: stat._sum.tamanho || 0
        }))
      };
    } catch (error: any) {
      logError(error, { context: 'Document Stats', pessoaId });
      throw error;
    }
  }
}

export const documentService = new DocumentService();
export { DocumentService, type ParseResult };