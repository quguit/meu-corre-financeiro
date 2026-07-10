import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { relatorioService } from '../services/relatorio'

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL'
  }).format(Number(valor) || 0)
}

function formatarMoedaCurta(valor) {
  const n = Number(valor) || 0
  if (n >= 1000) return `R$${(n / 1000).toFixed(1)}k`
  return `R$${n.toFixed(0)}`
}

const TooltipCustom = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={styles.tooltip}>
      <p style={styles.tooltipLabel}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ ...styles.tooltipItem, color: p.color }}>
          {p.name}: {formatarMoeda(p.value)}
        </p>
      ))}
    </div>
  )
}

export default function Relatorio() {
  const navigate = useNavigate()
  const hoje = new Date()

  const [dadosGrafico, setDadosGrafico] = useState([])
  const [mesSelecionado, setMesSelecionado] = useState({
    mes: hoje.getMonth() + 1,
    ano: hoje.getFullYear()
  })
  const [detalhe, setDetalhe] = useState(null)
  const [projecao, setProjecao] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false)

  // Meses disponíveis para seleção (últimos 12)
  const mesesDisponiveis = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
    return {
      mes: d.getMonth() + 1,
      ano: d.getFullYear(),
      label: d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    }
  })

  async function carregarGrafico() {
    try {
      const dados = await relatorioService.fluxoUltimosMeses(6)
      setDadosGrafico(dados.map(d => ({
        name: d.label,
        Entradas: Number(d.total_entradas),
        Saídas: Number(d.total_saidas),
        Resultado: Number(d.total_entradas) - Number(d.total_saidas),
      })))
    } catch {
      // silencioso — gráfico fica vazio
    } finally {
      setCarregando(false)
    }
  }

  async function carregarDetalhe() {
    setCarregandoDetalhe(true)
    try {
      const [fluxo, proj] = await Promise.all([
        relatorioService.fluxoMensal(mesSelecionado.mes, mesSelecionado.ano),
        relatorioService.projecao(
          new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)
            .toISOString().split('T')[0]
        )
      ])
      setDetalhe(fluxo)
      setProjecao(proj)
    } catch {
      // silencioso
    } finally {
      setCarregandoDetalhe(false)
    }
  }

  useEffect(() => { carregarGrafico() }, [])
  useEffect(() => { carregarDetalhe() }, [mesSelecionado])

  const resultado = detalhe
    ? Number(detalhe.total_entradas) - Number(detalhe.total_saidas)
    : 0

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.btnVoltar}>
          ← Voltar
        </button>
        <h1 style={styles.headerTitulo}>📊 Relatório</h1>
        <div style={{ width: 70 }} />
      </div>

      <div style={styles.conteudo}>

        {/* Gráfico dos últimos 6 meses */}
        <div style={styles.card}>
          <h2 style={styles.cardTitulo}>Últimos 6 meses</h2>
          {carregando ? (
            <p style={styles.loading}>Carregando gráfico...</p>
          ) : dadosGrafico.every(d => d.Entradas === 0 && d.Saídas === 0) ? (
            <div style={styles.vazioGrafico}>
              <p>📭 Nenhuma movimentação registrada ainda.</p>
              <p style={styles.vazioSub}>Crie títulos e registre pagamentos para ver o gráfico.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dadosGrafico} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis tickFormatter={formatarMoedaCurta} tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Tooltip content={<TooltipCustom />} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="Entradas" fill="#1a6b3a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Saídas"   fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Seletor de mês */}
        <div style={styles.card}>
          <h2 style={styles.cardTitulo}>Detalhe por mês</h2>
          <select
            style={styles.seletor}
            value={`${mesSelecionado.mes}-${mesSelecionado.ano}`}
            onChange={e => {
              const [mes, ano] = e.target.value.split('-').map(Number)
              setMesSelecionado({ mes, ano })
            }}
          >
            {mesesDisponiveis.map(m => (
              <option key={`${m.mes}-${m.ano}`} value={`${m.mes}-${m.ano}`}>
                {m.label}
              </option>
            ))}
          </select>

          {carregandoDetalhe ? (
            <p style={styles.loading}>Carregando...</p>
          ) : detalhe && (
            <div style={styles.detalhes}>
              <div style={styles.detalheItem}>
                <div style={styles.detalheIcone}>📈</div>
                <div>
                  <p style={styles.detalheLabel}>Entradas</p>
                  <p style={{...styles.detalheValor, color: '#1a6b3a'}}>
                    {formatarMoeda(detalhe.total_entradas)}
                  </p>
                </div>
              </div>
              <div style={styles.detalheItem}>
                <div style={styles.detalheIcone}>📉</div>
                <div>
                  <p style={styles.detalheLabel}>Saídas</p>
                  <p style={{...styles.detalheValor, color: '#dc2626'}}>
                    {formatarMoeda(detalhe.total_saidas)}
                  </p>
                </div>
              </div>
              <div style={{...styles.detalheItem, ...styles.detalheResultado,
                background: resultado >= 0 ? '#f0fdf4' : '#fef2f2'}}>
                <div style={styles.detalheIcone}>{resultado >= 0 ? '✅' : '⚠️'}</div>
                <div>
                  <p style={styles.detalheLabel}>Resultado</p>
                  <p style={{...styles.detalheValor,
                    color: resultado >= 0 ? '#1a6b3a' : '#dc2626', fontSize: '22px'}}>
                    {formatarMoeda(resultado)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Projeção */}
        {projecao && (
          <div style={styles.card}>
            <h2 style={styles.cardTitulo}>📅 Projeção até fim do mês</h2>
            <div style={styles.projecaoGrid}>
              <div style={styles.projecaoItem}>
                <p style={styles.detalheLabel}>Saldo atual</p>
                <p style={styles.projecaoValor}>{formatarMoeda(projecao.saldo_atual)}</p>
              </div>
              <div style={styles.projecaoItem}>
                <p style={styles.detalheLabel}>A receber</p>
                <p style={{...styles.projecaoValor, color: '#1a6b3a'}}>
                  + {formatarMoeda(projecao.total_a_receber)}
                </p>
              </div>
              <div style={styles.projecaoItem}>
                <p style={styles.detalheLabel}>A pagar</p>
                <p style={{...styles.projecaoValor, color: '#dc2626'}}>
                  - {formatarMoeda(projecao.total_a_pagar)}
                </p>
              </div>
              <div style={{...styles.projecaoItem, ...styles.projecaoDestaque}}>
                <p style={styles.detalheLabel}>Saldo projetado</p>
                <p style={{...styles.projecaoValor, fontSize: '22px', fontWeight: '800',
                  color: Number(projecao.saldo_projetado) >= 0 ? '#0a3d1f' : '#dc2626'}}>
                  {formatarMoeda(projecao.saldo_projetado)}
                </p>
              </div>
            </div>
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
  conteudo: { padding: '20px 16px', maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { background: '#fff', borderRadius: '16px', padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  cardTitulo: { fontSize: '14px', fontWeight: '700', color: '#374151',
    textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 16px' },
  loading: { textAlign: 'center', color: '#9ca3af', padding: '20px 0', margin: 0 },
  vazioGrafico: { textAlign: 'center', padding: '32px 0', color: '#6b7280', fontSize: '14px' },
  vazioSub: { fontSize: '12px', color: '#9ca3af', marginTop: '6px' },
  seletor: {
    width: '100%', padding: '11px 14px', borderRadius: '10px',
    border: '1.5px solid #e5e7eb', fontSize: '14px', background: '#f9fafb',
    marginBottom: '16px', outline: 'none',
  },
  detalhes: { display: 'flex', flexDirection: 'column', gap: '10px' },
  detalheItem: {
    display: 'flex', alignItems: 'center', gap: '14px',
    padding: '14px 16px', background: '#f9fafb', borderRadius: '12px',
  },
  detalheResultado: { marginTop: '4px' },
  detalheIcone: { fontSize: '24px', minWidth: '32px', textAlign: 'center' },
  detalheLabel: { fontSize: '11px', color: '#9ca3af', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px' },
  detalheValor: { fontSize: '20px', fontWeight: '700', margin: 0, color: '#111827' },
  projecaoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  projecaoItem: { background: '#f9fafb', borderRadius: '12px', padding: '14px 16px' },
  projecaoDestaque: { background: '#f0fdf4', gridColumn: '1 / -1' },
  projecaoValor: { fontSize: '18px', fontWeight: '700', margin: '4px 0 0', color: '#111827' },
  tooltip: {
    background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px',
    padding: '10px 14px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  tooltipLabel: { fontWeight: '700', color: '#111827', margin: '0 0 6px', fontSize: '13px' },
  tooltipItem: { margin: '2px 0', fontSize: '13px', fontWeight: '600' },
}