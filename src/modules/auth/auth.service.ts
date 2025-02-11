import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';


import { ConfigService } from '@nestjs/config';
import { UserWithoutPassword } from './types/auth.type';
import { LoginServiceResponse } from './types/auth.service.types';
import { MySQLErrorCode } from '../../shared/constants';
import { PrincipalDto } from './dto/principal.dto';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)

        private userRepository: Repository<User>,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async signup(authDto: AuthDto) {
        const { email, password } = authDto;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.userRepository.create({ email, password: hashedPassword ,loginType: 'email'});
        try {
            await this.userRepository.save(user);
        } catch (error) {
            if (error.code === MySQLErrorCode.DUPLICATE_ENTRY) {
                throw new ConflictException('이미 존재하는 이메일입니다.');
            }
            throw new InternalServerErrorException('회원가입 도중 에러가 발생했습니다.');
        }

        return {
            message: '회원가입이 완료되었습니다.',
        };
    }

     

    async login(authDto: AuthDto) : Promise<LoginServiceResponse> {
        const { email, password } = authDto;
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('존재하지 않는 이메일입니다.');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
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
            throw new InternalServerErrorException('로그아웃 도중 에러가 발생했습니다.');
        }
        return {
            message: '로그아웃 성공',
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
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get('JWT_EXPIRES_IN'),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_SECRET'),   
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
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
            throw new InternalServerErrorException('리프레시 토큰 업데이트 도중 에러가 발생했습니다.');
        }
    }
}
