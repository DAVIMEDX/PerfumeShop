from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class Perfume(Base):
    __tablename__ = "perfumes"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    marca = Column(String)
    preco = Column(Float)
    estoque = Column(Integer)
    volume = Column(Integer)
    descricao =  Column(String)
