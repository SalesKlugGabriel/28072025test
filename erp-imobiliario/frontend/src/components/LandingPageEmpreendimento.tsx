import React, { useState, useEffect } from 'react';
import { 
  MapPin, Phone, Mail, Calendar, TrendingUp, Home, Car, 
  Bed, Bath, Square, Wifi, Shield, Gamepad2, Waves, 
  Trees, Camera, Play, ChevronLeft, ChevronRight, X,
  Download, Share2, Heart, MessageSquare, ExternalLink, Eye
} from 'lucide-react';
import { useTracking } from '../services/trackingService';

interface EmpreendimentoLanding {
  id: string;
  nome: string;
  slogan: string;
  localizacao: {
    endereco: string;
    cidade: string;
    bairro: string;
  };
  imagens: string[];
  video?: string;
  plantas: Array<{
    id: string;
    nome: string;
    quartos: number;
    suites: number;
    banheiros: number;
    vagas: number;
    area: number;
    precoInicial: number;
    disponivel: number;
    planta: string;
  }>;
  lazer: Array<{
    nome: string;
    icone: string;
    descricao: string;
  }>;
  diferenciais: string[];
  localizacaoDetalhes: {
    proximidades: Array<{
      nome: string;
      distancia: string;
      tipo: 'escola' | 'hospital' | 'shopping' | 'praia' | 'aeroporto';
    }>;
  };
  financeiro: {
    valorMinimo: number;
    valorMaximo: number;
    entrada: number;
    financiamento: string;
    valorizacaoProjetada: number;
    graficoValorizacao: Array<{
      mes: string;
      valor: number;
    }>;
  };
  construtora: {
    nome: string;
    logo: string;
    experiencia: string;
    entregas: number;
  };
  status: {
    fase: 'pre-lancamento' | 'lancamento' | 'em-construcao' | 'pronto';
    percentualConcluido: number;
    previsaoEntrega: string;
    unidadesVendidas: number;
    unidadesTotal: number;
  };
  contato: {
    telefone: string;
    whatsapp: string;
    email: string;
    plantao: boolean;
  };
}

// Mock data baseado na referência Legacy87 Aurora
const mockEmpreendimento: EmpreendimentoLanding = {
  id: '1',
  nome: 'Residencial Aurora',
  slogan: 'Viva o futuro hoje. Seu novo lar te aguarda.',
  localizacao: {
    endereco: 'Rua das Palmeiras, 1500',
    cidade: 'Florianópolis',
    bairro: 'Centro'
  },
  imagens: [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200'
  ],
  plantas: [
    {
      id: '1',
      nome: 'Tipo 1 - Conforto',
      quartos: 2,
      suites: 1,
      banheiros: 2,
      vagas: 1,
      area: 65,
      precoInicial: 320000,
      disponivel: 8,
      planta: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
    },
    {
      id: '2',
      nome: 'Tipo 2 - Família',
      quartos: 3,
      suites: 2,
      banheiros: 3,
      vagas: 2,
      area: 85,
      precoInicial: 450000,
      disponivel: 5,
      planta: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800'
    },
    {
      id: '3',
      nome: 'Tipo 3 - Premium',
      quartos: 3,
      suites: 2,
      banheiros: 3,
      vagas: 2,
      area: 95,
      precoInicial: 580000,
      disponivel: 2,
      planta: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
    }
  ],
  lazer: [
    { nome: 'Piscina Adulto e Infantil', icone: '🏊‍♀️', descricao: 'Área aquática completa com deck' },
    { nome: 'Academia Completa', icone: '💪', descricao: 'Equipamentos modernos 24h' },
    { nome: 'Espaço Gourmet', icone: '🍽️', descricao: 'Churrasqueira e forno de pizza' },
    { nome: 'Playground', icone: '🎠', descricao: 'Área kids com segurança total' },
    { nome: 'Coworking', icone: '💻', descricao: 'Escritório compartilhado moderno' },
    { nome: 'Pet Place', icone: '🐕', descricao: 'Espaço dedicado aos pets' },
    { nome: 'Salão de Festas', icone: '🎉', descricao: 'Ambiente para comemorações' },
    { nome: 'Bike Park', icone: '🚴‍♂️', descricao: 'Bicicletário coberto' }
  ],
  diferenciais: [
    'Localização privilegiada no centro da cidade',
    'Acabamento de alto padrão',
    'Sistema de segurança 24h com portaria',
    'Infraestrutura completa de lazer',
    'Proximidade com principais vias de acesso',
    'Design arquitetônico moderno e sustentável'
  ],
  localizacaoDetalhes: {
    proximidades: [
      { nome: 'Shopping Iguatemi', distancia: '800m', tipo: 'shopping' },
      { nome: 'Hospital Caridade', distancia: '600m', tipo: 'hospital' },
      { nome: 'Colégio Catarinense', distancia: '400m', tipo: 'escola' },
      { nome: 'Praia de Canasvieiras', distancia: '15km', tipo: 'praia' },
      { nome: 'Aeroporto Hercílio Luz', distancia: '12km', tipo: 'aeroporto' }
    ]
  },
  financeiro: {
    valorMinimo: 320000,
    valorMaximo: 580000,
    entrada: 20,
    financiamento: 'Financiamento em até 30 anos',
    valorizacaoProjetada: 25,
    graficoValorizacao: [
      { mes: 'Lançamento', valor: 320000 },
      { mes: '6 meses', valor: 335000 },
      { mes: '12 meses', valor: 350000 },
      { mes: '18 meses', valor: 370000 },
      { mes: '24 meses', valor: 390000 },
      { mes: 'Entrega', valor: 420000 }
    ]
  },
  construtora: {
    nome: 'LegaSys Construções',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200',
    experiencia: '25 anos de mercado',
    entregas: 47
  },
  status: {
    fase: 'lancamento',
    percentualConcluido: 15,
    previsaoEntrega: 'Dezembro/2025',
    unidadesVendidas: 45,
    unidadesTotal: 120
  },
  contato: {
    telefone: '(48) 3333-4444',
    whatsapp: '48999887766',
    email: 'vendas@legasys.com.br',
    plantao: true
  }
};

