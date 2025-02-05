import { LogPayload, LogFormatter } from './interface/logger.Interface';

export class AppLogFormatter implements LogFormatter {
  format(
    message: string,
    data?: Record<string, any>,
    context?: string,
    level: LogPayload['level'] = 'info'
  ): LogPayload {
    return {
      level,
      message,
      data,
      context,
      timestamp: new Date().toISOString()
    };
  }
}