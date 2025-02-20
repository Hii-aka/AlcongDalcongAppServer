import { IsNotEmpty, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCouleRequestDto {
    @ApiProperty({ description: '받는 사람의 아이디' })
    @IsNotEmpty()
    @IsNumber()
    receiverId: number;
}   