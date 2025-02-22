import { ApiProperty } from "@nestjs/swagger";
import { CoupleRequestStatus } from "../enums/couple-request-status.enum";
export class CoupleResponseDto {
    @ApiProperty({ description: '커플 요청 대기 조회 id' })
    id: number;
    @ApiProperty({ description: '커플 요청 대기 조회 sender' })
    sender: {
        id: number;
        email: string;
        nickname: string;
    };
    @ApiProperty({ description: '커플 요청 대기 조회 receiver' })
    receiver: {
        id: number;
        email: string;
        nickname: string;
    };
    @ApiProperty({ description: '커플 요청 대기 조회 status' })
    status: CoupleRequestStatus;
    @ApiProperty({ description: '커플 요청 대기 조회 firstMetDate' })
    firstMetDate: Date;
    @ApiProperty({ description: '커플 요청 대기 조회 createdAt' })
    createdAt: Date;
    @ApiProperty({ description: '커플 요청 대기 조회 updatedAt' })
    updatedAt: Date;
}


