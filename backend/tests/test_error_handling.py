"""
Error Handling Tests for Codette Backend
"""

import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from main import app

# Test client
client = TestClient(app)

class TestErrorHandling:
    """Test error handling across the application"""
    
    def test_validation_errors(self):
        """Test input validation error handling"""
        # Missing required fields
        response = client.post("/api/quantum/optimize", json={})
        assert response.status_code == 422
        data = response.json()
        assert "detail" in data
        
        # Invalid field type
        response = client.post("/api/quantum/optimize", json={"objectives": "not a list"})
        assert response.status_code == 422
        data = response.json()
        assert "detail" in data
    
    def test_not_found_errors(self):
        """Test 404 error handling"""
        # Non-existent endpoint
        response = client.get("/api/nonexistent")
        assert response.status_code == 404
        data = response.json()
        assert "detail" in data
        
        # Non-existent resource
        response = client.get("/api/dream/nonexistent")
        assert response.status_code == 404
        data = response.json()
        assert "detail" in data
    
    def test_method_not_allowed(self):
        """Test method not allowed handling"""
        # POST to GET-only endpoint
        response = client.post("/api/health")
        assert response.status_code == 405
        data = response.json()
        assert "detail" in data
    
    def test_internal_server_errors(self):
        """Test internal error handling"""
        # Trigger a deliberate internal error
        response = client.post("/api/debug/error")
        assert response.status_code == 500
        data = response.json()
        assert "detail" in data
        assert "internal server error" in data["detail"].lower()
    
    def test_timeout_handling(self):
        """Test timeout error handling"""
        # Request that takes too long
        response = client.get("/api/debug/timeout")
        assert response.status_code == 504
        data = response.json()
        assert "detail" in data
        assert "timeout" in data["detail"].lower()
    
    def test_database_errors(self):
        """Test database error handling"""
        # Invalid database query
        response = client.post("/api/debug/db_error")
        assert response.status_code == 500
        data = response.json()
        assert "detail" in data
        assert "database error" in data["detail"].lower()
    
    def test_concurrent_request_errors(self):
        """Test concurrent request error handling"""
        # Simultaneous requests to rate-limited endpoint
        import concurrent.futures
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            futures = [
                executor.submit(client.get, "/api/health")
                for _ in range(100)
            ]
            responses = [f.result() for f in futures]
        
        # Should see some 429 responses
        assert any(r.status_code == 429 for r in responses)
    
    def test_invalid_token_errors(self):
        """Test authentication error handling"""
        # Invalid token
        headers = {"Authorization": "Bearer invalid_token"}
        response = client.get("/api/protected", headers=headers)
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        
        # Missing token
        response = client.get("/api/protected")
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
    
    def test_request_validation(self):
        """Test request validation error handling"""
        # Invalid content type
        response = client.post(
            "/api/analysis/code",
            data="not json",
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data
        
        # Invalid query parameters
        response = client.get("/api/search?limit=invalid")
        assert response.status_code == 422
        data = response.json()
        assert "detail" in data