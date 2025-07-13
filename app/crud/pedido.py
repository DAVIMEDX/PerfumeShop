from sqlalchemy.orm import Session
from app import models, schemas
from services.pagamento import gerar_pix

def criar_pedido(db: Session, usuario_id: int, pedido: schemas.PedidoCreate, usuario):
    novo_pedido = models.Pedido(
        usuario_id=usuario_id,
        endereco=pedido.endereco,
        cidade=pedido.cidade,
        cep=pedido.cep,
        metodo_pagamento=pedido.metodo_pagamento,
        total=pedido.total,
        status="pendente"
    )
    db.add(novo_pedido)
    db.flush()  # Para garantir que o novo_pedido.id exista

    # Salvar itens
    for item in pedido.itens:
        item_db = models.ItemPedido(
            pedido_id=novo_pedido.id,
            perfume_id=item.perfume_id,
            quantidade=item.quantidade,
            preco_unitario=item.preco_unitario
        )
        db.add(item_db)

    # Usar o email real do usuário logado
    email_usuario = usuario.email

    resposta_pix = gerar_pix(valor=pedido.total, descricao="Compra Perfume Shop", email=email_usuario)

    novo_pedido.pix_id = resposta_pix.get("id")
    novo_pedido.qr_code_base64 = resposta_pix.get("point_of_interaction", {}).get("transaction_data", {}).get("qr_code_base64")

    db.commit()
    db.refresh(novo_pedido)
    return novo_pedido

def atualizar_status_pagamento(db: Session, pix_id: str, novo_status: str):
    pedido = db.query(models.Pedido).filter(models.Pedido.pix_id == pix_id).first()
    if pedido:
        pedido.status = novo_status
        db.commit()
    return pedido
