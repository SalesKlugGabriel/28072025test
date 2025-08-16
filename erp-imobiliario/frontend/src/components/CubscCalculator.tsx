import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Calendar, DollarSign, Info, Loader2 } from 'lucide-react';
import { 
  cubscService, 
  CUBSCData, 
  ValorCorrigido, 
  formatarMoeda, 
  formatarPercentual,
  obterMesesDisponiveis 
} from '../services/cubscIntegration';

interface CubscCalculatorProps {
  valorInicial?: number;
  onResultado?: (resultado: ValorCorrigido) => void;
}

export default function CubscCalculator({ valorInicial = 0, onResultado }: CubscCalculatorProps) {
  const [valor, setValor] = useState(valorInicial);
  const [mesInicial, setMesInicial] = useState(1);
  const [anoInicial, setAnoInicial] = useState(2023);
  const [mesFinal, setMesFinal] = useState(new Date().getMonth() + 1);
  const [anoFinal, setAnoFinal] = useState(new Date().getFullYear());
  const [resultado, setResultado] = useState<ValorCorrigido | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [historico, setHistorico] = useState<CUBSCData[]>([]);

  const meses = obterMesesDisponiveis();
  const anoAtual = new Date().getFullYear();
  const anos = Array.from({ length: anoAtual - 2009 }, (_, i) => 2010 + i);

  useEffect(() => {
    if (valorInicial > 0) {
      setValor(valorInicial);
    }
  }, [valorInicial]);

  const calcularCorrecao = async () => {
    if (!valor || valor <= 0) {
      setErro('Informe um valor válido');
      return;
    }

    if (!cubscService.validarPeriodo(mesInicial, anoInicial) || 
        !cubscService.validarPeriodo(mesFinal, anoFinal)) {
      setErro('Período inválido');
      return;
    }

    if (new Date(anoInicial, mesInicial - 1) >= new Date(anoFinal, mesFinal - 1)) {
      setErro('A data inicial deve ser anterior à data final');
      return;
    }

    setLoading(true);
    setErro(null);

    try {
      const resultadoCalculo = await cubscService.calcularCorrecao(
        valor,
        mesInicial,
        anoInicial,
        mesFinal,
        anoFinal
      );
      
      setResultado(resultadoCalculo);
      onResultado?.(resultadoCalculo);
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const carregarHistorico = async () => {
    try {
      const dados = await cubscService.obterHistorico(anoFinal - 1, anoFinal);
      setHistorico(dados.slice(0, 6)); // Últimos 6 meses
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  useEffect(() => {
    carregarHistorico();
  }, [anoFinal]);

  return (
    <div className="space-y-6">
      {/* Formulário de cálculo */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Correção CUBSC
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Valor */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-blue-700 mb-2">
              Valor a ser corrigido
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 w-4 h-4" />
              <input
                type="number"
                value={valor || ''}
                onChange={(e) => setValor(Number(e.target.value))}
                className="w-full pl-10 pr-3 py-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 450000"
              />
            </div>
          </div>

          {/* Período inicial */}
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-2">
              Período inicial
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={mesInicial}
                onChange={(e) => setMesInicial(Number(e.target.value))}
                className="border border-blue-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                {meses.map(mes => (
                  <option key={mes.valor} value={mes.valor}>
                    {mes.nome}
                  </option>
                ))}
              </select>
              <select
                value={anoInicial}
                onChange={(e) => setAnoInicial(Number(e.target.value))}
                className="border border-blue-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                {anos.map(ano => (
                  <option key={ano} value={ano}>
                    {ano}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Período final */}
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-2">
              Período final
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={mesFinal}
                onChange={(e) => setMesFinal(Number(e.target.value))}
                className="border border-blue-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                {meses.map(mes => (
                  <option key={mes.valor} value={mes.valor}>
                    {mes.nome}
                  </option>
                ))}
              </select>
              <select
                value={anoFinal}
                onChange={(e) => setAnoFinal(Number(e.target.value))}
                className="border border-blue-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                {anos.map(ano => (
                  <option key={ano} value={ano}>
                    {ano}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Botão calcular */}
        <button
          onClick={calcularCorrecao}
          disabled={loading || !valor}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Calculando...
            </>
          ) : (
            <>
              <Calculator className="w-4 h-4" />
              Calcular Correção
            </>
          )}
        </button>

        {/* Erro */}
        {erro && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{erro}</p>
          </div>
        )}
      </div>

      {/* Resultado */}
      {resultado && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <h4 className="font-medium text-green-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Resultado da Correção
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded p-3 border border-green-200">
              <p className="text-xs text-green-600 mb-1">Valor original</p>
              <p className="text-lg font-semibold text-green-900">
                {formatarMoeda(resultado.valorOriginal)}
              </p>
            </div>
            <div className="bg-white rounded p-3 border border-green-200">
              <p className="text-xs text-green-600 mb-1">Valor corrigido</p>
              <p className="text-lg font-semibold text-green-900">
                {formatarMoeda(resultado.valorCorrigido)}
              </p>
            </div>
            <div className="bg-white rounded p-3 border border-green-200">
              <p className="text-xs text-green-600 mb-1">Variação</p>
              <p className={`text-lg font-semibold ${
                resultado.detalhes.variacao >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatarPercentual(resultado.detalhes.variacao)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-green-600">CUBSC {resultado.periodoInicial}:</p>
              <p className="font-medium text-green-900">
                {formatarMoeda(resultado.detalhes.cubscInicial)}
              </p>
            </div>
            <div>
              <p className="text-green-600">CUBSC {resultado.periodoFinal}:</p>
              <p className="font-medium text-green-900">
                {formatarMoeda(resultado.detalhes.cubscFinal)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Histórico recente */}
      {historico.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Histórico Recente CUBSC
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {historico.map((item, index) => (
              <div key={`${item.ano}-${item.mes}`} className="bg-white rounded p-3 border border-gray-200">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-medium text-gray-900">{item.mes}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.percentualVariacao >= 0 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {formatarPercentual(item.percentualVariacao)}
                  </span>
                </div>
                <p className="text-lg font-semibold text-gray-800">
                  {formatarMoeda(item.valor)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-700">
                <p className="font-medium mb-1">Sobre o CUBSC:</p>
                <p>O Custo Unitário Básico de Santa Catarina é publicado mensalmente e serve como base para correção de valores em contratos imobiliários.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}