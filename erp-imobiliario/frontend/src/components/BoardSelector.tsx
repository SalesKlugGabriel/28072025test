import React, { useState } from 'react';
import { Plus, LayoutGrid, Target, Users, Zap, Clock } from 'lucide-react';
import { Board, BoardType } from '../types/crm-boards';

interface BoardSelectorProps {
  onSelectBoard: (board: Board) => void;
  onCreateBoard: () => void;
}

const mockBoards: Board[] = [
  {
    id: 'vendas-principais',
    nome: 'Vendas Principais',
    descricao: 'Pipeline principal de vendas para imóveis residenciais',
    cor: '#3B82F6',
    icone: 'target',
    ordem: 1,
    ativo: true,
    tipo: 'vendas' as BoardType,
    estagios: [
      { id: 'lead', nome: 'Lead', cor: '#6B7280', ordem: 1 },
      { id: 'contato', nome: 'Primeiro Contato', cor: '#3B82F6', ordem: 2 },
      { id: 'interessado', nome: 'Interessado', cor: '#F59E0B', ordem: 3 },
      { id: 'negociacao', nome: 'Negociação', cor: '#10B981', ordem: 4 },
      { id: 'proposta', nome: 'Proposta Enviada', cor: '#8B5CF6', ordem: 5 },
      { id: 'vendido', nome: 'Vendido', cor: '#059669', ordem: 6 }
    ],
    automacoes: []
  },
  {
    id: 'comercial-empresarial',
    nome: 'Comercial Empresarial',
    descricao: 'Pipeline específico para imóveis comerciais e corporativos',
    cor: '#10B981',
    icone: 'users',
    ordem: 2,
    ativo: true,
    tipo: 'vendas' as BoardType,
    estagios: [
      { id: 'prospeccao', nome: 'Prospecção', cor: '#6B7280', ordem: 1 },
      { id: 'qualificacao', nome: 'Qualificação', cor: '#3B82F6', ordem: 2 },
      { id: 'apresentacao', nome: 'Apresentação', cor: '#F59E0B', ordem: 3 },
      { id: 'proposta-comercial', nome: 'Proposta Comercial', cor: '#8B5CF6', ordem: 4 },
      { id: 'negociacao-avancada', nome: 'Negociação Avançada', cor: '#10B981', ordem: 5 },
      { id: 'fechamento', nome: 'Fechamento', cor: '#059669', ordem: 6 }
    ],
    automacoes: []
  },
  {
    id: 'pos-venda',
    nome: 'Pós-Venda',
    descricao: 'Acompanhamento de clientes após a venda',
    cor: '#8B5CF6',
    icone: 'clock',
    ordem: 3,
    ativo: true,
    tipo: 'pos-venda' as BoardType,
    estagios: [
      { id: 'documentacao', nome: 'Documentação', cor: '#F59E0B', ordem: 1 },
      { id: 'financiamento', nome: 'Financiamento', cor: '#3B82F6', ordem: 2 },
      { id: 'escritura', nome: 'Escritura', cor: '#10B981', ordem: 3 },
      { id: 'entrega-chaves', nome: 'Entrega das Chaves', cor: '#059669', ordem: 4 }
    ],
    automacoes: []
  },
  {
    id: 'automacoes-ativas',
    nome: 'Automações Ativas',
    descricao: 'Board para gerenciar automações e workflows',
    cor: '#F59E0B',
    icone: 'zap',
    ordem: 4,
    ativo: true,
    tipo: 'automacao' as BoardType,
    estagios: [
      { id: 'pendente', nome: 'Pendente', cor: '#6B7280', ordem: 1 },
      { id: 'em-execucao', nome: 'Em Execução', cor: '#F59E0B', ordem: 2 },
      { id: 'concluido', nome: 'Concluído', cor: '#059669', ordem: 3 }
    ],
    automacoes: []
  }
];

const getIcon = (iconName: string, className: string = "w-8 h-8") => {
  switch (iconName) {
    case 'target': return <Target className={className} />;
    case 'users': return <Users className={className} />;
    case 'clock': return <Clock className={className} />;
    case 'zap': return <Zap className={className} />;
    default: return <LayoutGrid className={className} />;
  }
};

export default function BoardSelector({ onSelectBoard, onCreateBoard }: BoardSelectorProps) {
  const [filter, setFilter] = useState<BoardType | 'todos'>('todos');

  const filteredBoards = filter === 'todos' 
    ? mockBoards 
    : mockBoards.filter(board => board.tipo === filter);

  return (
    <div className="h-screen bg-gray-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CRM - Selecionar Board</h1>
          <p className="text-gray-600">Escolha o board que deseja acessar ou crie um novo</p>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'todos', label: 'Todos' },
              { key: 'vendas', label: 'Vendas' },
              { key: 'pos-venda', label: 'Pós-Venda' },
              { key: 'automacao', label: 'Automação' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as BoardType | 'todos')}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  filter === key
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Boards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBoards.map((board) => (
            <div
              key={board.id}
              onClick={() => onSelectBoard(board)}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group hover:border-gray-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${board.cor}20`, color: board.cor }}
                >
                  {getIcon(board.icone)}
                </div>
                <div className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full capitalize">
                  {board.tipo}
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {board.nome}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {board.descricao}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Estágios:</span>
                  <span className="font-medium">{board.estagios.length}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Automações:</span>
                  <span className="font-medium">{board.automacoes.length}</span>
                </div>

                <div className="flex items-center gap-1">
                  <div className="flex -space-x-1">
                    {board.estagios.slice(0, 4).map((estagio, index) => (
                      <div
                        key={estagio.id}
                        className="w-3 h-3 rounded-full border-2 border-white"
                        style={{ backgroundColor: estagio.cor }}
                        title={estagio.nome}
                      />
                    ))}
                    {board.estagios.length > 4 && (
                      <div className="w-3 h-3 rounded-full bg-gray-400 border-2 border-white flex items-center justify-center">
                        <span className="text-[8px] text-white font-bold">+</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 ml-2">Pipeline</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    board.ativo 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {board.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                  <div className="text-xs text-gray-500">
                    Ordem: {board.ordem}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Card para criar novo board */}
          <div
            onClick={onCreateBoard}
            className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group flex flex-col items-center justify-center min-h-[300px]"
          >
            <div className="p-4 rounded-lg bg-gray-100 group-hover:bg-blue-100 transition-colors mb-4">
              <Plus className="w-8 h-8 text-gray-500 group-hover:text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 group-hover:text-blue-600 mb-2">
              Criar Novo Board
            </h3>
            <p className="text-gray-500 text-sm text-center">
              Configure um novo board personalizado para suas necessidades
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}