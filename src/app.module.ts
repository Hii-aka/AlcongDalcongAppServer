import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { WINSTON_MODULE_PROVIDER, WinstonModule } from 'nest-winston';
import { winstonConfig } from './logger/winston.config';
import { CustomLogger } from './logger/custom.logger';
import { Logger } from 'winston';
import { LLMModule } from './modules/llm/llm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity.{ts,js}'],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    AuthModule,
    LLMModule,
    WinstonModule.forRoot(winstonConfig),
  ],
  controllers: [],
  providers: [
    {
      provide: 'LOGGER',
      useFactory: (logger: Logger) => {
        return new CustomLogger(logger);
      },
      inject: [WINSTON_MODULE_PROVIDER],
    },
  ],
  exports: ['LOGGER'],
})
export class AppModule {}
