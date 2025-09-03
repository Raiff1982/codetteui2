import React, { Suspense, lazy } from 'react';
import { Brain, Zap, Activity } from 'lucide-react';

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  name?: string;
}

export function LazyLoadWrapper({ children, fallback, name }: LazyLoadWrapperProps) {
  const defaultFallback = (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Loading {name || 'Component'}...
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Initializing advanced AI systems
        </p>
      </div>
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
}

// Lazy load heavy components for better performance
export const LazyUltimateAIPanel = lazy(() => 
  import('./UltimateAIPanel').then(module => ({ default: module.UltimateAIPanel }))
);

export const LazyQuantumVisualizer = lazy(() => 
  import('./QuantumVisualizer').then(module => ({ default: module.QuantumVisualizer }))
);

export const LazyMTVMusicPlayer = lazy(() => 
  import('./MTVStyleMusicPlayer').then(module => ({ default: module.MTVStyleMusicPlayer }))
);

export const LazyRevolutionaryInterface = lazy(() => 
  import('./RevolutionaryInterface').then(module => ({ default: module.RevolutionaryInterface }))
);

export const LazyEthicalAIPanel = lazy(() => 
  import('./EthicalAIPanel').then(module => ({ default: module.EthicalAIPanel }))
);

export const LazyCodeHealthDashboard = lazy(() => 
  import('./CodeHealthDashboard').then(module => ({ default: module.CodeHealthDashboard }))
);

export const LazyPerformanceMonitor = lazy(() => 
  import('./PerformanceMonitor').then(module => ({ default: module.PerformanceMonitor }))
);

export const LazyDatabaseViewer = lazy(() => 
  import('./DatabaseViewer').then(module => ({ default: module.DatabaseViewer }))
);

export const LazyResearchPaperViewer = lazy(() => 
  import('./ResearchPaperViewer').then(module => ({ default: module.ResearchPaperViewer }))
);

export const LazyAutoFixPanel = lazy(() => 
  import('./AutoFixPanel').then(module => ({ default: module.AutoFixPanel }))
);

export const LazyCodetteChat = lazy(() => 
  import('./CodetteChat').then(module => ({ default: module.CodetteChat }))
);

export const LazySecurityPanel = lazy(() => 
  import('./SecurityPanel').then(module => ({ default: module.SecurityPanel }))
);

// Performance monitoring for lazy loaded components
export function withPerformanceMonitoring<T extends object>(
  Component: React.ComponentType<T>,
  componentName: string
) {
  return React.forwardRef<any, T>((props, ref) => {
    React.useEffect(() => {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        console.log(`${componentName} render time: ${(endTime - startTime).toFixed(2)}ms`);
      };
    }, []);

    return <Component {...props} ref={ref} />;
  });
}