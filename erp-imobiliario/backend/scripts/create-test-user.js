const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Hash da senha
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    // Criar usuário teste
    const user = await prisma.user.create({
      data: {
        email: 'admin@legasys.com',
        nome: 'Administrador',
        senha: hashedPassword,
        perfil: 'ADMIN',
        ativo: true,
        telefone: '(11) 99999-9999'
      }
    });
    
    console.log('✅ Usuário teste criado:', user);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️ Usuário já existe');
    } else {
      console.error('❌ Erro ao criar usuário:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();