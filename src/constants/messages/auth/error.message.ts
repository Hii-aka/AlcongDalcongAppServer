export const AUTH_ERROR_MESSAGES = {
    VALIDATION: {
      EMAIL_REQUIRED: '이메일은 필수 입력값입니다',
      EMAIL_INVALID: '유효하지 않은 이메일 형식입니다',
      PASSWORD_REQUIRED: '비밀번호는 필수 입력값입니다',
      PASSWORD_INVALID: '비밀번호는 8자 이상, 영문/숫자/특수문자를 포함해야 합니다',
      TOKEN_REQUIRED: '토큰이 필요합니다',
    },
    AUTH: {
      USER_NOT_FOUND: '존재하지 않는 사용자입니다',
      EMAIL_NOT_FOUND: '존재하지 않는 이메일입니다',
      EMAIL_ALREADY_EXISTS: '이미 존재하는 이메일입니다',
      INVALID_PASSWORD: '잘못된 비밀번호입니다',
      REFRESH_TOKEN_NOT_FOUND: '리프레시 토큰이 존재하지 않습니다',
      TOKEN_EXPIRED: '만료된 토큰입니다',
      INVALID_TOKEN: '유효하지 않은 토큰입니다',
      UNAUTHORIZED: '인증되지 않은 사용자입니다',
      EMAIL_NOT_VERIFIED: '이메일 인증이 필요합니다',
    },
    SERVER: {
      INTERNAL_ERROR: '서버 내부 오류가 발생했습니다',
      DATABASE_ERROR: '데이터베이스 오류가 발생했습니다',
    },
  } as const;