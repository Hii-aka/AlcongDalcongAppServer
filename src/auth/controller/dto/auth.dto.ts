import { IsString, MaxLength, MinLength, Matches } from "class-validator";

export class AuthDto {
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
}