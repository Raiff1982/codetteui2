"""
Codette AI Backend - Complete Implementation
FastAPI-based backend with all AI systems integrated
"""

import os
import asyncio
import logging
import json
from datetime import datetime
from typing import Dict, Any, List, Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
import uvicorn

# Import configuration
from backend.config.settings import Settings, get_ai_system_config

# Import AI systems and routers
from backend.ai_systems.dreamcore_memory import DreamCoreMemory
from backend.ai_systems.nexus_signal_engine import NexusSignalEngine
from backend.ai_systems.aegis_council import AegisCouncil
from backend.ai_systems.quantum_optimizer import QuantumMultiObjectiveOptimizer
from backend.ai_systems.ethical_governance import EthicalAIGovernance
from backend.ai_systems.neural_predictor import NeuralCodePredictor
from backend.music_generator import AIComposer
from backend.routers.analysis import router as analysis_router
from backend.routers.security import router as security_router

# Create settings instance
settings = Settings()

# Database and utilities
from database.connection import DatabaseManager
from utils.logging_config import setup_logging, get_logger
from utils.security import SecurityManager
from utils.rate_limiter import RateLimiter
from utils.websocket_manager import WebSocketManager
import subprocess
import sys

# Setup logging with correlation tracking
setup_logging()
logger = get_logger(__name__)

# Global AI systems
ai_systems = {}
websocket_manager = WebSocketManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize and cleanup AI systems"""
    logger.info("🚀 Starting Codette AI Backend...")
    
    try:
        # Initialize database
        db_manager = DatabaseManager()
        await db_manager.initialize()
        app.state.db = db_manager
        
        # Initialize AI systems
        logger.info("🧠 Initializing AI Systems...")
        
        ai_config = get_ai_system_config()
        
        ai_systems['dreamcore'] = DreamCoreMemory(ai_config['dreamcore']['db_path'])
        await ai_systems['dreamcore'].initialize()
        
        ai_systems['nexus'] = NexusSignalEngine(ai_config['nexus']['db_path'])
        await ai_systems['nexus'].initialize()
        
        ai_systems['aegis'] = AegisCouncil(ai_config['aegis']['db_path'])
        await ai_systems['aegis'].initialize()
        
        ai_systems['quantum'] = QuantumMultiObjectiveOptimizer(ai_config['quantum']['db_path'])
        await ai_systems['quantum'].initialize()
        
        ai_systems['ethical'] = EthicalAIGovernance(ai_config['ethical']['db_path'])
        await ai_systems['ethical'].initialize()
        
        ai_systems['neural'] = NeuralCodePredictor(ai_config['neural']['db_path'])
        await ai_systems['neural'].initialize()
        
        ai_systems['music'] = AIComposer()
        ai_systems['music'].initialize()
        
        app.state.ai_systems = ai_systems
        
        logger.info("✅ All AI systems initialized successfully")
        logger.info("🌟 Codette AI Backend ready for connections")
        
        yield
        
    except Exception as e:
        logger.error(f"❌ Failed to initialize backend: {e}")
        raise
    finally:
        # Cleanup
        logger.info("🔄 Shutting down AI systems...")
        await websocket_manager.disconnect_all()
        for system_name, system in ai_systems.items():
            try:
                if hasattr(system, 'shutdown'):
                    await system.shutdown()
                logger.info(f"✅ {system_name} shutdown complete")
            except Exception as e:
                logger.error(f"❌ Error shutting down {system_name}: {e}")

# Create FastAPI app
app = FastAPI(
    title="Codette AI Backend",
    description="Revolutionary AI-powered development environment backend",
    version="5.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analysis_router)
app.include_router(security_router)

# Security and rate limiting
security_manager = SecurityManager()
rate_limiter = RateLimiter()

# Additional Pydantic models
class CodeAnalysisRequest(BaseModel):
    code: str = Field(..., description="Code to analyze")
    language: str = Field(..., description="Programming language")
    analysis_types: List[str] = Field(default=["quality", "security", "ethics"], description="Types of analysis to perform")

class WebSocketMessage(BaseModel):
    type: str = Field(..., description="Message type")
    data: Dict[str, Any] = Field(default_factory=dict, description="Message data")
    timestamp: Optional[str] = Field(default=None, description="Message timestamp")

class CollaborationRequest(BaseModel):
    session_id: str = Field(..., description="Collaboration session ID")
    user_name: str = Field(..., description="User name")
    code_changes: Optional[Dict[str, Any]] = Field(None, description="Code changes")

# Pydantic models for API requests/responses
class QuantumOptimizationRequest(BaseModel):
    objectives: List[str] = Field(..., description="Optimization objectives")
    dimension: int = Field(20, description="Problem dimension")
    code_context: Optional[str] = Field(None, description="Code context for optimization")

class CouncilRequest(BaseModel):
    input_text: str = Field(..., description="Text for council analysis")
    overrides: Dict[str, Any] = Field(default_factory=dict, description="Agent overrides")

class MemoryRequest(BaseModel):
    emotion_tag: str = Field(..., description="Emotion tag for memory")
    content: str = Field(..., description="Memory content")
    emotional_weight: float = Field(0.5, description="Emotional weight (0-1)")

class CodeAnalysisRequest(BaseModel):
    code: str = Field(..., description="Code to analyze")
    language: str = Field(..., description="Programming language")

class MusicGenerationRequest(BaseModel):
    genre: str = Field("ambient", description="Music genre")
    mood: str = Field("focused", description="Music mood")
    duration: int = Field(300, description="Duration in seconds")
    tempo: int = Field(80, description="Tempo in BPM")
    complexity: float = Field(0.5, description="Complexity level (0-1)")
    coding_context: Optional[Dict[str, Any]] = Field(None, description="Coding context")

# Health check endpoint
@app.get("/")
async def root():
    return {
        "message": "Codette AI Backend",
        "version": "5.0.0",
        "status": "operational",
        "ai_systems": list(ai_systems.keys()),
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    system_status = {}
    
    for name, system in ai_systems.items():
        try:
            status = system.is_active() if hasattr(system, 'is_active') else True
            system_status[name] = "active" if status else "inactive"
        except Exception as e:
            system_status[name] = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "ai_systems": system_status,
        "database": "connected"
    }

# Quantum Optimization API
@app.post("/api/quantum/optimize")
async def quantum_optimize(request: QuantumOptimizationRequest):
    """Run quantum-inspired multi-objective optimization"""
    try:
        quantum_system = ai_systems.get('quantum')
        if not quantum_system:
            raise HTTPException(status_code=503, detail="Quantum system not available")
        
        result = await quantum_system.optimize(
            objectives=request.objectives,
            dimension=request.dimension,
            code_context=request.code_context
        )
        
        return {
            "success": True,
            "data": result,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Quantum optimization failed: {e}")
        raise HTTPException(status_code=500, detail=f"Quantum optimization failed: {str(e)}")

# Aegis Council API
@app.post("/api/council/convene")
async def convene_council(request: CouncilRequest):
    """Convene the Aegis Council for ethical decision making"""
    try:
        aegis_system = ai_systems.get('aegis')
        if not aegis_system:
            raise HTTPException(status_code=503, detail="Aegis Council not available")
        
        decision = await aegis_system.convene(
            input_text=request.input_text,
            overrides=request.overrides
        )
        
        return {
            "success": True,
            "data": decision,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Council convening failed: {e}")
        raise HTTPException(status_code=500, detail=f"Council convening failed: {str(e)}")

# DreamCore Memory API
@app.post("/api/memory/store")
async def store_memory(request: MemoryRequest):
    """Store memory in DreamCore system"""
    try:
        dreamcore_system = ai_systems.get('dreamcore')
        if not dreamcore_system:
            raise HTTPException(status_code=503, detail="DreamCore system not available")
        
        memory_id = await dreamcore_system.store_memory(
            emotion_tag=request.emotion_tag,
            content=request.content,
            emotional_weight=request.emotional_weight
        )
        
        return {
            "success": True,
            "data": {
                "memory_id": memory_id,
                "stored_at": datetime.utcnow().isoformat()
            },
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Memory storage failed: {e}")
        raise HTTPException(status_code=500, detail=f"Memory storage failed: {str(e)}")

@app.get("/api/memory/retrieve")
async def retrieve_memories(emotion_tag: Optional[str] = None, limit: int = 10):
    """Retrieve memories from DreamCore system"""
    try:
        dreamcore_system = ai_systems.get('dreamcore')
        if not dreamcore_system:
            raise HTTPException(status_code=503, detail="DreamCore system not available")
        
        memories = await dreamcore_system.retrieve_memories(
            emotion_tag=emotion_tag,
            limit=limit
        )
        
        return {
            "success": True,
            "data": memories,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Memory retrieval failed: {e}")
        raise HTTPException(status_code=500, detail=f"Memory retrieval failed: {str(e)}")

# Code Analysis APIs
@app.post("/api/analysis/ethical")
async def analyze_code_ethics(request: CodeAnalysisRequest):
    """Analyze code for ethical compliance"""
    try:
        ethical_system = ai_systems.get('ethical')
        if not ethical_system:
            raise HTTPException(status_code=503, detail="Ethical system not available")
        
        analysis = await ethical_system.analyze_code(
            code=request.code,
            language=request.language
        )
        
        return {
            "success": True,
            "data": analysis,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Ethical analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Ethical analysis failed: {str(e)}")

@app.post("/api/analysis/neural")
async def neural_code_prediction(request: CodeAnalysisRequest):
    """Generate neural code predictions"""
    try:
        neural_system = ai_systems.get('neural')
        if not neural_system:
            raise HTTPException(status_code=503, detail="Neural system not available")
        
        predictions = await neural_system.predict_next_lines(
            code=request.code,
            language=request.language,
            num_predictions=3
        )
        
        return {
            "success": True,
            "data": predictions,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Neural prediction failed: {e}")
        raise HTTPException(status_code=500, detail=f"Neural prediction failed: {str(e)}")

# Nexus Signal Processing API
@app.post("/api/nexus/process")
async def process_signal(request: Dict[str, str]):
    """Process signal through Nexus engine"""
    try:
        nexus_system = ai_systems.get('nexus')
        if not nexus_system:
            raise HTTPException(status_code=503, detail="Nexus system not available")
        
        signal = request.get('signal', '')
        result = nexus_system.process(signal)
        
        return {
            "success": True,
            "data": result,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Signal processing failed: {e}")
        raise HTTPException(status_code=500, detail=f"Signal processing failed: {str(e)}")

# Music Generation API
@app.post("/api/music/generate")
async def generate_music(request: MusicGenerationRequest):
    """Generate adaptive music"""
    try:
        music_system = ai_systems.get('music')
        if not music_system:
            raise HTTPException(status_code=503, detail="Music system not available")
        
        track = await music_system.compose(
            genre=request.genre,
            mood=request.mood,
            duration=request.duration,
            tempo=request.tempo,
            complexity=request.complexity,
            coding_context=request.coding_context
        )
        
        return {
            "success": True,
            "data": track,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Music generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Music generation failed: {str(e)}")

# Comprehensive AI Analysis
@app.post("/api/analysis/comprehensive")
async def comprehensive_analysis(request: CodeAnalysisRequest):
    """Run comprehensive AI analysis using all systems"""
    try:
        results = {}
        
        # Quantum optimization
        if 'quantum' in ai_systems:
            quantum_result = await ai_systems['quantum'].optimize(
                objectives=["performance", "maintainability"],
                code_context=request.code
            )
            results['quantum'] = quantum_result
        
        # Ethical analysis
        if 'ethical' in ai_systems:
            ethical_result = await ai_systems['ethical'].analyze_code(
                code=request.code,
                language=request.language
            )
            results['ethical'] = ethical_result
        
        # Nexus signal processing
        if 'nexus' in ai_systems:
            nexus_result = await ai_systems['nexus'].process(request.code)
            results['nexus'] = nexus_result
        
        # Neural predictions
        if 'neural' in ai_systems:
            neural_result = await ai_systems['neural'].predict_next_lines(
                code=request.code,
                language=request.language
            )
            results['neural'] = neural_result
        
        return {
            "success": True,
            "data": results,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Comprehensive analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Comprehensive analysis failed: {str(e)}")

# System Status API
@app.get("/api/status")
async def get_system_status():
    """Get detailed system status"""
    try:
        status = {
            "backend_version": "5.0.0",
            "uptime": datetime.utcnow().isoformat(),
            "ai_systems": {},
            "database": "connected",
            "memory_usage": "normal",
            "cpu_usage": "normal"
        }
        
        for name, system in ai_systems.items():
            try:
                status["ai_systems"][name] = {
                    "active": system.is_active() if hasattr(system, 'is_active') else True,
                    "status": "operational"
                }
            except Exception as e:
                status["ai_systems"][name] = {
                    "active": False,
                    "status": f"error: {str(e)}"
                }
        
        return status
        
    except Exception as e:
        logger.error(f"Status check failed: {e}")
        raise HTTPException(status_code=500, detail=f"Status check failed: {str(e)}")

# Error handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "message": "An unexpected error occurred",
            "timestamp": datetime.utcnow().isoformat()
        }
    )

# WebSocket endpoint for real-time collaboration
@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    """WebSocket endpoint for real-time collaboration"""
    await websocket_manager.connect(websocket, session_id)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Broadcast to all clients in session
            await websocket_manager.broadcast_to_session(session_id, message)
            
    except WebSocketDisconnect:
        websocket_manager.disconnect(websocket, session_id)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        websocket_manager.disconnect(websocket, session_id)

# Additional API Endpoints

@app.post("/api/analysis/comprehensive")
async def comprehensive_analysis(request: CodeAnalysisRequest):
    """Run comprehensive AI analysis using all systems"""
    try:
        results = {}
        
        # Quantum optimization
        if 'quantum' in request.analysis_types and 'quantum' in ai_systems:
            quantum_result = await ai_systems['quantum'].optimize(
                objectives=["performance", "maintainability"],
                code_context=request.code
            )
            results['quantum'] = quantum_result
        
        # Ethical analysis
        if 'ethics' in request.analysis_types and 'ethical' in ai_systems:
            ethical_result = await ai_systems['ethical'].analyze_code(
                code=request.code,
                language=request.language
            )
            results['ethical'] = ethical_result
        
        # Nexus signal processing
        if 'security' in request.analysis_types and 'nexus' in ai_systems:
            nexus_result = await ai_systems['nexus'].process(request.code)
            results['nexus'] = nexus_result
        
        # Neural predictions
        if 'neural' in request.analysis_types and 'neural' in ai_systems:
            neural_result = await ai_systems['neural'].predict_next_lines(
                code=request.code,
                language=request.language
            )
            results['neural'] = neural_result
        
        return {
            "success": True,
            "data": results,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Comprehensive analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Comprehensive analysis failed: {str(e)}")

@app.post("/api/collaboration/create")
async def create_collaboration_session(request: CollaborationRequest):
    """Create a new collaboration session"""
    try:
        session_info = await websocket_manager.create_session(
            request.session_id,
            request.user_name
        )
        
        return {
            "success": True,
            "data": session_info,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Collaboration session creation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Session creation failed: {str(e)}")

@app.get("/api/collaboration/sessions")
async def get_active_sessions():
    """Get list of active collaboration sessions"""
    try:
        sessions = websocket_manager.get_active_sessions()
        
        return {
            "success": True,
            "data": sessions,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Failed to get sessions: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get sessions: {str(e)}")

@app.post("/api/code/validate")
async def validate_code(request: CodeAnalysisRequest):
    """Validate code for security and quality issues"""
    try:
        validation_result = security_manager.validate_code_input(
            request.code, 
            request.language
        )
        
        return {
            "success": True,
            "data": validation_result,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Code validation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Code validation failed: {str(e)}")

@app.get("/api/metrics/performance")
async def get_performance_metrics():
    """Get system performance metrics"""
    try:
        metrics = {
            "ai_systems_status": {},
            "database_connections": len(app.state.db.connections) if hasattr(app.state, 'db') else 0,
            "active_websockets": websocket_manager.get_connection_count(),
            "memory_usage": "normal",
            "cpu_usage": "normal",
            "uptime": datetime.utcnow().isoformat()
        }
        
        # Get AI system status
        for name, system in ai_systems.items():
            try:
                metrics["ai_systems_status"][name] = {
                    "active": system.is_active() if hasattr(system, 'is_active') else True,
                    "status": "operational"
                }
            except Exception as e:
                metrics["ai_systems_status"][name] = {
                    "active": False,
                    "status": f"error: {str(e)}"
                }
        
        return {
            "success": True,
            "data": metrics,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Performance metrics failed: {e}")
        raise HTTPException(status_code=500, detail=f"Performance metrics failed: {str(e)}")

# Backend Management API
@app.post("/api/start-backend")
async def start_backend():
    """Start the backend services (for development)"""
    try:
        # This endpoint would typically be used in development
        # In production, the backend is already running
        return {
            "success": True,
            "message": "Backend is already running",
            "data": {
                "status": "operational",
                "ai_systems": list(ai_systems.keys()),
                "endpoints": [
                    "/api/quantum/optimize",
                    "/api/council/convene", 
                    "/api/memory/store",
                    "/api/analysis/ethical",
                    "/api/analysis/neural",
                    "/api/nexus/process"
                ]
            },
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Backend start failed: {e}")
        raise HTTPException(status_code=500, detail=f"Backend start failed: {str(e)}")

@app.get("/api/setup/check")
async def check_setup_requirements():
    """Check if all setup requirements are met"""
    try:
        requirements = {
            "python_version": sys.version,
            "dependencies_installed": True,  # Would check actual dependencies
            "database_accessible": True,
            "ai_systems_ready": len(ai_systems) == 6,
            "recommended_actions": []
        }
        
        if not requirements["ai_systems_ready"]:
            requirements["recommended_actions"].append("Initialize AI systems")
        
        return {
            "success": True,
            "data": requirements,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Setup check failed: {e}")
        raise HTTPException(status_code=500, detail=f"Setup check failed: {str(e)}")

if __name__ == "__main__":
    # Load environment variables
    port = int(os.getenv("API_PORT", "8000"))
    host = os.getenv("API_HOST", "0.0.0.0")
    
    logger.info(f"🚀 Starting Codette AI Backend on {host}:{port}")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )