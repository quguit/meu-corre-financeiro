import api from "./api";

export const authService = {
  async cadastrar(dados) {
    const resp = await api.post("/auth/cadastro", dados);
    return resp.data;
  },

  async login(email, senha) {
    const resp = await api.post("/auth/login", { email, senha });
    const { access_token, usuario } = resp.data;
    localStorage.setItem("token", access_token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    return usuario;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/login";
  },

  usuarioAtual() {
    const u = localStorage.getItem("usuario");
    return u ? JSON.parse(u) : null;
  },

  estaLogado() {
    return !!localStorage.getItem("token");
  },

  async meuPerfil() {
    const resp = await api.get("/auth/me");
    localStorage.setItem("usuario", JSON.stringify(resp.data));
    return resp.data;
  },
};
