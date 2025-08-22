// Code Health Monitor - Comprehensive Code Quality Analysis
export interface CodeHealthMetrics {
  overall_health: number;
  maintainability: number;
  readability: number;
  testability: number;
  security_score: number;
  performance_score: number;
  documentation_score: number;
  technical_debt: number;
  code_smells: string[];
  refactoring_urgency: 'low' | 'medium' | 'high' | 'critical';
}

export interface HealthTrend {
  timestamp: Date;
  health_score: number;
  change_type: 'improvement' | 'degradation' | 'stable';
  metrics: Partial<CodeHealthMetrics>;
}

class CodeHealthMonitor {
  private healthHistory: HealthTrend[] = [];
  private isMonitoring = false;
  private monitoringInterval: NodeJS.Timeout | null = null;

  async analyzeCodeHealth(code: string, language: string): Promise<CodeHealthMetrics> {
    const metrics = {
      overall_health: this.calculateOverallHealth(code),
      maintainability: this.calculateMaintainability(code),
      readability: this.calculateReadability(code),
      testability: this.calculateTestability(code),
      security_score: this.calculateSecurityScore(code),
      performance_score: this.calculatePerformanceScore(code),
      documentation_score: this.calculateDocumentationScore(code),
      technical_debt: this.calculateTechnicalDebt(code),
      code_smells: this.detectCodeSmells(code),
      refactoring_urgency: this.assessRefactoringUrgency(code)
    };

    // Record health trend
    this.recordHealthTrend(metrics);

    return metrics;
  }

