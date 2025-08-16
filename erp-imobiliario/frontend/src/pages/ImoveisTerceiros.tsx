import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Filter, Home, MapPin, Eye, EyeOff,
  Edit, Trash2, DollarSign, Bed, Car, Users, 
  Phone, Mail, Share2, Heart, Calendar
} from 'lucide-react';
import { ImovelTerceiros, FiltrosImovelTerceiros } from '../types/imovelTerceiros';
import CadastroImovelTerceiros from '../components/CadastroImovelTerceiros';

// Mock data para demonstração
const mockImoveisTerceiros: ImovelTerceiros[] = [
  {
    id: '1',
    nomeEmpreendimento: 'Residencial Bella Vista',
    numeroUnidade: 'Torre A - 1502',
    metragem: 85,
    caracteristicas: {
      mobilia: 'parcialmente_mobiliado',
      churrasqueira: true,
      garagem: true,
      quantidadeQuartos: 3,
      quantidadeSuites: 1,
      lavabo: true,
      outrasCaracteristicas: ['Varanda', 'Ar Condicionado', 'Closet']
    },
    infraEmpreendimento: ['Piscina', 'Academia', 'Salão de Festas', 'Portaria 24h'],
    localizacao: {
      endereco: 'Rua das Palmeiras, 123, Centro, Florianópolis - SC',
      latitude: -27.5954,
      longitude: -48.5480,
      distanciaMarKm: 2.5
    },
    valor: 650000,
    detalhesNegociacao: {
      aceitaCarro: true,
      aceitaImovel: false,
      observacoes: 'Proprietário flexível no preço, aceita parcelamento'
    },
    fotos: [],
    descritivo: 'Apartamento com vista parcial para o mar, excelente localização.',
    proprietario: {
      id: '1',
      nome: 'João Silva Santos',
      telefone: '(48) 99999-1234',
      email: 'joao@email.com',
      visivel: false
    },
    corretor: {
      id: 'current_user',
      nome: 'Maria Corretora'
    },
    dataCadastro: '2025-01-20',
    status: 'disponivel',
    tags: ['vista-mar', 'alto-padrao'],
    visualizacoes: 15,
    interessados: [
      {
        id: '1',
        nome: 'Carlos Oliveira',
        telefone: '(48) 88888-5678',
        dataInteresse: '2025-01-25',
        observacoes: 'Interessado em visita'
      }
    ]
  },
  {
    id: '2',
    nomeEmpreendimento: 'Condomínio Solar',
    numeroUnidade: '205',
    metragem: 72,
    caracteristicas: {
      mobilia: 'sem_mobilia',
      churrasqueira: false,
      garagem: true,
      quantidadeQuartos: 2,
      quantidadeSuites: 1,
      lavabo: false,
      outrasCaracteristicas: ['Sacada']
    },
    infraEmpreendimento: ['Piscina', 'Playground'],
    localizacao: {
      endereco: 'Av. Beira Mar, 456, Kobrasol, São José - SC',
      latitude: -27.6108,
      longitude: -48.6326,
      distanciaMarKm: 0.8
    },
    valor: 480000,
    detalhesNegociacao: {
      aceitaCarro: false,
      aceitaImovel: true,
      observacoes: 'Aceita permuta por casa menor'
    },
    fotos: [],
    descritivo: 'Apartamento novo, nunca habitado, próximo à praia.',
    proprietario: {
      id: '2',
      nome: 'Ana Costa',
      telefone: '(48) 77777-9999',
      email: 'ana@email.com',
      visivel: true
    },
    corretor: {
      id: 'other_user',
      nome: 'Pedro Corretor'
    },
    dataCadastro: '2025-01-18',
    status: 'disponivel',
    tags: ['novo', 'praia'],
    visualizacoes: 8,
    interessados: []
  }
];

