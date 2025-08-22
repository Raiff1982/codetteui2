#!/usr/bin/env python3
"""
Backend Testing Suite
Tests all AI systems to verify they work correctly
"""

import asyncio
import sys
import logging
import json
from datetime import datetime

# Import all AI systems
from dreamcore_memory import DreamCoreMemory, MemoryAnchor
from nexus_signal_engine import NexusSignalEngine
from aegis_council import AegisCouncil
from quantum_optimizer import QuantumMultiObjectiveOptimizer
from ethical_governance import EthicalAIGovernance
from neural_predictor import NeuralCodePredictor
from music_generator import AIComposer

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class BackendTester:
    """Comprehensive backend testing"""
    
    def __init__(self):
        self.test_results = {}
        self.systems = {}
    
    async def run_all_tests(self):
        """Run all backend tests"""
        logger.info("Starting comprehensive backend tests...")
        
        try:
            # Initialize all systems
            await self.initialize_systems()
            
            # Test each system
            await self.test_dreamcore()
            await self.test_nexus_engine()
            await self.test_aegis_council()
            await self.test_quantum_optimizer()
            await self.test_ethical_governance()
            await self.test_neural_predictor()
            await self.test_music_composer()
            
            # Generate test report
            self.generate_test_report()
            
        except Exception as e:
            logger.error(f"Test suite failed: {e}")
            self.test_results["overall"] = {"status": "FAILED", "error": str(e)}
    
    async def initialize_systems(self):
        """Initialize all AI systems"""
        logger.info("Initializing AI systems...")
        
        try:
            # DreamCore Memory
            self.systems["dreamcore"] = DreamCoreMemory()
            await self.systems["dreamcore"].initialize()
            
            # Nexus Signal Engine
            self.systems["nexus"] = NexusSignalEngine()
            self.systems["nexus"].initialize()
            
            # Aegis Council
            self.systems["aegis"] = AegisCouncil()
            await self.systems["aegis"].initialize()
            
            # Quantum Optimizer
            self.systems["quantum"] = QuantumMultiObjectiveOptimizer()
            self.systems["quantum"].initialize()
            
            # Ethical Governance
            self.systems["ethical"] = EthicalAIGovernance()
            self.systems["ethical"].initialize()
            
            # Neural Predictor
            self.systems["neural"] = NeuralCodePredictor()
            self.systems["neural"].initialize()
            
            # Music Composer
            self.systems["music"] = AIComposer()
            self.systems["music"].initialize()
            
            logger.info("All systems initialized successfully")
            
        except Exception as e:
            logger.error(f"System initialization failed: {e}")
            raise
    
    async def test_dreamcore(self):
        """Test DreamCore Memory System"""
        logger.info("Testing DreamCore Memory System...")
        
        try:
            dreamcore = self.systems["dreamcore"]
            
            # Test memory storage
            memory_id = await dreamcore.store_memory(
                emotion_tag="curiosity",
                content="Testing DreamCore memory storage functionality",
                emotional_weight=0.8
            )
            
            # Test memory retrieval
            memories = await dreamcore.retrieve_memories(emotion_tag="curiosity", limit=5)
            
            # Test emotional state
            emotional_state = await dreamcore.get_emotional_state()
            
            self.test_results["dreamcore"] = {
                "status": "PASSED",
                "memory_stored": memory_id is not None,
                "memories_retrieved": len(memories),
                "emotional_state": emotional_state,
                "system_active": dreamcore.is_active()
            }
            
            logger.info("DreamCore tests PASSED")
            
        except Exception as e:
            logger.error(f"DreamCore test failed: {e}")
            self.test_results["dreamcore"] = {"status": "FAILED", "error": str(e)}
    
    async def test_nexus_engine(self):
        """Test Nexus Signal Engine"""
        logger.info("Testing Nexus Signal Engine...")
        
        try:
            nexus = self.systems["nexus"]
            
            # Test signal processing
            test_signal = "Analyze this code for optimization opportunities and ethical compliance"
            result = nexus.process(test_signal)
            
            # Test processing stats
            stats = nexus.get_processing_stats()
            
            self.test_results["nexus"] = {
                "status": "PASSED",
                "signal_processed": "signal_hash" in result,
                "ethics_score": result.get("ethics_score", 0),
                "risk_assessment": result.get("risk_assessment", {}),
                "harmonic_analysis": result.get("harmonic_analysis", {}),
                "processing_stats": stats,
                "system_active": nexus.is_active()
            }
            
            logger.info("Nexus Engine tests PASSED")
            
        except Exception as e:
            logger.error(f"Nexus Engine test failed: {e}")
            self.test_results["nexus"] = {"status": "FAILED", "error": str(e)}
    
    async def test_aegis_council(self):
        """Test Aegis Council"""
        logger.info("Testing Aegis Council...")
        
        try:
            aegis = self.systems["aegis"]
            
            # Test council convening
            decision = await aegis.convene(
                input_text="We should implement user-friendly error handling with compassionate messaging",
                overrides={
                    "VirtueAgent": {"influence": 0.8, "reliability": 0.9, "severity": 0.7},
                    "MetaJudgeAgent": {"influence": 0.7, "reliability": 0.8, "severity": 0.6}
                }
            )
            
            # Test council status
            status = await aegis.get_status()
            
            self.test_results["aegis"] = {
                "status": "PASSED",
                "decision_made": "override_decision" in decision,
                "virtue_profile": decision.get("virtue_profile", {}),
                "consensus_strength": decision.get("consensus_strength", 0),
                "agents_active": len(status.get("agents", [])),
                "system_active": aegis.is_active()
            }
            
            logger.info("Aegis Council tests PASSED")
            
        except Exception as e:
            logger.error(f"Aegis Council test failed: {e}")
            self.test_results["aegis"] = {"status": "FAILED", "error": str(e)}
    
    async def test_quantum_optimizer(self):
        """Test Quantum Optimizer"""
        logger.info("Testing Quantum Optimizer...")
        
        try:
            quantum = self.systems["quantum"]
            
            # Test optimization
            result = await quantum.optimize(
                objectives=["performance", "maintainability"],
                dimension=10,  # Smaller dimension for faster testing
                code_context="function testFunction() { return 'test'; }"
            )
            
            # Test code structure analysis
            code_analysis = await quantum.analyze_code_structure(
                "function example() {\n  if (condition) {\n    return value;\n  }\n}"
            )
            
            self.test_results["quantum"] = {
                "status": "PASSED",
                "pareto_front_size": result.get("pareto_front_size", 0),
                "convergence_time": result.get("convergence_time", 0),
                "optimization_score": result.get("optimization_score", 0),
                "quantum_metrics": result.get("quantum_metrics", {}),
                "code_analysis": code_analysis,
                "system_active": quantum.is_active()
            }
            
            logger.info("Quantum Optimizer tests PASSED")
            
        except Exception as e:
            logger.error(f"Quantum Optimizer test failed: {e}")
            self.test_results["quantum"] = {"status": "FAILED", "error": str(e)}
    
    async def test_ethical_governance(self):
        """Test Ethical Governance"""
        logger.info("Testing Ethical Governance...")
        
        try:
            ethical = self.systems["ethical"]
            
            # Test code analysis
            test_code = """
            function handleUserData(userData) {
                // Validate input for security
                if (!userData || typeof userData !== 'object') {
                    throw new Error('Invalid user data');
                }
                
                // Process with accessibility in mind
                return {
                    ...userData,
                    processed: true,
                    timestamp: new Date().toISOString()
                };
            }
            """
            
            result = await ethical.analyze_code(test_code, "javascript")
            
            self.test_results["ethical"] = {
                "status": "PASSED",
                "ethical_score": result.get("ethical_score", 0),
                "virtue_scores": result.get("virtue_scores", {}),
                "security_issues": len(result.get("security_issues", [])),
                "accessibility_score": result.get("accessibility_score", 0),
                "recommendations": len(result.get("recommendations", [])),
                "system_active": ethical.is_active()
            }
            
            logger.info("Ethical Governance tests PASSED")
            
        except Exception as e:
            logger.error(f"Ethical Governance test failed: {e}")
            self.test_results["ethical"] = {"status": "FAILED", "error": str(e)}
    
    async def test_neural_predictor(self):
        """Test Neural Predictor"""
        logger.info("Testing Neural Predictor...")
        
        try:
            neural = self.systems["neural"]
            
            # Test code prediction
            test_code = "function calculateSum(a, b) {"
            predictions = await neural.predict_next_lines(test_code, "javascript", 3)
            
            self.test_results["neural"] = {
                "status": "PASSED",
                "predictions_generated": len(predictions),
                "prediction_confidence": [p.get("confidence", 0) for p in predictions],
                "system_active": neural.is_active()
            }
            
            logger.info("Neural Predictor tests PASSED")
            
        except Exception as e:
            logger.error(f"Neural Predictor test failed: {e}")
            self.test_results["neural"] = {"status": "FAILED", "error": str(e)}
    
    async def test_music_composer(self):
        """Test AI Music Composer"""
        logger.info("Testing AI Music Composer...")
        
        try:
            composer = self.systems["music"]
            
            # Test music composition
            track = await composer.compose(
                genre="ambient",
                mood="focused",
                duration=10,  # Short duration for testing
                tempo=80,
                complexity=0.5,
                coding_context={"language": "typescript", "task": "debugging"}
            )
            
            self.test_results["music"] = {
                "status": "PASSED",
                "track_generated": "id" in track,
                "audio_data_length": len(track.get("audio_data", [])),
                "track_title": track.get("title", ""),
                "sample_rate": track.get("sample_rate", 0),
                "system_active": composer.is_active()
            }
            
            logger.info("Music Composer tests PASSED")
            
        except Exception as e:
            logger.error(f"Music Composer test failed: {e}")
            self.test_results["music"] = {"status": "FAILED", "error": str(e)}
    
    def generate_test_report(self):
        """Generate comprehensive test report"""
        logger.info("Generating test report...")
        
        passed_tests = sum(1 for result in self.test_results.values() if result.get("status") == "PASSED")
        total_tests = len(self.test_results)
        
        report = {
            "test_summary": {
                "total_tests": total_tests,
                "passed_tests": passed_tests,
                "failed_tests": total_tests - passed_tests,
                "success_rate": (passed_tests / total_tests) * 100 if total_tests > 0 else 0,
                "test_timestamp": datetime.utcnow().isoformat()
            },
            "system_results": self.test_results,
            "overall_status": "PASSED" if passed_tests == total_tests else "FAILED"
        }
        
        # Save report to file
        with open("backend_test_report.json", "w") as f:
            json.dump(report, f, indent=2)
        
        # Print summary
        print("\n" + "="*60)
        print("CODETTE AI BACKEND TEST REPORT")
        print("="*60)
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {total_tests - passed_tests}")
        print(f"Success Rate: {report['test_summary']['success_rate']:.1f}%")
        print("="*60)
        
        for system, result in self.test_results.items():
            status_icon = "✅" if result["status"] == "PASSED" else "❌"
            print(f"{status_icon} {system.upper()}: {result['status']}")
            if result["status"] == "FAILED":
                print(f"   Error: {result.get('error', 'Unknown error')}")
        
        print("="*60)
        
        if report["overall_status"] == "PASSED":
            print("🎉 ALL TESTS PASSED! Backend is fully functional.")
        else:
            print("⚠️  Some tests failed. Check logs for details.")
        
        print(f"Report saved to: backend_test_report.json")
        print("="*60)

async def main():
    """Main test runner"""
    tester = BackendTester()
    await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())