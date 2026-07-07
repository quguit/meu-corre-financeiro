from datetime import date, timedelta
import pytest

@pytest.fixture
def setup(client):
    """Cria usuário, conta e títulos para os testes de relatório."""
    client.post("/auth/cadastro", json={
        "nome": "Guilherme", "email": "gui@teste.com",
        "senha": "senha123", "tipo": "pessoal"
    })
    resp = client.post("/auth/login", json={
        "email": "gui@teste.com", "senha": "senha123"
    })
    headers = {"Authorization": f"Bearer {resp.json()['access_token']}"}

    conta = client.post("/contas/", json={
        "nome": "Principal", "tipo": "corrente", "saldo_inicial": "2000.00"
    }, headers=headers).json()

    return {"headers": headers, "conta_id": conta["id"]}

class TestRelatorio:
    def test_saldo_dia(self, client, setup):
        resp = client.get("/relatorios/saldo-dia", headers=setup["headers"])
        assert resp.status_code == 200
        data = resp.json()
        assert float(data["total_contas"]) == 2000.0
        assert len(data["contas"]) == 1

    def test_titulos_vencidos(self, client, setup):
        # Cria título com vencimento no passado
        ontem = str(date.today() - timedelta(days=1))
        client.post("/titulos/", json={
            "conta_id": setup["conta_id"], "tipo": "pagar",
            "descricao": "Conta atrasada", "valor_total": "500.00",
            "vencimento": ontem
        }, headers=setup["headers"])

        resp = client.get("/relatorios/titulos-vencidos", headers=setup["headers"])
        assert resp.status_code == 200
        assert len(resp.json()) == 1
        assert resp.json()[0]["dias_atraso"] == 1

    def test_fluxo_mensal(self, client, setup):
        hoje = date.today()
        # Cria e paga um título de saída
        t = client.post("/titulos/", json={
            "conta_id": setup["conta_id"], "tipo": "pagar",
            "descricao": "Aluguel", "valor_total": "800.00",
            "vencimento": str(hoje)
        }, headers=setup["headers"]).json()

        client.post(f"/titulos/{t['id']}/pagar", json={
            "valor": "800.00", "data_pagamento": str(hoje)
        }, headers=setup["headers"])

        resp = client.get(
            f"/relatorios/fluxo-mensal?mes={hoje.month}&ano={hoje.year}",
            headers=setup["headers"]
        )
        assert resp.status_code == 200
        data = resp.json()
        assert float(data["total_saidas"]) == 800.0
        assert float(data["resultado"]) == -800.0

    def test_projecao_saldo(self, client, setup):
        futuro = str(date.today() + timedelta(days=15))
        # Título a receber no futuro
        client.post("/titulos/", json={
            "conta_id": setup["conta_id"], "tipo": "receber",
            "descricao": "Cobrança", "valor_total": "1000.00",
            "vencimento": futuro
        }, headers=setup["headers"])

        resp = client.get(
            f"/relatorios/projecao?ate={futuro}",
            headers=setup["headers"]
        )
        assert resp.status_code == 200
        data = resp.json()
        # saldo_atual(2000) + a_receber(1000) - a_pagar(0) = 3000
        assert float(data["saldo_projetado"]) == 3000.0 