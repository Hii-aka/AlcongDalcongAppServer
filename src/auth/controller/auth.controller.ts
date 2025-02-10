import { Body, Controller, Inject, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthDto } from './dto/auth.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AppLogFormatter } from 'src/logger/log.formatter';
import { ApiResponseDto } from 'src/api/api.response.dto';
import { ApiOperation, ApiBody, ApiResponse, ApiCreatedResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    private logFormatter: AppLogFormatter;


    constructor(
        private authService: AuthService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        this.logFormatter = new AppLogFormatter();
    }

    @ApiOperation({ summary: '회원가입' })
    @ApiBody({ type: AuthDto })
    @ApiCreatedResponse({ description: '회원가입 성공' , type: ApiResponseDto})
    @Post('/signup')
    async signup(@Body(ValidationPipe) authDto: AuthDto) {
        const logPayload = this.logFormatter.format('signup 호출', { dto: authDto });

        this.logger.log(logPayload);    
        const response = await this.authService.signup(authDto);
        return ApiResponseDto.success(
            '회원가입 성공',
            response,
            201,
        );
    }

    @ApiOperation({ summary: '로그인' })
    @ApiBody({ type: AuthDto })
    @ApiCreatedResponse({ description: '로그인 성공' , type: ApiResponseDto})
    @Post('/login')
    async login(@Body(ValidationPipe) authDto: AuthDto) {
        const logPayload = this.logFormatter.format('login 호출', { dto: authDto });
        this.logger.log(logPayload);
        const response = await this.authService.login(authDto);
        return ApiResponseDto.success(

            '로그인 성공',
            response,
            200,
        );
    }
}
