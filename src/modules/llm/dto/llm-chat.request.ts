import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export default class LlmChatRequest {
  @ApiProperty({
    description: 'LLM 요청 질문 내용',
    example: '데이트 코스 추천해 줘',
  })
  @IsNotEmpty()
  question: string;
}
