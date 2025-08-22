import React, { useState, useEffect } from 'react';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Lock,
  Unlock,
  Settings,
  Activity,
  Clock,
  Target,
  Zap,
  X,
  RefreshCw,
  Download,
  AlertCircle
} from 'lucide-react';
import { securityService, SecurityScan, SecurityThreat, UserSafetySettings } from '../services/securityService';

interface SecurityPanelProps {
  isVisible: boolean;
  onClose: () => void;
  currentCode: string;
  language: string;
  onSecurityFix: (fixedCode: string) => void;
}

export function SecurityPanel({ isVisible, onClose, currentCode, language, onSecurityFix }: SecurityPanelProps) {
  const threatsScroll = useAutoScroll({ 
    speed: 30, 
    pauseOnHover: true,
    resetOnInteraction: true 
  });

  const logScroll = useAutoScroll({ 
    speed: 25, 
    pauseOnHover: true,
    resetOnInteraction: true 
  });

  const [securityScan, setSecurityScan] = useState<SecurityScan | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [securitySettings, setSecuritySettings] = useState<UserSafetySettings>(securityService.getSecuritySettings());
  const [showSettings, setShowSettings] = useState(false);
  const [securityLog, setSecurityLog] = useState<any[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getSettingDescription = (key: string): string => {
    const descriptions: Record<string, string> = {
      enable_code_scanning: 'Automatically scan code for security vulnerabilities',
      block_malicious_patterns: 'Block execution of potentially malicious code patterns',
      require_confirmation_for_risky_operations: 'Ask for confirmation before risky operations',
      enable_privacy_protection: 'Protect sensitive data from being logged or transmitted',
      log_security_events: 'Keep a log of all security-related events',
      auto_fix_security_issues: 'Automatically fix security issues when possible'
    };
    
    return descriptions[key] || 'Security setting';
  };

  if (!isVisible) return null;

  useEffect(() => {
    if (currentCode.trim()) {
      performSecurityScan();
    }
  }, [currentCode]);

  useEffect(() => {
    if (isMonitoring) {
      const stopMonitoring = securityService.startSecurityMonitoring(
        () => currentCode,
        (threat) => {
          alert(`Security Threat Detected: ${threat.description}`);
        }
      );

      return stopMonitoring;
    }
  }, [isMonitoring, currentCode]);

  const performSecurityScan = async () => {
    setIsScanning(true);
    try {
      const scan = await securityService.scanCodeSecurity(currentCode, language);
      setSecurityScan(scan);
      setSecurityLog(securityService.getSecurityLog());
    } catch (error) {
      console.error('Security scan failed:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const autoFixSecurityIssues = async () => {
    if (!securityScan) return;
    
    try {
      const { fixedCode, fixesApplied } = await securityService.autoFixSecurityIssues(currentCode);
      
      if (fixesApplied.length > 0) {
        onSecurityFix(fixedCode);
        alert(`Applied ${fixesApplied.length} security fixes:\n${fixesApplied.join('\n')}`);
        
        // Re-scan after fixes
        setTimeout(performSecurityScan, 500);
      } else {
        alert('No auto-fixable security issues found.');
      }
    } catch (error) {
      console.error('Auto-fix failed:', error);
      alert('Auto-fix failed. Please review security issues manually.');
    }
  };

  const updateSecuritySetting = (key: keyof UserSafetySettings, value: boolean) => {
    const newSettings = { ...securitySettings, [key]: value };
    setSecuritySettings(newSettings);
    securityService.updateSecuritySettings({ [key]: value });
  };


  const getSecurityScoreColor = (score: number) => {
    if (score > 0.8) return 'text-green-600';
    if (score > 0.6) return 'text-yellow-600';
    if (score > 0.4) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${isMobile ? 'p-2' : 'p-4'}`}>
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-red-100 dark:border-gray-700 ${isMobile ? 'w-full h-full' : 'max-w-4xl w-full max-h-[90vh]'} overflow-hidden`}>
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Security & Safety Center
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Comprehensive protection for your code
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
                <button
                  onClick={() => setIsMonitoring(!isMonitoring)}
                  className={`flex items-center space-x-2 ${isMobile ? 'px-3 py-2' : 'px-4 py-2'} rounded-lg text-sm font-medium transition-all touch-target ${
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
                  className={`${isMobile ? 'p-3' : 'p-2'} hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors touch-target`}
                >
                  <Settings className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-4' : 'p-6'}`}>
            {/* Security Score */}
            {securityScan && (
              <div className={`bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 ${isMobile ? 'p-3' : 'p-4'} rounded-lg mb-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-800 dark:text-white`}>Security Score</h4>
                  <div className={`flex items-center ${isMobile ? 'space-x-2' : 'space-x-3'}`}>
                    <span className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold ${getSecurityScoreColor(securityScan.security_score)}`}>
                      {(securityScan.security_score * 100).toFixed(0)}%
                    </span>
                    <div className={`${isMobile ? 'px-2 py-1' : 'px-3 py-1'} rounded-full ${isMobile ? 'text-xs' : 'text-sm'} font-medium ${
                      securityScan.safe_to_execute 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {securityScan.safe_to_execute ? 'Safe to Execute' : 'Execution Blocked'}
                    </div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      securityScan.security_score > 0.8 ? 'bg-green-500' :
                      securityScan.security_score > 0.6 ? 'bg-yellow-500' :
                      securityScan.security_score > 0.4 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${securityScan.security_score * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Security Threats */}
            {securityScan && securityScan.threats_found.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-gray-800 dark:text-white`}>
                    Security Threats ({securityScan.threats_found.length})
                  </h4>
                  <button
                    onClick={autoFixSecurityIssues}
                    className={`flex items-center space-x-2 ${isMobile ? 'px-2 py-2' : 'px-3 py-2'} bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${isMobile ? 'text-xs' : 'text-sm'} touch-target`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>Auto-Fix</span>
                  </button>
                </div>
                
                <div 
                  ref={threatsScroll.elementRef}
                  className={`space-y-3 ${isMobile ? 'max-h-48' : 'max-h-64'} overflow-y-auto relative`}
                >
                  {securityScan.threats_found.map(threat => (
                    <div key={threat.id} className={`border border-gray-200 dark:border-gray-600 rounded-lg ${isMobile ? 'p-3' : 'p-4'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className={`w-4 h-4 ${
                            threat.severity === 'critical' ? 'text-red-600' :
                            threat.severity === 'high' ? 'text-orange-600' :
                            threat.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                          }`} />
                          <span className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-gray-800 dark:text-white`}>{threat.type}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`${isMobile ? 'px-1 py-0.5' : 'px-2 py-1'} rounded-full text-xs font-medium ${getSeverityColor(threat.severity)}`}>
                            {threat.severity}
                          </span>
                          {threat.auto_fixable && (
                            <span className={`${isMobile ? 'px-1 py-0.5' : 'px-2 py-1'} bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full`}>
                              Auto-fixable
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-300 mb-2`}>
                        {threat.description}
                      </p>
                      
                      <div className={`bg-gray-50 dark:bg-gray-700 rounded ${isMobile ? 'p-2' : 'p-3'} mb-3`}>
                        <p className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-600 dark:text-gray-400`}>
                          <strong>Location:</strong> {threat.location}
                        </p>
                        <p className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-600 dark:text-gray-400 mt-1`}>
                          <strong>Recommendation:</strong> {threat.recommendation}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Auto-scroll indicator */}
                  <div className="absolute top-2 right-2 flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-2 py-1">
                    <div className={`w-2 h-2 rounded-full ${threatsScroll.isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {threatsScroll.isPaused ? 'Paused' : 'Auto'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Security Recommendations */}
            {securityScan && securityScan.recommendations.length > 0 && (
              <div className={`bg-blue-50 dark:bg-blue-900/20 ${isMobile ? 'p-3' : 'p-4'} rounded-lg mb-6`}>
                <h4 className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-gray-800 dark:text-white mb-3`}>Security Recommendations</h4>
                <ul className="space-y-2">
                  {securityScan.recommendations.map((rec, index) => (
                    <li key={index} className={`flex items-start space-x-2 ${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300`}>
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Security Log */}
            <div className={`bg-gray-50 dark:bg-gray-700 rounded-lg ${isMobile ? 'p-3' : 'p-4'}`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-gray-800 dark:text-white`}>Security Log</h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSecurityLog(securityService.getSecurityLog())}
                    className={`${isMobile ? 'p-2' : 'p-1'} hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors touch-target`}
                  >
                    <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </button>
                  {!isMobile && (
                    <button
                      onClick={() => {
                        const logData = JSON.stringify(securityLog, null, 2);
                        const blob = new Blob([logData], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `security-log-${new Date().toISOString().split('T')[0]}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    >
                      <Download className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                  )}
                </div>
              </div>
              
              <div 
                ref={logScroll.elementRef}
                className={`space-y-2 ${isMobile ? 'max-h-24' : 'max-h-32'} overflow-y-auto relative`}
              >
                {securityLog.length > 0 ? (
                  securityLog.slice(-10).map((entry, index) => (
                    <div key={index} className={`flex items-center justify-between ${isMobile ? 'p-1' : 'p-2'} bg-gray-100 dark:bg-gray-600 rounded`}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          entry.severity === 'critical' ? 'bg-red-500' :
                          entry.severity === 'error' ? 'bg-orange-500' :
                          entry.severity === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300`}>{entry.event}</span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {entry.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Shield className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className={`text-gray-600 dark:text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>No security events logged</p>
                  </div>
                )}
                
                {/* Auto-scroll indicator */}
                <div className="absolute top-2 right-2 flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-2 py-1">
                  <div className={`w-2 h-2 rounded-full ${logScroll.isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {logScroll.isPaused ? 'Paused' : 'Auto'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings Modal */}
      {showSettings && (
        <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 ${isMobile ? 'p-2' : 'p-4'}`}>
          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl ${isMobile ? 'w-full h-full' : 'max-w-2xl w-full'}`}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-800 dark:text-white`}>Security Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className={`${isMobile ? 'p-3' : 'p-2'} hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors touch-target`}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className={`${isMobile ? 'p-4' : 'p-6'} space-y-4 ${isMobile ? 'max-h-96 overflow-y-auto' : ''}`}>
              {Object.entries(securitySettings).map(([key, value]) => (
                <div key={key} className={`flex items-center justify-between ${isMobile ? 'p-2' : 'p-3'} bg-gray-50 dark:bg-gray-700 rounded-lg`}>
                  <div>
                    <h4 className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-gray-800 dark:text-white capitalize`}>
                      {key.replace(/_/g, ' ')}
                    </h4>
                    <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400`}>
                      {getSettingDescription(key)}
                    </p>
                  </div>
                  <button
                    onClick={() => updateSecuritySetting(key as keyof UserSafetySettings, !value)}
                    className={`relative inline-flex ${isMobile ? 'h-7 w-12' : 'h-6 w-11'} items-center rounded-full transition-colors touch-target ${
                      value ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block ${isMobile ? 'h-5 w-5' : 'h-4 w-4'} transform rounded-full bg-white transition-transform ${
                        value ? (isMobile ? 'translate-x-6' : 'translate-x-6') : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
              
              <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 ${isMobile ? 'p-3' : 'p-4'} rounded-lg`}>
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h4 className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-red-800 dark:text-red-200`}>Emergency Lockdown</h4>
                </div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-red-700 dark:text-red-300 mb-3`}>
                  Activate maximum security mode if you suspect a security breach.
                </p>
                <button
                  onClick={() => {
                    if (confirm('This will activate maximum security mode. Continue?')) {
                      securityService.emergencyLockdown();
                      setSecuritySettings(securityService.getSecuritySettings());
                    }
                  }}
                  className={`${isMobile ? 'px-3 py-2' : 'px-4 py-2'} bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ${isMobile ? 'text-xs' : 'text-sm'} font-medium touch-target`}
                >
                  Activate Emergency Lockdown
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
