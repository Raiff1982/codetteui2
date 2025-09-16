
"""
Security utilities for Codette backend
Provides input validation, rate limiting, and security checks
"""
import os
import re
import time
import logging
from typing import Dict, List, Optional, Any, Union
from datetime import datetime, timedelta
from cryptography.fernet import Fernet
from pydantic import BaseModel, ValidationError
import jwt
from fastapi import HTTPException, Request
from starlette.middleware.base import BaseHTTPMiddleware
import asyncio
import hashlib
import json

# Configure logging
logger = logging.getLogger(__name__)

class RateLimiter:
    """Simple in-memory rate limiter"""
    def __init__(self, rate_limit: int = 100, time_window: int = 60):
        self.rate_limit = rate_limit  # requests per time window
        self.time_window = time_window  # time window in seconds
        self.requests: Dict[str, List[float]] = {}
        self._cleanup_task = asyncio.create_task(self._periodic_cleanup())

    async def _periodic_cleanup(self):
        """Periodically clean up old request records"""
        while True:
            try:
                current_time = time.time()
                for ip in list(self.requests.keys()):
                    self.requests[ip] = [t for t in self.requests[ip] 
                                       if current_time - t < self.time_window]
                    if not self.requests[ip]:
                        del self.requests[ip]
            except Exception as e:
                logger.error(f"Error in rate limiter cleanup: {e}")
            await asyncio.sleep(60)  # Run cleanup every minute

    async def is_rate_limited(self, ip: str) -> bool:
        """Check if a request should be rate limited"""
        current_time = time.time()
        if ip not in self.requests:
            self.requests[ip] = []
        
        # Remove old requests
        self.requests[ip] = [t for t in self.requests[ip] 
                           if current_time - t < self.time_window]
        
        # Check rate limit
        if len(self.requests[ip]) >= self.rate_limit:
            return True
        
        # Add new request
        self.requests[ip].append(current_time)
        return False

class SecurityMiddleware(BaseHTTPMiddleware):
    """Security middleware for request validation and protection"""
    def __init__(self, app, rate_limiter: RateLimiter):
        super().__init__(app)
        self.rate_limiter = rate_limiter
    
    async def dispatch(self, request: Request, call_next):
        # Get client IP
        client_ip = request.client.host if request.client else "unknown"
        
        # Check rate limit
        if await self.rate_limiter.is_rate_limited(client_ip):
            raise HTTPException(status_code=429, detail="Rate limit exceeded")
        
        # Basic security headers
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        return response

class InputValidator:
    """Input validation utilities"""
    @staticmethod
    def validate_code(code: str, max_length: int = 50000) -> bool:
        """Validate code input"""
        if not code or len(code) > max_length:
            return False
        return True

    @staticmethod
    def sanitize_filename(filename: str) -> str:
        """Sanitize filename to prevent path traversal"""
        return re.sub(r'[^\w\-_\.]', '_', filename)

    @staticmethod
    def validate_path(path: str) -> bool:
        """Validate file path to prevent path traversal"""
        normalized = os.path.normpath(path)
        return not any(part.startswith('.') for part in normalized.split(os.sep))

class SecurityUtils:
    """Core security utilities"""
    def __init__(self, secret_key: str):
        self.secret_key = secret_key
        self.fernet = Fernet(Fernet.generate_key())

    def generate_token(self, data: Dict[str, Any], expires_in: int = 3600) -> str:
        """Generate JWT token"""
        payload = {
            **data,
            'exp': datetime.utcnow() + timedelta(seconds=expires_in)
        }
        return jwt.encode(payload, self.secret_key, algorithm='HS256')

    def verify_token(self, token: str) -> Dict[str, Any]:
        """Verify JWT token"""
        try:
            return jwt.decode(token, self.secret_key, algorithms=['HS256'])
        except jwt.InvalidTokenError as e:
            raise HTTPException(status_code=401, detail=str(e))

    def encrypt_data(self, data: Union[str, bytes]) -> bytes:
        """Encrypt data using Fernet"""
        if isinstance(data, str):
            data = data.encode()
        return self.fernet.encrypt(data)

    def decrypt_data(self, data: bytes) -> bytes:
        """Decrypt data using Fernet"""
        return self.fernet.decrypt(data)

    def hash_password(self, password: str) -> str:
        """Hash password using SHA-256"""
        return hashlib.sha256(password.encode()).hexdigest()

    def compute_checksum(self, data: Union[str, bytes]) -> str:
        """Compute SHA-256 checksum of data"""
        if isinstance(data, str):
            data = data.encode()
        return hashlib.sha256(data).hexdigest()

    def encrypt_file(self, infile: str, outfile: str):
        """Encrypt a file using Fernet"""
        with open(infile, 'rb') as fin:
            data = fin.read()
        enc = self.fernet.encrypt(data)
        with open(outfile, 'wb') as fout:
            fout.write(enc)

    def decrypt_file(self, infile: str, outfile: str):
        """Decrypt a file using Fernet"""
        with open(infile, 'rb') as fin:
            data = fin.read()
        dec = self.fernet.decrypt(data)
        with open(outfile, 'wb') as fout:
            fout.write(dec)

# Singleton instances
rate_limiter = RateLimiter()
input_validator = InputValidator()
