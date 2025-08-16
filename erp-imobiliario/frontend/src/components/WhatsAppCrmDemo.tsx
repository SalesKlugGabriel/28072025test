import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Bot, Send, Copy, CheckCircle, 
  Settings, Book, Smartphone, ArrowRight, Play
} from 'lucide-react';
import { useWhatsAppCrm, CrmAction } from '../services/whatsappCrmIntegration';

interface WhatsAppCrmDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const WhatsAppCrmDemo: React.FC<WhatsAppCrmDemoProps> = ({ isOpen, onClose }) => {
  const [mensagemTeste, setMensagemTeste] = useState('');
  const [leadIdTeste, setLeadIdTeste] = useState('123');
  const [remetenteTeste, setRemetenteTeste] = useState('João Corretor');
  const [resultadoTeste, setResultadoTeste] = useState<CrmAction | null>(null);
  const [showAjuda, setShowAjuda] = useState(false);
  const [historicoTestes, setHistoricoTestes] = useState<Array<{
    mensagem: string;
    resultado: CrmAction | null;
    timestamp: number;
  }>>([]);

  const whatsappCrm = useWhatsAppCrm();

  // Exemplos de comandos
  const exemplosComandos = [
    '/nota #LEAD123 🏦 Cliente tem financiamento pré-aprovado pelo Santander',
    '/interessado #LEAD123 Cliente muito motivado após visita',
    '/negociacao #LEAD123 Iniciando negociação de desconto',
    '/agendar #LEAD123 Visita técnica amanhã 14:00',
    '/responsavel #LEAD123 Maria Silva',
    '/fechado #LEAD123 🎉 Venda concluída com sucesso!',
    '/help'
  ];

  const testarComando = () => {
    if (!mensagemTeste.trim()) return;

    const resultado = whatsappCrm.processarMensagem(mensagemTeste, remetenteTeste, leadIdTeste);
    setResultadoTeste(resultado);
    
    // Adicionar ao histórico
    setHistoricoTestes(prev => [{
      mensagem: mensagemTeste,
      resultado,
      timestamp: Date.now()
    }, ...prev.slice(0, 9)]); // Manter apenas últimos 10
  };

  const copiarComando = (comando: string) => {
    setMensagemTeste(comando);
    navigator.clipboard.writeText(comando);
  };

  const limparTeste = () => {
    setMensagemTeste('');
    setResultadoTeste(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Integração WhatsApp ↔ CRM</h2>
                <p className="text-sm text-gray-600">Gerencie leads através de comandos no WhatsApp</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAjuda(!showAjuda)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                <Book className="w-4 h-4" />
                Ajuda
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row h-[70vh]">
          {/* Painel de Teste */}
          <div className="flex-1 p-6 border-r border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              Simulador de Comandos
            </h3>

            {/* Configuração do teste */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lead ID</label>
                  <input
                    type="text"
                    value={leadIdTeste}
                    onChange={(e) => setLeadIdTeste(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="123"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remetente</label>
                  <input
                    type="text"
                    value={remetenteTeste}
                    onChange={(e) => setRemetenteTeste(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="João Corretor"
                  />
                </div>
              </div>

              {/* Campo de mensagem */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem WhatsApp</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={mensagemTeste}
                    onChange={(e) => setMensagemTeste(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Digite um comando... Ex: /nota #LEAD123 Cliente interessado"
                    onKeyPress={(e) => e.key === 'Enter' && testarComando()}
                  />
                  <button
                    onClick={testarComando}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Testar
                  </button>
                </div>
              </div>
            </div>

            {/* Resultado do teste */}
            {resultadoTeste && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Comando Processado com Sucesso
                </h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Tipo:</strong> {resultadoTeste.type}</div>
                  <div><strong>Lead ID:</strong> {resultadoTeste.leadId}</div>
                  <div><strong>Autor:</strong> {resultadoTeste.autorId}</div>
                  <div><strong>Dados:</strong></div>
                  <pre className="bg-white p-2 rounded border text-xs overflow-x-auto">
                    {JSON.stringify(resultadoTeste.dados, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {resultadoTeste === null && mensagemTeste && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  ⚠️ Comando não reconhecido. Verifique a sintaxe ou consulte a ajuda.
                </p>
              </div>
            )}

            {/* Histórico de testes */}
            {historicoTestes.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Histórico de Testes</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {historicoTestes.map((teste, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg text-sm">
                      <div className="font-medium text-gray-900 mb-1">{teste.mensagem}</div>
                      <div className="text-gray-600">
                        {teste.resultado ? (
                          <span className="text-green-600">✅ {teste.resultado.type}</span>
                        ) : (
                          <span className="text-red-600">❌ Comando inválido</span>
                        )}
                        <span className="ml-2 text-xs text-gray-500">
                          {new Date(teste.timestamp).toLocaleTimeString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Painel de Exemplos e Ajuda */}
          <div className="flex-1 p-6 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-green-600" />
              Exemplos de Comandos
            </h3>

            <div className="space-y-3 mb-6">
              {exemplosComandos.map((comando, index) => (
                <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <code className="text-sm text-gray-700 flex-1">{comando}</code>
                    <button
                      onClick={() => copiarComando(comando)}
                      className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                      title="Copiar comando"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Manual de ajuda */}
            {showAjuda && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-3">Manual de Comandos</h4>
                <div className="text-sm text-blue-800 space-y-2">
                  <div><strong>Formato geral:</strong> /comando #LEADXXX Texto adicional</div>
                  <div><strong>Anotações:</strong> /nota ou /obs</div>
                  <div><strong>Estágios:</strong> /lead, /interessado, /negociacao, /proposta, /fechado, /perdido</div>
                  <div><strong>Tarefas:</strong> /agendar, /responsavel</div>
                  <div><strong>Ajuda:</strong> /help, /status</div>
                </div>
              </div>
            )}

            {/* Como configurar */}
            <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Como Configurar
              </h4>
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center">1</span>
                  <span>Configure webhook do WhatsApp Business API</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center">2</span>
                  <span>Ative a integração nas configurações do sistema</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center">3</span>
                  <span>Treinar equipe com os comandos disponíveis</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              💡 <strong>Dica:</strong> Use emojis nas anotações para melhor organização visual
            </div>
            <div className="flex gap-2">
              <button
                onClick={limparTeste}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm"
              >
                Limpar
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppCrmDemo;