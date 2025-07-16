import pytest

@pytest.mark.asyncio
async def test_adicionar_item_ao_carrinho(client):
    # Login com usuário normal
    login_response = await client.post("/login", data={
        "username": "criador@example.com",
        "password": "senha123"
    })
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Esvazia o carrinho antes do teste
    carrinho_response = await client.get("/carrinho/itens", headers=headers)
    for item in carrinho_response.json():
        await client.delete(f"/carrinho/{item['id']}", headers=headers)

    # Dados do item a ser adicionado
    item = {
        "perfume_id": 1,
        "quantidade": 2
    }

    # Adiciona o item ao carrinho
    response = await client.post("/carrinho/adicionar", json=item, headers=headers)

    assert response.status_code in [200, 201], f"Erro: {response.text}"
    carrinho = response.json()
    itens = carrinho["itens"]

    # Verifica se o item adicionado está presente com a quantidade correta
    assert any(
        i["perfume_id"] == item["perfume_id"] and i["quantidade"] == item["quantidade"]
        for i in itens
    )
