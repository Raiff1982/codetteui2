import React, { useState, useEffect } from 'react';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { 
  Brain, 
  Lightbulb, 
  Target, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface Insight {
  id: string;
  type: 'optimization' | 'security' | 'performance' | 'ethics';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export function AIInsights() {
  const insightsScroll = useAutoScroll({ 
    speed: 35, 
    pauseOnHover: true,
    resetOnInteraction: true,
    enableBidirectional: true
  });

  const [insights, setInsights] = useState<Insight[]>([]);
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);

  useEffect(() => {
    // Generate sample insights based on the AI analysis
    const sampleInsights: Insight[] = [
      {
        id: '1',
        type: 'optimization',
        title: 'Code Complexity Reduction Opportunity',
        description: 'The quantum optimizer identified 3 functions that could be simplified using recursive patterns, potentially reducing complexity by 23%.',
        confidence: 0.87,
        impact: 'high',
        timestamp: new Date(Date.now() - 5 * 60 * 1000)
      },
      {
        id: '2',
        type: 'security',
        title: 'Ethical Filter Recommendation',
        description: 'The Aegis Council suggests implementing additional input validation to prevent potential security vulnerabilities.',
        confidence: 0.92,
        impact: 'high',
        timestamp: new Date(Date.now() - 12 * 60 * 1000)
      },
      {
        id: '3',
        type: 'performance',
        title: 'Memory Usage Optimization',
        description: 'Temporal analysis indicates memory usage could be reduced by 15% through better caching strategies.',
        confidence: 0.78,
        impact: 'medium',
        timestamp: new Date(Date.now() - 18 * 60 * 1000)
      },
      {
        id: '4',
        type: 'ethics',
        title: 'Virtue Profile Enhancement',
        description: 'Current code demonstrates high integrity (92%) and wisdom (89%). Consider enhancing compassion aspects in user interactions.',
        confidence: 0.85,
        impact: 'medium',
        timestamp: new Date(Date.now() - 25 * 60 * 1000)
      }
    ];
    setInsights(sampleInsights);
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <Target className="w-5 h-5" />;
      case 'security': return <AlertCircle className="w-5 h-5" />;
      case 'performance': return <TrendingUp className="w-5 h-5" />;
      case 'ethics': return <Sparkles className="w-5 h-5" />;
      default: return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'optimization': return 'text-blue-600';
      case 'security': return 'text-red-600';
      case 'performance': return 'text-green-600';
      case 'ethics': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-blue-100 dark:border-gray-700">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            AI Insights & Recommendations
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Powered by Quantum Analysis & Aegis Council
          </p>
        </div>
      </div>

      {/* Insights Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { type: 'optimization', count: insights.filter(i => i.type === 'optimization').length, color: 'blue' },
          { type: 'security', count: insights.filter(i => i.type === 'security').length, color: 'red' },
          { type: 'performance', count: insights.filter(i => i.type === 'performance').length, color: 'green' },
          { type: 'ethics', count: insights.filter(i => i.type === 'ethics').length, color: 'purple' }
        ].map(item => (
          <div key={item.type} className={`p-3 bg-${item.color}-50 dark:bg-${item.color}-900/20 rounded-lg`}>
            <div className="flex items-center space-x-2 mb-1">
              <div className={`text-${item.color}-600`}>
                {getInsightIcon(item.type)}
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-white capitalize">
                {item.type}
              </span>
            </div>
            <p className={`text-xl font-bold text-${item.color}-600`}>{item.count}</p>
          </div>
        ))}
      </div>

      {/* Insights List */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-800 dark:text-white mb-3">Recent Insights</h4>
        <div 
          ref={insightsScroll.elementRef}
          className="max-h-80 overflow-y-auto space-y-3 relative"
        >
          {insights.map(insight => (
            <div
              key={insight.id}
              onClick={() => setSelectedInsight(insight)}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border-l-4 border-transparent hover:border-blue-500"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={getInsightColor(insight.type)}>
                    {getInsightIcon(insight.type)}
                  </div>
                  <h5 className="font-medium text-gray-800 dark:text-white">
                    {insight.title}
                  </h5>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                    {insight.impact}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimeAgo(insight.timestamp)}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {insight.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Confidence: {(insight.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${insight.confidence * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
          
          {/* Auto-scroll indicator */}
          <div className="absolute top-2 right-2 flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-2 py-1">
            <div className={`w-2 h-2 rounded-full ${insightsScroll.isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {insightsScroll.isPaused ? 'Paused' : 'Auto'}
            </span>
          </div>
        </div>
      </div>

      {/* Insight Detail Modal */}
      {selectedInsight && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={getInsightColor(selectedInsight.type)}>
                  {getInsightIcon(selectedInsight.type)}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {selectedInsight.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInsight(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <span className="text-gray-500 text-xl">×</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                {selectedInsight.description}
              </p>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Confidence</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-white">
                    {(selectedInsight.confidence * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Impact</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-white capitalize">
                    {selectedInsight.impact}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-white capitalize">
                    {selectedInsight.type}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedInsight(null)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all">
                  Apply Recommendation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}