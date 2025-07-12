from pydantic import BaseModel, conint
from typing import Optional
from datetime import datetime

class AvaliacaoBase(BaseModel):
    nota: conint(ge=1, le=5)
    comentario: Optional[str] = None

class AvaliacaoCreate(AvaliacaoBase):
    perfume_id: int

class Avaliacao(AvaliacaoBase):
    id: int
    usuario_id: int
    perfume_id: int
    data: datetime

    class Config:
        orm_mode = True
