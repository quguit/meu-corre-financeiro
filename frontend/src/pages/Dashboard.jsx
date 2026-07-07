import { authService } from '../services/auth'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const usuario = authService.usuarioAtual()
  const navigate = useNavigate()

  function handleLogout() {
    authService.logout()
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.titulo}>👋 Olá, {usuario?.nome}!</h1>
        <p style={styles.sub}>Bem-vindo ao Meu Corre Financeiro</p>
        <p style={styles.info}>Dashboard em construção...</p>
        <button onClick={handleLogout} style={styles.botao}>
          Sair
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a3d1f 0%, #1a6b3a 50%, #0d4a25 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  card: {
    background: 'rgba(255,255,255,0.97)', borderRadius: '20px',
    padding: '40px', textAlign: 'center', minWidth: '300px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  titulo: { color: '#0a3d1f', fontSize: '24px', margin: '0 0 8px' },
  sub: { color: '#1a6b3a', fontSize: '14px', margin: '0 0 24px' },
  info: { color: '#6b7280', fontSize: '13px', margin: '0 0 24px' },
  botao: {
    padding: '12px 24px', background: 'linear-gradient(135deg, #1a6b3a, #0a3d1f)',
    color: '#fff', border: 'none', borderRadius: '10px',
    fontSize: '14px', fontWeight: '700', cursor: 'pointer',
  }
}