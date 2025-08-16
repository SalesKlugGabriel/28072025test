import React, { useState } from 'react';
import { 
  CurrencyDollarIcon,
  HomeIcon,
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  DocumentTextIcon,
  BanknotesIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

interface SalesProfileProps {
  customerData: any;
  onUpdate: (field: string, value: any) => void;
}

interface InvestmentProfile {
  minValue: number;
  maxValue: number;
  paymentMethod: 'cash' | 'financing' | 'mixed';
  downPayment: number;
  monthlyIncome: number;
  hasProperty: boolean;
  propertyForTrade: boolean;
}

interface PropertyPreferences {
  type: string[];
  bedrooms: number[];
  bathrooms: number[];
  parkingSpaces: number[];
  amenities: string[];
  moveInDate: string;
  urgency: 'low' | 'medium' | 'high';
}

export const SalesProfile: React.FC<SalesProfileProps> = ({
  customerData,
  onUpdate
}) => {
  const [activeSection, setActiveSection] = useState<'investment' | 'preferences' | 'financing'>('investment');
  const [isEditing, setIsEditing] = useState(false);
  
  const [investmentProfile, setInvestmentProfile] = useState<InvestmentProfile>({
    minValue: customerData.investmentRange?.min || 0,
    maxValue: customerData.investmentRange?.max || 0,
    paymentMethod: 'financing',
    downPayment: 30,
    monthlyIncome: 0,
    hasProperty: false,
    propertyForTrade: false
  });

  const [propertyPreferences, setPropertyPreferences] = useState<PropertyPreferences>({
    type: [],
    bedrooms: [],
    bathrooms: [],
    parkingSpaces: [],
    amenities: [],
    moveInDate: '',
    urgency: 'medium'
  });

  const handleSaveProfile = () => {
    onUpdate('investmentRange', {
      min: investmentProfile.minValue,
      max: investmentProfile.maxValue
    });
    onUpdate('investmentProfile', investmentProfile);
    onUpdate('propertyPreferences', propertyPreferences);
    setIsEditing(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value);
  };

  const propertyTypes = [
    { id: 'apartment', label: 'Apartamento', icon: BuildingOffice2Icon },
    { id: 'house', label: 'Casa', icon: HomeIcon },
    { id: 'penthouse', label: 'Cobertura', icon: BuildingOffice2Icon },
    { id: 'studio', label: 'Studio', icon: BuildingOffice2Icon },
    { id: 'duplex', label: 'Duplex', icon: HomeIcon }
  ];

  const amenitiesList = [
    'Piscina', 'Academia', 'Playground', 'Salão de Festas', 'Churrasqueira',
    'Portaria 24h', 'Garagem Coberta', 'Elevador', 'Área Gourmet', 'Jardim',
    'Quadra Esportiva', 'Sauna', 'Bicicletário', 'Pet Place', 'Coworking'
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Baixa - Procurando com calma', color: 'text-green-600 bg-green-100' },
    { value: 'medium', label: 'Média - Interesse definido', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'high', label: 'Alta - Precisa decidir rápido', color: 'text-red-600 bg-red-100' }
  ];

  const sections = [
    {
      id: 'investment' as const,
      name: 'Investimento',
      icon: CurrencyDollarIcon,
      description: 'Faixa de valores e forma de pagamento'
    },
    {
      id: 'preferences' as const,
      name: 'Preferências',
      icon: HomeIcon,
      description: 'Tipo de imóvel e características'
    },
    {
      id: 'financing' as const,
      name: 'Financiamento',
      icon: BanknotesIcon,
      description: 'Informações financeiras e renda'
    }
  ];

  const renderInvestmentSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor Mínimo
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">R$</span>
            </div>
            <input
              type="number"
              value={investmentProfile.minValue}
              onChange={(e) => setInvestmentProfile(prev => ({ ...prev, minValue: Number(e.target.value) }))}
              disabled={!isEditing}
              className="block w-full pl-10 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              placeholder="300000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor Máximo
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">R$</span>
            </div>
            <input
              type="number"
              value={investmentProfile.maxValue}
              onChange={(e) => setInvestmentProfile(prev => ({ ...prev, maxValue: Number(e.target.value) }))}
              disabled={!isEditing}
              className="block w-full pl-10 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              placeholder="500000"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Forma de Pagamento
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: 'cash', label: 'À vista' },
            { value: 'financing', label: 'Financiamento' },
            { value: 'mixed', label: 'Misto' }
          ].map((option) => (
            <label key={option.value} className="relative">
              <input
                type="radio"
                name="paymentMethod"
                value={option.value}
                checked={investmentProfile.paymentMethod === option.value}
                onChange={(e) => setInvestmentProfile(prev => ({ ...prev, paymentMethod: e.target.value as any }))}
                disabled={!isEditing}
                className="sr-only"
              />
              <div className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                investmentProfile.paymentMethod === option.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              } ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}>
                <div className="text-center">
                  <div className="font-medium">{option.label}</div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Entrada (%)
          </label>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={investmentProfile.downPayment}
            onChange={(e) => setInvestmentProfile(prev => ({ ...prev, downPayment: Number(e.target.value) }))}
            disabled={!isEditing}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-60"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>10%</span>
            <span className="font-medium">{investmentProfile.downPayment}%</span>
            <span>100%</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Renda Mensal
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">R$</span>
            </div>
            <input
              type="number"
              value={investmentProfile.monthlyIncome}
              onChange={(e) => setInvestmentProfile(prev => ({ ...prev, monthlyIncome: Number(e.target.value) }))}
              disabled={!isEditing}
              className="block w-full pl-10 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              placeholder="15000"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={investmentProfile.hasProperty}
            onChange={(e) => setInvestmentProfile(prev => ({ ...prev, hasProperty: e.target.checked }))}
            disabled={!isEditing}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-60"
          />
          <span className="ml-2 text-sm text-gray-700">Possui imóvel atualmente</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={investmentProfile.propertyForTrade}
            onChange={(e) => setInvestmentProfile(prev => ({ ...prev, propertyForTrade: e.target.checked }))}
            disabled={!isEditing}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-60"
          />
          <span className="ml-2 text-sm text-gray-700">Interesse em permuta</span>
        </label>
      </div>
    </div>
  );

  const renderPreferencesSection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Tipo de Imóvel
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {propertyTypes.map((type) => (
            <label key={type.id} className="relative">
              <input
                type="checkbox"
                checked={propertyPreferences.type.includes(type.id)}
                onChange={(e) => {
                  const newTypes = e.target.checked
                    ? [...propertyPreferences.type, type.id]
                    : propertyPreferences.type.filter(t => t !== type.id);
                  setPropertyPreferences(prev => ({ ...prev, type: newTypes }));
                }}
                disabled={!isEditing}
                className="sr-only"
              />
              <div className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                propertyPreferences.type.includes(type.id)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              } ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}>
                <div className="text-center">
                  <type.icon className="w-6 h-6 mx-auto mb-1" />
                  <div className="text-sm font-medium">{type.label}</div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quartos
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <label key={num} className="relative">
                <input
                  type="checkbox"
                  checked={propertyPreferences.bedrooms.includes(num)}
                  onChange={(e) => {
                    const newBedrooms = e.target.checked
                      ? [...propertyPreferences.bedrooms, num]
                      : propertyPreferences.bedrooms.filter(b => b !== num);
                    setPropertyPreferences(prev => ({ ...prev, bedrooms: newBedrooms }));
                  }}
                  disabled={!isEditing}
                  className="sr-only"
                />
                <div className={`w-10 h-10 border rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                  propertyPreferences.bedrooms.includes(num)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                } ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  <span className="text-sm font-medium">{num}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Banheiros
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((num) => (
              <label key={num} className="relative">
                <input
                  type="checkbox"
                  checked={propertyPreferences.bathrooms.includes(num)}
                  onChange={(e) => {
                    const newBathrooms = e.target.checked
                      ? [...propertyPreferences.bathrooms, num]
                      : propertyPreferences.bathrooms.filter(b => b !== num);
                    setPropertyPreferences(prev => ({ ...prev, bathrooms: newBathrooms }));
                  }}
                  disabled={!isEditing}
                  className="sr-only"
                />
                <div className={`w-10 h-10 border rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                  propertyPreferences.bathrooms.includes(num)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                } ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  <span className="text-sm font-medium">{num}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vagas
          </label>
          <div className="flex space-x-2">
            {[0, 1, 2, 3, 4].map((num) => (
              <label key={num} className="relative">
                <input
                  type="checkbox"
                  checked={propertyPreferences.parkingSpaces.includes(num)}
                  onChange={(e) => {
                    const newSpaces = e.target.checked
                      ? [...propertyPreferences.parkingSpaces, num]
                      : propertyPreferences.parkingSpaces.filter(s => s !== num);
                    setPropertyPreferences(prev => ({ ...prev, parkingSpaces: newSpaces }));
                  }}
                  disabled={!isEditing}
                  className="sr-only"
                />
                <div className={`w-10 h-10 border rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                  propertyPreferences.parkingSpaces.includes(num)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                } ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  <span className="text-sm font-medium">{num}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Comodidades Desejadas
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {amenitiesList.map((amenity) => (
            <label key={amenity} className="flex items-center">
              <input
                type="checkbox"
                checked={propertyPreferences.amenities.includes(amenity)}
                onChange={(e) => {
                  const newAmenities = e.target.checked
                    ? [...propertyPreferences.amenities, amenity]
                    : propertyPreferences.amenities.filter(a => a !== amenity);
                  setPropertyPreferences(prev => ({ ...prev, amenities: newAmenities }));
                }}
                disabled={!isEditing}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-60"
              />
              <span className="ml-2 text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Desejada para Mudança
          </label>
          <input
            type="date"
            value={propertyPreferences.moveInDate}
            onChange={(e) => setPropertyPreferences(prev => ({ ...prev, moveInDate: e.target.value }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Urgência
          </label>
          <select
            value={propertyPreferences.urgency}
            onChange={(e) => setPropertyPreferences(prev => ({ ...prev, urgency: e.target.value as any }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          >
            {urgencyLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderFinancingSection = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Capacidade de Financiamento</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-700">Renda mensal:</span>
            <span className="font-medium text-blue-900">
              {formatCurrency(investmentProfile.monthlyIncome)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Capacidade estimada (30% da renda):</span>
            <span className="font-medium text-blue-900">
              {formatCurrency(investmentProfile.monthlyIncome * 0.3)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Valor financiável estimado:</span>
            <span className="font-medium text-blue-900">
              {formatCurrency(investmentProfile.monthlyIncome * 0.3 * 420)} {/* 420 = fator 35 anos */}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Valor do Investimento</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Faixa de interesse:</span>
              <span className="font-medium">
                {formatCurrency(investmentProfile.minValue)} - {formatCurrency(investmentProfile.maxValue)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Entrada ({investmentProfile.downPayment}%):</span>
              <span className="font-medium">
                {formatCurrency((investmentProfile.minValue + investmentProfile.maxValue) / 2 * investmentProfile.downPayment / 100)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Financiamento:</span>
              <span className="font-medium">
                {formatCurrency((investmentProfile.minValue + investmentProfile.maxValue) / 2 * (100 - investmentProfile.downPayment) / 100)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Situação Atual</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <CheckCircleIcon className={`w-4 h-4 mr-2 ${investmentProfile.hasProperty ? 'text-green-600' : 'text-gray-400'}`} />
              <span className={investmentProfile.hasProperty ? 'text-green-600' : 'text-gray-600'}>
                {investmentProfile.hasProperty ? 'Possui imóvel' : 'Não possui imóvel'}
              </span>
            </div>
            <div className="flex items-center">
              <CheckCircleIcon className={`w-4 h-4 mr-2 ${investmentProfile.propertyForTrade ? 'text-green-600' : 'text-gray-400'}`} />
              <span className={investmentProfile.propertyForTrade ? 'text-green-600' : 'text-gray-600'}>
                {investmentProfile.propertyForTrade ? 'Aceita permuta' : 'Não aceita permuta'}
              </span>
            </div>
            <div className="flex items-center">
              <CheckCircleIcon className={`w-4 h-4 mr-2 ${investmentProfile.paymentMethod === 'cash' ? 'text-green-600' : 'text-blue-600'}`} />
              <span className={investmentProfile.paymentMethod === 'cash' ? 'text-green-600' : 'text-blue-600'}>
                {investmentProfile.paymentMethod === 'cash' ? 'Pagamento à vista' : 
                 investmentProfile.paymentMethod === 'financing' ? 'Financiamento bancário' : 'Pagamento misto'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Perfil de Venda
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Configure as preferências e informações financeiras do cliente
            </p>
          </div>
          
          <button
            onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {isEditing ? (
              <>
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                Salvar Perfil
              </>
            ) : (
              <>
                <PencilIcon className="w-4 h-4 mr-2" />
                Editar Perfil
              </>
            )}
          </button>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
        <div className="flex space-x-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <section.icon className="w-4 h-4" />
              <span>{section.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Section Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeSection === 'investment' && renderInvestmentSection()}
        {activeSection === 'preferences' && renderPreferencesSection()}
        {activeSection === 'financing' && renderFinancingSection()}
      </div>

      {/* Summary */}
      {!isEditing && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">
            Resumo do Perfil
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <CurrencyDollarIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-medium text-blue-900">Investimento</div>
              <div className="text-blue-700">
                {formatCurrency(investmentProfile.minValue)} - {formatCurrency(investmentProfile.maxValue)}
              </div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <HomeIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="font-medium text-green-900">Preferências</div>
              <div className="text-green-700">
                {propertyPreferences.type.length} tipo{propertyPreferences.type.length !== 1 ? 's' : ''} de imóvel
              </div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <BanknotesIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="font-medium text-purple-900">Financiamento</div>
              <div className="text-purple-700">
                {investmentProfile.paymentMethod === 'cash' ? 'À vista' : 
                 investmentProfile.paymentMethod === 'financing' ? 'Financiamento' : 'Misto'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};