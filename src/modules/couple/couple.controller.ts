import { Controller, Param, Post, UseGuards, Request as Req, Body, Inject } from '@nestjs/common';
import { CoupleService } from './couple.service';
import { AuthGuard } from '@nestjs/passport';
import { AppLogFormatter } from 'src/logger/log.formatter';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrincipalDto } from 'src/modules/auth/dto/principal.dto';
import { LoginUser } from 'src/core/decorators/login-user.decorator';
import { CreateCouleRequestDto } from './dto/create-couple-request.dto';
import { RespondToCoupleRequestDto } from './dto/respond-to-couple-request.dto';
import { COUPLE_API_MESSAGES } from 'src/constants/messages/couple';

@Controller('couples')
export class CouplesController {
  private logFormatter: AppLogFormatter;

  constructor(
    private readonly coupleService: CoupleService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.logFormatter = new AppLogFormatter();
  }

  @Post('request')
  @UseGuards(AuthGuard())
  async createCoupleRequest(
    @LoginUser() principalDto: PrincipalDto,
    @Body() dto: CreateCouleRequestDto
  ) {
    const logPayload = this.logFormatter.format(COUPLE_API_MESSAGES.SUCCESS.CREATE_COUPLE_REQUEST, { principalDto, dto });
    this.logger.log(logPayload);
      return this.coupleService.createCoupleRequest(
      principalDto.id,
      dto.receiverId
    );
  }

  @Post('request/:id/respond')
  @UseGuards(AuthGuard())
  async respondToCoupleRequest(
    @LoginUser() principalDto: PrincipalDto,
    @Param('id') requestId: number,
    @Body() dto: RespondToCoupleRequestDto
  ) {
    const logPayload = this.logFormatter.format(COUPLE_API_MESSAGES.SUCCESS.RESPOND_TO_COUPLE_REQUEST, { principalDto, dto });
    this.logger.log(logPayload);
    return this.coupleService.respondToCoupleRequest(
      requestId,
      principalDto.id,
      dto.accept
    );
  }
}