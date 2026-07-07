import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/auth'

export default function Cadastro() {
  const [form, setForm] = useState({ nome: '', email: '', senha: '', tipo: 'pessoal' })
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      await authService.cadastrar(form)
      await authService.login(form.email, form.senha)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.detail
      setErro(typeof msg === 'string' ? msg : 'Erro ao cadastrar. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={styles.logoIcone}>💰</span>
          <h1 style={styles.logoTexto}>Meu Corre</h1>
          <p style={styles.logoSub}>Criar conta</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.campo}>
            <label style={styles.label}>Nome</label>
            <input name="nome" value={form.nome} onChange={handleChange}
              placeholder="Seu nome" style={styles.input} required />
          </div>
          <div style={styles.campo}>
            <label style={styles.label}>E-mail</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="seu@email.com" style={styles.input} required />
          </div>
          <div style={styles.campo}>
            <label style={styles.label}>Senha</label>
            <input name="senha" type="password" value={form.senha} onChange={handleChange}
              placeholder="Mínimo 6 caracteres" style={styles.input} required />
          </div>
          <div style={styles.campo}>
            <label style={styles.label}>Tipo de conta</label>
            <select name="tipo" value={form.tipo} onChange={handleChange} style={styles.input}>
              <option value="pessoal">Pessoal</option>
              <option value="empresa">Empresa</option>
            </select>
          </div>

          {erro && <p style={styles.erro}>{erro}</p>}

          <button type="submit"
            style={carregando ? {...styles.botao, opacity: 0.7} : styles.botao}
            disabled={carregando}>
            {carregando ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p style={styles.linkTexto}>
          Já tem conta?{' '}
          <Link to="/login" style={styles.link}>Entrar</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a3d1f 0%, #1a6b3a 50%, #0d4a25 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  card: {
    background: 'rgba(255,255,255,0.97)', borderRadius: '20px',
    padding: '40px 36px', width: '100%', maxWidth: '400px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  logo: { textAlign: 'center', marginBottom: '28px' },
  logoIcone: { fontSize: '36px' },
  logoTexto: { margin: '8px 0 0', fontSize: '24px', fontWeight: '800', color: '#0a3d1f' },
  logoSub: { margin: '2px 0 0', fontSize: '13px', color: '#1a6b3a', fontWeight: '500',
    letterSpacing: '2px', textTransform: 'uppercase' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  campo: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#374151' },
  input: { padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb',
    fontSize: '15px', outline: 'none', background: '#f9fafb' },
  erro: { background: '#fef2f2', color: '#dc2626', padding: '10px 14px',
    borderRadius: '8px', fontSize: '13px', margin: '0' },
  botao: { padding: '14px', background: 'linear-gradient(135deg, #1a6b3a, #0a3d1f)',
    color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px',
    fontWeight: '700', cursor: 'pointer', marginTop: '4px' },
  linkTexto: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6b7280' },
  link: { color: '#1a6b3a', fontWeight: '600', textDecoration: 'none' },
}