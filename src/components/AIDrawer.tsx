import React, { useState, Suspense } from 'react';
import { X, Brain, BarChart3, Atom, Shield, Sparkles, Crown, Activity } from 'lucide-react';
import { aiCodeService } from '../services/aiCodeService';

// Lazy load heavy AI components
const LazyEnhancedAIPanel = React.lazy(() => 
  import('./EnhancedAIPanel').then(module => ({ default: module.EnhancedAIPanel }))
);

const LazyQuantumCodeVisualizer = React.lazy(() => 
  import('./QuantumCodeVisualizer').then(module => ({ default: module.QuantumCodeVisualizer }))
);

const LazyUltimateAIPanel = React.lazy(() => 
  import('./UltimateAIPanel').then(module => ({ default: module.UltimateAIPanel }))
);

const LazyCodeHealthDashboard = React.lazy(() => 
  import('./CodeHealthDashboard').then(module => ({ default: module.CodeHealthDashboard }))
);

interface AIDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeFile?: { id: string; name: string; content: string; type: string };
}

type TabType = 'assist' | 'analyze' | 'visualize' | 'ethics';

const tabs = [
  { id: 'assist' as TabType, label: 'Assist', icon: Brain, description: 'AI-powered coding assistance' },
  { id: 'analyze' as TabType, label: 'Analyze', icon: BarChart3, description: 'Code analysis and insights' },
  { id: 'visualize' as TabType, label: 'Visualize', icon: Atom, description: 'Quantum code visualization' },
  { id: 'ethics' as TabType, label: 'Ethics', icon: Shield, description: 'Virtue-driven development' }
];

function LoadingFallback({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center p-8 h-full">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Loading {name}...
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Initializing AI components
        </p>
      </div>
    </div>
  );
}

export function AIDrawer({ isOpen, onClose, activeFile }: AIDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('assist');
  const [loadedTabs, setLoadedTabs] = useState<Set<TabType>>(new Set());

  const handleTabClick = (tabId: TabType) => {
    setActiveTab(tabId);
    setLoadedTabs(prev => new Set([...prev, tabId]));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-700 z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Assistant
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 p-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 whitespace-nowrap min-w-0 ${
                  isActive
                    ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                title={tab.description}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'assist' && (
            <Suspense fallback={<LoadingFallback name="AI Assistant" />}>
              {loadedTabs.has('assist') && (
                <LazyEnhancedAIPanel activeFile={activeFile} />
              )}
            </Suspense>
          )}

          {activeTab === 'analyze' && (
            <Suspense fallback={<LoadingFallback name="Code Analysis" />}>
              {loadedTabs.has('analyze') && (
                <LazyCodeHealthDashboard 
                  currentCode={activeFile?.content || ''}
                  language={activeFile?.name ? aiCodeService.getLanguageFromExtension(activeFile.name) : 'javascript'}
                />
              )}
            </Suspense>
          )}

          {activeTab === 'visualize' && (
            <Suspense fallback={<LoadingFallback name="Quantum Visualizer" />}>
              {loadedTabs.has('visualize') && (
                <LazyQuantumCodeVisualizer 
                  currentCode={activeFile?.content || ''}
                  language={activeFile?.name ? aiCodeService.getLanguageFromExtension(activeFile.name) : 'plaintext'}
                />
              )}
            </Suspense>
          )}

          {activeTab === 'ethics' && (
            <Suspense fallback={<LoadingFallback name="Ethics Panel" />}>
              {loadedTabs.has('ethics') && (
                <LazyUltimateAIPanel 
                  currentCode={activeFile?.content || ''}
                  language={activeFile?.name ? aiCodeService.getLanguageFromExtension(activeFile.name)?.name || 'plaintext' : 'plaintext'}
                />
              )}
            </Suspense>
          )}

          {/* Show initial content for unloaded tabs */}
          {!loadedTabs.has(activeTab) && (
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                {React.createElement(tabs.find(t => t.id === activeTab)?.icon || Brain, {
                  className: "w-8 h-8 text-purple-600 dark:text-purple-400"
                })}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {tabs.find(t => t.id === activeTab)?.label}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {tabs.find(t => t.id === activeTab)?.description}
              </p>
              <button
                onClick={() => handleTabClick(activeTab)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Load {tabs.find(t => t.id === activeTab)?.label}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}