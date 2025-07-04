from fastapi import FastAPI
from app import database
from app.routes import cart as routes_cart, user as routes_user, perfume as routes_perfume
from app.models import perfume as models_perfume, user as models_user

# Cria as tabelas no banco PostgreSQL
models_perfume.Base.metadata.create_all(bind=database.engine)
models_user.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="Loja Virtual de Perfumes",
    description="API para gerenciar perfumes e pedidos",
    version="1.0.0"
)

app.include_router(routes_perfume.router,tags=["Perfume"])
app.include_router(routes_user.router,tags=["Usuário"])
app.include_router(routes_cart.router,tags=["Carrinho"])