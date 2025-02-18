import { Body, Controller, Inject, Post, ValidationPipe, Get, UseGuards, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AppLogFormatter } from '../../logger/log.formatter';
import { ApiResponseDto } from '../../api/api.response.dto';


import { ApiOperation, ApiBody, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LoginUser } from '../../core/decorators/login-user.decorator';
import { PrincipalDto } from './dto/principal.dto';
@Controller('auth')



export class AuthController {
    private logFormatter: AppLogFormatter;


    constructor(
        private authService: AuthService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        this.logFormatter = new AppLogFormatter();
    }

    // @ApiOperation({ summary: '회원가입' })
    // @ApiBody({ type: AuthDto })
    // @ApiCreatedResponse({ description: '회원가입 성공' , type: ApiResponseDto})
    // @Post('/signup')
    // async signup(@Body(ValidationPipe) authDto: AuthDto) {
    //     const logPayload = this.logFormatter.format('signup 호출', { dto: authDto });

    //     this.logger.log(logPayload);    
    //     const response = await this.authService.signup(authDto);
    //     return ApiResponseDto.success(
    //         '회원가입 성공',
    //         response,
    //         201,
    //     );
    // }

    @ApiOperation({ summary: '여성 회원가입' })
    @ApiBody({ type: AuthDto })
    @ApiCreatedResponse({ description: '여성 회원가입 성공' , type: ApiResponseDto})
    @Post('/signup/female')
    async signupFemale(@Body(ValidationPipe) authDto: AuthDto) {
        const logPayload = this.logFormatter.format('signup 호출', { dto: authDto });

        this.logger.log(logPayload);    
        const response = await this.authService.signupFemale(authDto);
        return ApiResponseDto.success(
            '여성 회원가입 성공',
            response,
            201,
        );
    }

    @ApiOperation({ summary: '남성 회원가입' })
    @ApiBody({ type: AuthDto })
    @ApiCreatedResponse({ description: '남성 회원가입 성공' , type: ApiResponseDto})
    @Post('/signup/male')
    async signupMale(@Body(ValidationPipe) authDto: AuthDto) {
        const logPayload = this.logFormatter.format('signup 호출', { dto: authDto });

        this.logger.log(logPayload);    
        const response = await this.authService.signupMale(authDto);
        return ApiResponseDto.success(
            '남성 회원가입 성공',
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

    @Delete('/logout')
    @UseGuards(AuthGuard())
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: '로그아웃' })
    @ApiCreatedResponse({ description: '로그아웃 성공' , type: ApiResponseDto})
    async logout(@LoginUser() principalDto: PrincipalDto) {
        const logPayload = this.logFormatter.format('logout 호출', { principalDto });
        this.logger.log(logPayload);
        const response = await this.authService.logout(principalDto);
        return ApiResponseDto.success('로그아웃 성공', response, 200);
    }

    @Get('/refresh')
    @UseGuards(AuthGuard())
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: '토큰 갱신' })
    @ApiCreatedResponse({ description: '토큰 갱신 성공' , type: ApiResponseDto})
    async refresh(@LoginUser() principalDto: PrincipalDto) {
        const logPayload = this.logFormatter.format('refresh 호출', { principalDto });
        this.logger.log(logPayload);
        const response = await this.authService.refreshToken(principalDto);

        return ApiResponseDto.success('토큰 갱신 성공', response, 200);
    }
}
