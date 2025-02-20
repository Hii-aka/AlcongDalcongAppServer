export const DB_ERROR_CODES = {
    MYSQL: {
      DUPLICATE_ENTRY: 'ER_DUP_ENTRY',
      FOREIGN_KEY_VIOLATION: 'ER_ROW_IS_REFERENCED',
    },
  } as const;