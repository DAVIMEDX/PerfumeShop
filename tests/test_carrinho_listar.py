import pytest

@pytest.mark.asyncio
async def test_listar_itens_do_carrinho(client):
    # Login do usuário
    login_response = await client.post("/login", data={
        "username": "criador@example.com",
        "password": "senha123"
    })
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fazer a requisição para listar itens do carrinho
    response = await client.get("/carrinho/itens", headers=headers)

    assert response.status_code == 200, f"Erro ao listar itens: {response.text}"
    itens = response.json()

    # Verificações básicas
    assert isinstance(itens, list)
    assert any(item["perfume_id"] == 1 and item["quantidade"] >= 1 for item in itens)
