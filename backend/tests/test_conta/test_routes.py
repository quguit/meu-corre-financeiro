import pytest


@pytest.fixture
def auth_headers(client):
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
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


class TestConta:
    def test_criar_conta(self, client, auth_headers):
        resp = client.post(
            "/contas/",
            json={
                "nome": "Conta Principal",
                "tipo": "corrente",
                "saldo_inicial": "1000.00",
            },
            headers=auth_headers,
        )
        assert resp.status_code == 201
        data = resp.json()
        assert data["nome"] == "Conta Principal"
        assert float(data["saldo_atual"]) == 1000.0
        assert data["ativa"] == True

    def test_saldo_inicial_negativo_rejeitado(self, client, auth_headers):
        resp = client.post(
            "/contas/",
            json={"nome": "Conta", "tipo": "corrente", "saldo_inicial": "-100.00"},
            headers=auth_headers,
        )
        assert resp.status_code == 422

    def test_listar_contas(self, client, auth_headers):
        client.post(
            "/contas/", json={"nome": "C1", "tipo": "corrente"}, headers=auth_headers
        )
        client.post(
            "/contas/", json={"nome": "C2", "tipo": "poupanca"}, headers=auth_headers
        )
        resp = client.get("/contas/", headers=auth_headers)
        assert resp.status_code == 200
        assert len(resp.json()) == 2

    def test_buscar_conta(self, client, auth_headers):
        criado = client.post(
            "/contas/", json={"nome": "C1", "tipo": "caixa"}, headers=auth_headers
        )
        conta_id = criado.json()["id"]
        resp = client.get(f"/contas/{conta_id}", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["id"] == conta_id

    def test_atualizar_conta(self, client, auth_headers):
        criado = client.post(
            "/contas/",
            json={"nome": "Antiga", "tipo": "corrente"},
            headers=auth_headers,
        )
        conta_id = criado.json()["id"]
        resp = client.patch(
            f"/contas/{conta_id}", json={"nome": "Nova"}, headers=auth_headers
        )
        assert resp.status_code == 200
        assert resp.json()["nome"] == "Nova"

    def test_desativar_conta(self, client, auth_headers):
        criado = client.post(
            "/contas/", json={"nome": "C1", "tipo": "corrente"}, headers=auth_headers
        )
        conta_id = criado.json()["id"]
        resp = client.delete(f"/contas/{conta_id}", headers=auth_headers)
        assert resp.status_code == 204

    def test_conta_outro_usuario_nao_acessivel(self, client, auth_headers):
        # Cria conta com usuário 1
        criado = client.post(
            "/contas/", json={"nome": "C1", "tipo": "corrente"}, headers=auth_headers
        )
        conta_id = criado.json()["id"]

        # Cria usuário 2 e tenta acessar a conta do usuário 1
        client.post(
            "/auth/cadastro",
            json={"nome": "Outro", "email": "outro@teste.com", "senha": "senha123"},
        )
        resp2 = client.post(
            "/auth/login", json={"email": "outro@teste.com", "senha": "senha123"}
        )
        headers2 = {"Authorization": f"Bearer {resp2.json()['access_token']}"}

        resp = client.get(f"/contas/{conta_id}", headers=headers2)
        assert resp.status_code == 404  # não 403 — não revelamos que existe

    def test_sem_autenticacao_retorna_401(self, client):
        resp = client.get("/contas/")
        assert resp.status_code == 401
