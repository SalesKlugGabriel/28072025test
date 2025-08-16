import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import {
  Plus, Search, Building, MapPin, Calendar,
  TrendingUp, Home, Edit2, Eye, Trash2, ArrowLeft, X, Clock,
  Info, Map, FileText, Image, Upload, Download, File, BarChart3, Table
} from 'lucide-react';
import ComparadorEmpreendimentos from '../components/ComparadorEmpreendimentos';
import LandingPageEmpreendimento from '../components/LandingPageEmpreendimento';
import AtualizadorTabelasEmpreendimento from '../components/AtualizadorTabelasEmpreendimento';

// Import das funcionalidades do módulo jurídico
import { getMinutaById, processarMinuta, type MinutaTemplate } from './Juridico';

// Interfaces
interface Localizacao {
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  bairro: string;
}

interface Responsaveis {
  tecnico: string;
  comercial: string;
  juridico: string;
}

interface TipoUnidade {
  id: string;
  nome: string;
  tipologia: string;
  areaPrivativa: string;
  vagas: number;
  valor: number;
  quantidade?: number;
}

interface Unidade {
  numero: number;
  status: string;
  tipologia: string;
  planta: string;
  vagas: number;
  valor: string;
  condicao: string;
  areaPrivativa: string;
  areaTotal: string;
}

interface ClienteReserva {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  endereco: {
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    cep: string;
    estado: string;
  };
}

interface CondicaoPagamento {
  id: string;
  nome: string;
  entrada: number; // percentual
  parcelas: number;
  intervalo: number; // meses
  juros: number; // percentual ao mês
}

interface Reserva {
  id: string;
  unidade: Unidade;
  cliente: ClienteReserva;
  condicaoPagamento: CondicaoPagamento;
  valorReserva: number;
  dataReserva: string;
  status: 'pendente' | 'aprovada' | 'rejeitada';
  observacoes?: string;
}

interface Bloco {
  id: string;
  nome: string;
  totalAndares: number;
  unidadesPorAndar: number;
  tipos: TipoUnidade[];
}

interface Empreendimento {
  id: string;
  nome: string;
  tipo: string;
  status: string;
  imagem: string;
  localizacao: Localizacao;
  unidadesTotal: number;
  unidadesVendidas: number;
  unidadesReservadas: number;
  valorTotal: string;
  valorMedio: number;
  dataInicio: string;
  dataPrevista: string;
  descricao: string;
  responsaveis: Responsaveis;
  tiposUnidade: TipoUnidade[];
  blocos: Bloco[];
  datas: {
    inicio: string;
    previsaoTermino: string;
  };
  infraestrutura?: string[];
  areaLazer?: string[];
  acabamento?: string[];
  ambientes?: string[];
  outrasInfo?: string[];
  historicoValores?: { mes: string; valor: number }[];
}

interface FormDataType {
  nome: string;
  tipo: string;
  status: string;
  localizacao: Localizacao;
  responsaveis: Responsaveis;
  descricao: string;
  dataInicio: string;
  dataPrevista: string;
  valorTotal: string;
  valorMedio: string;
  blocos: Array<{
    id: number;
    nome: string;
    totalAndares: number;
    unidadesPorAndar: number;
  }>;
  tiposApartamento: Array<{
    id: number;
    nome: string;
    tipologia: string;
    areaPrivativa: string;
    vagasGaragem: number;
    planta: File | null;
    preco: string;
  }>;
  infraestrutura: string[];
  areaLazer: string[];
  acabamento: string[];
  ambientes: string[];
  outrasInfo: string[];
}

