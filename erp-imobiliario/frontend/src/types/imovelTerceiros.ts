export interface ImovelTerceiros {
  id: string;
  nomeEmpreendimento: string;
  numeroUnidade: string;
  metragem: number;
  caracteristicas: {
    mobilia: 'sem_mobilia' | 'parcialmente_mobiliado' | 'totalmente_mobiliado';
    churrasqueira: boolean;
    garagem: boolean;
    quantidadeQuartos: number;
    quantidadeSuites: number;
    lavabo: boolean;
    outrasCaracteristicas: string[];
  };
  infraEmpreendimento: string[];
  localizacao: {
    endereco: string;
    latitude?: number;
    longitude?: number;
    distanciaMarKm?: number;
  };
  valor: number;
  detalhesNegociacao: {
    aceitaCarro: boolean;
    aceitaImovel: boolean;
    observacoes: string;
  };
  fotos: string[];
  descritivo: string;
  proprietario: {
    id: string;
    nome: string;
    telefone: string;
    email: string;
    visivel: boolean; // Controla se os dados do proprietário são visíveis para outros
  };
  corretor: {
    id: string;
    nome: string;
  };
  dataCadastro: string;
  status: 'disponivel' | 'negociacao' | 'vendido' | 'reservado' | 'inativo';
  tags: string[];
  visualizacoes: number;
  interessados: Array<{
    id: string;
    nome: string;
    telefone: string;
    dataInteresse: string;
    observacoes?: string;
  }>;
}

export interface FiltrosImovelTerceiros {
  valorMin?: number;
  valorMax?: number;
  metragemMin?: number;
  metragemMax?: number;
  quartosMin?: number;
  quartosMax?: number;
  mobilia?: string;
  garagem?: boolean;
  distanciaMarMax?: number;
  cidade?: string;
  status?: string;
  corretor?: string;
}

export interface MapaLocalizacao {
  endereco: string;
  latitude: number;
  longitude: number;
  precisao: 'exata' | 'aproximada' | 'cidade';
}