import pytest

@pytest.mark.asyncio
async def test_login_usuario_sucesso(client):
    # Garante que o usuário existe
    usuario = {
        "nome": "Login Teste",
        "email": "loginteste@example.com",
        "senha": "senha123"
    }
    await client.post("/usuarios/", json=usuario)

    # Tenta fazer login
    login_data = {
        "username": usuario["email"],
        "password": usuario["senha"]
    }


    response = await client.post("/login", data=login_data)
    assert response.status_code == 200
    token = response.json()
    assert "access_token" in token
    assert token["token_type"] == "bearer"
