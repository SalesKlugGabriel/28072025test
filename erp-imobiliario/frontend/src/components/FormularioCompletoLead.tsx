import React, { useState, FormEvent } from 'react';
import { X, User, Mail, Phone, Target, Save, MapPin, Building, Calendar, DollarSign, FileText, Heart } from 'lucide-react';

interface DadosEndereco {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  cep: string;
  estado: string;
}

interface DadosBancarios {
  agencia: string;
  tipoConta: 'corrente' | 'poupanca';
  conta: string;
  pix: string;
  nomeBeneficiario: string;
}

interface DadosConjuge {
  nome: string;
  cpf: string;
  rg: string;
  telefone: string;
  email: string;
  endereco: DadosEndereco;
}

interface DadosCompletos {
  // Dados pessoais básicos
  nome: string;
  cpf: string;
  rg: string;
  telefone: string;
  whatsapp: string;
  email: string;
  
  // Dados profissionais
  empresa: string;
  cargo: string;
  
  // Endereço completo
  endereco: DadosEndereco;
  
  // Investimento
  valorDesejainvestir: number;
  dataPretendeInvestir: string;
  localizacaoDesejada: string;
  
  // Status da obra
  statusObra: 'em_construcao' | 'pronto' | 'pre_lancamento' | 'inicia_obra' | 'entrega_obra';
  dataInicioObra?: string;
  dataEntregaObra?: string;
  
  // Características do imóvel - Seção Interesse
  caracteristicasImovel: {
    quartos: number;
    suites: number;
    vagasGaragem: number;
    lazer: string[];
    observacoes: string;
    // Novos campos de interesse
    localizacaoPreferida: string;
    valorMinimoInvestimento: number;
    valorMaximoInvestimento: number;
    proximidadeMar: number; // em km
    andaresPrefere: string; // 'baixos', 'altos', 'intermediarios', 'indiferente'
    posicaoSolar: string; // 'nascente', 'poente', 'norte', 'sul', 'indiferente'
    finalidadeInvestimento: 'moradia' | 'investimento' | 'aluguel' | 'revenda';
    tempoMudanca: string; // 'imediato', '6_meses', '1_ano', 'mais_1_ano'
  };
  
  // Dados bancários
  dadosBancarios: DadosBancarios;
  
  // Estado civil
  estadoCivil: 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel';
  regimeBens?: 'comunhao_total' | 'comunhao_parcial' | 'separacao_bens';
  dadosConjuge?: DadosConjuge;
  
  // Origem e observações
  origem: string;
  observacoes: string;
}

interface Props {
  aberto: boolean;
  dadosIniciais?: Partial<DadosCompletos>;
  onSalvar: (dados: DadosCompletos) => void;
  onFechar: () => void;
  titulo?: string;
}

