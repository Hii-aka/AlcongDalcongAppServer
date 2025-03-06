import { Controller, Post, Body, Inject, UseGuards, Get, Query, BadRequestException, Param } from '@nestjs/common';
import { DateCalendarService } from './date-calendar.service';
import { CreateDateCalendarDto } from './dto/create-date-calendar.dto';
import { DATE_CALENDAR_LOG_MESSAGES } from '../../constants/messages/date-calendar/api.message';
import { AppLogFormatter } from '../../logger/log.formatter';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ApiResponseDto } from 'src/api/api.response.dto';
import { HTTP_STATUS } from 'src/constants';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ApiBody } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import { SWAGGER_CONSTANTS } from 'src/constants/common/swagger.constant';
import { PrincipalDto } from 'src/modules/auth/dto/principal.dto';
import { LoginUser } from 'src/core/decorators/login-user.decorator';
import { GetAllDateCalendarsDto } from './dto/get-all-date-calendar.dto';
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

    @ApiOperation({ summary: DATE_CALENDAR_LOG_MESSAGES.API_CALLED.GET_ALL })
    @ApiBearerAuth(SWAGGER_CONSTANTS.ACCESS_TOKEN)
    @UseGuards(AuthGuard())
    @Get()
    async getAllDateCalendars(@LoginUser() principalDto: PrincipalDto, @Query() dto: GetAllDateCalendarsDto) {
        const logPayload = this.logFormatter.format(DATE_CALENDAR_LOG_MESSAGES.API_CALLED.GET_ALL, { principalDto });
        this.logger.log(logPayload);
        const response = await this.dateCalendarService.getAllDateCalendars(principalDto.coupleId, dto);
        return ApiResponseDto.success(
            DATE_CALENDAR_LOG_MESSAGES.SUCCESS.GET_ALL,
            response,
            HTTP_STATUS.SUCCESS.OK
        );
    }

    @ApiOperation({ summary: DATE_CALENDAR_LOG_MESSAGES.API_CALLED.GET_DATE_CALENDAR })
    @ApiBearerAuth(SWAGGER_CONSTANTS.ACCESS_TOKEN)
    @ApiParam({ name: 'date', description: '날짜' })
    @UseGuards(AuthGuard())
    @Get('/:date')
    async getDateCalendar(@LoginUser() principalDto: PrincipalDto, @Param('date') date: string) {
        const logPayload = this.logFormatter.format(DATE_CALENDAR_LOG_MESSAGES.API_CALLED.GET_DATE_CALENDAR, { principalDto });
        this.logger.log(logPayload);
        const response = await this.dateCalendarService.getDateCalendar(principalDto.coupleId, date);
        return ApiResponseDto.success(
            DATE_CALENDAR_LOG_MESSAGES.SUCCESS.GET_DATE_CALENDAR, 
            response, 
            HTTP_STATUS.SUCCESS.OK
        );
    }

    @ApiOperation({ summary: DATE_CALENDAR_LOG_MESSAGES.API_CALLED.GET_DATE_CALENDAR_BY_ID })
    @ApiBearerAuth(SWAGGER_CONSTANTS.ACCESS_TOKEN)
    @ApiParam({ name: 'id', description: 'id' })
    @UseGuards(AuthGuard())
    @Get('/detail/:id')
    async getDateCalendarById(@LoginUser() principalDto: PrincipalDto, @Param('id') id: string) {   
        const logPayload = this.logFormatter.format(DATE_CALENDAR_LOG_MESSAGES.API_CALLED.GET_DATE_CALENDAR_BY_ID, { principalDto });
        this.logger.log(logPayload);
        const response = await this.dateCalendarService.getDateCalendarById(principalDto.coupleId, id);
        return ApiResponseDto.success(
            DATE_CALENDAR_LOG_MESSAGES.SUCCESS.GET_DATE_CALENDAR_BY_ID,
            response,
            HTTP_STATUS.SUCCESS.OK
        );
    }
}
