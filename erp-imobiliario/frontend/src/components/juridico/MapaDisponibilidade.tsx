import React, { useState, useMemo } from 'react';
import { 
  BuildingOfficeIcon, 
  HomeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  InformationCircleIcon,
  CurrencyDollarIcon,
  UserIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { 
  MapaDisponibilidade, 
  UnidadeContrato, 
  DisponibilidadeUnidade
} from '../../types/juridico';

interface MapaDisponibilidadeProps {
  empreendimentos: MapaDisponibilidade[];
  onUnidadeSelect: (unidade: UnidadeContrato & DisponibilidadeUnidade) => void;
  onFiltroChange: (filtros: Record<string, unknown>) => void;
  filtros: Record<string, unknown>;
}

interface FiltrosAvancados {
  tipo: string[];
  status: string[];
  valorMin: string;
  valorMax: string;
  areaMin: string;
  areaMax: string;
  vagas: string;
  andar: string[];
  posicao: string[];
}

const MapaDisponibilidadeComponent: React.FC<MapaDisponibilidadeProps> = ({
  empreendimentos,
  onUnidadeSelect
}) => {
  const [empreendimentoSelecionado, setEmpreendimentoSelecionado] = useState<string>('');
  const [blocoSelecionado, setBlocoSelecionado] = useState<string>('');
  const [andarSelecionado, setAndarSelecionado] = useState<string>('');
  const [busca, setBusca] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtrosAvancados, setFiltrosAvancados] = useState<FiltrosAvancados>({
    tipo: [],
    status: [],
    valorMin: '',
    valorMax: '',
    areaMin: '',
    areaMax: '',
    vagas: '',
    andar: [],
    posicao: []
  });

  // Empreendimento atual selecionado
  const empreendimentoAtual = empreendimentos.find(emp => emp.empreendimentoId === empreendimentoSelecionado);

  // Filtrar unidades baseado nos filtros
  const unidadesFiltradas = useMemo(() => {
    if (!empreendimentoAtual) return [];

    return empreendimentoAtual.unidades.filter(unidade => {
      // Filtro de busca
      if (busca && !unidade.codigo.toLowerCase().includes(busca.toLowerCase()) &&
          !unidade.numero.toLowerCase().includes(busca.toLowerCase()) &&
          (!unidade.contrato || !unidade.contrato.cliente.toLowerCase().includes(busca.toLowerCase()))) {
        return false;
      }

      // Filtros avançados
      if (filtrosAvancados.tipo.length > 0 && !filtrosAvancados.tipo.includes(unidade.tipo)) {
        return false;
      }

      if (filtrosAvancados.status.length > 0 && !filtrosAvancados.status.includes(unidade.status)) {
        return false;
      }

      if (filtrosAvancados.valorMin && unidade.preco < parseFloat(filtrosAvancados.valorMin)) {
        return false;
      }

      if (filtrosAvancados.valorMax && unidade.preco > parseFloat(filtrosAvancados.valorMax)) {
        return false;
      }

      if (filtrosAvancados.areaMin && unidade.areaPrivativa < parseFloat(filtrosAvancados.areaMin)) {
        return false;
      }

      if (filtrosAvancados.areaMax && unidade.areaPrivativa > parseFloat(filtrosAvancados.areaMax)) {
        return false;
      }

      if (filtrosAvancados.vagas && unidade.vagas < parseInt(filtrosAvancados.vagas)) {
        return false;
      }

      if (filtrosAvancados.posicao.length > 0 && !filtrosAvancados.posicao.includes(unidade.posicao)) {
        return false;
      }

      // Filtro por bloco
      if (blocoSelecionado && unidade.bloco !== blocoSelecionado) {
        return false;
      }

      // Filtro por andar
      if (andarSelecionado && unidade.andar?.toString() !== andarSelecionado) {
        return false;
      }

      return true;
    });
  }, [empreendimentoAtual, busca, filtrosAvancados, blocoSelecionado, andarSelecionado]);

  // Obter cor da unidade baseada no status
  const getUnidadeColor = (unidade: UnidadeContrato & DisponibilidadeUnidade) => {
    switch (unidade.status) {
      case 'disponivel':
        return 'bg-green-100 border-green-400 hover:bg-green-200';
      case 'reservado':
        return 'bg-yellow-100 border-yellow-400 hover:bg-yellow-200';
      case 'vendido':
        return 'bg-blue-100 border-blue-400 hover:bg-blue-200';
      case 'entregue':
        return 'bg-gray-100 border-gray-400 hover:bg-gray-200';
      case 'bloqueado':
        return 'bg-red-100 border-red-400 hover:bg-red-200';
      default:
        return 'bg-gray-100 border-gray-300 hover:bg-gray-200';
    }
  };

  // Obter ícone do status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'disponivel':
        return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
      case 'reservado':
        return <ClockIcon className="w-4 h-4 text-yellow-600" />;
      case 'vendido':
        return <CurrencyDollarIcon className="w-4 h-4 text-blue-600" />;
      case 'entregue':
        return <HomeIcon className="w-4 h-4 text-gray-600" />;
      case 'bloqueado':
        return <XCircleIcon className="w-4 h-4 text-red-600" />;
      default:
        return <InformationCircleIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  // Formatação de moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header com seleção de empreendimento */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Mapa de Disponibilidade</h2>
          <p className="text-gray-600">Visualize contratos por empreendimento</p>
        </div>
        
        <select
          value={empreendimentoSelecionado}
          onChange={(e) => {
            setEmpreendimentoSelecionado(e.target.value);
            setBlocoSelecionado('');
            setAndarSelecionado('');
          }}
          className="form-input min-w-64"
        >
          <option value="">Selecione um empreendimento</option>
          {empreendimentos.map(emp => (
            <option key={emp.empreendimentoId} value={emp.empreendimentoId}>
              {emp.empreendimentoNome}
            </option>
          ))}
        </select>
      </div>

      {empreendimentoAtual && (
        <>
          {/* Estatísticas do empreendimento */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Disponíveis</p>
                  <p className="text-2xl font-bold text-green-900">{empreendimentoAtual.estatisticas.disponiveis}</p>
                </div>
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800">Reservados</p>
                  <p className="text-2xl font-bold text-yellow-900">{empreendimentoAtual.estatisticas.reservados}</p>
                </div>
                <ClockIcon className="w-8 h-8 text-yellow-600" />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">Vendidos</p>
                  <p className="text-2xl font-bold text-blue-900">{empreendimentoAtual.estatisticas.vendidos}</p>
                </div>
                <CurrencyDollarIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">Entregues</p>
                  <p className="text-2xl font-bold text-gray-900">{empreendimentoAtual.estatisticas.entregues}</p>
                </div>
                <HomeIcon className="w-8 h-8 text-gray-600" />
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-800">Valor Total</p>
                  <p className="text-lg font-bold text-purple-900">
                    {formatCurrency(empreendimentoAtual.estatisticas.valorTotalVendas)}
                  </p>
                </div>
                <BuildingOfficeIcon className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="card p-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Busca */}
              <div className="relative flex-1 min-w-64">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por código, número ou cliente..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="form-input pl-10"
                />
              </div>

              {/* Seleção de bloco */}
              <select
                value={blocoSelecionado}
                onChange={(e) => {
                  setBlocoSelecionado(e.target.value);
                  setAndarSelecionado('');
                }}
                className="form-input"
              >
                <option value="">Todos os blocos</option>
                {empreendimentoAtual.blocos.map(bloco => (
                  <option key={bloco.id} value={bloco.nome}>
                    Bloco {bloco.nome}
                  </option>
                ))}
              </select>

              {/* Seleção de andar */}
              {blocoSelecionado && (
                <select
                  value={andarSelecionado}
                  onChange={(e) => setAndarSelecionado(e.target.value)}
                  className="form-input"
                >
                  <option value="">Todos os andares</option>
                  {Array.from({ length: empreendimentoAtual.blocos.find(b => b.nome === blocoSelecionado)?.andares || 0 }, (_, i) => i + 1).map(andar => (
                    <option key={andar} value={andar.toString()}>
                      Andar {andar}
                    </option>
                  ))}
                </select>
              )}

              {/* Filtros avançados */}
              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className={`btn-outline flex items-center ${mostrarFiltros ? 'bg-blue-50 border-blue-300' : ''}`}
              >
                <FunnelIcon className="w-4 h-4 mr-2" />
                Filtros
              </button>
            </div>

            {/* Filtros avançados expansível */}
            {mostrarFiltros && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <div className="space-y-1">
                      {['disponivel', 'reservado', 'vendido', 'entregue', 'bloqueado'].map(status => (
                        <label key={status} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filtrosAvancados.status.includes(status)}
                            onChange={(e) => {
                              const newStatus = e.target.checked
                                ? [...filtrosAvancados.status, status]
                                : filtrosAvancados.status.filter(s => s !== status);
                              setFiltrosAvancados(prev => ({ ...prev, status: newStatus }));
                            }}
                            className="rounded border-gray-300 mr-2"
                          />
                          <span className="text-sm capitalize">{status.replace('_', ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                    <div className="space-y-1">
                      {['apartamento', 'casa', 'loja', 'sala'].map(tipo => (
                        <label key={tipo} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filtrosAvancados.tipo.includes(tipo)}
                            onChange={(e) => {
                              const newTipo = e.target.checked
                                ? [...filtrosAvancados.tipo, tipo]
                                : filtrosAvancados.tipo.filter(t => t !== tipo);
                              setFiltrosAvancados(prev => ({ ...prev, tipo: newTipo }));
                            }}
                            className="rounded border-gray-300 mr-2"
                          />
                          <span className="text-sm capitalize">{tipo}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Mín"
                          value={filtrosAvancados.valorMin}
                          onChange={(e) => setFiltrosAvancados(prev => ({ ...prev, valorMin: e.target.value }))}
                          className="form-input"
                        />
                        <input
                          type="number"
                          placeholder="Máx"
                          value={filtrosAvancados.valorMax}
                          onChange={(e) => setFiltrosAvancados(prev => ({ ...prev, valorMax: e.target.value }))}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Área (m²)</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Mín"
                          value={filtrosAvancados.areaMin}
                          onChange={(e) => setFiltrosAvancados(prev => ({ ...prev, areaMin: e.target.value }))}
                          className="form-input"
                        />
                        <input
                          type="number"
                          placeholder="Máx"
                          value={filtrosAvancados.areaMax}
                          onChange={(e) => setFiltrosAvancados(prev => ({ ...prev, areaMax: e.target.value }))}
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setFiltrosAvancados({
                      tipo: [],
                      status: [],
                      valorMin: '',
                      valorMax: '',
                      areaMin: '',
                      areaMax: '',
                      vagas: '',
                      andar: [],
                      posicao: []
                    })}
                    className="btn-outline"
                  >
                    Limpar Filtros
                  </button>
                  <span className="text-sm text-gray-600">
                    {unidadesFiltradas.length} de {empreendimentoAtual.unidades.length} unidades
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Mapa de unidades */}
          <div className="card p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {unidadesFiltradas.map((unidade) => (
                <div
                  key={unidade.id}
                  onClick={() => onUnidadeSelect(unidade)}
                  className={`
                    relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-lg
                    ${getUnidadeColor(unidade)}
                  `}
                >
                  {/* Header da unidade */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900">{unidade.numero}</span>
                    {getStatusIcon(unidade.status)}
                  </div>

                  {/* Informações básicas */}
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipo:</span>
                      <span className="font-medium capitalize">{unidade.tipo}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Área:</span>
                      <span className="font-medium">{unidade.areaPrivativa}m²</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vagas:</span>
                      <span className="font-medium">{unidade.vagas}</span>
                    </div>

                    {unidade.bloco && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bloco:</span>
                        <span className="font-medium">{unidade.bloco}</span>
                      </div>
                    )}

                    {unidade.andar && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Andar:</span>
                        <span className="font-medium">{unidade.andar}º</span>
                      </div>
                    )}
                  </div>

                  {/* Preço */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(unidade.preco)}
                      </p>
                      {unidade.desconto && unidade.desconto > 0 && (
                        <p className="text-xs text-red-600">
                          Desconto: {formatCurrency(unidade.desconto)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Informações do contrato (se houver) */}
                  {unidade.contrato && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center mb-1">
                        <UserIcon className="w-3 h-3 mr-1 text-gray-500" />
                        <span className="text-xs text-gray-600 truncate">
                          {unidade.contrato.cliente}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {unidade.contrato.numero}
                        </span>
                        <div className="flex items-center">
                          <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500"
                              style={{ width: `${unidade.contrato.percentualPago}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600 ml-1">
                            {unidade.contrato.percentualPago}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Valorização */}
                  {unidade.percentualValorizacao !== 0 && (
                    <div className="absolute top-2 right-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        unidade.percentualValorizacao > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {unidade.percentualValorizacao > 0 ? '+' : ''}{unidade.percentualValorizacao.toFixed(1)}%
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Empty state */}
            {unidadesFiltradas.length === 0 && (
              <div className="text-center py-12">
                <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma unidade encontrada</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Tente ajustar os filtros de busca.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Estado inicial */}
      {!empreendimentoSelecionado && (
        <div className="card p-12 text-center">
          <BuildingOfficeIcon className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Selecione um Empreendimento</h3>
          <p className="mt-2 text-gray-600">
            Escolha um empreendimento acima para visualizar o mapa de disponibilidade e contratos.
          </p>
        </div>
      )}
    </div>
  );
};

export default MapaDisponibilidadeComponent;