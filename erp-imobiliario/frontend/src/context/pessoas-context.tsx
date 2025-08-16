import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { PessoasState, PessoasAction, Pessoa, Cliente, Lead } from '../types/pessoa';
import { gerarMockPessoas } from '../data/mock-pessoas';

// Estado inicial
const initialState: PessoasState = {
  pessoas: [],
  pessoaSelecionada: null,
  filtros: {},
  loading: false,
  error: null,
  modalAberto: false,
  perfilAberto: false,
  modoEdicao: false,
  abaAtiva: 'todos'
};

// Reducer
function pessoasReducer(state: PessoasState, action: PessoasAction): PessoasState {
  switch (action.type) {
    case 'SET_PESSOAS':
      return { ...state, pessoas: action.payload, loading: false };
      
    case 'ADD_PESSOA':
      return { 
        ...state, 
        pessoas: [...state.pessoas, action.payload],
        modalAberto: false,
        modoEdicao: false
      };
      
    case 'UPDATE_PESSOA':
      return {
        ...state,
        pessoas: state.pessoas.map(p => 
          p.id === action.payload.id ? action.payload : p
        ),
        pessoaSelecionada: state.pessoaSelecionada?.id === action.payload.id 
          ? action.payload 
          : state.pessoaSelecionada,
        modalAberto: false,
        modoEdicao: false
      };
      
    case 'DELETE_PESSOA':
      return {
        ...state,
        pessoas: state.pessoas.filter(p => p.id !== action.payload),
        pessoaSelecionada: state.pessoaSelecionada?.id === action.payload 
          ? null 
          : state.pessoaSelecionada
      };
      
    case 'SET_PESSOA_SELECIONADA':
      return { ...state, pessoaSelecionada: action.payload };
      
    case 'SET_FILTROS':
      return { ...state, filtros: action.payload };
      
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
      
    case 'SET_MODAL_ABERTO':
      return { 
        ...state, 
        modalAberto: action.payload,
        modoEdicao: action.payload ? state.modoEdicao : false
      };

    case 'SET_PERFIL_ABERTO':
      return { ...state, perfilAberto: action.payload };
      
    case 'SET_MODO_EDICAO':
      return { ...state, modoEdicao: action.payload };
      
    case 'SET_ABA_ATIVA':
      return { ...state, abaAtiva: action.payload };
      
    case 'CONVERTER_LEAD_CLIENTE': {
      const { leadId, dadosCliente } = action.payload;
      const lead = state.pessoas.find(p => p.id === leadId && p.tipo === 'lead') as Lead;
      
      if (!lead) return state;
      
      // Criar cliente a partir do lead
      const novoCliente: Cliente = {
        ...lead,
        id: `cliente-${Date.now()}`,
        tipo: 'cliente',
        unidadesAdquiridas: [],
        valorTotalInvestido: 0,
        valorPatrimonioAtual: 0,
        classificacao: 'bronze',
        dataAtualizacao: new Date().toISOString().split('T')[0],
        ...dadosCliente
      };
      
      return {
        ...state,
        pessoas: [
          ...state.pessoas.filter(p => p.id !== leadId),
          novoCliente
        ]
      };
    }
    
    case 'ADD_DOCUMENTO': {
      const { pessoaId, documento } = action.payload;
      return {
        ...state,
        pessoas: state.pessoas.map(p => 
          p.id === pessoaId 
            ? { ...p, documentos: [...p.documentos, documento] }
            : p
        ),
        pessoaSelecionada: state.pessoaSelecionada?.id === pessoaId
          ? { ...state.pessoaSelecionada, documentos: [...state.pessoaSelecionada.documentos, documento] }
          : state.pessoaSelecionada
      };
    }
    
    case 'REMOVE_DOCUMENTO': {
      const { pessoaId, documentoId } = action.payload;
      return {
        ...state,
        pessoas: state.pessoas.map(p => 
          p.id === pessoaId 
            ? { ...p, documentos: p.documentos.filter(d => d.id !== documentoId) }
            : p
        ),
        pessoaSelecionada: state.pessoaSelecionada?.id === pessoaId
          ? { 
              ...state.pessoaSelecionada, 
              documentos: state.pessoaSelecionada.documentos.filter(d => d.id !== documentoId) 
            }
          : state.pessoaSelecionada
      };
    }
    
    default:
      return state;
  }
}

// Context
const PessoasContext = createContext<{
  state: PessoasState;
  dispatch: React.Dispatch<PessoasAction>;
} | null>(null);

