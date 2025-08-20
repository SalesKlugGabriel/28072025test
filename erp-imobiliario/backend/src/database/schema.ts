import { pgTable, text, timestamp, boolean, integer, decimal, jsonb, uuid, varchar, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ===== USUÁRIOS E AUTENTICAÇÃO =====
export const usuarios = pgTable('usuarios', {
  id: uuid('id').primaryKey().defaultRandom(),
  nome: varchar('nome', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  senha: varchar('senha', { length: 255 }).notNull(),
  perfil: varchar('perfil', { length: 50 }).notNull().$type<'corretor' | 'gerente' | 'administrador'>(),
  avatar: text('avatar'),
  telefone: varchar('telefone', { length: 20 }),
  departamento: varchar('departamento', { length: 100 }).notNull(),
  dataAdmissao: timestamp('data_admissao').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('ativo').$type<'ativo' | 'inativo'>(),
  configuracoes: jsonb('configuracoes').notNull().default({
    notificacoes: true,
    tema: 'claro',
    idioma: 'pt-BR'
  }),
  corretor: jsonb('corretor'),
  gerente: jsonb('gerente'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('usuarios_email_idx').on(table.email),
  perfilIdx: index('usuarios_perfil_idx').on(table.perfil),
}));

// ===== LEADS =====
export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().defaultRandom(),
  nome: varchar('nome', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  telefone: varchar('telefone', { length: 20 }).notNull(),
  whatsapp: varchar('whatsapp', { length: 20 }),
  origem: varchar('origem', { length: 100 }).notNull(),
  pipeline: varchar('pipeline', { length: 100 }).notNull().default('vendas'),
  etapa: varchar('etapa', { length: 100 }).notNull().default('novos_leads'),
  responsavelCRM: uuid('responsavel_crm').notNull().references(() => usuarios.id),
  responsavel: varchar('responsavel', { length: 255 }).notNull(),
  
  // Investimento pretendido
  investimentoPretendido: jsonb('investimento_pretendido').notNull().default({
    valorMinimo: 0,
    valorMaximo: 0
  }),
  
  // Perfil do imóvel
  perfilImovel: jsonb('perfil_imovel').default({}),
  
  // Metadados
  status: varchar('status', { length: 20 }).notNull().default('ativo').$type<'ativo' | 'convertido' | 'perdido' | 'inativo'>(),
  tags: jsonb('tags').default([]),
  observacoes: text('observacoes'),
  ultimaInteracao: timestamp('ultima_interacao'),
  pontuacao: integer('pontuacao').default(0),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  responsavelIdx: index('leads_responsavel_idx').on(table.responsavelCRM),
  pipelineIdx: index('leads_pipeline_idx').on(table.pipeline),
  etapaIdx: index('leads_etapa_idx').on(table.etapa),
  statusIdx: index('leads_status_idx').on(table.status),
  emailIdx: index('leads_email_idx').on(table.email),
  telefoneIdx: index('leads_telefone_idx').on(table.telefone),
}));

