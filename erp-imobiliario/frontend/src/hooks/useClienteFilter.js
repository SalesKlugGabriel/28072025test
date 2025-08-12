const React = require('react');

function useClienteFilter(clientes = [], filtros = {}) {
  const { status, origem, minValor, maxValor } = filtros;
  return React.useMemo(() => {
    return clientes.filter((c) => {
      if (status && c.status !== status) return false;
      if (origem && c.origem !== origem) return false;
      if (minValor != null && c.valor < minValor) return false;
      if (maxValor != null && c.valor > maxValor) return false;
      return true;
    });
  }, [clientes, status, origem, minValor, maxValor]);
}

module.exports = useClienteFilter;