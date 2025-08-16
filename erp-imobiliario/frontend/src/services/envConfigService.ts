import { Usuario } from '../types/auth';
import { EvolutionAPIConfig } from '../types/whatsapp';

export interface UserEnvConfig {
  userId: string;
  evolutionConfig: EvolutionAPIConfig;
  googleCalendarConfig?: {
    clientId: string;
    apiKey: string;
  };
  googleMapsConfig?: {
    apiKey: string;
  };
}

class EnvConfigService {
  private currentConfig: UserEnvConfig | null = null;
  private baseConfig: any = {};

  constructor() {
    this.loadBaseConfig();
  }

  // Carregar configuração base do .env
  private loadBaseConfig(): void {
    this.baseConfig = {
      googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      googleApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
      googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      evolutionApiUrl: import.meta.env.VITE_EVOLUTION_API_URL,
      evolutionApiKey: import.meta.env.VITE_EVOLUTION_API_KEY,
      webhookUrl: import.meta.env.VITE_WEBHOOK_URL,
    };
  }

  // Configurar variáveis de ambiente para usuário específico
  async configureForUser(usuario: Usuario): Promise<void> {
    try {
      // Carregar configuração específica do usuário do localStorage/API
      const savedConfig = this.getUserSavedConfig(usuario.id);
      
      if (savedConfig) {
        this.currentConfig = savedConfig;
      } else {
        // Criar configuração padrão para o usuário
        this.currentConfig = {
          userId: usuario.id,
          evolutionConfig: {
            apiUrl: this.baseConfig.evolutionApiUrl || 'http://localhost:8080',
            token: this.baseConfig.evolutionApiKey || '',
            instanceId: `instance_${usuario.id}`,
            instanceName: `whatsapp_${usuario.id}`,
            webhookUrl: `${this.baseConfig.webhookUrl || 'http://localhost:3000'}/webhook/evolution/${usuario.id}`,
            isActive: false
          },
          googleCalendarConfig: {
            clientId: this.baseConfig.googleClientId || '',
            apiKey: this.baseConfig.googleApiKey || ''
          },
          googleMapsConfig: {
            apiKey: this.baseConfig.googleMapsApiKey || ''
          }
        };
      }

      // Atualizar variáveis globais
      this.updateGlobalEnvVars();
      
      // Salvar configuração
      this.saveUserConfig(this.currentConfig);

    } catch (error) {
      console.error('Erro ao configurar environment para usuário:', error);
      throw error;
    }
  }

  // Atualizar variáveis globais baseadas no usuário atual
  private updateGlobalEnvVars(): void {
    if (!this.currentConfig) return;

    // Criar objeto com as variáveis específicas do usuário
    const userEnvVars = {
      VITE_EVOLUTION_API_URL: this.currentConfig.evolutionConfig.apiUrl,
      VITE_EVOLUTION_API_KEY: this.currentConfig.evolutionConfig.token,
      VITE_EVOLUTION_INSTANCE_ID: this.currentConfig.evolutionConfig.instanceId,
      VITE_EVOLUTION_INSTANCE_NAME: this.currentConfig.evolutionConfig.instanceName,
      VITE_WEBHOOK_URL: this.currentConfig.evolutionConfig.webhookUrl,
      VITE_GOOGLE_CLIENT_ID: this.currentConfig.googleCalendarConfig?.clientId || '',
      VITE_GOOGLE_API_KEY: this.currentConfig.googleCalendarConfig?.apiKey || '',
      VITE_GOOGLE_MAPS_API_KEY: this.currentConfig.googleMapsConfig?.apiKey || '',
    };

    // Aplicar as variáveis ao import.meta.env (simulação para desenvolvimento)
    Object.assign(import.meta.env, userEnvVars);

    // Salvar no sessionStorage para acesso durante a sessão
    sessionStorage.setItem('current_user_env', JSON.stringify(userEnvVars));
  }

  // Obter configuração do usuário
  getCurrentUserConfig(): UserEnvConfig | null {
    return this.currentConfig;
  }

