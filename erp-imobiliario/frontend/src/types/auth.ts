// Sistema de autenticação e perfis de usuário

export type PerfilUsuario = 'corretor' | 'gerente' | 'administrador';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  avatar?: string;
  telefone?: string;
  departamento: string;
  dataAdmissao: string;
  status: 'ativo' | 'inativo';
  configuracoes: {
    notificacoes: boolean;
    tema: 'claro' | 'escuro' | 'auto';
    idioma: 'pt-BR' | 'en-US';
  };
  
  // Dados específicos do corretor
  corretor?: {
    creci: string;
    equipeId?: string;
    gerenteId?: string;
    metaMensal?: number;
    comissaoBase?: number;
  };
  
  // Dados específicos do gerente
  gerente?: {
    equipesGerenciadas: string[];
    corretoresGerenciados: string[];
    metaEquipe?: number;
  };
}

// Permissões por perfil
export interface PermissoesPerfil {
  // Pessoas
  pessoas: {
    clientes: 'own' | 'team' | 'all' | 'none';
    leads: 'own' | 'team' | 'all' | 'none';
    fornecedores: 'all' | 'none';
    colaboradores: 'all' | 'none';
  };
  
  // Módulos
  modulos: {
    crm: boolean;
    juridico: boolean;
    financeiro: boolean;
    relatorios: boolean;
    configuracoes: boolean;
    empreendimentos: boolean;
  };
  
  // Ações
  acoes: {
    criarContrato: boolean;
    editarContrato: boolean;
    excluirContrato: boolean;
    gerenciarAutomacoes: boolean;
    acessarRelatoriosGerenciais: boolean;
    gerenciarUsuarios: boolean;
    configurarSistema: boolean;
  };
}

// Contexto de autenticação
export interface AuthContext {
  usuario: Usuario | null;
  perfil: PerfilUsuario | null;
  permissoes: PermissoesPerfil | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Métodos
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  hasPermission: (resource: string, action?: string) => boolean;
  canAccess: (dados: any, resourceType: 'cliente' | 'lead') => boolean;
}

// Filtros baseados em perfil
export interface FiltrosPerfil {
  usuarioId: string;
  perfil: PerfilUsuario;
  equipesGerenciadas?: string[];
  corretoresGerenciados?: string[];
}

// Estado de autenticação
export interface AuthState {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { usuario: Usuario; token: string } }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USUARIO'; payload: Usuario }
  | { type: 'CLEAR_ERROR' };

// Mock de usuários para desenvolvimento
export interface MockUsuarios {
  corretor: Usuario;
  gerente: Usuario;
  administrador: Usuario;
}

// Configuração de permissões por perfil
export const PERMISSOES_PERFIL: Record<PerfilUsuario, PermissoesPerfil> = {
  corretor: {
    pessoas: {
      clientes: 'own',
      leads: 'own',
      fornecedores: 'none',
      colaboradores: 'none'
    },
    modulos: {
      crm: true,
      juridico: true,
      financeiro: false,
      relatorios: true,
      configuracoes: false,
      empreendimentos: true
    },
    acoes: {
      criarContrato: false,
      editarContrato: false,
      excluirContrato: false,
      gerenciarAutomacoes: false,
      acessarRelatoriosGerenciais: false,
      gerenciarUsuarios: false,
      configurarSistema: false
    }
  },
  gerente: {
    pessoas: {
      clientes: 'team',
      leads: 'team',
      fornecedores: 'none',
      colaboradores: 'none'
    },
    modulos: {
      crm: true,
      juridico: true,
      financeiro: true,
      relatorios: true,
      configuracoes: false,
      empreendimentos: true
    },
    acoes: {
      criarContrato: true,
      editarContrato: true,
      excluirContrato: false,
      gerenciarAutomacoes: true,
      acessarRelatoriosGerenciais: true,
      gerenciarUsuarios: false,
      configurarSistema: false
    }
  },
  administrador: {
    pessoas: {
      clientes: 'all',
      leads: 'all',
      fornecedores: 'all',
      colaboradores: 'all'
    },
    modulos: {
      crm: true,
      juridico: true,
      financeiro: true,
      relatorios: true,
      configuracoes: true,
      empreendimentos: true
    },
    acoes: {
      criarContrato: true,
      editarContrato: true,
      excluirContrato: true,
      gerenciarAutomacoes: true,
      acessarRelatoriosGerenciais: true,
      gerenciarUsuarios: true,
      configurarSistema: true
    }
  }
};