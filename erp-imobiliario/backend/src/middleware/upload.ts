import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Configuração de armazenamento
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    // Criar diretório baseado no tipo de arquivo
    const uploadPath = path.join(process.cwd(), 'uploads');
    cb(null, uploadPath);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Gerar nome único para o arquivo
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    cb(null, fileName);
  }
});

// Configuração de filtros
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Tipos de arquivo permitidos
  const allowedTypes = [
    // Documentos
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    
    // Imagens
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    
    // Outros
    'application/zip',
    'application/x-rar-compressed'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de arquivo não permitido: ${file.mimetype}`));
  }
};

// Configuração do multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5 // Máximo 5 arquivos por upload
  }
});

// Middleware para upload único
export const uploadSingle = upload.single('file');

// Middleware para upload múltiplo
export const uploadMultiple = upload.array('files', 5);

// Middleware para upload de campos específicos
export const uploadFields = upload.fields([
  { name: 'documents', maxCount: 5 },
  { name: 'images', maxCount: 3 },
  { name: 'attachments', maxCount: 2 }
]);

// Função para validar arquivo após upload
export const validateUploadedFile = (file: Express.Multer.File) => {
  const errors: string[] = [];

  // Validar tamanho
  if (file.size > 10 * 1024 * 1024) {
    errors.push('Arquivo muito grande (máximo 10MB)');
  }

  // Validar nome do arquivo
  if (file.originalname.length > 255) {
    errors.push('Nome do arquivo muito longo');
  }

  // Validar caracteres especiais
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(file.originalname)) {
    errors.push('Nome do arquivo contém caracteres inválidos');
  }

  return errors;
};

// Função para obter informações do arquivo
export const getFileInfo = (file: Express.Multer.File) => {
  return {
    id: uuidv4(),
    originalName: file.originalname,
    fileName: file.filename,
    mimetype: file.mimetype,
    size: file.size,
    path: file.path,
    url: `/uploads/${file.filename}`,
    uploadedAt: new Date()
  };
};

// Middleware de tratamento de erros do multer
export const handleUploadError = (error: any) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return { message: 'Arquivo muito grande (máximo 10MB)', status: 400 };
      case 'LIMIT_FILE_COUNT':
        return { message: 'Muitos arquivos (máximo 5)', status: 400 };
      case 'LIMIT_UNEXPECTED_FILE':
        return { message: 'Campo de arquivo inesperado', status: 400 };
      default:
        return { message: 'Erro no upload do arquivo', status: 400 };
    }
  }
  
  if (error.message.includes('Tipo de arquivo não permitido')) {
    return { message: error.message, status: 400 };
  }
  
  return { message: 'Erro interno no upload', status: 500 };
};