from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # MongoDB Config
    MONGO_URI: str = "mongodb://localhost:27017/startupiq"
    
    # AI Config
    GROQ_API_KEY: Optional[str] = None
    
    # Security Config
    SECRET_KEY: str = "production_fallback_secret_key_12345"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440 # 24 hours
    
    # App Config
    PROJECT_NAME: str = "StartupIQ"
    
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
