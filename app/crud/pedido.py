from sqlalchemy.orm import Session
from app.models import pedido as models
from app.schemas import pedido as schemas
from app.services import pagamento  # 🔹 novo módulo para integração com Mercado Pago

def criar_pedido(db: Session, usuario_id: int, pedido_data: schemas.PedidoCreate):
    # 🔸 Gera cobrança Pix via Mercado Pago
    pix_info = pagamento.gerar_pix(
        valor=pedido_data.total,
        descricao="Compra na loja de perfumes",
        email=pedido_data.email  # 🔸 você precisa garantir que esse campo está no schema
    )

    novo_pedido = models.Pedido(
        usuario_id=usuario_id,
        endereco=pedido_data.endereco,
        cidade=pedido_data.cidade,
        cep=pedido_data.cep,
        metodo_pagamento=pedido_data.metodo_pagamento,
        total=pedido_data.total,
        status="pendente",  # 🔸 novo campo
        pix_id=pix_info.get("id"),
        qr_code_base64=pix_info.get("point_of_interaction", {})
                               .get("transaction_data", {})
                               .get("qr_code_base64")
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
