import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { fetchClientes, fetchAtividades } from '../services/crmService';
import { CRMState, CRMAction, crmReducer, initialState } from './crmReducer';

interface CRMContextProps extends CRMState {
  dispatch: React.Dispatch<CRMAction>;
}

export const CRMContext = createContext<CRMContextProps>({
  ...initialState,
  dispatch: () => undefined,
});

export const CRMProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(crmReducer, initialState);

  useEffect(() => {
    const load = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const [clientes, atividades] = await Promise.all([
          fetchClientes(),
          fetchAtividades(),
        ]);
        dispatch({ type: 'SET_CLIENTES', payload: clientes });
        dispatch({ type: 'SET_ATIVIDADES', payload: atividades });
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : 'Erro ao carregar dados';
        dispatch({ type: 'SET_ERROR', payload: message });
        if (typeof window !== 'undefined') {
          window.alert(message);
        } else {
          console.error(message);
        }
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    load();
  }, []);

  return (
    <CRMContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CRMContext.Provider>
  );
};

