import pytest

@pytest.mark.asyncio
async def test_remover_item_do_carrinho(client):
    # Login
    login_response = await client.post("/login", data={
        "username": "criador@example.com",
        "password": "senha123"
    })
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Adicionar item ao carrinho
    item = {"perfume_id": 1, "quantidade": 1}
    add_response = await client.post("/carrinho/adicionar", json=item, headers=headers)
    assert add_response.status_code in (200, 201)
    carrinho = add_response.json()
    assert carrinho["itens"], "Carrinho está vazio após adicionar item"
    item_id = carrinho["itens"][-1]["id"]

    # Remover item
    delete_response = await client.delete(f"/carrinho/{item_id}", headers=headers)
    assert delete_response.status_code == 200

    # Verificar que item foi removido
    listar_response = await client.get("/carrinho/itens", headers=headers)
    assert listar_response.status_code == 200
    itens = listar_response.json()
    assert all(i["id"] != item_id for i in itens), "Item ainda está no carrinho após remoção"
