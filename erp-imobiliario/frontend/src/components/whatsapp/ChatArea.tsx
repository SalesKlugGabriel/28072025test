import React, { useState, useRef, useEffect } from 'react';
import { 
  PaperAirplaneIcon,
  PaperClipIcon,
  FaceSmileIcon,
  EllipsisVerticalIcon,
  UserIcon,
  TrashIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';
import { WhatsAppMessage } from '../../types/whatsapp';
import { Conversation } from './WhatsAppChat';

interface ChatAreaProps {
  conversation: Conversation;
  messages: WhatsAppMessage[];
  onSendMessage: (message: string) => void;
  onCustomerInteractions: () => void;
  onClearChat: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  conversation,
  messages,
  onSendMessage,
  onCustomerInteractions,
  onClearChat
}) => {
  const [messageText, setMessageText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      onSendMessage(messageText.trim());
      setMessageText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessageStatus = (status: WhatsAppMessage['status']) => {
    switch (status) {
      case 'sending':
        return <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />;
      case 'sent':
        return <CheckIcon className="w-4 h-4 text-gray-400" />;
      case 'delivered':
        return (
          <div className="flex -space-x-1">
            <CheckIcon className="w-3 h-3 text-gray-400" />
            <CheckIcon className="w-3 h-3 text-gray-400" />
          </div>
        );
      case 'read':
        return (
          <div className="flex -space-x-1">
            <CheckIcon className="w-3 h-3 text-blue-500" />
            <CheckIcon className="w-3 h-3 text-blue-500" />
          </div>
        );
      case 'failed':
        return <span className="text-red-500 text-xs">!</span>;
      default:
        return null;
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Implementar upload de arquivo
      console.log('Arquivo selecionado:', file.name);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header do Chat */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:bg-blue-50 rounded-lg p-2 -m-2 transition-colors group"
            onClick={onCustomerInteractions}
            title="Clique para abrir perfil do cliente"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                {conversation.avatar ? (
                  <img 
                    src={conversation.avatar} 
                    alt={conversation.clienteName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 font-medium">
                    {conversation.clienteName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {conversation.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {conversation.clienteName}
                </h3>
                <UserIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100" />
              </div>
              <p className="text-sm text-gray-500">
                {conversation.isOnline ? 'Online' : 'Offline'} • {conversation.phoneNumber}
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onCustomerInteractions();
                      setShowMenu(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                  >
                    <UserIcon className="w-4 h-4 mr-2" />
                    Interações com Cliente
                  </button>
                  <button
                    onClick={() => {
                      onClearChat();
                      setShowMenu(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Limpar Chat
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <ChatBubbleLeftRightIcon className="w-12 h-12 mb-2" />
            <p className="text-sm">Nenhuma mensagem ainda</p>
            <p className="text-xs text-gray-400 mt-1">
              Envie uma mensagem para iniciar a conversa
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.direction === 'outgoing' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.direction === 'outgoing'
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                  <div className={`flex items-center justify-end mt-1 space-x-1 ${
                    message.direction === 'outgoing' ? 'text-green-100' : 'text-gray-500'
                  }`}>
                    <span className="text-xs">{formatTime(message.timestamp)}</span>
                    {message.direction === 'outgoing' && (
                      <div className="flex-shrink-0">
                        {renderMessageStatus(message.status)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Área de Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelected}
            className="hidden"
            accept="image/*,application/pdf,.doc,.docx"
          />
          
          <button
            type="button"
            onClick={handleFileUpload}
            className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <PaperClipIcon className="w-5 h-5" />
          </button>

          <div className="flex-1 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              rows={1}
              className="w-full px-3 py-2 border-0 rounded-lg resize-none focus:outline-none"
              style={{ minHeight: '42px', maxHeight: '120px' }}
            />
          </div>

          <button
            type="button"
            className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaceSmileIcon className="w-5 h-5" />
          </button>

          <button
            type="submit"
            disabled={!messageText.trim()}
            className={`flex-shrink-0 p-2 rounded-full transition-colors ${
              messageText.trim()
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-2 text-xs text-gray-400 text-center">
          As mensagens são armazenadas permanentemente para auditoria
        </div>
      </div>
    </div>
  );
};