#!/usr/bin/env node

/**
 * Script para configurar ambiente de produção da Legacy.87
 * 
 * Usuários:
 * - Gabriel (Admin): gabriel@legacy87.com.br / Luegabi0609!
 * - Alysson (Gerente): Alysson@legacy87.com.br / Leg@cy87!
 * - Vinicius (Corretor): vinicius@legacy87.com.br / V3ndas@#
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function setupLegacy87() {
  console.log('🏢 Configurando Legacy.87 - Ambiente de Produção');
  console.log('================================================');

  const prisma = new PrismaClient();

  try {
    // Verificar se a organização já existe
    const existingOrg = await prisma.organizacao.findUnique({
      where: { subdominio: 'legacy87' }
    });

    if (existingOrg) {
      console.log('⚠️  Organização Legacy.87 já existe. Atualizando usuários...');
    }

    await prisma.$transaction(async (tx) => {
      let organizacao;

      if (!existingOrg) {
        // Criar organização Legacy.87
        organizacao = await tx.organizacao.create({
          data: {
            nome: 'Legacy.87',
            subdominio: 'legacy87',
            email: 'contato@legacy87.com.br',
            cnpj: '47999581000145', // CNPJ real da Legacy.87
            razaoSocial: 'Legacy.87 Negócios Imobiliários Ltda',
            telefone: '(11) 99999-8787',
            plano: 'PROFESSIONAL',
            maxUsuarios: 50,
            ativo: true,
            configuracoes: {
              whatsapp: {
                evolutionApi: {
                  url: process.env.EVOLUTION_API_URL || 'http://localhost:8080',
                  apiKey: 'legacy87_production_key',
                  instanceName: 'legacy87'
                }
              },
              distribuicaoLeads: {
                automatica: true,
                considerarPlantao: true,
                considerarRegiao: true,
                timeoutResposta: 300
              },
              sistema: {
                nome: 'Legacy.87',
                versao: '3.0.0',
                ambiente: 'producao'
              }
            }
          }
        });
        console.log('✅ Organização Legacy.87 criada com sucesso!');
      } else {
        organizacao = existingOrg;
      }

      // Criar usuários
      const usuarios = [
        {
          nome: 'Gabriel Silva',
          email: 'gabriel@legacy87.com.br',
          senha: 'Luegabi0609!',
          telefone: '(11) 99999-0001',
          perfil: 'ADMIN'
        },
        {
          nome: 'Alysson Carvalho',
          email: 'Alysson@legacy87.com.br',
          senha: 'Leg@cy87!',
          telefone: '(11) 99999-0002',
          perfil: 'GERENTE'
        },
        {
          nome: 'Vinicius Santos',
          email: 'vinicius@legacy87.com.br',
          senha: 'V3ndas@#',
          telefone: '(11) 99999-0003',
          perfil: 'CORRETOR'
        }
      ];

      for (const userData of usuarios) {
        // Verificar se usuário já existe
        const existingUser = await tx.user.findUnique({
          where: { email: userData.email }
        });

        if (existingUser) {
          console.log(`⚠️  Usuário ${userData.email} já existe, atualizando...`);
          
          // Atualizar senha
          const senhaHash = await bcrypt.hash(userData.senha, 10);
          await tx.user.update({
            where: { id: existingUser.id },
            data: {
              senha: senhaHash,
              nome: userData.nome,
              telefone: userData.telefone,
              perfil: userData.perfil,
              ativo: true
            }
          });
          console.log(`✅ ${userData.nome} (${userData.perfil}) - atualizado`);
        } else {
          // Criar novo usuário
          const senhaHash = await bcrypt.hash(userData.senha, 10);
          
          await tx.user.create({
            data: {
              nome: userData.nome,
              email: userData.email,
              senha: senhaHash,
              telefone: userData.telefone,
              perfil: userData.perfil,
              organizacaoId: organizacao.id,
              statusAtendimento: 'DISPONIVEL',
              ativo: true
            }
          });
          console.log(`✅ ${userData.nome} (${userData.perfil}) - criado`);
        }
      }

      // Criar região de atendimento padrão
      const existingRegion = await tx.regiaoAtendimento.findFirst({
        where: { organizacaoId: organizacao.id }
      });

      if (!existingRegion) {
        // Buscar corretores da organização
        const corretores = await tx.user.findMany({
          where: {
            organizacaoId: organizacao.id,
            perfil: { in: ['CORRETOR', 'GERENTE'] },
            ativo: true
          }
        });

        if (corretores.length > 0) {
          await tx.regiaoAtendimento.create({
            data: {
              nome: 'Grande São Paulo',
              ddds: ['11', '12', '13', '14', '15', '16', '17', '18', '19'],
              estados: ['SP'],
              cidades: ['São Paulo', 'Guarulhos', 'Campinas', 'São Bernardo do Campo', 'Osasco'],
              organizacaoId: organizacao.id,
              distribuicaoTipo: 'ROUND_ROBIN',
              corretores: {
                connect: corretores.map(c => ({ id: c.id }))
              }
            }
          });
          console.log('✅ Região de atendimento criada!');
        }
      }
    });

    console.log('');
    console.log('🎉 Legacy.87 configurada com sucesso!');
    console.log('=====================================');
    console.log('');
    console.log('👥 Credenciais de acesso:');
    console.log('-------------------------');
    console.log('🔑 Gabriel Silva (Administrador)');
    console.log('   📧 gabriel@legacy87.com.br');
    console.log('   🔒 Luegabi0609!');
    console.log('');
    console.log('🔑 Alysson Carvalho (Gerente)');
    console.log('   📧 Alysson@legacy87.com.br');  
    console.log('   🔒 Leg@cy87!');
    console.log('');
    console.log('🔑 Vinicius Santos (Corretor)');
    console.log('   📧 vinicius@legacy87.com.br');
    console.log('   🔒 V3ndas@#');
    console.log('');
    console.log('🌐 Acesse: http://localhost:5173');
    console.log('🏢 Organização: Legacy.87');
    console.log('📋 Plano: Professional (50 usuários)');

  } catch (error) {
    console.error('❌ Erro ao configurar Legacy.87:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  setupLegacy87();
}

module.exports = setupLegacy87;