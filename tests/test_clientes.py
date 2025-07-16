import pytest

@pytest.mark.asyncio
async def test_cadastro_cliente_sucesso(client):
    novo_cliente = {
        "nome": "Maria Teste",
        "email": "maaria.teste@example.com",
        "senha": "senhateste123"
    }

    response = await client.post("/usuarios/", json=novo_cliente)
    assert response.status_code == 200 
    data = response.json()
    assert data["email"] == novo_cliente["email"]
