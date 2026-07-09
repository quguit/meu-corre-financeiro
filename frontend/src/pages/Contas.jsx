import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { contaService } from '../services/conta'

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL'
  }).format(Number(valor) || 0)
}

const TIPOS = [
  { value: 'corrente',  label: 'Conta Corrente',  icone: '🏦' },
  { value: 'poupanca',  label: 'Poupança',         icone: '🐷' },
  { value: 'caixa',     label: 'Caixa',            icone: '💵' },
  { value: 'carteira',  label: 'Carteira',         icone: '👛' },
]

function iconeConta(tipo) {
  return TIPOS.find(t => t.value === tipo)?.icone || '🏦'
}

function labelConta(tipo) {
  return TIPOS.find(t => t.value === tipo)?.label || tipo
}

export default function Contas() {
  const navigate = useNavigate()
  const [contas, setContas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [form, setForm] = useState({ nome: '', tipo: 'corrente', saldo_inicial: '' })
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  async function carregar() {
    try {
      const data = await contaService.listar()
      setContas(data)
    } catch {
      setErro('Erro ao carregar contas.')
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
      await contaService.criar({
        nome: form.nome,
        tipo: form.tipo,
        saldo_inicial: form.saldo_inicial || '0',
      })
      setForm({ nome: '', tipo: 'corrente', saldo_inicial: '' })
      setMostrarForm(false)
      await carregar()
    } catch (err) {
      const msg = err.response?.data?.detail
      setErro(typeof msg === 'string' ? msg : 'Erro ao criar conta.')
    } finally {
      setSalvando(false)
    }
  }

  async function handleDesativar(id, nome) {
    if (!confirm(`Desativar a conta "${nome}"?`)) return
    try {
      await contaService.desativar(id)
      await carregar()
    } catch {
      setErro('Erro ao desativar conta.')
    }
  }

  const totalSaldo = contas.reduce((acc, c) => acc + Number(c.saldo_atual), 0)

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.btnVoltar}>
          ← Voltar
        </button>
        <h1 style={styles.headerTitulo}>🏦 Contas</h1>
        <button onClick={() => setMostrarForm(!mostrarForm)} style={styles.btnNovo}>
          {mostrarForm ? '✕' : '+ Nova'}
        </button>
      </div>

      <div style={styles.conteudo}>
        {/* Card total */}
        <div style={styles.cardTotal}>
          <p style={styles.cardTotalLabel}>Saldo Total</p>
          <p style={styles.cardTotalValor}>{formatarMoeda(totalSaldo)}</p>
          <p style={styles.cardTotalSub}>{contas.length} conta(s) ativa(s)</p>
        </div>

        {/* Formulário de nova conta */}
        {mostrarForm && (
          <div style={styles.formCard}>
            <h2 style={styles.formTitulo}>Nova Conta</h2>
            <form onSubmit={handleCriar} style={styles.form}>
              <div style={styles.campo}>
                <label style={styles.label}>Nome da conta</label>
                <input
                  name="nome" value={form.nome} onChange={handleChange}
                  placeholder="Ex: Bradesco, Caixa..." style={styles.input} required
                />
              </div>
              <div style={styles.campoRow}>
                <div style={{...styles.campo, flex: 1}}>
                  <label style={styles.label}>Tipo</label>
                  <select name="tipo" value={form.tipo} onChange={handleChange} style={styles.input}>
                    {TIPOS.map(t => (
                      <option key={t.value} value={t.value}>{t.icone} {t.label}</option>
                    ))}
                  </select>
                </div>
                <div style={{...styles.campo, flex: 1}}>
                  <label style={styles.label}>Saldo inicial</label>
                  <input
                    name="saldo_inicial" value={form.saldo_inicial} onChange={handleChange}
                    placeholder="0,00" type="number" step="0.01" min="0" style={styles.input}
                  />
                </div>
              </div>
              {erro && <p style={styles.erro}>{erro}</p>}
              <div style={styles.formBotoes}>
                <button type="button" onClick={() => setMostrarForm(false)} style={styles.btnCancelar}>
                  Cancelar
                </button>
                <button type="submit" style={salvando ? {...styles.btnSalvar, opacity: 0.7} : styles.btnSalvar} disabled={salvando}>
                  {salvando ? 'Salvando...' : 'Criar conta'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de contas */}
        {carregando ? (
          <p style={styles.loading}>Carregando...</p>
        ) : contas.length === 0 ? (
          <div style={styles.vazio}>
            <p style={styles.vazioPrincipal}>Nenhuma conta cadastrada</p>
            <p style={styles.vazioSub}>Clique em "+ Nova" para criar sua primeira conta</p>
          </div>
        ) : (
          <div style={styles.lista}>
            {contas.map(conta => (
              <div key={conta.id} style={styles.itemConta}>
                <div style={styles.itemIcone}>{iconeConta(conta.tipo)}</div>
                <div style={styles.itemInfo}>
                  <p style={styles.itemNome}>{conta.nome}</p>
                  <p style={styles.itemTipo}>{labelConta(conta.tipo)}</p>
                </div>
                <div style={styles.itemDireita}>
                  <p style={{
                    ...styles.itemSaldo,
                    color: Number(conta.saldo_atual) >= 0 ? '#0a3d1f' : '#dc2626'
                  }}>
                    {formatarMoeda(conta.saldo_atual)}
                  </p>
                  <button
                    onClick={() => handleDesativar(conta.id, conta.nome)}
                    style={styles.btnDesativar}
                  >
                    Desativar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#f3f4f6', fontFamily: "'Inter', 'Segoe UI', sans-serif" },
  header: {
    background: 'linear-gradient(135deg, #0a3d1f, #1a6b3a)',
    padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
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
  conteudo: { padding: '20px 16px', maxWidth: '600px', margin: '0 auto' },
  cardTotal: {
    background: 'linear-gradient(135deg, #0a3d1f, #1a6b3a)',
    borderRadius: '16px', padding: '24px', marginBottom: '20px', textAlign: 'center',
  },
  cardTotalLabel: { color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' },
  cardTotalValor: { color: '#fff', fontSize: '36px', fontWeight: '800', margin: '0 0 4px', letterSpacing: '-1px' },
  cardTotalSub: { color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: 0 },
  formCard: {
    background: '#fff', borderRadius: '16px', padding: '24px',
    marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  formTitulo: { fontSize: '16px', fontWeight: '700', color: '#111827', margin: '0 0 16px' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  campo: { display: 'flex', flexDirection: 'column', gap: '6px' },
  campoRow: { display: 'flex', gap: '12px' },
  label: { fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.3px' },
  input: {
    padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb',
    fontSize: '14px', outline: 'none', background: '#f9fafb', width: '100%', boxSizing: 'border-box',
  },
  erro: { background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', margin: 0 },
  formBotoes: { display: 'flex', gap: '10px', justifyContent: 'flex-end' },
  btnCancelar: {
    padding: '10px 20px', background: '#f3f4f6', color: '#374151',
    border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer',
  },
  btnSalvar: {
    padding: '10px 20px', background: 'linear-gradient(135deg, #1a6b3a, #0a3d1f)',
    color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
  },
  loading: { textAlign: 'center', color: '#6b7280', padding: '40px' },
  vazio: {
    background: '#fff', borderRadius: '16px', padding: '40px',
    textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  vazioPrincipal: { fontWeight: '700', color: '#374151', fontSize: '16px', margin: '0 0 8px' },
  vazioSub: { color: '#9ca3af', fontSize: '13px', margin: 0 },
  lista: { display: 'flex', flexDirection: 'column', gap: '10px' },
  itemConta: {
    background: '#fff', borderRadius: '14px', padding: '16px 20px',
    display: 'flex', alignItems: 'center', gap: '14px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  itemIcone: { fontSize: '28px', minWidth: '36px', textAlign: 'center' },
  itemInfo: { flex: 1 },
  itemNome: { fontWeight: '600', color: '#111827', margin: '0 0 2px', fontSize: '15px' },
  itemTipo: { fontSize: '12px', color: '#9ca3af', margin: 0 },
  itemDireita: { textAlign: 'right' },
  itemSaldo: { fontWeight: '700', fontSize: '16px', margin: '0 0 4px' },
  btnDesativar: {
    background: 'none', border: '1px solid #e5e7eb', color: '#9ca3af',
    borderRadius: '6px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer',
  },
}