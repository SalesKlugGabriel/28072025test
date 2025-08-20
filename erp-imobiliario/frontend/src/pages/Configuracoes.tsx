import React, { useState, useEffect } from 'react';
import {
  CogIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  KeyIcon,
  PhoneIcon,
  QrCodeIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

import { WhatsAppConnection } from '../types/whatsapp';

// TODO: Replace with API integration to fetch WhatsApp connections
// Remove mock data and implement proper API calls to backend WhatsApp service
const mockConnections: WhatsAppConnection[] = [];

const Configuracoes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'sistema'>('whatsapp');
  const [connections, setConnections] = useState<WhatsAppConnection[]>(mockConnections);
  const [showQRModal, setShowQRModal] = useState<string | null>(null);
  const [newConnectionPhone, setNewConnectionPhone] = useState('');
  const [showNewConnection, setShowNewConnection] = useState(false);

  // Simular QR Code
  const generateQRCode = (userId: string) => {
    return `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="white"/>
        <rect x="20" y="20" width="160" height="160" fill="white" stroke="black" stroke-width="2"/>
        <rect x="40" y="40" width="20" height="20" fill="black"/>
        <rect x="80" y="40" width="20" height="20" fill="black"/>
        <rect x="120" y="40" width="20" height="20" fill="black"/>
        <rect x="160" y="40" width="20" height="20" fill="black"/>
        <text x="100" y="100" text-anchor="middle" font-family="Arial" font-size="12">QR ${userId}</text>
        <text x="100" y="120" text-anchor="middle" font-family="Arial" font-size="8">Escaneie com WhatsApp</text>
      </svg>`
    )}`;
  };

  const handleConnect = async (connectionId: string) => {
    const connection = connections.find(c => c.id === connectionId);
    if (!connection) return;

    // Atualizar status para connecting
    setConnections(prev => prev.map(c => 
      c.id === connectionId 
        ? { ...c, status: 'connecting' }
        : c
    ));

    // Simular processo de conexão
    setTimeout(() => {
      setConnections(prev => prev.map(c => 
        c.id === connectionId 
          ? { 
              ...c, 
              status: 'qr_pending',
              qrCode: generateQRCode(c.userId)
            }
          : c
      ));
      setShowQRModal(connectionId);
    }, 1000);
  };

  const handleDisconnect = (connectionId: string) => {
    if (confirm('Tem certeza que deseja desconectar este WhatsApp?')) {
      setConnections(prev => prev.map(c => 
        c.id === connectionId 
          ? { ...c, status: 'disconnected', sessionId: undefined }
          : c
      ));
    }
  };

  const simulateQRScan = (connectionId: string) => {
    setConnections(prev => prev.map(c => 
      c.id === connectionId 
        ? { 
            ...c, 
            status: 'connected',
            lastConnection: new Date().toISOString(),
            sessionId: `session_${c.userId}_${Date.now()}`,
            qrCode: undefined
          }
        : c
    ));
    setShowQRModal(null);
  };

  const addNewConnection = () => {
    if (!newConnectionPhone.trim()) return;

    const newConnection: WhatsAppConnection = {
      id: crypto.randomUUID(),
      userId: 'new_user',
      userName: 'Novo Usuário',
      phoneNumber: newConnectionPhone,
      status: 'disconnected'
    };

    setConnections(prev => [...prev, newConnection]);
    setNewConnectionPhone('');
    setShowNewConnection(false);
  };

  const getStatusColor = (status: WhatsAppConnection['status']) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'connecting': return 'text-blue-600 bg-blue-100';
      case 'qr_pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: WhatsAppConnection['status']) => {
    switch (status) {
      case 'connected': return <CheckCircleIcon className="w-4 h-4" />;
      case 'connecting': return <ClockIcon className="w-4 h-4 animate-spin" />;
      case 'qr_pending': return <QrCodeIcon className="w-4 h-4" />;
      default: return <XCircleIcon className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: WhatsAppConnection['status']) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'connecting': return 'Conectando...';
      case 'qr_pending': return 'Aguardando QR';
      default: return 'Desconectado';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600">Gerencie as configurações do sistema e integrações</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'whatsapp'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <ChatBubbleLeftRightIcon className="w-4 h-4" />
              WhatsApp
            </div>
          </button>
          <button
            onClick={() => setActiveTab('sistema')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sistema'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <CogIcon className="w-4 h-4" />
              Sistema
            </div>
          </button>
        </nav>
      </div>

      {/* WhatsApp Tab */}
      {activeTab === 'whatsapp' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-medium text-blue-900">Conexões WhatsApp</h3>
            </div>
            <p className="text-blue-700 text-sm">
              Conecte diferentes números de WhatsApp para cada usuário do sistema. 
              Cada usuário pode ter sua própria conexão independente para o CRM.
            </p>
          </div>

          {/* Add New Connection */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Gerenciar Conexões</h3>
              <button
                onClick={() => setShowNewConnection(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <LinkIcon className="w-4 h-4" />
                Nova Conexão
              </button>
            </div>

            {showNewConnection && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                <h4 className="font-medium mb-3">Adicionar Nova Conexão WhatsApp</h4>
                <div className="flex gap-3">
                  <input
                    type="tel"
                    placeholder="+55 (48) 99999-9999"
                    value={newConnectionPhone}
                    onChange={(e) => setNewConnectionPhone(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addNewConnection}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Adicionar
                  </button>
                  <button
                    onClick={() => setShowNewConnection(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Connections List */}
            <div className="space-y-4">
              {connections.map((connection) => (
                <div key={connection.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <PhoneIcon className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{connection.userName}</h4>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium gap-1 ${
                            getStatusColor(connection.status)
                          }`}>
                            {getStatusIcon(connection.status)}
                            {getStatusText(connection.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{connection.phoneNumber}</p>
                        {connection.lastConnection && (
                          <p className="text-xs text-gray-400">
                            Última conexão: {new Date(connection.lastConnection).toLocaleString('pt-BR')}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {connection.status === 'connected' ? (
                        <button
                          onClick={() => handleDisconnect(connection.id)}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 text-sm"
                        >
                          Desconectar
                        </button>
                      ) : (
                        <button
                          onClick={() => handleConnect(connection.id)}
                          className="bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 text-sm"
                          disabled={connection.status === 'connecting'}
                        >
                          {connection.status === 'connecting' ? 'Conectando...' : 'Conectar'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {connections.length === 0 && (
                <div className="text-center py-8">
                  <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma conexão configurada</h3>
                  <p className="text-gray-600">Adicione uma nova conexão WhatsApp para começar.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sistema Tab */}
      {activeTab === 'sistema' && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações do Sistema</h3>
          <p className="text-gray-600">Configurações gerais do sistema serão implementadas aqui.</p>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Escanear QR Code
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Abra o WhatsApp no seu celular e escaneie o QR Code abaixo:
              </p>
              
              <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <img 
                  src={connections.find(c => c.id === showQRModal)?.qrCode}
                  alt="QR Code WhatsApp"
                  className="w-48 h-48 mx-auto"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => simulateQRScan(showQRModal)}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                >
                  Simular Escaneamento
                </button>
                <button
                  onClick={() => setShowQRModal(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Configuracoes;