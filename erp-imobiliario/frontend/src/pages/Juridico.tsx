import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  DocumentDuplicateIcon,
  PencilSquareIcon,
  MapIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

// Novos componentes do módulo jurídico
import MapaDisponibilidadeComponent from '../components/juridico/MapaDisponibilidade';
import ModalDetalhesContrato from '../components/juridico/ModalDetalhesContrato';

// Mock data e tipos
import { 
  mockContratos, 
  mockMapaDisponibilidade, 
  mockEmpreendimentos,
  calcularRelatorioJuridico 
} from '../data/mock-juridico';
import { ContratoJuridico, UnidadeContrato, DisponibilidadeUnidade } from '../types/juridico';

// Types
interface Cliente {
  id: string;
  nome: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
}

interface Imovel {
  id: string;
  codigo: string;
  endereco: string;
  empreendimento: string;
}

interface MinutaTemplate {
  id: string;
  nome: string;
  tipo: 'venda' | 'reserva' | 'locacao' | 'permuta' | 'administracao';
  descricao: string;
  conteudo: string;
  variaveis: VariavelMinuta[];
  dataAtualizacao: string;
  ativo: boolean;
  categoria: 'contrato' | 'termo' | 'declaracao' | 'procuracao';
}

interface VariavelMinuta {
  id: string;
  nome: string;
  tipo: 'texto' | 'numero' | 'data' | 'moeda' | 'cpf' | 'cnpj' | 'endereco';
  obrigatoria: boolean;
  valorPadrao?: string;
  descricao: string;
}

interface Contrato {
  id: string;
  numero: string;
  tipo: 'venda' | 'reserva' | 'locacao' | 'permuta' | 'administracao';
  status: 'rascunho' | 'pendente' | 'em_vigor' | 'finalizado' | 'rescindido';
  cliente: Cliente;
  incorporadora: {
    id: string;
    nome: string;
  };
  imovel: Imovel;
  valores: {
    valorTotal: number;
    valorPago: number;
    saldoDevedor: number;
    formaPagamento: string;
  };
  datas: {
    assinatura?: string;
    inicio: string;
    fim?: string;
    proximoVencimento?: string;
  };
  clausulas: {
    reajuste?: string;
    multa?: number;
    observacoes?: string;
  };
  minutaUsada: string;
  versao: number;
  documentos: string[];
  dataInclusao: string;
  dataAtualizacao: string;
  assinaturaDigital: {
    cliente: boolean;
    incorporadora: boolean;
    dataAssinatura?: string;
  };
}

