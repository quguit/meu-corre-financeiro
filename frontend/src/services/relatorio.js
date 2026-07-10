import api from "./api";

export const relatorioService = {
  async saldoDia() {
    const resp = await api.get("/relatorios/saldo-dia");
    return resp.data;
  },

  async fluxoMensal(mes, ano) {
    const resp = await api.get(
      `/relatorios/fluxo-mensal?mes=${mes}&ano=${ano}`,
    );
    return resp.data;
  },

  async titulosVencidos() {
    const resp = await api.get("/relatorios/titulos-vencidos");
    return resp.data;
  },

  async projecao(ate) {
    const resp = await api.get(`/relatorios/projecao?ate=${ate}`);
    return resp.data;
  },

  // Busca fluxo dos últimos N meses para o gráfico
  async fluxoUltimosMeses(quantidade = 6) {
    const hoje = new Date();
    const promessas = [];

    for (let i = quantidade - 1; i >= 0; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const mes = data.getMonth() + 1;
      const ano = data.getFullYear();
      promessas.push(
        api
          .get(`/relatorios/fluxo-mensal?mes=${mes}&ano=${ano}`)
          .then((r) => ({
            ...r.data,
            label: data.toLocaleDateString("pt-BR", {
              month: "short",
              year: "2-digit",
            }),
          })),
      );
    }

    return Promise.all(promessas);
  },
};
