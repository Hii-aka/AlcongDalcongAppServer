import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from 'src/logger/winston.config';

@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
    TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
