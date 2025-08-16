import React, { useState } from 'react';
import { 
  TagIcon,
  PlusIcon,
  TrashIcon,
  FunnelIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface Tag {
  id: string;
  name: string;
  color: string;
  category: 'behavior' | 'preference' | 'status' | 'custom';
  description?: string;
  createdAt: string;
}

interface CustomerTagsProps {
  customerData: any;
  onUpdate: (field: string, value: any) => void;
}

export const CustomerTags: React.FC<CustomerTagsProps> = ({
  customerData,
  onUpdate
}) => {
  const [customerTags, setCustomerTags] = useState<Tag[]>([
    {
      id: '1',
      name: 'Interessado em apartamento',
      color: 'blue',
      category: 'preference',
      description: 'Cliente demonstrou interesse específico em apartamentos',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Cliente VIP',
      color: 'purple',
      category: 'status',
      description: 'Cliente com alto poder aquisitivo',
      createdAt: '2024-01-10'
    }
  ]);

  const [availableTags] = useState<Tag[]>([
    {
      id: 'preset-1',
      name: 'Primeira compra',
      color: 'green',
      category: 'status',
      description: 'Cliente está comprando seu primeiro imóvel',
      createdAt: '2024-01-01'
    },
    {
      id: 'preset-2',
      name: 'Investidor',
      color: 'yellow',
      category: 'behavior',
      description: 'Cliente busca imóveis para investimento',
      createdAt: '2024-01-01'
    },
    {
      id: 'preset-3',
      name: 'Urgente',
      color: 'red',
      category: 'status',
      description: 'Cliente precisa decidir rapidamente',
      createdAt: '2024-01-01'
    },
    {
      id: 'preset-4',
      name: 'Negociador',
      color: 'orange',
      category: 'behavior',
      description: 'Cliente costuma negociar preços',
      createdAt: '2024-01-01'
    },
    {
      id: 'preset-5',
      name: 'Família',
      color: 'pink',
      category: 'preference',
      description: 'Cliente procura imóvel para família',
      createdAt: '2024-01-01'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [newTag, setNewTag] = useState({
    name: '',
    color: 'blue',
    category: 'custom' as Tag['category'],
    description: ''
  });

  const tagColors = [
    { value: 'blue', label: 'Azul', bgClass: 'bg-blue-100', textClass: 'text-blue-800' },
    { value: 'green', label: 'Verde', bgClass: 'bg-green-100', textClass: 'text-green-800' },
    { value: 'yellow', label: 'Amarelo', bgClass: 'bg-yellow-100', textClass: 'text-yellow-800' },
    { value: 'red', label: 'Vermelho', bgClass: 'bg-red-100', textClass: 'text-red-800' },
    { value: 'purple', label: 'Roxo', bgClass: 'bg-purple-100', textClass: 'text-purple-800' },
    { value: 'pink', label: 'Rosa', bgClass: 'bg-pink-100', textClass: 'text-pink-800' },
    { value: 'orange', label: 'Laranja', bgClass: 'bg-orange-100', textClass: 'text-orange-800' },
    { value: 'gray', label: 'Cinza', bgClass: 'bg-gray-100', textClass: 'text-gray-800' }
  ];

  const categories = [
    { value: 'behavior', label: 'Comportamento', icon: SparklesIcon },
    { value: 'preference', label: 'Preferência', icon: TagIcon },
    { value: 'status', label: 'Status', icon: CheckCircleIcon },
    { value: 'custom', label: 'Personalizada', icon: PlusIcon }
  ];

  const getTagColorClasses = (color: string) => {
    const colorConfig = tagColors.find(c => c.value === color);
    return colorConfig ? { bg: colorConfig.bgClass, text: colorConfig.textClass } : { bg: 'bg-gray-100', text: 'text-gray-800' };
  };

  const getCategoryIcon = (category: Tag['category']) => {
    const categoryConfig = categories.find(c => c.value === category);
    return categoryConfig?.icon || TagIcon;
  };

  const handleAddTag = () => {
    if (newTag.name.trim()) {
      const tag: Tag = {
        id: Date.now().toString(),
        name: newTag.name.trim(),
        color: newTag.color,
        category: newTag.category,
        description: newTag.description.trim(),
        createdAt: new Date().toISOString().split('T')[0]
      };

      const updatedTags = [...customerTags, tag];
      setCustomerTags(updatedTags);
      onUpdate('tags', updatedTags);
      
      setNewTag({
        name: '',
        color: 'blue',
        category: 'custom',
        description: ''
      });
      setShowAddForm(false);
    }
  };

  const handleAddPresetTag = (presetTag: Tag) => {
    if (!customerTags.find(t => t.id === presetTag.id)) {
      const updatedTags = [...customerTags, presetTag];
      setCustomerTags(updatedTags);
      onUpdate('tags', updatedTags);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    const updatedTags = customerTags.filter(t => t.id !== tagId);
    setCustomerTags(updatedTags);
    onUpdate('tags', updatedTags);
  };

  const filteredAvailableTags = availableTags.filter(tag => {
    const notAdded = !customerTags.find(ct => ct.id === tag.id);
    const matchesCategory = filterCategory === 'all' || tag.category === filterCategory;
    return notAdded && matchesCategory;
  });

  const groupedCustomerTags = categories.reduce((acc, category) => {
    acc[category.value] = customerTags.filter(tag => tag.category === category.value);
    return acc;
  }, {} as Record<string, Tag[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Tags do Cliente
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Organize e categorize informações importantes sobre o cliente
            </p>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Nova Tag
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => {
          const count = groupedCustomerTags[category.value]?.length || 0;
          const Icon = category.icon;
          
          return (
            <div key={category.value} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
              <Icon className="w-6 h-6 text-gray-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-500">{category.label}</div>
            </div>
          );
        })}
      </div>

      {/* Add Tag Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-900">
              Criar Nova Tag
            </h4>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Tag *
                </label>
                <input
                  type="text"
                  value={newTag.name}
                  onChange={(e) => setNewTag(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Cliente pontual"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  value={newTag.category}
                  onChange={(e) => setNewTag(prev => ({ ...prev, category: e.target.value as Tag['category'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor da Tag
              </label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {tagColors.map((color) => (
                  <label key={color.value} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="tagColor"
                      value={color.value}
                      checked={newTag.color === color.value}
                      onChange={(e) => setNewTag(prev => ({ ...prev, color: e.target.value }))}
                      className="sr-only"
                    />
                    <div className={`w-8 h-8 rounded-full border-2 transition-all ${
                      newTag.color === color.value ? 'border-gray-800 scale-110' : 'border-gray-300'
                    } ${color.bgClass}`}>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={newTag.description}
                onChange={(e) => setNewTag(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                placeholder="Opcional: descreva o que essa tag representa..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddTag}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Criar Tag
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Current Tags by Category */}
      <div className="space-y-4">
        {categories.map((category) => {
          const tagsInCategory = groupedCustomerTags[category.value] || [];
          if (tagsInCategory.length === 0) return null;
          
          const Icon = category.icon;
          
          return (
            <div key={category.value} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Icon className="w-5 h-5 text-gray-600 mr-2" />
                <h4 className="text-md font-medium text-gray-900">
                  {category.label} ({tagsInCategory.length})
                </h4>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {tagsInCategory.map((tag) => {
                  const colorClasses = getTagColorClasses(tag.color);
                  
                  return (
                    <div
                      key={tag.id}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClasses.bg} ${colorClasses.text}`}
                    >
                      <span>{tag.name}</span>
                      <button
                        onClick={() => handleRemoveTag(tag.id)}
                        className="ml-2 text-current hover:text-red-600 transition-colors"
                      >
                        <TrashIcon className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        
        {customerTags.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <TagIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma tag adicionada
            </h3>
            <p className="text-gray-500">
              Adicione tags para organizar e categorizar informações sobre este cliente.
            </p>
          </div>
        )}
      </div>

      {/* Available Preset Tags */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-medium text-gray-900">
            Tags Sugeridas
          </h4>
          
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-4 h-4 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Todas as categorias</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {filteredAvailableTags.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">
              {filterCategory === 'all' 
                ? 'Todas as tags sugeridas já foram adicionadas'
                : 'Nenhuma tag disponível nesta categoria'
              }
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {filteredAvailableTags.map((tag) => {
              const colorClasses = getTagColorClasses(tag.color);
              
              return (
                <button
                  key={tag.id}
                  onClick={() => handleAddPresetTag(tag)}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2 border-dashed transition-colors hover:border-solid ${colorClasses.bg} ${colorClasses.text}`}
                  title={tag.description}
                >
                  <PlusIcon className="w-3 h-3 mr-1" />
                  {tag.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Tag Usage Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <ExclamationTriangleIcon className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <h5 className="text-sm font-medium text-blue-900 mb-1">
              Dicas para usar tags efetivamente:
            </h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use tags de comportamento para identificar padrões (ex: "Negociador", "Decidido")</li>
              <li>• Tags de preferência ajudam a filtrar imóveis (ex: "Família", "Investidor")</li>
              <li>• Tags de status indicam urgência (ex: "Urgente", "VIP", "Primeira compra")</li>
              <li>• Crie tags personalizadas para necessidades específicas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};