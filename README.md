# 알콩달콩 (AlcongDalcong) - 커플 다이어리 서버 🖥️

## 소개
알콩달콩 서버는 NestJS 기반의 백엔드 시스템으로, RESTful API를 제공하며 실시간 데이터 동기화, 인증, 데이터 저장 및 AI 기능을 처리합니다.

## 주요 기능 ⚙️

### 1. 인증 및 보안
- OAuth 2.0 기반 소셜 로그인 (카카오, 애플)
- JWT 토큰 기반 인증 (@nestjs/jwt)
- Guards를 통한 인증 미들웨어
- 데이터 암호화 (bcrypt)

### 2. 실시간 데이터 동기화
- WebSocket (@nestjs/websockets)을 통한 실시간 다이어리 동기화
- 커플 간 데이터 공유 시스템
- 이벤트 기반 알림 시스템 (Socket.io)

### 3. AI 서비스
- OpenAI API 통합
- 데이트 코스 추천 알고리즘
- 사용자 취향 분석 및 학습

### 4. 데이터 관리
- TypeORM을 활용한 데이터 CRUD
- AWS S3 기반 미디어 파일 저장
- 캘린더 이벤트 관리
- 커플 매칭 시스템

## 기술 스택 🛠

### 핵심 기술
- Language: TypeScript
- Framework: NestJS
- Database: MySQL 8.0
- ORM: TypeORM
- Cache: Redis

### 인프라
- AWS (EC2, S3, RDS)
- Docker
- Nginx
- GitHub Actions (CI/CD)

### 모니터링 & 로깅
- Winston Logger
- Prometheus
- Grafana
- Sentry

### 테스트
- Jest
- SuperTest

## 프로젝트 구조 📁
```
AlcongDalcongServer/
├── src/
│ ├── config/
│ ├── modules/
│ │ ├── auth/
│ │ ├── diary/
│ │ ├── calendar/
│ │ ├── user/
│ │ └── recommendation/
│ ├── common/
│ │ ├── decorators/
│ │ ├── filters/
│ │ ├── guards/
│ │ ├── interceptors/
│ │ └── pipes/
│ ├── entities/
│ └── utils/
├── test/
└── docs/

컨벤션
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드 업무 수정
🧪
bash
유닛 테스트
npm run test
e2e 테스트
npm run test:e2e
테스트 커버리지
npm run test:cov
.
```