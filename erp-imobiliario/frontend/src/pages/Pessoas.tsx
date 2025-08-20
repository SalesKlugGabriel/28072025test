import React, { useState, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  UserIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  TagIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CloudArrowUpIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

import { PessoasProvider, usePessoas, filtrarPessoas, pessoasActions } from '../context/pessoas-context';
import { TipoPessoa, Pessoa, Cliente, Lead, FormularioPessoa } from '../types/pessoa';
import { validarFormularioPessoa, formatarCPF, formatarCNPJ, formatarTelefone, formatarCEP, buscarCEP } from '../utils/pessoa-validation';
import PerfilPessoaMelhorado from '../components/PerfilPessoaMelhorado';

// Componente principal com Provider
export default function PessoasPage() {
  return (
    <PessoasProvider>
      <PessoasContent />
    </PessoasProvider>
  );
}

// Conteúdo principal
function PessoasContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = usePessoas();
  
  const [filtroAtivo, setFiltroAtivo] = useState<TipoPessoa | 'todos'>('todos');
  const [buscaTexto, setBuscaTexto] = useState('');
  const [filtrosAvancados, setFiltrosAvancados] = useState(false);
  
  // Filtrar pessoas
  const pessoasFiltradas = useMemo(() => {
    let pessoas = state.pessoas;
    
    // Filtro por aba ativa
    if (filtroAtivo !== 'todos') {
      pessoas = pessoas.filter(p => p.tipo === filtroAtivo);
    }
    
    // Aplicar filtros
    const filtros = {
      ...state.filtros,
      busca: buscaTexto
    };
    
    return filtrarPessoas(pessoas, filtros);
  }, [state.pessoas, state.filtros, filtroAtivo, buscaTexto]);
  
  // Estatísticas
  const estatisticas = useMemo(() => {
    const total = state.pessoas.length;
    const clientes = state.pessoas.filter(p => p.tipo === 'cliente').length;
    const leads = state.pessoas.filter(p => p.tipo === 'lead').length;
    const fornecedores = state.pessoas.filter(p => p.tipo === 'fornecedor').length;
    const colaboradores = state.pessoas.filter(p => p.tipo === 'colaborador_pf' || p.tipo === 'colaborador_pj').length;
    
    return { total, clientes, leads, fornecedores, colaboradores };
  }, [state.pessoas]);
  
  const abas = [
    { key: 'todos', label: 'Todos', count: estatisticas.total, icon: UserGroupIcon },
    { key: 'cliente', label: 'Clientes', count: estatisticas.clientes, icon: UserIcon },
    { key: 'lead', label: 'Leads', count: estatisticas.leads, icon: UserIcon },
    { key: 'fornecedor', label: 'Fornecedores', count: estatisticas.fornecedores, icon: BuildingOfficeIcon },
    { key: 'colaborador_pf', label: 'Colaboradores PF', count: state.pessoas.filter(p => p.tipo === 'colaborador_pf').length, icon: BriefcaseIcon },
    { key: 'colaborador_pj', label: 'Colaboradores PJ', count: state.pessoas.filter(p => p.tipo === 'colaborador_pj').length, icon: BriefcaseIcon }
  ];
  
  const handleNovoClick = () => {
    dispatch(pessoasActions.selecionarPessoa(null));
    dispatch({ type: 'SET_MODO_EDICAO', payload: false });
    dispatch({ type: 'SET_MODAL_ABERTO', payload: true });
  };
  
  const handleEditarClick = (pessoa: Pessoa) => {
    dispatch(pessoasActions.selecionarPessoa(pessoa));
    dispatch({ type: 'SET_MODO_EDICAO', payload: true });
    dispatch({ type: 'SET_MODAL_ABERTO', payload: true });
  };
  
  const handleExcluirClick = (pessoa: Pessoa) => {
    if (window.confirm(`Tem certeza que deseja excluir ${pessoa.nome}?`)) {
      dispatch(pessoasActions.excluirPessoa(pessoa.id));
    }
  };
  
  const handleConverterLead = (lead: Lead) => {
    if (window.confirm(`Converter ${lead.nome} de Lead para Cliente?`)) {
      dispatch(pessoasActions.converterLeadParaCliente(lead.id));
    }
  };

  const handleVisualizarClick = (pessoa: Pessoa) => {
    dispatch(pessoasActions.selecionarPessoa(pessoa));
    dispatch({ type: 'SET_MODO_EDICAO', payload: false });
    dispatch({ type: 'SET_PERFIL_ABERTO', payload: true });
  };
  
  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pessoas</h1>
            <p className="text-gray-600">Gerencie clientes, leads, fornecedores e colaboradores</p>
          </div>
          <button
            onClick={handleNovoClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Nova Pessoa
          </button>
        </div>
        
        {/* Abas */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {abas.map((aba) => {
              const Icon = aba.icon;
              const isActive = filtroAtivo === aba.key;
              
              return (
                <button
                  key={aba.key}
                  onClick={() => setFiltroAtivo(aba.key as TipoPessoa | 'todos')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {aba.label}
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {aba.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
      
      {/* Filtros e busca */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, email, telefone, CPF/CNPJ..."
              value={buscaTexto}
              onChange={(e) => setBuscaTexto(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setFiltrosAvancados(!filtrosAvancados)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtrosAvancados
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
            }`}
          >
            Filtros Avançados
          </button>
        </div>
        
        {/* Filtros avançados */}
        {filtrosAvancados && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">Todos</option>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="suspenso">Suspenso</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">Todas</option>
                  <option value="São Paulo">São Paulo</option>
                  <option value="Rio de Janeiro">Rio de Janeiro</option>
                  <option value="Belo Horizonte">Belo Horizonte</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Pessoa</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">PF e PJ</option>
                  <option value="true">Pessoa Física</option>
                  <option value="false">Pessoa Jurídica</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Conteúdo principal */}
      <div className="flex-1 overflow-hidden">
        {state.loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <ArrowPathIcon className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-gray-600">Carregando pessoas...</p>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            <ListaPessoas 
              pessoas={pessoasFiltradas}
              onVisualizar={handleVisualizarClick}
              onEditar={handleEditarClick}
              onExcluir={handleExcluirClick}
              onConverterLead={handleConverterLead}
            />
          </div>
        )}
      </div>
      
      {/* Modal */}
      {state.modalAberto && (
        <ModalPessoa />
      )}

      {/* Perfil da pessoa */}
      {state.perfilAberto && (
        <PerfilPessoaMelhorado />
      )}
    </div>
  );
}

// Componente da lista de pessoas
interface ListaPessoasProps {
  pessoas: Pessoa[];
  onVisualizar: (pessoa: Pessoa) => void;
  onEditar: (pessoa: Pessoa) => void;
  onExcluir: (pessoa: Pessoa) => void;
  onConverterLead: (lead: Lead) => void;
}

function ListaPessoas({ pessoas, onVisualizar, onEditar, onExcluir, onConverterLead }: ListaPessoasProps) {
  if (pessoas.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma pessoa encontrada</h3>
          <p className="text-gray-600">Tente ajustar os filtros ou adicione uma nova pessoa.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pessoa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Localização
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pessoas.map((pessoa) => (
              <PessoaRow 
                key={pessoa.id} 
                pessoa={pessoa}
                onVisualizar={onVisualizar}
                onEditar={onEditar}
                onExcluir={onExcluir}
                onConverterLead={onConverterLead}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Linha da tabela de pessoa
interface PessoaRowProps {
  pessoa: Pessoa;
  onVisualizar: (pessoa: Pessoa) => void;
  onEditar: (pessoa: Pessoa) => void;
  onExcluir: (pessoa: Pessoa) => void;
  onConverterLead: (lead: Lead) => void;
}

function PessoaRow({ pessoa, onVisualizar, onEditar, onExcluir, onConverterLead }: PessoaRowProps) {
  const tipoLabels = {
    cliente: 'Cliente',
    lead: 'Lead',
    fornecedor: 'Fornecedor',
    colaborador_pf: 'Colaborador PF',
    colaborador_pj: 'Colaborador PJ'
  };
  
  const statusColors = {
    ativo: 'bg-green-100 text-green-800',
    inativo: 'bg-gray-100 text-gray-800',
    suspenso: 'bg-red-100 text-red-800'
  };
  
  const tipoColors = {
    cliente: 'bg-blue-100 text-blue-800',
    lead: 'bg-orange-100 text-orange-800',
    fornecedor: 'bg-purple-100 text-purple-800',
    colaborador_pf: 'bg-green-100 text-green-800',
    colaborador_pj: 'bg-indigo-100 text-indigo-800'
  };
  
  return (
    <tr 
      className="hover:bg-gray-50 cursor-pointer" 
      onClick={() => onVisualizar(pessoa)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {pessoa.nome.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{pessoa.nome}</div>
            <div className="text-sm text-gray-500">
              {pessoa.pessoaFisica ? formatarCPF(pessoa.cpfCnpj) : formatarCNPJ(pessoa.cpfCnpj)}
            </div>
            {pessoa.tags.length > 0 && (
              <div className="flex gap-1 mt-1">
                {pessoa.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {tag}
                  </span>
                ))}
                {pessoa.tags.length > 2 && (
                  <span className="text-xs text-gray-500">+{pessoa.tags.length - 2}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tipoColors[pessoa.tipo]}`}>
          {tipoLabels[pessoa.tipo]}
        </span>
        {pessoa.pessoaFisica ? (
          <span className="ml-2 text-xs text-gray-500">PF</span>
        ) : (
          <span className="ml-2 text-xs text-gray-500">PJ</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div className="space-y-1">
          <div className="flex items-center">
            <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
            {formatarTelefone(pessoa.telefone)}
          </div>
          <div className="flex items-center">
            <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
            <span className="truncate max-w-[200px]">{pessoa.email}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div className="flex items-center">
          <MapPinIcon className="w-4 h-4 text-gray-400 mr-2" />
          <span>{pessoa.endereco.cidade}, {pessoa.endereco.estado}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[pessoa.status]}`}>
          {pessoa.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVisualizar(pessoa);
            }}
            className="text-gray-600 hover:text-gray-900"
            title="Visualizar Perfil"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditar(pessoa);
            }}
            className="text-blue-600 hover:text-blue-900"
            title="Editar"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExcluir(pessoa);
            }}
            className="text-red-600 hover:text-red-900"
            title="Excluir"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
          {pessoa.tipo === 'lead' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onConverterLead(pessoa as Lead);
              }}
              className="text-green-600 hover:text-green-900"
              title="Converter para Cliente"
            >
              <CheckCircleIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

// Modal de criação/edição
function ModalPessoa() {
  const { state, dispatch } = usePessoas();
  const [formData, setFormData] = useState<FormularioPessoa>(() => {
    if (state.modoEdicao && state.pessoaSelecionada) {
      // Preencher com dados da pessoa selecionada
      const pessoa = state.pessoaSelecionada;
      return {
        tipo: pessoa.tipo,
        pessoaFisica: pessoa.pessoaFisica,
        nome: pessoa.nome,
        nomeFantasia: pessoa.nomeFantasia,
        cpfCnpj: pessoa.cpfCnpj,
        rgInscricaoEstadual: pessoa.rgInscricaoEstadual,
        telefone: pessoa.telefone,
        telefoneSecundario: pessoa.telefoneSecundario,
        email: pessoa.email,
        emailSecundario: pessoa.emailSecundario,
        endereco: pessoa.endereco,
        tags: pessoa.tags,
        observacoes: pessoa.observacoes,
        responsavel: pessoa.responsavel
      };
    }
    
    return {
      tipo: 'cliente',
      pessoaFisica: true,
      nome: '',
      cpfCnpj: '',
      telefone: '',
      email: '',
      endereco: {
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        cep: '',
        estado: ''
      },
      tags: [],
      observacoes: '',
    };
  });
  
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validarFormularioPessoa(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    setLoading(true);
    
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (state.modoEdicao && state.pessoaSelecionada) {
        // Atualizar pessoa existente
        const pessoaAtualizada: Pessoa = {
          ...state.pessoaSelecionada,
          ...formData,
          dataAtualizacao: new Date().toISOString().split('T')[0]
        } as Pessoa;
        
        dispatch(pessoasActions.atualizarPessoa(pessoaAtualizada));
      } else {
        // Criar nova pessoa
        const novaPessoa: Pessoa = {
          id: `${formData.tipo}-${Date.now()}`,
          ...formData,
          documentos: [],
          dataInclusao: new Date().toISOString().split('T')[0],
          dataAtualizacao: new Date().toISOString().split('T')[0],
          status: 'ativo'
        } as Pessoa;
        
        // Adicionar campos específicos por tipo
        if (formData.tipo === 'cliente') {
          (novaPessoa as Cliente).unidadesAdquiridas = [];
          (novaPessoa as Cliente).valorTotalInvestido = 0;
          (novaPessoa as Cliente).valorPatrimonioAtual = 0;
          (novaPessoa as Cliente).classificacao = 'bronze';
          (novaPessoa as Cliente).origemContato = formData.origemContato as any || 'outros';
        }
        
        dispatch(pessoasActions.adicionarPessoa(novaPessoa));
      }
      
    } catch (error) {
      console.error('Erro ao salvar pessoa:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = () => {
    dispatch(pessoasActions.fecharModal());
    setErrors({});
  };
  
  const handleBuscarCEP = async () => {
    if (formData.endereco.cep) {
      try {
        const dadosEndereco = await buscarCEP(formData.endereco.cep);
        setFormData(prev => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            ...dadosEndereco
          }
        }));
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {state.modoEdicao ? 'Editar Pessoa' : 'Nova Pessoa'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tipo e PF/PJ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Pessoa *
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as TipoPessoa }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="cliente">Cliente</option>
                <option value="lead">Lead</option>
                <option value="fornecedor">Fornecedor</option>
                <option value="colaborador_pf">Colaborador PF</option>
                <option value="colaborador_pj">Colaborador PJ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pessoa Física/Jurídica *
              </label>
              <select
                value={formData.pessoaFisica.toString()}
                onChange={(e) => setFormData(prev => ({ ...prev, pessoaFisica: e.target.value === 'true' }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="true">Pessoa Física</option>
                <option value="false">Pessoa Jurídica</option>
              </select>
            </div>
          </div>
          
          {/* Nome e Documento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.pessoaFisica ? 'Nome Completo' : 'Razão Social'} *
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                  errors.nome ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              />
              {errors.nome && <p className="text-red-600 text-sm mt-1">{errors.nome}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.pessoaFisica ? 'CPF' : 'CNPJ'} *
              </label>
              <input
                type="text"
                value={formData.cpfCnpj}
                onChange={(e) => setFormData(prev => ({ ...prev, cpfCnpj: e.target.value }))}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                  errors.cpfCnpj ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={formData.pessoaFisica ? "000.000.000-00" : "00.000.000/0000-00"}
                required
              />
              {errors.cpfCnpj && <p className="text-red-600 text-sm mt-1">{errors.cpfCnpj}</p>}
            </div>
          </div>
          
          {/* Contato */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone *
              </label>
              <input
                type="tel"
                value={formData.telefone}
                onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                  errors.telefone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="(11) 99999-9999"
                required
              />
              {errors.telefone && <p className="text-red-600 text-sm mt-1">{errors.telefone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>
          
          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CEP *
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={formData.endereco.cep}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      endereco: { ...prev.endereco, cep: e.target.value }
                    }))}
                    className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="00000-000"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleBuscarCEP}
                    className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200"
                  >
                    <MagnifyingGlassIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logradouro *
                </label>
                <input
                  type="text"
                  value={formData.endereco.logradouro}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    endereco: { ...prev.endereco, logradouro: e.target.value }
                  }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número *
                </label>
                <input
                  type="text"
                  value={formData.endereco.numero}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    endereco: { ...prev.endereco, numero: e.target.value }
                  }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bairro *
                </label>
                <input
                  type="text"
                  value={formData.endereco.bairro}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    endereco: { ...prev.endereco, bairro: e.target.value }
                  }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade *
                </label>
                <input
                  type="text"
                  value={formData.endereco.cidade}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    endereco: { ...prev.endereco, cidade: e.target.value }
                  }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado *
                </label>
                <select
                  value={formData.endereco.estado}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    endereco: { ...prev.endereco, estado: e.target.value }
                  }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione</option>
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="BA">Bahia</option>
                  <option value="PR">Paraná</option>
                  <option value="CE">Ceará</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Informações adicionais sobre a pessoa..."
            />
          </div>
          
          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              disabled={loading}
            >
              {loading && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
              {state.modoEdicao ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente de perfil da pessoa
function PerfilPessoa() {
  const { state, dispatch } = usePessoas();
  const pessoa = state.pessoaSelecionada;
  
  if (!pessoa) return null;
  
  const handleClose = () => {
    dispatch({ type: 'SET_PERFIL_ABERTO', payload: false });
    dispatch(pessoasActions.selecionarPessoa(null));
  };

  const handleEditar = () => {
    dispatch({ type: 'SET_PERFIL_ABERTO', payload: false });
    dispatch({ type: 'SET_MODO_EDICAO', payload: true });
    dispatch({ type: 'SET_MODAL_ABERTO', payload: true });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-lg font-medium text-blue-700">
                  {pessoa.nome.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">{pessoa.nome}</h2>
              <p className="text-gray-600">{pessoa.pessoaFisica ? formatarCPF(pessoa.cpfCnpj) : formatarCNPJ(pessoa.cpfCnpj)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEditar}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <PencilIcon className="w-4 h-4" />
              Editar
            </button>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          {/* Informações básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Informações Básicas</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tipo</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    pessoa.tipo === 'cliente' ? 'bg-blue-100 text-blue-800' :
                    pessoa.tipo === 'lead' ? 'bg-orange-100 text-orange-800' :
                    pessoa.tipo === 'fornecedor' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {pessoa.tipo === 'cliente' ? 'Cliente' :
                     pessoa.tipo === 'lead' ? 'Lead' :
                     pessoa.tipo === 'fornecedor' ? 'Fornecedor' :
                     pessoa.tipo === 'colaborador_pf' ? 'Colaborador PF' : 'Colaborador PJ'}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    {pessoa.pessoaFisica ? 'Pessoa Física' : 'Pessoa Jurídica'}
                  </span>
                </div>

                {pessoa.nomeFantasia && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome Fantasia</label>
                    <p className="text-sm text-gray-900">{pessoa.nomeFantasia}</p>
                  </div>
                )}

                {pessoa.rgInscricaoEstadual && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {pessoa.pessoaFisica ? 'RG' : 'Inscrição Estadual'}
                    </label>
                    <p className="text-sm text-gray-900">{pessoa.rgInscricaoEstadual}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    pessoa.status === 'ativo' ? 'bg-green-100 text-green-800' :
                    pessoa.status === 'inativo' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {pessoa.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Contato</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefone Principal</label>
                  <div className="flex items-center">
                    <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-900">{formatarTelefone(pessoa.telefone)}</p>
                  </div>
                </div>

                {pessoa.telefoneSecundario && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Telefone Secundário</label>
                    <div className="flex items-center">
                      <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-900">{formatarTelefone(pessoa.telefoneSecundario)}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Principal</label>
                  <div className="flex items-center">
                    <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-900">{pessoa.email}</p>
                  </div>
                </div>

                {pessoa.emailSecundario && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Secundário</label>
                    <div className="flex items-center">
                      <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-900">{pessoa.emailSecundario}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Endereço</h3>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start">
                <MapPinIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm text-gray-900">
                    {pessoa.endereco.logradouro}, {pessoa.endereco.numero}
                    {pessoa.endereco.complemento && ` - ${pessoa.endereco.complemento}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {pessoa.endereco.bairro} - {pessoa.endereco.cidade}, {pessoa.endereco.estado}
                  </p>
                  <p className="text-sm text-gray-600">
                    CEP: {formatarCEP(pessoa.endereco.cep)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {pessoa.tags.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Tags</h3>
              
              <div className="flex flex-wrap gap-2">
                {pessoa.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    <TagIcon className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Observações */}
          {pessoa.observacoes && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Observações</h3>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{pessoa.observacoes}</p>
              </div>
            </div>
          )}

          {/* Informações do sistema */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Informações do Sistema</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <label className="block font-medium text-gray-700">Data de Inclusão</label>
                <p className="text-gray-600">{pessoa.dataInclusao}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Última Atualização</label>
                <p className="text-gray-600">{pessoa.dataAtualizacao}</p>
              </div>
              {pessoa.responsavel && (
                <div>
                  <label className="block font-medium text-gray-700">Responsável</label>
                  <p className="text-gray-600">{pessoa.responsavel}</p>
                </div>
              )}
            </div>
          </div>

          {/* Informações específicas do cliente */}
          {pessoa.tipo === 'cliente' && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Informações de Cliente</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Valor Total Investido</label>
                  <p className="text-lg font-semibold text-green-600">
                    {new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    }).format((pessoa as Cliente).valorTotalInvestido || 0)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Classificação</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    (pessoa as Cliente).classificacao === 'diamante' ? 'bg-purple-100 text-purple-800' :
                    (pessoa as Cliente).classificacao === 'ouro' ? 'bg-yellow-100 text-yellow-800' :
                    (pessoa as Cliente).classificacao === 'prata' ? 'bg-gray-100 text-gray-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {(pessoa as Cliente).classificacao}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}