import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateCalendar } from './date-calendar.entity';
import { CreateDateCalendarDto } from './dto/create-date-calendar.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AppLogFormatter } from '../../logger/log.formatter';
import { DATE_CALENDAR_SERVICE_MESSAGES } from '../../constants/messages/date-calendar/service.message';
import { DATE_CALENDAR_ERROR_MESSAGES } from '../../constants/messages/date-calendar/error.message';
@Injectable()
export class DateCalendarService {
    private logFormatter: AppLogFormatter;
    constructor(
        @InjectRepository(DateCalendar)
        private dateCalendarRepository: Repository<DateCalendar>,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        this.logFormatter = new AppLogFormatter();
    }

    async createDateCalendar(coupleId?: number, dto?: CreateDateCalendarDto): Promise<{ id: number }> {
        const logPayload = this.logFormatter.format(DATE_CALENDAR_SERVICE_MESSAGES.API_CALLED.CREATE, { dto });
        this.logger.log(logPayload);    
        if(!coupleId) {
            throw new BadRequestException(DATE_CALENDAR_ERROR_MESSAGES.ERROR.COUPLE_ID_REQUIRED);
        }
        const dateCalendar = this.dateCalendarRepository.create({
            ...dto,
            coupleId: coupleId,
        });
        await this.dateCalendarRepository.save(dateCalendar);
        return {
            id: dateCalendar.id,
        };
    }
}
