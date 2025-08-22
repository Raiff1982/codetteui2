import React, { useState, useEffect } from 'react';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  Code, 
  Play,
  FileCheck,
  Clock,
  Target,
  Brain,
  Zap,
  Activity,
  TrendingUp,
  X,
  Download
} from 'lucide-react';
import { ethicalAI, EthicalCodeGeneration, TransparencyAudit } from '../services/ethicalAIService';

interface EthicalAIPanelProps {
  onCodeGenerated: (code: string, title: string) => void;
}

export function EthicalAIPanel({ onCodeGenerated }: EthicalAIPanelProps) {
  const generationsScroll = useAutoScroll({ 
    speed: 35, 
    pauseOnHover: true,
    resetOnInteraction: true 
  });

  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generations, setGenerations] = useState<EthicalCodeGeneration[]>([]);
  const [selectedGeneration, setSelectedGeneration] = useState<EthicalCodeGeneration | null>(null);
  const [auditResults, setAuditResults] = useState<TransparencyAudit | null>(null);

  const generateEthicalCode = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const result = await ethicalAI.generateEthicalCode(prompt, language, {
        must_be_executable: true,
        no_placeholders: true,
        include_tests: true,
        document_limitations: true
      });
      
      setGenerations(prev => [result, ...prev].slice(0, 10));
      setSelectedGeneration(result);
      
      // Run transparency audit
      const audit = await ethicalAI.verifyCodeAuthenticity(result.generated_code, language);
      setAuditResults(audit);
      
    } catch (error) {
      console.error('Ethical code generation failed:', error);
      alert(`Generation failed: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'testing': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Eye className="w-4 h-4 text-gray-600" />;
    }
  };

  const getEthicalScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600';
    if (score >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEthicalScoreBg = (score: number) => {
    if (score >= 0.9) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 0.7) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">Ethical AI Generator</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">100% Real Code, 0% Placeholders</p>
          </div>
        </div>

        {/* Ethical Principles */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-4">
          <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-2">Ethical Principles</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span className="text-gray-600 dark:text-gray-400">No Placeholders</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span className="text-gray-600 dark:text-gray-400">Fully Executable</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span className="text-gray-600 dark:text-gray-400">Transparent Process</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span className="text-gray-600 dark:text-gray-400">Verifiable Claims</span>
            </div>
          </div>
        </div>

        {/* Generation Form */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Describe what you need (be specific):
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Create a React component that manages user authentication with real error handling and loading states"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              rows={3}
            />
          </div>
          
          <div className="flex space-x-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 text-sm"
            >
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="css">CSS</option>
              <option value="html">HTML</option>
            </select>
            
            <button
              onClick={generateEthicalCode}
              disabled={!prompt.trim() || isGenerating}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating Real Code...</span>
                </>
              ) : (
                <>
                  <Code className="w-4 h-4" />
                  <span>Generate Ethical Code</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Current Generation Details */}
        {selectedGeneration && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getVerificationIcon(selectedGeneration.verification_status)}
                <h4 className="font-medium text-gray-800 dark:text-white">
                  Generated Solution
                </h4>
                <span className={(() => {
                  const statusClasses = selectedGeneration.verification_status === 'verified' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : selectedGeneration.verification_status === 'testing' 
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
                  return `px-2 py-1 rounded-full text-xs font-medium ${statusClasses}`;
                })()}>
                  {selectedGeneration.verification_status}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => navigator.clipboard.writeText(selectedGeneration.generated_code)}
                  className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="Copy code"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onCodeGenerated(selectedGeneration.generated_code, 'Ethical AI Generated')}
                  className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                >
                  Use Code
                </button>
              </div>
            </div>

            {/* Ethical Score */}
            <div className={`p-4 rounded-lg mb-4 ${getEthicalScoreBg(selectedGeneration.ethical_score)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800 dark:text-white">Ethical Score</span>
                <span className={`text-2xl font-bold ${getEthicalScoreColor(selectedGeneration.ethical_score)}`}>
                  {(selectedGeneration.ethical_score * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    selectedGeneration.ethical_score >= 0.9 ? 'bg-green-500' :
                    selectedGeneration.ethical_score >= 0.7 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${selectedGeneration.ethical_score * 100}%` }}
                />
              </div>
            </div>

            {/* Transparency Report */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <h5 className="font-medium text-gray-800 dark:text-white mb-3">Transparency Report</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Source Model:</span>
                  <span className="text-gray-800 dark:text-white font-medium">
                    {selectedGeneration.transparency_report.source_model}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Method:</span>
                  <span className="text-gray-800 dark:text-white font-medium">
                    {selectedGeneration.transparency_report.generation_method}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Confidence:</span>
                  <span className="text-gray-800 dark:text-white font-medium">
                    {(selectedGeneration.transparency_report.confidence_level * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Limitations */}
              {selectedGeneration.transparency_report.limitations.length > 0 && (
                <div className="mt-3">
                  <h6 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Limitations:</h6>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    {selectedGeneration.transparency_report.limitations.map((limitation, index) => (
                      <li key={index} className="flex items-start space-x-1">
                        <span>•</span>
                        <span>{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Execution Test Results */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h5 className="font-medium text-gray-800 dark:text-white mb-3">Execution Verification</h5>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  {selectedGeneration.execution_test.syntax_valid ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300">Syntax Valid</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {selectedGeneration.execution_test.runtime_tested ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300">Runtime Tested</span>
                </div>
              </div>

              {selectedGeneration.execution_test.error_log.length > 0 && (
                <div className="mt-3">
                  <h6 className="text-xs font-medium text-red-700 dark:text-red-300 mb-1">Errors:</h6>
                  <div className="bg-red-50 dark:bg-red-900/20 rounded p-2">
                    {selectedGeneration.execution_test.error_log.map((error, index) => (
                      <p key={index} className="text-xs text-red-700 dark:text-red-300">{error}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transparency Audit */}
        {auditResults && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-blue-600" />
              <span>Transparency Audit</span>
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Target className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-sm font-medium text-gray-800 dark:text-white">Authenticity</p>
                <p className="text-lg font-bold text-blue-600">
                  {(auditResults.code_authenticity * 100).toFixed(0)}%
                </p>
              </div>
              
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Play className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-sm font-medium text-gray-800 dark:text-white">Executable</p>
                <p className="text-lg font-bold text-green-600">
                  {(auditResults.executable_percentage * 100).toFixed(0)}%
                </p>
              </div>
              
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Eye className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-sm font-medium text-gray-800 dark:text-white">Transparency</p>
                <p className="text-lg font-bold text-purple-600">
                  {(auditResults.transparency_score * 100).toFixed(0)}%
                </p>
              </div>
              
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                <p className="text-sm font-medium text-gray-800 dark:text-white">Placeholders</p>
                <p className="text-lg font-bold text-orange-600">{auditResults.placeholder_count}</p>
              </div>
            </div>

            {/* Ethical Violations */}
            {auditResults.ethical_violations.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3">
                <h5 className="font-medium text-red-800 dark:text-red-200 mb-2 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Ethical Violations Detected</span>
                </h5>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  {auditResults.ethical_violations.map((violation, index) => (
                    <li key={index} className="flex items-start space-x-1">
                      <span>•</span>
                      <span>{violation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Generation History */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 dark:text-white mb-4">Generation History</h4>
          
          {generations.length > 0 ? (
            <div 
              ref={generationsScroll.elementRef}
              className="space-y-2 max-h-64 overflow-y-auto relative"
            >
              {generations.map(generation => (
                <div
                  key={generation.id}
                  onClick={() => setSelectedGeneration(generation)}
                  className={`p-3 rounded-lg cursor-pointer transition-all border ${
                    selectedGeneration?.id === generation.id
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-green-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                      {generation.language} - {generation.prompt.slice(0, 50)}...
                    </span>
                    <div className="flex items-center space-x-2">
                      {getVerificationIcon(generation.verification_status)}
                      <span className={`text-sm font-medium ${getEthicalScoreColor(generation.ethical_score)}`}>
                        {(generation.ethical_score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{new Date(generation.created_at).toLocaleTimeString()}</span>
                    <span className="capitalize">{generation.verification_status}</span>
                  </div>
                </div>
              ))}
              
              {/* Auto-scroll indicator */}
              <div className="absolute top-2 right-2 flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-2 py-1">
                <div className={`w-2 h-2 rounded-full ${generationsScroll.isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {generationsScroll.isPaused ? 'Paused' : 'Auto'}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No ethical generations yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Generate your first piece of verified, ethical code
              </p>
            </div>
          )}
        </div>

        {/* Real-Time Ethical Monitoring */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 dark:text-white mb-3 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-green-600" />
            <span>Real-Time Ethical Monitoring</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1 animate-pulse" />
              <p className="text-xs text-gray-600 dark:text-gray-400">No Placeholders</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1 animate-pulse" />
              <p className="text-xs text-gray-600 dark:text-gray-400">Fully Executable</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1 animate-pulse" />
              <p className="text-xs text-gray-600 dark:text-gray-400">Transparent Process</p>
            </div>
          </div>
        </div>
      </div>

      {/* Code Preview Modal */}
      {selectedGeneration && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Generated Code Preview
              </h3>
              <button
                onClick={() => setSelectedGeneration(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-96">
              <pre className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto">
                {selectedGeneration.generated_code}
              </pre>
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedGeneration(null)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onCodeGenerated(selectedGeneration.generated_code, 'Ethical AI Generated');
                  setSelectedGeneration(null);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Use This Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}