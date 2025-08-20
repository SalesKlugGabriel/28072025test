import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth';

// Schemas de validação
const periodoSchema = z.object({
  dataInicio: z.string().datetime(),
  dataFim: z.string().datetime()
}).refine(data => new Date(data.dataInicio) <= new Date(data.dataFim), {
  message: 'Data de início deve ser anterior à data de fim'
});

const relatorioVendasSchema = z.object({
  dataInicio: z.string().datetime(),
  dataFim: z.string().datetime(),
  empreendimentoId: z.string().uuid().optional(),
  tipo: z.enum(['RESUMO', 'DETALHADO']).default('RESUMO')
}).refine(data => new Date(data.dataInicio) <= new Date(data.dataFim), {
  message: 'Data de início deve ser anterior à data de fim'
});

const relatorioLeadsSchema = z.object({
  dataInicio: z.string().datetime(),
  dataFim: z.string().datetime(),
  origem: z.enum(['SITE', 'WHATSAPP', 'TELEFONE', 'INDICACAO', 'REDES_SOCIAIS', 'OUTROS']).optional(),
  status: z.enum(['NOVO', 'CONTATO_REALIZADO', 'AGUARDANDO_RESPOSTA', 'INTERESSADO', 'NAO_INTERESSADO']).optional()
}).refine(data => new Date(data.dataInicio) <= new Date(data.dataFim), {
  message: 'Data de início deve ser anterior à data de fim'
});

const dashboardSchema = z.object({
  periodo: z.enum(['7d', '30d', '90d', '1y']).default('30d')
});

// ===== DASHBOARD =====

// Dashboard principal com métricas
export const getDashboard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { periodo } = dashboardSchema.parse(req.query);
  const userId = req.user!.id;

  // Calcular data de início baseado no período
  const dataFim = new Date();
  const dataInicio = new Date();
  
  switch (periodo) {
    case '7d':
      dataInicio.setDate(dataFim.getDate() - 7);
      break;
    case '30d':
      dataInicio.setDate(dataFim.getDate() - 30);
      break;
    case '90d':
      dataInicio.setDate(dataFim.getDate() - 90);
      break;
    case '1y':
      dataInicio.setFullYear(dataFim.getFullYear() - 1);
      break;
  }

  const [
    // Métricas de leads
    totalLeads,
    leadsNovos,
    leadsConvertidos,
    
    // Métricas de vendas
    totalVendas,
    valorTotalVendas,
    ticketMedio,
    
    // Métricas de empreendimentos
    totalEmpreendimentos,
    unidadesDisponiveis,
    
    // Gráficos
    leadsTimeline,
    vendasTimeline,
    leadsOrigem,
    vendasEmpreendimento
  ] = await Promise.all([
    // Total de leads
    prisma.lead.count({
      where: {
        userId,
        createdAt: { gte: dataInicio, lte: dataFim }
      }
    }),
    
    // Leads novos
    prisma.lead.count({
      where: {
        userId,
        status: 'NOVO',
        createdAt: { gte: dataInicio, lte: dataFim }
      }
    }),
    
    // Leads convertidos
    prisma.lead.count({
      where: {
        userId,
        dataConversao: { gte: dataInicio, lte: dataFim }
      }
    }),
    
    // Total de vendas
    prisma.unidadeAdquirida.count({
      where: {
        userId,
        dataCompra: { gte: dataInicio, lte: dataFim },
        deletedAt: null
      }
    }),
    
    // Valor total das vendas
    prisma.unidadeAdquirida.aggregate({
      where: {
        userId,
        dataCompra: { gte: dataInicio, lte: dataFim },
        deletedAt: null
      },
      _sum: { valorCompra: true }
    }),
    
    // Ticket médio
    prisma.unidadeAdquirida.aggregate({
      where: {
        userId,
        dataCompra: { gte: dataInicio, lte: dataFim },
        deletedAt: null
      },
      _avg: { valorCompra: true }
    }),
    
    // Total empreendimentos
    prisma.empreendimento.count({
      where: { userId, deletedAt: null }
    }),
    
    // Unidades disponíveis
    prisma.unidade.count({
      where: {
        userId,
        status: 'DISPONIVEL',
        deletedAt: null
      }
    }),
    
    // Timeline de leads (por dia)
    prisma.$queryRaw`
      SELECT 
        DATE(created_at) as data,
        COUNT(*) as total
      FROM leads 
      WHERE user_id = ${userId}
        AND created_at >= ${dataInicio}
        AND created_at <= ${dataFim}
      GROUP BY DATE(created_at)
      ORDER BY data
    `,
    
    // Timeline de vendas (por dia)
    prisma.$queryRaw`
      SELECT 
        DATE(data_compra) as data,
        COUNT(*) as total,
        SUM(valor_compra) as valor
      FROM unidades_adquiridas 
      WHERE user_id = ${userId}
        AND data_compra >= ${dataInicio}
        AND data_compra <= ${dataFim}
        AND deleted_at IS NULL
      GROUP BY DATE(data_compra)
      ORDER BY data
    `,
    
    // Leads por origem
    prisma.lead.groupBy({
      by: ['origem'],
      where: {
        userId,
        createdAt: { gte: dataInicio, lte: dataFim }
      },
      _count: { origem: true }
    }),
    
    // Vendas por empreendimento
    prisma.$queryRaw`
      SELECT 
        e.nome,
        COUNT(ua.*) as total_vendas,
        SUM(ua.valor_compra) as valor_total
      FROM empreendimentos e
      LEFT JOIN unidades u ON u.empreendimento_id = e.id
      LEFT JOIN unidades_adquiridas ua ON ua.unidade_id = u.id
        AND ua.data_compra >= ${dataInicio}
        AND ua.data_compra <= ${dataFim}
        AND ua.deleted_at IS NULL
      WHERE e.user_id = ${userId}
        AND e.deleted_at IS NULL
      GROUP BY e.id, e.nome
      HAVING COUNT(ua.*) > 0
      ORDER BY total_vendas DESC
      LIMIT 10
    `
  ]);

  const dashboard = {
    periodo,
    dataInicio,
    dataFim,
    metricas: {
      leads: {
        total: totalLeads,
        novos: leadsNovos,
        convertidos: leadsConvertidos,
        taxaConversao: totalLeads > 0 ? (leadsConvertidos / totalLeads) * 100 : 0
      },
      vendas: {
        total: totalVendas,
        valorTotal: valorTotalVendas._sum.valorCompra || 0,
        ticketMedio: ticketMedio._avg.valorCompra || 0
      },
      empreendimentos: {
        total: totalEmpreendimentos,
        unidadesDisponiveis
      }
    },
    graficos: {
      leadsTimeline,
      vendasTimeline,
      leadsOrigem: leadsOrigem.map(item => ({
        origem: item.origem,
        total: item._count.origem
      })),
      vendasEmpreendimento
    }
  };

  res.json({ dashboard });
};

