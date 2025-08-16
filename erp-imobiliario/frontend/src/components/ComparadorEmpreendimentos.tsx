import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Filter, Search, Building, Bed, Car, MapPin, DollarSign, Share2, MessageCircle } from 'lucide-react';

interface EmpreendimentoComparacao {
  id: string;
  nome: string;
  localizacao: string;
  metragem: number;
  quartos: number;
  suites: number;
  vagasGaragem: number;
  lazer: string[];
  precoM2: number;
  precoTotal: number;
  statusObra: 'em_construcao' | 'pronto' | 'pre_lancamento';
  entrega: string;
  valorization: number; // Percentual de valorização
  imagem?: string;
}

// Mock data para demonstração
const mockEmpreendimentos: EmpreendimentoComparacao[] = [
  {
    id: '1',
    nome: 'Residencial Solar das Flores',
    localizacao: 'Centro, Florianópolis',
    metragem: 85,
    quartos: 3,
    suites: 1,
    vagasGaragem: 2,
    lazer: ['Piscina', 'Academia', 'Salão de Festas'],
    precoM2: 8500,
    precoTotal: 722500,
    statusObra: 'em_construcao',
    entrega: '2025-12-01',
    valorization: 12.5
  },
  {
    id: '2',
    nome: 'Ocean View Residence',
    localizacao: 'Beira Mar Norte, Florianópolis',
    metragem: 90,
    quartos: 3,
    suites: 2,
    vagasGaragem: 2,
    lazer: ['Piscina', 'Academia', 'SPA', 'Coworking'],
    precoM2: 12000,
    precoTotal: 1080000,
    statusObra: 'pre_lancamento',
    entrega: '2026-06-01',
    valorization: 18.2
  },
  {
    id: '3',
    nome: 'Ville Privilege',
    localizacao: 'Itacorubi, Florianópolis',
    metragem: 82,
    quartos: 3,
    suites: 1,
    vagasGaragem: 2,
    lazer: ['Piscina', 'Academia', 'Playground'],
    precoM2: 9200,
    precoTotal: 754400,
    statusObra: 'pronto',
    entrega: '2024-01-01',
    valorization: 8.5
  },
  {
    id: '4',
    nome: 'Green Towers',
    localizacao: 'Trindade, Florianópolis',
    metragem: 75,
    quartos: 2,
    suites: 1,
    vagasGaragem: 1,
    lazer: ['Piscina', 'Academia', 'Bike Park'],
    precoM2: 7800,
    precoTotal: 585000,
    statusObra: 'em_construcao',
    entrega: '2025-09-01',
    valorization: 15.1
  },
  {
    id: '5',
    nome: 'Harmony Residence',
    localizacao: 'Kobrasol, São José',
    metragem: 88,
    quartos: 3,
    suites: 1,
    vagasGaragem: 2,
    lazer: ['Piscina', 'Academia', 'Churrasqueira'],
    precoM2: 6500,
    precoTotal: 572000,
    statusObra: 'pronto',
    entrega: '2023-08-01',
    valorization: 5.2
  }
];

interface FiltrosComparacao {
  quartosMin: number;
  quartosMax: number;
  metragemMin: number;
  metragemMax: number;
  precoM2Max: number;
  vagasMin: number;
  statusObra: string;
  lazerRequerido: string[];
}

