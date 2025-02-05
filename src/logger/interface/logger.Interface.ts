export interface LogPayload {
    level: 'info' | 'error' | 'warn' | 'debug';
    message: string;
    data?: Record<string, any>;
    timestamp?: string;
    context?: string;
  }
  
  export interface LogFormatter {
    format(message: string, data?: Record<string, any>, context?: string): LogPayload;
  }