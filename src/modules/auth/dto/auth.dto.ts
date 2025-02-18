import { IsString, MaxLength, MinLength, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AuthDto {
    @ApiProperty({
        description: '이메일',
        minimum: 6,
        maximum: 50,
        example: 'test@test.com',
    })
    @IsString()
    @MinLength(6,{
        message: '이메일은 최소 6자 이상이어야 합니다.',

    })
    @MaxLength(50,{
        message: '이메일은 최대 50자 이하여야 합니다.',
    })
    @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
        message: '이메일 형식이 올바르지 않습니다.',
    })
    email: string;

    @ApiProperty({
        description: '비밀번호',
        minimum: 8,
        maximum: 20,
        example: 'password1234',
    })
    @IsString()

    @MinLength(8,{
        message: '비밀번호는 최소 8자 이상이어야 합니다.',
    })
    @MaxLength(20,{
        message: '비밀번호는 최대 20자 이하여야 합니다.',
    })
    @Matches(/^[a-zA-Z0-9!@#$%^&*()_+{}|:"<>?~-]+$/, {
        message: '비밀번호는 영문자, 숫자, 특수문자(!@#$%^&*()_+{}|:"<>?~- 등)로 구성되어야 합니다.',
    })
    password: string;

    @ApiProperty({
        description: '닉네임',
        minimum: 2,
        maximum: 10,
        example: '닉네임',
    })  
    @IsString() 
    @MinLength(2,{
        message: '닉네임은 최소 2자 이상이어야 합니다.',
    })
    @MaxLength(10,{
        message: '닉네임은 최대 10자 이하여야 합니다.',
    })
    @Matches(/^[a-zA-Z가-힣][a-zA-Z0-9가-힣]*$/,{
        message: '닉네임은 한글, 영문자, 숫자만 사용 가능하며, 첫 글자는 숫자가 될 수 없습니다.',
    })
    nickname: string;
}