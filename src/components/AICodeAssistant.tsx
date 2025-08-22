import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Wand2, 
  Lightbulb, 
  Code, 
  Zap, 
  Target,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  FileText,
  Sparkles
} from 'lucide-react';
import { aiCodeService } from '../services/aiCodeService';

interface AICodeAssistantProps {
  currentCode: string;
  language: string;
  onCodeChange: (code: string) => void;
}

export function AICodeAssistant({ currentCode, language, onCodeChange }: AICodeAssistantProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [codeQuality, setCodeQuality] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'suggestions' | 'quality' | 'docs'>('suggestions');

  useEffect(() => {
    if (currentCode.trim()) {
      analyzeCode();
    }
  }, [currentCode, language]);

  const analyzeCode = async () => {
    setIsAnalyzing(true);
    try {
      const quality = await aiCodeService.analyzeCodeQuality(currentCode, language);
      setCodeQuality(quality);
      
      // Get AI suggestions for improvements
      const optimizations = await aiCodeService.getCodeOptimization(currentCode, language);
      setSuggestions(optimizations);
    } catch (error) {
      console.warn('AI analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applySuggestion = (suggestion: any) => {
    onCodeChange(suggestion.text);
  };

  const getQualityColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityBg = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 0.6) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  const getLanguageQuickRef = (languageName: string) => {
    const references: Record<string, JSX.Element> = {
      'JavaScript': (
        <div className="space-y-2 text-sm">
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <code className="text-yellow-800 dark:text-yellow-200">const variable = value;</code>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Variable declaration</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <code className="text-blue-800 dark:text-blue-200">function name() {}</code>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Function declaration</p>
          </div>
        </div>
      ),
      'Python': (
        <div className="space-y-2 text-sm">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <code className="text-green-800 dark:text-green-200">def function_name():</code>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Function definition</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <code className="text-blue-800 dark:text-blue-200">class ClassName:</code>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Class definition</p>
          </div>
        </div>
      ),
      'CSS': (
        <div className="space-y-2 text-sm">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <code className="text-blue-800 dark:text-blue-200">.selector {`{ property: value; }`}</code>
            <p className="text-gray-600 dark:text-gray-400 mt-1">CSS rule</p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <code className="text-purple-800 dark:text-purple-200">@media (max-width: 768px)</code>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Media query</p>
          </div>
        </div>
      )
    };

    return references[languageName] || (
      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Documentation for {languageName} is being prepared...
        </p>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">AI Assistant</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Powered by Hugging Face</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {[
            { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
            { id: 'quality', label: 'Quality', icon: Target },
            { id: 'docs', label: 'Docs', icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gray-50 dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm'
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
        {activeTab === 'suggestions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-800 dark:text-white">AI Suggestions</h4>
              <button
                onClick={analyzeCode}
                disabled={isAnalyzing}
                className="flex items-center space-x-2 px-3 py-2 bg-purple-500 text-white text-xs font-medium rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAnalyzing ? 'Analyzing...' : 'Analyze'}</span>
              </button>
            </div>

            {suggestions.length > 0 ? (
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">
                        {suggestion.type}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {(suggestion.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                    
                    <pre className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-3 overflow-x-auto max-h-32">
                      {suggestion.text}
                    </pre>
                    
                    <button
                      onClick={() => applySuggestion(suggestion)}
                      className="w-full px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Apply Suggestion
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">No suggestions available</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Write some code to get AI suggestions</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'quality' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800 dark:text-white">Code Quality Analysis</h4>
            
            {codeQuality ? (
              <div className="space-y-4">
                {/* Quality Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-4 rounded-lg ${getQualityBg(codeQuality.maintainability)}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className={`w-5 h-5 ${getQualityColor(codeQuality.maintainability)}`} />
                      <span className="font-medium text-gray-800 dark:text-white">Maintainability</span>
                    </div>
                    <p className={`text-2xl font-bold ${getQualityColor(codeQuality.maintainability)}`}>
                      {(codeQuality.maintainability * 100).toFixed(0)}%
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${getQualityBg(1 - codeQuality.complexity)}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className={`w-5 h-5 ${getQualityColor(1 - codeQuality.complexity)}`} />
                      <span className="font-medium text-gray-800 dark:text-white">Simplicity</span>
                    </div>
                    <p className={`text-2xl font-bold ${getQualityColor(1 - codeQuality.complexity)}`}>
                      {((1 - codeQuality.complexity) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                {/* Suggestions */}
                {codeQuality.suggestions.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-800 dark:text-white mb-3">Improvement Suggestions</h5>
                    <div className="space-y-2">
                      {codeQuality.suggestions.map((suggestion: string, index: number) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700 dark:text-gray-300">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">No analysis available</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Write some code to see quality metrics</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800 dark:text-white">Language Documentation</h4>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h5 className="font-medium text-gray-800 dark:text-white mb-2">{language}</h5>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>Language:</strong> {language}</p>
                  <p><strong>AI Support:</strong> Available</p>
                  <p><strong>Features:</strong> Syntax highlighting, auto-completion, error detection</p>
                </div>
              </div>

              {/* Quick Reference */}
              <div className="space-y-3">
                <h5 className="font-medium text-gray-800 dark:text-white">Quick Reference</h5>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Documentation for {language} is being prepared...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}