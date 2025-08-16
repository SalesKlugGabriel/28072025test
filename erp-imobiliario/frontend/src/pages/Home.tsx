import React, { useMemo, useState } from "react";
import {
  Coffee,
  Users,
  FileText,
  TrendingUp,
  Newspaper,
  Factory,
  Cpu,
  Coins,
  Banknote,
  Globe2,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

// 🔧 TODOs de Integração
// - Trazer nome do usuário autenticado (ex: via contexto de auth)
// - Substituir mocks por chamadas à API/serviços de scraping
// - Conectar com CRM para contagens (novos leads etc.)
// - Conectar com Cadastros para localização/segmentos do cliente

// =====================
// MOCKS DE DADOS (MVP)
// =====================
const USER_NAME = "João"; // TODO: vir do auth

const resumoHojeMock = {
  novosLeads: 3,
  propostasVencendo: 2,
  contratosParaAssinar: 1,
};

// Dados por segmento — usar fontes reais depois
const segmentos = [
  { id: "agro", nome: "Agro", icone: Factory },
  { id: "tech", nome: "Tech", icone: Cpu },
  { id: "cripto", nome: "Cripto", icone: Coins },
  { id: "financeiro", nome: "Financeiro", icone: Banknote },
  { id: "comex", nome: "Comércio Exterior", icone: Globe2 },
];

interface SegmentData {
  destaques: Array<{
    titulo: string;
    valor: string;
    variacao: string;
  }>;
  noticias: Array<{
    titulo: string;
    fonte: string;
    hora: string;
  }>;
}

const dadosSegmentoMock: Record<string, SegmentData> = {
  agro: {
    destaques: [
      { titulo: "Saca de Soja (PR)", valor: "R$ 156,40", variacao: "+0,8%" },
      { titulo: "Arroba do Boi (SP)", valor: "R$ 246,10", variacao: "-0,3%" },
    ],
    noticias: [
      {
        titulo: "Safra de milho surpreende em estados do Centro-Oeste",
        fonte: "AgroNews",
        hora: "08:30"
      },
      {
        titulo: "Insumos: queda de preço em fertilizantes nitrogenados",
        fonte: "Canal Rural",
        hora: "09:15"
      },
    ],
  },
  tech: {
    destaques: [
      { titulo: "Lançamento: Framework JS X", valor: "v3.2", variacao: "novo" },
      { titulo: "IA generativa", valor: "tendência", variacao: "↑" },
    ],
    noticias: [
      { titulo: "Startup de PropTech capta Série A", fonte: "TechCrunch", hora: "10:30" },
      { titulo: "Edge computing cresce no varejo", fonte: "The Verge", hora: "11:45" },
    ],
  },
  cripto: {
    destaques: [
      { titulo: "BTC", valor: "R$ 364.200", variacao: "+1,4%" },
      { titulo: "ETH", valor: "R$ 18.900", variacao: "-0,6%" },
    ],
    noticias: [
      { titulo: "Reguladores discutem ETFs na América Latina", fonte: "CoinDesk", hora: "13:20" },
      { titulo: "Layer-2 ganha adoção em pagamentos", fonte: "The Block", hora: "14:15" },
    ],
  },
  financeiro: {
    destaques: [
      { titulo: "Dólar", valor: "R$ 5,21", variacao: "+0,2%" },
      { titulo: "SELIC", valor: "10,50%", variacao: "estável" },
    ],
    noticias: [
      { titulo: "IPCA desacelera no mês", fonte: "Valor", hora: "15:30" },
      { titulo: "Crédito imobiliário tem alta", fonte: "Broadcast", hora: "16:00" },
    ],
  },
  comex: {
    destaques: [
      { titulo: "Frete Ásia → BR", valor: "US$ 2.150", variacao: "-4%" },
      { titulo: "Exportações (mês)", valor: "+6,1%", variacao: "↑" },
    ],
    noticias: [
      { titulo: "Mudanças tarifárias na UE", fonte: "Reuters", hora: "17:45" },
      { titulo: "Portos operam com restrições climáticas", fonte: "g1", hora: "18:20" },
    ],
  },
};

// =====================
// COMPONENTES AUXILIARES
// =====================
function saudacaoPorHora(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

const Chip: React.FC<{ icon?: React.ReactNode; children: React.ReactNode }> = ({
  icon,
  children,
}) => (
  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
    {icon}
    {children}
  </span>
);

const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = "",
  children,
}) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>{children}</div>
);

const DestaqueItem: React.FC<{ titulo: string; valor: string; variacao?: string }> = ({
  titulo,
  valor,
  variacao,
}) => (
  <div className="p-4 rounded-lg bg-gray-50">
    <div className="text-sm text-gray-500">{titulo}</div>
    <div className="mt-1 text-lg font-semibold text-gray-900">{valor}</div>
    {variacao && (
      <div className="mt-1 text-xs text-gray-500">Variação: {variacao}</div>
    )}
  </div>
);

// =====================
// PÁGINA PRINCIPAL
// =====================
export default function Home() {
  const [segmentoAtivo, setSegmentoAtivo] = useState<string>(segmentos[0].id);

  const saudacao = useMemo(() => saudacaoPorHora(), []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {saudacao}, {USER_NAME}!
          </h1>
          <p className="text-gray-600">Bem-vindo(a) ao seu painel inteligente ✨</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Coffee className="w-4 h-4" />
          <span>Resumo do dia</span>
        </div>
      </div>

      {/* Resumo Rápido */}
      <div className="flex flex-wrap gap-2">
        <Chip icon={<Users className="w-4 h-4" />}>{resumoHojeMock.novosLeads} novos leads</Chip>
        <Chip icon={<FileText className="w-4 h-4" />}>{resumoHojeMock.propostasVencendo} propostas vencem hoje</Chip>
        <Chip icon={<TrendingUp className="w-4 h-4" />}>{resumoHojeMock.contratosParaAssinar} contrato(s) para assinar</Chip>
      </div>

      {/* Tabs de Segmentos */}
      <Card>
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {segmentos.map((seg) => (
              <button
                key={seg.id}
                onClick={() => setSegmentoAtivo(seg.id)}
                className={`flex items-center gap-2 px-5 py-3 border-b-2 whitespace-nowrap transition-colors ${
                  segmentoAtivo === seg.id
                    ? "border-blue-600 text-blue-700 bg-blue-50"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <seg.icone className="w-4 h-4" />
                {seg.nome}
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo do Segmento */}
        <SegmentoContent segmentoId={segmentoAtivo} />
      </Card>
    </div>
  );
}

// =====================
// CONTEÚDO POR SEGMENTO
// =====================
function SegmentoContent({ segmentoId }: { segmentoId: string }) {
  const dados = dadosSegmentoMock[segmentoId] || { destaques: [], noticias: [] };

  return (
    <div className="p-6 space-y-6">
      {/* Destaques numéricos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dados.destaques.map((d, idx: number) => (
          <DestaqueItem key={idx} {...d} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notícias / Highlights */}
        <div className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Newspaper className="w-4 h-4" /> Principais notícias do setor
          </h3>
          <ul className="space-y-3">
            {dados.noticias.map((n, i: number) => (
              <li
                key={i}
                className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-between"
              >
                <div>
                  <div className="text-gray-900 font-medium">{n.titulo}</div>
                  <div className="text-xs text-gray-500">Fonte: {n.fonte}</div>
                </div>
                <button className="text-blue-600 text-sm inline-flex items-center gap-1">
                  Ver mais <ArrowRight className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Integração com CRM (gatilhos de conversa) */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Gatilhos de conversa (CRM)
          </h3>
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 text-blue-800 text-sm">
              Clientes com tag <b>“{segmentoId}”</b> no CRM receberam 2 novas oportunidades.
            </div>
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-100 text-amber-800 text-sm flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5" />
              <span>
                2 leads sem follow-up há 48h. <b>Sugerir mensagem automática</b>?
              </span>
            </div>
            <button className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" /> Atualizar insights
            </button>
          </div>
        </div>
      </div>

      {/* Material promocional / atalhos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Material Promocional</div>
          <div className="mt-1 font-semibold text-gray-900">Folder do segmento</div>
          <button className="mt-3 text-blue-600 text-sm">Baixar PDF</button>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Tabela de Referência</div>
          <div className="mt-1 font-semibold text-gray-900">Preços/Índices</div>
          <button className="mt-3 text-blue-600 text-sm">Ver tabela</button>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Atalhos</div>
          <div className="mt-2 flex flex-wrap gap-2">
            <a href="/crm" className="px-3 py-1 rounded-full bg-gray-100 text-sm">Abrir CRM</a>
            <a href="/pessoas" className="px-3 py-1 rounded-full bg-gray-100 text-sm">Pessoas</a>
            <a href="/empreendimentos" className="px-3 py-1 rounded-full bg-gray-100 text-sm">Empreendimentos</a>
          </div>
        </Card>
      </div>
    </div>
  );
}
