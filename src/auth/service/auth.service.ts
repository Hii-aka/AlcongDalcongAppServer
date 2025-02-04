import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from '../controller/dto/auth.dto';
import { User } from '../domain/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async signup(authDto: AuthDto) {
        const { email, password } = authDto;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.userRepository.create({ email, password: hashedPassword ,loginType: 'email'});
        try {
            await this.userRepository.save(user);
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('이미 존재하는 이메일입니다.');
            }
            throw new InternalServerErrorException('회원가입 도중 에러가 발생했습니다.');
        }
        return {
            message: '회원가입이 완료되었습니다.',
        };
    }

    async login(authDto: AuthDto) {
        const { email, password } = authDto;
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('존재하지 않는 이메일입니다.');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
        }
        return {
            message: '로그인이 완료되었습니다.',
    }
}
