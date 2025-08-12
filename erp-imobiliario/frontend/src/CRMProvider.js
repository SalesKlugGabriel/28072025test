import React, { createContext, useReducer, useEffect } from 'react';

const STORAGE_KEY = 'crm-state';
const STORAGE_VERSION = 1;

export const initialState = {
  clientes: [],
  atividades: [],
  filtros: {},
};

export const CRMContext = createContext({ state: initialState, dispatch: () => {} });

function reducer(state, action) {
  switch (action.type) {
    case 'SET_CLIENTES':
      return { ...state, clientes: action.payload };
    case 'SET_ATIVIDADES':
      return { ...state, atividades: action.payload };
    case 'SET_FILTROS':
      return { ...state, filtros: action.payload };
    default:
      return state;
  }
}

function migrate(data, version) {
  let migrated = { ...data };
  if (version < 1) {
    migrated.filtros = migrated.filtros || {};
  }
  return migrated;
}

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const version = parsed.version ?? 0;
    let data = parsed.data ?? {};
    if (version !== STORAGE_VERSION) {
      data = migrate(data, version);
    }
    return data;
  } catch (err) {
    return {};
  }
}

function CRMProvider({ children }) {
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    init => ({ ...init, ...loadPersisted() })
  );

  useEffect(() => {
    const data = {
      clientes: state.clientes,
      atividades: state.atividades,
      filtros: state.filtros,
    };
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: STORAGE_VERSION, data })
      );
    } catch (err) {
      /* ignore persistence errors */
    }
  }, [state.clientes, state.atividades, state.filtros]);

  return (
    <CRMContext.Provider value={{ state, dispatch }}>
      {children}
    </CRMContext.Provider>
  );
}

export { CRMProvider, reducer };