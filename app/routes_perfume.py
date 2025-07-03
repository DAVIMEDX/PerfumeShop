# app/routes.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import auth, schemas_perfume as schemas, database, crud_perfume as crud, models_user

router = APIRouter()


@router.get("/")
def root():
    return {"mensagem": "Bem-vindo à Loja de Perfumes!"}

@router.post("/perfumes/", response_model=schemas.Perfume)
def criar_perfume(perfume: schemas.PerfumeCreate, db: Session = Depends(database.get_db), admin: models_user.Usuario = Depends(auth.verificar_admin)):
    return crud.criar_perfume(db, perfume)

@router.get("/perfumes/", response_model=list[schemas.Perfume])
def listar_perfumes(db: Session = Depends(database.get_db)):
    return crud.listar_perfumes(db)

@router.get("/perfumes/{perfume_id}", response_model=schemas.Perfume)
def buscar_perfume(perfume_id: int, db: Session = Depends(database.get_db)):
    return crud.buscar_perfume(db, perfume_id)

@router.put("/perfumes/{perfume_id}", response_model=schemas.Perfume)
def atualizar_perfume(perfume_id: int, dados: schemas.PerfumeCreate, db: Session = Depends(database.get_db), admin: models_user.Usuario = Depends(auth.verificar_admin)):
    return crud.atualizar_perfume(db, perfume_id, dados)

@router.delete("/perfumes/{perfume_id}", status_code=204)
def deletar_perfume(perfume_id: int, db: Session = Depends(database.get_db), admin: models_user.Usuario = Depends(auth.verificar_admin)):
    crud.deletar_perfume(db, perfume_id)
