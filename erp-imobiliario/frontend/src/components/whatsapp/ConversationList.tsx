import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  EllipsisVerticalIcon,
  PowerIcon,
  UserCircleIcon,
  PhoneIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { WhatsAppConnection } from '../../types/whatsapp';
import { Conversation } from './WhatsAppChat';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  connection: WhatsAppConnection;
  onDisconnect: () => void;
  showMonitoringButton?: boolean;
  onEnterMonitoring?: () => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  connection,
  onDisconnect,
  showMonitoringButton = false,
  onEnterMonitoring
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const filteredConversations = conversations.filter(conv =>
    conv.clienteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.phoneNumber.includes(searchTerm)
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 7 * 24) {
      return date.toLocaleDateString('pt-BR', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-green-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <PhoneIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold">WhatsApp</h2>
              <p className="text-sm text-green-100">
                {connection.phoneNumber}
              </p>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
            >
              <EllipsisVerticalIcon className="w-5 h-5" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border">
                <div className="py-1">
                  {showMonitoringButton && onEnterMonitoring && (
                    <button
                      onClick={() => {
                        onEnterMonitoring();
                        setShowMenu(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 w-full text-left"
                    >
                      <EyeIcon className="w-4 h-4 mr-2" />
                      Monitorar Conversas
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onDisconnect();
                      setShowMenu(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <PowerIcon className="w-4 h-4 mr-2" />
                    Desconectar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <UserCircleIcon className="w-12 h-12 mb-2" />
            <p className="text-sm">
              {searchTerm ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation?.id === conversation.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      {conversation.avatar ? (
                        <img 
                          src={conversation.avatar} 
                          alt={conversation.clienteName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600 font-medium text-lg">
                          {conversation.clienteName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {conversation.clienteName}
                      </h3>
                      {conversation.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.lastMessage ? (
                          <>
                            {conversation.lastMessage.direction === 'outgoing' && (
                              <span className="text-blue-600 mr-1">Você: </span>
                            )}
                            {truncateMessage(conversation.lastMessage.message)}
                          </>
                        ) : (
                          'Nova conversa'
                        )}
                      </p>
                      
                      {conversation.unreadCount > 0 && (
                        <span className="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded-full min-w-[20px] text-center">
                          {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                      {conversation.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          {filteredConversations.length} conversa{filteredConversations.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};