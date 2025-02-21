import { IsNotEmpty, IsEmail, IsDateString, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { REGEX_PATTERNS } from "src/constants/common/regex.constant";
export class CreateCouleRequestDto {
    @ApiProperty({ 
        description: '받는 사람의 이메일',
        example: 'user@example.com'
    })
    @IsNotEmpty()
    @IsEmail()
    @Matches(REGEX_PATTERNS.EMAIL)
    receiverEmail: string;

    @ApiProperty({ 
        description: '첫 만난 날짜 (ISO 8601 형식)',
        example: '2024-03-14',
        type: String
    })
    @IsNotEmpty()
    @IsDateString()
    @Matches(REGEX_PATTERNS.DATE)
    firstMetDate: string;
}   