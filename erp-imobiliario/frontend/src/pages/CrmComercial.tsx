// ==================== DADOS MOCK EXPANDIDOS ====================

const mockEmpreendimentos: Empreendimento[] = [
  {
    id: '1',
    nome: 'Residencial Solar das Flores',
    status: 'construcao',
    cidade: 'Florianópolis',
    bairro: 'Centro',
    tipoImovel: 'apartamento',
    valorMinimo: 280000,
    valorMaximo: 650000,
    unidadesTotal: 120,
    unidadesVendidas: 85,
    dataLancamento: '2024-06-15',
    dataPrevEntrega: '2026-03-30'
  },
  {
    id: '2',
    nome: 'Comercial Business Center',
    status: 'pronto',
    cidade: 'Florianópolis',
    bairro: 'Itacorubi',
    tipoImovel: 'comercial',
    valorMinimo: 450000,
    valorMaximo: 1200000,
    unidadesTotal: 60,
    unidadesVendidas: 42,
    dataLancamento: '2023-01-10',
    dataPrevEntrega: '2024-12-20'
  },
  {
    id: '3',
    nome: 'Residencial Jardim das Águas',
    status: 'lancamento',
    cidade: 'São José',
    bairro: 'Kobrasol',
    tipoImovel: 'apartamento',
    valorMinimo: 320000,
    valorMaximo: 480000,
    unidadesTotal: 80,
    unidadesVendidas: 15,
    dataLancamento: '2025-01-20',
    dataPrevEntrega: '2027-06-15'
  }
];

const mockClientes: Cliente[] = [
  {
    id: '1',
    nome: 'Maria Silva Santos',
    email: 'maria.silva@email.com',
    telefone: '(48) 99999-1234',
    whatsapp: '48999991234',
    origem: 'site',
    status: 'interessado',
    prioridade: 'alta',
    valorOrcamento: 450000,
    observacoes: 'Interessada em apartamento de 3 quartos no centro. Já tem aprovação bancária pré-aprovada.',
    responsavel: 'João Corretor',
    dataCriacao: '2025-01-15',
    ultimoContato: '2025-01-28',
    proximoFollowUp: '2025-01-31',
    empreendimentoInteresse: 'Residencial Solar das Flores',
    tipoImovelInteresse: ['apartamento'],
    tags: ['qualificado', 'urgente', 'financiamento-aprovado'],
    score: 85,
    temperatura: 'quente',
    tempoResposta: 2,
    numeroContatos: 5,
    fonteDetalhada: 'Google Ads - Apartamento Centro',
    cidade: 'Florianópolis',
    estadoCivil: 'casado',
    profissao: 'Engenheira',
    renda: 12000,
    idade: 34
  },
  {
    id: '2',
    nome: 'Carlos Eduardo Lima',
    email: 'carlos.lima@empresa.com',
    telefone: '(48) 98888-5678',
    whatsapp: '48988885678',
    origem: 'indicacao',
    status: 'negociacao',
    prioridade: 'alta',
    valorOrcamento: 680000,
    observacoes: 'Empresário interessado em investimento. Busca imóvel para renda.',
    responsavel: 'Ana Corretora',
    dataCriacao: '2025-01-10',
    ultimoContato: '2025-01-29',
    proximoFollowUp: '2025-02-01',
    empreendimentoInteresse: 'Comercial Business Center',
    tipoImovelInteresse: ['comercial'],
    tags: ['investidor', 'decisor', 'alta-renda'],
    score: 92,
    temperatura: 'quente',
    tempoResposta: 1,
    numeroContatos: 8,
    fonteDetalhada: 'Indicação - Cliente João Martins',
    cidade: 'Florianópolis',
    estadoCivil: 'casado',
    profissao: 'Empresário',
    renda: 35000,
    idade: 45
  },
  {
    id: '3',
    nome: 'Pedro Santos Oliveira',
    email: 'pedro.oliveira@gmail.com',
    telefone: '(48) 97777-9012',
    origem: 'redes-sociais',
    status: 'lead',
    prioridade: 'media',
    responsavel: 'Maria Corretora',
    dataCriacao: '2025-01-25',
    ultimoContato: '2025-01-26',
    proximoFollowUp: '2025-01-30',
    tags: ['novo', 'primeira-conversa'],
    score: 45,
    temperatura: 'morno',
    tempoResposta: 12,
    numeroContatos: 1,
    fonteDetalhada: 'Instagram - Post Residencial',
    cidade: 'São José',
    estadoCivil: 'solteiro',
    profissao: 'Analista de TI',
    renda: 8500,
    idade: 28
  },
  {
    id: '4',
    nome: 'Ana Paula Costa',
    email: 'anapaula@email.com',
    telefone: '(48) 96666-3456',
    whatsapp: '48966663456',
    origem: 'telemarketing',
    status: 'proposta',
    prioridade: 'alta',
    valorOrcamento: 320000,
    observacoes: 'Primeira casa própria, aprovação bancária em andamento. Muito animada com o projeto.',
    responsavel: 'João Corretor',
    dataCriacao: '2025-01-20',
    ultimoContato: '2025-01-29',
    proximoFollowUp: '2025-02-02',
    empreendimentoInteresse: 'Residencial Solar das Flores',
    tipoImovelInteresse: ['apartamento'],
    tags: ['financiamento', 'primeira-casa', 'jovem'],
    score: 78,
    temperatura: 'quente',
    tempoResposta: 3,
    numeroContatos: 6,
    fonteDetalhada: 'Telemarketing Ativo - Lista Revista Imobiliária',
    cidade: 'Florianópolis',
    estadoCivil: 'solteiro',
    profissao: 'Professora',
    renda: 6500,
    idade: 29
  },
  {
    id: '5',
    nome: 'Roberto Ferreira',
    email: 'roberto.ferreira@gmail.com',
    telefone: '(48) 95555-7890',
    origem: 'evento',
    status: 'contato',
    prioridade: 'media',
    valorOrcamento: 280000,
    responsavel: 'Ana Corretora',
    dataCriacao: '2025-01-22',
    ultimoContato: '2025-01-27',
    proximoFollowUp: '2025-01-31',
    empreendimentoInteresse: 'Residencial Jardim das Águas',
    tags: ['primeira-compra', 'evento-feira'],
    score: 62,
    temperatura: 'morno',
    tempoResposta: 6,
    numeroContatos: 3,
    fonteDetalhada: 'Feira Imobiliária Kobrasol 2025',
    cidade: 'São José',
    estadoCivil: 'casado',
    profissao: 'Contador',
    renda: 9200,
    idade: 38
  },
  {
    id: '6',
    nome: 'Fernanda Costa',
    email: 'fernanda.costa@outlook.com',
    telefone: '(48) 94444-5678',
    whatsapp: '48944445678',
    origem: 'site',
    status: 'vendido',
    prioridade: 'alta',
    valorOrcamento: 550000,
    observacoes: 'Compra finalizada - apartamento 302 Bloco A. Cliente muito satisfeita.',
    responsavel: 'João Corretor',
    dataCriacao: '2024-12-15',
    ultimoContato: '2025-01-25',
    empreendimentoInteresse: 'Residencial Solar das Flores',
    tags: ['cliente-vip', 'concluido', 'indicadora'],
    score: 95,
    temperatura: 'quente',
    tempoResposta: 1,
    numeroContatos: 12,
    fonteDetalhada: 'Site - Busca Orgânica Google',
    cidade: 'Florianópolis',
    estadoCivil: 'casado',
    profissao: 'Médica',
    renda: 25000,
    idade: 42
  },
  {
    id: '7',
    nome: 'José Martins',
    email: 'jose.martins@hotmail.com',
    telefone: '(48) 93333-4567',
    origem: 'site',
    status: 'perdido',
    prioridade: 'baixa',
    valorOrcamento: 200000,
    observacoes: 'Perdeu interesse após mudança de cidade por motivos profissionais.',
    responsavel: 'Maria Corretora',
    dataCriacao: '2025-01-05',
    ultimoContato: '2025-01-20',
    tags: ['sem-interesse', 'mudou-cidade'],
    score: 25,
    temperatura: 'frio',
    tempoResposta: 24,
    numeroContatos: 4,
    fonteDetalhada: 'Site - Página de Contato',
    cidade: 'Palhoça',
    estadoCivil: 'divorciado',
    profissao: 'Vendedor',
    renda: 4200,
    idade: 51
  },
  {
    id: '8',
    nome: 'Juliana Mendes',
    email: 'juliana.mendes@empresa.com.br',
    telefone: '(48) 92222-8901',
    whatsapp: '48922228901',
    origem: 'indicacao',
    status: 'interessado',
    prioridade: 'alta',
    valorOrcamento: 480000,
    observacoes: 'Indicada pela Fernanda Costa. Interesse em apartamento similar.',
    responsavel: 'João Corretor',
    dataCriacao: '2025-01-26',
    ultimoContato: '2025-01-29',
    proximoFollowUp: '2025-02-01',
    empreendimentoInteresse: 'Residencial Solar das Flores',
    tipoImovelInteresse: ['apartamento'],
    tags: ['indicacao-vip', 'qualificado'],
    score: 88,
    temperatura: 'quente',
    tempoResposta: 2,
    numeroContatos: 3,
    fonteDetalhada: 'Indicação Fernanda Costa',
    cidade: 'Florianópolis',
    estadoCivil: 'casado',
    profissao: 'Advogada',
    renda: 15000,
    idade: 36
  }
];

const mockAtividades: Atividade[] = [
  {
    id: '1',
    clienteId: '1',
    tipo: 'ligacao',
    descricao: 'Follow-up sobre interesse no apartamento tipo 2',
    data: '2025-01-28T14:30:00',
    responsavel: 'João Corretor',
    status: 'concluido',
    observacoes: 'Cliente confirmou interesse e agendou visita para próxima semana',
    duracao: 15,
    resultado: 'positivo',
    proximaAcao: 'Agendar visita ao apartamento decorado',
    dataProximaAcao: '2025-02-02',
    prioridade: 'alta'
  },
  {
    id: '2',
    clienteId: '2',
    tipo: 'reuniao',
    descricao: 'Apresentação da proposta comercial',
    data: '2025-02-01T10:00:00',
    responsavel: 'Ana Corretora',
    status: 'agendado',
    observacoes: 'Preparar material completo sobre ROI do investimento',
    duracao: 60,
    prioridade: 'alta'
  },
  {
    id: '3',
    clienteId: '4',
    tipo: 'email',
    descricao: 'Envio da proposta personalizada',
    data: '2025-01-29T16:00:00',
    responsavel: 'João Corretor',
    status: 'concluido',
    observacoes: 'Proposta enviada com condições especiais de pagamento',
    resultado: 'positivo',
    proximaAcao: 'Aguardar resposta em 48h',
    dataProximaAcao: '2025-01-31',
    prioridade: 'alta'
  },
  {
    id: '4',
    clienteId: '1',
    tipo: 'visita',
    descricao: 'Visita ao apartamento decorado',
    data: '2025-02-02T09:00:00',
    responsavel: 'João Corretor',
    status: 'agendado',
    duracao: 90,
    prioridade: 'alta'
  },
  {
    id: '5',
    clienteId: '3',
    tipo: 'whatsapp',
    descricao: 'Primeiro contato via WhatsApp',
    data: '2025-01-26T11:15:00',
    responsavel: 'Maria Corretora',
    status: 'concluido',
    observacoes: 'Cliente respondeu positivamente, demonstrou interesse',
    duracao: 10,
    resultado: 'positivo',
    proximaAcao: 'Ligar para qualificar melhor o perfil',
    dataProximaAcao: '2025-01-30',
    prioridade: 'media'
  },
  {
    id: '6',
    clienteId: '5',
    tipo: 'follow-up',
    descricao: 'Follow-up pós evento',
    data: '2025-01-31T15:00:00',
    responsavel: 'Ana Corretora',
    status: 'agendado',
    prioridade: 'media'
  },
  {
    id: '7',
    clienteId: '8',
    tipo: 'ligacao',
    descricao: 'Primeiro contato - lead indicado',
    data: '2025-01-29T10:30:00',
    responsavel: 'João Corretor',
    status: 'concluido',
    observacoes: 'Excelente primeiro contato, cliente muito interessada',
    duracao: 20,
    resultado: 'positivo',
    proximaAcao: 'Enviar material do empreendimento',
    dataProximaAcao: '2025-01-30',
    prioridade: 'alta'
  }
];

const mockMetricas: MetricaVendas = {
  periodo: 'Janeiro 2025',
  leadsGerados: 45,
  leadsConvertidos: 8,
  taxaConversao: 17.8,
  valorVendas: 2340000,
  ticketMedio: 292500,
  tempoMedioVenda: 25,
  custoAquisicao: 185,
  valorPipeline: 3840000,
  metaMensal: 3000000,
  crescimentoMensal: 15.4
};

// ==================== COMPONENT WRAPPER COM HOOKS ====================

function CRMWrapper() {
  return (
    <CRMProvider>
      <CrmComercial />
    </CRMProvider>
  );
}

// ==================== COMPONENTE PRINCIPAL ATUALIZADO ====================