  startHealthMonitoring(getCode: () => string, getLanguage: () => string, onHealthChange: (metrics: CodeHealthMetrics) => void): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(async () => {
      try {
        const code = getCode();
        const language = getLanguage();
        
        if (code.trim()) {
          const metrics = await this.analyzeCodeHealth(code, language);
          onHealthChange(metrics);
        }
      } catch (error) {
        console.error('Health monitoring failed:', error);
      }
    }, 10000); // Check every 10 seconds
  }

  stopHealthMonitoring(): void {
    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  generateHealthReport(metrics: CodeHealthMetrics): string {
    return `# Code Health Report
Generated: ${new Date().toLocaleString()}

## Overall Health Score: ${(metrics.overall_health * 100).toFixed(0)}%

### Detailed Metrics
- **Maintainability**: ${(metrics.maintainability * 100).toFixed(0)}%
- **Readability**: ${(metrics.readability * 100).toFixed(0)}%
- **Testability**: ${(metrics.testability * 100).toFixed(0)}%
- **Security**: ${(metrics.security_score * 100).toFixed(0)}%
- **Performance**: ${(metrics.performance_score * 100).toFixed(0)}%
- **Documentation**: ${(metrics.documentation_score * 100).toFixed(0)}%

### Technical Debt: ${(metrics.technical_debt * 100).toFixed(0)}%

### Code Smells Detected
${metrics.code_smells.map(smell => `- ${smell}`).join('\n')}

### Refactoring Priority: ${metrics.refactoring_urgency.toUpperCase()}

### Recommendations
${this.generateRecommendations(metrics).map(rec => `- ${rec}`).join('\n')}
`;
  }

  getHealthTrends(): HealthTrend[] {
    return [...this.healthHistory];
  }

  private calculateOverallHealth(code: string): number {
    const maintainability = this.calculateMaintainability(code);
    const readability = this.calculateReadability(code);
    const security = this.calculateSecurityScore(code);
    const performance = this.calculatePerformanceScore(code);
    
    return (maintainability * 0.3 + readability * 0.25 + security * 0.25 + performance * 0.2);
  }

  private calculateMaintainability(code: string): number {
    let score = 0.5;
    
    // Positive indicators
    if (code.includes('function') || code.includes('class')) score += 0.1;
    if (code.includes('try') && code.includes('catch')) score += 0.1;
    if (code.includes('//') || code.includes('/*')) score += 0.1;
    if (code.includes('interface') || code.includes('type')) score += 0.1;
    
    // Negative indicators
    const lines = code.split('\n').length;
    if (lines > 100) score -= 0.1;
    if (code.includes('TODO') || code.includes('FIXME')) score -= 0.1;
    
    return Math.max(0, Math.min(1, score));
  }

  private calculateReadability(code: string): number {
    let score = 0.5;
    
    const lines = code.split('\n');
    const avgLineLength = lines.reduce((sum, line) => sum + line.length, 0) / lines.length;
    
    // Good line length
    if (avgLineLength < 80) score += 0.2;
    
    // Comments
    const commentLines = lines.filter(line => line.trim().startsWith('//') || line.trim().startsWith('/*')).length;
    const commentRatio = commentLines / lines.length;
    if (commentRatio > 0.1) score += 0.2;
    
    // Consistent indentation
    const indentedLines = lines.filter(line => line.startsWith('  ') || line.startsWith('\t')).length;
    if (indentedLines / lines.length > 0.3) score += 0.1;
    
    return Math.max(0, Math.min(1, score));
  }

  private calculateTestability(code: string): number {
    let score = 0.3;
    
    if (code.includes('test') || code.includes('spec')) score += 0.3;
    if (code.includes('expect') || code.includes('assert')) score += 0.2;
    if (code.includes('mock') || code.includes('stub')) score += 0.1;
    if (code.includes('export') || code.includes('module.exports')) score += 0.1;
    
    return Math.max(0, Math.min(1, score));
  }

  private calculateSecurityScore(code: string): number {
    let score = 0.8;
    
    // Security issues
    if (code.includes('eval(')) score -= 0.3;
    if (code.includes('innerHTML') && !code.includes('sanitize')) score -= 0.2;
    if (code.includes('document.write')) score -= 0.2;
    
    // Security good practices
    if (code.includes('validate') || code.includes('sanitize')) score += 0.1;
    if (code.includes('try') && code.includes('catch')) score += 0.1;
    
    return Math.max(0, Math.min(1, score));
  }

  private calculatePerformanceScore(code: string): number {
    let score = 0.7;
    
    // Performance issues
    if (code.includes('for') && code.includes('for')) score -= 0.2; // Nested loops
    if (code.includes('.find(') && code.includes('.filter(')) score -= 0.1; // Multiple iterations
    
    // Performance optimizations
    if (code.includes('useMemo') || code.includes('useCallback')) score += 0.1;
    if (code.includes('React.memo')) score += 0.1;
    if (code.includes('Promise.all')) score += 0.1;
    
    return Math.max(0, Math.min(1, score));
  }

  private calculateDocumentationScore(code: string): number {
    const lines = code.split('\n');
    const commentLines = lines.filter(line => 
      line.trim().startsWith('//') || 
      line.trim().startsWith('/*') ||
      line.trim().startsWith('*')
    ).length;
    
    const docLines = lines.filter(line => 
      line.includes('@param') || 
      line.includes('@returns') ||
      line.includes('@description')
    ).length;
    
    const commentRatio = commentLines / lines.length;
    const docRatio = docLines / lines.length;
    
    return Math.min(1, commentRatio * 2 + docRatio * 3);
  }

  private calculateTechnicalDebt(code: string): number {
    let debt = 0;
    
    const todoCount = (code.match(/TODO|FIXME|HACK/gi) || []).length;
    const duplicateCode = this.detectDuplicateCode(code);
    const complexityScore = this.calculateComplexity(code);
    
    debt += todoCount * 0.1;
    debt += duplicateCode * 0.2;
    debt += complexityScore * 0.3;
    
    return Math.min(1, debt);
  }

  private detectCodeSmells(code: string): string[] {
    const smells: string[] = [];
    
    if (code.includes('TODO') || code.includes('FIXME')) {
      smells.push('Incomplete implementation markers found');
    }
    
    const lines = code.split('\n');
    const longLines = lines.filter(line => line.length > 120);
    if (longLines.length > 0) {
      smells.push(`${longLines.length} lines exceed 120 characters`);
    }
    
    const functionCount = (code.match(/function|def /g) || []).length;
    if (functionCount > 10 && code.length < 1000) {
      smells.push('High function density - consider refactoring');
    }
    
    if (code.includes('any') && code.includes('typescript')) {
      smells.push('Excessive use of "any" type reduces type safety');
    }
    
    return smells;
  }

  private assessRefactoringUrgency(code: string): 'low' | 'medium' | 'high' | 'critical' {
    const debt = this.calculateTechnicalDebt(code);
    const smells = this.detectCodeSmells(code);
    
    if (debt > 0.8 || smells.length > 5) return 'critical';
    if (debt > 0.6 || smells.length > 3) return 'high';
    if (debt > 0.4 || smells.length > 1) return 'medium';
    return 'low';
  }

  private detectDuplicateCode(code: string): number {
    const lines = code.split('\n').map(line => line.trim()).filter(line => line);
    const lineMap = new Map<string, number>();
    
    lines.forEach(line => {
      lineMap.set(line, (lineMap.get(line) || 0) + 1);
    });
    
    const duplicates = Array.from(lineMap.values()).filter(count => count > 1);
    return duplicates.length / lines.length;
  }

  private calculateComplexity(code: string): number {
    const cyclomaticComplexity = (code.match(/if|else|while|for|switch|case|catch|\?/g) || []).length;
    const nestingDepth = this.calculateNestingDepth(code);
    const linesOfCode = code.split('\n').filter(line => line.trim()).length;
    
    return Math.min(1, (cyclomaticComplexity * 0.4 + nestingDepth * 0.3 + linesOfCode * 0.001));
  }

  private calculateNestingDepth(code: string): number {
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
  }

  private recordHealthTrend(metrics: CodeHealthMetrics): void {
    const lastTrend = this.healthHistory[this.healthHistory.length - 1];
    let changeType: 'improvement' | 'degradation' | 'stable' = 'stable';
    
    if (lastTrend) {
      const healthDiff = metrics.overall_health - lastTrend.health_score;
      if (healthDiff > 0.05) changeType = 'improvement';
      else if (healthDiff < -0.05) changeType = 'degradation';
    }

    const trend: HealthTrend = {
      timestamp: new Date(),
      health_score: metrics.overall_health,
      change_type: changeType,
      metrics
    };

    this.healthHistory.push(trend);
    
    // Keep only last 50 trends
    if (this.healthHistory.length > 50) {
      this.healthHistory = this.healthHistory.slice(-50);
    }
  }

  private generateRecommendations(metrics: CodeHealthMetrics): string[] {
    const recommendations: string[] = [];
    
    if (metrics.maintainability < 0.6) {
      recommendations.push('Break down large functions into smaller, focused units');
    }
    
    if (metrics.readability < 0.6) {
      recommendations.push('Add more comments and improve variable naming');
    }
    
    if (metrics.testability < 0.5) {
      recommendations.push('Add unit tests and improve code modularity');
    }
    
    if (metrics.security_score < 0.7) {
      recommendations.push('Review code for security vulnerabilities');
    }
    
    if (metrics.performance_score < 0.6) {
      recommendations.push('Optimize algorithms and reduce complexity');
    }
    
    if (metrics.documentation_score < 0.5) {
      recommendations.push('Add comprehensive documentation and examples');
    }
    
    return recommendations;
  }
}

export const codeHealthMonitor = new CodeHealthMonitor();