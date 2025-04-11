import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { LLMClient } from './llm.client';
import { DateCourseRequest } from './dto/date-course.request';
import { TypeConverter } from '../../common/utils/type-converter';
import LlmChatRequest from './dto/llm-chat.request';

@ApiTags('LLM')
@Controller('llm')
export class LLMController {
  private readonly TEMPLATE: string =
    process.env.LLM_DATE_COURSE_TEMPLATE || '데이트 코스 템플릿';
  private readonly DEFAULT_OPTION: string = 'No option. Just answer about request';

  constructor(private readonly llmClient: LLMClient) {
  }

  @ApiOperation({
    summary: '데이트 코스 추천',
    description: 'LLM API를 통해 데이트 코스를 추천 받을 수 있습니다.',
  })
  @ApiQuery({
    name: 'timeSlot',
    description: '시간대',
    example: '아침 ~ 저녁',
  })
  @ApiQuery({
    name: 'weekend',
    description: '주말 여부',
    example: 'true',
  })
  @ApiQuery({
    name: 'transportation',
    description: '교통수단',
    example: ['지하철', '버스'],
    isArray: true,
  })
  @ApiQuery({
    name: 'personnel',
    description: '인원',
    example: ['남자 1명', '여자 1명'],
    isArray: true,
  })
  @ApiQuery({
    name: 'budget',
    description: '예산',
    example: '5만 원',
  })
  @ApiQuery({
    name: 'region',
    description: '지역',
    example: ['서울', '경기'],
    isArray: true,
  })
  @Get('/date')
  requestDateCourseLLM(
    @Query() dateCourseRequest: DateCourseRequest,
    @Res() response: Response,
  ): void {
    const optionsToTransmit =
      TypeConverter.convertInstanceValuesToArray(dateCourseRequest);

    this.proceedStreamingFromExternalApi(
      response,
      this.llmClient,
      optionsToTransmit,
      this.TEMPLATE,
    );
  }

  private proceedStreamingFromExternalApi(
    response: Response,
    llmClient: LLMClient,
    options: any,
    template: string,
  ): void {
    const responseFlux = llmClient.receiveLLMStreaming(options, template);
    const subscription = responseFlux.subscribe({
      next: (chunk) => response.write(`data: ${chunk}\n\n`),
      error: (err) => {
        response.write(`에러 발생: ${err}`);
        response.end();
      },
      complete: () => response.end(),
    });

    response.on('close', () => subscription.unsubscribe());
  }

  @ApiOperation({
    summary: 'LLM에게 질문',
    description: 'LLM API를 통해 질문에 대한 답을 받을 수 있습니다.',
  })
  @Post('/chat')
  requestChatLLM(
    @Body() llmChatRequest: LlmChatRequest,
    @Res() response: Response,
  ): void {
    this.proceedStreamingFromExternalApi(
      response,
      this.llmClient,
      { option: [this.DEFAULT_OPTION] },
      llmChatRequest.question,
    );
  }
}
