from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import LimitExceeded
from fastapi.responses import JSONResponse

from config.database import engine, Base
from models import models
from routes import auth

# Initialize PostgreSQL database tables on startup
try:
    Base.metadata.create_all(bind=engine)
    print("✅ PostgreSQL tables created successfully.")
except Exception as e:
    print(f"⚠️ Could not create database tables (ignoring if connection delayed): {e}")

# Configure Rate Limiter
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title="Career GPS AI - FastAPI Backend",
    version="1.0.0",
    description="Python microservice supporting auth pipelines and PG storage"
)
app.state.limiter = limiter
app.add_exception_handler(LimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS Headers
origins = [
    "*", # Allow all origins for local portfolio testing
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(auth.router, prefix="/api")

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "fastapi-microservice"}

# Custom error handler for rate limiting LimitExceeded exceptions
@app.exception_handler(LimitExceeded)
def custom_rate_limit_handler(request: Request, exc: LimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Too many requests. Please try again later."}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
