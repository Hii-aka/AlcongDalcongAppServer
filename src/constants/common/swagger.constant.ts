export const SWAGGER_CONSTANTS = {
    BEARER_AUTH: {
        type: 'http' ,
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    },
    ACCESS_TOKEN: 'access-token',
} as const;