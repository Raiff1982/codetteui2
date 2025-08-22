import React, { useState } from 'react';
import { 
  Satellite, 
  Search, 
  Eye, 
  AlertTriangle, 
  CheckCircle,
  Globe,
  Target,
  Clock,
  Shield,
  Brain
} from 'lucide-react';
import { orbitalAnalysisService } from '../services/orbitalAnalysisService';

export function OrbitalAnalysisPanel() {
  const [claimText, setClaimText] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [objectDesignation, setObjectDesignation] = useState('');
  const [objectData, setObjectData] = useState<any>(null);

  const analyzeClaim = async () => {
    if (!claimText.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const result = await orbitalAnalysisService.analyzeAstronomicalClaim(claimText, sourceUrl || undefined);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Orbital analysis failed:', error);
      alert('Analysis failed. This requires backend connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getObjectData = async () => {
    if (!objectDesignation.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const data = await orbitalAnalysisService.getObjectData(objectDesignation);
      setObjectData(data);
    } catch (error) {
      console.error('Object data retrieval failed:', error);
      alert('Object data retrieval failed. This requires backend connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'approved': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'likely_hoax': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'adaptive_intervention': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'insufficient_evidence': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Satellite className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">Orbital Analysis</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Live JPL/NASA data analysis</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Claim Analysis */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 dark:text-white mb-3">Analyze Astronomical Claim</h4>
          
          <div className="space-y-3">
            <textarea
              value={claimText}
              onChange={(e) => setClaimText(e.target.value)}
              placeholder="Enter astronomical claim to analyze..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white bg-white dark:bg-gray-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            
            <input
              type="text"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="Source URL (optional)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white bg-white dark:bg-gray-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <button
              onClick={analyzeClaim}
              disabled={!claimText.trim() || isAnalyzing}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Claim'}
            </button>
          </div>
        </div>

        {/* Object Data Lookup */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 dark:text-white mb-3">Object Data Lookup</h4>
          
          <div className="space-y-3">
            <input
              type="text"
              value={objectDesignation}
              onChange={(e) => setObjectDesignation(e.target.value)}
              placeholder="Object designation (e.g., 3I/ATLAS, C/2025 N1)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white bg-white dark:bg-gray-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <button
              onClick={getObjectData}
              disabled={!objectDesignation.trim() || isAnalyzing}
              className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
            >
              {isAnalyzing ? 'Retrieving...' : 'Get Object Data'}
            </button>
          </div>
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-800 dark:text-white">Analysis Result</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVerdictColor(analysisResult.verdict)}`}>
                {analysisResult.verdict.replace('_', ' ')}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Message:</strong> {analysisResult.message}
                </p>
              </div>
              
              {analysisResult.hoax_analysis && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded p-3">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    <strong>Hoax Probability:</strong> {(analysisResult.hoax_analysis.hoax_probability * 100).toFixed(0)}%
                  </p>
                </div>
              )}
              
              {analysisResult.live_orbital_facts?.resolved?.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Objects Analyzed:</strong> {analysisResult.live_orbital_facts.resolved.length}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Object Data Results */}
        {objectData && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 dark:text-white mb-3">Object Data</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Designation:</span>
                <span className="text-gray-800 dark:text-white font-medium">{objectData.designation}</span>
              </div>
              
              {objectData.sbdb_data?.object?.fullname && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Full Name:</span>
                  <span className="text-gray-800 dark:text-white font-medium">{objectData.sbdb_data.object.fullname}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Data Source:</span>
                <span className="text-gray-800 dark:text-white font-medium">{objectData.data_source}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}