const React = require('react');

function useFormatters() {
  return React.useMemo(() => ({
    formatCurrency(value) {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    },
    formatDate(value) {
      return new Intl.DateTimeFormat('pt-BR').format(new Date(value));
    },
    formatPhone(value) {
      const digits = String(value).replace(/\D/g, '');
      if (digits.length === 10) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
      }
      if (digits.length === 11) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
      }
      return value;
    }
  }), []);
}

module.exports = useFormatters;