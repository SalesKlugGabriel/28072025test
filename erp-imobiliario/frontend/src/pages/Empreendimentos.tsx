import React, { useMemo, useState } from 'react'
import {
  Plus, Search, MapPin, Edit2, Eye, Building, Calendar, TrendingUp, Home,
} from 'lucide-react'
import {
  listEmpreendimentos,
  getEmpreendimentoById,
  saveEmpreendimento,
  type Empreendimento,
  type TipoUnidade,
} from '../store/empreendimentos'

// util
function formatBRL(n?: number) {
  if (typeof n !== 'number') return '—'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)
}

type View = 'lista' | 'form' | 'detalhes' | 'mapa'

export default function Empreendimentos() {
  const [view, setView] = useState<View>('lista')
  const [idSelecionado, setIdSelecionado] = useState<string | null>(null)

  function gotoLista() {
    setIdSelecionado(null)
    setView('lista')
  }
  function gotoDetalhes(id: string) {
    setIdSelecionado(id)
    setView('detalhes')
  }
  function gotoMapa(id: string) {
    setIdSelecionado(id)
    setView('mapa')
  }
  function gotoForm(id?: string) {
    setIdSelecionado(id ?? null)
    setView('form')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {view === 'lista' && <Lista onNovo={() => gotoForm()} onVer={(id) => gotoDetalhes(id)} onMapa={(id)=>gotoMapa(id)} />}
      {view === 'form' && <Form id={idSelecionado ?? undefined} onCancel={gotoLista} onSaved={(id)=>gotoDetalhes(id)} />}
      {view === 'detalhes' && idSelecionado && <Detalhes id={idSelecionado} onVoltar={gotoLista} onEditar={()=>gotoForm(idSelecionado)} onMapa={()=>gotoMapa(idSelecionado)} />}
      {view === 'mapa' && idSelecionado && <Mapa id={idSelecionado} onVoltar={()=>gotoDetalhes(idSelecionado)} />}
    </div>
  )
}

/* ========================= LISTA ========================= */
function Lista(props: { onNovo: () => void; onVer: (id: string)=>void; onMapa:(id:string)=>void }) {
  const [busca, setBusca] = useState('')
  const [status, setStatus] = useState<Empreendimento['status'] | ''>('')
  const [tipo, setTipo] = useState<Empreendimento['tipo'] | ''>('')

  const data = useMemo(() => listEmpreendimentos(), [])
  const filtrados = useMemo(() => {
    return data.filter(e => {
      const mBusca = e.nome.toLowerCase().includes(busca.toLowerCase())
      const mStatus = !status || e.status === status
      const mTipo = !tipo || e.tipo === tipo
      return mBusca && mStatus && mTipo
    })
  }, [data, busca, status, tipo])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Empreendimentos</h1>
          <p className="text-gray-600">Gerencie os empreendimentos cadastrados</p>
        </div>
        <button onClick={props.onNovo} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" /> Novo
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"/>
          <input value={busca} onChange={(e)=>setBusca(e.target.value)} placeholder="Buscar por nome…" className="w-full pl-10 pr-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"/>
        </div>
        <select className="border rounded-lg px-3 py-2" value={status} onChange={(e)=>setStatus(e.target.value as any)}>
          <option value="">Todos os status</option>
          <option value="planejamento">Planejamento</option>
          <option value="aprovacao">Aprovação</option>
          <option value="construcao">Construção</option>
          <option value="vendas">Vendas</option>
          <option value="entregue">Entregue</option>
        </select>
        <select className="border rounded-lg px-3 py-2" value={tipo} onChange={(e)=>setTipo(e.target.value as any)}>
          <option value="">Todos os tipos</option>
          <option value="residencial">Residencial</option>
          <option value="comercial">Comercial</option>
          <option value="misto">Misto</option>
          <option value="rural">Rural</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtrados.map((e)=> {
          const progresso = ((e.unidadesVendidas + e.unidadesReservadas) / Math.max(e.unidadesTotal,1)) * 100
        return (
          <div key={e.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition overflow-hidden">
            <div className="relative h-44 bg-gray-100">
              {e.imagem ? (
                <img src={e.imagem} alt={e.nome} className="w-full h-full object-cover"/>
              ) : <div className="w-full h-full grid place-items-center text-gray-400"><Building className="w-10 h-10"/></div>}
              <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs text-white ${{
                planejamento:'bg-yellow-600', aprovacao:'bg-amber-700', construcao:'bg-blue-600', vendas:'bg-green-600', entregue:'bg-gray-700'
              }[e.status]}`}>{e.status}</span>
            </div>

            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900">{e.nome}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <MapPin className="w-4 h-4"/>{e.localizacao.cidade} - {e.localizacao.estado}
              </div>

              <div className="flex justify-between mt-4 text-sm">
                <div>
                  <p className="text-gray-500">A partir de</p>
                  <p className="font-semibold text-green-600">{formatBRL(e.valorMedio)}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">Unidades</p>
                  <p className="font-semibold">{e.unidadesTotal}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progresso de vendas</span><span className="font-medium">{progresso.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-2 bg-blue-600" style={{width:`${progresso}%`}}/>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3"/>Vendidas {e.unidadesVendidas}</span>
                  <span className="flex items-center gap-1"><Home className="w-3 h-3"/>Disponíveis {Math.max(e.unidadesTotal - e.unidadesVendidas - e.unidadesReservadas,0)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-5">
                <button onClick={()=>props.onMapa(e.id)} className="px-3 py-1.5 border rounded-lg text-gray-700 hover:bg-gray-50">Mapa</button>
                <button onClick={()=>props.onVer(e.id)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1">
                  <Eye className="w-4 h-4"/> Detalhes
                </button>
              </div>
            </div>
          </div>
        )})}
      </div>
    </div>
  )
}

/* ========================= FORM ========================= */
function Form(props: { id?: string; onCancel: ()=>void; onSaved:(id:string)=>void }) {
  const editing = props.id ? getEmpreendimentoById(props.id) : undefined
  const [form, setForm] = useState<Empreendimento>(() => editing ?? {
    id: crypto.randomUUID(),
    nome: '',
    tipo: 'residencial',
    status: 'planejamento',
    imagem: '',
    localizacao: { endereco:'', bairro:'', cidade:'', estado:'', cep:'' },
    unidadesTotal: 0,
    unidadesVendidas: 0,
    unidadesReservadas: 0,
    valorTotal: undefined,
    valorMedio: undefined,
    dataInicio: '',
    dataPrevista: '',
    descricao: '',
    responsaveis: { tecnico:'', comercial:'', juridico:'' },
    tiposUnidade: [],
  })

  const [novoTipo, setNovoTipo] = useState<TipoUnidade>({
    id: crypto.randomUUID(),
    nome: '',
    tipologia: '2 quartos',
    areaPrivativa: 0,
    vagasGaragem: 0,
    precoReferencia: 0,
  })

  function addTipo() {
    if (!novoTipo.nome) return
    setForm(f => ({ ...f, tiposUnidade: [...f.tiposUnidade, novoTipo] }))
    setNovoTipo({ id: crypto.randomUUID(), nome:'', tipologia:'2 quartos', areaPrivativa:0, vagasGaragem:0, precoReferencia:0 })
  }
  function removeTipo(id: string) {
    setForm(f => ({ ...f, tiposUnidade: f.tiposUnidade.filter(t => t.id !== id) }))
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    // derivados mínimos para manter cards coerentes
    const valorMedio = form.tiposUnidade.length
      ? Math.round(form.tiposUnidade.reduce((acc, t) => acc + (t.precoReferencia||0), 0) / form.tiposUnidade.length)
      : form.valorMedio
    saveEmpreendimento({ ...form, valorMedio })
    props.onSaved(form.id)
  }

  return (
    <form onSubmit={onSubmit} className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{editing ? 'Editar' : 'Novo'} Empreendimento</h1>
          <p className="text-gray-600">Preencha as informações abaixo</p>
        </div>
        <button type="button" onClick={props.onCancel} className="text-gray-600 hover:text-gray-800">Cancelar</button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nome *">
            <input className="w-full border rounded-lg px-3 py-2" required value={form.nome} onChange={e=>setForm({...form, nome:e.target.value})}/>
          </Field>
          <Field label="Tipo *">
            <select className="w-full border rounded-lg px-3 py-2" value={form.tipo} onChange={e=>setForm({...form, tipo:e.target.value as Empreendimento['tipo']})}>
              <option value="residencial">Residencial</option>
              <option value="comercial">Comercial</option>
              <option value="misto">Misto</option>
              <option value="rural">Rural</option>
            </select>
          </Field>
          <Field label="Status *">
            <select className="w-full border rounded-lg px-3 py-2" value={form.status} onChange={e=>setForm({...form, status:e.target.value as Empreendimento['status']})}>
              <option value="planejamento">Planejamento</option>
              <option value="aprovacao">Aprovação</option>
              <option value="construcao">Construção</option>
              <option value="vendas">Vendas</option>
              <option value="entregue">Entregue</option>
            </select>
          </Field>
          <Field label="Imagem (URL)">
            <input className="w-full border rounded-lg px-3 py-2" value={form.imagem ?? ''} onChange={e=>setForm({...form, imagem:e.target.value})}/>
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Endereço *">
            <input className="w-full border rounded-lg px-3 py-2" required value={form.localizacao.endereco} onChange={e=>setForm({...form, localizacao:{...form.localizacao, endereco:e.target.value}})}/>
          </Field>
          <Field label="Bairro *">
            <input className="w-full border rounded-lg px-3 py-2" required value={form.localizacao.bairro} onChange={e=>setForm({...form, localizacao:{...form.localizacao, bairro:e.target.value}})}/>
          </Field>
          <Field label="Cidade *">
            <input className="w-full border rounded-lg px-3 py-2" required value={form.localizacao.cidade} onChange={e=>setForm({...form, localizacao:{...form.localizacao, cidade:e.target.value}})}/>
          </Field>
          <Field label="Estado *">
            <input className="w-full border rounded-lg px-3 py-2" required value={form.localizacao.estado} onChange={e=>setForm({...form, localizacao:{...form.localizacao, estado:e.target.value}})}/>
          </Field>
          <Field label="CEP">
            <input className="w-full border rounded-lg px-3 py-2" value={form.localizacao.cep} onChange={e=>setForm({...form, localizacao:{...form.localizacao, cep:e.target.value}})}/>
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Unidades (total)">
            <input type="number" className="w-full border rounded-lg px-3 py-2" value={form.unidadesTotal} onChange={e=>setForm({...form, unidadesTotal:Number(e.target.value)||0})}/>
          </Field>
          <Field label="Vendidas">
            <input type="number" className="w-full border rounded-lg px-3 py-2" value={form.unidadesVendidas} onChange={e=>setForm({...form, unidadesVendidas:Number(e.target.value)||0})}/>
          </Field>
          <Field label="Reservadas">
            <input type="number" className="w-full border rounded-lg px-3 py-2" value={form.unidadesReservadas} onChange={e=>setForm({...form, unidadesReservadas:Number(e.target.value)||0})}/>
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Valor total estimado (R$)">
            <input className="w-full border rounded-lg px-3 py-2" value={form.valorTotal ?? ''} onChange={e=>setForm({...form, valorTotal: Number(e.target.value.replace(/\D/g,'')) || undefined})}/>
          </Field>
          <Field label="Valor médio por unidade (R$)">
            <input className="w-full border rounded-lg px-3 py-2" value={form.valorMedio ?? ''} onChange={e=>setForm({...form, valorMedio: Number(e.target.value.replace(/\D/g,'')) || undefined})}/>
          </Field>
        </div>

        <Field label="Descrição">
          <textarea className="w-full border rounded-lg px-3 py-2" rows={3} value={form.descricao ?? ''} onChange={e=>setForm({...form, descricao:e.target.value})}/>
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Responsável Técnico"><input className="w-full border rounded-lg px-3 py-2" value={form.responsaveis?.tecnico ?? ''} onChange={e=>setForm({...form, responsaveis:{...form.responsaveis, tecnico:e.target.value}})}/></Field>
          <Field label="Responsável Comercial"><input className="w-full border rounded-lg px-3 py-2" value={form.responsaveis?.comercial ?? ''} onChange={e=>setForm({...form, responsaveis:{...form.responsaveis, comercial:e.target.value}})}/></Field>
          <Field label="Responsável Jurídico"><input className="w-full border rounded-lg px-3 py-2" value={form.responsaveis?.juridico ?? ''} onChange={e=>setForm({...form, responsaveis:{...form.responsaveis, juridico:e.target.value}})}/></Field>
        </div>

        {/* Tipos de Unidade */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Tipos de Unidade</h3>
          </div>

          {form.tiposUnidade.length === 0 && (
            <p className="text-sm text-gray-500 mb-3">Nenhum tipo cadastrado.</p>
          )}

          <div className="space-y-2">
            {form.tiposUnidade.map(t => (
              <div key={t.id} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-3"><input className="w-full border rounded px-2 py-1" value={t.nome} onChange={e=>updateTipo(setForm, t.id, { nome:e.target.value })} /></div>
                <div className="col-span-3">
                  <select className="w-full border rounded px-2 py-1" value={t.tipologia} onChange={e=>updateTipo(setForm, t.id, { tipologia:e.target.value })}>
                    <option>1 quarto</option><option>2 quartos</option><option>3 quartos</option><option>4 quartos</option><option>Studio</option><option>Loft</option><option>Cobertura</option>
                  </select>
                </div>
                <div className="col-span-2"><input type="number" className="w-full border rounded px-2 py-1" value={t.areaPrivativa} onChange={e=>updateTipo(setForm, t.id, { areaPrivativa:Number(e.target.value)||0 })} /></div>
                <div className="col-span-2"><input type="number" className="w-full border rounded px-2 py-1" value={t.vagasGaragem} onChange={e=>updateTipo(setForm, t.id, { vagasGaragem:Number(e.target.value)||0 })} /></div>
                <div className="col-span-2 flex items-center gap-2">
                  <input type="number" className="w-full border rounded px-2 py-1" value={t.precoReferencia} onChange={e=>updateTipo(setForm, t.id, { precoReferencia:Number(e.target.value)||0 })} />
                  <button type="button" onClick={()=>removeTipo(t.id)} className="text-red-600 text-sm">remover</button>
                </div>
              </div>
            ))}
          </div>

          {/* novo tipo */}
          <div className="grid grid-cols-12 gap-2 mt-4">
            <div className="col-span-3"><input className="w-full border rounded px-2 py-1" placeholder="Nome" value={novoTipo.nome} onChange={e=>setNovoTipo({...novoTipo, nome:e.target.value})}/></div>
            <div className="col-span-3">
              <select className="w-full border rounded px-2 py-1" value={novoTipo.tipologia} onChange={e=>setNovoTipo({...novoTipo, tipologia:e.target.value})}>
                <option>1 quarto</option><option>2 quartos</option><option>3 quartos</option><option>4 quartos</option><option>Studio</option><option>Loft</option><option>Cobertura</option>
              </select>
            </div>
            <div className="col-span-2"><input type="number" className="w-full border rounded px-2 py-1" placeholder="Área (m²)" value={novoTipo.areaPrivativa} onChange={e=>setNovoTipo({...novoTipo, areaPrivativa:Number(e.target.value)||0})}/></div>
            <div className="col-span-2"><input type="number" className="w-full border rounded px-2 py-1" placeholder="Vagas" value={novoTipo.vagasGaragem} onChange={e=>setNovoTipo({...novoTipo, vagasGaragem:Number(e.target.value)||0})}/></div>
            <div className="col-span-2 flex items-center">
              <input type="number" className="w-full border rounded px-2 py-1" placeholder="Preço" value={novoTipo.precoReferencia} onChange={e=>setNovoTipo({...novoTipo, precoReferencia:Number(e.target.value)||0})}/>
            </div>
          </div>
          <div className="mt-3">
            <button type="button" onClick={addTipo} className="px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-black">Adicionar tipo</button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={props.onCancel} className="px-4 py-2 border rounded-lg">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Salvar</button>
        </div>
      </div>
    </form>
  )
}

function updateTipo(
  setForm: React.Dispatch<React.SetStateAction<Empreendimento>>,
  id: string,
  patch: Partial<TipoUnidade>
) {
  setForm(f => ({
    ...f,
    tiposUnidade: f.tiposUnidade.map(t => t.id === id ? { ...t, ...patch } : t)
  }))
}

/* ========================= DETALHES ========================= */
function Detalhes(props: { id: string; onVoltar: ()=>void; onEditar:()=>void; onMapa:()=>void }) {
  const e = getEmpreendimentoById(props.id)
  if (!e) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">Empreendimento não encontrado.</p>
        <button onClick={props.onVoltar} className="mt-3 px-4 py-2 border rounded-lg">Voltar</button>
      </div>
    )
  }

  const progresso = ((e.unidadesVendidas + e.unidadesReservadas) / Math.max(e.unidadesTotal,1)) * 100

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
        {e.imagem ? <img src={e.imagem} alt={e.nome} className="w-full h-full object-cover"/> : null}
        <button onClick={props.onVoltar} className="absolute top-4 left-4 px-3 py-1.5 bg-white/80 rounded-lg">Voltar</button>
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={props.onMapa} className="px-3 py-1.5 bg-white/80 rounded-lg">Mapa</button>
          <button onClick={props.onEditar} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg flex items-center gap-1"><Edit2 className="w-4 h-4"/> Editar</button>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6 space-y-4">
        <h2 className="text-2xl font-bold">{e.nome}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <InfoBox icon={Home} title="Unidades Totais" value={String(e.unidadesTotal)} />
          <InfoBox icon={TrendingUp} title="Vendidas" value={String(e.unidadesVendidas)} />
          <InfoBox icon={Calendar} title="Reservadas" value={String(e.unidadesReservadas)} />
          <InfoBox icon={Building} title="Disponíveis" value={String(Math.max(e.unidadesTotal - e.unidadesVendidas - e.unidadesReservadas,0))} />
        </div>

        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1"><span>Progresso</span><span>{progresso.toFixed(1)}%</span></div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-2 bg-blue-600" style={{width:`${progresso}%`}}/></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Localização</h3>
            <p className="text-gray-700">{e.localizacao.endereco} — {e.localizacao.bairro}</p>
            <p className="text-gray-700 flex items-center gap-1"><MapPin className="w-4 h-4"/>{e.localizacao.cidade} - {e.localizacao.estado} • CEP {e.localizacao.cep || '—'}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Valores</h3>
            <p className="text-gray-700">Valor médio por unidade: <span className="font-medium">{formatBRL(e.valorMedio)}</span></p>
            <p className="text-gray-700">Valor total do projeto: <span className="font-medium">{formatBRL(e.valorTotal)}</span></p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Tipos de unidade</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {e.tiposUnidade.map(t => (
              <div key={t.id} className="border rounded-lg p-3">
                <div className="flex justify-between">
                  <p className="font-medium">{t.nome} • {t.tipologia}</p>
                  <p className="text-green-700 font-medium">{formatBRL(t.precoReferencia)}</p>
                </div>
                <p className="text-sm text-gray-600">Área: {t.areaPrivativa} m² • Vagas: {t.vagasGaragem}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ========================= MAPA (mock) ========================= */
function Mapa(props: { id: string; onVoltar: ()=>void }) {
  const e = getEmpreendimentoById(props.id)
  if (!e) return null

  // grid simples 10 andares x 4 aptos
  const linhas = Array.from({length:10}, (_,i)=>10 - i)
  const colunas = [1,2,3,4]

  function cor(status: 'disponivel'|'reservado'|'vendido'|'indisponivel') {
    return {
      disponivel: 'bg-green-500 hover:bg-green-600',
      reservado: 'bg-yellow-500 hover:bg-yellow-600',
      vendido: 'bg-red-500 hover:bg-red-600',
      indisponivel: 'bg-gray-800 hover:bg-gray-900'
    }[status]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mapa de Disponibilidade</h1>
          <p className="text-gray-600">{e.nome}</p>
        </div>
        <button onClick={props.onVoltar} className="px-4 py-2 border rounded-lg">Voltar</button>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="space-y-3">
          {linhas.map(andar=>(
            <div key={andar} className="flex items-center gap-3">
              <div className="w-10 text-center text-sm text-gray-600">{andar}º</div>
              <div className="flex gap-2">
                {colunas.map(col=>{
                  const status = (andar + col) % 10 > 7 ? 'vendido' : (andar + col) % 10 > 5 ? 'reservado' : 'disponivel'
                  return (
                    <button key={col} className={`w-12 h-12 ${cor(status as any)} text-white text-xs rounded`} title={`Apto ${andar}${col}`}>{col}</button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ========================= UI base ========================= */
function InfoBox({ icon: Icon, title, value }:{icon: any; title:string; value:string}) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
        <Icon className="w-7 h-7 text-gray-500"/>
      </div>
    </div>
  )
}

function Field(props: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{props.label}</span>
      {props.children}
    </label>
  )
}
