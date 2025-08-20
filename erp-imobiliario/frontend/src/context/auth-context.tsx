import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Usuario, PerfilUsuario, PermissoesPerfil, AuthState, AuthAction, PERMISSOES_PERFIL } from '../types/auth';
import { envConfigService } from '../services/envConfigService';
import { multiUserWhatsAppService } from '../services/multiUserWhatsappService';

// Mock de usuários para desenvolvimento
const MOCK_USUARIOS: Record<string, Usuario> = {
  'corretor@legasys.com': {
    id: 'user_corretor_1',
    nome: 'Carlos Vendedor',
    email: 'corretor@legasys.com',
    perfil: 'corretor',
    telefone: '(11) 99999-1111',
    departamento: 'Vendas',
    dataAdmissao: '2023-01-15',
    status: 'ativo',
    configuracoes: {
      notificacoes: true,
      tema: 'claro',
      idioma: 'pt-BR'
    },
    corretor: {
      creci: '12345-F',
      equipeId: 'equipe_1',
      gerenteId: 'user_gerente_1',
      metaMensal: 10,
      comissaoBase: 3
    }
  },
  'gerente@legasys.com': {
    id: 'user_gerente_1',
    nome: 'Maria Gerente',
    email: 'gerente@legasys.com',
    perfil: 'gerente',
    telefone: '(11) 99999-2222',
    departamento: 'Vendas',
    dataAdmissao: '2022-05-10',
    status: 'ativo',
    configuracoes: {
      notificacoes: true,
      tema: 'claro',
      idioma: 'pt-BR'
    },
    gerente: {
      equipesGerenciadas: ['equipe_1', 'equipe_2'],
      corretoresGerenciados: ['user_corretor_1', 'user_corretor_2', 'user_corretor_3'],
      metaEquipe: 50
    }
  },
  'admin@legasys.com': {
    id: 'user_admin_1',
    nome: 'João Administrador',
    email: 'admin@legasys.com',
    perfil: 'administrador',
    telefone: '(11) 99999-3333',
    departamento: 'TI',
    dataAdmissao: '2021-01-01',
    status: 'ativo',
    configuracoes: {
      notificacoes: true,
      tema: 'escuro',
      idioma: 'pt-BR'
    }
  }
};

// Reducer para gerenciar estado de autenticação
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        usuario: action.payload.usuario,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case 'LOGIN_ERROR':
      return {
        ...state,
        usuario: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    
    case 'LOGOUT':
      return {
        usuario: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    
    case 'UPDATE_USUARIO':
      return {
        ...state,
        usuario: action.payload
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Estado inicial
const initialState: AuthState = {
  usuario: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Context
interface AuthContextType {
  // Estado
  usuario: Usuario | null;
  perfil: PerfilUsuario | null;
  permissoes: PermissoesPerfil | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Métodos
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  hasPermission: (modulo: string, acao?: string) => boolean;
  canAccessData: (dados: any, tipoRecurso: 'cliente' | 'lead') => boolean;
  getFilteredData: <T>(dados: T[], tipoRecurso: 'cliente' | 'lead') => T[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  // Carregar usuário do localStorage ao inicializar
  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const token = localStorage.getItem('legasys_token');
        const usuarioData = localStorage.getItem('legasys_usuario');
        
        if (token && usuarioData) {
          const usuario = JSON.parse(usuarioData) as Usuario;
          
          // Configurar environment variables para o usuário
          await envConfigService.configureForUser(usuario);
          
          // Carregar configuração WhatsApp do usuário
          const evolutionConfig = envConfigService.getCurrentEvolutionConfig();
          if (evolutionConfig) {
            await multiUserWhatsAppService.configureUserEvolutionAPI(
              usuario.id,
              usuario.nome,
              evolutionConfig
            );
          }
          
          dispatch({ type: 'LOGIN_SUCCESS', payload: { usuario, token } });
        } else {
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        dispatch({ type: 'LOGOUT' });
      }
    };
    
    carregarUsuario();
  }, []);
  
  // Login com fallback para múltiplas URLs
  const login = async (email: string, senha: string) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // URLs possíveis para tentar
      const apiUrls = [
        import.meta.env.VITE_API_URL,
        'https://literate-zebra-5gpqx59g4rv9c4g5j-3001.app.github.dev',
        'http://localhost:3001',
        `https://${window.location.hostname.replace('5173', '3001')}`
      ].filter(Boolean);

      let response;
      let lastError;

      // Tentar cada URL até uma funcionar
      for (const apiUrl of apiUrls) {
        try {
          console.log(`🔄 Tentando login em: ${apiUrl}`);
          response = await fetch(`${apiUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha }),
            mode: 'cors'
          });

          if (response.ok) {
            console.log(`✅ Login bem-sucedido via: ${apiUrl}`);
            break;
          }
        } catch (error) {
          console.log(`❌ Falha em ${apiUrl}:`, error);
          lastError = error;
          continue;
        }
      }

      if (!response || !response.ok) {
        throw lastError || new Error('Todas as tentativas de conexão falharam');
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao fazer login');
      }
      
      const data = await response.json();
      
      // Adaptar dados do backend para o formato esperado
      const usuario: Usuario = {
        id: data.user.id,
        nome: data.user.nome,
        email: data.user.email,
        perfil: data.user.perfil.toLowerCase() as PerfilUsuario,
        telefone: data.user.telefone || '',
        departamento: data.user.departamento || 'Vendas',
        dataAdmissao: '2024-01-01', // Placeholder
        status: 'ativo',
        configuracoes: {
          notificacoes: true,
          tema: 'claro',
          idioma: 'pt-BR'
        }
      };
      
      const token = data.accessToken;
      
      // Salvar no localStorage
      localStorage.setItem('legasys_token', token);
      localStorage.setItem('legasys_usuario', JSON.stringify(usuario));
      
      // Configurar environment variables para o usuário
      await envConfigService.configureForUser(usuario);
      
      // Carregar configuração WhatsApp do usuário
      const evolutionConfig = envConfigService.getCurrentEvolutionConfig();
      if (evolutionConfig) {
        await multiUserWhatsAppService.configureUserEvolutionAPI(
          usuario.id,
          usuario.nome,
          evolutionConfig
        );
      }
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { usuario, token } });
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: error instanceof Error ? error.message : 'Erro de conexão' });
      throw error;
    }
  };
  
  // Logout
  const logout = () => {
    localStorage.removeItem('legasys_token');
    localStorage.removeItem('legasys_usuario');
    
    // Limpar configurações do usuário
    envConfigService.clearUserConfig();
    
    dispatch({ type: 'LOGOUT' });
  };
  
  // Limpar erro
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };
  
  // Verificar permissão
  const hasPermission = (modulo: string, acao?: string) => {
    if (!state.usuario) return false;
    
    const permissoes = PERMISSOES_PERFIL[state.usuario.perfil];
    
    // Verificar acesso ao módulo
    if (permissoes.modulos[modulo as keyof typeof permissoes.modulos] === false) {
      return false;
    }
    
    // Verificar ação específica
    if (acao && permissoes.acoes[acao as keyof typeof permissoes.acoes] === false) {
      return false;
    }
    
    return true;
  };
  
  // Verificar acesso a dados específicos
  const canAccessData = (dados: any, tipoRecurso: 'cliente' | 'lead') => {
    if (!state.usuario) return false;
    
    const permissoes = PERMISSOES_PERFIL[state.usuario.perfil];
    const nivelAcesso = tipoRecurso === 'cliente' ? permissoes.pessoas.clientes : permissoes.pessoas.leads;
    
    switch (nivelAcesso) {
      case 'all':
        return true;
      
      case 'team':
        // Gerente pode ver dados da sua equipe
        if (state.usuario.perfil === 'gerente' && state.usuario.gerente) {
          return state.usuario.gerente.corretoresGerenciados.includes(dados.responsavelCRM || dados.responsavel);
        }
        return false;
      
      case 'own':
        // Corretor só pode ver seus próprios dados
        return dados.responsavelCRM === state.usuario.id || dados.responsavel === state.usuario.id;
      
      case 'none':
      default:
        return false;
    }
  };
  
  // Filtrar array de dados baseado nas permissões
  const getFilteredData = <T extends any>(dados: T[], tipoRecurso: 'cliente' | 'lead'): T[] => {
    if (!state.usuario) return [];
    
    return dados.filter(item => canAccessData(item, tipoRecurso));
  };
  
  // Obter permissões do usuário atual
  const permissoes = state.usuario ? PERMISSOES_PERFIL[state.usuario.perfil] : null;
  
  const value: AuthContextType = {
    // Estado
    usuario: state.usuario,
    perfil: state.usuario?.perfil || null,
    permissoes,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    
    // Métodos
    login,
    logout,
    clearError,
    hasPermission,
    canAccessData,
    getFilteredData
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};

// Hook para verificar permissões específicas
export const usePermissions = () => {
  const { hasPermission, canAccessData, getFilteredData, permissoes } = useAuth();
  
  return {
    hasPermission,
    canAccessData,
    getFilteredData,
    permissoes
  };
};

// HOC para proteger rotas
interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: string;
  requiredAction?: string;
  fallback?: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredAction,
  fallback = <div>Acesso negado</div>
}) => {
  const { hasPermission, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Não autenticado</div>;
  }
  
  if (requiredPermission && !hasPermission(requiredPermission, requiredAction)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};