function Empreendimentos() {
  // Mock data limpo e consistente
  const mockEmpreendimentos: Empreendimento[] = [
    {
      id: '1',
      nome: 'Residencial Solar das Flores',
      tipo: 'residencial',
      status: 'vendas',
      imagem: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      localizacao: {
        endereco: 'Rua das Palmeiras, 1500 - Centro',
        cidade: 'Florianópolis',
        estado: 'SC',
        cep: '88010-120',
        bairro: 'Centro'
      },
      unidadesTotal: 120,
      unidadesVendidas: 45,
      unidadesReservadas: 25,
      valorTotal: 'R$ 24.000.000',
      valorMedio: 350000,
      dataInicio: '2024-01-15',
      dataPrevista: '2025-12-30',
      descricao: 'Empreendimento residencial de alto padrão com 120 unidades, localizado no coração de Florianópolis.',
      responsaveis: {
        tecnico: 'Eng. João Silva',
        comercial: 'Maria Santos',
        juridico: 'Dr. Carlos Oliveira'
      },
      tiposUnidade: [
        { 
          id: 'tipo1',
          nome: 'Tipo 1', 
          tipologia: '2 quartos', 
          areaPrivativa: '65m²', 
          vagas: 1, 
          valor: 320000,
          quantidade: 60 
        },
        { 
          id: 'tipo2',
          nome: 'Tipo 2', 
          tipologia: '3 quartos', 
          areaPrivativa: '85m²', 
          vagas: 2, 
          valor: 450000,
          quantidade: 60 
        }
      ],
      blocos: [
        {
          id: 'bloco1',
          nome: 'Bloco A',
          totalAndares: 10,
          unidadesPorAndar: 4,
          tipos: [
            {
              id: 'tipo1',
              nome: 'Tipo 1',
              tipologia: '2 quartos',
              areaPrivativa: '65m²',
              vagas: 1,
              valor: 320000
            }
          ]
        }
      ],
      datas: {
        inicio: '2024-01-15',
        previsaoTermino: '2025-12-30'
      },
      historicoValores: [
        { mes: '2024-01', valor: 320000 },
        { mes: '2024-02', valor: 325000 },
        { mes: '2024-03', valor: 330000 }
      ]
    },
    {
      id: '2',
      nome: 'Comercial Business Center',
      tipo: 'comercial',
      status: 'construcao',
      imagem: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
      localizacao: {
        endereco: 'Av. Principal, 2000 - Empresarial',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01310-100',
        bairro: 'Empresarial'
      },
      unidadesTotal: 50,
      unidadesVendidas: 20,
      unidadesReservadas: 15,
      valorTotal: 'R$ 15.000.000',
      valorMedio: 250000,
      dataInicio: '2024-03-01',
      dataPrevista: '2025-08-15',
      descricao: 'Centro empresarial moderno com salas comerciais de diversos tamanhos.',
      responsaveis: {
        tecnico: 'Eng. Ana Costa',
        comercial: 'Pedro Lima',
        juridico: 'Dra. Julia Mendes'
      },
      tiposUnidade: [
        { 
          id: 'sala1',
          nome: 'Sala Pequena', 
          tipologia: 'Comercial', 
          areaPrivativa: '30m²', 
          vagas: 1, 
          valor: 180000,
          quantidade: 25 
        },
        { 
          id: 'sala2',
          nome: 'Sala Grande', 
          tipologia: 'Comercial', 
          areaPrivativa: '60m²', 
          vagas: 2, 
          valor: 350000,
          quantidade: 25 
        }
      ],
      blocos: [
        {
          id: 'bloco1',
          nome: 'Torre Comercial',
          totalAndares: 15,
          unidadesPorAndar: 3,
          tipos: [
            {
              id: 'sala1',
              nome: 'Sala Pequena',
              tipologia: 'Comercial',
              areaPrivativa: '30m²',
              vagas: 1,
              valor: 180000
            }
          ]
        }
      ],
      datas: {
        inicio: '2024-03-01',
        previsaoTermino: '2025-08-15'
      },
      historicoValores: [
        { mes: '2024-01', valor: 250000 },
        { mes: '2024-02', valor: 255000 },
        { mes: '2024-03', valor: 260000 }
      ]
    }
  ];

  // Função utilitária para formatar moeda
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Estado de filtros da listagem
  const [filtros, setFiltros] = useState({
    busca: '',
    status: '',
    tipo: ''
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [modoVisualizacao, setModoVisualizacao] = useState<'lista' | 'comparacao'>('lista');

  // Lista de Empreendimentos - VERSÃO CORRIGIDA
  function ListaEmpreendimentos() {
    const navigate = useNavigate();
    const empreendimentosFiltrados = mockEmpreendimentos.filter(emp => {
      const matchBusca = emp.nome.toLowerCase().includes(filtros.busca.toLowerCase());
      const matchStatus = !filtros.status || emp.status === filtros.status;
      const matchTipo = !filtros.tipo || emp.tipo === filtros.tipo;
      return matchBusca && matchStatus && matchTipo;
    });

    return (
      <div className="h-full flex flex-col">
        {/* Header Responsivo */}
        <div className="bg-white rounded-lg shadow-sm border p-3 mb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg lg:text-xl font-bold text-gray-900 truncate">Empreendimentos</h1>
              <p className="text-xs lg:text-sm text-gray-600">Gerencie todos os empreendimentos da empresa</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Toggle de visualização */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setModoVisualizacao('lista')}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors min-w-0 flex-1 sm:flex-none ${
                    modoVisualizacao === 'lista'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Building className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:block">Lista</span>
                </button>
                <button
                  onClick={() => setModoVisualizacao('comparacao')}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors min-w-0 flex-1 sm:flex-none ${
                    modoVisualizacao === 'comparacao'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:block">Comparação</span>
                </button>
              </div>

              {/* Botão Atualizador de Tabelas */}
              <button
                onClick={() => navigate('/empreendimentos/atualizador-tabelas')}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                <Table className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:block">Atualizar Tabelas</span>
              </button>
              
              {/* Botão Buscar */}
              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                  mostrarFiltros 
                    ? 'bg-blue-600 text-white' 
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:block">Buscar</span>
              </button>
              
              {/* Botão Novo */}
              <button
                onClick={() => navigate('/empreendimentos/novo')}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors min-w-0"
              >
                <Plus className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:block">Novo Empreendimento</span>
                <span className="sm:hidden">Novo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo Condicional */}
        {modoVisualizacao === 'lista' ? (
          <>
            {/* Filtros - Expansível */}
            {mostrarFiltros && (
              <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Buscar empreendimentos..."
                      value={filtros.busca}
                      onChange={(e) => setFiltros({...filtros, busca: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <select
                    value={filtros.status}
                    onChange={(e) => setFiltros({...filtros, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos os status</option>
                    <option value="planejamento">Planejamento</option>
                    <option value="construcao">Construção</option>
                    <option value="vendas">Vendas</option>
                    <option value="entregue">Entregue</option>
                  </select>
                </div>
                
                <div>
                  <select
                    value={filtros.tipo}
                    onChange={(e) => setFiltros({...filtros, tipo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos os tipos</option>
                    <option value="residencial">Residencial</option>
                    <option value="comercial">Comercial</option>
                    <option value="misto">Misto</option>
                    <option value="rural">Rural</option>
                  </select>
                </div>
              </div>
              </div>
            )}
          </>
        ) : null}

        {modoVisualizacao === 'lista' ? (
          /* Grid de Cards - VERSÃO MELHORADA */
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
            {empreendimentosFiltrados.map((emp) => {
            const progresso = ((emp.unidadesVendidas + emp.unidadesReservadas) / emp.unidadesTotal) * 100;
            const unidadesDisponiveis = emp.unidadesTotal - emp.unidadesVendidas - emp.unidadesReservadas;
            
            return (
              <div 
                key={emp.id} 
                onClick={() => navigate(`/empreendimentos/detalhes/${emp.id}`)}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden transform hover:-translate-y-1"
              >
                {/* Foto de Destaque */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  <img 
                    src={emp.imagem} 
                    alt={emp.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
                      emp.status === 'vendas' ? 'bg-green-500 text-white' :
                      emp.status === 'construcao' ? 'bg-blue-500 text-white' : 
                      emp.status === 'planejamento' ? 'bg-yellow-500 text-white' : 'bg-gray-500 text-white'
                    }`}>
                      {emp.status === 'vendas' ? 'Em Vendas' :
                       emp.status === 'construcao' ? 'Em Construção' :
                       emp.status === 'planejamento' ? 'Planejamento' : 'Pronto'}
                    </span>
                  </div>

                  {/* Overlay com ações rápidas */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/empreendimentos/mapa/${emp.id}`);
                        }}
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                        title="Ver Mapa"
                      >
                        <Map className="h-5 w-5 text-gray-700" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/empreendimentos/editar/${emp.id}`);
                        }}
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="h-5 w-5 text-gray-700" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-6">
                  {/* Título e Localização */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {emp.nome}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{emp.localizacao.cidade} - {emp.localizacao.bairro}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{emp.tipo}</p>
                  </div>

                  {/* Valor e Unidades */}
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-500">A partir de</p>
                      <p className="text-lg font-bold text-green-600">{formatCurrency(emp.valorMedio)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total de unidades</p>
                      <p className="text-lg font-bold text-gray-900">{emp.unidadesTotal}</p>
                    </div>
                  </div>

                  {/* Barra de Progresso */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span>Progresso de Vendas</span>
                      <span className="font-semibold">{progresso.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${progresso}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        {unidadesDisponiveis} disponíveis
                      </span>
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                        {emp.unidadesVendidas} vendidas
                      </span>
                    </div>
                  </div>

                  {/* Tags dos Tipos de Unidades */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {emp.tiposUnidade.slice(0, 2).map((tipo, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {tipo.tipologia}
                      </span>
                    ))}
                    {emp.tiposUnidade.length > 2 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700">
                        +{emp.tiposUnidade.length - 2} tipos
                      </span>
                    )}
                  </div>

                  {/* Data de Entrega */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Previsão de entrega:</span>
                    <span className="font-medium text-orange-600">
                      {new Date(emp.datas.previsaoTermino).toLocaleDateString('pt-BR', { 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>

                {/* Footer com Call to Action */}
                <div className="px-6 pb-6">
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      {emp.blocos.length} {emp.blocos.length === 1 ? 'bloco' : 'blocos'}
                    </span>
                    <div className="flex items-center text-blue-600 text-sm font-medium">
                      Ver detalhes
                      <Eye className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          </div>

            {/* Estado vazio */}
            {empreendimentosFiltrados.length === 0 && (
              <div className="text-center py-12">
                <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum empreendimento encontrado</h3>
                <p className="text-gray-600 mb-4">Tente ajustar os filtros ou cadastre um novo empreendimento</p>
                <button 
                  onClick={() => navigate('/empreendimentos/novo')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Cadastrar Empreendimento
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Comparador de Empreendimentos */
          <div className="flex-1 overflow-y-auto min-h-0">
            <ComparadorEmpreendimentos />
          </div>
        )}
      </div>
    );
  }

  // Formulário de Cadastro/Edição - VERSÃO CORRIGIDA
  function FormularioEmpreendimento() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [formData, setFormData] = useState<FormDataType>({
    nome: '',
    tipo: 'residencial',
    status: 'planejamento',
    localizacao: {
      endereco: '',
      cidade: '',
      estado: '',
      cep: '',
      bairro: ''
    },
    responsaveis: {
      tecnico: '',
      comercial: '',
      juridico: ''
    },
    descricao: '',
    dataInicio: '',
    dataPrevista: '',
    valorTotal: '',
    valorMedio: '',
    blocos: [{
      id: 1,
      nome: 'Bloco A',
      totalAndares: 10,
      unidadesPorAndar: 4
    }],
    tiposApartamento: [{
      id: 1,
      nome: 'Tipo 1',
      tipologia: '2 quartos',
      areaPrivativa: '',
      vagasGaragem: 1,
      planta: null,
      preco: ''
    }],
    infraestrutura: [],
    areaLazer: [],
    acabamento: [],
    ambientes: [],
    outrasInfo: []
  });

  const [opcoesTipo, setOpcoesTipo] = useState(['residencial', 'comercial', 'misto', 'rural']);
  const [opcoesStatus, setOpcoesStatus] = useState(['planejamento', 'aprovacao', 'construcao', 'vendas', 'entregue']);
  const [opcoesTipologia, setOpcoesTipologia] = useState(['1 quarto', '2 quartos', '3 quartos', '4 quartos', 'Cobertura', 'Studio', 'Loft']);
  const [opcoesOutrasInfo, setOpcoesOutrasInfo] = useState<string[]>([]);
  const [novaInfo, setNovaInfo] = useState('');

    const opcoesInfraestrutura = [
      'Elevador privativo',
      'Gerador',
      'Painéis solares',
      'Portaria 24h',
      'Segurança armada'
    ];

    const opcoesAreaLazer = [
      'Piscina aquecida',
      'Academia',
      'Spa',
      'Espaço gourmet',
      'Quadra poliesportiva'
    ];

    const opcoesAcabamento = [
      'Porcelanato',
      'Gesso',
      'Drywall',
      'Janela anti-ruído',
      'Mármore',
      'Automação residencial'
    ];

    const opcoesAmbientes = [
      'Salão de festas',
      'Sala de jogos',
      'Piscina',
      'Coworking',
      'Brinquedoteca',
      'Terraço'
    ];

    useEffect(() => {
      if (id) {
        const emp = mockEmpreendimentos.find(e => e.id === id);
        if (emp) {
          setFormData({
            nome: emp.nome,
            tipo: emp.tipo,
            status: emp.status,
            localizacao: emp.localizacao,
            responsaveis: emp.responsaveis,
            descricao: emp.descricao,
            dataInicio: emp.dataInicio,
            dataPrevista: emp.dataPrevista,
            valorTotal: emp.valorTotal,
            valorMedio: emp.valorMedio.toString(),
            blocos: emp.blocos.map((b, index) => ({
              id: index + 1,
              nome: b.nome,
              totalAndares: b.totalAndares,
              unidadesPorAndar: b.unidadesPorAndar
            })),
            tiposApartamento: emp.tiposUnidade.map((t, index) => ({
              id: index + 1,
              nome: t.nome,
              tipologia: t.tipologia,
              areaPrivativa: t.areaPrivativa,
              vagasGaragem: t.vagas,
              planta: null,
              preco: `R$ ${t.valor.toLocaleString()}`
            })),
            infraestrutura: emp.infraestrutura || [],
            areaLazer: emp.areaLazer || [],
            acabamento: emp.acabamento || [],
            ambientes: emp.ambientes || [],
            outrasInfo: emp.outrasInfo || []
          });
          if (!opcoesTipo.includes(emp.tipo)) setOpcoesTipo(prev => [...prev, emp.tipo]);
          if (!opcoesStatus.includes(emp.status)) setOpcoesStatus(prev => [...prev, emp.status]);
          emp.tiposUnidade.forEach(t => {
            if (!opcoesTipologia.includes(t.tipologia)) {
              setOpcoesTipologia(prev => [...prev, t.tipologia]);
            }
          });
          if (emp.outrasInfo) {
            setOpcoesOutrasInfo(emp.outrasInfo);
          }
        }
      }
    }, [id, opcoesStatus, opcoesTipo, opcoesTipologia]);

    const buscarCEP = async (cep: string) => {
      const limpo = cep.replace(/\D/g, '');
      if (limpo.length === 8) {
        try {
          const res = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
          const data = await res.json();
          if (!data.erro) {
            setFormData(f => ({
              ...f,
              localizacao: {
                ...f.localizacao,
                endereco: data.logradouro || f.localizacao.endereco,
                cidade: data.localidade || f.localizacao.cidade,
                estado: data.uf || f.localizacao.estado,
                bairro: data.bairro || f.localizacao.bairro,
                cep: data.cep || cep
              }
            }));
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    // Funções para gerenciar blocos
    const adicionarBloco = (): void => {
      setFormData({
        ...formData,
        blocos: [...formData.blocos, {
          id: Date.now(),
          nome: `Bloco ${String.fromCharCode(65 + formData.blocos.length)}`,
          totalAndares: 10,
          unidadesPorAndar: 4
        }]
      });
    };

    const removerBloco = (id: number): void => {
      if (formData.blocos.length > 1) {
        const novosBlocos = formData.blocos.filter(bloco => bloco.id !== id);
        setFormData({...formData, blocos: novosBlocos});
      }
    };

    const atualizarBloco = (id: number, campo: string, valor: string | number): void => {
      const novosBlocos = formData.blocos.map(bloco => 
        bloco.id === id ? {...bloco, [campo]: valor} : bloco
      );
      setFormData({...formData, blocos: novosBlocos});
    };

    // Funções para gerenciar tipos de apartamento
    const adicionarTipoApartamento = (): void => {
      setFormData({
        ...formData,
        tiposApartamento: [...formData.tiposApartamento, {
          id: Date.now(),
          nome: `Tipo ${formData.tiposApartamento.length + 1}`,
          tipologia: '2 quartos',
          areaPrivativa: '',
          vagasGaragem: 1,
          planta: null,
          preco: ''
        }]
      });
    };

    const removerTipoApartamento = (id: number): void => {
      if (formData.tiposApartamento.length > 1) {
        const novosTipos = formData.tiposApartamento.filter(tipo => tipo.id !== id);
        setFormData({...formData, tiposApartamento: novosTipos});
      }
    };

    const atualizarTipoApartamento = (id: number, campo: string, valor: string | number | File | null): void => {
      const novosTipos = formData.tiposApartamento.map(tipo => 
        tipo.id === id ? {...tipo, [campo]: valor} : tipo
      );
      setFormData({...formData, tiposApartamento: novosTipos});
    };

    const handleSubmit = (): void => {
      console.log('Dados do formulário:', formData);
      navigate('/empreendimentos');
    };

    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Novo Empreendimento</h1>
            <p className="text-gray-600 mt-2">Cadastre um novo empreendimento no sistema</p>
          </div>
          <button
            onClick={() => navigate('/empreendimentos')}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-8">
          {/* Informações Básicas */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Empreendimento *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Residencial Solar das Flores"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                <input
                  list="listaTipos"
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && formData.tipo && !opcoesTipo.includes(formData.tipo)) {
                      setOpcoesTipo([...opcoesTipo, formData.tipo]);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Residencial"
                />
                <datalist id="listaTipos">
                  {opcoesTipo.map((t) => (
                    <option key={t} value={t} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                <input
                  list="listaStatus"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && formData.status && !opcoesStatus.includes(formData.status)) {
                      setOpcoesStatus([...opcoesStatus, formData.status]);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Vendas"
                />
                <datalist id="listaStatus">
                  {opcoesStatus.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor Total Estimado
                </label>
                <input
                  type="text"
                  value={formData.valorTotal}
                  onChange={(e) => setFormData({...formData, valorTotal: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="R$ 0,00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor Médio por Unidade
                </label>
                <input
                  type="text"
                  value={formData.valorMedio}
                  onChange={(e) => setFormData({...formData, valorMedio: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="R$ 0,00"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descreva as características do empreendimento..."
              />
            </div>
          </div>

          {/* Localização */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Localização</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.localizacao.endereco}
                  onChange={(e) => setFormData({
                    ...formData, 
                    localizacao: {...formData.localizacao, endereco: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Rua, número"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bairro *</label>
                <input
                  type="text"
                  required
                  value={formData.localizacao.bairro}
                  onChange={(e) => setFormData({
                    ...formData, 
                    localizacao: {...formData.localizacao, bairro: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cidade *</label>
                <input
                  type="text"
                  required
                  value={formData.localizacao.cidade}
                  onChange={(e) => setFormData({
                    ...formData, 
                    localizacao: {...formData.localizacao, cidade: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado *</label>
                <select
                  value={formData.localizacao.estado}
                  onChange={(e) => setFormData({
                    ...formData, 
                    localizacao: {...formData.localizacao, estado: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="SC">Santa Catarina</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                <input
                  type="text"
                  value={formData.localizacao.cep}
                  onChange={(e) => setFormData({
                    ...formData,
                    localizacao: {...formData.localizacao, cep: e.target.value}
                  })}
                  onBlur={(e) => buscarCEP(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="00000-000"
                />
              </div>
            </div>
          </div>

          {/* Blocos do Empreendimento */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Blocos do Empreendimento</h2>
              <button
                type="button"
                onClick={adicionarBloco}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Adicionar Bloco
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.blocos.map((bloco, index) => (
                <div key={bloco.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">Bloco {index + 1}</h3>
                    {formData.blocos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removerBloco(bloco.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Bloco</label>
                      <input
                        type="text"
                        value={bloco.nome}
                        onChange={(e) => atualizarBloco(bloco.id, 'nome', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: Bloco A"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Número de Andares</label>
                      <input
                        type="number"
                        min="1"
                        value={bloco.totalAndares}
                        onChange={(e) => atualizarBloco(bloco.id, 'totalAndares', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Unidades por Andar</label>
                      <input
                        type="number"
                        min="1"
                        value={bloco.unidadesPorAndar}
                        onChange={(e) => atualizarBloco(bloco.id, 'unidadesPorAndar', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tipos de Apartamento */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Tipos de Apartamento (Plantas)</h2>
              <button
                type="button"
                onClick={adicionarTipoApartamento}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Adicionar Tipo
              </button>
            </div>
            
            <div className="space-y-6">
              {formData.tiposApartamento.map((tipo) => (
                <div key={tipo.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{tipo.nome}</h3>
                    {formData.tiposApartamento.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removerTipoApartamento(tipo.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Tipo</label>
                      <input
                        type="text"
                        value={tipo.nome}
                        onChange={(e) => atualizarTipoApartamento(tipo.id, 'nome', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: Tipo 1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tipologia</label>
                      <input
                        list="listaTipologias"
                        value={tipo.tipologia}
                        onChange={(e) => atualizarTipoApartamento(tipo.id, 'tipologia', e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && tipo.tipologia && !opcoesTipologia.includes(tipo.tipologia)) {
                            setOpcoesTipologia([...opcoesTipologia, tipo.tipologia]);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: 2 quartos"
                      />
                      <datalist id="listaTipologias">
                        {opcoesTipologia.map((t) => (
                          <option key={t} value={t} />
                        ))}
                      </datalist>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Área Privativa (m²)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={tipo.areaPrivativa}
                        onChange={(e) => atualizarTipoApartamento(tipo.id, 'areaPrivativa', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: 65.50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vagas de Garagem</label>
                      <input
                        type="number"
                        min="0"
                        value={tipo.vagasGaragem}
                        onChange={(e) => atualizarTipoApartamento(tipo.id, 'vagasGaragem', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preço Base (R$)</label>
                      <input
                        type="text"
                        value={tipo.preco}
                        onChange={(e) => atualizarTipoApartamento(tipo.id, 'preco', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="R$ 350.000,00"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Planta Baixa</label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files ? e.target.files[0] : null;
                          atualizarTipoApartamento(tipo.id, 'planta', file);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Características do Empreendimento */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Características do Empreendimento</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Infraestrutura</h3>
              <div className="space-y-2">
                {opcoesInfraestrutura.map((opcao) => (
                  <label key={opcao} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.infraestrutura.includes(opcao)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData({
                          ...formData,
                          infraestrutura: checked
                            ? [...formData.infraestrutura, opcao]
                            : formData.infraestrutura.filter(item => item !== opcao)
                        });
                      }}
                    />
                    {opcao}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Área de Lazer</h3>
              <div className="space-y-2">
                {opcoesAreaLazer.map((opcao) => (
                  <label key={opcao} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.areaLazer.includes(opcao)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData({
                          ...formData,
                          areaLazer: checked
                            ? [...formData.areaLazer, opcao]
                            : formData.areaLazer.filter(item => item !== opcao)
                        });
                      }}
                    />
                    {opcao}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Acabamento</h3>
              <div className="space-y-2">
                {opcoesAcabamento.map((opcao) => (
                  <label key={opcao} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.acabamento.includes(opcao)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData({
                          ...formData,
                          acabamento: checked
                            ? [...formData.acabamento, opcao]
                            : formData.acabamento.filter(item => item !== opcao)
                        });
                      }}
                    />
                    {opcao}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Ambientes</h3>
              <div className="space-y-2">
                {opcoesAmbientes.map((opcao) => (
                  <label key={opcao} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.ambientes.includes(opcao)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData({
                          ...formData,
                          ambientes: checked
                            ? [...formData.ambientes, opcao]
                            : formData.ambientes.filter(item => item !== opcao)
                        });
                      }}
                    />
                    {opcao}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Outras Informações</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.outrasInfo.map((info, idx) => (
                <span key={idx} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  {info}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        outrasInfo: formData.outrasInfo.filter((_, i) => i !== idx)
                      })
                    }
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={novaInfo}
              onChange={(e) => setNovaInfo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && novaInfo.trim()) {
                  const novo = novaInfo.trim();
                  setFormData({ ...formData, outrasInfo: [...formData.outrasInfo, novo] });
                  setOpcoesOutrasInfo([...opcoesOutrasInfo, novo]);
                  setNovaInfo('');
                  e.preventDefault();
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite e pressione Enter"
            />
          </div>
        </div>

        {/* Responsáveis */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Responsáveis</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Responsável Técnico</label>
                <input
                  type="text"
                  value={formData.responsaveis.tecnico}
                  onChange={(e) => setFormData({
                    ...formData, 
                    responsaveis: {...formData.responsaveis, tecnico: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome do engenheiro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Responsável Comercial</label>
                <input
                  type="text"
                  value={formData.responsaveis.comercial}
                  onChange={(e) => setFormData({
                    ...formData, 
                    responsaveis: {...formData.responsaveis, comercial: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome do corretor"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Responsável Jurídico</label>
                <input
                  type="text"
                  value={formData.responsaveis.juridico}
                  onChange={(e) => setFormData({
                    ...formData, 
                    responsaveis: {...formData.responsaveis, juridico: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome do advogado"
                />
              </div>
            </div>
          </div>

          {/* Cronograma */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cronograma</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data de Início</label>
                <input
                  type="date"
                  value={formData.dataInicio}
                  onChange={(e) => setFormData({...formData, dataInicio: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Prevista de Entrega</label>
                <input
                  type="date"
                  value={formData.dataPrevista}
                  onChange={(e) => setFormData({...formData, dataPrevista: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/empreendimentos')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Cadastrar Empreendimento
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Página de Detalhes - VERSÃO CORRIGIDA
  function DetalhesEmpreendimento() {
    const navigate = useNavigate();
    const { id: empreendimentoId } = useParams<{ id: string }>();
    const [abaAtiva, setAbaAtiva] = useState<string>('informacoes');
    const [modalReserva, setModalReserva] = useState<{ unidade: Unidade; empreendimento: Empreendimento } | null>(null);

    // Encontrar o empreendimento
    const empreendimento = mockEmpreendimentos.find(e => e.id === empreendimentoId);
    
    if (!empreendimento) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Empreendimento não encontrado</h2>
            <button 
              onClick={() => navigate('/empreendimentos')}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Voltar para lista
            </button>
          </div>
        </div>
      );
    }

    const abas = [
      { id: 'informacoes', nome: 'Informações', icone: Info },
      { id: 'tabelas', nome: 'Tabelas', icone: TrendingUp },
      { id: 'mapa', nome: 'Mapa de Disponibilidade', icone: Map },
      { id: 'documentos', nome: 'Documentos', icone: FileText },
      { id: 'fotos', nome: 'Fotos', icone: Image }
    ];

    return (
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        {/* Header com foto de capa */}
        <div className="relative h-64 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg overflow-hidden mb-6">
          <img 
            src={empreendimento.imagem} 
            alt={empreendimento.nome}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => navigate('/empreendimentos')}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                empreendimento.status === 'vendas' ? 'bg-green-500' :
                empreendimento.status === 'construcao' ? 'bg-blue-500' :
                empreendimento.status === 'planejamento' ? 'bg-yellow-500' :
                'bg-gray-500'
              }`}>
                {empreendimento.status === 'vendas' ? 'Em Vendas' :
                 empreendimento.status === 'construcao' ? 'Em Construção' :
                 empreendimento.status === 'planejamento' ? 'Planejamento' :
                 'Concluído'}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{empreendimento.nome}</h1>
            <div className="flex items-center gap-4 text-sm opacity-90">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {empreendimento.localizacao.cidade}, {empreendimento.localizacao.estado}
              </div>
              <div className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                {empreendimento.tipo}
              </div>
            </div>
          </div>
          
          {/* Botões de ação */}
          <div className="absolute top-6 right-6 flex gap-2">
            <button
              onClick={() => navigate(`/empreendimentos/landing/${empreendimentoId}`)}
              className="p-2 bg-green-500/90 backdrop-blur-sm rounded-lg hover:bg-green-600/90 transition-colors text-white"
              title="Ver Landing Page"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate(`/empreendimentos/editar/${empreendimentoId}`)}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors text-white"
              title="Editar Empreendimento"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navegação por abas */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex overflow-x-auto">
            {abas.map((aba) => {
              const IconeAba = aba.icone;
              return (
                <button
                  key={aba.id}
                  onClick={() => setAbaAtiva(aba.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 whitespace-nowrap transition-colors ${
                    abaAtiva === aba.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <IconeAba className="w-5 h-5" />
                  {aba.nome}
                </button>
              );
            })}
          </div>
        </div>

        {/* Conteúdo das abas */}
        <div className="bg-white rounded-lg shadow-sm border flex-1 min-h-0">
          <div className="h-full overflow-y-auto p-6">
            {abaAtiva === 'informacoes' && <AbaInformacoes empreendimento={empreendimento} />}
            {abaAtiva === 'tabelas' && <AbaTabelas empreendimento={empreendimento} />}
            {abaAtiva === 'mapa' && <AbaMapaDisponibilidade empreendimento={empreendimento} onReserva={(unidade) => setModalReserva({ unidade, empreendimento })} />}
            {abaAtiva === 'documentos' && <AbaDocumentos />}
            {abaAtiva === 'fotos' && <AbaFotos />}
          </div>
        </div>
        
        {/* Modal de Reserva */}
        {modalReserva && (
          <ModalReserva 
            unidade={modalReserva.unidade}
            empreendimento={modalReserva.empreendimento}
            onClose={() => setModalReserva(null)}
          />
        )}
      </div>
    );
  }

  // Componente: Aba Informações
  function AbaInformacoes({ empreendimento }: { empreendimento: Empreendimento }) {
    const progresso = ((empreendimento.unidadesVendidas + empreendimento.unidadesReservadas) / empreendimento.unidadesTotal) * 100;
    
    return (
      <div className="space-y-8">
        {/* Estatísticas principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total de Unidades</p>
                <p className="text-2xl font-bold text-blue-900">{empreendimento.unidadesTotal}</p>
              </div>
              <Home className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Vendidas</p>
                <p className="text-2xl font-bold text-green-900">{empreendimento.unidadesVendidas}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Reservadas</p>
                <p className="text-2xl font-bold text-yellow-900">{empreendimento.unidadesReservadas}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Disponíveis</p>
                <p className="text-2xl font-bold text-gray-900">
                  {empreendimento.unidadesTotal - empreendimento.unidadesVendidas - empreendimento.unidadesReservadas}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Progresso de Vendas</h3>
            <span className="text-2xl font-bold text-blue-600">{progresso.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${progresso}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>0 unidades</span>
            <span>{empreendimento.unidadesTotal} unidades</span>
          </div>
        </div>

        {empreendimento.historicoValores && empreendimento.historicoValores.length > 1 && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Progressão de Valor</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="p-2">Mês</th>
                    <th className="p-2">Valor</th>
                    <th className="p-2">Variação</th>
                  </tr>
                </thead>
                <tbody>
                  {empreendimento.historicoValores.map((item, index) => {
                    const anterior = index > 0 ? empreendimento.historicoValores![index - 1].valor : null;
                    const diff = anterior !== null ? item.valor - anterior : 0;
                    const perc = anterior !== null ? (diff / anterior) * 100 : 0;
                    return (
                      <tr key={item.mes} className="border-t">
                        <td className="p-2">{item.mes}</td>
                        <td className="p-2">R$ {item.valor.toLocaleString('pt-BR')}</td>
                        <td className={`p-2 ${diff >= 0 ? 'text-green-600' : 'text-red-600'}` }>
                          {anterior !== null ? `${diff >= 0 ? '+' : ''}${perc.toFixed(1)}% / ${diff >= 0 ? '+' : ''}R$ ${diff.toLocaleString('pt-BR')}` : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Informações detalhadas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Descrição */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Descrição do Empreendimento</h3>
            <div className="prose text-gray-600">
              <p>{empreendimento.descricao || 'Descrição não informada.'}</p>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">{empreendimento.localizacao.endereco}</span>
              </div>
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600 capitalize">{empreendimento.tipo}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Início: {empreendimento.dataInicio || 'Não informado'}</span>
              </div>
            </div>
          </div>

          {/* Responsáveis e tipos de unidades */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Responsáveis</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <span className="text-sm text-gray-500">Técnico:</span>
                    <span className="ml-2 text-gray-900">{empreendimento.responsaveis?.tecnico || 'Não informado'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <span className="text-sm text-gray-500">Comercial:</span>
                    <span className="ml-2 text-gray-900">{empreendimento.responsaveis?.comercial || 'Não informado'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <span className="text-sm text-gray-500">Jurídico:</span>
                    <span className="ml-2 text-gray-900">{empreendimento.responsaveis?.juridico || 'Não informado'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipos de Unidades</h3>
              <div className="space-y-3">
                {empreendimento.tiposUnidade?.map((tipo, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{tipo.nome}</h4>
                      <span className="text-sm text-blue-600 font-medium">R$ {tipo.valor.toLocaleString()}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>Tipologia: {tipo.tipologia}</div>
                      <div>Área: {tipo.areaPrivativa}</div>
                      <div>Vagas: {tipo.vagas}</div>
                      <div>Unidades: {tipo.quantidade}</div>
                    </div>
                  </div>
                )) || (
                  <p className="text-gray-500 text-sm">Nenhum tipo de unidade cadastrado.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Componente: Aba Tabelas
  function AbaTabelas({ empreendimento }: { empreendimento: Empreendimento }) {
    const [mostrarAtualizacao, setMostrarAtualizacao] = useState(false);
    const [arquivo, setArquivo] = useState<File | null>(null);
    const [filtroTipologia, setFiltroTipologia] = useState('');
    const [filtroAndar, setFiltroAndar] = useState('');
    const [valorFixo, setValorFixo] = useState('');
    const [valorPercentual, setValorPercentual] = useState('');
    const [novosValores, setNovosValores] = useState<string[]>(
      empreendimento.tiposUnidade?.map(t => `R$ ${t.valor.toLocaleString()}`) || []
    );

    const historico = empreendimento.historicoValores || [];
    const primeiroValor = historico[0]?.valor || 0;
    const ultimoValor = historico[historico.length - 1]?.valor || 0;
    const crescimento = ultimoValor - primeiroValor;
    const crescimentoPercentual = primeiroValor
      ? (crescimento / primeiroValor) * 100
      : 0;

    const aplicarAumento = () => {
      setNovosValores(prev =>
        prev.map(v => {
          let numero = parseFloat(v.replace(/[^0-9,-]+/g, '').replace(',', '.')) || 0;
          if (valorFixo) numero += parseFloat(valorFixo);
          if (valorPercentual) numero *= 1 + parseFloat(valorPercentual) / 100;
          return `R$ ${numero.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`;
        })
      );
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium">Valor Médio Atual</p>
            <p className="text-2xl font-bold text-blue-900">
              R$ {empreendimento.valorMedio.toLocaleString('pt-BR')}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">Crescimento</p>
            <p className="text-2xl font-bold text-green-900">
              R$ {crescimento.toLocaleString('pt-BR')}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-yellow-600 font-medium">Crescimento (%)</p>
            <p className="text-2xl font-bold text-yellow-900">
              {crescimentoPercentual.toFixed(2)}%
            </p>
          </div>
        </div>

        {historico.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Progressão de Valores
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Mês
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Valor
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {historico.map(h => (
                    <tr key={h.mes}>
                      <td className="px-4 py-2">{h.mes}</td>
                      <td className="px-4 py-2">
                        R$ {h.valor.toLocaleString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <button
          onClick={() => setMostrarAtualizacao(m => !m)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Atualizar Tabela
        </button>

        {mostrarAtualizacao && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload de Tabela (Excel ou PDF)
              </label>
              <input
                type="file"
                accept=".xls,.xlsx,.pdf"
                onChange={e => setArquivo(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {arquivo && (
                <p className="text-sm text-gray-600 mt-1">
                  Arquivo selecionado: {arquivo.name}
                </p>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtro por Tipologia
                </label>
                <input
                  value={filtroTipologia}
                  onChange={e => setFiltroTipologia(e.target.value)}
                  placeholder="Ex: 2 quartos"
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtro por Andar
                </label>
                <input
                  value={filtroAndar}
                  onChange={e => setFiltroAndar(e.target.value)}
                  placeholder="Ex: 5"
                  className="w-full border rounded-lg p-2"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Unidade
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Valor Atual
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Novo Valor
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {empreendimento.tiposUnidade
                    ?.filter(
                      t =>
                        (!filtroTipologia ||
                          t.tipologia
                            .toLowerCase()
                            .includes(filtroTipologia.toLowerCase())) &&
                        (!filtroAndar || t.nome.includes(filtroAndar))
                    )
                    .map((t, i) => (
                      <tr key={t.nome}>
                        <td className="px-4 py-2">
                          {t.nome} - {t.tipologia}
                        </td>
                        <td className="px-4 py-2">R$ {t.valor.toLocaleString()}</td>
                        <td className="px-4 py-2">
                          <input
                            value={novosValores[i] || ''}
                            onChange={e =>
                              setNovosValores(prev => {
                                const arr = [...prev];
                                arr[i] = e.target.value;
                                return arr;
                              })
                            }
                            className="w-full border rounded p-1"
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aumentar valor fixo (R$)
                </label>
                <input
                  type="number"
                  value={valorFixo}
                  onChange={e => setValorFixo(e.target.value)}
                  className="w-full border rounded-lg p-2"
                  placeholder="10000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aumentar porcentagem (%)
                </label>
                <input
                  type="number"
                  value={valorPercentual}
                  onChange={e => setValorPercentual(e.target.value)}
                  className="w-full border rounded-lg p-2"
                  placeholder="5"
                />
              </div>
              <button
                onClick={aplicarAumento}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Aplicar a Todos
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Componente: Aba Mapa de Disponibilidade
  function AbaMapaDisponibilidade({ empreendimento, onReserva }: { empreendimento: Empreendimento; onReserva: (unidade: Unidade) => void }) {
    const [tooltip, setTooltip] = useState<{ x: number; y: number; unidade: Unidade } | null>(null);
    const [unidades, setUnidades] = useState<{ numero: number; status: string }[]>([]);

    const gerarStatus = () => {
      const r = Math.random();
      if (r > 0.9) return 'vendido';
      if (r > 0.8) return 'reservado';
      if (r > 0.7) return 'diferente';
      if (r > 0.6) return 'indisponivel';
      return 'disponivel';
    };

    useEffect(() => {
      const inicial: { numero: number; status: string }[] = [];
      for (let andar = 10; andar >= 1; andar--) {
        for (let apto = 1; apto <= 4; apto++) {
          inicial.push({ numero: andar * 100 + apto, status: gerarStatus() });
        }
      }
      setUnidades(inicial);
    }, []);

    const handleUnidadeClick = (e: React.MouseEvent<HTMLButtonElement>, unidade: Unidade) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltip({ x: rect.left + rect.width / 2, y: rect.top + window.scrollY, unidade });
    };

    const cores = {
      disponivel: 'bg-green-500',
      reservado: 'bg-yellow-500',
      vendido: 'bg-red-500',
      diferente: 'bg-blue-500',
      indisponivel: 'bg-gray-500'
    } as const;

    return (
      <div className="space-y-6 flex flex-col items-center">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Legenda</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded"></div><span className="text-sm text-gray-700">Disponível</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-500 rounded"></div><span className="text-sm text-gray-700">Reservado</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-500 rounded"></div><span className="text-sm text-gray-700">Vendido</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-500 rounded"></div><span className="text-sm text-gray-700">Diferente</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-500 rounded"></div><span className="text-sm text-gray-700">Indisponível</span></div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center relative">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribuição das Unidades</h3>

          <div className="space-y-4 flex flex-col items-center">
            {Array.from({ length: 10 }, (_, andar) => {
              const numeroAndar = 10 - andar;
              return (
                <div key={numeroAndar} className="flex items-center gap-4">
                  <div className="w-12 text-center text-sm font-medium text-gray-600">{numeroAndar}º</div>
                  <div className="flex gap-2">
                    {Array.from({ length: 4 }, (_, apto) => {
                      const numeroApto = numeroAndar * 100 + (apto + 1);
                      const unidade = unidades.find(u => u.numero === numeroApto);
                      const status = (unidade?.status || 'disponivel') as keyof typeof cores;
                      return (
                        <button
                          key={numeroApto}
                          onClick={(e) =>
                            handleUnidadeClick(e, {
                              numero: numeroApto,
                              status,
                              tipologia: '2 quartos',
                              planta: 'Planta A',
                              vagas: 1,
                              valor: 'R$ 350.000',
                              condicao: 'Financiamento',
                              areaPrivativa: '65m²',
                              areaTotal: '80m²'
                            })
                          }
                          className={`w-12 h-12 ${cores[status]} text-white text-xs font-medium rounded flex items-center justify-center`}
                          title={`Apto ${numeroApto} - ${status}`}
                        >
                          {apto + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-center text-gray-500 text-sm">
            <p>Clique nas unidades para ver mais detalhes</p>
          </div>
        </div>

        {tooltip && (
          <div className="fixed z-50 bg-white border rounded-lg p-4 shadow-lg text-xs" style={{ top: tooltip.y, left: tooltip.x }}>
            <button onClick={() => setTooltip(null)} className="absolute top-1 right-1 text-gray-500 hover:text-gray-700">
              <X className="w-4 h-4" />
            </button>
            <h4 className="font-semibold mb-2">Unidade {tooltip.unidade.numero}</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
              <div><span className="font-medium">Status:</span> {tooltip.unidade.status}</div>
              <div><span className="font-medium">Tipologia:</span> {tooltip.unidade.tipologia}</div>
              <div><span className="font-medium">Planta:</span> {tooltip.unidade.planta}</div>
              <div><span className="font-medium">Vagas:</span> {tooltip.unidade.vagas}</div>
              <div><span className="font-medium">Valor:</span> {tooltip.unidade.valor}</div>
              <div><span className="font-medium">Condição:</span> {tooltip.unidade.condicao}</div>
              <div><span className="font-medium">Área privativa:</span> {tooltip.unidade.areaPrivativa}</div>
              <div><span className="font-medium">Área total:</span> {tooltip.unidade.areaTotal}</div>
            </div>
            {tooltip.unidade.status === 'disponivel' && (
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    onReserva(tooltip.unidade);
                    setTooltip(null);
                  }}
                  className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  Reservar Unidade
                </button>
                <button className="px-3 py-1.5 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors">
                  Ver Detalhes
                </button>
              </div>
            )}
          </div>
        )}
        
      </div>
    );
  }

  // Componente: Aba Documentos
  function AbaDocumentos() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Documentos do Empreendimento</h3>
            <p className="text-gray-600 mt-1">Gerencie toda a documentação técnica e jurídica</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Upload className="w-4 h-4" />
            Enviar Documento
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { nome: 'Alvará de Construção', tipo: 'PDF', categoria: 'Licenças' },
            { nome: 'Memorial Descritivo', tipo: 'PDF', categoria: 'Técnico' },
            { nome: 'Matrícula do Terreno', tipo: 'PDF', categoria: 'Jurídico' }
          ].map((doc, index) => (
            <div key={index} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-red-500" />
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900 text-sm leading-tight">{doc.nome}</h5>
                    <p className="text-xs text-gray-500 mt-1">{doc.tipo} • {doc.categoria}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Componente: Aba Fotos
  function AbaFotos() {
    const fotos = [
      { id: 1, url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400', categoria: 'Fachada', titulo: 'Vista Principal' },
      { id: 2, url: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400', categoria: 'Apartamentos', titulo: 'Apartamento Decorado' },
      { id: 3, url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400', categoria: 'Lazer', titulo: 'Piscina' }
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Galeria de Fotos</h3>
            <p className="text-gray-600 mt-1">Explore as imagens do empreendimento</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Upload className="w-4 h-4" />
            Enviar Fotos
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {fotos.map(foto => (
            <div key={foto.id} className="group relative bg-white rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow">
              <div className="aspect-square overflow-hidden">
                <img
                  src={foto.url}
                  alt={foto.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-blue-600 font-medium">{foto.categoria}</span>
                </div>
                <h4 className="text-sm font-medium text-gray-900 truncate">{foto.titulo}</h4>
              </div>
              
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button className="p-2 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Mapa de Disponibilidade Dedicado
  // Componentes das etapas do modal de reserva
  function EtapaCliente({ clienteData, setClienteData, onNext }: {
    clienteData: ClienteReserva;
    setClienteData: (data: ClienteReserva) => void;
    onNext: () => void;
  }) {
    const [errors, setErrors] = useState<any>({});
    
    const validarFormulario = () => {
      const newErrors: any = {};
      
      if (!clienteData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
      if (!clienteData.cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
      if (!clienteData.email.trim()) newErrors.email = 'Email é obrigatório';
      if (!clienteData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = () => {
      if (validarFormulario()) {
        onNext();
      }
    };
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              value={clienteData.nome}
              onChange={(e) => setClienteData({ ...clienteData, nome: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                errors.nome ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Digite o nome completo"
            />
            {errors.nome && <p className="text-red-600 text-sm mt-1">{errors.nome}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CPF *
            </label>
            <input
              type="text"
              value={clienteData.cpf}
              onChange={(e) => setClienteData({ ...clienteData, cpf: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                errors.cpf ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="000.000.000-00"
            />
            {errors.cpf && <p className="text-red-600 text-sm mt-1">{errors.cpf}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={clienteData.email}
              onChange={(e) => setClienteData({ ...clienteData, email: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="email@exemplo.com"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone *
            </label>
            <input
              type="tel"
              value={clienteData.telefone}
              onChange={(e) => setClienteData({ ...clienteData, telefone: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                errors.telefone ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="(11) 99999-9999"
            />
            {errors.telefone && <p className="text-red-600 text-sm mt-1">{errors.telefone}</p>}
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Endereço</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
              <input
                type="text"
                value={clienteData.endereco.cep}
                onChange={(e) => setClienteData({ 
                  ...clienteData, 
                  endereco: { ...clienteData.endereco, cep: e.target.value }
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="00000-000"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Logradouro</label>
              <input
                type="text"
                value={clienteData.endereco.logradouro}
                onChange={(e) => setClienteData({ 
                  ...clienteData, 
                  endereco: { ...clienteData.endereco, logradouro: e.target.value }
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Rua, Avenida, etc."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
              <input
                type="text"
                value={clienteData.endereco.numero}
                onChange={(e) => setClienteData({ 
                  ...clienteData, 
                  endereco: { ...clienteData.endereco, numero: e.target.value }
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="123"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
              <input
                type="text"
                value={clienteData.endereco.bairro}
                onChange={(e) => setClienteData({ 
                  ...clienteData, 
                  endereco: { ...clienteData.endereco, bairro: e.target.value }
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Nome do bairro"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
              <input
                type="text"
                value={clienteData.endereco.cidade}
                onChange={(e) => setClienteData({ 
                  ...clienteData, 
                  endereco: { ...clienteData.endereco, cidade: e.target.value }
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Nome da cidade"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Próximo Passo
          </button>
        </div>
      </div>
    );
  }
  
  function EtapaPagamento({ condicoes, condicaoSelecionada, setCondicaoSelecionada, valorUnidade, calcularValores, formatCurrency, onBack, onNext }: {
    condicoes: CondicaoPagamento[];
    condicaoSelecionada: CondicaoPagamento | null;
    setCondicaoSelecionada: (condicao: CondicaoPagamento) => void;
    valorUnidade: number;
    calcularValores: (condicao: CondicaoPagamento) => any;
    formatCurrency: (value: number) => string;
    onBack: () => void;
    onNext: () => void;
  }) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Selecione a Condição de Pagamento
          </h3>
          <p className="text-gray-600 mb-6">
            Valor da unidade: <span className="font-semibold">{formatCurrency(valorUnidade)}</span>
          </p>
        </div>
        
        <div className="space-y-4">
          {condicoes.map((condicao) => {
            const { valorEntrada, valorParcela } = calcularValores(condicao);
            const isSelected = condicaoSelecionada?.id === condicao.id;
            
            return (
              <div
                key={condicao.id}
                onClick={() => setCondicaoSelecionada(condicao)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => setCondicaoSelecionada(condicao)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <label className="ml-3 text-lg font-medium text-gray-900">
                        {condicao.nome}
                      </label>
                    </div>
                    
                    <div className="ml-7 space-y-1 text-sm text-gray-600">
                      <p>Entrada: <span className="font-medium">{formatCurrency(valorEntrada)} ({condicao.entrada}%)</span></p>
                      {condicao.parcelas > 1 && (
                        <p>
                          Parcelas: <span className="font-medium">
                            {condicao.parcelas}x de {formatCurrency(valorParcela)}
                          </span>
                          {condicao.juros > 0 && (
                            <span className="text-gray-500"> (juros: {condicao.juros}% a.m.)</span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Voltar
          </button>
          <button
            onClick={onNext}
            disabled={!condicaoSelecionada}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Próximo Passo
          </button>
        </div>
      </div>
    );
  }
  
  function EtapaConfirmacao({ unidade, empreendimento, clienteData, condicaoSelecionada, observacoes, setObservacoes, valorUnidade, calcularValores, formatCurrency, onBack, onConfirm, loading }: {
    unidade: Unidade;
    empreendimento: Empreendimento;
    clienteData: ClienteReserva;
    condicaoSelecionada: CondicaoPagamento;
    observacoes: string;
    setObservacoes: (obs: string) => void;
    valorUnidade: number;
    calcularValores: (condicao: CondicaoPagamento) => any;
    formatCurrency: (value: number) => string;
    onBack: () => void;
    onConfirm: () => void;
    loading: boolean;
  }) {
    const { valorEntrada, valorParcela } = calcularValores(condicaoSelecionada);
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Confirme os Dados da Reserva
          </h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resumo da Unidade */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Dados da Unidade</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Empreendimento:</span> {empreendimento.nome}</p>
              <p><span className="font-medium">Unidade:</span> {unidade.numero}</p>
              <p><span className="font-medium">Tipologia:</span> {unidade.tipologia}</p>
              <p><span className="font-medium">Área Privativa:</span> {unidade.areaPrivativa}</p>
              <p><span className="font-medium">Valor:</span> {formatCurrency(valorUnidade)}</p>
            </div>
          </div>
          
          {/* Dados do Cliente */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Dados do Cliente</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Nome:</span> {clienteData.nome}</p>
              <p><span className="font-medium">CPF:</span> {clienteData.cpf}</p>
              <p><span className="font-medium">Email:</span> {clienteData.email}</p>
              <p><span className="font-medium">Telefone:</span> {clienteData.telefone}</p>
            </div>
          </div>
          
          {/* Condição de Pagamento */}
          <div className="bg-blue-50 p-4 rounded-lg lg:col-span-2">
            <h4 className="font-medium text-blue-900 mb-3">Condição de Pagamento</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Forma:</span> {condicaoSelecionada.nome}</p>
              <p><span className="font-medium">Entrada:</span> {formatCurrency(valorEntrada)} ({condicaoSelecionada.entrada}%)</p>
              {condicaoSelecionada.parcelas > 1 && (
                <p>
                  <span className="font-medium">Parcelas:</span> {condicaoSelecionada.parcelas}x de {formatCurrency(valorParcela)}
                  {condicaoSelecionada.juros > 0 && (
                    <span className="text-blue-700"> (juros: {condicaoSelecionada.juros}% a.m.)</span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observações Adicionais
          </label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Informações adicionais sobre a reserva..."
          />
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Atenção:</strong> Ao confirmar, será gerada uma proposta em formato de documento 
            que poderá ser enviada para aprovação da construtora ou utilizada para efetuar a aquisição 
            do imóvel. O cliente também será cadastrado no sistema.
          </p>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={onBack}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Voltar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {loading ? 'Gerando Proposta...' : 'Confirmar e Gerar Proposta'}
          </button>
        </div>
      </div>
    );
  }
  
  // Componente: Modal de Reserva de Unidade
  function ModalReserva({ unidade, empreendimento, onClose }: { 
    unidade: Unidade; 
    empreendimento: Empreendimento; 
    onClose: () => void;
  }) {
    const [etapa, setEtapa] = useState<'cliente' | 'pagamento' | 'confirmacao'>('cliente');
    const [clienteData, setClienteData] = useState<ClienteReserva>({
      nome: '',
      cpf: '',
      email: '',
      telefone: '',
      endereco: {
        logradouro: '',
        numero: '',
        bairro: '',
        cidade: '',
        cep: '',
        estado: ''
      }
    });
    
    const [condicaoSelecionada, setCondicaoSelecionada] = useState<CondicaoPagamento | null>(null);
    const [observacoes, setObservacoes] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Condições de pagamento mockadas
    const condicoesPagamento: CondicaoPagamento[] = [
      { id: '1', nome: 'À Vista', entrada: 100, parcelas: 1, intervalo: 0, juros: 0 },
      { id: '2', nome: 'Entrada + 60x', entrada: 30, parcelas: 60, intervalo: 1, juros: 0.8 },
      { id: '3', nome: 'Entrada + 120x', entrada: 20, parcelas: 120, intervalo: 1, juros: 1.0 },
      { id: '4', nome: 'Financiamento CEF', entrada: 20, parcelas: 420, intervalo: 1, juros: 0.65 },
      { id: '5', nome: 'Consórcio Contemplado', entrada: 0, parcelas: 1, intervalo: 0, juros: 0 }
    ];
    
    const valorUnidade = parseFloat(unidade.valor.replace('R$ ', '').replace('.', '').replace(',', '.'));
    
    const calcularValores = (condicao: CondicaoPagamento) => {
      const valorEntrada = (valorUnidade * condicao.entrada) / 100;
      const valorFinanciado = valorUnidade - valorEntrada;
      const valorParcela = condicao.parcelas > 1 
        ? valorFinanciado * (1 + (condicao.juros / 100)) / condicao.parcelas
        : 0;
      
      return { valorEntrada, valorFinanciado, valorParcela };
    };
    
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    };
    
    const gerarMinuta = async () => {
      if (!condicaoSelecionada) return;
      
      setLoading(true);
      
      try {
        const { valorEntrada, valorParcela } = calcularValores(condicaoSelecionada);
        
        // Buscar minuta base do módulo jurídico (Termo de Reserva)
        const minutaBase = getMinutaById('2'); // ID da minuta "Termo de Reserva de Unidade"
        
        if (!minutaBase) {
          alert('Minuta base não encontrada. Configure as minutas no módulo Jurídico.');
          return;
        }
        
        // Simular processamento
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Preparar dados para substituição na minuta
        const dadosMinuta = {
          nomeEmpreendimento: empreendimento.nome,
          nomeIncorporadora: 'LegaSys Incorporadora Ltda',
          cnpjIncorporadora: '12.345.678/0001-90',
          nomeCliente: clienteData.nome,
          cpfCliente: clienteData.cpf,
          emailCliente: clienteData.email,
          telefoneCliente: clienteData.telefone,
          enderecoCliente: `${clienteData.endereco.logradouro}, ${clienteData.endereco.numero} - ${clienteData.endereco.bairro}, ${clienteData.endereco.cidade}/${clienteData.endereco.estado} - CEP: ${clienteData.endereco.cep}`,
          numeroUnidade: unidade.numero.toString(),
          tipologiaUnidade: unidade.tipologia,
          areaPrivativa: unidade.areaPrivativa.replace('m²', ''),
          numeroVagas: unidade.vagas.toString(),
          valorUnidade: formatCurrency(valorUnidade),
          condicaoPagamento: condicaoSelecionada.nome,
          valorEntrada: formatCurrency(valorEntrada),
          percentualEntrada: condicaoSelecionada.entrada.toString(),
          parcelasInfo: condicaoSelecionada.parcelas > 1 
            ? `- Parcelas: ${condicaoSelecionada.parcelas}x de ${formatCurrency(valorParcela)}${condicaoSelecionada.juros > 0 ? ` (juros: ${condicaoSelecionada.juros}% a.m.)` : ''}`
            : '',
          valorReserva: formatCurrency(valorEntrada * 0.1), // 10% da entrada como reserva
          prazoReserva: '30', // 30 dias padrão
          observacoes: observacoes || 'Nenhuma observação adicional.',
          cidade: empreendimento.localizacao.cidade,
          dataReserva: new Date().toLocaleDateString('pt-BR')
        };
        
        // Processar minuta com os dados
        const minutaProcessada = processarMinuta(minutaBase.conteudo, dadosMinuta);
        
        // Criar documento para download
        const blob = new Blob([minutaProcessada], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Termo_Reserva_Unidade_${unidade.numero}_${empreendimento.nome.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Salvar cliente no sistema (integrar com módulo Pessoas)
        // TODO: Implementar integração com módulo de Pessoas
        const novoCliente = {
          id: crypto.randomUUID(),
          tipo: 'cliente' as const,
          nome: clienteData.nome,
          cpfCnpj: clienteData.cpf,
          email: clienteData.email,
          telefone: clienteData.telefone,
          endereco: clienteData.endereco,
          pessoaFisica: true,
          status: 'ativo' as const,
          dataInclusao: new Date().toISOString().split('T')[0],
          dataAtualizacao: new Date().toISOString().split('T')[0],
          tags: ['reserva', 'unidade-' + unidade.numero],
          observacoes: `Cliente interessado na unidade ${unidade.numero} do empreendimento ${empreendimento.nome}. Reserva gerada em ${new Date().toLocaleDateString('pt-BR')}.`,
          responsavel: 'Sistema'
        };
        
        console.log('Cliente a ser salvo no módulo Pessoas:', novoCliente);
        
        alert(`Termo de Reserva gerado com sucesso!

Documento: Termo_Reserva_Unidade_${unidade.numero}
Cliente: ${clienteData.nome}
Valor da Reserva: ${formatCurrency(valorEntrada * 0.1)}

Arquivo baixado automaticamente.`);
        onClose();
        
      } catch (error) {
        console.error('Erro ao gerar termo de reserva:', error);
        alert('Erro ao gerar termo de reserva. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Reservar Unidade {unidade.numero}
                </h2>
                <p className="text-gray-600">
                  {empreendimento.nome} • {unidade.tipologia} • {unidade.valor}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center mt-4 space-x-4">
              <div className={`flex items-center ${etapa === 'cliente' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  etapa === 'cliente' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                }`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium">Dados do Cliente</span>
              </div>
              <div className={`flex items-center ${etapa === 'pagamento' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  etapa === 'pagamento' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                }`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Condição de Pagamento</span>
              </div>
              <div className={`flex items-center ${etapa === 'confirmacao' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  etapa === 'confirmacao' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                }`}>
                  3
                </div>
                <span className="ml-2 text-sm font-medium">Confirmação</span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {etapa === 'cliente' && (
              <EtapaCliente 
                clienteData={clienteData}
                setClienteData={setClienteData}
                onNext={() => setEtapa('pagamento')}
              />
            )}
            
            {etapa === 'pagamento' && (
              <EtapaPagamento 
                condicoes={condicoesPagamento}
                condicaoSelecionada={condicaoSelecionada}
                setCondicaoSelecionada={setCondicaoSelecionada}
                valorUnidade={valorUnidade}
                calcularValores={calcularValores}
                formatCurrency={formatCurrency}
                onBack={() => setEtapa('cliente')}
                onNext={() => setEtapa('confirmacao')}
              />
            )}
            
            {etapa === 'confirmacao' && (
              <EtapaConfirmacao 
                unidade={unidade}
                empreendimento={empreendimento}
                clienteData={clienteData}
                condicaoSelecionada={condicaoSelecionada!}
                observacoes={observacoes}
                setObservacoes={setObservacoes}
                valorUnidade={valorUnidade}
                calcularValores={calcularValores}
                formatCurrency={formatCurrency}
                onBack={() => setEtapa('pagamento')}
                onConfirm={gerarMinuta}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
  
  function MapaDisponibilidade() {
    const navigate = useNavigate();
    const { id: empreendimentoId } = useParams<{ id: string }>();
    const empreendimento = mockEmpreendimentos.find(e => e.id === empreendimentoId);
    const [modalReserva, setModalReserva] = useState<{ unidade: Unidade; empreendimento: Empreendimento } | null>(null);
    
    if (!empreendimento) {
      return (
        <div className="space-y-6">
          <div className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Empreendimento não encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">O empreendimento solicitado não existe.</p>
            <button 
              onClick={() => navigate('/empreendimentos')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voltar à Lista
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mapa de Disponibilidade</h1>
            <p className="text-gray-600">{empreendimento.nome}</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => navigate(`/empreendimentos/detalhes/${empreendimentoId}`)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Ver Detalhes
            </button>
            <button 
              onClick={() => navigate('/empreendimentos')} 
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <AbaMapaDisponibilidade empreendimento={empreendimento} onReserva={(unidade) => setModalReserva({ unidade, empreendimento })} />
        </div>
        
        {/* Modal de Reserva */}
        {modalReserva && (
          <ModalReserva 
            unidade={modalReserva.unidade}
            empreendimento={modalReserva.empreendimento}
            onClose={() => setModalReserva(null)}
          />
        )}
      </div>
    );
  }

  // Router principal
  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="flex-1 overflow-y-auto p-6 min-h-0">
        <Routes>
          <Route index element={<ListaEmpreendimentos />} />
          <Route path="novo" element={<FormularioEmpreendimento />} />
          <Route path="editar/:id" element={<FormularioEmpreendimento />} />
          <Route path="detalhes/:id" element={<DetalhesEmpreendimento />} />
          <Route path="mapa/:id" element={<MapaDisponibilidade />} />
          <Route path="landing/:id" element={<LandingPageEmpreendimento />} />
          <Route path="atualizador-tabelas" element={<AtualizadorTabelasEmpreendimento />} />
        </Routes>
      </div>
    </div>
  );
}

export default Empreendimentos;