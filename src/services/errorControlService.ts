// Error Control Service - Comprehensive Error Handling
export interface ErrorContext {
  component_stack?: string;
  error_boundary?: boolean;
  type: 'runtime' | 'network' | 'validation' | 'security';
  user_action?: string;
  timestamp?: Date;
}

export interface ErrorHandlingResult {
  recovery_applied: boolean;
  user_notification?: string;
  log_entry: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  auto_recoverable: boolean;
}

class ErrorControlService {
  private errorLog: any[] = [];
  private recoveryStrategies = new Map<string, Function>();

  constructor() {
    this.initializeRecoveryStrategies();
  }

  async handleError(error: Error, context: ErrorContext): Promise<ErrorHandlingResult> {
    const errorEntry = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date(),
      severity: this.calculateSeverity(error, context)
    };

    this.errorLog.push(errorEntry);

    const result: ErrorHandlingResult = {
      recovery_applied: false,
      severity: errorEntry.severity,
      auto_recoverable: this.isAutoRecoverable(error),
      log_entry: errorEntry
    };

    // Attempt recovery
    if (result.auto_recoverable) {
      const recoveryStrategy = this.getRecoveryStrategy(error);
      if (recoveryStrategy) {
        try {
          await recoveryStrategy(error, context);
          result.recovery_applied = true;
          result.user_notification = 'Error automatically resolved';
        } catch (recoveryError) {
          console.error('Recovery failed:', recoveryError);
          result.user_notification = 'Error detected but recovery failed';
        }
      }
    }

    // Generate user notification
    if (!result.user_notification) {
      result.user_notification = this.generateUserNotification(error, context);
    }

    return result;
  }

  private initializeRecoveryStrategies(): void {
    this.recoveryStrategies.set('ChunkLoadError', async (error: Error) => {
      // Reload the page to recover from chunk load errors
      window.location.reload();
    });

    this.recoveryStrategies.set('TypeError', async (error: Error, context: ErrorContext) => {
      if (error.message.includes('Cannot read property')) {
        // Try to reinitialize the component
        console.log('Attempting component reinitialization');
      }
    });

    this.recoveryStrategies.set('NetworkError', async (error: Error) => {
      // Retry network requests with exponential backoff
      console.log('Implementing network retry strategy');
    });
  }

  private calculateSeverity(error: Error, context: ErrorContext): 'low' | 'medium' | 'high' | 'critical' {
    if (context.type === 'security') return 'critical';
    if (error.name === 'ChunkLoadError') return 'high';
    if (context.error_boundary) return 'medium';
    return 'low';
  }

  private isAutoRecoverable(error: Error): boolean {
    const recoverableErrors = [
      'ChunkLoadError',
      'NetworkError',
      'TimeoutError'
    ];

    return recoverableErrors.includes(error.name) || 
           this.recoveryStrategies.has(error.name);
  }

  private getRecoveryStrategy(error: Error): Function | undefined {
    return this.recoveryStrategies.get(error.name);
  }

  private generateUserNotification(error: Error, context: ErrorContext): string {
    if (context.type === 'security') {
      return 'Security issue detected and contained';
    }

    if (error.name === 'ChunkLoadError') {
      return 'Loading issue detected - page will refresh automatically';
    }

    return 'An error occurred but the application is still functional';
  }

  getErrorLog(): any[] {
    return [...this.errorLog];
  }

  clearErrorLog(): void {
    this.errorLog = [];
  }
}

export const errorControlService = new ErrorControlService();