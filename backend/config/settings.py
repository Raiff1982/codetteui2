"""
Backend Configuration Settings
Centralized configuration management for Codette backend
"""

import os
from typing import Dict, Any, List
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    """Application settings with environment variable support"""
    
    # API Configuration
    api_host: str = Field(default="0.0.0.0", env="API_HOST")
    api_port: int = Field(default=8000, env="API_PORT")
    environment: str = Field(default="development", env="ENVIRONMENT")
    
    # Database Configuration
    database_url: str = Field(default="sqlite:///backend/data/codette.db", env="DATABASE_URL")
    
    # Security Configuration
    secret_key: str = Field(default="dev-secret-key", env="SECRET_KEY")
    cors_origins: List[str] = Field(
        default=["http://localhost:5173", "https://codette.online"],
        env="CORS_ORIGINS"
    )
    
    # Rate Limiting
    rate_limit_requests_per_minute: int = Field(default=60, env="RATE_LIMIT_REQUESTS_PER_MINUTE")
    rate_limit_burst: int = Field(default=10, env="RATE_LIMIT_BURST")
    
    # AI System Configuration
    ai_systems_enabled: bool = Field(default=True, env="AI_SYSTEMS_ENABLED")
    quantum_max_dimension: int = Field(default=50, env="QUANTUM_MAX_DIMENSION")
    neural_prediction_limit: int = Field(default=5, env="NEURAL_PREDICTION_LIMIT")
    
    # Logging Configuration
    log_level: str = Field(default="INFO", env="LOG_LEVEL")
    log_file: str = Field(default="backend/logs/codette.log", env="LOG_FILE")
    
    # External Services
    supabase_url: str = Field(default="", env="SUPABASE_URL")
    supabase_service_role_key: str = Field(default="", env="SUPABASE_SERVICE_ROLE_KEY")
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Global settings instance
settings = Settings()

def get_ai_system_config() -> Dict[str, Any]:
    """Get AI system configuration"""
    return {
        "dreamcore": {
            "db_path": "backend/data/dreamcore.db",
            "max_memories": 1000,
            "decay_threshold": 0.1
        },
        "nexus": {
            "db_path": "backend/data/nexus.db",
            "cache_size": 500,
            "max_signal_length": 10000
        },
        "aegis": {
            "db_path": "backend/data/aegis.db",
            "max_decisions": 1000,
            "consensus_threshold": 0.6
        },
        "quantum": {
            "db_path": "backend/data/quantum.db",
            "max_dimension": settings.quantum_max_dimension,
            "population_size": 50,
            "iterations": 100
        },
        "ethical": {
            "db_path": "backend/data/ethical.db",
            "virtue_weights": {
                "compassion": 0.25,
                "integrity": 0.25,
                "courage": 0.20,
                "wisdom": 0.30
            }
        },
        "neural": {
            "db_path": "backend/data/neural.db",
            "prediction_limit": settings.neural_prediction_limit,
            "learning_rate": 0.01
        }
    }