const FormularioCompletoLead: React.FC<Props> = ({ 
  aberto, 
  dadosIniciais, 
  onSalvar, 
  onFechar,
  titulo = 'Cadastro Completo - Lead/Cliente'
}) => {
  const [etapaAtiva, setEtapaAtiva] = useState<'pessoais' | 'endereco' | 'investimento' | 'imovel' | 'bancarios' | 'conjugal'>('pessoais');
  
  // Estados do formulário
  const [dados, setDados] = useState<DadosCompletos>({
    // Dados pessoais básicos
    nome: dadosIniciais?.nome || '',
    cpf: dadosIniciais?.cpf || '',
    rg: dadosIniciais?.rg || '',
    telefone: dadosIniciais?.telefone || '',
    whatsapp: dadosIniciais?.whatsapp || '',
    email: dadosIniciais?.email || '',
    
    // Dados profissionais
    empresa: dadosIniciais?.empresa || '',
    cargo: dadosIniciais?.cargo || '',
    
    // Endereço completo
    endereco: {
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      cep: '',
      estado: '',
      ...dadosIniciais?.endereco
    },
    
    // Investimento
    valorDesejainvestir: dadosIniciais?.valorDesejainvestir || 0,
    dataPretendeInvestir: dadosIniciais?.dataPretendeInvestir || '',
    localizacaoDesejada: dadosIniciais?.localizacaoDesejada || '',
    
    // Status da obra
    statusObra: dadosIniciais?.statusObra || 'em_construcao',
    dataInicioObra: dadosIniciais?.dataInicioObra || '',
    dataEntregaObra: dadosIniciais?.dataEntregaObra || '',
    
    // Características do imóvel
    caracteristicasImovel: {
      quartos: 2,
      suites: 1,
      vagasGaragem: 1,
      lazer: [],
      observacoes: '',
      // Novos campos de interesse
      localizacaoPreferida: '',
      valorMinimoInvestimento: 0,
      valorMaximoInvestimento: 0,
      proximidadeMar: 0,
      andaresPrefere: 'indiferente',
      posicaoSolar: 'indiferente',
      finalidadeInvestimento: 'moradia',
      tempoMudanca: 'imediato',
      ...dadosIniciais?.caracteristicasImovel
    },
    
    // Dados bancários
    dadosBancarios: {
      agencia: '',
      tipoConta: 'corrente',
      conta: '',
      pix: '',
      nomeBeneficiario: '',
      ...dadosIniciais?.dadosBancarios
    },
    
    // Estado civil
    estadoCivil: dadosIniciais?.estadoCivil || 'solteiro',
    regimeBens: dadosIniciais?.regimeBens,
    dadosConjuge: dadosIniciais?.dadosConjuge,
    
    // Origem e observações
    origem: dadosIniciais?.origem || '',
    observacoes: dadosIniciais?.observacoes || ''
  });

  const [erros, setErros] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);

  const etapas = [
    { id: 'pessoais', titulo: 'Dados Pessoais', icon: User },
    { id: 'endereco', titulo: 'Endereço', icon: MapPin },
    { id: 'investimento', titulo: 'Investimento', icon: DollarSign },
    { id: 'imovel', titulo: 'Imóvel Desejado', icon: Building },
    { id: 'bancarios', titulo: 'Dados Bancários', icon: FileText },
    { id: 'conjugal', titulo: 'Estado Civil', icon: Heart }
  ];

  const opcoesLazer = [
    'Piscina', 'Academia', 'Salão de Festas', 'Churrasqueira', 'Playground',
    'Quadra Esportiva', 'SPA', 'Sauna', 'Coworking', 'Brinquedoteca',
    'Jardim', 'Pista de Caminhada', 'Bike Park', 'Pet Place'
  ];

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    const novosErros: Record<string, string> = {};
    
    if (!dados.nome.trim()) novosErros.nome = 'Nome é obrigatório';
    if (!dados.cpf.trim()) novosErros.cpf = 'CPF é obrigatório';
    if (!dados.email.trim()) novosErros.email = 'Email é obrigatório';
    if (!dados.telefone.trim()) novosErros.telefone = 'Telefone é obrigatório';
    
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    setEnviando(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular API
      onSalvar(dados);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setEnviando(false);
    }
  };

  const updateDados = (campo: string, valor: any) => {
    setDados(prev => ({
      ...prev,
      [campo]: valor
    }));
    
    // Limpar erro do campo
    if (erros[campo]) {
      setErros(prev => {
        const novosErros = { ...prev };
        delete novosErros[campo];
        return novosErros;
      });
    }
  };

  const updateEndereco = (campo: string, valor: string) => {
    setDados(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [campo]: valor
      }
    }));
  };

  const updateCaracteristicas = (campo: string, valor: any) => {
    setDados(prev => ({
      ...prev,
      caracteristicasImovel: {
        ...prev.caracteristicasImovel,
        [campo]: valor
      }
    }));
  };

  const updateDadosBancarios = (campo: string, valor: any) => {
    setDados(prev => ({
      ...prev,
      dadosBancarios: {
        ...prev.dadosBancarios,
        [campo]: valor
      }
    }));
  };

  const updateDadosConjuge = (campo: string, valor: any) => {
    setDados(prev => ({
      ...prev,
      dadosConjuge: {
        nome: '',
        cpf: '',
        rg: '',
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
        ...prev.dadosConjuge,
        [campo]: valor
      }
    }));
  };

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{titulo}</h2>
            <button
              onClick={onFechar}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navegação por etapas */}
          <div className="mt-4 flex overflow-x-auto">
            {etapas.map((etapa, index) => {
              const Icon = etapa.icon;
              const isActive = etapaAtiva === etapa.id;
              return (
                <button
                  key={etapa.id}
                  onClick={() => setEtapaAtiva(etapa.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap mr-2 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {etapa.titulo}
                </button>
              );
            })}
          </div>
        </div>

        {/* Conteúdo */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            {/* Etapa: Dados Pessoais */}
            {etapaAtiva === 'pessoais' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Informações Pessoais</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={dados.nome}
                      onChange={(e) => updateDados('nome', e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                        erros.nome ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Nome completo"
                    />
                    {erros.nome && <p className="text-red-600 text-sm mt-1">{erros.nome}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CPF *
                    </label>
                    <input
                      type="text"
                      value={dados.cpf}
                      onChange={(e) => updateDados('cpf', e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                        erros.cpf ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="000.000.000-00"
                    />
                    {erros.cpf && <p className="text-red-600 text-sm mt-1">{erros.cpf}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RG *
                    </label>
                    <input
                      type="text"
                      value={dados.rg}
                      onChange={(e) => updateDados('rg', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="00.000.000-0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      value={dados.telefone}
                      onChange={(e) => updateDados('telefone', e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                        erros.telefone ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="(11) 99999-9999"
                    />
                    {erros.telefone && <p className="text-red-600 text-sm mt-1">{erros.telefone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={dados.whatsapp}
                      onChange={(e) => updateDados('whatsapp', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={dados.email}
                      onChange={(e) => updateDados('email', e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                        erros.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="email@exemplo.com"
                    />
                    {erros.email && <p className="text-red-600 text-sm mt-1">{erros.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Empresa
                    </label>
                    <input
                      type="text"
                      value={dados.empresa}
                      onChange={(e) => updateDados('empresa', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="Nome da empresa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo
                    </label>
                    <input
                      type="text"
                      value={dados.cargo}
                      onChange={(e) => updateDados('cargo', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="Seu cargo na empresa"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Etapa: Endereço */}
            {etapaAtiva === 'endereco' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Endereço Completo</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CEP *
                    </label>
                    <input
                      type="text"
                      value={dados.endereco.cep}
                      onChange={(e) => updateEndereco('cep', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="00000-000"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logradouro *
                    </label>
                    <input
                      type="text"
                      value={dados.endereco.logradouro}
                      onChange={(e) => updateEndereco('logradouro', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="Nome da rua, avenida..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número *
                    </label>
                    <input
                      type="text"
                      value={dados.endereco.numero}
                      onChange={(e) => updateEndereco('numero', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="123"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Complemento
                    </label>
                    <input
                      type="text"
                      value={dados.endereco.complemento}
                      onChange={(e) => updateEndereco('complemento', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="Apto 101, Bloco A..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      value={dados.endereco.bairro}
                      onChange={(e) => updateEndereco('bairro', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="Nome do bairro"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      value={dados.endereco.cidade}
                      onChange={(e) => updateEndereco('cidade', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="Nome da cidade"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado *
                    </label>
                    <select
                      value={dados.endereco.estado}
                      onChange={(e) => updateEndereco('estado', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione</option>
                      {estados.map(estado => (
                        <option key={estado} value={estado}>{estado}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Etapa: Investimento */}
            {etapaAtiva === 'investimento' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Perfil de Investimento</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor que Deseja Investir
                    </label>
                    <input
                      type="number"
                      value={dados.valorDesejainvestir}
                      onChange={(e) => updateDados('valorDesejainvestir', parseFloat(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: 450000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data que Pretende Investir
                    </label>
                    <input
                      type="date"
                      value={dados.dataPretendeInvestir}
                      onChange={(e) => updateDados('dataPretendeInvestir', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Localização Desejada para Investir
                    </label>
                    <input
                      type="text"
                      value={dados.localizacaoDesejada}
                      onChange={(e) => updateDados('localizacaoDesejada', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Bairro Centro, Zona Sul, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status de Obra Preferido
                    </label>
                    <select
                      value={dados.statusObra}
                      onChange={(e) => updateDados('statusObra', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="em_construcao">Em Construção</option>
                      <option value="pronto">Pronto</option>
                      <option value="pre_lancamento">Pré-Lançamento</option>
                      <option value="inicia_obra">Inicia a Obra em...</option>
                      <option value="entrega_obra">Entrega da Obra em...</option>
                    </select>
                  </div>

                  <div>
                    {(dados.statusObra === 'inicia_obra' || dados.statusObra === 'entrega_obra') && (
                      <>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {dados.statusObra === 'inicia_obra' ? 'Data de Início da Obra' : 'Data de Entrega da Obra'}
                        </label>
                        <input
                          type="date"
                          value={dados.statusObra === 'inicia_obra' ? dados.dataInicioObra : dados.dataEntregaObra}
                          onChange={(e) => updateDados(
                            dados.statusObra === 'inicia_obra' ? 'dataInicioObra' : 'dataEntregaObra', 
                            e.target.value
                          )}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Etapa: Características do Imóvel */}
            {etapaAtiva === 'imovel' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Características do Imóvel Desejado</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quartos
                    </label>
                    <input
                      type="number"
                      value={dados.caracteristicasImovel.quartos}
                      onChange={(e) => updateCaracteristicas('quartos', parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Suítes
                    </label>
                    <input
                      type="number"
                      value={dados.caracteristicasImovel.suites}
                      onChange={(e) => updateCaracteristicas('suites', parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vagas de Garagem
                    </label>
                    <input
                      type="number"
                      value={dados.caracteristicasImovel.vagasGaragem}
                      onChange={(e) => updateCaracteristicas('vagasGaragem', parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Áreas de Lazer Desejadas
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {opcoesLazer.map(opcao => (
                      <label key={opcao} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={dados.caracteristicasImovel.lazer.includes(opcao)}
                          onChange={(e) => {
                            const lazerAtual = dados.caracteristicasImovel.lazer;
                            if (e.target.checked) {
                              updateCaracteristicas('lazer', [...lazerAtual, opcao]);
                            } else {
                              updateCaracteristicas('lazer', lazerAtual.filter(l => l !== opcao));
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{opcao}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Seção Interesse Expandida */}
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 space-y-6">
                  <h4 className="text-md font-semibold text-blue-900 mb-4">📋 Seção Interesse - Perfil Detalhado</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-1">
                        Localização Preferida *
                      </label>
                      <input
                        type="text"
                        value={dados.caracteristicasImovel.localizacaoPreferida}
                        onChange={(e) => updateCaracteristicas('localizacaoPreferida', e.target.value)}
                        className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: Centro, Ingleses, Canasvieiras"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-1">
                        Proximidade do Mar (km)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="50"
                        value={dados.caracteristicasImovel.proximidadeMar}
                        onChange={(e) => updateCaracteristicas('proximidadeMar', parseFloat(e.target.value) || 0)}
                        className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: 0.5 para 500m"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-1">
                        Valor Mínimo de Investimento
                      </label>
                      <input
                        type="number"
                        step="1000"
                        min="0"
                        value={dados.caracteristicasImovel.valorMinimoInvestimento}
                        onChange={(e) => updateCaracteristicas('valorMinimoInvestimento', parseInt(e.target.value) || 0)}
                        className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        placeholder="R$ 200.000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-1">
                        Valor Máximo de Investimento
                      </label>
                      <input
                        type="number"
                        step="1000"
                        min="0"
                        value={dados.caracteristicasImovel.valorMaximoInvestimento}
                        onChange={(e) => updateCaracteristicas('valorMaximoInvestimento', parseInt(e.target.value) || 0)}
                        className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        placeholder="R$ 800.000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-1">
                        Preferência de Andares
                      </label>
                      <select
                        value={dados.caracteristicasImovel.andaresPrefere}
                        onChange={(e) => updateCaracteristicas('andaresPrefere', e.target.value)}
                        className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="indiferente">Indiferente</option>
                        <option value="baixos">Andares Baixos (1º ao 5º)</option>
                        <option value="intermediarios">Andares Intermediários (6º ao 12º)</option>
                        <option value="altos">Andares Altos (acima do 12º)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-1">
                        Posição Solar Preferida
                      </label>
                      <select
                        value={dados.caracteristicasImovel.posicaoSolar}
                        onChange={(e) => updateCaracteristicas('posicaoSolar', e.target.value)}
                        className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="indiferente">Indiferente</option>
                        <option value="nascente">Nascente (Sol da manhã)</option>
                        <option value="poente">Poente (Sol da tarde)</option>
                        <option value="norte">Norte (Sol o dia todo)</option>
                        <option value="sul">Sul (Menos sol)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-1">
                        Finalidade do Investimento
                      </label>
                      <select
                        value={dados.caracteristicasImovel.finalidadeInvestimento}
                        onChange={(e) => updateCaracteristicas('finalidadeInvestimento', e.target.value)}
                        className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="moradia">Moradia Própria</option>
                        <option value="investimento">Investimento Geral</option>
                        <option value="aluguel">Renda por Aluguel</option>
                        <option value="revenda">Revenda Futura</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-1">
                        Tempo para Mudança/Uso
                      </label>
                      <select
                        value={dados.caracteristicasImovel.tempoMudanca}
                        onChange={(e) => updateCaracteristicas('tempoMudanca', e.target.value)}
                        className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="imediato">Imediato (0-3 meses)</option>
                        <option value="6_meses">Em até 6 meses</option>
                        <option value="1_ano">Em até 1 ano</option>
                        <option value="mais_1_ano">Mais de 1 ano</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações sobre o Imóvel
                  </label>
                  <textarea
                    value={dados.caracteristicasImovel.observacoes}
                    onChange={(e) => updateCaracteristicas('observacoes', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Características específicas, preferências de localização, vista, etc."
                  />
                </div>
              </div>
            )}

            {/* Etapa: Dados Bancários */}
            {etapaAtiva === 'bancarios' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Dados Bancários</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Agência
                    </label>
                    <input
                      type="text"
                      value={dados.dadosBancarios.agencia}
                      onChange={(e) => updateDadosBancarios('agencia', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="0000-0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Conta
                    </label>
                    <select
                      value={dados.dadosBancarios.tipoConta}
                      onChange={(e) => updateDadosBancarios('tipoConta', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="corrente">Conta Corrente</option>
                      <option value="poupanca">Poupança</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Conta
                    </label>
                    <input
                      type="text"
                      value={dados.dadosBancarios.conta}
                      onChange={(e) => updateDadosBancarios('conta', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="00000-0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PIX (CPF, Email, Celular ou Chave Aleatória)
                    </label>
                    <input
                      type="text"
                      value={dados.dadosBancarios.pix}
                      onChange={(e) => updateDadosBancarios('pix', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="CPF, email, celular ou chave aleatória"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Beneficiário
                    </label>
                    <input
                      type="text"
                      value={dados.dadosBancarios.nomeBeneficiario}
                      onChange={(e) => updateDadosBancarios('nomeBeneficiario', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="Nome completo do titular da conta"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Etapa: Estado Civil */}
            {etapaAtiva === 'conjugal' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Estado Civil</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado Civil
                  </label>
                  <select
                    value={dados.estadoCivil}
                    onChange={(e) => updateDados('estadoCivil', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="solteiro">Solteiro(a)</option>
                    <option value="casado">Casado(a)</option>
                    <option value="divorciado">Divorciado(a)</option>
                    <option value="viuvo">Viúvo(a)</option>
                    <option value="uniao_estavel">União Estável</option>
                  </select>
                </div>

                {(dados.estadoCivil === 'casado' || dados.estadoCivil === 'uniao_estavel') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Regime de Bens
                      </label>
                      <select
                        value={dados.regimeBens || ''}
                        onChange={(e) => updateDados('regimeBens', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Selecione o regime</option>
                        <option value="comunhao_total">Comunhão Total de Bens</option>
                        <option value="comunhao_parcial">Comunhão Parcial de Bens</option>
                        <option value="separacao_bens">Separação de Bens</option>
                      </select>
                    </div>

                    {(dados.regimeBens === 'comunhao_total' || dados.regimeBens === 'comunhao_parcial') && (
                      <div className="border rounded-lg p-6 bg-blue-50">
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Dados do Cônjuge</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nome Completo do Cônjuge
                            </label>
                            <input
                              type="text"
                              value={dados.dadosConjuge?.nome || ''}
                              onChange={(e) => updateDadosConjuge('nome', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                              placeholder="Nome completo"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              CPF do Cônjuge
                            </label>
                            <input
                              type="text"
                              value={dados.dadosConjuge?.cpf || ''}
                              onChange={(e) => updateDadosConjuge('cpf', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                              placeholder="000.000.000-00"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              RG do Cônjuge
                            </label>
                            <input
                              type="text"
                              value={dados.dadosConjuge?.rg || ''}
                              onChange={(e) => updateDadosConjuge('rg', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                              placeholder="00.000.000-0"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Telefone do Cônjuge
                            </label>
                            <input
                              type="tel"
                              value={dados.dadosConjuge?.telefone || ''}
                              onChange={(e) => updateDadosConjuge('telefone', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                              placeholder="(11) 99999-9999"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email do Cônjuge
                            </label>
                            <input
                              type="email"
                              value={dados.dadosConjuge?.email || ''}
                              onChange={(e) => updateDadosConjuge('email', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                              placeholder="email@exemplo.com"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações Gerais
                  </label>
                  <textarea
                    value={dados.observacoes}
                    onChange={(e) => updateDados('observacoes', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Informações adicionais relevantes..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer com botões */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
            <div className="text-sm text-gray-600">
              {etapas.findIndex(e => e.id === etapaAtiva) + 1} de {etapas.length} etapas
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onFechar}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                disabled={enviando}
              >
                Cancelar
              </button>
              
              {etapas.findIndex(e => e.id === etapaAtiva) > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = etapas.findIndex(e => e.id === etapaAtiva);
                    if (currentIndex > 0) {
                      setEtapaAtiva(etapas[currentIndex - 1].id as any);
                    }
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                  disabled={enviando}
                >
                  Voltar
                </button>
              )}
              
              {etapas.findIndex(e => e.id === etapaAtiva) < etapas.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = etapas.findIndex(e => e.id === etapaAtiva);
                    if (currentIndex < etapas.length - 1) {
                      setEtapaAtiva(etapas[currentIndex + 1].id as any);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={enviando}
                >
                  Próximo
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                  disabled={enviando}
                >
                  {enviando ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Finalizar Cadastro
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioCompletoLead;