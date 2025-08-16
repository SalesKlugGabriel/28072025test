import React, { useState, useEffect } from 'react';
import {
  BellIcon,
  CogIcon,
  ChartBarIcon,
  PlayIcon,
  PauseIcon,
  PlusIcon,
  DocumentTextIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useNotifications } from '../../services/notificationService';

const NotificacoesPage: React.FC = () => {
  const notifications = useNotifications();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'templates' | 'rules' | 'history'>('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [channels, setChannels] = useState<any[]>([]);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setStats(notifications.getStatistics());
    setChannels(notifications.getChannels());
    setRecentNotifications(notifications.getNotifications(10));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
    { key: 'templates', label: 'Templates', icon: DocumentTextIcon },
    { key: 'rules', label: 'Regras', icon: CogIcon },
    { key: 'history', label: 'Histórico', icon: ClockIcon }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BellIcon className="h-8 w-8 text-blue-600 mr-3" />
              Sistema de Notificações
            </h1>
            <p className="mt-2 text-gray-600">
              Gerencie notificações multi-canal: WhatsApp, Email, SMS, Push e Sistema
            </p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
            <PlusIcon className="h-5 w-5 mr-2" />
            Nova Notificação
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BellIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Enviadas</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Enviadas com Sucesso</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.sent}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircleIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Falhas</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.failed}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pendentes</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Channels Status */}
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status dos Canais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {channels.map((channel) => (
                <div key={channel.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{channel.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      channel.enabled 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {channel.enabled ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Enviadas:</span>
                      <span className="font-medium">{channel.totalSent || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Taxa de Sucesso:</span>
                      <span className="font-medium">{(channel.successRate || 0).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notificações Recentes</h3>
            <div className="space-y-3">
              {recentNotifications.map((notification) => (
                <div key={notification.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    {getStatusIcon(notification.status)}
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{notification.title}</p>
                      <p className="text-sm text-gray-600">{notification.message.substring(0, 100)}...</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {notification.channels.join(', ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Templates de Notificação</h3>
          <p className="text-gray-600">Funcionalidade em desenvolvimento...</p>
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Regras de Automação</h3>
          <p className="text-gray-600">Funcionalidade em desenvolvimento...</p>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico Completo</h3>
          <p className="text-gray-600">Funcionalidade em desenvolvimento...</p>
        </div>
      )}
    </div>
  );
};

export default NotificacoesPage;