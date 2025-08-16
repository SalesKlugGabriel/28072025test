import React, { useState } from 'react';
import {
  XMarkIcon,
  DocumentTextIcon,
  UserIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  DocumentArrowDownIcon,
  PencilSquareIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { ContratoJuridico } from '../../types/juridico';

interface ModalDetalhesContratoProps {
  contrato: ContratoJuridico | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (contrato: ContratoJuridico) => void;
  onRegistrarPagamento?: (contrato: ContratoJuridico) => void;
}

type AbaAtiva = 'geral' | 'financeiro' | 'pagamentos' | 'valorizacao' | 'documentos';

const ModalDetalhesContrato: React.FC<ModalDetalhesContratoProps> = ({
  contrato,
  isOpen,
  onClose,
  onEdit,
  onRegistrarPagamento
}) => {
  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>('geral');

  if (!isOpen || !contrato) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'suspenso': return 'bg-yellow-100 text-yellow-800';
      case 'quitado': return 'bg-blue-100 text-blue-800';
      case 'distratado': return 'bg-red-100 text-red-800';
      case 'rescindido': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPagamentoStatusColor = (status: string) => {
    switch (status) {
      case 'em_dia': return 'text-green-600';
      case 'quitado': return 'text-blue-600';
      case 'atraso': return 'text-yellow-600';
      case 'vencido': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const calcularPercentualPago = () => {
    return Math.round((contrato.financeiro.valorPago / contrato.financeiro.valorTotal) * 100);
  };

  const obterProximosPagamentos = () => {
    return contrato.pagamentos
      .filter(p => p.status !== 'quitado')
      .sort((a, b) => new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime())
      .slice(0, 5);
  };

  const calcularTotalJurosMultas = () => {
    return contrato.pagamentos.reduce((total, p) => total + (p.juros || 0) + (p.multa || 0), 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            <DocumentTextIcon className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Contrato {contrato.numero}</h2>
              <div className="flex items-center space-x-4 mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contrato.status)}`}>
                  {contrato.status.toUpperCase()}
                </span>
                <span className="text-sm text-gray-600">{contrato.tipo.toUpperCase()}</span>
                <span className="text-sm text-gray-600">Versão {contrato.versao}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(contrato)}
                className="btn-outline flex items-center space-x-2"
              >
                <PencilSquareIcon className="w-4 h-4" />
                <span>Editar</span>
              </button>
            )}
            {onRegistrarPagamento && (
              <button
                onClick={() => onRegistrarPagamento(contrato)}
                className="btn-primary flex items-center space-x-2"
              >
                <BanknotesIcon className="w-4 h-4" />
                <span>Registrar Pagamento</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'geral', label: 'Informações Gerais', icon: DocumentTextIcon },
              { key: 'financeiro', label: 'Financeiro', icon: CurrencyDollarIcon },
              { key: 'pagamentos', label: 'Pagamentos', icon: BanknotesIcon },
              { key: 'valorizacao', label: 'Valorização', icon: ArrowTrendingUpIcon },
              { key: 'documentos', label: 'Documentos', icon: DocumentArrowDownIcon }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setAbaAtiva(tab.key as AbaAtiva)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                    abaAtiva === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Aba Geral */}
          {abaAtiva === 'geral' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Dados do Cliente */}
                <div className="card p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <UserIcon className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Cliente</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Nome</p>
                      <p className="font-medium text-gray-900">{contrato.cliente.nome}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{contrato.cliente.pessoaFisica ? 'CPF' : 'CNPJ'}</p>
                      <p className="font-medium text-gray-900">{contrato.cliente.cpfCnpj}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Telefone</p>
                        <div className="flex items-center space-x-2">
                          <PhoneIcon className="w-4 h-4 text-gray-400" />
                          <p className="font-medium text-gray-900">{contrato.cliente.telefone}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">E-mail</p>
                        <div className="flex items-center space-x-2">
                          <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                          <p className="font-medium text-gray-900">{contrato.cliente.email}</p>
                        </div>
                      </div>
                    </div>
                    {contrato.cliente.pf && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Estado Civil</p>
                          <p className="font-medium text-gray-900 capitalize">{contrato.cliente.pf.estadoCivil?.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Profissão</p>
                          <p className="font-medium text-gray-900">{contrato.cliente.pf.profissao}</p>
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Endereço</p>
                      <p className="font-medium text-gray-900">{contrato.cliente.endereco}</p>
                    </div>
                  </div>
                </div>

                {/* Dados do Imóvel */}
                <div className="card p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <BuildingOfficeIcon className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Imóvel</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Código</p>
                      <p className="font-bold text-gray-900">{contrato.unidade.codigo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Empreendimento</p>
                      <p className="font-medium text-gray-900">{contrato.unidade.empreendimentoNome}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {contrato.unidade.bloco && (
                        <div>
                          <p className="text-sm text-gray-600">Bloco</p>
                          <p className="font-medium text-gray-900">{contrato.unidade.bloco}</p>
                        </div>
                      )}
                      {contrato.unidade.andar && (
                        <div>
                          <p className="text-sm text-gray-600">Andar</p>
                          <p className="font-medium text-gray-900">{contrato.unidade.andar}º</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-600">Número</p>
                        <p className="font-medium text-gray-900">{contrato.unidade.numero}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Tipo</p>
                        <p className="font-medium text-gray-900 capitalize">{contrato.unidade.tipo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Área Privativa</p>
                        <p className="font-medium text-gray-900">{contrato.unidade.areaPrivativa}m²</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Vagas</p>
                        <p className="font-medium text-gray-900">{contrato.unidade.vagas}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Posição</p>
                      <p className="font-medium text-gray-900 capitalize">{contrato.unidade.posicao}</p>
                    </div>
                    {contrato.unidade.vista && contrato.unidade.vista.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600">Vista</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {contrato.unidade.vista.map((v, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {v}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Datas Importantes */}
              <div className="card p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <CalendarDaysIcon className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Datas Importantes</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Assinatura</p>
                    <p className="font-medium text-gray-900">{formatDate(contrato.datas.assinatura)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Início Vigência</p>
                    <p className="font-medium text-gray-900">{formatDate(contrato.datas.inicioVigencia)}</p>
                  </div>
                  {contrato.datas.fimVigencia && (
                    <div>
                      <p className="text-sm text-gray-600">Fim Vigência</p>
                      <p className="font-medium text-gray-900">{formatDate(contrato.datas.fimVigencia)}</p>
                    </div>
                  )}
                  {contrato.datas.entregaChaves && (
                    <div>
                      <p className="text-sm text-gray-600">Entrega Chaves</p>
                      <p className="font-medium text-gray-900">{formatDate(contrato.datas.entregaChaves)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Cláusulas */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cláusulas Especiais</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Reajuste</p>
                    <p className="text-gray-900">{contrato.clausulas.reajuste}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Multa</p>
                    <p className="text-gray-900">{contrato.clausulas.multa}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tolerância</p>
                    <p className="text-gray-900">{contrato.clausulas.tolerancia}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Entrega</p>
                    <p className="text-gray-900">{contrato.clausulas.entrega}</p>
                  </div>
                  {contrato.clausulas.observacoes && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Observações</p>
                      <p className="text-gray-900">{contrato.clausulas.observacoes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Aba Financeiro */}
          {abaAtiva === 'financeiro' && (
            <div className="space-y-6">
              {/* Resumo Financeiro */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card p-6 bg-blue-50 border-blue-200">
                  <div className="flex items-center space-x-3">
                    <CurrencyDollarIcon className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-blue-600">Valor Total</p>
                      <p className="text-xl font-bold text-blue-900">
                        {formatCurrency(contrato.financeiro.valorTotal)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card p-6 bg-green-50 border-green-200">
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-green-600">Valor Pago</p>
                      <p className="text-xl font-bold text-green-900">
                        {formatCurrency(contrato.financeiro.valorPago)}
                      </p>
                      <p className="text-xs text-green-600">{calcularPercentualPago()}% do total</p>
                    </div>
                  </div>
                </div>

                <div className="card p-6 bg-orange-50 border-orange-200">
                  <div className="flex items-center space-x-3">
                    <ClockIcon className="w-8 h-8 text-orange-600" />
                    <div>
                      <p className="text-sm text-orange-600">Saldo Devedor</p>
                      <p className="text-xl font-bold text-orange-900">
                        {formatCurrency(contrato.financeiro.saldoDevedor)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card p-6 bg-red-50 border-red-200">
                  <div className="flex items-center space-x-3">
                    <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
                    <div>
                      <p className="text-sm text-red-600">Juros/Multas</p>
                      <p className="text-xl font-bold text-red-900">
                        {formatCurrency(calcularTotalJurosMultas())}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Progresso do Pagamento</h3>
                  <span className="text-lg font-bold text-blue-600">{calcularPercentualPago()}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${calcularPercentualPago()}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>Pago: {formatCurrency(contrato.financeiro.valorPago)}</span>
                  <span>Restante: {formatCurrency(contrato.financeiro.saldoDevedor)}</span>
                </div>
              </div>

              {/* Detalhes do Financiamento */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes do Financiamento</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Valor da Entrada</p>
                    <p className="font-medium text-gray-900">{formatCurrency(contrato.financeiro.valorEntrada)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Número de Parcelas</p>
                    <p className="font-medium text-gray-900">{contrato.financeiro.numeroParcelas}x</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Valor da Parcela</p>
                    <p className="font-medium text-gray-900">{formatCurrency(contrato.financeiro.valorParcela)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Próximo Vencimento</p>
                    <p className="font-medium text-gray-900">{formatDate(contrato.financeiro.proximoVencimento)}</p>
                  </div>
                </div>
              </div>

              {/* Próximos Vencimentos */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximos Vencimentos</h3>
                <div className="space-y-3">
                  {obterProximosPagamentos().map((pagamento) => (
                    <div key={pagamento.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          pagamento.status === 'vencido' ? 'bg-red-500' :
                          pagamento.status === 'atraso' ? 'bg-yellow-500' :
                          'bg-gray-300'
                        }`} />
                        <div>
                          <p className="font-medium text-gray-900">
                            Parcela {pagamento.numeroParcela}
                          </p>
                          <p className="text-sm text-gray-600">
                            Vencimento: {formatDate(pagamento.dataVencimento)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${getPagamentoStatusColor(pagamento.status)}`}>
                          {formatCurrency(pagamento.valorPrevisto)}
                        </p>
                        {pagamento.diasAtraso > 0 && (
                          <p className="text-xs text-red-600">
                            {pagamento.diasAtraso} dias de atraso
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Aba Pagamentos */}
          {abaAtiva === 'pagamentos' && (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Parcela
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vencimento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor Previsto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor Pago
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Atraso
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {contrato.pagamentos.map((pagamento) => (
                      <tr key={pagamento.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {pagamento.numeroParcela}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(pagamento.dataVencimento)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(pagamento.valorPrevisto)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {pagamento.valorPago ? formatCurrency(pagamento.valorPago) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            pagamento.status === 'quitado' ? 'bg-green-100 text-green-800' :
                            pagamento.status === 'em_dia' ? 'bg-blue-100 text-blue-800' :
                            pagamento.status === 'atraso' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {pagamento.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {pagamento.diasAtraso > 0 ? `${pagamento.diasAtraso} dias` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Aba Valorização */}
          {abaAtiva === 'valorizacao' && (
            <div className="space-y-6">
              <div className="card p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <ArrowTrendingUpIcon className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Valorização da Unidade</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Valor Atual</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(contrato.unidade.valorAtual)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Valor Original</p>
                    <p className="text-2xl font-bold text-gray-600">
                      {formatCurrency(contrato.financeiro.valorTotal)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Valorização</p>
                    <p className={`text-2xl font-bold ${
                      contrato.unidade.percentualValorizacao >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {contrato.unidade.percentualValorizacao >= 0 ? '+' : ''}{contrato.unidade.percentualValorizacao.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>

              {contrato.unidade.historicoValorizacao.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Avaliações</h3>
                  <div className="space-y-3">
                    {contrato.unidade.historicoValorizacao.map((historico) => (
                      <div key={historico.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">
                            {formatDate(historico.data)}
                          </p>
                          <p className="text-sm text-gray-600 capitalize">
                            Fonte: {historico.fonte.replace('_', ' ')}
                          </p>
                          {historico.observacoes && (
                            <p className="text-sm text-gray-500">{historico.observacoes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            {formatCurrency(historico.valorAvaliacao)}
                          </p>
                          <p className={`text-sm ${
                            historico.percentualValorizacao >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {historico.percentualValorizacao >= 0 ? '+' : ''}{historico.percentualValorizacao.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Aba Documentos */}
          {abaAtiva === 'documentos' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Documentos do Contrato */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentos do Contrato</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-gray-900">Contrato Principal</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800">
                        <DocumentArrowDownIcon className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {contrato.documentos.aditivos.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <DocumentTextIcon className="w-5 h-5 text-gray-600" />
                          <span className="font-medium text-gray-900">Aditivo {index + 1}</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800">
                          <DocumentArrowDownIcon className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documentos do Cliente */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentos do Cliente</h3>
                  <div className="space-y-3">
                    {contrato.documentos.documentosCliente.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <DocumentTextIcon className="w-5 h-5 text-gray-600" />
                          <span className="font-medium text-gray-900">Documento {index + 1}</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800">
                          <DocumentArrowDownIcon className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalDetalhesContrato;