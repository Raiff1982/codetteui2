import React, { useState, useEffect } from 'react';
import { Shield, TrendingUp, AlertTriangle, CheckCircle, Activity, Clock, Target, Eye } from 'lucide-react';
import { codeHealthMonitor, CodeHealthMetrics, HealthTrend } from '../services/codeHealthMonitor';

interface CodeHealthDashboardProps {
  currentCode: string;
  language: string;
}

export function CodeHealthDashboard({ currentCode, language }: CodeHealthDashboardProps) {
  const [healthMetrics, setHealthMetrics] = useState<CodeHealthMetrics | null>(null);
  const [healthTrends, setHealthTrends] = useState<HealthTrend[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [healthReport, setHealthReport] = useState('');

  useEffect(() => {
    if (currentCode.trim()) {
      analyzeHealth();
    }
  }, [currentCode, language]);

  useEffect(() => {
    if (isMonitoring) {
      codeHealthMonitor.startHealthMonitoring(
        () => currentCode,
        () => language,
        (metrics) => {
          setHealthMetrics(metrics);
          setHealthTrends(codeHealthMonitor.getHealthTrends());
        }
      );
    } else {
      codeHealthMonitor.stopHealthMonitoring();
    }

    return () => {
      codeHealthMonitor.stopHealthMonitoring();
    };
  }, [isMonitoring, currentCode, language]);

  const analyzeHealth = async () => {
    try {
      const metrics = await codeHealthMonitor.analyzeCodeHealth(currentCode, language);
      setHealthMetrics(metrics);
      
      const report = codeHealthMonitor.generateHealthReport(metrics);
      setHealthReport(report);
    } catch (error) {
      console.error('Health analysis failed:', error);
    }
  };

  const getHealthColor = (score: number) => {
    if (score > 0.8) return 'text-green-600';
    if (score > 0.6) return 'text-yellow-600';
    if (score > 0.4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getHealthBg = (score: number) => {
    if (score > 0.8) return 'bg-green-100 dark:bg-green-900/20';
    if (score > 0.6) return 'bg-yellow-100 dark:bg-yellow-900/20';
    if (score > 0.4) return 'bg-orange-100 dark:bg-orange-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500 text-gray-50';
      case 'high': return 'bg-orange-500 text-gray-50';
      case 'medium': return 'bg-yellow-500 text-gray-900';
      case 'low': return 'bg-green-500 text-gray-50';
      default: return 'bg-gray-500 text-gray-50';
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-green-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-gray-50" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-50">
              Code Health Dashboard
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive code quality analysis
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
            onClick={() => setShowReport(!showReport)}
            disabled={!healthMetrics}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-gray-50 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors text-sm font-medium"
          >
            <Eye className="w-4 h-4" />
            <span>View Report</span>
          </button>
        </div>
      </div>

      {healthMetrics && (
        <div className="space-y-6">
          {/* Overall Health Score */}
          <div className={`p-6 rounded-xl ${getHealthBg(healthMetrics.overall_health)}`}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-gray-800 dark:text-gray-50">Overall Health Score</h4>
              <div className="flex items-center space-x-3">
                <span className={`text-4xl font-bold ${getHealthColor(healthMetrics.overall_health)}`}>
                  {(healthMetrics.overall_health * 100).toFixed(0)}%
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(healthMetrics.refactoring_urgency)}`}>
                  {healthMetrics.refactoring_urgency} priority
                </span>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  healthMetrics.overall_health > 0.8 ? 'bg-green-500' :
                  healthMetrics.overall_health > 0.6 ? 'bg-yellow-500' :
                  healthMetrics.overall_health > 0.4 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${healthMetrics.overall_health * 100}%` }}
              />
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Maintainability', score: healthMetrics.maintainability, icon: Target },
              { label: 'Readability', score: healthMetrics.readability, icon: Eye },
              { label: 'Testability', score: healthMetrics.testability, icon: CheckCircle },
              { label: 'Security', score: healthMetrics.security_score, icon: Shield },
              { label: 'Performance', score: healthMetrics.performance_score, icon: TrendingUp },
              { label: 'Documentation', score: healthMetrics.documentation_score, icon: Activity }
            ].map(metric => (
              <div key={metric.label} className={`p-4 rounded-lg ${getHealthBg(metric.score)}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <metric.icon className={`w-5 h-5 ${getHealthColor(metric.score)}`} />
                  <span className="font-medium text-gray-800 dark:text-gray-50">{metric.label}</span>
                </div>
                <p className={`text-2xl font-bold ${getHealthColor(metric.score)}`}>
                  {(metric.score * 100).toFixed(0)}%
                </p>
              </div>
            ))}
          </div>

          {/* Technical Debt */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-800 dark:text-gray-50">Technical Debt</h4>
              <span className={`text-2xl font-bold ${getHealthColor(1 - healthMetrics.technical_debt)}`}>
                {(healthMetrics.technical_debt * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${healthMetrics.technical_debt * 100}%` }}
              />
            </div>
          </div>

          {/* Code Smells */}
          {healthMetrics.code_smells.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 dark:text-gray-50 mb-3 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span>Code Smells Detected ({healthMetrics.code_smells.length})</span>
              </h4>
              <div className="space-y-2">
                {healthMetrics.code_smells.map((smell, index) => (
                  <div key={index} className="flex items-start space-x-3 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{smell}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Health Trends */}
          {healthTrends.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 dark:text-gray-50 mb-3">Health Trends</h4>
              <div className="space-y-2">
                {healthTrends.slice(-5).map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        trend.change_type === 'improvement' ? 'bg-green-500' :
                        trend.change_type === 'degradation' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {trend.change_type}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-50">
                        {(trend.health_score * 100).toFixed(0)}%
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {trend.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Health Report Modal */}
      {showReport && healthReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-50">Code Health Report</h3>
                <button
                  onClick={() => setShowReport(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <span className="text-gray-500 text-xl">×</span>
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-96">
              <pre className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
                {healthReport}
              </pre>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => navigator.clipboard.writeText(healthReport)}
                className="px-4 py-2 bg-blue-500 text-gray-50 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Copy Report
              </button>
              <button
                onClick={() => setShowReport(false)}
                className="px-4 py-2 bg-gray-500 text-gray-50 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}