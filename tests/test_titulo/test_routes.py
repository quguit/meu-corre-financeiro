import pytest
from datetime import date


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
    return {"Authorization": f"Bearer {resp.json()['access_token']}"}


@pytest.fixture
def conta_id(client, auth_headers):
    resp = client.post(
        "/contas/",
        json={
            "nome": "Conta Principal",
            "tipo": "corrente",
            "saldo_inicial": "5000.00",
        },
        headers=auth_headers,
    )
    return resp.json()["id"]


class TestTitulo:
    def test_criar_titulo(self, client, auth_headers, conta_id):
        resp = client.post(
            "/titulos/",
            json={
                "conta_id": conta_id,
                "tipo": "pagar",
                "descricao": "Aluguel",
                "valor_total": "1500.00",
                "vencimento": str(date.today()),
            },
            headers=auth_headers,
        )
        assert resp.status_code == 201
        data = resp.json()
        assert data["codigo"].startswith("PAG-")
        assert data["status"] == "aberto"
        assert float(data["valor_pago"]) == 0.0

    def test_codigo_sequencial(self, client, auth_headers, conta_id):
        r1 = client.post(
            "/titulos/",
            json={
                "conta_id": conta_id,
                "tipo": "receber",
                "descricao": "Venda 1",
                "valor_total": "100.00",
                "vencimento": str(date.today()),
            },
            headers=auth_headers,
        )
        r2 = client.post(
            "/titulos/",
            json={
                "conta_id": conta_id,
                "tipo": "receber",
                "descricao": "Venda 2",
                "valor_total": "200.00",
                "vencimento": str(date.today()),
            },
            headers=auth_headers,
        )
        cod1 = r1.json()["codigo"]
        cod2 = r2.json()["codigo"]
        num1 = int(cod1.split("-")[-1])
        num2 = int(cod2.split("-")[-1])
        assert num2 == num1 + 1

    def test_pagamento_parcial(self, client, auth_headers, conta_id):
        criado = client.post(
            "/titulos/",
            json={
                "conta_id": conta_id,
                "tipo": "pagar",
                "descricao": "Fornecedor",
                "valor_total": "1000.00",
                "vencimento": str(date.today()),
            },
            headers=auth_headers,
        )
        tid = criado.json()["id"]
        resp = client.post(
            f"/titulos/{tid}/pagar",
            json={"valor": "400.00", "data_pagamento": str(date.today())},
            headers=auth_headers,
        )
        assert resp.status_code == 200
        assert resp.json()["status"] == "parcial"
        assert float(resp.json()["valor_pago"]) == 400.0

    def test_pagamento_total_quita(self, client, auth_headers, conta_id):
        criado = client.post(
            "/titulos/",
            json={
                "conta_id": conta_id,
                "tipo": "pagar",
                "descricao": "Conta luz",
                "valor_total": "200.00",
                "vencimento": str(date.today()),
            },
            headers=auth_headers,
        )
        tid = criado.json()["id"]
        resp = client.post(
            f"/titulos/{tid}/pagar",
            json={"valor": "200.00", "data_pagamento": str(date.today())},
            headers=auth_headers,
        )
        assert resp.json()["status"] == "quitado"

    def test_pagamento_acima_do_saldo_rejeitado(self, client, auth_headers, conta_id):
        criado = client.post(
            "/titulos/",
            json={
                "conta_id": conta_id,
                "tipo": "pagar",
                "descricao": "Teste",
                "valor_total": "300.00",
                "vencimento": str(date.today()),
            },
            headers=auth_headers,
        )
        tid = criado.json()["id"]
        resp = client.post(
            f"/titulos/{tid}/pagar",
            json={"valor": "500.00", "data_pagamento": str(date.today())},
            headers=auth_headers,
        )
        assert resp.status_code == 422

    def test_cancelar_titulo(self, client, auth_headers, conta_id):
        criado = client.post(
            "/titulos/",
            json={
                "conta_id": conta_id,
                "tipo": "pagar",
                "descricao": "Cancelar",
                "valor_total": "100.00",
                "vencimento": str(date.today()),
            },
            headers=auth_headers,
        )
        tid = criado.json()["id"]
        resp = client.delete(f"/titulos/{tid}", headers=auth_headers)
        assert resp.status_code == 204

    def test_titulo_quitado_nao_editavel(self, client, auth_headers, conta_id):
        criado = client.post(
            "/titulos/",
            json={
                "conta_id": conta_id,
                "tipo": "pagar",
                "descricao": "Pagar",
                "valor_total": "100.00",
                "vencimento": str(date.today()),
            },
            headers=auth_headers,
        )
        tid = criado.json()["id"]
        client.post(
            f"/titulos/{tid}/pagar",
            json={"valor": "100.00", "data_pagamento": str(date.today())},
            headers=auth_headers,
        )
        resp = client.patch(
            f"/titulos/{tid}", json={"descricao": "Novo nome"}, headers=auth_headers
        )
        assert resp.status_code == 422
