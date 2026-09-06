# Run 002: PR 및 주간 Release Process 설정

## 기본 정보

- 날짜: 2026-09-06
- Harness 버전: v0
- 기준 branch: `codex/migrate-to-expo`
- 작업 요청: Dayweave에 PR 중심 개발 프로세스와 필수 주간 Release Branch 적용

## 성공 조건

- [x] PR 설명과 검증 증거 형식을 표준화한다.
- [x] 현재 실행 가능한 필수 CI를 구성한다.
- [x] 매주 `main`에서 Release Branch를 생성하는 자동화를 구성한다.
- [x] 아직 적용하지 않는 프로세스를 도입 조건과 함께 보존한다.
- [x] 로컬 검사와 workflow 정적 검증을 통과한다.

## 관찰 기록

### 요청 해석

- 충돌을 조기에 발견하는 PR Gate와 매주 배포 후보를 고정하는 Release Cut을 함께 적용한다.
- 팀 규모의 최종 프로세스를 한꺼번에 실행하지 않고 현재 검증 가능한 계층만 강제한다.

### 탐색

| 순서 | 확인 대상 | 확인 이유 | 발견한 사실 |
| --- | --- | --- | --- |
| 1 | `AGENTS.md`, `package.json` | 기존 명령과 완료 조건 확인 | lint, typecheck, Web export가 이미 존재 |
| 2 | Git 상태와 원격 branch | 안전한 PR 준비 | Expo migration branch가 원격을 추적 중 |
| 3 | 사용자 프로세스 문서 | 필수·보류 항목 분리 | Weekly Release Cut은 필수, 고비용 Gate는 단계적 도입 가능 |

### 계획

1. PR 템플릿과 현재 실행 가능한 CI를 추가한다.
2. 주간 Release Branch 자동 생성 workflow를 추가한다.
3. 활성 프로세스와 보류 기능을 별도 문서로 나눈다.
4. 로컬 명령과 workflow 구조를 검증한다.
5. 사용자 참고 문서를 제외하고 변경 파일만 commit·push한 뒤 PR을 만든다.

### 구현

| 파일 | 변경 목적 |
| --- | --- |
| `.github/pull_request_template.md` | PR 설명·검증·위험·Release 영향 표준화 |
| `.github/workflows/pr-check.yml` | PR과 `main`의 필수 Expo 검증 자동화 |
| `.github/workflows/release-cut.yml` | 주간 Release Branch 생성과 중복 방지 |
| `docs/process/development-and-release.md` | 현재 적용하는 개발·Release 규칙 |
| `docs/process/deferred-capabilities.md` | 아직 적용하지 않는 Gate와 도입 조건 보존 |
| `AGENTS.md`, `README.md`, `package.json` | Agent 규칙, 안내, 의존성 검사 명령 연결 |

### 검증

| 명령 또는 확인 | 결과 | 근거 또는 오류 |
| --- | --- | --- |
| `EXPO_OFFLINE=1 npm run deps:check` | 성공·주의 | 모든 의존성이 최신으로 확인됐으나 Expo가 오프라인 검사의 신뢰도 경고 표시 |
| `npm run lint` | 성공 | 종료 코드 0 |
| `npm run typecheck` | 성공 | `tsc --noEmit` 종료 코드 0 |
| `npm run build:web` | 성공 | Metro 775개 모듈 번들링, 정적 라우트 3개 생성 |
| Workflow YAML 검사 | 성공 | `yaml` parser가 두 파일의 `on`, `jobs`와 job 이름을 정상 파싱 |
| `git diff --check` | 성공 | 공백 오류 없음 |

### 실패 대응

- 실패: 일반 모드의 `npm run deps:check`가 Expo 사용자 홈 캐시 쓰기에서 `EPERM` 발생
- 직접적인 단서: `C:\Users\DongYoung\.expo\native-modules-cache` 파일 open 거부
- 대응: 로컬에서는 `EXPO_OFFLINE=1`로 검사하고 PR CI에서는 네트워크 모드로 재검증
- 재검증: 오프라인 검사는 성공; 최종 신뢰성은 GitHub Actions 결과로 확인

## 완료 판단

- 완료 근거: 필수 로컬 명령, Web bundle과 두 Workflow의 YAML 구조 검증 성공
- 실행하지 않은 검증: GitHub Actions 실제 실행은 PR 생성 후 확인
- 남은 위험: Repository Rules는 첫 status check가 등록된 뒤 GitHub 설정에서 활성화 필요

## 하네스 후보

- 반복 여부를 더 관찰할 문제: CI 시간과 Weekly Cut branch 충돌 빈도
- AGENTS.md 후보 규칙: PR과 Release Branch 규칙을 이번 작업에서 반영
- 테스트 또는 자동화 후보: 보류 문서의 항목을 위험 발생 순서대로 도입

## 다음 비교 작업

- 첫 Calendar vertical slice PR에서 현재 Gate의 속도와 발견 결함을 기록
