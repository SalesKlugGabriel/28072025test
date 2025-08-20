import React, {
  useMemo, useReducer, useState, useCallback, createContext, useContext, useEffect, useRef,
} from "react";
import {
  Users, Target, Phone, Mail, MessageSquare, Edit2, Plus, X, Search,
  DollarSign, Filter, BarChart3, 
  Clock, CheckCircle, Download, AlertTriangle, MoreVertical,
  MessageCircle, LayoutGrid, PieChart, Paperclip, Send, ChevronDown,
  WifiIcon
} from "lucide-react";

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// Import do serviço WhatsApp
import whatsappService, { type WhatsAppMessage } from '../services/whatsappService';
import { type WhatsAppConnection } from '../types/whatsapp';

// Import dos novos componentes
import BoardSelector from '../components/BoardSelector';
import BoardKanban from '../components/BoardKanban';
import { Board } from '../types/crm-boards';

/* =========================================================
   Tipos
========================================================= */

type Origem = "site" | "indicacao" | "telemarketing" | "redes-sociais" | "evento" | "outros";
type Status =
  | "lead"
  | "contato"
  | "interessado"
  | "negociacao"
  | "proposta"
  | "vendido"
  | "perdido";
type Prioridade = "baixa" | "media" | "alta";
type Temperatura = "frio" | "morno" | "quente";

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  whatsapp?: string;
  origem: Origem;
  status: Status;
  prioridade: Prioridade;
  valorOrcamento?: number;
  observacoes?: string;
  responsavel: string;
  dataCriacao: string;       // YYYY-MM-DD
  ultimoContato?: string;    // ISO
  proximoFollowUp?: string;  // ISO
  empreendimentoInteresse?: string;
  tags?: string[];
  score?: number;
  temperatura: Temperatura;
  tempoResposta?: number;
  numeroContatos?: number;
  cidade?: string;
  alertaSLA?: boolean;       // calculado
  avatarUrl?: string;
}

type TipoAtividade = "ligacao" | "email" | "whatsapp" | "reuniao" | "visita" | "proposta" | "follow-up" | "nota";
type StatusAtividade = "agendado" | "concluido" | "cancelado" | "em-andamento";

interface Atividade {
  id: string;
  clienteId: string;
  tipo: TipoAtividade;
  descricao: string;
  data: string; // ISO
  responsavel: string;
  status: StatusAtividade;
  duracaoMinutos?: number;
}

interface Mensagem {
  id: string;
  clienteId: string;
  autor: "lead" | "agente";
  canal: "whatsapp" | "email" | "ligacao" | "nota";
  texto: string;
  data: string; // ISO
  anexos?: { id: string; nome: string; url: string }[];
  lido?: boolean;
}

interface FiltrosCRM {
  busca: string;
  status: "" | Status;
  origem: "" | Origem;
  responsavel: string;
  prioridade: "" | Prioridade;
  temperatura: "" | Temperatura;
  cidade: string;
}

interface MetasPipeline {
  lead: number;
  contato: number;
  interessado: number;
  negociacao: number;
  proposta: number;
  vendido: number;
}

type View = "board-selector" | "kanban" | "chat" | "dashboard";

/* =========================================================
   Estado global do CRM
========================================================= */
interface CRMState {
  clientes: Cliente[];
  atividades: Atividade[];
  mensagens: Mensagem[];
  filtros: FiltrosCRM;
  clienteSelecionado: Cliente | null;
  modalAtivo: string | null;
  view: View;
  metas: MetasPipeline;
  pipelineAtivo: string;       // nome/slug do pipeline atual
  pipelines: Record<string, { id: string; nome: string; estagios: Status[] }>;
  selectedBoard: Board | null; // board selecionado no novo sistema
}

type Action =
  | { type: "SET_VIEW"; payload: View }
  | { type: "SET_FILTRO"; payload: Partial<FiltrosCRM> }
  | { type: "OPEN_MODAL"; payload: CRMState["modalAtivo"] }
  | { type: "CLOSE_MODAL" }
  | { type: "SELECT_CLIENTE"; payload: Cliente | null }
  | { type: "ADD_CLIENTE"; payload: Cliente }
  | { type: "UPDATE_CLIENTE"; payload: Cliente }
  | { type: "MOVE_STATUS"; payload: { id: string; status: Status } }
  | { type: "ADD_ATIVIDADE"; payload: Atividade }
  | { type: "BULK_ATIVIDADES"; payload: Atividade[] }
  | { type: "ADD_MSG"; payload: Mensagem }
  | { type: "BULK_MSGS"; payload: Mensagem[] }
  | { type: "SET_METAS"; payload: MetasPipeline }
  | { type: "SET_PIPELINE"; payload: string }
  | { type: "UPSERT_PIPELINE"; payload: { id?: string; nome: string; estagios: Status[] } }
  | { type: "SELECT_BOARD"; payload: Board | null };

/* =========================================================
   Mocks
========================================================= */

// TODO: Replace with API integration to fetch clientes
// Remove mock data and implement proper API calls to backend CRM service
const mockClientes: Cliente[] = [];

// TODO: Replace with API integration to fetch atividades
// Remove mock data and implement proper API calls to backend activity service
const mockAtividades: Atividade[] = [];

// TODO: Replace with API integration to fetch mensagens
// Remove mock data and implement proper API calls to backend messaging service
const mockMensagens: Mensagem[] = [];

