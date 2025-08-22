// Security Service - Essential Security Operations
export interface SecurityScan {
  scan_id: string;
  timestamp: Date;
  threats_found: SecurityThreat[];
  security_score: number;
  safe_to_execute: boolean;
  recommendations: string[];
}

export interface SecurityThreat {
  id: string;
  type: 'xss' | 'injection' | 'malicious_code';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
  auto_fixable: boolean;
  location: string;
}

export interface UserSafetySettings {
  enable_code_scanning: boolean;
  block_malicious_patterns: boolean;
  require_confirmation_for_risky_operations: boolean;
  enable_privacy_protection: boolean;
  log_security_events: boolean;
  auto_fix_security_issues: boolean;
}

class SecurityService {
  private securityLog: Array<{ event: string; severity: string; timestamp: Date }> = [];
  private settings: UserSafetySettings = {
    enable_code_scanning: true,
    block_malicious_patterns: true,
    require_confirmation_for_risky_operations: true,
    enable_privacy_protection: true,
    log_security_events: true,
    auto_fix_security_issues: true
  };

  async scanCodeSecurity(code: string, language: string): Promise<SecurityScan> {
    const threats: SecurityThreat[] = [];
    
    // XSS detection
    if (code.includes('innerHTML') && !code.includes('sanitize')) {
      threats.push({
        id: 'xss_innerHTML',
        type: 'xss',
        severity: 'high',
        description: 'Unsafe innerHTML usage detected',
        recommendation: 'Use textContent or sanitize HTML',
        auto_fixable: true,
        location: 'innerHTML assignment'
      });
    }
    
    // Injection detection
    if (code.includes('eval(')) {
      threats.push({
        id: 'code_injection',
        type: 'injection',
        severity: 'critical',
        description: 'eval() usage detected',
        recommendation: 'Use JSON.parse() or safer alternatives',
        auto_fixable: false,
        location: 'eval() call'
      });
    }

    const securityScore = threats.length === 0 ? 1.0 : Math.max(0, 1 - (threats.length * 0.2));
    const recommendations = this.generateRecommendations(threats);

    const scan: SecurityScan = {
      scan_id: `scan_${Date.now()}`,
      timestamp: new Date(),
      threats_found: threats,
      security_score: securityScore,
      safe_to_execute: threats.filter(t => t.severity === 'critical').length === 0,
      recommendations
    };

    this.logSecurityEvent(`Security scan completed: ${threats.length} threats found`, 'info');
    return scan;
  }

  async autoFixSecurityIssues(code: string): Promise<{ fixedCode: string; fixesApplied: string[] }> {
    let fixedCode = code;
    const fixesApplied: string[] = [];

    // Fix unsafe innerHTML
    if (fixedCode.includes('innerHTML') && !fixedCode.includes('sanitize')) {
      fixedCode = fixedCode.replace(
        /(\w+)\.innerHTML\s*=\s*([^;]+);?/g,
        '$1.textContent = $2; // Auto-fixed: Security improvement'
      );
      fixesApplied.push('Replaced innerHTML with textContent');
    }

    return { fixedCode, fixesApplied };
  }

  startSecurityMonitoring(getCode: () => string, onThreat: (threat: SecurityThreat) => void): () => void {
    const monitor = setInterval(async () => {
      try {
        const code = getCode();
        if (code.trim()) {
          const scan = await this.scanCodeSecurity(code, 'javascript');
          if (scan.threats_found.length > 0) {
            scan.threats_found.forEach(onThreat);
          }
        }
      } catch (error) {
        console.warn('Security monitoring error:', error);
      }
    }, 15000); // Check every 15 seconds

    return () => clearInterval(monitor);
  }

  getSecuritySettings(): UserSafetySettings {
    return { ...this.settings };
  }

  updateSecuritySettings(updates: Partial<UserSafetySettings>): void {
    this.settings = { ...this.settings, ...updates };
  }

  getSecurityLog() {
    return [...this.securityLog];
  }

  emergencyLockdown(): void {
    this.settings = {
      enable_code_scanning: true,
      block_malicious_patterns: true,
      require_confirmation_for_risky_operations: true,
      enable_privacy_protection: true,
      log_security_events: true,
      auto_fix_security_issues: false // Disable auto-fix in lockdown
    };
    
    this.logSecurityEvent('Emergency lockdown activated', 'critical');
  }

  private generateRecommendations(threats: SecurityThreat[]): string[] {
    const recommendations: string[] = [];
    
    if (threats.some(t => t.type === 'xss')) {
      recommendations.push('Implement input sanitization');
      recommendations.push('Use Content Security Policy headers');
    }
    
    if (threats.some(t => t.type === 'injection')) {
      recommendations.push('Avoid eval() and similar functions');
      recommendations.push('Use parameterized queries for databases');
    }
    
    return recommendations;
  }

  private logSecurityEvent(event: string, severity: string): void {
    this.securityLog.push({
      event,
      severity,
      timestamp: new Date()
    });

    // Keep only last 100 events
    if (this.securityLog.length > 100) {
      this.securityLog = this.securityLog.slice(-100);
    }
  }
}

export const securityService = new SecurityService();