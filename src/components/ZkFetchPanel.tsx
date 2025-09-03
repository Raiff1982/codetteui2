import React, { useState, useEffect } from 'react';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { 
  Shield, 
  Lock, 
  Eye, 
  CheckCircle, 
  AlertTriangle,
  Globe,
  Download,
  Search,
  Clock,
  Key,
  FileText,
  ExternalLink,
  Zap,
  Activity,
  Target,
  RefreshCw,
  X
} from 'lucide-react';
import { zkfetchService, ZkFetchRequest, ZkFetchResponse } from '../services/zkfetchService';

interface ZkFetchPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export function ZkFetchPanel({ isVisible, onClose }: ZkFetchPanelProps) {
  const proofsScroll = useAutoScroll({ 
    speed: 30, 
    pauseOnHover: true,
    resetOnInteraction: true 
  });

  const [url, setUrl] = useState('');
  const [method, setMethod] = useState<'GET' | 'POST' | 'HEAD'>('GET');
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<ZkFetchResponse | null>(null);
  const [storedProofs, setStoredProofs] = useState<any[]>([]);
  const [selectedProof, setSelectedProof] = useState<any>(null);
  const [healthStatus, setHealthStatus] = useState<boolean | null>(null);

  useEffect(() => {
    if (isVisible) {
      loadStoredProofs();
      checkServiceHealth();
    }
  }, [isVisible]);

  const loadStoredProofs = () => {
    const proofs = zkfetchService.getStoredProofs();
    setStoredProofs(proofs);
  };

  const checkServiceHealth = async () => {
    try {
      const healthy = await zkfetchService.checkHealth();
      setHealthStatus(healthy);
    } catch (error) {
      setHealthStatus(false);
    }
  };

  const performZkFetch = async () => {
    if (!url.trim()) return;

    setIsLoading(true);
    try {
      const request: ZkFetchRequest = {
        url: url.trim(),
        method,
        disclosure: {
          mode: 'jsonpath_allowlist',
          jsonpath: ['$.name', '$.content', '$.sha', '$.download_url', '$.message'],
          headers: ['Content-Type', 'ETag', 'Last-Modified']
        },
        cache: {
          max_age_s: 300
        }
      };

      const response = await zkfetchService.zkfetch(request);
      setLastResponse(response);
      loadStoredProofs(); // Refresh stored proofs
      
    } catch (error) {
      console.error('zkfetch failed:', error);
      alert(`zkfetch failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyProof = async (proofId: string) => {
    try {
      const result = await zkfetchService.verifyProof(proofId);
      alert(`Proof verification: ${result.valid ? 'VALID' : 'INVALID'}\n\nChecks passed: ${result.checks.filter(c => c.passed).length}/${result.checks.length}`);
    } catch (error) {
      console.error('Proof verification failed:', error);
      alert(`Verification failed: ${error.message}`);
    }
  };

  const fetchGitHubExample = async () => {
    setIsLoading(true);
    try {
      const response = await zkfetchService.fetchGitHubWithProof('raiffsbits', 'codette', 'README.md');
      setLastResponse(response);
      loadStoredProofs();
    } catch (error) {
      console.error('GitHub fetch failed:', error);
      alert(`GitHub fetch failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchResearchPaper = async () => {
    setIsLoading(true);
    try {
      const response = await zkfetchService.fetchResearchPaperWithProof('10.5281/zenodo.16388758');
      setLastResponse(response);
      loadStoredProofs();
    } catch (error) {
      console.error('Research paper fetch failed:', error);
      alert(`Research paper fetch failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  zkfetch - Zero-Knowledge TLS Proofs
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cryptographically verified data fetching
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                healthStatus === true ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' :
                healthStatus === false ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300' :
                'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  healthStatus === true ? 'bg-green-500 animate-pulse' :
                  healthStatus === false ? 'bg-red-500' : 'bg-gray-400'
                }`} />
                <span className="text-sm font-medium">
                  {healthStatus === true ? 'Service Online' : healthStatus === false ? 'Service Offline' : 'Checking...'}
                </span>
              </div>
              
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
          {/* Left Panel - zkfetch Interface */}
          <div className="w-1/2 p-6 border-r border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Fetch with Zero-Knowledge Proof
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL to Fetch
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://api.github.com/repos/owner/repo"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  HTTP Method
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white bg-white dark:bg-gray-700"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="HEAD">HEAD</option>
                </select>
              </div>
              
              <button
                onClick={performZkFetch}
                disabled={!url.trim() || isLoading || healthStatus === false}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Generating Proof...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Fetch with Proof</span>
                  </>
                )}
              </button>
              
              {/* Quick Examples */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Examples:</h4>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={fetchGitHubExample}
                    disabled={isLoading || healthStatus === false}
                    className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                  >
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span>Fetch Codette README</span>
                  </button>
                  
                  <button
                    onClick={fetchResearchPaper}
                    disabled={isLoading || healthStatus === false}
                    className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                  >
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span>Verify Research Paper</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Results and Proofs */}
          <div className="w-1/2 p-6 overflow-y-auto">
            {/* Latest Response */}
            {lastResponse && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Latest zkfetch Response
                </h3>
                
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-800 dark:text-white">Proof Generated Successfully</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Origin:</span>
                      <p className="font-medium text-gray-800 dark:text-white">{lastResponse.origin.host}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">TLS Version:</span>
                      <p className="font-medium text-gray-800 dark:text-white">{lastResponse.tls.version}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Proof Format:</span>
                      <p className="font-medium text-gray-800 dark:text-white">{lastResponse.proof.format}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Request ID:</span>
                      <p className="font-mono text-xs text-gray-800 dark:text-white">{lastResponse.request_id}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Disclosed Data:</span>
                    <pre className="mt-1 text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto max-h-32">
                      {JSON.stringify(lastResponse.disclosed, null, 2)}
                    </pre>
                  </div>
                  
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={() => verifyProof(lastResponse.request_id)}
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Verify Proof</span>
                    </button>
                    
                    <button
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(lastResponse, null, 2))}
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Copy Response</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Stored Proofs */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Stored Proofs ({storedProofs.length})
                </h3>
                <button
                  onClick={loadStoredProofs}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              
              <div 
                ref={proofsScroll.elementRef}
                className="space-y-2 max-h-64 overflow-y-auto relative"
              >
                {storedProofs.length > 0 ? (
                  storedProofs.map(({ request_id, metadata }) => (
                    <div
                      key={request_id}
                      onClick={() => setSelectedProof({ request_id, metadata })}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-800 dark:text-white">
                          {metadata.origin_host}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(metadata.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
                        <span>ID: {request_id.slice(0, 8)}...</span>
                        <span>Format: {metadata.proof_format}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Lock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">No proofs stored yet</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Perform a zkfetch to generate cryptographic proofs
                    </p>
                  </div>
                )}
                
                {/* Auto-scroll indicator */}
                <div className="absolute top-2 right-2 flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-2 py-1">
                  <div className={`w-2 h-2 rounded-full ${proofsScroll.isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {proofsScroll.isPaused ? 'Paused' : 'Auto'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Zero-Knowledge Proofs</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Cryptographic Verification</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Selective Disclosure</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <a
                href="https://api.codette.online"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                <span>API Documentation</span>
              </a>
              
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        {/* Proof Detail Modal */}
        {selectedProof && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Proof Details
                  </h3>
                  <button
                    onClick={() => setSelectedProof(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Request ID:</span>
                    <p className="font-mono text-sm text-gray-800 dark:text-white">{selectedProof.request_id}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Origin Host:</span>
                    <p className="font-medium text-gray-800 dark:text-white">{selectedProof.metadata.origin_host}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Timestamp:</span>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {new Date(selectedProof.metadata.timestamp).toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Proof Format:</span>
                    <p className="font-medium text-gray-800 dark:text-white">{selectedProof.metadata.proof_format}</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => verifyProof(selectedProof.request_id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Verify Proof
                  </button>
                  <button
                    onClick={() => setSelectedProof(null)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}