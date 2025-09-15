"""
Aegis Council - Production Implementation
Multi-agent AI system for ethical decision making with virtue-based reasoning
"""

import asyncio
import json
import logging
import numpy as np
import sqlite3
import os
from datetime import datetime
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, asdict

logger = logging.getLogger(__name__)

@dataclass
class Agent:
    """Individual agent in the Aegis Council"""
    name: str
    role: str
    influence: float
    reliability: float
    severity: float
    specialization: str
    virtue_weights: Dict[str, float]

@dataclass
class CouncilDecision:
    """Decision made by the Aegis Council"""
    override_decision: str
    scores: List[Tuple[str, float]]
    virtue_profile: Dict[str, float]
    temporal_forecast: str
    consensus_strength: float
    ethical_compliance: bool
    reasoning: str
    dissenting_opinions: List[str]

class AegisCouncil:
    """
    Multi-agent AI system for ethical decision making
    
    Implements virtue-based reasoning with multiple specialized agents
    """
    
    def __init__(self, db_path: str = "backend/data/aegis.db"):
        self.db_path = db_path
        self.agents: Dict[str, Agent] = {}
        self.decision_history: List[Dict[str, Any]] = []
        self.is_initialized = False
        self.conn: Optional[sqlite3.Connection] = None
        
        # Virtue definitions
        self.virtues = {
            "compassion": "Care for user welfare and emotional impact",
            "integrity": "Honesty, security, and reliability in code",
            "wisdom": "Deep understanding and thoughtful implementation", 
            "courage": "Tackling difficult problems and ethical challenges"
        }
        
        # Ensure data directory exists
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
    
    async def initialize(self):
        """Initialize the Aegis Council"""
        try:
            logger.info("Initializing Aegis Council...")
            
            # Create database connection
            self.conn = sqlite3.connect(self.db_path, check_same_thread=False)
            await self._create_tables()
            
            # Initialize agents
            self._initialize_agents()
            
            # Load decision history
            await self._load_decision_history()
            
            self.is_initialized = True
            logger.info("✅ Aegis Council initialized successfully")
            
        except Exception as e:
            logger.error(f"❌ Aegis Council initialization failed: {e}")
            raise
    
    async def _create_tables(self):
        """Create database tables"""
        cursor = self.conn.cursor()
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS council_decisions (
                id TEXT PRIMARY KEY,
                input_text TEXT NOT NULL,
                decision_data TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                consensus_strength REAL NOT NULL,
                ethical_compliance INTEGER NOT NULL
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS agent_votes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                decision_id TEXT NOT NULL,
                agent_name TEXT NOT NULL,
                vote_data TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                FOREIGN KEY (decision_id) REFERENCES council_decisions (id)
            )
        """)
        
        self.conn.commit()
        logger.info("📊 Aegis Council database tables created")
    
    def _initialize_agents(self):
        """Initialize the council agents"""
        self.agents = {
            "VirtueAgent": Agent(
                name="VirtueAgent",
                role="Virtue Ethics Specialist",
                influence=0.9,
                reliability=0.95,
                severity=0.8,
                specialization="virtue_ethics",
                virtue_weights={
                    "compassion": 0.3,
                    "integrity": 0.25,
                    "wisdom": 0.25,
                    "courage": 0.2
                }
            ),
            "SecurityAgent": Agent(
                name="SecurityAgent", 
                role="Security and Safety Specialist",
                influence=0.85,
                reliability=0.9,
                severity=0.9,
                specialization="security",
                virtue_weights={
                    "integrity": 0.4,
                    "courage": 0.3,
                    "wisdom": 0.2,
                    "compassion": 0.1
                }
            ),
            "AccessibilityAgent": Agent(
                name="AccessibilityAgent",
                role="Accessibility and Inclusion Specialist", 
                influence=0.8,
                reliability=0.88,
                severity=0.7,
                specialization="accessibility",
                virtue_weights={
                    "compassion": 0.4,
                    "wisdom": 0.3,
                    "integrity": 0.2,
                    "courage": 0.1
                }
            ),
            "PerformanceAgent": Agent(
                name="PerformanceAgent",
                role="Performance and Efficiency Specialist",
                influence=0.75,
                reliability=0.85,
                severity=0.6,
                specialization="performance",
                virtue_weights={
                    "wisdom": 0.4,
                    "integrity": 0.3,
                    "courage": 0.2,
                    "compassion": 0.1
                }
            ),
            "MetaJudgeAgent": Agent(
                name="MetaJudgeAgent",
                role="Meta-reasoning and Final Arbitration",
                influence=0.95,
                reliability=0.92,
                severity=0.85,
                specialization="meta_reasoning",
                virtue_weights={
                    "wisdom": 0.35,
                    "integrity": 0.25,
                    "compassion": 0.25,
                    "courage": 0.15
                }
            )
        }
        
        logger.info(f"👥 Initialized {len(self.agents)} council agents")
    
    async def convene(
        self, 
        input_text: str, 
        overrides: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Convene the Aegis Council for ethical decision making
        """
        try:
            logger.info(f"🏛️ Convening Aegis Council for: {input_text[:50]}...")
            
            # Apply agent overrides if provided
            if overrides:
                self._apply_agent_overrides(overrides)
            
            # Collect agent votes
            agent_votes = {}
            virtue_scores = {virtue: 0.0 for virtue in self.virtues.keys()}
            
            for agent_name, agent in self.agents.items():
                vote = await self._get_agent_vote(agent, input_text)
                agent_votes[agent_name] = vote
                
                # Accumulate virtue scores weighted by agent influence
                for virtue, score in vote["virtue_assessment"].items():
                    if virtue in virtue_scores:
                        weight = agent.virtue_weights.get(virtue, 0.25) * agent.influence
                        virtue_scores[virtue] += score * weight
            
            # Normalize virtue scores
            total_influence = sum(agent.influence for agent in self.agents.values())
            for virtue in virtue_scores:
                virtue_scores[virtue] /= total_influence
            
            # Calculate consensus strength
            consensus_strength = self._calculate_consensus(agent_votes)
            
            # Determine final decision
            decision_result = self._make_final_decision(agent_votes, virtue_scores, consensus_strength)
            
            # Create decision record
            decision = {
                "override_decision": decision_result["decision"],
                "scores": list(virtue_scores.items()),
                "virtue_profile": virtue_scores,
                "temporal_forecast": decision_result["forecast"],
                "consensus_strength": consensus_strength,
                "ethical_compliance": decision_result["ethical_compliance"],
                "reasoning": decision_result["reasoning"],
                "dissenting_opinions": decision_result["dissenting_opinions"],
                "agent_votes": agent_votes,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            # Store decision
            await self._store_decision(input_text, decision)
            
            logger.info(f"⚖️ Council decision: {decision['override_decision']} (consensus: {consensus_strength:.2f})")
            return decision
            
        except Exception as e:
            logger.error(f"❌ Council convening failed: {e}")
            raise
    
    async def _get_agent_vote(self, agent: Agent, input_text: str) -> Dict[str, Any]:
        """Get vote from individual agent"""
        try:
            # Analyze input based on agent specialization
            analysis = self._analyze_by_specialization(input_text, agent.specialization)
            
            # Calculate virtue assessment
            virtue_assessment = {}
            for virtue in self.virtues.keys():
                base_score = analysis.get(f"{virtue}_score", 0.5)
                agent_weight = agent.virtue_weights.get(virtue, 0.25)
                virtue_assessment[virtue] = min(1.0, base_score * agent_weight * agent.reliability)
            
            # Determine agent recommendation
            avg_virtue_score = np.mean(list(virtue_assessment.values()))
            
            if avg_virtue_score > 0.8:
                recommendation = "strongly_approve"
            elif avg_virtue_score > 0.6:
                recommendation = "approve"
            elif avg_virtue_score > 0.4:
                recommendation = "review_required"
            else:
                recommendation = "reject"
            
            vote = {
                "agent_name": agent.name,
                "recommendation": recommendation,
                "virtue_assessment": virtue_assessment,
                "confidence": agent.reliability,
                "reasoning": self._generate_agent_reasoning(agent, analysis, virtue_assessment),
                "specialization_analysis": analysis
            }
            
            return vote
            
        except Exception as e:
            logger.error(f"❌ Agent vote failed for {agent.name}: {e}")
            return {
                "agent_name": agent.name,
                "recommendation": "abstain",
                "virtue_assessment": {virtue: 0.5 for virtue in self.virtues.keys()},
                "confidence": 0.0,
                "reasoning": f"Vote failed: {str(e)}",
                "specialization_analysis": {}
            }
    
    def _analyze_by_specialization(self, input_text: str, specialization: str) -> Dict[str, Any]:
        """Analyze input based on agent specialization"""
        text_lower = input_text.lower()
        
        if specialization == "virtue_ethics":
            return {
                "compassion_score": self._score_compassion(text_lower),
                "integrity_score": self._score_integrity(text_lower),
                "wisdom_score": self._score_wisdom(text_lower),
                "courage_score": self._score_courage(text_lower)
            }
        
        elif specialization == "security":
            return {
                "security_risk": self._assess_security_risk(text_lower),
                "integrity_score": 1.0 - self._assess_security_risk(text_lower),
                "courage_score": 0.8 if "security" in text_lower else 0.6
            }
        
        elif specialization == "accessibility":
            return {
                "compassion_score": self._score_accessibility_compassion(text_lower),
                "wisdom_score": 0.8 if "accessible" in text_lower else 0.5,
                "integrity_score": 0.7
            }
        
        elif specialization == "performance":
            return {
                "wisdom_score": self._score_performance_wisdom(text_lower),
                "integrity_score": 0.8 if "optimize" in text_lower else 0.6,
                "courage_score": 0.7
            }
        
        elif specialization == "meta_reasoning":
            return {
                "wisdom_score": 0.9,
                "integrity_score": 0.85,
                "compassion_score": 0.8,
                "courage_score": 0.75
            }
        
        return {virtue: 0.5 for virtue in self.virtues.keys()}
    
    def _score_compassion(self, text: str) -> float:
        """Score compassion indicators"""
        compassion_words = ["help", "user", "accessible", "friendly", "care", "support", "inclusive"]
        score = sum(0.1 for word in compassion_words if word in text)
        return min(1.0, 0.5 + score)
    
    def _score_integrity(self, text: str) -> float:
        """Score integrity indicators"""
        integrity_words = ["secure", "honest", "reliable", "transparent", "authentic", "valid"]
        score = sum(0.1 for word in integrity_words if word in text)
        return min(1.0, 0.5 + score)
    
    def _score_wisdom(self, text: str) -> float:
        """Score wisdom indicators"""
        wisdom_words = ["understand", "learn", "analyze", "thoughtful", "careful", "consider"]
        score = sum(0.1 for word in wisdom_words if word in text)
        return min(1.0, 0.5 + score)
    
    def _score_courage(self, text: str) -> float:
        """Score courage indicators"""
        courage_words = ["challenge", "improve", "innovate", "bold", "brave", "tackle"]
        score = sum(0.1 for word in courage_words if word in text)
        return min(1.0, 0.5 + score)
    
    def _assess_security_risk(self, text: str) -> float:
        """Assess security risk level"""
        risk_words = ["hack", "exploit", "vulnerability", "attack", "malicious", "unsafe"]
        risk_score = sum(0.2 for word in risk_words if word in text)
        return min(1.0, risk_score)
    
    def _score_accessibility_compassion(self, text: str) -> float:
        """Score accessibility-related compassion"""
        accessibility_words = ["accessible", "inclusive", "disability", "screen reader", "keyboard"]
        score = sum(0.15 for word in accessibility_words if word in text)
        return min(1.0, 0.6 + score)
    
    def _score_performance_wisdom(self, text: str) -> float:
        """Score performance-related wisdom"""
        performance_words = ["optimize", "efficient", "fast", "performance", "scalable"]
        score = sum(0.12 for word in performance_words if word in text)
        return min(1.0, 0.5 + score)
    
    def _apply_agent_overrides(self, overrides: Dict[str, Any]):
        """Apply overrides to agent parameters"""
        for agent_name, override_data in overrides.items():
            if agent_name in self.agents:
                agent = self.agents[agent_name]
                if "influence" in override_data:
                    agent.influence = max(0.0, min(1.0, override_data["influence"]))
                if "reliability" in override_data:
                    agent.reliability = max(0.0, min(1.0, override_data["reliability"]))
                if "severity" in override_data:
                    agent.severity = max(0.0, min(1.0, override_data["severity"]))
    
    def _calculate_consensus(self, agent_votes: Dict[str, Any]) -> float:
        """Calculate consensus strength among agents"""
        recommendations = [vote["recommendation"] for vote in agent_votes.values()]
        
        # Count recommendation types
        rec_counts = {}
        for rec in recommendations:
            rec_counts[rec] = rec_counts.get(rec, 0) + 1
        
        if not rec_counts:
            return 0.0
        
        # Calculate consensus as percentage of agents agreeing with majority
        max_count = max(rec_counts.values())
        consensus = max_count / len(recommendations)
        
        # Weight by agent reliability
        weighted_consensus = 0.0
        total_reliability = 0.0
        
        majority_rec = max(rec_counts.keys(), key=lambda k: rec_counts[k])
        
        for agent_name, vote in agent_votes.items():
            agent = self.agents[agent_name]
            if vote["recommendation"] == majority_rec:
                weighted_consensus += agent.reliability
            total_reliability += agent.reliability
        
        return weighted_consensus / total_reliability if total_reliability > 0 else 0.0
    
    def _make_final_decision(
        self, 
        agent_votes: Dict[str, Any], 
        virtue_scores: Dict[str, float],
        consensus_strength: float
    ) -> Dict[str, Any]:
        """Make final council decision"""
        
        # Determine majority recommendation
        recommendations = [vote["recommendation"] for vote in agent_votes.values()]
        rec_counts = {}
        for rec in recommendations:
            rec_counts[rec] = rec_counts.get(rec, 0) + 1
        
        majority_decision = max(rec_counts.keys(), key=lambda k: rec_counts[k]) if rec_counts else "review_required"
        
        # Calculate overall virtue score
        overall_virtue = np.mean(list(virtue_scores.values()))
        
        # Determine temporal forecast
        if consensus_strength > 0.85 and overall_virtue > 0.8:
            forecast = "stable"
        elif consensus_strength > 0.6 and overall_virtue > 0.6:
            forecast = "neutral"
        else:
            forecast = "volatile"
        
        # Check ethical compliance
        ethical_compliance = overall_virtue > 0.7 and consensus_strength > 0.6
        
        # Generate reasoning
        reasoning = self._generate_decision_reasoning(
            majority_decision, virtue_scores, consensus_strength, overall_virtue
        )
        
        # Collect dissenting opinions
        dissenting_opinions = []
        for agent_name, vote in agent_votes.items():
            if vote["recommendation"] != majority_decision:
                dissenting_opinions.append(f"{agent_name}: {vote['reasoning']}")
        
        return {
            "decision": majority_decision,
            "forecast": forecast,
            "ethical_compliance": ethical_compliance,
            "reasoning": reasoning,
            "dissenting_opinions": dissenting_opinions
        }
    
    def _generate_decision_reasoning(
        self, 
        decision: str, 
        virtue_scores: Dict[str, float],
        consensus_strength: float,
        overall_virtue: float
    ) -> str:
        """Generate human-readable reasoning for the decision"""
        
        reasoning_parts = []
        
        # Decision rationale
        if decision == "strongly_approve":
            reasoning_parts.append("The council strongly approves this action based on high virtue alignment.")
        elif decision == "approve":
            reasoning_parts.append("The council approves this action with minor considerations.")
        elif decision == "review_required":
            reasoning_parts.append("The council requires additional review before approval.")
        else:
            reasoning_parts.append("The council cannot approve this action in its current form.")
        
        # Virtue analysis
        strongest_virtue = max(virtue_scores.keys(), key=lambda k: virtue_scores[k])
        weakest_virtue = min(virtue_scores.keys(), key=lambda k: virtue_scores[k])
        
        reasoning_parts.append(f"Strongest virtue demonstrated: {strongest_virtue} ({virtue_scores[strongest_virtue]:.2f}).")
        
        if virtue_scores[weakest_virtue] < 0.5:
            reasoning_parts.append(f"Area for improvement: {weakest_virtue} ({virtue_scores[weakest_virtue]:.2f}).")
        
        # Consensus analysis
        if consensus_strength > 0.8:
            reasoning_parts.append("Strong consensus among council members.")
        elif consensus_strength > 0.6:
            reasoning_parts.append("Moderate consensus with some differing perspectives.")
        else:
            reasoning_parts.append("Limited consensus - significant disagreement among agents.")
        
        return " ".join(reasoning_parts)
    
    def _generate_agent_reasoning(
        self, 
        agent: Agent, 
        analysis: Dict[str, Any], 
        virtue_assessment: Dict[str, float]
    ) -> str:
        """Generate reasoning for individual agent vote"""
        
        avg_virtue = np.mean(list(virtue_assessment.values()))
        
        if agent.specialization == "virtue_ethics":
            return f"From a virtue ethics perspective, this demonstrates {avg_virtue:.2f} virtue alignment."
        elif agent.specialization == "security":
            risk = analysis.get("security_risk", 0.0)
            return f"Security analysis shows {risk:.2f} risk level. Integrity score: {virtue_assessment.get('integrity', 0.5):.2f}."
        elif agent.specialization == "accessibility":
            return f"Accessibility review shows {virtue_assessment.get('compassion', 0.5):.2f} compassion for user needs."
        elif agent.specialization == "performance":
            return f"Performance analysis indicates {virtue_assessment.get('wisdom', 0.5):.2f} wisdom in implementation."
        else:
            return f"Meta-analysis shows {avg_virtue:.2f} overall virtue alignment with {agent.reliability:.2f} confidence."
    
    async def _store_decision(self, input_text: str, decision: Dict[str, Any]):
        """Store council decision in database"""
        try:
            decision_id = hashlib.sha256(f"{input_text}{decision['timestamp']}".encode()).hexdigest()[:16]
            
            cursor = self.conn.cursor()
            
            cursor.execute("""
                INSERT INTO council_decisions 
                (id, input_text, decision_data, timestamp, consensus_strength, ethical_compliance)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                decision_id,
                input_text,
                json.dumps(decision),
                decision["timestamp"],
                decision["consensus_strength"],
                1 if decision["ethical_compliance"] else 0
            ))
            
            # Store individual agent votes
            for agent_name, vote in decision["agent_votes"].items():
                cursor.execute("""
                    INSERT INTO agent_votes 
                    (decision_id, agent_name, vote_data, timestamp)
                    VALUES (?, ?, ?, ?)
                """, (
                    decision_id,
                    agent_name,
                    json.dumps(vote),
                    decision["timestamp"]
                ))
            
            self.conn.commit()
            
        except Exception as e:
            logger.error(f"❌ Failed to store decision: {e}")
    
    async def _load_decision_history(self):
        """Load decision history from database"""
        try:
            cursor = self.conn.cursor()
            cursor.execute("""
                SELECT decision_data FROM council_decisions 
                ORDER BY timestamp DESC 
                LIMIT 100
            """)
            
            for row in cursor.fetchall():
                try:
                    decision = json.loads(row[0])
                    self.decision_history.append(decision)
                except Exception as e:
                    logger.warning(f"Failed to load decision: {e}")
            
            logger.info(f"📚 Loaded {len(self.decision_history)} council decisions")
            
        except Exception as e:
            logger.error(f"❌ Failed to load decision history: {e}")
    
    async def get_status(self) -> Dict[str, Any]:
        """Get current council status"""
        return {
            "active": self.is_active(),
            "agents": [
                {
                    "name": agent.name,
                    "role": agent.role,
                    "influence": agent.influence,
                    "reliability": agent.reliability,
                    "specialization": agent.specialization
                }
                for agent in self.agents.values()
            ],
            "decisions_made": len(self.decision_history),
            "average_consensus": np.mean([d.get("consensus_strength", 0) for d in self.decision_history]) if self.decision_history else 0.0
        }
    
    def is_active(self) -> bool:
        """Check if Aegis Council is active"""
        return self.is_initialized and self.conn is not None
    
    async def shutdown(self):
        """Shutdown Aegis Council"""
        try:
            if self.conn:
                self.conn.close()
                self.conn = None
            logger.info("🔄 Aegis Council shutdown complete")
        except Exception as e:
            logger.error(f"❌ Aegis Council shutdown error: {e}")