function CrmComercial() {
  // Usando hooks customizados
  const { state, dispatch } = useCRM();
  const { formatCurrency, formatDate, formatDateTime, formatPercentage } = useFormatters();
  const clientesFiltrados = useClienteFilter();
  const metricas = useMetricas();
  const { atividadesHoje, atividadesPendentes, atividadesVencidas, proximasAtividades } = useAtividadeFilter();
  const { notifications, addNotification, unreadCount } = useNotifications();
  
  // Estados locais otimizados
  const [secaoAtiva, setSecaoAtiva] = useState<'dashboard' | 'kanban' | 'leads' | 'atividades'>('dashboard');
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [mostrarModalNovoLead, setMostrarModalNovoLead] = useState(false);
  const [mostrarFiltrosAvancados, setMostrarFiltrosAvancados] = useState(false);

  // Performance: Memoized values
  const dadosCalculados = useMemo(() => ({
    totalClientes: clientesFiltrados.length,
    clientesAtivos: metricas.clientesAtivos,
    clientesVendidos: metricas.clientesVendidos,
    valorPipeline: metricas.valorPipeline
  }), [clientesFiltrados.length, metricas]);

  // Auto-save preferences
  const [preferences] = useLocalStorage('crm-preferences', {
    secaoFavorita: 'dashboard',
    itemsPorPagina: 25,
    tema: 'light'
  });

  // Performance optimization: Update filtros via dispatch
  const updateFiltros = useCallback((novosFiltros: Partial<FiltrosCRM>) => {
    dispatch({ type: 'SET_FILTROS', payload: novosFiltros });
  }, [dispatch]);

  // Função para obter ícone da atividade (memoizada)
  const getIconeAtividade = useCallback((tipo: string) => {
    const icones = {
      ligacao: Phone,
      email: Mail,
      whatsapp: MessageSquare,
      reuniao: Calendar,
      visita: Eye,
      proposta: DollarSign,
      'follow-up': Clock,
      nota: Edit2
    };
    return icones[tipo as keyof typeof icones] || Clock;
  }, []);

  // Função para obter cor da atividade (memoizada)
  const getCorAtividade = useCallback((tipo: string, status: string) => {
    if (status === 'cancelado') return 'text-red-500 bg-red-50';
    if (status === 'concluido') return 'text-green-500 bg-green-50';
    
    const cores = {
      ligacao: 'text-green-600 bg-green-50',
      email: 'text-blue-600 bg-blue-50',
      whatsapp: 'text-green-600 bg-green-50',
      reuniao: 'text-purple-600 bg-purple-50',
      visita: 'text-orange-600 bg-orange-50',
      proposta: 'text-yellow-600 bg-yellow-50',
      'follow-up': 'text-gray-600 bg-gray-50',
      nota: 'text-indigo-600 bg-indigo-50'
    };
    return cores[tipo as keyof typeof cores] || 'text-gray-600 bg-gray-50';
  }, []);

  // Effect para notificações automáticas
  useEffect(() => {
    if (atividadesVencidas.length > 0) {
      addNotification({
        type: 'warning',
        title: 'Atividades Vencidas',
        message: `Você tem ${atividadesVencidas.length} atividade(s) vencida(s)`
      });
    }
  }, [atividadesVencidas.length, addNotification]);

  // ==================== SISTEMA DE COMUNICAÇÃO ====================

  // Hook para comunicação
  function useComunicacao() {
    const [historicoChamadas, setHistoricoChamadas] = useState<Array<{
      id: string;
      clienteId: string;
      tipo: 'entrada' | 'saida';
      duracao: number;
      status: 'atendida' | 'perdida' | 'ocupado';
      data: string;
      gravacao?: string;
      observacoes?: string;
    }>>([]);

    const [statusTelefone, setStatusTelefone] = useState<'disponivel' | 'ocupado' | 'ausente'>('disponivel');
    const [chamadaAtiva, setChamadaAtiva] = useState<{
      clienteId: string;
      iniciada: Date;
      status: 'discando' | 'tocando' | 'conectada';
    } | null>(null);

    const iniciarChamada = useCallback(async (cliente: Cliente) => {
      setChamadaAtiva({
        clienteId: cliente.id,
        iniciada: new Date(),
        status: 'discando'
      });

      // Simular processo de chamada
      setTimeout(() => {
        setChamadaAtiva(prev => prev ? { ...prev, status: 'tocando' } : null);
      }, 1000);

      setTimeout(() => {
        setChamadaAtiva(prev => prev ? { ...prev, status: 'conectada' } : null);
        setStatusTelefone('ocupado');
      }, 3000);

      // Registrar atividade
      const novaAtividade: Atividade = {
        id: Date.now().toString(),
        clienteId: cliente.id,
        tipo: 'ligacao',
        descricao: `Ligação para ${cliente.nome}`,
        data: new Date().toISOString(),
        responsavel: 'Usuário Atual',
        status: 'em-andamento',
        prioridade: 'media'
      };

      addNotification({
        type: 'info',
        title: 'Chamada Iniciada',
        message: `Ligando para ${cliente.nome}`
      });

      return novaAtividade;
    }, [addNotification]);

    const finalizarChamada = useCallback((duracao: number, resultado: 'positivo' | 'neutro' | 'negativo', observacoes?: string) => {
      if (chamadaAtiva) {
        const novaChamada = {
          id: Date.now().toString(),
          clienteId: chamadaAtiva.clienteId,
          tipo: 'saida' as const,
          duracao,
          status: 'atendida' as const,
          data: chamadaAtiva.iniciada.toISOString(),
          observacoes
        };

        setHistoricoChamadas(prev => [novaChamada, ...prev]);
        setChamadaAtiva(null);
        setStatusTelefone('disponivel');

        addNotification({
          type: 'success',
          title: 'Chamada Finalizada',
          message: `Duração: ${Math.floor(duracao / 60)}:${(duracao % 60).toString().padStart(2, '0')}`
        });
      }
    }, [chamadaAtiva, addNotification]);

    const enviarEmail = useCallback(async (cliente: Cliente, assunto: string, corpo: string, anexos?: File[]) => {
      // Simular envio de email
      await new Promise(resolve => setTimeout(resolve, 2000));

      const novaAtividade: Atividade = {
        id: Date.now().toString(),
        clienteId: cliente.id,
        tipo: 'email',
        descricao: `Email enviado: ${assunto}`,
        data: new Date().toISOString(),
        responsavel: 'Usuário Atual',
        status: 'concluido',
        observacoes: corpo.substring(0, 100) + '...',
        prioridade: 'media'
      };

      addNotification({
        type: 'success',
        title: 'Email Enviado',
        message: `Email enviado para ${cliente.nome}`
      });

      return novaAtividade;
    }, [addNotification]);

    const enviarWhatsApp = useCallback(async (cliente: Cliente, mensagem: string, tipo: 'texto' | 'imagem' | 'documento' = 'texto') => {
      if (!cliente.whatsapp) {
        addNotification({
          type: 'error',
          title: 'WhatsApp Indisponível',
          message: 'Cliente não possui WhatsApp cadastrado'
        });
        return null;
      }

      // Simular envio via API do WhatsApp
      await new Promise(resolve => setTimeout(resolve, 1500));

      const novaAtividade: Atividade = {
        id: Date.now().toString(),
        clienteId: cliente.id,
        tipo: 'whatsapp',
        descricao: `WhatsApp enviado`,
        data: new Date().toISOString(),
        responsavel: 'Usuário Atual',
        status: 'concluido',
        observacoes: mensagem.substring(0, 100) + '...',
        prioridade: 'media'
      };

      // Abrir WhatsApp Web
      const numeroLimpo = cliente.whatsapp.replace(/\D/g, '');
      const mensagemEncoded = encodeURIComponent(mensagem);
      window.open(`https://wa.me/55${numeroLimpo}?text=${mensagemEncoded}`, '_blank');

      addNotification({
        type: 'success',
        title: 'WhatsApp Enviado',
        message: `Mensagem enviada para ${cliente.nome}`
      });

      return novaAtividade;
    }, [addNotification]);

    return {
      historicoChamadas,
      statusTelefone,
      chamadaAtiva,
      iniciarChamada,
      finalizarChamada,
      enviarEmail,
      enviarWhatsApp
    };
  }

  // Componente de Interface de Chamada
  function InterfaceChamada() {
    const { chamadaAtiva, finalizarChamada } = useComunicacao();
    const [duracao, setDuracao] = useState(0);
    const [observacoes, setObservacoes] = useState('');

    useEffect(() => {
      let interval: NodeJS.Timeout;
      if (chamadaAtiva?.status === 'conectada') {
        interval = setInterval(() => {
          setDuracao(prev => prev + 1);
        }, 1000);
      }
      return () => clearInterval(interval);
    }, [chamadaAtiva?.status]);

    if (!chamadaAtiva) return null;

    const cliente = state.clientes.find(c => c.id === chamadaAtiva.clienteId);
    if (!cliente) return null;

    const formatarDuracao = (segundos: number) => {
      const mins = Math.floor(segundos / 60);
      const secs = segundos % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-2xl border p-6 w-80 z-50">
        <div className="text-center mb-4">
          <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-xl font-bold ${
            cliente.temperatura === 'quente' ? 'bg-red-500' :
            cliente.temperatura === 'morno' ? 'bg-yellow-500' : 'bg-blue-500'
          }`}>
            {cliente.nome.charAt(0).toUpperCase()}
          </div>
          <h3 className="font-semibold text-gray-900">{cliente.nome}</h3>
          <p className="text-sm text-gray-600">{cliente.telefone}</p>
        </div>

        <div className="text-center mb-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
            chamadaAtiva.status === 'discando' ? 'bg-yellow-100 text-yellow-700' :
            chamadaAtiva.status === 'tocando' ? 'bg-blue-100 text-blue-700' :
            'bg-green-100 text-green-700'
          }`}>
            {chamadaAtiva.status === 'discando' && 'Discando...'}
            {chamadaAtiva.status === 'tocando' && 'Chamando...'}
            {chamadaAtiva.status === 'conectada' && `Conectado - ${formatarDuracao(duracao)}`}
          </div>
        </div>

        {chamadaAtiva.status === 'conectada' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações da chamada
            </label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              rows={3}
              placeholder="Anote os pontos importantes da conversa..."
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => finalizarChamada(duracao, 'neutro', observacoes)}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Encerrar
          </button>
          {chamadaAtiva.status === 'conectada' && (
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <MessageSquare className="w-4 h-4" />
            </button>
          )}
        </div>
  // ==================== COMPONENTE NAVEGAÇÃO ATUALIZADO ====================
  
  function NavegacaoCRM() {
    const { unreadCount } = useNotifications();
    const { comunicacao } = useComunicacao();
    
    const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
      { id: 'kanban', label: 'Kanban Board', icon: Target, badge: dadosCalculados.clientesAtivos },
      { id: 'leads', label: 'Lista de Leads', icon: Users, badge: dadosCalculados.totalClientes },
      { id: 'atividades', label: 'Atividades', icon: Calendar, badge: atividadesPendentes.length },
      { id: 'relatorios', label: 'Relatórios', icon: BarChart3, badge: null }
    ];

    return (
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo e Título */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CRM Comercial</h1>
                <p className="text-sm text-gray-500">Sistema de Gestão de Relacionamento</p>
              </div>
            </div>
          </div>

          {/* Menu de Navegação */}
          <nav className="flex space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = secaoAtiva === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setSecaoAtiva(item.id as any)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  {item.badge !== null && (
                    <span className={`
                      px-2 py-0.5 text-xs rounded-full font-medium
                      ${isActive 
                        ? 'bg-blue-200 text-blue-800' 
                        : 'bg-gray-200 text-gray-700'
                      }
                    `}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Ações Rápidas */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMostrarModalNovoLead(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo Lead
            </button>
            
            <div className="relative">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            </div>
            
            <div className="relative">
              <button className="flex items-center gap-2 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <User className="w-5 h-5" />
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== SISTEMA DE NOTIFICAÇÕES VISUAL ====================

  function NotificacoesPopup() {
    const { notifications, markAsRead, removeNotification, clearAllNotifications } = useNotifications();
    const [mostrarPopup, setMostrarPopup] = useState(false);

    if (!mostrarPopup) return null;

    return (
      <div className="fixed top-20 right-6 w-80 bg-white rounded-lg shadow-xl border z-50 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-gray-900">Notificações</h3>
          <div className="flex gap-2">
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Limpar todas
              </button>
            )}
            <button
              onClick={() => setMostrarPopup(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        notification.type === 'success' ? 'bg-green-500' :
                        notification.type === 'error' ? 'bg-red-500' :
                        notification.type === 'warning' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}></div>
                      <h4 className="font-medium text-gray-900 text-sm">{notification.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {notification.timestamp.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                    className="text-gray-400 hover:text-gray-600 ml-2"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Nenhuma notificação</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==================== COMPONENTE PRINCIPAL RENDERIZADO ====================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navegação */}
      <NavegacaoCRM />
      
      {/* Conteúdo Principal */}
      <main>
        {secaoAtiva === 'dashboard' && <DashboardCRM />}
        {secaoAtiva === 'kanban' && <KanbanCRM />}
        {secaoAtiva === 'leads' && <ListaLeads />}
        {secaoAtiva === 'atividades' && <SistemaAtividades />}
        {secaoAtiva === 'relatorios' && <RelatoriosAnalytics />}
      </main>

      {/* Modais */}
      <ModalDetalhesCliente />
      <ModalNovoLead />
      
      {/* Sistemas de Comunicação */}
      {/* <InterfaceChamada />
      <CentralComunicacao /> */}
      
      {/* Notificações */}
      <NotificacoesPopup />
      
      {/* Toast de Notificações */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.slice(0, 3).map((notification) => (
          <div
            key={notification.id}
            className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 transform transition-all duration-300 ${
              notification.read ? 'opacity-75' : 'opacity-100'
            }`}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {notification.type === 'success' && <CheckCircle className="h-6 w-6 text-green-400" />}
                  {notification.type === 'error' && <X className="h-6 w-6 text-red-400" />}
                  {notification.type === 'warning' && <Clock className="h-6 w-6 text-yellow-400" />}
                  {notification.type === 'info' && <Bell className="h-6 w-6 text-blue-400" />}
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500"
                    onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== COMPONENTE PRINCIPAL COMPLETO ====================

export default function CrmComercialCompleto() {
  return (
    <CRMProvider>
      <CrmComercial />
    </CRMProvider>
  );
}

  // Modal de Envio de Email
  function ModalEnviarEmail() {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [emailData, setEmailData] = useState({
      destinatario: '',
      assunto: '',
      corpo: '',
      template: ''
    });
    const [enviando, setEnviando] = useState(false);
    const { enviarEmail } = useComunicacao();

    const templates = [
      {
        id: 'seguimento',
        nome: 'Follow-up Comercial',
        assunto: 'Acompanhamento - Sua consulta sobre imóveis',
        corpo: `Olá [NOME],

Espero que esteja bem! Estou entrando em contato para dar seguimento à nossa conversa sobre o imóvel de seu interesse.

Gostaria de saber se você tem alguma dúvida adicional ou se podemos agendar uma visita para conhecer melhor as opções disponíveis.

Fico à disposição para qualquer esclarecimento.

Atenciosamente,
[ASSINATURA]`
      },
      {
        id: 'proposta',
        nome: 'Envio de Proposta',
        assunto: 'Proposta Personalizada - [EMPREENDIMENTO]',
        corpo: `Prezado(a) [NOME],

Conforme nossa conversa, segue em anexo a proposta personalizada para o imóvel de seu interesse no [EMPREENDIMENTO].

A proposta inclui:
- Detalhes do imóvel
- Condições de pagamento
- Documentação necessária
- Cronograma de entrega

Estou à disposição para esclarecer qualquer dúvida.

Atenciosamente,
[ASSINATURA]`
      }
    ];

    const aplicarTemplate = (templateId: string) => {
      const template = templates.find(t => t.id === templateId);
      if (template && clienteSelecionado) {
        setEmailData({
          ...emailData,
          assunto: template.assunto.replace('[NOME]', clienteSelecionado.nome),
          corpo: template.corpo
            .replace(/\[NOME\]/g, clienteSelecionado.nome)
            .replace('[EMPREENDIMENTO]', clienteSelecionado.empreendimentoInteresse || 'nosso empreendimento')
            .replace('[ASSINATURA]', `${clienteSelecionado.responsavel}\nCorretor de Imóveis`)
        });
      }
    };

    const handleEnviar = async () => {
      if (!clienteSelecionado) return;
      
      setEnviando(true);
      try {
        await enviarEmail(clienteSelecionado, emailData.assunto, emailData.corpo);
        setMostrarModal(false);
        setEmailData({ destinatario: '', assunto: '', corpo: '', template: '' });
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Erro no Envio',
          message: 'Não foi possível enviar o email'
        });
      } finally {
        setEnviando(false);
      }
    };

    if (!mostrarModal || !clienteSelecionado) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-xl font-bold text-gray-900">Enviar Email</h3>
            <button
              onClick={() => setMostrarModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Para:
              </label>
              <input
                type="email"
                value={clienteSelecionado.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template (opcional)
              </label>
              <select
                value={emailData.template}
                onChange={(e) => {
                  setEmailData({...emailData, template: e.target.value});
                  if (e.target.value) aplicarTemplate(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Selecione um template</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>{template.nome}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assunto *
              </label>
              <input
                type="text"
                value={emailData.assunto}
                onChange={(e) => setEmailData({...emailData, assunto: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Assunto do email..."
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensagem *
              </label>
              <textarea
                value={emailData.corpo}
                onChange={(e) => setEmailData({...emailData, corpo: e.target.value})}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Digite sua mensagem..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setMostrarModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleEnviar}
                disabled={!emailData.assunto || !emailData.corpo || enviando}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {enviando ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Enviar Email
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modal de WhatsApp
  function ModalWhatsApp() {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [templateSelecionado, setTemplateSelecionado] = useState('');
    const [enviando, setEnviando] = useState(false);
    const { enviarWhatsApp } = useComunicacao();

    const templatesWhatsApp = [
      {
        id: 'bom-dia',
        nome: 'Bom dia',
        texto: `Bom dia, [NOME]! 😊

Espero que esteja tudo bem! Estou entrando em contato para dar continuidade ao seu interesse no [EMPREENDIMENTO].

Temos algumas novidades que podem interessar você. Que tal conversarmos?`
      },
      {
        id: 'agendamento',
        nome: 'Agendamento de Visita',
        texto: `Olá, [NOME]! 👋

Gostaria de agendar uma visita ao [EMPREENDIMENTO]? 

Tenho alguns horários disponíveis esta semana:
- Terça-feira: 14h às 17h
- Quinta-feira: 9h às 12h
- Sábado: 8h às 11h

Qual melhor se adequa à sua agenda?`
      },
      {
        id: 'proposta',
        nome: 'Proposta Pronta',
        texto: `[NOME], sua proposta está pronta! 📋✨

Acabei de finalizar uma proposta personalizada com condições especiais para você.

Posso enviar por email ou prefere que conversemos por aqui mesmo?

O que acha? 😊`
      }
    ];

    const aplicarTemplate = (templateId: string) => {
      const template = templatesWhatsApp.find(t => t.id === templateId);
      if (template && clienteSelecionado) {
        setMensagem(
          template.texto
            .replace(/\[NOME\]/g, clienteSelecionado.nome.split(' ')[0])
            .replace('[EMPREENDIMENTO]', clienteSelecionado.empreendimentoInteresse || 'nosso empreendimento')
        );
      }
    };

    const handleEnviar = async () => {
      if (!clienteSelecionado || !mensagem.trim()) return;
      
      setEnviando(true);
      try {
        await enviarWhatsApp(clienteSelecionado, mensagem);
        setMostrarModal(false);
        setMensagem('');
        setTemplateSelecionado('');
      } catch (error) {
        // Error já tratado no hook
      } finally {
        setEnviando(false);
      }
    };

    if (!mostrarModal || !clienteSelecionado) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full">
          <div className="flex items-center justify-between p-6 border-b bg-green-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">WhatsApp</h3>
                <p className="text-sm text-gray-600">{clienteSelecionado.nome}</p>
              </div>
            </div>
            <button
              onClick={() => setMostrarModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Templates Rápidos
              </label>
              <select
                value={templateSelecionado}
                onChange={(e) => {
                  setTemplateSelecionado(e.target.value);
                  if (e.target.value) aplicarTemplate(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Selecione um template</option>
                {templatesWhatsApp.map(template => (
                  <option key={template.id} value={template.id}>{template.nome}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensagem
              </label>
              <div className="relative">
                <textarea
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
                  placeholder="Digite sua mensagem..."
                  maxLength={1000}
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                  {mensagem.length}/1000
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setMostrarModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleEnviar}
                disabled={!mensagem.trim() || enviando}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {enviando ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4" />
                    Enviar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Central de Comunicação
  function CentralComunicacao() {
    const { iniciarChamada, historicoChamadas, statusTelefone } = useComunicacao();
    const [modalEmailAberto, setModalEmailAberto] = useState(false);
    const [modalWhatsAppAberto, setModalWhatsAppAberto] = useState(false);

    if (!clienteSelecionado) return null;

    return (
      <div className="fixed bottom-4 left-4 bg-white rounded-xl shadow-lg border p-4 z-40">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-3 h-3 rounded-full ${
            statusTelefone === 'disponivel' ? 'bg-green-500' :
            statusTelefone === 'ocupado' ? 'bg-red-500' : 'bg-yellow-500'
          }`}></div>
          <span className="text-sm font-medium text-gray-700">
            Central de Comunicação
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => iniciarChamada(clienteSelecionado)}
            disabled={statusTelefone === 'ocupado'}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <Phone className="w-4 h-4" />
            Ligar
          </button>
          
          <button
            onClick={() => setModalEmailAberto(true)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
          
          {clienteSelecionado.whatsapp && (
            <button
              onClick={() => setModalWhatsAppAberto(true)}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp
            </button>
          )}
        </div>

        {modalEmailAberto && <ModalEnviarEmail />}
        {modalWhatsAppAberto && <ModalWhatsApp />}
      </div>
    );
  }    );
  }

  // ==================== MODAIS E FORMULÁRIOS ====================

  // Modal de Detalhes do Cliente
  function ModalDetalhesCliente() {
    if (!clienteSelecionado) return null;

    const cliente = clienteSelecionado;
    const atividadesCliente = mockAtividades
      .filter(a => a.clienteId === cliente.id)
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

    const [abaSelecionada, setAbaSelecionada] = useState<'detalhes' | 'atividades' | 'documentos'>('detalhes');

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header do Modal */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                cliente.temperatura === 'quente' ? 'bg-red-500' :
                cliente.temperatura === 'morno' ? 'bg-yellow-500' : 'bg-blue-500'
              }`}>
                {cliente.nome.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{cliente.nome}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    cliente.status === 'vendido' ? 'bg-green-100 text-green-700' :
                    cliente.status === 'proposta' ? 'bg-purple-100 text-purple-700' :
                    cliente.status === 'negociacao' ? 'bg-orange-100 text-orange-700' :
                    cliente.status === 'interessado' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {cliente.status.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    cliente.prioridade === 'alta' ? 'bg-red-100 text-red-700' :
                    cliente.prioridade === 'media' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {cliente.prioridade.toUpperCase()}
                  </span>
                  {cliente.score && (
                    <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700 font-medium">
                      Score: {cliente.score}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setClienteSelecionado(null)}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Abas */}
          <div className="border-b">
            <div className="flex space-x-8 px-6">
              {[
                { id: 'detalhes', label: 'Detalhes', icon: User },
                { id: 'atividades', label: 'Atividades', icon: Activity },
                { id: 'documentos', label: 'Documentos', icon: FileText }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setAbaSelecionada(id as any)}
                  className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                    abaSelecionada === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  {id === 'atividades' && (
                    <span className="ml-1 px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
                      {atividadesCliente.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Conteúdo das Abas */}
          <div className="p-6">
            {abaSelecionada === 'detalhes' && (
              <div className="space-y-6">
                {/* Informações de Contato */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-blue-600" />
                      Informações de Contato
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Email:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{cliente.email}</span>
                          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                            <Mail className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Telefone:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{cliente.telefone}</span>
                          <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                            <Phone className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {cliente.whatsapp && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">WhatsApp:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{cliente.whatsapp}</span>
                            <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Cidade:</span>
                        <span className="font-medium">{cliente.cidade || 'Não informado'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      Informações Pessoais
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Idade:</span>
                        <span className="font-medium">{cliente.idade || 'Não informado'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Estado Civil:</span>
                        <span className="font-medium capitalize">{cliente.estadoCivil || 'Não informado'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Profissão:</span>
                        <span className="font-medium">{cliente.profissao || 'Não informado'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Renda:</span>
                        <span className="font-medium text-green-600">
                          {cliente.renda ? formatCurrency(cliente.renda) : 'Não informado'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informações do Negócio */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Building className="w-5 h-5 text-orange-600" />
                    Informações do Negócio
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Origem:</span>
                        <span className="font-medium capitalize">{cliente.origem}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Fonte Detalhada:</span>
                        <span className="font-medium text-sm">{cliente.fonteDetalhada || 'Não especificado'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Responsável:</span>
                        <span className="font-medium">{cliente.responsavel}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Data de Criação:</span>
                        <span className="font-medium">{formatDate(cliente.dataCriacao)}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Valor Orçamento:</span>
                        <span className="font-medium text-green-600">
                          {cliente.valorOrcamento ? formatCurrency(cliente.valorOrcamento) : 'Não informado'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Empreendimento:</span>
                        <span className="font-medium text-sm">{cliente.empreendimentoInteresse || 'Não especificado'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Último Contato:</span>
                        <span className="font-medium">{cliente.ultimoContato ? formatDate(cliente.ultimoContato) : 'Nunca'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Próximo Follow-up:</span>
                        <span className={`font-medium ${
                          cliente.proximoFollowUp && new Date(cliente.proximoFollowUp) < new Date() 
                            ? 'text-red-600' : 'text-blue-600'
                        }`}>
                          {cliente.proximoFollowUp ? formatDate(cliente.proximoFollowUp) : 'Não agendado'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Métricas do Lead */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    Métricas do Lead
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{cliente.score || 0}</div>
                      <div className="text-sm text-gray-600">Score</div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600">{cliente.numeroContatos || 0}</div>
                      <div className="text-sm text-gray-600">Contatos</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{cliente.tempoResposta || 0}h</div>
                      <div className="text-sm text-gray-600">Tempo Resp.</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <div className={`text-2xl font-bold ${
                        cliente.temperatura === 'quente' ? 'text-red-600' :
                        cliente.temperatura === 'morno' ? 'text-yellow-600' : 'text-blue-600'
                      }`}>
                        {cliente.temperatura?.toUpperCase() || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">Temperatura</div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {cliente.tags && cliente.tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Tag className="w-5 h-5 text-indigo-600" />
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {cliente.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Observações */}
                {cliente.observacoes && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Edit2 className="w-5 h-5 text-gray-600" />
                      Observações
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">{cliente.observacoes}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {abaSelecionada === 'atividades' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">Histórico de Atividades</h4>
                  <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    Nova Atividade
                  </button>
                </div>
                
                {atividadesCliente.length > 0 ? (
                  <div className="space-y-3">
                    {atividadesCliente.map((atividade) => {
                      const IconeAtividade = getIconeAtividade(atividade.tipo);
                      return (
                        <div key={atividade.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                          <div className={`p-2 rounded-lg ${getCorAtividade(atividade.tipo, atividade.status)}`}>
                            <IconeAtividade className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium capitalize">{atividade.tipo}</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                atividade.status === 'concluido' ? 'bg-green-100 text-green-700' :
                                atividade.status === 'agendado' ? 'bg-blue-100 text-blue-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {atividade.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{atividade.descricao}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>{formatDateTime(atividade.data)}</span>
                              <span>{atividade.responsavel}</span>
                              {atividade.duracao && <span>{atividade.duracao}min</span>}
                            </div>
                            {atividade.observacoes && (
                              <p className="text-sm text-gray-600 mt-2 p-2 bg-white rounded">
                                {atividade.observacoes}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Nenhuma atividade registrada</p>
                  </div>
                )}
              </div>
            )}

            {abaSelecionada === 'documentos' && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Funcionalidade de documentos será implementada</p>
              </div>
            )}
          </div>

          {/* Footer com Ações */}
          <div className="border-t bg-gray-50 px-6 py-4 flex items-center justify-between">
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Phone className="w-4 h-4" />
                Ligar
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Mail className="w-4 h-4" />
                Email
              </button>
              {cliente.whatsapp && (
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => setClienteSelecionado(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modal de Novo Lead
  function ModalNovoLead() {
    const [formData, setFormData] = useState({
      nome: '',
      email: '',
      telefone: '',
      whatsapp: '',
      origem: 'site',
      prioridade: 'media',
      valorOrcamento: '',
      empreendimentoInteresse: '',
      observacoes: '',
      responsavel: 'João Corretor',
      tags: [] as string[],
      cidade: '',
      estadoCivil: 'solteiro',
      profissao: '',
      renda: '',
      idade: ''
    });
    const [erros, setErros] = useState<Record<string, string>>({});
    const [etapaAtual, setEtapaAtual] = useState(1);

    if (!mostrarModalNovoLead) return null;

    const validarFormulario = () => {
      const novosErros: Record<string, string> = {};
      
      if (!formData.nome.trim()) novosErros.nome = 'Nome é obrigatório';
      if (!formData.email.trim()) {
        novosErros.email = 'Email é obrigatório';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        novosErros.email = 'Email inválido';
      }
      if (!formData.telefone.trim()) novosErros.telefone = 'Telefone é obrigatório';
      
      setErros(novosErros);
      return Object.keys(novosErros).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (validarFormulario()) {
        console.log('Criando novo lead:', formData);
        setMostrarModalNovoLead(false);
        setFormData({
          nome: '', email: '', telefone: '', whatsapp: '', origem: 'site',
          prioridade: 'media', valorOrcamento: '', empreendimentoInteresse: '',
          observacoes: '', responsavel: 'João Corretor', tags: [],
          cidade: '', estadoCivil: 'solteiro', profissao: '', renda: '', idade: ''
        });
        setEtapaAtual(1);
      }
    };

    const proximaEtapa = () => {
      if (etapaAtual === 1 && validarFormulario()) {
        setEtapaAtual(2);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Novo Lead</h3>
              <p className="text-sm text-gray-600 mt-1">Cadastre um novo cliente potencial</p>
            </div>
            <button
              onClick={() => {
                setMostrarModalNovoLead(false);
                setEtapaAtual(1);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Indicador de Etapas */}
          <div className="px-6 py-4 border-b">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                etapaAtual >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className={`flex-1 h-1 mx-4 ${etapaAtual >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                etapaAtual >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-600">Informações Básicas</span>
              <span className="text-sm text-gray-600">Detalhes Adicionais</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {etapaAtual === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        erros.nome ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="João Silva Santos"
                    />
                    {erros.nome && <p className="text-red-500 text-xs mt-1">{erros.nome}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        erros.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="joao@email.com"
                    />
                    {erros.email && <p className="text-red-500 text-xs mt-1">{erros.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        erros.telefone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="(48) 99999-9999"
                    />
                    {erros.telefone && <p className="text-red-500 text-xs mt-1">{erros.telefone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="48999999999"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Origem
                    </label>
                    <select
                      value={formData.origem}
                      onChange={(e) => setFormData({...formData, origem: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="site">Site</option>
                      <option value="indicacao">Indicação</option>
                      <option value="telemarketing">Telemarketing</option>
                      <option value="redes-sociais">Redes Sociais</option>
                      <option value="evento">Evento</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prioridade
                    </label>
                    <select
                      value={formData.prioridade}
                      onChange={(e) => setFormData({...formData, prioridade: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Responsável
                  </label>
                  <select
                    value={formData.responsavel}
                    onChange={(e) => setFormData({...formData, responsavel: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="João Corretor">João Corretor</option>
                    <option value="Ana Corretora">Ana Corretora</option>
                    <option value="Maria Corretora">Maria Corretora</option>
                  </select>
                </div>
              </div>
            )}

            {etapaAtual === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor Orçamento
                    </label>
                    <input
                      type="number"
                      value={formData.valorOrcamento}
                      onChange={(e) => setFormData({...formData, valorOrcamento: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="450000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={formData.cidade}
                      onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Florianópolis"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Empreendimento de Interesse
                  </label>
                  <select
                    value={formData.empreendimentoInteresse}
                    onChange={(e) => setFormData({...formData, empreendimentoInteresse: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione um empreendimento</option>
                    {mockEmpreendimentos.map(emp => (
                      <option key={emp.id} value={emp.nome}>{emp.nome}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado Civil
                    </label>
                    <select
                      value={formData.estadoCivil}
                      onChange={(e) => setFormData({...formData, estadoCivil: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="solteiro">Solteiro</option>
                      <option value="casado">Casado</option>
                      <option value="divorciado">Divorciado</option>
                      <option value="viuvo">Viúvo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Idade
                    </label>
                    <input
                      type="number"
                      value={formData.idade}
                      onChange={(e) => setFormData({...formData, idade: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="35"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Renda Mensal
                    </label>
                    <input
                      type="number"
                      value={formData.renda}
                      onChange={(e) => setFormData({...formData, renda: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="8500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profissão
                  </label>
                  <input
                    type="text"
                    value={formData.profissao}
                    onChange={(e) => setFormData({...formData, profissao: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Engenheiro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações
                  </label>
                  <textarea
                    value={formData.observacoes}
                    onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Informações adicionais sobre o cliente..."
                  />
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-6 border-t mt-6">
              <div className="flex gap-3">
                {etapaAtual === 2 && (
                  <button
                    type="button"
                    onClick={() => setEtapaAtual(1)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Voltar
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMostrarModalNovoLead(false);
                    setEtapaAtual(1);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
              <div className="flex gap-3">
                {etapaAtual === 1 ? (
                  <button
                    type="button"
                    onClick={proximaEtapa}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Próximo
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Criar Lead
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ==================== COMPONENTE PRINCIPAL DE RENDERIZAÇÃO ====================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navegação */}
      <NavegacaoCRM />
      
      {/* Conteúdo Principal */}
      <main>
        {secaoAtiva === 'dashboard' && <DashboardCRM />}
        {secaoAtiva === 'kanban' && <KanbanCRM />}
        {secaoAtiva === 'leads' && <ListaLeads />}
        {secaoAtiva === 'atividades' && <SistemaAtividades />}
      </main>

      {/* Modais */}
      <ModalDetalhesCliente />
      <ModalNovoLead />
    </div>
  );
}

export default CrmComercial;
                          );
  }

  // ==================== COMPONENTE SISTEMA DE ATIVIDADES ====================
  
  function SistemaAtividades() {
    const [filtroAtividades, setFiltroAtividades] = useState({
      tipo: '',
      status: '',
      responsavel: '',
      cliente: '',
      dataInicio: '',
      dataFim: ''
    });
    const [visualizacaoAtividades, setVisualizacaoAtividades] = useState<'lista' | 'timeline' | 'calendario'>('timeline');
    const [novaAtividade, setNovaAtividade] = useState<Partial<Atividade>>({});
    const [mostrarModalAtividade, setMostrarModalAtividade] = useState(false);
    const [atividadeEditando, setAtividadeEditando] = useState<Atividade | null>(null);

    // Função para filtrar atividades
    const getAtividadesFiltradas = () => {
      return mockAtividades.filter(atividade => {
        const matchTipo = !filtroAtividades.tipo || atividade.tipo === filtroAtividades.tipo;
        const matchStatus = !filtroAtividades.status || atividade.status === filtroAtividades.status;
        const matchResponsavel = !filtroAtividades.responsavel || atividade.responsavel === filtroAtividades.responsavel;
        const matchCliente = !filtroAtividades.cliente || {
          const cliente = mockClientes.find(c => c.id === atividade.clienteId);
          return cliente?.nome.toLowerCase().includes(filtroAtividades.cliente.toLowerCase());
        };
        
        if (filtroAtividades.dataInicio) {
          const dataAtividade = new Date(atividade.data);
          const dataInicio = new Date(filtroAtividades.dataInicio);
          if (dataAtividade < dataInicio) return false;
        }
        
        if (filtroAtividades.dataFim) {
          const dataAtividade = new Date(atividade.data);
          const dataFim = new Date(filtroAtividades.dataFim);
          if (dataAtividade > dataFim) return false;
        }
        
        return matchTipo && matchStatus && matchResponsavel && matchCliente;
      }).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    };

    // Função para obter ícone da atividade
    const getIconeAtividade = (tipo: string) => {
      const icones = {
        ligacao: Phone,
        email: Mail,
        whatsapp: MessageSquare,
        reuniao: Calendar,
        visita: Eye,
        proposta: DollarSign,
        'follow-up': Clock,
        nota: Edit2
      };
      return icones[tipo as keyof typeof icones] || Clock;
    };

    // Função para obter cor da atividade
    const getCorAtividade = (tipo: string, status: string) => {
      if (status === 'cancelado') return 'text-red-500 bg-red-50';
      if (status === 'concluido') return 'text-green-500 bg-green-50';
      
      const cores = {
        ligacao: 'text-green-600 bg-green-50',
        email: 'text-blue-600 bg-blue-50',
        whatsapp: 'text-green-600 bg-green-50',
        reuniao: 'text-purple-600 bg-purple-50',
        visita: 'text-orange-600 bg-orange-50',
        proposta: 'text-yellow-600 bg-yellow-50',
        'follow-up': 'text-gray-600 bg-gray-50',
        nota: 'text-indigo-600 bg-indigo-50'
      };
      return cores[tipo as keyof typeof cores] || 'text-gray-600 bg-gray-50';
    };

    // Função para criar nova atividade
    const criarAtividade = () => {
      console.log('Criando atividade:', novaAtividade);
      setMostrarModalAtividade(false);
      setNovaAtividade({});
    };

    // Atividades filtradas
    const atividadesFiltradas = getAtividadesFiltradas();
    const atividadesHoje = atividadesFiltradas.filter(a => {
      const hoje = new Date();
      const dataAtividade = new Date(a.data);
      return dataAtividade.toDateString() === hoje.toDateString();
    });
    const atividadesPendentes = atividadesFiltradas.filter(a => a.status === 'agendado');
    const atividadesVencidas = atividadesFiltradas.filter(a => {
      return a.status === 'agendado' && new Date(a.data) < new Date();
    });

    // Componente Card de Atividade
    function CardAtividade({ atividade }: { atividade: Atividade }) {
      const cliente = mockClientes.find(c => c.id === atividade.clienteId);
      const IconeAtividade = getIconeAtividade(atividade.tipo);
      const corAtividade = getCorAtividade(atividade.tipo, atividade.status);
      const isVencida = atividade.status === 'agendado' && new Date(atividade.data) < new Date();
      const isHoje = new Date(atividade.data).toDateString() === new Date().toDateString();

      return (
        <div className={`
          bg-white rounded-lg p-4 border cursor-pointer transition-all hover:shadow-md
          ${isVencida ? 'border-l-4 border-l-red-500 bg-red-50' : ''}
          ${isHoje && atividade.status === 'agendado' ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''}
        `}>
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${corAtividade}`}>
              <IconeAtividade className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-gray-900 capitalize">{atividade.tipo}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  atividade.status === 'concluido' ? 'bg-green-100 text-green-700' :
                  atividade.status === 'agendado' ? 'bg-blue-100 text-blue-700' :
                  atividade.status === 'cancelado' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {atividade.status}
                </span>
                {atividade.prioridade && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    atividade.prioridade === 'alta' ? 'bg-red-100 text-red-700' :
                    atividade.prioridade === 'media' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {atividade.prioridade}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-700 mb-2">{atividade.descricao}</p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {cliente?.nome || 'Cliente não encontrado'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDateTime(atividade.data)}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {atividade.responsavel}
                </span>
                {atividade.duracao && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {atividade.duracao}min
                  </span>
                )}
              </div>

              {atividade.observacoes && (
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded mt-2">
                  {atividade.observacoes}
                </p>
              )}

              {atividade.resultado && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500">Resultado:</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    atividade.resultado === 'positivo' ? 'bg-green-100 text-green-700' :
                    atividade.resultado === 'negativo' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {atividade.resultado}
                  </span>
                </div>
              )}

              {atividade.proximaAcao && (
                <div className="mt-2 p-2 bg-blue-50 rounded">
                  <p className="text-xs text-blue-600 font-medium">Próxima ação:</p>
                  <p className="text-sm text-blue-700">{atividade.proximaAcao}</p>
                  {atividade.dataProximaAcao && (
                    <p className="text-xs text-blue-500 mt-1">
                      Data: {formatDate(atividade.dataProximaAcao)}
                    </p>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAtividadeEditando(atividade);
                }}
                className="p-1 text-gray-400 hover:text-blue-600"
                title="Editar"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              {atividade.status === 'agendado' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Marcar como concluída:', atividade.id);
                  }}
                  className="p-1 text-gray-400 hover:text-green-600"
                  title="Marcar como concluída"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Componente Timeline
    function TimelineAtividades() {
      const atividadesPorData = atividadesFiltradas.reduce((acc, atividade) => {
        const data = formatDate(atividade.data);
        if (!acc[data]) acc[data] = [];
        acc[data].push(atividade);
        return acc;
      }, {} as Record<string, Atividade[]>);

      return (
        <div className="space-y-6">
          {Object.entries(atividadesPorData).map(([data, atividades]) => (
            <div key={data} className="relative">
              <div className="sticky top-0 bg-gray-50 border rounded-lg p-3 mb-4 z-10">
                <h3 className="font-semibold text-gray-900">{data}</h3>
                <p className="text-sm text-gray-600">{atividades.length} atividade(s)</p>
              </div>
              
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                <div className="space-y-4">
                  {atividades.map((atividade, index) => (
                    <div key={atividade.id} className="relative flex items-start gap-4">
                      <div className={`
                        w-3 h-3 rounded-full border-2 bg-white z-10
                        ${atividade.status === 'concluido' ? 'border-green-500' :
                          atividade.status === 'cancelado' ? 'border-red-500' :
                          'border-blue-500'}
                      `}></div>
                      <div className="flex-1 pb-4">
                        <CardAtividade atividade={atividade} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Componente Calendário Simples
    function CalendarioAtividades() {
      const hoje = new Date();
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
      const diasMes = [];
      
      for (let d = new Date(inicioMes); d <= fimMes; d.setDate(d.getDate() + 1)) {
        diasMes.push(new Date(d));
      }

      const atividadesPorDia = atividadesFiltradas.reduce((acc, atividade) => {
        const dia = new Date(atividade.data).getDate();
        if (!acc[dia]) acc[dia] = [];
        acc[dia].push(atividade);
        return acc;
      }, {} as Record<number, Atividade[]>);

      return (
        <div className="bg-white rounded-lg border p-6">
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (
              <div key={dia} className="p-2 text-center text-sm font-medium text-gray-500">
                {dia}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {diasMes.map(dia => {
              const atividades = atividadesPorDia[dia.getDate()] || [];
              const isHoje = dia.toDateString() === hoje.toDateString();
              
              return (
                <div
                  key={dia.toISOString()}
                  className={`
                    min-h-[80px] p-1 border rounded cursor-pointer hover:bg-gray-50
                    ${isHoje ? 'bg-blue-50 border-blue-300' : 'border-gray-200'}
                  `}
                >
                  <div className={`text-sm mb-1 ${isHoje ? 'font-bold text-blue-600' : 'text-gray-700'}`}>
                    {dia.getDate()}
                  </div>
                  <div className="space-y-1">
                    {atividades.slice(0, 2).map(atividade => (
                      <div
                        key={atividade.id}
                        className={`text-xs p-1 rounded truncate ${
                          atividade.status === 'concluido' ? 'bg-green-100 text-green-700' :
                          atividade.status === 'cancelado' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}
                        title={atividade.descricao}
                      >
                        {atividade.tipo}
                      </div>
                    ))}
                    {atividades.length > 2 && (
                      <div className="text-xs text-gray-500">+{atividades.length - 2}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Atividades</h2>
            <p className="text-gray-600 mt-1">Gerencie todas as interações com clientes</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex rounded-lg border border-gray-200 p-1">
              {[
                { id: 'timeline', label: 'Timeline', icon: Clock },
                { id: 'lista', label: 'Lista', icon: List },
                { id: 'calendario', label: 'Calendário', icon: Calendar }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setVisualizacaoAtividades(id as any)}
                  className={`flex items-center gap-1 px-3 py-1 text-sm rounded-md transition-colors ${
                    visualizacaoAtividades === id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setMostrarModalAtividade(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nova Atividade
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Atividades Hoje</p>
                <p className="text-2xl font-bold text-blue-600">{atividadesHoje.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{atividadesPendentes.length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vencidas</p>
                <p className="text-2xl font-bold text-red-600">{atividadesVencidas.length}</p>
              </div>
              <X className="w-8 h-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{atividadesFiltradas.length}</p>
              </div>
              <Activity className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <select
              value={filtroAtividades.tipo}
              onChange={(e) => setFiltroAtividades({...filtroAtividades, tipo: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos os tipos</option>
              <option value="ligacao">Ligação</option>
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="reuniao">Reunião</option>
              <option value="visita">Visita</option>
              <option value="proposta">Proposta</option>
              <option value="follow-up">Follow-up</option>
              <option value="nota">Nota</option>
            </select>

            <select
              value={filtroAtividades.status}
              onChange={(e) => setFiltroAtividades({...filtroAtividades, status: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos os status</option>
              <option value="agendado">Agendado</option>
              <option value="concluido">Concluído</option>
              <option value="cancelado">Cancelado</option>
              <option value="em-andamento">Em Andamento</option>
            </select>

            <select
              value={filtroAtividades.responsavel}
              onChange={(e) => setFiltroAtividades({...filtroAtividades, responsavel: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos os responsáveis</option>
              <option value="João Corretor">João Corretor</option>
              <option value="Ana Corretora">Ana Corretora</option>
              <option value="Maria Corretora">Maria Corretora</option>
            </select>

            <input
              type="text"
              placeholder="Nome do cliente..."
              value={filtroAtividades.cliente}
              onChange={(e) => setFiltroAtividades({...filtroAtividades, cliente: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <input
              type="date"
              value={filtroAtividades.dataInicio}
              onChange={(e) => setFiltroAtividades({...filtroAtividades, dataInicio: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <input
              type="date"
              value={filtroAtividades.dataFim}
              onChange={(e) => setFiltroAtividades({...filtroAtividades, dataFim: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Conteúdo Principal */}
        {visualizacaoAtividades === 'timeline' && <TimelineAtividades />}
        {visualizacaoAtividades === 'calendario' && <CalendarioAtividades />}
        {visualizacaoAtividades === 'lista' && (
          <div className="space-y-4">
            {atividadesFiltradas.map(atividade => (
              <CardAtividade key={atividade.id} atividade={atividade} />
            ))}
          </div>
        )}

        {/* Estado vazio */}
        {atividadesFiltradas.length === 0 && (
          <div className="bg-white rounded-lg border p-12 text-center">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma atividade encontrada</h3>
            <p className="text-gray-600 mb-6">
              Tente ajustar os filtros ou cadastre uma nova atividade
            </p>
            <button
              onClick={() => setMostrarModalAtividade(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Nova Atividade
            </button>
          </div>
        )}
      </div>
    );
  }

  // ==================== COMPONENTE LISTA DE LEADS ====================
  
  function ListaLeads() {
    const [leadsSelecionados, setLeadsSelecionados] = useState<string[]>([]);
    const [ordenacao, setOrdenacao] = useState<{campo: string, direcao: 'asc' | 'desc'}>({
      campo: 'dataCriacao',
      direcao: 'desc'
    });
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(25);
    const [visualizacao, setVisualizacao] = useState<'tabela' | 'cards'>('tabela');
    const [mostrarBulkActions, setMostrarBulkActions] = useState(false);

    // Função para ordenar leads
    const getLeadsOrdenados = () => {
      const leads = [...clientesFiltrados];
      
      return leads.sort((a, b) => {
        let valorA: any = a[ordenacao.campo as keyof Cliente];
        let valorB: any = b[ordenacao.campo as keyof Cliente];
        
        // Tratamento especial para diferentes tipos de dados
        if (ordenacao.campo === 'valorOrcamento') {
          valorA = valorA || 0;
          valorB = valorB || 0;
        } else if (ordenacao.campo === 'score') {
          valorA = valorA || 0;
          valorB = valorB || 0;
        } else if (typeof valorA === 'string') {
          valorA = valorA.toLowerCase();
          valorB = valorB.toLowerCase();
        }
        
        if (valorA < valorB) return ordenacao.direcao === 'asc' ? -1 : 1;
        if (valorA > valorB) return ordenacao.direcao === 'asc' ? 1 : -1;
        return 0;
      });
    };

    // Função para paginar
    const getLeadsPaginados = () => {
      const leadsOrdenados = getLeadsOrdenados();
      const inicio = (paginaAtual - 1) * itensPorPagina;
      const fim = inicio + itensPorPagina;
      return leadsOrdenados.slice(inicio, fim);
    };

    // Função para selecionar/deselecionar leads
    const toggleLeadSelecionado = (leadId: string) => {
      setLeadsSelecionados(prev => 
        prev.includes(leadId) 
          ? prev.filter(id => id !== leadId)
          : [...prev, leadId]
      );
    };

    const selecionarTodos = () => {
      const todosIds = getLeadsPaginados().map(lead => lead.id);
      setLeadsSelecionados(prev => 
        prev.length === todosIds.length ? [] : todosIds
      );
    };

    // Funções de bulk actions
    const executarBulkAction = (acao: string) => {
      console.log(`Executando ${acao} para leads:`, leadsSelecionados);
      // Aqui implementaria as ações em lote
      setLeadsSelecionados([]);
      setMostrarBulkActions(false);
    };

    // Dados calculados
    const leadsOrdenados = getLeadsOrdenados();
    const leadsPaginados = getLeadsPaginados();
    const totalPaginas = Math.ceil(leadsOrdenados.length / itensPorPagina);

    // Componente Header da Tabela
    function HeaderTabela({ campo, label }: { campo: string, label: string }) {
      const isAtivo = ordenacao.campo === campo;
      
      return (
        <th 
          className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-50 select-none"
          onClick={() => setOrdenacao({
            campo,
            direcao: isAtivo && ordenacao.direcao === 'asc' ? 'desc' : 'asc'
          })}
        >
          <div className="flex items-center gap-2">
            {label}
            {isAtivo && (
              <ChevronDown className={`w-4 h-4 transition-transform ${
                ordenacao.direcao === 'asc' ? 'rotate-180' : ''
              }`} />
            )}
          </div>
        </th>
      );
    }

    // Componente Card do Lead (visualização em cards)
    function CardLead({ lead }: { lead: Cliente }) {
      const isUrgente = lead.proximoFollowUp && new Date(lead.proximoFollowUp) < new Date();
      
      return (
        <div className={`
          bg-white rounded-lg p-4 border cursor-pointer transition-all hover:shadow-md
          ${leadsSelecionados.includes(lead.id) ? 'ring-2 ring-blue-500 border-blue-300' : ''}
          ${isUrgente ? 'border-l-4 border-l-red-500' : ''}
        `}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={leadsSelecionados.includes(lead.id)}
                onChange={() => toggleLeadSelecionado(lead.id)}
                className="mt-1"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{lead.nome}</h3>
                  <div className={`w-2 h-2 rounded-full ${
                    lead.prioridade === 'alta' ? 'bg-red-500' :
                    lead.prioridade === 'media' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                <p className="text-sm text-gray-600">{lead.email}</p>
                <p className="text-sm text-gray-500">{lead.telefone}</p>
              </div>
            </div>
            <div className="text-right">
              {lead.valorOrcamento && (
                <p className="font-semibold text-green-600">{formatCurrency(lead.valorOrcamento)}</p>
              )}
              <p className="text-sm text-gray-500">{lead.responsavel}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                lead.status === 'vendido' ? 'bg-green-100 text-green-700' :
                lead.status === 'proposta' ? 'bg-purple-100 text-purple-700' :
                lead.status === 'negociacao' ? 'bg-orange-100 text-orange-700' :
                lead.status === 'interessado' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {lead.status}
              </span>
              <span className="text-xs text-gray-500 capitalize">{lead.origem}</span>
            </div>
            <div className="flex gap-1">
              <button className="p-1 text-gray-400 hover:text-green-600">
                <Phone className="w-4 h-4" />
              </button>
              <button className="p-1 text-gray-400 hover:text-blue-600">
                <Mail className="w-4 h-4" />
              </button>
              <button className="p-1 text-gray-400 hover:text-blue-600">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Lista de Leads</h2>
            <p className="text-gray-600 mt-1">Gerencie todos os leads em uma visão detalhada</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setVisualizacao('tabela')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  visualizacao === 'tabela'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setVisualizacao('cards')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  visualizacao === 'cards'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Target className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => setMostrarFiltrosAvancados(!mostrarFiltrosAvancados)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Exportar
            </button>
            <button
              onClick={() => setMostrarModalNovoLead(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo Lead
            </button>
          </div>
        </div>

        {/* Filtros Avançados */}
        {mostrarFiltrosAvancados && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros Avançados</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Nome, email ou telefone..."
                    value={filtrosCRM.busca}
                    onChange={(e) => setFiltrosCRM({...filtrosCRM, busca: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filtrosCRM.status}
                  onChange={(e) => setFiltrosCRM({...filtrosCRM, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos os status</option>
                  <option value="lead">Lead</option>
                  <option value="contato">Primeiro Contato</option>
                  <option value="interessado">Interessado</option>
                  <option value="negociacao">Negociação</option>
                  <option value="proposta">Proposta</option>
                  <option value="vendido">Vendido</option>
                  <option value="perdido">Perdido</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Origem</label>
                <select
                  value={filtrosCRM.origem}
                  onChange={(e) => setFiltrosCRM({...filtrosCRM, origem: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas as origens</option>
                  <option value="site">Site</option>
                  <option value="indicacao">Indicação</option>
                  <option value="telemarketing">Telemarketing</option>
                  <option value="redes-sociais">Redes Sociais</option>
                  <option value="evento">Evento</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Responsável</label>
                <select
                  value={filtrosCRM.responsavel}
                  onChange={(e) => setFiltrosCRM({...filtrosCRM, responsavel: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos os corretores</option>
                  <option value="João Corretor">João Corretor</option>
                  <option value="Ana Corretora">Ana Corretora</option>
                  <option value="Maria Corretora">Maria Corretora</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                <select
                  value={filtrosCRM.prioridade}
                  onChange={(e) => setFiltrosCRM({...filtrosCRM, prioridade: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas as prioridades</option>
                  <option value="alta">Alta</option>
                  <option value="media">Média</option>
                  <option value="baixa">Baixa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Temperatura</label>
                <select
                  value={filtrosCRM.temperatura}
                  onChange={(e) => setFiltrosCRM({...filtrosCRM, temperatura: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas as temperaturas</option>
                  <option value="quente">Quente</option>
                  <option value="morno">Morno</option>
                  <option value="frio">Frio</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valor Mínimo</label>
                <input
                  type="number"
                  placeholder="R$ 0"
                  value={filtrosCRM.valorMinimo}
                  onChange={(e) => setFiltrosCRM({...filtrosCRM, valorMinimo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valor Máximo</label>
                <input
                  type="number"
                  placeholder="R$ 1.000.000"
                  value={filtrosCRM.valorMaximo}
                  onChange={(e) => setFiltrosCRM({...filtrosCRM, valorMaximo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-gray-600">
                Mostrando {leadsPaginados.length} de {clientesFiltrados.length} leads
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFiltrosCRM({
                    busca: '', status: '', origem: '', responsavel: '', prioridade: '',
                    temperatura: '', dataInicio: '', dataFim: '', valorMinimo: '', valorMaximo: '',
                    empreendimento: '', cidade: '', tags: []
                  })}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Limpar Filtros
                </button>
                <button
                  onClick={() => setMostrarFiltrosAvancados(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {leadsSelecionados.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-blue-900">
                  {leadsSelecionados.length} lead(s) selecionado(s)
                </span>
                <button
                  onClick={() => setLeadsSelecionados([])}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Limpar seleção
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => executarBulkAction('alterar-status')}
                  className="px-3 py-1 bg-white border border-blue-300 text-blue-700 rounded text-sm hover:bg-blue-50"
                >
                  Alterar Status
                </button>
                <button
                  onClick={() => executarBulkAction('alterar-responsavel')}
                  className="px-3 py-1 bg-white border border-blue-300 text-blue-700 rounded text-sm hover:bg-blue-50"
                >
                  Alterar Responsável
                </button>
                <button
                  onClick={() => executarBulkAction('enviar-email')}
                  className="px-3 py-1 bg-white border border-blue-300 text-blue-700 rounded text-sm hover:bg-blue-50"
                >
                  Enviar Email
                </button>
                <button
                  onClick={() => executarBulkAction('exportar')}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Exportar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo Principal */}
        {visualizacao === 'tabela' ? (
          /* Visualização em Tabela */
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={leadsPaginados.length > 0 && leadsSelecionados.length === leadsPaginados.length}
                        onChange={selecionarTodos}
                        className="rounded"
                      />
                    </th>
                    <HeaderTabela campo="nome" label="Cliente" />
                    <HeaderTabela campo="status" label="Status" />
                    <HeaderTabela campo="origem" label="Origem" />
                    <HeaderTabela campo="prioridade" label="Prioridade" />
                    <HeaderTabela campo="valorOrcamento" label="Valor" />
                    <HeaderTabela campo="responsavel" label="Responsável" />
                    <HeaderTabela campo="ultimoContato" label="Último Contato" />
                    <HeaderTabela campo="score" label="Score" />
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {leadsPaginados.map((lead) => {
                    const isUrgente = lead.proximoFollowUp && new Date(lead.proximoFollowUp) < new Date();
                    
                    return (
                      <tr 
                        key={lead.id} 
                        className={`
                          border-b hover:bg-gray-50 cursor-pointer transition-colors
                          ${leadsSelecionados.includes(lead.id) ? 'bg-blue-50' : ''}
                          ${isUrgente ? 'border-l-4 border-l-red-500' : ''}
                        `}
                        onClick={() => setClienteSelecionado(lead)}
                      >
                        <td className="py-4 px-4">
                          <input
                            type="checkbox"
                            checked={leadsSelecionados.includes(lead.id)}
                            onChange={() => toggleLeadSelecionado(lead.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              lead.temperatura === 'quente' ? 'bg-red-500' :
                              lead.temperatura === 'morno' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}></div>
                            <div>
                              <div className="font-medium text-gray-900">{lead.nome}</div>
                              <div className="text-sm text-gray-600">{lead.email}</div>
                              <div className="text-sm text-gray-500">{lead.telefone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            lead.status === 'vendido' ? 'bg-green-100 text-green-700' :
                            lead.status === 'proposta' ? 'bg-purple-100 text-purple-700' :
                            lead.status === 'negociacao' ? 'bg-orange-100 text-orange-700' :
                            lead.status === 'interessado' ? 'bg-blue-100 text-blue-700' :
                            lead.status === 'contato' ? 'bg-yellow-100 text-yellow-700' :
                            lead.status === 'perdido' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="capitalize text-sm text-gray-600">{lead.origem}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            lead.prioridade === 'alta' ? 'bg-red-100 text-red-700' :
                            lead.prioridade === 'media' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {lead.prioridade}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {lead.valorOrcamento ? (
                            <span className="font-medium text-green-600">
                              {formatCurrency(lead.valorOrcamento)}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-600">{lead.responsavel}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-600">
                            {lead.ultimoContato ? formatDate(lead.ultimoContato) : 'Nunca'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {lead.score && (
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                lead.score >= 80 ? 'bg-green-500' :
                                lead.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}></div>
                              <span className="text-sm font-medium">{lead.score}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('Ligar para', lead.telefone);
                              }}
                              className="p-1 text-gray-400 hover:text-green-600"
                              title="Ligar"
                            >
                              <Phone className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('Email para', lead.email);
                              }}
                              className="p-1 text-gray-400 hover:text-blue-600"
                              title="Email"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                            {lead.whatsapp && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log('WhatsApp para', lead.whatsapp);
                                }}
                                className="p-1 text-gray-400 hover:text-green-600"
                                title="WhatsApp"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setClienteSelecionado(lead);
                              }}
                              className="p-1 text-gray-400 hover:text-blue-600"
                              title="Ver detalhes"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Visualização em Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leadsPaginados.map((lead) => (
              <CardLead key={lead.id} lead={lead} />
            ))}
          </div>
        )}

        {/* Paginação */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Mostrar</span>
              <select
                value={itensPorPagina}
                onChange={(e) => {
                  setItensPorPagina(Number(e.target.value));
                  setPaginaAtual(1);
                }}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-600">por página</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
                disabled={paginaAtual === 1}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                  let pageNum;
                  if (totalPaginas <= 5) {
                    pageNum = i + 1;
                  } else if (paginaAtual <= 3) {
                    pageNum = i + 1;
                  } else if (paginaAtual >= totalPaginas - 2) {
                    pageNum = totalPaginas - 4 + i;
                  } else {
                    pageNum = paginaAtual - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPaginaAtual(pageNum)}
                      className={`px-3 py-2 text-sm rounded-lg ${
                        paginaAtual === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPaginaAtual(Math.min(totalPaginas, paginaAtual + 1))}
                disabled={paginaAtual === totalPaginas}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo
              </button>
            </div>

            <div className="text-sm text-gray-600">
              Página {paginaAtual} de {totalPaginas} ({clientesFiltrados.length} total)
            </div>
          </div>
        )}

        {/* Estado vazio */}
        {clientesFiltrados.length === 0 && (
          <div className="bg-white rounded-lg border p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum lead encontrado</h3>
            <p className="text-gray-600 mb-6">
              Tente ajustar os filtros ou cadastre um novo lead para começar
            </p>
            <button
              onClick={() => setMostrarModalNovoLead(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Cadastrar Primeiro Lead
            </button>
          </div>
        )}
      </div>
    );
  }import React, { useState, useEffect, useCallback, useMemo, useReducer, useContext, createContext } from 'react';
import {
  Users, TrendingUp, Target, Phone, Mail, MessageSquare,
  Calendar, DollarSign, BarChart3, Plus, Eye, Edit2, X,
  Search, Filter, Download, Building, Clock, CheckCircle,
  Home, Kanban, List, Activity, Settings, Bell, User,
  ChevronDown, ChevronRight, Star, Tag, FileText
} from 'lucide-react';

// ==================== INTERFACES E TIPOS ====================

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  whatsapp?: string;
  origem: 'site' | 'indicacao' | 'telemarketing' | 'redes-sociais' | 'evento' | 'outros';
  status: 'lead' | 'contato' | 'interessado' | 'negociacao' | 'proposta' | 'vendido' | 'perdido';
  prioridade: 'baixa' | 'media' | 'alta';
  valorOrcamento?: number;
  observacoes?: string;
  responsavel: string;
  dataCriacao: string;
  ultimoContato?: string;
  proximoFollowUp?: string;
  empreendimentoInteresse?: string;
  tipoImovelInteresse?: string[];
  tags?: string[];
  score?: number;
  temperatura: 'frio' | 'morno' | 'quente';
  tempoResposta?: number;
  numeroContatos?: number;
  fonteDetalhada?: string;
  cidade?: string;
  estadoCivil?: 'solteiro' | 'casado' | 'divorciado' | 'viuvo';
  profissao?: string;
  renda?: number;
  idade?: number;
}

interface Atividade {
  id: string;
  clienteId: string;
  tipo: 'ligacao' | 'email' | 'whatsapp' | 'reuniao' | 'visita' | 'proposta' | 'follow-up' | 'nota';
  descricao: string;
  data: string;
  responsavel: string;
  status: 'agendado' | 'concluido' | 'cancelado' | 'em-andamento';
  observacoes?: string;
  duracao?: number;
  resultado?: 'positivo' | 'neutro' | 'negativo';
  proximaAcao?: string;
  dataProximaAcao?: string;
  anexos?: string[];
  prioridade?: 'baixa' | 'media' | 'alta';
}

interface MetricaVendas {
  periodo: string;
  leadsGerados: number;
  leadsConvertidos: number;
  taxaConversao: number;
  valorVendas: number;
  ticketMedio: number;
  tempoMedioVenda: number;
  custoAquisicao: number;
  valorPipeline: number;
  metaMensal: number;
  crescimentoMensal: number;
}

interface Empreendimento {
  id: string;
  nome: string;
  status: 'lancamento' | 'construcao' | 'pronto' | 'vendido';
  cidade: string;
  bairro: string;
  tipoImovel: 'apartamento' | 'casa' | 'comercial' | 'terreno';
  valorMinimo: number;
  valorMaximo: number;
  unidadesTotal: number;
  unidadesVendidas: number;
  dataLancamento: string;
  dataPrevEntrega?: string;
}

interface FiltrosCRM {
  busca: string;
  status: string;
  origem: string;
  responsavel: string;
  prioridade: string;
  temperatura: string;
  dataInicio: string;
  dataFim: string;
  valorMinimo: string;
  valorMaximo: string;
  empreendimento: string;
  cidade: string;
  tags: string[];
}

interface CRMState {
  clientes: Cliente[];
  atividades: Atividade[];
  metricas: MetricaVendas;
  empreendimentos: Empreendimento[];
  filtros: FiltrosCRM;
  loading: boolean;
  error: string | null;
}

// ==================== CONTEXT E REDUCER ====================

type CRMAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CLIENTES'; payload: Cliente[] }
  | { type: 'ADD_CLIENTE'; payload: Cliente }
  | { type: 'UPDATE_CLIENTE'; payload: Cliente }
  | { type: 'DELETE_CLIENTE'; payload: string }
  | { type: 'SET_ATIVIDADES'; payload: Atividade[] }
  | { type: 'ADD_ATIVIDADE'; payload: Atividade }
  | { type: 'UPDATE_ATIVIDADE'; payload: Atividade }
  | { type: 'SET_FILTROS'; payload: Partial<FiltrosCRM> }
  | { type: 'CLEAR_FILTROS' }
  | { type: 'SET_METRICAS'; payload: MetricaVendas };

const crmReducer = (state: CRMState, action: CRMAction): CRMState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CLIENTES':
      return { ...state, clientes: action.payload };
    case 'ADD_CLIENTE':
      return { ...state, clientes: [...state.clientes, action.payload] };
    case 'UPDATE_CLIENTE':
      return {
        ...state,
        clientes: state.clientes.map(c => 
          c.id === action.payload.id ? action.payload : c
        )
      };
    case 'DELETE_CLIENTE':
      return {
        ...state,
        clientes: state.clientes.filter(c => c.id !== action.payload)
      };
    case 'SET_ATIVIDADES':
      return { ...state, atividades: action.payload };
    case 'ADD_ATIVIDADE':
      return { ...state, atividades: [...state.atividades, action.payload] };
    case 'UPDATE_ATIVIDADE':
      return {
        ...state,
        atividades: state.atividades.map(a => 
          a.id === action.payload.id ? action.payload : a
        )
      };
    case 'SET_FILTROS':
      return { ...state, filtros: { ...state.filtros, ...action.payload } };
    case 'CLEAR_FILTROS':
      return {
        ...state,
        filtros: {
          busca: '', status: '', origem: '', responsavel: '', prioridade: '',
          temperatura: '', dataInicio: '', dataFim: '', valorMinimo: '', valorMaximo: '',
          empreendimento: '', cidade: '', tags: []
        }
      };
    case 'SET_METRICAS':
      return { ...state, metricas: action.payload };
    default:
      return state;
  }
};

const CRMContext = createContext<{
  state: CRMState;
  dispatch: React.Dispatch<CRMAction>;
} | null>(null);

// ==================== HOOKS CUSTOMIZADOS ====================

// Hook para usar o contexto CRM
function useCRM() {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM deve ser usado dentro de um CRMProvider');
  }
  return context;
}

// Hook para formatação de dados
function useFormatters() {
  const formatCurrency = useCallback((value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }, []);

  const formatDate = useCallback((dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }, []);

  const formatDateTime = useCallback((dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const formatPercentage = useCallback((value: number): string => {
    return `${value.toFixed(1)}%`;
  }, []);

  const formatPhone = useCallback((phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  }, []);

  return {
    formatCurrency,
    formatDate,
    formatDateTime,
    formatPercentage,
    formatPhone
  };
}

// Hook para filtragem de clientes
function useClienteFilter() {
  const { state } = useCRM();
  const { clientes, filtros } = state;

  const clientesFiltrados = useMemo(() => {
    return clientes.filter(cliente => {
      const matchBusca = !filtros.busca || 
        cliente.nome.toLowerCase().includes(filtros.busca.toLowerCase()) ||
        cliente.email.toLowerCase().includes(filtros.busca.toLowerCase()) ||
        cliente.telefone.includes(filtros.busca);
      
      const matchStatus = !filtros.status || cliente.status === filtros.status;
      const matchOrigem = !filtros.origem || cliente.origem === filtros.origem;
      const matchResponsavel = !filtros.responsavel || cliente.responsavel === filtros.responsavel;
      const matchPrioridade = !filtros.prioridade || cliente.prioridade === filtros.prioridade;
      const matchTemperatura = !filtros.temperatura || cliente.temperatura === filtros.temperatura;
      const matchCidade = !filtros.cidade || cliente.cidade === filtros.cidade;
      const matchEmpreendimento = !filtros.empreendimento || cliente.empreendimentoInteresse === filtros.empreendimento;
      
      const matchValor = (!filtros.valorMinimo || !cliente.valorOrcamento || cliente.valorOrcamento >= parseInt(filtros.valorMinimo)) &&
                        (!filtros.valorMaximo || !cliente.valorOrcamento || cliente.valorOrcamento <= parseInt(filtros.valorMaximo));
      
      const matchTags = filtros.tags.length === 0 || 
        (cliente.tags && cliente.tags.some(tag => filtros.tags.includes(tag)));
      
      const matchData = (!filtros.dataInicio || new Date(cliente.dataCriacao) >= new Date(filtros.dataInicio)) &&
                       (!filtros.dataFim || new Date(cliente.dataCriacao) <= new Date(filtros.dataFim));
      
      return matchBusca && matchStatus && matchOrigem && matchResponsavel && 
             matchPrioridade && matchTemperatura && matchCidade && matchEmpreendimento && 
             matchValor && matchTags && matchData;
    });
  }, [clientes, filtros]);

  return clientesFiltrados;
}

// Hook para métricas calculadas
function useMetricas() {
  const { state } = useCRM();
  const clientesFiltrados = useClienteFilter();

  const metricas = useMemo(() => {
    const totalClientes = clientesFiltrados.length;
    const clientesAtivos = clientesFiltrados.filter(c => 
      ['interessado', 'negociacao', 'proposta'].includes(c.status)
    ).length;
    const clientesVendidos = clientesFiltrados.filter(c => c.status === 'vendido').length;
    const clientesPerdidos = clientesFiltrados.filter(c => c.status === 'perdido').length;
    
    const valorPipeline = clientesFiltrados
      .filter(c => c.valorOrcamento && ['interessado', 'negociacao', 'proposta'].includes(c.status))
      .reduce((acc, c) => acc + (c.valorOrcamento || 0), 0);
    
    const valorVendido = clientesFiltrados
      .filter(c => c.valorOrcamento && c.status === 'vendido')
      .reduce((acc, c) => acc + (c.valorOrcamento || 0), 0);
    
    const taxaConversao = totalClientes > 0 ? (clientesVendidos / totalClientes) * 100 : 0;
    const ticketMedio = clientesVendidos > 0 ? valorVendido / clientesVendidos : 0;
    
    // Métricas por responsável
    const metricasPorResponsavel = clientesFiltrados.reduce((acc, cliente) => {
      if (!acc[cliente.responsavel]) {
        acc[cliente.responsavel] = {
          nome: cliente.responsavel,
          totalLeads: 0,
          vendas: 0,
          pipeline: 0,
          taxaConversao: 0
        };
      }
      
      acc[cliente.responsavel].totalLeads++;
      if (cliente.status === 'vendido') {
        acc[cliente.responsavel].vendas++;
      }
      if (['interessado', 'negociacao', 'proposta'].includes(cliente.status) && cliente.valorOrcamento) {
        acc[cliente.responsavel].pipeline += cliente.valorOrcamento;
      }
      
      acc[cliente.responsavel].taxaConversao = 
        (acc[cliente.responsavel].vendas / acc[cliente.responsavel].totalLeads) * 100;
      
      return acc;
    }, {} as Record<string, any>);

    // Métricas por origem
    const metricasPorOrigem = clientesFiltrados.reduce((acc, cliente) => {
      if (!acc[cliente.origem]) {
        acc[cliente.origem] = { quantidade: 0, vendas: 0 };
      }
      acc[cliente.origem].quantidade++;
      if (cliente.status === 'vendido') {
        acc[cliente.origem].vendas++;
      }
      return acc;
    }, {} as Record<string, { quantidade: number; vendas: number }>);

    return {
      totalClientes,
      clientesAtivos,
      clientesVendidos,
      clientesPerdidos,
      valorPipeline,
      valorVendido,
      taxaConversao,
      ticketMedio,
      metricasPorResponsavel: Object.values(metricasPorResponsavel),
      metricasPorOrigem
    };
  }, [clientesFiltrados]);

  return metricas;
}

// Hook para atividades filtradas
function useAtividadeFilter() {
  const { state } = useCRM();
  const { atividades } = state;

  const atividadesHoje = useMemo(() => {
    const hoje = new Date();
    return atividades.filter(a => {
      const dataAtividade = new Date(a.data);
      return dataAtividade.toDateString() === hoje.toDateString();
    });
  }, [atividades]);

  const atividadesPendentes = useMemo(() => {
    return atividades.filter(a => a.status === 'agendado');
  }, [atividades]);

  const atividadesVencidas = useMemo(() => {
    return atividades.filter(a => {
      return a.status === 'agendado' && new Date(a.data) < new Date();
    });
  }, [atividades]);

  const proximasAtividades = useMemo(() => {
    return atividades
      .filter(a => a.status === 'agendado' && new Date(a.data) >= new Date())
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
      .slice(0, 5);
  }, [atividades]);

  return {
    atividadesHoje,
    atividadesPendentes,
    atividadesVencidas,
    proximasAtividades
  };
}

// Hook para gerenciar estado local com debounce
function useDebouncedState<T>(initialValue: T, delay: number = 300) {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return [debouncedValue, setValue] as const;
}

// Hook para persistência local
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erro ao ler localStorage para chave ${key}:`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erro ao salvar no localStorage para chave ${key}:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}

// Hook para paginação
function usePagination<T>(items: T[], itemsPerPage: number = 25) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPageState, setItemsPerPageState] = useState(itemsPerPage);

  const totalPages = Math.ceil(items.length / itemsPerPageState);
  const startIndex = (currentPage - 1) * itemsPerPageState;
  const endIndex = startIndex + itemsPerPageState;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const changeItemsPerPage = useCallback((newItemsPerPage: number) => {
    setItemsPerPageState(newItemsPerPage);
    setCurrentPage(1);
  }, []);

  // Reset page when items change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [items.length, totalPages, currentPage]);

  return {
    currentPage,
    totalPages,
    currentItems,
    itemsPerPage: itemsPerPageState,
    goToPage,
    nextPage,
    prevPage,
    changeItemsPerPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
}

// Hook para ordenação
function useSorting<T>(initialField: keyof T, initialDirection: 'asc' | 'desc' = 'desc') {
  const [sortField, setSortField] = useState<keyof T>(initialField);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialDirection);

  const sortData = useCallback((data: T[]) => {
    return [...data].sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];

      // Handle different data types
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        valueA = valueA.toLowerCase() as any;
        valueB = valueB.toLowerCase() as any;
      }

      if (valueA < valueB) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [sortField, sortDirection]);

  const handleSort = useCallback((field: keyof T) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  return {
    sortField,
    sortDirection,
    sortData,
    handleSort
  };
}

// Hook para notificações
function useNotifications() {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
  }>>([]);

  const addNotification = useCallback((notification: Omit<typeof notifications[0], 'id' | 'timestamp' | 'read'>) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    removeNotification,
    clearAllNotifications
  };
}

// Hook para validação de formulários
function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: Record<keyof T, (value: any) => string | null>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);

  const validateField = useCallback((field: keyof T, value: any) => {
    const rule = validationRules[field];
    return rule ? rule(value) : null;
  }, [validationRules]);

  const validateForm = useCallback(() => {
    const newErrors: Record<keyof T, string> = {} as Record<keyof T, string>;
    let isValid = true;

    Object.keys(validationRules).forEach((field) => {
      const error = validateField(field as keyof T, values[field as keyof T]);
      if (error) {
        newErrors[field as keyof T] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField, validationRules]);

  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [field]: error || ''
      } as Record<keyof T, string>));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, values[field]);
    setErrors(prev => ({
      ...prev,
      [field]: error || ''
    } as Record<keyof T, string>));
  }, [values, validateField]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({} as Record<keyof T, string>);
    setTouched({} as Record<keyof T, boolean>);
  }, [initialValues]);

  const isValid = useMemo(() => {
    return Object.values(errors).every(error => !error);
  }, [errors]);

  return {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    validateForm,
    resetForm
  };
}

// ==================== INTERFACES E TIPOS ====================

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  whatsapp?: string;
  origem: 'site' | 'indicacao' | 'telemarketing' | 'redes-sociais' | 'evento' | 'outros';
  status: 'lead' | 'contato' | 'interessado' | 'negociacao' | 'proposta' | 'vendido' | 'perdido';
  prioridade: 'baixa' | 'media' | 'alta';
  valorOrcamento?: number;
  observacoes?: string;
  responsavel: string;
  dataCriacao: string;
  ultimoContato?: string;
  proximoFollowUp?: string;
  empreendimentoInteresse?: string;
  tipoImovelInteresse?: string[];
  tags?: string[];
  score?: number;
  temperatura: 'frio' | 'morno' | 'quente';
  tempoResposta?: number;
  numeroContatos?: number;
  fonteDetalhada?: string;
  cidade?: string;
  estadoCivil?: 'solteiro' | 'casado' | 'divorciado' | 'viuvo';
  profissao?: string;
  renda?: number;
  idade?: number;
}

interface Atividade {
  id: string;
  clienteId: string;
  tipo: 'ligacao' | 'email' | 'whatsapp' | 'reuniao' | 'visita' | 'proposta' | 'follow-up' | 'nota';
  descricao: string;
  data: string;
  responsavel: string;
  status: 'agendado' | 'concluido' | 'cancelado' | 'em-andamento';
  observacoes?: string;
  duracao?: number;
  resultado?: 'positivo' | 'neutro' | 'negativo';
  proximaAcao?: string;
  dataProximaAcao?: string;
  anexos?: string[];
  prioridade?: 'baixa' | 'media' | 'alta';
}

interface MetricaVendas {
  periodo: string;
  leadsGerados: number;
  leadsConvertidos: number;
  taxaConversao: number;
  valorVendas: number;
  ticketMedio: number;
  tempoMedioVenda: number;
  custoAquisicao: number;
  valorPipeline: number;
  metaMensal: number;
  crescimentoMensal: number;
}

interface Empreendimento {
  id: string;
  nome: string;
  status: 'lancamento' | 'construcao' | 'pronto' | 'vendido';
  cidade: string;
  bairro: string;
  tipoImovel: 'apartamento' | 'casa' | 'comercial' | 'terreno';
  valorMinimo: number;
  valorMaximo: number;
  unidadesTotal: number;
  unidadesVendidas: number;
  dataLancamento: string;
  dataPrevEntrega?: string;
}

interface FiltrosCRM {
  busca: string;
  status: string;
  origem: string;
  responsavel: string;
  prioridade: string;
  temperatura: string;
  dataInicio: string;
  dataFim: string;
  valorMinimo: string;
  valorMaximo: string;
  empreendimento: string;
  cidade: string;
  tags: string[];
}

// ==================== PROVIDER DE CONTEXTO ====================

function CRMProvider({ children }: { children: React.ReactNode }) {
  const initialState: CRMState = {
    clientes: mockClientes,
    atividades: mockAtividades,
    metricas: mockMetricas,
    empreendimentos: mockEmpreendimentos,
    filtros: {
      busca: '',
      status: '',
      origem: '',
      responsavel: '',
      prioridade: '',
      temperatura: '',
      dataInicio: '',
      dataFim: '',
      valorMinimo: '',
      valorMaximo: '',
      empreendimento: '',
      cidade: '',
      tags: []
    },
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(crmReducer, initialState);

  // Simular carregamento inicial
  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simular API call
    setTimeout(() => {
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 1000);
  }, []);

  // Auto-save filtros no localStorage
  useEffect(() => {
    localStorage.setItem('crm-filtros', JSON.stringify(state.filtros));
  }, [state.filtros]);

  return (
    <CRMContext.Provider value={{ state, dispatch }}>
      {children}
    </CRMContext.Provider>
  );
}

const mockEmpreendimentos: Empreendimento[] = [
  {
    id: '1',
    nome: 'Residencial Solar das Flores',
    status: 'construcao',
    cidade: 'Florianópolis',
    bairro: 'Centro',
    tipoImovel: 'apartamento',
    valorMinimo: 280000,
    valorMaximo: 650000,
    unidadesTotal: 120,
    unidadesVendidas: 85,
    dataLancamento: '2024-06-15',
    dataPrevEntrega: '2026-03-30'
  },
  {
    id: '2',
    nome: 'Comercial Business Center',
    status: 'pronto',
    cidade: 'Florianópolis',
    bairro: 'Itacorubi',
    tipoImovel: 'comercial',
    valorMinimo: 450000,
    valorMaximo: 1200000,
    unidadesTotal: 60,
    unidadesVendidas: 42,
    dataLancamento: '2023-01-10',
    dataPrevEntrega: '2024-12-20'
  },
  {
    id: '3',
    nome: 'Residencial Jardim das Águas',
    status: 'lancamento',
    cidade: 'São José',
    bairro: 'Kobrasol',
    tipoImovel: 'apartamento',
    valorMinimo: 320000,
    valorMaximo: 480000,
    unidadesTotal: 80,
    unidadesVendidas: 15,
    dataLancamento: '2025-01-20',
    dataPrevEntrega: '2027-06-15'
  }
];

const mockClientes: Cliente[] = [
  {
    id: '1',
    nome: 'Maria Silva Santos',
    email: 'maria.silva@email.com',
    telefone: '(48) 99999-1234',
    whatsapp: '48999991234',
    origem: 'site',
    status: 'interessado',
    prioridade: 'alta',
    valorOrcamento: 450000,
    observacoes: 'Interessada em apartamento de 3 quartos no centro. Já tem aprovação bancária pré-aprovada.',
    responsavel: 'João Corretor',
    dataCriacao: '2025-01-15',
    ultimoContato: '2025-01-28',
    proximoFollowUp: '2025-01-31',
    empreendimentoInteresse: 'Residencial Solar das Flores',
    tipoImovelInteresse: ['apartamento'],
    tags: ['qualificado', 'urgente', 'financiamento-aprovado'],
    score: 85,
    temperatura: 'quente',
    tempoResposta: 2,
    numeroContatos: 5,
    fonteDetalhada: 'Google Ads - Apartamento Centro',
    cidade: 'Florianópolis',
    estadoCivil: 'casado',
    profissao: 'Engenheira',
    renda: 12000,
    idade: 34
  },
  {
    id: '2',
    nome: 'Carlos Eduardo Lima',
    email: 'carlos.lima@empresa.com',
    telefone: '(48) 98888-5678',
    whatsapp: '48988885678',
    origem: 'indicacao',
    status: 'negociacao',
    prioridade: 'alta',
    valorOrcamento: 680000,
    observacoes: 'Empresário interessado em investimento. Busca imóvel para renda.',
    responsavel: 'Ana Corretora',
    dataCriacao: '2025-01-10',
    ultimoContato: '2025-01-29',
    proximoFollowUp: '2025-02-01',
    empreendimentoInteresse: 'Comercial Business Center',
    tipoImovelInteresse: ['comercial'],
    tags: ['investidor', 'decisor', 'alta-renda'],
    score: 92,
    temperatura: 'quente',
    tempoResposta: 1,
    numeroContatos: 8,
    fonteDetalhada: 'Indicação - Cliente João Martins',
    cidade: 'Florianópolis',
    estadoCivil: 'casado',
    profissao: 'Empresário',
    renda: 35000,
    idade: 45
  },
  {
    id: '3',
    nome: 'Pedro Santos Oliveira',
    email: 'pedro.oliveira@gmail.com',
    telefone: '(48) 97777-9012',
    origem: 'redes-sociais',
    status: 'lead',
    prioridade: 'media',
    responsavel: 'Maria Corretora',
    dataCriacao: '2025-01-25',
    ultimoContato: '2025-01-26',
    proximoFollowUp: '2025-01-30',
    tags: ['novo', 'primeira-conversa'],
    score: 45,
    temperatura: 'morno',
    tempoResposta: 12,
    numeroContatos: 1,
    fonteDetalhada: 'Instagram - Post Residencial',
    cidade: 'São José',
    estadoCivil: 'solteiro',
    profissao: 'Analista de TI',
    renda: 8500,
    idade: 28
  },
  {
    id: '4',
    nome: 'Ana Paula Costa',
    email: 'anapaula@email.com',
    telefone: '(48) 96666-3456',
    whatsapp: '48966663456',
    origem: 'telemarketing',
    status: 'proposta',
    prioridade: 'alta',
    valorOrcamento: 320000,
    observacoes: 'Primeira casa própria, aprovação bancária em andamento. Muito animada com o projeto.',
    responsavel: 'João Corretor',
    dataCriacao: '2025-01-20',
    ultimoContato: '2025-01-29',
    proximoFollowUp: '2025-02-02',
    empreendimentoInteresse: 'Residencial Solar das Flores',
    tipoImovelInteresse: ['apartamento'],
    tags: ['financiamento', 'primeira-casa', 'jovem'],
    score: 78,
    temperatura: 'quente',
    tempoResposta: 3,
    numeroContatos: 6,
    fonteDetalhada: 'Telemarketing Ativo - Lista Revista Imobiliária',
    cidade: 'Florianópolis',
    estadoCivil: 'solteiro',
    profissao: 'Professora',
    renda: 6500,
    idade: 29
  },
  {
    id: '5',
    nome: 'Roberto Ferreira',
    email: 'roberto.ferreira@gmail.com',
    telefone: '(48) 95555-7890',
    origem: 'evento',
    status: 'contato',
    prioridade: 'media',
    valorOrcamento: 280000,
    responsavel: 'Ana Corretora',
    dataCriacao: '2025-01-22',
    ultimoContato: '2025-01-27',
    proximoFollowUp: '2025-01-31',
    empreendimentoInteresse: 'Residencial Jardim das Águas',
    tags: ['primeira-compra', 'evento-feira'],
    score: 62,
    temperatura: 'morno',
    tempoResposta: 6,
    numeroContatos: 3,
    fonteDetalhada: 'Feira Imobiliária Kobrasol 2025',
    cidade: 'São José',
    estadoCivil: 'casado',
    profissao: 'Contador',
    renda: 9200,
    idade: 38
  },
  {
    id: '6',
    nome: 'Fernanda Costa',
    email: 'fernanda.costa@outlook.com',
    telefone: '(48) 94444-5678',
    whatsapp: '48944445678',
    origem: 'site',
    status: 'vendido',
    prioridade: 'alta',
    valorOrcamento: 550000,
    observacoes: 'Compra finalizada - apartamento 302 Bloco A. Cliente muito satisfeita.',
    responsavel: 'João Corretor',
    dataCriacao: '2024-12-15',
    ultimoContato: '2025-01-25',
    empreendimentoInteresse: 'Residencial Solar das Flores',
    tags: ['cliente-vip', 'concluido', 'indicadora'],
    score: 95,
    temperatura: 'quente',
    tempoResposta: 1,
    numeroContatos: 12,
    fonteDetalhada: 'Site - Busca Orgânica Google',
    cidade: 'Florianópolis',
    estadoCivil: 'casado',
    profissao: 'Médica',
    renda: 25000,
    idade: 42
  },
  {
    id: '7',
    nome: 'José Martins',
    email: 'jose.martins@hotmail.com',
    telefone: '(48) 93333-4567',
    origem: 'site',
    status: 'perdido',
    prioridade: 'baixa',
    valorOrcamento: 200000,
    observacoes: 'Perdeu interesse após mudança de cidade por motivos profissionais.',
    responsavel: 'Maria Corretora',
    dataCriacao: '2025-01-05',
    ultimoContato: '2025-01-20',
    tags: ['sem-interesse', 'mudou-cidade'],
    score: 25,
    temperatura: 'frio',
    tempoResposta: 24,
    numeroContatos: 4,
    fonteDetalhada: 'Site - Página de Contato',
    cidade: 'Palhoça',
    estadoCivil: 'divorciado',
    profissao: 'Vendedor',
    renda: 4200,
    idade: 51
  },
  {
    id: '8',
    nome: 'Juliana Mendes',
    email: 'juliana.mendes@empresa.com.br',
    telefone: '(48) 92222-8901',
    whatsapp: '48922228901',
    origem: 'indicacao',
    status: 'interessado',
    prioridade: 'alta',
    valorOrcamento: 480000,
    observacoes: 'Indicada pela Fernanda Costa. Interesse em apartamento similar.',
    responsavel: 'João Corretor',
    dataCriacao: '2025-01-26',
    ultimoContato: '2025-01-29',
    proximoFollowUp: '2025-02-01',
    empreendimentoInteresse: 'Residencial Solar das Flores',
    tipoImovelInteresse: ['apartamento'],
    tags: ['indicacao-vip', 'qualificado'],
    score: 88,
    temperatura: 'quente',
    tempoResposta: 2,
    numeroContatos: 3,
    fonteDetalhada: 'Indicação Fernanda Costa',
    cidade: 'Florianópolis',
    estadoCivil: 'casado',
    profissao: 'Advogada',
    renda: 15000,
    idade: 36
  }
];

const mockAtividades: Atividade[] = [
  {
    id: '1',
    clienteId: '1',
    tipo: 'ligacao',
    descricao: 'Follow-up sobre interesse no apartamento tipo 2',
    data: '2025-01-28T14:30:00',
    responsavel: 'João Corretor',
    status: 'concluido',
    observacoes: 'Cliente confirmou interesse e agendou visita para próxima semana',
    duracao: 15,
    resultado: 'positivo',
    proximaAcao: 'Agendar visita ao apartamento decorado',
    dataProximaAcao: '2025-02-02',
    prioridade: 'alta'
  },
  {
    id: '2',
    clienteId: '2',
    tipo: 'reuniao',
    descricao: 'Apresentação da proposta comercial',
    data: '2025-02-01T10:00:00',
    responsavel: 'Ana Corretora',
    status: 'agendado',
    observacoes: 'Preparar material completo sobre ROI do investimento',
    duracao: 60,
    prioridade: 'alta'
  },
  {
    id: '3',
    clienteId: '4',
    tipo: 'email',
    descricao: 'Envio da proposta personalizada',
    data: '2025-01-29T16:00:00',
    responsavel: 'João Corretor',
    status: 'concluido',
    observacoes: 'Proposta enviada com condições especiais de pagamento',
    resultado: 'positivo',
    proximaAcao: 'Aguardar resposta em 48h',
    dataProximaAcao: '2025-01-31',
    prioridade: 'alta'
  },
  {
    id: '4',
    clienteId: '1',
    tipo: 'visita',
    descricao: 'Visita ao apartamento decorado',
    data: '2025-02-02T09:00:00',
    responsavel: 'João Corretor',
    status: 'agendado',
    duracao: 90,
    prioridade: 'alta'
  },
  {
    id: '5',
    clienteId: '3',
    tipo: 'whatsapp',
    descricao: 'Primeiro contato via WhatsApp',
    data: '2025-01-26T11:15:00',
    responsavel: 'Maria Corretora',
    status: 'concluido',
    observacoes: 'Cliente respondeu positivamente, demonstrou interesse',
    duracao: 10,
    resultado: 'positivo',
    proximaAcao: 'Ligar para qualificar melhor o perfil',
    dataProximaAcao: '2025-01-30',
    prioridade: 'media'
  },
  {
    id: '6',
    clienteId: '5',
    tipo: 'follow-up',
    descricao: 'Follow-up pós evento',
    data: '2025-01-31T15:00:00',
    responsavel: 'Ana Corretora',
    status: 'agendado',
    prioridade: 'media'
  },
  {
    id: '7',
    clienteId: '8',
    tipo: 'ligacao',
    descricao: 'Primeiro contato - lead indicado',
    data: '2025-01-29T10:30:00',
    responsavel: 'João Corretor',
    status: 'concluido',
    observacoes: 'Excelente primeiro contato, cliente muito interessada',
    duracao: 20,
    resultado: 'positivo',
    proximaAcao: 'Enviar material do empreendimento',
    dataProximaAcao: '2025-01-30',
    prioridade: 'alta'
  }
];

const mockMetricas: MetricaVendas = {
  periodo: 'Janeiro 2025',
  leadsGerados: 45,
  leadsConvertidos: 8,
  taxaConversao: 17.8,
  valorVendas: 2340000,
  ticketMedio: 292500,
  tempoMedioVenda: 25,
  custoAquisicao: 185,
  valorPipeline: 3840000,
  metaMensal: 3000000,
  crescimentoMensal: 15.4
};

// ==================== COMPONENTE PRINCIPAL ====================

function CrmComercial() {
  // Estados principais
  const [secaoAtiva, setSecaoAtiva] = useState<'dashboard' | 'kanban' | 'leads' | 'atividades'>('dashboard');
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [mostrarModalNovoLead, setMostrarModalNovoLead] = useState(false);
  const [filtrosCRM, setFiltrosCRM] = useState<FiltrosCRM>({
    busca: '',
    status: '',
    origem: '',
    responsavel: '',
    prioridade: '',
    temperatura: '',
    dataInicio: '',
    dataFim: '',
    valorMinimo: '',
    valorMaximo: '',
    empreendimento: '',
    cidade: '',
    tags: []
  });

  // Estados de UI
  const [mostrarFiltrosAvancados, setMostrarFiltrosAvancados] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [notificacoes, setNotificacoes] = useState<any[]>([]);

  // Funções utilitárias
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  // Função para filtrar clientes
  const getClientesFiltrados = () => {
    return mockClientes.filter(cliente => {
      const matchBusca = !filtrosCRM.busca || 
        cliente.nome.toLowerCase().includes(filtrosCRM.busca.toLowerCase()) ||
        cliente.email.toLowerCase().includes(filtrosCRM.busca.toLowerCase()) ||
        cliente.telefone.includes(filtrosCRM.busca);
      
      const matchStatus = !filtrosCRM.status || cliente.status === filtrosCRM.status;
      const matchOrigem = !filtrosCRM.origem || cliente.origem === filtrosCRM.origem;
      const matchResponsavel = !filtrosCRM.responsavel || cliente.responsavel === filtrosCRM.responsavel;
      const matchPrioridade = !filtrosCRM.prioridade || cliente.prioridade === filtrosCRM.prioridade;
      const matchTemperatura = !filtrosCRM.temperatura || cliente.temperatura === filtrosCRM.temperatura;
      const matchCidade = !filtrosCRM.cidade || cliente.cidade === filtrosCRM.cidade;
      const matchEmpreendimento = !filtrosCRM.empreendimento || cliente.empreendimentoInteresse === filtrosCRM.empreendimento;
      
      const matchValor = (!filtrosCRM.valorMinimo || !cliente.valorOrcamento || cliente.valorOrcamento >= parseInt(filtrosCRM.valorMinimo)) &&
                        (!filtrosCRM.valorMaximo || !cliente.valorOrcamento || cliente.valorOrcamento <= parseInt(filtrosCRM.valorMaximo));
      
      const matchTags = filtrosCRM.tags.length === 0 || 
        (cliente.tags && cliente.tags.some(tag => filtrosCRM.tags.includes(tag)));
      
      return matchBusca && matchStatus && matchOrigem && matchResponsavel && 
             matchPrioridade && matchTemperatura && matchCidade && matchEmpreendimento && 
             matchValor && matchTags;
    });
  };

  // Dados calculados
  const clientesFiltrados = getClientesFiltrados();
  const totalClientes = clientesFiltrados.length;
  const clientesAtivos = clientesFiltrados.filter(c => ['interessado', 'negociacao', 'proposta'].includes(c.status)).length;
  const clientesVendidos = clientesFiltrados.filter(c => c.status === 'vendido').length;
  const valorPipeline = clientesFiltrados
    .filter(c => c.valorOrcamento && ['interessado', 'negociacao', 'proposta'].includes(c.status))
    .reduce((acc, c) => acc + (c.valorOrcamento || 0), 0);

  // ==================== COMPONENTE NAVEGAÇÃO ====================
  
  function NavegacaoCRM() {
    const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
      { id: 'kanban', label: 'Kanban Board', icon: Target, badge: clientesAtivos },
      { id: 'leads', label: 'Lista de Leads', icon: Users, badge: totalClientes },
      { id: 'atividades', label: 'Atividades', icon: Calendar, badge: mockAtividades.filter(a => a.status === 'agendado').length }
    ];

    return (
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo e Título */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CRM Comercial</h1>
                <p className="text-sm text-gray-500">Sistema de Gestão de Relacionamento</p>
              </div>
            </div>
          </div>

          {/* Menu de Navegação */}
          <nav className="flex space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = secaoAtiva === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setSecaoAtiva(item.id as any)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  {item.badge !== null && (
                    <span className={`
                      px-2 py-0.5 text-xs rounded-full font-medium
                      ${isActive 
                        ? 'bg-blue-200 text-blue-800' 
                        : 'bg-gray-200 text-gray-700'
                      }
                    `}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Ações Rápidas */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMostrarModalNovoLead(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo Lead
            </button>
            
            <div className="relative">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5" />
                {notificacoes.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
              </button>
            </div>
            
            <div className="relative">
              <button className="flex items-center gap-2 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <User className="w-5 h-5" />
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== COMPONENTE KANBAN ====================
  
  function KanbanCRM() {
    const [draggedItem, setDraggedItem] = useState<string | null>(null);
    const [dropZoneActive, setDropZoneActive] = useState<string | null>(null);
    const [filtrosKanban, setFiltrosKanban] = useState({
      responsavel: '',
      prioridade: '',
      origem: '',
      busca: ''
    });

    // Configuração das colunas do Kanban
    const colunasKanban = [
      { 
        id: 'lead', 
        titulo: 'Novos Leads', 
        cor: 'bg-gray-100', 
        corTexto: 'text-gray-700',
        corBorda: 'border-gray-300',
        icone: Users,
        limite: null
      },
      { 
        id: 'contato', 
        titulo: 'Primeiro Contato', 
        cor: 'bg-blue-100', 
        corTexto: 'text-blue-700',
        corBorda: 'border-blue-300',
        icone: Phone,
        limite: null
      },
      { 
        id: 'interessado', 
        titulo: 'Interessados', 
        cor: 'bg-yellow-100', 
        corTexto: 'text-yellow-700',
        corBorda: 'border-yellow-300',
        icone: Eye,
        limite: null
      },
      { 
        id: 'negociacao', 
        titulo: 'Em Negociação', 
        cor: 'bg-orange-100', 
        corTexto: 'text-orange-700',
        corBorda: 'border-orange-300',
        icone: MessageSquare,
        limite: 8
      },
      { 
        id: 'proposta', 
        titulo: 'Proposta Enviada', 
        cor: 'bg-purple-100', 
        corTexto: 'text-purple-700',
        corBorda: 'border-purple-300',
        icone: DollarSign,
        limite: 5
      },
      { 
        id: 'vendido', 
        titulo: 'Vendidos', 
        cor: 'bg-green-100', 
        corTexto: 'text-green-700',
        corBorda: 'border-green-300',
        icone: CheckCircle,
        limite: null
      },
      { 
        id: 'perdido', 
        titulo: 'Perdidos', 
        cor: 'bg-red-100', 
        corTexto: 'text-red-700',
        corBorda: 'border-red-300',
        icone: X,
        limite: null
      }
    ];

    // Função para obter clientes por status com filtros
    const getClientesPorStatus = (status: string) => {
      let clientes = mockClientes.filter(cliente => cliente.status === status);
      
      // Aplicar filtros do Kanban
      if (filtrosKanban.responsavel) {
        clientes = clientes.filter(cliente => cliente.responsavel === filtrosKanban.responsavel);
      }
      
      if (filtrosKanban.prioridade) {
        clientes = clientes.filter(cliente => cliente.prioridade === filtrosKanban.prioridade);
      }
      
      if (filtrosKanban.origem) {
        clientes = clientes.filter(cliente => cliente.origem === filtrosKanban.origem);
      }
      
      if (filtrosKanban.busca) {
        clientes = clientes.filter(cliente => 
          cliente.nome.toLowerCase().includes(filtrosKanban.busca.toLowerCase()) ||
          cliente.email.toLowerCase().includes(filtrosKanban.busca.toLowerCase())
        );
      }
      
      // Ordenar por prioridade e data
      return clientes.sort((a, b) => {
        const prioridadeOrder = { 'alta': 3, 'media': 2, 'baixa': 1 };
        const prioridadeA = prioridadeOrder[a.prioridade] || 0;
        const prioridadeB = prioridadeOrder[b.prioridade] || 0;
        
        if (prioridadeA !== prioridadeB) {
          return prioridadeB - prioridadeA;
        }
        
        return new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime();
      });
    };

    // Função para calcular valor total da coluna
    const getValorTotalColuna = (status: string) => {
      const clientes = getClientesPorStatus(status);
      return clientes.reduce((total, cliente) => total + (cliente.valorOrcamento || 0), 0);
    };

    // Handlers para drag and drop
    const handleDragStart = (e: React.DragEvent, clienteId: string) => {
      setDraggedItem(clienteId);
      e.dataTransfer.setData('text/plain', clienteId);
      e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnd = () => {
      setDraggedItem(null);
      setDropZoneActive(null);
    };

    const handleDragOver = (e: React.DragEvent, colunaId: string) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setDropZoneActive(colunaId);
    };

    const handleDragLeave = () => {
      setDropZoneActive(null);
    };

    const handleDrop = (e: React.DragEvent, novoStatus: string) => {
      e.preventDefault();
      const clienteId = e.dataTransfer.getData('text/plain');
      
      if (clienteId && draggedItem) {
        // Em implementação real, aqui faria a atualização no backend
        console.log(`Movendo cliente ${clienteId} para status ${novoStatus}`);
        
        // Simular atualização otimista
        const cliente = mockClientes.find(c => c.id === clienteId);
        if (cliente && cliente.status !== novoStatus) {
          // Aqui você faria a atualização no estado ou chamada da API
          console.log(`Cliente ${cliente.nome} movido de ${cliente.status} para ${novoStatus}`);
        }
      }
      
      setDraggedItem(null);
      setDropZoneActive(null);
    };

    // Componente do Card do Cliente
    function CardCliente({ cliente }: { cliente: Cliente }) {
      const diasSemContato = cliente.ultimoContato ? 
        Math.floor((new Date().getTime() - new Date(cliente.ultimoContato).getTime()) / (1000 * 60 * 60 * 24)) : 
        Math.floor((new Date().getTime() - new Date(cliente.dataCriacao).getTime()) / (1000 * 60 * 60 * 24));

      const isUrgente = diasSemContato > 7 || (cliente.proximoFollowUp && new Date(cliente.proximoFollowUp) < new Date());

      return (
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, cliente.id)}
          onDragEnd={handleDragEnd}
          className={`
            bg-white rounded-lg p-4 shadow-sm border cursor-move transition-all duration-200
            hover:shadow-md hover:scale-105 hover:border-blue-300
            ${draggedItem === cliente.id ? 'opacity-50 scale-95' : ''}
            ${isUrgente ? 'ring-2 ring-red-200' : ''}
          `}
          onClick={() => setClienteSelecionado(cliente)}
        >
          {/* Header do Card */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-sm truncate">{cliente.nome}</h4>
              <p className="text-xs text-gray-600 truncate">{cliente.email}</p>
              <p className="text-xs text-gray-500">{cliente.telefone}</p>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <div className={`w-3 h-3 rounded-full ${
                cliente.prioridade === 'alta' ? 'bg-red-500' :
                cliente.prioridade === 'media' ? 'bg-yellow-500' : 'bg-gray-400'
              }`}></div>
              {isUrgente && (
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>

          {/* Temperatura do Lead */}
          <div className="flex items-center gap-2 mb-3">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
              cliente.temperatura === 'quente' ? 'bg-red-100 text-red-700' :
              cliente.temperatura === 'morno' ? 'bg-yellow-100 text-yellow-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                cliente.temperatura === 'quente' ? 'bg-red-500' :
                cliente.temperatura === 'morno' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`}></div>
              {cliente.temperatura}
            </div>
            {cliente.score && (
              <div className="text-xs font-medium text-gray-600">
                Score: {cliente.score}
              </div>
            )}
          </div>

          {/* Informações do Negócio */}
          <div className="space-y-2 mb-3">
            {cliente.valorOrcamento && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-3 h-3 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  {formatCurrency(cliente.valorOrcamento)}
                </span>
              </div>
            )}
            
            {cliente.empreendimentoInteresse && (
              <div className="flex items-center gap-2">
                <Building className="w-3 h-3 text-blue-600" />
                <span className="text-xs text-gray-600 truncate">
                  {cliente.empreendimentoInteresse}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3 text-purple-600" />
              <span className="text-xs text-gray-600">
                {cliente.proximoFollowUp ? 
                  `Follow-up: ${formatDate(cliente.proximoFollowUp)}` :
                  `Sem contato há ${diasSemContato}d`
                }
              </span>
            </div>

            <div className="flex items-center gap-2">
              <User className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-600">{cliente.responsavel}</span>
            </div>
          </div>

          {/* Tags */}
          {cliente.tags && cliente.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {cliente.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {cliente.tags.length > 2 && (
                <span className="text-xs text-gray-500">+{cliente.tags.length - 2}</span>
              )}
            </div>
          )}

          {/* Origem e Tempo de Resposta */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span className={`px-2 py-1 rounded-full capitalize ${
              cliente.origem === 'site' ? 'bg-blue-100 text-blue-700' :
              cliente.origem === 'indicacao' ? 'bg-green-100 text-green-700' :
              cliente.origem === 'telemarketing' ? 'bg-purple-100 text-purple-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {cliente.origem}
            </span>
            {cliente.tempoResposta && (
              <span className="text-gray-500">
                {cliente.tempoResposta}h resp.
              </span>
            )}
          </div>

          {/* Ações do Card */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Ligar para', cliente.telefone);
                }}
                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                title="Ligar"
              >
                <Phone className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Email para', cliente.email);
                }}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Email"
              >
                <Mail className="w-3 h-3" />
              </button>
              {cliente.whatsapp && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('WhatsApp para', cliente.whatsapp);
                  }}
                  className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                  title="WhatsApp"
                >
                  <MessageSquare className="w-3 h-3" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setClienteSelecionado(cliente);
                }}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Ver detalhes"
              >
                <Eye className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Editar cliente', cliente.id);
                }}
                className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                title="Editar"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6">
        {/* Header do Kanban */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Kanban Board</h2>
            <p className="text-gray-600 mt-1">Gerencie visualmente o pipeline de vendas</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setMostrarModalNovoLead(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo Lead
            </button>
            <button 
              onClick={() => setSecaoAtiva('dashboard')}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </button>
          </div>
        </div>

        {/* Filtros do Kanban */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar leads..."
                value={filtrosKanban.busca}
                onChange={(e) => setFiltrosKanban({...filtrosKanban, busca: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filtrosKanban.responsavel}
              onChange={(e) => setFiltrosKanban({...filtrosKanban, responsavel: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos os corretores</option>
              <option value="João Corretor">João Corretor</option>
              <option value="Ana Corretora">Ana Corretora</option>
              <option value="Maria Corretora">Maria Corretora</option>
            </select>

            <select
              value={filtrosKanban.prioridade}
              onChange={(e) => setFiltrosKanban({...filtrosKanban, prioridade: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas as prioridades</option>
              <option value="alta">Alta prioridade</option>
              <option value="media">Média prioridade</option>
              <option value="baixa">Baixa prioridade</option>
            </select>

            <select
              value={filtrosKanban.origem}
              onChange={(e) => setFiltrosKanban({...filtrosKanban, origem: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas as origens</option>
              <option value="site">Site</option>
              <option value="indicacao">Indicação</option>
              <option value="telemarketing">Telemarketing</option>
              <option value="redes-sociais">Redes Sociais</option>
              <option value="evento">Evento</option>
            </select>

            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
              Mais filtros
            </button>
          </div>
        </div>

        {/* Board Kanban */}
        <div className="overflow-x-auto pb-6">
          <div className="flex gap-6 min-w-max">
            {colunasKanban.map((coluna) => {
              const clientesColuna = getClientesPorStatus(coluna.id);
              const valorTotalColuna = getValorTotalColuna(coluna.id);
              const IconeColuna = coluna.icone;
              const isDropZone = dropZoneActive === coluna.id;
              const isOverLimit = coluna.limite && clientesColuna.length >= coluna.limite;
              
              return (
                <div key={coluna.id} className="w-80 flex-shrink-0">
                  {/* Header da Coluna */}
                  <div className={`
                    ${coluna.cor} ${coluna.corTexto} rounded-t-lg p-4 border-2 border-transparent
                    ${isDropZone ? `${coluna.corBorda} border-dashed` : ''}
                    transition-all duration-200
                  `}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <IconeColuna className="w-5 h-5" />
                        <h3 className="font-semibold">{coluna.titulo}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-white bg-opacity-70 px-2 py-1 rounded-full text-sm font-medium">
                          {clientesColuna.length}
                          {coluna.limite && `/${coluna.limite}`}
                        </span>
                        {isOverLimit && (
                          <div className="w-2 h-2 bg-red-500 rounded-full" title="Limite excedido"></div>
                        )}
                      </div>
                    </div>
                    
                    {valorTotalColuna > 0 && (
                      <div className="text-sm opacity-80">
                        Total: {formatCurrency(valorTotalColuna)}
                      </div>
                    )}
                  </div>
                  
                  {/* Área de Drop */}
                  <div
                    onDragOver={(e) => handleDragOver(e, coluna.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, coluna.id)}
                    className={`
                      bg-gray-50 rounded-b-lg p-3 min-h-[600px] border-2 transition-all duration-200
                      ${isDropZone 
                        ? `${coluna.corBorda} border-dashed bg-opacity-50 ${coluna.cor}` 
                        : 'border-transparent'
                      }
                    `}
                  >
                    {/* Cards dos Clientes */}
                    <div className="space-y-3">
                      {clientesColuna.map((cliente) => (
                        <CardCliente key={cliente.id} cliente={cliente} />
                      ))}
                    </div>

                    {/* Botão para adicionar novo lead na coluna */}
                    <div
                      className={`
                        w-full border-2 border-dashed rounded-lg p-4 text-center transition-all duration-200 mt-3
                        ${isDropZone 
                          ? 'border-blue-400 bg-blue-50 text-blue-600' 
                          : 'border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50'
                        }
                        cursor-pointer
                      `}
                      onClick={() => setMostrarModalNovoLead(true)}
                    >
                      <Plus className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-sm font-medium">
                        {isDropZone ? 'Solte aqui para mover' : 'Adicionar lead'}
                      </span>
                    </div>

                    {/* Estado vazio */}
                    {clientesColuna.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <IconeColuna className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Nenhum lead nesta etapa</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Estatísticas Resumidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-lg p-4 border text-center">
            <p className="text-2xl font-bold text-blue-600">{mockClientes.filter(c => c.status === 'lead').length}</p>
            <p className="text-sm text-gray-600">Novos Leads</p>
          </div>
          <div className="bg-white rounded-lg p-4 border text-center">
            <p className="text-2xl font-bold text-yellow-600">{clientesAtivos}</p>
            <p className="text-sm text-gray-600">Pipeline Ativo</p>
          </div>
          <div className="bg-white rounded-lg p-4 border text-center">
            <p className="text-2xl font-bold text-green-600">{clientesVendidos}</p>
            <p className="text-sm text-gray-600">Vendas</p>
          </div>
          <div className="bg-white rounded-lg p-4 border text-center">
            <p className="text-lg font-bold text-purple-600">{formatCurrency(valorPipeline)}</p>
            <p className="text-sm text-gray-600">Valor Pipeline</p>
          </div>
        </div>
      </div>
    );
  }

  // ==================== COMPONENTE DASHBOARD ====================
  
  function DashboardCRM() {
    const [graficoAtivo, setGraficoAtivo] = useState<'vendas' | 'pipeline' | 'origem'>('vendas');
    
    // Dados para o funil de vendas
    const dadosFunil = [
      { stage: 'Leads', count: mockMetricas.leadsGerados, color: 'bg-gray-500', percentage: 100 },
      { stage: 'Contatos', count: 32, color: 'bg-blue-500', percentage: 71 },
      { stage: 'Interessados', count: 18, color: 'bg-yellow-500', percentage: 40 },
      { stage: 'Negociação', count: 12, color: 'bg-orange-500', percentage: 27 },
      { stage: 'Proposta', count: 8, color: 'bg-green-500', percentage: 18 },
      { stage: 'Vendidos', count: mockMetricas.leadsConvertidos, color: 'bg-purple-500', percentage: 11 }
    ];

    // Dados de origem dos leads
    const dadosOrigem = [
      { origem: 'Site', quantidade: 18, percentual: 40, cor: 'bg-blue-500' },
      { origem: 'Indicação', quantidade: 12, percentual: 27, cor: 'bg-green-500' },
      { origem: 'Redes Sociais', quantidade: 8, percentual: 18, cor: 'bg-purple-500' },
      { origem: 'Telemarketing', quantidade: 4, percentual: 9, cor: 'bg-orange-500' },
      { origem: 'Eventos', quantidade: 3, percentual: 6, cor: 'bg-yellow-500' }
    ];

    // Atividades próximas
    const atividadesProximas = mockAtividades
      .filter(a => a.status === 'agendado' && new Date(a.data) >= new Date())
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
      .slice(0, 5);

    // Leads com follow-up vencido
    const followUpVencido = mockClientes.filter(c => 
      c.proximoFollowUp && new Date(c.proximoFollowUp) < new Date() && 
      !['vendido', 'perdido'].includes(c.status)
    );

    // Top performers
    const performanceCorretores = [
      { nome: 'João Corretor', vendas: 3, valorVendas: 1250000, leads: 12, conversao: 25 },
      { nome: 'Ana Corretora', vendas: 2, valorVendas: 890000, leads: 8, conversao: 25 },
      { nome: 'Maria Corretora', vendas: 3, valorVendas: 1200000, leads: 15, conversao: 20 }
    ];

    return (
      <div className="p-6 space-y-6">
        {/* Header do Dashboard */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Comercial</h2>
            <p className="text-gray-600 mt-1">Visão geral completa de vendas e oportunidades</p>
          </div>
          <div className="flex items-center gap-3">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>Últimos 30 dias</option>
              <option>Últimos 7 dias</option>
              <option>Este mês</option>
              <option>Mês anterior</option>
              <option>Este trimestre</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>

        {/* Cards de Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total de Leads</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalClientes}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+{mockMetricas.leadsGerados} este mês</span>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Pipeline Ativo</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{clientesAtivos}</p>
                <div className="flex items-center mt-2">
                  <Target className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-600 font-medium">{formatCurrency(valorPipeline)}</span>
                </div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-xl">
                <Target className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Taxa de Conversão</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{formatPercentage(mockMetricas.taxaConversao)}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+2.3% vs mês anterior</span>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Vendas do Mês</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(mockMetricas.valorVendas)}</p>
                <div className="flex items-center mt-2">
                  <DollarSign className="w-4 h-4 text-purple-500 mr-1" />
                  <span className="text-sm text-purple-600 font-medium">Meta: {formatCurrency(mockMetricas.metaMensal)}</span>
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos e Funil */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Performance */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Performance de Vendas</h3>
              <div className="flex rounded-lg border border-gray-200 p-1">
                {['vendas', 'pipeline', 'origem'].map((tipo) => (
                  <button
                    key={tipo}
                    onClick={() => setGraficoAtivo(tipo as any)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      graficoAtivo === tipo
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tipo === 'vendas' ? 'Vendas' : tipo === 'pipeline' ? 'Pipeline' : 'Origem'}
                  </button>
                ))}
              </div>
            </div>
            
            {graficoAtivo === 'vendas' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Janeiro 2025</span>
                  <span className="font-semibold text-lg">{formatCurrency(mockMetricas.valorVendas)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${(mockMetricas.valorVendas / mockMetricas.metaMensal) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Meta: {formatCurrency(mockMetricas.metaMensal)}</span>
                  <span>{formatPercentage((mockMetricas.valorVendas / mockMetricas.metaMensal) * 100)} da meta</span>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{mockMetricas.leadsConvertidos}</p>
                    <p className="text-sm text-gray-600">Vendas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(mockMetricas.ticketMedio)}</p>
                    <p className="text-sm text-gray-600">Ticket Médio</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{mockMetricas.tempoMedioVenda}d</p>
                    <p className="text-sm text-gray-600">Tempo Médio</p>
                  </div>
                </div>
              </div>
            )}

            {graficoAtivo === 'origem' && (
              <div className="space-y-4">
                {dadosOrigem.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-3 h-3 rounded-full ${item.cor}`}></div>
                      <span className="text-sm font-medium text-gray-700">{item.origem}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${item.cor}`}
                          style={{ width: `${item.percentual}%` }}
                        ></div>
                      </div>
                      <div className="text-right min-w-[60px]">
                        <div className="text-sm font-semibold text-gray-900">{item.quantidade}</div>
                        <div className="text-xs text-gray-500">{item.percentual}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Funil de Vendas */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Funil de Vendas</h3>
              <div className="text-sm text-gray-500">Taxa de conversão: {formatPercentage(mockMetricas.taxaConversao)}</div>
            </div>
            
            <div className="space-y-4">
              {dadosFunil.map((stage, index) => (
                <div key={stage.stage} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${stage.color}`}></div>
                      <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">{stage.count}</div>
                      <div className="text-xs text-gray-500">{stage.percentage}%</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${stage.color} transition-all duration-500`}
                      style={{ width: `${stage.percentage}%` }}
                    ></div>
                  </div>
                  {index < dadosFunil.length - 1 && (
                    <div className="text-xs text-gray-400 text-center mt-1">
                      ↓ {Math.round((dadosFunil[index + 1].count / stage.count) * 100)}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Seção de Atividades e Alertas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Próximas Atividades */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Próximas Atividades</h3>
              <button 
                onClick={() => setSecaoAtiva('atividades')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Ver todas
              </button>
            </div>

            <div className="space-y-3">
              {atividadesProximas.map((atividade) => {
                const cliente = mockClientes.find(c => c.id === atividade.clienteId);
                const icones = {
                  ligacao: Phone,
                  email: Mail,
                  whatsapp: MessageSquare,
                  reuniao: Calendar,
                  visita: Eye,
                  proposta: DollarSign,
                  'follow-up': Clock,
                  nota: Edit2
                };
                const IconeAtividade = icones[atividade.tipo] || Calendar;
                
                return (
                  <div key={atividade.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <IconeAtividade className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 text-sm capitalize">{atividade.tipo}</p>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {formatDateTime(atividade.data).split(' ')[1]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{atividade.descricao}</p>
                      <p className="text-xs text-gray-500 mt-1">{cliente?.nome}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Follow-ups Vencidos */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-500" />
                Follow-ups Vencidos
              </h3>
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                {followUpVencido.length}
              </span>
            </div>

            <div className="space-y-3">
              {followUpVencido.slice(0, 5).map((cliente) => (
                <div key={cliente.id} className="flex items-center justify-between p-3 border border-red-100 rounded-lg bg-red-50">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{cliente.nome}</p>
                    <p className="text-xs text-gray-600">{cliente.email}</p>
                    <p className="text-xs text-red-600 mt-1">
                      Vencido há {Math.floor((new Date().getTime() - new Date(cliente.proximoFollowUp!).getTime()) / (1000 * 60 * 60 * 24))} dias
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {followUpVencido.length === 0 && (
                <div className="text-center py-4">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Nenhum follow-up vencido!</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
              <Star className="w-5 h-5 text-yellow-500" />
            </div>

            <div className="space-y-4">
              {performanceCorretores.map((corretor, index) => (
                <div key={corretor.nome} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{corretor.nome}</p>
                    <p className="text-xs text-gray-600">
                      {corretor.vendas} vendas • {formatCurrency(corretor.valorVendas)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">{corretor.conversao}%</p>
                    <p className="text-xs text-gray-500">{corretor.leads} leads</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alertas e Notificações */}
        {(followUpVencido.length > 0 || atividadesProximas.length > 0) && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Centro de Alertas</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Ações Imediatas</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• {followUpVencido.length} follow-ups vencidos precisam de atenção</li>
                  <li>• {atividadesProximas.length} atividades agendadas para hoje</li>
                  <li>• {clientesAtivos} oportunidades ativas no pipeline</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Metas do Mês</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Faltam {formatCurrency(mockMetricas.metaMensal - mockMetricas.valorVendas)} para a meta</li>
                  <li>• Taxa de conversão: {formatPercentage(mockMetricas.taxaConversao)}</li>
                  <li>• {mockMetricas.leadsGerados} novos leads este mês</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }