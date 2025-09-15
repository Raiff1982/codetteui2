"""
Comprehensive Test Suite for Codette Backend
Tests all AI systems and API endpoints
"""

import pytest
import asyncio
import json
from fastapi.testclient import TestClient
from fastapi.websockets import WebSocket
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from main import app
from ai_systems.dreamcore_memory import DreamCoreMemory
from ai_systems.nexus_signal_engine import NexusSignalEngine
from ai_systems.aegis_council import AegisCouncil
from ai_systems.quantum_optimizer import QuantumMultiObjectiveOptimizer
from ai_systems.ethical_governance import EthicalAIGovernance
from ai_systems.neural_predictor import NeuralCodePredictor

# Test client
client = TestClient(app)

class TestCodetteBackend:
    """Comprehensive backend test suite"""
    
    def test_health_endpoint(self):
        """Test health check endpoint"""
        response = client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "ai_systems" in data
        assert "database" in data
    
    def test_root_endpoint(self):
        """Test root endpoint"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Codette AI Backend"
        assert data["version"] == "5.0.0"
        assert data["status"] == "operational"
    
    def test_quantum_optimization(self):
        """Test quantum optimization endpoint"""
        request_data = {
            "objectives": ["performance", "maintainability"],
            "dimension": 10,
            "code_context": "function test() { return 'hello'; }"
        }
        
        response = client.post("/api/quantum/optimize", json=request_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
        assert "pareto_front_size" in data["data"]
        assert "convergence_time" in data["data"]
        assert "optimization_score" in data["data"]
        assert "quantum_metrics" in data["data"]
    
    def test_aegis_council(self):
        """Test Aegis Council endpoint"""
        request_data = {
            "input_text": "We should implement user-friendly error handling",
            "overrides": {
                "VirtueAgent": {"influence": 0.8}
            }
        }
        
        response = client.post("/api/council/convene", json=request_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
        assert "override_decision" in data["data"]
        assert "virtue_profile" in data["data"]
        assert "consensus_strength" in data["data"]
    
    def test_dreamcore_memory(self):
        """Test DreamCore memory endpoints"""
        # Store memory
        store_request = {
            "emotion_tag": "curiosity",
            "content": "Testing DreamCore memory storage",
            "emotional_weight": 0.8
        }
        
        response = client.post("/api/memory/store", json=store_request)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
        assert "memory_id" in data["data"]
        
        # Retrieve memories
        response = client.get("/api/memory/retrieve?emotion_tag=curiosity&limit=5")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
        assert isinstance(data["data"], list)
    
    def test_ethical_analysis(self):
        """Test ethical analysis endpoint"""
        request_data = {
            "code": "function handleUser(data) { return data; }",
            "language": "javascript"
        }
        
        response = client.post("/api/analysis/ethical", json=request_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
        assert "ethical_score" in data["data"]
        assert "virtue_scores" in data["data"]
        assert "security_issues" in data["data"]
    
    def test_neural_prediction(self):
        """Test neural prediction endpoint"""
        request_data = {
            "code": "function calculate",
            "language": "javascript"
        }
        
        response = client.post("/api/analysis/neural", json=request_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
        assert isinstance(data["data"], list)
    
    def test_nexus_processing(self):
        """Test Nexus signal processing"""
        request_data = {
            "signal": "Analyze this code for optimization opportunities"
        }
        
        response = client.post("/api/nexus/process", json=request_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
        assert "signal_hash" in data["data"]
        assert "ethics_score" in data["data"]
    
    def test_comprehensive_analysis(self):
        """Test comprehensive analysis endpoint"""
        request_data = {
            "code": "function example() { return 'test'; }",
            "language": "javascript",
            "analysis_types": ["quantum", "ethics", "security"]
        }
        
        response = client.post("/api/analysis/comprehensive", json=request_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
        assert "quantum" in data["data"] or "ethics" in data["data"]
    
    def test_code_validation(self):
        """Test code validation endpoint"""
        request_data = {
            "code": "console.log('Hello World');",
            "language": "javascript"
        }
        
        response = client.post("/api/code/validate", json=request_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
        assert "valid" in data["data"]
        assert "issues" in data["data"]
    
    def test_performance_metrics(self):
        """Test performance metrics endpoint"""
        response = client.get("/api/metrics/performance")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
        assert "ai_systems_status" in data["data"]
        assert "active_websockets" in data["data"]
    
    def test_collaboration_session(self):
        """Test collaboration session creation"""
        request_data = {
            "session_id": "test-session-123",
            "user_name": "Test User"
        }
        
        response = client.post("/api/collaboration/create", json=request_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
        assert data["data"]["id"] == "test-session-123"
    
    def test_active_sessions(self):
        """Test getting active sessions"""
        response = client.get("/api/collaboration/sessions")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
        assert isinstance(data["data"], list)

class TestAISystems:
    """Test individual AI systems"""
    
    @pytest.mark.asyncio
    async def test_dreamcore_memory(self):
        """Test DreamCore Memory System"""
        dreamcore = DreamCoreMemory(db_path=":memory:")
        await dreamcore.initialize()
        
        # Test memory storage
        memory_id = await dreamcore.store_memory(
            emotion_tag="test",
            content="Test memory content",
            emotional_weight=0.7
        )
        
        assert memory_id is not None
        assert dreamcore.is_active()
        
        # Test memory retrieval
        memories = await dreamcore.retrieve_memories(emotion_tag="test")
        assert len(memories) > 0
        assert memories[0]["emotion_tag"] == "test"
    
    @pytest.mark.asyncio
    async def test_quantum_optimizer(self):
        """Test Quantum Optimizer"""
        optimizer = QuantumMultiObjectiveOptimizer(db_path=":memory:")
        optimizer.initialize()
        
        result = await optimizer.optimize(
            objectives=["performance", "maintainability"],
            dimension=5  # Small dimension for fast testing
        )
        
        assert "pareto_front_size" in result
        assert "convergence_time" in result
        assert "optimization_score" in result
        assert result["pareto_front_size"] > 0
    
    @pytest.mark.asyncio
    async def test_aegis_council(self):
        """Test Aegis Council"""
        council = AegisCouncil(db_path=":memory:")
        await council.initialize()
        
        decision = await council.convene(
            input_text="Test ethical decision making",
            overrides={}
        )
        
        assert "override_decision" in decision
        assert "virtue_profile" in decision
        assert "consensus_strength" in decision
        assert council.is_active()
    
    def test_nexus_signal_engine(self):
        """Test Nexus Signal Engine"""
        nexus = NexusSignalEngine(db_path=":memory:")
        nexus.initialize()
        
        result = nexus.process("Test signal for processing")
        
        assert "signal_hash" in result
        assert "ethics_score" in result
        assert "risk_assessment" in result
        assert "harmonic_analysis" in result
        assert nexus.is_active()
    
    @pytest.mark.asyncio
    async def test_ethical_governance(self):
        """Test Ethical Governance"""
        ethical = EthicalAIGovernance(db_path=":memory:")
        ethical.initialize()
        
        result = await ethical.analyze_code(
            code="function test() { return 'hello'; }",
            language="javascript"
        )
        
        assert "ethical_score" in result
        assert "virtue_scores" in result
        assert "security_issues" in result
        assert ethical.is_active()
    
    @pytest.mark.asyncio
    async def test_neural_predictor(self):
        """Test Neural Predictor"""
        neural = NeuralCodePredictor(db_path=":memory:")
        neural.initialize()
        
        predictions = await neural.predict_next_lines(
            code="function test",
            language="javascript",
            num_predictions=3
        )
        
        assert len(predictions) == 3
        assert all("text" in pred for pred in predictions)
        assert all("confidence" in pred for pred in predictions)
        assert neural.is_active()

# Run tests
if __name__ == "__main__":
    pytest.main([__file__, "-v"])