import React, { useState, FormEvent } from 'react';

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
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [origem, setOrigem] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const novoCliente: Cliente = {
      id: Date.now().toString(),
      nome,
      email,
      telefone,
      origem,
    };

    dispatch({ type: 'ADD_CLIENTE', payload: novoCliente });
    dispatch({ type: 'SET_MODAL_ATIVO', payload: null });

    setNome('');
    setEmail('');
    setTelefone('');
    setOrigem('');
  };

  if (!aberto) return null;

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <label>
          Nome
          <input value={nome} onChange={(e) => setNome(e.target.value)} />
        </label>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Telefone
          <input value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        </label>
        <label>
          Origem
          <input value={origem} onChange={(e) => setOrigem(e.target.value)} />
        </label>
        <button type="submit">Salvar</button>
      </form>
      <button onClick={() => dispatch({ type: 'SET_MODAL_ATIVO', payload: null })}>
        Fechar
      </button>
    </div>
  );
};

export default NovoLeadModal;