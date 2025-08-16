import React, { useState, useEffect } from 'react';
import {
  Upload,
  Search,
  FileText,
  Table,
  AlertTriangle,
  CheckCircle,
  X,
  RefreshCw,
  Download,
  Eye,
  TrendingUp,
  TrendingDown,
  Percent
} from 'lucide-react';

interface Empreendimento {
  id: string;
  nome: string;
  incorporadora: string;
  imagem: string;
  totalUnidades: number;
  unidadesDisponiveis: number;
  valorMedio: number;
  status: 'lancamento' | 'em_construcao' | 'pronto' | 'vendido';
}

interface Unidade {
  id: string;
  codigo: string;
  tipo: string;
  metragem: number;
  valorAtual: number;
  condicaoPagamento: {
    entrada: number;
    parcelas: number;
    valorParcela: number;
    reforcos?: number[];
    chaves: number;
  };
  status: 'disponivel' | 'reservada' | 'vendida';
}

interface UnidadeComparacao {
  unidade: Unidade;
  valorNovo: number;
  condicaoNova: any;
  diferencaValor: number;
  diferencaPercentual: number;
  status: 'aumentou' | 'diminuiu' | 'igual';
}

interface TabelaProcessada {
  empreendimentoId: string;
  dataProcessamento: string;
  totalUnidades: number;
  unidadesAfetadas: number;
  arquivo: string;
  comparacoes: UnidadeComparacao[];
}

