import React, { useState, useReducer } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import NovoLeadModal from './components/NovoLeadModal';
import LoginPage from './pages/auth/LoginPage';

// Pages
import Dashboard from './pages/Dashboard';
import Pessoas from './pages/Pessoas';
import Empreendimentos from './pages/Empreendimentos';
import CrmComercial from './pages/CrmComercial';
import Juridico from './pages/Juridico';
import Financeiro from './pages/Financeiro';
import Compras from './pages/Compras';
import Engenharia from './pages/Engenharia';
import Arquitetura from './pages/Arquitetura';
import PosVenda from './pages/PosVenda';
import Configuracoes from './pages/Configuracoes';

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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AppUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleLogin = (userData: AppUser) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          userRole={user?.role || 'admin'}
        />

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
            sidebarOpen ? 'ml-64' : 'ml-16'
          }`}
        >
          {/* Header */}
          <Header
            user={user}
            onLogout={handleLogout}
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            <button
              className="mb-4 rounded bg-blue-600 px-4 py-2 text-white"
              onClick={() => dispatch({ type: 'SET_MODAL_ATIVO', payload: 'novo-lead' })}
            >
              Novo Lead
            </button>

            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pessoas/*" element={<Pessoas />} />
              <Route path="/empreendimentos/*" element={<Empreendimentos />} />
              <Route path="/crm/*" element={<CrmComercial />} />
              <Route path="/juridico/*" element={<Juridico />} />
              <Route path="/financeiro/*" element={<Financeiro />} />
              <Route path="/compras/*" element={<Compras />} />
              <Route path="/engenharia/*" element={<Engenharia />} />
              <Route path="/arquitetura/*" element={<Arquitetura />} />
              <Route path="/pos-venda/*" element={<PosVenda />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
            </Routes>

            <ul className="mt-6 space-y-2">
              {state.clientes.map((cliente) => (
                <li key={cliente.id}>
                  {cliente.nome} - {cliente.email}
                </li>
              ))}
            </ul>
          </main>
        </div>

        <NovoLeadModal aberto={state.modalAtivo === 'novo-lead'} dispatch={dispatch} />
      </div>
    </Router>
  );
}

export default App;