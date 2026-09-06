# 06. Harness Engineering과 검증

## Harness Engineering을 이 프로젝트에서 어떻게 정의하는가?

Dayweave에서 Harness Engineering은 단순히 AI에게 긴 프롬프트를 주는 일이 아닙니다.
AI가 반복해서 안전하게 작업할 수 있도록 다음 환경을 만드는 일입니다.

- 제품과 범위를 설명하는 문서
- 코드가 들어갈 위치와 의존성 규칙
- 작업 전 읽는 `AGENTS.md`
- 작은 작업 단위와 PR
- 자동 검증 명령과 CI
- 작업 중 관찰한 실패와 회복 기록

좋은 harness는 AI를 무조건 믿게 하지 않습니다. AI의 행동을 제한하고, 결과를
재현 가능한 증거로 확인하게 합니다.

## 이번 M0에서 사용한 관찰 흐름

```text
요청과 기준 문서 읽기
  ↓
기존 저장소 사실 확인
  ↓
범위와 제외 항목 선언
  ↓
변경 계획과 파일 책임 결정
  ↓
작은 구현
  ↓
자동 검증
  ↓
실패의 직접 단서 확인
  ↓
수정 후 같은 검증 반복
  ↓
PR + CI
  ↓
Run Log 기록
```

이 순서에서 핵심은 구현 전에 저장소를 읽는 것과, 실패 후 추측보다 직접 단서를 먼저
찾는 것입니다.

## 관찰 가능한 사실과 추론 구분

### 관찰 가능한 사실

- `git status`에 어떤 파일이 변경됐는가?
- `pnpm typecheck`의 종료 코드는 무엇인가?
- Expo export 로그에 어떤 route가 생성됐는가?
- `rg` 검색에서 HEX가 어느 파일에 있는가?
- GitHub CI가 success인가?

### 추론

- 이 구조가 미래 유지보수에 유리할 것이다.
- 이 기능은 사용자가 좋아할 것이다.
- 특정 package가 나중에 필요할 것이다.
- Android에서도 Web과 똑같이 보일 것이다.

추론도 필요하지만 사실처럼 말하면 안 됩니다. 특히 Web export 성공을 Android 실제
화면 성공으로 확대 해석하지 않아야 합니다.

## 이번 작업에서 harness가 발견한 실제 문제

### 1. 제품 정의 충돌

탐색 중 README의 일정/Todo 설명과 새 다이어리 설계가 충돌하는 사실을 확인했습니다.
코드부터 작성했다면 AI가 예전 일정 화면을 확장했을 가능성이 있습니다.

회복:

- canonical PRODUCT 문서 지정
- legacy MVP 문서는 이동 안내로 변경
- AGENTS와 README를 같은 방향으로 갱신

### 2. 빈 `src/app` route root

첫 `pnpm build:web`은 종료 코드 0이었습니다. 그러나 로그에
`Using src/app as the root directory`가 표시됐고 기대한 네 탭 route가 없었습니다.

회복:

- `src/app`이 비어 있는지 확인
- 정확한 저장소 내부 경로인지 확인
- 빈 폴더 제거
- 같은 Web export 재실행
- 네 탭 route 생성 확인

여기서 중요한 교훈은 **명령 성공과 목표 달성은 다르다**는 점입니다.

### 3. pnpm 자동 peer 설치 충돌

pnpm 전환 직후 `pnpm peers check`가 Worklets와 Metro config version 충돌을
보고했습니다.

회복:

- dependency graph와 package의 peer metadata 확인
- 현재 사용하지 않는 Drawer/animation 경로임을 확인
- 자동 peer 설치 중지
- 미사용 peer 예외와 제거 조건 문서화
- 다시 frozen install과 peer check 실행

### 4. sandbox와 실제 프로젝트 문제 구분

Expo cache와 DevTools 설치에서 `EPERM`이 발생했습니다. 이는 앱 code error가 아니라
현재 실행 환경이 사용자 폴더와 하위 process를 제한해 생긴 문제였습니다.

회복:

- Expo dependency 검사는 offline mode로 실행
- Metro가 실제로 8081에서 대기하는지 확인
- Web export와 GitHub CI에서 제한 밖 환경의 결과 확인
- Android 미검증 사실은 숨기지 않고 기록

## 검증 명령이 각각 찾는 문제

| 명령 | 주로 찾는 문제 | 찾지 못하는 문제 |
| --- | --- | --- |
| `pnpm install --frozen-lockfile` | lockfile 불일치, 설치 실패 | 화면 동작 |
| `pnpm peers check` | peer dependency 충돌 | runtime UI 버그 |
| `pnpm deps:check` | Expo 권장 version 불일치 | business logic |
| `pnpm lint` | code style, 일부 잘못된 pattern | 타입 전체, 실제 화면 |
| `pnpm typecheck` | TypeScript 계약 위반 | bundler와 native runtime 문제 |
| `pnpm build:web` | import, Metro bundling, Web route | Android/iOS native 동작 |
| `pnpm dev` | Metro 시작과 개발 server | 모든 route의 사용자 흐름 |
| `rg` 색상 검색 | 하드코딩 HEX 위치 | 색 대비와 시각 품질 전체 |
| GitHub CI | 깨끗한 환경에서 재현 | 실제 기기 특성 |

한 명령이 모든 것을 보장하지 않기 때문에 여러 작은 검사를 조합합니다.

## 왜 테스트 runner를 아직 추가하지 않았는가?

M0에는 계산, 저장, validation 같은 business behavior가 거의 없습니다. 의미 없는
`test` script를 만들어 항상 성공하게 하면 test가 있다는 착각만 생깁니다.

M1에서 Diary date rule, repository mapper와 migration이 생기면 다음 테스트가 실제
가치를 갖습니다.

- MoodId validation
- 하루 기록 정책
- save → getByDate
- migration 전후 data 보존

도구는 “좋아 보이기 위해” 설치하는 것이 아니라 실제 위험을 검사할 때 추가합니다.

## Run Log의 역할

`docs/harness/runs/003-m0-foundation.md`에는 다음을 기록했습니다.

- 요청과 제외 범위
- branch와 PR 전략
- 계획과 변경 파일
- 실제 실패와 직접 단서
- 검증 명령과 결과
- 미검증 항목과 다음 단계

Run Log는 성공 자랑 문서가 아닙니다. 다음 AI나 개발자가 같은 실패를 반복하지 않도록
관찰 가능한 사실을 전달하는 문서입니다.

모든 일회성 문제를 `AGENTS.md` 규칙으로 만들 필요는 없습니다. 여러 번 반복되거나
프로젝트 전체에 적용할 가치가 있을 때만 상위 규칙으로 승격합니다. 그렇지 않으면 규칙이
너무 많아 중요한 지시가 묻힙니다.

## AI에게 작업을 요청할 때 쓸 수 있는 형태

```text
AGENTS.md와 관련 docs를 먼저 읽어줘.
이번 범위는 [한 기능]이고, [명시적 제외 항목]은 하지 마.
기존 구조를 확인한 뒤 변경 계획과 예상 파일을 먼저 설명해줘.
구현 중 관찰된 사실과 추론을 구분해줘.
완료 후 lint, typecheck, 관련 build/test를 실행하고 결과를 남겨줘.
실행하지 못한 검증은 성공한 것처럼 말하지 말고 이유와 남은 위험을 적어줘.
```

이 요청은 AI의 답변 형식을 꾸미는 것이 아니라 작업 순서와 증거 기준을 정합니다.

## 코드 리뷰에서 확인할 질문

- 요청에 없는 기능이나 dependency가 추가됐는가?
- 변경 이유가 코드와 문서에서 같은가?
- 검증 명령을 실제로 실행했는가?
- 실패를 숨기거나 warning을 무조건 무시하지 않았는가?
- 자동 검증이 확인하지 못하는 영역을 명시했는가?
- 새로운 규칙이 한 번의 특수 상황에 과도하게 맞춰져 있지 않은가?

## 자신의 말로 답해보기

1. 명령의 종료 코드 0과 작업 목표 달성은 왜 다른가요?
2. 이번 작업에서 사실과 추론을 구분해야 했던 사례는 무엇인가요?
3. 모든 실패를 AGENTS 규칙으로 만들면 왜 오히려 좋지 않을 수 있나요?
