import { FormularioPessoa, ValidationResult, PessoaFormErrors } from '../types/pessoa';

// Validação de CPF
export function validarCPF(cpf: string): boolean {
  const cpfLimpo = cpf.replace(/\D/g, '');
  
  if (cpfLimpo.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpfLimpo)) return false; // Todos os dígitos iguais
  
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  const digito1 = resto > 9 ? 0 : resto;
  
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  const digito2 = resto > 9 ? 0 : resto;
  
  return cpfLimpo.charAt(9) === digito1.toString() && cpfLimpo.charAt(10) === digito2.toString();
}

// Validação de CNPJ
export function validarCNPJ(cnpj: string): boolean {
  const cnpjLimpo = cnpj.replace(/\D/g, '');
  
  if (cnpjLimpo.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpjLimpo)) return false; // Todos os dígitos iguais
  
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  let soma = 0;
  for (let i = 0; i < 12; i++) {
    soma += parseInt(cnpjLimpo.charAt(i)) * weights1[i];
  }
  let resto = soma % 11;
  const digito1 = resto < 2 ? 0 : 11 - resto;
  
  soma = 0;
  for (let i = 0; i < 13; i++) {
    soma += parseInt(cnpjLimpo.charAt(i)) * weights2[i];
  }
  resto = soma % 11;
  const digito2 = resto < 2 ? 0 : 11 - resto;
  
  return cnpjLimpo.charAt(12) === digito1.toString() && cnpjLimpo.charAt(13) === digito2.toString();
}

// Validação de email
export function validarEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validação de telefone
export function validarTelefone(telefone: string): boolean {
  const telefoneDigitos = telefone.replace(/\D/g, '');
  return telefoneDigitos.length >= 10 && telefoneDigitos.length <= 11;
}

// Validação de CEP
export function validarCEP(cep: string): boolean {
  const cepLimpo = cep.replace(/\D/g, '');
  return cepLimpo.length === 8;
}

// Validação principal do formulário
export function validarFormularioPessoa(dados: FormularioPessoa): ValidationResult {
  const errors: PessoaFormErrors = {};
  
  // Nome obrigatório
  if (!dados.nome?.trim()) {
    errors.nome = 'Nome é obrigatório';
  } else if (dados.nome.trim().length < 2) {
    errors.nome = 'Nome deve ter pelo menos 2 caracteres';
  }
  
  // CPF/CNPJ obrigatório e válido
  if (!dados.cpfCnpj?.trim()) {
    errors.cpfCnpj = 'CPF/CNPJ é obrigatório';
  } else {
    const documento = dados.cpfCnpj.replace(/\D/g, '');
    if (dados.pessoaFisica) {
      if (!validarCPF(dados.cpfCnpj)) {
        errors.cpfCnpj = 'CPF inválido';
      }
    } else {
      if (!validarCNPJ(dados.cpfCnpj)) {
        errors.cpfCnpj = 'CNPJ inválido';
      }
    }
  }
  
  // Telefone obrigatório e válido
  if (!dados.telefone?.trim()) {
    errors.telefone = 'Telefone é obrigatório';
  } else if (!validarTelefone(dados.telefone)) {
    errors.telefone = 'Telefone inválido';
  }
  
  // Email obrigatório e válido
  if (!dados.email?.trim()) {
    errors.email = 'Email é obrigatório';
  } else if (!validarEmail(dados.email)) {
    errors.email = 'Email inválido';
  }
  
  // Validação do endereço
  const enderecoErrors: Partial<Record<keyof typeof dados.endereco, string>> = {};
  
  if (!dados.endereco?.logradouro?.trim()) {
    enderecoErrors.logradouro = 'Logradouro é obrigatório';
  }
  
  if (!dados.endereco?.numero?.trim()) {
    enderecoErrors.numero = 'Número é obrigatório';
  }
  
  if (!dados.endereco?.bairro?.trim()) {
    enderecoErrors.bairro = 'Bairro é obrigatório';
  }
  
  if (!dados.endereco?.cidade?.trim()) {
    enderecoErrors.cidade = 'Cidade é obrigatória';
  }
  
  if (!dados.endereco?.estado?.trim()) {
    enderecoErrors.estado = 'Estado é obrigatório';
  }
  
  if (!dados.endereco?.cep?.trim()) {
    enderecoErrors.cep = 'CEP é obrigatório';
  } else if (!validarCEP(dados.endereco.cep)) {
    enderecoErrors.cep = 'CEP inválido';
  }
  
  if (Object.keys(enderecoErrors).length > 0) {
    errors.endereco = enderecoErrors;
  }
  
  // Validações específicas por tipo
  switch (dados.tipo) {
    case 'lead':
      if (!dados.origemContato) {
        errors.origemContato = 'Origem do contato é obrigatória para leads';
      }
      break;
      
    case 'fornecedor':
      if (!dados.produtosServicos?.length) {
        errors.produtosServicos = 'Produtos/serviços são obrigatórios para fornecedores';
      }
      if (!dados.categoria?.trim()) {
        errors.categoria = 'Categoria é obrigatória para fornecedores';
      }
      break;
      
    case 'colaborador_pf':
      if (!dados.cargo?.trim()) {
        errors.cargo = 'Cargo é obrigatório para colaboradores';
      }
      if (!dados.departamento?.trim()) {
        errors.departamento = 'Departamento é obrigatório para colaboradores';
      }
      if (!dados.dataAdmissao) {
        errors.dataAdmissao = 'Data de admissão é obrigatória';
      }
      break;
      
    case 'colaborador_pj':
      if (!dados.servicosPrestados?.length) {
        errors.servicosPrestados = 'Serviços prestados são obrigatórios';
      }
      if (!dados.dataInicioContrato) {
        errors.dataInicioContrato = 'Data de início do contrato é obrigatória';
      }
      break;
  }
  
  const isValid = Object.keys(errors).length === 0;
  
  return {
    isValid,
    errors
  };
}

// Formatação de documentos
export function formatarCPF(cpf: string): string {
  const digitos = cpf.replace(/\D/g, '');
  return digitos.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatarCNPJ(cnpj: string): string {
  const digitos = cnpj.replace(/\D/g, '');
  return digitos.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

export function formatarTelefone(telefone: string): string {
  const digitos = telefone.replace(/\D/g, '');
  if (digitos.length === 11) {
    return digitos.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (digitos.length === 10) {
    return digitos.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return telefone;
}

export function formatarCEP(cep: string): string {
  const digitos = cep.replace(/\D/g, '');
  return digitos.replace(/(\d{5})(\d{3})/, '$1-$2');
}

// Função para buscar CEP via API
export async function buscarCEP(cep: string): Promise<any> {
  const cepLimpo = cep.replace(/\D/g, '');
  
  if (cepLimpo.length !== 8) {
    throw new Error('CEP inválido');
  }
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      throw new Error('CEP não encontrado');
    }
    
    return {
      logradouro: data.logradouro || '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      estado: data.uf || '',
      cep: formatarCEP(cep)
    };
  } catch (error) {
    throw new Error('Erro ao buscar CEP');
  }
}