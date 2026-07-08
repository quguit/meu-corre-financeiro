import api from './api'

export const relatorioService = {
  async saldoDia() {
    const resp = await api.get('/relatorios/saldo-dia')
    return resp.data
  },

  async fluxoMensal(mes, ano) {
    const resp = await api.get(`/relatorios/fluxo-mensal?mes=${mes}&ano=${ano}`)
    return resp.data
  },

  async titulosVencidos() {
    const resp = await api.get('/relatorios/titulos-vencidos')
    return resp.data
  },

  async projecao(ate) {
    const resp = await api.get(`/relatorios/projecao?ate=${ate}`)
    return resp.data
  }
}