  // Obter configuração específica da Evolution API para o usuário atual
  getCurrentEvolutionConfig(): EvolutionAPIConfig | null {
    return this.currentConfig?.evolutionConfig || null;
  }

  // Atualizar configuração Evolution API para o usuário atual
  async updateEvolutionConfig(config: Partial<EvolutionAPIConfig>): Promise<void> {
    if (!this.currentConfig) {
      throw new Error('Nenhuma configuração de usuário carregada');
    }

    this.currentConfig.evolutionConfig = {
      ...this.currentConfig.evolutionConfig,
      ...config
    };

    this.updateGlobalEnvVars();
    this.saveUserConfig(this.currentConfig);
  }

  // Ativar/Desativar Evolution API para o usuário atual
  async toggleEvolutionAPI(isActive: boolean): Promise<void> {
    if (!this.currentConfig) {
      throw new Error('Nenhuma configuração de usuário carregada');
    }

    this.currentConfig.evolutionConfig.isActive = isActive;
    this.updateGlobalEnvVars();
    this.saveUserConfig(this.currentConfig);
  }

  // Salvar configuração do usuário
  private saveUserConfig(config: UserEnvConfig): void {
    const allConfigs = this.getAllUserConfigs();
    allConfigs[config.userId] = config;
    localStorage.setItem('user_env_configs', JSON.stringify(allConfigs));
  }

  // Carregar configuração salva do usuário
  private getUserSavedConfig(userId: string): UserEnvConfig | null {
    const allConfigs = this.getAllUserConfigs();
    return allConfigs[userId] || null;
  }

  // Obter todas as configurações de usuários
  private getAllUserConfigs(): Record<string, UserEnvConfig> {
    try {
      const saved = localStorage.getItem('user_env_configs');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Erro ao carregar configurações de usuários:', error);
      return {};
    }
  }

  // Limpar configuração ao fazer logout
  clearUserConfig(): void {
    this.currentConfig = null;
    sessionStorage.removeItem('current_user_env');
    
    // Restaurar configurações base
    Object.assign(import.meta.env, this.baseConfig);
  }

  // Obter variável de ambiente específica do usuário atual
  getUserEnvVar(key: string): string | undefined {
    const userEnv = sessionStorage.getItem('current_user_env');
    if (userEnv) {
      const parsed = JSON.parse(userEnv);
      return parsed[key];
    }
    return import.meta.env[key];
  }

  // Validar se as configurações obrigatórias estão preenchidas
  validateCurrentConfig(): { valid: boolean; errors: string[] } {
    if (!this.currentConfig) {
      return { valid: false, errors: ['Configuração não carregada'] };
    }

    const errors: string[] = [];

    // Validar Evolution API se estiver ativa
    if (this.currentConfig.evolutionConfig.isActive) {
      if (!this.currentConfig.evolutionConfig.apiUrl) {
        errors.push('URL da Evolution API é obrigatória');
      }
      if (!this.currentConfig.evolutionConfig.token) {
        errors.push('Token da Evolution API é obrigatório');
      }
      if (!this.currentConfig.evolutionConfig.instanceId) {
        errors.push('ID da instância é obrigatório');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Restaurar configuração padrão para um usuário
  async resetUserConfig(userId: string): Promise<void> {
    const allConfigs = this.getAllUserConfigs();
    delete allConfigs[userId];
    localStorage.setItem('user_env_configs', JSON.stringify(allConfigs));
    
    // Se for o usuário atual, reconfigurar
    if (this.currentConfig?.userId === userId) {
      this.currentConfig = null;
    }
  }

  // Exportar configurações para backup
  exportUserConfigs(): string {
    const allConfigs = this.getAllUserConfigs();
    return JSON.stringify(allConfigs, null, 2);
  }

  // Importar configurações de backup
  async importUserConfigs(configJson: string): Promise<void> {
    try {
      const configs = JSON.parse(configJson);
      localStorage.setItem('user_env_configs', JSON.stringify(configs));
    } catch (error) {
      throw new Error('JSON de configurações inválido');
    }
  }
}

// Instância singleton
export const envConfigService = new EnvConfigService();

export default envConfigService;