import React, { useState, useMemo } from 'react';
import {
  ChartBarIcon,
  DocumentChartBarIcon,
  CalendarDaysIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  PhoneIcon,
  MagnifyingGlassIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';

import { useAuth, usePermissions } from '../context/auth-context';
import { 
  TipoRelatorio, 
  CONFIGURACOES_RELATORIOS, 
  FiltrosRelatorio,
  PeriodoAnalise 
} from '../types/relatorios';
import { relatoriosService, DadosRelatorio, FormatoExportacao } from '../services/relatoriosService';

// Ícone simples para activity (não existe no heroicons)
const ActivityIcon = ChartBarIcon;

// Mapeamento de ícones
const iconMap: Record<string, React.ComponentType<any>> = {
  activity: ActivityIcon,
  'file-check': DocumentChartBarIcon,
  phone: PhoneIcon,
  search: MagnifyingGlassIcon,
  'user-plus': UserPlusIcon,
  'trending-up': ArrowTrendingUpIcon,
  'dollar-sign': CurrencyDollarIcon,
  percent: ArrowTrendingUpIcon,
  'bar-chart': ChartBarIcon
};

const Relatorios: React.FC = () => {
  const { usuario, perfil } = useAuth();
  const { hasPermission } = usePermissions();
  
  const [relatorioSelecionado, setRelatorioSelecionado] = useState<TipoRelatorio | null>(null);
  const [dadosRelatorio, setDadosRelatorio] = useState<DadosRelatorio | null>(null);
  const [filtros, setFiltros] = useState<FiltrosRelatorio>({
    dataInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dataFim: new Date().toISOString().split('T')[0],
    corretor: [],
    empreendimento: [],
    fonte: [],
    status: []
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [carregandoRelatorio, setCarregandoRelatorio] = useState(false);

  // Filtrar relatórios baseado no perfil do usuário
  const relatoriosDisponiveis = useMemo(() => {
    if (!perfil) return [];
    
    return Object.values(CONFIGURACOES_RELATORIOS).filter(config => 
      config.permissoes.includes(perfil)
    );
  }, [perfil]);

  // Organizar relatórios por categoria
  const relatoriosPorCategoria = useMemo(() => {
    const categorias: Record<string, typeof relatoriosDisponiveis> = {
      crm: [],
      vendas: [],
      financeiro: [],
      operacional: []
    };

    relatoriosDisponiveis.forEach(relatorio => {
      categorias[relatorio.categoria].push(relatorio);
    });

    return categorias;
  }, [relatoriosDisponiveis]);

  // Gerar relatório
  const gerarRelatorio = async (tipo: TipoRelatorio) => {
    setCarregandoRelatorio(true);
    setRelatorioSelecionado(tipo);
    setDadosRelatorio(null);

    try {
      const dados = await relatoriosService.gerarDadosRelatorio(tipo, filtros);
      setDadosRelatorio(dados);
      console.log('Relatório gerado com sucesso:', dados);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setCarregandoRelatorio(false);
    }
  };

  // Exportar relatório
  const exportarRelatorio = async (formato: FormatoExportacao) => {
    if (!dadosRelatorio) {
      alert('Gere um relatório antes de exportar');
      return;
    }

    try {
      await relatoriosService.exportarRelatorio(dadosRelatorio, formato);
      console.log(`Relatório exportado em ${formato}`);
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      alert('Erro ao exportar relatório. Tente novamente.');
    }
  };

  // Aplicar filtro rápido de período
  const aplicarPeriodoRapido = (dias: number) => {
    const dataFim = new Date();
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - dias);

    setFiltros(prev => ({
      ...prev,
      dataInicio: dataInicio.toISOString().split('T')[0],
      dataFim: dataFim.toISOString().split('T')[0]
    }));
  };

  const getCategoriaInfo = (categoria: string) => {
    const infos = {
      crm: { 
        titulo: 'CRM e Leads', 
        cor: 'bg-blue-50 border-blue-200', 
        icone: UserGroupIcon,
        corIcone: 'text-blue-600'
      },
      vendas: { 
        titulo: 'Vendas', 
        cor: 'bg-green-50 border-green-200', 
        icone: ArrowTrendingUpIcon,
        corIcone: 'text-green-600'
      },
      financeiro: { 
        titulo: 'Financeiro', 
        cor: 'bg-yellow-50 border-yellow-200', 
        icone: CurrencyDollarIcon,
        corIcone: 'text-yellow-600'
      },
      operacional: { 
        titulo: 'Operacional', 
        cor: 'bg-purple-50 border-purple-200', 
        icone: ClockIcon,
        corIcone: 'text-purple-600'
      }
    };
    return infos[categoria as keyof typeof infos];
  };

  if (!hasPermission('relatorios')) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <DocumentChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Acesso Negado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Você não tem permissão para acessar os relatórios.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header Fixo */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600">
              Análises e indicadores de performance - Perfil: {perfil?.toUpperCase()}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Período Rápido */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => aplicarPeriodoRapido(7)}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                7 dias
              </button>
              <button
                onClick={() => aplicarPeriodoRapido(30)}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                30 dias
              </button>
              <button
                onClick={() => aplicarPeriodoRapido(90)}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                90 dias
              </button>
            </div>

            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className={`btn-outline flex items-center space-x-2 ${mostrarFiltros ? 'bg-blue-50 border-blue-300' : ''}`}
            >
              <FunnelIcon className="w-4 h-4" />
              <span>Filtros</span>
            </button>
          </div>
        </div>

        {/* Filtros Expandidos */}
        {mostrarFiltros && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
                <input
                  type="date"
                  value={filtros.dataInicio}
                  onChange={(e) => setFiltros(prev => ({ ...prev, dataInicio: e.target.value }))}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
                <input
                  type="date"
                  value={filtros.dataFim}
                  onChange={(e) => setFiltros(prev => ({ ...prev, dataFim: e.target.value }))}
                  className="form-input"
                />
              </div>
              
              {/* Filtros específicos baseados no perfil */}
              {(perfil === 'gerente' || perfil === 'administrador') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Corretor</label>
                  <select 
                    className="form-input"
                    onChange={(e) => {
                      const valor = e.target.value;
                      setFiltros(prev => ({
                        ...prev,
                        corretor: valor ? [valor] : []
                      }));
                    }}
                  >
                    <option value="">Todos os corretores</option>
                    <option value="user_corretor_1">Carlos Vendedor</option>
                    <option value="user_corretor_2">Ana Corretora</option>
                    <option value="user_corretor_3">João Vendas</option>
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empreendimento</label>
                <select 
                  className="form-input"
                  onChange={(e) => {
                    const valor = e.target.value;
                    setFiltros(prev => ({
                      ...prev,
                      empreendimento: valor ? [valor] : []
                    }));
                  }}
                >
                  <option value="">Todos os empreendimentos</option>
                  <option value="emp_1">Residencial Jardim das Flores</option>
                  <option value="emp_2">Edifício Harmony</option>
                  <option value="emp_3">Condomínio Vista Verde</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setFiltros({
                  dataInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  dataFim: new Date().toISOString().split('T')[0],
                  corretor: [],
                  empreendimento: [],
                  fonte: [],
                  status: []
                })}
                className="btn-outline mr-2"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Cards de Relatórios por Categoria */}
          {Object.entries(relatoriosPorCategoria).map(([categoria, relatorios]) => {
            if (relatorios.length === 0) return null;
            
            const categoriaInfo = getCategoriaInfo(categoria);
            const IconeCategoria = categoriaInfo.icone;
            
            return (
              <div key={categoria} className="mb-8">
                <div className="flex items-center mb-4">
                  <div className={`p-2 rounded-lg ${categoriaInfo.cor}`}>
                    <IconeCategoria className={`w-6 h-6 ${categoriaInfo.corIcone}`} />
                  </div>
                  <div className="ml-3">
                    <h2 className="text-lg font-semibold text-gray-900">{categoriaInfo.titulo}</h2>
                    <p className="text-sm text-gray-600">{relatorios.length} relatório(s) disponível(veis)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatorios.map(relatorio => {
                    const IconeRelatorio = iconMap[relatorio.icone] || ChartBarIcon;
                    const isCarregando = carregandoRelatorio && relatorioSelecionado === relatorio.id;
                    
                    return (
                      <div key={relatorio.id} className="card card-hover p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <div className="p-3 bg-gray-100 rounded-lg">
                              <IconeRelatorio className="w-6 h-6 text-gray-600" />
                            </div>
                            <div className="ml-4">
                              <h3 className="text-lg font-semibold text-gray-900">{relatorio.titulo}</h3>
                              <p className="text-sm text-gray-600">{relatorio.descricao}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {relatorio.formatosExportacao.map(formato => (
                              <span key={formato} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {formato.toUpperCase()}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => gerarRelatorio(relatorio.id)}
                              disabled={isCarregando}
                              className="btn-primary text-sm px-3 py-1 flex items-center space-x-1"
                            >
                              {isCarregando ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  <span>Gerando...</span>
                                </>
                              ) : (
                                <>
                                  <EyeIcon className="w-4 h-4" />
                                  <span>Gerar</span>
                                </>
                              )}
                            </button>

                            {relatorio.formatosExportacao.length > 0 && (
                              <div className="relative">
                                <button className="btn-outline text-sm px-3 py-1 flex items-center space-x-1">
                                  <ArrowDownTrayIcon className="w-4 h-4" />
                                  <span>Exportar</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {relatorio.atualizacaoAutomatica && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center text-sm text-green-600">
                              <ClockIcon className="w-4 h-4 mr-1" />
                              Atualização automática ativa
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Resultados do Relatório */}
          {dadosRelatorio && (
            <div className="mt-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Header do Relatório */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{dadosRelatorio.titulo}</h3>
                      <p className="text-sm text-gray-500">{dadosRelatorio.periodo}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => exportarRelatorio('csv')}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        <span>CSV</span>
                      </button>
                      <button
                        onClick={() => exportarRelatorio('excel')}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        <span>Excel</span>
                      </button>
                      <button
                        onClick={() => exportarRelatorio('pdf')}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Resumo */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{dadosRelatorio.resumo.total}</div>
                      <div className="text-sm text-gray-500">Total de Registros</div>
                    </div>
                    {dadosRelatorio.resumo.valor && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {relatoriosService.formatarMoeda(dadosRelatorio.resumo.valor)}
                        </div>
                        <div className="text-sm text-gray-500">Valor Total</div>
                      </div>
                    )}
                    {dadosRelatorio.resumo.comparativo && (
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${
                          dadosRelatorio.resumo.comparativo.percentual >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {dadosRelatorio.resumo.comparativo.percentual >= 0 ? '+' : ''}
                          {dadosRelatorio.resumo.comparativo.percentual.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-500">vs Período Anterior</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dados */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {dadosRelatorio.dados.length > 0 && Object.keys(dadosRelatorio.dados[0]).map((chave) => (
                          <th
                            key={chave}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {chave.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dadosRelatorio.dados.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {Object.values(item).map((valor, valueIndex) => (
                            <td key={valueIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {typeof valor === 'number' && valor > 1000 ? 
                                (valor.toString().includes('.') ? 
                                  relatoriosService.formatarPercentual(valor) : 
                                  valor.toLocaleString('pt-BR')) : 
                                String(valor)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {relatoriosDisponiveis.length === 0 && (
            <div className="text-center py-12">
              <DocumentChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum relatório disponível</h3>
              <p className="mt-1 text-sm text-gray-500">
                Não há relatórios disponíveis para seu perfil de acesso.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Relatorios;