"""
Rate Limiter for Codette Backend
Advanced rate limiting with multiple strategies
"""

import time
from typing import Dict, List, Optional
from collections import defaultdict
import logging

logger = logging.getLogger(__name__)

class RateLimiter:
    """Advanced rate limiting for API endpoints"""
    
    def __init__(self):
        self.requests: Dict[str, List[float]] = defaultdict(list)
        self.blocked_clients: Dict[str, float] = {}
        
        # Rate limit configurations
        self.limits = {
            "default": {"requests": 60, "window": 60},  # 60 requests per minute
            "ai_analysis": {"requests": 10, "window": 60},  # 10 AI requests per minute
            "quantum": {"requests": 5, "window": 60},  # 5 quantum optimizations per minute
            "music": {"requests": 20, "window": 60}  # 20 music requests per minute
        }
    
    def is_allowed(self, client_id: str, endpoint_type: str = "default") -> bool:
        """Check if request is allowed under rate limits"""
        current_time = time.time()
        
        # Check if client is temporarily blocked
        if client_id in self.blocked_clients:
            if current_time < self.blocked_clients[client_id]:
                return False
            else:
                del self.blocked_clients[client_id]
        
        # Get rate limit config
        config = self.limits.get(endpoint_type, self.limits["default"])
        
        # Clean old requests
        cutoff_time = current_time - config["window"]
        self.requests[client_id] = [
            req_time for req_time in self.requests[client_id]
            if req_time > cutoff_time
        ]
        
        # Check if under limit
        if len(self.requests[client_id]) >= config["requests"]:
            # Block client for 5 minutes if they exceed limits repeatedly
            violation_count = len([
                req for req in self.requests[client_id]
                if req > current_time - 300  # Last 5 minutes
            ])
            
            if violation_count >= config["requests"] * 2:
                self.blocked_clients[client_id] = current_time + 300  # Block for 5 minutes
                logger.warning(f"Blocked client {client_id} for repeated rate limit violations")
            
            return False
        
        # Record request
        self.requests[client_id].append(current_time)
        return True
    
    def get_remaining_requests(self, client_id: str, endpoint_type: str = "default") -> int:
        """Get remaining requests for client"""
        config = self.limits.get(endpoint_type, self.limits["default"])
        current_requests = len(self.requests.get(client_id, []))
        return max(0, config["requests"] - current_requests)
    
    def get_reset_time(self, client_id: str, endpoint_type: str = "default") -> float:
        """Get time when rate limit resets"""
        config = self.limits.get(endpoint_type, self.limits["default"])
        
        if client_id not in self.requests or not self.requests[client_id]:
            return time.time()
        
        oldest_request = min(self.requests[client_id])
        return oldest_request + config["window"]