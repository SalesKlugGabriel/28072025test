export async function fetchClientes() {
  const response = await fetch('/api/clientes');
  if (!response.ok) {
    throw new Error('Erro ao buscar clientes');
  }
  return response.json();
}

export async function fetchAtividades() {
  const response = await fetch('/api/atividades');
  if (!response.ok) {
    throw new Error('Erro ao buscar atividades');
  }
  return response.json();
}