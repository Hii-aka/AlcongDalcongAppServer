import { Module } from '@nestjs/common';
import { CoupleService } from './couple.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoupleRequest } from './couple-request.entity';
import { CouplesController } from './couple.controller';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from 'src/logger/winston.config';
import { AuthModule } from '../auth/auth.module';
import { User } from '../auth/user.entity';
@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
    TypeOrmModule.forFeature([CoupleRequest, User]),
    AuthModule
  ],
  controllers: [CouplesController],
  providers: [CoupleService]
})
export class CoupleModule {}
