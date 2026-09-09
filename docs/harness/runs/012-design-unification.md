# Run 012: Design Unification

## 범위

- Master reference에서 token/component 규칙 추출
- Theme와 shared UI를 먼저 변경한 뒤 Today, Timeline, Detail, Avatar, Me에 적용
- business logic, repository, SQLite, Photo와 Avatar domain 변경 제외

## 관찰과 결정

- 기존 UI는 동일 token을 썼지만 큰 outline card와 화면별 inline style 비중이 높았습니다.
- Reference는 밝은 canvas, 낮은 elevation, compact type, pill action과 icon 중심 nav를
  일관되게 사용했습니다.
- feature별 기능을 추가하지 않고 기존 데이터로 표현 가능한 구조만 반영했습니다.

## 검증

- `pnpm typecheck`: PASS
- `pnpm lint`: PASS
- `pnpm test -- --runInBand`: PASS — 17 suites, 56 tests
- `pnpm version:check`: PASS — `0.1.0`
- `pnpm deps:check`: PASS — offline dependency check
- `pnpm build:web`: PASS — 12 static routes
- `/today`, `/timeline`, `/avatar`, `/me`: HTTP 200
- Browser visual automation: BLOCKED — Codex kernel asset path 오류
- Android/iOS visual validation: NOT TESTED
