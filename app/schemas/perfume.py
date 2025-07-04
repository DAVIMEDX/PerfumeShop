from pydantic import BaseModel

class PerfumeBase(BaseModel):
    nome: str
    marca: str
    preco: float
    estoque: int
    volume: int
    descricao: str


class PerfumeCreate(PerfumeBase):
    pass

class Perfume(PerfumeBase):
    id: int

    class Config:
       from_attributes = True
