# Dayweave

Dayweave는 감정과 한 줄, 선택적 사진으로 오늘을 빠르게 남기고 필요할 때 긴 글로
확장하는 개인 모바일 다이어리입니다. 장기적으로 Theme Pack, Mood Pack, 파츠형
Avatar, 클라우드 동기화와 일정·SNS 연결을 단계적으로 추가합니다.

이 저장소는 제품 개발과 함께 AI 코딩 Agent의 작업을 관찰하고 반복되는 실패를
문서·검증·자동화로 줄이는 Harness Engineering 실험을 기록합니다.

## 현재 단계: M2 Photo

현재 기준 버전은 `v0.1.0` Foundation pre-release입니다. 버전별 변경은
[`CHANGELOG.md`](CHANGELOG.md), 버전 선택과 릴리스 규칙은
[`docs/VERSIONING.md`](docs/VERSIONING.md), 이번 릴리스의 상세 내용은
[`docs/releases/v0.1.0.md`](docs/releases/v0.1.0.md)를 참고합니다.

- React Native + Expo SDK 57 + Expo Router
- semantic Mood와 Default Mood Pack, 재사용 가능한 MoodSelector
- 오늘의 감정·한 줄·선택적 긴 글 작성
- local date 기반 하루 한 기록 create/update
- SQLite `user_version` migration과 local-first persistence
- Gallery 사진 한 장 선택, resize/compress와 앱 전용 documents 저장
- Diary와 사진 metadata의 transaction 및 교체·제거 file lifecycle
- Web preview용 localStorage repository와 platform-specific storage provider
- domain·날짜·validation·row mapping 자동 테스트
- 카메라·다중 사진, 타임라인 CRUD와 클라우드 동기화는 아직 구현하지 않음

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
pnpm version:check
pnpm deps:check
pnpm lint
pnpm test
pnpm typecheck
pnpm build:web
```

## 개발 및 릴리스

- 작업 방법: [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md)
- 활성 프로세스: [`docs/process/development-and-release.md`](docs/process/development-and-release.md)
- 단계적 도입 항목: [`docs/process/deferred-capabilities.md`](docs/process/deferred-capabilities.md)

모든 변경은 short-lived branch와 PR을 거쳐 `main`에 합칩니다. 매주 수요일
18:00 KST에 `main`에서 `release/YYYY-MM-DD-Www` branch를 만들고 안정화 변경만 받습니다.

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
- `docs/VERSIONING.md`: SemVer, changelog, tag와 GitHub Release 규칙
- [`docs/learning/`](docs/learning/README.md): 작업과 의사결정을 설명하는 학습 가이드
- `AGENTS.md`: AI Agent가 항상 지킬 저장소 규칙
