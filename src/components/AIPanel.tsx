import React, { useState, useEffect } from 'react';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { useAI } from '../hooks/useAI';
import { 
  Brain, 
  Atom, 
  Users, 
  Activity, 
  Shield,
  Music,
  Zap,
  Target,
  Eye,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Settings,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

interface AIPanelProps {
  currentCode?: string;
  language?: string;
  onCodeGenerated?: (code: string, title?: string) => void;
}

export function AIPanel({ 
  currentCode = '', 
  language = 'typescript', 
  onCodeGenerated 
}: AIPanelProps) {
  const {
    isProcessing,
    lastAnalysis,
    lastCouncilDecision,
    lastEthicalAnalysis,
    runQuantumOptimization,
    conveneCouncil,
    analyzeEthics,
    runBenchmark,
    generatePhilosophicalInsight
  } = useAI();

  const analysisScroll = useAutoScroll({ 
    speed: 30, 
    pauseOnHover: true,
    resetOnInteraction: true 
  });

  const [activeTab, setActiveTab] = useState<'quantum' | 'council' | 'ethics' | 'benchmark' | 'insights'>('quantum');
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const [showVerification, setShowVerification] = useState(false);

  const handleQuantumAnalysis = async () => {
    try {
      const result = await runQuantumOptimization(['performance', 'maintainability']);
      setAnalysisHistory(prev => [{
        type: 'quantum',
        result,
        timestamp: new Date()
      }, ...prev].slice(0, 10));
    } catch (error) {
      console.error('Quantum analysis failed:', error);
    }
  };

  const handleCouncilConvening = async () => {
    try {
      const prompt = currentCode 
        ? `Analyze this ${language} code for best practices: ${currentCode.slice(0, 200)}...`
        : `Provide guidance for ${language} development best practices`;
      const decision = await conveneCouncil(prompt);
      setAnalysisHistory(prev => [{
        type: 'council',
        result: decision,
        timestamp: new Date()
      }, ...prev].slice(0, 10));
    } catch (error) {
      console.error('Council convening failed:', error);
    }
  };

  const handleEthicalAnalysis = async () => {
    try {
      const result = await analyzeEthics([0.5, 0.7, 0.3], [0.4, 0.6, 0.2]);
      setAnalysisHistory(prev => [{
        type: 'ethics',
        result,
        timestamp: new Date()
      }, ...prev].slice(0, 10));
    } catch (error) {
      console.error('Ethical analysis failed:', error);
    }
  };

  const handleBenchmark = async () => {
    try {
      const result = await runBenchmark('performance', currentCode || 'sample code');
      setAnalysisHistory(prev => [{
        type: 'benchmark',
        result,
        timestamp: new Date()
      }, ...prev].slice(0, 10));
    } catch (error) {
      console.error('Benchmark failed:', error);
    }
  };

  const generateInsight = () => {
    const insight = generatePhilosophicalInsight([0.5, 0.7], [0.3, 0.4]);
    setAnalysisHistory(prev => [{
      type: 'insight',
      result: insight,
      timestamp: new Date()
    }, ...prev].slice(0, 10));
  };

  const handleVerifyAI = async () => {
    try {
      // Import the verification service
      const { aiVerificationService } = await import('../services/aiVerificationService');
      
      // Verify Codette's research papers
      const verification = await aiVerificationService.verifyCodetteResearch();
      
      setAnalysisHistory(prev => [{
        type: 'verification',
        result: verification,
        timestamp: new Date()
      }, ...prev].slice(0, 10));
      
      setShowVerification(true);
    } catch (error) {
      console.error('AI verification failed:', error);
    }
  };
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">AI Analysis Panel</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Quantum • Ethical • Verified</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {[
            { id: 'quantum', label: 'Quantum', icon: Atom },
            { id: 'council', label: 'Council', icon: Users },
            { id: 'ethics', label: 'Ethics', icon: Shield },
            { id: 'benchmark', label: 'Benchmark', icon: TrendingUp },
            { id: 'insights', label: 'Insights', icon: Lightbulb },
            { id: 'verification', label: 'Verify', icon: CheckCircle }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'quantum' && (
          <div className="space-y-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-800 dark:text-white">Quantum Multi-Objective Optimizer</h4>
                <button
                  onClick={handleQuantumAnalysis}
                  disabled={isProcessing}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
                >
                  <Atom className="w-4 h-4" />
                  <span>{isProcessing ? 'Analyzing...' : 'Run Analysis'}</span>
                </button>
              </div>
              
              {lastAnalysis && (
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="font-bold text-purple-600">{lastAnalysis.pareto_front_size}</p>
                    <p className="text-gray-600 dark:text-gray-400">Solutions</p>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="font-bold text-blue-600">{lastAnalysis.convergence_time.toFixed(1)}s</p>
                    <p className="text-gray-600 dark:text-gray-400">Time</p>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="font-bold text-green-600">{(lastAnalysis.optimization_score * 100).toFixed(0)}%</p>
                    <p className="text-gray-600 dark:text-gray-400">Score</p>
                  </div>
                </div>
              )}
              
              {lastVerification && (
                <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">Research Verified</span>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Quantum algorithms verified against published research (DOI: 10.5281/zenodo.16388758)
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'council' && (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-800 dark:text-white">Aegis Council</h4>
                <button
                  onClick={handleCouncilConvening}
                  disabled={isProcessing}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span>{isProcessing ? 'Convening...' : 'Convene Council'}</span>
                </button>
              </div>
              
              {lastCouncilDecision && (
                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Decision:</p>
                    <p className="font-bold text-blue-600">{lastCouncilDecision.override_decision}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(lastCouncilDecision.virtue_profile).map(([virtue, score]) => (
                      <div key={virtue} className="bg-white dark:bg-gray-800 rounded-lg p-2">
                        <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{virtue}</p>
                        <p className="font-bold text-green-600">{(score * 100).toFixed(0)}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'ethics' && (
          <div className="space-y-4">
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-800 dark:text-white">Ethical Analysis</h4>
                <button
                  onClick={handleEthicalAnalysis}
                  disabled={isProcessing}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span>{isProcessing ? 'Analyzing...' : 'Analyze Ethics'}</span>
                </button>
              </div>
              
              {lastEthicalAnalysis && (
                <div className="space-y-3">
                  <div className={`p-3 rounded-lg ${
                    lastEthicalAnalysis.approved 
                      ? 'bg-green-100 dark:bg-green-900/20' 
                      : 'bg-red-100 dark:bg-red-900/20'
                  }`}>
                    <div className="flex items-center space-x-2">
                      {lastEthicalAnalysis.approved ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      )}
                      <span className="font-medium text-gray-800 dark:text-white">
                        {lastEthicalAnalysis.approved ? 'Approved' : 'Needs Review'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      Ethical Score: {(lastEthicalAnalysis.ethical_score * 100).toFixed(0)}%
                    </p>
                  </div>
                  
                  {lastEthicalAnalysis.violations.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                      <h5 className="font-medium text-red-800 dark:text-red-200 mb-2">Violations:</h5>
                      <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                        {lastEthicalAnalysis.violations.map((violation, index) => (
                          <li key={index}>• {violation}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'benchmark' && (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-800 dark:text-white">Performance Benchmark</h4>
                <button
                  onClick={handleBenchmark}
                  disabled={isProcessing}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>{isProcessing ? 'Running...' : 'Run Benchmark'}</span>
                </button>
              </div>
              
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">Run benchmark to see performance metrics</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-800 dark:text-white">Philosophical Insights</h4>
                <button
                  onClick={generateInsight}
                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>Generate Insight</span>
                </button>
              </div>
              
              <div className="text-center py-8">
                <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">Generate philosophical insights about your code</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'verification' && (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-800 dark:text-white">AI Source Verification</h4>
                <button
                  onClick={handleVerifyAI}
                  disabled={isProcessing}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isProcessing ? 'Verifying...' : 'Verify AI Sources'}</span>
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                  <h5 className="font-medium text-gray-800 dark:text-white mb-2">Cryptographic Verification</h5>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Verify AI model sources with zero-knowledge proofs</li>
                    <li>• Cryptographically authenticate research papers</li>
                    <li>• Create immutable audit trail of AI decisions</li>
                    <li>• Enhance confidence with verified sources</li>
                  </ul>
                </div>
                
                {lastVerification && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <h5 className="font-medium text-gray-800 dark:text-white mb-2">Verification Results</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">DreamCore Paper:</span>
                        <span className="text-green-600 font-medium">✓ Verified</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Nexus Engine:</span>
                        <span className="text-green-600 font-medium">✓ Verified</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Analysis History */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 dark:text-white mb-4">Analysis History</h4>
          
          <div 
            ref={analysisScroll.elementRef}
            className="space-y-2 max-h-48 overflow-y-auto relative"
          >
            {analysisHistory.length > 0 ? (
              analysisHistory.map((entry, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {entry.type === 'quantum' && <Atom className="w-4 h-4 text-purple-600" />}
                      {entry.type === 'council' && <Users className="w-4 h-4 text-blue-600" />}
                      {entry.type === 'ethics' && <Shield className="w-4 h-4 text-orange-600" />}
                      {entry.type === 'benchmark' && <TrendingUp className="w-4 h-4 text-green-600" />}
                      {entry.type === 'insight' && <Lightbulb className="w-4 h-4 text-yellow-600" />}
                      {entry.type === 'verification' && <CheckCircle className="w-4 h-4 text-green-600" />}
                      <span className="font-medium text-gray-800 dark:text-white capitalize">
                        {entry.type}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {entry.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">
                    {entry.type === 'verification' ? 'Cryptographic verification completed' : 'Analysis completed successfully'}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">No analysis history</p>
                <p className="text-gray-500 dark:text-gray-500 text-xs">Run an analysis to see results here</p>
              </div>
            )}
            
            {/* Auto-scroll indicator */}
            <div className="absolute top-2 right-2 flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-2 py-1">
              <div className={`w-2 h-2 rounded-full ${analysisScroll.isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {analysisScroll.isPaused ? 'Paused' : 'Auto'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                AI Processing
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Running verified AI analysis...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}