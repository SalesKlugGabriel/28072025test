import React, { useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  UserIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  TagIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

// Types
interface Endereco {
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep: string;
  estado: string;
}

interface Documento {
  id: string;
  tipo: string;
  categoria: string;
  nomeArquivo: string;
  dataUpload: string;
  tamanho: string;
}

interface UnidadeAdquirida {
  id: string;
  empreendimento: string;
  unidade: string;
  valorCompra: number;
  valorAtual: number;
  status: 'quitado' | 'financiamento' | 'contrato' | 'pendente';
  dataAquisicao: string;
}

interface Pessoa {
  id: string;
  tipo: 'cliente' | 'lead' | 'fornecedor' | 'colaborador';
  pessoaFisica: boolean;
  nome: string;
  cpfCnpj: string;
  telefone: string;
  email: string;
  endereco: Endereco;
  tags: string[];
  observacoes: string;
  documentos: Documento[];
  dataInclusao: string;
  dataAtualizacao: string;
  status: 'ativo' | 'inativo' | 'suspenso';
  
  // Campos específicos por tipo
  unidadesAdquiridas?: UnidadeAdquirida[];
  produtosServicos?: string;
  categoria?: string;
  contratosPrestacao?: string[];
  advertencias?: Documento[];
  atestadosMedicos?: Documento[];
}

// Mock data
const mockPessoas: Pessoa[] = [
  {
    id: '1',
    tipo: 'cliente',
    pessoaFisica: true,
    nome: 'João Silva Santos',
    cpfCnpj: '123.456.789-00',
    telefone: '(11) 99999-9999',
    email: 'joao.silva@email.com',
    endereco: {
      logradouro: 'Rua das Palmeiras',
      numero: '100',
      bairro: 'Vila Madalena',
      cidade: 'São Paulo',
      cep: '05435-000',
      estado: 'SP'
    },
    tags: ['vip', 'investidor'],
    observacoes: 'Cliente há 5 anos. Comprou 3 unidades.',
    documentos: [
      {
        id: '1',
        tipo: 'RG',
        categoria: 'Documentação Pessoal',
        nomeArquivo: 'rg_joao.pdf',
        dataUpload: '2024-01-15',
        tamanho: '2.1 MB'
      }
    ],
    dataInclusao: '2024-01-10',
    dataAtualizacao: '2024-07-20',
    status: 'ativo',
    unidadesAdquiridas: [
      {
        id: '1',
        empreendimento: 'Residencial Jardim',
        unidade: 'Apto 101 - Bloco A',
        valorCompra: 350000,
        valorAtual: 420000,
        status: 'quitado',
        dataAquisicao: '2023-03-15'
      }
    ]
  },
  {
    id: '2',
    tipo: 'lead',
    pessoaFisica: true,
    nome: 'Maria Oliveira Costa',
    cpfCnpj: '987.654.321-00',
    telefone: '(11) 98888-8888',
    email: 'maria.costa@email.com',
    endereco: {
      logradouro: 'Av. Paulista',
      numero: '1000',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      cep: '01310-100',
      estado: 'SP'
    },
    tags: ['quente', 'primeiro_imovel'],
    observacoes: 'Interessada em apartamento 2 dormitórios. Orçamento até R$ 400k.',
    documentos: [],
    dataInclusao: '2024-07-15',
    dataAtualizacao: '2024-07-25',
    status: 'ativo'
  },
  {
    id: '3',
    tipo: 'fornecedor',
    pessoaFisica: false,
    nome: 'Construtora ABC Ltda',
    cpfCnpj: '12.345.678/0001-90',
    telefone: '(11) 3333-3333',
    email: 'contato@construtorabc.com',
    endereco: {
      logradouro: 'Rua Comercial',
      numero: '500',
      bairro: 'Centro',
      cidade: 'São Paulo',
      cep: '01000-000',
      estado: 'SP'
    },
    tags: ['construcao', 'parceiro'],
    observacoes: 'Fornecedor de materiais de construção. Parceiro há 8 anos.',
    documentos: [],
    dataInclusao: '2024-02-20',
    dataAtualizacao: '2024-07-22',
    status: 'ativo',
    produtosServicos: 'Materiais de construção, Mão de obra especializada',
    categoria: 'Construção Civil'
  }
];

const Pessoas: React.FC = () => {
  return (
    <Routes>
      <Route index element={<PessoasOverview />} />
      <Route path="clientes" element={<PessoasList tipo="cliente" />} />
      <Route path="leads" element={<PessoasList tipo="lead" />} />
      <Route path="fornecedores" element={<PessoasList tipo="fornecedor" />} />
      <Route path="colaboradores" element={<PessoasList tipo="colaborador" />} />
      <Route path=":tipo/novo" element={<PessoaForm />} />
      <Route path=":tipo/:id/editar" element={<PessoaForm />} />
      <Route path=":tipo/:id" element={<PessoaDetails />} />
    </Routes>
  );
};

// Overview do módulo
const PessoasOverview: React.FC = () => {
  const navigate = useNavigate();
  const [pessoas] = useState<Pessoa[]>(mockPessoas);

  const estatisticas = {
    clientes: pessoas.filter(p => p.tipo === 'cliente').length,
    leads: pessoas.filter(p => p.tipo === 'lead').length,
    fornecedores: pessoas.filter(p => p.tipo === 'fornecedor').length,
    colaboradores: pessoas.filter(p => p.tipo === 'colaborador').length
  };

  const cards = [
    {
      titulo: 'Clientes',
      valor: estatisticas.clientes,
      href: '/pessoas/clientes',
      icon: UserGroupIcon,
      cor: 'bg-blue-500',
      corFundo: 'bg-blue-50',
      descricao: 'Proprietários e compradores'
    },
    {
      titulo: 'Leads',
      valor: estatisticas.leads,
      href: '/pessoas/leads',
      icon: UserIcon,
      cor: 'bg-green-500',
      corFundo: 'bg-green-50',
      descricao: 'Prospects em negociação'
    },
    {
      titulo: 'Fornecedores',
      valor: estatisticas.fornecedores,
      href: '/pessoas/fornecedores',
      icon: BriefcaseIcon,
      cor: 'bg-purple-500',
      corFundo: 'bg-purple-50',
      descricao: 'Parceiros comerciais'
    },
    {
      titulo: 'Colaboradores',
      valor: estatisticas.colaboradores,
      href: '/pessoas/colaboradores',
      icon: BuildingOfficeIcon,
      cor: 'bg-orange-500',
      corFundo: 'bg-orange-50',
      descricao: 'Equipe e prestadores'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Módulo Pessoas</h1>
          <p className="text-gray-600">Gestão centralizada de clientes, leads, fornecedores e colaboradores</p>
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
                  <IconComponent className={`h-6 w-6 text-white`} style={{ color: card.cor.replace('bg-', '').replace('-500', '') }} />
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

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/pessoas/clientes/novo')}
              className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <span className="text-blue-700 font-medium">Novo Cliente</span>
              <PlusIcon className="h-5 w-5 text-blue-500" />
            </button>
            <button
              onClick={() => navigate('/pessoas/leads/novo')}
              className="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <span className="text-green-700 font-medium">Novo Lead</span>
              <PlusIcon className="h-5 w-5 text-green-500" />
            </button>
            <button
              onClick={() => navigate('/pessoas/fornecedores/novo')}
              className="w-full flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <span className="text-purple-700 font-medium">Novo Fornecedor</span>
              <PlusIcon className="h-5 w-5 text-purple-500" />
            </button>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Integrações</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-4 w-4 mr-2" />
              <span>Empreendimentos: Unidades adquiridas por clientes</span>
            </div>
            <div className="flex items-center">
              <ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4 mr-2" />
              <span>CRM: Conversão de leads para clientes</span>
            </div>
            <div className="flex items-center">
              <BanknotesIcon className="h-4 w-4 mr-2" />
              <span>Financeiro: Pagamentos e contratos</span>
            </div>
            <div className="flex items-center">
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              <span>Jurídico: Contratos e documentação</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Lista de pessoas por tipo
interface PessoasListProps {
  tipo: 'cliente' | 'lead' | 'fornecedor' | 'colaborador';
}

const PessoasList: React.FC<PessoasListProps> = ({ tipo }) => {
  const navigate = useNavigate();
  const [pessoas, setPessoas] = useState<Pessoa[]>(mockPessoas.filter(p => p.tipo === tipo));
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const filteredPessoas = pessoas.filter(pessoa => {
    const matchesSearch = 
      pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pessoa.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pessoa.cpfCnpj.includes(searchTerm) ||
      pessoa.telefone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'todos' || pessoa.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getTipoLabel = (tipo: string) => {
    const labels = {
      cliente: 'Clientes',
      lead: 'Leads',
      fornecedor: 'Fornecedores',
      colaborador: 'Colaboradores'
    };
    return labels[tipo as keyof typeof labels] || tipo;
  };

  const formatCpfCnpj = (cpfCnpj: string, pessoaFisica: boolean) => {
    if (pessoaFisica) {
      return cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.***.**$4');
    } else {
      return cpfCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.***.***/***$5');
    }
  };

  const converterParaCliente = (leadId: string) => {
    const lead = pessoas.find(p => p.id === leadId);
    if (lead && lead.tipo === 'lead') {
      const novoCliente = { ...lead, tipo: 'cliente' as const, unidadesAdquiridas: [] };
      // Aqui seria a integração real com a API
      console.log('Convertendo lead para cliente:', novoCliente);
      setPessoas(prev => prev.filter(p => p.id !== leadId));
      alert('Lead convertido para cliente com sucesso!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getTipoLabel(tipo)}</h1>
          <p className="text-gray-600">Gerencie todos os {getTipoLabel(tipo).toLowerCase()}</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate(`/pessoas/${tipo}/novo`)}
            className="btn-primary"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo {getTipoLabel(tipo).slice(0, -1)}
          </button>
          <button
            onClick={() => navigate('/pessoas')}
            className="btn-outline"
          >
            Voltar
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, email, CPF/CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input"
          >
            <option value="todos">Todos os Status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
            <option value="suspenso">Suspenso</option>
          </select>

          {/* Clear Filters */}
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

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Mostrando {filteredPessoas.length} de {pessoas.length} {getTipoLabel(tipo).toLowerCase()}
        </p>
      </div>

      {/* Lista em Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPessoas.map((pessoa) => (
          <div key={pessoa.id} className="card card-hover">
            <div className="p-6">
              {/* Header do Card */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-gray-700">
                      {pessoa.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{pessoa.nome}</h3>
                    <p className="text-sm text-gray-500">
                      {pessoa.pessoaFisica ? 'Pessoa Física' : 'Pessoa Jurídica'}
                    </p>
                  </div>
                </div>
                <span className={`badge ${
                  pessoa.status === 'ativo' ? 'badge-success' :
                  pessoa.status === 'inativo' ? 'badge-gray' : 'badge-warning'
                }`}>
                  {pessoa.status}
                </span>
              </div>

              {/* Informações */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  {formatCpfCnpj(pessoa.cpfCnpj, pessoa.pessoaFisica)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  {pessoa.telefone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  {pessoa.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {pessoa.endereco.cidade} - {pessoa.endereco.estado}
                </div>
              </div>

              {/* Tags */}
              {pessoa.tags.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {pessoa.tags.map((tag, index) => (
                      <span key={index} className="badge badge-info">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Informações específicas por tipo */}
              {tipo === 'cliente' && pessoa.unidadesAdquiridas && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center text-sm text-blue-700">
                    <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                    {pessoa.unidadesAdquiridas.length} unidade(s) adquirida(s)
                  </div>
                </div>
              )}

              {tipo === 'fornecedor' && pessoa.categoria && (
                <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center text-sm text-purple-700">
                    <BriefcaseIcon className="h-4 w-4 mr-2" />
                    {pessoa.categoria}
                  </div>
                </div>
              )}

              {/* Observações */}
              {pessoa.observacoes && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 truncate">{pessoa.observacoes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/pessoas/${tipo}/${pessoa.id}`)}
                    className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                    title="Ver detalhes"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => navigate(`/pessoas/${tipo}/${pessoa.id}/editar`)}
                    className="text-yellow-600 hover:text-yellow-800 p-1 hover:bg-yellow-50 rounded"
                    title="Editar"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>

                  {tipo === 'lead' && (
                    <button
                      onClick={() => converterParaCliente(pessoa.id)}
                      className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded"
                      title="Converter para Cliente"
                    >
                      <ArrowPathIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Tem certeza que deseja excluir ${pessoa.nome}?`)) {
                      setPessoas(prev => prev.filter(p => p.id !== pessoa.id));
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
      {filteredPessoas.length === 0 && (
        <div className="text-center py-12">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Nenhum {getTipoLabel(tipo).slice(0, -1).toLowerCase()} encontrado
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'todos'
              ? 'Tente ajustar os filtros de busca.'
              : `Comece cadastrando seu primeiro ${getTipoLabel(tipo).slice(0, -1).toLowerCase()}.`}
          </p>
          {!searchTerm && statusFilter === 'todos' && (
            <div className="mt-6">
              <button
                onClick={() => navigate(`/pessoas/${tipo}/novo`)}
                className="btn-primary"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Cadastrar Primeiro {getTipoLabel(tipo).slice(0, -1)}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Formulário (placeholder)
const PessoaForm: React.FC = () => {
  const navigate = useNavigate();
  const { tipo, id } = useParams();
  const isEdit = Boolean(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Editar' : 'Novo'} {tipo}
          </h1>
          <p className="text-gray-600">Formulário completo será implementado aqui</p>
        </div>
        <button
          onClick={() => navigate(`/pessoas/${tipo}`)}
          className="btn-outline"
        >
          Voltar
        </button>
      </div>
      
      <div className="card p-6">
        <p className="text-gray-600">
          Formulário completo com campos específicos por tipo, upload de documentos, 
          endereço completo, tags e todas as funcionalidades especificadas.
        </p>
      </div>
    </div>
  );
};

// Detalhes (placeholder)
const PessoaDetails: React.FC = () => {
  const navigate = useNavigate();
  const { tipo, id } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Detalhes do {tipo}</h1>
          <p className="text-gray-600">Visualização completa será implementada aqui</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate(`/pessoas/${tipo}/${id}/editar`)}
            className="btn-primary"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            Editar
          </button>
          <button
            onClick={() => navigate(`/pessoas/${tipo}`)}
            className="btn-outline"
          >
            Voltar
          </button>
        </div>
      </div>
      
      <div className="card p-6">
        <p className="text-gray-600">
          Visualização completa com todas as informações, documentos anexados,
          unidades adquiridas (para clientes), histórico, etc.
        </p>
      </div>
    </div>
  );
};

export default Pessoas;