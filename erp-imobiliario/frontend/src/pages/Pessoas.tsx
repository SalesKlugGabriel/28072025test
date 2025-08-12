import React, { useMemo, useState } from 'react'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
import {
  PlusIcon, MagnifyingGlassIcon, UserGroupIcon, UserIcon, BuildingOfficeIcon, EyeIcon, PencilIcon,
  PhoneIcon, EnvelopeIcon, MapPinIcon, TagIcon, BanknotesIcon, PhotoIcon, TrashIcon
} from '@heroicons/react/24/outline'
import { useDropzone } from 'react-dropzone'

/* ===================== Tipos ===================== */
type TipoPessoa = 'cliente' | 'lead' | 'fornecedor' | 'colaborador'

interface Endereco { logradouro: string; numero: string; bairro: string; cidade: string; cep: string; estado: string }
interface Documento { id: string; nomeArquivo: string; categoria: string; tipo: string; tamanho: string; dataUpload: string; url?: string }
interface UnidadeAdquirida {
  id: string; empreendimentoId: string; empreendimentoNome: string; unidade: string;
  valorCompra: number; valorAtual: number; status: 'quitado'|'financiamento'|'contrato'|'pendente'; dataAquisicao: string;
}
type TipoConta = 'corrente' | 'salario' | 'poupanca' | 'pagamento'
interface DadosBancarios { bancoCodigo: string; bancoNome: string; agencia: string; conta: string; tipo: TipoConta; pix?: string }

interface Pessoa {
  id: string;
  tipo: TipoPessoa;
  pessoaFisica: boolean;
  nome: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  endereco: Endereco;
  status: 'ativo'|'inativo'|'suspenso';
  tags: string[];
  observacoes: string;
  dataInclusao: string; dataAtualizacao: string;

  avatarUrl?: string;

  // PF / PJ
  dataNascimento?: string;           // PF
  razaoSocial?: string;              // PJ
  nomeFantasia?: string;             // PJ

  // Bancos
  dadosBancarios?: DadosBancarios;

  // Documentos (genérico para qualquer pessoa)
  documentos: Documento[];

  // Cliente
  unidadesAdquiridas?: UnidadeAdquirida[];

  // Colaborador
  dataAdmissao?: string;
  vencimentoFerias?: string;         // calculado
  emFerias?: boolean;
  inicioFerias?: string;
  fimFerias?: string;
  proximaFerias?: string;            // calculado
}

/* ===================== Utilidades ===================== */
const addMonths = (isoDate: string, months: number) => {
  if (!isoDate) return ''
  const d = new Date(isoDate)
  d.setMonth(d.getMonth() + months)
  const yyyy = d.getFullYear()
  const mm = `${d.getMonth() + 1}`.padStart(2, '0')
  const dd = `${d.getDate()}`.padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
const fmtMoney = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

function isEmail(val: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) }
function onlyDigits(s: string) { return s.replace(/\D/g, '') }
function validaCPF(cpfRaw: string) {
  const cpf = onlyDigits(cpfRaw); if (cpf.length !== 11 || /^(.)\1+$/.test(cpf)) return false
  let s = 0; for (let i = 0; i < 9; i++) s += parseInt(cpf[i]) * (10 - i)
  let d1 = (s * 10) % 11; if (d1 === 10) d1 = 0; if (d1 !== parseInt(cpf[9])) return false
  s = 0; for (let i = 0; i < 10; i++) s += parseInt(cpf[i]) * (11 - i)
  let d2 = (s * 10) % 11; if (d2 === 10) d2 = 0; return d2 === parseInt(cpf[10])
}
function validaCNPJ(cnpjRaw: string) {
  const c = onlyDigits(cnpjRaw); if (c.length !== 14 || /^(.)\1+$/.test(c)) return false
  const calc = (b: number) => {
    let i = b - 7, s = 0
    for (let j = 0; j < b; j++) { s += parseInt(c[j]) * i; i = i === 2 ? 9 : i - 1 }
    const d = 11 - (s % 11); return d > 9 ? 0 : d
  }
  return calc(12) === parseInt(c[12]) && calc(13) === parseInt(c[13])
}
function validaCpfCnpj(doc: string, pf: boolean) { return pf ? validaCPF(doc) : validaCNPJ(doc) }

/* ===================== Mock Empreendimentos (linkagem) ===================== */
const empreendimentosOptions = [
  { id: 'emp1', nome: 'Residencial Solar das Flores' },
  { id: 'emp2', nome: 'Comercial Business Center' },
]

/* ===================== Bancos (código Febraban principais) ===================== */
const BANCOS = [
  { codigo: '001', nome: 'BANCO DO BRASIL' },
  { codigo: '033', nome: 'SANTANDER' },
  { codigo: '104', nome: 'CAIXA ECON. FEDERAL' },
  { codigo: '237', nome: 'BRADESCO' },
  { codigo: '341', nome: 'ITAÚ' },
  { codigo: '399', nome: 'HSBC' },
  { codigo: '422', nome: 'SAFRA' },
  { codigo: '453', nome: 'RURAL' },
  { codigo: '623', nome: 'PAN' },
  { codigo: '748', nome: 'SICREDI' },
  { codigo: '756', nome: 'SICOOB' },
]

/* ===================== Mock Pessoas ===================== */
const mockPessoas: Pessoa[] = [
  {
    id: '1', tipo: 'cliente', pessoaFisica: true,
    nome: 'João Silva Santos', cpfCnpj: '123.456.789-09', email: 'joao@email.com', telefone: '(11) 99999-9999',
    endereco: { logradouro: 'Rua das Palmeiras', numero: '100', bairro: 'Vila Madalena', cidade: 'São Paulo', cep: '05435-000', estado: 'SP' },
    status: 'ativo', tags: ['vip'], observacoes: '', dataInclusao: '2024-01-10', dataAtualizacao: '2024-07-20',
    documentos: [],
    dadosBancarios: { bancoCodigo: '341', bancoNome: 'ITAÚ', agencia: '1234', conta: '12345-6', tipo: 'corrente' },
    unidadesAdquiridas: [
      { id: 'u1', empreendimentoId: 'emp1', empreendimentoNome: 'Residencial Solar das Flores', unidade: 'Apto 101 - Bloco A', valorCompra: 350000, valorAtual: 420000, status: 'quitado', dataAquisicao: '2023-03-15' }
    ],
    dataNascimento: '1988-05-10'
  },
  {
    id: '4', tipo: 'colaborador', pessoaFisica: true,
    nome: 'Ana Souza', cpfCnpj: '295.379.610-06', email: 'ana@empresa.com', telefone: '(48) 99999-2222',
    endereco: { logradouro: 'Rua A', numero: '55', bairro: 'Centro', cidade: 'Florianópolis', cep: '88010-120', estado: 'SC' },
    status: 'ativo', tags: ['engenharia'], observacoes: '', dataInclusao: '2023-11-01', dataAtualizacao: '2025-01-20',
    documentos: [],
    dadosBancarios: { bancoCodigo: '001', bancoNome: 'BANCO DO BRASIL', agencia: '0001', conta: '654321-1', tipo: 'salario', pix: '48-99999-2222' },
    dataAdmissao: '2023-11-01',
    vencimentoFerias: addMonths('2023-11-01', 12),
    proximaFerias: addMonths('2023-11-01', 12),
    emFerias: false
  },
]

/* ===================== Página ===================== */
const Pessoas: React.FC = () => (
  <Routes>
    <Route index element={<PessoasOverview />} />
    <Route path="clientes" element={<PessoasList tipo="cliente" />} />
    <Route path="leads" element={<PessoasList tipo="lead" />} />
    <Route path="fornecedores" element={<PessoasList tipo="fornecedor" />} />
    <Route path="colaboradores" element={<PessoasList tipo="colaborador" />} />
    <Route path=":tipo/novo" element={<PessoaForm />} />
    <Route path=":tipo/:id/editar" element={<PessoaForm />} />
    <Route path=":tipo/:id" element={<PessoaDetails />} />
  </Routes>
)
export default Pessoas

