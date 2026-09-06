# 07. PR 검토와 병합

## 현재 PR 관계

```text
main
  └─ PR #1 branch: codex/migrate-to-expo
       └─ PR #2 branch: codex/feat/m0-foundation
```

- PR #1: Next.js 기반을 React Native + Expo로 전환
- PR #2: Expo 기반 위에 M0 Foundation 구현

PR #2는 PR #1의 파일이 존재한다고 가정하기 때문에 현재 base가 `main`이 아니라
`codex/migrate-to-expo`입니다. 이것을 stacked PR이라고 합니다.

## stacked PR을 선택한 이유

PR #1이 merge될 때까지 기다리지 않고 M0 작업을 시작할 수 있고, PR #2의 Files changed가
M0 변경만 보여줘 리뷰하기 쉽습니다.

### 다른 선택지 A: PR #1에 M0까지 계속 추가

branch는 하나라 단순하지만 Expo migration과 제품 Foundation이 한 PR에 섞입니다.
리뷰 범위가 커지고 어느 변경에서 문제가 생겼는지 찾기 어려워집니다.

### 다른 선택지 B: PR #1 merge 후에만 M0 시작

가장 단순한 history를 얻지만 사용자의 검토를 기다리는 동안 다음 작업을 진행할 수
없습니다.

### 선택한 방식: stacked PR

작업은 병렬로 진행하면서 논리적 변경 단위는 분리합니다. 대신 merge 순서와 rebase를
관리해야 하는 비용이 있습니다.

## 지금 사용자가 검토할 순서

### 1단계: PR #1 검토

PR #1에서 확인할 핵심:

- Next.js dependency와 설정이 제거됐는가?
- Expo SDK, React Native와 Expo Router가 정상 설정됐는가?
- 기본 앱이 실행되고 CI가 통과하는가?
- 주간 release와 branch protection 문서가 의도와 맞는가?

문제가 없으면 PR #1을 squash merge합니다.

이때 PR #2 rebase가 끝날 때까지 PR #1의 source branch를 바로 삭제하지 않는 편이
안전합니다. GitHub의 `Delete branch` 버튼은 잠시 기다립니다.

### 2단계: PR #2는 아직 merge하지 않기

PR #2의 base는 PR #1 branch입니다. PR #1보다 먼저 merge하려고 하지 않습니다.
PR #2의 코드와 문서는 미리 읽어도 됩니다.

### 3단계: PR #1 merge 후 PR #2 rebase

이 저장소는 squash merge만 허용합니다. Squash merge는 PR #1의 여러 commit을 main의
새 commit 하나로 만듭니다. PR #2 branch에는 PR #1의 원래 commit들이 남아 있으므로,
단순히 base만 main으로 바꾸면 commit 관계와 diff가 혼란스러울 수 있습니다.

따라서 PR #2의 M0 commit만 최신 main 위에 다시 올립니다.

개념적으로 수행할 명령은 다음과 같습니다.

```bash
git fetch origin
git switch codex/feat/m0-foundation
git rebase --onto origin/main origin/codex/migrate-to-expo
git push --force-with-lease
gh pr edit 2 --base main
```

`--force-with-lease`는 feature branch의 rebase된 history를 올리되, 원격 branch가 예상과
다르게 바뀌었다면 덮어쓰지 않고 실패하게 합니다. `main`이나 `release/*`에는 force
push하지 않습니다.

이 단계는 실수 가능성이 있으므로 PR #1을 merge한 뒤 Codex에게 “PR #2를 main 위로
rebase하고 base를 main으로 바꿔줘”라고 요청해도 됩니다.

PR #2가 main을 base로 정상 전환된 뒤에는 PR #1의 source branch를 삭제해도 됩니다.

### 4단계: PR #2를 다시 검토

rebase 후 반드시 확인합니다.

- Base branch가 `main`인가?
- Files changed가 M0 내용만 보여주는가?
- `Validate Expo app`이 새 commit에서 다시 통과했는가?
- merge conflict가 없는가?

