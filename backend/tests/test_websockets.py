"""
WebSocket Connection Tests for Codette Backend
"""

import pytest
import asyncio
from fastapi.testclient import TestClient
from fastapi.websockets import WebSocket
from unittest.mock import patch, MagicMock
import json
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from main import app

class TestWebSocketConnections:
    """Test WebSocket functionality"""
    
    @pytest.mark.asyncio
    async def test_websocket_connection(self):
        """Test basic WebSocket connection"""
        with TestClient(app) as client:
            with client.websocket_connect("/ws") as websocket:
                data = {"type": "ping"}
                websocket.send_json(data)
                response = websocket.receive_json()
                assert response["type"] == "pong"
    
    @pytest.mark.asyncio
    async def test_websocket_authentication(self):
        """Test WebSocket authentication"""
        with TestClient(app) as client:
            # Test without auth token
            with pytest.raises(Exception):
                with client.websocket_connect("/ws") as websocket:
                    pass
            
            # Test with invalid auth token
            with pytest.raises(Exception):
                with client.websocket_connect("/ws?token=invalid") as websocket:
                    pass
            
            # Test with valid auth token
            with client.websocket_connect("/ws?token=test_token") as websocket:
                assert websocket.connected
    
    @pytest.mark.asyncio
    async def test_websocket_broadcast(self):
        """Test WebSocket message broadcasting"""
        with TestClient(app) as client:
            with client.websocket_connect("/ws?token=test_token") as ws1:
                with client.websocket_connect("/ws?token=test_token") as ws2:
                    # Send message from ws1
                    ws1.send_json({"type": "broadcast", "message": "Hello"})
                    
                    # Check ws2 receives it
                    response = ws2.receive_json()
                    assert response["type"] == "broadcast"
                    assert response["message"] == "Hello"
    
    @pytest.mark.asyncio
    async def test_websocket_error_handling(self):
        """Test WebSocket error handling"""
        with TestClient(app) as client:
            with client.websocket_connect("/ws?token=test_token") as websocket:
                # Send invalid message
                websocket.send_json({"type": "invalid"})
                response = websocket.receive_json()
                assert response["type"] == "error"
                assert "message" in response
    
    @pytest.mark.asyncio
    async def test_websocket_rate_limiting(self):
        """Test WebSocket rate limiting"""
        with TestClient(app) as client:
            with client.websocket_connect("/ws?token=test_token") as websocket:
                # Send messages quickly
                for _ in range(10):
                    websocket.send_json({"type": "ping"})
                
                # Check for rate limit error
                response = websocket.receive_json()
                if response["type"] == "error":
                    assert "rate limit" in response["message"].lower()
    
    @pytest.mark.asyncio
    async def test_websocket_reconnection(self):
        """Test WebSocket reconnection behavior"""
        with TestClient(app) as client:
            with client.websocket_connect("/ws?token=test_token") as ws1:
                # Force disconnect
                ws1.close()
                
                # Reconnect should work
                with client.websocket_connect("/ws?token=test_token") as ws2:
                    assert ws2.connected
    
    @pytest.mark.asyncio
    async def test_websocket_large_messages(self):
        """Test handling of large WebSocket messages"""
        with TestClient(app) as client:
            with client.websocket_connect("/ws?token=test_token") as websocket:
                # Send large message
                large_data = {"type": "message", "data": "x" * 1024 * 1024}  # 1MB
                websocket.send_json(large_data)
                
                # Should get error about message size
                response = websocket.receive_json()
                assert response["type"] == "error"
                assert "message size" in response["message"].lower()