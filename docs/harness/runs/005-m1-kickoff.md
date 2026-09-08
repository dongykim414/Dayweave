# Harness Run 005 — M1 Diary Core Kickoff

## 기본 정보

- 날짜: 2026-09-08
- Harness 버전: M1 kickoff rules
- 기준 커밋: `f6c5c74` (`v0.1.0`)
- 작업 요청: M1 이후 목표를 등록하고 다음 작업용 branch와 PR을 만든다.

## 성공 조건

- [x] GitHub에 M1부터 M6까지 Roadmap Milestone을 등록한다.
- [x] M1을 독립적으로 검증할 수 있는 PR slice로 분할한다.
- [x] `main`에서 첫 M1 branch를 만든다.
- [x] 변경을 검증하고 M1 Draft PR을 생성해 Milestone에 연결한다.

## 관찰 기록

### 요청 해석

- M1 이후 목표는 GitHub Milestone으로 추적한다.
- 하나의 PR에 M1과 M2 전체를 함께 구현하지 않는다.
- 첫 PR은 M1의 Diary domain과 날짜 정책 범위로 제한한다.
- 새 기능 개발 중간 release는 patch 대신 `0.2.0-alpha.N`을 사용한다.

### 탐색

| 순서 | 확인 대상 | 확인 이유 | 발견한 사실 |
| --- | --- | --- | --- |
| 1 | GitHub Milestone | 기존 목표와 중복 확인 | 종료된 M0 하나만 존재 |
| 2 | `docs/ROADMAP.md` | 등록할 목표 범위 확인 | M1부터 M6 이후까지 정의됨 |
| 3 | `docs/VERSIONING.md` | 다음 version 규칙 확인 | M1 완료 예시는 `0.2.0` |
| 4 | Diary와 Mood source | 첫 slice의 현재 기반 확인 | Diary screen만 있고 Mood ID 타입은 존재 |

### 계획

1. Roadmap과 같은 M1~M6 Milestone을 GitHub에 만든다.
2. M1 완료 조건과 세 PR slice를 문서화한다.
3. pre-release 번호 규칙과 학습 설명을 추가한다.
4. 문서 링크와 version 검사를 실행한다.
5. branch를 push하고 첫 M1 Draft PR을 Milestone에 연결한다.

### 구현

| 파일 | 변경 목적 |
| --- | --- |
| `docs/milestones/m1-diary-core.md` | M1 완료 조건과 PR 분할 정의 |
| `docs/learning/m1-diary-core/README.md` | 구조·날짜·버전 선택 이유 설명 |
| `docs/VERSIONING.md` | `alpha`, `beta`, `rc` pre-release 규칙 추가 |
| `AGENTS.md`, `docs/ROADMAP.md` | 현재 작업 범위를 첫 M1 slice로 전환 |

### 검증

| 명령 또는 확인 | 결과 | 근거 또는 오류 |
| --- | --- | --- |
| `pnpm version:check` | 성공 | 두 앱 설정이 기존 `0.1.0`으로 일치 |
| Markdown 상대 링크 검사 | 성공 | Markdown 26개에서 존재하지 않는 로컬 대상 없음 |
| `git diff --check` | 성공 | whitespace 오류 없음 |
| GitHub Milestone 조회 | 성공 | M1~M6가 각각 생성됨 |

### 실패 대응

- 실패: 첫 Milestone 조회가 network sandbox에서 차단됐다.
- 직접적인 단서: GitHub API proxy connection refused.
- 대응: Dayweave GitHub 작업에 한정된 network 권한을 요청했다.
- 재검증: 권한 승인 후 M1~M6 Milestone 생성 성공.

## 완료 판단

- 완료 근거: branch `codex/feat/m1-diary-domain`과 Draft PR #3이 생성됐고 GitHub의
  `M1 Diary Core` Milestone에 연결된 것을 확인했다.
- 실행하지 않은 검증: 제품 코드가 바뀌지 않아 lint, typecheck와 Web export는 생략한다.
- 남은 위험: 첫 구현 전에 날짜 정책과 하루 기록의 cardinality를 확정해야 한다.

## 하네스 후보

- 반복 여부를 더 관찰할 문제: milestone 크기와 PR 크기가 혼동되는지 확인
- AGENTS.md 후보 규칙: 현재의 one logical change 규칙으로 우선 관찰
- 테스트 또는 자동화 후보: M1 첫 slice에서 domain test runner 도입

## 다음 비교 작업

- Diary domain과 local date key 구현에서 문서화한 slice 경계가 유지되는지 확인한다.
