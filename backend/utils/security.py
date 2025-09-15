"""
Security Manager for Codette Backend
Handles authentication, authorization, and security policies
"""

import hashlib
import secrets
import time
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

class SecurityManager:
    """Comprehensive security management for Codette"""
    
    def __init__(self):
        self.active_sessions: Dict[str, Dict[str, Any]] = {}
        self.rate_limits: Dict[str, List[float]] = {}
        self.blocked_ips: set = set()
        
    def generate_session_token(self, user_id: str) -> str:
        """Generate secure session token"""
        token_data = f"{user_id}:{time.time()}:{secrets.token_hex(16)}"
        token = hashlib.sha256(token_data.encode()).hexdigest()
        
        self.active_sessions[token] = {
            "user_id": user_id,
            "created_at": time.time(),
            "last_activity": time.time()
        }
        
        return token
    
    def validate_session(self, token: str) -> Optional[str]:
        """Validate session token and return user_id"""
        if token not in self.active_sessions:
            return None
        
        session = self.active_sessions[token]
        
        # Check if session expired (24 hours)
        if time.time() - session["created_at"] > 86400:
            del self.active_sessions[token]
            return None
        
        # Update last activity
        session["last_activity"] = time.time()
        return session["user_id"]
    
    def check_rate_limit(self, client_ip: str, limit: int = 60, window: int = 60) -> bool:
        """Check if client is within rate limits"""
        current_time = time.time()
        
        if client_ip in self.blocked_ips:
            return False
        
        if client_ip not in self.rate_limits:
            self.rate_limits[client_ip] = []
        
        # Clean old requests
        self.rate_limits[client_ip] = [
            req_time for req_time in self.rate_limits[client_ip]
            if current_time - req_time < window
        ]
        
        # Check limit
        if len(self.rate_limits[client_ip]) >= limit:
            logger.warning(f"Rate limit exceeded for {client_ip}")
            return False
        
        # Add current request
        self.rate_limits[client_ip].append(current_time)
        return True
    
    def sanitize_input(self, input_text: str) -> str:
        """Sanitize user input for security"""
        # Remove potentially dangerous patterns
        sanitized = input_text
        
        # Remove script tags
        import re
        sanitized = re.sub(r'<script.*?</script>', '', sanitized, flags=re.IGNORECASE | re.DOTALL)
        
        # Remove eval patterns
        sanitized = re.sub(r'eval\s*\(', '', sanitized, flags=re.IGNORECASE)
        
        # Limit length
        if len(sanitized) > 10000:
            sanitized = sanitized[:10000]
        
        return sanitized
    
    def validate_code_input(self, code: str, language: str) -> Dict[str, Any]:
        """Validate code input for security issues"""
        issues = []
        risk_level = "low"
        
        # Check for dangerous patterns
        if 'eval(' in code:
            issues.append("eval() usage detected - potential code injection")
            risk_level = "high"
        
        if '<script' in code.lower():
            issues.append("Script tags detected - potential XSS")
            risk_level = "high"
        
        if 'innerHTML' in code and 'sanitize' not in code:
            issues.append("Unsafe innerHTML usage - potential XSS")
            risk_level = "medium" if risk_level == "low" else risk_level
        
        # Enhanced security checks
        if 'document.write' in code:
            issues.append("document.write usage - potential XSS")
            risk_level = "medium" if risk_level == "low" else risk_level
        
        if re.search(r'new\s+Function\s*\(', code):
            issues.append("Function constructor usage - potential code injection")
            risk_level = "high"
        
        # Check for SQL injection patterns
        if re.search(r'query\s*\+\s*[\'"]', code):
            issues.append("String concatenation in SQL query - potential injection")
            risk_level = "high"
        
        return {
            "valid": len(issues) == 0,
            "issues": issues,
            "risk_level": risk_level,
            "requires_review": risk_level in ["high", "medium"],
            "auto_block": risk_level == "high" and len(issues) > 2
        }