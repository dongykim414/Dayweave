# Dayweave

Dayweave는 감정과 한 줄, 선택적 사진으로 오늘을 빠르게 남기고 필요할 때 긴 글로
확장하는 개인 모바일 다이어리입니다. 장기적으로 Theme Pack, Mood Pack, 파츠형
Avatar, 클라우드 동기화와 일정·SNS 연결을 단계적으로 추가합니다.

이 저장소는 제품 개발과 함께 AI 코딩 Agent의 작업을 관찰하고 반복되는 실패를
문서·검증·자동화로 줄이는 Harness Engineering 실험을 기록합니다.

## 현재 단계: M0 Foundation

- React Native + Expo SDK 57 + Expo Router
- `오늘`, `타임라인`, `아바타`, `내 정보` 4개 탭 셸
- Sky Theme와 semantic design token
- ThemeProvider, theme registry, 공용 UI primitive
- semantic Mood ID와 파츠형 Avatar 타입 기반
- 실제 기록 CRUD, 사진 선택, 로컬 DB는 아직 구현하지 않음

제품과 현재 범위는 [`docs/PRODUCT.md`](docs/PRODUCT.md), 기술 경계는
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)를 참고합니다.

## 시작하기

Node.js 22와 pnpm 11을 사용합니다.

```bash
pnpm install
pnpm dev
```

개발 서버의 QR 코드를 Expo Go로 스캔하거나 플랫폼 명령을 실행합니다.

```bash
pnpm android
pnpm ios
pnpm web
```

Windows에서는 Android 기기·에뮬레이터와 Web을 실행할 수 있습니다. iOS
시뮬레이터와 로컬 네이티브 빌드는 macOS가 필요합니다.

## 검증

```bash
pnpm deps:check
pnpm lint
pnpm typecheck
pnpm build:web
```

## 개발 및 릴리스

- 작업 방법: [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md)
- 활성 프로세스: [`docs/process/development-and-release.md`](docs/process/development-and-release.md)
- 단계적 도입 항목: [`docs/process/deferred-capabilities.md`](docs/process/deferred-capabilities.md)

모든 변경은 short-lived branch와 PR을 거쳐 `main`에 합칩니다. 매주 수요일
18:00 KST에 `main`에서 `release/YYYY-Www` branch를 만들고 안정화 변경만 받습니다.

## AI 작업 관찰

1. [`docs/harness/observation-protocol.md`](docs/harness/observation-protocol.md)를 읽습니다.
2. 작업 프롬프트에 범위·완료 조건·금지 사항을 명시합니다.
3. 탐색, 계획, 구현, 검증에서 관찰 가능한 사실을 확인합니다.
4. [`docs/harness/templates/run-log.md`](docs/harness/templates/run-log.md) 형식으로 실행 기록을 남깁니다.
5. 여러 실행에서 반복된 실패만 `AGENTS.md`, 테스트 또는 CI 규칙으로 승격합니다.

## 주요 문서

- `docs/PRODUCT.md`: 제품 원칙과 MVP 범위
- `docs/DESIGN.md`: 디자인 토큰과 UI 규칙
- `docs/ARCHITECTURE.md`: 폴더 책임과 의존성 방향
- `docs/DEVELOPMENT.md`: 로컬 개발과 검증 명령
- `docs/ROADMAP.md`: 마일스톤과 명시적 보류 범위
- `AGENTS.md`: AI Agent가 항상 지킬 저장소 규칙
