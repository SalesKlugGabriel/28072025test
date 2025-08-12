import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import {
  Plus, Search, Building, MapPin, Calendar,
  TrendingUp, Home, Edit2, Eye, Trash2, ArrowLeft, X, Clock,
  Info, Map, FileText, Image, Upload, Download, File
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
              vagasGaragem: t.vagasGaragem,
              planta: null,
              preco: t.preco
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
    }, [id]);

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
          {abaAtiva === 'tabelas' && <AbaTabelas empreendimento={empreendimento} />}
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

  // Componente: Aba Tabelas
  function AbaTabelas({ empreendimento }: { empreendimento: Empreendimento }) {
    const [mostrarAtualizacao, setMostrarAtualizacao] = useState(false);
    const [arquivo, setArquivo] = useState<File | null>(null);
    const [filtroTipologia, setFiltroTipologia] = useState('');
    const [filtroAndar, setFiltroAndar] = useState('');
    const [valorFixo, setValorFixo] = useState('');
    const [valorPercentual, setValorPercentual] = useState('');
    const [novosValores, setNovosValores] = useState<string[]>(
      empreendimento.tiposUnidade?.map(t => t.preco) || []
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
                        <td className="px-4 py-2">{t.preco}</td>
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
  function AbaMapaDisponibilidade() {
    const [tooltip, setTooltip] = useState<{ x: number; y: number; unidade: { numero: number; status: string } } | null>(null);
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

    const handleUnidadeClick = (e: React.MouseEvent<HTMLButtonElement>, unidade: { numero: number; status: string }) => {
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
                      const status = unidade?.status || 'disponivel';
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
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div><span className="font-medium">Status:</span> {tooltip.unidade.status}</div>
              <div><span className="font-medium">Tipologia:</span> {tooltip.unidade.tipologia}</div>
              <div><span className="font-medium">Planta:</span> {tooltip.unidade.planta}</div>
              <div><span className="font-medium">Vagas:</span> {tooltip.unidade.vagas}</div>
              <div><span className="font-medium">Valor:</span> {tooltip.unidade.valor}</div>
              <div><span className="font-medium">Condição:</span> {tooltip.unidade.condicao}</div>
              <div><span className="font-medium">Área privativa:</span> {tooltip.unidade.areaPrivativa}</div>
              <div><span className="font-medium">Área total:</span> {tooltip.unidade.areaTotal}</div>
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
    const navigate = useNavigate();
    const { id: empreendimentoId } = useParams<{ id: string }>();
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
      <Routes>
        <Route index element={<ListaEmpreendimentos />} />
        <Route path="novo" element={<FormularioEmpreendimento />} />
        <Route path="editar/:id" element={<FormularioEmpreendimento />} />
        <Route path="detalhes/:id" element={<DetalhesEmpreendimento />} />
        <Route path="mapa/:id" element={<MapaDisponibilidade />} />
      </Routes>
    </div>
  );
}

export default Empreendimentos;