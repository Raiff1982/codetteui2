import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Wifi, TrendingUp, Zap, Clock, Target } from 'lucide-react';
import { performanceOptimizer, PerformanceMetrics, OptimizationSuggestion } from '../services/performanceOptimizer';

interface PerformanceMonitorProps {
  currentCode: string;
  language: string;
}

export function PerformanceMonitor({ currentCode, language }: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [benchmarkResults, setBenchmarkResults] = useState<any>(null);

  useEffect(() => {
    if (isMonitoring) {
      performanceOptimizer.startMonitoring();
      const interval = setInterval(() => {
        const currentMetrics = performanceOptimizer.getCurrentMetrics();
        setMetrics(currentMetrics);
      }, 2000);

      return () => {
        clearInterval(interval);
        performanceOptimizer.stopMonitoring();
      };
    }
  }, [isMonitoring]);

  useEffect(() => {
    if (currentCode.trim()) {
      analyzePerformance();
    }
  }, [currentCode]);

  const analyzePerformance = async () => {
    try {
      const optimizationSuggestions = await performanceOptimizer.analyzeCodePerformance(currentCode, language);
      setSuggestions(optimizationSuggestions);
    } catch (error) {
      console.error('Performance analysis failed:', error);
    }
  };

  const runBenchmark = async () => {
    try {
      const results = await performanceOptimizer.benchmarkCode(currentCode);
      setBenchmarkResults(results);
    } catch (error) {
      console.error('Benchmark failed:', error);
    }
  };

  const getMetricColor = (value: number, isHighGood: boolean = true) => {
    if (isHighGood) {
      if (value > 0.85) return 'text-green-600';
      if (value > 0.65) return 'text-yellow-600';
      return 'text-red-600';
    } else {
      if (value < 0.25) return 'text-green-600';
      if (value < 0.55) return 'text-yellow-600';
      return 'text-red-600';
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

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-green-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-gray-50" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-50">
              Performance Monitor
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time performance analysis
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isMonitoring 
                ? 'bg-green-500 text-gray-50 hover:bg-green-600' 
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>{isMonitoring ? 'Monitoring' : 'Start Monitor'}</span>
          </button>
          
          <button
            onClick={runBenchmark}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-gray-50 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            <Zap className="w-4 h-4" />
            <span>Benchmark</span>
          </button>
        </div>
      </div>

      {/* Real-time Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-800 dark:text-gray-50">Execution</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{metrics.execution_time.toFixed(1)}ms</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Load time</p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <HardDrive className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-800 dark:text-gray-50">Memory</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {(metrics.memory_usage / 1024 / 1024).toFixed(1)}MB
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Heap usage</p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Cpu className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-800 dark:text-gray-50">CPU</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {(metrics.cpu_utilization * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Utilization</p>
          </div>
          
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Wifi className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-gray-800 dark:text-gray-50">Network</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">
              {metrics.network_efficiency.toFixed(1)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Efficiency</p>
          </div>
          
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-red-600" />
              <span className="font-medium text-gray-800 dark:text-gray-50">Render</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{metrics.render_performance}fps</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Frame rate</p>
          </div>
          
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-indigo-600" />
              <span className="font-medium text-gray-800 dark:text-gray-50">UX Score</span>
            </div>
            <p className="text-2xl font-bold text-indigo-600">
              {(metrics.user_experience_score * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">User experience</p>
          </div>
        </div>
      )}

      {/* Optimization Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-lg mb-4">
          <h4 className="font-medium text-gray-800 dark:text-gray-50 mb-4">Performance Optimization Suggestions</h4>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-800 dark:text-gray-50 capitalize">
                      {suggestion.type} Optimization
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(suggestion.impact)}`}>
                      {suggestion.impact} impact
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{(suggestion.estimated_improvement * 100).toFixed(0)}% improvement
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {suggestion.description}
                </p>
                
                <div className="bg-gray-100 dark:bg-gray-600 rounded p-3 mb-3">
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    <strong>Implementation:</strong> {suggestion.implementation}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    suggestion.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    suggestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {suggestion.difficulty} difficulty
                  </span>
                  
                  <button className="px-3 py-1 bg-blue-500 text-gray-50 rounded text-sm hover:bg-blue-600 transition-colors">
                    Apply Optimization
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Benchmark Results */}
      {benchmarkResults && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 dark:text-gray-50 mb-4">Benchmark Results</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Average Time:</span>
              <p className="font-bold text-blue-600">{benchmarkResults.average_time.toFixed(3)}ms</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Min Time:</span>
              <p className="font-bold text-green-600">{benchmarkResults.min_time.toFixed(3)}ms</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Max Time:</span>
              <p className="font-bold text-red-600">{benchmarkResults.max_time.toFixed(3)}ms</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Memory Delta:</span>
              <p className="font-bold text-purple-600">
                {(benchmarkResults.memory_delta / 1024).toFixed(1)}KB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}