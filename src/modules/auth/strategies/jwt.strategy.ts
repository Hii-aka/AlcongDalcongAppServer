import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User } from "../user.entity"; 
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { PrincipalDto } from "../dto/principal.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || '',
        });
    }

    async validate(payload: { email: string }): Promise<PrincipalDto> {
        const { email } = payload;
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('존재하지 않는 이메일입니다.');
        }
        if (!user.hashedRefreshToken) {
            throw new UnauthorizedException('리프레시 토큰이 존재하지 않습니다.');
        }
        return {id: user.id, email: user.email, hashedRefreshToken: user.hashedRefreshToken, gender: user.gender, coupleId: user.coupleId };
    }   
}