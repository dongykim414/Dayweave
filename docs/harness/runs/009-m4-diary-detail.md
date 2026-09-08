# Run 009: M4 Diary Detail

## 기본 정보

- 날짜: 2026-09-09
- Harness 버전: M4 Diary Detail rules
- 기준 커밋: `9e82493`
- 작업 요청: 상세 조회, 수정, Photo lifecycle과 확인 후 삭제

## 성공 조건

- [x] Entry ID 상세 route와 not-found/error 상태
- [x] 기존 validation을 사용하는 Mood·text·photo 수정
- [x] 미저장 변경 확인과 prepared photo cancel cleanup
- [x] DB 성공 뒤 Photo file을 정리하는 삭제
- [x] Timeline focus reload 활용
- [ ] 실제 Android CASE 1~20과 DB/file inspection

## 관찰 기록

### 탐색에서 확인한 사실

| 대상 | 확인한 사실 |
| --- | --- |
| Diary/Photo | 하루 한 Entry, Entry당 Photo 0..1 |
| M2 lifecycle | DB commit 전 기존 file을 지우지 않음 |
| Timeline | focus 때 visible month를 다시 조회함 |
| Router | root Stack이 있어 `/diary/[id]` 추가 가능 |
| Theme | 기존 `danger` token으로 삭제 UI 표현 가능 |

### 구현

1. Repository에 ID 조회와 삭제 contract를 추가했습니다.
2. Today/Detail이 공유하는 form field와 record-photo lifecycle을 만들었습니다.
3. Detail hook이 load, edit, dirty confirm, save와 delete를 담당합니다.
4. Preview에서 ID route를 열고 상세 View/Edit UI를 연결했습니다.

### 중간 검증

| 확인 | 결과 |
| --- | --- |
| `pnpm lint` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm test` | PASS — 11 suites, 40 tests |
| `pnpm build:web` | PASS — 12 static routes |
| Android JS bundle | PASS (제한) — `--no-bytecode`, 1,315 modules |
| Expo Web dev server | PASS (제한) — Timeline/Detail HTTP 200 |
| Browser interaction | NOT TESTED — kernel assets 경로 오류 |
| Android manual | NOT TESTED — 연결된 기기/emulator 없음 |

### 실패 대응

- Nullable Photo를 비동기 cleanup callback에서 다시 좁혀 typecheck를 통과시켰습니다.
- retry revision이 hook callback에서 직접 읽히지 않는 lint 경고는 load-request identity로
  명시했습니다.
- Browser 도구 오류 뒤 별도 자동화로 우회하지 않고 Web route bundle만 확인했습니다.

## 완료 판단

- 코드·자동 검증 기준 lifecycle 구현 완료
- Native SQLite cascade, 실제 file cleanup, Alert/back와 keyboard는 수동 검증 필요

## 하네스 후보

- 테스트 후보: Native SQLite ID delete/cascade integration
- 후속 품질 후보: 실패한 file cleanup의 orphan sweep
- 다음 비교 작업: M5 personalization 뒤 Detail/Timeline Mood visual 동시 갱신
