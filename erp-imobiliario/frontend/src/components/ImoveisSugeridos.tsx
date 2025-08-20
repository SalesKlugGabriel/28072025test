import React, { useState, useMemo } from 'react';
import { 
  Building, Home, Car, Users, MapPin, DollarSign, 
  Check, X, Filter, ArrowRight, Send, Eye, Heart,
  Bed, Bath, Square, Star, ChevronDown
} from 'lucide-react';

interface Unidade {
  id: string;
  numero: string;
  dormitorios: number;
  suites: number;
  vagas: number;
  area: number;
  valor: number;
  andar: number;
  posicao: string;
  disponivel: boolean;
  terceiro?: boolean;
  empreendimento: {
    id: string;
    nome: string;
    endereco: string;
    bairro: string;
    cidade: string;
    distanciaMar?: number;
    foto?: string;
    construtora: string;
    entrega: string;
  };
  condicoesPagamento: string;
  fotos: string[];
  landingPage?: string;
  compatibilidade: number; // Score de 0-100 baseado no perfil do lead
}

interface PerfilLead {
  dormitorios?: number;
  suites?: number;
  vagas?: number;
  localizacao?: string;
  valorMinimo?: number;
  valorMaximo?: number;
  distanciaMar?: number;
}

interface ImoveisSugeridosProps {
  perfilLead: PerfilLead;
  onEnviarLead: (unidade: Unidade) => void;
  onClose: () => void;
}

// Mock de dados - em produção viria do backend
const mockUnidades: Unidade[] = [
  {
    id: '1',
    numero: '804',
    dormitorios: 3,
    suites: 1,
    vagas: 2,
    area: 89.5,
    valor: 450000,
    andar: 8,
    posicao: 'Nascente',
    disponivel: true,
    terceiro: false,
    empreendimento: {
      id: 'emp1',
      nome: 'Residencial Solar das Flores',
      endereco: 'Rua das Palmeiras, 123',
      bairro: 'Centro',
      cidade: 'Florianópolis',
      distanciaMar: 0.5,
      construtora: 'Construtora ABC',
      entrega: 'Dezembro 2025'
    },
    condicoesPagamento: 'Sinal 30% + Financiamento 70% em 240x. FGTS aceito. Entrada parcelável em 12x sem juros.',
    fotos: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    landingPage: 'https://exemplo.com/solar-flores',
    compatibilidade: 95
  },
  {
    id: '2',
    numero: '1205',
    dormitorios: 3,
    suites: 2,
    vagas: 2,
    area: 105.8,
    valor: 520000,
    andar: 12,
    posicao: 'Norte',
    disponivel: true,
    terceiro: false,
    empreendimento: {
      id: 'emp2',
      nome: 'Edifício Vista Mar',
      endereco: 'Av. Beira Mar Norte, 456',
      bairro: 'Centro',
      cidade: 'Florianópolis',
      distanciaMar: 0.1,
      construtora: 'Construtora XYZ',
      entrega: 'Junho 2026'
    },
    condicoesPagamento: 'Sinal 20% + Financiamento 80% em 360x. Subsídio Casa Verde e Amarela disponível.',
    fotos: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    landingPage: 'https://exemplo.com/vista-mar',
    compatibilidade: 88
  },
  {
    id: '3',
    numero: 'T301',
    dormitorios: 2,
    suites: 1,
    vagas: 1,
    area: 68.2,
    valor: 380000,
    andar: 3,
    posicao: 'Sul',
    disponivel: true,
    terceiro: true,
    empreendimento: {
      id: 'emp3',
      nome: 'Condomínio Green Park',
      endereco: 'Rua dos Ipês, 789',
      bairro: 'Trindade',
      cidade: 'Florianópolis',
      distanciaMar: 3.2,
      construtora: 'Imobiliária DEF',
      entrega: 'Pronto para morar'
    },
    condicoesPagamento: 'À vista com 15% de desconto ou financiamento direto com a proprietária em 120x.',
    fotos: ['/api/placeholder/400/300'],
    landingPage: 'https://exemplo.com/green-park',
    compatibilidade: 70
  }
];

