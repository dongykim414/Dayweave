# Run 008: M3 Timeline

## 기본 정보

- 날짜: 2026-09-09
- Harness 버전: M3 Timeline rules
- 기준 커밋: `43b44b9`
- 작업 요청: 월간 달력, 기록 marker와 선택 날짜 preview 구현

## 성공 조건

- [x] local-calendar 5/6주 grid와 연도·윤년 경계
- [x] visible month 1회 범위 query와 Photo LEFT JOIN
- [x] Photo/Mood marker와 선택 날짜 preview
- [x] loading, empty, error, retry와 stale-response 보호
- [ ] 실제 Android CASE 1~15 검증

## 관찰 기록

### 요청 해석

- 상세·수정·삭제를 제외하고 월간 탐색과 날짜별 회고를 독립적으로 완성하는 작업으로
  해석했습니다.

### 탐색

| 순서 | 확인 대상 | 발견한 사실 |
| --- | --- | --- |
| 1 | Diary/Photo model | 하루 Diary 0..1개, Diary당 Photo 0..1개 |
| 2 | Repository | 단일 날짜 API만 있어 range contract 필요 |
| 3 | SQLite schema | `entry_date`와 photo foreign key에 UNIQUE index 존재 |
| 4 | Mood registry | semantic Mood를 pack visual로 해석 가능 |
| 5 | M2 photo | display image를 작은 render size로 재사용하도록 결정됨 |

### 구현

1. Calendar type과 pure local-date utility를 만들었습니다.
2. Native/Web repository에 반열린 날짜 범위 조회를 추가했습니다.
3. Timeline hook이 월 조회, 선택, focus reload와 stale response를 담당합니다.
4. Header, Calendar와 Preview가 기존 theme와 Mood resolver를 재사용합니다.

### 검증

| 명령 또는 확인 | 결과 | 근거 또는 오류 |
| --- | --- | --- |
| `pnpm lint` | PASS | ESLint 오류 없음 |
| `pnpm typecheck` | PASS | strict TypeScript 통과 |
| `pnpm test` | PASS | 9 suites, 31 tests |
| `pnpm build:web` | PASS | 11 static routes export |
| Android JS bundle | PASS (제한) | `--no-bytecode`로 1,308 modules bundle 성공 |
| Expo Web dev server | PASS (제한) | `/timeline` HTTP 200 및 Web/server bundle 완료 |
| Browser interaction | NOT TESTED | Browser skill kernel assets 경로 오류 |
| Android manual CASE 1~15 | NOT TESTED | 연결된 기기/emulator 없음 |

### 실패 대응

- 첫 lint에서 effect 내부 state reset, unused value와 hook dependency 문제가 발견됐습니다.
- failed photo URI를 state key로 기록하고 load 요청 identity를 명시해 재검증했습니다.
- Browser 자동 검증 도구는 kernel assets 경로 오류로 열리지 않아 HTTP bundle 확인까지만
  수행했고, 시각·상호작용 결과를 PASS로 기록하지 않았습니다.

## 완료 판단

- 코드와 자동 검증 기준 구현 완료
- 실제 Android의 사진·SQLite·작은 화면·빠른 입력 검증은 남음

## 하네스 후보

- 반복 여부 관찰: Windows Browser/Expo DevTools child-process 경로 오류
- 테스트 후보: 실제 SQLite migration/range join integration test
- 다음 비교 작업: M4의 active Mood Pack 변경이 Today/Timeline 모두에 반영되는지 확인
