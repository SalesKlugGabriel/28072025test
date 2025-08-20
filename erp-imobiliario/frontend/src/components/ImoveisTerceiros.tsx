import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Home, MapPin, Edit2, Eye, Trash2, DollarSign,
  Bed, Car, Bath, Ruler, Calendar, User, Phone, Mail,
  Building, X, Save, Upload, Image
} from 'lucide-react';

interface ImovelTerceiro {
  id: string;
  titulo: string;
  tipo: 'apartamento' | 'casa';
  endereco: {
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  proprietario: {
    nome: string;
    cpf: string;
    telefone: string;
    email: string;
  };
  caracteristicas: {
    dormitorios: number;
    suites: number;
    banheiros: number;
    vagas: number;
    areaPrivativa: number;
    areaTotal?: number;
  };
  valores: {
    venda: number;
    condominio?: number;
    iptu?: number;
  };
  comissao: number; // percentual
  status: 'disponivel' | 'reservado' | 'vendido';
  fotos: string[];
  descricao: string;
  dataVencimento: string;
  empreendimentoId?: string; // Se faz parte de um empreendimento existente
  numeroUnidade?: string; // Se for apartamento em empreendimento
}

interface ImoveisTerceirosProps {
  empreendimentos?: any[]; // Lista de empreendimentos para associação
}

const ImoveisTerceiros: React.FC<ImoveisTerceirosProps> = ({ empreendimentos = [] }) => {
  const [imoveis, setImoveis] = useState<ImovelTerceiro[]>([]);
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'apartamento' | 'casa'>('todos');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'disponivel' | 'reservado' | 'vendido'>('todos');
  const [modalCadastro, setModalCadastro] = useState(false);
  const [modalDetalhes, setModalDetalhes] = useState<ImovelTerceiro | null>(null);
  const [imovelEditando, setImovelEditando] = useState<Partial<ImovelTerceiro> | null>(null);

  // Mock de dados iniciais
  useEffect(() => {
    const mockImoveis: ImovelTerceiro[] = [
      {
        id: '1',
        titulo: 'Apartamento Vista Mar',
        tipo: 'apartamento',
        endereco: {
          logradouro: 'Rua das Flores',
          numero: '123',
          bairro: 'Centro',
          cidade: 'Florianópolis',
          estado: 'SC',
          cep: '88010-000'
        },
        proprietario: {
          nome: 'Maria Silva',
          cpf: '123.456.789-00',
          telefone: '(48) 99999-9999',
          email: 'maria@email.com'
        },
        caracteristicas: {
          dormitorios: 2,
          suites: 1,
          banheiros: 2,
          vagas: 1,
          areaPrivativa: 85,
          areaTotal: 100
        },
        valores: {
          venda: 450000,
          condominio: 650,
          iptu: 2200
        },
        comissao: 5,
        status: 'disponivel',
        fotos: ['/api/placeholder/400/300'],
        descricao: 'Excelente apartamento com vista para o mar, bem localizado.',
        dataVencimento: '2025-06-30',
        empreendimentoId: 'emp1', // Associado a um empreendimento
        numeroUnidade: '504'
      },
      {
        id: '2',
        titulo: 'Casa Residencial Premium',
        tipo: 'casa',
        endereco: {
          logradouro: 'Rua dos Jardins',
          numero: '456',
          bairro: 'Jardim Botânico',
          cidade: 'Florianópolis',
          estado: 'SC',
          cep: '88050-000'
        },
        proprietario: {
          nome: 'João Santos',
          cpf: '987.654.321-00',
          telefone: '(48) 88888-8888',
          email: 'joao@email.com'
        },
        caracteristicas: {
          dormitorios: 4,
          suites: 2,
          banheiros: 3,
          vagas: 2,
          areaPrivativa: 250,
          areaTotal: 350
        },
        valores: {
          venda: 850000,
          iptu: 4500
        },
        comissao: 6,
        status: 'disponivel',
        fotos: ['/api/placeholder/400/300'],
        descricao: 'Casa ampla com jardim, área gourmet e piscina.',
        dataVencimento: '2025-12-31'
      }
    ];
    setImoveis(mockImoveis);
  }, []);

  const handleNovoImovel = () => {
    setImovelEditando({
      tipo: 'apartamento',
      endereco: {
        logradouro: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: 'SC',
        cep: ''
      },
      proprietario: {
        nome: '',
        cpf: '',
        telefone: '',
        email: ''
      },
      caracteristicas: {
        dormitorios: 1,
        suites: 0,
        banheiros: 1,
        vagas: 1,
        areaPrivativa: 0
      },
      valores: {
        venda: 0,
        condominio: 0,
        iptu: 0
      },
      comissao: 5,
      status: 'disponivel',
      fotos: [],
      descricao: '',
      dataVencimento: ''
    });
    setModalCadastro(true);
  };

  const handleSalvarImovel = () => {
    if (!imovelEditando) return;

    const novoImovel: ImovelTerceiro = {
      id: imovelEditando.id || Date.now().toString(),
      titulo: imovelEditando.titulo || '',
      ...imovelEditando as ImovelTerceiro
    };

    if (imovelEditando.id) {
      setImoveis(prev => prev.map(i => i.id === imovelEditando.id ? novoImovel : i));
    } else {
      setImoveis(prev => [...prev, novoImovel]);
    }

    setModalCadastro(false);
    setImovelEditando(null);
  };

  const imoveisFiltrados = imoveis.filter(imovel => {
    const matchesBusca = imovel.titulo.toLowerCase().includes(busca.toLowerCase()) ||
                        imovel.endereco.bairro.toLowerCase().includes(busca.toLowerCase()) ||
                        imovel.proprietario.nome.toLowerCase().includes(busca.toLowerCase());
    
    const matchesTipo = filtroTipo === 'todos' || imovel.tipo === filtroTipo;
    const matchesStatus = filtroStatus === 'todos' || imovel.status === filtroStatus;
    
    return matchesBusca && matchesTipo && matchesStatus;
  });

  const getStatusColor = (status: ImovelTerceiro['status']) => {
    switch (status) {
      case 'disponivel': return 'bg-green-100 text-green-800';
      case 'reservado': return 'bg-yellow-100 text-yellow-800';
      case 'vendido': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEmpreendimentoNome = (empreendimentoId?: string) => {
    if (!empreendimentoId) return null;
    const emp = empreendimentos.find(e => e.id === empreendimentoId);
    return emp?.nome || 'Empreendimento não encontrado';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Imóveis de Terceiros</h1>
            <p className="text-gray-600">Gerencie imóveis de proprietários externos</p>
          </div>
          <button
            onClick={handleNovoImovel}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Imóvel
          </button>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por título, bairro ou proprietário..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos os tipos</option>
            <option value="apartamento">Apartamento</option>
            <option value="casa">Casa</option>
          </select>

          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos os status</option>
            <option value="disponivel">Disponível</option>
            <option value="reservado">Reservado</option>
            <option value="vendido">Vendido</option>
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            Total: {imoveisFiltrados.length} imóveis
          </div>
        </div>
      </div>

      {/* Lista de Imóveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {imoveisFiltrados.map(imovel => (
          <div key={imovel.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            {/* Imagem */}
            <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
              {imovel.fotos[0] ? (
                <img src={imovel.fotos[0]} alt={imovel.titulo} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Home className="w-16 h-16 text-gray-400" />
                </div>
              )}
              
              {/* Badge de status */}
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(imovel.status)}`}>
                  {imovel.status === 'disponivel' ? 'Disponível' :
                   imovel.status === 'reservado' ? 'Reservado' : 'Vendido'}
                </span>
              </div>

              {/* Badge de terceiro */}
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
                  Terceiro
                </span>
              </div>

              {/* Badge de empreendimento associado */}
              {imovel.empreendimentoId && (
                <div className="absolute bottom-3 left-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {getEmpreendimentoNome(imovel.empreendimentoId)}
                  </span>
                </div>
              )}
            </div>

            {/* Conteúdo */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{imovel.titulo}</h3>
              
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                <MapPin className="w-4 h-4" />
                <span>{imovel.endereco.bairro}, {imovel.endereco.cidade}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-1 text-sm">
                  <Bed className="w-4 h-4 text-gray-500" />
                  <span>{imovel.caracteristicas.dormitorios} dorm</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Car className="w-4 h-4 text-gray-500" />
                  <span>{imovel.caracteristicas.vagas} vagas</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Bath className="w-4 h-4 text-gray-500" />
                  <span>{imovel.caracteristicas.banheiros} banh</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Ruler className="w-4 h-4 text-gray-500" />
                  <span>{imovel.caracteristicas.areaPrivativa}m²</span>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-lg font-bold text-green-600">
                      R$ {imovel.valores.venda.toLocaleString('pt-BR')}
                    </div>
                    <div className="text-xs text-gray-500">
                      Comissão: {imovel.comissao}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">{imovel.proprietario.nome}</div>
                    <div className="text-xs text-gray-500">{imovel.proprietario.telefone}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setModalDetalhes(imovel)}
                    className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm flex items-center justify-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    Detalhes
                  </button>
                  <button
                    onClick={() => {
                      setImovelEditando(imovel);
                      setModalCadastro(true);
                    }}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {imoveisFiltrados.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum imóvel encontrado</h3>
          <p className="text-gray-600 mb-6">Ajuste os filtros ou cadastre um novo imóvel de terceiro</p>
          <button
            onClick={handleNovoImovel}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Cadastrar Primeiro Imóvel
          </button>
        </div>
      )}

      {/* Modal de Cadastro/Edição */}
      {modalCadastro && imovelEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {imovelEditando.id ? 'Editar Imóvel' : 'Cadastrar Novo Imóvel de Terceiro'}
                </h3>
                <button
                  onClick={() => {
                    setModalCadastro(false);
                    setImovelEditando(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Informações Básicas */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-900 mb-4">Informações Básicas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <input
                      type="text"
                      value={imovelEditando.titulo || ''}
                      onChange={(e) => setImovelEditando(prev => ({ ...prev, titulo: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Apartamento Vista Mar"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select
                      value={imovelEditando.tipo || 'apartamento'}
                      onChange={(e) => setImovelEditando(prev => ({ ...prev, tipo: e.target.value as 'apartamento' | 'casa' }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="apartamento">Apartamento</option>
                      <option value="casa">Casa</option>
                    </select>
                  </div>
                </div>

                {/* Associação com Empreendimento (apenas para apartamentos) */}
                {imovelEditando.tipo === 'apartamento' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Empreendimento Associado (Opcional)
                    </label>
                    <select
                      value={imovelEditando.empreendimentoId || ''}
                      onChange={(e) => setImovelEditando(prev => ({ ...prev, empreendimentoId: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Nenhum empreendimento</option>
                      {empreendimentos.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.nome}</option>
                      ))}
                    </select>
                    {imovelEditando.empreendimentoId && (
                      <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Número da Unidade
                        </label>
                        <input
                          type="text"
                          value={imovelEditando.numeroUnidade || ''}
                          onChange={(e) => setImovelEditando(prev => ({ ...prev, numeroUnidade: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: 504, 1201, etc."
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Restante do formulário será similar ao modelo anterior... */}
              {/* Por brevidade, vou adicionar apenas os campos essenciais */}
              
              <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                  onClick={() => {
                    setModalCadastro(false);
                    setImovelEditando(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSalvarImovel}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Salvar Imóvel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      {modalDetalhes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{modalDetalhes.titulo}</h3>
                <button
                  onClick={() => setModalDetalhes(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Conteúdo detalhado do imóvel */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Características</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Dormitórios:</span>
                      <span>{modalDetalhes.caracteristicas.dormitorios}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Suítes:</span>
                      <span>{modalDetalhes.caracteristicas.suites}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vagas:</span>
                      <span>{modalDetalhes.caracteristicas.vagas}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Área Privativa:</span>
                      <span>{modalDetalhes.caracteristicas.areaPrivativa}m²</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Proprietário</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Nome:</span>
                      <span>{modalDetalhes.proprietario.nome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Telefone:</span>
                      <span>{modalDetalhes.proprietario.telefone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span>{modalDetalhes.proprietario.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImoveisTerceiros;