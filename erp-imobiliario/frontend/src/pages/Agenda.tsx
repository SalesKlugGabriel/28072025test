import React, { useState, useEffect } from 'react';
import { CalendarIcon, ClockIcon, VideoCameraIcon, PhoneIcon, MapPinIcon, UserIcon, PlusIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { CalendarDaysIcon, ListBulletIcon } from '@heroicons/react/24/solid';

interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  tipo: 'reuniao' | 'ligacao' | 'visita' | 'follow-up' | 'videochamada' | 'tarefa';
  status: 'agendado' | 'confirmado' | 'concluido' | 'cancelado' | 'reagendado';
  participantes: string[];
  local?: string;
  linkVideoconferencia?: string;
  leadId?: string;
  clienteNome?: string;
  cor: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  lembrete: number; // minutos antes
  observacoes?: string;
  criadoPor: string;
  dataCriacao: string;
}

interface ViewMode {
  type: 'dia' | 'semana' | 'mes' | 'lista';
  date: Date;
}

const Agenda: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>({ type: 'semana', date: new Date() });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('todos');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null);

  const tiposEvento = [
    { id: 'reuniao', nome: 'Reunião', icon: UserIcon, cor: 'blue' },
    { id: 'ligacao', nome: 'Ligação', icon: PhoneIcon, cor: 'green' },
    { id: 'visita', nome: 'Visita', icon: MapPinIcon, cor: 'purple' },
    { id: 'follow-up', nome: 'Follow-up', icon: ClockIcon, cor: 'orange' },
    { id: 'videochamada', nome: 'Videochamada', icon: VideoCameraIcon, cor: 'red' },
    { id: 'tarefa', nome: 'Tarefa', icon: ListBulletIcon, cor: 'gray' }
  ];

  const statusEvento = [
    { id: 'agendado', nome: 'Agendado', cor: 'blue' },
    { id: 'confirmado', nome: 'Confirmado', cor: 'green' },
    { id: 'concluido', nome: 'Concluído', cor: 'emerald' },
    { id: 'cancelado', nome: 'Cancelado', cor: 'red' },
    { id: 'reagendado', nome: 'Reagendado', cor: 'yellow' }
  ];

  useEffect(() => {
    carregarEventos();
  }, []);

  const carregarEventos = () => {
    // Simular carregamento de eventos com mais exemplos
    const hoje = new Date();
    const eventosSimulados: Evento[] = [
      {
        id: '1',
        titulo: 'Reunião com João Silva',
        descricao: 'Apresentação do empreendimento Jardim das Flores',
        dataInicio: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 9, 0).toISOString(),
        dataFim: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 10, 0).toISOString(),
        tipo: 'reuniao',
        status: 'agendado',
        participantes: ['João Silva', 'Maria Santos'],
        local: 'Escritório Central',
        leadId: 'lead_123',
        clienteNome: 'João Silva',
        cor: 'blue',
        prioridade: 'alta',
        lembrete: 15,
        criadoPor: 'admin',
        dataCriacao: new Date().toISOString()
      },
      {
        id: '2',
        titulo: 'Videochamada - Ana Costa',
        descricao: 'Esclarecimento de dúvidas sobre financiamento',
        dataInicio: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 14, 30).toISOString(),
        dataFim: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 15, 30).toISOString(),
        tipo: 'videochamada',
        status: 'confirmado',
        participantes: ['Ana Costa'],
        linkVideoconferencia: 'https://meet.google.com/abc-defg-hij',
        leadId: 'lead_456',
        clienteNome: 'Ana Costa',
        cor: 'red',
        prioridade: 'media',
        lembrete: 30,
        criadoPor: 'admin',
        dataCriacao: new Date().toISOString()
      },
      {
        id: '3',
        titulo: 'Ligação - Carlos Mendes',
        descricao: 'Follow-up sobre proposta de apartamento',
        dataInicio: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 11, 0).toISOString(),
        dataFim: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 11, 30).toISOString(),
        tipo: 'ligacao',
        status: 'agendado',
        participantes: ['Carlos Mendes'],
        leadId: 'lead_789',
        clienteNome: 'Carlos Mendes',
        cor: 'green',
        prioridade: 'media',
        lembrete: 10,
        criadoPor: 'admin',
        dataCriacao: new Date().toISOString()
      },
      {
        id: '4',
        titulo: 'Visita ao empreendimento',
        descricao: 'Visita guiada com família interessada',
        dataInicio: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 16, 0).toISOString(),
        dataFim: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 17, 30).toISOString(),
        tipo: 'visita',
        status: 'confirmado',
        participantes: ['Família Santos'],
        local: 'Empreendimento Vista Verde',
        leadId: 'lead_321',
        clienteNome: 'Roberto Santos',
        cor: 'purple',
        prioridade: 'alta',
        lembrete: 60,
        criadoPor: 'admin',
        dataCriacao: new Date().toISOString()
      },
      {
        id: '5',
        titulo: 'Apresentação comercial',
        descricao: 'Apresentação de novos lançamentos',
        dataInicio: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1, 10, 0).toISOString(),
        dataFim: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1, 12, 0).toISOString(),
        tipo: 'reuniao',
        status: 'agendado',
        participantes: ['Equipe Comercial'],
        local: 'Sala de Reuniões',
        cor: 'blue',
        prioridade: 'media',
        lembrete: 30,
        criadoPor: 'admin',
        dataCriacao: new Date().toISOString()
      },
      {
        id: '6',
        titulo: 'Follow-up importante',
        descricao: 'Retomar negociação em andamento',
        dataInicio: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1, 15, 0).toISOString(),
        dataFim: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1, 15, 45).toISOString(),
        tipo: 'follow-up',
        status: 'agendado',
        participantes: ['Lucia Fernandes'],
        leadId: 'lead_654',
        clienteNome: 'Lucia Fernandes',
        cor: 'orange',
        prioridade: 'alta',
        lembrete: 15,
        criadoPor: 'admin',
        dataCriacao: new Date().toISOString()
      }
    ];
    
    setEventos(eventosSimulados);
  };

  const filteredEventos = eventos.filter(evento => {
    const matchesSearch = evento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evento.clienteNome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evento.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'todos' || evento.tipo === filterType;
    const matchesStatus = filterStatus === 'todos' || evento.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatarHora = (data: string) => {
    return new Date(data).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const obterCorPorTipo = (tipo: string) => {
    const tipoObj = tiposEvento.find(t => t.id === tipo);
    return tipoObj ? tipoObj.cor : 'gray';
  };

  const obterIconePorTipo = (tipo: string) => {
    const tipoObj = tiposEvento.find(t => t.id === tipo);
    return tipoObj ? tipoObj.icon : ClockIcon;
  };

  const renderCalendarioDia = () => {
    const diaAtual = viewMode.date;
    
    return (
      <div className="flex flex-col h-full">
        {/* Header do dia */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode({ ...viewMode, date: new Date(diaAtual.getTime() - 24 * 60 * 60 * 1000) })}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              ←
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {diaAtual.toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h2>
              <p className="text-gray-600 text-sm">
                {filteredEventos.filter(evento => {
                  const dataEvento = new Date(evento.dataInicio);
                  return dataEvento.toDateString() === diaAtual.toDateString();
                }).length} eventos agendados
              </p>
            </div>
            <button
              onClick={() => setViewMode({ ...viewMode, date: new Date(diaAtual.getTime() + 24 * 60 * 60 * 1000) })}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              →
            </button>
          </div>
          <button
            onClick={() => setViewMode({ ...viewMode, date: new Date() })}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            Hoje
          </button>
        </div>

        {/* Grid de horários do dia */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 gap-0">
            {Array.from({ length: 24 }, (_, hora) => {
              const eventosNaHora = filteredEventos.filter(evento => {
                const inicioEvento = new Date(evento.dataInicio);
                return inicioEvento.getDate() === diaAtual.getDate() &&
                       inicioEvento.getMonth() === diaAtual.getMonth() &&
                       inicioEvento.getFullYear() === diaAtual.getFullYear() &&
                       inicioEvento.getHours() === hora;
              });

              return (
                <div key={hora} className="flex border-b border-gray-100">
                  <div className="w-20 p-3 text-sm text-gray-500 border-r border-gray-200 bg-gray-50">
                    {hora.toString().padStart(2, '0')}:00
                  </div>
                  <div className="flex-1 p-3 min-h-[80px]">
                    {eventosNaHora.map(evento => {
                      const IconeEvento = obterIconePorTipo(evento.tipo);
                      const cor = obterCorPorTipo(evento.tipo);
                      
                      return (
                        <div
                          key={evento.id}
                          className={`p-3 mb-2 rounded-lg cursor-pointer bg-${cor}-100 border-l-4 border-${cor}-500 hover:bg-${cor}-200 transition-colors`}
                          onClick={() => setSelectedEvent(evento)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <IconeEvento className={`h-4 w-4 text-${cor}-600`} />
                              <span className="font-medium text-gray-900">{evento.titulo}</span>
                            </div>
                            <span className="text-sm text-gray-600">
                              {formatarHora(evento.dataInicio)} - {formatarHora(evento.dataFim)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{evento.descricao}</p>
                          {evento.clienteNome && (
                            <p className="text-xs text-gray-500 mt-1">Cliente: {evento.clienteNome}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderCalendarioSemana = () => {
    const inicioSemana = new Date(viewMode.date);
    inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
    
    const diasSemana: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const dia = new Date(inicioSemana);
      dia.setDate(inicioSemana.getDate() + i);
      diasSemana.push(dia);
    }

    return (
      <div className="flex flex-col h-full">
        {/* Header da semana */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const novaSemana = new Date(inicioSemana);
                novaSemana.setDate(inicioSemana.getDate() - 7);
                setViewMode({ ...viewMode, date: novaSemana });
              }}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              ←
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {inicioSemana.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </h2>
              <p className="text-gray-600 text-sm">
                {inicioSemana.getDate()} - {diasSemana[6].getDate()}
              </p>
            </div>
            <button
              onClick={() => {
                const novaSemana = new Date(inicioSemana);
                novaSemana.setDate(inicioSemana.getDate() + 7);
                setViewMode({ ...viewMode, date: novaSemana });
              }}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              →
            </button>
          </div>
          <button
            onClick={() => setViewMode({ ...viewMode, date: new Date() })}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            Esta semana
          </button>
        </div>

        <div className="grid grid-cols-8 gap-0 h-full">
          {/* Header dos dias */}
          <div className="col-span-1 border-r border-gray-200"></div>
          {diasSemana.map((dia, index) => (
            <div key={index} className="text-center p-3 border-b border-r border-gray-200 bg-gray-50">
              <div className="font-medium text-gray-900">
                {dia.toLocaleDateString('pt-BR', { weekday: 'short' })}
              </div>
              <div className={`text-2xl font-bold mt-1 ${
                dia.toDateString() === new Date().toDateString() ? 'text-blue-600' : 'text-gray-700'
              }`}>
                {dia.getDate()}
              </div>
            </div>
          ))}

          {/* Grid de horários */}
          {Array.from({ length: 24 }, (_, hora) => (
            <React.Fragment key={hora}>
              <div className="p-2 text-sm text-gray-500 border-r border-b border-gray-200 bg-gray-50">
                {hora.toString().padStart(2, '0')}:00
              </div>
              {diasSemana.map((dia, diaIndex) => {
                const eventosNaHora = filteredEventos.filter(evento => {
                  const inicioEvento = new Date(evento.dataInicio);
                  return inicioEvento.getDate() === dia.getDate() &&
                         inicioEvento.getMonth() === dia.getMonth() &&
                         inicioEvento.getFullYear() === dia.getFullYear() &&
                         inicioEvento.getHours() === hora;
                });

                return (
                  <div key={`${hora}-${diaIndex}`} className="p-1 border-b border-r border-gray-100 min-h-[60px]">
                    {eventosNaHora.map(evento => {
                      const IconeEvento = obterIconePorTipo(evento.tipo);
                      const cor = obterCorPorTipo(evento.tipo);
                      
                      return (
                        <div
                          key={evento.id}
                          className={`p-2 mb-1 rounded text-xs cursor-pointer bg-${cor}-100 border-l-4 border-${cor}-500 hover:bg-${cor}-200 transition-colors`}
                          onClick={() => setSelectedEvent(evento)}
                        >
                          <div className="flex items-center gap-1">
                            <IconeEvento className="h-3 w-3" />
                            <span className="font-medium truncate">{evento.titulo}</span>
                          </div>
                          <div className="text-gray-600">
                            {formatarHora(evento.dataInicio)} - {formatarHora(evento.dataFim)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderCalendarioMes = () => {
    const mesAtual = viewMode.date;
    const primeiroDiaMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), 1);
    const ultimoDiaMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 0);
    
    const primeiroDiaCalendario = new Date(primeiroDiaMes);
    primeiroDiaCalendario.setDate(primeiroDiaMes.getDate() - primeiroDiaMes.getDay());
    
    const diasCalendario: Date[] = [];
    for (let i = 0; i < 42; i++) { // 6 semanas * 7 dias
      const dia = new Date(primeiroDiaCalendario);
      dia.setDate(primeiroDiaCalendario.getDate() + i);
      diasCalendario.push(dia);
    }

    return (
      <div className="flex flex-col h-full">
        {/* Header do mês */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const mesAnterior = new Date(mesAtual);
                mesAnterior.setMonth(mesAtual.getMonth() - 1);
                setViewMode({ ...viewMode, date: mesAnterior });
              }}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              ←
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {mesAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </h2>
            </div>
            <button
              onClick={() => {
                const proximoMes = new Date(mesAtual);
                proximoMes.setMonth(mesAtual.getMonth() + 1);
                setViewMode({ ...viewMode, date: proximoMes });
              }}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              →
            </button>
          </div>
          <button
            onClick={() => setViewMode({ ...viewMode, date: new Date() })}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            Este mês
          </button>
        </div>

        {/* Header dos dias da semana */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia, index) => (
            <div key={index} className="p-3 text-center font-medium text-gray-600 bg-gray-50 border-r border-gray-200">
              {dia}
            </div>
          ))}
        </div>

        {/* Grid do calendário */}
        <div className="grid grid-cols-7 flex-1">
          {diasCalendario.map((dia, index) => {
            const eventosNoDia = filteredEventos.filter(evento => {
              const dataEvento = new Date(evento.dataInicio);
              return dataEvento.toDateString() === dia.toDateString();
            });

            const isDiaAtual = dia.toDateString() === new Date().toDateString();
            const isOutroMes = dia.getMonth() !== mesAtual.getMonth();

            return (
              <div
                key={index}
                className={`p-2 border-r border-b border-gray-200 min-h-[120px] ${
                  isOutroMes ? 'bg-gray-50' : 'bg-white'
                } hover:bg-gray-50 transition-colors cursor-pointer`}
                onClick={() => setViewMode({ type: 'dia', date: dia })}
              >
                <div className={`text-sm font-medium mb-2 ${
                  isDiaAtual ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center' :
                  isOutroMes ? 'text-gray-400' : 'text-gray-900'
                }`}>
                  {dia.getDate()}
                </div>
                
                <div className="space-y-1">
                  {eventosNoDia.slice(0, 3).map(evento => {
                    const cor = obterCorPorTipo(evento.tipo);
                    return (
                      <div
                        key={evento.id}
                        className={`text-xs p-1 rounded bg-${cor}-100 text-${cor}-800 truncate`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(evento);
                        }}
                      >
                        {formatarHora(evento.dataInicio)} {evento.titulo}
                      </div>
                    );
                  })}
                  
                  {eventosNoDia.length > 3 && (
                    <div className="text-xs text-gray-500 font-medium">
                      +{eventosNoDia.length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderListaEventos = () => {
    const eventosOrdenados = filteredEventos.sort((a, b) => 
      new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime()
    );

    return (
      <div className="space-y-4">
        {eventosOrdenados.map(evento => {
          const IconeEvento = obterIconePorTipo(evento.tipo);
          const cor = obterCorPorTipo(evento.tipo);
          
          return (
            <div
              key={evento.id}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedEvent(evento)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-${cor}-100`}>
                    <IconeEvento className={`h-5 w-5 text-${cor}-600`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{evento.titulo}</h3>
                    <p className="text-gray-600 text-sm mt-1">{evento.descricao}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {formatarData(evento.dataInicio)}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        {formatarHora(evento.dataInicio)} - {formatarHora(evento.dataFim)}
                      </span>
                      {evento.local && (
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="h-4 w-4" />
                          {evento.local}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full bg-${obterCorPorTipo(evento.status)}-100 text-${obterCorPorTipo(evento.status)}-800`}>
                    {statusEvento.find(s => s.id === evento.status)?.nome}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    evento.prioridade === 'urgente' ? 'bg-red-100 text-red-800' :
                    evento.prioridade === 'alta' ? 'bg-orange-100 text-orange-800' :
                    evento.prioridade === 'media' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {evento.prioridade}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Agenda</h1>
            <p className="text-gray-600">Gerencie seus compromissos e follow-ups</p>
          </div>
          <button
            onClick={() => setShowNewEventModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Novo Evento
          </button>
        </div>

        {/* Filtros e Controles */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Busca */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtros */}
            <div className="flex items-center gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todos">Todos os tipos</option>
                {tiposEvento.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todos">Todos os status</option>
                {statusEvento.map(status => (
                  <option key={status.id} value={status.id}>{status.nome}</option>
                ))}
              </select>
            </div>

            {/* Modos de Visualização */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              {[
                { id: 'dia', nome: 'Dia', icon: CalendarIcon },
                { id: 'semana', nome: 'Semana', icon: CalendarDaysIcon },
                { id: 'mes', nome: 'Mês', icon: CalendarIcon },
                { id: 'lista', nome: 'Lista', icon: ListBulletIcon }
              ].map(modo => (
                <button
                  key={modo.id}
                  onClick={() => setViewMode({ ...viewMode, type: modo.id as any })}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    viewMode.type === modo.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <modo.icon className="h-4 w-4" />
                  {modo.nome}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 min-h-[600px]">
          {viewMode.type === 'lista' && renderListaEventos()}
          {viewMode.type === 'dia' && renderCalendarioDia()}
          {viewMode.type === 'semana' && renderCalendarioSemana()}
          {viewMode.type === 'mes' && renderCalendarioMes()}
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Eventos Hoje</p>
                <p className="text-2xl font-bold text-blue-600">
                  {eventos.filter(e => {
                    const hoje = new Date();
                    const dataEvento = new Date(e.dataInicio);
                    return dataEvento.toDateString() === hoje.toDateString();
                  }).length}
                </p>
              </div>
              <CalendarIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-orange-600">
                  {eventos.filter(e => e.status === 'agendado').length}
                </p>
              </div>
              <ClockIcon className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Concluídos</p>
                <p className="text-2xl font-bold text-green-600">
                  {eventos.filter(e => e.status === 'concluido').length}
                </p>
              </div>
              <CalendarDaysIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Esta Semana</p>
                <p className="text-2xl font-bold text-purple-600">
                  {eventos.filter(e => {
                    const dataEvento = new Date(e.dataInicio);
                    const hoje = new Date();
                    const inicioSemana = new Date(hoje);
                    inicioSemana.setDate(hoje.getDate() - hoje.getDay());
                    const fimSemana = new Date(inicioSemana);
                    fimSemana.setDate(inicioSemana.getDate() + 6);
                    
                    return dataEvento >= inicioSemana && dataEvento <= fimSemana;
                  }).length}
                </p>
              </div>
              <CalendarDaysIcon className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agenda;