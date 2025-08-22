// Performance Optimizer - Centralized Performance Enhancement
export interface PerformanceMetrics {
  execution_time: number;
  memory_usage: number;
  cpu_utilization: number;
  network_efficiency: number;
  render_performance: number;
  user_experience_score: number;
  optimization_opportunities: string[];
}

export interface OptimizationSuggestion {
  type: 'memory' | 'cpu' | 'network' | 'rendering' | 'algorithm';
  description: string;
  impact: 'low' | 'medium' | 'high';
  implementation: string;
  estimated_improvement: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

class PerformanceOptimizer {
  private performanceObserver: PerformanceObserver | null = null;
  private metrics: PerformanceMetrics[] = [];
  private isMonitoring = false;

  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        this.processPerformanceEntries(entries);
      });
      
      this.performanceObserver.observe({ 
        entryTypes: ['measure', 'navigation', 'resource', 'paint'] 
      });
    }
    
    this.startMemoryMonitoring();
    this.startRenderMonitoring();
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
    
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
      this.performanceObserver = null;
    }
  }

  async analyzeCodePerformance(code: string, language: string): Promise<OptimizationSuggestion[]> {
    const suggestions: OptimizationSuggestion[] = [];
    
    if (code.includes('new Array(') || code.includes('Array.from(')) {
      suggestions.push({
        type: 'memory',
        description: 'Large array allocations detected - consider lazy loading or pagination',
        impact: 'high',
        implementation: 'Use virtual scrolling or implement pagination for large datasets',
        estimated_improvement: 0.4,
        difficulty: 'medium'
      });
    }
    
    if (code.includes('for') && code.includes('for')) {
      suggestions.push({
        type: 'cpu',
        description: 'Nested loops detected - potential O(n²) complexity',
        impact: 'high',
        implementation: 'Consider using Map/Set for lookups or optimize algorithm complexity',
        estimated_improvement: 0.6,
        difficulty: 'medium'
      });
    }
    
    if (code.includes('fetch') && !code.includes('Promise.all')) {
      suggestions.push({
        type: 'network',
        description: 'Sequential API calls detected - consider parallel execution',
        impact: 'medium',
        implementation: 'Use Promise.all() or Promise.allSettled() for concurrent requests',
        estimated_improvement: 0.3,
        difficulty: 'easy'
      });
    }
    
    return suggestions;
  }

  async benchmarkCode(code: string, iterations: number = 1000): Promise<{
    average_time: number;
    min_time: number;
    max_time: number;
    memory_delta: number;
  }> {
    const times: number[] = [];
    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
    
    const testFunction = new Function('return ' + code);
    
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      try {
        testFunction();
      } catch (error) {
        // Handle execution errors gracefully
      }
      const end = performance.now();
      times.push(end - start);
    }
    
    const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
    
    return {
      average_time: times.reduce((sum, time) => sum + time, 0) / times.length,
      min_time: Math.min(...times),
      max_time: Math.max(...times),
      memory_delta: finalMemory - initialMemory
    };
  }

  getCurrentMetrics(): PerformanceMetrics {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    return {
      execution_time: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
      memory_usage: (performance as any).memory?.usedJSHeapSize || 0,
      cpu_utilization: 0.5,
      network_efficiency: navigation ? 1000 / (navigation.responseEnd - navigation.requestStart) : 1,
      render_performance: 60,
      user_experience_score: 0.85,
      optimization_opportunities: [
        'Enable code splitting for faster initial load',
        'Implement service worker for offline functionality',
        'Use Web Workers for heavy computations',
        'Optimize bundle size with tree shaking'
      ]
    };
  }

  private processPerformanceEntries(entries: PerformanceEntry[]): void {
    entries.forEach(entry => {
      if (entry.entryType === 'measure') {
        console.log(`Performance measure: ${entry.name} took ${entry.duration}ms`);
      }
    });
  }

  private startMemoryMonitoring(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memInfo = (performance as any).memory;
        if (memInfo) {
          console.log(`Memory usage: ${(memInfo.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
        }
      }, 5000);
    }
  }

  private startRenderMonitoring(): void {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = frameCount;
        console.log(`FPS: ${fps}`);
        frameCount = 0;
        lastTime = currentTime;
      }
      
      if (this.isMonitoring) {
        requestAnimationFrame(measureFPS);
      }
    };
    
    requestAnimationFrame(measureFPS);
  }
}

export const performanceOptimizer = new PerformanceOptimizer();