// Mock data
const mockMinutas: MinutaTemplate[] = [
  {
    id: '1',
    nome: 'Contrato de Compra e Venda Residencial',
    tipo: 'venda',
    categoria: 'contrato',
    descricao: 'Modelo padrão para venda de imóveis residenciais com financiamento',
    conteudo: `INSTRUMENTO PARTICULAR DE PROMESSA DE COMPRA E VENDA DE IMÓVEL

PROMITENTE VENDEDOR: {{nomeIncorporadora}}, inscrita no CNPJ sob o nº {{cnpjIncorporadora}}, com sede na {{enderecoIncorporadora}}

PROMITENTE COMPRADOR: {{nomeCliente}}, {{estadoCivil}}, {{profissao}}, portador do CPF nº {{cpfCliente}}, RG nº {{rgCliente}}, residente e domiciliado na {{enderecoCliente}}

DO IMÓVEL: {{tipoImovel}} localizado na {{enderecoImovel}}, {{complementoEndereco}}, com área privativa de {{areaPrivativa}}m², {{numeroVagas}} vaga(s) de garagem.

DO PREÇO: O valor total do imóvel é de {{valorTotal}} ({{valorTotalExtenso}}), a ser pago da seguinte forma:
- Entrada: {{valorEntrada}} ({{entradaExtenso}})
- Saldo: {{valorSaldo}} em {{numeroParcelas}} parcelas de {{valorParcela}}

DAS CONDIÇÕES: {{condicoesPagamento}}

Local e Data: {{cidade}}, {{dataContrato}}

____________________                    ____________________
Promitente Vendedor                     Promitente Comprador`,
    variaveis: [
      { id: 'nomeIncorporadora', nome: 'Nome da Incorporadora', tipo: 'texto', obrigatoria: true, descricao: 'Razão social da incorporadora' },
      { id: 'cnpjIncorporadora', nome: 'CNPJ da Incorporadora', tipo: 'cnpj', obrigatoria: true, descricao: 'CNPJ da incorporadora' },
      { id: 'enderecoIncorporadora', nome: 'Endereço da Incorporadora', tipo: 'endereco', obrigatoria: true, descricao: 'Endereço completo da incorporadora' },
      { id: 'nomeCliente', nome: 'Nome do Cliente', tipo: 'texto', obrigatoria: true, descricao: 'Nome completo do comprador' },
      { id: 'estadoCivil', nome: 'Estado Civil', tipo: 'texto', obrigatoria: true, descricao: 'Estado civil do comprador' },
      { id: 'profissao', nome: 'Profissão', tipo: 'texto', obrigatoria: true, descricao: 'Profissão do comprador' },
      { id: 'cpfCliente', nome: 'CPF do Cliente', tipo: 'cpf', obrigatoria: true, descricao: 'CPF do comprador' },
      { id: 'rgCliente', nome: 'RG do Cliente', tipo: 'texto', obrigatoria: true, descricao: 'RG do comprador' },
      { id: 'enderecoCliente', nome: 'Endereço do Cliente', tipo: 'endereco', obrigatoria: true, descricao: 'Endereço completo do comprador' },
      { id: 'tipoImovel', nome: 'Tipo do Imóvel', tipo: 'texto', obrigatoria: true, descricao: 'Apartamento, Casa, Sala, etc.' },
      { id: 'enderecoImovel', nome: 'Endereço do Imóvel', tipo: 'endereco', obrigatoria: true, descricao: 'Endereço completo do imóvel' },
      { id: 'complementoEndereco', nome: 'Complemento do Endereço', tipo: 'texto', obrigatoria: false, descricao: 'Bloco, Andar, Unidade, etc.' },
      { id: 'areaPrivativa', nome: 'Área Privativa', tipo: 'numero', obrigatoria: true, descricao: 'Área privativa em m²' },
      { id: 'numeroVagas', nome: 'Número de Vagas', tipo: 'numero', obrigatoria: true, descricao: 'Quantidade de vagas de garagem' },
      { id: 'valorTotal', nome: 'Valor Total', tipo: 'moeda', obrigatoria: true, descricao: 'Valor total do imóvel' },
      { id: 'valorTotalExtenso', nome: 'Valor Total por Extenso', tipo: 'texto', obrigatoria: true, descricao: 'Valor total escrito por extenso' },
      { id: 'valorEntrada', nome: 'Valor da Entrada', tipo: 'moeda', obrigatoria: true, descricao: 'Valor da entrada' },
      { id: 'entradaExtenso', nome: 'Entrada por Extenso', tipo: 'texto', obrigatoria: true, descricao: 'Valor da entrada por extenso' },
      { id: 'valorSaldo', nome: 'Valor do Saldo', tipo: 'moeda', obrigatoria: true, descricao: 'Valor do saldo devedor' },
      { id: 'numeroParcelas', nome: 'Número de Parcelas', tipo: 'numero', obrigatoria: true, descricao: 'Quantidade de parcelas' },
      { id: 'valorParcela', nome: 'Valor da Parcela', tipo: 'moeda', obrigatoria: true, descricao: 'Valor de cada parcela' },
      { id: 'condicoesPagamento', nome: 'Condições de Pagamento', tipo: 'texto', obrigatoria: true, descricao: 'Detalhes das condições de pagamento' },
      { id: 'cidade', nome: 'Cidade', tipo: 'texto', obrigatoria: true, descricao: 'Cidade onde o contrato é assinado' },
      { id: 'dataContrato', nome: 'Data do Contrato', tipo: 'data', obrigatoria: true, descricao: 'Data de assinatura do contrato' }
    ],
    dataAtualizacao: '2024-12-13',
    ativo: true
  },
  {
    id: '2',
    nome: 'Termo de Reserva de Unidade',
    tipo: 'reserva',
    categoria: 'termo',
    descricao: 'Termo de reserva com sinal de entrada para garantir unidade',
    conteudo: `TERMO DE RESERVA DE UNIDADE

EMPREENDIMENTO: {{nomeEmpreendimento}}
INCORPORADORA: {{nomeIncorporadora}}, CNPJ: {{cnpjIncorporadora}}

RESERVANTE: {{nomeCliente}}, CPF: {{cpfCliente}}, E-mail: {{emailCliente}}, Telefone: {{telefoneCliente}}
Endereço: {{enderecoCliente}}

UNIDADE RESERVADA:
- Número: {{numeroUnidade}}
- Tipologia: {{tipologiaUnidade}}
- Área Privativa: {{areaPrivativa}}m²
- Vagas de Garagem: {{numeroVagas}}
- Valor: {{valorUnidade}}

CONDIÇÃO DE PAGAMENTO:
{{condicaoPagamento}}
- Entrada: {{valorEntrada}} ({{percentualEntrada}}%)
{{parcelasInfo}}

VALOR DA RESERVA: {{valorReserva}}
PRAZO DE RESERVA: {{prazoReserva}} dias

OBSERVAÇÕES:
{{observacoes}}

Esta reserva garante ao reservante a preferência na aquisição da unidade pelo prazo estipulado.

Local e Data: {{cidade}}, {{dataReserva}}

____________________                    ____________________
Incorporadora                           Reservante`,
    variaveis: [
      { id: 'nomeEmpreendimento', nome: 'Nome do Empreendimento', tipo: 'texto', obrigatoria: true, descricao: 'Nome do empreendimento' },
      { id: 'nomeIncorporadora', nome: 'Nome da Incorporadora', tipo: 'texto', obrigatoria: true, descricao: 'Razão social da incorporadora' },
      { id: 'cnpjIncorporadora', nome: 'CNPJ da Incorporadora', tipo: 'cnpj', obrigatoria: true, descricao: 'CNPJ da incorporadora' },
      { id: 'nomeCliente', nome: 'Nome do Cliente', tipo: 'texto', obrigatoria: true, descricao: 'Nome completo do reservante' },
      { id: 'cpfCliente', nome: 'CPF do Cliente', tipo: 'cpf', obrigatoria: true, descricao: 'CPF do reservante' },
      { id: 'emailCliente', nome: 'E-mail do Cliente', tipo: 'texto', obrigatoria: true, descricao: 'E-mail do reservante' },
      { id: 'telefoneCliente', nome: 'Telefone do Cliente', tipo: 'texto', obrigatoria: true, descricao: 'Telefone do reservante' },
      { id: 'enderecoCliente', nome: 'Endereço do Cliente', tipo: 'endereco', obrigatoria: true, descricao: 'Endereço completo do reservante' },
      { id: 'numeroUnidade', nome: 'Número da Unidade', tipo: 'texto', obrigatoria: true, descricao: 'Número ou identificação da unidade' },
      { id: 'tipologiaUnidade', nome: 'Tipologia da Unidade', tipo: 'texto', obrigatoria: true, descricao: '1 quarto, 2 quartos, etc.' },
      { id: 'areaPrivativa', nome: 'Área Privativa', tipo: 'numero', obrigatoria: true, descricao: 'Área privativa em m²' },
      { id: 'numeroVagas', nome: 'Número de Vagas', tipo: 'numero', obrigatoria: true, descricao: 'Quantidade de vagas de garagem' },
      { id: 'valorUnidade', nome: 'Valor da Unidade', tipo: 'moeda', obrigatoria: true, descricao: 'Valor total da unidade' },
      { id: 'condicaoPagamento', nome: 'Condição de Pagamento', tipo: 'texto', obrigatoria: true, descricao: 'Descrição da condição de pagamento' },
      { id: 'valorEntrada', nome: 'Valor da Entrada', tipo: 'moeda', obrigatoria: true, descricao: 'Valor da entrada' },
      { id: 'percentualEntrada', nome: 'Percentual da Entrada', tipo: 'numero', obrigatoria: true, descricao: 'Percentual da entrada' },
      { id: 'parcelasInfo', nome: 'Informações das Parcelas', tipo: 'texto', obrigatoria: false, descricao: 'Detalhes sobre parcelamento' },
      { id: 'valorReserva', nome: 'Valor da Reserva', tipo: 'moeda', obrigatoria: true, descricao: 'Valor pago para reservar' },
      { id: 'prazoReserva', nome: 'Prazo da Reserva', tipo: 'numero', obrigatoria: true, descricao: 'Prazo em dias para reserva' },
      { id: 'observacoes', nome: 'Observações', tipo: 'texto', obrigatoria: false, descricao: 'Observações adicionais' },
      { id: 'cidade', nome: 'Cidade', tipo: 'texto', obrigatoria: true, descricao: 'Cidade onde é assinado' },
      { id: 'dataReserva', nome: 'Data da Reserva', tipo: 'data', obrigatoria: true, descricao: 'Data da reserva' }
    ],
    dataAtualizacao: '2024-12-13',
    ativo: true
  },
  {
    id: '3',
    nome: 'Contrato de Locação Residencial',
    tipo: 'locacao',
    categoria: 'contrato',
    descricao: 'Modelo completo para contratos de aluguel residencial',
    conteudo: `CONTRATO DE LOCAÇÃO RESIDENCIAL

LOCADOR: {{nomeProprietario}}, CPF: {{cpfProprietario}}, RG: {{rgProprietario}}
Endereço: {{enderecoProprietario}}

LOCATÁRIO: {{nomeLocatario}}, CPF: {{cpfLocatario}}, RG: {{rgLocatario}}
Endereço: {{enderecoLocatario}}

IMÓVEL: {{tipoImovel}} localizado na {{enderecoImovel}}
Área: {{areaImovel}}m² - {{caracteristicasImovel}}

VALOR DO ALUGUEL: {{valorAluguel}} mensais
REAJUSTE: {{indiceReajuste}} anualmente
DEPÓSITO CAUÇÃO: {{valorDeposito}}

PRAZO: {{prazoLocacao}} meses, de {{dataInicio}} a {{dataFim}}

VENCIMENTO: Todo dia {{diaVencimento}} de cada mês

Local e Data: {{cidade}}, {{dataContrato}}`,
    variaveis: [
      { id: 'nomeProprietario', nome: 'Nome do Proprietário', tipo: 'texto', obrigatoria: true, descricao: 'Nome completo do locador' },
      { id: 'cpfProprietario', nome: 'CPF do Proprietário', tipo: 'cpf', obrigatoria: true, descricao: 'CPF do locador' },
      { id: 'rgProprietario', nome: 'RG do Proprietário', tipo: 'texto', obrigatoria: true, descricao: 'RG do locador' },
      { id: 'enderecoProprietario', nome: 'Endereço do Proprietário', tipo: 'endereco', obrigatoria: true, descricao: 'Endereço do locador' },
      { id: 'nomeLocatario', nome: 'Nome do Locatário', tipo: 'texto', obrigatoria: true, descricao: 'Nome completo do locatário' },
      { id: 'cpfLocatario', nome: 'CPF do Locatário', tipo: 'cpf', obrigatoria: true, descricao: 'CPF do locatário' },
      { id: 'rgLocatario', nome: 'RG do Locatário', tipo: 'texto', obrigatoria: true, descricao: 'RG do locatário' },
      { id: 'enderecoLocatario', nome: 'Endereço do Locatário', tipo: 'endereco', obrigatoria: true, descricao: 'Endereço do locatário' },
      { id: 'tipoImovel', nome: 'Tipo do Imóvel', tipo: 'texto', obrigatoria: true, descricao: 'Casa, apartamento, etc.' },
      { id: 'enderecoImovel', nome: 'Endereço do Imóvel', tipo: 'endereco', obrigatoria: true, descricao: 'Endereço completo do imóvel' },
      { id: 'areaImovel', nome: 'Área do Imóvel', tipo: 'numero', obrigatoria: true, descricao: 'Área em m²' },
      { id: 'caracteristicasImovel', nome: 'Características do Imóvel', tipo: 'texto', obrigatoria: true, descricao: 'Quartos, banheiros, etc.' },
      { id: 'valorAluguel', nome: 'Valor do Aluguel', tipo: 'moeda', obrigatoria: true, descricao: 'Valor mensal do aluguel' },
      { id: 'indiceReajuste', nome: 'Índice de Reajuste', tipo: 'texto', obrigatoria: true, descricao: 'IPCA, IGP-M, etc.' },
      { id: 'valorDeposito', nome: 'Valor do Depósito', tipo: 'moeda', obrigatoria: true, descricao: 'Valor do depósito caução' },
      { id: 'prazoLocacao', nome: 'Prazo da Locação', tipo: 'numero', obrigatoria: true, descricao: 'Prazo em meses' },
      { id: 'dataInicio', nome: 'Data de Início', tipo: 'data', obrigatoria: true, descricao: 'Data de início da locação' },
      { id: 'dataFim', nome: 'Data de Fim', tipo: 'data', obrigatoria: true, descricao: 'Data de fim da locação' },
      { id: 'diaVencimento', nome: 'Dia do Vencimento', tipo: 'numero', obrigatoria: true, descricao: 'Dia do mês para vencimento' },
      { id: 'cidade', nome: 'Cidade', tipo: 'texto', obrigatoria: true, descricao: 'Cidade da assinatura' },
      { id: 'dataContrato', nome: 'Data do Contrato', tipo: 'data', obrigatoria: true, descricao: 'Data da assinatura' }
    ],
    dataAtualizacao: '2024-12-13',
    ativo: true
  }
];