// Provider
interface PessoasProviderProps {
  children: React.ReactNode;
}

export function PessoasProvider({ children }: PessoasProviderProps) {
  const [state, dispatch] = useReducer(pessoasReducer, initialState);
  
  // Carregar dados mock na inicialização
  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simular carregamento
    const timer = setTimeout(() => {
      const mockPessoas = gerarMockPessoas(50);
      dispatch({ type: 'SET_PESSOAS', payload: mockPessoas });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <PessoasContext.Provider value={{ state, dispatch }}>
      {children}
    </PessoasContext.Provider>
  );
}

// Hook personalizado
export function usePessoas() {
  const context = useContext(PessoasContext);
  if (!context) {
    throw new Error('usePessoas deve ser usado dentro de PessoasProvider');
  }
  return context;
}

// Funções utilitárias
export function filtrarPessoas(pessoas: Pessoa[], filtros: PessoasState['filtros']): Pessoa[] {
  return pessoas.filter(pessoa => {
    // Filtro por tipo
    if (filtros.tipo?.length && !filtros.tipo.includes(pessoa.tipo)) {
      return false;
    }
    
    // Filtro por status
    if (filtros.status?.length && !filtros.status.includes(pessoa.status)) {
      return false;
    }
    
    // Filtro por tags
    if (filtros.tags?.length) {
      const temTag = filtros.tags.some(tag => pessoa.tags.includes(tag));
      if (!temTag) return false;
    }
    
    // Filtro por cidade
    if (filtros.cidade?.length && !filtros.cidade.includes(pessoa.endereco.cidade)) {
      return false;
    }
    
    // Filtro por tipo de pessoa (PF/PJ)
    if (filtros.pessoaFisica !== undefined && pessoa.pessoaFisica !== filtros.pessoaFisica) {
      return false;
    }
    
    // Filtro por data de inclusão
    if (filtros.dataInclusaoInicio) {
      if (pessoa.dataInclusao < filtros.dataInclusaoInicio) return false;
    }
    if (filtros.dataInclusaoFim) {
      if (pessoa.dataInclusao > filtros.dataInclusaoFim) return false;
    }
    
    // Filtro por busca (nome, email, telefone, CPF/CNPJ)
    if (filtros.busca) {
      const busca = filtros.busca.toLowerCase();
      const termosParaBuscar = [
        pessoa.nome.toLowerCase(),
        pessoa.email.toLowerCase(),
        pessoa.telefone.toLowerCase(),
        pessoa.cpfCnpj.toLowerCase(),
        pessoa.observacoes.toLowerCase(),
        ...pessoa.tags.map(tag => tag.toLowerCase())
      ];
      
      const encontrou = termosParaBuscar.some(termo => termo.includes(busca));
      if (!encontrou) return false;
    }
    
    return true;
  });
}

// Funções de ação
export const pessoasActions = {
  adicionarPessoa: (pessoa: Pessoa) => ({
    type: 'ADD_PESSOA' as const,
    payload: pessoa
  }),
  
  atualizarPessoa: (pessoa: Pessoa) => ({
    type: 'UPDATE_PESSOA' as const,
    payload: pessoa
  }),
  
  excluirPessoa: (id: string) => ({
    type: 'DELETE_PESSOA' as const,
    payload: id
  }),
  
  selecionarPessoa: (pessoa: Pessoa | null) => ({
    type: 'SET_PESSOA_SELECIONADA' as const,
    payload: pessoa
  }),
  
  abrirModal: (modoEdicao: boolean = false) => (dispatch: React.Dispatch<PessoasAction>) => {
    dispatch({ type: 'SET_MODO_EDICAO', payload: modoEdicao });
    dispatch({ type: 'SET_MODAL_ABERTO', payload: true });
  },
  
  fecharModal: () => ({
    type: 'SET_MODAL_ABERTO' as const,
    payload: false
  }),
  
  converterLeadParaCliente: (leadId: string, dadosCliente: Partial<Cliente> = {}) => ({
    type: 'CONVERTER_LEAD_CLIENTE' as const,
    payload: { leadId, dadosCliente }
  }),
  
  adicionarDocumento: (pessoaId: string, documento: any) => ({
    type: 'ADD_DOCUMENTO' as const,
    payload: { pessoaId, documento }
  }),
  
  removerDocumento: (pessoaId: string, documentoId: string) => ({
    type: 'REMOVE_DOCUMENTO' as const,
    payload: { pessoaId, documentoId }
  })
};