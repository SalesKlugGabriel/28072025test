const { renderHook } = require('@testing-library/react');
const useClienteFilter = require('./useClienteFilter');

const clientes = [
  { id: 1, nome: 'A', status: 'ativo', origem: 'site', valor: 100 },
  { id: 2, nome: 'B', status: 'inativo', origem: 'indicacao', valor: 200 },
  { id: 3, nome: 'C', status: 'ativo', origem: 'site', valor: 300 }
];

describe('useClienteFilter', () => {
  test('filtra por status', () => {
    const { result } = renderHook(() => useClienteFilter(clientes, { status: 'ativo' }));
    expect(result.current).toHaveLength(2);
    expect(result.current.map(c => c.id)).toEqual([1,3]);
  });

  test('filtra por origem', () => {
    const { result } = renderHook(() => useClienteFilter(clientes, { origem: 'indicacao' }));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe(2);
  });

  test('filtra por faixa de valores', () => {
    const { result } = renderHook(() => useClienteFilter(clientes, { minValor: 150, maxValor: 250 }));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe(2);
  });
});