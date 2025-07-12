from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Avaliacao(Base):
    __tablename__ = "avaliacoes"

    id = Column(Integer, primary_key=True, index=True)
    nota = Column(Integer, nullable=False)
    comentario = Column(String, nullable=True)
    data = Column(DateTime, default=datetime.utcnow)

    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    perfume_id = Column(Integer, ForeignKey("perfumes.id"))

    usuario = relationship("Usuario", back_populates="avaliacoes")
    perfume = relationship("Perfume", back_populates="avaliacoes")
