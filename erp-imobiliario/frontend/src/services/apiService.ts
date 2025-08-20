import API_CONFIG, { getApiUrl, getAuthHeaders } from '../config/api';

// Classe para gerenciar requisições à API
class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  // Definir token de autenticação
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  // Método base para requisições
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = getApiUrl(endpoint);
    const headers = getAuthHeaders(this.token || undefined);

    const config: RequestInit = {
      headers: {
        ...headers,
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      // Verificar se token expirou
      if (response.status === 401) {
        this.handleUnauthorized();
        throw new Error('Token expirado');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erro na requisição ${endpoint}:`, error);
      throw error;
    }
  }

  // Lidar com token expirado
  private handleUnauthorized() {
    this.setToken(null);
    // Redirecionar para login se necessário
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  // Métodos HTTP
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(getApiUrl(endpoint));
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return this.request<T>(url.pathname + url.search);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE'
    });
  }

  // ===== MÉTODOS DE AUTENTICAÇÃO =====

  async login(email: string, password: string) {
    const response = await this.post<{
      accessToken: string;
      refreshToken: string;
      user: any;
    }>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, { email, password });
    
    this.setToken(response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    
    return response;
  }

  async logout() {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await this.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, { refreshToken });
    } catch (error) {
      console.warn('Erro no logout:', error);
    } finally {
      this.setToken(null);
      localStorage.removeItem('refreshToken');
    }
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('Refresh token não encontrado');
    }

    const response = await this.post<{
      accessToken: string;
      user: any;
    }>(API_CONFIG.ENDPOINTS.AUTH.REFRESH, { refreshToken });
    
    this.setToken(response.accessToken);
    return response;
  }

  async getMe() {
    return this.get<{ user: any }>(API_CONFIG.ENDPOINTS.AUTH.ME);
  }

  // ===== MÉTODOS DE PESSOAS =====

  async getPessoas(params?: {
    page?: number;
    limit?: number;
    search?: string;
    tipo?: string;
    cidade?: string;
    estado?: string;
  }) {
    return this.get(API_CONFIG.ENDPOINTS.PESSOAS.BASE, params);
  }

  async createPessoa(tipo: string, data: any) {
    return this.post(API_CONFIG.ENDPOINTS.PESSOAS.CREATE(tipo), data);
  }

  async getPessoaById(id: string) {
    return this.get(API_CONFIG.ENDPOINTS.PESSOAS.BY_ID(id));
  }

  async updatePessoa(id: string, data: any) {
    return this.put(API_CONFIG.ENDPOINTS.PESSOAS.BY_ID(id), data);
  }

  async deletePessoa(id: string) {
    return this.delete(API_CONFIG.ENDPOINTS.PESSOAS.BY_ID(id));
  }

  async convertLeadToClient(id: string, clienteData: any) {
    return this.post(API_CONFIG.ENDPOINTS.PESSOAS.CONVERT(id), clienteData);
  }

  async getPessoasStats() {
    return this.get(API_CONFIG.ENDPOINTS.PESSOAS.STATS);
  }

  // ===== MÉTODOS DE CRM =====

  async getCrmStats() {
    return this.get(API_CONFIG.ENDPOINTS.CRM.STATS);
  }

  async getBoards() {
    return this.get(API_CONFIG.ENDPOINTS.CRM.BOARDS);
  }

  async createBoard(data: any) {
    return this.post(API_CONFIG.ENDPOINTS.CRM.BOARDS, data);
  }

  async getBoardById(id: string) {
    return this.get(API_CONFIG.ENDPOINTS.CRM.BOARD_BY_ID(id));
  }

  async updateBoard(id: string, data: any) {
    return this.put(API_CONFIG.ENDPOINTS.CRM.BOARD_BY_ID(id), data);
  }

  async deleteBoard(id: string) {
    return this.delete(API_CONFIG.ENDPOINTS.CRM.BOARD_BY_ID(id));
  }

  async getEstagios(boardId: string) {
    return this.get(API_CONFIG.ENDPOINTS.CRM.ESTAGIOS_BY_BOARD(boardId));
  }

  async createEstagio(data: any) {
    return this.post(API_CONFIG.ENDPOINTS.CRM.ESTAGIOS, data);
  }

  async moveLeadToStage(data: any) {
    return this.post(API_CONFIG.ENDPOINTS.CRM.MOVIMENTACOES, data);
  }

  async getFollowUps(params?: { leadId?: string; concluido?: boolean }) {
    return this.get(API_CONFIG.ENDPOINTS.CRM.FOLLOWUPS, params);
  }

  async createFollowUp(data: any) {
    return this.post(API_CONFIG.ENDPOINTS.CRM.FOLLOWUPS, data);
  }

  async completeFollowUp(id: string, observacoes?: string) {
    return this.put(API_CONFIG.ENDPOINTS.CRM.COMPLETE_FOLLOWUP(id), { observacoes });
  }

  // ===== MÉTODOS DE AUTOMAÇÕES =====

  async getAutomacoes(params?: { boardId?: string; ativo?: boolean }) {
    return this.get(API_CONFIG.ENDPOINTS.AUTOMACOES.BASE, params);
  }

  async createAutomacao(data: any) {
    return this.post(API_CONFIG.ENDPOINTS.AUTOMACOES.BASE, data);
  }

  async getAutomacaoById(id: string) {
    return this.get(API_CONFIG.ENDPOINTS.AUTOMACOES.BY_ID(id));
  }

  async updateAutomacao(id: string, data: any) {
    return this.put(API_CONFIG.ENDPOINTS.AUTOMACOES.BY_ID(id), data);
  }

  async deleteAutomacao(id: string) {
    return this.delete(API_CONFIG.ENDPOINTS.AUTOMACOES.BY_ID(id));
  }

  async executeAutomacao(id: string, leadId: string) {
    return this.post(API_CONFIG.ENDPOINTS.AUTOMACOES.EXECUTE(id), { leadId });
  }

  async getTemplatesAutomacao() {
    return this.get(API_CONFIG.ENDPOINTS.AUTOMACOES.TEMPLATES);
  }

  async createFromTemplate(data: any) {
    return this.post(API_CONFIG.ENDPOINTS.AUTOMACOES.FROM_TEMPLATE, data);
  }

  // ===== MÉTODOS DE EMPREENDIMENTOS =====

  async getEmpreendimentos(params?: any) {
    return this.get(API_CONFIG.ENDPOINTS.EMPREENDIMENTOS.BASE, params);
  }

  async createEmpreendimento(data: any) {
    return this.post(API_CONFIG.ENDPOINTS.EMPREENDIMENTOS.BASE, data);
  }

  async getEmpreendimentoById(id: string) {
    return this.get(API_CONFIG.ENDPOINTS.EMPREENDIMENTOS.BY_ID(id));
  }

  async updateEmpreendimento(id: string, data: any) {
    return this.put(API_CONFIG.ENDPOINTS.EMPREENDIMENTOS.BY_ID(id), data);
  }

  async deleteEmpreendimento(id: string) {
    return this.delete(API_CONFIG.ENDPOINTS.EMPREENDIMENTOS.BY_ID(id));
  }

  async getUnidades(empreendimentoId: string, params?: any) {
    return this.get(API_CONFIG.ENDPOINTS.EMPREENDIMENTOS.UNIDADES(empreendimentoId), params);
  }

  async createUnidade(empreendimentoId: string, data: any) {
    return this.post(API_CONFIG.ENDPOINTS.EMPREENDIMENTOS.UNIDADES(empreendimentoId), data);
  }

  async updateUnidade(id: string, data: any) {
    return this.put(API_CONFIG.ENDPOINTS.EMPREENDIMENTOS.UPDATE_UNIDADE(id), data);
  }

  async getVendas(params?: any) {
    return this.get(API_CONFIG.ENDPOINTS.EMPREENDIMENTOS.VENDAS, params);
  }

  async registrarVenda(data: any) {
    return this.post(API_CONFIG.ENDPOINTS.EMPREENDIMENTOS.REGISTRAR_VENDA, data);
  }

  async atualizarValorizacao(id: string, novoValor: number, observacoes?: string) {
    return this.put(API_CONFIG.ENDPOINTS.EMPREENDIMENTOS.VALORIZACAO(id), { novoValor, observacoes });
  }

  async getEmpreendimentosStats() {
    return this.get(API_CONFIG.ENDPOINTS.EMPREENDIMENTOS.STATS);
  }

  // ===== MÉTODOS DE RELATÓRIOS =====

  async getDashboard(periodo: string = '30d') {
    return this.get(API_CONFIG.ENDPOINTS.RELATORIOS.DASHBOARD, { periodo });
  }

  async getRelatorioVendas(params: any) {
    return this.get(API_CONFIG.ENDPOINTS.RELATORIOS.VENDAS, params);
  }

  async getRelatorioLeads(params: any) {
    return this.get(API_CONFIG.ENDPOINTS.RELATORIOS.LEADS, params);
  }

  async getRelatorioEmpreendimentos(params: any) {
    return this.get(API_CONFIG.ENDPOINTS.RELATORIOS.EMPREENDIMENTOS, params);
  }

  async getTemplatesRelatorios() {
    return this.get(API_CONFIG.ENDPOINTS.RELATORIOS.TEMPLATES);
  }

  async gerarRelatorio(templateId: string, formato: string, parametros: any) {
    return this.post(API_CONFIG.ENDPOINTS.RELATORIOS.GERAR, { templateId, formato, parametros });
  }

  // ===== MÉTODOS DE WHATSAPP =====

  async getWhatsAppStatus() {
    return this.get(API_CONFIG.ENDPOINTS.WHATSAPP.STATUS);
  }

  async getWhatsAppQR() {
    return this.get(API_CONFIG.ENDPOINTS.WHATSAPP.QR);
  }

  async createWhatsAppInstance() {
    return this.post(API_CONFIG.ENDPOINTS.WHATSAPP.INSTANCE);
  }

  async sendWhatsAppMessage(to: string, message: string, type?: string) {
    return this.post(API_CONFIG.ENDPOINTS.WHATSAPP.SEND, { to, message, type });
  }

  async getConversations() {
    return this.get(API_CONFIG.ENDPOINTS.WHATSAPP.CONVERSATIONS);
  }

  async createConversation(phoneNumber: string, name?: string, pessoaId?: string) {
    return this.post(API_CONFIG.ENDPOINTS.WHATSAPP.CONVERSATIONS, { phoneNumber, name, pessoaId });
  }

  async getMessages(conversationId: string, params?: any) {
    return this.get(API_CONFIG.ENDPOINTS.WHATSAPP.MESSAGES(conversationId), params);
  }
}

// Instância singleton
const apiService = new ApiService();
export default apiService;