from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app import database
from app.routes import cart as routes_cart, user as routes_user, perfume as routes_perfume, pedido as routes_pedido, avaliacao as routes_avaliacao
from app.models import perfume as models_perfume, user as models_user, avaliacao as models_avaliacao
from fastapi.middleware.cors import CORSMiddleware
from app.routes import pagamento
from app.routes.pagamento import router as pagamento_router


# Cria as tabelas no banco
models_perfume.Base.metadata.create_all(bind=database.engine)
models_user.Base.metadata.create_all(bind=database.engine)
models_avaliacao.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="Loja Virtual de Perfumes",
    description="API para gerenciar perfumes e pedidos",
    version="1.0.0"
)

# ✅ CORS — importante incluir os dois!
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas
app.include_router(routes_perfume.router, tags=["Perfume"])
app.include_router(routes_user.router, tags=["Usuário"])
app.include_router(routes_cart.router, tags=["Carrinho"])
app.include_router(routes_pedido.router,tags=["Pedido"])
app.include_router(routes_avaliacao.router, tags=["Avaliações"])
app.include_router(pagamento_router, tags=["Pagamento"])