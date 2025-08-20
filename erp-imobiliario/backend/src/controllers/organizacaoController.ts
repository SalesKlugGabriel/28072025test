import { Request, Response } from 'express';
import { prisma } from '../config/database';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Schemas de validação
const createOrganizacaoSchema = z.object({
  nome: z.string().min(2).max(100),
  cnpj: z.string().optional(),
  razaoSocial: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email().optional(),
  subdominio: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/),
  plano: z.enum(['BASICO', 'PROFESSIONAL', 'ENTERPRISE']).default('BASICO'),
  maxUsuarios: z.number().min(1).max(500).default(25),
  // Dados do usuário administrador
  adminNome: z.string().min(2),
  adminEmail: z.string().email(),
  adminSenha: z.string().min(8),
  adminTelefone: z.string().optional()
});

const updateOrganizacaoSchema = z.object({
  nome: z.string().min(2).max(100).optional(),
  cnpj: z.string().optional(),
  razaoSocial: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email().optional(),
  plano: z.enum(['BASICO', 'PROFESSIONAL', 'ENTERPRISE']).optional(),
  maxUsuarios: z.number().min(1).max(500).optional(),
  ativo: z.boolean().optional(),
  configuracoes: z.record(z.any()).optional()
});

// Criar nova organização (apenas super admin)
export const createOrganizacao = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = createOrganizacaoSchema.parse(req.body);

    // Verificar se subdomínio já existe
    const subdominioExiste = await prisma.organizacao.findUnique({
      where: { subdominio: data.subdominio }
    });

    if (subdominioExiste) {
      res.status(409).json({ 
        error: 'Subdomínio já em uso',
        message: 'Este subdomínio já está sendo usado por outra organização' 
      });
      return;
    }

    // Verificar se email do admin já existe
    const adminExiste = await prisma.user.findUnique({
      where: { email: data.adminEmail }
    });

    if (adminExiste) {
      res.status(409).json({ 
        error: 'Email já cadastrado',
        message: 'Este email já está sendo usado por outro usuário' 
      });
      return;
    }

    // Criar organização e usuário admin em uma transação
    const resultado = await prisma.$transaction(async (tx) => {
      // Criar organização
      const organizacao = await tx.organizacao.create({
        data: {
          nome: data.nome,
          cnpj: data.cnpj,
          razaoSocial: data.razaoSocial,
          telefone: data.telefone,
          email: data.email,
          subdominio: data.subdominio,
          plano: data.plano,
          maxUsuarios: data.maxUsuarios,
          configuracoes: {
            whatsapp: {
              evolutionApi: {
                url: '',
                apiKey: '',
                instanceName: data.subdominio
              }
            },
            distribuicaoLeads: {
              automatica: true,
              considerarPlantao: true,
              considerarRegiao: true,
              timeoutResposta: 300 // 5 minutos
            }
          }
        }
      });

      // Hash da senha do admin
      const senhaHash = await bcrypt.hash(data.adminSenha, 10);

      // Criar usuário administrador
      const admin = await tx.user.create({
        data: {
          nome: data.adminNome,
          email: data.adminEmail,
          senha: senhaHash,
          telefone: data.adminTelefone,
          perfil: 'ADMIN',
          organizacaoId: organizacao.id,
          statusAtendimento: 'DISPONIVEL'
        }
      });

      return { organizacao, admin };
    });

    res.status(201).json({
      message: 'Organização criada com sucesso',
      data: {
        organizacao: {
          id: resultado.organizacao.id,
          nome: resultado.organizacao.nome,
          subdominio: resultado.organizacao.subdominio,
          plano: resultado.organizacao.plano
        },
        admin: {
          id: resultado.admin.id,
          nome: resultado.admin.nome,
          email: resultado.admin.email,
          perfil: resultado.admin.perfil
        }
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        error: 'Dados inválidos',
        details: error.errors 
      });
      return;
    }

    console.error('Erro ao criar organização:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao criar organização' 
    });
  }
};

