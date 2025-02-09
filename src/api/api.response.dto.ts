export class ApiResponseDto<T> {
    message: string;
    data?: T;
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