/* ===================== Overview ===================== */
function PessoasOverview() {
  const navigate = useNavigate()
  const pessoas = mockPessoas
  const estat = {
    clientes: pessoas.filter(p => p.tipo === 'cliente').length,
    leads: pessoas.filter(p => p.tipo === 'lead').length,
    fornecedores: pessoas.filter(p => p.tipo === 'fornecedor').length,
    colaboradores: pessoas.filter(p => p.tipo === 'colaborador').length,
  }
  const cards = [
    { titulo: 'Clientes', valor: estat.clientes, href: '/pessoas/clientes', icon: UserGroupIcon, cor: 'bg-blue-50', icor: 'text-blue-600' },
    { titulo: 'Leads', valor: estat.leads, href: '/pessoas/leads', icon: UserIcon, cor: 'bg-green-50', icor: 'text-green-600' },
    { titulo: 'Fornecedores', valor: estat.fornecedores, href: '/pessoas/fornecedores', icon: BuildingOfficeIcon, cor: 'bg-purple-50', icor: 'text-purple-600' },
    { titulo: 'Colaboradores', valor: estat.colaboradores, href: '/pessoas/colaboradores', icon: TagIcon, cor: 'bg-amber-50', icor: 'text-amber-600' },
  ]
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pessoas</h1>
          <p className="text-gray-600">Cadastros centrais do ERP</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cards.map((c, i) => (
          <button key={i} onClick={() => navigate(c.href)} className="bg-white border rounded-lg p-5 text-left hover:shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">{c.titulo}</p>
                <p className="text-2xl font-bold">{c.valor}</p>
              </div>
              <div className={`${c.cor} p-3 rounded-lg`}><c.icon className={`${c.icor} w-7 h-7`} /></div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ===================== Lista ===================== */
function PessoasList({ tipo }: { tipo: TipoPessoa }) {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')
  const pessoas = useMemo(
    () => mockPessoas.filter(p => p.tipo === tipo && p.nome.toLowerCase().includes(busca.toLowerCase())),
    [tipo, busca]
  )
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold capitalize">{tipo}</h1>
          <p className="text-gray-600">Gerencie {tipo === 'colaborador' ? 'colaboradores' : `os ${tipo}s`}</p>
        </div>
        <button onClick={() => navigate(`/pessoas/${tipo}/novo`)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <PlusIcon className="w-5 h-5" /> Novo cadastro
        </button>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <div className="relative max-w-md">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome…"
            className="w-full pl-10 pr-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr><th className="py-2">Nome</th><th className="py-2">Documento</th><th className="py-2">Telefone</th><th className="py-2">Email</th><th className="py-2"></th></tr>
            </thead>
            <tbody className="divide-y">
              {pessoas.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="py-2">{p.nome}</td>
                  <td className="py-2">{p.cpfCnpj}</td>
                  <td className="py-2">{p.telefone}</td>
                  <td className="py-2">{p.email}</td>
                  <td className="py-2 text-right">
                    <button onClick={() => navigate(`/pessoas/${p.tipo}/${p.id}`)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 border rounded-lg">
                      <EyeIcon className="w-4 h-4" /> Ver
                    </button>
                  </td>
                </tr>
              ))}
              {pessoas.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-gray-500">Nenhum registro</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ===================== Formulário ===================== */
function PessoaForm() {
  const { tipo } = useParams<{ tipo: TipoPessoa }>()
  const navigate = useNavigate()

  const initial: Pessoa = {
    id: crypto.randomUUID(),
    tipo: (tipo as TipoPessoa) || 'cliente',
    pessoaFisica: true,
    nome: '',
    cpfCnpj: '',
    email: '',
    telefone: '',
    endereco: { logradouro: '', numero: '', bairro: '', cidade: '', cep: '', estado: '' },
    status: 'ativo',
    tags: [],
    observacoes: '',
    dataInclusao: new Date().toISOString().slice(0, 10),
    dataAtualizacao: new Date().toISOString().slice(0, 10),
    documentos: [],
    avatarUrl: '',
    dadosBancarios: { bancoCodigo: '', bancoNome: '', agencia: '', conta: '', tipo: 'corrente', pix: '' },
    unidadesAdquiridas: [],
    dataNascimento: ''
  }

  const [form, setForm] = useState<Pessoa>(initial)
  const [errors, setErrors] = useState<{ email?: string; doc?: string }>({})

  // avatar dropzone
  const avatarDrop = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    multiple: false,
    onDrop: (files) => {
      const f = files[0]; if (!f) return
      const url = URL.createObjectURL(f)
      setForm({ ...form, avatarUrl: url })
    }
  })

  // documentos dropzone
  const docDrop = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: true,
    onDrop: (files) => {
      const novos = files.map(f => ({
        id: crypto.randomUUID(),
        nomeArquivo: f.name,
        categoria: form.tipo === 'colaborador' ? 'Documento do Colaborador' : 'Geral',
        tipo: f.type || 'arquivo',
        tamanho: `${(f.size / 1024 / 1024).toFixed(2)} MB`,
        dataUpload: new Date().toISOString().slice(0, 10),
        url: URL.createObjectURL(f)
      }) as Documento)
      setForm({ ...form, documentos: [...form.documentos, ...novos] })
    }
  })

  function validate() {
    const errs: { email?: string; doc?: string } = {}
    if (form.email && !isEmail(form.email)) errs.email = 'Email inválido'
    if (form.cpfCnpj && !validaCpfCnpj(form.cpfCnpj, form.pessoaFisica)) errs.doc = form.pessoaFisica ? 'CPF inválido' : 'CNPJ inválido'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    // salvar (mock)
    navigate(`/pessoas/${form.tipo}`)
  }

  // férias automáticas
  const isColab = form.tipo === 'colaborador'
  const isCliente = form.tipo === 'cliente'
  const isPF = form.pessoaFisica

  function recomputeFerias(from: string) {
    if (!from) return
    const prox = addMonths(from, 12)
    setForm(f => ({ ...f, vencimentoFerias: prox, proximaFerias: prox }))
  }

  function marcarInicioFerias() {
    const hoje = new Date().toISOString().slice(0, 10)
    setForm(f => ({ ...f, emFerias: true, inicioFerias: hoje, fimFerias: addMonths(hoje, 0) })) // fim será preenchido ao retornar
  }
  function marcarRetornoFerias() {
    const hoje = new Date().toISOString().slice(0, 10)
    // próxima férias contam 12 meses após o retorno
    const prox = addMonths(hoje, 12)
    setForm(f => ({ ...f, emFerias: false, fimFerias: hoje, proximaFerias: prox, vencimentoFerias: prox }))
  }

  // editar/remoção de documento
  const removeDoc = (id: string) => setForm({ ...form, documentos: form.documentos.filter(d => d.id !== id) })

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Novo cadastro — {form.tipo}</h1>
          <p className="text-gray-600">Preencha os dados abaixo</p>
        </div>
        <button type="button" onClick={() => navigate(`/pessoas/${form.tipo}`)} className="border px-4 py-2 rounded-lg">Cancelar</button>
      </div>

      {/* Perfil + Avatar */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div {...avatarDrop.getRootProps()} className="w-20 h-20 rounded-full border-2 border-dashed grid place-items-center cursor-pointer overflow-hidden">
            <input {...avatarDrop.getInputProps()} />
            {form.avatarUrl ? <img src={form.avatarUrl} className="w-full h-full object-cover" /> : <div className="text-center text-xs text-gray-500 flex flex-col items-center"><PhotoIcon className="w-6 h-6 text-gray-400" />Foto</div>}
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
            <label className="md:col-span-2">
              <span className="text-sm text-gray-700">Nome *</span>
              <input required className="w-full border rounded-lg px-3 py-2" value={form.nome} onChange={e=>setForm({...form, nome:e.target.value})}/>
            </label>
            <label>
              <span className="text-sm text-gray-700">Pessoa Física?</span>
              <select className="w-full border rounded-lg px-3 py-2" value={form.pessoaFisica ? '1':'0'}
                onChange={e=>setForm({...form, pessoaFisica: e.target.value==='1'})}>
                <option value="1">Sim (CPF)</option>
                <option value="0">Não (CNPJ)</option>
              </select>
            </label>
            <label>
              <span className="text-sm text-gray-700">{isPF ? 'CPF' : 'CNPJ'} *</span>
              <input required className="w-full border rounded-lg px-3 py-2" value={form.cpfCnpj} onChange={e=>setForm({...form, cpfCnpj:e.target.value})}/>
              {errors.doc && <span className="text-xs text-red-600">{errors.doc}</span>}
            </label>
          </div>
        </div>

        {/* Campos PF / PJ */}
        {isPF ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <label><span className="text-sm">Data de Nascimento</span>
              <input type="date" className="w-full border rounded-lg px-3 py-2" value={form.dataNascimento ?? ''} onChange={e=>setForm({...form, dataNascimento: e.target.value})}/></label>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <label className="md:col-span-2"><span className="text-sm">Razão Social</span>
              <input className="w-full border rounded-lg px-3 py-2" value={form.razaoSocial ?? ''} onChange={e=>setForm({...form, razaoSocial: e.target.value})}/></label>
            <label className="md:col-span-2"><span className="text-sm">Nome Fantasia</span>
              <input className="w-full border rounded-lg px-3 py-2" value={form.nomeFantasia ?? ''} onChange={e=>setForm({...form, nomeFantasia: e.target.value})}/></label>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <label><span className="text-sm">Telefone</span>
            <input className="w-full border rounded-lg px-3 py-2" value={form.telefone} onChange={e=>setForm({...form, telefone:e.target.value})}/></label>
          <label className="md:col-span-2"><span className="text-sm">Email *</span>
            <input required className="w-full border rounded-lg px-3 py-2" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
            {errors.email && <span className="text-xs text-red-600">{errors.email}</span>}
          </label>
          <label><span className="text-sm">Tags (separe por vírgula)</span>
            <input className="w-full border rounded-lg px-3 py-2" value={form.tags.join(', ')} onChange={e=>setForm({...form, tags:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}/></label>
        </div>
      </div>

      {/* Endereço */}
      <div className="bg-white border rounded-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="md:col-span-2"><span className="text-sm">Logradouro</span>
          <input className="w-full border rounded-lg px-3 py-2" value={form.endereco.logradouro} onChange={e=>setForm({...form, endereco:{...form.endereco, logradouro:e.target.value}})}/></label>
        <label><span className="text-sm">Número</span>
          <input className="w-full border rounded-lg px-3 py-2" value={form.endereco.numero} onChange={e=>setForm({...form, endereco:{...form.endereco, numero:e.target.value}})}/></label>
        <label><span className="text-sm">Bairro</span>
          <input className="w-full border rounded-lg px-3 py-2" value={form.endereco.bairro} onChange={e=>setForm({...form, endereco:{...form.endereco, bairro:e.target.value}})}/></label>
        <label><span className="text-sm">Cidade</span>
          <input className="w-full border rounded-lg px-3 py-2" value={form.endereco.cidade} onChange={e=>setForm({...form, endereco:{...form.endereco, cidade:e.target.value}})}/></label>
        <label><span className="text-sm">Estado</span>
          <input className="w-full border rounded-lg px-3 py-2" value={form.endereco.estado} onChange={e=>setForm({...form, endereco:{...form.endereco, estado:e.target.value}})}/></label>
        <label><span className="text-sm">CEP</span>
          <input className="w-full border rounded-lg px-3 py-2" value={form.endereco.cep} onChange={e=>setForm({...form, endereco:{...form.endereco, cep:e.target.value}})}/></label>
      </div>

      {/* Dados Bancários */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><BanknotesIcon className="w-5 h-5"/> Dados bancários</h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <label className="md:col-span-2 text-sm">Banco (código)
            <select className="w-full border rounded-lg px-3 py-2"
              value={form.dadosBancarios?.bancoCodigo ?? ''}
              onChange={e=>{
                const sel = BANCOS.find(b=>b.codigo===e.target.value)
                setForm({...form, dadosBancarios:{ ...(form.dadosBancarios ?? { bancoCodigo:'', bancoNome:'', agencia:'', conta:'', tipo:'corrente', pix:'' }),
                  bancoCodigo: sel?.codigo ?? '', bancoNome: sel?.nome ?? '' }})
              }}>
              <option value="">Selecione…</option>
              {BANCOS.map(b=><option key={b.codigo} value={b.codigo}>{b.codigo} — {b.nome}</option>)}
            </select>
          </label>
          <label className="text-sm">Agência
            <input className="w-full border rounded-lg px-3 py-2" value={form.dadosBancarios?.agencia ?? ''} onChange={e=>setForm({...form, dadosBancarios:{ ...(form.dadosBancarios as DadosBancarios), agencia:e.target.value }})}/></label>
          <label className="text-sm">Conta
            <input className="w-full border rounded-lg px-3 py-2" value={form.dadosBancarios?.conta ?? ''} onChange={e=>setForm({...form, dadosBancarios:{ ...(form.dadosBancarios as DadosBancarios), conta:e.target.value }})}/></label>
          <label className="text-sm">Tipo de conta
            <select className="w-full border rounded-lg px-3 py-2" value={form.dadosBancarios?.tipo ?? 'corrente'}
              onChange={e=>setForm({...form, dadosBancarios:{ ...(form.dadosBancarios as DadosBancarios), tipo: e.target.value as TipoConta }})}>
              <option value="corrente">Conta Corrente</option>
              <option value="salario">Conta Salário</option>
              <option value="poupanca">Conta Poupança</option>
              <option value="pagamento">Conta de Pagamento</option>
            </select>
          </label>
          <label className="text-sm">PIX
            <input className="w-full border rounded-lg px-3 py-2" value={form.dadosBancarios?.pix ?? ''} onChange={e=>setForm({...form, dadosBancarios:{ ...(form.dadosBancarios as DadosBancarios), pix:e.target.value }})}/></label>
        </div>
      </div>

      {/* Documentos (Drag & Drop) */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <h3 className="font-semibold">Documentos</h3>
        <div {...docDrop.getRootProps()} className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50">
          <input {...docDrop.getInputProps()} />
          <p className="text-sm text-gray-600">Arraste arquivos aqui ou <span className="text-blue-600 underline">clique para enviar</span></p>
          <p className="text-xs text-gray-500 mt-1">Aceita: .pdf .doc .docx .xls .xlsx .png .jpg</p>
        </div>
        {form.documentos.length > 0 && (
          <ul className="divide-y">
            {form.documentos.map(d=>(
              <li key={d.id} className="py-2 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{d.nomeArquivo}</p>
                  <p className="text-xs text-gray-500">{d.categoria} • {d.tamanho} • {d.dataUpload}</p>
                </div>
                <button type="button" onClick={()=>removeDoc(d.id)} className="text-red-600 text-sm inline-flex items-center gap-1">
                  <TrashIcon className="w-4 h-4" /> Remover
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Unidades / Contratos (Cliente) */}
      {isCliente && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="font-semibold mb-3">Contratos / Unidades</h3>
          <UnidadesEditor unidades={form.unidadesAdquiridas ?? []} onChange={(u)=>setForm({...form, unidadesAdquiridas:u})} />
        </div>
      )}

      {/* Dados do Colaborador + Férias */}
      {isColab && (
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <h3 className="font-semibold">Dados do colaborador</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label><span className="text-sm">Data de admissão</span>
              <input type="date" className="w-full border rounded-lg px-3 py-2" value={form.dataAdmissao ?? ''}
                onChange={e=>{ const dt = e.target.value; setForm({...form, dataAdmissao: dt}); recomputeFerias(dt) }}/></label>
            <label><span className="text-sm">Vencimento de férias</span>
              <input type="date" className="w-full border rounded-lg px-3 py-2" value={form.vencimentoFerias ?? ''} readOnly/></label>
            <label><span className="text-sm">Próximas férias</span>
              <input type="date" className="w-full border rounded-lg px-3 py-2" value={form.proximaFerias ?? ''} readOnly/></label>
          </div>
          <div className="flex items-center gap-3">
            {!form.emFerias ? (
              <button type="button" onClick={marcarInicioFerias} className="px-3 py-1.5 border rounded-lg">Iniciar férias</button>
            ) : (
              <button type="button" onClick={marcarRetornoFerias} className="px-3 py-1.5 border rounded-lg">Marcar retorno</button>
            )}
            <span className={`text-sm ${form.emFerias ? 'text-green-700' : 'text-gray-600'}`}>
              {form.emFerias ? `Em férias desde ${form.inicioFerias}` : 'Não está de férias'}
            </span>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => navigate(`/pessoas/${form.tipo}`)} className="px-4 py-2 border rounded-lg">Cancelar</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Salvar</button>
      </div>
    </form>
  )
}

/* ===================== Detalhes ===================== */
function PessoaDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const pessoa = mockPessoas.find(p => p.id === id)
  if (!pessoa) return <div className="text-center text-gray-600">Registro não encontrado</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 grid place-items-center overflow-hidden">
            {pessoa.avatarUrl ? <img src={pessoa.avatarUrl} className="w-full h-full object-cover"/> : <UserIcon className="w-8 h-8 text-gray-400" />}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{pessoa.nome}</h1>
            <p className="text-gray-600">{pessoa.tipo} • {pessoa.pessoaFisica ? 'CPF' : 'CNPJ'} {pessoa.cpfCnpj}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate(`/pessoas/${pessoa.tipo}/${pessoa.id}/editar`)} className="px-3 py-1.5 border rounded-lg flex items-center gap-1">
            <PencilIcon className="w-4 h-4" /> Editar
          </button>
          <button onClick={() => navigate(`/pessoas/${pessoa.tipo}`)} className="px-3 py-1.5 border rounded-lg">Voltar</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Quick title="Telefone" value={pessoa.telefone} icon={PhoneIcon}/>
        <Quick title="Email" value={pessoa.email} icon={EnvelopeIcon}/>
        <Quick title="Local" value={`${pessoa.endereco.cidade} - ${pessoa.endereco.estado}`} icon={MapPinIcon}/>
        <Quick title="Status" value={pessoa.status} icon={TagIcon}/>
      </div>

      {/* Documentos */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="font-semibold mb-2">Documentos</h3>
        {pessoa.documentos.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhum documento enviado.</p>
        ) : (
          <ul className="divide-y">
            {pessoa.documentos.map(d => (
              <li key={d.id} className="py-2 flex items-center justify-between">
                <div>
                  <p className="font-medium">{d.nomeArquivo}</p>
                  <p className="text-xs text-gray-500">{d.categoria} • {d.tipo} • {d.dataUpload}</p>
                </div>
                <a href={d.url} target="_blank" className="px-3 py-1.5 border rounded-lg text-sm">Abrir</a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Cliente: Unidades */}
      {pessoa.tipo === 'cliente' && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="font-semibold mb-2">Contratos / Unidades</h3>
          {(pessoa.unidadesAdquiridas ?? []).length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhuma unidade vinculada.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-left text-gray-500">
                  <tr><th className="py-2">Empreendimento</th><th className="py-2">Unidade</th><th className="py-2">Status</th><th className="py-2">Aquis. (R$)</th><th className="py-2">Atual (R$)</th><th className="py-2">Data</th></tr>
                </thead>
                <tbody className="divide-y">
                  {pessoa.unidadesAdquiridas!.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="py-2">{u.empreendimentoNome}</td>
                      <td className="py-2">{u.unidade}</td>
                      <td className="py-2 capitalize">{u.status}</td>
                      <td className="py-2">{fmtMoney(u.valorCompra)}</td>
                      <td className="py-2">{fmtMoney(u.valorAtual)}</td>
                      <td className="py-2">{new Date(u.dataAquisicao).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ===================== Subcomponentes ===================== */
function Quick({ title, value, icon: Icon }:{ title:string; value:string; icon:any }) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-gray-50"><Icon className="w-5 h-5 text-gray-600" /></div>
        <div>
          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-sm font-medium">{value || '—'}</p>
        </div>
      </div>
    </div>
  )
}

function UnidadesEditor({ unidades, onChange }:{ unidades: UnidadeAdquirida[]; onChange:(u:UnidadeAdquirida[])=>void }) {
  const [novo, setNovo] = useState<UnidadeAdquirida>({
    id: crypto.randomUUID(),
    empreendimentoId: empreendimentosOptions[0]?.id ?? '',
    empreendimentoNome: empreendimentosOptions[0]?.nome ?? '',
    unidade: '',
    valorCompra: 0, valorAtual: 0, status: 'contrato',
    dataAquisicao: new Date().toISOString().slice(0,10)
  })
  function add() {
    if (!novo.unidade || !novo.empreendimentoId) return
    onChange([...unidades, novo])
    setNovo({ ...novo, id: crypto.randomUUID(), unidade:'', valorCompra:0, valorAtual:0 })
  }
  function remove(id: string) { onChange(unidades.filter(u => u.id !== id)) }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
        <label className="md:col-span-2 text-sm">Empreendimento
          <select className="w-full border rounded-lg px-3 py-2"
            value={novo.empreendimentoId}
            onChange={(e)=> {
              const opt = empreendimentosOptions.find(o => o.id === e.target.value)
              setNovo({ ...novo, empreendimentoId: e.target.value, empreendimentoNome: opt?.nome ?? '' })
            }}>
            {empreendimentosOptions.map(o => <option key={o.id} value={o.id}>{o.nome}</option>)}
          </select>
        </label>
        <label className="text-sm">Unidade
          <input className="w-full border rounded-lg px-3 py-2" value={novo.unidade} onChange={e=>setNovo({...novo, unidade:e.target.value})}/>
        </label>
        <label className="text-sm">Valor compra
          <input type="number" className="w-full border rounded-lg px-3 py-2" value={novo.valorCompra} onChange={e=>setNovo({...novo, valorCompra:Number(e.target.value)||0})}/>
        </label>
        <label className="text-sm">Valor atual
          <input type="number" className="w-full border rounded-lg px-3 py-2" value={novo.valorAtual} onChange={e=>setNovo({...novo, valorAtual:Number(e.target.value)||0})}/>
        </label>
        <label className="text-sm">Status
          <select className="w-full border rounded-lg px-3 py-2" value={novo.status} onChange={e=>setNovo({...novo, status:e.target.value as UnidadeAdquirida['status']})}>
            <option value="contrato">Contrato</option>
            <option value="financiamento">Financiamento</option>
            <option value="pendente">Pendente</option>
            <option value="quitado">Quitado</option>
          </select>
        </label>
      </div>
      <div className="flex justify-end">
        <button type="button" onClick={add} className="px-3 py-1.5 bg-gray-900 text-white rounded-lg">Adicionar</button>
      </div>

      {unidades.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr><th className="py-2">Empreendimento</th><th className="py-2">Unidade</th><th className="py-2">Compra</th><th className="py-2">Atual</th><th className="py-2">Status</th><th className="py-2"></th></tr>
            </thead>
            <tbody className="divide-y">
              {unidades.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="py-2">{u.empreendimentoNome}</td>
                  <td className="py-2">{u.unidade}</td>
                  <td className="py-2">{fmtMoney(u.valorCompra)}</td>
                  <td className="py-2">{fmtMoney(u.valorAtual)}</td>
                  <td className="py-2 capitalize">{u.status}</td>
                  <td className="py-2 text-right">
                    <button type="button" onClick={()=>remove(u.id)} className="px-2 py-1 text-red-600 border rounded-lg text-xs">Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
