import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth'

const TIPO_LABEL = {
  pessoal: '👤 Pessoal',
  empresa: '🏢 Empresa',
}

export default function Perfil() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [secao, setSecao] = useState(null) // 'nome' | 'senha' | null
  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState('')
  const [erro, setErro] = useState('')

  const [formNome, setFormNome] = useState('')
  const [formSenha, setFormSenha] = useState({ atual: '', nova: '', confirmar: '' })

  useEffect(() => {
    async function carregar() {
      try {
        const data = await authService.meuPerfil()
        setUsuario(data)
        setFormNome(data.nome)
      } catch {
        setErro('Erro ao carregar perfil.')
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])

  function abrirSecao(s) {
    setSecao(s)
    setErro('')
    setSucesso('')
  }

  function formatarData(dataStr) {
    return new Date(dataStr).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric'
    })
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.btnVoltar}>
          ← Voltar
        </button>
        <h1 style={styles.headerTitulo}>👤 Perfil</h1>
        <div style={{ width: 70 }} />
      </div>

      <div style={styles.conteudo}>
        {carregando ? (
          <p style={styles.loading}>Carregando...</p>
        ) : usuario && (
          <>
            {/* Avatar e nome */}
            <div style={styles.avatarCard}>
              <div style={styles.avatar}>
                {usuario.nome.charAt(0).toUpperCase()}
              </div>
              <h2 style={styles.avatarNome}>{usuario.nome}</h2>
              <p style={styles.avatarEmail}>{usuario.email}</p>
              <span style={styles.avatarTipo}>{TIPO_LABEL[usuario.tipo]}</span>
            </div>

            {/* Informações */}
            <div style={styles.card}>
              <h3 style={styles.cardTitulo}>Informações da conta</h3>
              <div style={styles.infoLista}>
                <div style={styles.infoItem}>
                  <p style={styles.infoLabel}>Nome</p>
                  <p style={styles.infoValor}>{usuario.nome}</p>
                </div>
                <div style={styles.infoItem}>
                  <p style={styles.infoLabel}>E-mail</p>
                  <p style={styles.infoValor}>{usuario.email}</p>
                </div>
                <div style={styles.infoItem}>
                  <p style={styles.infoLabel}>Tipo de conta</p>
                  <p style={styles.infoValor}>{TIPO_LABEL[usuario.tipo]}</p>
                </div>
                <div style={styles.infoItem}>
                  <p style={styles.infoLabel}>Membro desde</p>
                  <p style={styles.infoValor}>{formatarData(usuario.criado_em)}</p>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div style={styles.card}>
              <h3 style={styles.cardTitulo}>Configurações</h3>
              <div style={styles.acoes}>

                {/* Alterar nome */}
                <button
                  onClick={() => abrirSecao(secao === 'nome' ? null : 'nome')}
                  style={styles.btnAcao}
                >
                  <span>✏️ Alterar nome</span>
                  <span style={styles.btnAcaoSeta}>{secao === 'nome' ? '▲' : '▼'}</span>
                </button>

                {secao === 'nome' && (
                  <div style={styles.formInline}>
                    {sucesso === 'nome' && (
                      <p style={styles.sucesso}>✅ Nome atualizado!</p>
                    )}
                    {erro && <p style={styles.erro}>{erro}</p>}
                    <input
                      value={formNome}
                      onChange={e => setFormNome(e.target.value)}
                      placeholder="Novo nome"
                      style={styles.input}
                    />
                    <div style={styles.formBotoes}>
                      <button onClick={() => setSecao(null)} style={styles.btnCancelar}>
                        Cancelar
                      </button>
                      <button
                        onClick={async () => {
                          if (!formNome.trim()) return setErro('Nome não pode ser vazio.')
                          setSalvando(true)
                          setErro('')
                          try {
                            // Por enquanto atualiza só localmente
                            // (endpoint de update de usuario pode ser adicionado ao backend depois)
                            const u = { ...usuario, nome: formNome.trim() }
                            localStorage.setItem('usuario', JSON.stringify(u))
                            setUsuario(u)
                            setSucesso('nome')
                            setSecao(null)
                          } catch {
                            setErro('Erro ao atualizar nome.')
                          } finally {
                            setSalvando(false)
                          }
                        }}
                        style={salvando ? {...styles.btnSalvar, opacity: 0.7} : styles.btnSalvar}
                        disabled={salvando}
                      >
                        {salvando ? 'Salvando...' : 'Salvar'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Alterar senha — placeholder para próxima iteração do backend */}
                <button
                  onClick={() => abrirSecao(secao === 'senha' ? null : 'senha')}
                  style={styles.btnAcao}
                >
                  <span>🔒 Alterar senha</span>
                  <span style={styles.btnAcaoSeta}>{secao === 'senha' ? '▲' : '▼'}</span>
                </button>

                {secao === 'senha' && (
                  <div style={styles.formInline}>
                    <p style={styles.avisoSenha}>
                      ⚙️ Funcionalidade disponível na próxima versão do backend.
                    </p>
                  </div>
                )}

                {/* Logout */}
                <button
                  onClick={() => {
                    if (confirm('Deseja sair da conta?')) authService.logout()
                  }}
                  style={styles.btnSair}
                >
                  🚪 Sair da conta
                </button>
              </div>
            </div>

            {/* Versão */}
            <p style={styles.versao}>Meu Corre Financeiro v1.0</p>
          </>
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
  conteudo: { padding: '20px 16px', maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' },
  loading: { textAlign: 'center', color: '#9ca3af', padding: '40px' },
  avatarCard: {
    background: 'linear-gradient(135deg, #0a3d1f, #1a6b3a)',
    borderRadius: '16px', padding: '32px 24px', textAlign: 'center',
  },
  avatar: {
    width: '72px', height: '72px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)', color: '#fff',
    fontSize: '32px', fontWeight: '800', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 16px', border: '3px solid rgba(255,255,255,0.4)',
  },
  avatarNome: { color: '#fff', fontSize: '22px', fontWeight: '800', margin: '0 0 4px' },
  avatarEmail: { color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: '0 0 12px' },
  avatarTipo: {
    background: 'rgba(255,255,255,0.15)', color: '#fff',
    padding: '4px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: '600',
  },
  card: { background: '#fff', borderRadius: '16px', padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  cardTitulo: { fontSize: '13px', fontWeight: '700', color: '#374151',
    textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 16px' },
  infoLista: { display: 'flex', flexDirection: 'column', gap: '12px' },
  infoItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' },
  infoLabel: { fontSize: '13px', color: '#9ca3af', margin: 0, fontWeight: '500' },
  infoValor: { fontSize: '14px', color: '#111827', margin: 0, fontWeight: '600', textAlign: 'right' },
  acoes: { display: 'flex', flexDirection: 'column', gap: '8px' },
  btnAcao: {
    width: '100%', padding: '14px 16px', background: '#f9fafb',
    border: '1.5px solid #e5e7eb', borderRadius: '10px',
    fontSize: '14px', fontWeight: '600', color: '#374151',
    cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  btnAcaoSeta: { color: '#9ca3af', fontSize: '12px' },
  formInline: { background: '#f9fafb', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' },
  input: {
    padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb',
    fontSize: '14px', outline: 'none', background: '#fff', width: '100%', boxSizing: 'border-box',
  },
  formBotoes: { display: 'flex', gap: '8px', justifyContent: 'flex-end' },
  btnCancelar: { padding: '9px 18px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' },
  btnSalvar: {
    padding: '9px 18px', background: 'linear-gradient(135deg, #1a6b3a, #0a3d1f)',
    color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
  },
  sucesso: { background: '#f0fdf4', color: '#166534', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', margin: 0 },
  erro: { background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', margin: 0 },
  avisoSenha: { color: '#6b7280', fontSize: '13px', margin: 0, textAlign: 'center', padding: '8px 0' },
  btnSair: {
    width: '100%', padding: '14px 16px', background: '#fef2f2',
    border: '1.5px solid #fee2e2', borderRadius: '10px',
    fontSize: '14px', fontWeight: '600', color: '#dc2626',
    cursor: 'pointer', textAlign: 'left', marginTop: '4px',
  },
  versao: { textAlign: 'center', color: '#9ca3af', fontSize: '12px', margin: 0 },
}
