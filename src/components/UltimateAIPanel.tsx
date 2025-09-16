import React, { useState } from 'react';
import { Brain, Atom, Heart, GitBranch, Eye, Zap, Activity, Target, Shield } from 'lucide-react';
import { QuantumCodeVisualizer } from './QuantumCodeVisualizer';
import { NeuralPredictionPanel } from './NeuralPredictionPanel';
import { EmotionalCodeAnalyzer } from './EmotionalCodeAnalyzer';
import { CodeEvolutionTracker } from './CodeEvolutionTracker';
import { AIInsights } from './AIInsights';
import { CocoonsViewer } from './CocoonsViewer';
import { QuantumVisualizer } from './QuantumVisualizer';
import { PerformanceMonitor } from './PerformanceMonitor';
import { CodeHealthDashboard } from './CodeHealthDashboard';
import { PersonalityPanel } from './PersonalityPanel';

interface UltimateAIPanelProps {
  currentCode: string;
  language: string;
  cursorPosition: number;
  onCodeGenerated: (code: string, title?: string) => void;
}

export function UltimateAIPanel({ 
  currentCode, 
  language, 
  cursorPosition, 
  onCodeGenerated 
}: UltimateAIPanelProps) {
  const [activePanel, setActivePanel] = useState<'quantum' | 'neural' | 'emotional' | 'evolution' | 'insights' | 'cocoons' | 'performance' | 'health' | 'personality' | 'security'>('quantum');
  const panels = [
    { id: 'quantum', label: 'Quantum', icon: Atom, color: 'purple' },
    { id: 'neural', label: 'Neural', icon: Brain, color: 'blue' },
    { id: 'emotional', label: 'Emotional', icon: Heart, color: 'pink' },
    { id: 'evolution', label: 'Evolution', icon: GitBranch, color: 'green' },
    { id: 'insights', label: 'Insights', icon: Eye, color: 'orange' },
    { id: 'cocoons', label: 'Cocoons', icon: Activity, color: 'indigo' },
    { id: 'performance', label: 'Performance', icon: Zap, color: 'red' },
    { id: 'health', label: 'Health', icon: Shield, color: 'emerald' },
    { id: 'personality', label: 'Personality', icon: Heart, color: 'pink' }
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Ultimate Header */}
      <div className="p-6 border-b border-purple-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-600 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-7 h-7 text-gray-50" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-50">
                Ultimate AI Analysis Suite
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Revolutionary • Quantum • Emotional • Evolutionary
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/20 px-4 py-2 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              All Systems Operational
            </span>
          </div>
        </div>

        {/* Revolutionary Panel Navigation */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 bg-gray-100 dark:bg-gray-700 rounded-xl p-3">
          {panels.map(panel => (
            <button
              key={panel.id}
              onClick={() => setActivePanel(panel.id as any)}
              className={`flex flex-col items-center space-y-2 px-3 py-3 rounded-lg text-xs font-medium transition-all transform hover:scale-105 ${
                activePanel === panel.id
                  ? `bg-${panel.color}-500 text-gray-50 shadow-lg scale-105`
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              <panel.icon className="w-5 h-5" />
              <span className="text-center leading-tight">{panel.label}</span>
              {activePanel === panel.id && (
                <div className="w-2 h-2 bg-gray-50 rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activePanel === 'quantum' && (
          <div className="space-y-6">
            <QuantumCodeVisualizer currentCode={currentCode} language={language} />
            <QuantumVisualizer />
          </div>
        )}

        {activePanel === 'neural' && (
          <NeuralPredictionPanel
            currentCode={currentCode}
            cursorPosition={cursorPosition}
            language={language}
            onPredictionAccepted={(prediction) => onCodeGenerated(prediction)}
          />
        )}

        {activePanel === 'emotional' && (
          <EmotionalCodeAnalyzer currentCode={currentCode} language={language} />
        )}

        {activePanel === 'evolution' && (
          <CodeEvolutionTracker currentCode={currentCode} language={language} />
        )}

        {activePanel === 'insights' && (
          <AIInsights />
        )}

        {activePanel === 'cocoons' && (
          <CocoonsViewer />
        )}

        {activePanel === 'performance' && (
          <PerformanceMonitor currentCode={currentCode} language={language} />
        )}

        {activePanel === 'health' && (
          <CodeHealthDashboard currentCode={currentCode} language={language} />
        )}

        {activePanel === 'personality' && (
          <PersonalityPanel
            currentCode={currentCode}
            userSkillLevel={0.7} // This would come from user profile
            onPersonalizedResponse={(response) => console.log('Personalized response:', response)}
          />
        )}
      </div>

      {/* Ultimate Status Bar */}
      <div className="p-4 border-t border-purple-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Atom className="w-4 h-4 text-purple-600" />
              <span className="text-gray-700 dark:text-gray-300">Quantum Analysis Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-blue-600" />
              <span className="text-gray-700 dark:text-gray-300">Neural Prediction Ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-pink-600" />
              <span className="text-gray-700 dark:text-gray-300">Emotional Intelligence Online</span>
            </div>
          </div>
          
          <div className="text-gray-500 dark:text-gray-400">
            © 2025 Raiff's Bits - Revolutionary AI Technology
          </div>
        </div>
      </div>
    </div>
  );
}