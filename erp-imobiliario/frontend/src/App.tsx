import React, { useState, useReducer } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import SideBarModular from './components/SideBarModular';
import Header from './components/Header';
import NovoLeadModal from './components/NovoLeadModal';
import LoginPage from './pages/auth/LoginPage';
import { AuthProvider, useAuth } from './context/auth-context';

// Pages
import Home from './pages/Home';
import DashboardMelhorado from './pages/DashboardMelhorado';
import Pessoas from './pages/Pessoas';
import Empreendimentos from './pages/Empreendimentos';
import CrmComercial from './pages/CrmComercial';
import Juridico from './pages/Juridico';
import Configuracoes from './pages/Configuracoes';
import Relatorios from './pages/Relatorios';
import WhatsAppPage from './pages/WhatsApp';
import ImoveisTerceiros from './pages/ImoveisTerceiros';
import Ajuda from './pages/Ajuda';
import Agenda from './pages/Agenda';
import Financeiro from './pages/Financeiro';

// Automações
import NotificacoesPage from './pages/automacoes/NotificacoesPage';
import DistribuicaoPage from './pages/automacoes/DistribuicaoPage';
import AcoesMassaPage from './pages/automacoes/AcoesMassaPage';

// Placeholder pages (to be implemented)
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600">Este módulo está em desenvolvimento.</p>
    </div>
  </div>
);

// Types
interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'corretor' | 'gerente' | 'engenheiro' | 'arquiteto' | 'juridico' | 'financeiro';
  avatar?: string;
}

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  origem: string;
}

interface State {
  clientes: Cliente[];
  modalAtivo: string | null;
}

const initialState: State = {
  clientes: [],
  modalAtivo: null,
};

function reducer(
  state: State,
  action:
    | { type: 'SET_MODAL_ATIVO'; payload: string | null }
    | { type: 'ADD_CLIENTE'; payload: Cliente }
): State {
  switch (action.type) {
    case 'SET_MODAL_ATIVO':
      return { ...state, modalAtivo: action.payload };
    case 'ADD_CLIENTE':
      return { ...state, clientes: [...state.clientes, action.payload] };
    default:
      return state;
  }
}

// Componente principal que gerencia a aplicação autenticada
const MainApp: React.FC = () => {
  const { usuario, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [state, dispatch] = useReducer(reducer, initialState);

  // Converter usuario do contexto para o formato esperado pelo Header/Sidebar
  const convertUserForLegacyComponents = (usuario: any): AppUser | null => {
    if (!usuario) return null;
    
    const roleMap: Record<string, AppUser['role']> = {
      'administrador': 'admin',
      'corretor': 'corretor',
      'gerente': 'gerente',
      'engenheiro': 'engenheiro',
      'arquiteto': 'arquiteto',
      'juridico': 'juridico',
      'financeiro': 'financeiro'
    };

    return {
      id: usuario.id || '',
      name: usuario.nome || '',
      email: usuario.email || '',
      role: roleMap[usuario.perfil] || 'corretor',
      avatar: usuario.avatar
    };
  };

  const legacyUser = convertUserForLegacyComponents(usuario);

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <SideBarModular
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          userRole={legacyUser?.role || 'admin'}
        />

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
            sidebarOpen ? 'ml-72' : 'ml-16'
          }`}
        >
          {/* Header */}
          <Header
            user={legacyUser}
            onLogout={logout}
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-hidden bg-gray-50">
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<div className="h-full p-6"><DashboardMelhorado /></div>} />
              
              {/* Comercial */}
              <Route path="/crm/*" element={<CrmComercial />} />
              <Route path="/whatsapp/*" element={<WhatsAppPage userRole={legacyUser?.role} />} />
              <Route path="/relatorios" element={<Relatorios />} />
              
              {/* Cadastros */}
              <Route path="/pessoas/*" element={<div className="h-full p-6"><Pessoas /></div>} />
              <Route path="/empreendimentos/*" element={<div className="h-full p-6"><Empreendimentos /></div>} />
              <Route path="/imoveis-terceiros/*" element={<div className="h-full p-6"><ImoveisTerceiros /></div>} />
              
              {/* Jurídico */}
              <Route path="/juridico/*" element={<div className="h-full p-6"><Juridico /></div>} />
              
              {/* Financeiro */}
              <Route path="/financeiro/*" element={<div className="h-full"><Financeiro /></div>} />
              
              {/* Automações */}
              <Route path="/automacoes/notificacoes" element={<div className="h-full p-6"><NotificacoesPage /></div>} />
              <Route path="/automacoes/distribuicao" element={<div className="h-full p-6"><DistribuicaoPage /></div>} />
              <Route path="/automacoes/acoes-massa" element={<div className="h-full p-6"><AcoesMassaPage /></div>} />
              <Route path="/automacoes/integracoes" element={<div className="h-full p-6"><PlaceholderPage title="Integrações" /></div>} />
              
              {/* Configurações */}
              <Route path="/configuracoes/*" element={<div className="h-full p-6"><Configuracoes /></div>} />
              
              {/* Ajuda */}
              <Route path="/ajuda" element={<Ajuda />} />
              
              {/* Agenda */}
              <Route path="/agenda" element={<div className="h-full"><Agenda /></div>} />
            </Routes>
          </main>
        </div>

        <NovoLeadModal aberto={state.modalAtivo === 'novo-lead'} dispatch={dispatch} />
      </div>
    </Router>
  );
};

// Componente que verifica autenticação
const AuthenticatedApp: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <MainApp />;
};

function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

export default App;