// Mock de empreendimentos relacionados
const empreendimentosRelacionados = [
  {
    id: 'emp_2',
    nome: 'Ocean View Residence',
    localizacao: 'Beira Mar Norte',
    valor: 'A partir de R$ 890.000',
    area: '78m²',
    quartos: 2,
    imagem: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500',
    valorM2: 11410,
    tipologia: '2 quartos',
    regiao: 'Centro'
  },
  {
    id: 'emp_3', 
    nome: 'Jardim das Palmeiras',
    localizacao: 'Trindade',
    valor: 'A partir de R$ 650.000',
    area: '85m²',
    quartos: 3,
    imagem: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500',
    valorM2: 7647,
    tipologia: '3 quartos',
    regiao: 'Centro'
  },
  {
    id: 'emp_4',
    nome: 'Residencial Sunset',
    localizacao: 'Córrego Grande', 
    valor: 'A partir de R$ 720.000',
    area: '90m²',
    quartos: 3,
    imagem: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=500',
    valorM2: 8000,
    tipologia: '3 quartos',
    regiao: 'Centro'
  }
];

const LandingPageEmpreendimento: React.FC<{ empreendimentoId?: string }> = ({ empreendimentoId }) => {
  const [imagemAtiva, setImagemAtiva] = useState(0);
  const [plantaAtiva, setPlantaAtiva] = useState(0);
  const [modalImagem, setModalImagem] = useState<number | null>(null);
  const [interesse, setInteresse] = useState(false);
  const tracking = useTracking();

  const empreendimento = mockEmpreendimento; // Em produção, buscar por ID

  // Inicializar tracking da visita
  useEffect(() => {
    tracking.iniciarVisita(
      empreendimentoId || 'emp_1',
      empreendimento.nome,
      'landing'
    );
  }, [empreendimentoId]);

  // Função para rastrear navegação para empreendimento relacionado
  const navegarParaEmpreendimento = (empRelacionado: any) => {
    tracking.registrarAcao('navegacao_relacionado', {
      empreendimentoDestino: empRelacionado.id,
      nomeDestino: empRelacionado.nome,
      motivoNavegacao: 'empreendimento_similar'
    });

    // Simular navegação (em produção seria window.location ou router)
    console.log('🔗 Navegando para:', empRelacionado.nome);
    
    // Em produção, aqui seria:
    // window.location.href = `/empreendimentos/landing/${empRelacionado.id}?origem=relacionado&anterior=${empreendimento.id}`;
    
    // Para demo, mostrar notificação
    alert(`Navegando para: ${empRelacionado.nome}\n\n⏱️ Tempo na página atual registrado!\n📊 Corretor será notificado da navegação.`);
  };

  const proximaImagem = () => {
    setImagemAtiva((prev) => (prev + 1) % empreendimento.imagens.length);
  };

  const imagemAnterior = () => {
    setImagemAtiva((prev) => (prev - 1 + empreendimento.imagens.length) % empreendimento.imagens.length);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };

  const getStatusColor = () => {
    switch (empreendimento.status.fase) {
      case 'pre-lancamento': return 'bg-yellow-500';
      case 'lancamento': return 'bg-green-500';
      case 'em-construcao': return 'bg-blue-500';
      case 'pronto': return 'bg-purple-500';
    }
  };

  const getStatusText = () => {
    switch (empreendimento.status.fase) {
      case 'pre-lancamento': return 'Pré-lançamento';
      case 'lancamento': return 'Lançamento';
      case 'em-construcao': return 'Em Construção';
      case 'pronto': return 'Pronto';
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      proximaImagem();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleWhatsApp = () => {
    const message = `Olá! Tenho interesse no ${empreendimento.nome}. Gostaria de mais informações.`;
    window.open(`https://wa.me/55${empreendimento.contato.whatsapp}?text=${encodeURIComponent(message)}`);
  };

  const handleDownloadMaterial = () => {
    tracking.registrarAcao('download_material', { 
      empreendimento: empreendimento.nome,
      tipo: 'material_completo'
    });
    
    // Simular download de material
    alert('Material de vendas enviado para seu e-mail!');
  };

  const handleWhatsAppContact = () => {
    tracking.registrarAcao('click_contato', { 
      tipo: 'whatsapp',
      empreendimento: empreendimento.nome 
    });
    
    const message = `Olá! Tenho interesse no ${empreendimento.nome}. Gostaria de mais informações.`;
    window.open(`https://wa.me/55${empreendimento.contato.whatsapp}?text=${encodeURIComponent(message)}`);
  };

  const toggleInteresse = () => {
    setInteresse(!interesse);
    tracking.registrarAcao('interesse', { 
      demonstrou: !interesse,
      empreendimento: empreendimento.nome 
    });
  };

  const handleClickPlanta = (plantaIndex: number) => {
    setPlantaAtiva(plantaIndex);
    tracking.registrarAcao('click_planta', {
      planta: empreendimento.plantas[plantaIndex].nome,
      index: plantaIndex
    });
  };

  const handleClickGaleria = (imagemIndex: number) => {
    setModalImagem(imagemIndex);
    tracking.registrarAcao('click_galeria', {
      imagem: imagemIndex,
      total: empreendimento.imagens.length
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Flutuante */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <img 
                src={empreendimento.construtora.logo} 
                alt={empreendimento.construtora.nome}
                className="h-8 w-auto mr-3"
              />
              <div>
                <h1 className="text-lg font-bold text-gray-900">{empreendimento.nome}</h1>
                <p className="text-xs text-gray-600">{empreendimento.localizacao.bairro}, {empreendimento.localizacao.cidade}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setInteresse(!interesse)}
                className={`p-2 rounded-lg border transition-colors ${
                  interesse 
                    ? 'bg-red-50 border-red-200 text-red-600' 
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart className={`w-5 h-5 ${interesse ? 'fill-current' : ''}`} />
              </button>
              <button 
                onClick={handleWhatsApp}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Fale Conosco
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-20">
        {/* Hero Section com Galeria */}
        <section className="relative h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={empreendimento.imagens[imagemAtiva]} 
              alt={empreendimento.nome}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* Controles de Galeria */}
          <button 
            onClick={imagemAnterior}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={proximaImagem}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {empreendimento.imagens.map((_, index) => (
              <button
                key={index}
                onClick={() => setImagemAtiva(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === imagemAtiva ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Hero Content */}
          <div className="absolute inset-0 flex items-center justify-center text-center z-10">
            <div className="max-w-4xl mx-auto px-4">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-white mb-6 ${getStatusColor()}`}>
                <span className="text-sm font-semibold">{getStatusText()}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                {empreendimento.nome}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
                {empreendimento.slogan}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleWhatsApp}
                  className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold"
                >
                  💬 Falar com Especialista
                </button>
                <button 
                  onClick={handleDownloadMaterial}
                  className="px-8 py-4 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Material de Vendas
                </button>
              </div>
            </div>
          </div>

          {/* Miniatura de fotos */}
          <div className="absolute bottom-4 right-4 flex gap-1 z-20">
            {empreendimento.imagens.slice(0, 4).map((img, index) => (
              <button
                key={index}
                onClick={() => handleClickGaleria(index)}
                className="w-16 h-16 rounded-lg overflow-hidden border-2 border-white/50 hover:border-white transition-colors"
              >
                <img src={img} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
            {empreendimento.imagens.length > 4 && (
              <button
                onClick={() => handleClickGaleria(0)}
                className="w-16 h-16 rounded-lg overflow-hidden border-2 border-white/50 hover:border-white transition-colors bg-black/50 flex items-center justify-center text-white text-xs font-semibold"
              >
                +{empreendimento.imagens.length - 4}
              </button>
            )}
          </div>
        </section>

        {/* Informações Rápidas */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">{empreendimento.plantas.length}</div>
                <div className="text-sm text-gray-600">Tipos de planta</div>
              </div>
              <div className="text-center bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(empreendimento.financeiro.valorMinimo)}
                </div>
                <div className="text-sm text-gray-600">A partir de</div>
              </div>
              <div className="text-center bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-purple-600">{empreendimento.financeiro.entrada}%</div>
                <div className="text-sm text-gray-600">De entrada</div>
              </div>
              <div className="text-center bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-orange-600">{empreendimento.status.previsaoEntrega}</div>
                <div className="text-sm text-gray-600">Previsão entrega</div>
              </div>
            </div>
          </div>
        </section>

        {/* Plantas */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Plantas Disponíveis</h2>
              <p className="text-xl text-gray-600">Encontre o apartamento perfeito para sua família</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {empreendimento.plantas.map((planta, index) => (
                <div key={planta.id} className="bg-white rounded-xl shadow-lg overflow-hidden border hover:shadow-xl transition-shadow">
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={planta.planta} 
                      alt={planta.nome}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{planta.nome}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        planta.disponivel > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {planta.disponivel > 0 ? `${planta.disponivel} disponíveis` : 'Esgotado'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Bed className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{planta.quartos} quartos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bath className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{planta.banheiros} banheiros</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{planta.vagas} vagas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Square className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{planta.area}m²</span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-green-600">
                          {formatCurrency(planta.precoInicial)}
                        </span>
                      </div>
                      <button 
                        onClick={handleWhatsApp}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Tenho Interesse
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gráfico de Valorização */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Projeção de Valorização</h2>
              <p className="text-xl text-gray-600">Investimento que cresce com o tempo</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Evolução do Preço</h3>
                  <p className="text-gray-600">Valorização projetada de {empreendimento.financeiro.valorizacaoProjetada}%</p>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="w-6 h-6" />
                  <span className="text-2xl font-bold">+{empreendimento.financeiro.valorizacaoProjetada}%</span>
                </div>
              </div>

              <div className="space-y-4">
                {empreendimento.financeiro.graficoValorizacao.map((ponto, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-semibold text-gray-600">{ponto.mes}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${((ponto.valor - empreendimento.financeiro.valorMinimo) / 
                          (empreendimento.financeiro.graficoValorizacao[empreendimento.financeiro.graficoValorizacao.length - 1].valor - empreendimento.financeiro.valorMinimo)) * 100}%` 
                        }}
                      />
                    </div>
                    <div className="w-32 text-right font-bold text-green-600">
                      {formatCurrency(ponto.valor)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Lazer */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Área de Lazer</h2>
              <p className="text-xl text-gray-600">Diversão e bem-estar para toda família</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {empreendimento.lazer.map((item, index) => (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="text-4xl mb-4">{item.icone}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.nome}</h3>
                  <p className="text-sm text-gray-600">{item.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Localização */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Localização Privilegiada</h2>
              <p className="text-xl text-gray-600">{empreendimento.localizacao.endereco}, {empreendimento.localizacao.bairro}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Proximidades</h3>
                <div className="space-y-4">
                  {empreendimento.localizacaoDetalhes.proximidades.map((local, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-900">{local.nome}</span>
                      </div>
                      <span className="text-sm font-semibold text-blue-600">{local.distancia}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="h-96 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg">Mapa Interativo</p>
                    <p className="text-sm opacity-75">Visualize a localização e proximidades</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Não Perca Esta Oportunidade
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {empreendimento.status.unidadesVendidas} de {empreendimento.status.unidadesTotal} unidades já vendidas. 
              Restam apenas {empreendimento.status.unidadesTotal - empreendimento.status.unidadesVendidas} apartamentos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button 
                onClick={handleWhatsApp}
                className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Falar com Consultor
              </button>
              <button 
                onClick={handleDownloadMaterial}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold"
              >
                Download Material Completo
              </button>
            </div>

            {empreendimento.contato.plantao && (
              <div className="flex items-center justify-center gap-2 text-sm opacity-75">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Plantão de vendas online - Atendimento imediato</span>
              </div>
            )}
          </div>
        </section>

        {/* Seção de Empreendimentos Relacionados */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Empreendimentos Similares
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore outras oportunidades com características semelhantes na mesma região
              </p>
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                <Eye className="w-4 h-4" />
                <span>Dados atualizados em {new Date().toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {empreendimentosRelacionados.map((emp, index) => (
                <div 
                  key={emp.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-2"
                  onClick={() => navegarParaEmpreendimento(emp)}
                >
                  {/* Imagem */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={emp.imagem} 
                      alt={emp.nome}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    
                    {/* Badge de navegação */}
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        <ExternalLink className="w-3 h-3" />
                        <span>Ver detalhes</span>
                      </div>
                    </div>

                    {/* Informações sobrepostas */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{emp.localizacao}</span>
                        </div>
                        <div className="text-sm font-medium">
                          R$ {emp.valorM2.toLocaleString()}/m²
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {emp.nome}
                    </h3>
                    
                    {/* Características principais */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Square className="w-4 h-4" />
                          <span>{emp.area}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4" />
                          <span>{emp.quartos} quartos</span>
                        </div>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {emp.tipologia}
                      </span>
                    </div>

                    {/* Preço */}
                    <div className="mb-4">
                      <p className="text-2xl font-bold text-green-600">{emp.valor}</p>
                      <p className="text-sm text-gray-500">Condições especiais de financiamento</p>
                    </div>

                    {/* Botão de ação */}
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Região: {emp.regiao}
                      </div>
                      <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                        <span>Explorar</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA adicional */}
            <div className="text-center mt-12">
              <div className="bg-white rounded-lg shadow-sm border p-6 max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Não encontrou o ideal?
                </h3>
                <p className="text-gray-600 mb-4">
                  Nossos especialistas podem ajudar você a encontrar o empreendimento perfeito
                </p>
                <button 
                  onClick={handleWhatsAppContact}
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors mx-auto"
                >
                  <MessageSquare className="w-5 h-5" />
                  Falar com Especialista
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <img 
                  src={empreendimento.construtora.logo} 
                  alt={empreendimento.construtora.nome}
                  className="h-10 w-auto mr-3"
                />
                <div>
                  <h3 className="text-lg font-bold">{empreendimento.construtora.nome}</h3>
                  <p className="text-sm text-gray-400">{empreendimento.construtora.experiencia} • {empreendimento.construtora.entregas} empreendimentos entregues</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{empreendimento.contato.telefone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{empreendimento.contato.email}</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Modal de Galeria */}
      {modalImagem !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button 
            onClick={() => setModalImagem(null)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={empreendimento.imagens[modalImagem]} 
            alt={`Foto ${modalImagem + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {empreendimento.imagens.map((_, index) => (
              <button
                key={index}
                onClick={() => handleClickGaleria(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === modalImagem ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPageEmpreendimento;