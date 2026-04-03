from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database.db import db_manager
from app.core.config import settings
from app.routes import auth, ideas, chat, settings as user_settings, dashboard, skills, insights
import logging

# Logger setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions: Initialize MongoDB client
    await db_manager.connect_to_mongo()
    yield
    # Shutdown actions: Close MongoDB client
    await db_manager.close_mongo_connection()

app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan
)

# CORS - Production Whitelist
allowed_origins = [
    "https://startup-iq-plum.vercel.app",
    "https://startup-iq-plum.vercel.app/",
    "https://startup-iq-git-main-vamshikrishna0372s-projects.vercel.app",
    "http://localhost:8080",
    "http://localhost:5173",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:8002",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Register all routes
app.include_router(auth.router)
app.include_router(ideas.router)
app.include_router(chat.router)
app.include_router(user_settings.router)
app.include_router(dashboard.router)
app.include_router(skills.router)
app.include_router(insights.router)

@app.get("/")
async def root():
    return {"message": "StartupIQ Backend Running"}

from fastapi import Request
from fastapi.responses import JSONResponse
import traceback

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    error_detail = {
        "detail": str(exc),
        "traceback": traceback.format_exc(),
        "path": request.url.path
    }
    logger.error(f"GLOBAL EXCEPTION: {error_detail}")
    return JSONResponse(
        status_code=500,
        content=error_detail
    )

@app.get("/health")
async def health_check():
    """Production health check - returns DB and config status."""
    import os
    from app.core.security import pwd_context
    
    db_ok = False
    db_error = None
    try:
        if db_manager.db is not None:
            await db_manager.client.admin.command('ping')
            db_ok = True
        else:
            db_error = "Database not initialized"
    except Exception as e:
        db_error = str(e)
    
    hash_ok = False
    try:
        h = pwd_context.hash("test")
        hash_ok = pwd_context.verify("test", h)
    except Exception as e:
        pass
    
    return {
        "status": "running",
        "database": "connected" if db_ok else f"error: {db_error}",
        "hashing": "ok" if hash_ok else "error",
        "mongo_uri_set": bool(os.environ.get("MONGO_URI")),
        "secret_key_set": bool(os.environ.get("SECRET_KEY")),
        "groq_key_set": bool(os.environ.get("GROQ_API_KEY")),
    }

@app.get("/test-db")
async def test_db():
    try:
        # Test collection logic
        test_collection = db_manager.db.test_connection
        sample_doc = {"test": "connection", "message": "MongoDB Connection Verified"}
        result = await test_collection.insert_one(sample_doc)
        retrieved_doc = await test_collection.find_one({"_id": result.inserted_id})
        await test_collection.delete_one({"_id": result.inserted_id})
        
        return {
            "status": "success",
            "message": "Connected to MongoDB successfully!",
            "data": {"inserted_id": str(result.inserted_id)}
        }
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8002, reload=True)
