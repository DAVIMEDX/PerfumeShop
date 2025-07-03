from pydantic import BaseModel
from typing import Optional

class ItemCarrinhoBase(BaseModel):
    perfume_id: int
    quantidade: int

class ItemCarrinhoCreate(ItemCarrinhoBase):
    pass

class ItemCarrinho(ItemCarrinhoBase):
    id: int

    class Config:
        from_attributes = True


class Carrinho(BaseModel):
    id: int
    usuario_id: int
    itens: list[ItemCarrinho]

    class Config:
        from_attributes = True
