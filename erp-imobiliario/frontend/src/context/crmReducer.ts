export interface CRMState {
  clientes: any[];
  atividades: any[];
  loading: boolean;
  error: string | null;
}

export type CRMAction =
  | { type: 'SET_CLIENTES'; payload: any[] }
  | { type: 'SET_ATIVIDADES'; payload: any[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string };

export const initialState: CRMState = {
  clientes: [],
  atividades: [],
  loading: false,
  error: null,
};

export function crmReducer(state: CRMState, action: CRMAction): CRMState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload, ...(action.payload ? { error: null } : {}) };
    case 'SET_CLIENTES':
      return { ...state, clientes: action.payload };
    case 'SET_ATIVIDADES':
      return { ...state, atividades: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}