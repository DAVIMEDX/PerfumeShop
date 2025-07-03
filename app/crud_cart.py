from sqlalchemy.orm import Session
from app import models_cart, models_perfume, models_user, schemas_cart
from fastapi import HTTPException


# ------------------------------
# Criar um carrinho para um novo usuário
# ------------------------------
def criar_carrinho_para_usuario(db: Session, usuario_id: int):
    carrinho = models_cart.Carrinho(usuario_id=usuario_id)
    db.add(carrinho)
    db.commit()
    db.refresh(carrinho)
    return carrinho


# ------------------------------
# Obter o carrinho de um usuário
# ------------------------------
def obter_carrinho_por_usuario(db: Session, usuario_id: int):
    return db.query(models_cart.Carrinho).filter_by(usuario_id=usuario_id).first()


# ------------------------------
# Adicionar um item ao carrinho
# ------------------------------
def adicionar_item(db: Session, usuario_id: int, item: schemas_cart.ItemCarrinhoCreate):
    carrinho = obter_carrinho_por_usuario(db, usuario_id)
    
    if not carrinho:
        carrinho = criar_carrinho_para_usuario(db, usuario_id)

    # Verifica se o item já está no carrinho
    item_existente = (
        db.query(models_cart.ItemCarrinho)
        .filter_by(carrinho_id=carrinho.id, perfume_id=item.perfume_id)
        .first()
    )

    if item_existente:
        item_existente.quantidade += item.quantidade
    else:
        novo_item = models_cart.ItemCarrinho(
            carrinho_id=carrinho.id,
            perfume_id=item.perfume_id,
            quantidade=item.quantidade,
        )
        db.add(novo_item)

    db.commit()
    db.refresh(carrinho)
    return carrinho


# ------------------------------
# Listar os itens do carrinho
# ------------------------------
def listar_itens(db: Session, usuario_id: int):
    carrinho = obter_carrinho_por_usuario(db, usuario_id)
    if not carrinho:
        raise HTTPException(status_code=404, detail="Carrinho não encontrado")
    return carrinho.itens


# ------------------------------
# Remover um item do carrinho
# ------------------------------
def remover_item(db: Session, usuario_id: int, item_id: int):
    carrinho = obter_carrinho_por_usuario(db, usuario_id)
    if not carrinho:
        raise HTTPException(status_code=404, detail="Carrinho não encontrado")

    item = (
        db.query(models_cart.ItemCarrinho)
        .filter_by(carrinho_id=carrinho.id, id=item_id)
        .first()
    )

    if not item:
        raise HTTPException(status_code=404, detail="Item não encontrado no carrinho")

    db.delete(item)
    db.commit()
    return {"mensagem": "Item removido com sucesso"}
