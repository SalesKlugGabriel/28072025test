// Configuração da API do backend
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  ENDPOINTS: {
    // Autenticação
    AUTH: {
      LOGIN: '/api/auth/login',
      REFRESH: '/api/auth/refresh',
      LOGOUT: '/api/auth/logout',
      ME: '/api/auth/me',
      VERIFY: '/api/auth/verify'
    },
    
    // Pessoas (Leads, Clientes, Fornecedores)
    PESSOAS: {
      BASE: '/api/pessoas',
      STATS: '/api/pessoas/stats',
      CREATE: (tipo: string) => `/api/pessoas/${tipo}`,
      BY_ID: (id: string) => `/api/pessoas/${id}`,
      CONVERT: (id: string) => `/api/pessoas/${id}/convert`
    },
    
    // CRM
    CRM: {
      STATS: '/api/crm/stats',
      BOARDS: '/api/crm/boards',
      BOARD_BY_ID: (id: string) => `/api/crm/boards/${id}`,
      ESTAGIOS: '/api/crm/estagios',
      ESTAGIOS_BY_BOARD: (boardId: string) => `/api/crm/boards/${boardId}/estagios`,
      MOVIMENTACOES: '/api/crm/movimentacoes',
      LEAD_MOVIMENTACOES: (leadId: string) => `/api/crm/leads/${leadId}/movimentacoes`,
      FOLLOWUPS: '/api/crm/followups',
      COMPLETE_FOLLOWUP: (id: string) => `/api/crm/followups/${id}/complete`
    },
    
    // Automações
    AUTOMACOES: {
      BASE: '/api/automacoes',
      BY_ID: (id: string) => `/api/automacoes/${id}`,
      EXECUTE: (id: string) => `/api/automacoes/${id}/execute`,
      TEMPLATES: '/api/automacoes/templates/list',
      FROM_TEMPLATE: '/api/automacoes/templates/create'
    },
    
    // Empreendimentos
    EMPREENDIMENTOS: {
      BASE: '/api/empreendimentos',
      STATS: '/api/empreendimentos/stats',
      BY_ID: (id: string) => `/api/empreendimentos/${id}`,
      UNIDADES: (empreendimentoId: string) => `/api/empreendimentos/${empreendimentoId}/unidades`,
      UPDATE_UNIDADE: (id: string) => `/api/empreendimentos/unidades/${id}`,
      VENDAS: '/api/empreendimentos/vendas/list',
      REGISTRAR_VENDA: '/api/empreendimentos/vendas/registrar',
      VALORIZACAO: (id: string) => `/api/empreendimentos/vendas/${id}/valorizacao`
    },
    
    // Relatórios
    RELATORIOS: {
      DASHBOARD: '/api/relatorios/dashboard',
      VENDAS: '/api/relatorios/vendas',
      LEADS: '/api/relatorios/leads',
      EMPREENDIMENTOS: '/api/relatorios/empreendimentos',
      TEMPLATES: '/api/relatorios/templates',
      GERAR: '/api/relatorios/gerar'
    },
    
    // WhatsApp
    WHATSAPP: {
      STATUS: '/api/whatsapp/status',
      QR: '/api/whatsapp/qr',
      INSTANCE: '/api/whatsapp/instance',
      SEND: '/api/whatsapp/send',
      CONVERSATIONS: '/api/whatsapp/conversations',
      MESSAGES: (conversationId: string) => `/api/whatsapp/conversations/${conversationId}/messages`,
      WEBHOOK: '/api/whatsapp/webhook'
    }
  }
};

// Headers padrão para requests
export const getAuthHeaders = (token?: string) => ({
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` })
});

// URLs completas das APIs
export const getApiUrl = (endpoint: string) => `${API_CONFIG.BASE_URL}${endpoint}`;

export default API_CONFIG;