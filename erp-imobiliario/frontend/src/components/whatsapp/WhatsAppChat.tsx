import React, { useState, useEffect } from 'react';
import { WhatsAppConnection, WhatsAppMessage } from '../../types/whatsapp';
import { ConversationList } from './ConversationList';
import { ChatArea } from './ChatArea';
import { CustomerInteractions } from './CustomerInteractions';
import { AdminMonitoring } from './AdminMonitoring';
import { CustomerTags } from './CustomerTags';
import { whatsappService } from '../../services/whatsappService';
import { EyeIcon, TagIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface WhatsAppChatProps {
  connection: WhatsAppConnection;
  onDisconnect: () => void;
  userRole?: string;
}

export interface Conversation {
  id: string;
  clienteId?: string;
  clienteName: string;
  phoneNumber: string;
  lastMessage?: WhatsAppMessage;
  unreadCount: number;
  avatar?: string;
  isOnline: boolean;
  tags?: string[];
  leadId?: string;
}

export const WhatsAppChat: React.FC<WhatsAppChatProps> = ({ 
  connection, 
  onDisconnect,
  userRole = 'corretor'
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [showCustomerInteractions, setShowCustomerInteractions] = useState(false);
  const [showAdminMonitoring, setShowAdminMonitoring] = useState(false);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Tags disponíveis
  const availableTags = ['agro', 'tech', 'fin', 'com', 'quente', 'morno', 'frio', 'interessado', 'negociacao', 'proposta'];

  useEffect(() => {
    loadConversations();
    
    // Listener para novas mensagens
    const handleNewMessage = (message: WhatsAppMessage) => {
      setMessages(prev => [...prev, message]);
      updateConversationWithMessage(message);
    };

    whatsappService.addMessageListener(handleNewMessage);

    return () => {
      whatsappService.removeMessageListener(handleNewMessage);
    };
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadConversationMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      // Simulando conversas - na vida real viria da API
      const mockConversations: Conversation[] = [
        {
          id: '1',
          clienteId: 'cliente-1',
          clienteName: 'João Silva',
          phoneNumber: '+5511999999999',
          unreadCount: 2,
          isOnline: true,
          tags: ['agro', 'interessado', 'quente'],
          leadId: 'lead_001',
          lastMessage: {
            id: 'msg1',
            connectionId: connection.id,
            from: '+5511999999999',
            to: connection.phoneNumber,
            message: 'Oi, queria saber sobre os apartamentos disponíveis',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            status: 'delivered',
            direction: 'incoming'
          }
        },
        {
          id: '2',
          clienteId: 'cliente-2',
          clienteName: 'Maria Santos',
          phoneNumber: '+5511888888888',
          unreadCount: 0,
          isOnline: false,
          tags: ['tech', 'negociacao', 'morno'],
          leadId: 'lead_002',
          lastMessage: {
            id: 'msg2',
            connectionId: connection.id,
            from: connection.phoneNumber,
            to: '+5511888888888',
            message: 'Perfeito! Vou preparar a proposta e envio amanhã.',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            status: 'read',
            direction: 'outgoing'
          }
        },
        {
          id: '3',
          clienteId: 'cliente-3',
          clienteName: 'Pedro Oliveira',
          phoneNumber: '+5511777777777',
          unreadCount: 1,
          isOnline: true,
          tags: ['fin', 'interessado', 'quente'],
          leadId: 'lead_003',
          lastMessage: {
            id: 'msg3',
            connectionId: connection.id,
            from: '+5511777777777',
            to: connection.phoneNumber,
            message: 'Posso visitar o empreendimento hoje?',
            timestamp: new Date(Date.now() - 600000).toISOString(),
            status: 'delivered',
            direction: 'incoming'
          }
        },
        {
          id: '4',
          clienteId: 'cliente-4',
          clienteName: 'Ana Costa',
          phoneNumber: '+5511666666666',
          unreadCount: 0,
          isOnline: false,
          tags: ['com', 'proposta', 'frio'],
          leadId: 'lead_004',
          lastMessage: {
            id: 'msg4',
            connectionId: connection.id,
            from: connection.phoneNumber,
            to: '+5511666666666',
            message: 'Obrigado pelo interesse! Te mandei a tabela de preços.',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            status: 'read',
            direction: 'outgoing'
          }
        },
        {
          id: '5',
          clienteId: 'cliente-5',
          clienteName: 'Roberto Lima',
          phoneNumber: '+5511555555555',
          unreadCount: 3,
          isOnline: true,
          tags: ['agro', 'negociacao', 'quente'],
          leadId: 'lead_005',
          lastMessage: {
            id: 'msg5',
            connectionId: connection.id,
            from: '+5511555555555',
            to: connection.phoneNumber,
            message: 'Quanto fica com 30% de entrada?',
            timestamp: new Date(Date.now() - 120000).toISOString(),
            status: 'delivered',
            direction: 'incoming'
          }
        },
        {
          id: '6',
          clienteId: 'cliente-6',
          clienteName: 'Fernanda Ribeiro',
          phoneNumber: '+5511444444444',
          unreadCount: 0,
          isOnline: false,
          lastMessage: {
            id: 'msg6',
            connectionId: connection.id,
            from: '+5511444444444',
            to: connection.phoneNumber,
            message: 'Muito obrigada! Vou analisar e te dou um retorno.',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            status: 'read',
            direction: 'incoming'
          }
        }
      ];

      setConversations(mockConversations);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadConversationMessages = async (conversationId: string) => {
    try {
      // Simulando mensagens - na vida real viria da API
      const mockMessages: WhatsAppMessage[] = [];
      
      if (conversationId === '1') {
        mockMessages.push(
          {
            id: 'msg1-1',
            connectionId: connection.id,
            from: '+5511999999999',
            to: connection.phoneNumber,
            message: 'Oi, bom dia!',
            timestamp: new Date(Date.now() - 900000).toISOString(),
            status: 'delivered',
            direction: 'incoming',
            clienteId: 'cliente-1'
          },
          {
            id: 'msg1-2',
            connectionId: connection.id,
            from: connection.phoneNumber,
            to: '+5511999999999',
            message: 'Bom dia! Como posso ajudá-lo?',
            timestamp: new Date(Date.now() - 870000).toISOString(),
            status: 'read',
            direction: 'outgoing',
            clienteId: 'cliente-1'
          },
          {
            id: 'msg1-3',
            connectionId: connection.id,
            from: '+5511999999999',
            to: connection.phoneNumber,
            message: 'Queria saber sobre os apartamentos disponíveis',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            status: 'delivered',
            direction: 'incoming',
            clienteId: 'cliente-1'
          },
          {
            id: 'msg1-4',
            connectionId: connection.id,
            from: connection.phoneNumber,
            to: '+5511999999999',
            message: 'Claro! Temos várias opções disponíveis. Você tem alguma preferência de localização?',
            timestamp: new Date(Date.now() - 280000).toISOString(),
            status: 'read',
            direction: 'outgoing',
            clienteId: 'cliente-1'
          },
          {
            id: 'msg1-5',
            connectionId: connection.id,
            from: '+5511999999999',
            to: connection.phoneNumber,
            message: 'Estou procurando algo na Vila Madalena, 2 quartos',
            timestamp: new Date(Date.now() - 240000).toISOString(),
            status: 'delivered',
            direction: 'incoming',
            clienteId: 'cliente-1'
          }
        );
      } else if (conversationId === '5') {
        mockMessages.push(
          {
            id: 'msg5-1',
            connectionId: connection.id,
            from: '+5511555555555',
            to: connection.phoneNumber,
            message: 'Oi, vi os apartamentos no site',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            status: 'delivered',
            direction: 'incoming',
            clienteId: 'cliente-5'
          },
          {
            id: 'msg5-2',
            connectionId: connection.id,
            from: connection.phoneNumber,
            to: '+5511555555555',
            message: 'Olá! Que bom saber do seu interesse. Qual apartamento chamou sua atenção?',
            timestamp: new Date(Date.now() - 280000).toISOString(),
            status: 'read',
            direction: 'outgoing',
            clienteId: 'cliente-5'
          },
          {
            id: 'msg5-3',
            connectionId: connection.id,
            from: '+5511555555555',
            to: connection.phoneNumber,
            message: 'O de 3 quartos no Residencial Vila Nova',
            timestamp: new Date(Date.now() - 200000).toISOString(),
            status: 'delivered',
            direction: 'incoming',
            clienteId: 'cliente-5'
          },
          {
            id: 'msg5-4',
            connectionId: connection.id,
            from: '+5511555555555',
            to: connection.phoneNumber,
            message: 'Quanto fica com 30% de entrada?',
            timestamp: new Date(Date.now() - 120000).toISOString(),
            status: 'delivered',
            direction: 'incoming',
            clienteId: 'cliente-5'
          }
        );
      }

      setMessages(mockMessages);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const updateConversationWithMessage = (message: WhatsAppMessage) => {
    setConversations(prev => prev.map(conv => {
      if (conv.phoneNumber === message.from || conv.phoneNumber === message.to) {
        return {
          ...conv,
          lastMessage: message,
          unreadCount: message.direction === 'incoming' && conv.id !== selectedConversation?.id 
            ? conv.unreadCount + 1 
            : conv.unreadCount
        };
      }
      return conv;
    }));
  };

  const handleSendMessage = async (messageText: string) => {
    if (!selectedConversation) return;

    try {
      await whatsappService.sendMessage({
        connectionId: connection.id,
        phoneNumber: selectedConversation.phoneNumber,
        message: messageText,
        clienteId: selectedConversation.clienteId
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowCustomerInteractions(true); // Abre automaticamente o perfil
    
    // Marcar mensagens como lidas
    setConversations(prev => prev.map(conv => 
      conv.id === conversation.id 
        ? { ...conv, unreadCount: 0 }
        : conv
    ));
  };

  const handleCustomerInteractions = () => {
    setShowCustomerInteractions(true);
  };

  const handleClearChat = () => {
    if (selectedConversation) {
      // Limpar mensagens apenas visualmente (não do banco de dados)
      setMessages([]);
    }
  };

  // Função para filtrar conversas por tags
  const filteredConversations = selectedTags.length === 0 
    ? conversations 
    : conversations.filter(conversation => 
        conversation.tags?.some(tag => selectedTags.includes(tag))
      );

  // Função para alternar seleção de tag
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Verificar se usuário pode monitorar conversas
  const canMonitor = userRole === 'admin' || userRole === 'gerente';

  // Se for modo de monitoramento administrativo
  if (showAdminMonitoring && canMonitor) {
    return <AdminMonitoring />;
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Lista de conversas */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Filtro de Tags */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Filtrar por Tags</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowTagFilter(!showTagFilter)}
                className="p-1 hover:bg-gray-200 rounded-md transition-colors"
                title="Filtrar por tags"
              >
                <TagIcon className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => setSelectedTags([])}
                className="p-1 hover:bg-gray-200 rounded-md transition-colors"
                title="Limpar filtros"
              >
                <FunnelIcon className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
          
          {showTagFilter && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2 py-1 text-xs rounded-full border transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              
              {selectedTags.length > 0 && (
                <div className="text-xs text-gray-500">
                  {filteredConversations.length} conversa(s) encontrada(s)
                </div>
              )}
            </div>
          )}
        </div>

        <ConversationList
          conversations={filteredConversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
          connection={connection}
          onDisconnect={onDisconnect}
          showMonitoringButton={canMonitor}
          onEnterMonitoring={() => setShowAdminMonitoring(true)}
        />
      </div>

      {/* Área principal - Layout dividido */}
      <div className="flex-1 flex">
        {!selectedConversation ? (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-gray-400">
                💬
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Selecione uma conversa
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Escolha uma conversa da lista para começar a chat
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Área do chat (centro) */}
            <div className="flex-1 flex flex-col">
              <ChatArea
                conversation={selectedConversation}
                messages={messages}
                onSendMessage={handleSendMessage}
                onCustomerInteractions={handleCustomerInteractions}
                onClearChat={handleClearChat}
              />
            </div>
            
            {/* Painel do perfil (direita) */}
            {showCustomerInteractions && (
              <div className="w-96 border-l border-gray-200 bg-white">
                <CustomerInteractions
                  conversation={selectedConversation}
                  onBack={() => setShowCustomerInteractions(false)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};