// ===== CLIENTES =====
export const clientes = pgTable('clientes', {
  id: uuid('id').primaryKey().defaultRandom(),
  nome: varchar('nome', { length: 255 }).notNull(),
  cpfCnpj: varchar('cpf_cnpj', { length: 20 }).notNull().unique(),
  telefone: varchar('telefone', { length: 20 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  endereco: jsonb('endereco').notNull(),
  tags: jsonb('tags').default([]),
  observacoes: text('observacoes'),
  responsavel: uuid('responsavel').notNull().references(() => usuarios.id),
  status: varchar('status', { length: 20 }).notNull().default('ativo').$type<'ativo' | 'inativo' | 'suspenso'>(),
  
  // Específicos do cliente
  valorTotalInvestido: decimal('valor_total_investido', { precision: 15, scale: 2 }).default('0'),
  valorPatrimonioAtual: decimal('valor_patrimonio_atual', { precision: 15, scale: 2 }).default('0'),
  dataUltimaCompra: timestamp('data_ultima_compra'),
  origemContato: varchar('origem_contato', { length: 100 }).notNull(),
  classificacao: varchar('classificacao', { length: 20 }).notNull().default('bronze').$type<'bronze' | 'prata' | 'ouro' | 'diamante'>(),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  responsavelIdx: index('clientes_responsavel_idx').on(table.responsavel),
  cpfCnpjIdx: index('clientes_cpf_cnpj_idx').on(table.cpfCnpj),
  emailIdx: index('clientes_email_idx').on(table.email),
  classificacaoIdx: index('clientes_classificacao_idx').on(table.classificacao),
}));

// ===== EMPREENDIMENTOS =====
export const empreendimentos = pgTable('empreendimentos', {
  id: uuid('id').primaryKey().defaultRandom(),
  nome: varchar('nome', { length: 255 }).notNull(),
  descricao: text('descricao'),
  endereco: jsonb('endereco').notNull(),
  incorporadora: varchar('incorporadora', { length: 255 }).notNull(),
  construtora: varchar('construtora', { length: 255 }).notNull(),
  dataLancamento: timestamp('data_lancamento').notNull(),
  dataEntrega: timestamp('data_entrega'),
  status: varchar('status', { length: 50 }).notNull().default('lancamento').$type<'lancamento' | 'construcao' | 'pronto' | 'entregue'>(),
  
  // Condições de pagamento
  condicoesPagamento: text('condicoes_pagamento'),
  tabelaPrecos: jsonb('tabela_precos'),
  
  // Características
  totalUnidades: integer('total_unidades').notNull().default(0),
  unidadesDisponiveis: integer('unidades_disponiveis').notNull().default(0),
  unidadesVendidas: integer('unidades_vendidas').notNull().default(0),
  unidadesReservadas: integer('unidades_reservadas').notNull().default(0),
  
  // Valores
  valorMinimo: decimal('valor_minimo', { precision: 15, scale: 2 }).notNull(),
  valorMaximo: decimal('valor_maximo', { precision: 15, scale: 2 }).notNull(),
  valorM2: decimal('valor_m2', { precision: 10, scale: 2 }).notNull(),
  
  // Metadados
  responsavel: uuid('responsavel').notNull().references(() => usuarios.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  responsavelIdx: index('empreendimentos_responsavel_idx').on(table.responsavel),
  statusIdx: index('empreendimentos_status_idx').on(table.status),
  nomeIdx: index('empreendimentos_nome_idx').on(table.nome),
}));

// ===== UNIDADES =====
export const unidades = pgTable('unidades', {
  id: uuid('id').primaryKey().defaultRandom(),
  empreendimentoId: uuid('empreendimento_id').notNull().references(() => empreendimentos.id, { onDelete: 'cascade' }),
  codigo: varchar('codigo', { length: 50 }).notNull(),
  tipo: varchar('tipo', { length: 50 }).notNull().$type<'apartamento' | 'casa' | 'sala' | 'loja'>(),
  dormitorios: integer('dormitorios').notNull().default(0),
  suites: integer('suites').notNull().default(0),
  vagas: integer('vagas').notNull().default(0),
  area: decimal('area', { precision: 8, scale: 2 }).notNull(),
  andar: integer('andar'),
  bloco: varchar('bloco', { length: 10 }),
  posicao: varchar('posicao', { length: 50 }).notNull(),
  valor: decimal('valor', { precision: 15, scale: 2 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('disponivel').$type<'disponivel' | 'reservado' | 'vendido' | 'bloqueado'>(),
  isTerceiro: boolean('is_terceiro').notNull().default(false),
  
  // Se for de terceiro
  proprietarioTerceiro: jsonb('proprietario_terceiro'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  empreendimentoIdx: index('unidades_empreendimento_idx').on(table.empreendimentoId),
  statusIdx: index('unidades_status_idx').on(table.status),
  terceiroIdx: index('unidades_terceiro_idx').on(table.isTerceiro),
  codigoIdx: index('unidades_codigo_idx').on(table.codigo),
}));

// ===== PROSPECÇÕES =====
export const prospeccoes = pgTable('prospeccoes', {
  id: uuid('id').primaryKey().defaultRandom(),
  plataforma: varchar('plataforma', { length: 50 }).notNull().$type<'olx' | 'webmotors' | 'mercadolivre' | 'whatsapp' | 'facebook' | 'instagram' | 'linkedin' | 'outros'>(),
  quantidade: integer('quantidade').notNull(),
  data: timestamp('data').notNull(),
  usuario: varchar('usuario', { length: 255 }).notNull(),
  usuarioId: uuid('usuario_id').notNull().references(() => usuarios.id),
  status: varchar('status', { length: 20 }).notNull().default('ativa').$type<'ativa' | 'pausada' | 'concluida'>(),
  observacoes: text('observacoes'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  usuarioIdx: index('prospeccoes_usuario_idx').on(table.usuarioId),
  plataformaIdx: index('prospeccoes_plataforma_idx').on(table.plataforma),
  dataIdx: index('prospeccoes_data_idx').on(table.data),
}));

// ===== RESPOSTAS PROSPECÇÃO =====
export const respostasProspeccao = pgTable('respostas_prospeccao', {
  id: uuid('id').primaryKey().defaultRandom(),
  prospeccaoId: uuid('prospeccao_id').references(() => prospeccoes.id),
  plataforma: varchar('plataforma', { length: 50 }).notNull(),
  mensagemEnviada: text('mensagem_enviada').notNull(),
  mensagemRecebida: text('mensagem_recebida').notNull(),
  sentimento: varchar('sentimento', { length: 20 }).notNull().$type<'positivo' | 'negativo'>(),
  data: timestamp('data').notNull(),
  usuario: varchar('usuario', { length: 255 }).notNull(),
  usuarioId: uuid('usuario_id').notNull().references(() => usuarios.id),
  leadGerado: boolean('lead_gerado').notNull().default(false),
  leadId: uuid('lead_id').references(() => leads.id),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  usuarioIdx: index('respostas_usuario_idx').on(table.usuarioId),
  prospeccaoIdx: index('respostas_prospeccao_idx').on(table.prospeccaoId),
  leadIdx: index('respostas_lead_idx').on(table.leadId),
  sentimentoIdx: index('respostas_sentimento_idx').on(table.sentimento),
}));

// ===== DOCUMENTOS =====
export const documentos = pgTable('documentos', {
  id: uuid('id').primaryKey().defaultRandom(),
  tipo: varchar('tipo', { length: 100 }).notNull(),
  categoria: varchar('categoria', { length: 50 }).notNull().$type<'documentacao_pessoal' | 'contratos' | 'advertencias' | 'atestados_medicos' | 'outros'>(),
  nomeArquivo: varchar('nome_arquivo', { length: 255 }).notNull(),
  arquivoUrl: text('arquivo_url').notNull(),
  tamanho: integer('tamanho').notNull(),
  mime: varchar('mime', { length: 100 }).notNull(),
  uploadedBy: uuid('uploaded_by').notNull().references(() => usuarios.id),
  
  // Relacionamentos polimórficos
  entidadeId: uuid('entidade_id').notNull(),
  entidadeTipo: varchar('entidade_tipo', { length: 50 }).notNull(), // 'cliente', 'lead', 'empreendimento', etc.
  
  // Processamento IA
  aiProcessing: jsonb('ai_processing'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  entidadeIdx: index('documentos_entidade_idx').on(table.entidadeId, table.entidadeTipo),
  categoriaIdx: index('documentos_categoria_idx').on(table.categoria),
  uploadedByIdx: index('documentos_uploaded_by_idx').on(table.uploadedBy),
}));

// ===== WHATSAPP =====
export const whatsappConversations = pgTable('whatsapp_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  contactId: varchar('contact_id', { length: 255 }).notNull(),
  contactName: varchar('contact_name', { length: 255 }).notNull(),
  contactPhone: varchar('contact_phone', { length: 20 }).notNull(),
  lastMessage: text('last_message'),
  lastMessageAt: timestamp('last_message_at'),
  unreadCount: integer('unread_count').default(0),
  tags: jsonb('tags').default([]),
  assignedTo: uuid('assigned_to').references(() => usuarios.id),
  status: varchar('status', { length: 20 }).default('open').$type<'open' | 'closed' | 'pending'>(),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  contactPhoneIdx: index('whatsapp_contact_phone_idx').on(table.contactPhone),
  assignedToIdx: index('whatsapp_assigned_to_idx').on(table.assignedTo),
  statusIdx: index('whatsapp_status_idx').on(table.status),
}));

export const whatsappMessages = pgTable('whatsapp_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').notNull().references(() => whatsappConversations.id, { onDelete: 'cascade' }),
  messageId: varchar('message_id', { length: 255 }).notNull().unique(), // ID da Evolution API
  from: varchar('from', { length: 255 }).notNull(),
  to: varchar('to', { length: 255 }).notNull(),
  body: text('body'),
  type: varchar('type', { length: 20 }).notNull().$type<'text' | 'image' | 'document' | 'audio' | 'video'>(),
  timestamp: timestamp('timestamp').notNull(),
  isFromMe: boolean('is_from_me').notNull(),
  mediaUrl: text('media_url'),
  quotedMessageId: varchar('quoted_message_id', { length: 255 }),
  status: varchar('status', { length: 20 }).default('sent').$type<'pending' | 'sent' | 'delivered' | 'read' | 'failed'>(),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  conversationIdx: index('whatsapp_messages_conversation_idx').on(table.conversationId),
  messageIdIdx: index('whatsapp_messages_message_id_idx').on(table.messageId),
  timestampIdx: index('whatsapp_messages_timestamp_idx').on(table.timestamp),
}));

// ===== LOGS E AUDITORIA =====
export const logs = pgTable('logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  level: varchar('level', { length: 10 }).notNull().$type<'info' | 'warn' | 'error' | 'debug'>(),
  message: text('message').notNull(),
  meta: jsonb('meta'),
  userId: uuid('user_id').references(() => usuarios.id),
  action: varchar('action', { length: 100 }),
  resource: varchar('resource', { length: 100 }),
  resourceId: varchar('resource_id', { length: 255 }),
  ip: varchar('ip', { length: 45 }),
  userAgent: text('user_agent'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
}, (table) => ({
  levelIdx: index('logs_level_idx').on(table.level),
  userIdx: index('logs_user_idx').on(table.userId),
  timestampIdx: index('logs_timestamp_idx').on(table.timestamp),
  actionIdx: index('logs_action_idx').on(table.action),
}));

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => usuarios.id),
  action: varchar('action', { length: 20 }).notNull().$type<'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT'>(),
  resource: varchar('resource', { length: 100 }).notNull(),
  resourceId: varchar('resource_id', { length: 255 }).notNull(),
  oldValues: jsonb('old_values'),
  newValues: jsonb('new_values'),
  ip: varchar('ip', { length: 45 }).notNull(),
  userAgent: text('user_agent'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('audit_logs_user_idx').on(table.userId),
  actionIdx: index('audit_logs_action_idx').on(table.action),
  resourceIdx: index('audit_logs_resource_idx').on(table.resource),
  timestampIdx: index('audit_logs_timestamp_idx').on(table.timestamp),
}));

