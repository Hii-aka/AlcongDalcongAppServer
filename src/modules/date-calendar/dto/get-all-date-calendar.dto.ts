import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class GetAllDateCalendarsDto {
    @ApiProperty({ description: '년도' })
    @IsNumber()
    @IsOptional()
    year: number;

    @ApiProperty({ description: '월' })
    @IsNumber()
    @IsOptional()
    month: number;
}
    