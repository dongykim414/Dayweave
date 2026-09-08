# Dayweave

Dayweave는 일·주·월 단위로 Todo와 일정을 관리하는 다이어리에서 시작해,
외부 캘린더·SNS·기기·AI와 연결되는 개인 일정 허브로 발전시키는 프로젝트입니다.

이 저장소는 제품 개발뿐 아니라 AI 코딩 Agent의 작업을 관찰하고, 반복되는 실패를
문서·테스트·자동화로 개선하는 Harness Engineering 실험을 함께 기록합니다.

## 현재 단계

- React Native + Expo SDK 57 기본 프로젝트 구성
- Expo Router 기반 파일 라우팅 구성
- Android, iOS, Web 개발 환경 구성
- Harness v0 및 관찰 프로토콜 구성
- 다이어리 MVP 구현 전

MVP 범위와 제외 범위는 [`docs/product/mvp.md`](docs/product/mvp.md)를 참고합니다.

## 시작하기

```bash
npm install
npm run dev
```

개발 서버에 표시되는 QR 코드를 Expo Go로 스캔하거나 다음 명령으로 플랫폼을
선택합니다.

```bash
npm run android
npm run ios
npm run web
```

Windows에서는 Android 기기·에뮬레이터와 Web을 실행할 수 있습니다. iOS 네이티브
시뮬레이터·로컬 빌드는 macOS가 필요하지만, 실제 iPhone의 Expo Go를 이용한 개발은
가능합니다.

## 검증 명령

```bash
npm run deps:check
npm run lint
npm run typecheck
npm run build:web
```

## 개발 및 릴리스 프로세스

- 활성 프로세스: [`docs/process/development-and-release.md`](docs/process/development-and-release.md)
- 단계적 도입 항목: [`docs/process/deferred-capabilities.md`](docs/process/deferred-capabilities.md)

모든 변경은 short-lived branch와 PR을 거쳐 `main`에 합칩니다. 매주 수요일
18:00 KST에 `main`에서 `release/YYYY-Www` branch를 자동 생성하고, 해당 branch에는
안정화 수정만 허용합니다.

## AI 작업 관찰 방법

1. [`docs/harness/observation-protocol.md`](docs/harness/observation-protocol.md)를 읽습니다.
2. 실제 작업 프롬프트에서 해당 프로토콜을 따르도록 요청합니다.
3. 작업 중에는 탐색, 계획, 구현, 검증의 관찰 가능한 사실을 실시간으로 확인합니다.
4. 작업 후 [`docs/harness/templates/run-log.md`](docs/harness/templates/run-log.md)를 복사해 실행 기록을 남깁니다.
5. 여러 실행에서 반복된 실패만 `AGENTS.md`, 테스트 또는 CI 규칙으로 승격합니다.

첫 프로젝트 설정 기록은
[`docs/harness/runs/000-project-setup.md`](docs/harness/runs/000-project-setup.md)에 있습니다.

## 문서 구조

```text
AGENTS.md                         AI가 항상 지킬 프로젝트 규칙
docs/product/mvp.md               첫 제품 범위와 성공 조건
docs/harness/README.md            하네스 실험 운영 방법
docs/harness/observation-protocol.md
                                  작업 관찰 기준과 요청 프롬프트
docs/harness/templates/run-log.md 실행 기록 템플릿
docs/harness/runs/                실제 실행 기록
```

## 기술 스택

- React Native
- Expo SDK 57
- Expo Router
- TypeScript strict mode
- React Native StyleSheet
- ESLint
- npm
