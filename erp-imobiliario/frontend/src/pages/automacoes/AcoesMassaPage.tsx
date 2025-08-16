import React, { useState, useEffect } from 'react';
import {
  TagIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  PlusIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ArchiveBoxIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useBulkActions } from '../../services/bulkActionsService';

const AcoesMassaPage: React.FC = () => {
  const bulkActions = useBulkActions();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'acoes' | 'execucoes' | 'historico'>('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [actions, setActions] = useState<any[]>([]);
  const [executions, setExecutions] = useState<any[]>([]);
  const [runningExecutions, setRunningExecutions] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setStats(bulkActions.getStatistics());
    setActions(bulkActions.getActions());
    setExecutions(bulkActions.getExecutions());
    setRunningExecutions(bulkActions.getRunningExecutions());
  };

  const getActionIcon = (category: string) => {
    switch (category) {
      case 'stage':
        return <TagIcon className="h-5 w-5" />;
      case 'communication':
        return <EnvelopeIcon className="h-5 w-5" />;
      case 'assignment':
        return <TagIcon className="h-5 w-5" />;
      case 'data':
        return <DocumentTextIcon className="h-5 w-5" />;
      case 'export':
        return <DocumentTextIcon className="h-5 w-5" />;
      case 'delete':
        return <TrashIcon className="h-5 w-5" />;
      default:
        return <TagIcon className="h-5 w-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'running':
        return <PlayIcon className="h-5 w-5 text-blue-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <StopIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'stage':
        return 'bg-blue-100 text-blue-800';
      case 'communication':
        return 'bg-green-100 text-green-800';
      case 'assignment':
        return 'bg-purple-100 text-purple-800';
      case 'data':
        return 'bg-yellow-100 text-yellow-800';
      case 'export':
        return 'bg-indigo-100 text-indigo-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
    { key: 'acoes', label: 'Ações Disponíveis', icon: TagIcon },
    { key: 'execucoes', label: 'Execuções Ativas', icon: PlayIcon },
    { key: 'historico', label: 'Histórico', icon: ClockIcon }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <TagIcon className="h-8 w-8 text-blue-600 mr-3" />
              Ações em Massa
            </h1>
            <p className="mt-2 text-gray-600">
              Execute operações em lote para leads e clientes com eficiência e controle
            </p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
            <PlusIcon className="h-5 w-5 mr-2" />
            Nova Execução
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TagIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Execuções</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Concluídas</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <PlayIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Em Execução</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.running}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ChartBarIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Taxa de Sucesso</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.successRate?.toFixed(1) || 0}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ações Mais Usadas */}
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Mais Utilizadas</h3>
            <div className="space-y-3">
              {stats?.actionUsage?.slice(0, 5).map((action: any) => (
                <div key={action.actionId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                      {getActionIcon('stage')}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{action.actionName}</p>
                      <p className="text-sm text-gray-600">ID: {action.actionId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{action.count}</p>
                    <p className="text-sm text-gray-600">execuções</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Execuções Ativas */}
          {runningExecutions.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Execuções em Andamento</h3>
              <div className="space-y-4">
                {runningExecutions.map((execution) => (
                  <div key={execution.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        {getStatusIcon(execution.status)}
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">Execução #{execution.id.slice(-6)}</p>
                          <p className="text-sm text-gray-600">Ação: {execution.actionId}</p>
                        </div>
                      </div>
                      <button className="text-red-600 hover:text-red-800">
                        <StopIcon className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progresso</span>
                        <span>{execution.progress.processed}/{execution.progress.total}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(execution.progress.processed / execution.progress.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Sucessos:</span>
                        <span className="ml-2 text-green-600 font-medium">{execution.progress.successful}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Falhas:</span>
                        <span className="ml-2 text-red-600 font-medium">{execution.progress.failed}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Início:</span>
                        <span className="ml-2 font-medium">
                          {new Date(execution.startTime).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'acoes' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Disponíveis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {actions.map((action) => (
                <div key={action.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-100 rounded-lg mr-3">
                        {getActionIcon(action.category)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{action.name}</h4>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getCategoryColor(action.category)}`}>
                          {action.category}
                        </span>
                      </div>
                    </div>
                    <span className="text-2xl">{action.icon}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">
                      Max: {action.maxItems || 'Ilimitado'} itens
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      Executar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'execucoes' && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Execuções Ativas</h3>
          {runningExecutions.length > 0 ? (
            <div className="space-y-4">
              {runningExecutions.map((execution) => (
                <div key={execution.id} className="border rounded-lg p-4">
                  {/* Mesma estrutura do dashboard */}
                  <p>Execução: {execution.id}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Nenhuma execução ativa no momento.</p>
          )}
        </div>
      )}

      {activeTab === 'historico' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Execuções</h3>
            <div className="space-y-3">
              {executions.map((execution) => (
                <div key={execution.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    {getStatusIcon(execution.status)}
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">#{execution.id.slice(-6)}</p>
                      <p className="text-sm text-gray-600">{execution.actionId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {execution.progress.successful}/{execution.progress.total} sucessos
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(execution.startTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcoesMassaPage;