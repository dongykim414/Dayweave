# M1 Diary Core

## 목표

Dayweave가 하루 기록을 기기 안에 안전하게 저장하고 다시 조회할 수 있는 최소한의
domain과 persistence 기반을 만듭니다. M1은 Today 화면의 완성된 입력 UX가 아니라,
M2가 의존할 데이터 계약과 저장 경계를 검증하는 단계입니다.

## 완료 조건

- Diary entry가 의미 있는 TypeScript domain model로 표현된다.
- 사용자의 현지 날짜를 안정적인 date key로 변환하는 정책이 있다.
- 저장·조회 책임이 UI 및 SQLite SDK와 분리된 repository contract로 정의된다.
- SQLite migration과 repository 구현이 재실행 가능하고 검증된다.
- 하루 기록을 저장한 뒤 앱을 다시 읽어도 동일한 내용을 조회할 수 있다.
- domain과 persistence의 핵심 성공·실패 동작이 자동 테스트로 보호된다.

## 구현 계층

### Diary domain과 날짜 정책

- Diary entry model과 validation
- local date key 생성·검사
- repository interface
- test runner와 domain unit test

### SQLite persistence

- Expo 호환 SQLite dependency
- schema와 migration
- repository implementation
- migration 및 repository integration test

### Today 저장·조회 연결

- 앱 시작 시 persistence 준비
- 최소 입력을 repository에 저장하고 현재 날짜 기록 조회
- loading, empty, recoverable error 상태
- Web과 가능한 실제 기기 검증

제외: 사진, Timeline과 삭제

## 이번 PR의 범위 결정

최초 kickoff에서는 세 PR로 분리할 계획이었지만, 후속 작업 요청이 M1의 최종 사용자
흐름과 Mood·SQLite·Today를 하나의 완료 조건으로 명시했습니다. 따라서 PR #3은 이
세 계층을 하나의 local-first vertical slice로 통합합니다. 파일 책임과 자동 테스트는
분리해 큰 화면 component나 SQL이 노출되는 구조를 피합니다.

## 버전 계획

- M0 호환 버그 수정: `0.1.1`
- M1 중간 설치본이 필요할 때: `0.2.0-alpha.N`
- M1 범위 완료: `0.2.0` Foundation pre-release 후속 버전

Version은 PR merge 횟수로 올리지 않습니다. 각 merge 내용은 `CHANGELOG.md`의
`Unreleased`에 모으고, 실제 통합본을 고정할 때 version, tag와 GitHub Release를 함께
만듭니다.

## 명시적 제외

- 완성된 Today 작성 UX, 사진과 긴 글 확장
- 월간 달력과 수정·삭제 화면
- Theme/Mood/Avatar 개인화
- 로그인과 cloud sync
- 결제, 일정·SNS·기기 연결, 공유와 AI
