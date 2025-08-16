import React, { useState, useEffect } from 'react';
import { 
  EyeIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

interface ActiveConversation {
  id: string;
  agentName: string;
  clientName: string;
  clientPhone: string;
  lastActivity: string;
  messageCount: number;
  status: 'active' | 'idle' | 'urgent';
  location?: string;
}

interface ConversationMonitor {
  conversation: ActiveConversation;
  messages: Array<{
    id: string;
    sender: 'agent' | 'client';
    content: string;
    timestamp: string;
  }>;
}

export const AdminMonitoring: React.FC = () => {
  const [activeConversations, setActiveConversations] = useState<ActiveConversation[]>([
    {
      id: '1',
      agentName: 'João Silva (Corretor)',
      clientName: 'Maria Santos',
      clientPhone: '+5511999999999',
      lastActivity: new Date(Date.now() - 300000).toISOString(),
      messageCount: 15,
      status: 'active',
      location: 'Vila Madalena'
    },
    {
      id: '2',
      agentName: 'Ana Costa (Corretora)',
      clientName: 'Pedro Oliveira',
      clientPhone: '+5511888888888',
      lastActivity: new Date(Date.now() - 1800000).toISOString(),
      messageCount: 8,
      status: 'urgent',
      location: 'Jardins'
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [monitorData, setMonitorData] = useState<ConversationMonitor | null>(null);

  useEffect(() => {
    // Simular atualização em tempo real das conversas
    const interval = setInterval(() => {
      loadActiveConversations();
    }, 30000); // Atualizar a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const loadActiveConversations = () => {
    // Simulação - na vida real viria da API
    console.log('Atualizando conversas ativas...');
  };

  const handleMonitorConversation = async (conversationId: string) => {
    setSelectedConversation(conversationId);
    
    // Simular carregamento de mensagens
    const mockMessages = [
      {
        id: '1',
        sender: 'client' as const,
        content: 'Oi, gostaria de saber mais sobre os apartamentos disponíveis',
        timestamp: new Date(Date.now() - 900000).toISOString()
      },
      {
        id: '2',
        sender: 'agent' as const,
        content: 'Olá! Claro, posso sim te ajudar. Você tem alguma região de preferência?',
        timestamp: new Date(Date.now() - 870000).toISOString()
      },
      {
        id: '3',
        sender: 'client' as const,
        content: 'Procuro na região da Vila Madalena, 2 quartos, até R$ 500mil',
        timestamp: new Date(Date.now() - 840000).toISOString()
      }
    ];

    const conversation = activeConversations.find(c => c.id === conversationId);
    if (conversation) {
      setMonitorData({
        conversation,
        messages: mockMessages
      });
    }
  };

  const getStatusColor = (status: ActiveConversation['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'idle': return 'text-yellow-600 bg-yellow-100';
      case 'urgent': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: ActiveConversation['status']) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'idle': return 'Inativa';
      case 'urgent': return 'Urgente';
      default: return status;
    }
  };

  const getStatusIcon = (status: ActiveConversation['status']) => {
    switch (status) {
      case 'active': return CheckCircleIcon;
      case 'idle': return ClockIcon;
      case 'urgent': return ExclamationTriangleIcon;
      default: return CheckCircleIcon;
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return time.toLocaleDateString('pt-BR');
  };

  return (
    <div className="h-full flex bg-gray-50">
      {/* Lista de Conversas Ativas */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <EyeIcon className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Monitoramento em Tempo Real
            </h2>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Acompanhe todas as conversas ativas
          </p>
        </div>

        {/* Estatísticas */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {activeConversations.length}
              </div>
              <div className="text-xs text-gray-500">Conversas Ativas</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">
                {activeConversations.filter(c => c.status === 'urgent').length}
              </div>
              <div className="text-xs text-gray-500">Urgentes</div>
            </div>
          </div>
        </div>

        {/* Lista de Conversas */}
        <div className="flex-1 overflow-y-auto">
          {activeConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <UserGroupIcon className="w-12 h-12 mb-2" />
              <p className="text-sm">Nenhuma conversa ativa</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {activeConversations.map((conversation) => {
                const StatusIcon = getStatusIcon(conversation.status);
                
                return (
                  <div
                    key={conversation.id}
                    onClick={() => handleMonitorConversation(conversation.id)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation === conversation.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 relative">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium text-sm">
                            {conversation.clientName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${
                          conversation.status === 'active' ? 'bg-green-500' :
                          conversation.status === 'urgent' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }`}>
                          <StatusIcon className="w-2 h-2 text-white" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {conversation.clientName}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(conversation.status)}`}>
                            {getStatusLabel(conversation.status)}
                          </span>
                        </div>
                        
                        <p className="text-xs text-gray-500 mb-1">
                          Agente: {conversation.agentName}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center">
                            <ChatBubbleLeftRightIcon className="w-3 h-3 mr-1" />
                            {conversation.messageCount} mensagens
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="w-3 h-3 mr-1" />
                            {formatTime(conversation.lastActivity)}
                          </div>
                        </div>
                        
                        {conversation.location && (
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <MapPinIcon className="w-3 h-3 mr-1" />
                            {conversation.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Área de Monitoramento */}
      <div className="flex-1 flex flex-col">
        {!monitorData ? (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <EyeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Selecione uma conversa para monitorar
              </h3>
              <p className="text-gray-500">
                Escolha uma conversa da lista para acompanhar em tempo real
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Header da Conversa Monitorada */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {monitorData.conversation.clientName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {monitorData.conversation.clientName}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <PhoneIcon className="w-4 h-4" />
                      <span>{monitorData.conversation.clientPhone}</span>
                      <span>•</span>
                      <span>{monitorData.conversation.agentName}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(monitorData.conversation.status)}`}>
                    {getStatusLabel(monitorData.conversation.status)}
                  </span>
                  
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Intervir
                  </button>
                </div>
              </div>
            </div>

            {/* Mensagens da Conversa */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
              <div className="space-y-4">
                {monitorData.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'agent'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-medium ${
                          message.sender === 'agent' ? 'text-blue-100' : 'text-blue-600'
                        }`}>
                          {message.sender === 'agent' ? 'Agente' : 'Cliente'}
                        </span>
                        <span className={`text-xs ${
                          message.sender === 'agent' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Área de Alerta */}
            <div className="bg-yellow-50 border-t border-yellow-200 px-6 py-3">
              <div className="flex items-center text-sm text-yellow-800">
                <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                <span>
                  Esta conversa está sendo monitorada para fins de auditoria e qualidade. 
                  O agente não sabe que está sendo observado.
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};