import api from "./api";

export const contaService = {
  async listar() {
    const resp = await api.get("/contas/");
    return resp.data;
  },

  async criar(dados) {
    const resp = await api.post("/contas/", dados);
    return resp.data;
  },

  async desativar(id) {
    await api.delete(`/contas/${id}`);
  },
};
