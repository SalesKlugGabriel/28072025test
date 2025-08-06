import React, { useState } from 'react';
import {
  Plus, Search, Filter, Building, MapPin, Calendar, Users,
  TrendingUp, Home, Edit2, Eye, Trash2, ArrowLeft, X, Clock,
  Info, Map, FileText, Image, Upload, Download, Shield,
  Wrench, Scale, File, FileImage
} from 'lucide-react';

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
  nome: string;
  tipologia: string;
  areaPrivativa: string;
  vagasGaragem: number;
  quantidade: number;
  preco: string;
}

interface Bloco {
  id: string;
  nome: string;
  totalAndares: number;
  unidadesPorAndar: number;
  tipos: any[];
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
          nome: 'Tipo 1', 
          tipologia: '2 quartos', 
          areaPrivativa: '65m²', 
          vagasGaragem: 1, 
          quantidade: 60, 
          preco: 'R$ 320.000' 
        },
        { 
          nome: 'Tipo 2', 
          tipologia: '3 quartos', 
          areaPrivativa: '85m²', 
          vagasGaragem: 2, 
          quantidade: 60, 
          preco: 'R$ 450.000' 
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
              areaPrivativa: 65,
              vagas: 1,
              valor: 320000
            }
          ]
        }
      ],
      datas: {
        inicio: '2024-01-15',
        previsaoTermino: '2025-12-30'
      }
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
          nome: 'Sala Pequena', 
          tipologia: 'Comercial', 
          areaPrivativa: '30m²', 
          vagasGaragem: 1, 
          quantidade: 25, 
          preco: 'R$ 180.000' 
        },
        { 
          nome: 'Sala Grande', 
          tipologia: 'Comercial', 
          areaPrivativa: '60m²', 
          vagasGaragem: 2, 
          quantidade: 25, 
          preco: 'R$ 350.000' 
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
              areaPrivativa: 30,
              vagas: 1,
              valor: 180000
            }
          ]
        }
      ],
      datas: {
        inicio: '2024-03-01',
        previsaoTermino: '2025-08-15'
      }
    }
  ];

  // Função utilitária para formatar moeda
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Estados principais
  const [currentView, setCurrentView] = useState<string>('lista');
  const [filtros, setFiltros] = useState({
    busca: '',
    status: '',
    tipo: ''
  });

  // Navegação simulada
  const navigate = (path: string): void => {
    if (path === '/empreendimentos') {
      setCurrentView('lista');
    } else if (path.includes('/novo')) {
      setCurrentView('formulario');
    } else if (path.includes('/editar')) {
      setCurrentView('formulario');
    } else if (path.includes('/detalhes')) {
      setCurrentView('detalhes');
    } else if (path.includes('/mapa')) {
      setCurrentView('mapa');
    }
  };

  // Lista de Empreendimentos - VERSÃO CORRIGIDA
  function ListaEmpreendimentos() {
    const empreendimentosFiltrados = mockEmpreendimentos.filter(emp => {
      const matchBusca = emp.nome.toLowerCase().includes(filtros.busca.toLowerCase());
      const matchStatus = !filtros.status || emp.status === filtros.status;
      const matchTipo = !filtros.tipo || emp.tipo === filtros.tipo;
      return matchBusca && matchStatus && matchTipo;
    });

    return (
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Empreendimentos</h1>
            <p className="text-gray-600 mt-2">Gerencie todos os empreendimentos da empresa</p>
          </div>
          <button 
            onClick={() => navigate('/empreendimentos/novo')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Empreendimento
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
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

        {/* Grid de Cards - VERSÃO MELHORADA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
    );
  }

  // Formulário de Cadastro/Edição - VERSÃO CORRIGIDA
  function FormularioEmpreendimento() {
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
      }]
    });

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

    const atualizarBloco = (id: number, campo: string, valor: any): void => {
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

    const atualizarTipoApartamento = (id: number, campo: string, valor: any): void => {
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
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="residencial">Residencial</option>
                  <option value="comercial">Comercial</option>
                  <option value="misto">Misto</option>
                  <option value="rural">Rural</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="planejamento">Planejamento</option>
                  <option value="aprovacao">Aprovação</option>
                  <option value="construcao">Construção</option>
                  <option value="vendas">Vendas</option>
                  <option value="entregue">Entregue</option>
                </select>
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
                      <select
                        value={tipo.tipologia}
                        onChange={(e) => atualizarTipoApartamento(tipo.id, 'tipologia', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="1 quarto">1 quarto</option>
                        <option value="2 quartos">2 quartos</option>
                        <option value="3 quartos">3 quartos</option>
                        <option value="4 quartos">4 quartos</option>
                        <option value="Cobertura">Cobertura</option>
                        <option value="Studio">Studio</option>
                        <option value="Loft">Loft</option>
                      </select>
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
    const [abaAtiva, setAbaAtiva] = useState<string>('informacoes');
    
    // Simular ID do empreendimento (na implementação real viria da URL)
    const empreendimentoId = '1';
    
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
      { id: 'mapa', nome: 'Mapa de Disponibilidade', icone: Map },
      { id: 'documentos', nome: 'Documentos', icone: FileText },
      { id: 'fotos', nome: 'Fotos', icone: Image }
    ];

    return (
      <div className="max-w-7xl mx-auto">
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
          
          {/* Botão de edição */}
          <button
            onClick={() => navigate(`/empreendimentos/editar/${empreendimentoId}`)}
            className="absolute top-6 right-6 p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors text-white"
          >
            <Edit2 className="w-5 h-5" />
          </button>
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
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {abaAtiva === 'informacoes' && <AbaInformacoes empreendimento={empreendimento} />}
          {abaAtiva === 'mapa' && <AbaMapaDisponibilidade />}
          {abaAtiva === 'documentos' && <AbaDocumentos />}
          {abaAtiva === 'fotos' && <AbaFotos />}
        </div>
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
                      <span className="text-sm text-blue-600 font-medium">{tipo.preco}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>Tipologia: {tipo.tipologia}</div>
                      <div>Área: {tipo.areaPrivativa}</div>
                      <div>Vagas: {tipo.vagasGaragem}</div>
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

  // Componente: Aba Mapa de Disponibilidade
  function AbaMapaDisponibilidade() {
    const [unidadeSelecionada, setUnidadeSelecionada] = useState<any>(null);
    
    return (
      <div className="space-y-6">
        {/* Legenda */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Legenda</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-700">Disponível</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm text-gray-700">Reservado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-700">Vendido</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-800 rounded"></div>
              <span className="text-sm text-gray-700">Indisponível</span>
            </div>
          </div>
        </div>

        {/* Mapa de Unidades */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribuição das Unidades</h3>
          
          <div className="space-y-4">
            {Array.from({ length: 10 }, (_, andar) => {
              const numeroAndar = 10 - andar;
              return (
                <div key={numeroAndar} className="flex items-center gap-4">
                  <div className="w-12 text-center text-sm font-medium text-gray-600">
                    {numeroAndar}º
                  </div>
                  <div className="flex gap-2">
                    {Array.from({ length: 4 }, (_, apto) => {
                      const numeroApto = numeroAndar * 100 + (apto + 1);
                      const status = Math.random() > 0.7 ? 'vendido' : 
                                   Math.random() > 0.5 ? 'reservado' : 
                                   Math.random() > 0.9 ? 'indisponivel' : 'disponivel';
                      
                      const cores = {
                        disponivel: 'bg-green-500 hover:bg-green-600',
                        reservado: 'bg-yellow-500 hover:bg-yellow-600',
                        vendido: 'bg-red-500 hover:bg-red-600',
                        indisponivel: 'bg-gray-800 hover:bg-gray-900'
                      };
                      
                      return (
                        <button
                          key={numeroApto}
                          onClick={() => setUnidadeSelecionada({
                            numero: numeroApto,
                            status: status,
                            tipo: 'Tipo 1',
                            area: '65m²',
                            vagas: 1,
                            preco: 'R$ 350.000'
                          })}
                          className={`w-12 h-12 ${cores[status]} text-white text-xs font-medium rounded transition-colors flex items-center justify-center`}
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

        {/* Modal da unidade selecionada */}
        {unidadeSelecionada && (
          <div className="bg-white border rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Unidade {unidadeSelecionada.numero}
              </h3>
              <button
                onClick={() => setUnidadeSelecionada(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-sm text-gray-500">Status:</span>
                <p className="font-medium capitalize">{unidadeSelecionada.status}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Tipo:</span>
                <p className="font-medium">{unidadeSelecionada.tipo}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Área:</span>
                <p className="font-medium">{unidadeSelecionada.area}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Preço:</span>
                <p className="font-medium text-green-600">{unidadeSelecionada.preco}</p>
              </div>
            </div>
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
  function MapaDisponibilidade() {
    const empreendimentoId = '1';
    const empreendimento = mockEmpreendimentos.find(e => e.id === empreendimentoId);
    
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
          <AbaMapaDisponibilidade />
        </div>
      </div>
    );
  }

  // Router principal
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {currentView === 'lista' && <ListaEmpreendimentos />}
      {currentView === 'formulario' && <FormularioEmpreendimento />}
      {currentView === 'detalhes' && <DetalhesEmpreendimento />}
      {currentView === 'mapa' && <MapaDisponibilidade />}
    </div>
  );
}

export default Empreendimentos;