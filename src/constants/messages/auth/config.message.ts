export const AUTH_CONFIG = {
    JWT: {
      SECRET_KEY: 'JWT_SECRET',
      ACCESS_EXPIRES_IN: 'JWT_EXPIRES_IN',
      REFRESH_EXPIRES_IN: 'JWT_REFRESH_EXPIRES_IN',
    },
    HASH: {
      SALT_ROUNDS: 10,
    },
    LOGIN_TYPES: {
      EMAIL: 'email',
      GOOGLE: 'google',
      KAKAO: 'kakao',
    },
  } as const;