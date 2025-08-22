import { useState, useCallback, useEffect } from 'react';
import { autoFixService, AutoFixResult } from '../services/autoFixService';

export function useAutoFix() {
  const [isAutoFixing, setIsAutoFixing] = useState(false);
  const [lastFixResult, setLastFixResult] = useState<AutoFixResult | null>(null);
  const [autoFixEnabled, setAutoFixEnabled] = useState(true);
  const [fixHistory, setFixHistory] = useState<AutoFixResult[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const performAutoFix = useCallback(async (
    code: string,
    language: string,
    options: any = {}
  ) => {
    setIsAutoFixing(true);
    try {
      const result = await autoFixService.autoFix(code, language, options);
      setLastFixResult(result);
      setFixHistory(prev => [result, ...prev].slice(0, 10));
      return result;
    } catch (error) {
      console.error('Auto-fix failed:', error);
      throw error;
    } finally {
      setIsAutoFixing(false);
    }
  }, []);

  const startAutoFixMonitoring = useCallback((
    getCode: () => string,
    getLanguage: () => string,
    onAutoFix: (result: AutoFixResult) => void
  ) => {
    if (isMonitoring) return;
    
    setIsMonitoring(true);
    
    // Wrap the callback to ensure it doesn't block user interaction
    const safeCallback = (result: AutoFixResult) => {
      try {
        // Only apply fixes that are very safe and don't change code structure
        if (result.confidence > 0.95 && result.fixes_applied.length <= 2) {
          onAutoFix(result);
        }
      } catch (error) {
        console.debug('Auto-fix callback error (non-critical):', error);
      }
    };
    
    const stopMonitoring = autoFixService.startAutoFixMonitoring(
      getCode,
      getLanguage,
      safeCallback
    );

    return stopMonitoring;
  }, [isMonitoring]);

  const batchAutoFix = useCallback(async (
    files: Array<{ content: string; language: string; name: string }>,
    options: any = {}
  ) => {
    setIsAutoFixing(true);
    try {
      const results = await autoFixService.batchAutoFix(files, options);
      return results;
    } catch (error) {
      console.error('Batch auto-fix failed:', error);
      throw error;
    } finally {
      setIsAutoFixing(false);
    }
  }, []);

  const generateFixReport = useCallback((results: AutoFixResult[]) => {
    return autoFixService.generateFixReport(results);
  }, []);

  const getFixStatistics = useCallback(() => {
    return autoFixService.getFixStatistics();
  }, []);

  return {
    isAutoFixing,
    lastFixResult,
    autoFixEnabled,
    setAutoFixEnabled,
    fixHistory,
    isMonitoring,
    setIsMonitoring,
    performAutoFix,
    startAutoFixMonitoring,
    batchAutoFix,
    generateFixReport,
    getFixStatistics
  };
}