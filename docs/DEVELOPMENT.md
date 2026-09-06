# Dayweave Development

## 환경

- Node.js 22
- pnpm 11 (`package.json`의 `packageManager`가 기준)
- Expo SDK 57
- TypeScript strict mode

`pnpm-workspace.yaml`은 자동 peer 설치를 끕니다. Expo Router의 사용하지 않는 Drawer
경로가 요구하는 Reanimated와 Gesture Handler는 M0에 설치하지 않으며, 실제 Drawer나
animation을 도입하는 작업에서 Expo 호환 버전으로 명시적으로 추가합니다.

## 설치와 실행

```bash
pnpm install
pnpm dev
```

플랫폼별 실행은 `pnpm android`, `pnpm ios`, `pnpm web`을 사용합니다. Windows에서
iOS 시뮬레이터 실행은 지원하지 않으므로 실제 iPhone의 Expo Go 또는 macOS CI/장비로
검증합니다.

## 변경 전 확인

1. `AGENTS.md`와 관련 `docs/`를 읽습니다.
2. 한 PR의 범위와 제외 범위를 적습니다.
3. 기존에 같은 책임을 가진 파일을 먼저 찾습니다.
4. route에는 navigation과 screen 조립만 둡니다.

## 검증

```bash
pnpm deps:check
pnpm lint
pnpm typecheck
pnpm build:web
```

테스트 도구는 도메인 로직이 생기는 M1에 추가합니다. 그 전에는 의미 없는 통과용
test script를 만들지 않습니다. UI 변경 PR은 가능한 플랫폼의 스크린샷 또는 실행
증거를 첨부합니다.

## PR과 Release

일반 PR은 `main`을 대상으로 하고 squash merge합니다. 선행 PR이 아직 merge되지
않은 의존 작업은 일시적으로 선행 branch를 base로 하는 stacked PR을 허용하며,
선행 PR merge 직후 `main`으로 rebase 또는 retarget합니다.

기능·아키텍처·도구 선택이 있는 PR은 `docs/learning`의 관련 문서를 추가하거나
갱신합니다. 무엇을 했는지뿐 아니라 선택 이유, 대안, 비용과 직접 확인 방법을 남깁니다.

상세한 branch 규칙, CI gate와 주간 release cut은
[`process/development-and-release.md`](process/development-and-release.md)에 있습니다.
