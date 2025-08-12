// src/store/empreendimentos.ts
// Fonte única de dados (mock + localStorage) para Empreendimentos/Unidades
// Usado por Pessoas.tsx e pela página de Empreendimentos.

export type ID = string

export interface TipoUnidade {
  id: ID
  nome: string           // Ex.: "Tipo 1"
  tipologia: string      // Ex.: "2 quartos"
  areaPrivativa: number  // m²
  vagasGaragem: number
  precoReferencia: number
}

export interface Localizacao {
  endereco: string
  bairro: string
  cidade: string
  estado: string
  cep: string
}

export interface Empreendimento {
  id: ID
  nome: string
  tipo: 'residencial' | 'comercial' | 'misto' | 'rural'
  status: 'planejamento' | 'aprovacao' | 'construcao' | 'vendas' | 'entregue'
  imagem?: string
  localizacao: Localizacao
  unidadesTotal: number
  unidadesVendidas: number
  unidadesReservadas: number
  valorTotal?: number
  valorMedio?: number
  dataInicio?: string
  dataPrevista?: string
  descricao?: string
  responsaveis?: {
    tecnico?: string
    comercial?: string
    juridico?: string
  }
  tiposUnidade: TipoUnidade[]
}

const STORAGE_KEY = 'erpimob.empreendimentos'

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
function writeJSON<T>(key: string, value: T) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

// --- Seed inicial (2 empreendimentos coerentes com o seu layout) ---
const seed: Empreendimento[] = [
  {
    id: 'emp-1',
    nome: 'Residencial Solar das Flores',
    tipo: 'residencial',
    status: 'vendas',
    imagem: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    localizacao: {
      endereco: 'Rua das Palmeiras, 1500',
      bairro: 'Centro',
      cidade: 'Florianópolis',
      estado: 'SC',
      cep: '88010-120',
    },
    unidadesTotal: 120,
    unidadesVendidas: 45,
    unidadesReservadas: 25,
    valorTotal: 24000000,
    valorMedio: 350000,
    dataInicio: '2024-01-15',
    dataPrevista: '2025-12-30',
    descricao:
      'Empreendimento de alto padrão com 120 unidades no coração de Florianópolis.',
    responsaveis: {
      tecnico: 'Eng. João Silva',
      comercial: 'Maria Santos',
      juridico: 'Dr. Carlos Oliveira',
    },
    tiposUnidade: [
      {
        id: 'tu-1a',
        nome: 'Tipo 1',
        tipologia: '2 quartos',
        areaPrivativa: 65,
        vagasGaragem: 1,
        precoReferencia: 320000,
      },
      {
        id: 'tu-1b',
        nome: 'Tipo 2',
        tipologia: '3 quartos',
        areaPrivativa: 85,
        vagasGaragem: 2,
        precoReferencia: 450000,
      },
    ],
  },
  {
    id: 'emp-2',
    nome: 'Comercial Business Center',
    tipo: 'comercial',
    status: 'construcao',
    imagem: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    localizacao: {
      endereco: 'Av. Principal, 2000',
      bairro: 'Empresarial',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01310-100',
    },
    unidadesTotal: 50,
    unidadesVendidas: 20,
    unidadesReservadas: 15,
    valorTotal: 15000000,
    valorMedio: 250000,
    dataInicio: '2024-03-01',
    dataPrevista: '2025-08-15',
    descricao:
      'Centro empresarial moderno com diversas tipologias de salas comerciais.',
    responsaveis: {
      tecnico: 'Eng. Ana Costa',
      comercial: 'Pedro Lima',
      juridico: 'Dra. Julia Mendes',
    },
    tiposUnidade: [
      {
        id: 'tu-2a',
        nome: 'Sala Pequena',
        tipologia: 'Comercial',
        areaPrivativa: 30,
        vagasGaragem: 1,
        precoReferencia: 180000,
      },
      {
        id: 'tu-2b',
        nome: 'Sala Grande',
        tipologia: 'Comercial',
        areaPrivativa: 60,
        vagasGaragem: 2,
        precoReferencia: 350000,
      },
    ],
  },
]

// garante seed uma única vez
;(function ensureSeed() {
  const cur = readJSON<Empreendimento[]>(STORAGE_KEY, [])
  if (!cur || cur.length === 0) {
    writeJSON(STORAGE_KEY, seed)
  }
})()

// ---------------- API de acesso (frontend) ----------------
export function listEmpreendimentos(): Empreendimento[] {
  return readJSON<Empreendimento[]>(STORAGE_KEY, [])
}

export function getEmpreendimentoById(id: ID): Empreendimento | undefined {
  return listEmpreendimentos().find((e) => e.id === id)
}

export function saveEmpreendimento(payload: Empreendimento): void {
  const all = listEmpreendimentos()
  const idx = all.findIndex((e) => e.id === payload.id)
  if (idx >= 0) all[idx] = payload
  else all.unshift(payload)
  writeJSON(STORAGE_KEY, all)
}

export function removeEmpreendimento(id: ID): void {
  const all = listEmpreendimentos().filter((e) => e.id !== id)
  writeJSON(STORAGE_KEY, all)
}
