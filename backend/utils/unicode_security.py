"""
Unicode Security Module
Comprehensive Unicode threat detection and mitigation
"""

import re
import unicodedata
import logging
from typing import Dict, Any, List, Tuple

logger = logging.getLogger(__name__)

# Dangerous Unicode ranges that could be used for attacks
DANGEROUS_RANGES = [
    (0x200B, 0x200F),  # Zero-width characters
    (0x202A, 0x202E),  # Bidirectional text override
    (0x1F300, 0x1F9FF), # Emoji ranges (potential for confusion)
    (0xFE00, 0xFE0F),  # Variation selectors
    (0xFFF9, 0xFFFB)   # Interlinear annotation characters
]

class UnicodeSecurityAnalyzer:
    """Analyzes text for Unicode-based security threats"""
    
    def __init__(self, extraordinary_km: float = 50.0):
        self.extraordinary_km = extraordinary_km
    
    def is_dangerous_codepoint(self, cp: int) -> bool:
        """Check if a Unicode codepoint is potentially dangerous"""
        return any(start <= cp <= end for start, end in DANGEROUS_RANGES)
    
    def detect_unicode_threat(self, text: str) -> Dict[str, Any]:
        """
        Analyze text for Unicode-based threats
        
        Returns threat analysis with risk level and recommendations
        """
        threat_score = 0
        confusables = []
        suspicious_chars = []
        
        # Normalize text for comparison
        normalized = unicodedata.normalize('NFKD', text)
        
        for char in text:
            cp = ord(char)
            
            # Check dangerous ranges
            if self.is_dangerous_codepoint(cp):
                threat_score += 1
                suspicious_chars.append({
                    "char": char,
                    "codepoint": cp,
                    "name": self._get_char_name(char)
                })
            
            # Check for confusable characters
            try:
                name = unicodedata.name(char)
                if any(keyword in name for keyword in ["ZERO WIDTH", "BIDI", "VARIATION SELECTOR"]):
                    threat_score += 1
                    confusables.append({
                        "char": char,
                        "name": name,
                        "category": unicodedata.category(char)
                    })
            except ValueError:
                # Character has no name
                continue
        
        # Determine threat level
        threat_level = "low"
        if threat_score >= 5:
            threat_level = "high"
        elif threat_score >= 2:
            threat_level = "moderate"
        
        # Generate recommendations
        suggested_action = self._get_suggested_action(threat_level, threat_score)
        
        return {
            "input_length": len(text),
            "threat_level": threat_level,
            "unicode_score": round(threat_score / max(len(text), 1), 4),
            "threat_count": threat_score,
            "suspicious_chars": suspicious_chars,
            "confusables": confusables,
            "suggested_action": suggested_action,
            "normalized": normalized,
            "analysis_timestamp": unicodedata.normalize('NFKD', text) != text
        }
    
    def _get_char_name(self, char: str) -> str:
        """Get Unicode character name safely"""
        try:
            return unicodedata.name(char)
        except ValueError:
            return f"U+{ord(char):04X}"
    
    def _get_suggested_action(self, threat_level: str, threat_score: int) -> str:
        """Get recommended action based on threat level"""
        if threat_level == "high":
            return "quarantine"
        elif threat_level == "moderate":
            return "monitor"
        else:
            return "allow"
    
    def sanitize_text(self, text: str) -> str:
        """Remove dangerous Unicode characters from text"""
        sanitized = ""
        
        for char in text:
            cp = ord(char)
            if not self.is_dangerous_codepoint(cp):
                sanitized += char
            else:
                # Replace with safe equivalent or remove
                if unicodedata.category(char) in ['Cf', 'Mn']:  # Format/Mark characters
                    continue  # Remove completely
                else:
                    sanitized += '?'  # Replace with placeholder
        
        return unicodedata.normalize('NFKD', sanitized)

# Global instance
unicode_analyzer = UnicodeSecurityAnalyzer()