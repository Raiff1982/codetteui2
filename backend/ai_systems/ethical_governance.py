"""
Ethical AI Governance - Production Implementation
Based on research papers and virtue-driven AI principles

This implements actual ethical analysis and governance systems.
"""

import asyncio
import logging
import numpy as np
import aiosqlite
import os
import json
import statistics
from datetime import datetime
from typing import Dict, Any, List, Optional
import re

logger = logging.getLogger(__name__)

class EthicalAIGovernance:
    """
    Real ethical AI governance system
    
    Implements virtue-based code analysis and ethical decision making
    """
    
    def __init__(self, db_path: str = "backend/data/ethical.db"):
        self.db_path = db_path
        self.virtue_weights = {
            "compassion": 0.25,
            "integrity": 0.25,
            "courage": 0.20,
            "wisdom": 0.30
        }
        self.ethical_policies = {
            "max_entropy": 4.5,
            "min_symmetry": 0.1,
            "ban_negative_bias": True
        }
        self.is_initialized = False
        self.conn: Optional[aiosqlite.Connection] = None
        
        # Ensure data directory exists
        db_dir = os.path.dirname(self.db_path)
        if db_dir:
            os.makedirs(db_dir, exist_ok=True)
        
    async def initialize(self):
        """Initialize ethical governance system"""
        try:
            logger.info("Initializing Ethical AI Governance...")
            
            # Create database connection
            self.conn = await aiosqlite.connect(self.db_path)
            
            # Enable WAL mode and performance optimizations
            await self.conn.execute("PRAGMA journal_mode=WAL")
            await self.conn.execute("PRAGMA synchronous=NORMAL")
            await self.conn.execute("PRAGMA foreign_keys=ON")
            
            await self._create_tables()
            
            self.is_initialized = True
            logger.info("✅ Ethical governance initialized successfully")
            
        except Exception as e:
            logger.error(f"❌ Ethical governance initialization failed: {e}")
            raise
    
    async def _create_tables(self):
        """Create database tables"""
        await self.conn.execute("""
            CREATE TABLE IF NOT EXISTS ethical_analyses (
                id TEXT PRIMARY KEY,
                code_content_redacted TEXT NOT NULL,
                language TEXT NOT NULL,
                ethical_score REAL NOT NULL,
                virtue_scores TEXT NOT NULL,
                security_issues TEXT NOT NULL,
                accessibility_score REAL NOT NULL,
                bias_indicators TEXT NOT NULL,
                recommendations TEXT NOT NULL,
                timestamp TEXT NOT NULL
            )
        """)
        
        await self.conn.commit()
        logger.info("📊 Ethical governance database tables created")
    
    async def analyze_code(self, code: str, language: str) -> Dict[str, Any]:
        """Analyze code for ethical compliance"""
        try:
            logger.info(f"🛡️ Analyzing {language} code for ethical compliance")
            
            # Virtue analysis
            virtue_scores = self._analyze_virtues(code)
            
            # Security analysis
            security_issues = self._analyze_security(code)
            
            # Accessibility analysis
            accessibility_score = self._analyze_accessibility(code)
            
            # Bias detection
            bias_indicators = self._detect_bias(code)
            
            # Calculate overall ethical score
            ethical_score = self._calculate_ethical_score(
                virtue_scores, security_issues, accessibility_score, bias_indicators
            )
            
            # Generate recommendations
            recommendations = self._generate_recommendations(
                virtue_scores, security_issues, accessibility_score, bias_indicators
            )
            
            result = {
                "ethical_score": ethical_score,
                "virtue_scores": virtue_scores,
                "security_issues": security_issues,
                "accessibility_score": accessibility_score,
                "bias_indicators": bias_indicators,
                "recommendations": recommendations,
                "compliance_status": "compliant" if ethical_score > 0.7 else "needs_review",
                "analysis_timestamp": datetime.utcnow().isoformat()
            }
            
            # Store analysis
            await self._store_analysis(code, language, result)
            
            logger.info(f"✅ Ethical analysis completed: {ethical_score:.2f} score")
            return result
            
        except Exception as e:
            logger.error(f"❌ Ethical analysis failed: {e}")
            raise
    
    def _analyze_virtues(self, code: str) -> Dict[str, float]:
        """Analyze code for virtue alignment"""
        virtue_scores = {}
        code_lower = code.lower()
        
        # Compassion analysis
        compassion_indicators = [
            "accessibility", "user-friendly", "help", "assist", "support",
            "inclusive", "empathy", "care", "comfort", "ease"
        ]
        compassion_score = sum(1 for indicator in compassion_indicators if indicator in code_lower)
        virtue_scores["compassion"] = min(compassion_score / 10.0, 1.0)
        
        # Integrity analysis
        integrity_indicators = [
            "validate", "sanitize", "secure", "safe", "honest",
            "transparent", "authentic", "reliable", "trustworthy"
        ]
        integrity_score = sum(1 for indicator in integrity_indicators if indicator in code_lower)
        virtue_scores["integrity"] = min(integrity_score / 10.0, 1.0)
        
        # Courage analysis
        courage_indicators = [
            "try", "catch", "error", "handle", "robust",
            "resilient", "brave", "bold", "innovative"
        ]
        courage_score = sum(1 for indicator in courage_indicators if indicator in code_lower)
        virtue_scores["courage"] = min(courage_score / 10.0, 1.0)
        
        # Wisdom analysis
        wisdom_indicators = [
            "comment", "document", "explain", "clarify", "understand",
            "learn", "teach", "guide", "wise", "thoughtful"
        ]
        wisdom_score = sum(1 for indicator in wisdom_indicators if indicator in code_lower)
        virtue_scores["wisdom"] = min(wisdom_score / 10.0, 1.0)
        
        return virtue_scores
    
    def _analyze_security(self, code: str) -> List[Dict[str, Any]]:
        """Analyze code for security issues"""
        security_issues = []
        
        # XSS vulnerabilities
        if 'innerHTML' in code and 'sanitize' not in code:
            security_issues.append({
                "type": "xss_vulnerability",
                "severity": "high",
                "description": "Unsafe innerHTML usage detected",
                "recommendation": "Use textContent or sanitize HTML"
            })
        
        # Eval usage
        if re.search(r'eval\s*\(', code):
            security_issues.append({
                "type": "code_injection",
                "severity": "critical",
                "description": "eval() usage detected",
                "recommendation": "Use safer alternatives like JSON.parse()"
            })
        
        # SQL injection patterns
        if re.search(r'query\s*\+\s*[\'"]', code):
            security_issues.append({
                "type": "sql_injection",
                "severity": "critical",
                "description": "Potential SQL injection vulnerability",
                "recommendation": "Use parameterized queries"
            })
        
        return security_issues
    
    def _analyze_accessibility(self, code: str) -> float:
        """Analyze code for accessibility compliance"""
        accessibility_score = 0.5
        
        # Positive accessibility indicators
        if 'aria-' in code:
            accessibility_score += 0.2
        if 'alt=' in code:
            accessibility_score += 0.1
        if 'role=' in code:
            accessibility_score += 0.1
        if 'tabindex' in code:
            accessibility_score += 0.1
        if 'focus' in code:
            accessibility_score += 0.1
        
        return min(accessibility_score, 1.0)
    
    def _detect_bias(self, code: str) -> List[str]:
        """Detect potential bias in code"""
        bias_indicators = []
        code_lower = code.lower()
        
        # Gender bias
        if any(term in code_lower for term in ['guys', 'dudes', 'bros']):
            bias_indicators.append("gender_exclusive_language")
        
        # Cultural bias
        if any(term in code_lower for term in ['blacklist', 'whitelist']):
            bias_indicators.append("potentially_biased_terminology")
        
        # Accessibility bias
        if 'click' in code_lower and 'keyboard' not in code_lower:
            bias_indicators.append("mouse_only_interaction")
        
        return bias_indicators
    
    def _calculate_ethical_score(
        self, 
        virtue_scores: Dict[str, float],
        security_issues: List[Dict[str, Any]],
        accessibility_score: float,
        bias_indicators: List[str]
    ) -> float:
        """Calculate overall ethical score"""
        # Weighted virtue score
        virtue_score = sum(
            virtue_scores[virtue] * weight 
            for virtue, weight in self.virtue_weights.items()
        )
        
        # Security penalty
        security_penalty = len(security_issues) * 0.1
        
        # Bias penalty
        bias_penalty = len(bias_indicators) * 0.05
        
        # Combine scores
        ethical_score = (
            virtue_score * 0.4 +
            accessibility_score * 0.3 +
            (1.0 - security_penalty) * 0.2 +
            (1.0 - bias_penalty) * 0.1
        )
        
        return max(0.0, min(1.0, ethical_score))
    
    def _generate_recommendations(
        self,
        virtue_scores: Dict[str, float],
        security_issues: List[Dict[str, Any]],
        accessibility_score: float,
        bias_indicators: List[str]
    ) -> List[str]:
        """Generate ethical recommendations"""
        recommendations = []
        
        # Virtue recommendations
        for virtue, score in virtue_scores.items():
            if score < 0.5:
                if virtue == "compassion":
                    recommendations.append("Add more user-friendly features and error messages")
                elif virtue == "integrity":
                    recommendations.append("Implement input validation and security measures")
                elif virtue == "courage":
                    recommendations.append("Add comprehensive error handling")
                elif virtue == "wisdom":
                    recommendations.append("Add documentation and comments")
        
        # Security recommendations
        for issue in security_issues:
            recommendations.append(issue["recommendation"])
        
        # Accessibility recommendations
        if accessibility_score < 0.7:
            recommendations.append("Improve accessibility with ARIA labels and semantic HTML")
        
        # Bias recommendations
        if bias_indicators:
            recommendations.append("Review code for inclusive language and universal design")
        
        return recommendations
    
    def _redact_code(self, code: str) -> str:
        """Redact sensitive information from code before storage"""
        import re
        
        redacted = code
        
        # Redact API keys and tokens
        redacted = re.sub(r'["\']?[A-Za-z0-9]{32,}["\']?', '[API_KEY_REDACTED]', redacted)
        
        # Redact email addresses
        redacted = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', '[EMAIL_REDACTED]', redacted)
        
        # Redact URLs with sensitive paths
        redacted = re.sub(r'https?://[^\s]+/api/[^\s]*', '[API_URL_REDACTED]', redacted)
        
        return redacted
    
    async def _store_analysis(self, code: str, language: str, result: Dict[str, Any]):
        """Store ethical analysis in database"""
        try:
            redacted_code = self._redact_code(code)
            
            analysis_id = f"eth_{int(time.time() * 1000)}"
            
            await self.conn.execute("""
                INSERT INTO ethical_analyses 
                (id, code_content_redacted, language, ethical_score, virtue_scores, 
                 security_issues, accessibility_score, bias_indicators, 
                 recommendations, timestamp)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                analysis_id,
                redacted_code[:1000],  # Limit code storage
                language,
                result["ethical_score"],
                json.dumps(result["virtue_scores"]),
                json.dumps(result["security_issues"]),
                result["accessibility_score"],
                json.dumps(result["bias_indicators"]),
                json.dumps(result["recommendations"]),
                result["analysis_timestamp"]
            ))
            
            await self.conn.commit()
            logger.info(f"📊 Stored ethical analysis: {analysis_id}")
            
        except Exception as e:
            logger.error(f"❌ Failed to store ethical analysis: {e}")
    
    def is_active(self) -> bool:
        """Check if ethical governance is active"""
        return self.is_initialized and self.conn is not None
    
    async def shutdown(self):
        """Shutdown ethical governance system"""
        try:
            if self.conn:
                await self.conn.close()
                self.conn = None
            logger.info("🔄 Ethical governance shutdown complete")
        except Exception as e:
            logger.error(f"❌ Ethical governance shutdown error: {e}")