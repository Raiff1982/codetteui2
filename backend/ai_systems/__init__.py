"""
AI Systems Package for Codette
Comprehensive AI system implementations
"""

from .dreamcore_memory import DreamCoreMemory
from .nexus_signal_engine import NexusSignalEngine
from .aegis_council import AegisCouncil
from .quantum_optimizer import QuantumMultiObjectiveOptimizer
from .ethical_governance import EthicalAIGovernance
from .neural_predictor import NeuralCodePredictor
from .music_generator import AIComposer

__all__ = [
    'DreamCoreMemory',
    'NexusSignalEngine', 
    'AegisCouncil',
    'QuantumMultiObjectiveOptimizer',
    'EthicalAIGovernance',
    'NeuralCodePredictor',
    'AIComposer'
]

# Version information
__version__ = "5.0.0"
__author__ = "Jonathan Harrison, Raiff's Bits"
__email__ = "jonathan@raiffsbits.com"

# AI Systems metadata
AI_SYSTEMS_INFO = {
    "dreamcore": {
        "name": "DreamCore Memory System",
        "description": "Emotional memory anchoring with temporal decay",
        "research_doi": "10.5281/zenodo.16388758",
        "version": "1.0.0"
    },
    "nexus": {
        "name": "Nexus Signal Engine", 
        "description": "Explainable AI and security auditing framework",
        "research_doi": "10.57967/hf/6059",
        "version": "1.0.0"
    },
    "aegis": {
        "name": "Aegis Council",
        "description": "Multi-agent ethical decision making system",
        "research_status": "Patent pending",
        "version": "1.0.0"
    },
    "quantum": {
        "name": "Quantum Multi-Objective Optimizer",
        "description": "Quantum-inspired optimization algorithms",
        "research_status": "Patent pending", 
        "version": "1.0.0"
    },
    "ethical": {
        "name": "Ethical AI Governance",
        "description": "Virtue-driven AI decision making",
        "research_status": "Research in progress",
        "version": "1.0.0"
    },
    "neural": {
        "name": "Neural Code Predictor",
        "description": "AI-powered code completion and prediction",
        "research_status": "Research in progress",
        "version": "1.0.0"
    },
    "music": {
        "name": "AI Music Composer",
        "description": "Adaptive music generation for coding",
        "research_status": "Research in progress", 
        "version": "1.0.0"
    }
}

def get_system_info(system_name: str) -> Dict[str, Any]:
    """Get information about a specific AI system"""
    return AI_SYSTEMS_INFO.get(system_name, {})

def get_all_systems_info() -> Dict[str, Any]:
    """Get information about all AI systems"""
    return AI_SYSTEMS_INFO