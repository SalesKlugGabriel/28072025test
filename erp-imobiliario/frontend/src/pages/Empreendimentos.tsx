import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  BuildingOffice2Icon,
  HomeIcon,
  KeyIcon,
  MapPinIcon,
  DocumentArrowUpIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  Square3Stack3DIcon
} from '@heroicons/react/24/outline';

// ============================
// TYPES & INTERFACES
// ============================

export interface Incorporadora {
  id: string;
  nome: string;
  cnpj: string;
}

export interface Construtora {
  id: string;
  nome: string;
  cnpj: string;
}

export interface TipoUnidade {
  id: string;
  nome: string;
  tipologia: string;
  areaPrivativa: number;
  areaTotalReal: number;
  vagas: number;
  quantidade: number;
  valor: number;
}

export interface Bloco {
  id: string;
  nome: string;
  totalAndares: number;
  unidadesPorAndar: number;
  tipos: TipoUnidade[];
}

export interface Documento {
  id: string;
  nome: string;
  tipo: 'alvara' | 'habite_se' | 'memorial' | 'planta' | 'contrato' | 'outro';
  arquivo: string;
  dataUpload: string;
}

export interface Foto {
  id: string;
  nome: string;
  categoria: 'fachada' | 'planta_baixa' | 'area_comum' | 'lazer' | 'decorado' | 'obra' | 'outro';
  arquivo: string;
  descricao?: string;
}

export interface UnidadeStatus {
  bloco: string;
  andar: number;
  numero: string;
  tipo: string;
  status: 'disponivel' | 'reservado' | 'vendido' | 'indisponivel';
  cliente?: string;
  dataVenda?: string;
  dataReserva?: string;
  observacoes?: string;
}

export interface Empreendimento {
  id: string;
  nome: string;
  descricao: string;
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
  blocos: Bloco[];
  documentos: Documento[];
  fotos: Foto[];
  unidades: UnidadeStatus[];
  totalUnidades: number;
  unidadesDisponiveis: number;
  unidadesReservadas: number;
  unidadesVendidas: number;
  valorMedio: number;
  dataInclusao: string;
  dataAtualizacao: string;
}