const ComparadorEmpreendimentos: React.FC = () => {
  const [empreendimentoReferencia, setEmpreendimentoReferencia] = useState<string>('');
  const [filtros, setFiltros] = useState<FiltrosComparacao>({
    quartosMin: 1,
    quartosMax: 5,
    metragemMin: 50,
    metragemMax: 200,
    precoM2Max: 15000,
    vagasMin: 1,
    statusObra: '',
    lazerRequerido: []
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [ordenacao, setOrdenacao] = useState<'preco' | 'metragem' | 'valorizacao'>('preco');

  const opcoesLazer = ['Piscina', 'Academia', 'Salão de Festas', 'SPA', 'Coworking', 'Playground', 'Bike Park', 'Churrasqueira'];

  const empreendimentosFiltrados = useMemo(() => {
    return mockEmpreendimentos.filter(emp => {
      const passaQuartos = emp.quartos >= filtros.quartosMin && emp.quartos <= filtros.quartosMax;
      const passaMetragem = emp.metragem >= filtros.metragemMin && emp.metragem <= filtros.metragemMax;
      const passaPreco = emp.precoM2 <= filtros.precoM2Max;
      const passaVagas = emp.vagasGaragem >= filtros.vagasMin;
      const passaStatus = !filtros.statusObra || emp.statusObra === filtros.statusObra;
      const passaLazer = filtros.lazerRequerido.length === 0 || 
        filtros.lazerRequerido.every(lazer => emp.lazer.includes(lazer));

      return passaQuartos && passaMetragem && passaPreco && passaVagas && passaStatus && passaLazer;
    }).sort((a, b) => {
      switch (ordenacao) {
        case 'preco':
          return a.precoM2 - b.precoM2;
        case 'metragem':
          return b.metragem - a.metragem;
        case 'valorizacao':
          return b.valorization - a.valorization;
        default:
          return 0;
      }
    });
  }, [filtros, ordenacao]);

  const estatisticas = useMemo(() => {
    if (empreendimentosFiltrados.length === 0) return null;

    const precos = empreendimentosFiltrados.map(e => e.precoM2);
    const valorizacoes = empreendimentosFiltrados.map(e => e.valorization);

    return {
      precoMedio: precos.reduce((acc, p) => acc + p, 0) / precos.length,
      precoMin: Math.min(...precos),
      precoMax: Math.max(...precos),
      valorizacaoMedia: valorizacoes.reduce((acc, v) => acc + v, 0) / valorizacoes.length,
      totalEmpreendimentos: empreendimentosFiltrados.length
    };
  }, [empreendimentosFiltrados]);

  const referencia = mockEmpreendimentos.find(e => e.id === empreendimentoReferencia);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };

  const compartilharViaWhatsApp = () => {
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    
    // Monta o texto da comparação
    let mensagem = `🏢 *COMPARAÇÃO DE EMPREENDIMENTOS* 🏢\n\n`;
    mensagem += `📊 *Análise Comparativa - ${dataAtual}*\n\n`;
    
    if (estatisticas) {
      mensagem += `📈 *RESUMO GERAL:*\n`;
      mensagem += `• ${estatisticas.totalEmpreendimentos} empreendimentos analisados\n`;
      mensagem += `• Preço médio/m²: ${formatCurrency(estatisticas.precoMedio)}\n`;
      mensagem += `• Faixa de preços: ${formatCurrency(estatisticas.precoMin)} - ${formatCurrency(estatisticas.precoMax)}\n`;
      mensagem += `• Valorização média: ${estatisticas.valorizacaoMedia.toFixed(1)}%\n\n`;
    }
    
    // Lista os empreendimentos filtrados
    mensagem += `🏡 *EMPREENDIMENTOS:*\n`;
    empreendimentosFiltrados.slice(0, 5).forEach((emp, index) => {
      mensagem += `\n${index + 1}. *${emp.nome}*\n`;
      mensagem += `   📍 ${emp.localizacao}\n`;
      mensagem += `   📐 ${emp.metragem}m² | ${emp.quartos} quartos | ${emp.vagasGaragem} vagas\n`;
      mensagem += `   💰 ${formatCurrency(emp.precoM2)}/m² | Total: ${formatCurrency(emp.precoTotal)}\n`;
      mensagem += `   📈 Valorização: ${emp.valorization}%\n`;
      mensagem += `   🏗️ Status: ${getStatusText(emp.statusObra)}\n`;
    });
    
    if (empreendimentosFiltrados.length > 5) {
      mensagem += `\n... e mais ${empreendimentosFiltrados.length - 5} empreendimentos\n`;
    }
    
    mensagem += `\n📅 *Dados atualizados em:* ${dataAtual}\n`;
    mensagem += `\n💼 *LegaSys ERP Imobiliário*\n`;
    mensagem += `Análise profissional de empreendimentos`;
    
    // Codifica a mensagem para URL
    const mensagemCodificada = encodeURIComponent(mensagem);
    
    // Abre o WhatsApp
    const urlWhatsApp = `https://wa.me/?text=${mensagemCodificada}`;
    window.open(urlWhatsApp, '_blank');
  };

  const copiarComparacao = async () => {
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    
    let texto = `COMPARAÇÃO DE EMPREENDIMENTOS - ${dataAtual}\n\n`;
    
    if (estatisticas) {
      texto += `RESUMO GERAL:\n`;
      texto += `• ${estatisticas.totalEmpreendimentos} empreendimentos analisados\n`;
      texto += `• Preço médio/m²: ${formatCurrency(estatisticas.precoMedio)}\n`;
      texto += `• Faixa de preços: ${formatCurrency(estatisticas.precoMin)} - ${formatCurrency(estatisticas.precoMax)}\n`;
      texto += `• Valorização média: ${estatisticas.valorizacaoMedia.toFixed(1)}%\n\n`;
    }
    
    texto += `EMPREENDIMENTOS:\n`;
    empreendimentosFiltrados.forEach((emp, index) => {
      texto += `\n${index + 1}. ${emp.nome}\n`;
      texto += `   Localização: ${emp.localizacao}\n`;
      texto += `   Área: ${emp.metragem}m² | ${emp.quartos} quartos | ${emp.vagasGaragem} vagas\n`;
      texto += `   Preço: ${formatCurrency(emp.precoM2)}/m² | Total: ${formatCurrency(emp.precoTotal)}\n`;
      texto += `   Valorização: ${emp.valorization}%\n`;
      texto += `   Status: ${getStatusText(emp.statusObra)}\n`;
    });
    
    try {
      await navigator.clipboard.writeText(texto);
      alert('Comparação copiada para a área de transferência!');
    } catch (err) {
      console.error('Erro ao copiar:', err);
      alert('Erro ao copiar. Tente selecionar e copiar manualmente.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pronto':
        return 'bg-green-100 text-green-800';
      case 'em_construcao':
        return 'bg-blue-100 text-blue-800';
      case 'pre_lancamento':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pronto':
        return 'Pronto';
      case 'em_construcao':
        return 'Em Construção';
      case 'pre_lancamento':
        return 'Pré-lançamento';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Comparador de Empreendimentos</h1>
                <p className="text-gray-600">Análise comparativa por m² e características similares</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={compartilharViaWhatsApp}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                title="Compartilhar via WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:block">Compartilhar WhatsApp</span>
                <span className="sm:hidden">WhatsApp</span>
              </button>
              <button
                onClick={copiarComparacao}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Copiar comparação"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:block">Copiar</span>
              </button>
              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:block">Filtros</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        {mostrarFiltros && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros de Comparação</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quartos (min-max)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filtros.quartosMin}
                    onChange={(e) => setFiltros(prev => ({ ...prev, quartosMin: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    min="1"
                  />
                  <input
                    type="number"
                    value={filtros.quartosMax}
                    onChange={(e) => setFiltros(prev => ({ ...prev, quartosMax: parseInt(e.target.value) || 5 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Metragem (m²)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filtros.metragemMin}
                    onChange={(e) => setFiltros(prev => ({ ...prev, metragemMin: parseInt(e.target.value) || 50 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="number"
                    value={filtros.metragemMax}
                    onChange={(e) => setFiltros(prev => ({ ...prev, metragemMax: parseInt(e.target.value) || 200 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preço máximo/m²</label>
                <input
                  type="number"
                  value={filtros.precoM2Max}
                  onChange={(e) => setFiltros(prev => ({ ...prev, precoM2Max: parseInt(e.target.value) || 15000 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status da Obra</label>
                <select
                  value={filtros.statusObra}
                  onChange={(e) => setFiltros(prev => ({ ...prev, statusObra: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Todos</option>
                  <option value="pronto">Pronto</option>
                  <option value="em_construcao">Em Construção</option>
                  <option value="pre_lancamento">Pré-lançamento</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Áreas de Lazer Desejadas</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {opcoesLazer.map(opcao => (
                  <label key={opcao} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filtros.lazerRequerido.includes(opcao)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFiltros(prev => ({ ...prev, lazerRequerido: [...prev.lazerRequerido, opcao] }));
                        } else {
                          setFiltros(prev => ({ ...prev, lazerRequerido: prev.lazerRequerido.filter(l => l !== opcao) }));
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">{opcao}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Estatísticas Gerais */}
        {estatisticas && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Análise do Mercado</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-900">{estatisticas.totalEmpreendimentos}</div>
                <div className="text-sm text-blue-700">Empreendimentos</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-900">{formatCurrency(estatisticas.precoMedio)}</div>
                <div className="text-sm text-green-700">Preço Médio/m²</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-900">{formatCurrency(estatisticas.precoMin)}</div>
                <div className="text-sm text-yellow-700">Menor Preço/m²</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-900">{formatCurrency(estatisticas.precoMax)}</div>
                <div className="text-sm text-red-700">Maior Preço/m²</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-900">{estatisticas.valorizacaoMedia.toFixed(1)}%</div>
                <div className="text-sm text-purple-700">Valorização Média</div>
              </div>
            </div>
          </div>
        )}

        {/* Ordenação */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="preco">Menor Preço/m²</option>
              <option value="metragem">Maior Metragem</option>
              <option value="valorizacao">Maior Valorização</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {empreendimentosFiltrados.length} empreendimento(s) encontrado(s)
          </div>
        </div>

        {/* Grid de Empreendimentos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {empreendimentosFiltrados.map((emp) => (
            <div key={emp.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <Building className="w-16 h-16 text-white" />
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{emp.nome}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(emp.statusObra)}`}>
                    {getStatusText(emp.statusObra)}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-gray-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{emp.localizacao}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Bed className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{emp.quartos} quartos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{emp.vagasGaragem} vagas</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-600">Metragem: {emp.metragem}m²</div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-green-600">{formatCurrency(emp.precoM2)}/m²</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">+{emp.valorization}%</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Total: {formatCurrency(emp.precoTotal)}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-xs text-gray-500 mb-2">Lazer disponível:</div>
                  <div className="flex flex-wrap gap-1">
                    {emp.lazer.slice(0, 3).map((item, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {item}
                      </span>
                    ))}
                    {emp.lazer.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{emp.lazer.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {empreendimentosFiltrados.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum empreendimento encontrado</h3>
            <p className="text-gray-600">Ajuste os filtros para ver mais resultados</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparadorEmpreendimentos;