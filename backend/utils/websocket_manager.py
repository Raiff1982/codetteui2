"""
WebSocket Manager for Real-Time Collaboration
Handles WebSocket connections and real-time communication
"""

import json
import logging
from typing import Dict, List, Set, Any, Optional
from datetime import datetime
from fastapi import WebSocket
import asyncio

logger = logging.getLogger(__name__)

class WebSocketManager:
    """Manages WebSocket connections for real-time collaboration"""
    
    def __init__(self):
        # Active connections by session
        self.active_connections: Dict[str, List[WebSocket]] = {}
        # Session metadata
        self.sessions: Dict[str, Dict[str, Any]] = {}
        # User information
        self.session_users: Dict[str, Set[str]] = {}
        
    async def connect(self, websocket: WebSocket, session_id: str, user_name: str = "Anonymous"):
        """Connect a new WebSocket client"""
        try:
            await websocket.accept()
            
            # Add to active connections
            if session_id not in self.active_connections:
                self.active_connections[session_id] = []
                self.session_users[session_id] = set()
                self.sessions[session_id] = {
                    "created_at": datetime.utcnow().isoformat(),
                    "last_activity": datetime.utcnow().isoformat(),
                    "active_users": 0
                }
            
            self.active_connections[session_id].append(websocket)
            self.session_users[session_id].add(user_name)
            self.sessions[session_id]["active_users"] = len(self.active_connections[session_id])
            self.sessions[session_id]["last_activity"] = datetime.utcnow().isoformat()
            
            # Notify other users in session
            await self.broadcast_to_session(session_id, {
                "type": "user_joined",
                "user_name": user_name,
                "timestamp": datetime.utcnow().isoformat(),
                "active_users": len(self.active_connections[session_id])
            }, exclude=websocket)
            
            logger.info(f"🔗 WebSocket connected: {user_name} joined session {session_id}")
            
        except Exception as e:
            logger.error(f"❌ WebSocket connection failed: {e}")
            raise
    
    def disconnect(self, websocket: WebSocket, session_id: str):
        """Disconnect a WebSocket client"""
        try:
            if session_id in self.active_connections:
                if websocket in self.active_connections[session_id]:
                    self.active_connections[session_id].remove(websocket)
                
                # Update session info
                if session_id in self.sessions:
                    self.sessions[session_id]["active_users"] = len(self.active_connections[session_id])
                    self.sessions[session_id]["last_activity"] = datetime.utcnow().isoformat()
                
                # Clean up empty sessions
                if not self.active_connections[session_id]:
                    del self.active_connections[session_id]
                    if session_id in self.sessions:
                        del self.sessions[session_id]
                    if session_id in self.session_users:
                        del self.session_users[session_id]
                
                logger.info(f"🔌 WebSocket disconnected from session {session_id}")
                
        except Exception as e:
            logger.error(f"❌ WebSocket disconnect error: {e}")
    
    async def broadcast_to_session(self, session_id: str, message: Dict[str, Any], exclude: Optional[WebSocket] = None):
        """Broadcast message to all clients in a session"""
        if session_id not in self.active_connections:
            return
        
        # Add timestamp if not present
        if "timestamp" not in message:
            message["timestamp"] = datetime.utcnow().isoformat()
        
        message_text = json.dumps(message)
        disconnected = []
        
        for websocket in self.active_connections[session_id]:
            if websocket == exclude:
                continue
                
            try:
                await websocket.send_text(message_text)
            except Exception as e:
                logger.warning(f"Failed to send message to WebSocket: {e}")
                disconnected.append(websocket)
        
        # Clean up disconnected sockets
        for ws in disconnected:
            self.disconnect(ws, session_id)
    
    async def send_to_user(self, session_id: str, user_name: str, message: Dict[str, Any]):
        """Send message to specific user in session"""
        # For now, broadcast to all (would need user tracking for specific targeting)
        await self.broadcast_to_session(session_id, {
            **message,
            "target_user": user_name
        })
    
    async def create_session(self, session_id: str, creator_name: str) -> Dict[str, Any]:
        """Create a new collaboration session"""
        if session_id in self.sessions:
            raise ValueError(f"Session {session_id} already exists")
        
        self.sessions[session_id] = {
            "id": session_id,
            "creator": creator_name,
            "created_at": datetime.utcnow().isoformat(),
            "last_activity": datetime.utcnow().isoformat(),
            "active_users": 0,
            "total_messages": 0
        }
        
        self.active_connections[session_id] = []
        self.session_users[session_id] = set()
        
        logger.info(f"📝 Created collaboration session: {session_id}")
        
        return self.sessions[session_id]
    
    def get_active_sessions(self) -> List[Dict[str, Any]]:
        """Get list of active collaboration sessions"""
        return [
            {
                **session_data,
                "users": list(self.session_users.get(session_id, set()))
            }
            for session_id, session_data in self.sessions.items()
        ]
    
    def get_connection_count(self) -> int:
        """Get total number of active WebSocket connections"""
        return sum(len(connections) for connections in self.active_connections.values())
    
    async def disconnect_all(self):
        """Disconnect all WebSocket connections"""
        for session_id in list(self.active_connections.keys()):
            for websocket in list(self.active_connections[session_id]):
                try:
                    await websocket.close()
                except Exception:
                    pass
        
        self.active_connections.clear()
        self.sessions.clear()
        self.session_users.clear()
        
        logger.info("🔌 All WebSocket connections closed")