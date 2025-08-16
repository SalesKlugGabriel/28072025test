import React, { useState } from 'react';
import {
  PencilIcon,
  UserIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  DocumentDuplicateIcon,
  CloudArrowUpIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  TagIcon,
  CreditCardIcon,
  BanknotesIcon,
  DocumentIcon,
  ClockIcon,
  ExclamationCircleIcon,
  FolderIcon
} from '@heroicons/react/24/outline';

import { usePessoas, pessoasActions } from '../context/pessoas-context';
import { Pessoa, Cliente } from '../types/pessoa';
import { formatarCPF, formatarTelefone, formatarCEP } from '../utils/pessoa-validation';

interface DadosBancarios {
  banco: string;
  agencia: string;
  conta: string;
  tipoConta: 'corrente' | 'poupanca' | 'salario';
  pix?: string;
}

interface FaltaColaborador {
  id: string;
  data: string;
  tipo: 'falta' | 'atraso' | 'saida_antecipada';
  justificada: boolean;
  motivo?: string;
  observacoes?: string;
}

interface AtestadoColaborador {
  id: string;
  dataInicio: string;
  dataFim: string;
  tipo: 'medico' | 'odontologico' | 'psicologico';
  arquivo?: string;
  observacoes?: string;
}

interface BancoHoras {
  id: string;
  data: string;
  tipo: 'credito' | 'debito';
  horas: number;
  motivo: string;
  saldo: number;
}

interface Advertencia {
  id: string;
  data: string;
  tipo: 'verbal' | 'escrita' | 'suspensao';
  motivo: string;
  descricao: string;
  arquivo?: string;
}

interface Contrato {
  id: string;
  tipo: string;
  dataInicio: string;
  dataFim?: string;
  salario?: number;
  arquivo?: string;
  status: 'ativo' | 'encerrado' | 'suspenso';
}

interface DocumentoColaborador {
  id: string;
  categoria: string;
  nome: string;
  arquivo: string;
  dataUpload: string;
  observacoes?: string;
}

