import React, { useState, useEffect } from 'react';
import { 
  Eye, Clock, MousePointer, TrendingUp, Users, 
  Navigation, ExternalLink, Download, MessageCircle,
  BarChart, Activity, MapPin, Smartphone
} from 'lucide-react';
import { useTracking } from '../services/trackingService';

interface TrackingDashboardProps {
  corretorId?: string;
  clienteId?: string;
}

const TrackingDashboard: React.FC<TrackingDashboardProps> = ({ corretorId, clienteId }) => {
  const tracking = useTracking();
  const [estatisticasAtual, setEstatisticasAtual] = useState<any>(null);
  const [historico, setHistorico] = useState<any[]>([]);
  const [relatorio, setRelatorio] = useState<any>(null);
  const [atualizando, setAtualizando] = useState(false);

  useEffect(() => {
    if (corretorId) {
      tracking.configurarCorretor(corretorId, clienteId);
    }
    atualizarDados();
    
    // Atualizar a cada 10 segundos
    const interval = setInterval(atualizarDados, 10000);
    
    return () => clearInterval(interval);
  }, [corretorId, clienteId]);

  const atualizarDados = () => {
    setAtualizando(true);
    
    try {
      const stats = tracking.obterEstatisticas();
      const hist = tracking.obterHistorico(20);
      const rel = tracking.obterRelatorio();
      
      setEstatisticasAtual(stats);
      setHistorico(hist);
      setRelatorio(rel);
    } catch (error) {
      console.error('Erro ao atualizar dados de tracking:', error);
    } finally {
      setAtualizando(false);
    }
  };

  const formatarTempo = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  const getAcaoIcon = (tipo: string) => {
    switch (tipo) {
      case 'view': return <Eye className="w-4 h-4" />;
      case 'click_planta': return <BarChart className="w-4 h-4" />;
      case 'click_galeria': return <Eye className="w-4 h-4" />;
      case 'click_contato': return <MessageCircle className="w-4 h-4" />;
      case 'download_material': return <Download className="w-4 h-4" />;
      case 'interesse': return <TrendingUp className="w-4 h-4" />;
      case 'navegacao_relacionado': return <Navigation className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getAcaoTexto = (tipo: string) => {
    switch (tipo) {
      case 'view': return 'Visualizou página';
      case 'click_planta': return 'Visualizou planta';
      case 'click_galeria': return 'Abriu galeria';
      case 'click_contato': return 'Clicou em contato';
      case 'download_material': return 'Baixou material';
      case 'interesse': return 'Demonstrou interesse';
      case 'navegacao_relacionado': return 'Navegou para relacionado';
      default: return tipo;
    }
  };

  const getAcaoCor = (tipo: string) => {
    switch (tipo) {
      case 'view': return 'text-blue-600 bg-blue-100';
      case 'click_contato': return 'text-green-600 bg-green-100';
      case 'download_material': return 'text-purple-600 bg-purple-100';
      case 'interesse': return 'text-red-600 bg-red-100';
      case 'navegacao_relacionado': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Dashboard de Tracking</h2>
          <p className="text-sm text-gray-600">Acompanhe a navegação dos clientes em tempo real</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${atualizando ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
            <div className={`w-2 h-2 rounded-full ${atualizando ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span>{atualizando ? 'Atualizando...' : 'Online'}</span>
          </div>
          <button 
            onClick={atualizarDados}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Atualizar dados"
          >
            <Activity className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Resumo Geral */}
      {relatorio && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Total de Visitas</p>
                <p className="text-2xl font-bold text-blue-900">{relatorio.totalVisitas}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Tempo Médio</p>
                <p className="text-2xl font-bold text-green-900">{relatorio.duracaoMediaFormatada}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-purple-600 font-medium">Mais Visitado</p>
                <p className="text-lg font-bold text-purple-900 truncate">
                  {Object.keys(relatorio.empreendimentosMaisVisitados)[0] || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Navigation className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-orange-600 font-medium">Origem Principal</p>
                <p className="text-lg font-bold text-orange-900 capitalize truncate">
                  {Object.keys(relatorio.origemMaisComum)[0] || 'Direta'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sessão Atual */}
      {estatisticasAtual && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h3 className="font-semibold text-gray-900">Sessão Ativa</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Empreendimento</p>
              <p className="font-medium text-gray-900">{estatisticasAtual.empreendimento}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tempo na Página</p>
              <p className="font-medium text-green-600">{estatisticasAtual.duracaoAtual}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Ações Realizadas</p>
              <p className="font-medium text-blue-600">{estatisticasAtual.totalAcoes}</p>
            </div>
          </div>

          {estatisticasAtual.acoesRealizadas.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Últimas ações:</p>
              <div className="flex flex-wrap gap-2">
                {estatisticasAtual.acoesRealizadas.slice(-5).map((acao: string, index: number) => (
                  <span key={index} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getAcaoCor(acao)}`}>
                    {getAcaoIcon(acao)}
                    {getAcaoTexto(acao)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Histórico Recente */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Histórico Recente de Visitas
        </h3>

        {historico.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>Nenhuma visita registrada ainda</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {historico.map((visita, index) => (
              <div key={visita.timestamp} className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{visita.nomeEmpreendimento}</h4>
                    <p className="text-sm text-gray-600">{formatarTempo(visita.timestamp)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">
                      {visita.duracaoSegundos ? Math.floor(visita.duracaoSegundos / 60) : 0}m {visita.duracaoSegundos ? visita.duracaoSegundos % 60 : 0}s
                    </p>
                    <p className="text-xs text-gray-500">{visita.acoes.length} ações</p>
                  </div>
                </div>

                {visita.origemVisita?.empreendimentoAnterior && (
                  <div className="flex items-center gap-2 mb-2 text-sm text-orange-600">
                    <Navigation className="w-4 h-4" />
                    <span>Veio de: {visita.origemVisita.empreendimentoAnterior}</span>
                  </div>
                )}

                {visita.acoes.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {visita.acoes.slice(0, 8).map((acao, aIndex) => (
                      <span key={aIndex} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getAcaoCor(acao.tipo)}`}>
                        {getAcaoIcon(acao.tipo)}
                        <span className="hidden sm:inline">{getAcaoTexto(acao.tipo)}</span>
                      </span>
                    ))}
                    {visita.acoes.length > 8 && (
                      <span className="text-xs text-gray-500 px-2 py-1">
                        +{visita.acoes.length - 8} mais
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingDashboard;