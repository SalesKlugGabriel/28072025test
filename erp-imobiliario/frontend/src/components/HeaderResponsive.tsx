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
  ExclamationTriangleIcon,
  XMarkIcon
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
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

const HeaderResponsive: React.FC<HeaderProps> = ({ 
  user, 
  onLogout, 
  onMobileMenuToggle,
  isMobileMenuOpen
}) => {
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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
      'agenda': 'Agenda',
      'ajuda': 'Ajuda',
      'imoveis-terceiros': 'Imóveis Terceiros',
      'prospeccoes': 'Prospecções'
    };

    return segments.map(segment => breadcrumbMap[segment] || segment);
  };

  const breadcrumbs = getBreadcrumbs();
  const currentPage = breadcrumbs[breadcrumbs.length - 1] || 'Dashboard';

  // Notificações mock
  const notifications = [
    {
      id: 1,
      type: 'info',
      title: 'Novo lead cadastrado',
      message: 'João Silva foi adicionado ao CRM',
      time: '5 min',
      icon: CheckCircleIcon,
      color: 'blue'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Follow-up pendente',
      message: '3 leads precisam de acompanhamento',
      time: '1 hora',
      icon: ClockIcon,
      color: 'yellow'
    },
    {
      id: 3,
      type: 'urgent',
      title: 'Contrato expirando',
      message: 'Contrato #123 vence em 2 dias',
      time: '2 horas',
      icon: ExclamationTriangleIcon,
      color: 'red'
    }
  ];

  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      case 'urgent': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      admin: 'Administrador',
      gerente: 'Gerente',
      corretor: 'Corretor',
      engenheiro: 'Engenheiro',
      arquiteto: 'Arquiteto',
      juridico: 'Jurídico',
      financeiro: 'Financeiro'
    };
    return roleMap[role] || role;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>

            {/* Breadcrumbs */}
            <div className="hidden sm:flex items-center space-x-2 text-sm">
              <HomeIcon className="h-4 w-4 text-gray-400" />
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <span className="text-gray-400">/</span>
                  <span className={index === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                    {crumb}
                  </span>
                </React.Fragment>
              ))}
            </div>

            {/* Mobile page title */}
            <div className="sm:hidden">
              <h1 className="text-lg font-semibold text-gray-900 truncate max-w-40">
                {currentPage}
              </h1>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              {/* Mobile search toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="sm:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>

              {/* Desktop search */}
              <div className="hidden sm:block relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                />
              </div>

              {/* Mobile search dropdown */}
              {searchOpen && (
                <div className="sm:hidden absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Buscar..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoFocus
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 relative"
              >
                <BellIcon className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{notifications.length}</span>
                  </span>
                )}
              </button>

              {/* Notifications dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Notificações</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex items-start space-x-3">
                          <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${getNotificationBadgeColor(notification.type)}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
                            <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Ver todas as notificações
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
                ) : (
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-32">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role ? getRoleDisplayName(user.role) : ''}</p>
                </div>
                <ChevronDownIcon className="hidden sm:block h-4 w-4 text-gray-400" />
              </button>

              {/* User dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200 sm:hidden">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <p className="text-xs text-gray-500">{user?.role ? getRoleDisplayName(user.role) : ''}</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        // Navigate to profile
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <UserCircleIcon className="h-4 w-4 mr-3 text-gray-400" />
                      Meu Perfil
                    </button>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        // Navigate to settings
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <CogIcon className="h-4 w-4 mr-3 text-gray-400" />
                      Configurações
                    </button>
                  </div>
                  <div className="border-t border-gray-200 py-2">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
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
      </div>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div 
          className="sm:hidden fixed inset-0 bg-gray-600 bg-opacity-50 z-40"
          onClick={() => setSearchOpen(false)}
        />
      )}
    </header>
  );
};

export default HeaderResponsive;