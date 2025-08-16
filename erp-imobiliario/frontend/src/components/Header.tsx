import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ChevronDownIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'corretor' | 'gerente' | 'engenheiro' | 'arquiteto' | 'juridico' | 'financeiro';
  avatar?: string;
}

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onMenuToggle }) => {
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Gerar breadcrumbs baseado na rota atual
  const getBreadcrumbs = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    const breadcrumbMap: Record<string, string> = {
      'home': 'Dashboard',
      'pessoas': 'Pessoas',
      'empreendimentos': 'Empreendimentos',
      'crm': 'CRM Comercial',
      'whatsapp': 'WhatsApp',
      'juridico': 'Jurídico',
      'financeiro': 'Financeiro',
      'automacoes': 'Automações',
      'configuracoes': 'Configurações',
      'relatorios': 'Relatórios',
      'imoveis-terceiros': 'Imóveis Terceiros',
      'notificacoes': 'Notificações',
      'distribuicao': 'Distribuição de Leads',
      'acoes-massa': 'Ações em Massa',
      'integracoes': 'Integrações'
    };

    return segments.map(segment => breadcrumbMap[segment] || segment);
  };

  const breadcrumbs = getBreadcrumbs();

  const notifications = [
    {
      id: 1,
      title: 'Contrato vencendo',
      message: 'Contrato do imóvel Rua das Flores, 123 vence em 3 dias',
      time: '2 min atrás',
      type: 'warning'
    },
    {
      id: 2,
      title: 'Novo lead',
      message: 'Interesse no apartamento Centro - Ref: 001',
      time: '5 min atrás',
      type: 'info'
    },
    {
      id: 3,
      title: 'Pagamento recebido',
      message: 'Aluguel do imóvel Av. Principal, 456 foi pago',
      time: '1 hora atrás',
      type: 'success'
    }
  ];

  const getRoleLabel = (role: string) => {
    const roles = {
      admin: 'Administrador',
      gerente: 'Gerente',
      corretor: 'Corretor',
      engenheiro: 'Engenheiro',
      arquiteto: 'Arquiteto',
      juridico: 'Jurídico',
      financeiro: 'Financeiro'
    };
    return roles[role as keyof typeof roles] || role;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0 z-10">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Breadcrumbs */}
          <nav className="ml-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <div className="flex items-center">
                  <HomeIcon className="h-4 w-4 text-gray-400" />
                  <span className="ml-1 text-sm font-medium text-gray-500">LegaSys</span>
                </div>
              </li>
              {breadcrumbs.map((crumb, index) => (
                <li key={index}>
                  <div className="flex items-center">
                    <ChevronDownIcon className="h-4 w-4 text-gray-400 rotate-[-90deg]" />
                    <span className={`ml-2 text-sm font-medium ${
                      index === breadcrumbs.length - 1 
                        ? 'text-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}>
                      {crumb}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Quick Stats */}
          <div className="hidden lg:flex items-center space-x-4 text-sm">
            <div className="flex items-center text-gray-600">
              <ClockIcon className="h-4 w-4 mr-1" />
              {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="flex items-center text-green-600">
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              <span className="font-medium">5 leads hoje</span>
            </div>
          </div>

          {/* Search */}
          <div className="max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Busca rápida..."
                className="block w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full relative"
            >
              <BellIcon className="h-6 w-6" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Notificações</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-start">
                        <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                          notification.type === 'warning' ? 'bg-yellow-400' :
                          notification.type === 'success' ? 'bg-green-400' : 'bg-blue-400'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-gray-50">
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    Ver todas as notificações
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
              )}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user ? getRoleLabel(user.role) : ''}</p>
              </div>
              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            </button>

            {/* User Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <CogIcon className="h-4 w-4 mr-3" />
                    Configurações
                  </button>
                  
                  <button 
                    onClick={onLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;