const ImoveisSugeridos: React.FC<ImoveisSugeridosProps> = ({ 
  perfilLead, 
  onEnviarLead, 
  onClose 
}) => {
  const [filtroOrdem, setFiltroOrdem] = useState<'compatibilidade' | 'valor' | 'area'>('compatibilidade');
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<Unidade | null>(null);
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);

  // Filtrar e ordenar unidades baseado no perfil do lead
  const unidadesFiltradas = useMemo(() => {
    let unidades = mockUnidades.filter(unidade => {
      // Filtros baseados no perfil
      if (perfilLead.valorMinimo && unidade.valor < perfilLead.valorMinimo) return false;
      if (perfilLead.valorMaximo && unidade.valor > perfilLead.valorMaximo) return false;
      
      return unidade.disponivel;
    });

    // Calcular compatibilidade baseada no perfil
    unidades = unidades.map(unidade => {
      let score = 0;
      let totalCriterios = 0;

      // Dormitórios
      if (perfilLead.dormitorios) {
        totalCriterios++;
        if (unidade.dormitorios === perfilLead.dormitorios) score += 25;
        else if (Math.abs(unidade.dormitorios - perfilLead.dormitorios) <= 1) score += 15;
      }

      // Suítes
      if (perfilLead.suites) {
        totalCriterios++;
        if (unidade.suites >= perfilLead.suites) score += 20;
      }

      // Vagas
      if (perfilLead.vagas) {
        totalCriterios++;
        if (unidade.vagas >= perfilLead.vagas) score += 20;
      }

      // Localização (simplificado)
      if (perfilLead.localizacao) {
        totalCriterios++;
        if (unidade.empreendimento.bairro.toLowerCase().includes(perfilLead.localizacao.toLowerCase()) ||
            unidade.empreendimento.cidade.toLowerCase().includes(perfilLead.localizacao.toLowerCase())) {
          score += 25;
        }
      }

      // Distância do mar
      if (perfilLead.distanciaMar && unidade.empreendimento.distanciaMar) {
        totalCriterios++;
        if (unidade.empreendimento.distanciaMar <= perfilLead.distanciaMar) {
          score += 10;
        }
      }

      return {
        ...unidade,
        compatibilidade: totalCriterios > 0 ? Math.round(score * (100 / (totalCriterios * 25))) : 50
      };
    });

    // Ordenar
    switch (filtroOrdem) {
      case 'compatibilidade':
        return unidades.sort((a, b) => b.compatibilidade - a.compatibilidade);
      case 'valor':
        return unidades.sort((a, b) => a.valor - b.valor);
      case 'area':
        return unidades.sort((a, b) => b.area - a.area);
      default:
        return unidades;
    }
  }, [perfilLead, filtroOrdem]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getCompatibilidadeColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const verificarCompatibilidade = (unidade: Unidade) => {
    const criterios = [
      {
        nome: 'Dormitórios',
        esperado: perfilLead.dormitorios,
        atual: unidade.dormitorios,
        compativel: !perfilLead.dormitorios || unidade.dormitorios >= (perfilLead.dormitorios - 1)
      },
      {
        nome: 'Suítes',
        esperado: perfilLead.suites,
        atual: unidade.suites,
        compativel: !perfilLead.suites || unidade.suites >= perfilLead.suites
      },
      {
        nome: 'Vagas',
        esperado: perfilLead.vagas,
        atual: unidade.vagas,
        compativel: !perfilLead.vagas || unidade.vagas >= perfilLead.vagas
      },
      {
        nome: 'Valor',
        esperado: perfilLead.valorMaximo ? formatCurrency(perfilLead.valorMaximo) : null,
        atual: formatCurrency(unidade.valor),
        compativel: !perfilLead.valorMaximo || unidade.valor <= perfilLead.valorMaximo
      },
      {
        nome: 'Localização',
        esperado: perfilLead.localizacao,
        atual: `${unidade.empreendimento.bairro}, ${unidade.empreendimento.cidade}`,
        compativel: !perfilLead.localizacao || 
          unidade.empreendimento.bairro.toLowerCase().includes(perfilLead.localizacao.toLowerCase()) ||
          unidade.empreendimento.cidade.toLowerCase().includes(perfilLead.localizacao.toLowerCase())
      }
    ].filter(c => c.esperado !== undefined && c.esperado !== null && c.esperado !== '');

    return criterios;
  };

  const handleEnviarLead = (unidade: Unidade) => {
    onEnviarLead(unidade);
    setMostrarDetalhes(false);
    setUnidadeSelecionada(null);
  };

  if (mostrarDetalhes && unidadeSelecionada) {
    const criterios = verificarCompatibilidade(unidadeSelecionada);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {unidadeSelecionada.empreendimento.nome}
                </h2>
                <p className="text-sm text-gray-600">
                  Unidade {unidadeSelecionada.numero} - {unidadeSelecionada.andar}º andar
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getCompatibilidadeColor(unidadeSelecionada.compatibilidade)}`}>
                  {unidadeSelecionada.compatibilidade}% compatível
                </div>
                <button
                  onClick={() => setMostrarDetalhes(false)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex max-h-[calc(90vh-200px)]">
            {/* Detalhes da Unidade */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informações Básicas */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Área</div>
                      <div className="font-medium">{unidadeSelecionada.area}m²</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Valor</div>
                      <div className="font-medium text-green-600">{formatCurrency(unidadeSelecionada.valor)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Bed className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                      <div className="text-sm font-medium">{unidadeSelecionada.dormitorios}</div>
                      <div className="text-xs text-gray-500">Quartos</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Bath className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                      <div className="text-sm font-medium">{unidadeSelecionada.suites}</div>
                      <div className="text-xs text-gray-500">Suítes</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Car className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                      <div className="text-sm font-medium">{unidadeSelecionada.vagas}</div>
                      <div className="text-xs text-gray-500">Vagas</div>
                    </div>
                  </div>

                  {/* Condições de Pagamento */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-900 mb-2">Condições de Pagamento</h4>
                    <p className="text-sm text-green-800">{unidadeSelecionada.condicoesPagamento}</p>
                  </div>

                  {/* Informações do Empreendimento */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Sobre o Empreendimento</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{unidadeSelecionada.empreendimento.endereco}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-500" />
                        <span>{unidadeSelecionada.empreendimento.construtora}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-gray-500" />
                        <span>{unidadeSelecionada.empreendimento.entrega}</span>
                      </div>
                      {unidadeSelecionada.empreendimento.distanciaMar && (
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-blue-500" />
                          <span>{unidadeSelecionada.empreendimento.distanciaMar}km do mar</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Compatibilidade com o Perfil */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Comparativo com o Perfil do Cliente</h4>
                  <div className="space-y-3">
                    {criterios.map((criterio, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            criterio.compativel 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {criterio.compativel ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{criterio.nome}</div>
                            <div className="text-xs text-gray-500">
                              {criterio.esperado ? `Esperado: ${criterio.esperado}` : 'Não especificado'}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-right">
                          <div>{criterio.atual}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {unidadeSelecionada.terceiro && (
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-yellow-900">Imóvel de Terceiro</span>
                      </div>
                      <p className="text-sm text-yellow-800">
                        Este imóvel é de propriedade de terceiros, oferecendo condições especiais de negociação.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              💡 Clique em "Enviar ao Lead" para compartilhar esta oportunidade
            </div>
            <div className="flex gap-3">
              {unidadeSelecionada.landingPage && (
                <button
                  onClick={() => window.open(unidadeSelecionada.landingPage, '_blank')}
                  className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Ver Landing Page
                </button>
              )}
              <button
                onClick={() => handleEnviarLead(unidadeSelecionada)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium"
              >
                <Send className="w-4 h-4" />
                Enviar ao Lead
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Imóveis Sugeridos</h2>
              <p className="text-sm text-gray-600 mt-1">
                {unidadesFiltradas.length} imóveis encontrados baseados no perfil do cliente
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Filtro de Ordenação */}
              <select
                value={filtroOrdem}
                onChange={(e) => setFiltroOrdem(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="compatibilidade">Maior compatibilidade</option>
                <option value="valor">Menor preço</option>
                <option value="area">Maior área</option>
              </select>
              
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Imóveis */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {unidadesFiltradas.map((unidade) => (
              <div key={unidade.id} className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Header do Card */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {unidade.empreendimento.nome}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Unidade {unidade.numero} - {unidade.andar}º andar
                      </p>
                      <p className="text-xs text-gray-500">
                        {unidade.empreendimento.bairro}, {unidade.empreendimento.cidade}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCompatibilidadeColor(unidade.compatibilidade)}`}>
                        {unidade.compatibilidade}%
                      </div>
                      {unidade.terceiro && (
                        <div className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-yellow-400">
                          Terceiro
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Especificações */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-sm font-medium">{unidade.dormitorios}</div>
                      <div className="text-xs text-gray-500">Quartos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">{unidade.suites}</div>
                      <div className="text-xs text-gray-500">Suítes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">{unidade.vagas}</div>
                      <div className="text-xs text-gray-500">Vagas</div>
                    </div>
                  </div>

                  {/* Área e Valor */}
                  <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-600">Área</div>
                      <div className="font-medium">{unidade.area}m²</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Valor</div>
                      <div className="text-lg font-bold text-green-600">{formatCurrency(unidade.valor)}</div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setUnidadeSelecionada(unidade);
                        setMostrarDetalhes(true);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Detalhes
                    </button>
                    <button
                      onClick={() => handleEnviarLead(unidade)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Enviar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {unidadesFiltradas.length === 0 && (
            <div className="text-center py-12">
              <Building className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum imóvel encontrado</h3>
              <p className="text-gray-600">
                Não encontramos imóveis que atendam exatamente ao perfil do cliente.
                <br />
                Ajuste os critérios ou entre em contato para mais opções.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImoveisSugeridos;