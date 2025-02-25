import { ApiProperty } from "@nestjs/swagger";

export class PrincipalDto {
    @ApiProperty({ description: '유저 아이디' })    
    id: number;
    @ApiProperty({ description: '유저 이메일' })
    email: string;
    @ApiProperty({ description: '유저 해시된 리프레시 토큰' })
    hashedRefreshToken?: string;
    @ApiProperty({ description: '유저 리프레시 토큰' })
    refreshToken?: string;
    @ApiProperty({ description: '유저 성별' })
    gender: string;
}


