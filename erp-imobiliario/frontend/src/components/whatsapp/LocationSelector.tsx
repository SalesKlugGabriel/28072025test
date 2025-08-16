import React, { useState, useRef, useEffect } from 'react';
import { 
  MapPinIcon,
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface LocationSelectorProps {
  customerData: any;
  onUpdate: (field: string, value: any) => void;
}

interface LocationPreference {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  radius: number; // em km
  priority: 'high' | 'medium' | 'low';
  description?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  customerData,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');
  const [selectedRadius, setSelectedRadius] = useState(2); // km
  const [mapCenter, setMapCenter] = useState({ lat: -23.550520, lng: -46.633309 }); // São Paulo
  const [locationPreferences, setLocationPreferences] = useState<LocationPreference[]>([
    {
      id: '1',
      name: 'Região Vila Madalena',
      coordinates: { lat: -23.550520, lng: -46.633309 },
      radius: 2,
      priority: 'high',
      description: 'Próximo ao trabalho'
    }
  ]);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    loadGoogleMaps();
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMapMarkers();
    }
  }, [locationPreferences]);

  const loadGoogleMaps = () => {
    // Verificar se Google Maps já está carregado
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    // Carregar Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initializeMap;
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: mapCenter,
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        {
          featureType: 'poi.business',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    mapInstanceRef.current = map;

    // Adicionar listener para cliques no mapa
    map.addListener('click', (event: any) => {
      if (isEditing) {
        handleMapClick(event.latLng);
      }
    });

    // Inicializar marcadores
    updateMapMarkers();

    // Configurar autocomplete para busca
    if (window.google.maps.places) {
      setupAddressSearch();
    }
  };

  const setupAddressSearch = () => {
    const searchInput = document.getElementById('address-search') as HTMLInputElement;
    if (!searchInput) return;

    const autocomplete = new window.google.maps.places.Autocomplete(searchInput, {
      componentRestrictions: { country: 'br' },
      fields: ['place_id', 'geometry', 'name', 'formatted_address']
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        setMapCenter(location);
        mapInstanceRef.current?.setCenter(location);
        mapInstanceRef.current?.setZoom(15);
      }
    });
  };

  const handleMapClick = (latLng: any) => {
    const location = {
      lat: latLng.lat(),
      lng: latLng.lng()
    };

    // Geocoding reverso para obter o endereço
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        const address = results[0].formatted_address;
        
        const newPreference: LocationPreference = {
          id: Date.now().toString(),
          name: `Área de Interesse ${locationPreferences.length + 1}`,
          coordinates: location,
          radius: selectedRadius,
          priority: 'medium',
          description: address
        };

        setLocationPreferences(prev => [...prev, newPreference]);
      }
    });
  };

  const updateMapMarkers = () => {
    if (!mapInstanceRef.current || !window.google) return;

    // Limpar marcadores existentes
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Adicionar novos marcadores
    locationPreferences.forEach(preference => {
      // Marcador central
      const marker = new window.google.maps.Marker({
        position: preference.coordinates,
        map: mapInstanceRef.current,
        title: preference.name,
        icon: {
          url: getPriorityIcon(preference.priority),
          scaledSize: new window.google.maps.Size(30, 30)
        }
      });

      // Círculo de raio
      const circle = new window.google.maps.Circle({
        strokeColor: getPriorityColor(preference.priority),
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: getPriorityColor(preference.priority),
        fillOpacity: 0.2,
        map: mapInstanceRef.current,
        center: preference.coordinates,
        radius: preference.radius * 1000 // convertendo km para metros
      });

      markersRef.current.push(marker, circle);

      // Info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div>
            <h4>${preference.name}</h4>
            <p>Raio: ${preference.radius}km</p>
            <p>Prioridade: ${getPriorityLabel(preference.priority)}</p>
            ${preference.description ? `<p>${preference.description}</p>` : ''}
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });
    });
  };

  const getPriorityIcon = (priority: LocationPreference['priority']) => {
    const colors = {
      high: 'red',
      medium: 'yellow',
      low: 'green'
    };
    return `https://maps.google.com/mapfiles/ms/icons/${colors[priority]}-dot.png`;
  };

  const getPriorityColor = (priority: LocationPreference['priority']) => {
    const colors = {
      high: '#dc2626',
      medium: '#d97706',
      low: '#16a34a'
    };
    return colors[priority];
  };

  const getPriorityLabel = (priority: LocationPreference['priority']) => {
    const labels = {
      high: 'Alta',
      medium: 'Média',
      low: 'Baixa'
    };
    return labels[priority];
  };

  const handleSaveLocations = () => {
    onUpdate('locationPreferences', locationPreferences);
    setIsEditing(false);
  };

  const handleDeletePreference = (id: string) => {
    setLocationPreferences(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdatePreference = (id: string, updates: Partial<LocationPreference>) => {
    setLocationPreferences(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates } : p
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Preferências de Localização
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Defina as áreas de interesse do cliente no mapa
            </p>
          </div>
          
          <button
            onClick={() => isEditing ? handleSaveLocations() : setIsEditing(true)}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {isEditing ? (
              <>
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                Salvar Localizações
              </>
            ) : (
              <>
                <PencilIcon className="w-4 h-4 mr-2" />
                Editar Localizações
              </>
            )}
          </button>
        </div>
      </div>

      {/* Map Controls */}
      {isEditing && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">
            Configurações do Mapa
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Endereço
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="address-search"
                  type="text"
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  placeholder="Digite um endereço..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raio padrão (km)
              </label>
              <select
                value={selectedRadius}
                onChange={(e) => setSelectedRadius(Number(e.target.value))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0.5}>500 metros</option>
                <option value={1}>1 km</option>
                <option value={2}>2 km</option>
                <option value={3}>3 km</option>
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              <MapPinIcon className="w-4 h-4 inline mr-1" />
              Clique no mapa para adicionar uma nova área de interesse
            </p>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div
          ref={mapRef}
          className="w-full h-96"
          style={{ minHeight: '400px' }}
        >
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="text-center">
              <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Carregando mapa...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Location Preferences List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">
          Áreas de Interesse Definidas
        </h4>
        
        {locationPreferences.length === 0 ? (
          <div className="text-center py-8">
            <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma área definida ainda</p>
            <p className="text-sm text-gray-400 mt-1">
              {isEditing ? 'Clique no mapa para adicionar' : 'Ative o modo de edição para adicionar'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {locationPreferences.map((preference) => (
              <div
                key={preference.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getPriorityColor(preference.priority) }}
                      ></div>
                      {isEditing ? (
                        <input
                          type="text"
                          value={preference.name}
                          onChange={(e) => handleUpdatePreference(preference.id, { name: e.target.value })}
                          className="font-medium text-gray-900 bg-transparent border-0 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                        />
                      ) : (
                        <h5 className="font-medium text-gray-900">{preference.name}</h5>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        preference.priority === 'high' ? 'bg-red-100 text-red-700' :
                        preference.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {getPriorityLabel(preference.priority)}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Coordenadas:</span> {preference.coordinates.lat.toFixed(6)}, {preference.coordinates.lng.toFixed(6)}
                      </div>
                      <div>
                        <span className="font-medium">Raio:</span> {preference.radius} km
                      </div>
                      {preference.description && (
                        <div>
                          <span className="font-medium">Endereço:</span> {preference.description}
                        </div>
                      )}
                    </div>
                    
                    {isEditing && (
                      <div className="mt-3 grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Prioridade
                          </label>
                          <select
                            value={preference.priority}
                            onChange={(e) => handleUpdatePreference(preference.id, { priority: e.target.value as any })}
                            className="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="high">Alta</option>
                            <option value="medium">Média</option>
                            <option value="low">Baixa</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Raio (km)
                          </label>
                          <select
                            value={preference.radius}
                            onChange={(e) => handleUpdatePreference(preference.id, { radius: Number(e.target.value) })}
                            className="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value={0.5}>500m</option>
                            <option value={1}>1km</option>
                            <option value={2}>2km</option>
                            <option value={3}>3km</option>
                            <option value={5}>5km</option>
                            <option value={10}>10km</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {isEditing && (
                    <button
                      onClick={() => handleDeletePreference(preference.id)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">
          Legenda
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Alta Prioridade</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Média Prioridade</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Baixa Prioridade</span>
          </div>
        </div>
      </div>
    </div>
  );
};