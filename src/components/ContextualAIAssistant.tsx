import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Lightbulb, 
  Zap, 
  Target, 
  Eye, 
  Sparkles,
  MessageCircle,
  Code,
  Play,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useAI } from '../hooks/useAI';

interface ContextualAIAssistantProps {
  currentCode: string;
  language: string;
  cursorPosition: { line: number; column: number };
  selectedText: string;
  onCodeSuggestion: (code: string) => void;
  onExplanationRequest: (explanation: string) => void;
}

export function ContextualAIAssistant({ 
  currentCode, 
  language, 
  cursorPosition, 
  selectedText,
  onCodeSuggestion,
  onExplanationRequest
}: ContextualAIAssistantProps) {
  const { runQuantumOptimization, conveneCouncil, analyzeEthics, isProcessing } = useAI();
  const [contextualSuggestions, setContextualSuggestions] = useState<any[]>([]);
  const [aiChat, setAiChat] = useState<Array<{ role: 'user' | 'ai'; message: string; timestamp: Date }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [activeMode, setActiveMode] = useState<'suggestions' | 'chat' | 'analysis'>('suggestions');

  useEffect(() => {
    if (currentCode.trim()) {
      generateContextualSuggestions();
    }
  }, [currentCode, cursorPosition, selectedText]);

  const generateContextualSuggestions = async () => {
    const suggestions = [];

    // Context-aware suggestions based on cursor position
    const currentLine = currentCode.split('\n')[cursorPosition.line - 1] || '';
    
    if (currentLine.includes('function') && !currentLine.includes('{')) {
      suggestions.push({
        type: 'completion',
        title: 'Complete Function Body',
        description: 'Add function implementation with error handling',
        code: `{\n  try {\n    // Implementation here\n    return result;\n  } catch (error) {\n    console.error('Function error:', error);\n    throw error;\n  }\n}`,
        confidence: 0.9
      });
    }

    if (currentLine.includes('useState') && language === 'typescript') {
      suggestions.push({
        type: 'enhancement',
        title: 'Add State Type Safety',
        description: 'Enhance useState with proper TypeScript types',
        code: `interface StateType {\n  // Define your state structure\n}\n\nconst [state, setState] = useState<StateType>(initialValue);`,
        confidence: 0.85
      });
    }

    if (selectedText && selectedText.includes('fetch')) {
      suggestions.push({
        type: 'optimization',
        title: 'Enhance API Call',
        description: 'Add error handling, loading states, and retry logic',
        code: `const [loading, setLoading] = useState(false);\nconst [error, setError] = useState<string | null>(null);\n\nconst fetchData = async () => {\n  setLoading(true);\n  setError(null);\n  \n  try {\n    const response = await fetch(url);\n    if (!response.ok) throw new Error('Network response was not ok');\n    const data = await response.json();\n    return data;\n  } catch (err) {\n    setError(err instanceof Error ? err.message : 'Unknown error');\n    throw err;\n  } finally {\n    setLoading(false);\n  }\n};`,
        confidence: 0.88
      });
    }

    setContextualSuggestions(suggestions);
  };

  const handleAIChat = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user' as const, message: chatInput, timestamp: new Date() };
    setAiChat(prev => [...prev, userMessage]);

    try {
      // Use the Aegis Council for intelligent responses
      const decision = await conveneCouncil(chatInput);
      
      const aiResponse = {
        role: 'ai' as const,
        message: `Based on the Aegis Council analysis (Virtue Profile: Compassion ${(decision.virtue_profile.compassion * 100).toFixed(0)}%, Wisdom ${(decision.virtue_profile.wisdom * 100).toFixed(0)}%), here's my recommendation: ${generateContextualResponse(chatInput, decision)}`,
        timestamp: new Date()
      };
      
      setAiChat(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorResponse = {
        role: 'ai' as const,
        message: 'I apologize, but I encountered an issue processing your request. Please try again.',
        timestamp: new Date()
      };
      setAiChat(prev => [...prev, errorResponse]);
    }

    setChatInput('');
  };

  const generateContextualResponse = (input: string, decision: any): string => {
    if (input.toLowerCase().includes('optimize')) {
      return 'I recommend using the quantum multi-objective optimizer to find the best solution. This will analyze multiple performance metrics simultaneously.';
    }
    if (input.toLowerCase().includes('error') || input.toLowerCase().includes('bug')) {
      return 'Let me help you debug this. I suggest adding comprehensive error handling and using the ethical AI system to ensure robust code.';
    }
    if (input.toLowerCase().includes('design') || input.toLowerCase().includes('ui')) {
      return 'For UI design, consider using the virtue-driven approach focusing on compassion (user empathy) and wisdom (intuitive design).';
    }
    return 'I can help you with code optimization, debugging, design patterns, or any other development questions. What specific aspect would you like to explore?';
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
            <h3 className="font-semibold text-gray-800 dark:text-white">Contextual AI</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Intelligent code assistance</p>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {[
            { id: 'suggestions', label: 'Smart Suggestions', icon: Lightbulb },
            { id: 'chat', label: 'AI Chat', icon: MessageCircle },
            { id: 'analysis', label: 'Deep Analysis', icon: Target }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveMode(tab.id as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                activeMode === tab.id
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
        {activeMode === 'suggestions' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium text-gray-800 dark:text-white">Context Analysis</h4>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <p>• Line {cursorPosition.line}, Column {cursorPosition.column}</p>
                <p>• Language: {language}</p>
                {selectedText && <p>• Selected: "{selectedText.slice(0, 30)}..."</p>}
              </div>
            </div>

            {contextualSuggestions.length > 0 ? (
              <div className="space-y-3">
                <h5 className="font-medium text-gray-800 dark:text-white">Smart Suggestions</h5>
                {contextualSuggestions.map((suggestion, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h6 className="font-medium text-gray-800 dark:text-white">{suggestion.title}</h6>
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                        {suggestion.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {suggestion.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full"
                            style={{ width: `${suggestion.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {(suggestion.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <button
                        onClick={() => onCodeSuggestion(suggestion.code)}
                        className="px-3 py-2 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">No contextual suggestions</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Start typing to get AI suggestions</p>
              </div>
            )}
          </div>
        )}

        {activeMode === 'chat' && (
          <div className="space-y-4 h-full flex flex-col">
            <div className="flex-1 space-y-3 overflow-y-auto">
              {aiChat.length > 0 ? (
                aiChat.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">Start a conversation with AI</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">Ask about code optimization, debugging, or best practices</p>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAIChat()}
                placeholder="Ask the AI about your code..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleAIChat}
                disabled={!chatInput.trim() || isProcessing}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
              >
                <Play className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeMode === 'analysis' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => runQuantumOptimization()}
                disabled={isProcessing}
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 transition-all border border-purple-200 dark:border-gray-600"
              >
                <Zap className="w-6 h-6 text-purple-600" />
                <div className="text-left">
                  <h4 className="font-medium text-gray-800 dark:text-white">Quantum Code Optimization</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Multi-objective performance analysis</p>
                </div>
              </button>

              <button
                onClick={() => conveneCouncil(currentCode)}
                disabled={isProcessing}
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 transition-all border border-green-200 dark:border-gray-600"
              >
                <Target className="w-6 h-6 text-green-600" />
                <div className="text-left">
                  <h4 className="font-medium text-gray-800 dark:text-white">Aegis Council Review</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ethical and virtue-based code analysis</p>
                </div>
              </button>

              <button
                onClick={() => analyzeEthics([0.5, 0.7], [0.3, 0.4, 0.6])}
                disabled={isProcessing}
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg hover:from-orange-100 hover:to-red-100 dark:hover:from-orange-900/30 dark:hover:to-red-900/30 transition-all border border-orange-200 dark:border-gray-600"
              >
                <Eye className="w-6 h-6 text-orange-600" />
                <div className="text-left">
                  <h4 className="font-medium text-gray-800 dark:text-white">Ethical Analysis</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Virtue and ethics compliance check</p>
                </div>
              </button>
            </div>

            {isProcessing && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                    AI analysis in progress...
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}