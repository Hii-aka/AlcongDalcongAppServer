export const AUTH_LOG_MESSAGES = {
    API_CALLED: {
      SIGNUP: 'signup 호출',
      LOGIN: 'login 호출',
      LOGOUT: 'logout 호출',
      REFRESH: 'refresh 호출',
      PASSWORD_RESET: 'password reset 호출',
      EMAIL_VERIFY: 'email verify 호출',
    },
    SERVICE: {
      USER_CREATED: '사용자 생성 완료',
      TOKEN_GENERATED: '토큰 생성 완료',
      TOKEN_REFRESHED: '토큰 갱신 완료',
      USER_LOGGED_OUT: '사용자 로그아웃 완료',
    },
    ERROR: {
      AUTH_FAILED: '인증 실패',
      TOKEN_GENERATION_FAILED: '토큰 생성 실패',
      DATABASE_ERROR: 'DB 작업 실패',
    },
  } as const;