const mockContratosSimples: Contrato[] = [
  {
    id: '1',
    numero: 'CT-2024-001',
    tipo: 'venda',
    status: 'em_vigor',
    cliente: {
      id: '1',
      nome: 'João Silva Santos',
      cpfCnpj: '123.456.789-00',
      email: 'joao.silva@email.com',
      telefone: '(11) 99999-9999'
    },
    incorporadora: {
      id: '1',
      nome: 'Construtora Premium Ltda'
    },
    imovel: {
      id: '1',
      codigo: 'AP-101-A',
      endereco: 'Rua das Flores, 123 - Apto 101 Bloco A',
      empreendimento: 'Residencial Jardim das Flores'
    },
    valores: {
      valorTotal: 450000,
      valorPago: 180000,
      saldoDevedor: 270000,
      formaPagamento: 'Financiamento + Recursos Próprios'
    },
    datas: {
      assinatura: '2024-03-15',
      inicio: '2024-03-15',
      fim: '2026-03-15',
      proximoVencimento: '2024-08-15'
    },
    clausulas: {
      reajuste: 'INCC até entrega das chaves, IPCA após',
      multa: 2,
      observacoes: 'Entrega prevista para dezembro/2025'
    },
    minutaUsada: 'Contrato de Compra e Venda Padrão',
    versao: 2,
    documentos: ['CT-2024-001_v2.pdf', 'RG_Cliente.pdf', 'CPF_Cliente.pdf'],
    dataInclusao: '2024-03-10',
    dataAtualizacao: '2024-07-20',
    assinaturaDigital: {
      cliente: true,
      incorporadora: true,
      dataAssinatura: '2024-03-15'
    }
  },
  {
    id: '2',
    numero: 'TR-2024-005',
    tipo: 'reserva',
    status: 'pendente',
    cliente: {
      id: '2',
      nome: 'Maria Oliveira Costa',
      cpfCnpj: '987.654.321-00',
      email: 'maria.costa@email.com',
      telefone: '(11) 98888-8888'
    },
    incorporadora: {
      id: '1',
      nome: 'Construtora Premium Ltda'
    },
    imovel: {
      id: '2',
      codigo: 'AP-205-B',
      endereco: 'Av. Central, 456 - Apto 205 Bloco B',
      empreendimento: 'Edifício Harmony'
    },
    valores: {
      valorTotal: 380000,
      valorPago: 38000,
      saldoDevedor: 342000,
      formaPagamento: 'Sinal + Financiamento'
    },
    datas: {
      inicio: '2024-07-20',
      proximoVencimento: '2024-08-20'
    },
    clausulas: {
      observacoes: 'Prazo de reserva: 30 dias'
    },
    minutaUsada: 'Termo de Reserva',
    versao: 1,
    documentos: ['TR-2024-005_v1.pdf'],
    dataInclusao: '2024-07-20',
    dataAtualizacao: '2024-07-20',
    assinaturaDigital: {
      cliente: false,
      incorporadora: false
    }
  }
];

