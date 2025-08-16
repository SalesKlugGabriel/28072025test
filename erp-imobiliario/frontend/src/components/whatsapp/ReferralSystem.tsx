import React, { useState } from 'react';
import { 
  UserGroupIcon,
  PlusIcon,
  TrashIcon,
  UserIcon,
  PhoneIcon,
  GiftIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Conversation } from './WhatsAppChat';

interface Referral {
  id: string;
  name: string;
  phone: string;
  email?: string;
  type: 'referred_by' | 'referred_to';
  date: string;
  status: 'pending' | 'contacted' | 'converted' | 'declined';
  notes?: string;
}

interface ReferralSystemProps {
  conversation: Conversation;
  customerData: any;
  onUpdate: (field: string, value: any) => void;
}

export const ReferralSystem: React.FC<ReferralSystemProps> = ({
  conversation,
  customerData,
  onUpdate
}) => {
  const [referrals, setReferrals] = useState<Referral[]>([
    {
      id: '1',
      name: 'Maria Santos',
      phone: '+5511888888888',
      email: 'maria@email.com',
      type: 'referred_by',
      date: '2024-01-15',
      status: 'converted',
      notes: 'Cliente indicou após compra de apartamento'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newReferral, setNewReferral] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'referred_to' as 'referred_by' | 'referred_to',
    notes: ''
  });

  const handleAddReferral = () => {
    if (newReferral.name && newReferral.phone) {
      const referral: Referral = {
        id: Date.now().toString(),
        name: newReferral.name,
        phone: newReferral.phone,
        email: newReferral.email,
        type: newReferral.type,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        notes: newReferral.notes
      };

      setReferrals(prev => [...prev, referral]);
      onUpdate('referrals', [...referrals, referral]);
      
      setNewReferral({
        name: '',
        phone: '',
        email: '',
        type: 'referred_to',
        notes: ''
      });
      setShowAddForm(false);
    }
  };

  const handleDeleteReferral = (id: string) => {
    const updatedReferrals = referrals.filter(r => r.id !== id);
    setReferrals(updatedReferrals);
    onUpdate('referrals', updatedReferrals);
  };

  const handleUpdateStatus = (id: string, status: Referral['status']) => {
    const updatedReferrals = referrals.map(r => 
      r.id === id ? { ...r, status } : r
    );
    setReferrals(updatedReferrals);
    onUpdate('referrals', updatedReferrals);
  };

  const getStatusColor = (status: Referral['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'contacted': return 'text-blue-600 bg-blue-100';
      case 'converted': return 'text-green-600 bg-green-100';
      case 'declined': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: Referral['status']) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'contacted': return 'Contatado';
      case 'converted': return 'Convertido';
      case 'declined': return 'Recusou';
      default: return status;
    }
  };

  const getTypeLabel = (type: Referral['type']) => {
    return type === 'referred_by' ? 'Indicado por' : 'Indicou';
  };

  const getTypeIcon = (type: Referral['type']) => {
    return type === 'referred_by' ? '⬅️' : '➡️';
  };

  const referredBy = referrals.filter(r => r.type === 'referred_by');
  const referredTo = referrals.filter(r => r.type === 'referred_to');
  const convertedReferrals = referrals.filter(r => r.status === 'converted');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Sistema de Indicações
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Gerencie a rede de indicações de {conversation.clienteName}
            </p>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Nova Indicação
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <UserGroupIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-900">{referrals.length}</div>
          <div className="text-sm text-blue-700">Total de Indicações</div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <GiftIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-900">{convertedReferrals.length}</div>
          <div className="text-sm text-green-700">Convertidas</div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <ChartBarIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-900">
            {referrals.length > 0 ? Math.round((convertedReferrals.length / referrals.length) * 100) : 0}%
          </div>
          <div className="text-sm text-purple-700">Taxa de Conversão</div>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <UserIcon className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-900">{referredBy.length}</div>
          <div className="text-sm text-orange-700">Indicado Por</div>
        </div>
      </div>

      {/* Add Referral Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-900">
              Nova Indicação
            </h4>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  value={newReferral.name}
                  onChange={(e) => setNewReferral(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome da pessoa"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone *
                </label>
                <input
                  type="tel"
                  value={newReferral.phone}
                  onChange={(e) => setNewReferral(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  value={newReferral.email}
                  onChange={(e) => setNewReferral(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Indicação
                </label>
                <select
                  value={newReferral.type}
                  onChange={(e) => setNewReferral(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="referred_to">{conversation.clienteName} indicou esta pessoa</option>
                  <option value="referred_by">Esta pessoa indicou {conversation.clienteName}</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                value={newReferral.notes}
                onChange={(e) => setNewReferral(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                placeholder="Informações adicionais sobre a indicação..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddReferral}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Adicionar Indicação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Referrals List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">
          Lista de Indicações
        </h4>
        
        {referrals.length === 0 ? (
          <div className="text-center py-8">
            <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma indicação registrada ainda</p>
          </div>
        ) : (
          <div className="space-y-4">
            {referrals.map((referral) => (
              <div
                key={referral.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{getTypeIcon(referral.type)}</span>
                      <h5 className="font-medium text-gray-900">{referral.name}</h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(referral.status)}`}>
                        {getStatusLabel(referral.status)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <PhoneIcon className="w-4 h-4 mr-2" />
                        {referral.phone}
                      </div>
                      {referral.email && (
                        <div className="flex items-center">
                          <span className="w-4 h-4 mr-2">📧</span>
                          {referral.email}
                        </div>
                      )}
                      <div className="flex items-center">
                        <span className="w-4 h-4 mr-2">📅</span>
                        {new Date(referral.date).toLocaleDateString('pt-BR')} • {getTypeLabel(referral.type)}
                      </div>
                      {referral.notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          {referral.notes}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 flex space-x-2">
                      <select
                        value={referral.status}
                        onChange={(e) => handleUpdateStatus(referral.id, e.target.value as Referral['status'])}
                        className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="pending">Pendente</option>
                        <option value="contacted">Contatado</option>
                        <option value="converted">Convertido</option>
                        <option value="declined">Recusou</option>
                      </select>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteReferral(referral.id)}
                    className="ml-4 p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Referral Network Visualization */}
      {referrals.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">
            Rede de Indicações
          </h4>
          
          <div className="flex items-center justify-center py-8">
            <div className="relative">
              {/* Cliente Central */}
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {conversation.clienteName.charAt(0).toUpperCase()}
              </div>
              
              {/* Indicações à esquerda (indicado por) */}
              <div className="absolute top-1/2 -left-32 transform -translate-y-1/2">
                {referredBy.slice(0, 3).map((referral, index) => (
                  <div
                    key={referral.id}
                    className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium mb-2"
                    style={{ marginTop: `${index * 16}px` }}
                  >
                    {referral.name.charAt(0).toUpperCase()}
                  </div>
                ))}
              </div>
              
              {/* Indicações à direita (indicou) */}
              <div className="absolute top-1/2 -right-32 transform -translate-y-1/2">
                {referredTo.slice(0, 3).map((referral, index) => (
                  <div
                    key={referral.id}
                    className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium mb-2"
                    style={{ marginTop: `${index * 16}px` }}
                  >
                    {referral.name.charAt(0).toUpperCase()}
                  </div>
                ))}
              </div>
              
              {/* Linhas de conexão */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {referredBy.slice(0, 3).map((_, index) => (
                  <line
                    key={`line-left-${index}`}
                    x1="20"
                    y1="50"
                    x2="60"
                    y2="50"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                ))}
                {referredTo.slice(0, 3).map((_, index) => (
                  <line
                    key={`line-right-${index}`}
                    x1="100"
                    y1="50"
                    x2="140"
                    y2="50"
                    stroke="#8b5cf6"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                ))}
              </svg>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-600 mt-4">
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Indicou {conversation.clienteName}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span>{conversation.clienteName}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                <span>Indicado por {conversation.clienteName}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};