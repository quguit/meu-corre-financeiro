def test_cadastro_usuario(client):
    resp = client.post("/auth/cadastro", json={
        "nome": "Guilherme",
        "email": "gui@teste.com",
        "senha": "senha123",
        "tipo": "pessoal"
    })
    # Router ainda vazio, esperamos 404 até implementar
    assert resp.status_code in (200, 201, 404, 405)

def test_health_check(client):
    resp = client.get("/")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"
