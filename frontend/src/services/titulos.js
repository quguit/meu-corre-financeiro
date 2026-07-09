import api from "./api";

export const tituloService = {
  async listar() {
    const resp = await api.get("/titulos/");
    return resp.data;
  },

  async criar(dados) {
    const resp = await api.post("/titulos/", dados);
    return resp.data;
  },

  async pagar(id, dados) {
    const resp = await api.post(`/titulos/${id}/pagar`, dados);
    return resp.data;
  },

  async cancelar(id) {
    await api.delete(`/titulos/${id}`);
  },
};
