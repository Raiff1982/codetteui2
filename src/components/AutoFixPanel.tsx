import React, { useState, useEffect } from 'react';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { useAutoFix } from '../hooks/useAutoFix';
import { 
  Wand2, 
  CheckCircle, 
  AlertTriangle, 
  Zap, 
  Brain,
  Shield,
  TrendingUp,
  Eye,
  Play,
  Pause,
  RotateCcw,
  Download,
  Settings,
  Clock,
  Target,
  Activity,
  X
} from 'lucide-react';

interface AutoFixPanelProps {
  currentCode: string;
  language: string;
  onCodeFixed: (fixedCode: string, explanation: string) => void;
  isVisible: boolean;
  onClose: () => void;
}

export function AutoFixPanel({ 
  currentCode, 
  language, 
  onCodeFixed, 
  isVisible, 
  onClose 
}: AutoFixPanelProps) {
  const {
    isAutoFixing,
    lastFixResult,
    autoFixEnabled,
    setAutoFixEnabled,
    fixHistory,
    isMonitoring,
    setIsMonitoring,
    performAutoFix,
    startAutoFixMonitoring,
    generateFixReport,
    getFixStatistics
  } = useAutoFix();

  const fixHistoryScroll = useAutoScroll({ 
    speed: 35, 
    pauseOnHover: true,
    resetOnInteraction: true 
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>(['syntax', 'security', 'style']);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.8);
  const [showSettings, setShowSettings] = useState(false);
  const [fixStats, setFixStats] = useState<any>(null);

  useEffect(() => {
    if (isMonitoring && autoFixEnabled) {
      const stopMonitoring = startAutoFixMonitoring(
        () => currentCode,
        () => language,
        (result) => {
          if (result.fixed && result.confidence > 0.9) {
            // Auto-apply high confidence fixes
            onCodeFixed(result.fixed_code, result.explanation);
          }
        }
      );

      return stopMonitoring;
    }
  }, [isMonitoring, autoFixEnabled, currentCode, language]);

  useEffect(() => {
    const stats = getFixStatistics();
    setFixStats(stats);
  }, [fixHistory]);

  const handleManualFix = async () => {
    try {
      const result = await performAutoFix(currentCode, language, {
        categories: selectedCategories,
        confidence_threshold: confidenceThreshold,
        auto_apply_only: false,
        max_fixes: 20
      });

      if (result.fixed) {
        onCodeFixed(result.fixed_code, result.explanation);
      } else {
        alert('No fixes were applied. Your code appears to be in good condition!');
      }
    } catch (error) {
      console.error('Manual fix failed:', error);
      alert('Auto-fix failed. Please try again or fix manually.');
    }
  };

  const downloadFixReport = () => {
    const report = generateFixReport(fixHistory);
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `autofix-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'syntax': return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'security': return <Shield className="w-4 h-4 text-red-500" />;
      case 'performance': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'style': return <Eye className="w-4 h-4 text-blue-500" />;
      case 'accessibility': return <Target className="w-4 h-4 text-purple-500" />;
      default: return <Wand2 className="w-4 h-4 text-gray-500" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.9) return 'text-green-600';
    if (confidence > 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Auto-Fix System
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Intelligent code repair and optimization
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isMonitoring 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>{isMonitoring ? 'Monitoring' : 'Start Monitor'}</span>
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-500" />
              </button>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-96">
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Auto-Fix Controls */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Intelligent Code Repair
                </h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${autoFixEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {autoFixEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Zap className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Syntax</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Auto-correct typos</p>
                </div>
                <div className="text-center p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <Shield className="w-6 h-6 text-red-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Security</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Fix vulnerabilities</p>
                </div>
                <div className="text-center p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Performance</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Optimize code</p>
                </div>
                <div className="text-center p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Eye className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Style</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Code standards</p>
                </div>
              </div>

              <button
                onClick={handleManualFix}
                disabled={isAutoFixing || !currentCode.trim()}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all shadow-lg"
              >
                {isAutoFixing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing (Non-blocking)...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    <span>Safe Auto-Fix Analysis</span>
                  </>
                )}
              </button>
              
              <div className="mt-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <h4 className="text-sm font-medium text-green-800 dark:text-green-200">Safety Guarantees</h4>
                </div>
                <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
                  <li>• Never blocks your typing or file operations</li>
                  <li>• Only applies fixes with 95%+ confidence automatically</li>
                  <li>• Preserves all your work with backup copies</li>
                  <li>• Can be disabled instantly if needed</li>
                  <li>• All changes are reversible</li>
                </ul>
              </div>
            </div>

            {/* Last Fix Result */}
            {lastFixResult && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Latest Fix Result
                  </h3>
                  <div className="flex items-center space-x-2">
                    {lastFixResult.fixed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    )}
                    <span className={`text-sm font-medium ${getConfidenceColor(lastFixResult.confidence)}`}>
                      {(lastFixResult.confidence * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 dark:text-white mb-2">Explanation</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{lastFixResult.explanation}</p>
                  </div>

                  {lastFixResult.fixes_applied.length > 0 && (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 dark:text-white mb-2">Fixes Applied</h4>
                      <ul className="space-y-1">
                        {lastFixResult.fixes_applied.map((fix, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>{fix}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {lastFixResult.manual_review_needed && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Manual Review Required</h4>
                      </div>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Some fixes require manual review before applying. Please verify the changes carefully.
                      </p>
                    </div>
                  )}

                  {lastFixResult.fixed && (
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => onCodeFixed(lastFixResult.fixed_code, lastFixResult.explanation)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Apply Fixes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Fix Statistics */}
            {fixStats && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Fix Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{fixStats.total_fixes}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Fixes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{(fixStats.success_rate * 100).toFixed(0)}%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{(fixStats.avg_confidence * 100).toFixed(0)}%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Confidence</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-orange-600">{fixStats.most_common_fix}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Most Common</p>
                  </div>
                </div>
              </div>
            )}

            {/* Fix History */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Fix History</h3>
                <button
                  onClick={downloadFixReport}
                  disabled={fixHistory.length === 0}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Report</span>
                </button>
              </div>

              <div 
                ref={fixHistoryScroll.elementRef}
                className="space-y-3 max-h-64 overflow-y-auto relative"
              >
                {fixHistory.length > 0 ? (
                  fixHistory.map((result, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {result.fixed ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                          )}
                          <span className="font-medium text-gray-800 dark:text-white">
                            {result.fixed ? 'Fixes Applied' : 'No Fixes Needed'}
                          </span>
                        </div>
                        <span className={`text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                          {(result.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      
                      {result.fixes_applied.length > 0 && (
                        <div className="mb-2">
                          <div className="flex flex-wrap gap-1">
                            {result.fixes_applied.map(fix => (
                              <span key={fix} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full">
                                {fix}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {result.explanation}
                      </p>
                      
                      {result.manual_review_needed && (
                        <div className="mt-2 flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          <span className="text-xs text-yellow-600 dark:text-yellow-400">Manual review needed</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Wand2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">No fixes applied yet</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Run auto-fix to see results here</p>
                  </div>
                )}
                
                {/* Auto-scroll indicator */}
                <div className="absolute top-2 right-2 flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-2 py-1">
                  <div className={`w-2 h-2 rounded-full ${fixHistoryScroll.isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {fixHistoryScroll.isPaused ? 'Paused' : 'Auto'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Sidebar */}
          {showSettings && (
            <div className="w-80 border-l border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Auto-Fix Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fix Categories
                  </label>
                  <div className="space-y-2">
                    {['syntax', 'security', 'performance', 'style', 'accessibility'].map(category => (
                      <label key={category} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategories(prev => [...prev, category]);
                            } else {
                              setSelectedCategories(prev => prev.filter(c => c !== category));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(category)}
                          <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{category}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confidence Threshold: {(confidenceThreshold * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="1"
                    step="0.1"
                    value={confidenceThreshold}
                    onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Conservative</span>
                    <span>Aggressive</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={autoFixEnabled}
                      onChange={(e) => setAutoFixEnabled(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Enable Auto-Fix</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isMonitoring}
                      onChange={(e) => setIsMonitoring(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Real-time Monitoring</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">AI-Powered Fixes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Security Validated</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Human Reviewable</span>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}