import pytest

@pytest.mark.asyncio
async def test_listar_perfumes(client):
    # Requisição para listar os perfumes
    response = await client.get("/perfumes/")
    
    # Verificações
    assert response.status_code == 200
    perfumes = response.json()
    assert isinstance(perfumes, list)
    
    # Se já houver pelo menos um perfume cadastrado, ele deve conter campos válidos
    if perfumes:
        primeiro = perfumes[0]
        assert "id" in primeiro
        assert "nome" in primeiro
        assert "preco" in primeiro
