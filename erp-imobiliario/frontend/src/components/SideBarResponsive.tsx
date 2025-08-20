import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  BuildingOffice2Icon,
  ChatBubbleLeftRightIcon,
  ScaleIcon,
  BanknotesIcon,
  CogIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DevicePhoneMobileIcon,
  ClipboardDocumentListIcon,
  PresentationChartBarIcon,
  DocumentTextIcon,
  BeakerIcon,
  ShieldCheckIcon,
  MapIcon,
  CreditCardIcon,
  TruckIcon,
  TagIcon,
  CalendarIcon,
  ArchiveBoxIcon,
  ArrowPathIcon,
  EnvelopeIcon,
  QuestionMarkCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  userRole: string;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

interface MenuItem {
  name: string;
  href?: string;
  icon: React.ComponentType<any>;
  roles: string[];
  badge?: string;
  children?: MenuItem[];
  description?: string;
}

interface ModuleGroup {
  name: string;
  icon: React.ComponentType<any>;
  items: MenuItem[];
  roles: string[];
  color: string;
}

const SideBarResponsive: React.FC<SidebarProps> = ({ 
  isOpen, 
  onToggle, 
  userRole, 
  isMobileMenuOpen, 
  setMobileMenuOpen 
}) => {
  const location = useLocation();
  const [expandedModules, setExpandedModules] = useState<string[]>(['comercial']);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fechar menu mobile quando navegar
  useEffect(() => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  }, [location.pathname, isMobile, setMobileMenuOpen]);

  const toggleModule = (moduleName: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleName)
        ? prev.filter(m => m !== moduleName)
        : [...prev, moduleName]
    );
  };

  const isActive = (href: string) => {
    if (href === '/home') return location.pathname === '/home';
    return location.pathname.startsWith(href);
  };

  const modules: ModuleGroup[] = [
    {
      name: 'Dashboard',
      icon: HomeIcon,
      color: 'blue',
      roles: ['admin', 'gerente', 'corretor', 'engenheiro', 'arquiteto', 'juridico', 'financeiro'],
      items: [
        {
          name: 'Home',
          href: '/home',
          icon: PresentationChartBarIcon,
          roles: ['admin', 'gerente', 'corretor', 'engenheiro', 'arquiteto', 'juridico', 'financeiro'],
          description: 'Visão geral do sistema'
        },
        {
          name: 'Agenda',
          href: '/agenda',
          icon: CalendarIcon,
          roles: ['admin', 'gerente', 'corretor', 'juridico'],
          description: 'Compromissos e agendamentos'
        }
      ]
    },
    {
      name: 'Comercial',
      icon: ChatBubbleLeftRightIcon,
      color: 'green',
      roles: ['admin', 'gerente', 'corretor'],
      items: [
        {
          name: 'CRM',
          href: '/crm',
          icon: UserGroupIcon,
          roles: ['admin', 'gerente', 'corretor'],
          badge: 'Hot',
          description: 'Gestão de leads e clientes'
        },
        {
          name: 'Pessoas',
          href: '/pessoas',
          icon: UserGroupIcon,
          roles: ['admin', 'gerente', 'corretor'],
          description: 'Gestão de contatos'
        },
        {
          name: 'Prospecções',
          href: '/prospeccoes',
          icon: TagIcon,
          roles: ['admin', 'gerente', 'corretor'],
          description: 'Busca ativa de clientes'
        },
        {
          name: 'WhatsApp',
          href: '/whatsapp',
          icon: DevicePhoneMobileIcon,
          roles: ['admin', 'gerente', 'corretor'],
          badge: 'New',
          description: 'Comunicação via WhatsApp'
        }
      ]
    },
    {
      name: 'Imóveis',
      icon: BuildingOffice2Icon,
      color: 'purple',
      roles: ['admin', 'gerente', 'corretor', 'engenheiro', 'arquiteto'],
      items: [
        {
          name: 'Empreendimentos',
          href: '/empreendimentos',
          icon: BuildingOffice2Icon,
          roles: ['admin', 'gerente', 'corretor', 'engenheiro', 'arquiteto'],
          description: 'Gestão de projetos imobiliários'
        },
        {
          name: 'Imóveis Terceiros',
          href: '/imoveis-terceiros',
          icon: HomeIcon,
          roles: ['admin', 'gerente', 'corretor'],
          description: 'Propriedades de parceiros'
        }
      ]
    },
    {
      name: 'Jurídico',
      icon: ScaleIcon,
      color: 'indigo',
      roles: ['admin', 'gerente', 'juridico'],
      items: [
        {
          name: 'Contratos',
          href: '/juridico',
          icon: DocumentTextIcon,
          roles: ['admin', 'gerente', 'juridico'],
          description: 'Gestão de contratos'
        }
      ]
    },
    {
      name: 'Automações',
      icon: ArrowPathIcon,
      color: 'orange',
      roles: ['admin', 'gerente'],
      items: [
        {
          name: 'Notificações',
          href: '/automacoes/notificacoes',
          icon: EnvelopeIcon,
          roles: ['admin', 'gerente'],
          description: 'Configurar notificações automáticas'
        },
        {
          name: 'Distribuição',
          href: '/automacoes/distribuicao',
          icon: TruckIcon,
          roles: ['admin', 'gerente'],
          description: 'Distribuição automática de leads'
        },
        {
          name: 'Ações em Massa',
          href: '/automacoes/acoes-massa',
          icon: ArchiveBoxIcon,
          roles: ['admin', 'gerente'],
          description: 'Ações em lote para múltiplos registros'
        }
      ]
    },
    {
      name: 'Relatórios',
      icon: ClipboardDocumentListIcon,
      color: 'red',
      roles: ['admin', 'gerente', 'financeiro'],
      items: [
        {
          name: 'Relatórios',
          href: '/relatorios',
          icon: ClipboardDocumentListIcon,
          roles: ['admin', 'gerente', 'financeiro'],
          description: 'Relatórios e analytics'
        }
      ]
    },
    {
      name: 'Configurações',
      icon: CogIcon,
      color: 'gray',
      roles: ['admin'],
      items: [
        {
          name: 'Configurações',
          href: '/configuracoes',
          icon: CogIcon,
          roles: ['admin'],
          description: 'Configurações do sistema'
        }
      ]
    }
  ];

  // Filtrar módulos por role do usuário
  const filteredModules = modules.filter(module =>
    module.roles.includes(userRole.toLowerCase())
  );

  const renderMenuItem = (item: MenuItem, isChild = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const active = item.href ? isActive(item.href) : false;

    if (hasChildren) {
      return (
        <div key={item.name} className="space-y-1">
          <button
            onClick={() => hasChildren && toggleModule(item.name)}
            className={`w-full group flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900`}
          >
            <item.icon className="flex-shrink-0 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
            {(isOpen || isMobileMenuOpen) && (
              <>
                <span className="ml-3 flex-1 text-left">{item.name}</span>
                {expandedModules.includes(item.name) ? 
                  <ChevronUpIcon className="h-3 w-3" /> : 
                  <ChevronDownIcon className="h-3 w-3" />
                }
              </>
            )}
          </button>
          {expandedModules.includes(item.name) && (isOpen || isMobileMenuOpen) && (
            <div className="ml-6 space-y-1">
              {item.children?.map(child => renderMenuItem(child, true))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        to={item.href || '#'}
        className={`group flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
          active
            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <item.icon
          className={`flex-shrink-0 h-4 w-4 ${isChild ? 'ml-2' : ''} ${
            active ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
          }`}
        />
        {(isOpen || isMobileMenuOpen) && (
          <>
            <span className="ml-3 flex-1">{item.name}</span>
            {item.badge && (
              <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                item.badge === 'Hot' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {item.badge}
              </span>
            )}
          </>
        )}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white border-r border-gray-200 shadow-lg">
      {/* Header */}
      <div className={`flex items-center ${isOpen || isMobileMenuOpen ? 'justify-between px-6 py-4' : 'justify-center py-4'} bg-gradient-to-r from-blue-600 to-blue-700 text-white`}>
        {(isOpen || isMobileMenuOpen) && (
          <div className="flex items-center">
            <BuildingOffice2Icon className="h-8 w-8 text-white" />
            <div className="ml-3">
              <h1 className="text-lg font-bold">LegaSys</h1>
              <p className="text-blue-100 text-xs">ERP 3.0</p>
            </div>
          </div>
        )}
        
        {/* Mobile close button */}
        {isMobile && isMobileMenuOpen && (
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-md text-white hover:bg-blue-800 lg:hidden"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        )}
        
        {/* Desktop toggle button */}
        {!isMobile && (
          <button
            onClick={onToggle}
            className="p-2 rounded-md text-white hover:bg-blue-800 transition-colors duration-200"
          >
            {isOpen ? (
              <ChevronLeftIcon className="h-4 w-4 text-white" />
            ) : (
              <ChevronRightIcon className="h-4 w-4 text-white" />
            )}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {filteredModules.map((module) => {
          const moduleActive = module.items.some(item => 
            item.href && isActive(item.href)
          );
          const moduleExpanded = expandedModules.includes(module.name.toLowerCase());

          return (
            <div key={module.name} className="space-y-2">
              {/* Module Header */}
              <div className="space-y-1">
                <button
                  onClick={() => toggleModule(module.name.toLowerCase())}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    moduleActive
                      ? `bg-${module.color}-50 text-${module.color}-700`
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <module.icon 
                    className={`flex-shrink-0 h-5 w-5 ${
                      moduleActive ? `text-${module.color}-500` : 'text-gray-500'
                    }`}
                  />
                  {(isOpen || isMobileMenuOpen) && (
                    <>
                      <span className="ml-3 flex-1 text-left">{module.name}</span>
                      {moduleExpanded ? (
                        <ChevronUpIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                      )}
                    </>
                  )}
                </button>

                {/* Module Items */}
                {moduleExpanded && (isOpen || isMobileMenuOpen) && (
                  <div className="ml-4 space-y-1 border-l-2 border-gray-100 pl-4">
                    {module.items
                      .filter(item => item.roles.includes(userRole.toLowerCase()))
                      .map(item => renderMenuItem(item))
                    }
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Help link */}
        <div className="border-t border-gray-200 pt-4">
          <Link
            to="/ajuda"
            className={`group flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
              isActive('/ajuda')
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <QuestionMarkCircleIcon
              className={`flex-shrink-0 h-4 w-4 ${
                isActive('/ajuda') ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
              }`}
            />
            {(isOpen || isMobileMenuOpen) && <span className="ml-3">Ajuda</span>}
          </Link>
        </div>
      </nav>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
        
        {/* Mobile Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out lg:hidden ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {sidebarContent}
        </div>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div
      className={`hidden lg:flex lg:flex-shrink-0 transition-all duration-300 ${
        isOpen ? 'lg:w-72' : 'lg:w-16'
      }`}
    >
      <div className="flex flex-col w-full">
        {sidebarContent}
      </div>
    </div>
  );
};

export default SideBarResponsive;