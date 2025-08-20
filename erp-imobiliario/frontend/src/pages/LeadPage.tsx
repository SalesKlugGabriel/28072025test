import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Building, Tag, FileText, Save,
  Phone, Mail, MessageSquare, Edit2, Clock, Calculator, Plus,
  Camera, MapPin, DollarSign, Home, Car, Users, Video, Coffee,
  CalendarPlus, TrendingUp, History, Settings
} from 'lucide-react';
import ImoveisSugeridos from '../components/ImoveisSugeridos';

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  whatsapp: string;
  score: number;
  temperatura: 'frio' | 'morno' | 'quente';
  stage: string;
  board: string;
  pipeline: string;
  etapa: string;
  valor: number;
  tags?: string[];
  // Campos expandidos
  investimentoPretendido: {
    valorMinimo: number;
    valorMaximo: number;
  };
  perfilImovel: {
    dormitorios: number;
    suites: number;
    vagas: number;
    localizacao: string;
    raioAbrangencia: number;
    observacoes?: string;
  };
}

const LeadPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'detalhes' | 'historico' | 'imoveis'>('detalhes');
  const [mostrarImoveisSugeridos, setMostrarImoveisSugeridos] = useState(false);

  // TODO: Replace with API integration to fetch lead data
  // Remove mock data and implement proper API calls to backend lead service
  useEffect(() => {
    // API call to fetch lead by ID should go here
    // For now, setting empty lead structure to prevent errors
    setTimeout(() => {
      setLead(null); // This will show "Lead não encontrado" until API is integrated
      setLoading(false);
    }, 500);
  }, [id]);

  // Opções para os dropdowns
  const opcoesPipeline = ['Principal', 'Revendas', 'Comercial', 'Terceiros'];
  const opcoesEtapa = ['Lead', 'Contato', 'Interessado', 'Negociação', 'Proposta', 'Fechado'];

  const handleSave = () => {
    if (lead) {
      console.log('Salvando lead:', lead);
      // Implementar salvamento
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value);
  };

  const handleFieldChange = (field: string, value: any) => {
    if (!lead) return;
    
    setLead(prev => ({
      ...prev!,
      [field]: value
    }));
  };

  const handleNestedFieldChange = (parentField: string, field: string, value: any) => {
    if (!lead) return;
    
    setLead(prev => ({
      ...prev!,
      [parentField]: {
        ...(prev as any)[parentField],
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Lead não encontrado</p>
          <button 
            onClick={() => navigate('/crm')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Voltar ao CRM
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/crm')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${
                  lead.temperatura === 'quente' ? 'bg-red-500' :
                  lead.temperatura === 'morno' ? 'bg-yellow-500' :
                  'bg-blue-500'
                } text-white text-sm font-semibold flex items-center justify-center`}>
                  {lead.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{lead.nome}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {lead.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {lead.telefone}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pipeline e Etapa no cabeçalho */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Pipeline:</label>
                <select
                  value={lead.pipeline}
                  onChange={(e) => handleFieldChange('pipeline', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {opcoesPipeline.map(pipeline => (
                    <option key={pipeline} value={pipeline}>{pipeline}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Etapa:</label>
                <select
                  value={lead.etapa}
                  onChange={(e) => handleFieldChange('etapa', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {opcoesEtapa.map(etapa => (
                    <option key={etapa} value={etapa}>{etapa}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna da Esquerda - Detalhes */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Investimento Pretendido */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Investimento Pretendido
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valor Mínimo</label>
                  <input
                    type="text"
                    value={formatCurrency(lead.investimentoPretendido.valorMinimo)}
                    onChange={(e) => {
                      const valor = e.target.value.replace(/\D/g, '');
                      handleNestedFieldChange('investimentoPretendido', 'valorMinimo', Number(valor));
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="R$ 0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valor Máximo</label>
                  <input
                    type="text"
                    value={formatCurrency(lead.investimentoPretendido.valorMaximo)}
                    onChange={(e) => {
                      const valor = e.target.value.replace(/\D/g, '');
                      handleNestedFieldChange('investimentoPretendido', 'valorMaximo', Number(valor));
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="R$ 0"
                  />
                </div>
              </div>
            </div>

            {/* Perfil do Imóvel */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-600" />
                Perfil do Imóvel Desejado
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dormitórios</label>
                    <input
                      type="number"
                      min="0"
                      value={lead.perfilImovel.dormitorios}
                      onChange={(e) => handleNestedFieldChange('perfilImovel', 'dormitorios', Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Suítes</label>
                    <input
                      type="number"
                      min="0"
                      value={lead.perfilImovel.suites}
                      onChange={(e) => handleNestedFieldChange('perfilImovel', 'suites', Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vagas</label>
                    <input
                      type="number"
                      min="0"
                      value={lead.perfilImovel.vagas}
                      onChange={(e) => handleNestedFieldChange('perfilImovel', 'vagas', Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Localização Preferida</label>
                  <input
                    type="text"
                    value={lead.perfilImovel.localizacao}
                    onChange={(e) => handleNestedFieldChange('perfilImovel', 'localizacao', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="Bairro, cidade..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                  <textarea
                    value={lead.perfilImovel.observacoes || ''}
                    onChange={(e) => handleNestedFieldChange('perfilImovel', 'observacoes', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Preferências específicas do cliente..."
                  />
                </div>
              </div>
            </div>

            {/* Botão Imóveis Sugeridos */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Building className="w-5 h-5 text-purple-600" />
                    Imóveis Sugeridos
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Baseado no perfil de interesse do cliente
                  </p>
                </div>
                <button
                  onClick={() => setMostrarImoveisSugeridos(true)}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 font-medium"
                >
                  <Building className="w-4 h-4" />
                  Ver Sugestões
                </button>
              </div>
            </div>
          </div>

          {/* Coluna da Direita - Informações Rápidas */}
          <div className="space-y-6">
            
            {/* Score */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Score do Lead</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full" 
                    style={{ width: `${lead.score}%` }}
                  />
                </div>
                <span className="text-lg font-semibold text-gray-900">{lead.score}%</span>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {lead.tags?.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {tag}
                  </span>
                ))}
                <button className="px-3 py-1 border-2 border-dashed border-gray-300 text-gray-500 text-sm rounded-full hover:border-blue-300 hover:text-blue-600">
                  <Plus className="w-3 h-3 inline mr-1" />
                  Adicionar
                </button>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Ações Rápidas</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg border">
                  <Phone className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Ligar</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg border">
                  <MessageSquare className="w-4 h-4 text-green-600" />
                  <span className="text-sm">WhatsApp</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg border">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Enviar E-mail</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg border">
                  <CalendarPlus className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">Agendar Reunião</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Imóveis Sugeridos */}
      {mostrarImoveisSugeridos && (
        <ImoveisSugeridos
          perfilLead={{
            dormitorios: lead.perfilImovel.dormitorios,
            suites: lead.perfilImovel.suites,
            vagas: lead.perfilImovel.vagas,
            localizacao: lead.perfilImovel.localizacao,
            valorMinimo: lead.investimentoPretendido.valorMinimo,
            valorMaximo: lead.investimentoPretendido.valorMaximo
          }}
          onEnviarLead={(unidade) => {
            console.log('Enviando unidade para o lead:', unidade);
            alert(`Unidade ${unidade.numero} enviada para ${lead.nome} via WhatsApp!`);
            setMostrarImoveisSugeridos(false);
          }}
          onClose={() => setMostrarImoveisSugeridos(false)}
        />
      )}
    </div>
  );
};

export default LeadPage;