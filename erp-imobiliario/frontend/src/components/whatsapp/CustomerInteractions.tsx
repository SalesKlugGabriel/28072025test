import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftIcon,
  ChatBubbleLeftEllipsisIcon,
  VideoCameraIcon,
  MapPinIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  TagIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { Conversation } from './WhatsAppChat';
import { AutomatedMessages } from './AutomatedMessages';
import { VideoConferenceScheduler } from './VideoConferenceScheduler';
import { SalesProfile } from './SalesProfile';
import { LocationSelector } from './LocationSelector';
import { PropertySuggestions } from './PropertySuggestions';
import { ReferralSystem } from './ReferralSystem';
import { CustomerTags } from './CustomerTags';

interface CustomerInteractionsProps {
  conversation: Conversation;
  onBack: () => void;
}

type TabType = 'overview' | 'automated' | 'video' | 'profile' | 'location' | 'properties' | 'referrals' | 'tags';

export const CustomerInteractions: React.FC<CustomerInteractionsProps> = ({
  conversation,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [customerData, setCustomerData] = useState({
    name: conversation.clienteName,
    phone: conversation.phoneNumber,
    email: '',
    investmentRange: { min: 0, max: 0 },
    preferredLocation: null,
    tags: [],
    referrals: [],
    lastInteraction: new Date().toISOString()
  });

  const tabs = [
    {
      id: 'overview' as TabType,
      name: 'Visão Geral',
      icon: UserGroupIcon,
      description: 'Informações principais do cliente'
    },
    {
      id: 'automated' as TabType,
      name: 'Mensagens Automáticas',
      icon: ChatBubbleLeftEllipsisIcon,
      description: 'Configurar respostas automáticas'
    },
    {
      id: 'video' as TabType,
      name: 'Videoconferência',
      icon: VideoCameraIcon,
      description: 'Agendar Google Meet'
    },
    {
      id: 'profile' as TabType,
      name: 'Perfil de Venda',
      icon: CurrencyDollarIcon,
      description: 'Faixa de investimento e preferências'
    },
    {
      id: 'location' as TabType,
      name: 'Localização',
      icon: MapPinIcon,
      description: 'Área de interesse no mapa'
    },
    {
      id: 'properties' as TabType,
      name: 'Imóveis Sugeridos',
      icon: BuildingOffice2Icon,
      description: 'Propriedades que se encaixam no perfil'
    },
    {
      id: 'referrals' as TabType,
      name: 'Indicações',
      icon: LinkIcon,
      description: 'Rede de indicações do cliente'
    },
    {
      id: 'tags' as TabType,
      name: 'Tags',
      icon: TagIcon,
      description: 'Etiquetas e classificações'
    }
  ];

  const handleDataUpdate = (field: string, value: any) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Informações do Cliente
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={customerData.name}
                    onChange={(e) => handleDataUpdate('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={customerData.phone}
                    onChange={(e) => handleDataUpdate('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={customerData.email}
                    onChange={(e) => handleDataUpdate('email', e.target.value)}
                    placeholder="cliente@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Última Interação
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-600">
                    {new Date(customerData.lastInteraction).toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-900">
                      Faixa de Investimento
                    </p>
                    <p className="text-sm text-blue-700">
                      {customerData.investmentRange.min > 0 
                        ? `R$ ${customerData.investmentRange.min.toLocaleString()} - R$ ${customerData.investmentRange.max.toLocaleString()}`
                        : 'Não definido'
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <MapPinIcon className="h-8 w-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-900">
                      Localização de Interesse
                    </p>
                    <p className="text-sm text-green-700">
                      {customerData.preferredLocation ? 'Definido' : 'Não selecionado'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center">
                  <TagIcon className="h-8 w-8 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-purple-900">
                      Tags Ativas
                    </p>
                    <p className="text-sm text-purple-700">
                      {customerData.tags.length} tag{customerData.tags.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'automated':
        return <AutomatedMessages conversation={conversation} />;
      
      case 'video':
        return <VideoConferenceScheduler conversation={conversation} />;
      
      case 'profile':
        return (
          <SalesProfile 
            customerData={customerData}
            onUpdate={handleDataUpdate}
          />
        );
      
      case 'location':
        return (
          <LocationSelector 
            customerData={customerData}
            onUpdate={handleDataUpdate}
          />
        );
      
      case 'properties':
        return <PropertySuggestions conversation={conversation} />;
      
      case 'referrals':
        return (
          <ReferralSystem 
            conversation={conversation}
            customerData={customerData}
            onUpdate={handleDataUpdate}
          />
        );
      
      case 'tags':
        return (
          <CustomerTags 
            customerData={customerData}
            onUpdate={handleDataUpdate}
          />
        );

      default:
        return <div>Conteúdo não encontrado</div>;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium text-sm">
                  {conversation.clienteName.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  {conversation.clienteName}
                </h2>
                <p className="text-xs text-gray-500">
                  Perfil do Cliente
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={onBack}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            title="Fechar perfil"
          >
            <ArrowLeftIcon className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1 px-2 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-3 h-3" />
              <span className="hidden sm:inline">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {renderTabContent()}
      </div>
    </div>
  );
};