import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthDto } from './dto/auth.dto';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    signup(@Body(ValidationPipe) authDto: AuthDto) {
        return this.authService.signup(authDto);
    }

    @Post('/login')
    login(@Body(ValidationPipe) authDto: AuthDto) {
        return this.authService.login(authDto);
    }
}
