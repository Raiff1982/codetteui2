// Auto-Fix Service - Intelligent Code Repair
export interface AutoFixResult {
  fixed: boolean;
  fixed_code: string;
  explanation: string;
  fixes_applied: string[];
  confidence: number;
  manual_review_needed: boolean;
}

class AutoFixService {
  private fixHistory: AutoFixResult[] = [];
  private isMonitoring = false;

  async autoFix(code: string, language: string, options: any = {}): Promise<AutoFixResult> {
    const fixes: string[] = [];
    let fixedCode = code;
    let confidence = 0.8;

    // Fix common syntax errors
    if (fixedCode.includes('fucntion')) {
      fixedCode = fixedCode.replace(/fucntion/g, 'function');
      fixes.push('Fixed function typo');
    }

    if (fixedCode.includes('retrun')) {
      fixedCode = fixedCode.replace(/retrun/g, 'return');
      fixes.push('Fixed return typo');
    }

    if (fixedCode.includes('lenght')) {
      fixedCode = fixedCode.replace(/lenght/g, 'length');
      fixes.push('Fixed length typo');
    }

    // Fix security issues
    if (fixedCode.includes('innerHTML') && !fixedCode.includes('sanitize')) {
      fixedCode = fixedCode.replace(/(\w+)\.innerHTML\s*=\s*([^;]+);?/g, '$1.textContent = $2; // Auto-fixed: Security improvement');
      fixes.push('Replaced innerHTML with textContent for security');
      confidence = 0.9;
    }

    const result: AutoFixResult = {
      fixed: fixes.length > 0,
      fixed_code: fixedCode,
      explanation: fixes.length > 0 ? `Applied ${fixes.length} automatic fixes` : 'No fixes needed',
      fixes_applied: fixes,
      confidence,
      manual_review_needed: fixes.some(fix => fix.includes('security'))
    };

    this.fixHistory.push(result);
    return result;
  }

  startAutoFixMonitoring(getCode: () => string, getLanguage: () => string, onAutoFix: (result: AutoFixResult) => void): () => void {
    this.isMonitoring = true;
    
    const monitor = setInterval(async () => {
      if (!this.isMonitoring) {
        clearInterval(monitor);
        return;
      }
      
      try {
        const code = getCode();
        const language = getLanguage();
        if (code.trim()) {
          const result = await this.autoFix(code, language);
          if (result.fixed && result.confidence > 0.9) {
            onAutoFix(result);
          }
        }
      } catch (error) {
        console.warn('Auto-fix monitoring error:', error);
      }
    }, 10000); // Check every 10 seconds

    return () => {
      this.isMonitoring = false;
      clearInterval(monitor);
    };
  }

  batchAutoFix(files: Array<{ content: string; language: string; name: string }>, options: any = {}): Promise<AutoFixResult[]> {
    return Promise.all(files.map(file => this.autoFix(file.content, file.language, options)));
  }

  generateFixReport(results: AutoFixResult[]): string {
    const totalFixes = results.reduce((sum, r) => sum + r.fixes_applied.length, 0);
    const successRate = results.filter(r => r.fixed).length / results.length;

    return `# Auto-Fix Report
Generated: ${new Date().toISOString()}

## Summary
- Total fixes applied: ${totalFixes}
- Success rate: ${(successRate * 100).toFixed(0)}%
- Files processed: ${results.length}

## Details
${results.map((result, index) => `
### Fix ${index + 1}
- Fixed: ${result.fixed ? 'Yes' : 'No'}
- Confidence: ${(result.confidence * 100).toFixed(0)}%
- Fixes: ${result.fixes_applied.join(', ')}
`).join('')}
`;
  }

  getFixStatistics() {
    const totalFixes = this.fixHistory.reduce((sum, r) => sum + r.fixes_applied.length, 0);
    const successRate = this.fixHistory.filter(r => r.fixed).length / Math.max(this.fixHistory.length, 1);
    const avgConfidence = this.fixHistory.reduce((sum, r) => sum + r.confidence, 0) / Math.max(this.fixHistory.length, 1);
    
    const fixTypes = this.fixHistory.flatMap(r => r.fixes_applied);
    const mostCommonFix = fixTypes.reduce((acc, fix) => {
      acc[fix] = (acc[fix] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostCommon = Object.entries(mostCommonFix).sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';

    return {
      total_fixes: totalFixes,
      success_rate: successRate,
      avg_confidence: avgConfidence,
      most_common_fix: mostCommon
    };
  }
}

export const autoFixService = new AutoFixService();