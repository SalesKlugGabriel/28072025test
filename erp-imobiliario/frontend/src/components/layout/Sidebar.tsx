import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  BuildingOffice2Icon,
  ChatBubbleLeftRightIcon,
  ScaleIcon,
  BanknotesIcon,
  ShoppingCartIcon,
  WrenchScrewdriverIcon,
  PencilSquareIcon,
  ShieldCheckIcon,
  CogIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  userRole: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, userRole }) => {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      current: location.pathname === '/dashboard',
      roles: ['admin', 'gerente', 'corretor', 'engenheiro', 'arquiteto', 'juridico', 'financeiro']
    },
    {
      name: 'Pessoas',
      href: '/pessoas',
      icon: UserGroupIcon,
      current: location.pathname.startsWith('/pessoas'),
      roles: ['admin', 'gerente', 'corretor', 'juridico', 'financeiro'],
      submenu: [
        { name: 'Clientes', href: '/pessoas/clientes' },
        { name: 'Leads', href: '/pessoas/leads' },
        { name: 'Fornecedores', href: '/pessoas/fornecedores' },
        { name: 'Colaboradores', href: '/pessoas/colaboradores' }
      ]
    },
    {
      name: 'Empreendimentos',
      href: '/empreendimentos',
      icon: BuildingOffice2Icon,
      current: location.pathname.startsWith('/empreendimentos'),
      roles: ['admin', 'gerente', 'corretor', 'engenheiro', 'arquiteto'],
      submenu: [
        { name: 'Construtora', href: '/empreendimentos/construtora' },
        { name: 'Terceiros', href: '/empreendimentos/terceiros' },
        { name: 'Outros Imóveis', href: '/empreendimentos/outros' },
        { name: 'Para Aluguel', href: '/empreendimentos/aluguel' }
      ]
    },
    {
      name: 'CRM',
      href: '/crm',
      icon: ChatBubbleLeftRightIcon,
      current: location.pathname.startsWith('/crm'),
      roles: ['admin', 'gerente', 'corretor'],
      submenu: [
        { name: 'Pipeline', href: '/crm/pipeline' },
        { name: 'Chat WhatsApp', href: '/crm/chat' },
        { name: 'Propostas', href: '/crm/propostas' }
      ]
    },
    {
      name: 'Jurídico',
      href: '/juridico',
      icon: ScaleIcon,
      current: location.pathname.startsWith('/juridico'),
      roles: ['admin', 'gerente', 'juridico'],
      submenu: [
        { name: 'Contratos', href: '/juridico/contratos' },
        { name: 'Minutas', href: '/juridico/minutas' },
        { name: 'Vencimentos', href: '/juridico/vencimentos' }
      ]
    },
    {
      name: 'Financeiro',
      href: '/financeiro',
      icon: BanknotesIcon,
      current: location.pathname.startsWith('/financeiro'),
      roles: ['admin', 'gerente', 'financeiro'],
      submenu: [
        { name: 'Contas a Receber', href: '/financeiro/receber' },
        { name: 'Contas a Pagar', href: '/financeiro/pagar' },
        { name: 'Conciliação', href: '/financeiro/conciliacao' },
        { name: 'Comissões', href: '/financeiro/comissoes' }
      ]
    },
    {
      name: 'Compras',
      href: '/compras',
      icon: ShoppingCartIcon,
      current: location.pathname.startsWith('/compras'),
      roles: ['admin', 'gerente', 'engenheiro'],
      submenu: [
        { name: 'Requisições', href: '/compras/requisicoes' },
        { name: 'Cotações', href: '/compras/cotacoes' },
        { name: 'Pedidos', href: '/compras/pedidos' }
      ]
    },
    {
      name: 'Engenharia',
      href: '/engenharia',
      icon: WrenchScrewdriverIcon,
      current: location.pathname.startsWith('/engenharia'),
      roles: ['admin', 'gerente', 'engenheiro'],
      submenu: [
        { name: 'Obras', href: '/engenharia/obras' },
        { name: 'Diário', href: '/engenharia/diario' },
        { name: 'Medições', href: '/engenharia/medicoes' }
      ]
    },
    {
      name: 'Arquitetura',
      href: '/arquitetura',
      icon: PencilSquareIcon,
      current: location.pathname.startsWith('/arquitetura'),
      roles: ['admin', 'gerente', 'arquiteto', 'engenheiro'],
      submenu: [
        { name: 'Projetos', href: '/arquitetura/projetos' },
        { name: 'Revisões', href: '/arquitetura/revisoes' },
        { name: 'Aprovações', href: '/arquitetura/aprovacoes' }
      ]
    },
    {
      name: 'Pós-venda',
      href: '/pos-venda',
      icon: ShieldCheckIcon,
      current: location.pathname.startsWith('/pos-venda'),
      roles: ['admin', 'gerente', 'engenheiro'],
      submenu: [
        { name: 'Chamados', href: '/pos-venda/chamados' },
        { name: 'Garantias', href: '/pos-venda/garantias' },
        { name: 'Manutenções', href: '/pos-venda/manutencoes' }
      ]
    },
    {
      name: 'Configurações',
      href: '/configuracoes',
      icon: CogIcon,
      current: location.pathname === '/configuracoes',
      roles: ['admin']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <div className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      <div className="flex h-full flex-col bg-white border-r border-gray-200 shadow-lg">
        {/* Logo and Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {isOpen && (
            <div className="flex items-center">
              <BuildingOffice2Icon className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">LegaSys ERP</span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? (
              <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronRightIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <div className="space-y-1">
            {filteredMenuItems.map((item) => (
              <div key={item.name}>
                <Link
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    item.current
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {isOpen && item.name}
                </Link>

                {/* Submenu */}
                {isOpen && item.submenu && item.current && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.href}
                        className={`block px-2 py-1 text-xs rounded-md transition-colors ${
                          location.pathname === subItem.href
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              LegaSys ERP v6.1
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;