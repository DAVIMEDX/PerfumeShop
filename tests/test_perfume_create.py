import pytest

@pytest.mark.asyncio
async def test_criar_perfume_sucesso(client):
    # Login com usuário admin já existente
    login_response = await client.post("/login", data={
        "username": "aba@gmail.com",
        "password": "1234"
    })
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Dados do novo perfume
    novo_perfume = {
        "nome": "Perfume Admin",
        "marca": "Marca Premium",
        "preco": 299.90,
        "estoque": 10,
        "volume": "100ml",
        "descricao": "Perfume criado por usuário admin.",
        "imagem_url": "http://exemplo.com/perfume-admin.jpg"
    }

    # Requisição para criação do perfume
    response = await client.post("/perfumes/", json=novo_perfume, headers=headers)
    assert response.status_code == 200, f"Erro: {response.text}"

    # Verifica os dados retornados
    dados = response.json()
    assert dados["nome"] == novo_perfume["nome"]
    assert dados["marca"] == novo_perfume["marca"]
    assert dados["preco"] == novo_perfume["preco"]
