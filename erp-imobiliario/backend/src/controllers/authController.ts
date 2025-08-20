import { Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth';
import { sendPasswordResetEmail, sendWelcomeEmail } from '../services/emailService';

// Schemas de validação
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória')
});

const registerSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  perfil: z.enum(['ADMIN', 'GERENTE', 'CORRETOR', 'ENGENHEIRO', 'ARQUITETO', 'JURIDICO', 'FINANCEIRO']).default('CORRETOR')
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token é obrigatório')
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres')
});

// Gerar tokens JWT
const generateTokens = (userId: string, email: string) => {
  const accessToken = jwt.sign(
    { userId, email },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// Login
export const login = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, senha } = loginSchema.parse(req.body);

  // Buscar usuário
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      nome: true,
      senha: true,
      perfil: true,
      ativo: true
    }
  });

  if (!user || !user.ativo) {
    res.status(401).json({ error: 'Credenciais inválidas' });
      return;
  }

  // Verificar senha
  const isValidPassword = await bcrypt.compare(senha, user.senha);
  if (!isValidPassword) {
    res.status(401).json({ error: 'Credenciais inválidas' });
      return;
  }

  // Gerar tokens
  const { accessToken, refreshToken } = generateTokens(user.id, user.email);

  // Salvar refresh token no banco
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias
    }
  });

  // Atualizar último login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() }
  });

  res.json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      nome: user.nome,
      perfil: user.perfil
    }
  });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
      return;
  }
};

// Refresh token
export const refreshToken = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { refreshToken } = refreshTokenSchema.parse(req.body);

  // Verificar refresh token
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
  
  // Buscar token no banco
  const storedToken = await prisma.refreshToken.findFirst({
    where: {
      token: refreshToken,
      userId: decoded.userId,
      expiresAt: { gte: new Date() }
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          nome: true,
          perfil: true,
          ativo: true
        }
      }
    }
  });

  if (!storedToken || !storedToken.user.ativo) {
    res.status(401).json({ error: 'Refresh token inválido' });
      return;
  }

  // Gerar novo access token
  const { accessToken: newAccessToken } = generateTokens(storedToken.user.id, storedToken.user.email);

  res.json({
    accessToken: newAccessToken,
    user: {
      id: storedToken.user.id,
      email: storedToken.user.email,
      nome: storedToken.user.nome,
      perfil: storedToken.user.perfil
    }
  });
  } catch (error) {
    res.status(401).json({ error: 'Refresh token inválido' });
      return;
  }
};

// Logout
export const logout = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      // Remover refresh token do banco
      await prisma.refreshToken.deleteMany({
        where: {
          token: refreshToken,
          userId: req.user!.id
        }
      });
    }

    res.json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
      return;
  }
};

// Verificar token
export const verifyToken = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    res.json({
      valid: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
      return;
  }
};

// Obter dados do usuário logado
export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        nome: true,
        perfil: true,
        ativo: true,
        lastLogin: true,
        createdAt: true
      }
    });

    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
      return;
  }
};

// Atualizar dados do usuário logado
export const updateMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const updateSchema = z.object({
      nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
      email: z.string().email('Email inválido').optional()
    });

    const data = updateSchema.parse(req.body);

    // Verificar se email já existe (se estiver sendo alterado)
    if (data.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: data.email,
          id: { not: req.user!.id }
        }
      });

      if (existingUser) {
        res.status(400).json({ error: 'Email já está em uso' });
      return;
      }
    }

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data,
      select: {
        id: true,
        email: true,
        nome: true,
        perfil: true,
        ativo: true,
        lastLogin: true,
        createdAt: true
      }
    });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
      return;
  }
};

// Alterar senha
export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

    // Buscar usuário com senha
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { senha: true }
    });

    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }

    // Verificar senha atual
    const isValidPassword = await bcrypt.compare(currentPassword, user.senha);
    if (!isValidPassword) {
      res.status(400).json({ error: 'Senha atual incorreta' });
      return;
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Atualizar senha
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { senha: hashedPassword }
    });

    // Invalidar todos os refresh tokens
    await prisma.refreshToken.deleteMany({
      where: { userId: req.user!.id }
    });

    res.json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
      return;
  }
};

// Registro de usuário
export const register = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { nome, email, senha, perfil } = registerSchema.parse(req.body);

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      res.status(400).json({ error: 'Email já está em uso' });
      return;
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 12);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
        perfil,
        ativo: true
      },
      select: {
        id: true,
        email: true,
        nome: true,
        perfil: true,
        ativo: true,
        createdAt: true
      }
    });

    // Enviar email de boas-vindas (não bloquear se falhar)
    sendWelcomeEmail(user.email, user.nome).catch(console.error);

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user
    });
    return;
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
      return;
  }
};

// Esqueci minha senha
export const forgotPassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email } = z.object({
      email: z.string().email('Email inválido')
    }).parse(req.body);

    // Verificar se usuário existe
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Por segurança, retornamos sucesso mesmo se o email não existir
      res.json({ message: 'Se o email existir, você receberá instruções para redefinir sua senha' });
      return;
    }

    // Gerar token de reset
    const resetToken = jwt.sign(
      { email: user.email, type: 'password_reset' },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    // Salvar token no banco
    await prisma.passwordReset.create({
      data: {
        email: user.email,
        token: resetToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hora
      }
    });

    // Enviar email com o token
    const emailSent = await sendPasswordResetEmail(user.email, resetToken);
    
    if (process.env.NODE_ENV === 'development') {
      res.json({
        message: 'Token de reset gerado (desenvolvimento)',
        resetToken,
        resetUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`,
        emailSent
      });
      return;
    }

    res.json({ message: 'Se o email existir, você receberá instruções para redefinir sua senha' });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
      return;
  }
};

// Reset de senha
export const resetPassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = z.object({
      token: z.string().min(1, 'Token é obrigatório'),
      newPassword: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres')
    }).parse(req.body);

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    if (decoded.type !== 'password_reset') {
      res.status(400).json({ error: 'Token inválido' });
      return;
    }

    // Buscar token no banco
    const resetRecord = await prisma.passwordReset.findFirst({
      where: {
        token,
        email: decoded.email,
        used: false,
        expiresAt: { gte: new Date() }
      }
    });

    if (!resetRecord) {
      res.status(400).json({ error: 'Token inválido ou expirado' });
      return;
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Atualizar senha do usuário
    await prisma.user.update({
      where: { email: decoded.email },
      data: { senha: hashedPassword }
    });

    // Marcar token como usado
    await prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { used: true }
    });

    // Invalidar todos os refresh tokens
    await prisma.refreshToken.deleteMany({
      where: {
        user: {
          email: decoded.email
        }
      }
    });

    res.json({ message: 'Senha redefinida com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Token inválido ou expirado' });
      return;
  }
};