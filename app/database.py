from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
#from app.database import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# String de conexão PostgreSQL
SQLALCHEMY_DATABASE_URL = "postgresql://cj:pwd123@localhost/loja_perfume"


engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
