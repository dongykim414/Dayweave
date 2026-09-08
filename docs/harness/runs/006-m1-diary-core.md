# Harness Run 006 — M1 Diary Core

## 기본 정보

- 날짜: 2026-09-08
- Harness 버전: M1 Diary Core rules
- 기준 commit: `3305bdf`
- 작업 요청: 기존 미커밋 구현을 취소하고 Mood + Diary + SQLite + Today 전체 M1을 구현한다.

## 성공 조건

- [x] 기존 미커밋 파일만 취소하고 branch의 kickoff 기록은 보존한다.
- [x] semantic Mood와 Default Mood Pack, registry와 selector를 구현한다.
- [x] Diary domain, local date, validation과 create/update 규칙을 구현한다.
- [x] SQLiteProvider, version 1 migration과 repository를 구현한다.
- [x] Today load/form/save/feedback 흐름을 구현한다.
- [x] 순수 규칙 테스트와 전체 정적 검증을 통과한다.
- [ ] 실제 Android/iOS에서 persistence acceptance를 확인한다.

## 관찰 기록

### 요청 해석

- 후속 명시 요청이 이전 kickoff의 작은 slice보다 우선하므로 PR #3을 M1 전체
  local-first vertical slice로 변경한다.
- “완료”는 자동 검증과 native persistence 검증을 분리해 보고한다.

### 탐색

| 순서 | 확인 대상 | 확인 이유 | 발견한 사실 |
| --- | --- | --- | --- |
| 1 | 제품·디자인·아키텍처 문서 | M0 경계 유지 | route는 조립, UI는 feature, SQL은 infrastructure 책임 |
| 2 | Expo SDK 57 SQLite 공식 문서 | deprecated API 방지 | SQLiteProvider, onInit, async API와 user_version 예시 제공 |
| 3 | Expo Crypto 공식 문서 | 안전한 ID 선택 | SDK 57 호환 UUID v4 API 제공 |
| 4 | 기존 test 설정 | 재사용 가능성 확인 | test runner 없음, M1에서 도입 필요 |
| 5 | Android 환경 | native acceptance 가능성 | SDK 환경 변수와 adb 없음 |

### 계획

1. 순수 domain·날짜·Mood registry와 test를 먼저 만든다.
2. migration, repository와 mapper를 구현한다.
3. Provider 초기화 뒤 hook과 Today UI를 연결한다.
4. 문서를 실제 구조로 갱신하고 전체 quality gate를 실행한다.
5. 가능한 runtime 검증과 PR CI를 확인한다.

### 구현

| 영역 | 변경 목적 |
| --- | --- |
| `src/features/mood` | semantic ID와 시각 표현 분리, Default Pack과 selector |
| `src/features/diary/model` | 날짜, validation, create/update domain 규칙 |
| `src/features/diary/data` | SQLite row mapping과 repository 구현 |
| `src/database` | Provider lifecycle과 `user_version` migration |
| Diary components/hook/screen | 빠른 기록, 긴 글, load/save/error/feedback |
| Jest/CI | testable domain behavior를 자동 보호 |
| docs와 learning report | 구현 이유, 대안, 검증 한계 설명 |

### 검증

| 명령 또는 확인 | 결과 | 근거 또는 오류 |
| --- | --- | --- |
| `pnpm test` | 성공 | 5 suite, 13 test |
| `pnpm lint` | 성공 | 오류 없음 |
| `pnpm typecheck` | 성공 | `tsc --noEmit` 종료 코드 0 |
| `pnpm build:web` | 성공 | SQLite worker 포함 static route 11개 |
| `pnpm peers check` | 성공 | peer dependency issue 없음 |
| `pnpm dev --offline` | 성공 | Metro가 `http://localhost:8081`에서 대기, sandbox의 DevTools 실행만 `EPERM` 경고 |
| Android/iOS persistence | 미실행 | Android SDK/adb/기기와 macOS 없음 |
| Web `/today` HTTP runtime | 실패·범위 제외 | SQLite `worker.ts` chunk를 찾지 못함 |
| Web 시각·클릭 검증 | 미실행 | Browser control runtime asset 경로 오류 |

### 실패 대응

- 실패: Expo install이 사용자 홈 cache 접근 `EPERM`으로 중단됨.
- 직접적인 단서: `.expo/native-modules-cache` open 권한 오류.
- 대응: SDK 내장 호환표를 쓰는 offline mode로 version을 확인하고 pnpm으로 설치.
- 재검증: `expo-sqlite`, `expo-crypto`가 SDK 57 권장 `~57.0.2`로 설치됨.

- 실패: 취소한 `.npmrc`가 만든 double `v11` store와 정상 store가 충돌함.
- 직접적인 단서: `ERR_PNPM_UNEXPECTED_STORE`에 두 절대경로가 표시됨.
- 대응: 생성물 `node_modules`만 휴지통으로 보내고 frozen lockfile로 재설치.
- 재검증: 기본 store에서 install과 전체 quality gate 성공.

- 실패: 첫 typecheck에서 Jest 전역 타입을 찾지 못함.
- 직접적인 단서: `describe`, `it`, `expect`, `jest` 이름 오류.
- 대응: Expo 공식 구성대로 `tsconfig.json`에 Jest type을 명시.
- 재검증: typecheck 성공.

- 실패: Web 개발 서버의 `/today` static request가 SQLite worker chunk를 찾지 못함.
- 직접적인 단서: `Worker chunk not found for ... expo-sqlite/web/worker.ts`.
- 대응: 공식 Web WASM Metro 설정은 유지하되 mobile M1 acceptance와 분리해 기록.
- 재검증: Web static export는 SQLite worker bundle을 생성해 성공. Web runtime은 미지원.

## 완료 판단

- 완료 근거: domain test, lint, typecheck, Web export와 peer 검사는 성공했다.
- 실행하지 않은 검증: 실제 기기에서 DB 파일 persistence와 row count 확인.
- 남은 위험: native acceptance Case 1, 2, 4, 6과 Web runtime 호환성 작업이 남았다.
  M2 최종 착수 전 native acceptance를 우선 확인한다.

## 하네스 후보

- 반복 여부를 더 관찰할 문제: machine-local pnpm store 설정을 repo `.npmrc`에 추가하는 실수
- AGENTS.md 후보 규칙: `.npmrc` 변경은 팀 공통 근거와 CI 검증이 있을 때만 허용
- 테스트 또는 자동화 후보: migration integration을 실행할 native CI 또는 emulator harness

## 다음 비교 작업

- 실제 Android 기기에서 CASE 1~6을 수행하고 자동 테스트와의 차이를 기록한다.
