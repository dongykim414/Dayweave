# Run 010: M5 Avatar Engine

## 기본 정보

- 날짜: 2026-09-09
- Harness 버전: M5 Avatar rules
- 기준 커밋: `a6f3c82`
- 작업 요청: Catalog 확장이 가능한 파츠 조합형 Avatar와 local persistence

## 성공 조건

- [x] Catalog·Ownership·Selection 분리
- [x] Hair back/front를 포함한 6단계 renderer
- [x] owned item과 None accessory 선택
- [x] invalid slot fallback과 sequential persistence
- [x] SQLite v3 single-row config와 Web adapter
- [ ] 실제 Android CASE 1~15 — MVP 통합 QA로 이관

## 관찰 기록

### 탐색

| 대상 | 발견한 사실 |
| --- | --- |
| Avatar | string ID 타입 초안과 placeholder 화면만 존재 |
| Assets | 완성 Avatar asset 없음 |
| Persistence | SQLite `user_version = 2`, Web platform adapter pattern 사용 |
| Theme | UI chrome에 필요한 token은 이미 존재 |
| Product | Catalog·Ownership·Selection 분리 원칙이 문서화됨 |

### 구현 결정

1. semantic literal ID와 Catalog/Ownership/Selection 함수를 분리했습니다.
2. 최종 art 대신 공통 canvas placeholder registry로 renderer 구조를 검증했습니다.
3. v3 single-row table과 platform repository를 추가했습니다.
4. selection은 즉시 preview하고 순차 저장·persisted rollback합니다.

### 최종 검증

| 확인 | 결과 |
| --- | --- |
| `pnpm lint` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm test` | PASS — 15 suites, 51 tests |
| `pnpm version:check` | PASS — `0.1.0` |
| `pnpm deps:check` | PASS — offline dependency check |
| `pnpm build:web` | PASS — 12 static routes, `/avatar` 포함 |
| Android JS export | PASS — 1,326 modules, 27 assets |
| `/avatar` HTTP smoke | PASS — HTTP 200 |
| Browser visual automation | BLOCKED — Codex browser runtime kernel asset path 오류 |
| Android manual | NOT TESTED — MVP 통합 QA로 이관 |

### 실패 대응

- TypeScript가 전체 Item ID union을 각 slot ID로 축소하지 못한 오류를 발견했습니다.
- type assertion으로 우회하지 않고 generic Catalog ID guard와 category branch로 수정했습니다.
- 빠른 연속 저장이 모두 실패하는 경우를 검토해 마지막 persisted config를 rollback 기준으로
  추가했습니다.
- Browser 자동화는 Codex runtime의 kernel asset path 오류로 실행되지 않았습니다. 앱의
  `/avatar` 경로는 HTTP 200과 Web export로 별도 확인했습니다.

## 완료 판단

- 코드와 빠른 자동 검증 기준 M5 engine 완료
- 실제 asset·Android migration/row/재실행 검증은 MVP 통합 QA에서 수행

## 하네스 후보

- MVP QA checklist에 M2~M5 Native lifecycle 묶음 추가
- 후속 asset 교체 PR에서 canvas alignment 자동 검사를 검토
