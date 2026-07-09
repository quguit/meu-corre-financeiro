import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { tituloService } from '../services/titulo'
import { contaService } from '../services/conta'

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL'
  }).format(Number(valor) || 0)
}

function formatarData(dataStr) {
  return new Date(dataStr + 'T00:00:00').toLocaleDateString('pt-BR')
}

const STATUS_COR = {
  aberto:    { bg: '#eff6ff', texto: '#1d4ed8', label: 'Aberto' },
  parcial:   { bg: '#fefce8', texto: '#854d0e', label: 'Parcial' },
  quitado:   { bg: '#f0fdf4', texto: '#166534', label: 'Quitado' },
  cancelado: { bg: '#f9fafb', texto: '#6b7280', label: 'Cancelado' },
}

const CATEGORIAS = [
  'Alimentação', 'Aluguel', 'Água/Luz/Internet', 'Saúde',
  'Transporte', 'Salário', 'Venda', 'Empréstimo',
  'Fornecedor', 'Cliente', 'Outros'
]

export default function Titulos() {
  const navigate = useNavigate()
  const [titulos, setTitulos] = useState([])
  const [contas, setContas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [tituloPagando, setTituloPagando] = useState(null)
  const [filtro, setFiltro] = useState('todos')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  const hoje = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    conta_id: '', tipo: 'pagar', descricao: '',
    valor_total: '', vencimento: hoje, categoria: '', observacao: ''
  })

  const [formPagamento, setFormPagamento] = useState({
    valor: '', data_pagamento: hoje, descricao: ''
  })

  async function carregar() {
    try {
      const [titulosData, contasData] = await Promise.all([
        tituloService.listar(),
        contaService.listar(),
      ])
      setTitulos(titulosData)
      setContas(contasData)
      if (contasData.length > 0 && !form.conta_id) {
        setForm(f => ({ ...f, conta_id: contasData[0].id }))
      }
    } catch {
      setErro('Erro ao carregar dados.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => { carregar() }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleCriar(e) {
    e.preventDefault()
    setErro('')
    setSalvando(true)
    try {
      await tituloService.criar({
        ...form,
        conta_id: Number(form.conta_id),
        valor_total: form.valor_total,
      })
      setForm({ conta_id: contas[0]?.id || '', tipo: 'pagar', descricao: '',
        valor_total: '', vencimento: hoje, categoria: '', observacao: '' })
      setMostrarForm(false)
      await carregar()
    } catch (err) {
      const msg = err.response?.data?.detail
      setErro(typeof msg === 'string' ? msg : 'Erro ao criar título.')
    } finally {
      setSalvando(false)
    }
  }

  async function handlePagar(e) {
    e.preventDefault()
    setErro('')
    setSalvando(true)
    try {
      await tituloService.pagar(tituloPagando.id, {
        valor: formPagamento.valor,
        data_pagamento: formPagamento.data_pagamento,
        descricao: formPagamento.descricao || undefined,
      })
      setTituloPagando(null)
      setFormPagamento({ valor: '', data_pagamento: hoje, descricao: '' })
      await carregar()
    } catch (err) {
      const msg = err.response?.data?.detail
      setErro(typeof msg === 'string' ? msg : 'Erro ao registrar pagamento.')
    } finally {
      setSalvando(false)
    }
  }

  async function handleCancelar(titulo) {
    if (!confirm(`Cancelar "${titulo.descricao}"?`)) return
    try {
      await tituloService.cancelar(titulo.id)
      await carregar()
    } catch {
      setErro('Erro ao cancelar título.')
    }
  }

  const titulosFiltrados = titulos.filter(t => {
    if (filtro === 'todos') return true
    if (filtro === 'abertos') return ['aberto', 'parcial'].includes(t.status)
    if (filtro === 'pagar') return t.tipo === 'pagar' && t.status !== 'cancelado'
    if (filtro === 'receber') return t.tipo === 'receber' && t.status !== 'cancelado'
    return true
  })

  const saldoRestante = tituloPagando
    ? Number(tituloPagando.valor_total) - Number(tituloPagando.valor_pago)
    : 0

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.btnVoltar}>← Voltar</button>
        <h1 style={styles.headerTitulo}>📄 Títulos</h1>
        <button onClick={() => setMostrarForm(!mostrarForm)} style={styles.btnNovo}>
          {mostrarForm ? '✕' : '+ Novo'}
        </button>
      </div>

      <div style={styles.conteudo}>

        {/* Modal de pagamento */}
        {tituloPagando && (
          <div style={styles.overlay}>
            <div style={styles.modal}>
              <h2 style={styles.modalTitulo}>💳 Registrar Pagamento</h2>
              <p style={styles.modalSub}>{tituloPagando.descricao}</p>
              <p style={styles.modalSaldo}>
                Saldo restante: <strong>{formatarMoeda(saldoRestante)}</strong>
              </p>
              <form onSubmit={handlePagar} style={styles.form}>
                <div style={styles.campo}>
                  <label style={styles.label}>Valor pago</label>
                  <input
                    value={formPagamento.valor}
                    onChange={e => setFormPagamento({...formPagamento, valor: e.target.value})}
                    type="number" step="0.01" min="0.01" max={saldoRestante}
                    placeholder="0,00" style={styles.input} required
                  />
                </div>
                <div style={styles.campo}>
                  <label style={styles.label}>Data do pagamento</label>
                  <input
                    value={formPagamento.data_pagamento}
                    onChange={e => setFormPagamento({...formPagamento, data_pagamento: e.target.value})}
                    type="date" style={styles.input} required
                  />
                </div>
                <div style={styles.campo}>
                  <label style={styles.label}>Observação (opcional)</label>
                  <input
                    value={formPagamento.descricao}
                    onChange={e => setFormPagamento({...formPagamento, descricao: e.target.value})}
                    placeholder="Ex: Pago via PIX" style={styles.input}
                  />
                </div>
                {erro && <p style={styles.erro}>{erro}</p>}
                <div style={styles.formBotoes}>
                  <button type="button" onClick={() => { setTituloPagando(null); setErro('') }}
                    style={styles.btnCancelar}>Cancelar</button>
                  <button type="submit"
                    style={salvando ? {...styles.btnSalvar, opacity: 0.7} : styles.btnSalvar}
                    disabled={salvando}>
                    {salvando ? 'Salvando...' : 'Confirmar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Formulário novo título */}
        {mostrarForm && (
          <div style={styles.formCard}>
            <h2 style={styles.formTitulo}>Novo Título</h2>
            {contas.length === 0 ? (
              <div style={styles.avisoSemConta}>
                <p>⚠️ Você precisa criar uma conta antes de lançar um título.</p>
                <button onClick={() => navigate('/contas')} style={styles.btnSalvar}>
                  Criar conta
                </button>
              </div>
            ) : (
              <form onSubmit={handleCriar} style={styles.form}>
                <div style={styles.campoRow}>
                  <div style={{...styles.campo, flex: 1}}>
                    <label style={styles.label}>Tipo</label>
                    <select name="tipo" value={form.tipo} onChange={handleChange} style={styles.input}>
                      <option value="pagar">📤 A Pagar</option>
                      <option value="receber">📥 A Receber</option>
                    </select>
                  </div>
                  <div style={{...styles.campo, flex: 1}}>
                    <label style={styles.label}>Conta</label>
                    <select name="conta_id" value={form.conta_id} onChange={handleChange} style={styles.input}>
                      {contas.map(c => (
                        <option key={c.id} value={c.id}>{c.nome}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={styles.campo}>
                  <label style={styles.label}>Descrição</label>
                  <input name="descricao" value={form.descricao} onChange={handleChange}
                    placeholder="Ex: Aluguel, Fornecedor João..." style={styles.input} required />
                </div>
                <div style={styles.campoRow}>
                  <div style={{...styles.campo, flex: 1}}>
                    <label style={styles.label}>Valor</label>
                    <input name="valor_total" value={form.valor_total} onChange={handleChange}
                      type="number" step="0.01" min="0.01" placeholder="0,00" style={styles.input} required />
                  </div>
                  <div style={{...styles.campo, flex: 1}}>
                    <label style={styles.label}>Vencimento</label>
                    <input name="vencimento" value={form.vencimento} onChange={handleChange}
                      type="date" style={styles.input} required />
                  </div>
                </div>
                <div style={styles.campo}>
                  <label style={styles.label}>Categoria</label>
                  <select name="categoria" value={form.categoria} onChange={handleChange} style={styles.input}>
                    <option value="">Sem categoria</option>
                    {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={styles.campo}>
                  <label style={styles.label}>Observação (opcional)</label>
                  <input name="observacao" value={form.observacao} onChange={handleChange}
                    placeholder="Alguma observação..." style={styles.input} />
                </div>
                {erro && <p style={styles.erro}>{erro}</p>}
                <div style={styles.formBotoes}>
                  <button type="button" onClick={() => setMostrarForm(false)} style={styles.btnCancelar}>
                    Cancelar
                  </button>
                  <button type="submit"
                    style={salvando ? {...styles.btnSalvar, opacity: 0.7} : styles.btnSalvar}
                    disabled={salvando}>
                    {salvando ? 'Salvando...' : 'Criar título'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Filtros */}
        <div style={styles.filtros}>
          {[
            { key: 'todos',   label: 'Todos' },
            { key: 'abertos', label: 'Em aberto' },
            { key: 'pagar',   label: 'A Pagar' },
            { key: 'receber', label: 'A Receber' },
          ].map(f => (
            <button key={f.key} onClick={() => setFiltro(f.key)}
              style={filtro === f.key ? styles.filtroBtnAtivo : styles.filtroBtn}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Lista */}
        {carregando ? (
          <p style={styles.loading}>Carregando...</p>
        ) : titulosFiltrados.length === 0 ? (
          <div style={styles.vazio}>
            <p style={styles.vazioPrincipal}>Nenhum título encontrado</p>
            <p style={styles.vazioSub}>Clique em "+ Novo" para criar um lançamento</p>
          </div>
        ) : (
          <div style={styles.lista}>
            {titulosFiltrados.map(t => {
              const st = STATUS_COR[t.status] || STATUS_COR.aberto
              const atrasado = t.status !== 'quitado' && t.status !== 'cancelado'
                && new Date(t.vencimento) < new Date(hoje)
              return (
                <div key={t.id} style={{
                  ...styles.item,
                  borderLeft: `4px solid ${t.tipo === 'receber' ? '#1a6b3a' : '#dc2626'}`
                }}>
                  <div style={styles.itemTopo}>
                    <div style={styles.itemInfo}>
                      <p style={styles.itemNome}>{t.descricao}</p>
                      <p style={styles.itemMeta}>
                        {t.codigo} • {t.categoria || 'Sem categoria'}
                      </p>
                    </div>
                    <div style={styles.itemDireita}>
                      <p style={{
                        ...styles.itemValor,
                        color: t.tipo === 'receber' ? '#1a6b3a' : '#dc2626'
                      }}>
                        {t.tipo === 'receber' ? '+' : '-'} {formatarMoeda(t.valor_total)}
                      </p>
                      <span style={{...styles.badge, background: st.bg, color: st.texto}}>
                        {st.label}
                      </span>
                    </div>
                  </div>
                  <div style={styles.itemRodape}>
                    <p style={{...styles.itemVenc, color: atrasado ? '#dc2626' : '#6b7280'}}>
                      {atrasado ? '⚠️ ' : '📅 '}Vence {formatarData(t.vencimento)}
                      {t.valor_pago > 0 && ` • Pago ${formatarMoeda(t.valor_pago)}`}
                    </p>
                    <div style={styles.itemAcoes}>
                      {['aberto', 'parcial'].includes(t.status) && (
                        <button onClick={() => {
                          setTituloPagando(t)
                          setFormPagamento({ valor: String(Number(t.valor_total) - Number(t.valor_pago)),
                            data_pagamento: hoje, descricao: '' })
                          setErro('')
                        }} style={styles.btnPagar}>
                          Pagar
                        </button>
                      )}
                      {t.status !== 'cancelado' && t.status !== 'quitado' && (
                        <button onClick={() => handleCancelar(t)} style={styles.btnCancelarItem}>
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#f3f4f6', fontFamily: "'Inter', 'Segoe UI', sans-serif" },
  header: {
    background: 'linear-gradient(135deg, #0a3d1f, #1a6b3a)', padding: '16px 20px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  headerTitulo: { color: '#fff', fontSize: '18px', fontWeight: '800', margin: 0 },
  btnVoltar: {
    background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '8px', padding: '8px 14px', fontSize: '13px', cursor: 'pointer',
  },
  btnNovo: {
    background: '#fff', color: '#0a3d1f', border: 'none',
    borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
  },
  conteudo: { padding: '20px 16px', maxWidth: '700px', margin: '0 auto' },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 100, padding: '20px',
  },
  modal: {
    background: '#fff', borderRadius: '20px', padding: '28px',
    width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  modalTitulo: { fontSize: '18px', fontWeight: '800', color: '#111827', margin: '0 0 4px' },
  modalSub: { color: '#6b7280', fontSize: '14px', margin: '0 0 8px' },
  modalSaldo: { color: '#374151', fontSize: '14px', margin: '0 0 16px',
    background: '#f3f4f6', padding: '10px 14px', borderRadius: '8px' },
  formCard: {
    background: '#fff', borderRadius: '16px', padding: '24px',
    marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  formTitulo: { fontSize: '16px', fontWeight: '700', color: '#111827', margin: '0 0 16px' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  campo: { display: 'flex', flexDirection: 'column', gap: '6px' },
  campoRow: { display: 'flex', gap: '12px' },
  label: { fontSize: '12px', fontWeight: '600', color: '#374151',
    textTransform: 'uppercase', letterSpacing: '0.3px' },
  input: {
    padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb',
    fontSize: '14px', outline: 'none', background: '#f9fafb',
    width: '100%', boxSizing: 'border-box',
  },
  erro: { background: '#fef2f2', color: '#dc2626', padding: '10px 14px',
    borderRadius: '8px', fontSize: '13px', margin: 0 },
  formBotoes: { display: 'flex', gap: '10px', justifyContent: 'flex-end' },
  btnCancelar: {
    padding: '10px 20px', background: '#f3f4f6', color: '#374151',
    border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer',
  },
  btnSalvar: {
    padding: '10px 20px', background: 'linear-gradient(135deg, #1a6b3a, #0a3d1f)',
    color: '#fff', border: 'none', borderRadius: '8px',
    fontSize: '14px', fontWeight: '700', cursor: 'pointer',
  },
  avisoSemConta: { textAlign: 'center', padding: '20px', display: 'flex',
    flexDirection: 'column', gap: '16px', alignItems: 'center' },
  filtros: { display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' },
  filtroBtn: {
    padding: '8px 16px', background: '#fff', color: '#6b7280',
    border: '1.5px solid #e5e7eb', borderRadius: '999px',
    fontSize: '13px', cursor: 'pointer', fontWeight: '500',
  },
  filtroBtnAtivo: {
    padding: '8px 16px', background: '#0a3d1f', color: '#fff',
    border: '1.5px solid #0a3d1f', borderRadius: '999px',
    fontSize: '13px', cursor: 'pointer', fontWeight: '600',
  },
  loading: { textAlign: 'center', color: '#6b7280', padding: '40px' },
  vazio: {
    background: '#fff', borderRadius: '16px', padding: '40px',
    textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  vazioPrincipal: { fontWeight: '700', color: '#374151', fontSize: '16px', margin: '0 0 8px' },
  vazioSub: { color: '#9ca3af', fontSize: '13px', margin: 0 },
  lista: { display: 'flex', flexDirection: 'column', gap: '10px' },
  item: {
    background: '#fff', borderRadius: '14px', padding: '16px 20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  itemTopo: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  itemInfo: { flex: 1, paddingRight: '12px' },
  itemNome: { fontWeight: '600', color: '#111827', margin: '0 0 4px', fontSize: '15px' },
  itemMeta: { fontSize: '11px', color: '#9ca3af', margin: 0 },
  itemDireita: { textAlign: 'right' },
  itemValor: { fontWeight: '700', fontSize: '16px', margin: '0 0 4px' },
  badge: { fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '999px' },
  itemRodape: { display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    borderTop: '1px solid #f3f4f6', paddingTop: '10px' },
  itemVenc: { fontSize: '12px', margin: 0 },
  itemAcoes: { display: 'flex', gap: '6px' },
  btnPagar: {
    background: '#0a3d1f', color: '#fff', border: 'none',
    borderRadius: '6px', padding: '5px 12px', fontSize: '12px',
    fontWeight: '600', cursor: 'pointer',
  },
  btnCancelarItem: {
    background: 'none', color: '#9ca3af', border: '1px solid #e5e7eb',
    borderRadius: '6px', padding: '5px 12px', fontSize: '12px', cursor: 'pointer',
  },
}