export interface ImovelTerceiro {
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

export interface ImovelAluguel {
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

// ============================
// HELPER FUNCTIONS
// ============================

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

export const calcularValorTotal = (valores: { aluguel: number; iptu: number; condominio: number }): number => {
  return valores.aluguel + valores.iptu + valores.condominio;
};

// ============================
// CSS CLASSES CONSTANTS
// ============================

export const buttonPrimary = "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

export const buttonOutline = "inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

export const card = "bg-white shadow rounded-lg";

export const cardHover = "bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md";

export const formInput = "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

// ============================
// MOCK DATA
// ============================
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
    descricao: 'Empreendimento residencial com excelente localização na Vila Madalena, oferecendo apartamentos de 1 a 3 dormitórios com acabamento premium e área de lazer completa.',
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
    blocos: [
      {
        id: 'bloco-a',
        nome: 'Torre A',
        totalAndares: 15,
        unidadesPorAndar: 4,
        tipos: [
          {
            id: 'tipo-1',
            nome: '1 Dormitório',
            tipologia: '1 quarto',
            areaPrivativa: 45,
            areaTotalReal: 65,
            vagas: 1,
            quantidade: 30,
            valor: 380000
          },
          {
            id: 'tipo-2',
            nome: '2 Dormitórios',
            tipologia: '2 quartos',
            areaPrivativa: 65,
            areaTotalReal: 85,
            vagas: 1,
            quantidade: 30,
            valor: 480000
          }
        ]
      },
      {
        id: 'bloco-b',
        nome: 'Torre B',
        totalAndares: 15,
        unidadesPorAndar: 4,
        tipos: [
          {
            id: 'tipo-3',
            nome: '3 Dormitórios + Suíte',
            tipologia: '3 quartos',
            areaPrivativa: 95,
            areaTotalReal: 120,
            vagas: 2,
            quantidade: 60,
            valor: 650000
          }
        ]
      }
    ],
    documentos: [
      {
        id: 'doc-1',
        nome: 'Alvará de Construção',
        tipo: 'alvara',
        arquivo: 'alvara_construcao.pdf',
        dataUpload: '2024-01-10'
      },
      {
        id: 'doc-2',
        nome: 'Memorial Descritivo',
        tipo: 'memorial',
        arquivo: 'memorial_descritivo.pdf',
        dataUpload: '2024-01-12'
      },
      {
        id: 'doc-3',
        nome: 'Plantas Aprovadas',
        tipo: 'planta',
        arquivo: 'plantas_aprovadas.dwg',
        dataUpload: '2024-01-15'
      }
    ],
    fotos: [
      {
        id: 'foto-1',
        nome: 'Fachada Principal',
        categoria: 'fachada',
        arquivo: 'fachada_principal.jpg',
        descricao: 'Vista frontal do empreendimento'
      },
      {
        id: 'foto-2',
        nome: 'Planta 1 Dorm',
        categoria: 'planta_baixa',
        arquivo: 'planta_1dorm.jpg',
        descricao: 'Planta baixa apartamento 1 dormitório'
      },
      {
        id: 'foto-3',
        nome: 'Área de Lazer',
        categoria: 'lazer',
        arquivo: 'area_lazer.jpg',
        descricao: 'Piscina e área de recreação'
      }
    ],
    unidades: [],
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
    descricao: 'Condomínio horizontal de casas com segurança 24h, área verde preservada e clube completo na Barra da Tijuca.',
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
    blocos: [
      {
        id: 'quadra-1',
        nome: 'Quadra 1',
        totalAndares: 2,
        unidadesPorAndar: 1,
        tipos: [
          {
            id: 'casa-tipo-1',
            nome: 'Casa 3 Suítes',
            tipologia: '3 quartos',
            areaPrivativa: 180,
            areaTotalReal: 300,
            vagas: 2,
            quantidade: 25,
            valor: 850000
          },
          {
            id: 'casa-tipo-2',
            nome: 'Casa 4 Suítes',
            tipologia: '4 quartos',
            areaPrivativa: 220,
            areaTotalReal: 400,
            vagas: 3,
            quantidade: 35,
            valor: 1200000
          }
        ]
      }
    ],
    documentos: [
      {
        id: 'doc-4',
        nome: 'Projeto Aprovado',
        tipo: 'planta',
        arquivo: 'projeto_aprovado.pdf',
        dataUpload: '2024-05-20'
      },
      {
        id: 'doc-5',
        nome: 'Licença Ambiental',
        tipo: 'outro',
        arquivo: 'licenca_ambiental.pdf',
        dataUpload: '2024-05-22'
      }
    ],
    fotos: [
      {
        id: 'foto-4',
        nome: 'Portaria',
        categoria: 'fachada',
        arquivo: 'portaria.jpg',
        descricao: 'Entrada principal do condomínio'
      },
      {
        id: 'foto-5',
        nome: 'Casa Decorada',
        categoria: 'decorado',
        arquivo: 'casa_decorada.jpg',
        descricao: 'Casa modelo mobiliada'
      }
    ],
    unidades: [],
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
  }
];
// ============================
// COMPONENTS
// ============================

