import { Controller, Post, Body, Inject, UseGuards } from '@nestjs/common';
import { DateCalendarService } from './date-calendar.service';
import { CreateDateCalendarDto } from './dto/create-date-calendar.dto';
import { DATE_CALENDAR_LOG_MESSAGES } from '../../constants/messages/date-calendar/api.message';
import { AppLogFormatter } from '../../logger/log.formatter';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ApiResponseDto } from 'src/api/api.response.dto';
import { HTTP_STATUS } from 'src/constants';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { ApiBody } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import { SWAGGER_CONSTANTS } from 'src/constants/common/swagger.constant';
import { PrincipalDto } from 'src/modules/auth/dto/principal.dto';
import { LoginUser } from 'src/core/decorators/login-user.decorator';
@Controller('date-calendars')
export class DateCalendarController {
    private logFormatter: AppLogFormatter;
    constructor(
        private readonly dateCalendarService: DateCalendarService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        this.logFormatter = new AppLogFormatter();
    }

    @ApiOperation({ summary: DATE_CALENDAR_LOG_MESSAGES.API_CALLED.CREATE })
    @ApiBody({ type: CreateDateCalendarDto })
    @ApiCreatedResponse({ description: DATE_CALENDAR_LOG_MESSAGES.SUCCESS.CREATE, type: ApiResponseDto })
    @ApiBearerAuth(SWAGGER_CONSTANTS.ACCESS_TOKEN)
    @Post()
    @UseGuards(AuthGuard())
    async createDateCalendar(
        @LoginUser() principalDto: PrincipalDto,
        @Body() dto: CreateDateCalendarDto
    ) {
        const logPayload = this.logFormatter.format(DATE_CALENDAR_LOG_MESSAGES.API_CALLED.CREATE, { principalDto, dto });

        this.logger.log(logPayload);    
        const response = await this.dateCalendarService.createDateCalendar(principalDto.coupleId, dto);
        
        return ApiResponseDto.success(
            DATE_CALENDAR_LOG_MESSAGES.SUCCESS.CREATE,
            response,
            HTTP_STATUS.SUCCESS.CREATED
        );
    }
}