const Juridico: React.FC = () => {
  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="flex-1 overflow-y-auto p-6 min-h-0">
        <Routes>
          <Route index element={<JuridicoOverview />} />
          <Route path="contratos" element={<ContratosList />} />
          <Route path="mapa" element={<MapaContratos />} />
          <Route path="minutas" element={<MinutasList />} />
          <Route path="vencimentos" element={<VencimentosList />} />
          <Route path="contratos/novo" element={<ContratoForm />} />
          <Route path="contratos/:id/editar" element={<ContratoForm />} />
          <Route path="contratos/:id" element={<ContratoDetails />} />
          <Route path="minutas/nova" element={<MinutaForm />} />
          <Route path="minutas/:id/editar" element={<MinutaForm />} />
        </Routes>
      </div>
    </div>
  );
};

// Novo componente: Mapa de Contratos
const MapaContratos: React.FC = () => {
  const navigate = useNavigate();
  const [contratoSelecionado, setContratoSelecionado] = useState<ContratoJuridico | null>(null);
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [filtros, setFiltros] = useState({});

  const handleUnidadeSelect = (unidade: UnidadeContrato & DisponibilidadeUnidade) => {
    if (unidade.contrato) {
      const contrato = mockContratosSimples.find(c => c.id === unidade.contrato?.id);
      if (contrato) {
        // Converter Contrato simples para ContratoJuridico se necessário
        // Por enquanto, usar o contrato dos dados jurídicos
        const contratoJuridico = mockContratos.find(c => c.numero === contrato.numero);
        setContratoSelecionado(contratoJuridico || null);
        setModalDetalhesAberto(true);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mapa de Contratos</h1>
          <p className="text-gray-600">Visualização por empreendimento com status de contratos</p>
        </div>
        <button onClick={() => navigate('/juridico')} className="btn-outline">
          Voltar
        </button>
      </div>

      <MapaDisponibilidadeComponent
        empreendimentos={mockMapaDisponibilidade}
        onUnidadeSelect={handleUnidadeSelect}
        onFiltroChange={setFiltros}
        filtros={filtros}
      />

      <ModalDetalhesContrato
        contrato={contratoSelecionado}
        isOpen={modalDetalhesAberto}
        onClose={() => {
          setModalDetalhesAberto(false);
          setContratoSelecionado(null);
        }}
        onEdit={(contrato) => {
          navigate(`/juridico/contratos/${contrato.id}/editar`);
        }}
        onRegistrarPagamento={(contrato) => {
          console.log('Registrar pagamento para:', contrato.numero);
        }}
      />
    </div>
  );
};

// Overview do módulo
const JuridicoOverview: React.FC = () => {
  const navigate = useNavigate();
  const [contratos] = useState<ContratoJuridico[]>(mockContratos);
  const [minutas] = useState<MinutaTemplate[]>(mockMinutas);
  const relatorio = calcularRelatorioJuridico();

  const estatisticas = {
    contratosAtivos: contratos.filter(c => c.status === 'ativo').length,
    contratosPendentes: contratos.filter(c => c.status === 'rascunho').length,
    vencimentosProximos: contratos.filter(c => {
      // Usar próximo reajuste como aproximação para vencimento próximo
      if (!c.datas.proximoReajuste) return false;
      const hoje = new Date();
      const vencimento = new Date(c.datas.proximoReajuste);
      const diffDias = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 3600 * 24));
      return diffDias <= 30 && diffDias >= 0;
    }).length,
    minutasAtivas: minutas.filter(m => m.ativo).length,
    totalContratos: contratos.length
  };

  const cards = [
    {
      titulo: 'Contratos Ativos',
      valor: estatisticas.contratosAtivos,
      href: '/juridico/contratos',
      icon: DocumentTextIcon,
      cor: 'text-green-600',
      corFundo: 'bg-green-50',
      descricao: 'Contratos em vigor'
    },
    {
      titulo: 'Pendentes',
      valor: estatisticas.contratosPendentes,
      href: '/juridico/contratos',
      icon: ClockIcon,
      cor: 'text-yellow-600',
      corFundo: 'bg-yellow-50',
      descricao: 'Aguardando assinatura'
    },
    {
      titulo: 'Vencimentos',
      valor: estatisticas.vencimentosProximos,
      href: '/juridico/vencimentos',
      icon: ExclamationTriangleIcon,
      cor: 'text-red-600',
      corFundo: 'bg-red-50',
      descricao: 'Próximos 30 dias'
    },
    {
      titulo: 'Minutas',
      valor: estatisticas.minutasAtivas,
      href: '/juridico/minutas',
      icon: PencilSquareIcon,
      cor: 'text-blue-600',
      corFundo: 'bg-blue-50',
      descricao: 'Templates ativos'
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Módulo Jurídico</h1>
          <p className="text-gray-600">Gestão de contratos e documentos legais</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/juridico/contratos/novo')}
            className="btn-primary"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Contrato
          </button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const IconComponent = card.icon;
          return (
            <button
              key={card.titulo}
              onClick={() => navigate(card.href)}
              className="card card-hover p-6 text-left"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${card.corFundo}`}>
                  <IconComponent className={`h-6 w-6 ${card.cor}`} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{card.titulo}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {typeof card.valor === 'string' ? card.valor : card.valor}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-3">{card.descricao}</p>
            </button>
          );
        })}
      </div>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Financeiro</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Valor Total em Contratos:</span>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(contratos.reduce((sum, c) => sum + c.financeiro.valorTotal, 0))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Valor Recebido:</span>
              <span className="text-lg font-semibold text-blue-600">
                {formatCurrency(contratos.reduce((sum, c) => sum + c.financeiro.valorPago, 0))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Saldo a Receber:</span>
              <span className="text-lg font-semibold text-orange-600">
                {formatCurrency(contratos.reduce((sum, c) => sum + c.financeiro.saldoDevedor, 0))}
              </span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/juridico/contratos/novo')}
              className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <span className="text-blue-700 font-medium">Novo Contrato</span>
              <PlusIcon className="h-5 w-5 text-blue-500" />
            </button>
            <button
              onClick={() => navigate('/juridico/minutas/nova')}
              className="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <span className="text-green-700 font-medium">Nova Minuta</span>
              <PlusIcon className="h-5 w-5 text-green-500" />
            </button>
            <button
              onClick={() => navigate('/juridico/vencimentos')}
              className="w-full flex items-center justify-between p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <span className="text-orange-700 font-medium">Ver Vencimentos</span>
              <ClockIcon className="h-5 w-5 text-orange-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Contratos Recentes */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Contratos Recentes</h3>
            <button
              onClick={() => navigate('/juridico/contratos')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Ver todos
            </button>
          </div>
        </div>
        <div className="overflow-x-auto bg-white rounded-lg shadow border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Número</th>
                <th className="table-header-cell">Cliente</th>
                <th className="table-header-cell">Imóvel</th>
                <th className="table-header-cell">Valor</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Ações</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {contratos.slice(0, 5).map((contrato) => (
                <tr key={contrato.id} className="table-row">
                  <td className="table-cell">
                    <div className="font-medium text-gray-900">{contrato.numero}</div>
                    <div className="text-sm text-gray-500">{contrato.tipo}</div>
                  </td>
                  <td className="table-cell">
                    <div className="font-medium text-gray-900">{contrato.cliente.nome}</div>
                    <div className="text-sm text-gray-500">{contrato.cliente.cpfCnpj}</div>
                  </td>
                  <td className="table-cell">
                    <div className="font-medium text-gray-900">{contrato.unidade.codigo}</div>
                    <div className="text-sm text-gray-500">{contrato.unidade.empreendimentoNome}</div>
                  </td>
                  <td className="table-cell">
                    <div className="font-medium text-green-600">
                      {formatCurrency(contrato.financeiro.valorTotal)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Pago: {formatCurrency(contrato.financeiro.valorPago)}
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${
                      contrato.status === 'ativo' ? 'badge-success' :
                      contrato.status === 'rascunho' ? 'badge-warning' :
                      contrato.status === 'quitado' ? 'badge-info' :
                      'badge-danger'
                    }`}>
                      {contrato.status === 'ativo' ? 'Ativo' :
                       contrato.status === 'rascunho' ? 'Rascunho' :
                       contrato.status === 'quitado' ? 'Quitado' : 
                       contrato.status === 'suspenso' ? 'Suspenso' :
                       contrato.status === 'distratado' ? 'Distratado' : 'Rescindido'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/juridico/contratos/${contrato.id}`)}
                        className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                        title="Ver detalhes"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded"
                        title="Download PDF"
                      >
                        <DocumentArrowDownIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Função para processar variáveis na minuta
const processarMinuta = (conteudo: string, variaveis: Record<string, any>): string => {
  let conteudoProcessado = conteudo;
  
  Object.keys(variaveis).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    conteudoProcessado = conteudoProcessado.replace(regex, variaveis[key] || `[${key}]`);
  });
  
  return conteudoProcessado;
};

// Lista de Contratos
const ContratosList: React.FC = () => {
  const navigate = useNavigate();
  const [contratos, setContratos] = useState<Contrato[]>(mockContratosSimples);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [tipoFilter, setTipoFilter] = useState<string>('todos');

  const filteredContratos = contratos.filter(contrato => {
    const matchesSearch = 
      contrato.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrato.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrato.imovel.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || contrato.status === statusFilter;
    const matchesTipo = tipoFilter === 'todos' || contrato.tipo === tipoFilter;
    
    return matchesSearch && matchesStatus && matchesTipo;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contratos</h1>
            <p className="text-gray-600">Gerencie todos os contratos jurídicos</p>
          </div>
          <div className="flex space-x-3">
          <button
            onClick={() => navigate('/juridico/contratos/novo')}
            className="btn-primary"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Contrato
          </button>
          <button
            onClick={() => navigate('/juridico')}
            className="btn-outline"
          >
            Voltar
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por número, cliente, imóvel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input"
          >
            <option value="todos">Todos os Status</option>
            <option value="rascunho">Rascunho</option>
            <option value="pendente">Pendente</option>
            <option value="em_vigor">Em Vigor</option>
            <option value="finalizado">Finalizado</option>
            <option value="rescindido">Rescindido</option>
          </select>

          <select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
            className="form-input"
          >
            <option value="todos">Todos os Tipos</option>
            <option value="venda">Venda</option>
            <option value="reserva">Reserva</option>
            <option value="locacao">Locação</option>
            <option value="permuta">Permuta</option>
            <option value="administracao">Administração</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('todos');
              setTipoFilter('todos');
            }}
            className="btn-outline"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Contratos Grid */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        {filteredContratos.map((contrato) => (
          <div key={contrato.id} className="card card-hover">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{contrato.numero}</h3>
                  <p className="text-sm text-gray-500">Versão {contrato.versao}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`badge ${
                    contrato.status === 'em_vigor' ? 'badge-success' :
                    contrato.status === 'pendente' ? 'badge-warning' :
                    contrato.status === 'finalizado' ? 'badge-info' :
                    contrato.status === 'rascunho' ? 'badge-gray' : 'badge-danger'
                  }`}>
                    {contrato.status === 'em_vigor' ? 'Em Vigor' :
                     contrato.status === 'pendente' ? 'Pendente' :
                     contrato.status === 'finalizado' ? 'Finalizado' :
                     contrato.status === 'rascunho' ? 'Rascunho' : 'Rescindido'}
                  </span>
                  <span className="badge badge-info">{contrato.tipo}</span>
                </div>
              </div>

              {/* Cliente e Imóvel */}
              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Cliente:</p>
                  <p className="font-medium text-gray-900">{contrato.cliente.nome}</p>
                  <p className="text-sm text-gray-600">{contrato.cliente.cpfCnpj}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Imóvel:</p>
                  <p className="font-medium text-gray-900">{contrato.imovel.codigo}</p>
                  <p className="text-sm text-gray-600">{contrato.imovel.empreendimento}</p>
                </div>
              </div>

              {/* Valores */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Valor Total:</span>
                    <p className="font-semibold text-green-600">
                      {formatCurrency(contrato.valores.valorTotal)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Saldo Devedor:</span>
                    <p className="font-semibold text-orange-600">
                      {formatCurrency(contrato.valores.saldoDevedor)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Datas */}
              <div className="space-y-2 mb-4 text-sm">
                {contrato.datas.assinatura && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Assinatura:</span>
                    <span>{new Date(contrato.datas.assinatura).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
                {contrato.datas.proximoVencimento && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Próx. Vencimento:</span>
                    <span className="text-orange-600 font-medium">
                      {new Date(contrato.datas.proximoVencimento).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
              </div>

              {/* Assinatura Digital */}
              <div className="flex items-center justify-between mb-4 p-2 bg-blue-50 rounded">
                <span className="text-sm text-blue-700">Assinatura Digital:</span>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {contrato.assinaturaDigital.cliente ? (
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-xs text-blue-600 ml-1">Cliente</span>
                  </div>
                  <div className="flex items-center">
                    {contrato.assinaturaDigital.incorporadora ? (
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-xs text-blue-600 ml-1">Incorporadora</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/juridico/contratos/${contrato.id}`)}
                    className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                    title="Ver detalhes"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => navigate(`/juridico/contratos/${contrato.id}/editar`)}
                    className="text-yellow-600 hover:text-yellow-800 p-1 hover:bg-yellow-50 rounded"
                    title="Editar"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>

                  <button
                    className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded"
                    title="Download PDF"
                  >
                    <DocumentArrowDownIcon className="h-4 w-4" />
                  </button>

                  <button
                    className="text-purple-600 hover:text-purple-800 p-1 hover:bg-purple-50 rounded"
                    title="Duplicar"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (confirm('Tem certeza que deseja excluir este contrato?')) {
                      setContratos(prev => prev.filter(c => c.id !== contrato.id));
                    }
                  }}
                  className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                  title="Excluir"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
        {filteredContratos.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum contrato encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'todos' || tipoFilter !== 'todos'
                ? 'Tente ajustar os filtros de busca.'
                : 'Comece criando seu primeiro contrato.'}
            </p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

