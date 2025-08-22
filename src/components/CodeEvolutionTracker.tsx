import React, { useState, useEffect } from 'react';
import { TrendingUp, GitBranch, Clock, Target, Zap, Activity, Eye, RotateCcw } from 'lucide-react';

interface CodeEvolution {
  timestamp: Date;
  code_snapshot: string;
  complexity_score: number;
  quality_score: number;
  lines_of_code: number;
  functions_count: number;
  classes_count: number;
  comments_ratio: number;
  change_type: 'addition' | 'modification' | 'deletion' | 'refactor';
  impact_score: number;
}

interface EvolutionMetrics {
  total_changes: number;
  complexity_trend: 'increasing' | 'decreasing' | 'stable';
  quality_trend: 'improving' | 'declining' | 'stable';
  development_velocity: number;
  refactor_frequency: number;
  code_health_score: number;
}

interface CodeEvolutionTrackerProps {
  currentCode: string;
  language: string;
}

export function CodeEvolutionTracker({ currentCode, language }: CodeEvolutionTrackerProps) {
  const [evolution, setEvolution] = useState<CodeEvolution[]>([]);
  const [metrics, setMetrics] = useState<EvolutionMetrics | null>(null);
  const [isTracking, setIsTracking] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '24h' | '7d' | 'all'>('24h');

  useEffect(() => {
    if (isTracking && currentCode.trim()) {
      trackCodeEvolution();
    }
  }, [currentCode, isTracking]);

  useEffect(() => {
    if (evolution.length > 0) {
      calculateEvolutionMetrics();
    }
  }, [evolution]);

  const trackCodeEvolution = () => {
    const newEvolution: CodeEvolution = {
      timestamp: new Date(),
      code_snapshot: currentCode,
      complexity_score: calculateComplexity(currentCode),
      quality_score: calculateQuality(currentCode),
      lines_of_code: currentCode.split('\n').filter(line => line.trim()).length,
      functions_count: (currentCode.match(/function|const\s+\w+\s*=/g) || []).length,
      classes_count: (currentCode.match(/class\s+\w+/g) || []).length,
      comments_ratio: calculateCommentsRatio(currentCode),
      change_type: determineChangeType(currentCode, evolution[0]?.code_snapshot),
      impact_score: calculateImpactScore(currentCode, evolution[0]?.code_snapshot)
    };

    setEvolution(prev => [newEvolution, ...prev].slice(0, 100)); // Keep last 100 changes
  };

  const calculateComplexity = (code: string): number => {
    const cyclomaticComplexity = (code.match(/if|else|while|for|switch|case|catch|\?/g) || []).length;
    const nestingDepth = calculateNestingDepth(code);
    const linesOfCode = code.split('\n').filter(line => line.trim()).length;
    
    return Math.min(1, (cyclomaticComplexity * 0.4 + nestingDepth * 0.3 + linesOfCode * 0.001));
  };

  const calculateQuality = (code: string): number => {
    let quality = 0.5;
    
    // Positive quality indicators
    if (code.includes('try') && code.includes('catch')) quality += 0.2;
    if (code.includes('//') || code.includes('/*')) quality += 0.1;
    if (code.includes('test') || code.includes('spec')) quality += 0.2;
    if (code.includes('interface') || code.includes('type')) quality += 0.1;
    
    // Negative quality indicators
    if (code.includes('TODO') || code.includes('FIXME')) quality -= 0.1;
    if (code.includes('hack') || code.includes('workaround')) quality -= 0.1;
    if (code.length > 5000 && !code.includes('//')) quality -= 0.2;
    
    return Math.max(0, Math.min(1, quality));
  };

  const calculateCommentsRatio = (code: string): number => {
    const totalLines = code.split('\n').length;
    const commentLines = code.split('\n').filter(line => 
      line.trim().startsWith('//') || 
      line.trim().startsWith('/*') || 
      line.trim().startsWith('*')
    ).length;
    
    return totalLines > 0 ? commentLines / totalLines : 0;
  };

  const calculateNestingDepth = (code: string): number => {
    let maxDepth = 0;
    let currentDepth = 0;
    
    for (const char of code) {
      if (char === '{') {
        currentDepth++;
        maxDepth = Math.max(maxDepth, currentDepth);
      } else if (char === '}') {
        currentDepth--;
      }
    }
    
    return maxDepth;
  };

  const determineChangeType = (currentCode: string, previousCode?: string): CodeEvolution['change_type'] => {
    if (!previousCode) return 'addition';
    
    const currentLines = currentCode.split('\n').length;
    const previousLines = previousCode.split('\n').length;
    
    if (currentLines > previousLines * 1.1) return 'addition';
    if (currentLines < previousLines * 0.9) return 'deletion';
    if (currentCode.includes('refactor') || currentCode.includes('cleanup')) return 'refactor';
    return 'modification';
  };

  const calculateImpactScore = (currentCode: string, previousCode?: string): number => {
    if (!previousCode) return 0.5;
    
    const currentComplexity = calculateComplexity(currentCode);
    const previousComplexity = calculateComplexity(previousCode);
    const complexityChange = Math.abs(currentComplexity - previousComplexity);
    
    const currentQuality = calculateQuality(currentCode);
    const previousQuality = calculateQuality(previousCode);
    const qualityChange = Math.abs(currentQuality - previousQuality);
    
    return Math.min(1, (complexityChange + qualityChange) / 2);
  };

  const calculateEvolutionMetrics = () => {
    if (evolution.length < 2) return;

    const recentEvolution = filterByTimeframe(evolution, selectedTimeframe);
    
    const complexityTrend = calculateTrend(recentEvolution.map(e => e.complexity_score));
    const qualityTrend = calculateTrend(recentEvolution.map(e => e.quality_score));
    
    const refactorCount = recentEvolution.filter(e => e.change_type === 'refactor').length;
    const totalChanges = recentEvolution.length;
    
    const avgImpact = recentEvolution.reduce((sum, e) => sum + e.impact_score, 0) / recentEvolution.length;
    
    const newMetrics: EvolutionMetrics = {
      total_changes: totalChanges,
      complexity_trend: complexityTrend > 0.1 ? 'increasing' : complexityTrend < -0.1 ? 'decreasing' : 'stable',
      quality_trend: qualityTrend > 0.1 ? 'improving' : qualityTrend < -0.1 ? 'declining' : 'stable',
      development_velocity: totalChanges / Math.max(1, getTimeframeHours(selectedTimeframe)),
      refactor_frequency: refactorCount / totalChanges,
      code_health_score: calculateCodeHealth(recentEvolution)
    };
    
    setMetrics(newMetrics);
  };

  const calculateTrend = (values: number[]): number => {
    if (values.length < 2) return 0;
    
    let trend = 0;
    for (let i = 1; i < values.length; i++) {
      trend += values[i] - values[i - 1];
    }
    
    return trend / (values.length - 1);
  };

  const filterByTimeframe = (evolutions: CodeEvolution[], timeframe: string): CodeEvolution[] => {
    const now = new Date();
    const cutoff = new Date();
    
    switch (timeframe) {
      case '1h':
        cutoff.setHours(now.getHours() - 1);
        break;
      case '24h':
        cutoff.setDate(now.getDate() - 1);
        break;
      case '7d':
        cutoff.setDate(now.getDate() - 7);
        break;
      default:
        return evolutions;
    }
    
    return evolutions.filter(e => e.timestamp >= cutoff);
  };

  const getTimeframeHours = (timeframe: string): number => {
    switch (timeframe) {
      case '1h': return 1;
      case '24h': return 24;
      case '7d': return 168;
      default: return 1;
    }
  };

  const calculateCodeHealth = (evolutions: CodeEvolution[]): number => {
    if (evolutions.length === 0) return 0.5;
    
    const avgQuality = evolutions.reduce((sum, e) => sum + e.quality_score, 0) / evolutions.length;
    const avgComplexity = evolutions.reduce((sum, e) => sum + e.complexity_score, 0) / evolutions.length;
    const avgComments = evolutions.reduce((sum, e) => sum + e.comments_ratio, 0) / evolutions.length;
    
    return (avgQuality * 0.5 + (1 - avgComplexity) * 0.3 + avgComments * 0.2);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'decreasing':
      case 'declining':
        return <TrendingUp className="w-4 h-4 text-red-600 transform rotate-180" />;
      default:
        return <Activity className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getTrendColor = (trend: string, isPositive: boolean = true) => {
    if (trend === 'stable') return 'text-yellow-600';
    
    if (isPositive) {
      return trend === 'improving' || trend === 'decreasing' ? 'text-green-600' : 'text-red-600';
    } else {
      return trend === 'increasing' ? 'text-red-600' : 'text-green-600';
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-blue-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-600 rounded-xl flex items-center justify-center">
            <GitBranch className="w-6 h-6 text-gray-50" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-50">
              Code Evolution Tracker
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track how your code evolves over time
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-gray-50"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="all">All Time</option>
          </select>
          
          <button
            onClick={() => setIsTracking(!isTracking)}
            className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              isTracking 
                ? 'bg-green-500 text-gray-50 hover:bg-green-600' 
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>{isTracking ? 'Tracking' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* Evolution Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-800 dark:text-gray-50">Changes</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{metrics.total_changes}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total modifications</p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              {getTrendIcon(metrics.quality_trend)}
              <span className="font-medium text-gray-800 dark:text-gray-50">Quality</span>
            </div>
            <p className={`text-lg font-bold ${getTrendColor(metrics.quality_trend, true)} capitalize`}>
              {metrics.quality_trend}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Code quality trend</p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              {getTrendIcon(metrics.complexity_trend)}
              <span className="font-medium text-gray-800 dark:text-gray-50">Complexity</span>
            </div>
            <p className={`text-lg font-bold ${getTrendColor(metrics.complexity_trend, false)} capitalize`}>
              {metrics.complexity_trend}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Complexity trend</p>
          </div>
          
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-gray-800 dark:text-gray-50">Velocity</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">{metrics.development_velocity.toFixed(1)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Changes per hour</p>
          </div>
          
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <RotateCcw className="w-5 h-5 text-red-600" />
              <span className="font-medium text-gray-800 dark:text-gray-50">Refactors</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{(metrics.refactor_frequency * 100).toFixed(0)}%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Refactor frequency</p>
          </div>
          
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-indigo-600" />
              <span className="font-medium text-gray-800 dark:text-gray-50">Health</span>
            </div>
            <p className="text-2xl font-bold text-indigo-600">{(metrics.code_health_score * 100).toFixed(0)}%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Overall health</p>
          </div>
        </div>
      )}

      {/* Evolution Timeline */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
        <h4 className="font-medium text-gray-800 dark:text-gray-50 mb-4">Evolution Timeline</h4>
        
        {evolution.length > 0 ? (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {filterByTimeframe(evolution, selectedTimeframe).map((change, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${
                  change.change_type === 'addition' ? 'bg-green-500' :
                  change.change_type === 'deletion' ? 'bg-red-500' :
                  change.change_type === 'refactor' ? 'bg-purple-500' : 'bg-blue-500'
                }`} />
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-50 capitalize">
                      {change.change_type}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {change.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
                    <span>Lines: {change.lines_of_code}</span>
                    <span>Functions: {change.functions_count}</span>
                    <span>Quality: {(change.quality_score * 100).toFixed(0)}%</span>
                    <span>Impact: {(change.impact_score * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No evolution data yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Start coding to track your progress!</p>
          </div>
        )}
      </div>

      {/* Evolution Insights */}
      {metrics && (
        <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 dark:text-gray-50 mb-3">Evolution Insights</h4>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            {metrics.quality_trend === 'improving' && (
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span>Your code quality is improving over time - excellent work!</span>
              </div>
            )}
            
            {metrics.complexity_trend === 'decreasing' && (
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-green-600" />
                <span>Code complexity is decreasing - you're writing cleaner code!</span>
              </div>
            )}
            
            {metrics.refactor_frequency > 0.3 && (
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-4 h-4 text-purple-600" />
                <span>High refactoring activity indicates healthy code maintenance.</span>
              </div>
            )}
            
            {metrics.development_velocity > 5 && (
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <span>High development velocity - you're in the flow!</span>
              </div>
            )}
            
            {metrics.code_health_score > 0.8 && (
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-green-600" />
                <span>Excellent code health score - your code is thriving!</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}