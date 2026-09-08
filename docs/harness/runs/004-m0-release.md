# Harness Run 004 — M0 Version and Release

## 기본 정보

- 날짜: 2026-09-08
- Harness 버전: M0 Foundation rules
- 기준 커밋: `3d2086e` (PR #1 squash merge)
- 작업 요청: PR #1과 #2를 병합하고 milestone, version, patch와 release 기록을 만든다.

## 성공 조건

- [x] PR #1을 CI가 성공한 상태로 `main`에 squash merge한다.
- [x] PR #2를 최신 `main` 위로 rebase하고 기존 사용자 변경을 보존한다.
- [x] GitHub M0 Foundation milestone에 두 PR을 연결한다.
- [x] `v0.1.0` 변경 기록과 버전 정책을 저장소에 추가한다.
- [x] PR #2의 새 `main` 기준 CI 성공을 확인한다.

PR #2 merge, tag, GitHub pre-release와 milestone 종료는 이 문서가 포함된 commit 이후에
실행하므로 완료 여부는 GitHub PR, Milestone과 Release metadata를 최종 증거로 삼는다.

## 관찰 기록

### 요청 해석

- M0에 속한 두 PR의 코드 병합뿐 아니라 작업 묶음, 버전 숫자, 변경 내용과 고정된
  source commit을 서로 구분해 추적할 수 있어야 한다.
- 기존 version이 두 설정 파일 모두 `0.1.0`이므로 M0를 첫 기준선 `v0.1.0`으로
  기록하며, 근거 없는 `0.1.1` bump는 하지 않는다.

### 탐색

| 순서 | 확인 대상 | 확인 이유 | 발견한 사실 |
| --- | --- | --- | --- |
| 1 | PR #1, #2와 CI | merge 가능성과 의존 순서 확인 | 두 PR 모두 CI 성공, PR #2는 PR #1을 base로 사용 |
| 2 | `package.json`, `app.json` | 현재 앱 version 확인 | 두 파일 모두 `0.1.0` |
| 3 | tag, release, milestone | 기존 기록과 충돌 확인 | 기존 항목 없음 |
| 4 | PR #2 commit과 diff | 사용자 변경 보존 확인 | 학습 문서 통합과 release branch 형식 변경 포함 |

### 계획

1. M0 milestone을 만들고 두 PR을 연결한다.
2. PR #1을 병합한 뒤 PR #2를 최신 `main` 위로 rebase한다.
3. changelog, version 정책, release note와 학습 설명을 추가한다.
4. 전체 quality gate와 GitHub CI를 통과시킨다.
5. PR #2를 병합하고 `v0.1.0` tag, pre-release, milestone 종료를 확인한다.

### 구현

| 파일 | 변경 목적 |
| --- | --- |
| `CHANGELOG.md` | 버전별 실제 변경을 빠르게 확인 |
| `docs/VERSIONING.md` | milestone, version, changelog, release의 역할과 SemVer 기준 정의 |
| `docs/releases/v0.1.0.md` | M0 범위, 검증, 제외 항목을 상세히 고정 |
| `docs/learning/setup/m0.md` | 선택 이유와 대안을 학습 가능한 형태로 설명 |
| `README.md`, `docs/DEVELOPMENT.md`, `docs/ROADMAP.md` | 현재 버전과 관련 문서 연결 |
| `AGENTS.md`, PR template | 다음 작업에서도 버전 규칙을 반복 적용 |
| `scripts/check-version.mjs`, CI | 두 앱 설정의 version 불일치를 자동 차단 |

### 검증

| 명령 또는 확인 | 결과 | 근거 또는 오류 |
| --- | --- | --- |
| `pnpm install --frozen-lockfile` | 성공 | lockfile 변경 없이 pnpm 11.19.0으로 설치 확인 |
| `pnpm version:check` | 성공 | 두 설정이 유효한 SemVer `0.1.0`으로 일치 |
| `EXPO_OFFLINE=1 pnpm deps:check` | 성공·주의 | 의존성 최신 상태, sandbox cache 권한 때문에 offline 사용 |
| `pnpm lint` | 성공·주의 | 오류 없음, legacy ESLint config 안내만 출력 |
| `pnpm typecheck` | 성공 | `tsc --noEmit` 종료 코드 0 |
| `pnpm build:web` | 성공 | 네 개 탭을 포함한 static route 11개 export |
| Markdown 상대 링크 검사 | 성공 | Markdown 23개에서 존재하지 않는 로컬 대상 없음 |
| GitHub Actions `Validate Expo app` | 성공 | PR #2 run `34208232233`, 1분 2초 |

### 실패 대응

- 실패: `docs/learning/README.md`의 M0 링크가 존재하지 않는 이전 경로를 가리켰다.
- 직접적인 단서: `Get-Content`에서 대상 파일을 찾을 수 없었고 `rg --files docs`에는
  통합된 `docs/learning/setup/m0.md`만 존재했다.
- 대응: 학습 문서와 PR template의 예시 링크를 실제 통합 경로로 변경했다.
- 재검증: 저장소의 Markdown 링크 검사에서 다시 확인한다.

- 실패: 일반 `pnpm deps:check`가 사용자 홈의 Expo native module cache를 열지 못했다.
- 직접적인 단서: `C:\Users\DongYoung\.expo\native-modules-cache` 파일에서 `EPERM` 발생.
- 대응: 코드나 dependency를 바꾸지 않고 Expo offline mode로 호환 검사를 재실행했다.
- 재검증: `EXPO_OFFLINE=1 pnpm deps:check`에서 dependencies가 최신이라고 확인했다.

- 실패: 첫 force-with-lease 시도에서 원격 commit의 전체 SHA 추정값이 실제 값과 달랐다.
- 직접적인 단서: push 전에 수행한 exact SHA 비교가 불일치를 감지해 명령을 중단했다.
- 대응: Git remote와 GitHub PR API가 반환한 전체 SHA가 같은지 확인한 후 그 값을 lease로
  사용했다.
- 재검증: 원격 branch가 새 commit `4b70a25`로 갱신되고 PR #2 base가 `main`임을 확인했다.

## 완료 판단

- 완료 근거: 저장소 측 release 기록과 로컬·원격 quality gate가 완료됐다. merge 이후
  metadata는 GitHub의 PR, Milestone, tag와 Release에서 확인한다.
- 실행하지 않은 검증: Android와 iOS 실제 기기 검증은 코드 변경이 없는 release 기록
  작업이며 M0에서 필요한 장비가 없어 제외한다.
- 남은 위험: 앱 스토어 배포를 시작할 때 platform build number 정책을 추가해야 한다.

## 하네스 후보

- 반복 여부를 더 관찰할 문제: 앱 설정 두 곳의 version 불일치
- AGENTS.md 후보 규칙: version 동기화와 tag 생성 기준
- 테스트 또는 자동화 후보: version 일치 검사를 CI에 적용함. 향후 native build number
  도입 시 같은 검사 확장을 검토한다.

## 다음 비교 작업

- M1 release에서 patch와 minor 판단이 이 정책대로 재현되는지 비교한다.
