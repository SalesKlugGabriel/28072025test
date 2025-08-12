const { renderHook } = require('@testing-library/react');
require('@testing-library/jest-dom');
const useFormatters = require('./useFormatters');

describe('useFormatters', () => {
  test('formata moeda', () => {
    const { result } = renderHook(() => useFormatters());
    expect(result.current.formatCurrency(1234.5)).toBe('R$\u00a01.234,50');
  });

  test('formata data', () => {
    const { result } = renderHook(() => useFormatters());
    expect(result.current.formatDate('2024-05-20')).toBe('20/05/2024');
  });

  test('formata telefone', () => {
    const { result } = renderHook(() => useFormatters());
    expect(result.current.formatPhone('11987654321')).toBe('(11) 98765-4321');
  });
});