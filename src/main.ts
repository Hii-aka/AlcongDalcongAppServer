import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_CONSTANTS } from './constants/common/swagger.constant';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('알콩달콩 API')
    .setDescription('알콩달콩 API 문서')
    .setVersion('1.0')
    .addTag('알콩달콩 API')
    .addBearerAuth({
      type: SWAGGER_CONSTANTS.BEARER_AUTH.type,
      scheme: SWAGGER_CONSTANTS.BEARER_AUTH.scheme,
      bearerFormat: SWAGGER_CONSTANTS.BEARER_AUTH.bearerFormat,
      name: SWAGGER_CONSTANTS.BEARER_AUTH.name,
      description: SWAGGER_CONSTANTS.BEARER_AUTH.description,
      in: SWAGGER_CONSTANTS.BEARER_AUTH.in,
    },
    SWAGGER_CONSTANTS.ACCESS_TOKEN)
    .build();


  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  // 로깅 인터셉터 설정
  const logger = app.get(WINSTON_MODULE_PROVIDER);
  
  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.useGlobalFilters(new GlobalExceptionFilter(logger));

  app.enableCors({
    origin: ['http://localhost:5173'], // 허용할 도메인 목록
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // 허용할 HTTP 메서드
    credentials: true, // 쿠키 허용
    allowedHeaders: '*', // 허용할 헤더
    exposedHeaders: 'Authorization', // 클라이언트에 노출할 헤더
    maxAge: 3600, // preflight 요청 캐시 시간 (초)
  });

  
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server is running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