// Listar organizações (apenas super admin)
export const getOrganizacoes = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const where = search ? {
      OR: [
        { nome: { contains: search, mode: 'insensitive' as const } },
        { subdominio: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {};

    const [organizacoes, total] = await Promise.all([
      prisma.organizacao.findMany({
        where,
        include: {
          _count: {
            select: {
              usuarios: true,
              leads: true,
              clientes: true,
              empreendimentos: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.organizacao.count({ where })
    ]);

    res.json({
      data: organizacoes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao listar organizações:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao listar organizações' 
    });
  }
};

// Obter organização por ID
export const getOrganizacaoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const organizacao = await prisma.organizacao.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            usuarios: true,
            leads: true,
            clientes: true,
            empreendimentos: true
          }
        },
        usuarios: {
          select: {
            id: true,
            nome: true,
            email: true,
            perfil: true,
            ativo: true,
            createdAt: true,
            lastLogin: true,
            statusAtendimento: true
          }
        }
      }
    });

    if (!organizacao) {
      res.status(404).json({ 
        error: 'Organização não encontrada',
        message: 'A organização especificada não foi encontrada' 
      });
      return;
    }

    res.json({ data: organizacao });
  } catch (error) {
    console.error('Erro ao buscar organização:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao buscar organização' 
    });
  }
};

// Atualizar organização
export const updateOrganizacao = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = updateOrganizacaoSchema.parse(req.body);

    const organizacao = await prisma.organizacao.findUnique({
      where: { id }
    });

    if (!organizacao) {
      res.status(404).json({ 
        error: 'Organização não encontrada',
        message: 'A organização especificada não foi encontrada' 
      });
      return;
    }

    const organizacaoAtualizada = await prisma.organizacao.update({
      where: { id },
      data,
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

    res.json({
      message: 'Organização atualizada com sucesso',
      data: organizacaoAtualizada
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        error: 'Dados inválidos',
        details: error.errors 
      });
      return;
    }

    console.error('Erro ao atualizar organização:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao atualizar organização' 
    });
  }
};

// Desativar organização
export const deactivateOrganizacao = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const organizacao = await prisma.organizacao.findUnique({
      where: { id }
    });

    if (!organizacao) {
      res.status(404).json({ 
        error: 'Organização não encontrada',
        message: 'A organização especificada não foi encontrada' 
      });
      return;
    }

    // Desativar organização e todos os usuários
    await prisma.$transaction(async (tx) => {
      await tx.organizacao.update({
        where: { id },
        data: { ativo: false }
      });

      await tx.user.updateMany({
        where: { organizacaoId: id },
        data: { ativo: false }
      });
    });

    res.json({
      message: 'Organização desativada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao desativar organização:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao desativar organização' 
    });
  }
};

// Obter estatísticas da organização
export const getEstatisticasOrganizacao = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const organizacao = await prisma.organizacao.findUnique({
      where: { id }
    });

    if (!organizacao) {
      res.status(404).json({ 
        error: 'Organização não encontrada',
        message: 'A organização especificada não foi encontrada' 
      });
      return;
    }

    // Buscar estatísticas em paralelo
    const [
      totalUsuarios,
      usuariosAtivos,
      totalLeads,
      leadsConvertidos,
      totalClientes,
      totalEmpreendimentos
    ] = await Promise.all([
      prisma.user.count({ where: { organizacaoId: id } }),
      prisma.user.count({ where: { organizacaoId: id, ativo: true } }),
      prisma.lead.count({ where: { organizacaoId: id } }),
      prisma.lead.count({ where: { organizacaoId: id, statusLeadCrm: 'convertido' } }),
      prisma.cliente.count({ where: { organizacaoId: id } }),
      prisma.empreendimento.count({ where: { organizacaoId: id } })
    ]);

    const estatisticas = {
      usuarios: {
        total: totalUsuarios,
        ativos: usuariosAtivos,
        inativos: totalUsuarios - usuariosAtivos,
        limite: organizacao.maxUsuarios,
        percentualUso: Math.round((totalUsuarios / organizacao.maxUsuarios) * 100)
      },
      leads: {
        total: totalLeads,
        convertidos: leadsConvertidos,
        taxaConversao: totalLeads > 0 ? Math.round((leadsConvertidos / totalLeads) * 100) : 0
      },
      clientes: {
        total: totalClientes
      },
      empreendimentos: {
        total: totalEmpreendimentos
      }
    };

    res.json({ data: estatisticas });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao buscar estatísticas da organização' 
    });
  }
};