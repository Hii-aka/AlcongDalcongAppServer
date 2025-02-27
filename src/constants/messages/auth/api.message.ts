export const AUTH_API_MESSAGES = {
    SUCCESS: {
      SIGNUP: '회원가입 성공',
      LOGIN: '로그인 성공',
      LOGOUT: '로그아웃 성공',
      TOKEN_REFRESH: '토큰 갱신 성공',
      PASSWORD_RESET: '비밀번호 재설정 성공',
      EMAIL_VERIFY: '이메일 인증 성공',
      ME: '사용자 정보 조회 성공',
      DISCONNECT: '사용자 연결 해제 성공',
    },
    DESCRIPTION: {
      SIGNUP: '새로운 사용자를 등록합니다',
      LOGIN: '사용자 인증을 수행합니다',
      LOGOUT: '현재 세션을 종료합니다',
      TOKEN_REFRESH: '액세스 토큰을 갱신합니다',
      PASSWORD_RESET: '비밀번호를 재설정합니다',
      EMAIL_VERIFY: '이메일 인증을 수행합니다',
      ME: '사용자 정보를 조회합니다',
      DISCONNECT: '사용자 연결 해제',
    },
    SWAGGER: {
      TAG: '인증',
      BEARER_AUTH: 'access-token',
    },
  } as const;