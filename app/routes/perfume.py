from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core import auth
from app.schemas import perfume as schemas_perfume
from app.schemas import pedido as schemas
from app.crud import perfume as crud_perfume
from app.models import user as models_user
from app.models.user import Usuario
from app.database import get_db

router = APIRouter()

@router.get("/")
def root():
    return {"mensagem": "Bem-vindo à Loja de Perfumes!"}

@router.post("/perfumes/", response_model=schemas_perfume.Perfume)
def criar_perfume(
    perfume: schemas_perfume.PerfumeCreate, 
    db: Session = Depends(get_db), 
    admin: models_user.Usuario = Depends(auth.verificar_admin)
):
    return crud_perfume.criar_perfume(db, perfume)

@router.get("/perfumes/", response_model=List[schemas_perfume.Perfume])
def listar_perfumes(db: Session = Depends(get_db)):
    return crud_perfume.listar_perfumes(db)

@router.get("/perfumes/destaques", response_model=List[schemas_perfume.Perfume])
def get_perfumes_destaques(db: Session = Depends(get_db)):
    return crud_perfume.listar_destaques(db)

@router.get("/perfumes/{perfume_id}", response_model=schemas_perfume.Perfume)
def buscar_perfume(perfume_id: int, db: Session = Depends(get_db)):
    return crud_perfume.buscar_perfume(db, perfume_id)

@router.put("/perfumes/{perfume_id}", response_model=schemas_perfume.Perfume)
def atualizar_perfume(
    perfume_id: int, 
    dados: schemas_perfume.PerfumeCreate, 
    db: Session = Depends(get_db), 
    admin: models_user.Usuario = Depends(auth.verificar_admin)
):
    return crud_perfume.atualizar_perfume(db, perfume_id, dados)

@router.delete("/perfumes/{perfume_id}", status_code=204)
def deletar_perfume(
    perfume_id: int, 
    db: Session = Depends(get_db), 
    admin: models_user.Usuario = Depends(auth.verificar_admin)
):
    crud_perfume.deletar_perfume(db, perfume_id)

@router.get("/admin/pedidos", response_model=List[schemas.Pedido])
def listar_pedidos_admin(
    db: Session = Depends(get_db),
    admin: Usuario = Depends(auth.verificar_admin),
):
    from app.crud import pedido as crud_pedido  # importe local para não misturar imports
    return crud_pedido.listar_todos_pedidos(db)
