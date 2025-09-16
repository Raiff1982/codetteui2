"""
Supabase Client for Python Backend
Handles database connections and operations
"""

import os
import asyncio
import logging
from typing import Dict, Any, Optional, List
from supabase import create_client, Client
from postgrest import APIError

logger = logging.getLogger(__name__)

class SupabaseClient:
    """Production Supabase client for backend operations"""
    
    def __init__(self):
        self.client: Optional[Client] = None
        self.url = os.getenv('SUPABASE_URL')
        self.key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')  # Use service role for backend
        self.is_connected = False
    
    async def initialize(self):
        """Initialize Supabase connection"""
        try:
            if not self.url or not self.key:
                logger.warning("Supabase credentials not found - running in local mode")
                return False
            
            self.client = create_client(self.url, self.key)
            
            # Test connection
            result = await self._test_connection()
            if result:
                self.is_connected = True
                logger.info("✅ Supabase client connected successfully")
                return True
            else:
                logger.error("❌ Supabase connection test failed")
                return False
                
        except Exception as e:
            logger.error(f"❌ Supabase initialization failed: {e}")
            return False
    
    async def _test_connection(self) -> bool:
        """Test Supabase connection"""
        try:
            # Simple query to test connection
            result = self.client.table('ethical_code_generations').select('id').limit(1).execute()
            return True
        except Exception as e:
            logger.error(f"Supabase connection test failed: {e}")
            return False
    
    async def store_ethical_generation(self, data: Dict[str, Any]) -> Optional[str]:
        """Store ethical code generation"""
        try:
            if not self.is_connected:
                return None
            
            result = self.client.table('ethical_code_generations').insert(data).execute()
            return result.data[0]['id'] if result.data else None
            
        except APIError as e:
            logger.error(f"Failed to store ethical generation: {e}")
            return None
    
    async def get_verified_generations(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get verified code generations"""
        try:
            if not self.is_connected:
                return []
            
            result = self.client.table('ethical_code_generations')\
                .select('*')\
                .eq('verification_status', 'verified')\
                .gte('ethical_score', 0.8)\
                .order('created_at', desc=True)\
                .limit(limit)\
                .execute()
            
            return result.data or []
            
        except APIError as e:
            logger.error(f"Failed to get verified generations: {e}")
            return []

# Global instance
supabase_client = SupabaseClient()