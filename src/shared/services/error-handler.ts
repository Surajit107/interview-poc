/**
 * Centralized error handling service
 */

export interface AppError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: Date;
  context?: Record<string, unknown>;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: AppError[] = [];

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Handle and log errors
   */
  handleError(error: unknown, context?: Record<string, unknown>): AppError {
    const appError = this.normalizeError(error, context);
    this.logError(appError);
    return appError;
  }

  /**
   * Normalize different error types into AppError
   */
  private normalizeError(error: unknown, context?: Record<string, unknown>): AppError {
    if (error instanceof Error) {
      return {
        code: this.getErrorCode(error),
        message: error.message,
        details: error.stack,
        timestamp: new Date(),
        context,
      };
    }

    if (typeof error === 'string') {
      return {
        code: 'UNKNOWN_ERROR',
        message: error,
        timestamp: new Date(),
        context,
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
      details: error,
      timestamp: new Date(),
      context,
    };
  }

  /**
   * Get error code from error instance
   */
  private getErrorCode(error: Error): string {
    // Check for custom error codes
    if ('code' in error && typeof error.code === 'string') {
      return error.code;
    }

    // Map common error types
    if (error.name === 'TypeError') return 'TYPE_ERROR';
    if (error.name === 'ReferenceError') return 'REFERENCE_ERROR';
    if (error.name === 'SyntaxError') return 'SYNTAX_ERROR';
    if (error.name === 'NetworkError') return 'NETWORK_ERROR';
    if (error.name === 'ValidationError') return 'VALIDATION_ERROR';

    return 'UNKNOWN_ERROR';
  }

  /**
   * Log error to console and potentially external service
   */
  private logError(error: AppError): void {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', error);
    }

    // Store in memory log
    this.errorLog.push(error);

    // Keep only last 100 errors
    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(-100);
    }

    // In production, you might want to send to external logging service
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(error);
    }
  }

  /**
   * Send error to external logging service
   */
  private sendToExternalService(error: AppError): void {
    // Example: Send to logging service like Sentry, LogRocket, etc.
    // This is a placeholder implementation
    try {
      // fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(error),
      // });
    } catch (loggingError) {
      console.error('Failed to send error to external service:', loggingError);
    }
  }

  /**
   * Get recent errors
   */
  getRecentErrors(limit: number = 10): AppError[] {
    return this.errorLog.slice(-limit);
  }

  /**
   * Clear error log
   */
  clearErrorLog(): void {
    this.errorLog = [];
  }

  /**
   * Create user-friendly error messages
   */
  getUserFriendlyMessage(error: AppError): string {
    const userMessages: Record<string, string> = {
      NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
      VALIDATION_ERROR: 'Please check your input and try again.',
      TYPE_ERROR: 'Something went wrong. Please refresh the page.',
      REFERENCE_ERROR: 'Something went wrong. Please refresh the page.',
      SYNTAX_ERROR: 'Something went wrong. Please refresh the page.',
      UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
    };

    return userMessages[error.code] || userMessages.UNKNOWN_ERROR;
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Export utility functions
export function handleError(error: unknown, context?: Record<string, unknown>): AppError {
  return errorHandler.handleError(error, context);
}

export function getUserFriendlyMessage(error: AppError): string {
  return errorHandler.getUserFriendlyMessage(error);
}
