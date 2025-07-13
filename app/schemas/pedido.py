from pydantic import BaseModel, EmailStr
from typing import List, Optional
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
    email: EmailStr  # ✅ necessário para geração do Pix (requerido pelo Mercado Pago)

class Pedido(PedidoBase):
    id: int
    criado_em: datetime
    status: str  # ✅ novo campo
    pix_id: Optional[str] = None  # ✅ novo campo
    qr_code_base64: Optional[str] = None  # ✅ novo campo
    itens: List[ItemPedido]

    class Config:
        from_attributes = True
