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
pnpm version:check
pnpm deps:check
pnpm lint
pnpm test
pnpm typecheck
pnpm build:web
```

M1부터 Jest와 `jest-expo`로 순수 domain, 날짜, Mood registry와 DB row mapping을
테스트합니다. Native SQLite integration은 실제 Android/iOS 기기나 emulator에서
검증하며 대량의 native mock으로 통과를 흉내 내지 않습니다. UI 변경 PR은 가능한
플랫폼의 스크린샷 또는 실행 증거를 첨부합니다.

## SQLite 개발

- DB 이름: `dayweave.db`
- 현재 schema version: `PRAGMA user_version = 1`
- Expo CLI에서 `Shift + M` 후 expo-sqlite inspector를 선택하면 연결된 앱 DB를
  확인할 수 있습니다.
- Web export를 위해 `metro.config.js`가 SQLite WASM을 asset으로 처리합니다.
- Web hosting에서 SQLite를 실제 실행하려면 COOP/COEP 응답 header가 필요합니다.
  M1 persistence 합격 기준은 Android/iOS local database입니다.
- SDK 57의 현재 Web 개발 서버에서는 Expo Router static rendering이 SQLite worker
  chunk를 찾지 못하는 현상이 관찰됐습니다. Static export는 성공하지만 Web runtime은
  M1 지원 대상으로 판정하지 않으며 native 검증과 혼동하지 않습니다.

## PR과 Release

일반 PR은 `main`을 대상으로 하고 squash merge합니다. 선행 PR이 아직 merge되지
않은 의존 작업은 일시적으로 선행 branch를 base로 하는 stacked PR을 허용하며,
선행 PR merge 직후 `main`으로 rebase 또는 retarget합니다.

기능·아키텍처·도구 선택이 있는 PR은 `docs/learning`의 관련 문서를 추가하거나
갱신합니다. 무엇을 했는지뿐 아니라 선택 이유, 대안, 비용과 직접 확인 방법을 남깁니다.

상세한 branch 규칙, CI gate와 주간 release cut은
[`process/development-and-release.md`](process/development-and-release.md)에 있습니다.
Version을 언제 올리고 changelog, tag와 GitHub Release를 어떻게 연결하는지는
[`VERSIONING.md`](VERSIONING.md)를 따릅니다.