const pipelinesDefaults: CRMState["pipelines"] = {
  "comercial": { id: "comercial", nome: "Comercial (Padrão)", estagios: ["lead", "contato", "interessado", "negociacao", "proposta", "vendido", "perdido"] },
};

/* =========================================================
   Utils
========================================================= */
const money = (v?: number) =>
  typeof v === "number"
    ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v)
    : "-";
const dateBR = (s?: string) => (s ? new Date(s).toLocaleDateString("pt-BR") : "-");
const timeBR = (s?: string) => (s ? new Date(s).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "");
const initials = (nome: string) => nome.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
const diffHours = (a: string, b: string) => Math.abs((new Date(a).getTime() - new Date(b).getTime()) / 36e5);

function emailValido(email: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function telefoneValido(fone: string) { return fone.replace(/\D/g, "").length >= 10; }

function convertLeadToPessoa(c: Cliente) {
  if (!emailValido(c.email) || !telefoneValido(c.telefone)) {
    console.warn("[CRM] Conversão bloqueada: dados inválidos", c);
    return false;
  }
  console.info("[CRM] Converter para Pessoa/Cliente:", {
    tipo: "cliente",
    nome: c.nome,
    email: c.email,
    telefone: c.telefone,
    origem: c.origem,
  });
  return true;
}

/* =========================================================
   Contexto
========================================================= */

const initialState: CRMState = {
  clientes: mockClientes,
  atividades: mockAtividades,
  mensagens: mockMensagens,
  filtros: { busca: "", status: "", origem: "", responsavel: "", prioridade: "", temperatura: "", cidade: "" },
  modalAtivo: null,
  clienteSelecionado: null,
  view: "board-selector", // novo fluxo: começar com seleção de board
  metas: { lead: 20, contato: 15, interessado: 12, negociacao: 8, proposta: 6, vendido: 4 },
  pipelineAtivo: "comercial",
  pipelines: pipelinesDefaults,
  selectedBoard: null,
};

function reducer(state: CRMState, action: Action): CRMState {
  switch (action.type) {
    case "SET_VIEW":
      return { ...state, view: action.payload };
    case "SET_FILTRO":
      return { ...state, filtros: { ...state.filtros, ...action.payload } };
    case "OPEN_MODAL":
      return { ...state, modalAtivo: action.payload };
    case "CLOSE_MODAL":
      return { ...state, modalAtivo: null, clienteSelecionado: null };
    case "SELECT_CLIENTE":
      return { ...state, clienteSelecionado: action.payload };
    case "ADD_CLIENTE":
      return { ...state, clientes: [...state.clientes, action.payload] };
    case "UPDATE_CLIENTE":
      return {
        ...state,
        clientes: state.clientes.map((c) => (c.id === action.payload.id ? action.payload : c)),
        clienteSelecionado:
          state.clienteSelecionado && state.clienteSelecionado.id === action.payload.id
            ? action.payload
            : state.clienteSelecionado,
      };
    case "MOVE_STATUS": {
      const updated = state.clientes.map((c) =>
        c.id === action.payload.id ? { ...c, status: action.payload.status } : c
      );
      const moved = updated.find((c) => c.id === action.payload.id)!;
      if (action.payload.status === "vendido") convertLeadToPessoa(moved);
      return { ...state, clientes: updated };
    }
    case "ADD_ATIVIDADE":
      return { ...state, atividades: [...state.atividades, action.payload] };
    case "BULK_ATIVIDADES":
      return { ...state, atividades: action.payload };
    case "ADD_MSG":
      return { ...state, mensagens: [...state.mensagens, action.payload] };
    case "BULK_MSGS":
      return { ...state, mensagens: action.payload };
    case "SET_METAS":
      return { ...state, metas: action.payload };
    case "SET_PIPELINE":
      return { ...state, pipelineAtivo: action.payload };
    case "UPSERT_PIPELINE": {
      const id = action.payload.id ?? action.payload.nome.toLowerCase().replace(/\s+/g, "-");
      return {
        ...state,
        pipelines: {
          ...state.pipelines,
          [id]: { id, nome: action.payload.nome, estagios: action.payload.estagios },
        },
        pipelineAtivo: id,
      };
    }
    case "SELECT_BOARD":
      return {
        ...state,
        selectedBoard: action.payload,
        view: action.payload ? "kanban" : "board-selector",
      };
    default:
      return state;
  }
}

const Ctx = createContext<{ state: CRMState; dispatch: React.Dispatch<Action> } | null>(null);
const useCRM = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCRM deve ser usado dentro de CRMProvider");
  return ctx;
};

