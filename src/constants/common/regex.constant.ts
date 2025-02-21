export const REGEX_PATTERNS = {
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    PASSWORD: /^[a-zA-Z0-9!@#$%^&*()_+{}|:"<>?~-]+$/,
    NICKNAME: /^[a-zA-Z가-힣][a-zA-Z0-9가-힣]*$/,
    DATE: /^\d{4}-\d{2}-\d{2}$/,
  } as const;