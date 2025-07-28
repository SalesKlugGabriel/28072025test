// Imóveis para Aluguel
const ImoveisAluguelList: React.FC = () => {
  const navigate = useNavigate();
  const [imoveisAluguel, setImoveisAluguel] = useState<ImovelAluguel[]>(mockImoveisAluguel);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const filteredImoveis = imoveisAluguel.filter(imovel => {
    const matchesSearch = 
      imovel.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      imovel.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (imovel.contratoAtivo?.inquilino || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || imovel.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calcularValorTotal = (valores: any) => {
    return valores.aluguel + valores.iptu + valores.condominio;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Imóveis para Aluguel</h1>
          <p className="text-gray-600">Gestão de contratos de locação</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/empreendimentos/aluguel/novo')}
            className="btn-primary"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Imóvel
          </button>
          <button onClick={() => navigate('/empreendimentos')} className="btn-outline">
            Voltar
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <HomeIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Imóveis</p>
              <p className="text-lg font-semibold text-gray-900">{imoveisAluguel.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Locados</p>
              <p className="text-lg font-semibold text-gray-900">
                {imoveisAluguel.filter(i => i.status === 'locado').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <ClockIcon className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Disponíveis</p>
              <p className="text-lg font-semibold text-gray-900">
                {imoveisAluguel.filter(i => i.status === 'disponivel').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-50 rounded-lg">
              <CurrencyDollarIcon className="h-5 w-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Receita Mensal</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(
                  imoveisAluguel
                    .filter(i => i.status === 'locado')
                    .reduce((sum, i) => sum + calcularValorTotal(i.valores), 0)
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por código, endereço, inquilino..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input"
          >
            <option value="todos">Todos os Status</option>
            <option value="disponivel">Disponível</option>
            <option value="locado">Locado</option>
            <option value="reservado">Reservado</option>
            <option value="indisponibilizado">Indisponibilizado</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('todos');
            }}
            className="btn-outline"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Imóveis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredImoveis.map((imovel) => (
          <div key={imovel.id} className="card card-hover">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{imovel.codigo}</h3>
                  <p className="text-sm text-gray-500 capitalize">{imovel.tipo}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`badge ${
                    imovel.status === 'disponivel' ? 'badge-success' :
                    imovel.status === 'locado' ? 'badge-info' :
                    imovel.status === 'reservado' ? 'badge-warning' : 'badge-danger'
                  }`}>
                    {imovel.status === 'disponivel' ? 'Disponível' :
                     imovel.status === 'locado' ? 'Locado' :
                     imovel.status === 'reservado' ? 'Reservado' : 'Indisponível'}
                  </span>
                  <span className={`badge ${
                    imovel.administrador === 'proprio' ? 'badge-blue' : 'badge-purple'
                  }`}>
                    {imovel.administrador === 'proprio' ? 'Próprio' : 'Terceiro'}
                  </span>
                </div>
              </div>

              {/* Endereço e Área */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {imovel.endereco}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Square3Stack3DIcon className="h-4 w-4 mr-2" />
                  {imovel.area}m²
                </div>
              </div>

              {/* Valores */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Aluguel:</span>
                    <p className="font-semibold text-green-600">{formatCurrency(imovel.valores.aluguel)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Condomínio:</span>
                    <p className="font-semibold text-blue-600">{formatCurrency(imovel.valores.condominio)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">IPTU:</span>
                    <p className="font-semibold text-orange-600">{formatCurrency(imovel.valores.iptu)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Total:</span>
                    <p className="font-bold text-gray-900">{formatCurrency(calcularValorTotal(imovel.valores))}</p>
                  </div>
                </div>
              </div>

              {/* Contrato Ativo */}
              {imovel.contratoAtivo && (
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Contrato Ativo</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Inquilino:</span>
                      <span className="text-blue-900 font-medium">{imovel.contratoAtivo.inquilino}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Início:</span>
                      <span className="text-blue-900">{formatDate(imovel.contratoAtivo.dataInicio)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Término:</span>
                      <span className="text-blue-900">{formatDate(imovel.contratoAtivo.dataFim)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Próx. Vencimento:</span>
                      <span className="text-red-600 font-medium">{formatDate(imovel.contratoAtivo.dataVencimento)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Documentos */}
              <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-4 w-4 mr-1" />
                  {imovel.documentos.length} documentos
                </div>
                <div className="text-xs text-gray-400">
                  Cadastrado: {formatDate(imovel.dataInclusao)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                    title="Ver detalhes"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  
                  <button
                    className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded"
                    title="Gerenciar contrato"
                  >
                    <DocumentTextIcon className="h-4 w-4" />
                  </button>

                  <button
                    className="text-yellow-600 hover:text-yellow-800 p-1 hover:bg-yellow-50 rounded"
                    title="Editar"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>

                  <button
                    className="text-purple-600 hover:text-purple-800 p-1 hover:bg-purple-50 rounded"
                    title="Histórico financeiro"
                  >
                    <ChartBarIcon className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (confirm('Tem certeza que deseja excluir este imóvel?')) {
                      setImoveisAluguel(prev => prev.filter(i => i.id !== imovel.id));
                    }
                  }}
                  className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                  title="Excluir"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredImoveis.length === 0 && (
        <div className="text-center py-12">
          <KeyIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum imóvel encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'todos'
              ? 'Tente ajustar os filtros de busca.'
              : 'Comece cadastrando seu primeiro imóvel para aluguel.'}
          </p>
        </div>
      )}
    </div>
  );
                import React, { useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  BuildingOffice2Icon,
  HomeIcon,
  KeyIcon,
  MapPinIcon,
  DocumentArrowUpIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  PhotoIcon,
  Square3Stack3DIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowUpRightIcon
} from '@heroicons/react/24/outline';

// Types
interface Incorporadora {
  id: string;
  nome: string;
  cnpj: string;
}

interface Construtora {
  id: string;
  nome: string;
  cnpj: string;
}

interface Empreendimento {
  id: string;
  nome: string;
  tipo: 'vertical' | 'horizontal';
  status: 'lancamento' | 'em_obras' | 'pronto';
  localizacao: {
    estado: string;
    cidade: string;
    bairro: string;
    endereco: string;
    cep: string;
  };
  incorporadora: Incorporadora;
  construtora: Construtora;
  datas: {
    inicio: string;
    previsaoTermino: string;
    dataEntrega?: string;
  };
  documentos: string[];
  totalUnidades: number;
  unidadesDisponiveis: number;
  unidadesReservadas: number;
  unidadesVendidas: number;
  valorMedio: number;
  dataInclusao: string;
  dataAtualizacao: string;
}

interface Unidade {
  id: string;
  codigo: string;
  empreendimentoId: string;
  andar: number;
  tipo: string;
  area: number;
  status: 'disponivel' | 'reservado' | 'em_contrato' | 'indisponivel';
  valor: number;
  observacoes?: string;
}

interface ImovelTerceiro {
  id: string;
  codigo: string;
  tipo: 'apartamento' | 'casa' | 'terreno' | 'comercial' | 'galpao';
  endereco: string;
  area: number;
  valor: number;
  status: 'disponivel' | 'reservado' | 'vendido' | 'indisponivel';
  proprietario: string;
  corretor?: string;
  comissao: {
    tipo: 'percentual' | 'valor_fixo';
    valor: number;
  };
  fotos: string[];
  documentos: string[];
  observacoes?: string;
  dataInclusao: string;
}

interface ImovelAluguel {
  id: string;
  codigo: string;
  tipo: 'apartamento' | 'casa' | 'comercial' | 'galpao';
  endereco: string;
  area: number;
  valores: {
    aluguel: number;
    iptu: number;
    condominio: number;
  };
  status: 'disponivel' | 'locado' | 'reservado' | 'indisponibilizado';
  administrador: 'proprio' | 'terceiro';
  contratoAtivo?: {
    inquilino: string;
    dataInicio: string;
    dataFim: string;
    dataVencimento: string;
  };
  documentos: string[];
  dataInclusao: string;
}

// Mock Data
const mockIncorporadoras: Incorporadora[] = [
  { id: '1', nome: 'Construtora Premium Ltda', cnpj: '12.345.678/0001-90' },
  { id: '2', nome: 'Incorporadora Delta S/A', cnpj: '98.765.432/0001-10' }
];

const mockConstrutoras: Construtora[] = [
  { id: '1', nome: 'Construtora Premium Ltda', cnpj: '12.345.678/0001-90' },
  { id: '2', nome: 'Engenharia Alfa Ltda', cnpj: '11.222.333/0001-44' }
];

const mockEmpreendimentos: Empreendimento[] = [
  {
    id: '1',
    nome: 'Residencial Jardim das Flores',
    tipo: 'vertical',
    status: 'em_obras',
    localizacao: {
      estado: 'SP',
      cidade: 'São Paulo',
      bairro: 'Vila Madalena',
      endereco: 'Rua das Flores, 123',
      cep: '05434-020'
    },
    incorporadora: mockIncorporadoras[0],
    construtora: mockConstrutoras[0],
    datas: {
      inicio: '2024-01-15',
      previsaoTermino: '2025-12-30'
    },
    documentos: ['alvara.pdf', 'memorial_descritivo.pdf', 'plantas.dwg'],
    totalUnidades: 120,
    unidadesDisponiveis: 45,
    unidadesReservadas: 15,
    unidadesVendidas: 60,
    valorMedio: 450000,
    dataInclusao: '2024-01-10',
    dataAtualizacao: '2024-07-28'
  },
  {
    id: '2',
    nome: 'Condomínio Harmony Village',
    tipo: 'horizontal',
    status: 'lancamento',
    localizacao: {
      estado: 'RJ',
      cidade: 'Rio de Janeiro',
      bairro: 'Barra da Tijuca',
      endereco: 'Av. das Américas, 5000',
      cep: '22640-102'
    },
    incorporadora: mockIncorporadoras[1],
    construtora: mockConstrutoras[1],
    datas: {
      inicio: '2024-06-01',
      previsaoTermino: '2026-06-30'
    },
    documentos: ['projeto_aprovado.pdf', 'licenca_ambiental.pdf'],
    totalUnidades: 85,
    unidadesDisponiveis: 70,
    unidadesReservadas: 10,
    unidadesVendidas: 5,
    valorMedio: 650000,
    dataInclusao: '2024-05-20',
    dataAtualizacao: '2024-07-25'
  }
];

const mockImovelTerceiros: ImovelTerceiro[] = [
  {
    id: '1',
    codigo: 'T-001',
    tipo: 'apartamento',
    endereco: 'Rua São João, 456 - Apto 82',
    area: 85,
    valor: 380000,
    status: 'disponivel',
    proprietario: 'Carlos Eduardo Silva',
    corretor: 'Ana Paula Santos',
    comissao: {
      tipo: 'percentual',
      valor: 6
    },
    fotos: ['foto1.jpg', 'foto2.jpg'],
    documentos: ['matricula.pdf', 'iptu.pdf'],
    observacoes: 'Apartamento reformado recentemente',
    dataInclusao: '2024-07-15'
  },
  {
    id: '2',
    codigo: 'T-002',
    tipo: 'casa',
    endereco: 'Rua das Palmeiras, 789',
    area: 150,
    valor: 520000,
    status: 'reservado',
    proprietario: 'Maria José Oliveira',
    comissao: {
      tipo: 'valor_fixo',
      valor: 25000
    },
    fotos: ['casa1.jpg', 'casa2.jpg', 'casa3.jpg'],
    documentos: ['escritura.pdf', 'certidoes.pdf'],
    dataInclusao: '2024-07-10'
  }
];

const mockImoveisAluguel: ImovelAluguel[] = [
  {
    id: '1',
    codigo: 'A-001',
    tipo: 'apartamento',
    endereco: 'Av. Paulista, 1000 - Apto 150',
    area: 75,
    valores: {
      aluguel: 3500,
      iptu: 280,
      condominio: 450
    },
    status: 'locado',
    administrador: 'proprio',
    contratoAtivo: {
      inquilino: 'Roberto Silva Costa',
      dataInicio: '2024-01-15',
      dataFim: '2025-01-15',
      dataVencimento: '2024-08-15'
    },
    documentos: ['contrato_locacao.pdf', 'vistoria.pdf'],
    dataInclusao: '2023-12-20'
  },
  {
    id: '2',
    codigo: 'A-002',
    tipo: 'comercial',
    endereco: 'Rua Augusta, 500 - Loja 12',
    area: 120,
    valores: {
      aluguel: 8500,
      iptu: 650,
      condominio: 850
    },
    status: 'disponivel',
    administrador: 'terceiro',
    documentos: ['alvara.pdf', 'planta.pdf'],
    dataInclusao: '2024-06-10'
  }
];

const Empreendimentos: React.FC = () => {
  return (
    <Routes>
      <Route index element={<EmpreendimentosOverview />} />
      <Route path="construtora" element={<EmpreendimentosConstrutora />} />
      <Route path="terceiros" element={<ImovelTerceirosList />} />
      <Route path="outros" element={<OutrosImoveisList />} />
      <Route path="aluguel" element={<ImoveisAluguelList />} />
      <Route path="construtora/novo" element={<EmpreendimentoForm />} />
      <Route path="construtora/:id/editar" element={<EmpreendimentoForm />} />
      <Route path="construtora/:id" element={<EmpreendimentoDetails />} />
      <Route path="construtora/:id/mapa" element={<MapaDisponibilidade />} />
      <Route path="terceiros/novo" element={<ImovelTerceiroForm />} />
      <Route path="aluguel/novo" element={<ImovelAluguelForm />} />
    </Routes>
  );
};

// Overview do módulo
const EmpreendimentosOverview: React.FC = () => {
  const navigate = useNavigate();
  const [empreendimentos] = useState<Empreendimento[]>(mockEmpreendimentos);
  const [imovelTerceiros] = useState<ImovelTerceiro[]>(mockImovelTerceiros);
  const [imoveisAluguel] = useState<ImovelAluguel[]>(mockImoveisAluguel);

  const estatisticas = {
    totalEmpreendimentos: empreendimentos.length,
    empreendimentosAtivos: empreendimentos.filter(e => e.status !== 'pronto').length,
    totalUnidades: empreendimentos.reduce((sum, e) => sum + e.totalUnidades, 0),
    unidadesDisponiveis: empreendimentos.reduce((sum, e) => sum + e.unidadesDisponiveis, 0),
    imovelTerceiros: imovelTerceiros.length,
    imoveisAluguel: imoveisAluguel.length,
    imoveisDisponiveis: imovelTerceiros.filter(i => i.status === 'disponivel').length + 
                      imoveisAluguel.filter(i => i.status === 'disponivel').length
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const cards = [
    {
      titulo: 'Empreendimentos',
      valor: estatisticas.totalEmpreendimentos,
      href: '/empreendimentos/construtora',
      icon: BuildingOffice2Icon,
      cor: 'text-blue-600',
      corFundo: 'bg-blue-50',
      descricao: `${estatisticas.empreendimentosAtivos} em andamento`
    },
    {
      titulo: 'Unidades Totais',
      valor: estatisticas.totalUnidades,
      href: '/empreendimentos/construtora',
      icon: Square3Stack3DIcon,
      cor: 'text-green-600',
      corFundo: 'bg-green-50',
      descricao: `${estatisticas.unidadesDisponiveis} disponíveis`
    },
    {
      titulo: 'Imóveis Terceiros',
      valor: estatisticas.imovelTerceiros,
      href: '/empreendimentos/terceiros',
      icon: HomeIcon,
      cor: 'text-purple-600',
      corFundo: 'bg-purple-50',
      descricao: 'Captação externa'
    },
    {
      titulo: 'Imóveis Aluguel',
      valor: estatisticas.imoveisAluguel,
      href: '/empreendimentos/aluguel',
      icon: KeyIcon,
      cor: 'text-orange-600',
      corFundo: 'bg-orange-50',
      descricao: 'Gestão de locação'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Empreendimentos</h1>
          <p className="text-gray-600">Gestão completa de imóveis e empreendimentos</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/empreendimentos/construtora/novo')}
            className="btn-primary"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Empreendimento
          </button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const IconComponent = card.icon;
          return (
            <button
              key={card.titulo}
              onClick={() => navigate(card.href)}
              className="card card-hover p-6 text-left"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${card.corFundo}`}>
                  <IconComponent className={`h-6 w-6 ${card.cor}`} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{card.titulo}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.valor}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-3">{card.descricao}</p>
            </button>
          );
        })}
      </div>

      {/* Performance por Empreendimento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance de Vendas</h3>
          <div className="space-y-4">
            {empreendimentos.map((emp) => {
              const vendaPercentual = ((emp.unidadesVendidas + emp.unidadesReservadas) / emp.totalUnidades) * 100;
              return (
                <div key={emp.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{emp.nome}</span>
                    <span className="text-sm text-gray-600">{vendaPercentual.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${vendaPercentual}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{emp.unidadesVendidas + emp.unidadesReservadas} vendidas/reservadas</span>
                    <span>{emp.totalUnidades} total</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/empreendimentos/construtora/novo')}
              className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <PlusIcon className="h-6 w-6 text-blue-600 mb-2" />
              <span className="text-sm text-blue-700 font-medium">Novo Empreendimento</span>
            </button>
            <button
              onClick={() => navigate('/empreendimentos/terceiros/novo')}
              className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <HomeIcon className="h-6 w-6 text-purple-600 mb-2" />
              <span className="text-sm text-purple-700 font-medium">Imóvel Terceiro</span>
            </button>
            <button
              onClick={() => navigate('/empreendimentos/aluguel/novo')}
              className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <KeyIcon className="h-6 w-6 text-orange-600 mb-2" />
              <span className="text-sm text-orange-700 font-medium">Imóvel Aluguel</span>
            </button>
            <button
              className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <DocumentArrowUpIcon className="h-6 w-6 text-green-600 mb-2" />
              <span className="text-sm text-green-700 font-medium">Upload Tabela</span>
            </button>
          </div>
        </div>
      </div>

      {/* Empreendimentos em Destaque */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Empreendimentos em Destaque</h3>
            <button
              onClick={() => navigate('/empreendimentos/construtora')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Ver todos
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {empreendimentos.slice(0, 2).map((emp) => (
              <div key={emp.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{emp.nome}</h4>
                  <span className={`badge ${
                    emp.status === 'lancamento' ? 'badge-info' :
                    emp.status === 'em_obras' ? 'badge-warning' : 'badge-success'
                  }`}>
                    {emp.status === 'lancamento' ? 'Lançamento' :
                     emp.status === 'em_obras' ? 'Em Obras' : 'Pronto'}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    {emp.localizacao.cidade} - {emp.localizacao.bairro}
                  </div>
                  <div className="flex items-center">
                    <Square3Stack3DIcon className="h-4 w-4 mr-2" />
                    {emp.totalUnidades} unidades ({emp.unidadesDisponiveis} disponíveis)
                  </div>
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                    Valor médio: {formatCurrency(emp.valorMedio)}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-xs text-gray-500">
                    Atualizado: {new Date(emp.dataAtualizacao).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/empreendimentos/construtora/${emp.id}`)}
                      className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => navigate(`/empreendimentos/construtora/${emp.id}/mapa`)}
                      className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded"
                    >
                      <Square3Stack3DIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Lista de Empreendimentos de Construtora
const EmpreendimentosConstrutora: React.FC = () => {
  const navigate = useNavigate();
  const [empreendimentos, setEmpreendimentos] = useState<Empreendimento[]>(mockEmpreendimentos);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [tipoFilter, setTipoFilter] = useState<string>('todos');

  const filteredEmpreendimentos = empreendimentos.filter(emp => {
    const matchesSearch = 
      emp.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.localizacao.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.localizacao.bairro.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || emp.status === statusFilter;
    const matchesTipo = tipoFilter === 'todos' || emp.tipo === tipoFilter;
    
    return matchesSearch && matchesStatus && matchesTipo;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Empreendimentos de Construtora</h1>
          <p className="text-gray-600">Gerencie empreendimentos próprios</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/empreendimentos/construtora/novo')}
            className="btn-primary"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Empreendimento
          </button>
          <button
            onClick={() => navigate('/empreendimentos')}
            className="btn-outline"
          >
            Voltar
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, cidade, bairro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input"
          >
            <option value="todos">Todos os Status</option>
            <option value="lancamento">Lançamento</option>
            <option value="em_obras">Em Obras</option>
            <option value="pronto">Pronto</option>
          </select>

          <select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
            className="form-input"
          >
            <option value="todos">Todos os Tipos</option>
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('todos');
              setTipoFilter('todos');
            }}
            className="btn-outline"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Empreendimentos Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEmpreendimentos.map((emp) => (
          <div key={emp.id} className="card card-hover">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{emp.nome}</h3>
                  <p className="text-sm text-gray-500">{emp.tipo}</p>
                </div>
                <span className={`badge ${
                  emp.status === 'lancamento' ? 'badge-info' :
                  emp.status === 'em_obras' ? 'badge-warning' : 'badge-success'
                }`}>
                  {emp.status === 'lancamento' ? 'Lançamento' :
                   emp.status === 'em_obras' ? 'Em Obras' : 'Pronto'}
                </span>
              </div>

              {/* Localização */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {emp.localizacao.cidade} - {emp.localizacao.bairro}
                </div>
                <p className="text-sm text-gray-500">{emp.localizacao.endereco}</p>
              </div>

              {/* Estatísticas de Unidades */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Total:</span>
                    <p className="font-semibold text-gray-900">{emp.totalUnidades}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Disponíveis:</span>
                    <p className="font-semibold text-green-600">{emp.unidadesDisponiveis}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Reservadas:</span>
                    <p className="font-semibold text-yellow-600">{emp.unidadesReservadas}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Vendidas:</span>
                    <p className="font-semibold text-blue-600">{emp.unidadesVendidas}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progresso de Vendas</span>
                    <span>{(((emp.unidadesVendidas + emp.unidadesReservadas) / emp.totalUnidades) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${((emp.unidadesVendidas + emp.unidadesReservadas) / emp.totalUnidades) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Valor Médio e Empresas */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Valor Médio:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(emp.valorMedio)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Incorporadora:</span>
                  <span className="text-gray-700">{emp.incorporadora.nome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Construtora:</span>
                  <span className="text-gray-700">{emp.construtora.nome}</span>
                </div>
              </div>

              {/* Datas */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Início:</span>
                  <span>{new Date(emp.datas.inicio).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Previsão Término:</span>
                  <span className="text-orange-600">{new Date(emp.datas.previsaoTermino).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/empreendimentos/construtora/${emp.id}`)}
                    className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                    title="Ver detalhes"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => navigate(`/empreendimentos/construtora/${emp.id}/mapa`)}
                    className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded"
                    title="Mapa de disponibilidade"
                  >
                    <Square3Stack3DIcon className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => navigate(`/empreendimentos/construtora/${emp.id}/editar`)}
                    className="text-yellow-600 hover:text-yellow-800 p-1 hover:bg-yellow-50 rounded"
                    title="Editar"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>

                  <button
                    className="text-purple-600 hover:text-purple-800 p-1 hover:bg-purple-50 rounded"
                    title="Upload tabela"
                  >
                    <DocumentArrowUpIcon className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (confirm('Tem certeza que deseja excluir este empreendimento?')) {
                      setEmpreendimentos(prev => prev.filter(e => e.id !== emp.id));
                    }
                  }}
                  className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                  title="Excluir"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEmpreendimentos.length === 0 && (
        <div className="text-center py-12">
          <BuildingOffice2Icon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum empreendimento encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'todos' || tipoFilter !== 'todos'
              ? 'Tente ajustar os filtros de busca.'
              : 'Comece criando seu primeiro empreendimento.'}
          </p>
        </div>
      )}
    </div>
  );
};

// Lista de Imóveis de Terceiros
const ImovelTerceirosList: React.FC = () => {
  const navigate = useNavigate();
  const [imoveis, setImoveis] = useState<ImovelTerceiro[]>(mockImovelTerceiros);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [tipoFilter, setTipoFilter] = useState<string>('todos');

  const filteredImoveis = imoveis.filter(imovel => {
    const matchesSearch = 
      imovel.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      imovel.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
      imovel.proprietario.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || imovel.status === statusFilter;
    const matchesTipo = tipoFilter === 'todos' || imovel.tipo === tipoFilter;
    
    return matchesSearch && matchesStatus && matchesTipo;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Imóveis de Terceiros</h1>
          <p className="text-gray-600">Captação e gestão de imóveis externos</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/empreendimentos/terceiros/novo')}
            className="btn-primary"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Imóvel
          </button>
          <button
            onClick={() => navigate('/empreendimentos')}
            className="btn-outline"
          >
            Voltar
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por código, endereço, proprietário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input"
          >
            <option value="todos">Todos os Status</option>
            <option value="disponivel">Disponível</option>
            <option value="reservado">Reservado</option>
            <option value="vendido">Vendido</option>
            <option value="indisponivel">Indisponível</option>
          </select>

          <select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
            className="form-input"
          >
            <option value="todos">Todos os Tipos</option>
            <option value="apartamento">Apartamento</option>
            <option value="casa">Casa</option>
            <option value="terreno">Terreno</option>
            <option value="comercial">Comercial</option>
            <option value="galpao">Galpão</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('todos');
              setTipoFilter('todos');
            }}
            className="btn-outline"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Imóveis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredImoveis.map((imovel) => (
          <div key={imovel.id} className="card card-hover">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{imovel.codigo}</h3>
                  <p className="text-sm text-gray-500 capitalize">{imovel.tipo}</p>
                </div>
                <span className={`badge ${
                  imovel.status === 'disponivel' ? 'badge-success' :
                  imovel.status === 'reservado' ? 'badge-warning' :
                  imovel.status === 'vendido' ? 'badge-info' : 'badge-danger'
                }`}>
                  {imovel.status === 'disponivel' ? 'Disponível' :
                   imovel.status === 'reservado' ? 'Reservado' :
                   imovel.status === 'vendido' ? 'Vendido' : 'Indisponível'}
                </span>
              </div>

              {/* Endereço e Área */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {imovel.endereco}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Square3Stack3DIcon className="h-4 w-4 mr-2" />
                  {imovel.area}m²
                </div>
              </div>

              {/* Valor e Proprietário */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Valor:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(imovel.valor)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Proprietário:</span>
                    <span className="text-gray-700">{imovel.proprietario}</span>
                  </div>
                  {imovel.corretor && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Corretor:</span>
                      <span className="text-gray-700">{imovel.corretor}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Comissão */}
              <div className="flex items-center justify-between mb-4 p-2 bg-blue-50 rounded">
                <span className="text-sm text-blue-700">Comissão:</span>
                <span className="text-sm font-semibold text-blue-900">
                  {imovel.comissao.tipo === 'percentual' 
                    ? `${imovel.comissao.valor}%` 
                    : formatCurrency(imovel.comissao.valor)}
                </span>
              </div>

              {/* Mídia */}
              <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <PhotoIcon className="h-4 w-4 mr-1" />
                  {imovel.fotos.length} fotos
                </div>
                <div className="flex items-center">
                  <DocumentTextIcon className="h-4 w-4 mr-1" />
                  {imovel.documentos.length} docs
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                    title="Ver detalhes"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  
                  <button
                    className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded"
                    title="Ver fotos"
                  >
                    <PhotoIcon className="h-4 w-4" />
                  </button>

                  <button
                    className="text-yellow-600 hover:text-yellow-800 p-1 hover:bg-yellow-50 rounded"
                    title="Editar"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (confirm('Tem certeza que deseja excluir este imóvel?')) {
                      setImoveis(prev => prev.filter(i => i.id !== imovel.id));
                    }
                  }}
                  className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                  title="Excluir"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredImoveis.length === 0 && (
        <div className="text-center py-12">
          <HomeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum imóvel encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'todos' || tipoFilter !== 'todos'
              ? 'Tente ajustar os filtros de busca.'
              : 'Comece cadastrando seu primeiro imóvel de terceiro.'}
          </p>
        </div>
      )}
    </div>
  );
};

// Outros Imóveis
const OutrosImoveisList: React.FC = () => {
  const navigate = useNavigate();
  const [outrosImoveis, setOutrosImoveis] = useState([
    {
      id: '1',
      codigo: 'OUT-001',
      tipo: 'casa',
      categoria: 'residencial',
      endereco: 'Rua das Acácias, 300',
      area: 200,
      valor: 580000,
      status: 'disponivel',
      responsavel: 'João Silva',
      fotos: ['casa1.jpg', 'casa2.jpg'],
      documentos: ['escritura.pdf', 'iptu.pdf'],
      observacoes: 'Casa com piscina e churrasqueira',
      dataInclusao: '2024-07-10'
    },
    {
      id: '2',
      codigo: 'OUT-002',
      tipo: 'terreno',
      categoria: 'comercial',
      endereco: 'Av. Principal, 1500',
      area: 1000,
      valor: 850000,
      status: 'reservado',
      responsavel: 'Maria Santos',
      fotos: ['terreno1.jpg'],
      documentos: ['matricula.pdf', 'certidoes.pdf'],
      observacoes: 'Terreno comercial com ótima localização',
      dataInclusao: '2024-06-25'
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState<string>('todos');

  const filteredImoveis = outrosImoveis.filter(imovel => {
    const matchesSearch = 
      imovel.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      imovel.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
      imovel.responsavel.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo = tipoFilter === 'todos' || imovel.tipo === tipoFilter;
    
    return matchesSearch && matchesTipo;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Outros Imóveis</h1>
          <p className="text-gray-600">Casas, terrenos e lotes avulsos</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-primary">
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Imóvel
          </button>
          <button onClick={() => navigate('/empreendimentos')} className="btn-outline">
            Voltar
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por código, endereço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>

          <select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
            className="form-input"
          >
            <option value="todos">Todos os Tipos</option>
            <option value="casa">Casa</option>
            <option value="terreno">Terreno</option>
            <option value="lote">Lote</option>
            <option value="galpao">Galpão</option>
            <option value="comercial">Comercial</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setTipoFilter('todos');
            }}
            className="btn-outline"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Imóveis Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Código</th>
                <th className="table-header-cell">Tipo</th>
                <th className="table-header-cell">Endereço</th>
                <th className="table-header-cell">Área</th>
                <th className="table-header-cell">Valor</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Responsável</th>
                <th className="table-header-cell">Ações</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredImoveis.map((imovel) => (
                <tr key={imovel.id} className="table-row">
                  <td className="table-cell">
                    <div className="font-medium text-gray-900">{imovel.codigo}</div>
                    <div className="text-sm text-gray-500 capitalize">{imovel.categoria}</div>
                  </td>
                  <td className="table-cell">
                    <span className="badge badge-info capitalize">{imovel.tipo}</span>
                  </td>
                  <td className="table-cell">
                    <div className="font-medium text-gray-900">{imovel.endereco}</div>
                  </td>
                  <td className="table-cell">
                    <span className="text-gray-900">{imovel.area}m²</span>
                  </td>
                  <td className="table-cell">
                    <span className="font-medium text-green-600">
                      {formatCurrency(imovel.valor)}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${
                      imovel.status === 'disponivel' ? 'badge-success' :
                      imovel.status === 'reservado' ? 'badge-warning' :
                      imovel.status === 'vendido' ? 'badge-info' : 'badge-danger'
                    }`}>
                      {imovel.status === 'disponivel' ? 'Disponível' :
                       imovel.status === 'reservado' ? 'Reservado' :
                       imovel.status === 'vendido' ? 'Vendido' : 'Indisponível'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className="text-gray-900">{imovel.responsavel}</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                        title="Ver detalhes"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded"
                        title="Ver fotos"
                      >
                        <PhotoIcon className="h-4 w-4" />
                      </button>
                      <button
                        className="text-yellow-600 hover:text-yellow-800 p-1 hover:bg-yellow-50 rounded"
                        title="Editar"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir este imóvel?')) {
                            setOutrosImoveis(prev => prev.filter(i => i.id !== imovel.id));
                          }
                        }}
                        className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                        title="Excluir"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredImoveis.length === 0 && (
          <div className="text-center py-12">
            <HomeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum imóvel encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || tipoFilter !== 'todos'
                ? 'Tente ajustar os filtros de busca.'
                : 'Comece cadastrando seu primeiro imóvel.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Imóveis para Aluguel
const ImoveisAluguelList: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Imóveis para Aluguel</h1>
          <p className="text-gray-600">Gestão de contratos de locação</p>
        </div>
        <button onClick={() => navigate('/empreendimentos')} className="btn-outline">Voltar</button>
      </div>
      <div className="card p-6">
        <p className="text-gray-600">Lista de imóveis para aluguel será implementada aqui.</p>
      </div>
    </div>
  );
};

// Placeholder para formulários e detalhes
const EmpreendimentoForm: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Formulário de Empreendimento</h1>
          <p className="text-gray-600">Cadastro completo com documentos</p>
        </div>
        <button onClick={() => navigate('/empreendimentos/construtora')} className="btn-outline">Voltar</button>
      </div>
      <div className="card p-6">
        <p className="text-gray-600">Formulário completo será implementado aqui.</p>
      </div>
    </div>
  );
};

const EmpreendimentoDetails: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Detalhes do Empreendimento</h1>
          <p className="text-gray-600">Informações completas e histórico</p>
        </div>
        <button onClick={() => navigate('/empreendimentos/construtora')} className="btn-outline">Voltar</button>
      </div>
      <div className="card p-6">
        <p className="text-gray-600">Detalhes completos serão implementados aqui.</p>
      </div>
    </div>
  );
};

const MapaDisponibilidade: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mapa de Disponibilidade</h1>
          <p className="text-gray-600">Visualização inteligente das unidades</p>
        </div>
        <button onClick={() => navigate('/empreendimentos/construtora')} className="btn-outline">Voltar</button>
      </div>
      <div className="card p-6">
        <p className="text-gray-600">Mapa interativo será implementado aqui.</p>
      </div>
    </div>
  );
};

const ImovelTerceiroForm: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cadastro de Imóvel de Terceiro</h1>
          <p className="text-gray-600">Captação externa com comissão</p>
        </div>
        <button onClick={() => navigate('/empreendimentos/terceiros')} className="btn-outline">Voltar</button>
      </div>
      <div className="card p-6">
        <p className="text-gray-600">Formulário de captação será implementado aqui.</p>
      </div>
    </div>
  );
};

const ImovelAluguelForm: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cadastro de Imóvel para Aluguel</h1>
          <p className="text-gray-600">Gestão de locação e contratos</p>
        </div>
        <button onClick={() => navigate('/empreendimentos/aluguel')} className="btn-outline">Voltar</button>
      </div>
      <div className="card p-6">
        <p className="text-gray-600">Formulário de locação será implementado aqui.</p>
      </div>
    </div>
  );
};

export default Empreendimentos;