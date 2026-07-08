export default function CardResumo({ titulo, valor, icone, cor = '#1a6b3a', sub }) {
  return (
    <div style={styles.card}>
      <div style={styles.topo}>
        <span style={styles.icone}>{icone}</span>
        <span style={{...styles.titulo}}>{titulo}</span>
      </div>
      <p style={{...styles.valor, color: cor}}>{valor}</p>
      {sub && <p style={styles.sub}>{sub}</p>}
    </div>
  )
}

const styles = {
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '20px 24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    flex: 1,
    minWidth: '140px',
  },
  topo: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' },
  icone: { fontSize: '20px' },
  titulo: { fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' },
  valor: { fontSize: '28px', fontWeight: '800', margin: '0 0 4px', letterSpacing: '-1px' },
  sub: { fontSize: '12px', color: '#9ca3af', margin: '0' },
}