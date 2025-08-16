import React, { useState, FormEvent, useEffect } from 'react';
import { X, User, Mail, Phone, Target, Save } from 'lucide-react';
import FormularioCompletoLead from './FormularioCompletoLead';

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  origem: string;
}

interface Props {
  aberto: boolean;
  dispatch: React.Dispatch<
    | { type: 'SET_MODAL_ATIVO'; payload: string | null }
    | { type: 'ADD_CLIENTE'; payload: Cliente }
  >;
}

const NovoLeadModal: React.FC<Props> = ({ aberto, dispatch }) => {
  // Estado para controlar qual formulário usar
  const [tipoFormulario, setTipoFormulario] = useState<'basico' | 'completo'>('basico');
  
  // Estados do formulário básico
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [origem, setOrigem] = useState('');
  
  // Estados de validação e UI
  const [erros, setErros] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);

  // Lista de origens pré-definidas
  const origensDisponiveis = [
    'Site Institucional',
    'Google Ads',
    'Facebook Ads',
    'Instagram',
    'Indicação',
    'WhatsApp',
    'Telefone',
    'E-mail Marketing',
    'Evento/Feira',
    'Outros'
  ];

  // Limpar formulário quando modal fechar
  useEffect(() => {
    if (!aberto) {
      setNome('');
      setEmail('');
      setTelefone('');
      setOrigem('');
      setErros({});
      setEnviando(false);
      setTipoFormulario('basico');
    }
  }, [aberto]);

  // Máscara para telefone
  const formatarTelefone = (valor: string) => {
    const numeros = valor.replace(/\D/g, '');
    
    if (numeros.length <= 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  };

  // Validações
  const validarFormulario = () => {
    const novosErros: Record<string, string> = {};

    if (!nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
    } else if (nome.trim().length < 2) {
      novosErros.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!email.trim()) {
      novosErros.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      novosErros.email = 'E-mail inválido';
    }

    if (!telefone.trim()) {
      novosErros.telefone = 'Telefone é obrigatório';
    } else if (telefone.replace(/\D/g, '').length < 10) {
      novosErros.telefone = 'Telefone deve ter pelo menos 10 dígitos';
    }

    if (!origem.trim()) {
      novosErros.origem = 'Origem é obrigatória';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // Submit do formulário básico
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setEnviando(true);

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800));

      const novoCliente: Cliente = {
        id: `lead_${Date.now()}`,
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        telefone: telefone.trim(),
        origem: origem.trim(),
      };

      dispatch({ type: 'ADD_CLIENTE', payload: novoCliente });
      dispatch({ type: 'SET_MODAL_ATIVO', payload: null });

      // Feedback de sucesso (você pode adicionar toast notification aqui)
      console.log('Lead adicionado com sucesso:', novoCliente);

    } catch (error) {
      console.error('Erro ao adicionar lead:', error);
      setErros({ geral: 'Erro ao salvar lead. Tente novamente.' });
    } finally {
      setEnviando(false);
    }
  };

  // Submit do formulário completo
  const handleSubmitCompleto = (dadosCompletos: any) => {
    try {
      const novoCliente: Cliente = {
        id: `lead_${Date.now()}`,
        nome: dadosCompletos.nome,
        email: dadosCompletos.email,
        telefone: dadosCompletos.telefone,
        origem: dadosCompletos.origem || 'Cadastro Completo',
      };

      dispatch({ type: 'ADD_CLIENTE', payload: novoCliente });
      dispatch({ type: 'SET_MODAL_ATIVO', payload: null });

      // Feedback de sucesso
      console.log('Lead completo adicionado com sucesso:', dadosCompletos);

    } catch (error) {
      console.error('Erro ao adicionar lead completo:', error);
    }
  };

  // Fechar modal
  const fecharModal = () => {
    if (!enviando) {
      dispatch({ type: 'SET_MODAL_ATIVO', payload: null });
    }
  };

  // Fechar com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && aberto && !enviando) {
        fecharModal();
      }
    };

    if (aberto) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [aberto, enviando, fecharModal]);

  if (!aberto) return null;

  // Se formulário completo estiver ativo, renderizar o FormularioCompletoLead
  if (tipoFormulario === 'completo') {
    return (
      <FormularioCompletoLead
        aberto={aberto}
        dadosIniciais={{
          nome,
          email,
          telefone,
          origem
        }}
        onSalvar={handleSubmitCompleto}
        onFechar={fecharModal}
        titulo="Cadastro Completo - Novo Lead"
      />
    );
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={fecharModal}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Novo Lead</h2>
                <p className="text-sm text-gray-500">Cadastrar novo cliente potencial</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTipoFormulario('completo')}
                className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                disabled={enviando}
              >
                📋 Completo
              </button>
              <button
                onClick={fecharModal}
                disabled={enviando}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Erro geral */}
            {erros.geral && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {erros.geral}
              </div>
            )}

            {/* Campo Nome */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nome Completo *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    erros.nome ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Ex: João Silva Santos"
                  disabled={enviando}
                />
              </div>
              {erros.nome && (
                <p className="text-sm text-red-600">{erros.nome}</p>
              )}
            </div>

            {/* Campo E-mail */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                E-mail *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    erros.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="joao@exemplo.com"
                  disabled={enviando}
                />
              </div>
              {erros.email && (
                <p className="text-sm text-red-600">{erros.email}</p>
              )}
            </div>

            {/* Campo Telefone */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Telefone *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    erros.telefone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                  disabled={enviando}
                />
              </div>
              {erros.telefone && (
                <p className="text-sm text-red-600">{erros.telefone}</p>
              )}
            </div>

            {/* Campo Origem */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Origem do Lead *
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={origem}
                  onChange={(e) => setOrigem(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none ${
                    erros.origem ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={enviando}
                >
                  <option value="">Selecione a origem</option>
                  {origensDisponiveis.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
              {erros.origem && (
                <p className="text-sm text-red-600">{erros.origem}</p>
              )}
            </div>

            {/* Banner informativo */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="text-blue-600">💡</div>
                <div className="text-blue-800">
                  <span className="font-medium">Quer capturar mais informações?</span>
                  <p className="text-blue-700 text-xs mt-1">
                    Use o formulário completo para CPF, RG, endereço, dados bancários e muito mais.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTipoFormulario('completo')}
                  className="ml-auto px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                  disabled={enviando}
                >
                  Usar Completo
                </button>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={fecharModal}
                disabled={enviando}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={enviando}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {enviando ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Salvar Lead
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NovoLeadModal;