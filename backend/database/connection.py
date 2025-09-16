"""
Database Connection Manager
Handles SQLite and PostgreSQL connections for Codette
"""

import os
import sqlite3
import logging
from typing import Optional, Dict, Any
import asyncio

logger = logging.getLogger(__name__)

class DatabaseManager:
    """Manages database connections for all AI systems"""
    
    def __init__(self):
        self.connections: Dict[str, sqlite3.Connection] = {}
        self.data_dir = "backend/data"
        self.is_initialized = False
    
    async def initialize(self):
        """Initialize database connections"""
        try:
            # Ensure data directory exists
            os.makedirs(self.data_dir, exist_ok=True)
            
            # Initialize individual databases for each AI system
            db_configs = {
                "dreamcore": "dreamcore.db",
                "nexus": "nexus.db", 
                "aegis": "aegis.db",
                "quantum": "quantum.db",
                "ethical": "ethical.db",
                "neural": "neural.db",
                "music": "music.db"
            }
            
            for system_name, db_file in db_configs.items():
                db_path = os.path.join(self.data_dir, db_file)
                conn = sqlite3.connect(db_path, check_same_thread=False)
                conn.execute("PRAGMA foreign_keys = ON")
                self.connections[system_name] = conn
                logger.info(f"📊 Connected to {system_name} database")
            
            self.is_initialized = True
            logger.info("✅ Database manager initialized successfully")
            
        except Exception as e:
            logger.error(f"❌ Database initialization failed: {e}")
            raise
    
    def get_connection(self, system_name: str) -> Optional[sqlite3.Connection]:
        """Get database connection for specific AI system"""
        return self.connections.get(system_name)
    
    async def close_all(self):
        """Close all database connections"""
        for system_name, conn in self.connections.items():
            try:
                conn.close()
                logger.info(f"🔄 Closed {system_name} database connection")
            except Exception as e:
                logger.error(f"❌ Error closing {system_name} database: {e}")
        
        self.connections.clear()
        self.is_initialized = False