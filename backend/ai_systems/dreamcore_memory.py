"""
DreamCore Memory System - Production Implementation
Based on research paper: "Codette DreamCore: Memory Anchoring and Wake-State Emotional Mapping Engine"
DOI: 10.5281/zenodo.16388758

This implements the actual DreamCore system described in the research paper.
"""

import asyncio
import json
import aiosqlite
import hashlib
import numpy as np
import statistics
import os
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional, Tuple
from dataclasses import dataclass, asdict
import logging

logger = logging.getLogger(__name__)

@dataclass
class MemoryAnchor:
    """Memory anchor as described in the research paper"""
    type: str  # 'trauma', 'resilience', 'insight', 'emotion'
    strength: float  # 0.0 to 1.0
    content: str
    temporal_signature: str
    decay_factor: float = 0.95

@dataclass
class EmotionalMemory:
    """Emotional memory with temporal decay"""
    id: str
    emotion_tag: str
    content: str
    anchors: List[Dict[str, Any]]  # Serialized anchors
    emotional_weight: float
    created_at: datetime
    last_accessed: datetime
    access_count: int = 0
    decay_factor: float = 0.95

class DreamCoreMemory:
    """
    Real DreamCore Memory System implementation
    
    Based on the "Red Car Divergence" event and emotional vector mapping
    as described in the research paper.
    """
    
    def __init__(self, db_path: str = "backend/data/dreamcore.db"):
        self.db_path = db_path
        self.memories: Dict[str, EmotionalMemory] = {}
        self.emotional_vectors: Dict[str, np.ndarray] = {}
        self.wake_state_tracers: List[Dict[str, Any]] = []
        self.is_initialized = False
        self.conn: Optional[aiosqlite.Connection] = None
        
        # Ensure data directory exists
        db_dir = os.path.dirname(self.db_path)
        if db_dir:
            os.makedirs(db_dir, exist_ok=True)
        
    async def initialize(self):
        """Initialize the DreamCore system"""
        try:
            logger.info("Initializing DreamCore Memory System...")
            
            # Create database connection
            self.conn = await aiosqlite.connect(self.db_path)
            
            # Enable WAL mode and performance optimizations
            await self.conn.execute("PRAGMA journal_mode=WAL")
            await self.conn.execute("PRAGMA synchronous=NORMAL")
            await self.conn.execute("PRAGMA foreign_keys=ON")
            
            await self._create_tables()
            
            # Load existing memories
            await self._load_memories()
            
            # Initialize emotional vector space
            self._initialize_emotional_vectors()
            
            self.is_initialized = True
            logger.info("✅ DreamCore Memory System initialized successfully")
            
        except Exception as e:
            logger.error(f"❌ DreamCore initialization failed: {e}")
            raise
    
    async def _create_tables(self):
        """Create database tables for memory storage"""
        await self.conn.execute("""
            CREATE TABLE IF NOT EXISTS memories (
                id TEXT PRIMARY KEY,
                emotion_tag TEXT NOT NULL,
                content_redacted TEXT NOT NULL,
                emotional_weight REAL NOT NULL,
                created_at TEXT NOT NULL,
                last_accessed TEXT NOT NULL,
                access_count INTEGER DEFAULT 0,
                decay_factor REAL DEFAULT 0.95,
                anchors TEXT NOT NULL
            )
        """)
        
        await self.conn.execute("""
            CREATE TABLE IF NOT EXISTS wake_state_traces (
                id TEXT PRIMARY KEY,
                trigger_event TEXT NOT NULL,
                emotional_response REAL NOT NULL,
                cognitive_state TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                memory_id TEXT,
                FOREIGN KEY (memory_id) REFERENCES memories (id)
            )
        """)
        
        await self.conn.execute("""
            CREATE TABLE IF NOT EXISTS emotional_vectors (
                emotion TEXT PRIMARY KEY,
                vector_data TEXT NOT NULL,
                last_updated TEXT NOT NULL
            )
        """)
        
        await self.conn.commit()
        logger.info("📊 DreamCore database tables created")
    
    async def _load_memories(self):
        """Load existing memories from database"""
        async with self.conn.execute("SELECT * FROM memories") as cursor:
            async for row in cursor:
                try:
                    memory = EmotionalMemory(
                        id=row[0],
                        emotion_tag=row[1],
                        content=row[2],
                        emotional_weight=row[3],
                        created_at=datetime.fromisoformat(row[4]),
                        last_accessed=datetime.fromisoformat(row[5]),
                        access_count=row[6],
                        decay_factor=row[7],
                        anchors=json.loads(row[8])
                    )
                    self.memories[memory.id] = memory
                except Exception as e:
                    logger.warning(f"Failed to load memory {row[0]}: {e}")
        
        logger.info(f"📚 Loaded {len(self.memories)} memories from database")
    
    def _initialize_emotional_vectors(self):
        """Initialize emotional vector space as described in research"""
        # Emotional dimensions based on research paper
        emotions = [
            "compassion", "curiosity", "fear", "joy", "sorrow", 
            "ethics", "quantum", "wisdom", "courage", "integrity"
        ]
        
        # Load existing vectors or create new ones
        existing_vectors = {}
        async with self.conn.execute("SELECT emotion, vector_data FROM emotional_vectors") as cursor:
            async for row in cursor:
                existing_vectors[row[0]] = row[1]
        
        for emotion in emotions:
            if emotion in existing_vectors:
                # Load existing vector
                vector_data = json.loads(existing_vectors[emotion])
                self.emotional_vectors[emotion] = np.array(vector_data)
            else:
                # Create new normalized emotional vector
                vector = np.random.normal(0, 1, 10)  # 10-dimensional emotional space
                vector = vector / np.linalg.norm(vector)  # Normalize
                self.emotional_vectors[emotion] = vector
                
                # Save to database
                await self.conn.execute("""
                    INSERT OR REPLACE INTO emotional_vectors (emotion, vector_data, last_updated)
                    VALUES (?, ?, ?)
                """, (emotion, json.dumps(vector.tolist()), datetime.utcnow().isoformat() + "Z"))
        
        await self.conn.commit()
        logger.info("🧠 Emotional vector space initialized")
    
    async def store_memory(
        self, 
        emotion_tag: str, 
        content: str, 
        emotional_weight: float = 0.5,
        anchors: Optional[List[MemoryAnchor]] = None
    ) -> str:
        """Store memory with emotional anchoring"""
        try:
            memory_id = self._generate_memory_id(content)
            
            # Redact content before storage
            redacted_content = self._redact_content(content)
            
            if anchors is None:
                anchors = self._generate_anchors(redacted_content, emotion_tag)
            
            # Convert anchors to serializable format
            anchors_data = [asdict(anchor) for anchor in anchors]
            
            memory = EmotionalMemory(
                id=memory_id,
                emotion_tag=emotion_tag,
                content=redacted_content,
                anchors=anchors_data,
                emotional_weight=emotional_weight,
                created_at=datetime.utcnow(),
                last_accessed=datetime.utcnow()
            )
            
            # Store in memory and database
            self.memories[memory_id] = memory
            await self._persist_memory(memory)
            
            # Update emotional vectors
            self._update_emotional_vectors(emotion_tag, emotional_weight)
            
            logger.info(f"💾 Memory stored: {memory_id} ({emotion_tag})")
            return memory_id
            
        except Exception as e:
            logger.error(f"❌ Memory storage failed: {e}")
            raise
    
    async def retrieve_memories(
        self, 
        emotion_tag: Optional[str] = None,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Retrieve memories with temporal decay consideration"""
        try:
            # Apply temporal decay
            await self._apply_temporal_decay()
            
            # Filter memories
            filtered_memories = []
            for memory in self.memories.values():
                if emotion_tag is None or memory.emotion_tag == emotion_tag:
                    # Update access count and last accessed
                    memory.access_count += 1
                    memory.last_accessed = datetime.utcnow()
                    filtered_memories.append(memory)
            
            # Sort by emotional weight and recency
            filtered_memories.sort(
                key=lambda m: (m.emotional_weight, m.last_accessed.timestamp()),
                reverse=True
            )
            
            # Convert to dict format
            result = []
            for memory in filtered_memories[:limit]:
                result.append({
                    "id": memory.id,
                    "emotion_tag": memory.emotion_tag,
                    "content": memory.content,
                    "emotional_weight": memory.emotional_weight,
                    "created_at": memory.created_at.isoformat(),
                    "access_count": memory.access_count,
                    "anchors": memory.anchors,
                    "decay_factor": memory.decay_factor
                })
            
            logger.info(f"🔍 Retrieved {len(result)} memories")
            return result
            
        except Exception as e:
            logger.error(f"❌ Memory retrieval failed: {e}")
            raise
    
    async def get_emotional_state(self) -> Dict[str, float]:
        """Get current emotional state based on recent memories"""
        try:
            recent_memories = [
                m for m in self.memories.values()
                if (datetime.utcnow() - m.last_accessed).total_seconds() < 3600  # Last hour
            ]
            
            if not recent_memories:
                return {"neutral": 1.0}
            
            # Calculate emotional state
            emotional_state = {}
            total_weight = sum(m.emotional_weight for m in recent_memories)
            
            if total_weight > 0:
                for memory in recent_memories:
                    emotion = memory.emotion_tag
                    weight = memory.emotional_weight / total_weight
                    emotional_state[emotion] = emotional_state.get(emotion, 0) + weight
            
            return emotional_state
            
        except Exception as e:
            logger.error(f"❌ Emotional state calculation failed: {e}")
            return {"error": 1.0}
    
    def _generate_memory_id(self, content: str) -> str:
        """Generate unique memory ID"""
        hash_input = f"{content}{datetime.utcnow().isoformat()}"
        return hashlib.sha256(hash_input.encode()).hexdigest()[:16]
    
    def _generate_anchors(self, content: str, emotion_tag: str) -> List[MemoryAnchor]:
        """Generate memory anchors based on content analysis"""
        anchors = []
        content_lower = content.lower()
        
        # Analyze content for anchor points
        if any(word in content_lower for word in ["error", "bug", "fail", "problem"]):
            anchors.append(MemoryAnchor(
                type="trauma",
                strength=0.8,
                content=content[:50],
                temporal_signature=datetime.utcnow().isoformat()
            ))
        
        if any(word in content_lower for word in ["success", "complete", "fix", "solve"]):
            anchors.append(MemoryAnchor(
                type="resilience",
                strength=0.9,
                content=content[:50],
                temporal_signature=datetime.utcnow().isoformat()
            ))
        
        if any(word in content_lower for word in ["learn", "discover", "understand", "realize"]):
            anchors.append(MemoryAnchor(
                type="insight",
                strength=0.7,
                content=content[:100],
                temporal_signature=datetime.utcnow().isoformat()
            ))
        
        # Always add an emotion anchor
        anchors.append(MemoryAnchor(
            type="emotion",
            strength=0.6,
            content=content[:75],
            temporal_signature=datetime.utcnow().isoformat()
        ))
        
        return anchors
    
    async def _persist_memory(self, memory: EmotionalMemory):
        """Persist memory to database"""
        await self.conn.execute("""
            INSERT OR REPLACE INTO memories 
            (id, emotion_tag, content_redacted, emotional_weight, created_at, last_accessed, access_count, decay_factor, anchors)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            memory.id,
            memory.emotion_tag,
            memory.content,
            memory.emotional_weight,
            memory.created_at.isoformat() + "Z",
            memory.last_accessed.isoformat() + "Z",
            memory.access_count,
            memory.decay_factor,
            json.dumps(memory.anchors)
        ))
        
        await self.conn.commit()
    
    def _update_emotional_vectors(self, emotion_tag: str, weight: float):
        """Update emotional vector space based on new memory"""
        if emotion_tag in self.emotional_vectors:
            # Apply learning rate to update vector
            learning_rate = 0.01
            update = np.random.normal(0, weight, 10) * learning_rate
            self.emotional_vectors[emotion_tag] += update
            # Renormalize
            norm = np.linalg.norm(self.emotional_vectors[emotion_tag])
            if norm > 0:
                self.emotional_vectors[emotion_tag] /= norm
            
            # Save updated vector to database
            await self.conn.execute("""
                UPDATE emotional_vectors 
                SET vector_data = ?, last_updated = ?
                WHERE emotion = ?
            """, (
                json.dumps(self.emotional_vectors[emotion_tag].tolist()),
                datetime.utcnow().isoformat() + "Z",
                emotion_tag
            ))
            await self.conn.commit()
    
    def _redact_content(self, content: str) -> str:
        """Redact PII from content before storage"""
        import re
        
        redacted = content
        
        # Redact email addresses
        redacted = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', '[EMAIL_REDACTED]', redacted)
        
        # Redact phone numbers
        redacted = re.sub(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', '[PHONE_REDACTED]', redacted)
        
        # Redact potential API keys/tokens
        redacted = re.sub(r'\b[A-Za-z0-9]{32,}\b', '[TOKEN_REDACTED]', redacted)
        
        return redacted
    
    async def _apply_temporal_decay(self):
        """Apply temporal decay to memories as described in research"""
        current_time = datetime.utcnow()
        decayed_memories = []
        
        for memory_id, memory in list(self.memories.items()):
            # Calculate decay based on time and emotional weight
            time_delta = current_time - memory.last_accessed
            days_since_access = time_delta.total_seconds() / (24 * 3600)
            
            # Decay formula from research: stronger emotions decay slower
            decay_rate = memory.decay_factor ** (days_since_access / (memory.emotional_weight + 0.1))
            
            if decay_rate < 0.1:  # Memory has decayed too much
                decayed_memories.append(memory_id)
            else:
                # Update decay factor
                memory.decay_factor = decay_rate
        
        # Remove decayed memories
        for memory_id in decayed_memories:
            del self.memories[memory_id]
            # Remove from database
            await self.conn.execute("DELETE FROM memories WHERE id = ?", (memory_id,))
            await self.conn.commit()
        
        if decayed_memories:
            logger.info(f"🗑️ Removed {len(decayed_memories)} decayed memories")
    
    def is_active(self) -> bool:
        """Check if DreamCore is active"""
        return self.is_initialized and self.conn is not None
    
    async def shutdown(self):
        """Shutdown DreamCore system"""
        try:
            if self.conn:
                await self.conn.close()
                self.conn = None
            logger.info("🔄 DreamCore Memory System shutdown complete")
        except Exception as e:
            logger.error(f"❌ DreamCore shutdown error: {e}")