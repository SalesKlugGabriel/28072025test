interface EmpreendimentoResumo {
  nome: string;
  localizacao: { cidade: string; estado: string };
  valorMedio: number;
  unidadesTotal: number;
  unidadesVendidas: number;
}

/**
 * Simplified summary generator used by the chat command /"nome do empreendimento".
 * In a real project this function would fetch the empreendimento by name from
 * the database or CRM module and format a friendly message.
 */
export function formatEmpreendimentoSummary(nome: string): string {
  // TODO: integrate with real store or API
  const mock: EmpreendimentoResumo = {
    nome,
    localizacao: { cidade: 'Cidade', estado: 'UF' },
    valorMedio: 0,
    unidadesTotal: 0,
    unidadesVendidas: 0
  };
  return `${mock.nome}\n${mock.localizacao.cidade}/${mock.localizacao.estado}\n` +
    `Vendidas: ${mock.unidadesVendidas}/${mock.unidadesTotal}\n` +
    `Valor médio: R$ ${mock.valorMedio}`;
}