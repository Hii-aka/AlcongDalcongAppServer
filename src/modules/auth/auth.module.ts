import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from 'src/logger/winston.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { CoupleRequest } from '../couple/couple-request.entity';
@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.register({}),
    TypeOrmModule.forFeature([User, CoupleRequest])],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  exports: [JwtStrategy, PassportModule, JwtRefreshStrategy]
})
export class AuthModule {}