const ImoveisTerceiros: React.FC = () => {
  const [imoveis, setImoveis] = useState<ImovelTerceiros[]>(mockImoveisTerceiros);
  const [showCadastro, setShowCadastro] = useState(false);
  const [imovelEdicao, setImovelEdicao] = useState<ImovelTerceiros | undefined>();
  const [filtros, setFiltros] = useState<FiltrosImovelTerceiros>({});
  const [showFiltros, setShowFiltros] = useState(false);
  const [busca, setBusca] = useState('');
  const [visualizacao, setVisualizacao] = useState<'grid' | 'lista'>('grid');

  // Filtrar imóveis
  const imoveisFiltrados = useMemo(() => {
    return imoveis.filter(imovel => {
      // Busca por texto
      if (busca) {
        const termoBusca = busca.toLowerCase();
        const textoCompleto = `
          ${imovel.nomeEmpreendimento} 
          ${imovel.numeroUnidade} 
          ${imovel.localizacao.endereco} 
          ${imovel.descritivo}
          ${imovel.tags.join(' ')}
        `.toLowerCase();
        
        if (!textoCompleto.includes(termoBusca)) return false;
      }

      // Filtros específicos
      if (filtros.valorMin && imovel.valor < filtros.valorMin) return false;
      if (filtros.valorMax && imovel.valor > filtros.valorMax) return false;
      if (filtros.metragemMin && imovel.metragem < filtros.metragemMin) return false;
      if (filtros.metragemMax && imovel.metragem > filtros.metragemMax) return false;
      if (filtros.quartosMin && imovel.caracteristicas.quantidadeQuartos < filtros.quartosMin) return false;
      if (filtros.quartosMax && imovel.caracteristicas.quantidadeQuartos > filtros.quartosMax) return false;
      if (filtros.mobilia && imovel.caracteristicas.mobilia !== filtros.mobilia) return false;
      if (filtros.garagem !== undefined && imovel.caracteristicas.garagem !== filtros.garagem) return false;
      if (filtros.distanciaMarMax && imovel.localizacao.distanciaMarKm && imovel.localizacao.distanciaMarKm > filtros.distanciaMarMax) return false;
      if (filtros.status && imovel.status !== filtros.status) return false;

      return true;
    });
  }, [imoveis, filtros, busca]);

  const handleSaveImovel = (imovel: ImovelTerceiros) => {
    if (imovelEdicao) {
      setImoveis(prev => prev.map(item => item.id === imovel.id ? imovel : item));
    } else {
      setImoveis(prev => [imovel, ...prev]);
    }
    setImovelEdicao(undefined);
  };

  const handleDeleteImovel = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este imóvel?')) {
      setImoveis(prev => prev.filter(item => item.id !== id));
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponivel': return 'bg-green-100 text-green-800';
      case 'negociacao': return 'bg-yellow-100 text-yellow-800';
      case 'reservado': return 'bg-blue-100 text-blue-800';
      case 'vendido': return 'bg-gray-100 text-gray-800';
      case 'inativo': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'disponivel': return 'Disponível';
      case 'negociacao': return 'Em Negociação';
      case 'reservado': return 'Reservado';
      case 'vendido': return 'Vendido';
      case 'inativo': return 'Inativo';
      default: return status;
    }
  };

  const getMobiliaText = (mobilia: string) => {
    switch (mobilia) {
      case 'sem_mobilia': return 'Sem mobília';
      case 'parcialmente_mobiliado': return 'Parcialmente mobiliado';
      case 'totalmente_mobiliado': return '100% mobiliado';
      default: return mobilia;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Home className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Imóveis de Terceiros</h1>
                <p className="text-gray-600">Gerencie imóveis de clientes e parceiros</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setVisualizacao(visualizacao === 'grid' ? 'lista' : 'grid')}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {visualizacao === 'grid' ? '☰' : '⊞'}
              </button>
              <button
                onClick={() => setShowCadastro(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
                Cadastrar Imóvel
              </button>
            </div>
          </div>

          {/* Busca e filtros */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nome, endereço, características..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              onClick={() => setShowFiltros(!showFiltros)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>

          {/* Painel de filtros */}
          {showFiltros && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filtros.valorMin || ''}
                    onChange={(e) => setFiltros(prev => ({ ...prev, valorMin: parseFloat(e.target.value) || undefined }))}
                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filtros.valorMax || ''}
                    onChange={(e) => setFiltros(prev => ({ ...prev, valorMax: parseFloat(e.target.value) || undefined }))}
                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quartos</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filtros.quartosMin || ''}
                    onChange={(e) => setFiltros(prev => ({ ...prev, quartosMin: parseInt(e.target.value) || undefined }))}
                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filtros.quartosMax || ''}
                    onChange={(e) => setFiltros(prev => ({ ...prev, quartosMax: parseInt(e.target.value) || undefined }))}
                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobília</label>
                <select
                  value={filtros.mobilia || ''}
                  onChange={(e) => setFiltros(prev => ({ ...prev, mobilia: e.target.value || undefined }))}
                  className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="">Todos</option>
                  <option value="sem_mobilia">Sem mobília</option>
                  <option value="parcialmente_mobiliado">Parcialmente mobiliado</option>
                  <option value="totalmente_mobiliado">100% mobiliado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filtros.status || ''}
                  onChange={(e) => setFiltros(prev => ({ ...prev, status: e.target.value || undefined }))}
                  className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="">Todos</option>
                  <option value="disponivel">Disponível</option>
                  <option value="negociacao">Em Negociação</option>
                  <option value="reservado">Reservado</option>
                  <option value="vendido">Vendido</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Home className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Imóveis</p>
                <p className="text-xl font-bold text-gray-900">{imoveisFiltrados.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Valor Médio</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(imoveisFiltrados.reduce((acc, imovel) => acc + imovel.valor, 0) / imoveisFiltrados.length || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Eye className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Visualizações</p>
                <p className="text-xl font-bold text-gray-900">
                  {imoveisFiltrados.reduce((acc, imovel) => acc + imovel.visualizacoes, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Interessados</p>
                <p className="text-xl font-bold text-gray-900">
                  {imoveisFiltrados.reduce((acc, imovel) => acc + imovel.interessados.length, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de imóveis */}
        {visualizacao === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imoveisFiltrados.map((imovel) => (
              <div key={imovel.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Imagem placeholder */}
                <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                  <Home className="w-16 h-16 text-white" />
                </div>

                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{imovel.nomeEmpreendimento}</h3>
                      <p className="text-sm text-gray-600">{imovel.numeroUnidade}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(imovel.status)}`}>
                      {getStatusText(imovel.status)}
                    </span>
                  </div>

                  {/* Localização */}
                  <div className="flex items-center gap-1 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm truncate">{imovel.localizacao.endereco}</span>
                  </div>

                  {/* Características */}
                  <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{imovel.metragem}m²</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4 text-gray-400" />
                      <span>{imovel.caracteristicas.quantidadeQuartos}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="w-4 h-4 text-gray-400" />
                      <span>{imovel.caracteristicas.garagem ? 'Sim' : 'Não'}</span>
                    </div>
                  </div>

                  {/* Preço */}
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-green-600">{formatCurrency(imovel.valor)}</span>
                  </div>

                  {/* Mobília */}
                  <div className="mb-3">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {getMobiliaText(imovel.caracteristicas.mobilia)}
                    </span>
                  </div>

                  {/* Proprietário */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      {imovel.proprietario.visivel || imovel.corretor.id === 'current_user' ? (
                        <>
                          <Eye className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700">{imovel.proprietario.nome}</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-500">Dados privados</span>
                        </>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Corretor: {imovel.corretor.nome}
                    </div>
                  </div>

                  {/* Distância do mar */}
                  {imovel.localizacao.distanciaMarKm && (
                    <div className="mb-3 text-sm text-blue-600">
                      🌊 {imovel.localizacao.distanciaMarKm}km do mar
                    </div>
                  )}

                  {/* Tags */}
                  {imovel.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {imovel.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          #{tag}
                        </span>
                      ))}
                      {imovel.tags.length > 2 && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          +{imovel.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>{imovel.visualizacoes}</span>
                      {imovel.interessados.length > 0 && (
                        <>
                          <Users className="w-4 h-4 ml-2" />
                          <span>{imovel.interessados.length}</span>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Heart className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Share2 className="w-4 h-4 text-gray-400" />
                      </button>
                      {imovel.corretor.id === 'current_user' && (
                        <>
                          <button
                            onClick={() => {
                              setImovelEdicao(imovel);
                              setShowCadastro(true);
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Edit className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteImovel(imovel.id)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Contato (se visível) */}
                  {(imovel.proprietario.visivel || imovel.corretor.id === 'current_user') && (
                    <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                        <Phone className="w-4 h-4" />
                        Ligar
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <Mail className="w-4 h-4" />
                        Email
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Lista em formato de tabela
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Imóvel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Localização
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Características
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proprietário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {imoveisFiltrados.map((imovel) => (
                    <tr key={imovel.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{imovel.nomeEmpreendimento}</div>
                          <div className="text-sm text-gray-500">{imovel.numeroUnidade}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{imovel.localizacao.endereco}</div>
                        {imovel.localizacao.distanciaMarKm && (
                          <div className="text-sm text-blue-600">🌊 {imovel.localizacao.distanciaMarKm}km do mar</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {imovel.metragem}m² • {imovel.caracteristicas.quantidadeQuartos} quartos
                        </div>
                        <div className="text-sm text-gray-500">
                          {getMobiliaText(imovel.caracteristicas.mobilia)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">{formatCurrency(imovel.valor)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {imovel.proprietario.visivel || imovel.corretor.id === 'current_user' ? (
                            <>
                              <Eye className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-gray-900">{imovel.proprietario.nome}</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-500">Privado</span>
                            </>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">Por: {imovel.corretor.nome}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(imovel.status)}`}>
                          {getStatusText(imovel.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          {imovel.corretor.id === 'current_user' && (
                            <>
                              <button
                                onClick={() => {
                                  setImovelEdicao(imovel);
                                  setShowCadastro(true);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteImovel(imovel.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {imoveisFiltrados.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum imóvel encontrado</h3>
            <p className="text-gray-600 mb-4">
              {busca || Object.keys(filtros).length > 0 
                ? 'Ajuste os filtros para ver mais resultados' 
                : 'Comece cadastrando o primeiro imóvel de terceiros'
              }
            </p>
            <button
              onClick={() => setShowCadastro(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Cadastrar Primeiro Imóvel
            </button>
          </div>
        )}
      </div>

      {/* Modal de cadastro */}
      <CadastroImovelTerceiros
        isOpen={showCadastro}
        onClose={() => {
          setShowCadastro(false);
          setImovelEdicao(undefined);
        }}
        onSave={handleSaveImovel}
        imovelEdicao={imovelEdicao}
      />
    </div>
  );
};

export default ImoveisTerceiros;