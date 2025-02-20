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
import { AUTH_API_MESSAGES, AUTH_LOG_MESSAGES, HTTP_STATUS } from 'src/constants';

@Controller('auth')
export class AuthController {
    private logFormatter: AppLogFormatter;


    constructor(
        private authService: AuthService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        this.logFormatter = new AppLogFormatter();
    }

    @ApiOperation({ summary: AUTH_API_MESSAGES.DESCRIPTION.SIGNUP })
    @ApiBody({ type: AuthDto })
    @ApiCreatedResponse({ description: AUTH_API_MESSAGES.SUCCESS.SIGNUP , type: ApiResponseDto})
    @Post('/signup')
    async signup(@Body(ValidationPipe) dto: AuthDto) {
        const logPayload = this.logFormatter.format(AUTH_LOG_MESSAGES.API_CALLED.SIGNUP, { dto });

        this.logger.log(logPayload);    
        const response = await this.authService.signup(dto);
        return ApiResponseDto.success(
            AUTH_API_MESSAGES.SUCCESS.SIGNUP,
            response,
            HTTP_STATUS.SUCCESS.CREATED,
        );
    }

    @ApiOperation({ summary: AUTH_API_MESSAGES.DESCRIPTION.LOGIN })
    @ApiBody({ type: AuthDto })
    @ApiCreatedResponse({ description: AUTH_API_MESSAGES.SUCCESS.LOGIN , type: ApiResponseDto})
    @Post('/login') 
    async login(@Body(ValidationPipe) dto: AuthDto) {
        const logPayload = this.logFormatter.format(AUTH_LOG_MESSAGES.API_CALLED.LOGIN, { dto });
        this.logger.log(logPayload);
        const response = await this.authService.login(dto);
        return ApiResponseDto.success(
            AUTH_API_MESSAGES.SUCCESS.LOGIN,
            response,
            HTTP_STATUS.SUCCESS.OK,
        );
    }

    @Delete('/logout')
    @UseGuards(AuthGuard())
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: AUTH_API_MESSAGES.DESCRIPTION.LOGOUT })
    @ApiCreatedResponse({ description: AUTH_API_MESSAGES.SUCCESS.LOGOUT , type: ApiResponseDto})
    async logout(@LoginUser() principalDto: PrincipalDto) {
        const logPayload = this.logFormatter.format(AUTH_LOG_MESSAGES.API_CALLED.LOGOUT, { principalDto });
        this.logger.log(logPayload);
        const response = await this.authService.logout(principalDto);
        return ApiResponseDto.success(
            AUTH_API_MESSAGES.SUCCESS.LOGOUT,
            response,
            HTTP_STATUS.SUCCESS.OK,
        );
    }

    @Get('/me')
    @UseGuards(AuthGuard())
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: AUTH_API_MESSAGES.DESCRIPTION.ME })
    @ApiCreatedResponse({ description: AUTH_API_MESSAGES.SUCCESS.ME , type: ApiResponseDto})
    async me(@LoginUser() principalDto: PrincipalDto) {
        const logPayload = this.logFormatter.format(AUTH_LOG_MESSAGES.API_CALLED.ME, { principalDto });
        this.logger.log(logPayload);
        const response = await this.authService.getMe(principalDto);
        return ApiResponseDto.success(
            AUTH_API_MESSAGES.SUCCESS.ME,
            response,
            HTTP_STATUS.SUCCESS.OK,
        );
    }

    @Get('/refresh')
    @UseGuards(AuthGuard())
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: AUTH_API_MESSAGES.DESCRIPTION.TOKEN_REFRESH })
    @ApiCreatedResponse({ description: AUTH_API_MESSAGES.SUCCESS.TOKEN_REFRESH , type: ApiResponseDto})
    async refresh(@LoginUser() principalDto: PrincipalDto) {
        const logPayload = this.logFormatter.format(AUTH_LOG_MESSAGES.API_CALLED.REFRESH, { principalDto });
        this.logger.log(logPayload);
        const response = await this.authService.refreshToken(principalDto);

        return ApiResponseDto.success(
            AUTH_API_MESSAGES.SUCCESS.TOKEN_REFRESH,
            response,
            HTTP_STATUS.SUCCESS.OK,
        );
    }
}
