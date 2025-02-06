import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('알콩달콩 API')
    .setDescription('알콩달콩 API 문서')
    .setVersion('1.0')
    .addTag('알콩달콩 API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  // 로깅 인터셉터 설정
  const logger = app.get(WINSTON_MODULE_PROVIDER);
  
  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.useGlobalFilters(new GlobalExceptionFilter(logger));

  
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server is running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
