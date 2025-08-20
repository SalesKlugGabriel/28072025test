import React, { useState, useEffect } from 'react';
import { WhatsAppAuth } from '../components/whatsapp/WhatsAppAuth';
import { WhatsAppChat } from '../components/whatsapp/WhatsAppChat';
import { WhatsAppUserConfig } from '../components/WhatsAppUserConfig';
import WhatsAppHelpManual from '../components/whatsapp/WhatsAppHelpManual';
import { whatsappService } from '../services/whatsappService';
import multiUserWhatsAppService from '../services/multiUserWhatsappService';
import { WhatsAppConnection } from '../types/whatsapp';
import { useAuth } from '../context/auth-context';
import { CogIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface WhatsAppPageProps {
  userRole?: string;
}

const WhatsAppPage: React.FC<WhatsAppPageProps> = ({ userRole = 'corretor' }) => {
  const { usuario } = useAuth();
  const [connection, setConnection] = useState<WhatsAppConnection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfig, setShowConfig] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (usuario) {
      checkConnectionStatus();
    }
  }, [usuario]);

  const checkConnectionStatus = async () => {
    if (!usuario) return;
    
    setIsLoading(true);
    try {
      const userConnection = multiUserWhatsAppService.getUserConnection(usuario.id);
      setConnection(userConnection);
    } catch (error) {
      console.error('Erro ao verificar status do WhatsApp:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectionSuccess = (newConnection: WhatsAppConnection) => {
    setConnection(newConnection);
  };

  const handleDisconnect = async () => {
    if (usuario) {
      await multiUserWhatsAppService.disconnectWhatsApp(usuario.id);
      setConnection(null);
    }
  };

  const handleConfigSaved = () => {
    setShowConfig(false);
    checkConnectionStatus();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando conexão WhatsApp...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Usuário não autenticado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Botões de Configuração e Ajuda */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setShowHelp(true)}
          className="p-3 bg-white border border-gray-300 rounded-full shadow-lg hover:shadow-xl transition-all hover:bg-gray-50"
          title="Manual de Ajuda"
        >
          <QuestionMarkCircleIcon className="w-5 h-5 text-green-600" />
        </button>
        <button
          onClick={() => setShowConfig(true)}
          className="p-3 bg-white border border-gray-300 rounded-full shadow-lg hover:shadow-xl transition-all hover:bg-gray-50"
          title="Configurar Evolution API"
        >
          <CogIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Modal de Configuração */}
      {showConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <WhatsAppUserConfig 
            onConfigSaved={handleConfigSaved}
            onClose={() => setShowConfig(false)}
          />
        </div>
      )}

      {/* Modal de Ajuda */}
      <WhatsAppHelpManual
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />

      {/* Conteúdo Principal */}
      {!connection || connection.status !== 'connected' ? (
        <WhatsAppAuth 
          onConnectionSuccess={handleConnectionSuccess}
          existingConnection={connection}
          userId={usuario.id}
          userName={usuario.nome}
        />
      ) : (
        <WhatsAppChat 
          connection={connection}
          onDisconnect={handleDisconnect}
          userRole={userRole}
        />
      )}
    </div>
  );
};

export default WhatsAppPage;