import { IsString, MaxLength, MinLength, Matches } from "class-validator";

export class AuthDto {
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
        message: '이메일 형식이 올바르지 않습니다.',
    })
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/^[a-zA-Z0-9!@#$%^&*()_+{}|:"<>?~-]+$/, {
        message: '비밀번호는 영문자, 숫자, 특수문자(!@#$%^&*()_+{}|:"<>?~- 등)로 구성되어야 합니다.',
    })
    password: string;
}