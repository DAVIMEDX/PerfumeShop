from pydantic import BaseModel
from typing import Optional
from app.schemas.perfume import PerfumeOut

class ItemCarrinhoBase(BaseModel):
    perfume_id: int
    quantidade: int

class ItemCarrinhoCreate(ItemCarrinhoBase):
    pass

class ItemCarrinho(ItemCarrinhoBase):
    id: int
    perfume: PerfumeOut  

    class Config:
        from_attributes = True

class Carrinho(BaseModel):
    id: int
    usuario_id: int
    itens: list[ItemCarrinho]

    class Config:
        from_attributes = True

class PerfumeOut(BaseModel):
    id: int
    nome: str
    preco: float
    imagem_url: str

    class Config:
        from_attributes = True
