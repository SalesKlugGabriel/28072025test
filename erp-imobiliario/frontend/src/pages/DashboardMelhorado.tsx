import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  BuildingOffice2Icon,
  ScaleIcon,
  ArrowPathIcon,
  BellIcon,
  TagIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  CalendarIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  ComputerDesktopIcon,
  BeakerIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { marketDataService } from '../services/marketDataService';

const DashboardMelhorado: React.FC = () => {
  const [stats, setStats] = useState({
    leads: { total: 47, novosHoje: 5, conversao: 18.5 },
    whatsapp: { mensagens: 124, conversas: 23, pendentes: 3 },
    juridico: { contratos: 12, vencimentos: 3, minutas: 8 },
    automacoes: { notificacoes: 89, distribuicoes: 34, acoes: 12 }
  });
  
  const [marketData, setMarketData] = useState<any[]>([]);
  const [selectedSector, setSelectedSector] = useState<string>('agronegocio');

  useEffect(() => {
    // Iniciar atualizações em tempo real dos dados de mercado
    const unsubscribe = marketDataService.subscribe((data) => {
      setMarketData(data);
    });

    // Iniciar atualizações automáticas a cada 30 segundos
    marketDataService.startRealTimeUpdates(30000);

    return () => {
      unsubscribe();
      marketDataService.stopRealTimeUpdates();
    };
  }, []);

  const quickActions = [
    {
      title: 'Novo Lead',
      description: 'Cadastrar novo cliente potencial',
      icon: UserGroupIcon,
      href: '/pessoas?action=novo&tipo=lead',
      color: 'bg-blue-500',
      shortcut: 'Ctrl+N'
    },
    {
      title: 'WhatsApp',
      description: 'Acessar chat integrado',
      icon: DevicePhoneMobileIcon,
      href: '/whatsapp',
      color: 'bg-green-500',
      badge: stats.whatsapp.pendentes > 0 ? stats.whatsapp.pendentes : undefined
    },
    {
      title: 'CRM Pipeline',
      description: 'Visualizar funil de vendas',
      icon: ChartBarIcon,
      href: '/crm',
      color: 'bg-purple-500'
    },
    {
      title: 'Automações',
      description: 'Gerenciar automações',
      icon: ArrowPathIcon,
      href: '/automacoes/notificacoes',
      color: 'bg-indigo-500'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'lead',
      message: 'Novo lead: Maria Silva interessada em apartamento',
      time: '5 min atrás',
      icon: UserGroupIcon,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'whatsapp',
      message: 'Mensagem WhatsApp de João Santos',
      time: '12 min atrás',
      icon: DevicePhoneMobileIcon,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'juridico',
      message: 'Contrato de venda assinado - Empreendimento Centro',
      time: '1 hora atrás',
      icon: ScaleIcon,
      color: 'text-red-600'
    },
    {
      id: 4,
      type: 'automacao',
      message: 'Distribuição automática de leads executada',
      time: '2 horas atrás',
      icon: ArrowPathIcon,
      color: 'text-indigo-600'
    }
  ];

  const pendingTasks = [
    {
      id: 1,
      title: 'Follow-up com Ana Costa',
      priority: 'alta',
      dueDate: 'Hoje, 15:00',
      type: 'lead'
    },
    {
      id: 2,
      title: 'Revisar contrato Empreendimento Sul',
      priority: 'media',
      dueDate: 'Amanhã',
      type: 'juridico'
    },
    {
      id: 3,
      title: 'Configurar automação de boas-vindas',
      priority: 'baixa',
      dueDate: 'Esta semana',
      type: 'automacao'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'text-red-600 bg-red-100';
      case 'media': return 'text-yellow-600 bg-yellow-100';
      case 'baixa': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (value: number, unit: string) => {
    if (unit === 'R$' || unit.includes('R$')) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    }
    if (unit === 'USD' || unit.includes('USD')) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    }
    return `${value.toLocaleString('pt-BR')} ${unit}`;
  };

  const getTrendIcon = (percentual: number) => {
    if (percentual > 0.5) return ArrowUpIcon;
    if (percentual < -0.5) return ArrowDownIcon;
    return MinusIcon;
  };

  const getSectorIcon = (sectorId: string) => {
    switch (sectorId) {
      case 'agronegocio': return BeakerIcon;
      case 'tecnologia': return ComputerDesktopIcon;
      case 'financas': return CurrencyDollarIcon;
      case 'comercio_exterior': return GlobeAltIcon;
      default: return ChartBarIcon;
    }
  };

  const selectedMarketSector = marketData.find(sector => sector.id === selectedSector);

  const renderMarketOverview = () => {
    if (!marketData || marketData.length === 0) {
      return (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Relatórios de Mercado</h3>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <ChartBarIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Carregando dados de mercado...</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white p-6 rounded-lg shadow border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Relatórios de Mercado em Tempo Real</h3>
          <div className="flex items-center text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Atualização automática
          </div>
        </div>

        {/* Selector de Setores */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {marketData.map((sector) => {
            const SectorIcon = getSectorIcon(sector.id);
            const isSelected = selectedSector === sector.id;
            
            return (
              <button
                key={sector.id}
                onClick={() => setSelectedSector(sector.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <SectorIcon className="h-4 w-4" />
                <span className="font-medium">{sector.nome}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  sector.resumo.status === 'positivo' ? 'bg-green-100 text-green-700' :
                  sector.resumo.status === 'negativo' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {sector.resumo.performance > 0 ? '+' : ''}{sector.resumo.performance.toFixed(1)}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Indicadores do Setor Selecionado */}
        {selectedMarketSector && (
          <div>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">{selectedMarketSector.nome}</h4>
              <p className="text-sm text-gray-600 mb-3">{selectedMarketSector.descricao}</p>
              <div className="flex flex-wrap gap-2">
                {selectedMarketSector.resumo.principais.map((item: string, index: number) => (
                  <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedMarketSector.indicadores.map((indicator: any, index: number) => {
                const TrendIcon = getTrendIcon(indicator.percentual);
                
                return (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{indicator.icon}</span>
                        <span className="font-medium text-gray-900">{indicator.nome}</span>
                      </div>
                      <TrendIcon className={`h-4 w-4 ${indicator.cor}`} />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-xl font-bold text-gray-900">
                        {formatCurrency(indicator.valor, indicator.unidade)}
                      </div>
                      
                      <div className={`flex items-center gap-1 text-sm ${indicator.cor}`}>
                        <TrendIcon className="h-3 w-3" />
                        <span>
                          {indicator.percentual > 0 ? '+' : ''}{indicator.percentual.toFixed(2)}%
                        </span>
                        <span className="text-gray-500">
                          ({indicator.variacao > 0 ? '+' : ''}{indicator.variacao.toFixed(2)})
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        <div>{indicator.fonte}</div>
                        <div>Atualizado: {indicator.ultimaAtualizacao}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resumo de Performance */}
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-gray-900">Performance do Setor</h5>
                  <p className="text-sm text-gray-600">Variação média dos indicadores</p>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    selectedMarketSector.resumo.performance > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedMarketSector.resumo.performance > 0 ? '+' : ''}
                    {selectedMarketSector.resumo.performance.toFixed(2)}%
                  </div>
                  <div className={`text-sm font-medium ${
                    selectedMarketSector.resumo.status === 'positivo' ? 'text-green-600' :
                    selectedMarketSector.resumo.status === 'negativo' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {selectedMarketSector.resumo.status === 'positivo' ? 'Em alta' :
                     selectedMarketSector.resumo.status === 'negativo' ? 'Em baixa' : 'Estável'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Bem-vindo ao LegaSys ERP! 👋
        </h1>
        <p className="mt-2 text-gray-600">
          Aqui está um resumo das suas atividades e ferramentas principais
        </p>
      </div>

      {/* Market Summary Cards */}
      {marketData && marketData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {marketData.slice(0, 4).map((sector, index) => {
            const SectorIcon = getSectorIcon(sector.id);
            const mainIndicator = sector.indicadores[0];
            
            return (
              <div
                key={sector.id}
                className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg shadow border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedSector(sector.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <SectorIcon className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900 text-sm">{sector.nome}</span>
                  </div>
                  <span className="text-lg">{mainIndicator?.icon || '📊'}</span>
                </div>
                
                <div className="space-y-1">
                  <div className="text-lg font-bold text-gray-900">
                    {mainIndicator ? formatCurrency(mainIndicator.valor, mainIndicator.unidade) : 'N/A'}
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    sector.resumo.performance > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {sector.resumo.performance > 0 ? (
                      <ArrowUpIcon className="h-3 w-3" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3" />
                    )}
                    <span>
                      {sector.resumo.performance > 0 ? '+' : ''}{sector.resumo.performance.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {mainIndicator?.nome || sector.descricao}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link to="/crm" className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Leads</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.leads.total}</p>
              <p className="text-sm text-green-600">+{stats.leads.novosHoje} hoje</p>
            </div>
          </div>
        </Link>

        <Link to="/whatsapp" className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <DevicePhoneMobileIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">WhatsApp</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.whatsapp.conversas}</p>
              <p className="text-sm text-blue-600">{stats.whatsapp.mensagens} mensagens</p>
            </div>
          </div>
        </Link>

        <Link to="/juridico" className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <ScaleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Jurídico</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.juridico.contratos}</p>
              <p className="text-sm text-orange-600">{stats.juridico.vencimentos} vencimentos</p>
            </div>
          </div>
        </Link>

        <Link to="/automacoes/notificacoes" className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <ArrowPathIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Automações</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.automacoes.notificacoes}</p>
              <p className="text-sm text-purple-600">{stats.automacoes.distribuicoes} distribuições</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.href}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className={`p-2 rounded-lg ${action.color} mr-3 group-hover:scale-105 transition-transform`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{action.title}</p>
                      {action.badge && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {action.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{action.description}</p>
                    {action.shortcut && (
                      <p className="text-xs text-gray-400 mt-1">{action.shortcut}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white p-6 rounded-lg shadow border mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tarefas Pendentes</h3>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div key={task.id} className="flex items-center p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex items-center mt-1">
                      <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                      <p className="text-sm text-gray-600">{task.dueDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividades Recentes</h3>
            <div className="max-h-96 overflow-y-auto space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`p-2 rounded-lg bg-gray-100 mr-3`}>
                    <activity.icon className={`h-5 w-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Link 
                to="/automacoes/notificacoes" 
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Ver todas as atividades →
              </Link>
            </div>
          </div>

          {/* Market Reports */}
          <div className="mt-6">
            {renderMarketOverview()}
          </div>
        </div>
      </div>

      {/* Module Navigation */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Módulos do Sistema</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: 'Pessoas', href: '/pessoas', icon: UserGroupIcon, color: 'text-purple-600' },
            { name: 'Empreendimentos', href: '/empreendimentos', icon: BuildingOffice2Icon, color: 'text-blue-600' },
            { name: 'CRM', href: '/crm', icon: ChartBarIcon, color: 'text-green-600' },
            { name: 'WhatsApp', href: '/whatsapp', icon: DevicePhoneMobileIcon, color: 'text-green-500' },
            { name: 'Jurídico', href: '/juridico', icon: ScaleIcon, color: 'text-red-600' },
            { name: 'Relatórios', href: '/relatorios', icon: DocumentTextIcon, color: 'text-indigo-600' }
          ].map((module) => (
            <Link
              key={module.name}
              to={module.href}
              className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <module.icon className={`h-8 w-8 ${module.color} mb-2 group-hover:scale-110 transition-transform`} />
              <span className="text-sm font-medium text-gray-900">{module.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardMelhorado;