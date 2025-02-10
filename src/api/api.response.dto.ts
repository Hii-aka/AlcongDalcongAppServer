import { ApiProperty } from "@nestjs/swagger";

export class ApiResponseDto<T> {
    @ApiProperty({
        description: '메시지',
        example: '성공',
    })
    message: string;
    @ApiProperty({
        description: '데이터',
        example: '데이터',
    })
    data?: T;
    @ApiProperty({
        description: '상태코드',
        example: 200,
    })
    statusCode: number;



    private constructor(message: string, data?: T, statusCode: number = 200) {
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
    }

    static success<T>(message: string, data?: T, statusCode: number = 200) {
        return new ApiResponseDto(message, data, statusCode);
    }

    static error<T>(message: string, data?: T, statusCode: number = 500) {
        return new ApiResponseDto(message, data, statusCode);
    }
}