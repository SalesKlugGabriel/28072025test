import React, { useState } from 'react';
import { 
  Plus, Send, MessageSquare, Phone, Mail, TrendingUp, 
  Activity, Calendar, ThumbsUp, ThumbsDown, User, 
  BarChart3, Target, Zap, Users, Hash, FileText,
  ExternalLink, Eye, Edit, Trash2, Filter
} from 'lucide-react';

interface ProspeccaoItem {
  id: string;
  plataforma: string;
  quantidade: number;
  data: string;
  usuario: string;
  status: 'ativa' | 'pausada' | 'concluida';
}

interface RespostaItem {
  id: string;
  plataforma: string;
  mensagemEnviada: string;
  mensagemRecebida: string;
  sentimento: 'positivo' | 'negativo';
  data: string;
  usuario: string;
  leadGerado: boolean;
}

const Prospeccoes: React.FC = () => {
  const [abaSelecionada, setAbaSelecionada] = useState<'prospeccoes' | 'respostas'>('prospeccoes');
  const [modalProspeccao, setModalProspeccao] = useState(false);
  const [modalResposta, setModalResposta] = useState(false);
  const [modalNovoLead, setModalNovoLead] = useState(false);
  const [plataformaSelecionada, setPlataformaSelecionada] = useState('');
  
  // Estados para formulários
  const [novaProspeccao, setNovaProspeccao] = useState({
    plataforma: '',
    quantidade: 0,
    observacoes: ''
  });
  
  const [novaResposta, setNovaResposta] = useState({
    plataforma: '',
    mensagemEnviada: '',
    mensagemRecebida: '',
    sentimento: 'positivo' as 'positivo' | 'negativo'
  });

  // Dados mock
  const plataformas = [
    { id: 'olx', nome: 'OLX', icon: '🏠', cor: 'bg-green-500' },
    { id: 'webmotors', nome: 'Webmotors', icon: '🚗', cor: 'bg-blue-500' },
    { id: 'mercadolivre', nome: 'Mercado Livre', icon: '🛒', cor: 'bg-yellow-500' },
    { id: 'whatsapp', nome: 'WhatsApp', icon: '💬', cor: 'bg-green-600' },
    { id: 'facebook', nome: 'Facebook', icon: '📘', cor: 'bg-blue-600' },
    { id: 'instagram', nome: 'Instagram', icon: '📸', cor: 'bg-pink-500' },
    { id: 'linkedin', nome: 'LinkedIn', icon: '💼', cor: 'bg-blue-700' },
    { id: 'outros', nome: 'Outros', icon: '🌐', cor: 'bg-gray-500' }
  ];

  const [prospeccoes, setProspeccoes] = useState<ProspeccaoItem[]>([
    {
      id: '1',
      plataforma: 'olx',
      quantidade: 15,
      data: '2025-01-18',
      usuario: 'João Silva',
      status: 'ativa'
    },
    {
      id: '2',
      plataforma: 'whatsapp',
      quantidade: 8,
      data: '2025-01-18',
      usuario: 'Maria Santos',
      status: 'ativa'
    }
  ]);

  const [respostas, setRespostas] = useState<RespostaItem[]>([
    {
      id: '1',
      plataforma: 'olx',
      mensagemEnviada: 'Olá! Vi seu anúncio no OLX. Tenho apartamentos na região que podem interessar.',
      mensagemRecebida: 'Interessante! Pode me enviar mais detalhes?',
      sentimento: 'positivo',
      data: '2025-01-18',
      usuario: 'João Silva',
      leadGerado: false
    },
    {
      id: '2',
      plataforma: 'whatsapp',
      mensagemEnviada: 'Boa tarde! Estou com algumas opções de imóveis que se encaixam no seu perfil.',
      mensagemRecebida: 'Não tenho interesse no momento, obrigado.',
      sentimento: 'negativo',
      data: '2025-01-18',
      usuario: 'Maria Santos',
      leadGerado: false
    }
  ]);

  const getPlataformaInfo = (id: string) => {
    return plataformas.find(p => p.id === id) || plataformas[plataformas.length - 1];
  };

  const handleAdicionarProspeccao = () => {
    if (!novaProspeccao.plataforma || novaProspeccao.quantidade <= 0) return;

    const nova: ProspeccaoItem = {
      id: Date.now().toString(),
      plataforma: novaProspeccao.plataforma,
      quantidade: novaProspeccao.quantidade,
      data: new Date().toISOString().split('T')[0],
      usuario: 'Usuário Atual',
      status: 'ativa'
    };

    setProspeccoes(prev => [nova, ...prev]);
    setNovaProspeccao({ plataforma: '', quantidade: 0, observacoes: '' });
    setModalProspeccao(false);
  };

  const handleAdicionarResposta = () => {
    if (!novaResposta.plataforma || !novaResposta.mensagemEnviada || !novaResposta.mensagemRecebida) return;

    const nova: RespostaItem = {
      id: Date.now().toString(),
      plataforma: novaResposta.plataforma,
      mensagemEnviada: novaResposta.mensagemEnviada,
      mensagemRecebida: novaResposta.mensagemRecebida,
      sentimento: novaResposta.sentimento,
      data: new Date().toISOString().split('T')[0],
      usuario: 'Usuário Atual',
      leadGerado: false
    };

    setRespostas(prev => [nova, ...prev]);
    setNovaResposta({ plataforma: '', mensagemEnviada: '', mensagemRecebida: '', sentimento: 'positivo' });
    setModalResposta(false);

    // Se a resposta for positiva, mostrar modal para adicionar lead
    if (nova.sentimento === 'positivo') {
      setPlataformaSelecionada(nova.plataforma);
      setModalNovoLead(true);
    }
  };

  const handleGerarLead = (respostaId: string) => {
    // Marcar resposta como lead gerado
    setRespostas(prev => 
      prev.map(r => r.id === respostaId ? { ...r, leadGerado: true } : r)
    );
    
    // Abrir modal de novo lead (simulado)
    alert('Funcionalidade de cadastro de lead será integrada aqui!');
    setModalNovoLead(false);
  };

  // Estatísticas
  const totalProspeccoes = prospeccoes.reduce((acc, p) => acc + p.quantidade, 0);
  const respostasPositivas = respostas.filter(r => r.sentimento === 'positivo').length;
  const leadsGerados = respostas.filter(r => r.leadGerado).length;
  const taxaConversao = respostas.length > 0 ? ((leadsGerados / respostas.length) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Prospecções</h1>
              <p className="text-sm text-gray-600">Gestão de prospecções ativas e respostas recebidas</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setModalResposta(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Nova Resposta
              </button>
              <button
                onClick={() => setModalProspeccao(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nova Prospecção
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Send className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Enviado</p>
                <p className="text-2xl font-bold text-gray-900">{totalProspeccoes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Respostas</p>
                <p className="text-2xl font-bold text-gray-900">{respostas.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ThumbsUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Positivas</p>
                <p className="text-2xl font-bold text-gray-900">{respostasPositivas}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Target className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Taxa Conversão</p>
                <p className="text-2xl font-bold text-gray-900">{taxaConversao}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navegação por Abas */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setAbaSelecionada('prospeccoes')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  abaSelecionada === 'prospeccoes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Prospecções Ativas
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {prospeccoes.length}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setAbaSelecionada('respostas')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  abaSelecionada === 'respostas'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Respostas Recebidas
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {respostas.length}
                  </span>
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Aba Prospecções */}
            {abaSelecionada === 'prospeccoes' && (
              <div className="space-y-4">
                {prospeccoes.length === 0 ? (
                  <div className="text-center py-12">
                    <Send className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma prospecção ativa</h3>
                    <p className="text-gray-600 mb-4">Comece adicionando uma nova prospecção</p>
                    <button
                      onClick={() => setModalProspeccao(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Adicionar Prospecção
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Grid de Plataformas */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
                      {plataformas.map((plataforma) => {
                        const prospeccoesPlatforma = prospeccoes.filter(p => p.plataforma === plataforma.id);
                        const totalPlataforma = prospeccoesPlatforma.reduce((acc, p) => acc + p.quantidade, 0);
                        
                        return (
                          <div key={plataforma.id} className="bg-gray-50 rounded-lg p-4 text-center">
                            <div className={`w-12 h-12 ${plataforma.cor} rounded-full flex items-center justify-center mx-auto mb-2 text-white text-lg`}>
                              {plataforma.icon}
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 mb-1">{plataforma.nome}</h3>
                            <p className="text-lg font-bold text-gray-900">{totalPlataforma}</p>
                            <p className="text-xs text-gray-500">{prospeccoesPlatforma.length} ativas</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Lista de Prospecções */}
                    <div className="space-y-3">
                      {prospeccoes.map((prospeccao) => {
                        const plataforma = getPlataformaInfo(prospeccao.plataforma);
                        return (
                          <div key={prospeccao.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 ${plataforma.cor} rounded-full flex items-center justify-center text-white`}>
                                {plataforma.icon}
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{plataforma.nome}</h3>
                                <p className="text-sm text-gray-600">{prospeccao.quantidade} mensagens enviadas</p>
                                <p className="text-xs text-gray-500">{prospeccao.data} • {prospeccao.usuario}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                prospeccao.status === 'ativa' 
                                  ? 'bg-green-100 text-green-800'
                                  : prospeccao.status === 'pausada'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {prospeccao.status}
                              </span>
                              
                              <button className="p-2 hover:bg-gray-200 rounded-lg">
                                <Eye className="w-4 h-4 text-gray-500" />
                              </button>
                              <button className="p-2 hover:bg-gray-200 rounded-lg">
                                <Edit className="w-4 h-4 text-gray-500" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Aba Respostas */}
            {abaSelecionada === 'respostas' && (
              <div className="space-y-4">
                {respostas.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma resposta registrada</h3>
                    <p className="text-gray-600 mb-4">As respostas recebidas aparecerão aqui</p>
                    <button
                      onClick={() => setModalResposta(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Registrar Resposta
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {respostas.map((resposta) => {
                      const plataforma = getPlataformaInfo(resposta.plataforma);
                      return (
                        <div key={resposta.id} className="bg-white border rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 ${plataforma.cor} rounded-full flex items-center justify-center text-white text-sm`}>
                                {plataforma.icon}
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{plataforma.nome}</h3>
                                <p className="text-sm text-gray-500">{resposta.data} • {resposta.usuario}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {resposta.sentimento === 'positivo' ? (
                                <ThumbsUp className="w-5 h-5 text-green-600" />
                              ) : (
                                <ThumbsDown className="w-5 h-5 text-red-600" />
                              )}
                              
                              {resposta.leadGerado && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                                  Lead Gerado
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Mensagem Enviada:</p>
                              <p className="text-sm text-gray-800 bg-blue-50 p-3 rounded-lg">{resposta.mensagemEnviada}</p>
                            </div>
                            
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Mensagem Recebida:</p>
                              <p className={`text-sm text-gray-800 p-3 rounded-lg ${
                                resposta.sentimento === 'positivo' ? 'bg-green-50' : 'bg-red-50'
                              }`}>
                                {resposta.mensagemRecebida}
                              </p>
                            </div>
                          </div>

                          {resposta.sentimento === 'positivo' && !resposta.leadGerado && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <button
                                onClick={() => handleGerarLead(resposta.id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                              >
                                <User className="w-4 h-4" />
                                Adicionar como Lead
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Nova Prospecção */}
      {modalProspeccao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Nova Prospecção</h3>
              <button
                onClick={() => setModalProspeccao(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plataforma</label>
                <select
                  value={novaProspeccao.plataforma}
                  onChange={(e) => setNovaProspeccao({...novaProspeccao, plataforma: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione uma plataforma</option>
                  {plataformas.map(plataforma => (
                    <option key={plataforma.id} value={plataforma.id}>
                      {plataforma.icon} {plataforma.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade</label>
                <input
                  type="number"
                  min="1"
                  value={novaProspeccao.quantidade}
                  onChange={(e) => setNovaProspeccao({...novaProspeccao, quantidade: parseInt(e.target.value) || 0})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Quantas mensagens foram enviadas?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observações (opcional)</label>
                <textarea
                  value={novaProspeccao.observacoes}
                  onChange={(e) => setNovaProspeccao({...novaProspeccao, observacoes: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Detalhes sobre esta prospecção..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModalProspeccao(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleAdicionarProspeccao}
                disabled={!novaProspeccao.plataforma || novaProspeccao.quantidade <= 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nova Resposta */}
      {modalResposta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Registrar Resposta</h3>
              <button
                onClick={() => setModalResposta(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plataforma</label>
                <select
                  value={novaResposta.plataforma}
                  onChange={(e) => setNovaResposta({...novaResposta, plataforma: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione uma plataforma</option>
                  {plataformas.map(plataforma => (
                    <option key={plataforma.id} value={plataforma.id}>
                      {plataforma.icon} {plataforma.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem Enviada</label>
                <textarea
                  value={novaResposta.mensagemEnviada}
                  onChange={(e) => setNovaResposta({...novaResposta, mensagemEnviada: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Digite a mensagem que você enviou..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem Recebida</label>
                <textarea
                  value={novaResposta.mensagemRecebida}
                  onChange={(e) => setNovaResposta({...novaResposta, mensagemRecebida: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Digite a resposta recebida..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sentimento</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="positivo"
                      checked={novaResposta.sentimento === 'positivo'}
                      onChange={(e) => setNovaResposta({...novaResposta, sentimento: e.target.value as 'positivo' | 'negativo'})}
                      className="mr-2"
                    />
                    <ThumbsUp className="w-4 h-4 text-green-600 mr-1" />
                    Positivo
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="negativo"
                      checked={novaResposta.sentimento === 'negativo'}
                      onChange={(e) => setNovaResposta({...novaResposta, sentimento: e.target.value as 'positivo' | 'negativo'})}
                      className="mr-2"
                    />
                    <ThumbsDown className="w-4 h-4 text-red-600 mr-1" />
                    Negativo
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModalResposta(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleAdicionarResposta}
                disabled={!novaResposta.plataforma || !novaResposta.mensagemEnviada || !novaResposta.mensagemRecebida}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Registrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Adicionar Lead */}
      {modalNovoLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Adicionar como Lead?</h3>
              <p className="text-gray-600 mb-6">
                Esta resposta parece positiva. Deseja cadastrar um novo lead baseado nesta conversa?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setModalNovoLead(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Não
                </button>
                <button
                  onClick={() => {
                    alert('Redirecionando para cadastro de lead...');
                    setModalNovoLead(false);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Sim
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prospeccoes;