// ===== RELATÓRIOS DE VENDAS =====

// Relatório de vendas
export const getRelatorioVendas = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { dataInicio, dataFim, empreendimentoId, tipo } = relatorioVendasSchema.parse(req.query);
  const userId = req.user!.id;

  const where: any = {
    userId,
    dataCompra: {
      gte: new Date(dataInicio),
      lte: new Date(dataFim)
    },
    deletedAt: null,
    ...(empreendimentoId && {
      unidade: {
        empreendimentoId
      }
    })
  };

  if (tipo === 'RESUMO') {
    // Relatório resumido
    const [vendas, resumo] = await Promise.all([
      prisma.unidadeAdquirida.findMany({
        where,
        include: {
          unidade: {
            include: {
              empreendimento: {
                select: { id: true, nome: true, tipo: true }
              }
            }
          },
          cliente: {
            include: {
              pessoa: {
                select: { id: true, nome: true, email: true, telefone: true }
              }
            }
          }
        },
        orderBy: { dataCompra: 'desc' }
      }),
      
      prisma.unidadeAdquirida.aggregate({
        where,
        _count: { id: true },
        _sum: { valorCompra: true },
        _avg: { valorCompra: true }
      })
    ]);

    res.json({
      tipo: 'RESUMO',
      periodo: { dataInicio, dataFim },
      resumo: {
        totalVendas: resumo._count.id,
        valorTotal: resumo._sum.valorCompra || 0,
        ticketMedio: resumo._avg.valorCompra || 0
      },
      vendas
    });
  } else {
    // Relatório detalhado com estatísticas adicionais
    const [vendas, estatisticas, vendasPorMes, topClientes] = await Promise.all([
      prisma.unidadeAdquirida.findMany({
        where,
        include: {
          unidade: {
            include: {
              empreendimento: {
                select: { id: true, nome: true, tipo: true, cidade: true }
              }
            }
          },
          cliente: {
            include: {
              pessoa: {
                select: { id: true, nome: true, email: true, telefone: true, cidade: true }
              }
            }
          }
        },
        orderBy: { dataCompra: 'desc' }
      }),
      
      // Estatísticas gerais
      prisma.unidadeAdquirida.aggregate({
        where,
        _count: { id: true },
        _sum: { valorCompra: true },
        _avg: { valorCompra: true },
        _min: { valorCompra: true },
        _max: { valorCompra: true }
      }),
      
      // Vendas por mês
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', data_compra) as mes,
          COUNT(*) as total_vendas,
          SUM(valor_compra) as valor_total
        FROM unidades_adquiridas 
        WHERE user_id = ${userId}
          AND data_compra >= ${new Date(dataInicio)}
          AND data_compra <= ${new Date(dataFim)}
          AND deleted_at IS NULL
          ${empreendimentoId ? `AND unidade_id IN (
            SELECT id FROM unidades WHERE empreendimento_id = ${empreendimentoId}
          )` : ''}
        GROUP BY DATE_TRUNC('month', data_compra)
        ORDER BY mes
      `,
      
      // Top clientes por valor
      prisma.$queryRaw`
        SELECT 
          p.nome,
          COUNT(ua.*) as total_compras,
          SUM(ua.valor_compra) as valor_total
        FROM pessoas p
        JOIN clientes c ON c.pessoa_id = p.id
        JOIN unidades_adquiridas ua ON ua.cliente_id = c.pessoa_id
        WHERE ua.user_id = ${userId}
          AND ua.data_compra >= ${new Date(dataInicio)}
          AND ua.data_compra <= ${new Date(dataFim)}
          AND ua.deleted_at IS NULL
        GROUP BY p.id, p.nome
        ORDER BY valor_total DESC
        LIMIT 10
      `
    ]);

    res.json({
      tipo: 'DETALHADO',
      periodo: { dataInicio, dataFim },
      estatisticas: {
        totalVendas: estatisticas._count.id,
        valorTotal: estatisticas._sum.valorCompra || 0,
        ticketMedio: estatisticas._avg.valorCompra || 0,
        menorVenda: estatisticas._min.valorCompra || 0,
        maiorVenda: estatisticas._max.valorCompra || 0
      },
      vendas,
      graficos: {
        vendasPorMes,
        topClientes
      }
    });
  }
};

// ===== RELATÓRIOS DE LEADS =====

// Relatório de leads
export const getRelatorioLeads = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { dataInicio, dataFim, origem, status } = relatorioLeadsSchema.parse(req.query);
  const userId = req.user!.id;

  const where: any = {
    userId,
    createdAt: {
      gte: new Date(dataInicio),
      lte: new Date(dataFim)
    },
    ...(origem && { origem }),
    ...(status && { status })
  };

  const [leads, estatisticas, leadsPorOrigem, leadsPorStatus, funil] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: {
        pessoa: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            cidade: true,
            estado: true
          }
        },
        movimentacoes: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            estagioAtual: {
              select: { nome: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    
    // Estatísticas gerais
    prisma.lead.aggregate({
      where,
      _count: { id: true }
    }),
    
    // Leads por origem
    prisma.lead.groupBy({
      by: ['origem'],
      where,
      _count: { origem: true }
    }),
    
    // Leads por status
    prisma.lead.groupBy({
      by: ['status'],
      where,
      _count: { status: true }
    }),
    
    // Funil de conversão
    Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.count({ where: { ...where, status: 'CONTATO_REALIZADO' } }),
      prisma.lead.count({ where: { ...where, status: 'INTERESSADO' } }),
      prisma.lead.count({ where: { ...where, dataConversao: { not: null } } })
    ])
  ]);

  const [totalLeads, contatoRealizado, interessados, convertidos] = funil;

  res.json({
    periodo: { dataInicio, dataFim },
    estatisticas: {
      totalLeads: estatisticas._count.id,
      convertidos,
      taxaConversao: totalLeads > 0 ? (convertidos / totalLeads) * 100 : 0
    },
    leads,
    graficos: {
      leadsPorOrigem: leadsPorOrigem.map(item => ({
        origem: item.origem,
        total: item._count.origem
      })),
      leadsPorStatus: leadsPorStatus.map(item => ({
        status: item.status,
        total: item._count.status
      })),
      funil: {
        totalLeads,
        contatoRealizado,
        interessados,
        convertidos,
        taxas: {
          contato: totalLeads > 0 ? (contatoRealizado / totalLeads) * 100 : 0,
          interesse: contatoRealizado > 0 ? (interessados / contatoRealizado) * 100 : 0,
          conversao: interessados > 0 ? (convertidos / interessados) * 100 : 0
        }
      }
    }
  });
};

// ===== RELATÓRIOS DE EMPREENDIMENTOS =====

// Relatório de performance de empreendimentos
export const getRelatorioEmpreendimentos = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { dataInicio, dataFim } = periodoSchema.parse(req.query);
  const userId = req.user!.id;

  const empreendimentos = await prisma.empreendimento.findMany({
    where: {
      userId,
      deletedAt: null
    },
    include: {
      _count: {
        select: { unidades: true }
      }
    }
  });

  const relatorio = await Promise.all(
    empreendimentos.map(async (emp) => {
      const [vendas, valorVendas, unidadesVendidas, ticketMedio] = await Promise.all([
        prisma.unidadeAdquirida.count({
          where: {
            unidade: { empreendimentoId: emp.id },
            dataCompra: {
              gte: new Date(dataInicio),
              lte: new Date(dataFim)
            },
            deletedAt: null
          }
        }),
        
        prisma.unidadeAdquirida.aggregate({
          where: {
            unidade: { empreendimentoId: emp.id },
            dataCompra: {
              gte: new Date(dataInicio),
              lte: new Date(dataFim)
            },
            deletedAt: null
          },
          _sum: { valorCompra: true }
        }),
        
        prisma.unidade.count({
          where: {
            empreendimentoId: emp.id,
            status: 'VENDIDA',
            deletedAt: null
          }
        }),
        
        prisma.unidadeAdquirida.aggregate({
          where: {
            unidade: { empreendimentoId: emp.id },
            deletedAt: null
          },
          _avg: { valorCompra: true }
        })
      ]);

      return {
        empreendimento: emp,
        metricas: {
          totalUnidades: emp._count.unidades,
          unidadesVendidas,
          unidadesDisponiveis: emp._count.unidades - unidadesVendidas,
          percentualVendas: emp._count.unidades > 0 ? (unidadesVendidas / emp._count.unidades) * 100 : 0,
          vendasPeriodo: vendas,
          valorVendasPeriodo: valorVendas._sum.valorCompra || 0,
          ticketMedio: ticketMedio._avg.valorCompra || 0
        }
      };
    })
  );

  res.json({
    periodo: { dataInicio, dataFim },
    relatorio: relatorio.sort((a, b) => b.metricas.valorVendasPeriodo - a.metricas.valorVendasPeriodo)
  });
};

// ===== EXPORT TEMPLATES =====

// Listar templates de relatórios disponíveis
export const getTemplatesRelatorios = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const templates = [
    {
      id: 'vendas-resumo',
      nome: 'Relatório de Vendas - Resumo',
      descricao: 'Resumo das vendas em um período',
      categoria: 'VENDAS',
      formato: ['PDF', 'EXCEL']
    },
    {
      id: 'vendas-detalhado',
      nome: 'Relatório de Vendas - Detalhado',
      descricao: 'Relatório completo com gráficos e estatísticas',
      categoria: 'VENDAS',
      formato: ['PDF', 'EXCEL']
    },
    {
      id: 'leads-funil',
      nome: 'Relatório de Leads - Funil',
      descricao: 'Análise do funil de conversão de leads',
      categoria: 'LEADS',
      formato: ['PDF', 'EXCEL']
    },
    {
      id: 'empreendimentos-performance',
      nome: 'Performance de Empreendimentos',
      descricao: 'Análise de performance por empreendimento',
      categoria: 'EMPREENDIMENTOS',
      formato: ['PDF', 'EXCEL']
    },
    {
      id: 'dashboard-executivo',
      nome: 'Dashboard Executivo',
      descricao: 'Resumo executivo com principais métricas',
      categoria: 'DASHBOARD',
      formato: ['PDF']
    }
  ];

  res.json({ templates });
};

// Gerar relatório em formato específico
export const gerarRelatorio = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { templateId, formato, parametros } = req.body;

  // Validar template
  const templatesValidos = ['vendas-resumo', 'vendas-detalhado', 'leads-funil', 'empreendimentos-performance', 'dashboard-executivo'];
  if (!templatesValidos.includes(templateId)) {
    res.status(400).json({ error: 'Template inválido' });
      return;
  }

  // Validar formato
  const formatosValidos = ['PDF', 'EXCEL'];
  if (!formatosValidos.includes(formato)) {
    res.status(400).json({ error: 'Formato inválido' });
      return;
  }

  try {
    // Por enquanto, retornar mock de geração
    // Em produção, implementar geração real com bibliotecas como PDFKit ou ExcelJS
    
    const relatorio = {
      id: `rel_${Date.now()}`,
      template: templateId,
      formato,
      status: 'PROCESSANDO',
      criadoEm: new Date(),
      downloadUrl: null,
      parametros
    };

    // Simular processamento
    setTimeout(() => {
      relatorio.status = 'CONCLUIDO';
      relatorio.downloadUrl = `/api/relatorios/download/${relatorio.id}`;
    }, 2000);

    res.status(202).json({ relatorio });
      return;
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({ error: 'Erro interno ao gerar relatório' });
      return;
  }
};