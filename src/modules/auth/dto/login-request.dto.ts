import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginRequestDto {
    @IsString()
    @ApiProperty({
        description: '이메일',
        example: 'test@test.com',
    })
    email: string;

    @IsString()
    @ApiProperty({
        description: '비밀번호',
        example: 'password1234!',
    })
    password: string;

}