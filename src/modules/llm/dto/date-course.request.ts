import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OptionsRequest {
  @ApiProperty({
    description: '옵션 이름',
    example: '옵션1',
  })
  @IsString()
  optionName: string = '';

  @ApiProperty({
    description: '옵션 값',
    example: '값1',
  })
  @IsString()
  optionValue: string = '';
}

export class DateCourseRequest {
  @ApiProperty({
    example: [
      { optionName: '옵션1', optionValue: '값1' },
      { optionName: '옵션2', optionValue: '값2' },
    ],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OptionsRequest)
  additionalOptions?: OptionsRequest[] = [];
}
