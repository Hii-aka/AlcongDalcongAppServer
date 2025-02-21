import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = 
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 클라이언트에 전달할 응답
    const clientResponse = {
      statusCode: status,
      message: this.getErrorMessage(exception),
    };

    // 서버 로깅을 위한 상세 정보
    const loggerResponse = {
      ...clientResponse,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      stack: exception.stack,
      headers: request.headers,
      query: request.query,
      body: request.body,
    };

    // 에러 로깅
    this.logger.error('Exception occurred', loggerResponse);

    response
      .status(status)
      .json(clientResponse);
  }

  private getErrorMessage(exception: Error): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse() as any;
      // class-validator 에러 처리
      if (Array.isArray(response.message)) {
        return response.message[0];
      }
      return response.message || exception.message;
    }
    
    // 프로덕션 환경에서는 상세 에러 메시지 숨기기
    return process.env.NODE_ENV === 'production' 
      ? '서버에 문제가 발생했습니다.' 
      : exception.message;
  }
} 