import { IsNotEmpty, IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RespondToCoupleRequestDto {
    @ApiProperty({ description: '커플 요청 수락 여부' })
    @IsNotEmpty()
    @IsBoolean()
    accept: boolean;
}   