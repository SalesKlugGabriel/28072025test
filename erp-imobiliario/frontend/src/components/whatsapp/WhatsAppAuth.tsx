import React, { useState, useEffect } from 'react';
import { QrCodeIcon, DevicePhoneMobileIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { whatsappService } from '../../services/whatsappService';
import multiUserWhatsAppService from '../../services/multiUserWhatsappService';
import { WhatsAppConnection } from '../../types/whatsapp';

interface WhatsAppAuthProps {
  onConnectionSuccess: (connection: WhatsAppConnection) => void;
  existingConnection?: WhatsAppConnection | null;
  userId: string;
  userName: string;
}

export const WhatsAppAuth: React.FC<WhatsAppAuthProps> = ({ 
  onConnectionSuccess, 
  existingConnection,
  userId,
  userName
}) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'qr_pending' | 'connected' | 'failed'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [userPhone, setUserPhone] = useState('');

  useEffect(() => {
    if (existingConnection) {
      setConnectionStatus(existingConnection.status as any);
      if (existingConnection.qrCode) {
        setQrCode(existingConnection.qrCode);
      }
    }
  }, [existingConnection]);

  const connectWhatsApp = async () => {
    if (!userPhone.trim()) {
      setError('Por favor, informe seu número de WhatsApp');
      return;
    }

    setConnectionStatus('connecting');
    setError(null);
    setQrCode(null);

    try {
      // Conectar usando o serviço multi-usuário
      const connection = await multiUserWhatsAppService.connectWhatsApp(userId, userPhone);
      
      // Adicionar listener para mudanças de status
      const connectionListener = (updatedConnection: WhatsAppConnection) => {
        if (updatedConnection.userId === userId) {
          setConnectionStatus(updatedConnection.status as any);
          
          if (updatedConnection.qrCode) {
            setQrCode(updatedConnection.qrCode);
          }
          
          if (updatedConnection.status === 'connected') {
            onConnectionSuccess(updatedConnection);
          }
        }
      };

      multiUserWhatsAppService.addConnectionListener(connectionListener);

      // Configurar estado inicial
      setConnectionStatus(connection.status as any);
      if (connection.qrCode) {
        setQrCode(connection.qrCode);
      }
      
      if (connection.status === 'connected') {
        onConnectionSuccess(connection);
      }

    } catch (err) {
      console.error('Erro na conexão:', err);
      setConnectionStatus('failed');
      setError('Erro ao conectar WhatsApp - Verifique sua configuração Evolution API');
    }
  };

  const pollConnectionStatus = () => {
    const interval = setInterval(async () => {
      try {
        const status = await whatsappService.checkEvolutionStatus();
        if (status && status.status === 'connected') {
          clearInterval(interval);
          setConnectionStatus('connected');
          setQrCode(null);
          onConnectionSuccess(status);
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error);
      }
    }, 3000);

    // Parar de verificar após 5 minutos
    setTimeout(() => {
      clearInterval(interval);
      if (connectionStatus === 'qr_pending') {
        setConnectionStatus('failed');
        setError('Tempo limite para escanear QR Code atingido');
      }
    }, 300000);
  };

  const disconnect = async () => {
    setConnectionStatus('idle');
    setQrCode(null);
    setError(null);
    setUserPhone('');
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setUserPhone(formatted);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <DevicePhoneMobileIcon className="mx-auto h-12 w-12 text-green-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Conectar WhatsApp
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Conecte seu WhatsApp para começar a usar o chat integrado
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {connectionStatus === 'idle' && (
            <div className="space-y-4">
              {/* Aviso sobre modo demonstração */}
              {(!import.meta.env.VITE_EVOLUTION_API_URL || import.meta.env.VITE_EVOLUTION_API_URL === 'http://localhost:8080') && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="text-blue-400 text-lg">ℹ️</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Modo Demonstração
                      </h3>
                      <div className="mt-1 text-sm text-blue-700">
                        <p>
                          A Evolution API não está configurada. O sistema funcionará em modo demonstração 
                          com dados simulados para você testar todas as funcionalidades.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Seu número do WhatsApp
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={userPhone}
                  onChange={handlePhoneChange}
                  placeholder="(11) 99999-9999"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Este será o número associado ao seu perfil de corretor
                </p>
              </div>

              <button
                onClick={connectWhatsApp}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {(!import.meta.env.VITE_EVOLUTION_API_URL || import.meta.env.VITE_EVOLUTION_API_URL === 'http://localhost:8080') 
                  ? 'Entrar em Modo Demonstração' 
                  : 'Conectar WhatsApp'
                }
              </button>
            </div>
          )}

          {connectionStatus === 'connecting' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Conectando...</p>
            </div>
          )}

          {connectionStatus === 'qr_pending' && qrCode && (
            <div className="text-center space-y-4">
              <QrCodeIcon className="mx-auto h-8 w-8 text-green-600" />
              <p className="text-sm text-gray-600">
                Escaneie o QR Code com seu WhatsApp:
              </p>
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <img 
                  src={qrCode} 
                  alt="QR Code WhatsApp" 
                  className="mx-auto max-w-full h-auto"
                />
              </div>
              <p className="text-xs text-gray-500">
                Abra o WhatsApp no seu celular, vá em "Dispositivos conectados" e escaneie este código
              </p>
              <button
                onClick={disconnect}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Cancelar
              </button>
            </div>
          )}

          {connectionStatus === 'connected' && (
            <div className="text-center space-y-4">
              <CheckCircleIcon className="mx-auto h-8 w-8 text-green-600" />
              <p className="text-sm text-green-600 font-medium">
                WhatsApp conectado com sucesso!
              </p>
            </div>
          )}

          {connectionStatus === 'failed' && (
            <div className="text-center space-y-4">
              <XCircleIcon className="mx-auto h-8 w-8 text-red-600" />
              <p className="text-sm text-red-600">
                {error || 'Falha na conexão'}
              </p>
              <button
                onClick={() => setConnectionStatus('idle')}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {existingConnection && existingConnection.status === 'connected' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      WhatsApp já conectado
                    </p>
                    <p className="text-xs text-green-600">
                      {existingConnection.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={disconnect}
                className="w-full py-2 px-4 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Desconectar
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Suas conversas ficam armazenadas permanentemente no sistema para auditoria e análise.
          </p>
        </div>
      </div>
    </div>
  );
};