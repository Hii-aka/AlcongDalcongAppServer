export const AUTH_SERVICE = {
    MESSAGES: {
      SUCCESS: {
        SIGNUP: '회원가입이 완료되었습니다',
        LOGOUT: '로그아웃이 완료되었습니다',
        TOKEN_REFRESH: '토큰이 갱신되었습니다',
      },
    },
    LOG: {
      USER_CREATED: '사용자 생성 완료',
      TOKEN_GENERATED: '토큰 생성 완료',
      TOKEN_REFRESHED: '토큰 갱신 완료',
    },
  } as const;