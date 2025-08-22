import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Bug, Shield, Brain, X } from 'lucide-react';
import { errorControlService } from '../services/errorControlService';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isRecovering: boolean;
  recoveryAttempts: number;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  private maxRecoveryAttempts = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRecovering: false,
      recoveryAttempts: 0,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Use error control service for comprehensive handling
    try {
      const result = await errorControlService.handleError(error, {
        component_stack: errorInfo.componentStack,
        error_boundary: true,
        type: 'runtime'
      });

      if (result.recovery_applied) {
        this.attemptRecovery();
      }

      if (result.user_notification) {
        console.warn('Error Boundary:', result.user_notification);
      }

    } catch (handlingError) {
      console.error('Error boundary handling failed:', handlingError);
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  private attemptRecovery = async () => {
    if (this.state.recoveryAttempts >= this.maxRecoveryAttempts) {
      return;
    }

    this.setState({ isRecovering: true });

    try {
      // Wait a moment before recovery
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Attempt to recover by resetting state
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        isRecovering: false,
        recoveryAttempts: prevState.recoveryAttempts + 1,
        showDetails: false
      }));

    } catch (recoveryError) {
      console.error('Recovery failed:', recoveryError);
      this.setState({ isRecovering: false });
    }
  };

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleReportError = () => {
    const { error, errorInfo } = this.state;
    if (error && errorInfo) {
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      // Copy error report to clipboard
      navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2))
        .then(() => alert('Error report copied to clipboard'))
        .catch(() => console.log('Error report:', errorReport));
    }
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, isRecovering, recoveryAttempts, showDetails } = this.state;
      return (
        <>
          {/* Non-blocking Error Banner */}
          <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-red-500 to-orange-600 text-white p-4 shadow-lg z-50 animate-slide-down">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Codette Error Protection Active</h3>
                  <p className="text-red-100 text-sm">
                    {error?.message || 'An error was detected and contained'} • 
                    AI Recovery: {recoveryAttempts}/{this.maxRecoveryAttempts} attempts
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {isRecovering ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium">AI Recovering...</span>
                  </div>
                ) : (
                  <button
                    onClick={this.attemptRecovery}
                    disabled={recoveryAttempts >= this.maxRecoveryAttempts}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 disabled:opacity-50 transition-all"
                  >
                    <Brain className="w-4 h-4" />
                    <span className="text-sm font-medium">Auto-Recover</span>
                  </button>
                )}
                
                <button
                  onClick={this.handleRefresh}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm font-medium">Refresh</span>
                </button>
                
                <button
                  onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Dismiss (Continue at your own risk)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Render children with error overlay */}
          <div className="pt-20">
            {this.props.children}
          </div>
          
          {/* Optional: Floating error details */}
          {showDetails && (
            <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-red-200 dark:border-red-700 p-4 max-w-md z-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800 dark:text-white">Error Details</h4>
                <button
                  onClick={() => this.setState({ showDetails: false })}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <p><strong>Error:</strong> {error?.message}</p>
                <p><strong>Recovery:</strong> {recoveryAttempts} attempts</p>
                <div className="flex space-x-2">
                  <button
                    onClick={this.handleReportError}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                  >
                    Copy Report
                  </button>
                  <a
                    href="mailto:harrison82_96@hotmail.com?subject=Codette Error"
                    className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                  >
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          )}
        </>
      );
    }

    return this.props.children;
  }
}