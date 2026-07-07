import pytest


@pytest.fixture
def usuario_logado(client):
    client.post(
        "/auth/cadastro",
        json={
            "nome": "Guilherme",
            "email": "gui@teste.com",
            "senha": "senha123",
            "tipo": "pessoal",
        },
    )
    resp = client.post(
        "/auth/login", json={"email": "gui@teste.com", "senha": "senha123"}
    )
    return resp.json()["access_token"]


class TestCadastro:
    def test_cadastro_sucesso(self, client):
        resp = client.post(
            "/auth/cadastro",
            json={
                "nome": "Guilherme",
                "email": "gui@teste.com",
                "senha": "senha123",
                "tipo": "pessoal",
            },
        )
        assert resp.status_code == 201
        data = resp.json()
        assert data["email"] == "gui@teste.com"
        assert "senha_hash" not in data
        assert "senha" not in data

    def test_email_duplicado(self, client):
        payload = {"nome": "Gui", "email": "gui@teste.com", "senha": "senha123"}
        client.post("/auth/cadastro", json=payload)
        resp = client.post("/auth/cadastro", json=payload)
        assert resp.status_code == 422
        assert "E-mail já cadastrado" in resp.json()["detail"]

    def test_senha_curta_rejeitada(self, client):
        resp = client.post(
            "/auth/cadastro",
            json={"nome": "Gui", "email": "gui@teste.com", "senha": "123"},
        )
        assert resp.status_code == 422

    def test_email_invalido_rejeitado(self, client):
        resp = client.post(
            "/auth/cadastro",
            json={"nome": "Gui", "email": "nao-e-email", "senha": "senha123"},
        )
        assert resp.status_code == 422


class TestLogin:
    def test_login_sucesso(self, client, usuario_logado):
        assert usuario_logado is not None
        assert len(usuario_logado) > 10

    def test_login_senha_errada(self, client):
        client.post(
            "/auth/cadastro",
            json={"nome": "Gui", "email": "gui@teste.com", "senha": "senha123"},
        )
        resp = client.post(
            "/auth/login", json={"email": "gui@teste.com", "senha": "senhaerrada"}
        )
        assert resp.status_code == 401

    def test_login_email_inexistente(self, client):
        resp = client.post(
            "/auth/login", json={"email": "naoexiste@teste.com", "senha": "senha123"}
        )
        assert resp.status_code == 401


class TestMe:
    def test_me_autenticado(self, client, usuario_logado):
        resp = client.get(
            "/auth/me", headers={"Authorization": f"Bearer {usuario_logado}"}
        )
        assert resp.status_code == 200
        assert resp.json()["email"] == "gui@teste.com"

    def test_me_sem_token(self, client):
        resp = client.get("/auth/me")
        assert resp.status_code == 401

    def test_me_token_invalido(self, client):
        resp = client.get(
            "/auth/me", headers={"Authorization": "Bearer token.invalido.aqui"}
        )
        assert resp.status_code == 401
