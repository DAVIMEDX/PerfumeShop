# app/crud.py

from sqlalchemy.orm import Session
from app.models import perfume as models_perfume
from app.schemas import perfume as schemas_perfume 
from fastapi import HTTPException

def criar_perfume(db: Session, perfume: schemas_perfume.PerfumeCreate):
    novo = models_perfume.Perfume(**perfume.model_dump())
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo

def listar_perfumes(db: Session):
    return db.query(models_perfume.Perfume).all()

def buscar_perfume(db: Session, perfume_id: int):
    perfume = db.query(models_perfume.Perfume).filter(models_perfume.Perfume.id == perfume_id).first()
    if not perfume:
        raise HTTPException(status_code=404, detail="Perfume não encontrado")
    return perfume

def atualizar_perfume(db: Session, perfume_id: int, dados: schemas_perfume.PerfumeCreate):
    perfume = db.query(models_perfume.Perfume).filter(models_perfume.Perfume.id == perfume_id).first()
    if not perfume:
        raise HTTPException(status_code=404, detail="Perfume não encontrado")

    perfume.nome = dados.nome
    perfume.marca = dados.marca
    perfume.preco = dados.preco
    perfume.estoque = dados.estoque
    perfume.volume = dados.volume
    perfume.descricao = dados.descricao
    perfume.imagem_url = dados.imagem_url  


    db.commit()
    db.refresh(perfume)
    return perfume

def deletar_perfume(db: Session, perfume_id: int):
    perfume = db.query(models_perfume.Perfume).filter(models_perfume.Perfume.id == perfume_id).first()
    if not perfume:
        raise HTTPException(status_code=404, detail="Perfume não encontrado")
    db.delete(perfume)
    db.commit()

def listar_todos_pedidos(db: Session):
    return db.query(models.Pedido).all()
