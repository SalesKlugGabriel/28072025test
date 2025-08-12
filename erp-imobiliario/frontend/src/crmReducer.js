const initialState = {
  clientes: [],
  filtros: {}
};

function crmReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'ADD_CLIENTE':
      return {
        ...state,
        clientes: [...state.clientes, action.payload]
      };
    case 'UPDATE_CLIENTE':
      return {
        ...state,
        clientes: state.clientes.map((c) =>
          c.id === action.payload.id ? { ...c, ...action.payload.data } : c
        )
      };
    case 'SET_FILTROS':
      return {
        ...state,
        filtros: { ...state.filtros, ...action.payload }
      };
    case 'CLEAR_FILTROS':
      return {
        ...state,
        filtros: {}
      };
    default:
      return state;
  }
}

module.exports = { crmReducer, initialState };