const AtualizadorTabelasEmpreendimento: React.FC = () => {
  const [step, setStep] = useState<'selecao' | 'configuracao' | 'upload' | 'revisao' | 'processamento'>('selecao');
  const [empreendimentos, setEmpreendimentos] = useState<Empreendimento[]>([]);
  const [empreendimentoSelecionado, setEmpreendimentoSelecionado] = useState<Empreendimento | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [tipoAtualizacao, setTipoAtualizacao] = useState<'substituir' | 'ajustar'>('substituir');
  const [ajuste, setAjuste] = useState({ tipo: 'valor', valor: 0, operacao: 'aumentar' });
  const [tabelaProcessada, setTabelaProcessada] = useState<TabelaProcessada | null>(null);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    carregarEmpreendimentos();
  }, []);

  const carregarEmpreendimentos = () => {
    // Simular carregamento de empreendimentos
    const empreendimentosSimulados: Empreendimento[] = [
      {
        id: 'emp_1',
        nome: 'Residencial Jardim das Flores',
        incorporadora: 'Construtora ABC',
        imagem: '/api/placeholder/300/200',
        totalUnidades: 120,
        unidadesDisponiveis: 45,
        valorMedio: 350000,
        status: 'em_construcao'
      },
      {
        id: 'emp_2',
        nome: 'Edifício Sky Tower',
        incorporadora: 'Incorporadora XYZ',
        imagem: '/api/placeholder/300/200',
        totalUnidades: 80,
        unidadesDisponiveis: 12,
        valorMedio: 750000,
        status: 'lancamento'
      },
      {
        id: 'emp_3',
        nome: 'Condomínio Vila Verde',
        incorporadora: 'Green Buildings',
        imagem: '/api/placeholder/300/200',
        totalUnidades: 200,
        unidadesDisponiveis: 89,
        valorMedio: 280000,
        status: 'em_construcao'
      }
    ];
    setEmpreendimentos(empreendimentosSimulados);
  };

  const empreendimentosFiltrados = empreendimentos.filter(emp =>
    emp.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.incorporadora.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];
      
      if (allowedTypes.includes(file.type)) {
        setArquivo(file);
        setErro(null);
      } else {
        setErro('Tipo de arquivo não suportado. Use PDF, Excel (.xlsx, .xls) ou CSV.');
      }
    }
  };

  const processarArquivo = async () => {
    if (!arquivo || !empreendimentoSelecionado) return;

    setProcessando(true);
    setStep('processamento');

    try {
      // Simular processamento de arquivo
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simular dados processados
      const unidadesComparacao: UnidadeComparacao[] = [];
      
      // Gerar comparações simuladas
      for (let i = 1; i <= 20; i++) {
        const valorAtual = 300000 + (Math.random() * 200000);
        const novoValor = valorAtual * (0.95 + Math.random() * 0.1); // Variação de -5% a +5%
        const diferenca = novoValor - valorAtual;
        const percentual = (diferenca / valorAtual) * 100;

        unidadesComparacao.push({
          unidade: {
            id: `unit_${i}`,
            codigo: `${empreendimentoSelecionado.nome.slice(0, 3).toUpperCase()}-${i.toString().padStart(3, '0')}`,
            tipo: Math.random() > 0.5 ? 'Apartamento' : 'Cobertura',
            metragem: 60 + Math.random() * 80,
            valorAtual,
            condicaoPagamento: {
              entrada: valorAtual * 0.3,
              parcelas: 60,
              valorParcela: (valorAtual * 0.7) / 60,
              chaves: valorAtual * 0.1
            },
            status: 'disponivel'
          },
          valorNovo: novoValor,
          condicaoNova: {
            entrada: novoValor * 0.3,
            parcelas: 60,
            valorParcela: (novoValor * 0.7) / 60,
            chaves: novoValor * 0.1
          },
          diferencaValor: diferenca,
          diferencaPercentual: percentual,
          status: diferenca > 0 ? 'aumentou' : diferenca < 0 ? 'diminuiu' : 'igual'
        });
      }

      const tabelaProcessadaResult: TabelaProcessada = {
        empreendimentoId: empreendimentoSelecionado.id,
        dataProcessamento: new Date().toISOString(),
        totalUnidades: unidadesComparacao.length,
        unidadesAfetadas: unidadesComparacao.filter(u => u.status !== 'igual').length,
        arquivo: arquivo.name,
        comparacoes: unidadesComparacao
      };

      setTabelaProcessada(tabelaProcessadaResult);
      setStep('revisao');
    } catch (error) {
      setErro('Erro ao processar arquivo. Verifique o formato e tente novamente.');
    } finally {
      setProcessando(false);
    }
  };

  const aplicarAlteracoes = async () => {
    if (!tabelaProcessada) return;

    setProcessando(true);
    try {
      // Simular aplicação das alterações
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Tabela atualizada com sucesso! As alterações foram aplicadas ao empreendimento.');
      resetarFormulario();
    } catch (error) {
      setErro('Erro ao aplicar alterações. Tente novamente.');
    } finally {
      setProcessando(false);
    }
  };

  const reverterAlteracoes = () => {
    setTabelaProcessada(null);
    setStep('upload');
  };

  const resetarFormulario = () => {
    setStep('selecao');
    setEmpreendimentoSelecionado(null);
    setArquivo(null);
    setTabelaProcessada(null);
    setErro(null);
    setSearchTerm('');
    setShowSearch(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aumentou': return 'text-green-600 bg-green-100';
      case 'diminuiu': return 'text-red-600 bg-red-100';
      case 'igual': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderSelecaoEmpreendimento = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Selecionar Empreendimento</h2>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Search className="h-4 w-4" />
          Buscar
        </button>
      </div>

      {showSearch && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <input
            type="text"
            placeholder="Buscar por nome do empreendimento ou incorporadora..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {empreendimentosFiltrados.map((emp) => (
          <div
            key={emp.id}
            className={`relative bg-white rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
              empreendimentoSelecionado?.id === emp.id ? 'border-blue-500 shadow-lg' : 'border-gray-200'
            }`}
            onClick={() => setEmpreendimentoSelecionado(emp)}
          >
            <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
              <img
                src={emp.imagem}
                alt={emp.nome}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{emp.nome}</h3>
              <p className="text-sm text-gray-600 mb-3">{emp.incorporadora}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total de unidades:</span>
                  <span className="font-medium">{emp.totalUnidades}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Disponíveis:</span>
                  <span className="font-medium text-green-600">{emp.unidadesDisponiveis}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor médio:</span>
                  <span className="font-medium">{formatCurrency(emp.valorMedio)}</span>
                </div>
              </div>

              <div className="mt-3">
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  emp.status === 'lancamento' ? 'bg-blue-100 text-blue-800' :
                  emp.status === 'em_construcao' ? 'bg-yellow-100 text-yellow-800' :
                  emp.status === 'pronto' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {emp.status === 'lancamento' ? 'Lançamento' :
                   emp.status === 'em_construcao' ? 'Em Construção' :
                   emp.status === 'pronto' ? 'Pronto' : 'Vendido'}
                </span>
              </div>

              {empreendimentoSelecionado?.id === emp.id && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {empreendimentoSelecionado && (
        <div className="flex justify-end">
          <button
            onClick={() => setStep('configuracao')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Continuar
          </button>
        </div>
      )}
    </div>
  );

  const renderConfiguracaoAtualizacao = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configurar Atualização</h2>
        <p className="text-gray-600">
          Empreendimento selecionado: <strong>{empreendimentoSelecionado?.nome}</strong>
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Tipo de Atualização</h3>
        
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="tipoAtualizacao"
              value="substituir"
              checked={tipoAtualizacao === 'substituir'}
              onChange={(e) => setTipoAtualizacao(e.target.value as any)}
              className="mr-3"
            />
            <div>
              <span className="font-medium">Substituir tabela completa</span>
              <p className="text-sm text-gray-600">
                Substituir todos os valores pelas informações do arquivo enviado
              </p>
            </div>
          </label>

          <label className="flex items-center">
            <input
              type="radio"
              name="tipoAtualizacao"
              value="ajustar"
              checked={tipoAtualizacao === 'ajustar'}
              onChange={(e) => setTipoAtualizacao(e.target.value as any)}
              className="mr-3"
            />
            <div>
              <span className="font-medium">Ajustar valores existentes</span>
              <p className="text-sm text-gray-600">
                Aplicar ajuste em massa nos valores atuais antes de processar o arquivo
              </p>
            </div>
          </label>
        </div>

        {tipoAtualizacao === 'ajustar' && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Configuração do Ajuste</h4>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de ajuste
                </label>
                <select
                  value={ajuste.tipo}
                  onChange={(e) => setAjuste({...ajuste, tipo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="valor">Valor fixo (R$)</option>
                  <option value="percentual">Percentual (%)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Operação
                </label>
                <select
                  value={ajuste.operacao}
                  onChange={(e) => setAjuste({...ajuste, operacao: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="aumentar">Aumentar</option>
                  <option value="diminuir">Diminuir</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor
                </label>
                <input
                  type="number"
                  value={ajuste.valor}
                  onChange={(e) => setAjuste({...ajuste, valor: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder={ajuste.tipo === 'valor' ? '10000' : '5'}
                />
              </div>
            </div>

            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Prévia:</strong> {ajuste.operacao === 'aumentar' ? 'Aumentar' : 'Diminuir'} {' '}
                {ajuste.tipo === 'valor' ? formatCurrency(ajuste.valor) : `${ajuste.valor}%`} em todas as unidades
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep('selecao')}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Voltar
        </button>
        <button
          onClick={() => setStep('upload')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Continuar
        </button>
      </div>
    </div>
  );

  const renderUploadArquivo = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload da Tabela</h2>
        <p className="text-gray-600">
          Envie o arquivo com a nova tabela de preços para {empreendimentoSelecionado?.nome}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">
              Arraste e solte o arquivo aqui
            </p>
            <p className="text-gray-600">
              ou clique para selecionar
            </p>
          </div>

          <input
            type="file"
            onChange={handleFileUpload}
            accept=".pdf,.xlsx,.xls,.csv"
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            Selecionar Arquivo
          </label>

          <div className="mt-4 text-sm text-gray-500">
            Formatos aceitos: PDF, Excel (.xlsx, .xls), CSV
          </div>
        </div>

        {arquivo && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-green-600" />
              <div className="flex-1">
                <p className="font-medium text-green-900">{arquivo.name}</p>
                <p className="text-sm text-green-700">
                  {(arquivo.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={() => setArquivo(null)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {erro && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <p className="text-red-800">{erro}</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Formato esperado do arquivo:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>PDF:</strong> Será convertido automaticamente em planilha</li>
          <li>• <strong>Excel/CSV:</strong> Colunas esperadas: Unidade, Valor, Entrada, Parcelas, Chaves</li>
          <li>• <strong>Condições de pagamento:</strong> Entrada (%), Parcelas (qtd), Reforços (valores), Chaves (%)</li>
        </ul>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep('configuracao')}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Voltar
        </button>
        <button
          onClick={processarArquivo}
          disabled={!arquivo}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Processar Arquivo
        </button>
      </div>
    </div>
  );

  const renderProcessamento = () => (
    <div className="text-center space-y-6">
      <div className="animate-spin mx-auto">
        <RefreshCw className="h-16 w-16 text-blue-600" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Processando Arquivo</h2>
        <p className="text-gray-600">
          Analisando e comparando os dados da nova tabela...
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800">
          Este processo pode levar alguns minutos, dependendo do tamanho do arquivo.
        </p>
      </div>
    </div>
  );

  const renderRevisao = () => {
    if (!tabelaProcessada) return null;

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Revisar Alterações</h2>
          <p className="text-gray-600">
            Verifique as alterações antes de aplicar à tabela do empreendimento
          </p>
        </div>

        {/* Resumo das alterações */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Table className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Total de Unidades</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {tabelaProcessada.totalUnidades}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-600" />
              <span className="font-medium">Unidades Afetadas</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {tabelaProcessada.unidadesAfetadas}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="font-medium">Aumentos</span>
            </div>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {tabelaProcessada.comparacoes.filter(c => c.status === 'aumentou').length}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <span className="font-medium">Reduções</span>
            </div>
            <p className="text-2xl font-bold text-red-600 mt-2">
              {tabelaProcessada.comparacoes.filter(c => c.status === 'diminuiu').length}
            </p>
          </div>
        </div>

        {/* Tabela de comparação */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Comparação de Valores</h3>
          </div>
          
          <div className="overflow-x-auto max-h-96">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Atual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Novo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Diferença
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tabelaProcessada.comparacoes.map((comp, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {comp.unidade.codigo}
                        </div>
                        <div className="text-sm text-gray-500">
                          {comp.unidade.tipo} - {comp.unidade.metragem.toFixed(0)}m²
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(comp.unidade.valorAtual)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(comp.valorNovo)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        comp.status === 'aumentou' ? 'text-green-600' :
                        comp.status === 'diminuiu' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {comp.diferencaValor > 0 ? '+' : ''}{formatCurrency(comp.diferencaValor)}
                      </div>
                      <div className={`text-xs ${
                        comp.status === 'aumentou' ? 'text-green-500' :
                        comp.status === 'diminuiu' ? 'text-red-500' :
                        'text-gray-500'
                      }`}>
                        {comp.diferencaPercentual > 0 ? '+' : ''}{comp.diferencaPercentual.toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(comp.status)}`}>
                        {comp.status === 'aumentou' ? 'Aumentou' :
                         comp.status === 'diminuiu' ? 'Diminuiu' : 'Igual'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-between">
          <button
            onClick={reverterAlteracoes}
            className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Reverter Alterações
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                // Baixar relatório de comparação
                alert('Funcionalidade de download será implementada');
              }}
              className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <Download className="h-4 w-4" />
              Baixar Relatório
            </button>
            
            <button
              onClick={aplicarAlteracoes}
              disabled={processando}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              <CheckCircle className="h-4 w-4" />
              {processando ? 'Aplicando...' : 'Confirmar Alterações'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Atualizador de Tabelas</h1>
              <p className="text-gray-600 mt-2">
                Importe e atualize tabelas de preços dos empreendimentos
              </p>
            </div>
            
            {step !== 'selecao' && (
              <button
                onClick={resetarFormulario}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <X className="h-4 w-4" />
                Cancelar
              </button>
            )}
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm">
            {[
              { key: 'selecao', label: 'Seleção' },
              { key: 'configuracao', label: 'Configuração' },
              { key: 'upload', label: 'Upload' },
              { key: 'revisao', label: 'Revisão' }
            ].map((stepItem, index) => (
              <div
                key={stepItem.key}
                className={`flex items-center ${index < 3 ? 'flex-1' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === stepItem.key ? 'bg-blue-600 text-white' :
                  ['selecao', 'configuracao', 'upload', 'revisao'].indexOf(step) > index ? 'bg-green-600 text-white' :
                  'bg-gray-300 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <span className={`ml-2 ${
                  step === stepItem.key ? 'text-blue-600 font-medium' : 'text-gray-600'
                }`}>
                  {stepItem.label}
                </span>
                {index < 3 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    ['selecao', 'configuracao', 'upload', 'revisao'].indexOf(step) > index ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {step === 'selecao' && renderSelecaoEmpreendimento()}
          {step === 'configuracao' && renderConfiguracaoAtualizacao()}
          {step === 'upload' && renderUploadArquivo()}
          {step === 'processamento' && renderProcessamento()}
          {step === 'revisao' && renderRevisao()}
        </div>
      </div>
    </div>
  );
};

export default AtualizadorTabelasEmpreendimento;