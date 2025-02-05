import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, headers } = request;
    const now = Date.now();
    const requestId = headers['x-request-id'] || `req-${now}`;

    // 요청 로깅
    this.logger.info('Incoming Request', {
      requestId,
      timestamp: new Date().toISOString(),
      method,
      url,
      body,
      headers: {
        ...headers,
        authorization: headers.authorization ? '[FILTERED]' : undefined
      }
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          // 응답 로깅
          this.logger.info('Response Sent', {
            requestId,
            timestamp: new Date().toISOString(),
            method,
            url,
            responseTime: `${Date.now() - now}ms`,
            response: data
          });
        },
        error: (error) => {
          // 에러 로깅
          this.logger.error('Request Failed', {
            requestId,
            timestamp: new Date().toISOString(),
            method,
            url,
            responseTime: `${Date.now() - now}ms`,
            error: {
              message: error.message,
              stack: error.stack,
              status: error.status
            }
          });
        }
      })
    );
  }
} 