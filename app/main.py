from fastapi import FastAPI
from app import routes_cart, routes_user, routes_perfume, \
models_perfume, models_user, database


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