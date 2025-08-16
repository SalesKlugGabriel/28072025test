import React, { useState, useEffect } from 'react';
import { 
  BuildingOffice2Icon,
  MapPinIcon,
  CurrencyDollarIcon,
  HomeIcon,
  StarIcon,
  ShareIcon,
  LinkIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { Conversation } from './WhatsAppChat';

interface Property {
  id: string;
  name: string;
  type: string;
  address: string;
  coordinates: { lat: number; lng: number };
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  parkingSpaces: number;
  amenities: string[];
  images: string[];
  description: string;
  status: 'available' | 'reserved' | 'sold';
  matchScore: number; // 0-100
  distanceFromPreferences: number; // em km
}

interface PropertySuggestionsProps {
  conversation: Conversation;
}

export const PropertySuggestions: React.FC<PropertySuggestionsProps> = ({ conversation }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'match' | 'price' | 'distance'>('match');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 0,
    propertyType: '',
    minBedrooms: 0,
    maxBedrooms: 0,
    onlyAvailable: true
  });

  useEffect(() => {
    loadPropertySuggestions();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [properties, sortBy, filters]);

  const loadPropertySuggestions = async () => {
    setIsLoading(true);
    try {
      // Simulando carregamento de propriedades - na vida real viria da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProperties: Property[] = [
        {
          id: '1',
          name: 'Residencial Vila Nova',
          type: 'Apartamento',
          address: 'Rua das Flores, 123 - Vila Madalena, SP',
          coordinates: { lat: -23.550520, lng: -46.633309 },
          price: 450000,
          bedrooms: 2,
          bathrooms: 2,
          area: 65,
          parkingSpaces: 1,
          amenities: ['Piscina', 'Academia', 'Portaria 24h'],
          images: ['/api/placeholder/400/300'],
          description: 'Apartamento moderno com acabamento de primeira qualidade.',
          status: 'available',
          matchScore: 95,
          distanceFromPreferences: 0.8
        },
        {
          id: '2',
          name: 'Edifício Garden City',
          type: 'Apartamento',
          address: 'Av. Paulista, 1000 - Bela Vista, SP',
          coordinates: { lat: -23.561414, lng: -46.655881 },
          price: 380000,
          bedrooms: 2,
          bathrooms: 1,
          area: 58,
          parkingSpaces: 1,
          amenities: ['Elevador', 'Portaria 24h', 'Salão de Festas'],
          images: ['/api/placeholder/400/300'],
          description: 'Localização privilegiada na Av. Paulista.',
          status: 'available',
          matchScore: 88,
          distanceFromPreferences: 2.1
        },
        {
          id: '3',
          name: 'Casa Jardim Europa',
          type: 'Casa',
          address: 'Rua Europa, 456 - Jardim Europa, SP',
          coordinates: { lat: -23.574321, lng: -46.678123 },
          price: 850000,
          bedrooms: 3,
          bathrooms: 3,
          area: 150,
          parkingSpaces: 2,
          amenities: ['Jardim', 'Churrasqueira', 'Garagem Coberta'],
          images: ['/api/placeholder/400/300'],
          description: 'Casa térrea com amplo jardim em condomínio fechado.',
          status: 'available',
          matchScore: 75,
          distanceFromPreferences: 4.2
        }
      ];

      setProperties(mockProperties);
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...properties];

    // Aplicar filtros
    if (filters.minPrice > 0) {
      filtered = filtered.filter(p => p.price >= filters.minPrice);
    }
    if (filters.maxPrice > 0) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice);
    }
    if (filters.propertyType) {
      filtered = filtered.filter(p => p.type === filters.propertyType);
    }
    if (filters.minBedrooms > 0) {
      filtered = filtered.filter(p => p.bedrooms >= filters.minBedrooms);
    }
    if (filters.maxBedrooms > 0) {
      filtered = filtered.filter(p => p.bedrooms <= filters.maxBedrooms);
    }
    if (filters.onlyAvailable) {
      filtered = filtered.filter(p => p.status === 'available');
    }

    // Aplicar ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'match':
          return b.matchScore - a.matchScore;
        case 'price':
          return a.price - b.price;
        case 'distance':
          return a.distanceFromPreferences - b.distanceFromPreferences;
        default:
          return 0;
      }
    });

    setFilteredProperties(filtered);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusColor = (status: Property['status']) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'reserved': return 'text-yellow-600 bg-yellow-100';
      case 'sold': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: Property['status']) => {
    switch (status) {
      case 'available': return 'Disponível';
      case 'reserved': return 'Reservado';
      case 'sold': return 'Vendido';
      default: return status;
    }
  };

  const handleSendProperty = (property: Property) => {
    // Aqui você enviaria a propriedade via WhatsApp
    const message = `
🏠 *${property.name}*

📍 ${property.address}
💰 ${formatCurrency(property.price)}
🛏️ ${property.bedrooms} quartos | 🚿 ${property.bathrooms} banheiros
📐 ${property.area}m² | 🚗 ${property.parkingSpaces} vagas

${property.description}

Compatibilidade: ${property.matchScore}% 
Distância da área preferida: ${property.distanceFromPreferences}km

Gostaria de agendar uma visita? 😊
    `.trim();

    console.log('Enviando propriedade via WhatsApp:', message);
    alert('Propriedade enviada via WhatsApp!');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Sugestões de Imóveis
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Propriedades que se encaixam no perfil de {conversation.clienteName}
            </p>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <AdjustmentsHorizontalIcon className="w-4 h-4 mr-2" />
            Filtros
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">
            Filtros de Busca
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço Mínimo
              </label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço Máximo
              </label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Imóvel
              </label>
              <select
                value={filters.propertyType}
                onChange={(e) => setFilters(prev => ({ ...prev, propertyType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Casa">Casa</option>
                <option value="Cobertura">Cobertura</option>
                <option value="Studio">Studio</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.onlyAvailable}
                onChange={(e) => setFilters(prev => ({ ...prev, onlyAvailable: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Apenas disponíveis</span>
            </label>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="match">Compatibilidade</option>
                <option value="price">Preço</option>
                <option value="distance">Distância</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{filteredProperties.length}</div>
          <div className="text-sm text-gray-500">Imóveis Encontrados</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {filteredProperties.filter(p => p.matchScore >= 90).length}
          </div>
          <div className="text-sm text-gray-500">Alta Compatibilidade</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {filteredProperties.length > 0 ? 
              formatCurrency(filteredProperties.reduce((sum, p) => sum + p.price, 0) / filteredProperties.length) : 
              'R$ 0'
            }
          </div>
          <div className="text-sm text-gray-500">Preço Médio</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {filteredProperties.filter(p => p.status === 'available').length}
          </div>
          <div className="text-sm text-gray-500">Disponíveis</div>
        </div>
      </div>

      {/* Properties List */}
      <div className="space-y-4">
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <BuildingOffice2Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum imóvel encontrado
            </h3>
            <p className="text-gray-500">
              Ajuste os filtros ou revise o perfil do cliente para ver mais opções.
            </p>
          </div>
        ) : (
          filteredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {property.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(property.matchScore)}`}>
                        {property.matchScore}% compatível
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                        {getStatusLabel(property.status)}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      {property.address} • {property.distanceFromPreferences}km da área preferida
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="w-4 h-4 mr-1 text-green-600" />
                        <span className="font-medium">{formatCurrency(property.price)}</span>
                      </div>
                      <div className="flex items-center">
                        <HomeIcon className="w-4 h-4 mr-1 text-blue-600" />
                        <span>{property.bedrooms} quartos</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 mr-1 text-blue-600">🚿</span>
                        <span>{property.bathrooms} banheiros</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 mr-1 text-blue-600">📐</span>
                        <span>{property.area}m²</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 mr-1 text-blue-600">🚗</span>
                        <span>{property.parkingSpaces} vagas</span>
                      </div>
                    </div>
                    
                    {property.amenities.length > 0 && (
                      <div className="mt-3">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Comodidades:</span> {property.amenities.slice(0, 3).join(', ')}
                          {property.amenities.length > 3 && ` e mais ${property.amenities.length - 3}`}
                        </div>
                      </div>
                    )}
                    
                    <p className="mt-3 text-sm text-gray-600">
                      {property.description}
                    </p>
                  </div>
                  
                  <div className="ml-6 flex flex-col space-y-2">
                    <button
                      onClick={() => handleSendProperty(property)}
                      className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <ShareIcon className="w-4 h-4 mr-1" />
                      Enviar WhatsApp
                    </button>
                    
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/property/${property.id}`);
                        alert('Link copiado!');
                      }}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <LinkIcon className="w-4 h-4 mr-1" />
                      Copiar Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};