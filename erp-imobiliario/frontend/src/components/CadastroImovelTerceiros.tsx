import React, { useState, useRef } from 'react';
import { 
  Save, X, MapPin, Upload, Eye, EyeOff, 
  Home, Bed, Car, Camera, FileText, DollarSign,
  Plus, Trash2, Map, Calculator
} from 'lucide-react';
import { ImovelTerceiros } from '../types/imovelTerceiros';

interface CadastroImovelTerceirosProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (imovel: ImovelTerceiros) => void;
  imovelEdicao?: ImovelTerceiros;
}

const CadastroImovelTerceiros: React.FC<CadastroImovelTerceirosProps> = ({
  isOpen,
  onClose,
  onSave,
  imovelEdicao
}) => {
  const [step, setStep] = useState<'dados' | 'localizacao' | 'fotos' | 'proprietario'>('dados');
  const [formData, setFormData] = useState<Partial<ImovelTerceiros>>({
    nomeEmpreendimento: '',
    numeroUnidade: '',
    metragem: 0,
    caracteristicas: {
      mobilia: 'sem_mobilia',
      churrasqueira: false,
      garagem: false,
      quantidadeQuartos: 1,
      quantidadeSuites: 0,
      lavabo: false,
      outrasCaracteristicas: []
    },
    infraEmpreendimento: [],
    localizacao: {
      endereco: '',
      distanciaMarKm: undefined
    },
    valor: 0,
    detalhesNegociacao: {
      aceitaCarro: false,
      aceitaImovel: false,
      observacoes: ''
    },
    fotos: [],
    descritivo: '',
    proprietario: {
      id: '',
      nome: '',
      telefone: '',
      email: '',
      visivel: false
    },
    corretor: {
      id: 'current_user',
      nome: 'Usuário Atual'
    },
    dataCadastro: new Date().toISOString().split('T')[0],
    status: 'disponivel',
    tags: [],
    visualizacoes: 0,
    interessados: []
  });

  const [novaCaracteristica, setNovaCaracteristica] = useState('');
  const [novaInfra, setNovaInfra] = useState('');
  const [novaTag, setNovaTag] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Opções pré-definidas
  const opcoesInfra = [
    'Piscina', 'Academia', 'Salão de Festas', 'Playground', 'Quadra Esportiva',
    'SPA', 'Sauna', 'Coworking', 'Brinquedoteca', 'Pet Place', 'Bike Park',
    'Lavanderia', 'Portaria 24h', 'Segurança', 'Elevador', 'Gerador'
  ];

  const opcoesCaracteristicas = [
    'Varanda', 'Sacada', 'Terraço', 'Jardim', 'Quintal', 'Piscina Privativa',
    'Ar Condicionado', 'Aquecimento', 'Lareira', 'Closet', 'Despensa',
    'Escritório', 'Sala de TV', 'Dependência Empregada'
  ];

  const handleInputChange = (path: string, value: any) => {
    const keys = path.split('.');
    setFormData(prev => {
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in current)) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const adicionarItem = (lista: string, valor: string, novoItemSetter: React.Dispatch<React.SetStateAction<string>>) => {
    if (!valor.trim()) return;
    
    const keys = lista.split('.');
    setFormData(prev => {
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      const currentArray = current[keys[keys.length - 1]] || [];
      if (!currentArray.includes(valor.trim())) {
        current[keys[keys.length - 1]] = [...currentArray, valor.trim()];
      }
      
      return newData;
    });
    
    novoItemSetter('');
  };

  const removerItem = (lista: string, indice: number) => {
    const keys = lista.split('.');
    setFormData(prev => {
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      const currentArray = [...(current[keys[keys.length - 1]] || [])];
      currentArray.splice(indice, 1);
      current[keys[keys.length - 1]] = currentArray;
      
      return newData;
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setFormData(prev => ({
          ...prev,
          fotos: [...(prev.fotos || []), imageUrl]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const calcularDistanciaMar = async () => {
    if (!formData.localizacao?.endereco) {
      alert('Digite o endereço primeiro');
      return;
    }

    // Simulação - em produção usar API de geolocalização
    const distanciaSimulada = Math.random() * 10; // 0-10 km
    handleInputChange('localizacao.distanciaMarKm', Math.round(distanciaSimulada * 10) / 10);
    
    // Também simular coordenadas
    handleInputChange('localizacao.latitude', -27.5954 + (Math.random() - 0.5) * 0.1);
    handleInputChange('localizacao.longitude', -48.5480 + (Math.random() - 0.5) * 0.1);
  };

  const validarFormulario = (): boolean => {
    const erros = [];
    
    if (!formData.nomeEmpreendimento?.trim()) erros.push('Nome do empreendimento');
    if (!formData.numeroUnidade?.trim()) erros.push('Número da unidade');
    if (!formData.metragem || formData.metragem <= 0) erros.push('Metragem');
    if (!formData.localizacao?.endereco?.trim()) erros.push('Endereço');
    if (!formData.valor || formData.valor <= 0) erros.push('Valor');
    if (!formData.proprietario?.nome?.trim()) erros.push('Nome do proprietário');
    if (!formData.proprietario?.telefone?.trim()) erros.push('Telefone do proprietário');

    if (erros.length > 0) {
      alert(`Campos obrigatórios faltando: ${erros.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validarFormulario()) return;

    const imovel: ImovelTerceiros = {
      id: imovelEdicao?.id || `imovel_${Date.now()}`,
      ...formData as ImovelTerceiros
    };

    onSave(imovel);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Home className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {imovelEdicao ? 'Editar' : 'Cadastrar'} Imóvel de Terceiros
                </h2>
                <p className="text-sm text-gray-600">Cadastro completo com controle de privacidade</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Steps */}
          <div className="flex items-center justify-center mt-6 space-x-4">
            {[
              { key: 'dados', label: 'Dados Básicos', icon: Home },
              { key: 'localizacao', label: 'Localização', icon: MapPin },
              { key: 'fotos', label: 'Fotos & Descrição', icon: Camera },
              { key: 'proprietario', label: 'Proprietário', icon: FileText }
            ].map((stepItem, index) => {
              const Icon = stepItem.icon;
              const isActive = step === stepItem.key;
              
              return (
                <div key={stepItem.key} className="flex items-center">
                  <button
                    onClick={() => setStep(stepItem.key as any)}
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      isActive ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {stepItem.label}
                  </span>
                  {index < 3 && <div className="w-8 h-1 mx-4 bg-gray-200 rounded" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {step === 'dados' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Empreendimento *
                  </label>
                  <input
                    type="text"
                    value={formData.nomeEmpreendimento || ''}
                    onChange={(e) => handleInputChange('nomeEmpreendimento', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Ex: Residencial Solar das Flores"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número da Unidade *
                  </label>
                  <input
                    type="text"
                    value={formData.numeroUnidade || ''}
                    onChange={(e) => handleInputChange('numeroUnidade', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Ex: 801, Torre A - 1504"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Metragem (m²) *
                  </label>
                  <input
                    type="number"
                    value={formData.metragem || ''}
                    onChange={(e) => handleInputChange('metragem', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Ex: 85"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor (R$) *
                  </label>
                  <input
                    type="number"
                    value={formData.valor || ''}
                    onChange={(e) => handleInputChange('valor', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Ex: 450000"
                    min="1"
                  />
                </div>
              </div>

              {/* Características */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Características do Imóvel</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobília</label>
                    <select
                      value={formData.caracteristicas?.mobilia || 'sem_mobilia'}
                      onChange={(e) => handleInputChange('caracteristicas.mobilia', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="sem_mobilia">Sem mobília</option>
                      <option value="parcialmente_mobiliado">Parcialmente mobiliado</option>
                      <option value="totalmente_mobiliado">100% mobiliado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quartos</label>
                    <input
                      type="number"
                      value={formData.caracteristicas?.quantidadeQuartos || 1}
                      onChange={(e) => handleInputChange('caracteristicas.quantidadeQuartos', parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      min="1"
                      max="10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Suítes</label>
                    <input
                      type="number"
                      value={formData.caracteristicas?.quantidadeSuites || 0}
                      onChange={(e) => handleInputChange('caracteristicas.quantidadeSuites', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      min="0"
                      max="5"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.caracteristicas?.churrasqueira || false}
                      onChange={(e) => handleInputChange('caracteristicas.churrasqueira', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">Churrasqueira</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.caracteristicas?.garagem || false}
                      onChange={(e) => handleInputChange('caracteristicas.garagem', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">Garagem</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.caracteristicas?.lavabo || false}
                      onChange={(e) => handleInputChange('caracteristicas.lavabo', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">Lavabo</span>
                  </label>
                </div>

                {/* Outras características */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Outras Características
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={novaCaracteristica}
                      onChange={(e) => setNovaCaracteristica(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Digite uma característica"
                      onKeyPress={(e) => e.key === 'Enter' && adicionarItem('caracteristicas.outrasCaracteristicas', novaCaracteristica, setNovaCaracteristica)}
                    />
                    <button
                      onClick={() => adicionarItem('caracteristicas.outrasCaracteristicas', novaCaracteristica, setNovaCaracteristica)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    {opcoesCaracteristicas.map(opcao => (
                      <button
                        key={opcao}
                        onClick={() => adicionarItem('caracteristicas.outrasCaracteristicas', opcao, setNovaCaracteristica)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                      >
                        + {opcao}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(formData.caracteristicas?.outrasCaracteristicas || []).map((caracteristica, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {caracteristica}
                        <button
                          onClick={() => removerItem('caracteristicas.outrasCaracteristicas', index)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Infraestrutura */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Infraestrutura do Empreendimento</h3>
                
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={novaInfra}
                    onChange={(e) => setNovaInfra(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Digite um item de infraestrutura"
                    onKeyPress={(e) => e.key === 'Enter' && adicionarItem('infraEmpreendimento', novaInfra, setNovaInfra)}
                  />
                  <button
                    onClick={() => adicionarItem('infraEmpreendimento', novaInfra, setNovaInfra)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  {opcoesInfra.map(opcao => (
                    <button
                      key={opcao}
                      onClick={() => adicionarItem('infraEmpreendimento', opcao, setNovaInfra)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                    >
                      + {opcao}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {(formData.infraEmpreendimento || []).map((infra, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {infra}
                      <button
                        onClick={() => removerItem('infraEmpreendimento', index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Detalhes de Negociação */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Detalhes de Negociação</h3>
                
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.detalhesNegociacao?.aceitaCarro || false}
                      onChange={(e) => handleInputChange('detalhesNegociacao.aceitaCarro', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">Aceita carro na negociação</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.detalhesNegociacao?.aceitaImovel || false}
                      onChange={(e) => handleInputChange('detalhesNegociacao.aceitaImovel', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">Aceita imóvel na negociação</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações sobre Negociação
                  </label>
                  <textarea
                    value={formData.detalhesNegociacao?.observacoes || ''}
                    onChange={(e) => handleInputChange('detalhesNegociacao.observacoes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    rows={3}
                    placeholder="Ex: Proprietário flexível no preço, aceita parcelamento direto..."
                  />
                </div>
              </div>
            </div>
          )}

          {step === 'localizacao' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço Completo *
                </label>
                <input
                  type="text"
                  value={formData.localizacao?.endereco || ''}
                  onChange={(e) => handleInputChange('localizacao.endereco', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Ex: Rua das Flores, 123, Centro, Florianópolis - SC"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={calcularDistanciaMar}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Calculator className="w-4 h-4" />
                  Calcular Distância do Mar
                </button>
                
                <button
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Map className="w-4 h-4" />
                  Abrir Mapa
                </button>
              </div>

              {formData.localizacao?.distanciaMarKm !== undefined && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">
                      Distância do mar: {formData.localizacao.distanciaMarKm} km
                    </span>
                  </div>
                  {formData.localizacao.latitude && formData.localizacao.longitude && (
                    <div className="text-sm text-blue-700 mt-1">
                      Coordenadas: {formData.localizacao.latitude.toFixed(6)}, {formData.localizacao.longitude.toFixed(6)}
                    </div>
                  )}
                </div>
              )}

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Simulador de Mapa</h4>
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <MapPin className="w-8 h-8 mx-auto mb-2" />
                    <p>Mapa interativo seria exibido aqui</p>
                    <p className="text-sm">Integração com Google Maps ou similar</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'fotos' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fotos do Imóvel
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Adicione fotos do imóvel</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Selecionar Fotos
                  </button>
                </div>

                {(formData.fotos || []).length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {(formData.fotos || []).map((foto, index) => (
                      <div key={index} className="relative">
                        <img
                          src={foto}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <button
                          onClick={() => {
                            const novasFotos = [...(formData.fotos || [])];
                            novasFotos.splice(index, 1);
                            handleInputChange('fotos', novasFotos);
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição Detalhada do Imóvel
                </label>
                <textarea
                  value={formData.descritivo || ''}
                  onChange={(e) => handleInputChange('descritivo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  rows={6}
                  placeholder="Descreva detalhadamente o imóvel, suas características, diferenciais, estado de conservação, vista, orientação solar, etc..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={novaTag}
                    onChange={(e) => setNovaTag(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Ex: vista mar, alto padrão, novo"
                    onKeyPress={(e) => e.key === 'Enter' && adicionarItem('tags', novaTag, setNovaTag)}
                  />
                  <button
                    onClick={() => adicionarItem('tags', novaTag, setNovaTag)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(formData.tags || []).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      #{tag}
                      <button
                        onClick={() => removerItem('tags', index)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 'proprietario' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">⚠️ Controle de Privacidade</h4>
                <p className="text-sm text-yellow-800">
                  Os dados do proprietário ficarão visíveis apenas para você por padrão. 
                  Você pode escolher torná-los visíveis para outros corretores da equipe.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Proprietário *
                  </label>
                  <input
                    type="text"
                    value={formData.proprietario?.nome || ''}
                    onChange={(e) => handleInputChange('proprietario.nome', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Nome completo do proprietário"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    value={formData.proprietario?.telefone || ''}
                    onChange={(e) => handleInputChange('proprietario.telefone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="(48) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.proprietario?.email || ''}
                    onChange={(e) => handleInputChange('proprietario.email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleInputChange('proprietario.visivel', !formData.proprietario?.visivel)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      formData.proprietario?.visivel 
                        ? 'bg-green-50 border-green-300 text-green-700' 
                        : 'bg-gray-50 border-gray-300 text-gray-700'
                    }`}
                  >
                    {formData.proprietario?.visivel ? (
                      <>
                        <Eye className="w-4 h-4" />
                        Dados Visíveis
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4" />
                        Dados Privados
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Status de Privacidade</h4>
                <div className="text-sm text-blue-800">
                  {formData.proprietario?.visivel ? (
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>
                        Os dados do proprietário serão <strong>visíveis para toda a equipe</strong>. 
                        Outros corretores poderão ver nome, telefone e email.
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <EyeOff className="w-4 h-4" />
                      <span>
                        Os dados do proprietário são <strong>privados</strong>. 
                        Apenas você terá acesso às informações de contato.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status do Imóvel
                </label>
                <select
                  value={formData.status || 'disponivel'}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="disponivel">Disponível</option>
                  <option value="negociacao">Em Negociação</option>
                  <option value="reservado">Reservado</option>
                  <option value="vendido">Vendido</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              * Campos obrigatórios
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Salvar Imóvel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroImovelTerceiros;