const { crmReducer, initialState } = require('./crmReducer');

describe('crmReducer', () => {
  test('ADD_CLIENTE', () => {
    const action = { type: 'ADD_CLIENTE', payload: { id: 1, nome: 'Joao' } };
    const state = crmReducer(initialState, action);
    expect(state.clientes).toHaveLength(1);
    expect(state.clientes[0]).toEqual({ id: 1, nome: 'Joao' });
  });

  test('UPDATE_CLIENTE', () => {
    const startState = {
      clientes: [{ id: 1, nome: 'Joao', idade: 20 }],
      filtros: {}
    };
    const action = {
      type: 'UPDATE_CLIENTE',
      payload: { id: 1, data: { idade: 21 } }
    };
    const state = crmReducer(startState, action);
    expect(state.clientes[0].idade).toBe(21);
  });

  test('SET_FILTROS', () => {
    const action = {
      type: 'SET_FILTROS',
      payload: { status: 'ativo', origem: 'site' }
    };
    const state = crmReducer(initialState, action);
    expect(state.filtros).toEqual({ status: 'ativo', origem: 'site' });
  });

  test('CLEAR_FILTROS', () => {
    const startState = {
      clientes: [],
      filtros: { status: 'ativo', origem: 'site' }
    };
    const state = crmReducer(startState, { type: 'CLEAR_FILTROS' });
    expect(state.filtros).toEqual({});
  });
});