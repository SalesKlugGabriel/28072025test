import React, { useState, useEffect } from 'react';
import { whatsappService } from '../services/whatsappService';
import { googleCalendarService } from '../services/googleCalendarService';
import { EvolutionAPIConfig } from '../services/evolutionAPI';

interface ConfiguracaoIntegracoesProps {
  onClose?: () => void;
}

export default function ConfiguracaoIntegracoes({ onClose }: ConfiguracaoIntegracoesProps) {
  // Estados para WhatsApp Evolution API
  const [evolutionConfig, setEvolutionConfig] = useState<EvolutionAPIConfig>({
    baseUrl: localStorage.getItem('evolution_base_url') || 'https://evolution-api.exemplo.com',
    apiKey: localStorage.getItem('evolution_api_key') || '',
    instanceName: localStorage.getItem('evolution_instance_name') || 'legasys_erp'
  });
  
  const [whatsappStatus, setWhatsappStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'qr_pending'>('disconnected');
  const [qrCode, setQrCode] = useState<string>('');

  // Estados para Google Calendar
  const [googleConfig, setGoogleConfig] = useState({
    clientId: localStorage.getItem('google_client_id') || '',
    apiKey: localStorage.getItem('google_api_key') || ''
  });
  
  const [googleStatus, setGoogleStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [googleUser, setGoogleUser] = useState<any>(null);

  // Estados gerais
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'google'>('whatsapp');

  // Verificar status inicial das conexões
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      // Verificar WhatsApp
      const whatsappConn = await whatsappService.checkEvolutionStatus();
      if (whatsappConn) {
        setWhatsappStatus(whatsappConn.status === 'connected' ? 'connected' : whatsappConn.status as any);
      }

      // Verificar Google
      if (googleCalendarService.isAuthenticated()) {
        setGoogleStatus('connected');
        setGoogleUser(googleCalendarService.getUserInfo());
      }
    } catch (error) {
      console.error('Erro ao verificar status das conexões:', error);
    }
  };

  const handleEvolutionConnect = async () => {
    try {
      setLoading(true);
      setWhatsappStatus('connecting');

      // Salvar configurações
      localStorage.setItem('evolution_base_url', evolutionConfig.baseUrl);
      localStorage.setItem('evolution_api_key', evolutionConfig.apiKey);
      localStorage.setItem('evolution_instance_name', evolutionConfig.instanceName);

      // Configurar serviço
      whatsappService.setupEvolutionAPI(evolutionConfig);

      // Tentar conectar
      const result = await whatsappService.connectEvolutionAPI();

      if (result.success) {
        setWhatsappStatus('connected');
        setQrCode('');
        alert('WhatsApp conectado com sucesso!');
      } else if (result.qrCode) {
        setWhatsappStatus('qr_pending');
        setQrCode(`data:image/png;base64,${result.qrCode}`);
      } else {
        setWhatsappStatus('disconnected');
        alert('Erro ao conectar: ' + (result.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao conectar Evolution API:', error);
      setWhatsappStatus('disconnected');
      alert('Erro ao conectar ao WhatsApp');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleConnect = async () => {
    try {
      setLoading(true);
      setGoogleStatus('connecting');

      // Salvar configurações
      localStorage.setItem('google_client_id', googleConfig.clientId);
      localStorage.setItem('google_api_key', googleConfig.apiKey);

      // Salvar configurações no localStorage (as variáveis de ambiente devem ser definidas no arquivo .env)

      // Inicializar e conectar
      await googleCalendarService.initialize();
      const success = await googleCalendarService.signIn();

      if (success) {
        setGoogleStatus('connected');
        setGoogleUser(googleCalendarService.getUserInfo());
        alert('Google Calendar conectado com sucesso!');
      } else {
        setGoogleStatus('disconnected');
        alert('Erro ao conectar ao Google Calendar');
      }
    } catch (error) {
      console.error('Erro ao conectar Google Calendar:', error);
      setGoogleStatus('disconnected');
      alert('Erro ao conectar ao Google Calendar');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleDisconnect = async () => {
    try {
      await googleCalendarService.signOut();
      setGoogleStatus('disconnected');
      setGoogleUser(null);
    } catch (error) {
      console.error('Erro ao desconectar Google:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return '#10b981';
      case 'connecting': return '#f59e0b';
      case 'qr_pending': return '#3b82f6';
      default: return '#ef4444';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return '🟢 Conectado';
      case 'connecting': return '🟡 Conectando...';
      case 'qr_pending': return '📱 Escaneie o QR Code';
      default: return '🔴 Desconectado';
    }
  };

  return (
    <div className="configuracao-integracoes">
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>🔗 Configuração de Integrações</h2>
            {onClose && (
              <button className="close-btn" onClick={onClose}>✕</button>
            )}
          </div>

          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'whatsapp' ? 'active' : ''}`}
              onClick={() => setActiveTab('whatsapp')}
            >
              📱 WhatsApp (Evolution API)
            </button>
            <button 
              className={`tab ${activeTab === 'google' ? 'active' : ''}`}
              onClick={() => setActiveTab('google')}
            >
              📅 Google Calendar
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'whatsapp' && (
              <div className="whatsapp-config">
                <div className="status-indicator">
                  <span style={{ color: getStatusColor(whatsappStatus) }}>
                    {getStatusText(whatsappStatus)}
                  </span>
                </div>

                <div className="form-group">
                  <label>URL Base da Evolution API:</label>
                  <input
                    type="url"
                    value={evolutionConfig.baseUrl}
                    onChange={e => setEvolutionConfig({...evolutionConfig, baseUrl: e.target.value})}
                    placeholder="https://evolution-api.exemplo.com"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>API Key:</label>
                  <input
                    type="password"
                    value={evolutionConfig.apiKey}
                    onChange={e => setEvolutionConfig({...evolutionConfig, apiKey: e.target.value})}
                    placeholder="Sua chave da API"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Nome da Instância:</label>
                  <input
                    type="text"
                    value={evolutionConfig.instanceName}
                    onChange={e => setEvolutionConfig({...evolutionConfig, instanceName: e.target.value})}
                    placeholder="legasys_erp"
                    disabled={loading}
                  />
                </div>

                {whatsappStatus === 'qr_pending' && qrCode && (
                  <div className="qr-code-section">
                    <h3>📱 Escaneie o QR Code com seu WhatsApp:</h3>
                    <img src={qrCode} alt="QR Code WhatsApp" className="qr-code" />
                    <p>Após escanear, a conexão será estabelecida automaticamente.</p>
                  </div>
                )}

                <div className="action-buttons">
                  <button 
                    onClick={handleEvolutionConnect}
                    disabled={loading || whatsappStatus === 'connecting'}
                    className="connect-btn"
                  >
                    {loading ? 'Conectando...' : 'Conectar WhatsApp'}
                  </button>

                  <button 
                    onClick={checkConnectionStatus}
                    disabled={loading}
                    className="refresh-btn"
                  >
                    🔄 Verificar Status
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'google' && (
              <div className="google-config">
                <div className="status-indicator">
                  <span style={{ color: getStatusColor(googleStatus) }}>
                    {getStatusText(googleStatus)}
                  </span>
                  {googleUser && (
                    <div className="user-info">
                      <span>👤 {googleUser.nome} ({googleUser.email})</span>
                    </div>
                  )}
                </div>

                <div className="info-section">
                  <h4>ℹ️ Como configurar o Google Calendar:</h4>
                  <ol>
                    <li>Acesse o <a href="https://console.developers.google.com/" target="_blank" rel="noopener noreferrer">Google Console</a></li>
                    <li>Crie um projeto ou selecione um existente</li>
                    <li>Ative a API do Google Calendar</li>
                    <li>Crie credenciais OAuth 2.0 para aplicação web</li>
                    <li>Adicione sua URL como origem autorizada</li>
                    <li>Copie o Client ID e API Key</li>
                  </ol>
                </div>

                <div className="form-group">
                  <label>Google Client ID:</label>
                  <input
                    type="text"
                    value={googleConfig.clientId}
                    onChange={e => setGoogleConfig({...googleConfig, clientId: e.target.value})}
                    placeholder="123456789-abc123def456.apps.googleusercontent.com"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Google API Key:</label>
                  <input
                    type="password"
                    value={googleConfig.apiKey}
                    onChange={e => setGoogleConfig({...googleConfig, apiKey: e.target.value})}
                    placeholder="AIzaSyABC123DEF456..."
                    disabled={loading}
                  />
                </div>

                <div className="action-buttons">
                  {googleStatus === 'connected' ? (
                    <button 
                      onClick={handleGoogleDisconnect}
                      disabled={loading}
                      className="disconnect-btn"
                    >
                      Desconectar Google
                    </button>
                  ) : (
                    <button 
                      onClick={handleGoogleConnect}
                      disabled={loading || googleStatus === 'connecting'}
                      className="connect-btn"
                    >
                      {loading ? 'Conectando...' : 'Conectar Google Calendar'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="integration-status">
            <h3>📊 Status das Integrações:</h3>
            <div className="status-grid">
              <div className="status-item">
                <span>📱 WhatsApp:</span>
                <span style={{ color: getStatusColor(whatsappStatus) }}>
                  {getStatusText(whatsappStatus)}
                </span>
              </div>
              <div className="status-item">
                <span>📅 Google:</span>
                <span style={{ color: getStatusColor(googleStatus) }}>
                  {getStatusText(googleStatus)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .configuracao-integracoes {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
        }

        .modal-overlay {
          background: rgba(0, 0, 0, 0.7);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .modal-content {
          background: white;
          border-radius: 0.75rem;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 1.5rem 0 1.5rem;
        }

        .modal-header h2 {
          margin: 0;
          color: #333;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.25rem;
        }

        .close-btn:hover {
          background: #f0f0f0;
        }

        .tabs {
          display: flex;
          border-bottom: 1px solid #ddd;
          margin: 1rem 1.5rem 0 1.5rem;
        }

        .tab {
          background: none;
          border: none;
          padding: 1rem;
          cursor: pointer;
          color: #666;
          border-bottom: 2px solid transparent;
          flex: 1;
          text-align: center;
        }

        .tab.active {
          color: #007bff;
          border-bottom-color: #007bff;
        }

        .tab-content {
          padding: 1.5rem;
        }

        .status-indicator {
          text-align: center;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 0.5rem;
        }

        .user-info {
          margin-top: 0.5rem;
          font-size: 0.9rem;
          color: #666;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #333;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 0.375rem;
          font-size: 1rem;
          box-sizing: border-box;
        }

        .form-group input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .form-group input:disabled {
          background: #f5f5f5;
          color: #999;
        }

        .qr-code-section {
          text-align: center;
          margin: 1.5rem 0;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 0.5rem;
        }

        .qr-code {
          max-width: 250px;
          height: auto;
          margin: 1rem 0;
          border: 1px solid #ddd;
          border-radius: 0.5rem;
        }

        .info-section {
          background: #e3f2fd;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .info-section h4 {
          margin: 0 0 0.5rem 0;
          color: #1976d2;
        }

        .info-section ol {
          margin: 0;
          padding-left: 1.25rem;
        }

        .info-section a {
          color: #1976d2;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .connect-btn,
        .disconnect-btn,
        .refresh-btn {
          flex: 1;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 0.375rem;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .connect-btn {
          background: #10b981;
          color: white;
        }

        .connect-btn:hover:not(:disabled) {
          background: #059669;
        }

        .disconnect-btn {
          background: #ef4444;
          color: white;
        }

        .disconnect-btn:hover:not(:disabled) {
          background: #dc2626;
        }

        .refresh-btn {
          background: #6b7280;
          color: white;
        }

        .refresh-btn:hover:not(:disabled) {
          background: #4b5563;
        }

        .connect-btn:disabled,
        .disconnect-btn:disabled,
        .refresh-btn:disabled {
          background: #d1d5db;
          color: #9ca3af;
          cursor: not-allowed;
        }

        .integration-status {
          background: #f8f9fa;
          margin: 1.5rem;
          padding: 1rem;
          border-radius: 0.5rem;
          border-top: 1px solid #ddd;
        }

        .integration-status h3 {
          margin: 0 0 1rem 0;
          color: #333;
        }

        .status-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .status-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          background: white;
          border-radius: 0.25rem;
          border: 1px solid #ddd;
        }

        @media (max-width: 768px) {
          .modal-content {
            margin: 0.5rem;
            max-height: 95vh;
          }
          
          .status-grid {
            grid-template-columns: 1fr;
          }
          
          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}