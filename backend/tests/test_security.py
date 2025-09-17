"""
Security Feature Tests for Codette Backend
"""

import pytest
from fastapi.testclient import TestClient
import jwt
import time
from datetime import datetime, timedelta
import json
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from main import app
from security_utils import SecurityMiddleware

# Test client
client = TestClient(app)

def get_auth_token():
    """Generate a test auth token"""
    return jwt.encode(
        {"sub": "test", "exp": datetime.utcnow() + timedelta(hours=1)},
        "test_secret",
        algorithm="HS256"
    )

class TestSecurity:
    """Test security features"""
    
    def test_rate_limiting(self):
        """Test API rate limiting"""
        # Make requests up to limit
        token = get_auth_token()
        headers = {"Authorization": f"Bearer {token}"}
        
        for _ in range(60):  # Default rate limit
            response = client.get("/api/health", headers=headers)
            assert response.status_code == 200
        
        # Next request should be rate limited
        response = client.get("/api/health", headers=headers)
        assert response.status_code == 429
        assert "rate limit" in response.json()["detail"].lower()
    
    def test_auth_token_validation(self):
        """Test authentication token validation"""
        # Test without token
        response = client.get("/api/protected")
        assert response.status_code == 401
        
        # Test with invalid token
        headers = {"Authorization": "Bearer invalid"}
        response = client.get("/api/protected", headers=headers)
        assert response.status_code == 401
        
        # Test with expired token
        expired_token = jwt.encode(
            {"sub": "test", "exp": datetime.utcnow() - timedelta(hours=1)},
            "test_secret",
            algorithm="HS256"
        )
        headers = {"Authorization": f"Bearer {expired_token}"}
        response = client.get("/api/protected", headers=headers)
        assert response.status_code == 401
        
        # Test with valid token
        valid_token = get_auth_token()
        headers = {"Authorization": f"Bearer {valid_token}"}
        response = client.get("/api/protected", headers=headers)
        assert response.status_code == 200
    
    def test_cors_headers(self):
        """Test CORS headers"""
        # Test preflight request
        headers = {
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "Authorization"
        }
        response = client.options("/api/health", headers=headers)
        assert response.status_code == 200
        assert "access-control-allow-origin" in response.headers
        assert response.headers["access-control-allow-origin"] == "http://localhost:5173"
        
        # Test actual request
        headers = {"Origin": "http://localhost:5173"}
        response = client.get("/api/health", headers=headers)
        assert response.status_code == 200
        assert "access-control-allow-origin" in response.headers
    
    def test_input_validation(self):
        """Test input validation"""
        # Test with invalid JSON
        response = client.post("/api/analysis/code", data="invalid json")
        assert response.status_code == 400
        
        # Test with missing required fields
        response = client.post("/api/analysis/code", json={})
        assert response.status_code == 422
        
        # Test with invalid field types
        response = client.post("/api/analysis/code", json={"code": 123})
        assert response.status_code == 422
        
        # Test with valid input
        response = client.post("/api/analysis/code", json={
            "code": "print('test')",
            "language": "python"
        })
        assert response.status_code == 200
    
    def test_sql_injection_prevention(self):
        """Test SQL injection prevention"""
        # Test with SQL injection attempt
        malicious_input = "'; DROP TABLE users; --"
        response = client.get(f"/api/user/{malicious_input}")
        assert response.status_code in [400, 404]  # Should be rejected
        
        # Valid input should work
        response = client.get("/api/user/123")
        assert response.status_code == 404  # Assuming user doesn't exist
    
    def test_xss_prevention(self):
        """Test XSS prevention"""
        # Test with XSS attempt
        xss_input = "<script>alert('xss')</script>"
        response = client.post("/api/comment", json={"content": xss_input})
        assert response.status_code == 200
        result = response.json()
        assert "<script>" not in result["content"]  # Should be escaped
    
    def test_file_upload_security(self):
        """Test file upload security"""
        # Test with executable file
        with open("test.exe", "wb") as f:
            f.write(b"fake executable")
        
        with open("test.exe", "rb") as f:
            response = client.post("/api/upload", files={"file": f})
        assert response.status_code == 400  # Should reject executable
        
        os.remove("test.exe")
        
        # Test with valid file
        with open("test.txt", "w") as f:
            f.write("test content")
        
        with open("test.txt", "rb") as f:
            response = client.post("/api/upload", files={"file": f})
        assert response.status_code == 200
        
        os.remove("test.txt")