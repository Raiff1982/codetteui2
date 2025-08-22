import React, { useState, useEffect } from 'react';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { 
  Lightbulb, 
  Sparkles, 
  Brain, 
  Zap, 
  Target,
  Clock,
  TrendingUp,
  Code,
  Atom,
  Heart,
  Eye,
  Cpu,
  ChevronRight,
  CheckCircle,
  Play
} from 'lucide-react';
import { aiAnticipationService, AnticipatedSuggestion, CreativeCodeSolution } from '../services/aiAnticipationService';

interface AIAnticipationPanelProps {
  currentCode: string;
  language: string;
  onCodeGenerated: (code: string) => void;
}

export function AIAnticipationPanel({ currentCode, language, onCodeGenerated }: AIAnticipationPanelProps) {
  const suggestionsScroll = useAutoScroll({ 
    speed: 40, 
    pauseOnHover: true,
    resetOnInteraction: true 
  });
  
  const solutionsScroll = useAutoScroll({ 
    speed: 35, 
    pauseOnHover: true,
    resetOnInteraction: true 
  });

  const [anticipatedSuggestions, setAnticipatedSuggestions] = useState<AnticipatedSuggestion[]>([]);
  const [creativeSolutions, setCreativeSolutions] = useState<CreativeCodeSolution[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'anticipation' | 'creative' | 'patterns'>('anticipation');
  const [selectedApproach, setSelectedApproach] = useState<CreativeCodeSolution['approach']>('quantum-inspired');

  useEffect(() => {
    if (currentCode.trim()) {
      analyzeAndAnticipate();
    }
  }, [currentCode, language]);

  const analyzeAndAnticipate = async () => {
    setIsGenerating(true);
    try {
      // Analyze user patterns
      const patterns = aiAnticipationService.analyzeUserPatterns([currentCode], [language]);
      
      // Generate anticipatory suggestions
      const suggestions = aiAnticipationService.generateAnticipatedSuggestions(currentCode, language, patterns);
      setAnticipatedSuggestions(suggestions);

      // Generate next step suggestions
      const nextSteps = aiAnticipationService.anticipateNextSteps(currentCode, language, []);
      setAnticipatedSuggestions(prev => [...prev, ...nextSteps]);
    } catch (error) {
      console.warn('AI anticipation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCreativeSolution = async (problem: string) => {
    setIsGenerating(true);
    try {
      const solution = aiAnticipationService.generateCreativeSolution(problem, selectedApproach);
      setCreativeSolutions(prev => [solution, ...prev].slice(0, 5));
    } catch (error) {
      console.warn('Creative solution generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getApproachIcon = (approach: CreativeCodeSolution['approach']) => {
    switch (approach) {
      case 'quantum-inspired': return <Atom className="w-4 h-4" />;
      case 'biomimetic': return <Heart className="w-4 h-4" />;
      case 'mathematical': return <Target className="w-4 h-4" />;
      case 'artistic': return <Sparkles className="w-4 h-4" />;
      case 'philosophical': return <Eye className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getApproachColor = (approach: CreativeCodeSolution['approach']) => {
    switch (approach) {
      case 'quantum-inspired': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'biomimetic': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'mathematical': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'artistic': return 'text-pink-600 bg-pink-100 dark:bg-pink-900/20';
      case 'philosophical': return 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">AI Anticipation</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Predictive Code Generation</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {[
            { id: 'anticipation', label: 'Anticipate', icon: Eye },
            { id: 'creative', label: 'Create', icon: Sparkles },
            { id: 'patterns', label: 'Patterns', icon: TrendingUp }
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
        {activeTab === 'anticipation' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-800 dark:text-white">Anticipated Needs</h4>
              <button
                onClick={analyzeAndAnticipate}
                disabled={isGenerating}
                className="flex items-center space-x-2 px-3 py-2 bg-purple-500 text-white text-xs font-medium rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>{isGenerating ? 'Analyzing...' : 'Anticipate'}</span>
              </button>
            </div>

            {anticipatedSuggestions.length > 0 ? (
              <div 
                ref={suggestionsScroll.elementRef}
                className="space-y-3 max-h-96 overflow-y-auto relative"
              >
                {anticipatedSuggestions.map(suggestion => (
                  <div key={suggestion.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Lightbulb className="w-4 h-4 text-yellow-500" />
                        <h5 className="font-medium text-gray-800 dark:text-white">{suggestion.title}</h5>
                      </div>
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">
                        {suggestion.category}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {suggestion.description}
                    </p>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-3">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        <strong>Reasoning:</strong> {suggestion.reasoning}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {suggestion.benefits.map(benefit => (
                          <span key={benefit} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
                            style={{ width: `${suggestion.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {(suggestion.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <button
                        onClick={() => onCodeGenerated(suggestion.code)}
                        className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <Play className="w-3 h-3" />
                        <span>Generate</span>
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Auto-scroll indicator */}
                <div className="absolute top-2 right-2 flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-2 py-1">
                  <div className={`w-2 h-2 rounded-full ${suggestionsScroll.isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {suggestionsScroll.isPaused ? 'Paused' : 'Auto'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">No anticipations yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Write some code to see AI predictions</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'creative' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-800 dark:text-white">Creative Solutions</h4>
              <select
                value={selectedApproach}
                onChange={(e) => setSelectedApproach(e.target.value as any)}
                className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white"
              >
                <option value="quantum-inspired">Quantum-Inspired</option>
                <option value="biomimetic">Biomimetic</option>
                <option value="mathematical">Mathematical</option>
                <option value="artistic">Artistic</option>
                <option value="philosophical">Philosophical</option>
              </select>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                {getApproachIcon(selectedApproach)}
                <h5 className="font-medium text-gray-800 dark:text-white capitalize">
                  {selectedApproach.replace('-', ' ')} Approach
                </h5>
              </div>
              <input
                type="text"
                placeholder="Describe the problem you want to solve..."
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white placeholder-gray-500 mb-3"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    generateCreativeSolution(e.currentTarget.value.trim());
                    e.currentTarget.value = '';
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.querySelector('input[placeholder*="problem"]') as HTMLInputElement;
                  if (input?.value.trim()) {
                    generateCreativeSolution(input.value.trim());
                    input.value = '';
                  }
                }}
                disabled={isGenerating}
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 transition-all"
              >
                {isGenerating ? 'Generating...' : 'Generate Creative Solution'}
              </button>
            </div>

            {creativeSolutions.length > 0 && (
              <div 
                ref={solutionsScroll.elementRef}
                className="space-y-3 max-h-96 overflow-y-auto relative"
              >
                <h5 className="font-medium text-gray-800 dark:text-white">Generated Solutions</h5>
                {creativeSolutions.map(solution => (
                  <div key={solution.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getApproachIcon(solution.approach)}
                        <h6 className="font-medium text-gray-800 dark:text-white">
                          {solution.approach.replace('-', ' ')} Solution
                        </h6>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Uniqueness:</span>
                        <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                            style={{ width: `${solution.uniqueness_score * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      <strong>Problem:</strong> {solution.problem}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      <strong>Solution:</strong> {solution.solution}
                    </p>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-3">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {solution.explanation}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => onCodeGenerated(solution.implementation)}
                      className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                    >
                      Implement Solution
                    </button>
                  </div>
                ))}
                
                {/* Auto-scroll indicator */}
                <div className="absolute top-2 right-2 flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-2 py-1">
                  <div className={`w-2 h-2 rounded-full ${solutionsScroll.isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {solutionsScroll.isPaused ? 'Paused' : 'Auto'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800 dark:text-white">Detected Patterns</h4>
            
            <div className="grid grid-cols-1 gap-3">
              {[
                { pattern: 'React Hooks Usage', confidence: 0.85, category: 'component', trend: 'increasing' },
                { pattern: 'API Integration', confidence: 0.78, category: 'utility', trend: 'stable' },
                { pattern: 'UI Styling Focus', confidence: 0.82, category: 'design', trend: 'increasing' },
                { pattern: 'Algorithm Optimization', confidence: 0.75, category: 'algorithm', trend: 'emerging' }
              ].map((pattern, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-800 dark:text-white">{pattern.pattern}</h5>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pattern.trend === 'increasing' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                      pattern.trend === 'stable' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                      'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                    }`}>
                      {pattern.trend}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {pattern.category}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full"
                          style={{ width: `${pattern.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {(pattern.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h5 className="font-medium text-gray-800 dark:text-white">Pattern Insights</h5>
              </div>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Strong focus on React component development</li>
                <li>• Increasing emphasis on user interface design</li>
                <li>• Emerging interest in performance optimization</li>
                <li>• Consistent API integration patterns</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Generation Status */}
      {isGenerating && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-purple-50 dark:bg-purple-900/20">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">
              AI is generating unique solutions...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}