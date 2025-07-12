from sqlalchemy import Column, Integer, String, Float
from app.database import Base
from sqlalchemy.orm import relationship  

class Perfume(Base):
    __tablename__ = "perfumes"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    marca = Column(String)
    preco = Column(Float)
    estoque = Column(Integer)
    volume = Column(String)
    descricao =  Column(String)
    imagem_url = Column(String, nullable=True) 
    avaliacoes = relationship("Avaliacao", back_populates="perfume", cascade="all, delete")
