import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:postgres123@postgres-db:5432/careergps_db"
)

# Configure SQLAlchemy connection engine
# pool_size and max_overflow optimize connection handling for production workloads
engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_recycle=3600
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# FastAPI dependency to yield database sessions safely
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
