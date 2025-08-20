import nodemailer from 'nodemailer';
import { logInfo, logError } from '../utils/logger';

// Interface para opções de email
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Configurar transporter
const createTransporter = () => {
  const config = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true para 465, false para outros ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  return nodemailer.createTransport(config);
};

// Enviar email
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      logError(new Error('Configurações SMTP não encontradas'));
      return false;
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'LegaSys ERP'}" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const result = await transporter.sendMail(mailOptions);
    
    logInfo(`Email enviado para ${options.to}: ${result.messageId}`);
    return true;
  } catch (error) {
    logError(error as Error, { context: 'Email Service', to: options.to });
    return false;
  }
};

// Template para reset de senha
export const sendPasswordResetEmail = async (email: string, resetToken: string): Promise<boolean> => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  
  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Redefinir Senha - LegaSys ERP</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { 
          display: inline-block; 
          background: #2563eb; 
          color: white; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>LegaSys ERP 3.0</h1>
        </div>
        <div class="content">
          <h2>Redefinir sua senha</h2>
          <p>Olá,</p>
          <p>Você solicitou a redefinição de sua senha. Clique no botão abaixo para criar uma nova senha:</p>
          
          <a href="${resetUrl}" class="button">Redefinir Senha</a>
          
          <p>Ou copie e cole este link no seu navegador:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          
          <p><strong>Este link expira em 1 hora.</strong></p>
          
          <p>Se você não solicitou esta redefinição, pode ignorar este email.</p>
          
          <p>Atenciosamente,<br>Equipe LegaSys ERP</p>
        </div>
        <div class="footer">
          <p>Este é um email automático, não responda.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    LegaSys ERP 3.0 - Redefinir Senha
    
    Você solicitou a redefinição de sua senha.
    
    Clique no link abaixo para criar uma nova senha:
    ${resetUrl}
    
    Este link expira em 1 hora.
    
    Se você não solicitou esta redefinição, pode ignorar este email.
    
    Atenciosamente,
    Equipe LegaSys ERP
  `;

  return sendEmail({
    to: email,
    subject: 'Redefinir sua senha - LegaSys ERP',
    html,
    text,
  });
};

// Template para boas-vindas
export const sendWelcomeEmail = async (email: string, nome: string): Promise<boolean> => {
  const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`;
  
  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bem-vindo ao LegaSys ERP</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { 
          display: inline-block; 
          background: #16a34a; 
          color: white; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>LegaSys ERP 3.0</h1>
        </div>
        <div class="content">
          <h2>Bem-vindo, ${nome}!</h2>
          <p>Sua conta foi criada com sucesso no LegaSys ERP 3.0.</p>
          <p>Agora você pode acessar nossa plataforma completa de gestão imobiliária.</p>
          
          <a href="${loginUrl}" class="button">Fazer Login</a>
          
          <p><strong>Principais funcionalidades:</strong></p>
          <ul>
            <li>Gestão de leads e clientes</li>
            <li>CRM imobiliário completo</li>
            <li>Controle de empreendimentos</li>
            <li>Automações inteligentes</li>
            <li>Relatórios e dashboard</li>
            <li>Integração WhatsApp</li>
          </ul>
          
          <p>Em caso de dúvidas, entre em contato com nosso suporte.</p>
          
          <p>Atenciosamente,<br>Equipe LegaSys ERP</p>
        </div>
        <div class="footer">
          <p>Este é um email automático, não responda.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Bem-vindo ao LegaSys ERP 3.0!',
    html,
  });
};