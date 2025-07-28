import React, { useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ScaleIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  DocumentDuplicateIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';

// Types
interface Cliente {
  id: string;
  nome: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
}

interface Imovel {
  id: string;
  codigo: string;
  endereco: string;
  empreendimento: string;
}

interface MinutaTemplate {
  id: string;
  nome: string;
  tipo: 'venda' | 'reserva' | 'locacao' | 'permuta' | 'administracao';
  descricao: string;
  conteudo: string;
  variaveis: string[];
  dataAtualizacao: string;
  ativo: boolean;
}

interface Contrato {
  id: string;
  numero: string;
  tipo: 'venda' | 'reserva' | 'locacao' | 'permuta' | 'administracao';
  status: 'rascunho' | 'pendente' | 'em_vigor' | 'finalizado' | 'rescindido';
  cliente: Cliente;
  incorporadora: {
    id: string;
    nome: string;
  };
  imovel: Imovel;
  valores: {
    valorTotal: number;
    valorPago: number;
    saldoDevedor: number;
    formaPagamento: string;
  };
  datas: {
    assinatura?: string;
    inicio: string;
    fim?: string;
    proximoVencimento?: string;
  };
  clausulas: {
    reajuste?: string;
    multa?: number;
    observacoes?: string;
  };
  minutaUsada: string;
  versao: number;
  documentos: string[];
  dataInclusao: string;
  dataAtualizacao: string;
  assinaturaDigital: {
    cliente: boolean;
    incorporadora: boolean;
    dataAssinatura?: string;
  };
}

// Mock data
const mockMinutas: MinutaTemplate[] = [
  {
    id: '1',
    nome: 'Contrato de Compra e Venda Padrão',
    tipo: 'venda',
    descricao: 'Modelo padrão para venda de imóveis residenciais',
    conteudo: 'Contrato de compra e venda entre {{nomeCliente}} e {{nomeIncorporadora}}...',
    variaveis: ['nomeCliente', 'nomeIncorporadora', 'enderecoImovel', 'valorCompra', 'formaPagamento'],
    dataAtualizacao: '2024-07-15',
    ativo: true
  },
  {
    id: '2',
    nome: 'Termo de Reserva',
    tipo: 'reserva',
    descricao: 'Termo de reserva com sinal de entrada',
    conteudo: 'Termo de reserva da unidade {{unidade}} para {{nomeCliente}}...',
    variaveis: ['nomeCliente', 'unidade', 'valorSinal', 'prazoReserva'],
    dataAtualizacao: '2024-07-10',
    ativo: true
  },
  {
    id: '3',
    nome: 'Contrato de Locação Residencial',
    tipo: 'locacao',
    descricao: 'Modelo para contratos de aluguel residencial',
    conteudo: 'Contrato de locação entre {{nomeProprietario}} e {{nomeLocatario}}...',
    variaveis: ['nomeProprietario', 'nomeLocatario', 'enderecoImovel', 'valorAluguel', 'prazoLocacao'],
    dataAtualizacao: '2024-07-20',
    ativo: true
  }
];

const mockContratos: Contrato[] = [
  {
    id: '1',
    numero: 'CT-2024-001',
    tipo: 'venda',
    status: 'em_vigor',
    cliente: {
      id: '1',
      nome: 'João Silva Santos',
      cpfCnpj: '123.456.789-00',
      email: 'joao.silva@email.com',
      telefone: '(11) 99999-9999'
    },
    incorporadora: {
      id: '1',
      nome: 'Construtora Premium Ltda'
    },
    imovel: {
      id: '1',
      codigo: 'AP-101-A',
      endereco: 'Rua das Flores, 123 - Apto 101 Bloco A',
      empreendimento: 'Residencial Jardim das Flores'
    },
    valores: {
      valorTotal: 450000,
      valorPago: 180000,
      saldoDevedor: 270000,
      formaPagamento: 'Financiamento + Recursos Próprios'
    },
    datas: {
      assinatura: '2024-03-15',
      inicio: '2024-03-15',
      fim: '2026-03-15',
      proximoVencimento: '2024-08-15'
    },
    clausulas: {
      reajuste: 'INCC até entrega das chaves, IPCA após',
      multa: 2,
      observacoes: 'Entrega prevista para dezembro/2025'
    },
    minutaUsada: 'Contrato de Compra e Venda Padrão',
    versao: 2,
    documentos: ['CT-2024-001_v2.pdf', 'RG_Cliente.pdf', 'CPF_Cliente.pdf'],
    dataInclusao: '2024-03-10',
    dataAtualizacao: '2024-07-20',
    assinaturaDigital: {
      cliente: true,
      incorporadora: true,
      dataAssinatura: '2024-03-15'
    }
  },
  {
    id: '2',
    numero: 'TR-2024-005',
    tipo: 'reserva',
    status: 'pendente',
    cliente: {
      id: '2',
      nome: 'Maria Oliveira Costa',
      cpfCnpj: '987.654.321-00',
      email: 'maria.costa@email.com',
      telefone: '(11) 98888-8888'
    },
    incorporadora: {
      id: '1',
      nome: 'Construtora Premium Ltda'
    },
    imovel: {
      id: '2',
      codigo: 'AP-205-B',
      endereco: 'Av. Central, 456 - Apto 205 Bloco B',
      empreendimento: 'Edifício Harmony'
    },
    valores: {
      valorTotal: 380000,
      valorPago: 38000,
      saldoDevedor: 342000,
      formaPagamento: 'Sinal + Financiamento'
    },
    datas: {
      inicio: '2024-07-20',
      proximoVencimento: '2024-08-20'
    },
    clausulas: {
      observacoes: 'Prazo de reserva: 30 dias'
    },
    minutaUsada: 'Termo de Reserva',
    versao: 1,
    documentos: ['TR-2024-005_v1.pdf'],
    dataInclusao: '2024-07-20',
    dataAtualizacao: '2024-07-20',
    assinaturaDigital: {
      cliente: false,
      incorporadora: false
    }
  }
];

const Juridico: React.FC = () => {
  return (
    <Routes>
      <Route index element={<JuridicoOverview />} />
      <Route path="contratos" element={<ContratosList />} />
      <Route path="minutas" element={<MinutasList />} />
      <Route path="vencimentos" element={<VencimentosList />} />
      <Route path="contratos/novo" element={<ContratoForm />} />
      <Route path="contratos/:id/editar" element={<ContratoForm />} />
      <Route path="contratos/:id" element={<ContratoDetails />} />
      <Route path="minutas/nova" element={<MinutaForm />} />
      <Route path="minutas/:id/editar" element={<MinutaForm />} />
    </Routes>
  );
};

// Overview do módulo
const JuridicoOverview: React.FC = () => {
  const navigate = useNavigate();
  const [contratos] = useState<Contrato[]>(mockContratos);
  const [minutas] = useState<MinutaTemplate[]>(mockMinutas);

  const estatisticas = {
    contratosAtivos: contratos.filter(c => c.status === 'em_vigor').length,
    contratosPendentes: contratos.filter(c => c.status === 'pendente').length,
    vencimentosProximos: contratos.filter(c => {
      if (!c.datas.proximoVencimento) return false;
      const hoje = new Date();
      const vencimento = new Date(c.datas.proximoVencimento);
      const diffDias = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 3600 * 24));
      return diffDias <= 30 && diffDias >= 0;
    }).length,
    minutasAtivas: minutas.filter(m => m.ativo).length,
    totalContratos: contratos.length
  };

  const cards = [
    {
      titulo: 'Contratos Ativos',
      valor: estatisticas.contratosAtivos,
      href: '/juridico/contratos',
      icon: DocumentTextIcon,
      cor: 'text-green-600',
      corFundo: 'bg-green-50',
      descricao: 'Contratos em vigor'
    },
    {
      titulo: 'Pendentes',
      valor: estatisticas.contratosPendentes,
      href: '/juridico/contratos',
      icon: ClockIcon,
      cor: 'text-yellow-600',
      corFundo: 'bg-yellow-50',
      descricao: 'Aguardando assinatura'
    },
    {
      titulo: 'Vencimentos',
      valor: estatisticas.vencimentosProximos,
      href: '/juridico/vencimentos',
      icon: ExclamationTriangleIcon,
      cor: 'text-red-600',
      corFundo: 'bg-red-50',
      descricao: 'Próximos 30 dias'
    },
    {
      titulo: 'Minutas',
      valor: estatisticas.minutasAtivas,
      href: '/juridico/minutas',
      icon: PencilSquareIcon,
      cor: 'text-blue-600',
      corFundo: 'bg-blue-50',
      descricao: 'Templates ativos'
    }
  ];

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
          <h1 className="text-2xl font-bold text-gray-900">Módulo Jurídico</h1>
          <p className="text-gray-600">Gestão de contratos e documentos legais</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/juridico/contratos/novo')}
            className="btn-primary"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Contrato
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

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Financeiro</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Valor Total em Contratos:</span>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(contratos.reduce((sum, c) => sum + c.valores.valorTotal, 0))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Valor Recebido:</span>
              <span className="text-lg font-semibold text-blue-600">
                {formatCurrency(contratos.reduce((sum, c) => sum + c.valores.valorPago, 0))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Saldo a Receber:</span>
              <span className="text-lg font-semibold text-orange-600">
                {formatCurrency(contratos.reduce((sum, c) => sum + c.valores.saldoDevedor, 0))}
              </span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/juridico/contratos/novo')}
              className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <span className="text-blue-700 font-medium">Novo Contrato</span>
              <PlusIcon className="h-5 w-5 text-blue-500" />
            </button>
            <button
              onClick={() => navigate('/juridico/minutas/nova')}
              className="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <span className="text-green-700 font-medium">Nova Minuta</span>
              <PlusIcon className="h-5 w-5 text-green-500" />
            </button>
            <button
              onClick={() => navigate('/juridico/vencimentos')}
              className="w-full flex items-center justify-between p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <span className="text-orange-700 font-medium">Ver Vencimentos</span>
              <ClockIcon className="h-5 w-5 text-orange-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Contratos Recentes */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Contratos Recentes</h3>
            <button
              onClick={() => navigate('/juridico/contratos')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Ver todos
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Número</th>
                <th className="table-header-cell">Cliente</th>
                <th className="table-header-cell">Imóvel</th>
                <th className="table-header-cell">Valor</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Ações</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {contratos.slice(0, 5).map((contrato) => (
                <tr key={contrato.id} className="table-row">
                  <td className="table-cell">
                    <div className="font-medium text-gray-900">{contrato.numero}</div>
                    <div className="text-sm text-gray-500">{contrato.tipo}</div>
                  </td>
                  <td className="table-cell">
                    <div className="font-medium text-gray-900">{contrato.cliente.nome}</div>
                    <div className="text-sm text-gray-500">{contrato.cliente.cpfCnpj}</div>
                  </td>
                  <td className="table-cell">
                    <div className="font-medium text-gray-900">{contrato.imovel.codigo}</div>
                    <div className="text-sm text-gray-500">{contrato.imovel.empreendimento}</div>
                  </td>
                  <td className="table-cell">
                    <div className="font-medium text-green-600">
                      {formatCurrency(contrato.valores.valorTotal)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Pago: {formatCurrency(contrato.valores.valorPago)}
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${
                      contrato.status === 'em_vigor' ? 'badge-success' :
                      contrato.status === 'pendente' ? 'badge-warning' :
                      contrato.status === 'finalizado' ? 'badge-info' :
                      'badge-danger'
                    }`}>
                      {contrato.status === 'em_vigor' ? 'Em Vigor' :
                       contrato.status === 'pendente' ? 'Pendente' :
                       contrato.status === 'finalizado' ? 'Finalizado' : 'Rescindido'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/juridico/contratos/${contrato.id}`)}
                        className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                        title="Ver detalhes"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded"
                        title="Download PDF"
                      >
                        <DocumentArrowDownIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Lista de Contratos
const ContratosList: React.FC = () => {
  const navigate = useNavigate();
  const [contratos, setContratos] = useState<Contrato[]>(mockContratos);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [tipoFilter, setTipoFilter] = useState<string>('todos');

  const filteredContratos = contratos.filter(contrato => {
    const matchesSearch = 
      contrato.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrato.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrato.imovel.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || contrato.status === statusFilter;
    const matchesTipo = tipoFilter === 'todos' || contrato.tipo === tipoFilter;
    
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
          <h1 className="text-2xl font-bold text-gray-900">Contratos</h1>
          <p className="text-gray-600">Gerencie todos os contratos jurídicos</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/juridico/contratos/novo')}
            className="btn-primary"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Contrato
          </button>
          <button
            onClick={() => navigate('/juridico')}
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
              placeholder="Buscar por número, cliente, imóvel..."
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
            <option value="rascunho">Rascunho</option>
            <option value="pendente">Pendente</option>
            <option value="em_vigor">Em Vigor</option>
            <option value="finalizado">Finalizado</option>
            <option value="rescindido">Rescindido</option>
          </select>

          <select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
            className="form-input"
          >
            <option value="todos">Todos os Tipos</option>
            <option value="venda">Venda</option>
            <option value="reserva">Reserva</option>
            <option value="locacao">Locação</option>
            <option value="permuta">Permuta</option>
            <option value="administracao">Administração</option>
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

      {/* Contratos Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredContratos.map((contrato) => (
          <div key={contrato.id} className="card card-hover">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{contrato.numero}</h3>
                  <p className="text-sm text-gray-500">Versão {contrato.versao}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`badge ${
                    contrato.status === 'em_vigor' ? 'badge-success' :
                    contrato.status === 'pendente' ? 'badge-warning' :
                    contrato.status === 'finalizado' ? 'badge-info' :
                    contrato.status === 'rascunho' ? 'badge-gray' : 'badge-danger'
                  }`}>
                    {contrato.status === 'em_vigor' ? 'Em Vigor' :
                     contrato.status === 'pendente' ? 'Pendente' :
                     contrato.status === 'finalizado' ? 'Finalizado' :
                     contrato.status === 'rascunho' ? 'Rascunho' : 'Rescindido'}
                  </span>
                  <span className="badge badge-info">{contrato.tipo}</span>
                </div>
              </div>

              {/* Cliente e Imóvel */}
              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Cliente:</p>
                  <p className="font-medium text-gray-900">{contrato.cliente.nome}</p>
                  <p className="text-sm text-gray-600">{contrato.cliente.cpfCnpj}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Imóvel:</p>
                  <p className="font-medium text-gray-900">{contrato.imovel.codigo}</p>
                  <p className="text-sm text-gray-600">{contrato.imovel.empreendimento}</p>
                </div>
              </div>

              {/* Valores */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Valor Total:</span>
                    <p className="font-semibold text-green-600">
                      {formatCurrency(contrato.valores.valorTotal)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Saldo Devedor:</span>
                    <p className="font-semibold text-orange-600">
                      {formatCurrency(contrato.valores.saldoDevedor)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Datas */}
              <div className="space-y-2 mb-4 text-sm">
                {contrato.datas.assinatura && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Assinatura:</span>
                    <span>{new Date(contrato.datas.assinatura).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
                {contrato.datas.proximoVencimento && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Próx. Vencimento:</span>
                    <span className="text-orange-600 font-medium">
                      {new Date(contrato.datas.proximoVencimento).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
              </div>

              {/* Assinatura Digital */}
              <div className="flex items-center justify-between mb-4 p-2 bg-blue-50 rounded">
                <span className="text-sm text-blue-700">Assinatura Digital:</span>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {contrato.assinaturaDigital.cliente ? (
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-xs text-blue-600 ml-1">Cliente</span>
                  </div>
                  <div className="flex items-center">
                    {contrato.assinaturaDigital.incorporadora ? (
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-xs text-blue-600 ml-1">Incorporadora</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/juridico/contratos/${contrato.id}`)}
                    className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                    title="Ver detalhes"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => navigate(`/juridico/contratos/${contrato.id}/editar`)}
                    className="text-yellow-600 hover:text-yellow-800 p-1 hover:bg-yellow-50 rounded"
                    title="Editar"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>

                  <button
                    className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded"
                    title="Download PDF"
                  >
                    <DocumentArrowDownIcon className="h-4 w-4" />
                  </button>

                  <button
                    className="text-purple-600 hover:text-purple-800 p-1 hover:bg-purple-50 rounded"
                    title="Duplicar"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (confirm('Tem certeza que deseja excluir este contrato?')) {
                      setContratos(prev => prev.filter(c => c.id !== contrato.id));
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
      {filteredContratos.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum contrato encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'todos' || tipoFilter !== 'todos'
              ? 'Tente ajustar os filtros de busca.'
              : 'Comece criando seu primeiro contrato.'}
          </p>
        </div>
      )}
    </div>
  );
};

// Placeholder para outras páginas
const MinutasList: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minutas de Contratos</h1>
          <p className="text-gray-600">Templates editáveis para geração automática</p>
        </div>
        <button onClick={() => navigate('/juridico')} className="btn-outline">Voltar</button>
      </div>
      <div className="card p-6">
        <p className="text-gray-600">Gestão de minutas será implementada aqui.</p>
      </div>
    </div>
  );
};

const VencimentosList: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vencimentos de Contratos</h1>
          <p className="text-gray-600">Acompanhamento de pagamentos e renovações</p>
        </div>
        <button onClick={() => navigate('/juridico')} className="btn-outline">Voltar</button>
      </div>
      <div className="card p-6">
        <p className="text-gray-600">Sistema de vencimentos será implementado aqui.</p>
      </div>
    </div>
  );
};

const ContratoForm: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Formulário de Contrato</h1>
          <p className="text-gray-600">Geração automática com campos variáveis</p>
        </div>
        <button onClick={() => navigate('/juridico/contratos')} className="btn-outline">Voltar</button>
      </div>
      <div className="card p-6">
        <p className="text-gray-600">Formulário completo será implementado aqui.</p>
      </div>
    </div>
  );
};

const ContratoDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Detalhes do Contrato</h1>
          <p className="text-gray-600">Visualização completa com versionamento</p>
        </div>
        <button onClick={() => navigate('/juridico/contratos')} className="btn-outline">Voltar</button>
      </div>
      <div className="card p-6">
        <p className="text-gray-600">Detalhes completos serão implementados aqui.</p>
      </div>
    </div>
  );
};

const MinutaForm: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editor de Minutas</h1>
          <p className="text-gray-600">Criação e edição de templates</p>
        </div>
        <button onClick={() => navigate('/juridico/minutas')} className="btn-outline">Voltar</button>
      </div>
      <div className="card p-6">
        <p className="text-gray-600">Editor de minutas será implementado aqui.</p>
      </div>
    </div>
  );
};

export default Juridico;