문제가 없으면 PR #2를 squash merge합니다.

## PR #2를 파일별로 보는 방법

GitHub PR의 `Files changed`에서 다음 순서로 보면 이해하기 쉽습니다.

### 1. 제품과 규칙

- `docs/PRODUCT.md`
- `docs/ROADMAP.md`
- `AGENTS.md`

먼저 “무엇을 만들고 무엇을 만들지 않았는지”를 확인합니다.

### 2. 앱 진입과 navigation

- `app/_layout.tsx`
- `app/index.tsx`
- `app/(tabs)/_layout.tsx`
- 네 개 tab route

Provider가 Router를 감싸고, 네 route가 feature screen만 연결하는지 봅니다.

### 3. Theme

- `src/features/theme/theme.types.ts`
- `src/features/theme/themes/sky.ts`
- `src/features/theme/themeRegistry.ts`
- `src/features/theme/ThemeProvider.tsx`

타입 → 실제 Sky 값 → registry → Provider 순서로 읽습니다.

### 4. 공용 UI와 화면

- `src/shared/components`
- `src/features/**/screens`

공용 UI에 diary 문구나 저장 로직이 없는지, screen에 HEX가 없는지 확인합니다.

### 5. Domain 경계

- `src/features/mood/mood.types.ts`
- `src/features/avatar/avatar.types.ts`

semantic ID와 part ID만 정의하고 실제 asset이나 기능을 미리 만들지 않았는지 봅니다.

### 6. 개발 환경과 증거

- `package.json`
- `pnpm-workspace.yaml`
- `.github/workflows/pr-check.yml`
- `docs/harness/runs/003-m0-foundation.md`

dependency와 CI가 문서 설명과 일치하는지 확인합니다.

## 코드 한 줄까지 모두 알아야 병합할 수 있는가?

그럴 필요는 없습니다. 책임 수준별로 확인하면 됩니다.

### 반드시 이해할 것

- 제품 범위
- 데이터와 표현을 분리하는 핵심 원칙
- branch와 merge 순서
- 어떤 검증이 통과했고 무엇은 미검증인지

### 구조를 따라갈 수 있으면 되는 것

- Provider와 Context의 세부 TypeScript 문법
- React Native props type 조합
- pnpm lockfile 내부의 모든 전이 dependency

### 자동 도구에 맡겨도 되는 것

- lockfile의 개별 integrity 값
- Metro가 생성한 bundle 내부
- CI runner의 임시 파일

중요한 것은 모르는 줄을 없애는 것이 아니라, 어떤 부분을 직접 판단하고 어떤 부분을
검증 도구에 위임했는지 아는 것입니다.

## 병합 전 최종 체크리스트

- [ ] PR #1이 먼저 main에 squash merge됐다.
- [ ] PR #2 rebase 전에는 PR #1 source branch를 삭제하지 않았다.
- [ ] PR #2를 최신 main 위로 rebase했다.
- [ ] PR #2 base가 main이다.
- [ ] PR #2 Files changed에 예상하지 않은 PR #1 중복 diff가 없다.
- [ ] `Validate Expo app`이 통과했다.
- [ ] Android 실제 화면 미검증이라는 남은 위험을 이해했다.
- [ ] SQLite·CRUD·AI 등 M0 제외 기능이 섞이지 않았다.
- [ ] 기준 DOCX가 원치 않게 commit되지 않았다.

## 병합 후 확인

```bash
git switch main
git pull --ff-only
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm build:web
```

그다음 M1은 새 `codex/feat/...` branch에서 시작합니다. 매주 수요일 release cut은 그
시점에 `main`까지 merge된 내용만 `release/YYYY-Www`에 포함합니다.

## 자신의 말로 답해보기

1. PR #2가 처음부터 main을 base로 하지 않은 이유는 무엇인가요?
2. PR #1을 squash merge한 뒤 PR #2를 rebase하는 이유는 무엇인가요?
3. lockfile의 모든 줄을 읽지 않아도 검토할 수 있는 근거는 무엇인가요?
