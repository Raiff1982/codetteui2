"""
Individual AI System Tests
Comprehensive testing for each AI system component
"""

import pytest
import asyncio
import tempfile
import os
from datetime import datetime

from ai_systems.dreamcore_memory import DreamCoreMemory, MemoryAnchor
from ai_systems.nexus_signal_engine import NexusSignalEngine
from ai_systems.aegis_council import AegisCouncil
from ai_systems.quantum_optimizer import QuantumMultiObjectiveOptimizer
from ai_systems.ethical_governance import EthicalAIGovernance
from ai_systems.neural_predictor import NeuralCodePredictor

class TestDreamCoreMemory:
    """Test DreamCore Memory System"""
    
    @pytest.mark.asyncio
    async def test_memory_storage_and_retrieval(self, temp_db):
        """Test memory storage and retrieval"""
        dreamcore = DreamCoreMemory(db_path=temp_db)
        await dreamcore.initialize()
        
        # Store memory
        memory_id = await dreamcore.store_memory(
            emotion_tag="curiosity",
            content="Learning about quantum computing",
            emotional_weight=0.8
        )
        
        assert memory_id is not None
        assert len(memory_id) == 16  # Expected hash length
        
        # Retrieve memories
        memories = await dreamcore.retrieve_memories(emotion_tag="curiosity")
        assert len(memories) == 1
        assert memories[0]["emotion_tag"] == "curiosity"
        assert memories[0]["content"] == "Learning about quantum computing"
        assert memories[0]["emotional_weight"] == 0.8
    
    @pytest.mark.asyncio
    async def test_emotional_state(self, temp_db):
        """Test emotional state calculation"""
        dreamcore = DreamCoreMemory(db_path=temp_db)
        await dreamcore.initialize()
        
        # Store multiple memories with different emotions
        await dreamcore.store_memory("joy", "Successful code completion", 0.9)
        await dreamcore.store_memory("curiosity", "Learning new concepts", 0.7)
        await dreamcore.store_memory("joy", "Another success", 0.8)
        
        emotional_state = await dreamcore.get_emotional_state()
        
        assert "joy" in emotional_state
        assert "curiosity" in emotional_state
        assert emotional_state["joy"] > emotional_state["curiosity"]  # More joy memories

class TestNexusSignalEngine:
    """Test Nexus Signal Engine"""
    
    @pytest.mark.asyncio
    async def test_signal_processing(self, temp_db):
        """Test basic signal processing"""
        nexus = NexusSignalEngine(db_path=temp_db)
        await nexus.initialize()
        
        result = await nexus.process("Test signal for processing")
        
        assert "signal_hash" in result
        assert "ethics_score" in result
        assert "risk_assessment" in result
        assert "harmonic_analysis" in result
        assert "perspectives" in result
        
        # Check agent perspectives
        assert "Colleen" in result["perspectives"]
        assert "Luke" in result["perspectives"]
        assert "Kellyanne" in result["perspectives"]
        assert nexus.is_active()
    
    @pytest.mark.asyncio
    async def test_risk_assessment(self, temp_db):
        """Test risk assessment functionality"""
        nexus = NexusSignalEngine(db_path=temp_db)
        await nexus.initialize()
        
        # Test high-risk signal
        risky_signal = "eval(userInput); document.innerHTML = data;"
        result = await nexus.process(risky_signal)
        
        risk_assessment = result["risk_assessment"]
        assert risk_assessment["risk_level"] == "high"
        assert len(risk_assessment["detected_risks"]) > 0

class TestAegisCouncil:
    """Test Aegis Council"""
    
    @pytest.mark.asyncio
    async def test_council_decision(self, temp_db):
        """Test council decision making"""
        council = AegisCouncil(db_path=temp_db)
        await council.initialize()
        
        decision = await council.convene(
            input_text="Implement accessible user interface with proper ARIA labels",
            overrides={"VirtueAgent": {"influence": 0.9}}
        )
        
        assert decision["override_decision"] in ["strongly_approve", "approve", "review_required", "reject"]
        assert "virtue_profile" in decision
        assert all(virtue in decision["virtue_profile"] for virtue in ["compassion", "integrity", "wisdom", "courage"])
        assert 0 <= decision["consensus_strength"] <= 1
    
    @pytest.mark.asyncio
    async def test_virtue_analysis(self, temp_db):
        """Test virtue-based analysis"""
        council = AegisCouncil(db_path=temp_db)
        await council.initialize()
        
        # Test high-virtue input
        virtuous_input = "Create compassionate error handling with helpful user guidance and accessible design"
        decision = await council.convene(virtuous_input)
        
        virtue_profile = decision["virtue_profile"]
        assert virtue_profile["compassion"] > 0.5  # Should detect compassion
        assert virtue_profile["wisdom"] > 0.5      # Should detect wisdom

class TestQuantumOptimizer:
    """Test Quantum Multi-Objective Optimizer"""
    
    @pytest.mark.asyncio
    async def test_optimization(self, temp_db):
        """Test quantum optimization"""
        optimizer = QuantumMultiObjectiveOptimizer(db_path=temp_db)
        optimizer.initialize()
        
        result = await optimizer.optimize(
            objectives=["performance", "maintainability"],
            dimension=5,  # Small for fast testing
            code_context="function test() { return 'hello'; }"
        )
        
        assert result["pareto_front_size"] > 0
        assert result["convergence_time"] > 0
        assert 0 <= result["optimization_score"] <= 1
        assert "quantum_metrics" in result
        
        quantum_metrics = result["quantum_metrics"]
        assert "entanglement_factor" in quantum_metrics
        assert "tunneling_events" in quantum_metrics
        assert "superposition_states" in quantum_metrics

class TestEthicalGovernance:
    """Test Ethical AI Governance"""
    
    @pytest.mark.asyncio
    async def test_code_analysis(self, temp_db):
        """Test ethical code analysis"""
        ethical = EthicalAIGovernance(db_path=":memory:")
        await ethical.initialize()
        
        result = await ethical.analyze_code(
            code="function test() { return 'hello'; }",
            language="javascript"
        )
        
        assert result["ethical_score"] > 0.5
        assert "virtue_scores" in result
        assert "security_issues" in result
        assert "accessibility_score" in result
        assert result["compliance_status"] in ["compliant", "needs_review"]
    
    @pytest.mark.asyncio
    async def test_security_detection(self, temp_db):
        """Test security issue detection"""
        ethical = EthicalAIGovernance(db_path=temp_db)
        ethical.initialize()
        
        # Test insecure code
        insecure_code = """
        function dangerousFunction(userInput) {
            eval(userInput);
            document.innerHTML = userInput;
            return userInput;
        }
        """
        
        result = await ethical.analyze_code(insecure_code, "javascript")
        
        assert len(result["security_issues"]) > 0
        assert any(issue["type"] == "code_injection" for issue in result["security_issues"])
        assert any(issue["type"] == "xss_vulnerability" for issue in result["security_issues"])

class TestNeuralPredictor:
    """Test Neural Code Predictor"""
    
    @pytest.mark.asyncio
    async def test_code_prediction(self, temp_db):
        """Test code prediction functionality"""
        neural = NeuralCodePredictor(db_path=":memory:")
        await neural.initialize()
        
        predictions = await neural.predict_next_lines(
            code="function test",
            language="javascript",
            num_predictions=3
        )
        
        assert len(predictions) == 3
        for prediction in predictions:
            assert "text" in prediction
            assert "confidence" in prediction
            assert "type" in prediction
            assert 0 <= prediction["confidence"] <= 1
        assert neural.is_active()
    
    @pytest.mark.asyncio
    async def test_user_profile_building(self, temp_db):
        """Test user profile building"""
        neural = NeuralCodePredictor(db_path=temp_db)
        neural.initialize()
        
        # Simulate coding history
        coding_history = [
            "const users = await fetch('/api/users');",
            "function processData(data) { return data.map(item => item.id); }",
            "class UserManager { constructor() { this.users = []; } }"
        ]
        
        profile = neural.buildDeveloperProfile(coding_history)
        
        assert profile.coding_style in ["functional", "object-oriented", "procedural", "mixed"]
        assert 0 <= profile.skill_level <= 1
        assert 0 <= profile.productivity_score <= 1
        assert 0 <= profile.creativity_index <= 1
        assert isinstance(profile.focus_areas, list)
        assert isinstance(profile.preferred_patterns, list)

class TestVirtueNormalization:
    """Test virtue score normalization fixes"""
    
    @pytest.mark.asyncio
    async def test_weighted_virtue_normalization(self, temp_db):
        """Test that virtue scores are properly weighted by specialization"""
        council = AegisCouncil(db_path=temp_db)
        await council.initialize()
        
        # Test with input that should trigger different agent specializations
        decision = await council.convene(
            input_text="Implement secure user authentication with accessibility features",
            overrides={}
        )
        
        virtue_profile = decision["virtue_profile"]
        
        # Integrity should be high due to security context
        assert virtue_profile["integrity"] > 0.5
        # Compassion should be high due to accessibility context
        assert virtue_profile["compassion"] > 0.5
        
        # Verify all virtues are properly normalized (0-1 range)
        for virtue, score in virtue_profile.items():
            assert 0 <= score <= 1, f"Virtue {virtue} score {score} out of range"

class TestConsensusBreaking:
    """Test consensus tie-breaking logic"""
    
    @pytest.mark.asyncio
    async def test_consensus_tie_breaking(self, temp_db):
        """Test that consensus ties are broken by reliability"""
        council = AegisCouncil(db_path=temp_db)
        await council.initialize()
        
        # Create a scenario that might cause ties
        decision = await council.convene(
            input_text="Neutral statement that could go either way",
            overrides={}
        )
        
        # Should have a definitive decision, not random
        assert decision["override_decision"] in ["strongly_approve", "approve", "review_required", "reject"]
        assert 0 <= decision["consensus_strength"] <= 1

class TestDataSafety:
    """Test PII redaction and data safety"""
    
    @pytest.mark.asyncio
    async def test_pii_redaction(self, temp_db):
        """Test that PII is redacted before storage"""
        dreamcore = DreamCoreMemory(db_path=temp_db)
        await dreamcore.initialize()
        
        # Store memory with PII
        pii_content = "Contact john.doe@example.com or call 555-123-4567 for API key abc123def456ghi789"
        memory_id = await dreamcore.store_memory(
            emotion_tag="test",
            content=pii_content,
            emotional_weight=0.5
        )
        
        # Retrieve and verify redaction
        memories = await dreamcore.retrieve_memories(emotion_tag="test")
        stored_content = memories[0]["content"]
        
        assert "[EMAIL_REDACTED]" in stored_content
        assert "[PHONE_REDACTED]" in stored_content
        assert "[TOKEN_REDACTED]" in stored_content
        assert "john.doe@example.com" not in stored_content
        assert "555-123-4567" not in stored_content

# Integration tests
class TestIntegration:
    """Integration tests for multiple AI systems"""
    
    @pytest.mark.asyncio
    async def test_full_ai_pipeline(self, temp_db, sample_code):
        """Test complete AI analysis pipeline"""
        # Initialize all systems
        dreamcore = DreamCoreMemory(db_path=f"{temp_db}_dreamcore")
        nexus = NexusSignalEngine(db_path=f"{temp_db}_nexus")
        council = AegisCouncil(db_path=f"{temp_db}_aegis")
        quantum = QuantumMultiObjectiveOptimizer(db_path=f"{temp_db}_quantum")
        ethical = EthicalAIGovernance(db_path=f"{temp_db}_ethical")
        neural = NeuralCodePredictor(db_path=f"{temp_db}_neural")
        
        await dreamcore.initialize()
        nexus.initialize()
        await council.initialize()
        quantum.initialize()
        ethical.initialize()
        neural.initialize()
        
        # Run full analysis pipeline
        results = {}
        
        # 1. Nexus signal processing
        nexus_result = nexus.process(sample_code)
        results["nexus"] = nexus_result
        
        # 2. Ethical analysis
        ethical_result = await ethical.analyze_code(sample_code, "javascript")
        results["ethical"] = ethical_result
        
        # 3. Quantum optimization
        quantum_result = await quantum.optimize(["performance", "maintainability"], dimension=5)
        results["quantum"] = quantum_result
        
        # 4. Council decision
        council_result = await council.convene("Analyze this code for best practices")
        results["council"] = council_result
        
        # 5. Neural prediction
        neural_result = await neural.predict_next_lines(sample_code, "javascript")
        results["neural"] = neural_result
        
        # 6. Store memory
        memory_id = await dreamcore.store_memory(
            "analysis",
            f"Completed full AI analysis with {len(results)} systems",
            0.8
        )
        results["memory"] = {"memory_id": memory_id}
        
        # Verify all systems produced results
        assert all(key in results for key in ["nexus", "ethical", "quantum", "council", "neural", "memory"])
        assert nexus_result["ethics_score"] >= 0
        assert ethical_result["ethical_score"] >= 0
        assert quantum_result["pareto_front_size"] > 0
        assert council_result["consensus_strength"] >= 0
        assert len(neural_result) > 0
        assert memory_id is not None
        
        logger.info("✅ Full AI pipeline test completed successfully")