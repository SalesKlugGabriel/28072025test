import React, { useState } from 'react';
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
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  userRole: string;
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

const SideBarModular: React.FC<SidebarProps> = ({ isOpen, onToggle, userRole }) => {
  const location = useLocation();
  const [expandedModules, setExpandedModules] = useState<string[]>(['comercial']);

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
          name: 'CRM Pipeline',
          href: '/crm',
          icon: ClipboardDocumentListIcon,
          roles: ['admin', 'gerente', 'corretor'],
          description: 'Gestão de leads e funil de vendas'
        },
        {
          name: 'WhatsApp',
          href: '/whatsapp',
          icon: DevicePhoneMobileIcon,
          roles: ['admin', 'gerente', 'corretor'],
          badge: 'NOVO',
          description: 'Chat integrado e automações'
        },
        {
          name: 'Relatórios',
          href: '/relatorios',
          icon: PresentationChartBarIcon,
          roles: ['admin', 'gerente', 'corretor'],
          description: 'Relatórios de vendas e performance'
        }
      ]
    },
    {
      name: 'Cadastros',
      icon: UserGroupIcon,
      color: 'purple',
      roles: ['admin', 'gerente', 'corretor', 'juridico', 'financeiro'],
      items: [
        {
          name: 'Pessoas',
          href: '/pessoas',
          icon: UserGroupIcon,
          roles: ['admin', 'gerente', 'corretor', 'juridico', 'financeiro'],
          children: [
            { name: 'Clientes', href: '/pessoas?tipo=cliente', icon: UserGroupIcon, roles: ['admin', 'gerente', 'corretor'] },
            { name: 'Leads', href: '/pessoas?tipo=lead', icon: UserGroupIcon, roles: ['admin', 'gerente', 'corretor'] },
            { name: 'Fornecedores', href: '/pessoas?tipo=fornecedor', icon: TruckIcon, roles: ['admin', 'gerente', 'financeiro'] },
            { name: 'Colaboradores', href: '/pessoas?tipo=colaborador', icon: UserGroupIcon, roles: ['admin', 'gerente'] }
          ]
        },
        {
          name: 'Empreendimentos',
          href: '/empreendimentos',
          icon: BuildingOffice2Icon,
          roles: ['admin', 'gerente', 'corretor', 'engenheiro', 'arquiteto'],
          children: [
            { name: 'Projetos', href: '/empreendimentos', icon: BuildingOffice2Icon, roles: ['admin', 'gerente', 'corretor'] },
            { name: 'Comparador', href: '/empreendimentos/comparador', icon: BeakerIcon, roles: ['admin', 'gerente', 'corretor'] },
            { name: 'Landing Pages', href: '/empreendimentos/landing', icon: MapIcon, roles: ['admin', 'gerente', 'corretor'] }
          ]
        },
        {
          name: 'Imóveis Terceiros',
          href: '/imoveis-terceiros',
          icon: ArchiveBoxIcon,
          roles: ['admin', 'gerente', 'corretor'],
          description: 'Gestão de imóveis de terceiros'
        }
      ]
    },
    {
      name: 'Jurídico',
      icon: ScaleIcon,
      color: 'red',
      roles: ['admin', 'gerente', 'juridico'],
      items: [
        {
          name: 'Visão Geral',
          href: '/juridico',
          icon: ScaleIcon,
          roles: ['admin', 'gerente', 'juridico'],
          description: 'Dashboard jurídico'
        },
        {
          name: 'Contratos',
          href: '/juridico/contratos',
          icon: DocumentTextIcon,
          roles: ['admin', 'gerente', 'juridico'],
          description: 'Gestão de contratos'
        },
        {
          name: 'Minutas',
          href: '/juridico/minutas',
          icon: DocumentTextIcon,
          roles: ['admin', 'gerente', 'juridico'],
          description: 'Templates e minutas'
        },
        {
          name: 'Vencimentos',
          href: '/juridico/vencimentos',
          icon: CalendarIcon,
          roles: ['admin', 'gerente', 'juridico'],
          description: 'Prazos e vencimentos',
          badge: '3'
        }
      ]
    },
    {
      name: 'Financeiro',
      icon: BanknotesIcon,
      color: 'yellow',
      roles: ['admin', 'gerente', 'financeiro'],
      items: [
        {
          name: 'Contas a Receber',
          href: '/financeiro/receber',
          icon: CreditCardIcon,
          roles: ['admin', 'gerente', 'financeiro'],
          description: 'Em desenvolvimento'
        },
        {
          name: 'Contas a Pagar',
          href: '/financeiro/pagar',
          icon: BanknotesIcon,
          roles: ['admin', 'gerente', 'financeiro'],
          description: 'Em desenvolvimento'
        },
        {
          name: 'Fluxo de Caixa',
          href: '/financeiro/fluxo',
          icon: PresentationChartBarIcon,
          roles: ['admin', 'gerente', 'financeiro'],
          description: 'Em desenvolvimento'
        }
      ]
    },
    {
      name: 'Automações',
      icon: ArrowPathIcon,
      color: 'indigo',
      roles: ['admin', 'gerente'],
      items: [
        {
          name: 'Notificações',
          href: '/automacoes/notificacoes',
          icon: EnvelopeIcon,
          roles: ['admin', 'gerente'],
          description: 'Sistema multi-canal'
        },
        {
          name: 'Distribuição de Leads',
          href: '/automacoes/distribuicao',
          icon: ArrowPathIcon,
          roles: ['admin', 'gerente'],
          description: 'Distribuição inteligente'
        },
        {
          name: 'Ações em Massa',
          href: '/automacoes/acoes-massa',
          icon: TagIcon,
          roles: ['admin', 'gerente'],
          description: 'Operações em lote'
        },
        {
          name: 'Integrações',
          href: '/automacoes/integracoes',
          icon: ArrowPathIcon,
          roles: ['admin'],
          description: 'Tráfego pago e APIs'
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
          name: 'Sistema',
          href: '/configuracoes',
          icon: CogIcon,
          roles: ['admin'],
          description: 'Configurações gerais'
        },
        {
          name: 'Usuários',
          href: '/configuracoes/usuarios',
          icon: UserGroupIcon,
          roles: ['admin'],
          description: 'Gestão de usuários'
        },
        {
          name: 'Integrações',
          href: '/configuracoes/integracoes',
          icon: ArrowPathIcon,
          roles: ['admin'],
          description: 'APIs e webhooks'
        }
      ]
    }
  ];

  const filteredModules = modules.filter(module =>
    module.roles.includes(userRole)
  );

  const renderMenuItem = (item: MenuItem, isChild = false) => {
    const active = item.href ? isActive(item.href) : false;
    const hasChildren = item.children && item.children.length > 0;
    const canAccess = item.roles.includes(userRole);

    if (!canAccess) return null;

    return (
      <div key={item.name}>
        {item.href ? (
          <Link
            to={item.href}
            className={`group flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
              isChild ? 'ml-6' : ''
            } ${
              active
                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
            title={isOpen ? item.description : item.name}
          >
            <item.icon
              className={`flex-shrink-0 h-4 w-4 ${isChild ? 'ml-2' : ''} ${
                active ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
              }`}
            />
            {isOpen && (
              <div className="ml-3 flex-1 flex items-center justify-between">
                <span className={isChild ? 'text-xs' : ''}>{item.name}</span>
                {item.badge && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    item.badge === 'NOVO' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
            )}
          </Link>
        ) : (
          <button
            onClick={() => hasChildren && toggleModule(item.name)}
            className={`w-full group flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900`}
          >
            <item.icon className="flex-shrink-0 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
            {isOpen && (
              <div className="ml-3 flex-1 flex items-center justify-between">
                <span>{item.name}</span>
                {hasChildren && (
                  expandedModules.includes(item.name) ? 
                    <ChevronUpIcon className="h-3 w-3" /> : 
                    <ChevronDownIcon className="h-3 w-3" />
                )}
              </div>
            )}
          </button>
        )}

        {/* Render children if expanded */}
        {isOpen && hasChildren && expandedModules.includes(item.name) && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderMenuItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ${
      isOpen ? 'w-72' : 'w-16'
    }`}>
      <div className="flex h-full flex-col bg-white border-r border-gray-200 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          {isOpen && (
            <div className="flex items-center">
              <BuildingOffice2Icon className="h-8 w-8 text-white" />
              <div className="ml-3">
                <div className="text-xl font-bold text-white">LegaSys ERP</div>
                <div className="text-xs text-blue-100">Imobiliário Inteligente</div>
              </div>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            {isOpen ? (
              <ChevronLeftIcon className="h-4 w-4 text-white" />
            ) : (
              <ChevronRightIcon className="h-4 w-4 text-white" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {filteredModules.map((module) => {
            const moduleExpanded = expandedModules.includes(module.name.toLowerCase());
            const moduleActive = module.items.some(item => 
              item.href && isActive(item.href)
            );

            return (
              <div key={module.name}>
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(module.name.toLowerCase())}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    moduleActive
                      ? `bg-${module.color}-50 text-${module.color}-700 border border-${module.color}-200`
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <module.icon 
                    className={`flex-shrink-0 h-5 w-5 ${
                      moduleActive ? `text-${module.color}-500` : 'text-gray-500'
                    }`} 
                  />
                  {isOpen && (
                    <div className="ml-3 flex-1 flex items-center justify-between">
                      <span className="font-semibold">{module.name}</span>
                      {moduleExpanded ? (
                        <ChevronUpIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                      )}
                    </div>
                  )}
                </button>

                {/* Module Items */}
                {isOpen && moduleExpanded && (
                  <div className="mt-2 space-y-1 pl-2">
                    {module.items.map(item => renderMenuItem(item))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Help Link */}
        <div className="px-4 pb-2">
          <Link
            to="/ajuda"
            className={`group flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
              isActive('/ajuda')
                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
            title={isOpen ? 'Central de Ajuda' : 'Ajuda'}
          >
            <QuestionMarkCircleIcon
              className={`flex-shrink-0 h-4 w-4 ${
                isActive('/ajuda') ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
              }`}
            />
            {isOpen && (
              <span className="ml-3">Ajuda</span>
            )}
          </Link>
        </div>

        {/* Footer */}
        {isOpen && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <div className="text-xs font-medium text-gray-900">LegaSys ERP</div>
              <div className="text-xs text-gray-500">Versão 6.2 - Modular</div>
              <div className="text-xs text-gray-400 mt-1">
                Usuário: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBarModular;