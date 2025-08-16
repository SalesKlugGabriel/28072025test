import React, { useState, useEffect } from 'react';
import { 
  Settings, CheckCircle, AlertCircle, Eye, EyeOff,
  BarChart, Zap, Smartphone, Play, Calendar, 
  DollarSign, Target, Users, TrendingUp
} from 'lucide-react';
import { useTrafegopagointegration, ConfiguracaoIntegracao, CampanhaTrafegoPago } from '../services/trafegopagointegration';

interface ConfiguracaoIntegracoesProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConfiguracaoIntegracoes: React.FC<ConfiguracaoIntegracoesProps> = ({ isOpen, onClose }) => {
  const [abaAtiva, setAbaAtiva] = useState<'configuracao' | 'campanhas' | 'relatorios'>('configuracao');
  const [plataformaSelecionada, setPlataformaSelecionada] = useState('facebook');
  const [configuracoes, setConfiguracoes] = useState<Record<string, ConfiguracaoIntegracao>>({});
  const [campanhas, setCampanhas] = useState<CampanhaTrafegoPago[]>([]);
  const [relatorios, setRelatorios] = useState<any>(null);
  const [mostrarToken, setMostrarToken] = useState<Record<string, boolean>>({});
  const [testando, setTestando] = useState<string | null>(null);

  const trafegoPago = useTrafegopagointegration();

  // Definições das plataformas
  const plataformas = [
    {
      id: 'facebook',
      nome: 'Facebook',
      icon: '📘',
      cor: 'bg-blue-500',
      descricao: 'Lead Ads e campanhas de tráfego',
      documentacao: 'https://developers.facebook.com/docs/marketing-api'
    },
    {
      id: 'instagram',
      nome: 'Instagram',
      icon: '📷',
      cor: 'bg-pink-500',
      descricao: 'Stories, posts e lead generation',
      documentacao: 'https://developers.facebook.com/docs/instagram-api'
    },
    {
      id: 'google',
      nome: 'Google Ads',
      icon: '🔍',
      cor: 'bg-green-500',
      descricao: 'Search, Display e YouTube Ads',
      documentacao: 'https://developers.google.com/google-ads/api'
    },
    {
      id: 'linkedin',
      nome: 'LinkedIn',
      icon: '💼',
      cor: 'bg-blue-600',
      descricao: 'Sponsored Content e Lead Gen Forms',
      documentacao: 'https://docs.microsoft.com/en-us/linkedin/marketing'
    },
    {
      id: 'youtube',
      nome: 'YouTube',
      icon: '📺',
      cor: 'bg-red-500',
      descricao: 'Video Ads e campanhas de brand',
      documentacao: 'https://developers.google.com/youtube/v3'
    },
    {
      id: 'tiktok',
      nome: 'TikTok',
      icon: '🎵',
      cor: 'bg-black',
      descricao: 'Video Ads e Spark Ads',
      documentacao: 'https://ads.tiktok.com/marketing_api/docs'
    }
  ];

  useEffect(() => {
    if (isOpen) {
      carregarDados();
    }
  }, [isOpen]);

  const carregarDados = async () => {
    try {
      const campanhasData = trafegoPago.obterCampanhas();
      setCampanhas(campanhasData);
      
      const relatoriosData = trafegoPago.obterRelatorio();
      setRelatorios(relatoriosData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const testarConexao = async (plataforma: string) => {
    setTestando(plataforma);
    
    try {
      const config = configuracoes[plataforma];
      if (!config) {
        alert('Configure a plataforma primeiro');
        return;
      }

      // Simular teste
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Importar campanhas de teste
      await trafegoPago.importarCampanhas(plataforma);
      await carregarDados();
      
      alert(`✅ Conexão com ${plataforma} testada com sucesso!`);
    } catch (error) {
      alert(`❌ Erro na conexão: ${error}`);
    } finally {
      setTestando(null);
    }
  };

  const salvarConfiguracao = async (plataforma: string, config: ConfiguracaoIntegracao) => {
    try {
      const sucesso = await trafegoPago.configurarPlataforma(plataforma, config);
      
      if (sucesso) {
        setConfiguracoes(prev => ({ ...prev, [plataforma]: config }));
        alert(`✅ Configuração de ${plataforma} salva com sucesso!`);
      } else {
        alert('❌ Erro ao salvar configuração');
      }
    } catch (error) {
      alert(`❌ Erro: ${error}`);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-100 text-green-800';
      case 'pausada': return 'bg-yellow-100 text-yellow-800';
      case 'finalizada': return 'bg-gray-100 text-gray-800';
      case 'rascunho': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Integrações de Tráfego Pago</h2>
                <p className="text-sm text-gray-600">Configure e gerencie suas campanhas publicitárias</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2">
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="flex mt-6 border-b border-gray-200">
            {[
              { key: 'configuracao', label: 'Configuração', icon: Settings },
              { key: 'campanhas', label: 'Campanhas', icon: Target },
              { key: 'relatorios', label: 'Relatórios', icon: BarChart }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setAbaAtiva(tab.key as any)}
                  className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                    abaAtiva === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[70vh]">
          {abaAtiva === 'configuracao' && (
            <>
              {/* Sidebar com plataformas */}
              <div className="w-1/3 border-r border-gray-200 p-4 overflow-y-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Plataformas</h3>
                <div className="space-y-2">
                  {plataformas.map(plataforma => {
                    const isConfigurada = configuracoes[plataforma.id]?.ativa;
                    
                    return (
                      <button
                        key={plataforma.id}
                        onClick={() => setPlataformaSelecionada(plataforma.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          plataformaSelecionada === plataforma.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{plataforma.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{plataforma.nome}</span>
                              {isConfigurada ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-yellow-600" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600">{plataforma.descricao}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Configuração da plataforma selecionada */}
              <div className="flex-1 p-6 overflow-y-auto">
                {(() => {
                  const plataforma = plataformas.find(p => p.id === plataformaSelecionada)!;
                  const config = configuracoes[plataformaSelecionada] || {
                    plataforma: plataformaSelecionada,
                    ativa: false,
                    credenciais: {},
                    webhookConfig: { url: '', eventos: [], verificacaoToken: '' },
                    mapeamentoCampos: {}
                  };

                  return (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{plataforma.icon}</span>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{plataforma.nome}</h3>
                          <p className="text-sm text-gray-600">{plataforma.descricao}</p>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">Como configurar:</h4>
                        <ol className="text-sm text-blue-800 space-y-1">
                          <li>1. Acesse o painel de desenvolvedor da plataforma</li>
                          <li>2. Crie uma nova aplicação ou use uma existente</li>
                          <li>3. Configure as permissões necessárias</li>
                          <li>4. Copie as credenciais abaixo</li>
                          <li>5. Configure o webhook URL no painel da plataforma</li>
                        </ol>
                        <a
                          href={plataforma.documentacao}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 text-blue-600 hover:text-blue-800"
                        >
                          📖 Ver documentação
                        </a>
                      </div>

                      {/* Configuração de credenciais */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Credenciais de API</h4>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Access Token *
                          </label>
                          <div className="relative">
                            <input
                              type={mostrarToken[plataformaSelecionada] ? 'text' : 'password'}
                              value={config.credenciais.accessToken || ''}
                              onChange={(e) => {
                                setConfiguracoes(prev => ({
                                  ...prev,
                                  [plataformaSelecionada]: {
                                    ...config,
                                    credenciais: {
                                      ...config.credenciais,
                                      accessToken: e.target.value
                                    }
                                  }
                                }));
                              }}
                              className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="Cole seu access token aqui"
                            />
                            <button
                              type="button"
                              onClick={() => setMostrarToken(prev => ({
                                ...prev,
                                [plataformaSelecionada]: !prev[plataformaSelecionada]
                              }))}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {mostrarToken[plataformaSelecionada] ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {(plataformaSelecionada === 'facebook' || plataformaSelecionada === 'instagram') && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                App ID
                              </label>
                              <input
                                type="text"
                                value={config.credenciais.appId || ''}
                                onChange={(e) => {
                                  setConfiguracoes(prev => ({
                                    ...prev,
                                    [plataformaSelecionada]: {
                                      ...config,
                                      credenciais: {
                                        ...config.credenciais,
                                        appId: e.target.value
                                      }
                                    }
                                  }));
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="ID da sua aplicação Facebook"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account ID
                              </label>
                              <input
                                type="text"
                                value={config.credenciais.accountId || ''}
                                onChange={(e) => {
                                  setConfiguracoes(prev => ({
                                    ...prev,
                                    [plataformaSelecionada]: {
                                      ...config,
                                      credenciais: {
                                        ...config.credenciais,
                                        accountId: e.target.value
                                      }
                                    }
                                  }));
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="ID da conta de anúncios"
                              />
                            </div>
                          </>
                        )}
                      </div>

                      {/* Ações */}
                      <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => salvarConfiguracao(plataformaSelecionada, config)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                          <Settings className="w-4 h-4" />
                          Salvar Configuração
                        </button>
                        
                        <button
                          onClick={() => testarConexao(plataformaSelecionada)}
                          disabled={testando === plataformaSelecionada}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                        >
                          {testando === plataformaSelecionada ? (
                            <>
                              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                              Testando...
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4" />
                              Testar Conexão
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </>
          )}

          {abaAtiva === 'campanhas' && (
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Campanhas Ativas</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  + Nova Campanha
                </button>
              </div>

              {campanhas.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma campanha encontrada</h3>
                  <p className="text-gray-600">Configure as integrações para ver suas campanhas aqui</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {campanhas.map(campanha => (
                    <div key={campanha.id} className="bg-gray-50 rounded-lg p-4 border">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{campanha.nome}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-600 capitalize">{campanha.plataforma}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campanha.status)}`}>
                              {campanha.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Orçamento Diário</div>
                          <div className="font-medium text-gray-900">{formatCurrency(campanha.orcamento.diario)}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Impressões</div>
                          <div className="font-medium">{campanha.metricas.impressoes.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Cliques</div>
                          <div className="font-medium">{campanha.metricas.cliques.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Leads</div>
                          <div className="font-medium text-green-600">{campanha.metricas.leads}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">CTR</div>
                          <div className="font-medium">{campanha.metricas.ctr.toFixed(2)}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {abaAtiva === 'relatorios' && (
            <div className="flex-1 p-6 overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Relatórios de Performance</h3>

              {relatorios ? (
                <div className="space-y-6">
                  {/* Resumo geral */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Target className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-blue-600">Campanhas Ativas</p>
                          <p className="text-xl font-bold text-blue-900">{relatorios.resumo.campanhasAtivas}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Users className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-green-600">Total de Leads</p>
                          <p className="text-xl font-bold text-green-900">{relatorios.resumo.totalLeads}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <DollarSign className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm text-yellow-600">Gasto Total</p>
                          <p className="text-xl font-bold text-yellow-900">{formatCurrency(relatorios.resumo.totalGasto)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <TrendingUp className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-purple-600">CPL Médio</p>
                          <p className="text-xl font-bold text-purple-900">{formatCurrency(relatorios.resumo.cplMedio)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance por plataforma */}
                  <div className="bg-white rounded-lg border p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Performance por Plataforma</h4>
                    <div className="space-y-3">
                      {Object.entries(relatorios.porPlataforma).map(([plataforma, metricas]: [string, any]) => (
                        <div key={plataforma} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">
                              {plataformas.find(p => p.id === plataforma)?.icon || '📊'}
                            </span>
                            <div>
                              <div className="font-medium text-gray-900 capitalize">{plataforma}</div>
                              <div className="text-sm text-gray-600">
                                {metricas.campanhas} campanha(s)
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">{metricas.leads} leads</div>
                            <div className="text-sm text-gray-600">{formatCurrency(metricas.gasto)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum dado disponível</h3>
                  <p className="text-gray-600">Configure as integrações e execute campanhas para ver relatórios</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfiguracaoIntegracoes;