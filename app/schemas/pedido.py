from pydantic import BaseModel
from typing import List
from datetime import datetime

class ItemPedidoBase(BaseModel):
    perfume_id: int
    quantidade: int
    preco_unitario: float

class ItemPedidoCreate(ItemPedidoBase):
    pass

class ItemPedido(ItemPedidoBase):
    id: int

    class Config:
        from_attributes = True

class PedidoBase(BaseModel):
    endereco: str
    cidade: str
    cep: str
    metodo_pagamento: str
    total: float

class PedidoCreate(PedidoBase):
    itens: List[ItemPedidoCreate]

class Pedido(PedidoBase):
    id: int
    criado_em: datetime
    itens: List[ItemPedido]

    class Config:
        from_attributes = True
