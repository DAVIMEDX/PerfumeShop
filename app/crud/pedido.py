from sqlalchemy.orm import Session
from app.models import pedido as models
from app.schemas import pedido as schemas

def criar_pedido(db: Session, usuario_id: int, pedido_data: schemas.PedidoCreate):
    novo_pedido = models.Pedido(
        usuario_id=usuario_id,
        endereco=pedido_data.endereco,
        cidade=pedido_data.cidade,
        cep=pedido_data.cep,
        metodo_pagamento=pedido_data.metodo_pagamento,
        total=pedido_data.total
    )

    for item in pedido_data.itens:
        novo_pedido.itens.append(
            models.ItemPedido(
                perfume_id=item.perfume_id,
                quantidade=item.quantidade,
                preco_unitario=item.preco_unitario
            )
        )

    db.add(novo_pedido)
    db.commit()
    db.refresh(novo_pedido)
    return novo_pedido

def listar_pedidos(db: Session, usuario_id: int):
    return db.query(models.Pedido).filter_by(usuario_id=usuario_id).all()
