import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';


import { ConfigService } from '@nestjs/config';
import { UserWithoutPassword } from './types/auth.type';
import { LoginServiceResponse } from './types/auth-service.types';
import { PrincipalDto } from './dto/principal.dto';
import { DB_ERROR_CODES, AUTH_ERROR_MESSAGES, AUTH_SERVICE, AUTH_CONFIG } from 'src/constants';

@Injectable()
export class AuthService {
    async getMe(principalDto: PrincipalDto) {
        const user = await this.userRepository.findOne({ where: { id: principalDto.id } });
        if (!user) {
            throw new UnauthorizedException(AUTH_ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
        }
        const userWithoutPassword = { ...user, password: undefined } as unknown as UserWithoutPassword;
        return userWithoutPassword;
    }
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async signup(authDto: AuthDto): Promise<{ message: string }> {
        const { email, password, nickname } = authDto;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.userRepository.create({ email, password: hashedPassword, nickname, loginType: AUTH_CONFIG.LOGIN_TYPES.EMAIL });
        try {
            await this.userRepository.save(user);
        } catch (error) {
            if (error.code === DB_ERROR_CODES.MYSQL.DUPLICATE_ENTRY) {
                throw new ConflictException(AUTH_ERROR_MESSAGES.AUTH.EMAIL_ALREADY_EXISTS);
            }
            throw new InternalServerErrorException(AUTH_ERROR_MESSAGES.SERVER.INTERNAL_ERROR);
        }

        return {
            message: AUTH_SERVICE.MESSAGES.SUCCESS.SIGNUP,
        };
    }

    async login(authDto: AuthDto) : Promise<LoginServiceResponse> {
        const { email, password } = authDto;
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedException(AUTH_ERROR_MESSAGES.AUTH.EMAIL_NOT_FOUND);
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException(AUTH_ERROR_MESSAGES.AUTH.INVALID_PASSWORD);
        }
        const tokens = await this.getTokens({ email });
        await this.updateHashedRefreshToken(user.id, tokens.refreshToken);
        const userWithoutPassword = { ...user, hashedRefreshToken: undefined, password: undefined } as unknown as UserWithoutPassword;
        return {
            user: userWithoutPassword,
            tokens,
        };
    }


    async logout(principalDto: PrincipalDto) {
        try {
            await this.userRepository.update(principalDto.id, { hashedRefreshToken: undefined });
        } catch (error) {
            throw new InternalServerErrorException(AUTH_ERROR_MESSAGES.SERVER.INTERNAL_ERROR);
        }
        return {
            message: AUTH_SERVICE.MESSAGES.SUCCESS.LOGOUT,
        };
    }

    async refreshToken(principalDto: PrincipalDto): Promise<Record<string, string>> {
        const { accessToken, refreshToken } = await this.getTokens({ email: principalDto.email });
        await this.updateHashedRefreshToken(principalDto.id, refreshToken);
        return {
            accessToken,
            refreshToken,
        };
    }


    private async getTokens(payload: {email: string}) {
        const [accessToken, refreshToken] = await Promise.all([

            this.jwtService.signAsync(payload, {
                secret: this.configService.get(AUTH_CONFIG.JWT.SECRET_KEY),
                expiresIn: this.configService.get(AUTH_CONFIG.JWT.ACCESS_EXPIRES_IN),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get(AUTH_CONFIG.JWT.SECRET_KEY),   
                expiresIn: this.configService.get(AUTH_CONFIG.JWT.REFRESH_EXPIRES_IN),
            }),
        ]);
        return { accessToken, refreshToken };
    }

    private async updateHashedRefreshToken(id: number, refreshToken: string) {
        const salt = await bcrypt.genSalt(10);
        const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

        try {
            await this.userRepository.update(id, {  hashedRefreshToken });
        } catch (error) {
            throw new InternalServerErrorException(AUTH_ERROR_MESSAGES.SERVER.INTERNAL_ERROR);
        }
    }
}
