import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from 'src/logger/winston.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Male } from './entities/male.entity';
import { Female } from './entities/female.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.register({}),
    TypeOrmModule.forFeature([User, Male, Female])],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
