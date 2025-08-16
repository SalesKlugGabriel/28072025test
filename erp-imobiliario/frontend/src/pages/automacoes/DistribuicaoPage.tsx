import React, { useState, useEffect } from 'react';
import {
  ArrowPathIcon,
  UserGroupIcon,
  CogIcon,
  ChartBarIcon,
  PlayIcon,
  PauseIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TrophyIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useDistribuicaoLeads } from '../../services/distribuicaoLeadsService';

const DistribuicaoPage: React.FC = () => {
  const distribuicao = useDistribuicaoLeads();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'corretores' | 'regras' | 'historico'>('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [corretores, setCorretores] = useState<any[]>([]);
  const [regras, setRegras] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setStats(distribuicao.obterEstatisticas());
    setCorretores(distribuicao.obterCorretores());
    setRegras(distribuicao.obterRegras());
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <div className="h-3 w-3 bg-green-500 rounded-full"></div>;
      case 'ocupado':
        return <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>;
      case 'ausente':
        return <div className="h-3 w-3 bg-orange-500 rounded-full"></div>;
      case 'offline':
        return <div className="h-3 w-3 bg-red-500 rounded-full"></div>;
      default:
        return <div className="h-3 w-3 bg-gray-500 rounded-full"></div>;
    }
  };

  const getMetodoIcon = (metodo: string) => {
    switch (metodo) {
      case 'round_robin':
        return '🔄';
      case 'menor_carga':
        return '⚖️';
      case 'melhor_performance':
        return '🏆';
      case 'proximidade':
        return '📍';
      case 'especialidade':
        return '🎯';
      default:
        return '📋';
    }
  };

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
    { key: 'corretores', label: 'Corretores', icon: UserGroupIcon },
    { key: 'regras', label: 'Regras', icon: CogIcon },
    { key: 'historico', label: 'Histórico', icon: ClockIcon }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <ArrowPathIcon className="h-8 w-8 text-blue-600 mr-3" />
              Distribuição Automática de Leads
            </h1>
            <p className="mt-2 text-gray-600">
              Sistema inteligente de distribuição com múltiplos métodos e regras automáticas
            </p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
            <PlusIcon className="h-5 w-5 mr-2" />
            Nova Regra
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
                    <ArrowPathIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Distribuições</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.resumo?.totalDistribuicoes || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <UserGroupIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Corretores Online</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.resumo?.corretoresOnline || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <TrophyIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Taxa de Aceitação</p>
                    <p className="text-2xl font-semibold text-gray-900">{(stats.resumo?.taxaAceitacao || 0).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tempo Resposta Médio</p>
                    <p className="text-2xl font-semibold text-gray-900">{(stats.resumo?.tempoRespostaMedia || 0).toFixed(0)}min</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Performance por Corretor */}
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance dos Corretores</h3>
            <div className="space-y-4">
              {stats?.porCorretor?.slice(0, 5).map((corretor: any) => (
                <div key={corretor.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <div className="flex items-center mr-3">
                      {getStatusIcon(corretor.status)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{corretor.nome}</p>
                      <p className="text-sm text-gray-600">Leads ativos: {corretor.leadsAtivos}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-sm">
                      <span className="font-medium">{corretor.distribuicoesAceitas}</span>
                      <span className="text-gray-500">/{corretor.distribuicoesRecebidas} aceitas</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Taxa: {corretor.taxaAceitacao.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      Resp: {corretor.tempoRespostaMedia.toFixed(0)}min
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'corretores' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Corretores Cadastrados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {corretores.map((corretor) => (
                <div key={corretor.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <UserIcon className="h-8 w-8 text-gray-400 mr-2" />
                      <div>
                        <h4 className="font-medium text-gray-900">{corretor.nome}</h4>
                        <p className="text-sm text-gray-600">{corretor.email}</p>
                      </div>
                    </div>
                    {getStatusIcon(corretor.status)}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Leads Ativos:</span>
                      <span className="font-medium">{corretor.leadsAtivos}/{corretor.capacidadeMaxima}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Conversão:</span>
                      <span className="font-medium">{corretor.performance.conversaoMedia}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Satisfação:</span>
                      <span className="font-medium">{corretor.performance.satisfacaoCliente}/5</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-600">Especialidades:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {corretor.especialidades.map((esp: string) => (
                        <span key={esp} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {esp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'regras' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Regras de Distribuição</h3>
            <div className="space-y-4">
              {regras.map((regra) => (
                <div key={regra.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getMetodoIcon(regra.metodoDistribuicao)}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">{regra.nome}</h4>
                        <p className="text-sm text-gray-600">
                          Método: {regra.metodoDistribuicao.replace('_', ' ')} | 
                          Prioridade: {regra.prioridade}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      regra.ativa 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {regra.ativa ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Tentativas máximas:</span>
                      <span className="ml-2 font-medium">{regra.configuracoes.tentativasMaximas}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Tempo limite:</span>
                      <span className="ml-2 font-medium">{regra.configuracoes.tempoLimiteResposta}min</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'historico' && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Distribuições</h3>
          <p className="text-gray-600">Funcionalidade em desenvolvimento...</p>
        </div>
      )}
    </div>
  );
};

export default DistribuicaoPage;