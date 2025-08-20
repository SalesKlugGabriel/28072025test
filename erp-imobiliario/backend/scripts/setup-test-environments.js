#!/usr/bin/env node

/**
 * Script para configurar ambientes de teste isolados para múltiplas organizações
 * 
 * Este script cria:
 * 1. Bancos de dados separados para cada cliente
 * 2. Organizações de teste
 * 3. Usuários administradores
 * 4. Dados de exemplo (opcional)
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { execSync } = require('child_process');

// Configuração dos clientes de teste
const CLIENTES_TESTE = [
  {
    id: 1,
    nome: 'Imobiliária Alpha',
    subdominio: 'alpha',
    email: 'contato@alpha.test.com',
    cnpj: '12345678000101',
    plano: 'PROFESSIONAL',
    maxUsuarios: 25,
    admin: {
      nome: 'João Silva',
      email: 'joao@alpha.test.com',
      senha: 'admin123',
      telefone: '11999887766'
    },
    usuarios: [
      {
        nome: 'Maria Santos',
        email: 'maria@alpha.test.com',
        perfil: 'CORRETOR',
        senha: 'corretor123',
        telefone: '11988776655'
      },
      {
        nome: 'Pedro Costa',
        email: 'pedro@alpha.test.com',
        perfil: 'GERENTE',
        senha: 'gerente123',
        telefone: '11977665544'
      }
    ]
  },
  {
    id: 2,
    nome: 'Beta Empreendimentos',
    subdominio: 'beta',
    email: 'contato@beta.test.com',
    cnpj: '98765432000102',
    plano: 'BASICO',
    maxUsuarios: 5,
    admin: {
      nome: 'Ana Oliveira',
      email: 'ana@beta.test.com',
      senha: 'admin123',
      telefone: '21999887766'
    },
    usuarios: [
      {
        nome: 'Carlos Ferreira',
        email: 'carlos@beta.test.com',
        perfil: 'CORRETOR',
        senha: 'corretor123',
        telefone: '21988776655'
      }
    ]
  },
  {
    id: 3,
    nome: 'Gamma Negócios Imobiliários',
    subdominio: 'gamma',
    email: 'contato@gamma.test.com',
    cnpj: '11122233000103',
    plano: 'ENTERPRISE',
    maxUsuarios: 100,
    admin: {
      nome: 'Roberto Lima',
      email: 'roberto@gamma.test.com',
      senha: 'admin123',
      telefone: '31999887766'
    },
    usuarios: [
      {
        nome: 'Fernanda Rocha',
        email: 'fernanda@gamma.test.com',
        perfil: 'GERENTE',
        senha: 'supervisor123',
        telefone: '31988776655'
      },
      {
        nome: 'Lucas Mendes',
        email: 'lucas@gamma.test.com',
        perfil: 'CORRETOR',
        senha: 'corretor123',
        telefone: '31977665544'
      }
    ]
  },
  {
    id: 4,
    nome: 'Delta Corretora',
    subdominio: 'delta',
    email: 'contato@delta.test.com',
    cnpj: '44455566000104',
    plano: 'BASICO',
    maxUsuarios: 3,
    admin: {
      nome: 'Sandra Alves',
      email: 'sandra@delta.test.com',
      senha: 'admin123',
      telefone: '41999887766'
    },
    usuarios: [
      {
        nome: 'Rafael Souza',
        email: 'rafael@delta.test.com',
        perfil: 'CORRETOR',
        senha: 'corretor123',
        telefone: '41988776655'
      }
    ]
  }
];

async function setupDatabase() {
  console.log('🔄 Configurando banco de dados principal...');
  
  try {
    // Executar migrations
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('✅ Banco de dados configurado!');
  } catch (error) {
    console.error('❌ Erro ao configurar banco:', error.message);
    process.exit(1);
  }
}

async function criarOrganizacoes() {
  console.log('🔄 Criando organizações de teste...');
  
  const prisma = new PrismaClient();
  
  try {
    for (const cliente of CLIENTES_TESTE) {
      console.log(`   Criando organização: ${cliente.nome}`);
      
      // Verificar se já existe
      const existeOrg = await prisma.organizacao.findUnique({
        where: { subdominio: cliente.subdominio }
      });
      
      if (existeOrg) {
        console.log(`   ⚠️  Organização ${cliente.subdominio} já existe, pulando...`);
        continue;
      }
      
      // Criar em transação
      await prisma.$transaction(async (tx) => {
        // Criar organização
        const organizacao = await tx.organizacao.create({
          data: {
            nome: cliente.nome,
            subdominio: cliente.subdominio,
            email: cliente.email,
            cnpj: cliente.cnpj,
            plano: cliente.plano,
            maxUsuarios: cliente.maxUsuarios,
            ativo: true,
            configuracoes: {
              whatsapp: {
                evolutionApi: {
                  url: process.env.EVOLUTION_API_URL || 'http://localhost:8080',
                  apiKey: `test_${cliente.subdominio}_key`,
                  instanceName: cliente.subdominio
                }
              },
              distribuicaoLeads: {
                automatica: true,
                considerarPlantao: true,
                considerarRegiao: true,
                timeoutResposta: 300
              }
            }
          }
        });
        
        // Hash da senha do admin
        const senhaHashAdmin = await bcrypt.hash(cliente.admin.senha, 10);
        
        // Criar usuário administrador
        const admin = await tx.user.create({
          data: {
            nome: cliente.admin.nome,
            email: cliente.admin.email,
            senha: senhaHashAdmin,
            telefone: cliente.admin.telefone,
            perfil: 'ADMIN',
            organizacaoId: organizacao.id,
            statusAtendimento: 'DISPONIVEL',
            ativo: true
          }
        });
        
        // Criar usuários adicionais
        for (const usuario of cliente.usuarios) {
          const senhaHash = await bcrypt.hash(usuario.senha, 10);
          
          await tx.user.create({
            data: {
              nome: usuario.nome,
              email: usuario.email,
              senha: senhaHash,
              telefone: usuario.telefone,
              perfil: usuario.perfil,
              organizacaoId: organizacao.id,
              statusAtendimento: 'DISPONIVEL',
              ativo: true
            }
          });
        }
        
        console.log(`   ✅ Organização ${cliente.nome} criada com sucesso!`);
      });
    }
  } catch (error) {
    console.error('❌ Erro ao criar organizações:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function criarDadosExemplo() {
  console.log('🔄 Criando dados de exemplo...');
  
  const prisma = new PrismaClient();
  
  try {
    // Para cada organização, criar alguns leads de exemplo
    const organizacoes = await prisma.organizacao.findMany({
      include: { usuarios: true }
    });
    
    for (const org of organizacoes) {
      console.log(`   Criando dados para: ${org.nome}`);
      
      // Criar algumas pessoas
      const pessoas = [];
      for (let i = 1; i <= 5; i++) {
        const pessoa = await prisma.pessoa.create({
          data: {
            nome: `Cliente Teste ${i} - ${org.subdominio}`,
            email: `cliente${i}@${org.subdominio}.test.com`,
            telefone: `119999${String(i).padStart(4, '0')}`,
            organizacaoId: org.id,
            tipo: 'CLIENTE',
            cpfCnpj: `123456789${String(i).padStart(2, '0')}`,
            endereco: {
              logradouro: `Rua Teste ${i}`,
              numero: `${i}00`,
              bairro: 'Centro',
              cidade: 'São Paulo',
              estado: 'SP',
              cep: `01000${String(i).padStart(3, '0')}`
            }
          }
        });
        pessoas.push(pessoa);
      }
      
      // Criar alguns leads
      for (let i = 0; i < pessoas.length; i++) {
        await prisma.lead.create({
          data: {
            pessoaId: pessoas[i].id,
            organizacaoId: org.id,
            origem: 'SITE',
            statusLeadCrm: i % 2 === 0 ? 'novo' : 'em_andamento',
            observacoes: `Lead de teste ${i + 1} para ${org.nome}`,
            telefone: pessoas[i].telefone
          }
        });
      }
      
      // Criar região de atendimento de exemplo
      if (org.usuarios.length > 0) {
        await prisma.regiaoAtendimento.create({
          data: {
            nome: `Região ${org.subdominio.toUpperCase()}`,
            ddds: ['11', '21', '31', '41'], // DDDs de exemplo
            estados: ['SP', 'RJ', 'MG', 'PR'],
            organizacaoId: org.id,
            distribuicaoTipo: 'ROUND_ROBIN',
            corretores: {
              connect: org.usuarios
                .filter(u => u.perfil === 'CORRETOR')
                .map(u => ({ id: u.id }))
            }
          }
        });
      }
    }
    
    console.log('✅ Dados de exemplo criados!');
  } catch (error) {
    console.error('❌ Erro ao criar dados de exemplo:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function verificarConfiguracao() {
  console.log('🔍 Verificando configuração...');
  
  const prisma = new PrismaClient();
  
  try {
    const stats = await prisma.organizacao.findMany({
      include: {
        _count: {
          select: {
            usuarios: true,
            leads: true,
            clientes: true
          }
        }
      }
    });
    
    console.log('\n📊 Resumo das organizações criadas:');
    console.log('================================================');
    
    for (const org of stats) {
      console.log(`🏢 ${org.nome} (${org.subdominio})`);
      console.log(`   📧 ${org.email}`);
      console.log(`   📋 Plano: ${org.plano}`);
      console.log(`   👥 Usuários: ${org._count.usuarios}/${org.maxUsuarios}`);
      console.log(`   📞 Leads: ${org._count.leads}`);
      console.log(`   👨‍💼 Clientes: ${org._count.clientes}`);
      console.log(`   ✅ Status: ${org.ativo ? 'Ativo' : 'Inativo'}`);
      console.log('');
    }
    
    console.log('📝 Credenciais de acesso:');
    console.log('================================================');
    
    for (const cliente of CLIENTES_TESTE) {
      console.log(`🏢 ${cliente.nome}:`);
      console.log(`   URL: http://localhost:3000/${cliente.subdominio}`);
      console.log(`   Admin: ${cliente.admin.email} / ${cliente.admin.senha}`);
      
      for (const usuario of cliente.usuarios) {
        console.log(`   ${usuario.perfil}: ${usuario.email} / ${usuario.senha}`);
      }
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar configuração:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  console.log('🚀 Iniciando configuração dos ambientes de teste...\n');
  
  try {
    await setupDatabase();
    await criarOrganizacoes();
    await criarDadosExemplo();
    await verificarConfiguracao();
    
    console.log('✅ Configuração concluída com sucesso!');
    console.log('\n💡 Para testar:');
    console.log('   1. npm run dev');
    console.log('   2. Acesse as URLs mostradas acima');
    console.log('   3. Faça login com as credenciais listadas');
    
  } catch (error) {
    console.error('❌ Erro durante a configuração:', error);
    process.exit(1);
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = {
  CLIENTES_TESTE,
  setupDatabase,
  criarOrganizacoes,
  criarDadosExemplo,
  verificarConfiguracao
};