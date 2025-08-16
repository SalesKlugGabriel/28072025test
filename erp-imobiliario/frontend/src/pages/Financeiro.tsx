import React, { useState, useEffect } from 'react';
import { 
  BanknotesIcon, 
  CreditCardIcon, 
  ArrowUpIcon, 
  ArrowDownIcon, 
  CalendarIcon,
  DocumentTextIcon,
  PlusIcon,
  FunnelIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface ContaFinanceira {
  id: string;
  nome: string;
  banco: string;
  agencia: string;
  conta: string;
  tipo: 'corrente' | 'poupanca' | 'investimento';
  saldoAtual: number;
  ativa: boolean;
}

interface MovimentacaoFinanceira {
  id: string;
  tipo: 'receita' | 'despesa';
  categoria: string;
  subcategoria: string;
  descricao: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: 'pendente' | 'pago' | 'vencido' | 'cancelado';
  formaPagamento?: string;
  contaId: string;
  clienteId?: string;
  clienteNome?: string;
  empreendimentoId?: string;
  empreendimentoNome?: string;
  observacoes?: string;
  anexos?: string[];
  parcelamento?: {
    numeroParcela: number;
    totalParcelas: number;
    grupoParcelamento: string;
  };
  dataCriacao: string;
  criadoPor: string;
}

interface FluxoCaixa {
  data: string;
  entradas: number;
  saidas: number;
  saldo: number;
  movimentacoes: MovimentacaoFinanceira[];
}

const Financeiro: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'receber' | 'pagar' | 'fluxo' | 'contas'>('dashboard');
  const [contas, setContas] = useState<ContaFinanceira[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoFinanceira[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
  const [periodoInicio, setPeriodoInicio] = useState<string>('');
  const [periodoFim, setPeriodoFim] = useState<string>('');

  const categorias = {
    receita: [
      'Vendas de Imóveis',
      'Comissões',
      'Aluguel de Imóveis',
      'Serviços de Consultoria',
      'Rendimentos Financeiros',
      'Outros Recebimentos'
    ],
    despesa: [
      'Salários e Encargos',
      'Marketing e Publicidade',
      'Manutenção e Reformas',
      'Energia Elétrica',
      'Telefone e Internet',
      'Material de Escritório',
      'Combustível',
      'Impostos e Taxas',
      'Financiamentos',
      'Outras Despesas'
    ]
  };

  const formasPagamento = [
    'Dinheiro',
    'PIX',
    'Transferência Bancária',
    'Cartão de Crédito',
    'Cartão de Débito',
    'Boleto Bancário',
    'Cheque',
    'Financiamento'
  ];

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    // Simular dados das contas
    const contasSimuladas: ContaFinanceira[] = [
      {
        id: 'conta_1',
        nome: 'Conta Principal',
        banco: 'Banco do Brasil',
        agencia: '1234-5',
        conta: '67890-1',
        tipo: 'corrente',
        saldoAtual: 150000.00,
        ativa: true
      },
      {
        id: 'conta_2',
        nome: 'Poupança Reserva',
        banco: 'Itaú',
        agencia: '5678',
        conta: '12345-6',
        tipo: 'poupanca',
        saldoAtual: 80000.00,
        ativa: true
      },
      {
        id: 'conta_3',
        nome: 'Investimentos',
        banco: 'Nubank',
        agencia: '0001',
        conta: '9876543-2',
        tipo: 'investimento',
        saldoAtual: 200000.00,
        ativa: true
      }
    ];

    // Simular movimentações
    const movimentacoesSimuladas: MovimentacaoFinanceira[] = [
      {
        id: 'mov_1',
        tipo: 'receita',
        categoria: 'Vendas de Imóveis',
        subcategoria: 'Comissão de Venda',
        descricao: 'Comissão venda apartamento - João Silva',
        valor: 45000.00,
        dataVencimento: new Date().toISOString().split('T')[0],
        status: 'pago',
        dataPagamento: new Date().toISOString().split('T')[0],
        formaPagamento: 'Transferência Bancária',
        contaId: 'conta_1',
        clienteId: 'cliente_1',
        clienteNome: 'João Silva',
        empreendimentoId: 'emp_1',
        empreendimentoNome: 'Jardim das Flores',
        dataCriacao: new Date().toISOString(),
        criadoPor: 'admin'
      },
      {
        id: 'mov_2',
        tipo: 'despesa',
        categoria: 'Marketing e Publicidade',
        subcategoria: 'Facebook Ads',
        descricao: 'Impulsionamento de posts - Setembro',
        valor: 5000.00,
        dataVencimento: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'pendente',
        contaId: 'conta_1',
        dataCriacao: new Date().toISOString(),
        criadoPor: 'admin'
      },
      {
        id: 'mov_3',
        tipo: 'receita',
        categoria: 'Aluguel de Imóveis',
        subcategoria: 'Aluguel Mensal',
        descricao: 'Aluguel escritório central',
        valor: 8000.00,
        dataVencimento: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'vencido',
        contaId: 'conta_1',
        dataCriacao: new Date().toISOString(),
        criadoPor: 'admin'
      }
    ];

    setContas(contasSimuladas);
    setMovimentacoes(movimentacoesSimuladas);
  };

  const calcularResumoFinanceiro = () => {
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    const movimentacoesMes = movimentacoes.filter(mov => {
      const dataVenc = new Date(mov.dataVencimento);
      return dataVenc >= inicioMes && dataVenc <= fimMes;
    });

    const receitasTotal = movimentacoesMes
      .filter(mov => mov.tipo === 'receita')
      .reduce((sum, mov) => sum + mov.valor, 0);

    const despesasTotal = movimentacoesMes
      .filter(mov => mov.tipo === 'despesa')
      .reduce((sum, mov) => sum + mov.valor, 0);

    const receitasPagas = movimentacoesMes
      .filter(mov => mov.tipo === 'receita' && mov.status === 'pago')
      .reduce((sum, mov) => sum + mov.valor, 0);

    const despesasPagas = movimentacoesMes
      .filter(mov => mov.tipo === 'despesa' && mov.status === 'pago')
      .reduce((sum, mov) => sum + mov.valor, 0);

    const pendentesReceber = movimentacoesMes
      .filter(mov => mov.tipo === 'receita' && mov.status === 'pendente')
      .reduce((sum, mov) => sum + mov.valor, 0);

    const pendentesPagar = movimentacoesMes
      .filter(mov => mov.tipo === 'despesa' && mov.status === 'pendente')
      .reduce((sum, mov) => sum + mov.valor, 0);

    const vencidos = movimentacoes
      .filter(mov => {
        const dataVenc = new Date(mov.dataVencimento);
        return dataVenc < hoje && mov.status === 'pendente';
      })
      .length;

    const saldoTotal = contas
      .filter(conta => conta.ativa)
      .reduce((sum, conta) => sum + conta.saldoAtual, 0);

    return {
      saldoTotal,
      receitasTotal,
      despesasTotal,
      receitasPagas,
      despesasPagas,
      pendentesReceber,
      pendentesPagar,
      vencidos,
      saldoMes: receitasPagas - despesasPagas
    };
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const obterCorStatus = (status: string) => {
    switch (status) {
      case 'pago': return 'text-green-600 bg-green-100';
      case 'pendente': return 'text-yellow-600 bg-yellow-100';
      case 'vencido': return 'text-red-600 bg-red-100';
      case 'cancelado': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const obterIconeStatus = (status: string) => {
    switch (status) {
      case 'pago': return CheckCircleIcon;
      case 'pendente': return ClockIcon;
      case 'vencido': return ExclamationTriangleIcon;
      default: return ClockIcon;
    }
  };

  const renderDashboard = () => {
    const resumo = calcularResumoFinanceiro();

    return (
      <div className="space-y-6">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Saldo Total</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatarMoeda(resumo.saldoTotal)}
                </p>
              </div>
              <BanknotesIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">A Receber</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatarMoeda(resumo.pendentesReceber)}
                </p>
              </div>
              <ArrowUpIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">A Pagar</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatarMoeda(resumo.pendentesPagar)}
                </p>
              </div>
              <ArrowDownIcon className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vencidos</p>
                <p className="text-2xl font-bold text-orange-600">
                  {resumo.vencidos}
                </p>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Gráfico e Contas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fluxo de Caixa Resumo */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fluxo de Caixa - Este Mês</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <ArrowUpIcon className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">Receitas</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {formatarMoeda(resumo.receitasPagas)}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <ArrowDownIcon className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-900">Despesas</span>
                </div>
                <span className="text-lg font-bold text-red-600">
                  {formatarMoeda(resumo.despesasPagas)}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div className="flex items-center gap-3">
                  <ChartBarIcon className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Resultado</span>
                </div>
                <span className={`text-lg font-bold ${resumo.saldoMes >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatarMoeda(resumo.saldoMes)}
                </span>
              </div>
            </div>
          </div>

          {/* Contas Bancárias */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contas Bancárias</h3>
            <div className="space-y-3">
              {contas.filter(conta => conta.ativa).map(conta => (
                <div key={conta.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{conta.nome}</span>
                    <span className="text-xs text-gray-500">{conta.tipo}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {conta.banco} - Ag: {conta.agencia}
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {formatarMoeda(conta.saldoAtual)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Próximos Vencimentos */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximos Vencimentos</h3>
          <div className="space-y-3">
            {movimentacoes
              .filter(mov => mov.status === 'pendente')
              .sort((a, b) => new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime())
              .slice(0, 5)
              .map(mov => {
                const IconeStatus = obterIconeStatus(mov.status);
                return (
                  <div key={mov.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <IconeStatus className={`h-5 w-5 ${mov.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`} />
                      <div>
                        <div className="font-medium text-gray-900">{mov.descricao}</div>
                        <div className="text-sm text-gray-600">{mov.categoria}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${mov.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                        {mov.tipo === 'receita' ? '+' : '-'} {formatarMoeda(mov.valor)}
                      </div>
                      <div className="text-sm text-gray-600">{formatarData(mov.dataVencimento)}</div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  };

  const renderMovimentacoes = (tipo: 'receita' | 'despesa') => {
    const movimentacoesFiltradas = movimentacoes
      .filter(mov => mov.tipo === tipo)
      .filter(mov => filtroStatus === 'todos' || mov.status === filtroStatus)
      .filter(mov => filtroCategoria === 'todas' || mov.categoria === filtroCategoria);

    return (
      <div className="space-y-6">
        {/* Filtros */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todos">Todos os Status</option>
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
                <option value="vencido">Vencido</option>
                <option value="cancelado">Cancelado</option>
              </select>

              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todas">Todas as Categorias</option>
                {categorias[tipo].map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
            </div>

            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <PlusIcon className="h-5 w-5" />
              Nova {tipo === 'receita' ? 'Receita' : 'Despesa'}
            </button>
          </div>
        </div>

        {/* Lista de Movimentações */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vencimento
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
                {movimentacoesFiltradas.map(mov => {
                  const IconeStatus = obterIconeStatus(mov.status);
                  return (
                    <tr key={mov.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{mov.descricao}</div>
                          {mov.clienteNome && (
                            <div className="text-sm text-gray-500">{mov.clienteNome}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{mov.categoria}</div>
                        <div className="text-sm text-gray-500">{mov.subcategoria}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-bold ${tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                          {formatarMoeda(mov.valor)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatarData(mov.dataVencimento)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${obterCorStatus(mov.status)}`}>
                          <IconeStatus className="h-3 w-3" />
                          {mov.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                        <button className="text-green-600 hover:text-green-900">Pagar</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Módulo Financeiro</h1>
            <p className="text-gray-600">Controle completo das finanças da empresa</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {[
                { id: 'dashboard', nome: 'Dashboard', icon: ChartBarIcon },
                { id: 'receber', nome: 'Contas a Receber', icon: ArrowUpIcon },
                { id: 'pagar', nome: 'Contas a Pagar', icon: ArrowDownIcon },
                { id: 'fluxo', nome: 'Fluxo de Caixa', icon: CalendarIcon },
                { id: 'contas', nome: 'Contas Bancárias', icon: BanknotesIcon }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`group inline-flex items-center py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className={`-ml-0.5 mr-2 h-5 w-5 ${
                    activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                  {tab.nome}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Conteúdo das Tabs */}
        <div>
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'receber' && renderMovimentacoes('receita')}
          {activeTab === 'pagar' && renderMovimentacoes('despesa')}
          {activeTab === 'fluxo' && (
            <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Fluxo de Caixa</h3>
              <p className="text-gray-600">Módulo de fluxo de caixa em desenvolvimento.</p>
            </div>
          )}
          {activeTab === 'contas' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Contas Bancárias</h2>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <PlusIcon className="h-5 w-5" />
                  Nova Conta
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contas.map(conta => (
                  <div key={conta.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{conta.nome}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        conta.ativa ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {conta.ativa ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div><strong>Banco:</strong> {conta.banco}</div>
                      <div><strong>Agência:</strong> {conta.agencia}</div>
                      <div><strong>Conta:</strong> {conta.conta}</div>
                      <div><strong>Tipo:</strong> {conta.tipo}</div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatarMoeda(conta.saldoAtual)}
                      </div>
                      <div className="text-sm text-gray-500">Saldo atual</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Financeiro;