# Dayweave Agent Instructions

이 파일은 Dayweave의 Harness v0입니다. 관찰 결과 반복되는 문제가 확인될 때만
규칙을 하나씩 추가하고, 변경 이유를 실행 기록에 남깁니다.

## Project context

- Dayweave는 Todo와 일정을 일·주·월 단위로 관리하는 다이어리에서 시작합니다.
- 외부 서비스, 기기, 선택 공유, AI 기능은 MVP 이후 단계적으로 추가합니다.
- 현재 제품 범위는 `docs/product/mvp.md`를 기준으로 합니다.

## Commands

- Install: `npm install`
- Development: `npm run dev`
- Android: `npm run android`
- iOS: `npm run ios`
- Web: `npm run web`
- Dependency check: `npm run deps:check`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Web export: `npm run build:web`

## Working rules

- 수정 전에 관련 파일과 기존 패턴을 확인합니다.
- 요청 범위에 필요한 파일만 수정합니다.
- 의존성을 추가하기 전에 필요성과 대안을 설명합니다.
- TypeScript의 `any` 사용을 피하고 명시적인 타입을 사용합니다.
- 화면과 컴포넌트는 React Native 기본 컴포넌트와 `StyleSheet`를 우선 사용합니다.
- 라우트는 `src/app`의 Expo Router 파일 기반 구조를 따릅니다.
- Expo SDK 패키지는 `npx expo install`로 호환 버전을 설치합니다.
- 사용자 요청 없이 외부 서비스 연결이나 외부 쓰기 작업을 수행하지 않습니다.

## Git and pull requests

- `main`에 직접 push하지 않고 short-lived branch에서 PR을 만듭니다.
- Codex가 만드는 branch는 `codex/feat/*`, `codex/fix/*`, `codex/chore/*` 형식을 우선 사용합니다.
- 하나의 PR은 독립적으로 검증 가능한 하나의 논리적 변경만 포함합니다.
- PR에는 변경 목적, 검증 결과, UI 변경 증거, 위험과 되돌리기 방법을 기록합니다.
- 필수 CI가 통과하고 리뷰 의견이 해결된 뒤 squash merge합니다.
- `release/*` branch에는 신규 기능을 추가하지 않고 blocker·regression·crash 수정과 release metadata만 반영합니다.

## Observation and reporting

- 관찰 작업은 `docs/harness/observation-protocol.md`를 따릅니다.
- 내부 사고과정을 노출하지 않고, 확인한 파일·발견한 사실·실행한 명령·결과·결정만 보고합니다.
- 구현 전에 탐색 결과와 변경 계획을 짧게 보고합니다.
- 완료 시 변경 파일, 검증 결과, 실행하지 못한 검증과 남은 위험을 보고합니다.

## Definition of done

- 관련 동작이 요청의 인수 조건을 만족합니다.
- `npm run deps:check`를 실행합니다.
- 최소한 `npm run lint`를 실행합니다.
- TypeScript 코드 변경 시 `npm run typecheck`를 실행합니다.
- 앱 동작 또는 설정 변경 시 `npm run build:web`을 실행합니다.
- 네이티브 기기 동작이 관련된 변경은 확인한 플랫폼과 확인하지 못한 플랫폼을 구분해 기록합니다.
- 실패한 검증을 숨기지 않고 원인과 현재 상태를 기록합니다.
