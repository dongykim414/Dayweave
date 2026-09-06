# Harness Run 003 — M0 Foundation

## 요청

React Native + Expo 기반 개인 다이어리의 M0 Foundation을 구현한다. 실제 기록 CRUD
대신 문서, 폴더 경계, ThemeProvider, Sky Theme, 공용 UI와 4탭 셸을 만들고 pnpm,
lint, typecheck와 Expo 실행을 검증한다.

## 범위와 기준

- 기준 branch: `codex/migrate-to-expo`
- 작업 branch: `codex/feat/m0-foundation`
- PR 전략: 선행 Expo 전환 PR #1을 base로 한 stacked PR
- 제품 기준: 저장소의 제품·기술 설계 DOCX와 작업 프롬프트
- 제외: SQLite, CRUD, 사진, 감정 자산, Avatar renderer, 로그인, 클라우드, 결제,
  AI, 일정·SNS·공유·알림

## 계획

1. 기존 코드와 문서를 읽어 제품 방향과 충돌을 확인한다.
2. route를 얇게 유지한 4탭 구조를 만든다.
3. semantic token, ThemeProvider, shared UI를 구현한다.
4. Mood와 Avatar의 데이터·표현 분리 경계를 타입으로 남긴다.
5. 제품·디자인·아키텍처·개발·로드맵과 AGENTS 규칙을 갱신한다.
6. pnpm과 CI를 일관되게 전환하고 실행 검증한다.

## 관찰된 의사결정

- 기존 README와 단일 화면은 일정/Todo 제품을 설명했지만 기준 설계는 개인
  다이어리로 전환되어 있어 canonical 문서를 `docs/PRODUCT.md`로 재정의했다.
- Expo Router는 파일이 삭제된 뒤에도 빈 `src/app` 디렉터리를 route root로
  선택했다. 첫 Web export가 route를 만들지 않은 사실로 발견했고 빈 디렉터리를
  제거한 뒤 root `app/`을 정상 인식시켰다.
- pnpm의 자동 peer 설치가 사용하지 않는 Expo Router Drawer 경로의 Reanimated를
  끌어와 peer 충돌을 만들었다. `autoInstallPeers: false`로 바꾸고 해당 미사용 peer를
  명시적으로 제외해 범위 밖 의존성을 추가하지 않았다.
- pnpm 11의 install script allowlist에는 ESLint resolver가 사용하는
  `unrs-resolver`만 허용했다.
- Sky primary와 white text의 대비를 계산해 WCAG AA 수준이 되도록 primary token을
  더 진한 blue로 조정했다.

## 변경 요약

- `app/`: root layout, redirect, 4탭 navigation과 route
- `src/features`: diary/profile screen, theme runtime, Mood ID, Avatar part type
- `src/shared/components`: Text, Button, Card, Screen, IconButton
- `docs/`: 제품, 디자인, 아키텍처, 개발, 로드맵과 활성 프로세스
- root config: pnpm lock/config, CI, PR template, AGENTS, README

## 검증 결과

| 검사 | 결과 | 관찰 증거 |
| --- | --- | --- |
| `pnpm install --frozen-lockfile` | 성공 | lockfile 변경 없이 종료 코드 0 |
| `pnpm peers check` | 성공 | peer dependency issue 없음 |
| `pnpm typecheck` | 성공 | `tsc --noEmit` 종료 코드 0 |
| `pnpm lint` | 성공 | `expo lint` 종료 코드 0 |
| `EXPO_OFFLINE=1 pnpm deps:check` | 성공·주의 | 호환 버전 확인, sandbox의 사용자 Expo cache 제한 때문에 offline 사용 |
| `pnpm build:web` | 성공 | `/today`, `/timeline`, `/avatar`, `/me` 포함 static route 11개 생성 |
| `pnpm dev -- --offline` | 성공·주의 | Metro가 `http://localhost:8081`에서 대기; DevTools 설치만 sandbox spawn 제한 |
| HEX 검색 | 성공 | `src/features/theme/themes/sky.ts` 외 UI HEX 없음 |
| 범위 밖 의존성 검색 | 성공 | SQLite, Zustand, Query, Supabase, RevenueCat, Reanimated 등 미설치 |
| Android 실행 | 미실행 | Android SDK, `adb`, emulator와 연결 기기 없음 |
| Web 클릭 확인 | 미실행 | 브라우저 제어 런타임 미제공; static export route 생성으로 대체 |

## 실패와 회복

### 빈 `src/app`이 route root로 선택됨

- 직접 단서: 첫 export 로그의 `Using src/app as the root directory for Expo Router`
- 원인: Git은 빈 폴더를 추적하지 않지만 로컬 파일 시스템에는 폴더가 남아 있었음
- 대응: 폴더가 비어 있고 저장소 내부 경로인지 확인한 후 제거하고 재export
- 결과: root `app/`의 네 탭 route가 정상 생성됨

### pnpm install script 실행 제한

- 직접 단서: `unrs-resolver` postinstall의 `spawn EPERM`
- 원인: 의존성 문제보다 현재 sandbox의 하위 프로세스 제한
- 대응: 필요한 패키지만 allowlist에 기록하고 frozen install, lint와 build로 사용 가능성 검증
- 결과: install, lint, typecheck와 build 성공. 일반 개발 환경과 CI에서 재확인 필요

## 남은 위험과 다음 단계

- PR #1이 먼저 merge되어야 이 PR을 `main`으로 retarget할 수 있다.
- Android 실제 화면과 탭 클릭은 SDK/기기가 있는 환경에서 확인해야 한다.
- M1에서 Diary domain과 SQLite를 추가할 때 테스트 러너와 migration 검증을 함께
  도입한다.
