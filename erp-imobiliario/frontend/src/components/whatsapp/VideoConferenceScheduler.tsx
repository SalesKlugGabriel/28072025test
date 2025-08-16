import React, { useState, useEffect } from 'react';
import { 
  VideoCameraIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  LinkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { googleCalendarService, CreateEventParams } from '../../services/googleCalendarService';
import { Conversation } from './WhatsAppChat';

interface VideoConferenceSchedulerProps {
  conversation: Conversation;
}

interface ScheduledMeeting {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  meetLink: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  attendees: string[];
}

export const VideoConferenceScheduler: React.FC<VideoConferenceSchedulerProps> = ({
  conversation
}) => {
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [scheduledMeetings, setScheduledMeetings] = useState<ScheduledMeeting[]>([]);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  
  // Form state
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    clientEmail: '',
    includeGoogleMeet: true
  });

  useEffect(() => {
    initializeGoogleCalendar();
    loadScheduledMeetings();
  }, []);

  const initializeGoogleCalendar = async () => {
    setIsLoading(true);
    try {
      const initialized = await googleCalendarService.initialize();
      if (initialized) {
        const authenticated = googleCalendarService.isAuthenticated();
        setIsGoogleConnected(authenticated);
        
        if (authenticated) {
          const user = googleCalendarService.getUserInfo();
          setUserInfo(user);
        }
      }
    } catch (error) {
      console.error('Erro ao inicializar Google Calendar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const success = await googleCalendarService.signIn();
      if (success) {
        setIsGoogleConnected(true);
        const user = googleCalendarService.getUserInfo();
        setUserInfo(user);
      }
    } catch (error) {
      console.error('Erro ao conectar com Google:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await googleCalendarService.signOut();
      setIsGoogleConnected(false);
      setUserInfo(null);
    } catch (error) {
      console.error('Erro ao desconectar do Google:', error);
    }
  };

  const loadScheduledMeetings = () => {
    // Simulando reuniões agendadas - na vida real viria da API
    const mockMeetings: ScheduledMeeting[] = [
      {
        id: '1',
        title: 'Apresentação de Empreendimento',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
        meetLink: 'https://meet.google.com/abc-defg-hij',
        status: 'scheduled',
        attendees: [conversation.phoneNumber]
      }
    ];
    setScheduledMeetings(mockMeetings);
  };

  const handleScheduleMeeting = async () => {
    if (!isGoogleConnected) {
      alert('Conecte-se ao Google Calendar primeiro');
      return;
    }

    if (!meetingForm.title || !meetingForm.date || !meetingForm.startTime || !meetingForm.endTime) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    try {
      const startDateTime = new Date(`${meetingForm.date}T${meetingForm.startTime}`).toISOString();
      const endDateTime = new Date(`${meetingForm.date}T${meetingForm.endTime}`).toISOString();

      const params: CreateEventParams = {
        titulo: meetingForm.title,
        descricao: meetingForm.description || `Reunião agendada com ${conversation.clienteName}`,
        dataInicio: startDateTime,
        dataFim: endDateTime,
        emailsConvidados: meetingForm.clientEmail ? [meetingForm.clientEmail] : [],
        incluirGoogleMeet: meetingForm.includeGoogleMeet
      };

      const result = await googleCalendarService.createEvent(params);

      if (result.success) {
        const newMeeting: ScheduledMeeting = {
          id: result.event?.id || Date.now().toString(),
          title: meetingForm.title,
          startTime: startDateTime,
          endTime: endDateTime,
          meetLink: result.meetLink || '',
          status: 'scheduled',
          attendees: params.emailsConvidados
        };

        setScheduledMeetings(prev => [...prev, newMeeting]);
        setShowScheduleForm(false);
        setMeetingForm({
          title: '',
          description: '',
          date: '',
          startTime: '',
          endTime: '',
          clientEmail: '',
          includeGoogleMeet: true
        });

        alert('Reunião agendada com sucesso!');
      } else {
        alert(result.error || 'Erro ao agendar reunião');
      }
    } catch (error) {
      console.error('Erro ao agendar reunião:', error);
      alert('Erro inesperado ao agendar reunião');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateInstantMeet = async () => {
    if (!isGoogleConnected) {
      alert('Conecte-se ao Google Calendar primeiro');
      return;
    }

    setIsLoading(true);
    try {
      const result = await googleCalendarService.createMeetLink();
      
      if (result.success && result.meetLink) {
        // Aqui você poderia enviar o link automaticamente via WhatsApp
        navigator.clipboard.writeText(result.meetLink);
        alert(`Link do Google Meet criado e copiado: ${result.meetLink}`);
      } else {
        alert(result.error || 'Erro ao criar link do Meet');
      }
    } catch (error) {
      console.error('Erro ao criar link do Meet:', error);
      alert('Erro inesperado ao criar link do Meet');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getStatusColor = (status: ScheduledMeeting['status']) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: ScheduledMeeting['status']) => {
    switch (status) {
      case 'scheduled': return 'Agendada';
      case 'completed': return 'Concluída';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
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
      {/* Google Calendar Connection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Agendamento de Videoconferência
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Conecte-se ao Google Calendar para agendar reuniões com {conversation.clienteName}
            </p>
          </div>
          
          {!isGoogleConnected ? (
            <button
              onClick={handleGoogleSignIn}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <VideoCameraIcon className="w-4 h-4 mr-2" />
              Conectar Google
            </button>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="flex items-center text-sm text-green-600">
                <CheckCircleIcon className="w-4 h-4 mr-1" />
                Conectado como {userInfo?.nome}
              </div>
              <button
                onClick={handleGoogleSignOut}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Desconectar
              </button>
            </div>
          )}
        </div>
      </div>

      {isGoogleConnected && (
        <>
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">
              Ações Rápidas
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setShowScheduleForm(true)}
                className="flex items-center justify-center px-4 py-3 border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors"
              >
                <CalendarIcon className="w-5 h-5 mr-2" />
                Agendar Reunião
              </button>
              
              <button
                onClick={handleCreateInstantMeet}
                className="flex items-center justify-center px-4 py-3 border border-green-300 rounded-lg text-green-700 hover:bg-green-50 transition-colors"
              >
                <LinkIcon className="w-5 h-5 mr-2" />
                Criar Link Instantâneo
              </button>
            </div>
          </div>

          {/* Schedule Form */}
          {showScheduleForm && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-900">
                  Agendar Nova Reunião
                </h4>
                <button
                  onClick={() => setShowScheduleForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título da Reunião *
                  </label>
                  <input
                    type="text"
                    value={meetingForm.title}
                    onChange={(e) => setMeetingForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Apresentação do Empreendimento XYZ"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={meetingForm.description}
                    onChange={(e) => setMeetingForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    placeholder="Detalhes sobre a reunião..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data *
                    </label>
                    <input
                      type="date"
                      value={meetingForm.date}
                      onChange={(e) => setMeetingForm(prev => ({ ...prev, date: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Horário de Início *
                    </label>
                    <input
                      type="time"
                      value={meetingForm.startTime}
                      onChange={(e) => setMeetingForm(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Horário de Término *
                    </label>
                    <input
                      type="time"
                      value={meetingForm.endTime}
                      onChange={(e) => setMeetingForm(prev => ({ ...prev, endTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail do Cliente
                  </label>
                  <input
                    type="email"
                    value={meetingForm.clientEmail}
                    onChange={(e) => setMeetingForm(prev => ({ ...prev, clientEmail: e.target.value }))}
                    placeholder="cliente@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Opcional: se informado, o cliente receberá o convite por e-mail
                  </p>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeGoogleMeet"
                    checked={meetingForm.includeGoogleMeet}
                    onChange={(e) => setMeetingForm(prev => ({ ...prev, includeGoogleMeet: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="includeGoogleMeet" className="ml-2 text-sm text-gray-700">
                    Incluir link do Google Meet
                  </label>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowScheduleForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleScheduleMeeting}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    ) : (
                      'Agendar Reunião'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Scheduled Meetings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">
              Reuniões Agendadas
            </h4>
            
            {scheduledMeetings.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma reunião agendada</p>
              </div>
            ) : (
              <div className="space-y-4">
                {scheduledMeetings.map((meeting) => {
                  const { date, time } = formatDateTime(meeting.startTime);
                  const endTime = formatDateTime(meeting.endTime).time;
                  
                  return (
                    <div
                      key={meeting.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h5 className="font-medium text-gray-900">
                              {meeting.title}
                            </h5>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                              {getStatusLabel(meeting.status)}
                            </span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600 space-x-4">
                            <div className="flex items-center">
                              <CalendarIcon className="w-4 h-4 mr-1" />
                              {date}
                            </div>
                            <div className="flex items-center">
                              <ClockIcon className="w-4 h-4 mr-1" />
                              {time} - {endTime}
                            </div>
                            {meeting.attendees.length > 0 && (
                              <div className="flex items-center">
                                <UserIcon className="w-4 h-4 mr-1" />
                                {meeting.attendees.length} participante{meeting.attendees.length !== 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {meeting.meetLink && (
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(meeting.meetLink);
                              alert('Link copiado!');
                            }}
                            className="ml-4 p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                            title="Copiar link do Meet"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};