// Lista de Minutas
const MinutasList: React.FC = () => {
  const navigate = useNavigate();
  const [minutas, setMinutas] = useState<MinutaTemplate[]>(mockMinutas);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState<string>('todos');
  const [categoriaFilter, setCategoriaFilter] = useState<string>('todos');

  const filteredMinutas = minutas.filter(minuta => {
    const matchesSearch = 
      minuta.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      minuta.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo = tipoFilter === 'todos' || minuta.tipo === tipoFilter;
    const matchesCategoria = categoriaFilter === 'todos' || minuta.categoria === categoriaFilter;
    
    return matchesSearch && matchesTipo && matchesCategoria;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minutas de Contratos</h1>
          <p className="text-gray-600">Templates editáveis para geração automática de documentos</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/juridico/minutas/nova')}
            className="btn-primary"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nova Minuta
          </button>
          <button
            onClick={() => navigate('/juridico')}
            className="btn-outline"
          >
            Voltar
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar minutas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>

          <select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
            className="form-input"
          >
            <option value="todos">Todos os Tipos</option>
            <option value="venda">Venda</option>
            <option value="reserva">Reserva</option>
            <option value="locacao">Locação</option>
            <option value="permuta">Permuta</option>
            <option value="administracao">Administração</option>
          </select>

          <select
            value={categoriaFilter}
            onChange={(e) => setCategoriaFilter(e.target.value)}
            className="form-input"
          >
            <option value="todos">Todas as Categorias</option>
            <option value="contrato">Contratos</option>
            <option value="termo">Termos</option>
            <option value="declaracao">Declarações</option>
            <option value="procuracao">Procurações</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setTipoFilter('todos');
              setCategoriaFilter('todos');
            }}
            className="btn-outline"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Minutas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMinutas.map((minuta) => (
          <div key={minuta.id} className="card card-hover">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{minuta.nome}</h3>
                  <p className="text-sm text-gray-500">Atualizada em {new Date(minuta.dataAtualizacao).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`badge ${
                    minuta.ativo ? 'badge-success' : 'badge-gray'
                  }`}>
                    {minuta.ativo ? 'Ativa' : 'Inativa'}
                  </span>
                  <span className="badge badge-info">{minuta.tipo}</span>
                </div>
              </div>

              {/* Descrição */}
              <p className="text-gray-600 text-sm mb-4">{minuta.descricao}</p>

              {/* Variáveis */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-2">Variáveis ({minuta.variaveis.length}):</p>
                <div className="flex flex-wrap gap-1">
                  {minuta.variaveis.slice(0, 4).map((variavel) => (
                    <span key={variavel.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {variavel.nome}
                    </span>
                  ))}
                  {minuta.variaveis.length > 4 && (
                    <span className="text-xs text-gray-500">+{minuta.variaveis.length - 4} mais</span>
                  )}
                </div>
              </div>

              {/* Categoria */}
              <div className="mb-4">
                <span className={`badge ${
                  minuta.categoria === 'contrato' ? 'badge-blue' :
                  minuta.categoria === 'termo' ? 'badge-green' :
                  minuta.categoria === 'declaracao' ? 'badge-yellow' : 'badge-purple'
                }`}>
                  {minuta.categoria.charAt(0).toUpperCase() + minuta.categoria.slice(1)}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/juridico/minutas/${minuta.id}`)}
                    className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                    title="Visualizar"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => navigate(`/juridico/minutas/${minuta.id}/editar`)}
                    className="text-yellow-600 hover:text-yellow-800 p-1 hover:bg-yellow-50 rounded"
                    title="Editar"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>

                  <button
                    className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded"
                    title="Usar Minuta"
                  >
                    <DocumentTextIcon className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (confirm('Tem certeza que deseja excluir esta minuta?')) {
                      setMinutas(prev => prev.filter(m => m.id !== minuta.id));
                    }
                  }}
                  className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                  title="Excluir"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMinutas.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma minuta encontrada</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || tipoFilter !== 'todos' || categoriaFilter !== 'todos'
              ? 'Tente ajustar os filtros de busca.'
              : 'Comece criando sua primeira minuta.'}
          </p>
        </div>
      )}
    </div>
  );
};

const VencimentosList: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vencimentos de Contratos</h1>
          <p className="text-gray-600">Acompanhamento de pagamentos e renovações</p>
        </div>
        <button onClick={() => navigate('/juridico')} className="btn-outline">Voltar</button>
      </div>
      <div className="card p-6">
        <p className="text-gray-600">Sistema de vencimentos será implementado aqui.</p>
      </div>
    </div>
  );
};

const ContratoForm: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Formulário de Contrato</h1>
          <p className="text-gray-600">Geração automática com campos variáveis</p>
        </div>
        <button onClick={() => navigate('/juridico/contratos')} className="btn-outline">Voltar</button>
      </div>
      <div className="card p-6">
        <p className="text-gray-600">Formulário completo será implementado aqui.</p>
      </div>
    </div>
  );
};

const ContratoDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id: contratoId } = useParams();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Detalhes do Contrato</h1>
          <p className="text-gray-600">Visualização completa com versionamento</p>
        </div>
        <button onClick={() => navigate('/juridico/contratos')} className="btn-outline">Voltar</button>
      </div>
      <div className="card p-6">
        <p className="text-gray-600">Detalhes completos serão implementados aqui.</p>
      </div>
    </div>
  );
};

// Formulário de Minutas
const MinutaForm: React.FC = () => {
  const navigate = useNavigate();
  const { id: minutaId } = useParams();
  const isEditing = !!minutaId;
  
  const [formData, setFormData] = useState<Partial<MinutaTemplate>>({
    nome: '',
    tipo: 'venda',
    categoria: 'contrato',
    descricao: '',
    conteudo: '',
    variaveis: [],
    ativo: true
  });
  
  const [novaVariavel, setNovaVariavel] = useState<Partial<VariavelMinuta>>({
    nome: '',
    tipo: 'texto',
    obrigatoria: true,
    descricao: ''
  });
  
  const [showVariavelForm, setShowVariavelForm] = useState(false);
  
  useEffect(() => {
    if (isEditing) {
      const minuta = mockMinutas.find(m => m.id === minutaId);
      if (minuta) {
        setFormData(minuta);
      }
    }
  }, [minutaId, isEditing]);
  
  const adicionarVariavel = () => {
    if (!novaVariavel.nome || !novaVariavel.descricao) return;
    
    const variavel: VariavelMinuta = {
      id: crypto.randomUUID(),
      nome: novaVariavel.nome,
      tipo: novaVariavel.tipo || 'texto',
      obrigatoria: novaVariavel.obrigatoria || false,
      valorPadrao: novaVariavel.valorPadrao,
      descricao: novaVariavel.descricao
    };
    
    setFormData(prev => ({
      ...prev,
      variaveis: [...(prev.variaveis || []), variavel]
    }));
    
    setNovaVariavel({ nome: '', tipo: 'texto', obrigatoria: true, descricao: '' });
    setShowVariavelForm(false);
  };
  
  const removerVariavel = (variavelId: string) => {
    setFormData(prev => ({
      ...prev,
      variaveis: prev.variaveis?.filter(v => v.id !== variavelId) || []
    }));
  };
  
  const inserirVariavelNoConteudo = (variavel: VariavelMinuta) => {
    const cursorPosition = (document.getElementById('conteudo') as HTMLTextAreaElement)?.selectionStart || 0;
    const conteudoAtual = formData.conteudo || '';
    const novoConteudo = 
      conteudoAtual.slice(0, cursorPosition) + 
      `{{${variavel.id}}}` + 
      conteudoAtual.slice(cursorPosition);
    
    setFormData(prev => ({ ...prev, conteudo: novoConteudo }));
  };
  
  const salvarMinuta = () => {
    if (!formData.nome || !formData.conteudo || !formData.variaveis?.length) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }
    
    // Aqui seria a chamada para a API
    console.log('Salvando minuta:', formData);
    alert('Minuta salva com sucesso!');
    navigate('/juridico/minutas');
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar Minuta' : 'Nova Minuta'}
          </h1>
          <p className="text-gray-600">Crie templates personalizáveis com variáveis</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={salvarMinuta} className="btn-primary">
            {isEditing ? 'Atualizar' : 'Salvar'} Minuta
          </button>
          <button onClick={() => navigate('/juridico/minutas')} className="btn-outline">
            Cancelar
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário Principal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Minuta *</label>
                <input
                  type="text"
                  value={formData.nome || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  className="form-input"
                  placeholder="Ex: Contrato de Compra e Venda"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                <select
                  value={formData.tipo || 'venda'}
                  onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as any }))}
                  className="form-input"
                >
                  <option value="venda">Venda</option>
                  <option value="reserva">Reserva</option>
                  <option value="locacao">Locação</option>
                  <option value="permuta">Permuta</option>
                  <option value="administracao">Administração</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                <select
                  value={formData.categoria || 'contrato'}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value as any }))}
                  className="form-input"
                >
                  <option value="contrato">Contrato</option>
                  <option value="termo">Termo</option>
                  <option value="declaracao">Declaração</option>
                  <option value="procuracao">Procuração</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.ativo || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Minuta Ativa</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                value={formData.descricao || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                rows={2}
                className="form-input"
                placeholder="Descreva o propósito desta minuta..."
              />
            </div>
          </div>
          
          {/* Editor de Conteúdo */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Conteúdo da Minuta</h3>
            <p className="text-sm text-gray-600 mb-4">
              Use <code className="bg-gray-100 px-1 rounded">{'{variavel}'}</code> para inserir variáveis no texto.
              Clique nas variáveis da barra lateral para inserir automaticamente.
            </p>
            
            <textarea
              id="conteudo"
              value={formData.conteudo || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, conteudo: e.target.value }))}
              rows={20}
              className="form-input font-mono text-sm"
              placeholder="Digite o conteúdo da minuta aqui..."
            />
          </div>
        </div>
        
        {/* Painel de Variáveis */}
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Variáveis ({formData.variaveis?.length || 0})</h3>
              <button
                onClick={() => setShowVariavelForm(true)}
                className="btn-primary text-xs px-3 py-1"
              >
                <PlusIcon className="w-3 h-3 mr-1" />
                Nova
              </button>
            </div>
            
            {/* Form Nova Variável */}
            {showVariavelForm && (
              <div className="border rounded-lg p-4 mb-4 bg-gray-50">
                <h4 className="font-medium mb-3">Nova Variável</h4>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Nome da variável"
                    value={novaVariavel.nome || ''}
                    onChange={(e) => setNovaVariavel(prev => ({ ...prev, nome: e.target.value }))}
                    className="form-input text-sm"
                  />
                  
                  <select
                    value={novaVariavel.tipo || 'texto'}
                    onChange={(e) => setNovaVariavel(prev => ({ ...prev, tipo: e.target.value as any }))}
                    className="form-input text-sm"
                  >
                    <option value="texto">Texto</option>
                    <option value="numero">Número</option>
                    <option value="data">Data</option>
                    <option value="moeda">Moeda</option>
                    <option value="cpf">CPF</option>
                    <option value="cnpj">CNPJ</option>
                    <option value="endereco">Endereço</option>
                  </select>
                  
                  <textarea
                    placeholder="Descrição da variável"
                    value={novaVariavel.descricao || ''}
                    onChange={(e) => setNovaVariavel(prev => ({ ...prev, descricao: e.target.value }))}
                    rows={2}
                    className="form-input text-sm"
                  />
                  
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={novaVariavel.obrigatoria || false}
                      onChange={(e) => setNovaVariavel(prev => ({ ...prev, obrigatoria: e.target.checked }))}
                      className="rounded border-gray-300 mr-2"
                    />
                    Obrigatória
                  </label>
                  
                  <div className="flex gap-2">
                    <button onClick={adicionarVariavel} className="btn-primary text-xs px-3 py-1 flex-1">
                      Adicionar
                    </button>
                    <button 
                      onClick={() => setShowVariavelForm(false)}
                      className="btn-outline text-xs px-3 py-1 flex-1"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Lista de Variáveis */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {formData.variaveis?.map((variavel) => (
                <div key={variavel.id} className="border rounded p-3 bg-white">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{variavel.nome}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => inserirVariavelNoConteudo(variavel)}
                        className="text-blue-600 hover:bg-blue-50 p-1 rounded"
                        title="Inserir no conteúdo"
                      >
                        <PlusIcon className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removerVariavel(variavel.id)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded"
                        title="Remover"
                      >
                        <TrashIcon className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">{variavel.descricao}</p>
                  <div className="flex gap-1 mt-1">
                    <span className="inline-block px-1.5 py-0.5 text-xs bg-gray-100 rounded">
                      {variavel.tipo}
                    </span>
                    {variavel.obrigatoria && (
                      <span className="inline-block px-1.5 py-0.5 text-xs bg-red-100 text-red-700 rounded">
                        Obrigatória
                      </span>
                    )}
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 text-sm text-center py-4">
                  Nenhuma variável criada ainda.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Função para obter minuta por ID (para uso em outros módulos)
export const getMinutaById = (id: string): MinutaTemplate | null => {
  return mockMinutas.find(m => m.id === id) || null;
};

// Função para processar minuta com dados (para uso em outros módulos)
export { processarMinuta };

// Export das interfaces para uso em outros módulos
export type { MinutaTemplate, VariavelMinuta };

export default Juridico;