// Overview do módulo
function EmpreendimentosOverview() {
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
            className={buttonPrimary}
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
              className={`${cardHover} p-6 text-left`}
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
        <div className={`${card} p-6`}>
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

        <div className={`${card} p-6`}>
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
    </div>
  );
}
// Lista de Empreendimentos de Construtora
function EmpreendimentosConstrutora() {
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
            className={buttonPrimary}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Empreendimento
          </button>
          <button
            onClick={() => navigate('/empreendimentos')}
            className={buttonOutline}
          >
            Voltar
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={`${card} p-6`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, cidade, bairro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${formInput} pl-10`}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={formInput}
          >
            <option value="todos">Todos os Status</option>
            <option value="lancamento">Lançamento</option>
            <option value="em_obras">Em Obras</option>
            <option value="pronto">Pronto</option>
          </select>

          <select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
            className={formInput}
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
            className={buttonOutline}
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Empreendimentos Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEmpreendimentos.map((emp) => (
          <div key={emp.id} className={cardHover}>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{emp.nome}</h3>
                  <p className="text-sm text-gray-500 capitalize">{emp.tipo}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  emp.status === 'lancamento' ? 'bg-blue-100 text-blue-800' :
                  emp.status === 'em_obras' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
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
}
// Formulário de Cadastro/Edição de Empreendimento
function EmpreendimentoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    tipo: 'vertical' as 'vertical' | 'horizontal',
    status: 'lancamento' as 'lancamento' | 'em_obras' | 'pronto',
    localizacao: {
      estado: '',
      cidade: '',
      bairro: '',
      endereco: '',
      cep: ''
    },
    incorporadora: {
      id: '',
      nome: '',
      cnpj: ''
    },
    construtora: {
      id: '',
      nome: '',
      cnpj: ''
    },
    datas: {
      inicio: '',
      previsaoTermino: '',
      dataEntrega: ''
    },
    blocos: [] as Bloco[],
    totalUnidades: 0,
    unidadesDisponiveis: 0,
    unidadesReservadas: 0,
    unidadesVendidas: 0,
    valorMedio: 0,
    documentos: [] as Documento[],
    fotos: [] as Foto[]
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Carregar dados para edição
  useEffect(() => {
    if (isEditing) {
      const empreendimento = mockEmpreendimentos.find(e => e.id === id);
      if (empreendimento) {
        setFormData({
          nome: empreendimento.nome,
          descricao: empreendimento.descricao,
          tipo: empreendimento.tipo,
          status: empreendimento.status,
          localizacao: empreendimento.localizacao,
          incorporadora: empreendimento.incorporadora,
          construtora: empreendimento.construtora,
          datas: {
            inicio: empreendimento.datas.inicio,
            previsaoTermino: empreendimento.datas.previsaoTermino,
            dataEntrega: empreendimento.datas.dataEntrega || ''
          },
          blocos: empreendimento.blocos,
          totalUnidades: empreendimento.totalUnidades,
          unidadesDisponiveis: empreendimento.unidadesDisponiveis,
          unidadesReservadas: empreendimento.unidadesReservadas,
          unidadesVendidas: empreendimento.unidadesVendidas,
          valorMedio: empreendimento.valorMedio,
          documentos: empreendimento.documentos,
          fotos: empreendimento.fotos
        });
      }
    }
  }, [id, isEditing]);

  // Validação do formulário
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';
    if (!formData.localizacao.estado.trim()) newErrors.estado = 'Estado é obrigatório';
    if (!formData.localizacao.cidade.trim()) newErrors.cidade = 'Cidade é obrigatória';
    if (!formData.localizacao.bairro.trim()) newErrors.bairro = 'Bairro é obrigatório';
    if (!formData.localizacao.endereco.trim()) newErrors.endereco = 'Endereço é obrigatório';
    if (!formData.localizacao.cep.trim()) newErrors.cep = 'CEP é obrigatório';
    if (!formData.incorporadora.nome.trim()) newErrors.incorporadoraNome = 'Nome da incorporadora é obrigatório';
    if (!formData.incorporadora.cnpj.trim()) newErrors.incorporadoraCnpj = 'CNPJ da incorporadora é obrigatório';
    if (!formData.construtora.nome.trim()) newErrors.construtoranome = 'Nome da construtora é obrigatório';
    if (!formData.construtora.cnpj.trim()) newErrors.construtoracnpj = 'CNPJ da construtora é obrigatório';
    if (!formData.datas.inicio) newErrors.dataInicio = 'Data de início é obrigatória';
    if (!formData.datas.previsaoTermino) newErrors.dataTermino = 'Data de término é obrigatória';
    if (formData.valorMedio <= 0) newErrors.valorMedio = 'Valor médio deve ser maior que zero';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Salvar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Dados do formulário:', formData);
      
      // Redirecionar após salvar
      navigate('/empreendimentos/construtora');
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar campo do formulário
  const updateField = (path: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar Empreendimento' : 'Novo Empreendimento'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Altere as informações do empreendimento' : 'Cadastro completo com documentos'}
          </p>
        </div>
        <button 
          onClick={() => navigate('/empreendimentos/construtora')} 
          className={buttonOutline}
        >
          Voltar
        </button>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informações Básicas */}
        <div className={`${card} p-6`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Empreendimento *
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => updateField('nome', e.target.value)}
                className={`${formInput} ${errors.nome ? 'border-red-500' : ''}`}
                placeholder="Ex: Residencial Jardim das Flores"
              />
              {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo *
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => updateField('tipo', e.target.value)}
                className={formInput}
              >
                <option value="vertical">Vertical</option>
                <option value="horizontal">Horizontal</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) => updateField('descricao', e.target.value)}
                rows={3}
                className={`${formInput} ${errors.descricao ? 'border-red-500' : ''}`}
                placeholder="Descrição detalhada do empreendimento, diferenciais, área de lazer, etc."
              />
              {errors.descricao && <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => updateField('status', e.target.value)}
                className={formInput}
              >
                <option value="lancamento">Lançamento</option>
                <option value="em_obras">Em Obras</option>
                <option value="pronto">Pronto</option>
              </select>
            </div>
          </div>
        </div>

        {/* Localização */}
        <div className={`${card} p-6`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Localização</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado *
              </label>
              <input
                type="text"
                value={formData.localizacao.estado}
                onChange={(e) => updateField('localizacao.estado', e.target.value)}
                className={`${formInput} ${errors.estado ? 'border-red-500' : ''}`}
                placeholder="Ex: SP"
              />
              {errors.estado && <p className="text-red-500 text-sm mt-1">{errors.estado}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cidade *
              </label>
              <input
                type="text"
                value={formData.localizacao.cidade}
                onChange={(e) => updateField('localizacao.cidade', e.target.value)}
                className={`${formInput} ${errors.cidade ? 'border-red-500' : ''}`}
                placeholder="Ex: São Paulo"
              />
              {errors.cidade && <p className="text-red-500 text-sm mt-1">{errors.cidade}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bairro *
              </label>
              <input
                type="text"
                value={formData.localizacao.bairro}
                onChange={(e) => updateField('localizacao.bairro', e.target.value)}
                className={`${formInput} ${errors.bairro ? 'border-red-500' : ''}`}
                placeholder="Ex: Vila Madalena"
              />
              {errors.bairro && <p className="text-red-500 text-sm mt-1">{errors.bairro}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CEP *
              </label>
              <input
                type="text"
                value={formData.localizacao.cep}
                onChange={(e) => updateField('localizacao.cep', e.target.value)}
                className={`${formInput} ${errors.cep ? 'border-red-500' : ''}`}
                placeholder="Ex: 05434-020"
              />
              {errors.cep && <p className="text-red-500 text-sm mt-1">{errors.cep}</p>}
            </div>

            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endereço Completo *
              </label>
              <input
                type="text"
                value={formData.localizacao.endereco}
                onChange={(e) => updateField('localizacao.endereco', e.target.value)}
                className={`${formInput} ${errors.endereco ? 'border-red-500' : ''}`}
                placeholder="Ex: Rua das Flores, 123"
              />
              {errors.endereco && <p className="text-red-500 text-sm mt-1">{errors.endereco}</p>}
            </div>
          </div>
        </div>
        {/* Empresas Responsáveis */}
        <div className={`${card} p-6`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Empresas Responsáveis</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Incorporadora</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={formData.incorporadora.nome}
                    onChange={(e) => updateField('incorporadora.nome', e.target.value)}
                    className={`${formInput} ${errors.incorporadoraNome ? 'border-red-500' : ''}`}
                    placeholder="Nome da incorporadora"
                  />
                  {errors.incorporadoraNome && <p className="text-red-500 text-sm mt-1">{errors.incorporadoraNome}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CNPJ *
                  </label>
                  <input
                    type="text"
                    value={formData.incorporadora.cnpj}
                    onChange={(e) => updateField('incorporadora.cnpj', e.target.value)}
                    className={`${formInput} ${errors.incorporadoraCnpj ? 'border-red-500' : ''}`}
                    placeholder="00.000.000/0000-00"
                  />
                  {errors.incorporadoraCnpj && <p className="text-red-500 text-sm mt-1">{errors.incorporadoraCnpj}</p>}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Construtora</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={formData.construtora.nome}
                    onChange={(e) => updateField('construtora.nome', e.target.value)}
                    className={`${formInput} ${errors.construtoranome ? 'border-red-500' : ''}`}
                    placeholder="Nome da construtora"
                  />
                  {errors.construtoranome && <p className="text-red-500 text-sm mt-1">{errors.construtoranome}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CNPJ *
                  </label>
                  <input
                    type="text"
                    value={formData.construtora.cnpj}
                    onChange={(e) => updateField('construtora.cnpj', e.target.value)}
                    className={`${formInput} ${errors.construtoracnpj ? 'border-red-500' : ''}`}
                    placeholder="00.000.000/0000-00"
                  />
                  {errors.construtoracnpj && <p className="text-red-500 text-sm mt-1">{errors.construtoracnpj}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cronograma */}
        <div className={`${card} p-6`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cronograma</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Início *
              </label>
              <input
                type="date"
                value={formData.datas.inicio}
                onChange={(e) => updateField('datas.inicio', e.target.value)}
                className={`${formInput} ${errors.dataInicio ? 'border-red-500' : ''}`}
              />
              {errors.dataInicio && <p className="text-red-500 text-sm mt-1">{errors.dataInicio}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Previsão de Término *
              </label>
              <input
                type="date"
                value={formData.datas.previsaoTermino}
                onChange={(e) => updateField('datas.previsaoTermino', e.target.value)}
                className={`${formInput} ${errors.dataTermino ? 'border-red-500' : ''}`}
              />
              {errors.dataTermino && <p className="text-red-500 text-sm mt-1">{errors.dataTermino}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Entrega
              </label>
              <input
                type="date"
                value={formData.datas.dataEntrega}
                onChange={(e) => updateField('datas.dataEntrega', e.target.value)}
                className={formInput}
              />
              <p className="text-xs text-gray-500 mt-1">Opcional - preencher quando concluído</p>
            </div>
          </div>
        </div>

        {/* Informações Comerciais */}
        <div className={`${card} p-6`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Comerciais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor Médio por Unidade *
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={formData.valorMedio}
                onChange={(e) => updateField('valorMedio', Number(e.target.value))}
                className={`${formInput} ${errors.valorMedio ? 'border-red-500' : ''}`}
                placeholder="450000"
              />
              {errors.valorMedio && <p className="text-red-500 text-sm mt-1">{errors.valorMedio}</p>}
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center justify-end space-x-3 pt-6">
          <button
            type="button"
            onClick={() => navigate('/empreendimentos/construtora')}
            className={buttonOutline}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={buttonPrimary}
            disabled={loading}
          >
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Cadastrar')}
          </button>
        </div>
      </form>
    </div>
  );
}
// Página de Detalhes do Empreendimento
function EmpreendimentoDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Encontrar o empreendimento
  const empreendimento = mockEmpreendimentos.find(e => e.id === id);
  
  if (!empreendimento) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <BuildingOffice2Icon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Empreendimento não encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">O empreendimento solicitado não existe.</p>
          <button 
            onClick={() => navigate('/empreendimentos/construtora')}
            className={`${buttonPrimary} mt-4`}
          >
            Voltar à Lista
          </button>
        </div>
      </div>
    );
  }

  const progresso = ((empreendimento.unidadesVendidas + empreendimento.unidadesReservadas) / empreendimento.totalUnidades) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{empreendimento.nome}</h1>
          <p className="text-gray-600">Informações completas e histórico</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => navigate(`/empreendimentos/construtora/${id}/mapa`)}
            className={buttonPrimary}
          >
            <Square3Stack3DIcon className="h-5 w-5 mr-2" />
            Ver Mapa
          </button>
          <button 
            onClick={() => navigate(`/empreendimentos/construtora/${id}/editar`)}
            className={buttonOutline}
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            Editar
          </button>
          <button 
            onClick={() => navigate('/empreendimentos/construtora')} 
            className={buttonOutline}
          >
            Voltar
          </button>
        </div>
      </div>

      {/* Status e Informações Básicas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${card} p-6 lg:col-span-2`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Informações Gerais</h3>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              empreendimento.status === 'lancamento' ? 'bg-blue-100 text-blue-800' :
              empreendimento.status === 'em_obras' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
            }`}>
              {empreendimento.status === 'lancamento' ? 'Lançamento' :
               empreendimento.status === 'em_obras' ? 'Em Obras' : 'Pronto'}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Descrição</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{empreendimento.descricao}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Localização</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{empreendimento.localizacao.endereco}</span>
                  </div>
                  <div className="pl-6">
                    <p>{empreendimento.localizacao.bairro}, {empreendimento.localizacao.cidade}/{empreendimento.localizacao.estado}</p>
                    <p>CEP: {empreendimento.localizacao.cep}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Características</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tipo:</span>
                    <span className="capitalize">{empreendimento.tipo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total de Unidades:</span>
                    <span className="font-semibold">{empreendimento.totalUnidades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Valor Médio:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(empreendimento.valorMedio)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Blocos/Torres:</span>
                    <span className="font-semibold">{empreendimento.blocos.length}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Incorporadora</h4>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{empreendimento.incorporadora.nome}</p>
                  <p className="text-gray-500">CNPJ: {empreendimento.incorporadora.cnpj}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Construtora</h4>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{empreendimento.construtora.nome}</p>
                  <p className="text-gray-500">CNPJ: {empreendimento.construtora.cnpj}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Cronograma</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Início:</span>
                  <p className="font-medium">{formatDate(empreendimento.datas.inicio)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Previsão Término:</span>
                  <p className="font-medium text-orange-600">{formatDate(empreendimento.datas.previsaoTermino)}</p>
                </div>
                {empreendimento.datas.dataEntrega && (
                  <div>
                    <span className="text-gray-500">Data Entrega:</span>
                    <p className="font-medium text-green-600">{formatDate(empreendimento.datas.dataEntrega)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={`${card} p-6`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Progresso de Vendas</h3>
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-blue-600">{progresso.toFixed(1)}%</div>
            <div className="text-sm text-gray-500">Unidades Comercializadas</div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-blue-600 h-3 rounded-full"
              style={{ width: `${progresso}%` }}
            ></div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Vendidas:</span>
              <span className="font-semibold text-blue-600">{empreendimento.unidadesVendidas}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Reservadas:</span>
              <span className="font-semibold text-yellow-600">{empreendimento.unidadesReservadas}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Disponíveis:</span>
              <span className="font-semibold text-green-600">{empreendimento.unidadesDisponiveis}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tipos de Unidades */}
      <div className={`${card} p-6`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipos de Unidades</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {empreendimento.blocos.map((bloco) => (
            <div key={bloco.id} className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-900">{bloco.nome}</h4>
                <p className="text-sm text-gray-500">{bloco.totalAndares} andares • {bloco.unidadesPorAndar} unidades/andar</p>
              </div>
              
              <div className="space-y-3">
                {bloco.tipos.map((tipo) => (
                  <div key={tipo.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-medium text-gray-900">{tipo.nome}</h5>
                        <p className="text-sm text-gray-500">{tipo.tipologia}</p>
                      </div>
                      <span className="text-sm font-semibold text-green-600">{formatCurrency(tipo.valor)}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>
                        <span className="text-gray-500">Área Privativa:</span>
                        <p className="font-medium">{tipo.areaPrivativa}m²</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Área Total:</span>
                        <p className="font-medium">{tipo.areaTotalReal}m²</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Vagas:</span>
                        <p className="font-medium">{tipo.vagas}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Quantidade:</span>
                        <p className="font-medium">{tipo.quantidade} un.</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Documentos */}
      <div className={`${card} p-6`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {empreendimento.documentos.map((doc) => (
            <div key={doc.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <DocumentArrowUpIcon className="h-8 w-8 text-gray-400 mr-3" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{doc.nome}</p>
                <p className="text-sm text-gray-500 capitalize">{doc.tipo.replace('_', ' ')}</p>
                <p className="text-xs text-gray-400">{formatDate(doc.dataUpload)}</p>
              </div>
              <button className="ml-auto text-blue-600 hover:text-blue-800">
                <EyeIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Fotos */}
      <div className={`${card} p-6`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fotos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {empreendimento.fotos.map((foto) => (
            <div key={foto.id} className="group relative">
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">{foto.nome}</p>
                  <p className="text-xs text-gray-500 capitalize">{foto.categoria.replace('_', ' ')}</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button className="text-white bg-blue-600 rounded-full p-2 hover:bg-blue-700">
                  <EyeIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Placeholder para páginas em desenvolvimento
function PlaceholderPage({ title, subtitle, icon: Icon }: { title: string; subtitle: string; icon: any }) {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        <button onClick={() => navigate('/empreendimentos')} className={buttonOutline}>
          Voltar
        </button>
      </div>
      <div className={`${card} p-6`}>
        <div className="text-center py-12">
          <Icon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Em Desenvolvimento</h3>
          <p className="mt-1 text-sm text-gray-500">
            Esta funcionalidade será implementada em breve.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================
// MAIN COMPONENT
// ============================

function Empreendimentos() {
  return (
    <Routes>
      <Route index element={<EmpreendimentosOverview />} />
      <Route path="construtora" element={<EmpreendimentosConstrutora />} />
      <Route path="terceiros" element={<PlaceholderPage title="Imóveis de Terceiros" subtitle="Captação e gestão de imóveis externos" icon={HomeIcon} />} />
      <Route path="aluguel" element={<PlaceholderPage title="Imóveis para Aluguel" subtitle="Gestão de contratos de locação" icon={KeyIcon} />} />
      <Route path="construtora/novo" element={<EmpreendimentoForm />} />
      <Route path="construtora/:id/editar" element={<EmpreendimentoForm />} />
      <Route path="construtora/:id" element={<EmpreendimentoDetails />} />
      <Route path="construtora/:id/mapa" element={<PlaceholderPage title="Mapa de Disponibilidade" subtitle="Visualização inteligente das unidades" icon={Square3Stack3DIcon} />} />
      <Route path="terceiros/novo" element={<PlaceholderPage title="Cadastro de Imóvel de Terceiro" subtitle="Captação externa com comissão" icon={HomeIcon} />} />
      <Route path="aluguel/novo" element={<PlaceholderPage title="Cadastro de Imóvel para Aluguel" subtitle="Gestão de locação e contratos" icon={KeyIcon} />} />
    </Routes>
  );
}

export default Empreendimentos;