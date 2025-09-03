import React, { useState } from 'react';
import { 
  Brain, 
  Atom, 
  Shield, 
  Eye, 
  TrendingUp,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { LazyLoadWrapper } from './LazyLoadWrapper';

interface AIDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentCode: string;
  language: string;
  cursorPosition: number;
  onCodeGenerated: (code: string, title?: string) => void;
}

export function AIDrawer({ 
  isOpen, 
  onClose, 
  currentCode, 
  language, 
  cursorPosition, 
  onCodeGenerated 
}: AIDrawerProps) {
  const [activeTab, setActiveTab] = useState<'assist' | 'analyze' | 'visualize' | 'ethics'>('assist');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs = [
    { id: 'assist', label: 'Assist', icon: Brain, description: 'Smart code assistance' },
    { id: 'analyze', label: 'Analyze', icon: Atom, description: 'Quantum analysis' },
    { id: 'visualize', label: 'Visualize', icon: Eye, description: 'Code visualization' },
    { id: 'ethics', label: 'Ethics', icon: Shield, description: 'Virtue-driven analysis' }
  ];

  if (!isOpen) return null;

  return (
    <div className={`fixed top-16 right-0 bottom-0 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-2xl z-40 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-96'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">AI Assistant</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Quantum • Ethical • Intelligent</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={isCollapsed ? 'Expand' : 'Collapse'}
            >
              {isCollapsed ? (
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Close AI Assistant"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        {!isCollapsed && (
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mt-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
                title={tab.description}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Collapsed State */}
      {isCollapsed && (
        <div className="p-2 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setIsCollapsed(false);
              }}
              className={`w-full p-3 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
              title={tab.description}
            >
              <tab.icon className="w-5 h-5 mx-auto" />
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'assist' && (
            <LazyLoadWrapper name="AI Code Assistant">
              <div className="p-4">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Smart Code Assistance</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Get intelligent suggestions, auto-corrections, and code optimizations powered by virtue-driven AI.
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => onCodeGenerated('// AI-generated function\nfunction optimizedFunction() {\n  // Implementation with virtue-driven principles\n  return "Hello, ethical world!";\n}')}
                      className="w-full px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
                    >
                      Generate Ethical Code
                    </button>
                    <button className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                      Optimize Current Code
                    </button>
                  </div>
                </div>
              </div>
            </LazyLoadWrapper>
          )}

          {activeTab === 'analyze' && (
            <LazyLoadWrapper name="Quantum Analyzer">
              <div className="p-4">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Atom className="w-5 h-5 text-purple-600" />
                    <h4 className="font-medium text-gray-800 dark:text-white">Quantum Analysis</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Advanced quantum-inspired optimization and code analysis using genuine research algorithms.
                  </p>
                  <button className="w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all text-sm">
                    Run Quantum Optimization
                  </button>
                </div>
              </div>
            </LazyLoadWrapper>
          )}

          {activeTab === 'visualize' && (
            <LazyLoadWrapper name="Code Visualizer">
              <div className="p-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Eye className="w-5 h-5 text-green-600" />
                    <h4 className="font-medium text-gray-800 dark:text-white">Code Visualization</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Visualize code structure, dependencies, and quantum states with interactive diagrams.
                  </p>
                  <button className="w-full px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all text-sm">
                    Generate Visualization
                  </button>
                </div>
              </div>
            </LazyLoadWrapper>
          )}

          {activeTab === 'ethics' && (
            <LazyLoadWrapper name="Ethical Analyzer">
              <div className="p-4">
                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-5 h-5 text-orange-600" />
                    <h4 className="font-medium text-gray-800 dark:text-white">Ethical Analysis</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Analyze code through virtue-driven principles: compassion, integrity, wisdom, and courage.
                  </p>
                  <button className="w-full px-3 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all text-sm">
                    Analyze Ethics
                  </button>
                </div>
              </div>
            </LazyLoadWrapper>
          )}
        </div>
      )}
    </div>
  );
}