// ===== RELAÇÕES =====
export const usuariosRelations = relations(usuarios, ({ many }) => ({
  leads: many(leads),
  clientes: many(clientes),
  empreendimentos: many(empreendimentos),
  prospeccoes: many(prospeccoes),
  respostasProspeccao: many(respostasProspeccao),
  documentos: many(documentos),
  conversationsAssigned: many(whatsappConversations),
  logs: many(logs),
  auditLogs: many(auditLogs),
}));

export const leadsRelations = relations(leads, ({ one, many }) => ({
  responsavelCRMUser: one(usuarios, {
    fields: [leads.responsavelCRM],
    references: [usuarios.id],
  }),
  respostasProspeccao: many(respostasProspeccao),
}));

export const clientesRelations = relations(clientes, ({ one }) => ({
  responsavelUser: one(usuarios, {
    fields: [clientes.responsavel],
    references: [usuarios.id],
  }),
}));

export const empreendimentosRelations = relations(empreendimentos, ({ one, many }) => ({
  responsavelUser: one(usuarios, {
    fields: [empreendimentos.responsavel],
    references: [usuarios.id],
  }),
  unidades: many(unidades),
}));

export const unidadesRelations = relations(unidades, ({ one }) => ({
  empreendimento: one(empreendimentos, {
    fields: [unidades.empreendimentoId],
    references: [empreendimentos.id],
  }),
}));

export const prospeccoesRelations = relations(prospeccoes, ({ one, many }) => ({
  usuario: one(usuarios, {
    fields: [prospeccoes.usuarioId],
    references: [usuarios.id],
  }),
  respostas: many(respostasProspeccao),
}));

export const respostasProspeccaoRelations = relations(respostasProspeccao, ({ one }) => ({
  prospeccao: one(prospeccoes, {
    fields: [respostasProspeccao.prospeccaoId],
    references: [prospeccoes.id],
  }),
  usuario: one(usuarios, {
    fields: [respostasProspeccao.usuarioId],
    references: [usuarios.id],
  }),
  lead: one(leads, {
    fields: [respostasProspeccao.leadId],
    references: [leads.id],
  }),
}));

export const documentosRelations = relations(documentos, ({ one }) => ({
  uploadedByUser: one(usuarios, {
    fields: [documentos.uploadedBy],
    references: [usuarios.id],
  }),
}));

export const whatsappConversationsRelations = relations(whatsappConversations, ({ one, many }) => ({
  assignedToUser: one(usuarios, {
    fields: [whatsappConversations.assignedTo],
    references: [usuarios.id],
  }),
  messages: many(whatsappMessages),
}));

export const whatsappMessagesRelations = relations(whatsappMessages, ({ one }) => ({
  conversation: one(whatsappConversations, {
    fields: [whatsappMessages.conversationId],
    references: [whatsappConversations.id],
  }),
}));

export const logsRelations = relations(logs, ({ one }) => ({
  user: one(usuarios, {
    fields: [logs.userId],
    references: [usuarios.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(usuarios, {
    fields: [auditLogs.userId],
    references: [usuarios.id],
  }),
}));