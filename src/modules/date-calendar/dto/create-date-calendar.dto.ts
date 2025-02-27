import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";


export class CreateDateCalendarDto {
    @ApiProperty({ description: '제목' })   
    @IsString()
    @IsNotEmpty()
    title: string;
    @ApiProperty({ description: '설명' })
    @IsString()
    @IsNotEmpty()
    description: string;
    @ApiProperty({ description: '날짜' })
    @IsDateString() // YYYY-MM-DD
    @IsNotEmpty()
    date: Date;
    @ApiProperty({ description: '시간' })
    @IsString()
    @IsNotEmpty()
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)  // HH:mm 형식 검증
    time: string;
    @ApiProperty({ description: '장소' })
    @IsString()
    @IsNotEmpty()
    location: string;
}