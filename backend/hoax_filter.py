# hoax_filter.py
# Hoax detection heuristics for astronomical claims

import re
from typing import Dict, List, Any
from datetime import datetime

class HoaxFilter:
    def __init__(self, extraordinary_km: float = 50.0):
        self.extraordinary_km = extraordinary_km
        
        # Common hoax patterns
        self.hoax_patterns = [
            r"recently declassified",
            r"government cover[- ]?up",
            r"they don't want you to know",
            r"mainstream media won't report",
            r"secret footage",
            r"leaked documents",
            r"insider sources",
            r"end of the world",
            r"planet killer",
            r"extinction event",
            r"heading straight for earth",
            r"impact imminent",
            r"nasa is hiding"
        ]
        
        # Fear-mongering language
        self.fear_words = [
            "catastrophic", "devastating", "apocalyptic", "terrifying",
            "shocking", "urgent", "immediate danger", "crisis",
            "emergency", "panic", "disaster", "doom"
        ]
        
        # Credibility indicators
        self.credible_sources = [
            "nasa.gov", "jpl.nasa.gov", "esa.int", "iau.org",
            "arxiv.org", "nature.com", "science.org", "aaas.org"
        ]
    
    def analyze_hoax_indicators(self, text: str, source_url: str = None) -> Dict[str, Any]:
        """Analyze text for hoax indicators"""
        text_lower = text.lower()
        
        # Check for hoax patterns
        hoax_flags = []
        for pattern in self.hoax_patterns:
            if re.search(pattern, text_lower):
                hoax_flags.append(pattern)
        
        # Check for fear-mongering
        fear_flags = []
        for word in self.fear_words:
            if word in text_lower:
                fear_flags.append(word)
        
        # Check source credibility
        source_credible = False
        if source_url:
            source_credible = any(domain in source_url.lower() for domain in self.credible_sources)
        
        # Calculate hoax probability
        hoax_score = len(hoax_flags) * 0.2 + len(fear_flags) * 0.1
        if not source_credible and source_url:
            hoax_score += 0.3
        
        hoax_score = min(1.0, hoax_score)
        
        return {
            "hoax_probability": hoax_score,
            "hoax_flags": hoax_flags,
            "fear_flags": fear_flags,
            "source_credible": source_credible,
            "analysis_timestamp": datetime.utcnow().isoformat()
        }
    
    def assess_extraordinary_claims(self, text: str) -> Dict[str, Any]:
        """Assess extraordinary claims that require extraordinary evidence"""
        text_lower = text.lower()
        
        extraordinary_claims = []
        
        # Size claims
        if re.search(r"\d+\s*(?:mile|km|kilometer).*(?:wide|long|diameter)", text_lower):
            extraordinary_claims.append("unusual_size_claim")
        
        # Speed claims
        if re.search(r"faster than.*light|ftl|warp", text_lower):
            extraordinary_claims.append("ftl_claim")
        
        # Origin claims
        if re.search(r"alien|extraterrestrial|et|ufo", text_lower):
            extraordinary_claims.append("alien_origin_claim")
        
        # Trajectory claims
        if re.search(r"heading.*earth|collision.*course|impact.*earth", text_lower):
            extraordinary_claims.append("earth_impact_claim")
        
        return {
            "extraordinary_claims": extraordinary_claims,
            "requires_evidence": len(extraordinary_claims) > 0,
            "evidence_threshold": 0.9 if extraordinary_claims else 0.7
        }