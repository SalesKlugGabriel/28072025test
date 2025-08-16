import React, { useState } from 'react';
import { Plus, MessageSquare, X, Smile, Clock, Save } from 'lucide-react';
import EmojiSelector from './EmojiSelector';

interface QuickNote {
  id: string;
  leadId: string;
  texto: string;
  timestamp: number;
  emoji: string;
  categoria: 'comercial' | 'tempo' | 'comunicacao' | 'status' | 'geral';
  autor: string;
}

interface QuickNotesPanelProps {
  leadId: string;
  leadName: string;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (note: QuickNote) => void;
}

const QuickNotesPanel: React.FC<QuickNotesPanelProps> = ({
  leadId,
  leadName,
  isOpen,
  onClose,
  onSave
}) => {
  const [novaAnotacao, setNovaAnotacao] = useState('');
  const [emojiSelecionado, setEmojiSelecionado] = useState('📝');
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [categoria, setCategoria] = useState<QuickNote['categoria']>('geral');

  // Templates de anotação rápida
  const templates = [
    { emoji: '💰', texto: 'Cliente tem budget aprovado de R$ ', categoria: 'comercial' as const },
    { emoji: '📞', texto: 'Ligação agendada para ', categoria: 'comunicacao' as const },
    { emoji: '⏰', texto: 'Prazo para decisão: ', categoria: 'tempo' as const },
    { emoji: '🏦', texto: 'Financiamento pré-aprovado no ', categoria: 'comercial' as const },
    { emoji: '🔥', texto: 'Cliente demonstrou muito interesse em ', categoria: 'status' as const },
    { emoji: '📅', texto: 'Visita agendada para ', categoria: 'tempo' as const },
    { emoji: '🤝', texto: 'Proposta enviada no valor de R$ ', categoria: 'comercial' as const },
    { emoji: '📝', texto: 'Observação importante: ', categoria: 'geral' as const }
  ];

  const handleSalvarAnotacao = () => {
    if (!novaAnotacao.trim()) return;

    const novaAnotacaoObj: QuickNote = {
      id: Date.now().toString(),
      leadId,
      texto: novaAnotacao,
      timestamp: Date.now(),
      emoji: emojiSelecionado,
      categoria,
      autor: 'Usuário Atual'
    };

    if (onSave) {
      onSave(novaAnotacaoObj);
    }

    // Salvar no localStorage também
    const existingNotes = JSON.parse(localStorage.getItem('quick_notes') || '[]');
    existingNotes.unshift(novaAnotacaoObj);
    localStorage.setItem('quick_notes', JSON.stringify(existingNotes.slice(0, 100))); // Manter apenas as 100 mais recentes

    // Limpar formulário
    setNovaAnotacao('');
    setEmojiSelecionado('📝');
    setCategoria('geral');
    onClose();
  };

  const handleUseTemplate = (template: typeof templates[0]) => {
    setNovaAnotacao(template.texto);
    setEmojiSelecionado(template.emoji);
    setCategoria(template.categoria);
  };

  const handleEmojiSelect = (emoji: string) => {
    setEmojiSelecionado(emoji);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-blue-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Anotação Rápida
              </h3>
              <p className="text-sm text-blue-700">{leadName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-blue-400 hover:text-blue-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Templates Rápidos */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Templates Rápidos:</h4>
            <div className="grid grid-cols-1 gap-2">
              {templates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => handleUseTemplate(template)}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="text-lg">{template.emoji}</span>
                  <span className="text-sm text-gray-700 flex-1">{template.texto}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Formulário de anotação */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Anotação Personalizada:</h4>
            
            {/* Seletor de emoji */}
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => setShowEmojiSelector(true)}
                className="w-12 h-12 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-2xl flex items-center justify-center"
                title="Selecionar emoji"
              >
                {emojiSelecionado}
              </button>
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">Categoria:</label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value as QuickNote['categoria'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="geral">📝 Geral</option>
                  <option value="comercial">💰 Comercial</option>
                  <option value="tempo">⏰ Tempo/Prazo</option>
                  <option value="comunicacao">📞 Comunicação</option>
                  <option value="status">🔥 Status/Estado</option>
                </select>
              </div>
            </div>

            {/* Campo de texto */}
            <textarea
              value={novaAnotacao}
              onChange={(e) => setNovaAnotacao(e.target.value)}
              placeholder="Digite sua anotação..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              rows={4}
            />

            {/* Emojis rápidos */}
            <div className="mt-3">
              <label className="block text-xs text-gray-600 mb-2">Emojis rápidos:</label>
              <div className="flex flex-wrap gap-2">
                {['💰', '🏦', '⏰', '📞', '✅', '🔥', '📝', '🤝', '🏢', '⚡', '📅', '🎯'].map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => setEmojiSelecionado(emoji)}
                    className={`w-8 h-8 rounded-lg transition-colors text-lg border ${
                      emojiSelecionado === emoji 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
                <button
                  onClick={() => setShowEmojiSelector(true)}
                  className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-xs text-gray-600"
                >
                  <Smile className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{new Date().toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvarAnotacao}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm flex items-center gap-2"
                disabled={!novaAnotacao.trim()}
              >
                <Save className="w-4 h-4" />
                Salvar
              </button>
            </div>
          </div>
        </div>

        {/* Seletor de Emojis */}
        <EmojiSelector
          isOpen={showEmojiSelector}
          onClose={() => setShowEmojiSelector(false)}
          onSelect={handleEmojiSelect}
        />
      </div>
    </div>
  );
};

export default QuickNotesPanel;