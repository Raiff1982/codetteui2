"""
Orbital Analysis Service - Integration with Codette AI Systems
Combines JPL/NASA orbital data with Codette's AI analysis
"""

import asyncio
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
from claim_guard import LiveClaimGuard
from orbit_feeds import SSDClient, extract_designations

logger = logging.getLogger(__name__)

class OrbitalAnalysisService:
    """
    Service that integrates orbital data analysis with Codette's AI systems
    """
    
    def __init__(self):
        self.claim_guard = LiveClaimGuard()
        self.ssd_client = SSDClient()
        self.is_initialized = False
    
    def initialize(self):
        """Initialize the orbital analysis service"""
        try:
            logger.info("Initializing Orbital Analysis Service...")
            self.is_initialized = True
            logger.info("Orbital analysis service initialized successfully")
        except Exception as e:
            logger.error(f"Orbital analysis initialization failed: {e}")
            raise
    
    async def analyze_astronomical_claim(
        self, 
        text: str, 
        source_url: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Analyze astronomical claims using live JPL/NASA data
        """
        try:
            logger.info(f"Analyzing astronomical claim: {text[:100]}...")
            
            # Use the claim guard for comprehensive analysis
            result = self.claim_guard.evaluate(
                text=text,
                source_url=source_url,
                earth_window=("2020-01-01", "2030-12-31")
            )
            
            # Extract key insights
            insights = self._generate_insights(result)
            
            # Add Codette-specific analysis
            codette_analysis = await self._apply_codette_analysis(result)
            
            final_result = {
                **result,
                "codette_insights": insights,
                "ai_analysis": codette_analysis,
                "service_version": "1.0.0",
                "analysis_complete": True
            }
            
            logger.info(f"Astronomical analysis completed: {result['verdict']}")
            return final_result
            
        except Exception as e:
            logger.error(f"Astronomical analysis failed: {e}")
            raise
    
    async def get_object_data(self, designation: str) -> Dict[str, Any]:
        """
        Get comprehensive data for a specific astronomical object
        """
        try:
            # SBDB lookup
            sbdb_data = self.ssd_client.sbdb_lookup(designation)
            
            # Close approach data
            cad_data = self.ssd_client.cad(designation, body="Earth")
            
            # Process and format data
            processed_data = {
                "designation": designation,
                "sbdb_data": sbdb_data,
                "close_approaches": cad_data,
                "analysis_timestamp": datetime.utcnow().isoformat(),
                "data_source": "JPL Small-Body Database"
            }
            
            return processed_data
            
        except Exception as e:
            logger.error(f"Object data retrieval failed for {designation}: {e}")
            raise
    
    def _generate_insights(self, analysis_result: Dict[str, Any]) -> List[str]:
        """Generate human-readable insights from analysis"""
        insights = []
        
        # Hoax analysis insights
        hoax_prob = analysis_result.get("hoax_analysis", {}).get("hoax_probability", 0)
        if hoax_prob > 0.7:
            insights.append(f"High misinformation probability ({hoax_prob:.0%}) detected")
        elif hoax_prob > 0.3:
            insights.append(f"Moderate misinformation indicators present ({hoax_prob:.0%})")
        
        # Orbital facts insights
        orbital_facts = analysis_result.get("live_orbital_facts", {})
        resolved_objects = orbital_facts.get("resolved", [])
        
        for obj in resolved_objects:
            if "closest_approach" in obj and obj["closest_approach"]:
                ca = obj["closest_approach"]
                dist_au = ca.get("dist_au")
                if dist_au:
                    if dist_au > 1.0:
                        insights.append(f"{obj['resolved_fullname']} minimum Earth distance: {dist_au:.2f} AU (no threat)")
                    elif dist_au > 0.3:
                        insights.append(f"{obj['resolved_fullname']} minimum Earth distance: {dist_au:.2f} AU (distant)")
                    else:
                        insights.append(f"{obj['resolved_fullname']} minimum Earth distance: {dist_au:.2f} AU (monitoring required)")
        
        # Verdict insights
        verdict = analysis_result.get("verdict", "unknown")
        if verdict == "likely_hoax":
            insights.append("Claim shows strong indicators of misinformation")
        elif verdict == "adaptive_intervention":
            insights.append("Scientific data contradicts sensational claims")
        elif verdict == "approved":
            insights.append("Claim appears consistent with available data")
        
        return insights
    
    async def _apply_codette_analysis(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """Apply Codette's AI systems to the orbital analysis"""
        try:
            # Simulate Codette AI analysis
            ai_analysis = {
                "ethical_assessment": {
                    "misinformation_risk": result.get("hoax_analysis", {}).get("hoax_probability", 0),
                    "public_safety_concern": len(result.get("hoax_analysis", {}).get("fear_flags", [])) > 3,
                    "scientific_accuracy": len(result.get("live_orbital_facts", {}).get("resolved", [])) > 0
                },
                "virtue_analysis": {
                    "truth_seeking": 0.9 if result.get("verdict") == "approved" else 0.3,
                    "compassion": 0.8,  # Protecting public from misinformation
                    "wisdom": 0.9,      # Using scientific data
                    "integrity": 0.95   # Transparent analysis
                },
                "recommendation": self._generate_recommendation(result)
            }
            
            return ai_analysis
            
        except Exception as e:
            logger.error(f"Codette AI analysis failed: {e}")
            return {"error": str(e)}
    
    def _generate_recommendation(self, result: Dict[str, Any]) -> str:
        """Generate AI recommendation based on analysis"""
        verdict = result.get("verdict", "unknown")
        hoax_prob = result.get("hoax_analysis", {}).get("hoax_probability", 0)
        
        if verdict == "likely_hoax":
            return "Recommend fact-checking with authoritative sources before sharing"
        elif verdict == "adaptive_intervention":
            return "Scientific data available - recommend sharing factual information instead"
        elif hoax_prob > 0.5:
            return "Exercise caution - verify with multiple credible sources"
        else:
            return "Information appears consistent with available scientific data"
    
    def is_active(self) -> bool:
        """Check if orbital analysis service is active"""
        return self.is_initialized