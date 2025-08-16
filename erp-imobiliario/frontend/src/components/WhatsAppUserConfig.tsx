import React, { useState, useEffect } from 'react';
import { 
  CogIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/auth-context';
import multiUserWhatsAppService, { UserWhatsAppConfig } from '../services/multiUserWhatsappService';
import { EvolutionAPIConfig } from '../types/whatsapp';

interface WhatsAppUserConfigProps {
  onConfigSaved?: () => void;
  onClose?: () => void;
}

export const WhatsAppUserConfig: React.FC<WhatsAppUserConfigProps> = ({ onConfigSaved, onClose }) => {
  const { usuario } = useAuth();
  const [config, setConfig] = useState<EvolutionAPIConfig>({
    apiUrl: '',
    token: '',
    instanceId: '',
    webhookUrl: '',
    isActive: false
  });
  const [showToken, setShowToken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (usuario) {
      loadExistingConfig();
    }
  }, [usuario]);

  const loadExistingConfig = () => {
    if (!usuario) return;
    
    const userConfig = multiUserWhatsAppService.getUserConfig(usuario.id);
    if (userConfig?.evolutionConfig) {
      setConfig(userConfig.evolutionConfig);
    }
  };

  const handleInputChange = (field: keyof EvolutionAPIConfig, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
    setSuccess(null);
  };

  const testConnection = async () => {
    if (!config.apiUrl || !config.token) {
      setError('Por favor, preencha URL da API e Token');
      return;
    }

    setTestStatus('testing');
    setError(null);

    try {
      const response = await fetch(`${config.apiUrl}/instance/fetchInstances`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setTestStatus('success');
        setSuccess('Conexão testada com sucesso! ✅');
      } else {
        setTestStatus('error');
        setError('Falha no teste de conexão. Verifique a URL e o token.');
      }
    } catch (error) {
      setTestStatus('error');
      setError('Erro ao conectar com a API. Verifique se a URL está correta.');
    }
  };

  const handleSave = async () => {
    if (!usuario) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validações
      if (config.isActive) {
        if (!config.apiUrl || !config.token || !config.instanceId) {
          throw new Error('Para ativar, preencha todos os campos obrigatórios');
        }

        // Validar URL
        try {
          new URL(config.apiUrl);
        } catch {
          throw new Error('URL da API inválida');
        }
      }

      // Salvar configuração
      await multiUserWhatsAppService.configureUserEvolutionAPI(
        usuario.id,
        usuario.nome,
        config
      );

      setSuccess('Configuração salva com sucesso! ✅');
      
      if (onConfigSaved) {
        onConfigSaved();
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao salvar configuração');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveConfig = async () => {
    if (!usuario) return;

    if (confirm('Tem certeza que deseja remover esta configuração? Isso desconectará seu WhatsApp.')) {
      try {
        await multiUserWhatsAppService.disconnectWhatsApp(usuario.id);
        multiUserWhatsAppService.removeUserConfig(usuario.id);
        
        setConfig({
          apiUrl: '',
          token: '',
          instanceId: '',
          webhookUrl: '',
          isActive: false
        });
        
        setSuccess('Configuração removida com sucesso');
        
        if (onConfigSaved) {
          onConfigSaved();
        }
      } catch (error) {
        setError('Erro ao remover configuração');
      }
    }
  };

  const generateInstanceId = () => {
    if (usuario) {
      const instanceId = `legasys_${usuario.id.slice(-8)}_${Date.now().toString().slice(-6)}`;
      handleInputChange('instanceId', instanceId);
    }
  };

  if (!usuario) {
    return <div>Usuário não autenticado</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CogIcon className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Configuração Evolution API - WhatsApp
          </h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            ✕
          </button>
        )}
      </div>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            ℹ️
          </div>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-2">Como configurar:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Configure sua instância Evolution API</li>
              <li>Insira a URL da API e o token de acesso</li>
              <li>Gere ou insira um ID único para sua instância</li>
              <li>Teste a conexão antes de ativar</li>
              <li>Ative a configuração para usar a API real</li>
            </ol>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Status da Configuração */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Status da Configuração</h3>
            <p className="text-sm text-gray-600">
              {config.isActive 
                ? 'Evolution API ativa - mensagens via API real'
                : 'Modo demonstração - dados simulados'
              }
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* URL da API */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL da Evolution API *
          </label>
          <input
            type="url"
            value={config.apiUrl}
            onChange={(e) => handleInputChange('apiUrl', e.target.value)}
            placeholder="https://api.evolutionapi.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            URL base da sua instância Evolution API
          </p>
        </div>

        {/* Token */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Token de Acesso *
          </label>
          <div className="relative">
            <input
              type={showToken ? 'text' : 'password'}
              value={config.token}
              onChange={(e) => handleInputChange('token', e.target.value)}
              placeholder="Seu token de acesso Evolution API"
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showToken ? (
                <EyeSlashIcon className="w-5 h-5 text-gray-400" />
              ) : (
                <EyeIcon className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Instance ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instance ID *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={config.instanceId}
              onChange={(e) => handleInputChange('instanceId', e.target.value)}
              placeholder="ID único para sua instância"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={generateInstanceId}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
            >
              <PlusIcon className="w-4 h-4" />
              Gerar
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Identificador único para separar suas mensagens de outros usuários
          </p>
        </div>

        {/* Webhook URL (opcional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Webhook URL (opcional)
          </label>
          <input
            type="url"
            value={config.webhookUrl}
            onChange={(e) => handleInputChange('webhookUrl', e.target.value)}
            placeholder="https://seu-webhook.com/whatsapp"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            URL para receber notificações de mensagens (opcional)
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={testConnection}
            disabled={!config.apiUrl || !config.token || testStatus === 'testing'}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {testStatus === 'testing' ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                Testando...
              </>
            ) : (
              'Testar Conexão'
            )}
          </button>

          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Salvando...
              </>
            ) : (
              'Salvar Configuração'
            )}
          </button>

          {(config.apiUrl || config.token || config.instanceId) && (
            <button
              onClick={handleRemoveConfig}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <TrashIcon className="w-4 h-4" />
              Remover
            </button>
          )}
        </div>

        {/* Status do Teste */}
        {testStatus === 'success' && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            ✅ Conexão estabelecida com sucesso! Você pode ativar a configuração.
          </div>
        )}

        {testStatus === 'error' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            ❌ Falha na conexão. Verifique suas credenciais e tente novamente.
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppUserConfig;