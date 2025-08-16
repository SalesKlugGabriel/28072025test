import React, { useState } from 'react';
import { Smile, Search, Heart, ThumbsUp, Star, Clock, DollarSign, Phone, Mail, MessageSquare } from 'lucide-react';

interface EmojiSelectorProps {
  onSelect: (emoji: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface EmojiCategory {
  name: string;
  icon: React.ReactNode;
  emojis: { emoji: string; name: string; keywords: string[] }[];
}

const EmojiSelector: React.FC<EmojiSelectorProps> = ({ onSelect, isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('comercial');

  const categories: Record<string, EmojiCategory> = {
    comercial: {
      name: 'Comercial',
      icon: <DollarSign className="w-4 h-4" />,
      emojis: [
        { emoji: '💰', name: 'Dinheiro', keywords: ['dinheiro', 'valor', 'preço', 'financeiro'] },
        { emoji: '🏦', name: 'Banco', keywords: ['banco', 'financiamento', 'crédito', 'empréstimo'] },
        { emoji: '📈', name: 'Crescimento', keywords: ['crescimento', 'aumento', 'valorização', 'alta'] },
        { emoji: '📉', name: 'Queda', keywords: ['queda', 'baixa', 'redução', 'desconto'] },
        { emoji: '💳', name: 'Cartão', keywords: ['cartão', 'pagamento', 'débito', 'crédito'] },
        { emoji: '🤝', name: 'Negócio', keywords: ['negócio', 'acordo', 'parceria', 'deal'] },
        { emoji: '💡', name: 'Ideia', keywords: ['ideia', 'proposta', 'sugestão', 'insight'] },
        { emoji: '✅', name: 'Aprovado', keywords: ['aprovado', 'aceito', 'ok', 'confirmado'] },
        { emoji: '❌', name: 'Rejeitado', keywords: ['rejeitado', 'negado', 'cancelado', 'não'] },
        { emoji: '⚡', name: 'Urgente', keywords: ['urgente', 'prioridade', 'rápido', 'imediato'] },
        { emoji: '🎯', name: 'Meta', keywords: ['meta', 'objetivo', 'alvo', 'foco'] },
        { emoji: '📊', name: 'Relatório', keywords: ['relatório', 'dados', 'análise', 'estatística'] }
      ]
    },
    tempo: {
      name: 'Tempo',
      icon: <Clock className="w-4 h-4" />,
      emojis: [
        { emoji: '⏰', name: 'Prazo', keywords: ['prazo', 'tempo', 'deadline', 'hora'] },
        { emoji: '📅', name: 'Agenda', keywords: ['agenda', 'calendário', 'data', 'agendamento'] },
        { emoji: '⏳', name: 'Aguardando', keywords: ['aguardando', 'esperando', 'pendente', 'delay'] },
        { emoji: '🕐', name: 'Horário', keywords: ['horário', 'hora', 'pontual', 'tempo'] },
        { emoji: '🗓️', name: 'Calendário', keywords: ['calendário', 'data', 'evento', 'reunião'] },
        { emoji: '⏪', name: 'Atraso', keywords: ['atraso', 'atrasado', 'tarde', 'delay'] },
        { emoji: '⏩', name: 'Adiantar', keywords: ['adiantar', 'rápido', 'acelerar', 'antecipado'] },
        { emoji: '🔄', name: 'Recorrente', keywords: ['recorrente', 'repetir', 'periódico', 'ciclo'] }
      ]
    },
    comunicacao: {
      name: 'Comunicação',
      icon: <MessageSquare className="w-4 h-4" />,
      emojis: [
        { emoji: '📞', name: 'Telefone', keywords: ['telefone', 'ligação', 'chamada', 'contato'] },
        { emoji: '💬', name: 'WhatsApp', keywords: ['whatsapp', 'mensagem', 'chat', 'conversa'] },
        { emoji: '📧', name: 'Email', keywords: ['email', 'correio', 'eletrônico', 'mensagem'] },
        { emoji: '👥', name: 'Reunião', keywords: ['reunião', 'encontro', 'meeting', 'conversa'] },
        { emoji: '📝', name: 'Nota', keywords: ['nota', 'anotação', 'observação', 'memo'] },
        { emoji: '📋', name: 'Lista', keywords: ['lista', 'checklist', 'tarefas', 'pendências'] },
        { emoji: '📑', name: 'Documento', keywords: ['documento', 'papel', 'contrato', 'arquivo'] },
        { emoji: '🔔', name: 'Notificação', keywords: ['notificação', 'alerta', 'aviso', 'lembrete'] }
      ]
    },
    emocoes: {
      name: 'Emoções',
      icon: <Smile className="w-4 h-4" />,
      emojis: [
        { emoji: '😊', name: 'Feliz', keywords: ['feliz', 'alegre', 'satisfeito', 'positivo'] },
        { emoji: '😐', name: 'Neutro', keywords: ['neutro', 'ok', 'normal', 'indiferente'] },
        { emoji: '😕', name: 'Triste', keywords: ['triste', 'insatisfeito', 'negativo', 'chateado'] },
        { emoji: '😤', name: 'Irritado', keywords: ['irritado', 'nervoso', 'bravo', 'zangado'] },
        { emoji: '🤔', name: 'Pensativo', keywords: ['pensativo', 'dúvida', 'analisando', 'considerando'] },
        { emoji: '😮', name: 'Surpreso', keywords: ['surpreso', 'impressionado', 'uau', 'inesperado'] },
        { emoji: '😍', name: 'Apaixonado', keywords: ['apaixonado', 'adorou', 'amou', 'encantado'] },
        { emoji: '🤨', name: 'Desconfiado', keywords: ['desconfiado', 'suspeito', 'cético', 'dúvida'] }
      ]
    },
    imoveis: {
      name: 'Imóveis',
      icon: <Star className="w-4 h-4" />,
      emojis: [
        { emoji: '🏠', name: 'Casa', keywords: ['casa', 'residência', 'moradia', 'lar'] },
        { emoji: '🏢', name: 'Prédio', keywords: ['prédio', 'edifício', 'apartamento', 'comercial'] },
        { emoji: '🏗️', name: 'Construção', keywords: ['construção', 'obra', 'reforma', 'building'] },
        { emoji: '🔑', name: 'Chave', keywords: ['chave', 'acesso', 'entrega', 'posse'] },
        { emoji: '📐', name: 'Planta', keywords: ['planta', 'projeto', 'layout', 'arquitetura'] },
        { emoji: '🚗', name: 'Garagem', keywords: ['garagem', 'carro', 'vaga', 'estacionamento'] },
        { emoji: '🏊', name: 'Piscina', keywords: ['piscina', 'lazer', 'área comum', 'diversão'] },
        { emoji: '🌅', name: 'Vista', keywords: ['vista', 'paisagem', 'visual', 'horizonte'] },
        { emoji: '📍', name: 'Localização', keywords: ['localização', 'endereço', 'região', 'bairro'] },
        { emoji: '✨', name: 'Destaque', keywords: ['destaque', 'especial', 'diferencial', 'premium'] }
      ]
    },
    status: {
      name: 'Status',
      icon: <ThumbsUp className="w-4 h-4" />,
      emojis: [
        { emoji: '🔥', name: 'Quente', keywords: ['quente', 'hot', 'interessado', 'ativo'] },
        { emoji: '🟡', name: 'Morno', keywords: ['morno', 'médio', 'moderado', 'considerando'] },
        { emoji: '🧊', name: 'Frio', keywords: ['frio', 'inativo', 'parado', 'sem interesse'] },
        { emoji: '🚀', name: 'Acelerado', keywords: ['acelerado', 'rápido', 'decidindo', 'pronto'] },
        { emoji: '⭐', name: 'VIP', keywords: ['vip', 'importante', 'prioritário', 'especial'] },
        { emoji: '🎉', name: 'Fechado', keywords: ['fechado', 'vendido', 'sucesso', 'parabéns'] },
        { emoji: '🔒', name: 'Bloqueado', keywords: ['bloqueado', 'impedimento', 'problema', 'travado'] },
        { emoji: '🔓', name: 'Liberado', keywords: ['liberado', 'desbloqueado', 'resolvido', 'ok'] }
      ]
    }
  };

  const filteredEmojis = searchTerm
    ? Object.values(categories)
        .flatMap(cat => cat.emojis)
        .filter(emoji => 
          emoji.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emoji.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    : categories[activeCategory]?.emojis || [];

  const handleEmojiSelect = (emoji: string) => {
    onSelect(emoji);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[70vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Smile className="w-5 h-5 text-yellow-500" />
              Selecionar Emoji
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              ✕
            </button>
          </div>
          
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar emoji..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Categorias */}
        {!searchTerm && (
          <div className="p-2 border-b border-gray-200">
            <div className="flex overflow-x-auto gap-1">
              {Object.entries(categories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                    activeCategory === key
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category.icon}
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Grid de Emojis */}
        <div className="p-4 overflow-y-auto max-h-96">
          {searchTerm && (
            <div className="mb-3">
              <p className="text-sm text-gray-600">
                {filteredEmojis.length} resultados para "{searchTerm}"
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-6 gap-2">
            {filteredEmojis.map((emojiData, index) => (
              <button
                key={index}
                onClick={() => handleEmojiSelect(emojiData.emoji)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-center group"
                title={emojiData.name}
              >
                <div className="text-2xl mb-1">{emojiData.emoji}</div>
                <div className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {emojiData.name}
                </div>
              </button>
            ))}
          </div>

          {filteredEmojis.length === 0 && searchTerm && (
            <div className="text-center py-8 text-gray-500">
              <Smile className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>Nenhum emoji encontrado</p>
              <p className="text-sm text-gray-400">Tente outro termo de busca</p>
            </div>
          )}
        </div>

        {/* Emojis recentes/favoritos */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600 mb-2">Mais usados:</p>
          <div className="flex gap-2">
            {['💰', '📞', '⏰', '✅', '🔥', '📝', '🏢', '🤝'].map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiSelect(emoji)}
                className="w-8 h-8 rounded-lg hover:bg-gray-200 transition-colors text-lg"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmojiSelector;