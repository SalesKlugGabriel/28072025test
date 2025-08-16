import React, { useState } from 'react';
import { 
  PlusIcon, 
  TrashIcon, 
  PlayIcon, 
  PauseIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Conversation } from './WhatsAppChat';

interface AutomatedRule {
  id: string;
  name: string;
  trigger: 'keyword' | 'first_contact' | 'no_response' | 'specific_time';
  triggerValue: string;
  message: string;
  isActive: boolean;
  delay?: number; // em minutos
  conditions?: string[];
}

interface AutomatedMessagesProps {
  conversation: Conversation;
}

export const AutomatedMessages: React.FC<AutomatedMessagesProps> = ({ conversation }) => {
  const [rules, setRules] = useState<AutomatedRule[]>([
    {
      id: '1',
      name: 'Saudação inicial',
      trigger: 'first_contact',
      triggerValue: '',
      message: 'Olá! Obrigado por entrar em contato. Sou da equipe de vendas e estou aqui para ajudá-lo. Em que posso ser útil?',
      isActive: true
    },
    {
      id: '2', 
      name: 'Resposta sobre preços',
      trigger: 'keyword',
      triggerValue: 'preço,valor,quanto custa',
      message: 'Fico feliz em saber do seu interesse! Temos várias opções de investimento. Para te dar informações mais precisas, você tem alguma faixa de valor em mente?',
      isActive: true
    },
    {
      id: '3',
      name: 'Follow-up sem resposta',
      trigger: 'no_response',
      triggerValue: '24',
      message: 'Oi! Vi que você demonstrou interesse em nossos empreendimentos. Posso tirar alguma dúvida ou agendar uma conversa mais detalhada?',
      isActive: false,
      delay: 1440 // 24 horas
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRule, setNewRule] = useState<Partial<AutomatedRule>>({
    name: '',
    trigger: 'keyword',
    triggerValue: '',
    message: '',
    isActive: true
  });

  const handleCreateRule = () => {
    if (newRule.name && newRule.message) {
      const rule: AutomatedRule = {
        id: Date.now().toString(),
        name: newRule.name,
        trigger: newRule.trigger!,
        triggerValue: newRule.triggerValue || '',
        message: newRule.message,
        isActive: newRule.isActive!,
        delay: newRule.delay
      };

      setRules(prev => [...prev, rule]);
      setNewRule({
        name: '',
        trigger: 'keyword',
        triggerValue: '',
        message: '',
        isActive: true
      });
      setShowCreateForm(false);
    }
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, isActive: !rule.isActive }
        : rule
    ));
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
  };

  const getTriggerLabel = (trigger: AutomatedRule['trigger']) => {
    switch (trigger) {
      case 'keyword': return 'Palavra-chave';
      case 'first_contact': return 'Primeiro contato';
      case 'no_response': return 'Sem resposta';
      case 'specific_time': return 'Horário específico';
      default: return trigger;
    }
  };

  const getTriggerDescription = (rule: AutomatedRule) => {
    switch (rule.trigger) {
      case 'keyword':
        return `Quando receber: ${rule.triggerValue}`;
      case 'first_contact':
        return 'Primeira mensagem do cliente';
      case 'no_response':
        return `Após ${rule.triggerValue}h sem resposta`;
      case 'specific_time':
        return `Às ${rule.triggerValue}`;
      default:
        return rule.triggerValue;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Mensagens Automáticas
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Configure respostas automáticas para {conversation.clienteName}
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Nova Regra
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">
            Criar Nova Regra
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Regra
              </label>
              <input
                type="text"
                value={newRule.name || ''}
                onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Resposta sobre disponibilidade"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gatilho
                </label>
                <select
                  value={newRule.trigger || 'keyword'}
                  onChange={(e) => setNewRule(prev => ({ ...prev, trigger: e.target.value as AutomatedRule['trigger'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="keyword">Palavra-chave</option>
                  <option value="first_contact">Primeiro contato</option>
                  <option value="no_response">Sem resposta</option>
                  <option value="specific_time">Horário específico</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {newRule.trigger === 'keyword' ? 'Palavras-chave (separadas por vírgula)' :
                   newRule.trigger === 'no_response' ? 'Horas sem resposta' :
                   newRule.trigger === 'specific_time' ? 'Horário (HH:MM)' : 'Valor'}
                </label>
                <input
                  type="text"
                  value={newRule.triggerValue || ''}
                  onChange={(e) => setNewRule(prev => ({ ...prev, triggerValue: e.target.value }))}
                  placeholder={
                    newRule.trigger === 'keyword' ? 'disponível,unidade,apartamento' :
                    newRule.trigger === 'no_response' ? '24' :
                    newRule.trigger === 'specific_time' ? '09:00' : ''
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensagem de Resposta
              </label>
              <textarea
                value={newRule.message || ''}
                onChange={(e) => setNewRule(prev => ({ ...prev, message: e.target.value }))}
                rows={3}
                placeholder="Digite a mensagem que será enviada automaticamente..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newRule.isActive || false}
                  onChange={(e) => setNewRule(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Ativar regra imediatamente</span>
              </label>
              
              <div className="space-x-3">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateRule}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Criar Regra
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${
              !rule.isActive ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-3 h-3 rounded-full ${
                    rule.isActive ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <h4 className="text-md font-medium text-gray-900">
                    {rule.name}
                  </h4>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {getTriggerLabel(rule.trigger)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    {getTriggerDescription(rule)}
                  </div>
                  
                  <div className="flex items-start text-sm text-gray-600">
                    <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="bg-gray-50 px-3 py-2 rounded-lg">
                      {rule.message}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleToggleRule(rule.id)}
                  className={`p-2 rounded-full transition-colors ${
                    rule.isActive 
                      ? 'text-green-600 hover:bg-green-100'
                      : 'text-gray-400 hover:bg-gray-100'
                  }`}
                  title={rule.isActive ? 'Desativar' : 'Ativar'}
                >
                  {rule.isActive ? (
                    <PauseIcon className="w-5 h-5" />
                  ) : (
                    <PlayIcon className="w-5 h-5" />
                  )}
                </button>
                
                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                  title="Excluir"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {rules.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma regra configurada
            </h3>
            <p className="text-gray-500 mb-4">
              Crie sua primeira regra de mensagem automática para melhorar o atendimento.
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Criar Primeira Regra
            </button>
          </div>
        )}
      </div>

      {/* Statistics */}
      {rules.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">
            Estatísticas
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {rules.filter(r => r.isActive).length}
              </div>
              <div className="text-sm text-gray-500">Regras Ativas</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {rules.filter(r => r.trigger === 'keyword').length}
              </div>
              <div className="text-sm text-gray-500">Por Palavra-chave</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {rules.filter(r => r.trigger === 'no_response').length}
              </div>
              <div className="text-sm text-gray-500">Follow-up</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};