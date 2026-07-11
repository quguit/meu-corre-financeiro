import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth'
import { relatorioService } from '../services/relatorio'
import CardResumo from '../components/CardResumo'

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL'
  }).format(Number(valor) || 0)
}

function formatarData(dataStr) {
  return new Date(dataStr + 'T00:00:00').toLocaleDateString('pt-BR')
}

export default function Dashboard() {
  const usuario = authService.usuarioAtual()
  const navigate = useNavigate()
  const hoje = new Date()

  const [saldo, setSaldo] = useState(null)
  const [fluxo, setFluxo] = useState(null)
  const [vencidos, setVencidos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregarDados() {
      try {
        const [saldoData, fluxoData, vencidosData] = await Promise.all([
          relatorioService.saldoDia(),
          relatorioService.fluxoMensal(hoje.getMonth() + 1, hoje.getFullYear()),
          relatorioService.titulosVencidos(),
        ])
        setSaldo(saldoData)
        setFluxo(fluxoData)
        setVencidos(vencidosData)
      } catch (err) {
        setErro('Erro ao carregar dados. Verifique sua conexão.')
      } finally {
        setCarregando(false)
      }
    }
    carregarDados()
  }, [])

  const resultado = fluxo ? Number(fluxo.total_entradas) - Number(fluxo.total_saidas) : 0

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.headerTitulo}>💰 Meu Corre</h1>
          <p style={styles.headerSub}>Olá, {usuario?.nome?.split(' ')[0]}!</p>
        </div>
        <button onClick={() => navigate('/perfil')} style={styles.btnSair}>
          👤 Perfil
        </button>
      </div>

      <div style={styles.conteudo}>
        {carregando ? (
          <div style={styles.loading}>
            <p>Carregando dados...</p>
          </div>
        ) : erro ? (
          <div style={styles.erroBox}>{erro}</div>
        ) : (
          <>
            {/* Cards de resumo */}
            <section style={styles.secao}>
              <h2 style={styles.secaoTitulo}>Resumo do mês</h2>
              <div style={styles.cards}>
                <CardResumo
                  titulo="Saldo Total"
                  valor={formatarMoeda(saldo?.total_contas)}
                  icone="🏦"
                  cor="#0a3d1f"
                  sub={`${saldo?.contas?.length || 0} conta(s)`}
                />
                <CardResumo
                  titulo="Entradas"
                  valor={formatarMoeda(fluxo?.total_entradas)}
                  icone="📈"
                  cor="#1a6b3a"
                />
                <CardResumo
                  titulo="Saídas"
                  valor={formatarMoeda(fluxo?.total_saidas)}
                  icone="📉"
                  cor="#dc2626"
                />
                <CardResumo
                  titulo="Resultado"
                  valor={formatarMoeda(resultado)}
                  icone={resultado >= 0 ? '✅' : '⚠️'}
                  cor={resultado >= 0 ? '#1a6b3a' : '#dc2626'}
                />
              </div>
            </section>

            {/* Contas */}
            {saldo?.contas?.length > 0 && (
              <section style={styles.secao}>
                <h2 style={styles.secaoTitulo}>Contas</h2>
                <div style={styles.lista}>
                  {saldo.contas.map(conta => (
                    <div key={conta.id} style={styles.itemConta}>
                      <div>
                        <p style={styles.itemNome}>{conta.nome}</p>
                        <p style={styles.itemTipo}>{conta.tipo}</p>
                      </div>
                      <p style={styles.itemValor}>
                        {formatarMoeda(conta.saldo_atual)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Títulos vencidos */}
            <section style={styles.secao}>
              <h2 style={styles.secaoTitulo}>
                ⚠️ Títulos Vencidos
                {vencidos.length > 0 && (
                  <span style={styles.badge}>{vencidos.length}</span>
                )}
              </h2>
              {vencidos.length === 0 ? (
                <div style={styles.vazio}>
                  <p>✅ Nenhum título vencido!</p>
                </div>
              ) : (
                <div style={styles.lista}>
                  {vencidos.map(t => (
                    <div key={t.id} style={styles.itemVencido}>
                      <div style={styles.itemVencidoInfo}>
                        <p style={styles.itemNome}>{t.descricao}</p>
                        <p style={styles.itemTipo}>
                          Venceu {formatarData(t.vencimento)} • {t.dias_atraso} dia(s) de atraso
                        </p>
                      </div>
                      <div style={styles.itemVencidoValor}>
                        <p style={styles.itemValorVerm}>{formatarMoeda(t.saldo_restante)}</p>
                        <p style={styles.itemCodigo}>{t.codigo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Botões de ação rápida */}
            <section style={styles.secao}>
              <h2 style={styles.secaoTitulo}>Ações rápidas</h2>
              <div style={styles.acoes}>
                <button
                  onClick={() => navigate('/contas')}
                  style={styles.btnAcao}
                >
                  🏦 Contas
                </button>
                <button
                  onClick={() => navigate('/titulos')}
                  style={styles.btnAcao}
                >
                  📄 Títulos
                </button>
                <button
                  onClick={() => navigate('/titulos/novo')}
                  style={{...styles.btnAcao, ...styles.btnAcaoPrimario}}
                >
                  ＋ Novo Título
                </button>
                <button
                  onClick={() => navigate('/relatorio')}
                  style={styles.btnAcao}
                >
                  📊 Relatório
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f3f4f6',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  header: {
    background: 'linear-gradient(135deg, #0a3d1f, #1a6b3a)',
    padding: '20px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitulo: { color: '#fff', fontSize: '20px', fontWeight: '800', margin: 0 },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: '13px', margin: '4px 0 0' },
  btnSair: {
    background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer',
  },
  conteudo: { padding: '20px 16px', maxWidth: '800px', margin: '0 auto' },
  loading: { textAlign: 'center', padding: '60px', color: '#6b7280' },
  erroBox: {
    background: '#fef2f2', color: '#dc2626', padding: '16px',
    borderRadius: '12px', textAlign: 'center',
  },
  secao: { marginBottom: '24px' },
  secaoTitulo: {
    fontSize: '14px', fontWeight: '700', color: '#374151',
    textTransform: 'uppercase', letterSpacing: '0.5px',
    margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px',
  },
  badge: {
    background: '#dc2626', color: '#fff', borderRadius: '999px',
    padding: '2px 8px', fontSize: '11px', fontWeight: '700',
  },
  cards: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  lista: { display: 'flex', flexDirection: 'column', gap: '8px' },
  itemConta: {
    background: '#fff', borderRadius: '12px', padding: '16px 20px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  itemNome: { fontWeight: '600', color: '#111827', margin: '0 0 2px', fontSize: '15px' },
  itemTipo: { fontSize: '12px', color: '#9ca3af', margin: 0, textTransform: 'capitalize' },
  itemValor: { fontWeight: '700', color: '#0a3d1f', fontSize: '16px', margin: 0 },
  itemVencido: {
    background: '#fff', borderRadius: '12px', padding: '16px 20px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    borderLeft: '4px solid #dc2626',
  },
  itemVencidoInfo: { flex: 1 },
  itemVencidoValor: { textAlign: 'right' },
  itemValorVerm: { fontWeight: '700', color: '#dc2626', fontSize: '16px', margin: '0 0 2px' },
  itemCodigo: { fontSize: '11px', color: '#9ca3af', margin: 0 },
  vazio: {
    background: '#f0fdf4', borderRadius: '12px', padding: '24px',
    textAlign: 'center', color: '#1a6b3a', fontWeight: '600',
  },
  acoes: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  btnAcao: {
    padding: '12px 20px', background: '#fff', color: '#374151',
    border: '1.5px solid #e5e7eb', borderRadius: '10px',
    fontSize: '14px', fontWeight: '600', cursor: 'pointer',
  },
  btnAcaoPrimario: {
    background: 'linear-gradient(135deg, #1a6b3a, #0a3d1f)',
    color: '#fff', border: 'none',
  },
}