# app/crud.py

from sqlalchemy.orm import Session
from app import models_perfume as models, schemas_perfume as schemas
from fastapi import HTTPException

def criar_perfume(db: Session, perfume: schemas.PerfumeCreate):
    novo = models.Perfume(**perfume.model_dump())
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo

def listar_perfumes(db: Session):
    return db.query(models.Perfume).all()

def buscar_perfume(db: Session, perfume_id: int):
    perfume = db.query(models.Perfume).filter(models.Perfume.id == perfume_id).first()
    if not perfume:
        raise HTTPException(status_code=404, detail="Perfume não encontrado")
    return perfume

def atualizar_perfume(db: Session, perfume_id: int, dados: schemas.PerfumeCreate):
    perfume = db.query(models.Perfume).filter(models.Perfume.id == perfume_id).first()
    if not perfume:
        raise HTTPException(status_code=404, detail="Perfume não encontrado")

    perfume.nome = dados.nome
    perfume.marca = dados.marca
    perfume.preco = dados.preco
    perfume.estoque = dados.estoque
    perfume.volume = dados.volume
    perfume.descricao = dados.descricao

    db.commit()
    db.refresh(perfume)
    return perfume

def deletar_perfume(db: Session, perfume_id: int):
    perfume = db.query(models.Perfume).filter(models.Perfume.id == perfume_id).first()
    if not perfume:
        raise HTTPException(status_code=404, detail="Perfume não encontrado")
    db.delete(perfume)
    db.commit()
