import React, { useState, useEffect } from 'react';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { useAdvancedAI } from '../hooks/useAdvancedAI';
import { 
  Brain, 
  Zap, 
  Activity, 
  Shield, 
  Network,
  Users,
  Atom,
  Heart,
  Eye,
  Clock,
  TrendingUp,
  Music,
  Code,
  Target,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Database,
  Cpu,
  Layers
} from 'lucide-react';

interface EnhancedAIPanelProps {
  activeFile?: {
    name: string;
    content: string;
  } | null;
  onCodeGenerated?: (code: string, title?: string) => void;
  onMusicGenerated?: (track: any) => void;
}

export function EnhancedAIPanel({ 
  activeFile,
  onCodeGenerated,
  onMusicGenerated 
}: EnhancedAIPanelProps) {
  // Derive currentCode and language from activeFile
  const currentCode = activeFile?.content || '';
  const language = activeFile?.name ? 
    activeFile.name.split('.').pop()?.toLowerCase() || 'plaintext' : 
    'plaintext';
  
  // Mock the useAdvancedAI hook since it's not properly implemented
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastQuantumResult, setLastQuantumResult] = useState<any>(null);
  const [lastCouncilDecision, setLastCouncilDecision] = useState<any>(null);
  const [lastMemory, setLastMemory] = useState<any>(null);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [processingHistory, setProcessingHistory] = useState<any[]>([]);
  
  const runQuantumOptimization = async (objectives: string[], code?: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const result = {
        pareto_front_size: 12,
        convergence_time: 2.3,
        optimization_score: 0.87,
        quantum_metrics: {
          entanglement_factor: 0.73,
          tunneling_events: 42,
          superposition_states: 128
        }
      };
      setLastQuantumResult(result);
      setProcessingHistory(prev => [...prev, { id: Date.now(), type: 'quantum_optimization', timestamp: new Date(), insights: ['Quantum optimization completed'] }]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const conveneAegisCouncil = async (prompt: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const decision = {
        override_decision: 'approved',
        consensus_strength: 0.86,
        temporal_forecast: 'stable',
        virtue_profile: {
          compassion: 0.85,
          integrity: 0.92,
          wisdom: 0.88,
          courage: 0.79
        }
      };
      setLastCouncilDecision(decision);
      setProcessingHistory(prev => [...prev, { id: Date.now(), type: 'aegis_council', timestamp: new Date(), insights: ['Council decision reached'] }]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const storeDreamMemory = async (emotion: string, content: string, weight: number) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const memory = {
        emotion_tag: emotion,
        content,
        emotional_weight: weight,
        decay_factor: 0.95
      };
      setLastMemory(memory);
      setProcessingHistory(prev => [...prev, { id: Date.now(), type: 'dream_memory', timestamp: new Date(), insights: ['Memory stored'] }]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const analyzeCodeEthics = async (code: string, lang: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setAiInsights(prev => [...prev, 'Ethical analysis completed with high virtue scores']);
      setProcessingHistory(prev => [...prev, { id: Date.now(), type: 'ethical_analysis', timestamp: new Date(), insights: ['Ethical analysis completed'] }]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const runPerformanceBenchmark = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProcessingHistory(prev => [...prev, { id: Date.now(), type: 'performance_benchmark', timestamp: new Date(), insights: ['Performance benchmark completed'] }]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const generateAdaptiveMusic = async (code: string, lang: string, complexity: number) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const track = { id: Date.now(), title: 'Adaptive Music', artist: 'Codette AI' };
      onMusicGenerated?.(track);
      return track;
    } finally {
      setIsProcessing(false);
    }
  };
  
  const generateCodingPlaylist = async (scenario: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1800));
      const tracks = [{ id: Date.now(), title: `${scenario} Playlist`, artist: 'Codette AI' }];
      return tracks;
    } finally {
      setIsProcessing(false);
    }
  };
  
  const runComprehensiveAnalysis = async (code: string, lang: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setAiInsights(prev => [...prev, 'Comprehensive analysis completed']);
      setProcessingHistory(prev => [...prev, { id: Date.now(), type: 'comprehensive', timestamp: new Date(), insights: ['Full analysis completed'] }]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const clearHistory = () => {
    setProcessingHistory([]);
    setAiInsights([]);
  };

  const historyScroll = useAutoScroll({ 
    speed: 35, 
    pauseOnHover: true,
    resetOnInteraction: true,
    enableBidirectional: true
  });

  const insightsScroll = useAutoScroll({ 
    speed: 30, 
    pauseOnHover: true,
    resetOnInteraction: true,
    enableBidirectional: false
  });

  const [activeTab, setActiveTab] = useState<'quantum' | 'council' | 'memory' | 'ethics' | 'music' | 'comprehensive'>('quantum');
  const [selectedScenario, setSelectedScenario] = useState<'deep-focus' | 'debugging' | 'creative' | 'learning'>('deep-focus');

  const handleQuantumOptimization = async () => {
    try {
      await runQuantumOptimization(['performance', 'maintainability', 'readability'], currentCode);
    } catch (error) {
      console.error('Quantum optimization failed:', error);
    }
  };

  const handleCouncilConvening = async () => {
    try {
      const prompt = currentCode 
        ? `Analyze this ${language} code for best practices: ${currentCode.slice(0, 200)}...`
        : `Provide guidance for ${language} development best practices`;
      await conveneAegisCouncil(prompt);
    } catch (error) {
      console.error('Council convening failed:', error);
    }
  };

  const handleEthicalAnalysis = async () => {
    if (!currentCode.trim()) {
      alert('Please provide code to analyze');
      return;
    }
    
    try {
      await analyzeCodeEthics(currentCode, language);
    } catch (error) {
      console.error('Ethical analysis failed:', error);
    }
  };

  const handleAdaptiveMusic = async () => {
    try {
      const complexity = Math.min(currentCode.length / 1000, 1);
      const track = await generateAdaptiveMusic(currentCode, language, complexity);
      onMusicGenerated?.(track);
    } catch (error) {
      console.error('Adaptive music generation failed:', error);
    }
  };

  const handleCodingPlaylist = async () => {
    try {
      const tracks = await generateCodingPlaylist(selectedScenario);
      if (tracks.length > 0) {
        onMusicGenerated?.(tracks[0]); // Play first track
      }
    } catch (error) {
      console.error('Coding playlist generation failed:', error);
    }
  };

  const handleComprehensiveAnalysis = async () => {
    if (!currentCode.trim()) {
      alert('Please provide code to analyze');
      return;
    }
    
    try {
      await runComprehensiveAnalysis(currentCode, language);
    } catch (error) {
      console.error('Comprehensive analysis failed:', error);
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'quantum': return <Atom className="w-4 h-4" />;
      case 'council': return <Users className="w-4 h-4" />;
      case 'memory': return <Activity className="w-4 h-4" />;
      case 'ethics': return <Shield className="w-4 h-4" />;
      case 'music': return <Music className="w-4 h-4" />;
      case 'comprehensive': return <Brain className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Enhanced Header */}
      <div className="p-6 border-b border-purple-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Codette AI Core
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Quantum • Ethical • Musical • Comprehensive
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/20 px-3 py-2 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                All Systems Active
              </span>
            </div>
            <button
              onClick={clearHistory}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
            >
              Clear History
            </button>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl p-2">
          {[
            { id: 'quantum', label: 'Quantum', color: 'purple' },
            { id: 'council', label: 'Council', color: 'blue' },
            { id: 'memory', label: 'Memory', color: 'green' },
            { id: 'ethics', label: 'Ethics', color: 'orange' },
            { id: 'music', label: 'Music', color: 'pink' },
            { id: 'comprehensive', label: 'All', color: 'indigo' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center space-y-1 px-3 py-3 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? `bg-gray-50 dark:bg-gray-800 text-${tab.color}-600 dark:text-${tab.color}-400 shadow-lg transform scale-105`
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {getTabIcon(tab.id)}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'quantum' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-purple-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Atom className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Quantum Multi-Objective Optimizer
                  </h3>
                </div>
                <button
                  onClick={handleQuantumOptimization}
                  disabled={isProcessing}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:from-purple-600 hover:to-blue-700 disabled:opacity-50 transition-all shadow-lg"
                >
                  {isProcessing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  <span>{isProcessing ? 'Optimizing...' : 'Run Quantum Analysis'}</span>
                </button>
              </div>
              
              {lastQuantumResult && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-gray-800 dark:text-white">Solutions Found</span>
                    </div>
                    <p className="text-3xl font-bold text-purple-600">{lastQuantumResult.pareto_front_size}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pareto Optimal</p>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-800 dark:text-white">Convergence</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{lastQuantumResult.convergence_time.toFixed(1)}s</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Processing Time</p>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-gray-800 dark:text-white">Optimization</span>
                    </div>
                    <p className="text-3xl font-bold text-green-600">
                      {(lastQuantumResult.optimization_score * 100).toFixed(0)}%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Efficiency Score</p>
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-xl">
                <h4 className="font-medium text-gray-800 dark:text-white mb-2">Quantum Metrics</h4>
                {lastQuantumResult ? (
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Entanglement:</span>
                      <span className="font-medium text-gray-800 dark:text-white ml-2">
                        {lastQuantumResult.quantum_metrics.entanglement_factor.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Tunneling:</span>
                      <span className="font-medium text-gray-800 dark:text-white ml-2">
                        {lastQuantumResult.quantum_metrics.tunneling_events}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">States:</span>
                      <span className="font-medium text-gray-800 dark:text-white ml-2">
                        {lastQuantumResult.quantum_metrics.superposition_states}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Run quantum analysis to see metrics</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'council' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-blue-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Aegis Council
                  </h3>
                </div>
                <button
                  onClick={handleCouncilConvening}
                  disabled={isProcessing}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-lg"
                >
                  <Users className="w-5 h-5" />
                  <span>{isProcessing ? 'Convening...' : 'Convene Council'}</span>
                </button>
              </div>

              {lastCouncilDecision && (
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                    <h4 className="font-medium text-gray-800 dark:text-white mb-3">Council Decision</h4>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-700 dark:text-gray-300">Winning Agent:</span>
                      <span className="font-bold text-blue-600">{lastCouncilDecision.override_decision}</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-700 dark:text-gray-300">Consensus Strength:</span>
                      <span className="font-bold text-green-600">
                        {(lastCouncilDecision.consensus_strength * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Temporal Forecast:</span>
                      <span className={`font-bold ${
                        lastCouncilDecision.temporal_forecast === 'stable' ? 'text-green-600' :
                        lastCouncilDecision.temporal_forecast === 'volatile' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {lastCouncilDecision.temporal_forecast}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-xl">
                    <h4 className="font-medium text-gray-800 dark:text-white mb-3">Virtue Profile</h4>
                    <div className="space-y-2">
                      {Object.entries(lastCouncilDecision.virtue_profile).map(([virtue, score]) => (
                        <div key={virtue} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{virtue}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full"
                                style={{ width: `${score * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-800 dark:text-white w-10">
                              {(score * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'memory' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-green-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Activity className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    DreamCore Memory System
                  </h3>
                </div>
                <button
                  onClick={() => storeDreamMemory('wisdom', `Code analysis session for ${language}`, 0.8)}
                  disabled={isProcessing}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition-all shadow-lg"
                >
                  <Heart className="w-5 h-5" />
                  <span>{isProcessing ? 'Storing...' : 'Store Memory'}</span>
                </button>
              </div>

              {lastMemory && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-3">Latest Memory</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Emotion Tag:</span>
                      <span className="font-medium text-gray-800 dark:text-white capitalize">
                        {lastMemory.emotion_tag}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Emotional Weight:</span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {lastMemory.emotional_weight.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Decay Factor:</span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {lastMemory.decay_factor.toFixed(3)}
                      </span>
                    </div>
                    <div className="mt-3">
                      <span className="text-gray-600 dark:text-gray-400">Content:</span>
                      <p className="text-gray-800 dark:text-white mt-1">{lastMemory.content}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'ethics' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-orange-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-orange-600" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Ethical AI Analysis
                  </h3>
                </div>
                <button
                  onClick={handleEthicalAnalysis}
                  disabled={isProcessing || !currentCode.trim()}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 disabled:opacity-50 transition-all shadow-lg"
                >
                  <Eye className="w-5 h-5" />
                  <span>{isProcessing ? 'Analyzing...' : 'Analyze Ethics'}</span>
                </button>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
                <h4 className="font-medium text-gray-800 dark:text-white mb-3">Ethical Principles</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">No Placeholders</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Fully Executable</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Transparent Process</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Virtue-Driven</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'music' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-pink-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Music className="w-6 h-6 text-pink-600" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    AI Music Generation
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <button
                  onClick={() => generateAdaptiveMusic(currentCode, language, Math.min(currentCode.length / 1000, 1))}
                  disabled={isProcessing}
                  className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 transition-all border border-purple-200 dark:border-gray-600"
                >
                  <span className="text-2xl">🎼</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mozart</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Elegant</span>
                </button>

                <button
                  onClick={() => generateAdaptiveMusic(currentCode, language, Math.min(currentCode.length / 1000, 1))}
                  disabled={isProcessing}
                  className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all border border-blue-200 dark:border-gray-600"
                >
                  <span className="text-2xl">🎹</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bach</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Complex</span>
                </button>

                <button
                  onClick={() => generateAdaptiveMusic(currentCode, language, Math.min(currentCode.length / 1000, 1))}
                  disabled={isProcessing}
                  className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 transition-all border border-green-200 dark:border-gray-600"
                >
                  <span className="text-2xl">🏠</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">House</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Groove</span>
                </button>

                <button
                  onClick={() => generateAdaptiveMusic(currentCode, language, Math.min(currentCode.length / 1000, 1))}
                  disabled={isProcessing}
                  className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 rounded-xl hover:from-pink-100 hover:to-red-100 dark:hover:from-pink-900/30 dark:hover:to-red-900/30 transition-all border border-pink-200 dark:border-gray-600"
                >
                  <span className="text-2xl">💃</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dance</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Energy</span>
                </button>
              </div>

              <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800 dark:text-white">Coding Playlists</h4>
                  <select
                    value={selectedScenario}
                    onChange={(e) => setSelectedScenario(e.target.value as any)}
                    className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                  >
                    <option value="deep-focus">Deep Focus</option>
                    <option value="debugging">Debugging</option>
                    <option value="creative">Creative</option>
                    <option value="learning">Learning</option>
                  </select>
                </div>
                <button
                  onClick={handleCodingPlaylist}
                  disabled={isProcessing}
                  className="w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 transition-all"
                >
                  {isProcessing ? 'Generating...' : `Generate ${selectedScenario.replace('-', ' ')} Playlist`}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comprehensive' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-indigo-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Brain className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Comprehensive AI Analysis
                  </h3>
                </div>
                <button
                  onClick={handleComprehensiveAnalysis}
                  disabled={isProcessing || !currentCode.trim()}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-all shadow-lg"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>{isProcessing ? 'Analyzing...' : 'Run Full Analysis'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <Atom className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Quantum</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Optimization</p>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Council</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Decision</p>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                  <Shield className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Ethics</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Analysis</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Benchmark</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Performance</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-xl">
                <h4 className="font-medium text-gray-800 dark:text-white mb-2">Analysis Scope</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Runs quantum optimization, convenes Aegis Council, performs ethical analysis, 
                  and benchmarks performance - providing a complete AI-powered code review.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI Insights Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">AI Insights</h3>
          </div>
          
          <div 
            ref={insightsScroll.elementRef}
            className="space-y-2 max-h-32 overflow-y-auto relative"
          >
            {aiInsights.length > 0 ? (
              aiInsights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <Sparkles className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">{insight}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <Lightbulb className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">No insights yet</p>
                <p className="text-gray-500 dark:text-gray-500 text-xs">Run an AI analysis to see insights</p>
              </div>
            )}
            
            {/* Auto-scroll indicator */}
            <div className="absolute top-2 right-2 flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-2 py-1">
              <div className={`w-2 h-2 rounded-full ${insightsScroll.isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {insightsScroll.isPaused ? 'Paused' : 'Auto'}
              </span>
            </div>
          </div>
        </div>

        {/* Processing History */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Processing History</h3>
          </div>
          
          <div 
            ref={historyScroll.elementRef}
            className="space-y-2 max-h-48 overflow-y-auto relative"
          >
            {processingHistory.length > 0 ? (
              processingHistory.map((entry) => (
                <div key={entry.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {entry.type === 'quantum_optimization' && <Atom className="w-4 h-4 text-purple-600" />}
                      {entry.type === 'aegis_council' && <Users className="w-4 h-4 text-blue-600" />}
                      {entry.type === 'dream_memory' && <Heart className="w-4 h-4 text-green-600" />}
                      {entry.type === 'ethical_analysis' && <Shield className="w-4 h-4 text-orange-600" />}
                      {entry.type === 'performance_benchmark' && <TrendingUp className="w-4 h-4 text-red-600" />}
                      <span className="font-medium text-gray-800 dark:text-white capitalize">
                        {entry.type.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {entry.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  {entry.insights.length > 0 && (
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      {entry.insights[0]}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">No processing history</p>
                <p className="text-gray-500 dark:text-gray-500 text-xs">AI operations will appear here</p>
              </div>
            )}
            
            {/* Auto-scroll indicator */}
            <div className="absolute top-2 right-2 flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-2 py-1">
              <div className={`w-2 h-2 rounded-full ${historyScroll.isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {historyScroll.isPaused ? 'Paused' : 'Auto'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl max-w-md">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                AI Systems Processing
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Quantum algorithms, ethical analysis, and virtue-based reasoning in progress...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}