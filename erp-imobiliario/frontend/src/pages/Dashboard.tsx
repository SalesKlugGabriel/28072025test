import React from 'react';
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BanknotesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  // Mock data - em produção virá da API
  const metrics = [
    {
      title: 'Total de Imóveis',
      value: '247',
      change: '+12',
      changeType: 'increase' as const,
      icon: BuildingOfficeIcon,
      color: 'blue'
    },
    {
      title: 'Clientes Ativos',
      value: '1,234',
      change: '+45',
      changeType: 'increase' as const,
      icon: UserGroupIcon,
      color: 'green'
    },
    {
      title: 'Contratos Ativos',
      value: '189',
      change: '-3',
      changeType: 'decrease' as const,
      icon: DocumentTextIcon,
      color: 'purple'
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 234.567',
      change: '+8.2%',
      changeType: 'increase' as const,
      icon: BanknotesIcon,
      color: 'orange'
    }
  ];

  const revenueData = [
    { month: 'Jan', receita: 180000, despesas: 120000 },
    { month: 'Fev', receita: 195000, despesas: 115000 },
    { month: 'Mar', receita: 220000, despesas: 130000 },
    { month: 'Abr', receita: 210000, despesas: 125000 },
    { month: 'Mai', receita: 235000, despesas: 140000 },
    { month: 'Jun', receita: 250000, despesas: 135000 },
  ];

  const propertyStatusData = [
    { name: 'Alugados', value: 156, color: '#10B981' },
    { name: 'Disponíveis', value: 67, color: '#3B82F6' },
    { name: 'Em Reforma', value: 15, color: '#F59E0B' },
    { name: 'Vendidos', value: 9, color: '#EF4444' }
  ];

  const contractsData = [
    { month: 'Jan', novos: 12, renovacoes: 8, rescisoes: 3 },
    { month: 'Fev', novos: 15, renovacoes: 10, rescisoes: 2 },
    { month: 'Mar', novos: 18, renovacoes: 12, rescisoes: 4 },
    { month: 'Abr', novos: 14, renovacoes: 9, rescisoes: 1 },
    { month: 'Mai', novos: 20, renovacoes: 15, rescisoes: 3 },
    { month: 'Jun', novos: 22, renovacoes: 18, rescisoes: 2 }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'contract',
      title: 'Novo contrato assinado',
      description: 'Apartamento Centro - Ref: 001',
      time: '2 horas atrás',
      user: 'Maria Silva'
    },
    {
      id: 2,
      type: 'payment',
      title: 'Pagamento recebido',
      description: 'Aluguel Rua das Flores, 123',
      time: '4 horas atrás',
      user: 'Sistema'
    },
    {
      id: 3,
      type: 'property',
      title: 'Imóvel cadastrado',
      description: 'Casa Jardim América - Ref: 045',
      time: '6 horas atrás',
      user: 'João Santos'
    },
    {
      id: 4,
      type: 'client',
      title: 'Novo cliente cadastrado',
      description: 'Carlos Oliveira - Proprietário',
      time: '1 dia atrás',
      user: 'Ana Costa'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 text-blue-600 bg-blue-50',
      green: 'bg-green-500 text-green-600 bg-green-50',
      purple: 'bg-purple-500 text-purple-600 bg-purple-50',
      orange: 'bg-orange-500 text-orange-600 bg-orange-50'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral do seu negócio imobiliário</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Filtrar Período
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Exportar Relatório
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const colorClasses = getColorClasses(metric.color).split(' ');
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[2]}`}>
                  <metric.icon className={`h-6 w-6 ${colorClasses[1]}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {metric.changeType === 'increase' ? (
                  <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  metric.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {metric.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">este mês</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Receitas vs Despesas</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800">
              Ver detalhes
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="receita" stroke="#10B981" strokeWidth={2} name="Receita" />
              <Line type="monotone" dataKey="despesas" stroke="#EF4444" strokeWidth={2} name="Despesas" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Property Status Pie Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Status dos Imóveis</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800">
              Ver todos
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={propertyStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
              >
                {propertyStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Contracts Chart and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contracts Bar Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Contratos por Mês</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800">
              Ver relatório
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contractsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="novos" fill="#10B981" name="Novos" />
              <Bar dataKey="renovacoes" fill="#3B82F6" name="Renovações" />
              <Bar dataKey="rescisoes" fill="#EF4444" name="Rescisões" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Atividades Recentes</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800">
              Ver todas
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <EyeIcon className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <span>{activity.time}</span>
                    <span className="mx-1">•</span>
                    <span>{activity.user}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;