function PerfilPessoaMelhorado() {
  const { state, dispatch } = usePessoas();
  const pessoa = state.pessoaSelecionada;
  const [abaAtiva, setAbaAtiva] = useState('informacoes');
  
  if (!pessoa) return null;
  
  const handleClose = () => {
    dispatch({ type: 'SET_PERFIL_ABERTO', payload: false });
    dispatch(pessoasActions.selecionarPessoa(null));
  };

  const handleEditar = () => {
    dispatch({ type: 'SET_PERFIL_ABERTO', payload: false });
    dispatch({ type: 'SET_MODO_EDICAO', payload: true });
    dispatch({ type: 'SET_MODAL_ABERTO', payload: true });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const ehColaborador = pessoa.tipo === 'colaborador_pf' || pessoa.tipo === 'colaborador_pj';

  const abas = [
    { id: 'informacoes', nome: 'Informações', icon: UserIcon },
    { id: 'dados-bancarios', nome: 'Dados Bancários', icon: CreditCardIcon },
    ...(ehColaborador ? [
      { id: 'faltas', nome: 'Faltas', icon: ExclamationCircleIcon },
      { id: 'atestados', nome: 'Atestados', icon: DocumentTextIcon },
      { id: 'banco-horas', nome: 'Banco de Horas', icon: ClockIcon },
      { id: 'advertencias', nome: 'Advertências', icon: ExclamationTriangleIcon },
      { id: 'contratos', nome: 'Contratos', icon: DocumentDuplicateIcon },
      { id: 'documentos', nome: 'Documentos', icon: FolderIcon }
    ] : [])
  ];

  // Mock data - em produção viria do banco
  const dadosBancarios: DadosBancarios = {
    banco: 'Banco do Brasil',
    agencia: '1234-5',
    conta: '12345-6',
    tipoConta: 'corrente',
    pix: pessoa.email
  };

  const faltas: FaltaColaborador[] = [
    {
      id: '1',
      data: '2025-08-10',
      tipo: 'falta',
      justificada: true,
      motivo: 'Consulta médica',
      observacoes: 'Apresentou atestado médico'
    }
  ];

  const atestados: AtestadoColaborador[] = [
    {
      id: '1',
      dataInicio: '2025-08-10',
      dataFim: '2025-08-10',
      tipo: 'medico',
      observacoes: 'Consulta cardiológica'
    }
  ];

  const bancoHoras: BancoHoras[] = [
    {
      id: '1',
      data: '2025-08-15',
      tipo: 'credito',
      horas: 2,
      motivo: 'Hora extra trabalhada',
      saldo: 5
    }
  ];

  const advertencias: Advertencia[] = [];

  const contratos: Contrato[] = [
    {
      id: '1',
      tipo: 'CLT',
      dataInicio: '2024-01-15',
      salario: 5000,
      status: 'ativo'
    }
  ];

  const documentos: DocumentoColaborador[] = [
    {
      id: '1',
      categoria: 'CTPS',
      nome: 'Carteira de Trabalho',
      arquivo: 'ctps.pdf',
      dataUpload: '2024-01-15'
    },
    {
      id: '2',
      categoria: 'CPF',
      nome: 'CPF',
      arquivo: 'cpf.pdf',
      dataUpload: '2024-01-15'
    }
  ];

  const renderAbaInformacoes = () => (
    <div className="space-y-6">
      {/* Informações básicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Informações Básicas</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                pessoa.tipo === 'cliente' ? 'bg-blue-100 text-blue-800' :
                pessoa.tipo === 'lead' ? 'bg-orange-100 text-orange-800' :
                pessoa.tipo === 'fornecedor' ? 'bg-purple-100 text-purple-800' :
                'bg-green-100 text-green-800'
              }`}>
                {pessoa.tipo === 'cliente' ? 'Cliente' :
                 pessoa.tipo === 'lead' ? 'Lead' :
                 pessoa.tipo === 'fornecedor' ? 'Fornecedor' :
                 pessoa.tipo === 'colaborador_pf' ? 'Colaborador PF' : 'Colaborador PJ'}
              </span>
              <span className="ml-2 text-sm text-gray-500">
                {pessoa.pessoaFisica ? 'Pessoa Física' : 'Pessoa Jurídica'}
              </span>
            </div>

            {pessoa.nomeFantasia && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome Fantasia</label>
                <p className="text-sm text-gray-900">{pessoa.nomeFantasia}</p>
              </div>
            )}

            {pessoa.rgInscricaoEstadual && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {pessoa.pessoaFisica ? 'RG' : 'Inscrição Estadual'}
                </label>
                <p className="text-sm text-gray-900">{pessoa.rgInscricaoEstadual}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                pessoa.status === 'ativo' ? 'bg-green-100 text-green-800' :
                pessoa.status === 'inativo' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
              }`}>
                {pessoa.status}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Contato</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Telefone Principal</label>
              <div className="flex items-center">
                <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                <p className="text-sm text-gray-900">{formatarTelefone(pessoa.telefone)}</p>
              </div>
            </div>

            {pessoa.telefoneSecundario && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Telefone Secundário</label>
                <div className="flex items-center">
                  <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <p className="text-sm text-gray-900">{formatarTelefone(pessoa.telefoneSecundario)}</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Principal</label>
              <div className="flex items-center">
                <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
                <p className="text-sm text-gray-900">{pessoa.email}</p>
              </div>
            </div>

            {pessoa.emailSecundario && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Secundário</label>
                <div className="flex items-center">
                  <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <p className="text-sm text-gray-900">{pessoa.emailSecundario}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Endereço</h3>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start">
            <MapPinIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-gray-900">
                {pessoa.endereco.logradouro}, {pessoa.endereco.numero}
                {pessoa.endereco.complemento && ` - ${pessoa.endereco.complemento}`}
              </p>
              <p className="text-sm text-gray-600">
                {pessoa.endereco.bairro} - {pessoa.endereco.cidade}, {pessoa.endereco.estado}
              </p>
              <p className="text-sm text-gray-600">
                CEP: {formatarCEP(pessoa.endereco.cep)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      {pessoa.tags.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Tags</h3>
          
          <div className="flex flex-wrap gap-2">
            {pessoa.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                <TagIcon className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Observações */}
      {pessoa.observacoes && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Observações</h3>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{pessoa.observacoes}</p>
          </div>
        </div>
      )}

      {/* Informações específicas do cliente */}
      {pessoa.tipo === 'cliente' && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Informações de Cliente</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Valor Total Investido</label>
              <p className="text-lg font-semibold text-green-600">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                }).format((pessoa as Cliente).valorTotalInvestido || 0)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Classificação</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                (pessoa as Cliente).classificacao === 'vip' ? 'bg-yellow-100 text-yellow-800' :
                (pessoa as Cliente).classificacao === 'premium' ? 'bg-purple-100 text-purple-800' :
                (pessoa as Cliente).classificacao === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                (pessoa as Cliente).classificacao === 'silver' ? 'bg-gray-100 text-gray-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {(pessoa as Cliente).classificacao}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Informações do sistema */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Informações do Sistema</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <label className="block font-medium text-gray-700">Data de Inclusão</label>
            <p className="text-gray-600">{pessoa.dataInclusao}</p>
          </div>
          <div>
            <label className="block font-medium text-gray-700">Última Atualização</label>
            <p className="text-gray-600">{pessoa.dataAtualizacao}</p>
          </div>
          {pessoa.responsavel && (
            <div>
              <label className="block font-medium text-gray-700">Responsável</label>
              <p className="text-gray-600">{pessoa.responsavel}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAbaDadosBancarios = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Dados Bancários</h3>
        <button className="btn btn-primary btn-sm">
          <PencilIcon className="w-4 h-4 mr-2" />
          Editar
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Banco</label>
            <div className="flex items-center">
              <BuildingOfficeIcon className="w-5 h-5 text-gray-400 mr-3" />
              <p className="text-sm text-gray-900">{dadosBancarios.banco}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Conta</label>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
              {dadosBancarios.tipoConta.replace('_', ' ')}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Agência</label>
            <p className="text-sm text-gray-900">{dadosBancarios.agencia}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Conta</label>
            <p className="text-sm text-gray-900">{dadosBancarios.conta}</p>
          </div>

          {dadosBancarios.pix && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">PIX</label>
              <div className="flex items-center">
                <CreditCardIcon className="w-5 h-5 text-gray-400 mr-3" />
                <p className="text-sm text-gray-900">{dadosBancarios.pix}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAbaFaltas = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Registro de Faltas</h3>
        <button className="btn btn-primary btn-sm">
          <DocumentIcon className="w-4 h-4 mr-2" />
          Nova Falta
        </button>
      </div>

      <div className="space-y-4">
        {faltas.length === 0 ? (
          <div className="text-center py-8">
            <ExclamationCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma falta registrada</p>
          </div>
        ) : (
          faltas.map((falta) => (
            <div key={falta.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    falta.justificada ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {falta.justificada ? 'Justificada' : 'Não Justificada'}
                  </span>
                  <span className="ml-3 text-sm text-gray-600">{falta.data}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  falta.tipo === 'falta' ? 'bg-red-100 text-red-800' :
                  falta.tipo === 'atraso' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {falta.tipo.replace('_', ' ')}
                </span>
              </div>
              {falta.motivo && (
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Motivo:</strong> {falta.motivo}
                </p>
              )}
              {falta.observacoes && (
                <p className="text-sm text-gray-600">
                  <strong>Observações:</strong> {falta.observacoes}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderAbaAtestados = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Atestados Médicos</h3>
        <button className="btn btn-primary btn-sm">
          <CloudArrowUpIcon className="w-4 h-4 mr-2" />
          Novo Atestado
        </button>
      </div>

      <div className="space-y-4">
        {atestados.length === 0 ? (
          <div className="text-center py-8">
            <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum atestado cadastrado</p>
          </div>
        ) : (
          atestados.map((atestado) => (
            <div key={atestado.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  atestado.tipo === 'medico' ? 'bg-blue-100 text-blue-800' :
                  atestado.tipo === 'odontologico' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {atestado.tipo}
                </span>
                <div className="text-sm text-gray-600">
                  {atestado.dataInicio} até {atestado.dataFim}
                </div>
              </div>
              {atestado.observacoes && (
                <p className="text-sm text-gray-700">
                  <strong>Observações:</strong> {atestado.observacoes}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderAbaBancoHoras = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Banco de Horas</h3>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Saldo Atual</p>
            <p className="text-lg font-semibold text-blue-600">
              {bancoHoras.length > 0 ? `${bancoHoras[bancoHoras.length - 1].saldo}h` : '0h'}
            </p>
          </div>
          <button className="btn btn-primary btn-sm">
            <ClockIcon className="w-4 h-4 mr-2" />
            Novo Lançamento
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {bancoHoras.length === 0 ? (
          <div className="text-center py-8">
            <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum lançamento no banco de horas</p>
          </div>
        ) : (
          bancoHoras.map((lancamento) => (
            <div key={lancamento.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    lancamento.tipo === 'credito' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {lancamento.tipo === 'credito' ? '+' : '-'}{lancamento.horas}h
                  </span>
                  <span className="ml-3 text-sm text-gray-600">{lancamento.data}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Saldo: {lancamento.saldo}h
                </div>
              </div>
              <p className="text-sm text-gray-700">
                <strong>Motivo:</strong> {lancamento.motivo}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderAbaAdvertencias = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Advertências</h3>
        <button className="btn btn-primary btn-sm">
          <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
          Nova Advertência
        </button>
      </div>

      <div className="space-y-4">
        {advertencias.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircleIcon className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <p className="text-green-600">Nenhuma advertência registrada</p>
            <p className="text-sm text-gray-500 mt-2">Funcionário sem histórico disciplinar</p>
          </div>
        ) : (
          advertencias.map((advertencia) => (
            <div key={advertencia.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  advertencia.tipo === 'verbal' ? 'bg-yellow-100 text-yellow-800' :
                  advertencia.tipo === 'escrita' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {advertencia.tipo}
                </span>
                <span className="text-sm text-gray-600">{advertencia.data}</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Motivo:</strong> {advertencia.motivo}
              </p>
              <p className="text-sm text-gray-600">
                {advertencia.descricao}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderAbaContratos = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Contratos</h3>
        <button className="btn btn-primary btn-sm">
          <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
          Novo Contrato
        </button>
      </div>

      <div className="space-y-4">
        {contratos.map((contrato) => (
          <div key={contrato.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900">{contrato.tipo}</h4>
                <p className="text-sm text-gray-600">
                  Início: {contrato.dataInicio}
                  {contrato.dataFim && ` • Fim: ${contrato.dataFim}`}
                </p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                contrato.status === 'ativo' ? 'bg-green-100 text-green-800' :
                contrato.status === 'encerrado' ? 'bg-gray-100 text-gray-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {contrato.status}
              </span>
            </div>
            {contrato.salario && (
              <div className="flex items-center">
                <BanknotesIcon className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-lg font-semibold text-green-600">
                  {new Intl.NumberFormat('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL' 
                  }).format(contrato.salario)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderAbaDocumentos = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Documentos</h3>
        <button className="btn btn-primary btn-sm">
          <CloudArrowUpIcon className="w-4 h-4 mr-2" />
          Upload Documento
        </button>
      </div>

      {/* Categorias de documentos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['CTPS', 'CPF', 'RG', 'CRECI', 'Reservista', 'Residência', 'Casamento', 'Nascimento'].map((categoria) => {
          const doc = documentos.find(d => d.categoria === categoria);
          return (
            <div key={categoria} className={`border-2 border-dashed rounded-lg p-4 text-center ${
              doc ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'
            }`}>
              <FolderIcon className={`w-8 h-8 mx-auto mb-2 ${doc ? 'text-green-600' : 'text-gray-400'}`} />
              <p className="text-sm font-medium text-gray-900">{categoria}</p>
              <p className="text-xs text-gray-500">
                {doc ? 'Enviado' : 'Não enviado'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Lista de documentos */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Documentos Cadastrados</h4>
        {documentos.map((documento) => (
          <div key={documento.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DocumentIcon className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">{documento.nome}</p>
                  <p className="text-sm text-gray-600">
                    {documento.categoria} • {documento.dataUpload}
                  </p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Visualizar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderConteudoAba = () => {
    switch (abaAtiva) {
      case 'informacoes': return renderAbaInformacoes();
      case 'dados-bancarios': return renderAbaDadosBancarios();
      case 'faltas': return renderAbaFaltas();
      case 'atestados': return renderAbaAtestados();
      case 'banco-horas': return renderAbaBancoHoras();
      case 'advertencias': return renderAbaAdvertencias();
      case 'contratos': return renderAbaContratos();
      case 'documentos': return renderAbaDocumentos();
      default: return renderAbaInformacoes();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-lg font-medium text-blue-700">
                    {pessoa.nome.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900">{pessoa.nome}</h2>
                <p className="text-sm text-gray-600">{formatarCPF(pessoa.cpfCnpj)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleEditar}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PencilIcon className="w-4 h-4 mr-2" />
                Editar
              </button>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                title="Fechar"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Navegação por abas */}
        <div className="bg-white border-b border-gray-200">
          <nav className="flex space-x-0 px-6 overflow-x-auto">
            {abas.map((aba) => {
              const Icon = aba.icon;
              return (
                <button
                  key={aba.id}
                  onClick={() => setAbaAtiva(aba.id)}
                  className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    abaAtiva === aba.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {aba.nome}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Conteúdo da aba */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {renderConteudoAba()}
        </div>
      </div>
    </div>
  );
}

export default PerfilPessoaMelhorado;