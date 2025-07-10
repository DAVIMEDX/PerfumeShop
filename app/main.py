from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles  # Importar
from app import database
from app.routes import cart as routes_cart, user as routes_user, perfume as routes_perfume
from app.models import perfume as models_perfume, user as models_user
from fastapi.middleware.cors import CORSMiddleware
from app.routes import pedido

# Cria as tabelas no banco PostgreSQL
models_perfume.Base.metadata.create_all(bind=database.engine)
models_user.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="Loja Virtual de Perfumes",
    description="API para gerenciar perfumes e pedidos",
    version="1.0.0"
)
origins = [
    "http://localhost:3000",  # endereço do seu front-end
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           # permite front-end acessar o backend
    allow_credentials=True,
    allow_methods=["*"],             # permite todos os métodos (GET, POST, OPTIONS, etc)
    allow_headers=["*"],             # permite todos os headers
)

app.include_router(routes_perfume.router,tags=["Perfume"])
app.include_router(routes_user.router,tags=["Usuário"])
app.include_router(routes_cart.router,tags=["Carrinho"])
app.include_router(pedido.router)

