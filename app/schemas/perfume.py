from pydantic import BaseModel
from typing import Optional

class PerfumeBase(BaseModel):
    nome: str
    marca: str
    preco: float
    estoque: int
    volume: str
    descricao: str
    imagem_url: str

class PerfumeOut(BaseModel):
    id: int
    nome: str
    preco: float
    imagem_url: Optional[str] = None

    class Config:
        from_attributes = True
        
class PerfumeCreate(PerfumeBase):
    pass

class Perfume(PerfumeBase):
    id: int

    class Config:
       from_attributes = True
       orm_mode = True 