import { Module } from '@nestjs/common';
import { DateCalendarController } from './date-calendar.controller';
import { DateCalendarService } from './date-calendar.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DateCalendar } from './date-calendar.entity';  
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([DateCalendar]),
    AuthModule,
  ],
  controllers: [DateCalendarController],
  providers: [DateCalendarService]
})
export class DateCalendarModule {}
