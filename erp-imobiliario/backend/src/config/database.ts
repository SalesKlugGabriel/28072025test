import { PrismaClient } from '@prisma/client';

// Configuração do Prisma Client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'legasys_erp'}`
    }
  }
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Função para testar a conexão
export async function testConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT NOW()`;
    console.log('✅ Conexão com PostgreSQL estabelecida com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com PostgreSQL:', error);
    return false;
  }
}

// Função para fechar todas as conexões
export async function closeConnection(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log('✅ Conexão Prisma Client fechada');
  } catch (error) {
    console.error('❌ Erro ao fechar conexão Prisma:', error);
  }
}

// Health check function
export async function healthCheck(): Promise<{ status: string; database: string; timestamp: Date }> {
  try {
    const result = await prisma.$queryRaw`SELECT NOW() as timestamp` as { timestamp: Date }[];
    return {
      status: 'ok',
      database: 'connected',
      timestamp: result[0].timestamp
    };
  } catch (error) {
    throw new Error(`Database health check failed: ${error}`);
  }
}

export default prisma;