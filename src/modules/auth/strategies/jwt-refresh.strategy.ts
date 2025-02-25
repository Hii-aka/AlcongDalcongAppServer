import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from 'bcryptjs';
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || '',
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: { email: string }) {
        const { email } = payload;
        const refreshToken = req.headers['authorization'].split(' ')[1];

        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('존재하지 않는 이메일입니다.');
        }
        if (!user.hashedRefreshToken) {
            throw new UnauthorizedException('리프레시 토큰이 존재하지 않습니다.');
        }
        const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
        if (!isRefreshTokenValid) {
            throw new UnauthorizedException('리프레시 토큰이 유효하지 않습니다.');
        }
        return { id: user.id, email: user.email, refreshToken: refreshToken };
    }
}