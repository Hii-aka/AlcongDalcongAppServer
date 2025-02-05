import { Body, Controller, Inject, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthDto } from './dto/auth.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AppLogFormatter } from 'src/logger/log.formatter';

@Controller('auth')
export class AuthController {
    private logFormatter: AppLogFormatter;

    constructor(
        private authService: AuthService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        this.logFormatter = new AppLogFormatter();
    }

    @Post('/signup')
    async signup(@Body(ValidationPipe) authDto: AuthDto) {
        const logPayload = this.logFormatter.format('signup 호출', { dto: authDto });
        this.logger.log(logPayload);
        return this.authService.signup(authDto);
    }

    @Post('/login')
    login(@Body(ValidationPipe) authDto: AuthDto) {
        const logPayload = this.logFormatter.format('login 호출', { dto: authDto });
        this.logger.log(logPayload);
        return this.authService.login(authDto);
    }
}