function Provider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Gatilhos automáticos: SLA / temperatura
  useEffect(() => {
    const now = new Date().toISOString();
    const updated = state.clientes.map((c) => {
      const emSLA = ["lead", "contato"].includes(c.status);
      const base = c.ultimoContato || c.dataCriacao + "T00:00:00";
      const violouSLA = emSLA && diffHours(now, base) > 24;

      const horas = diffHours(now, base);
      let temp: Temperatura = c.temperatura;
      if (horas <= 72) temp = "quente";
      else if (horas <= 168) temp = "morno";
      else temp = "frio";

      return { ...c, alertaSLA: violouSLA, temperatura: temp };
    });

    if (JSON.stringify(updated) !== JSON.stringify(state.clientes)) {
      updated.forEach((u) => dispatch({ type: "UPDATE_CLIENTE", payload: u }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.clientes.length]);

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

/* =========================================================
   Hooks auxiliares
========================================================= */

function useClientesFiltrados() {
  const { state } = useCRM();
  return useMemo(() => {
    const f = state.filtros;
    return state.clientes.filter((c) => {
      const b =
        !f.busca ||
        c.nome.toLowerCase().includes(f.busca.toLowerCase()) ||
        c.email.toLowerCase().includes(f.busca.toLowerCase()) ||
        c.telefone.includes(f.busca);
      const s = !f.status || c.status === f.status;
      const o = !f.origem || c.origem === f.origem;
      const r = !f.responsavel || c.responsavel.toLowerCase().includes(f.responsavel.toLowerCase());
      return b && s && o && r;
    });
  }, [state.clientes, state.filtros]);
}

function useAtividades(clienteId?: string) {
  const { state } = useCRM();
  return useMemo(
    () =>
      state.atividades
        .filter((a) => (clienteId ? a.clienteId === clienteId : true))
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()),
    [state.atividades, clienteId]
  );
}

function useMensagens(clienteId?: string) {
  const { state } = useCRM();
  return useMemo(
    () =>
      state.mensagens
        .filter((m) => (clienteId ? m.clienteId === clienteId : true))
        .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()),
    [state.mensagens, clienteId]
  );
}

/* =========================================================
   UI – Apenas para os modais/ações quando necessário
========================================================= */

/* =========================================================
   Dashboard (cards simples)
========================================================= */

function Dashboard() {
  const list = useClientesFiltrados();
  const { state } = useCRM();

  const metricas = useMemo(() => {
    const total = list.length;
    const ativo = list.filter((c) => ["interessado", "negociacao", "proposta"].includes(c.status)).length;
    const vendas = list.filter((c) => c.status === "vendido").length;
    const valor = list
      .filter((c) => c.valorOrcamento && ["interessado", "negociacao", "proposta"].includes(c.status))
      .reduce((s, c) => s + (c.valorOrcamento || 0), 0);
    return { total, ativo, vendas, valor };
  }, [list]);

  const porColuna = useMemo(() => {
    const base: Record<Status, number> = { lead: 0, contato: 0, interessado: 0, negociacao: 0, proposta: 0, vendido: 0, perdido: 0 };
    list.forEach((c) => (base[c.status] += 1));
    return base;
  }, [list]);

  const barra = (qtd: number, meta?: number) => {
    const pct = Math.min(100, Math.round(((qtd || 0) / (meta || 1)) * 100));
    return (
      <div className="w-full h-2 bg-gray-200 rounded">
        <div className={`h-2 rounded ${pct >= 100 ? "bg-green-500" : "bg-blue-500"}`} style={{ width: `${pct}%` }} />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardMetric icon={<Users className="w-6 h-6 text-blue-600" />} title="Total leads" value={metricas.total} />
        <CardMetric icon={<Target className="w-6 h-6 text-yellow-600" />} title="Pipeline ativo" value={metricas.ativo} />
        <CardMetric icon={<DollarSign className="w-6 h-6 text-green-600" />} title="Vendas" value={metricas.vendas} />
        <CardMetric
          icon={<BarChart3 className="w-6 h-6 text-purple-600" />}
          title="Valor pipeline"
          value={new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(metricas.valor)}
        />
      </div>

      <div className="bg-white border rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {(["lead", "contato", "interessado", "negociacao", "proposta", "vendido"] as (keyof MetasPipeline)[]).map((col) => (
            <div key={col}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm capitalize">{col}</span>
                <span className="text-xs text-gray-500">
                  {porColuna[col as Status]}/{state.metas[col]}
                </span>
              </div>
              {barra(porColuna[col as Status], state.metas[col])}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CardMetric({ icon, title, value }: { icon: React.ReactNode; title: string; value: React.ReactNode }) {
  return (
    <div className="bg-white border rounded-lg p-5">
      <div className="flex gap-3 items-center">
        <div className="p-3 rounded bg-gray-50">{icon}</div>
        <div>
          <div className="text-sm text-gray-600">{title}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Chat (chat-first)
========================================================= */

function Chat() {
  const { state, dispatch } = useCRM();
  const contatos = useClientesFiltrados();
  const [busca, setBusca] = useState("");
  const [texto, setTexto] = useState("");
  const sel = state.clienteSelecionado ?? contatos[0] ?? null;
  const msgs = useMensagens(sel?.id);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (sel && (!state.clienteSelecionado || state.clienteSelecionado.id !== sel.id)) {
      dispatch({ type: "SELECT_CLIENTE", payload: sel });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel?.id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs.length]);

  const [whatsappConnections, setWhatsappConnections] = useState<WhatsAppConnection[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<WhatsAppConnection | null>(null);
  const [whatsappMessages, setWhatsappMessages] = useState<WhatsAppMessage[]>([]);

  // Carregar conexões WhatsApp e mensagens
  useEffect(() => {
    // Simular carregamento de conexões do localStorage/API
    const mockConnections: WhatsAppConnection[] = [
      {
        id: '1',
        userId: 'current_user',
        userName: 'Usuário Atual',
        phoneNumber: '+5548999991234',
        status: 'connected',
        lastConnection: new Date().toISOString(),
        sessionId: 'session_current_123'
      }
    ];
    
    setWhatsappConnections(mockConnections);
    setSelectedConnection(mockConnections.find(c => c.status === 'connected') || null);
    whatsappService.setConnections(mockConnections);
    
    // Listener para novas mensagens WhatsApp
    const handleNewMessage = (message: WhatsAppMessage) => {
      setWhatsappMessages(prev => [...prev, message]);
      
      // Se a mensagem é para o cliente selecionado, adicionar ao chat
      if (sel && message.clienteId === sel.id) {
        const crmMessage: Mensagem = {
          id: message.id,
          clienteId: message.clienteId!,
          autor: message.direction === 'incoming' ? 'lead' : 'agente',
          canal: 'whatsapp',
          texto: message.message,
          data: message.timestamp,
        };
        dispatch({ type: "ADD_MSG", payload: crmMessage });
      }
    };
    
    whatsappService.addMessageListener(handleNewMessage);
    
    return () => {
      whatsappService.removeMessageListener(handleNewMessage);
    };
  }, [sel, dispatch]);

  const enviar = async () => {
    if (!sel || !texto.trim()) return;
    
    // Verificar se há conexão WhatsApp ativa
    if (!selectedConnection) {
      alert('Nenhuma conexão WhatsApp ativa. Configure no menu Configurações.');
      return;
    }
    
    try {
      // Enviar via WhatsApp Service
      await whatsappService.sendMessage({
        connectionId: selectedConnection.id,
        phoneNumber: whatsappService.formatPhoneNumber(sel.telefone),
        message: texto.trim(),
        clienteId: sel.id
      });
      
      setTexto("");
      
      // Registrar atividade
      const a: Atividade = {
        id: crypto.randomUUID(),
        clienteId: sel.id,
        tipo: "whatsapp",
        descricao: "Mensagem enviada via WhatsApp",
        data: new Date().toISOString(),
        responsavel: sel.responsavel,
        status: "concluido",
      };
      dispatch({ type: "ADD_ATIVIDADE", payload: a });
      
    } catch (error) {
      console.error('Erro ao enviar mensagem WhatsApp:', error);
      alert('Erro ao enviar mensagem. Verifique sua conexão WhatsApp.');
    }
  };

  const contatosFiltrados = useMemo(() => {
    const s = busca.trim().toLowerCase();
    if (!s) return contatos;
    return contatos.filter(c =>
      c.nome.toLowerCase().includes(s) || c.email.toLowerCase().includes(s) || c.telefone.includes(s)
    );
  }, [busca, contatos]);

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* lista de contatos – 1/4 */}
      <div className="col-span-1 bg-white border rounded-lg overflow-hidden flex flex-col min-h-[70vh]">
        <div className="p-3 border-b flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            className="w-full outline-none"
            placeholder="Buscar contatos…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className="overflow-y-auto">
          {contatosFiltrados.map((c) => (
            <button
              key={c.id}
              onClick={() => dispatch({ type: "SELECT_CLIENTE", payload: c })}
              className={`w-full px-3 py-3 flex items-center gap-3 hover:bg-gray-50 text-left ${
                state.clienteSelecionado?.id === c.id ? "bg-gray-50" : ""
              }`}
            >
              <Avatar nome={c.nome} url={c.avatarUrl} temperatura={c.temperatura} />
              <div className="min-w-0">
                <div className="font-medium truncate">{c.nome}</div>
                <div className="text-xs text-gray-500 truncate">{c.empreendimentoInteresse || "Sem interesse definido"}</div>
              </div>
              <div className="ml-auto text-xs text-gray-400">{c.ultimoContato ? timeBR(c.ultimoContato) : ""}</div>
            </button>
          ))}
          {contatosFiltrados.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-500">Nenhum contato.</div>
          )}
        </div>
      </div>

      {/* janela do chat – 3/4 */}
      <div className="col-span-3 bg-white border rounded-lg flex flex-col min-h-[70vh]">
        {/* topo */}
        <div className="px-4 py-3 border-b flex items-center gap-3">
          {sel ? (
            <>
              <Avatar nome={sel.nome} url={sel.avatarUrl} temperatura={sel.temperatura} />
              <div className="min-w-0">
                <div className="font-semibold">{sel.nome}</div>
                <div className="text-xs text-gray-500">
                  {sel.email} • {sel.telefone}
                </div>
              </div>
              <span className="ml-auto text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 capitalize">{sel.status}</span>
              <button
                className="px-2 py-1 border rounded text-sm"
                onClick={() => {
                  // Navegar para página específica do lead
                  window.location.href = `/pessoas/lead/${sel.id}`;
                }}
              >
                Detalhes
              </button>
            </>
          ) : (
            <div className="text-sm text-gray-500">Selecione um contato</div>
          )}
        </div>

        {/* mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {!sel && <div className="text-center text-sm text-gray-500">Nenhum contato selecionado.</div>}
          {sel &&
            msgs.map((m) => (
              <div key={m.id} className={`flex ${m.autor === "agente" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${
                    m.autor === "agente" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div>{m.texto}</div>
                  <div className={`text-[10px] mt-1 ${m.autor === "agente" ? "text-blue-100" : "text-gray-500"}`}>
                    {dateBR(m.data)} {timeBR(m.data)}
                  </div>
                </div>
              </div>
            ))}
          <div ref={endRef} />
        </div>

        {/* Status da conexão WhatsApp */}
        <div className="border-t px-3 py-2 bg-gray-50 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedConnection ? (
                <>
                  <WifiIcon className="w-3 h-3 text-green-500" />
                  <span className="text-green-700">WhatsApp conectado: {selectedConnection.phoneNumber}</span>
                </>
              ) : (
                <>
                  <ExclamationTriangleIcon className="w-3 h-3 text-red-500" />
                  <span className="text-red-700">WhatsApp desconectado - Configure nas Configurações</span>
                </>
              )}
            </div>
            
            {whatsappConnections.length > 1 && (
              <select
                value={selectedConnection?.id || ''}
                onChange={(e) => setSelectedConnection(whatsappConnections.find(c => c.id === e.target.value) || null)}
                className="text-xs border rounded px-2 py-1"
              >
                <option value="">Selecionar conexão</option>
                {whatsappConnections.filter(c => c.status === 'connected').map(conn => (
                  <option key={conn.id} value={conn.id}>
                    {conn.userName} ({conn.phoneNumber})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* composer */}
        <div className="border-t p-3 flex items-center gap-2">
          <button className="px-2 py-2 border rounded-lg" title="Anexar"><Paperclip className="w-4 h-4" /></button>
          <input
            className="flex-1 px-3 py-2 border rounded-lg"
            placeholder={selectedConnection ? "Escreva uma mensagem via WhatsApp…" : "Configure WhatsApp para enviar mensagens"}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviar(); } }}
            disabled={!selectedConnection}
          />
          <button 
            onClick={enviar} 
            disabled={!selectedConnection || !texto.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> 
            {selectedConnection ? 'Enviar' : 'WhatsApp Off'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Avatar({ nome, url, temperatura }: { nome: string; url?: string; temperatura: Temperatura }) {
  if (url) return <img src={url} alt={nome} className="w-10 h-10 rounded-full object-cover" />;
  const color =
    temperatura === "quente" ? "bg-red-500" : temperatura === "morno" ? "bg-yellow-500" : "bg-blue-500";
  return (
    <div className={`w-10 h-10 rounded-full text-white grid place-items-center ${color}`} title={`Temperatura: ${temperatura}`}>
      {initials(nome)}
    </div>
  );
}

/* =========================================================
   Filtros compactos (usado no pipeline)
========================================================= */

function FiltrosCompactos() {
  const { state, dispatch } = useCRM();
  const [open, setOpen] = useState(false);
  const set = (k: keyof FiltrosCRM, v: any) => dispatch({ type: "SET_FILTRO", payload: { [k]: v } });

  return (
    <div className="bg-white border rounded-lg mb-4">
      <button
        className="w-full flex items-center justify-between px-4 py-3"
        onClick={() => setOpen(o => !o)}
      >
        <div className="text-sm text-gray-700 flex items-center gap-2"><Filter className="w-4 h-4" /> Filtros</div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              className="pl-9 pr-3 py-2 border rounded-lg w-full"
              placeholder="Buscar por nome, e-mail ou telefone"
              value={state.filtros.busca}
              onChange={(e) => set("busca", e.target.value)}
            />
          </div>

          <select className="border rounded-lg px-3 py-2" value={state.filtros.status} onChange={(e) => set("status", e.target.value)}>
            <option value="">Todos status</option>
            {["lead", "contato", "interessado", "negociacao", "proposta", "vendido", "perdido"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select className="border rounded-lg px-3 py-2" value={state.filtros.origem} onChange={(e) => set("origem", e.target.value)}>
            <option value="">Todas origens</option>
            {["site", "indicacao", "telemarketing", "redes-sociais", "evento", "outros"].map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>

          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Responsável"
            value={state.filtros.responsavel}
            onChange={(e) => set("responsavel", e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

/* =========================================================
   Componentes auxiliares mantidos para compatibilidade
========================================================= */

const ALL_STATUS: Status[] = ["lead", "contato", "interessado", "negociacao", "proposta", "vendido", "perdido"];

/* =========================================================
   Modais / Drawers
========================================================= */

function ModalRelatorios() {
  const { state, dispatch } = useCRM();
  const open = state.modalAtivo === "relatorios";
  const list = useClientesFiltrados();
  const atividades = useAtividades();

  if (!open) return null;

  const exportCSV = (nome: string, rows: Record<string, any>[]) => {
    const headers = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
    const csv = [headers.join(";")]
      .concat(
        rows.map((r) =>
          headers.map((h) => {
            const v = r[h] ?? "";
            const s = typeof v === "string" ? v.replace(/"/g, '""') : String(v);
            return `"${s}"`;
          }).join(";")
        )
      ).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${nome}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const exportLeads = () => {
    exportCSV("leads", list.map((c) => ({
      id: c.id, nome: c.nome, email: c.email, telefone: c.telefone, origem: c.origem, status: c.status,
      responsavel: c.responsavel, criado_em: c.dataCriacao, ultimo_contato: c.ultimoContato || "", proximo_followup: c.proximoFollowUp || "",
      valor: c.valorOrcamento || "", cidade: c.cidade || "", temperatura: c.temperatura, alertaSLA: c.alertaSLA ? "SIM" : "NÃO"
    })));
  };
  const exportAtividades = () => {
    exportCSV("atividades", atividades.map((a) => ({
      id: a.id, clienteId: a.clienteId, tipo: a.tipo, descricao: a.descricao, data: a.data, responsavel: a.responsavel, status: a.status
    })));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-xl shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Relatórios / Exportação</h3>
            <button className="p-2 hover:bg-gray-100 rounded-lg" onClick={() => dispatch({ type: "CLOSE_MODAL" })}><X className="w-6 h-6" /></button>
          </div>
          <div className="space-y-3">
            <button onClick={exportLeads} className="w-full px-4 py-3 border rounded-lg flex items-center justify-between hover:bg-gray-50">
              <span>Exportar Leads (CSV)</span><Download className="w-4 h-4" />
            </button>
            <button onClick={exportAtividades} className="w-full px-4 py-3 border rounded-lg flex items-center justify-between hover:bg-gray-50">
              <span>Exportar Atividades (CSV)</span><Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalMetas() {
  const { state, dispatch } = useCRM();
  const open = state.modalAtivo === "metas";
  const [meta, setMeta] = useState<MetasPipeline>(state.metas);
  if (!open) return null;

  const salvar = () => {
    dispatch({ type: "SET_METAS", payload: meta });
    dispatch({ type: "CLOSE_MODAL" });
  };

  const Input = ({ k }: { k: keyof MetasPipeline }) => (
    <div>
      <label className="text-sm text-gray-600 capitalize">{k}</label>
      <input
        type="number"
        min={0}
        className="w-full border rounded-lg px-3 py-2"
        value={meta[k]}
        onChange={(e) => setMeta((m) => ({ ...m, [k]: parseInt(e.target.value || "0", 10) }))}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-xl shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Metas do Pipeline (mês)</h3>
            <button className="p-2 hover:bg-gray-100 rounded-lg" onClick={() => dispatch({ type: "CLOSE_MODAL" })}><X className="w-6 h-6" /></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input k="lead" /><Input k="contato" /><Input k="interessado" /><Input k="negociacao" /><Input k="proposta" /><Input k="vendido" />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button className="px-4 py-2 border rounded-lg" onClick={() => dispatch({ type: "CLOSE_MODAL" })}>Cancelar</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={salvar}>Salvar Metas</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DrawerDetalhes() {
  const { state, dispatch } = useCRM();
  const c = state.clienteSelecionado;
  const atividades = useAtividades(c?.id);
  const [novo, setNovo] = useState<Partial<Atividade>>({
    tipo: "nota",
    descricao: "",
    data: new Date().toISOString().slice(0, 16),
    status: "concluido",
    responsavel: c?.responsavel || "—",
  });
  const [follow, setFollow] = useState({
    data: c?.proximoFollowUp || "",
    responsavel: c?.responsavel || "",
  });

  if (state.modalAtivo !== "detalhes" || !c) return null;

  const salvarAtividade = () => {
    if (!novo.descricao?.trim()) return window.alert("Descreva a atividade.");
    const atividade: Atividade = {
      id: crypto.randomUUID(),
      clienteId: c.id,
      tipo: (novo.tipo || "nota") as TipoAtividade,
      descricao: novo.descricao!,
      data: (novo.data || new Date().toISOString()) as string,
      responsavel: novo.responsavel || c.responsavel,
      status: (novo.status || "concluido") as StatusAtividade,
      duracaoMinutos: novo.duracaoMinutos,
    };
    dispatch({ type: "ADD_ATIVIDADE", payload: atividade });

    const atualizado: Cliente = { ...c, ultimoContato: atividade.data, numeroContatos: (c.numeroContatos || 0) + 1 };
    dispatch({ type: "UPDATE_CLIENTE", payload: atualizado });

    setNovo({ tipo: "nota", descricao: "", data: new Date().toISOString().slice(0, 16), status: "concluido", responsavel: c.responsavel });
  };

  const agendarFollowUp = () => {
    if (!follow.data) return window.alert("Informe a data do follow-up.");
    const atualizado: Cliente = { ...c, proximoFollowUp: follow.data };
    dispatch({ type: "UPDATE_CLIENTE", payload: atualizado });

    const a: Atividade = {
      id: crypto.randomUUID(),
      clienteId: c.id,
      tipo: "follow-up",
      descricao: "Follow-up agendado",
      data: follow.data,
      responsavel: follow.responsavel || c.responsavel,
      status: "agendado",
    };
    dispatch({ type: "ADD_ATIVIDADE", payload: a });
  };

  const mudarStatus = (status: Status) => {
    dispatch({ type: "MOVE_STATUS", payload: { id: c.id, status } });
    dispatch({ type: "UPDATE_CLIENTE", payload: { ...c, status } });
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={() => dispatch({ type: "CLOSE_MODAL" })} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[560px] bg-white shadow-xl overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar nome={c.nome} temperatura={c.temperatura} />
              <div>
                <div className="text-xl font-bold">{c.nome}</div>
                <div className="text-sm text-gray-600">{c.email}</div>
                <div className="text-xs text-gray-500">Criado em {dateBR(c.dataCriacao)} • Último contato {dateBR(c.ultimoContato)}</div>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg" onClick={() => dispatch({ type: "CLOSE_MODAL" })}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* topo status */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-xs text-blue-700">Status</div>
              <div className="font-semibold capitalize">{c.status}</div>
              <div className="mt-2 flex gap-2 flex-wrap">
                {ALL_STATUS.filter((s) => s !== c.status && !["lead"].includes(s)).map((s) => (
                  <button key={s} className="text-xs border rounded px-2 py-1 hover:bg-white" onClick={() => mudarStatus(s as Status)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-xs text-green-700">Valor</div>
              <div className="font-semibold text-green-700">{money(c.valorOrcamento)}</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="text-xs text-yellow-700">Próximo follow-up</div>
              <div className="font-semibold">{c.proximoFollowUp ? dateBR(c.proximoFollowUp) : "-"}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-600">Responsável</div>
              <div className="font-semibold">{c.responsavel}</div>
            </div>
          </div>

          {/* timeline + forms */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h4 className="font-semibold mb-3">Atividades</h4>
              <div className="space-y-3">
                {atividades.map((a) => (
                  <div key={a.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 capitalize">{a.tipo}</span>
                        <span className="text-xs text-gray-500">{dateBR(a.data)} • {a.responsavel}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded ${a.status === "concluido" ? "bg-green-100 text-green-700" : a.status === "agendado" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}>
                        {a.status}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">{a.descricao}</div>
                  </div>
                ))}
                {atividades.length === 0 && (
                  <div className="text-sm text-gray-500">Sem atividades ainda.</div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Nova atividade</h4>
              <div className="border rounded-lg p-3 space-y-3">
                <select className="w-full border rounded px-3 py-2" value={novo.tipo} onChange={(e) => setNovo((f) => ({ ...f, tipo: e.target.value as TipoAtividade }))}>
                  {["ligacao", "email", "whatsapp", "reuniao", "visita", "proposta", "nota"].map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <input className="w-full border rounded px-3 py-2" placeholder="Responsável" value={novo.responsavel || c.responsavel} onChange={(e) => setNovo((f) => ({ ...f, responsavel: e.target.value }))}/>
                <input type="datetime-local" className="w-full border rounded px-3 py-2" value={novo.data} onChange={(e) => setNovo((f) => ({ ...f, data: e.target.value }))}/>
                <textarea className="w-full border rounded px-3 py-2" rows={3} placeholder="Descrição" value={novo.descricao || ""} onChange={(e) => setNovo((f) => ({ ...f, descricao: e.target.value }))}/>
                <div className="flex justify-end">
                  <button onClick={salvarAtividade} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Salvar
                  </button>
                </div>
              </div>

              <h4 className="font-semibold mt-6 mb-3">Agendar follow-up</h4>
              <div className="border rounded-lg p-3 space-y-3">
                <input type="datetime-local" className="w-full border rounded px-3 py-2" value={follow.data} onChange={(e) => setFollow((f) => ({ ...f, data: e.target.value }))}/>
                <input className="w-full border rounded px-3 py-2" placeholder="Responsável" value={follow.responsavel} onChange={(e) => setFollow((f) => ({ ...f, responsavel: e.target.value }))}/>
                <button onClick={agendarFollowUp} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" /> Agendar
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-6">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"><Phone className="w-4 h-4" /> Ligar</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"><Mail className="w-4 h-4" /> Email</button>
            {c.whatsapp && <button className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"><MessageSquare className="w-4 h-4" /> WhatsApp</button>}
            <button className="ml-auto px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2"><Edit2 className="w-4 h-4" /> Editar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalNovoLead() {
  const { state, dispatch } = useCRM();
  const open = state.modalAtivo === "novo";
  const [form, setForm] = useState<Partial<Cliente>>({
    nome: "",
    email: "",
    telefone: "",
    origem: "site",
    status: "lead",
    prioridade: "media",
    temperatura: "frio",
    responsavel: "João Corretor",
    empreendimentoInteresse: "",
  });

  const emailOk = useCallback((v: string) => emailValido(v), []);
  const foneOk = useCallback((v: string) => telefoneValido(v), []);

  if (!open) return null;

  const salvar = () => {
    if (!form.nome?.trim()) return window.alert("Informe o nome.");
    if (!form.email || !emailOk(form.email)) return window.alert("Informe um e-mail válido.");
    if (!form.telefone || !foneOk(form.telefone)) return window.alert("Informe um telefone válido.");

    const novo: Cliente = {
      id: crypto.randomUUID(),
      nome: form.nome!,
      email: form.email!,
      telefone: form.telefone!,
      origem: (form.origem || "site") as Origem,
      status: (form.status || "lead") as Status,
      prioridade: (form.prioridade || "media") as Prioridade,
      temperatura: (form.temperatura || "frio") as Temperatura,
      responsavel: form.responsavel || "João Corretor",
      dataCriacao: new Date().toISOString().slice(0, 10),
      empreendimentoInteresse: form.empreendimentoInteresse || undefined,
      numeroContatos: 0,
    };

    dispatch({ type: "ADD_CLIENTE", payload: novo });
    dispatch({ type: "CLOSE_MODAL" });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Novo Lead</h3>
            <button className="p-2 hover:bg-gray-100 rounded-lg" onClick={() => dispatch({ type: "CLOSE_MODAL" })}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Nome *">
              <input className="w-full border rounded-lg px-3 py-2" value={form.nome || ""} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}/>
            </Field>
            <Field label="E-mail *">
              <input className="w-full border rounded-lg px-3 py-2" value={form.email || ""} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}/>
            </Field>
            <Field label="Telefone *">
              <input className="w-full border rounded-lg px-3 py-2" value={form.telefone || ""} onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))}/>
            </Field>
            <Field label="Origem">
              <select className="w-full border rounded-lg px-3 py-2" value={form.origem} onChange={(e) => setForm((f) => ({ ...f, origem: e.target.value as Origem }))}>
                {["site","indicacao","telemarketing","redes-sociais","evento","outros"].map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Responsável">
              <input className="w-full border rounded-lg px-3 py-2" value={form.responsavel || ""} onChange={(e) => setForm((f) => ({ ...f, responsavel: e.target.value }))}/>
            </Field>
            <Field label="Empreendimento (interesse)">
              <input className="w-full border rounded-lg px-3 py-2" value={form.empreendimentoInteresse || ""} onChange={(e) => setForm((f) => ({ ...f, empreendimentoInteresse: e.target.value }))}/>
            </Field>
            <Field label="Prioridade">
              <select className="w-full border rounded-lg px-3 py-2" value={form.prioridade} onChange={(e) => setForm((f) => ({ ...f, prioridade: e.target.value as Prioridade }))}>
                <option value="baixa">baixa</option><option value="media">media</option><option value="alta">alta</option>
              </select>
            </Field>
            <Field label="Temperatura">
              <select className="w-full border rounded-lg px-3 py-2" value={form.temperatura} onChange={(e) => setForm((f) => ({ ...f, temperatura: e.target.value as Temperatura }))}>
                <option value="frio">frio</option><option value="morno">morno</option><option value="quente">quente</option>
              </select>
            </Field>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button className="px-4 py-2 border rounded-lg" onClick={() => dispatch({ type: "CLOSE_MODAL" })}>Cancelar</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={salvar}>Salvar Lead</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalPipelines() {
  const { state, dispatch } = useCRM();
  const open = state.modalAtivo === "pipelines";
  const atual = state.pipelines[state.pipelineAtivo];

  const [nome, setNome] = useState(atual?.nome || "");
  const [estagios, setEstagios] = useState<Status[]>(atual?.estagios || ALL_STATUS);

  useEffect(() => {
    if (open) {
      const a = state.pipelines[state.pipelineAtivo];
      setNome(a?.nome || "");
      setEstagios(a?.estagios || ALL_STATUS);
    }
  }, [open, state.pipelineAtivo, state.pipelines]);

  if (!open) return null;

  const salvar = () => {
    if (!nome.trim()) return;
    dispatch({ type: "UPSERT_PIPELINE", payload: { id: state.pipelineAtivo, nome, estagios } });
    dispatch({ type: "CLOSE_MODAL" });
  };

  const addEstagio = () => {
    const restantes = ALL_STATUS.filter(s => !estagios.includes(s));
    if (restantes[0]) setEstagios([...estagios, restantes[0]]);
  };
  const rmEstagio = (s: Status) => setEstagios(estagios.filter(e => e !== s));
  const mv = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= estagios.length) return;
    const arr = [...estagios];
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setEstagios(arr);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Gerenciar Pipeline</h3>
            <button className="p-2 hover:bg-gray-100 rounded-lg" onClick={() => dispatch({ type: "CLOSE_MODAL" })}><X className="w-6 h-6" /></button>
          </div>

          <div className="space-y-4">
            <Field label="Nome do pipeline">
              <input className="w-full border rounded-lg px-3 py-2" value={nome} onChange={(e) => setNome(e.target.value)} />
            </Field>

            <div>
              <div className="text-sm font-medium mb-2">Estágios</div>
              <div className="space-y-2">
                {estagios.map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <span className="px-2 py-1 border rounded capitalize">{s}</span>
                    <button className="px-2 py-1 border rounded text-xs" onClick={() => mv(i, -1)}>↑</button>
                    <button className="px-2 py-1 border rounded text-xs" onClick={() => mv(i, +1)}>↓</button>
                    <button className="px-2 py-1 border rounded text-xs text-red-600" onClick={() => rmEstagio(s)}>remover</button>
                  </div>
                ))}
              </div>
              <button className="mt-3 px-3 py-1.5 border rounded" onClick={addEstagio}>Adicionar estágio</button>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button className="px-4 py-2 border rounded-lg" onClick={() => dispatch({ type: "CLOSE_MODAL" })}>Cancelar</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={salvar}>Salvar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   UI base
========================================================= */

function Field(props: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{props.label}</span>
      {props.children}
    </label>
  );
}

/* =========================================================
   Página CRM — Nova estrutura sem guia superior
========================================================= */

export default function CRM() {
  return (
    <Provider>
      <MainView />
      <DrawerDetalhes />
      <ModalNovoLead />
      <ModalMetas />
      <ModalRelatorios />
      <ModalPipelines />
    </Provider>
  );
}

function MainView() {
  const { state, dispatch } = useCRM();
  
  const handleSelectBoard = (board: Board) => {
    dispatch({ type: "SELECT_BOARD", payload: board });
  };
  
  const handleBackToSelector = () => {
    dispatch({ type: "SELECT_BOARD", payload: null });
  };
  
  const handleCreateBoard = () => {
    // Implementar criação de novo board
    console.log('Criar novo board');
  };
  
  const handleOpenAutomations = () => {
    // Implementar modal de automações
    console.log('Abrir automações');
  };
  
  const handleOpenSettings = () => {
    // Implementar configurações do board
    console.log('Abrir configurações do board');
  };

  // Roteamento baseado na view
  switch (state.view) {
    case "board-selector":
      return (
        <BoardSelector 
          onSelectBoard={handleSelectBoard}
          onCreateBoard={handleCreateBoard}
        />
      );
    
    case "kanban":
      return state.selectedBoard ? (
        <BoardKanban
          board={state.selectedBoard}
          onBack={handleBackToSelector}
          onOpenAutomations={handleOpenAutomations}
          onOpenSettings={handleOpenSettings}
        />
      ) : (
        <BoardSelector 
          onSelectBoard={handleSelectBoard}
          onCreateBoard={handleCreateBoard}
        />
      );
    
    case "chat":
      return (
        <div className="h-screen bg-gray-50">
          <div className="p-6">
            <Chat />
          </div>
        </div>
      );
    
    case "dashboard":
      return (
        <div className="h-screen bg-gray-50">
          <div className="p-6">
            <Dashboard />
          </div>
        </div>
      );
    
    default:
      return (
        <BoardSelector 
          onSelectBoard={handleSelectBoard}
          onCreateBoard={handleCreateBoard}
        />
      );
  }
}
