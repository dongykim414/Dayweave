# Dayweave Development and Weekly Release Process

## 목적

작은 변경을 빠르게 `main`에 통합하면서도 매주 배포 후보를 고정해 다음 주 작업과
섞이지 않게 합니다. 현재 단계에서 실제로 실행하는 규칙만 이 문서에 둡니다.

## 기본 흐름

```text
Issue / 작업 정의
        ↓
short-lived branch
        ↓
구현 + 로컬 검증
        ↓
Pull Request → 필수 CI → 리뷰
        ↓
Squash merge
        ↓
main
        ↓ 매주 수요일 18:00 KST
release/YYYY-Www
        ↓
안정화만 수행
```

`main`은 최신 통합 상태이고, `release/*`는 해당 주 Release Candidate를 고정하는
branch입니다. 여러 작업의 충돌은 PR과 CI에서 먼저 발견하고, Release Cut 이후의
다음 주 작업은 `main`에서 계속합니다.

## 작업 단위와 Branch

- 하나의 PR은 하나의 독립적으로 검증 가능한 논리적 변경을 다룹니다.
- 가능하면 하루 안에 리뷰할 수 있도록 branch 수명을 짧게 유지합니다.
- 기술 계층만 따로 합치기보다 작지만 동작 가능한 vertical slice를 우선합니다.
- 미완성 기능을 합쳐야 한다면 사용자에게 노출되지 않도록 격리합니다.

Branch 이름:

```text
codex/feat/CAL-001-month-view
codex/fix/CAL-014-invalid-time-range
codex/chore/DEV-003-ci-workflow
release/2026-W37
```

## Pull Request Gate

모든 PR은 `main`을 대상으로 하고 다음 검사를 통과해야 합니다.

1. `npm ci`
2. `npm run deps:check`
3. `npm run lint`
4. `npm run typecheck`
5. `npm run build:web`
6. 변경 내용과 증거 확인
7. 리뷰 의견 해결

UI 변경은 스크린샷·영상 또는 향후 Expo 미리보기 링크를 첨부합니다. AI 작업은 관련
Harness Run 문서를 연결합니다. 검증이 모두 끝나면 squash merge하고 branch를
삭제합니다.

## `main` 정책

- 직접 push하지 않습니다.
- CI가 실패한 PR은 merge하지 않습니다.
- merge 직후 `main`이 실패하면 후속 기능보다 수정 또는 revert를 우선합니다.
- 1인 개발 단계에서는 필수 승인 인원 수를 설정하지 않고 CI와 리뷰 의견 해결을
  merge 조건으로 사용합니다.
- 동시에 merge되는 PR이 많아지면 Merge Queue를 도입합니다.

## Weekly Release Cut

- Cut: 매주 수요일 18:00 KST
- Source: 해당 시점의 `main`
- Branch: ISO week 기반 `release/YYYY-Www`
- 자동화: `.github/workflows/release-cut.yml`
- 같은 이름의 branch가 이미 있으면 성공으로 종료하고 덮어쓰지 않습니다.
- 필요하면 GitHub Actions에서 `workflow_dispatch`로 수동 실행합니다.

Release Branch 허용 변경:

- Release blocker 수정
- Regression 또는 crash 수정
- Version·build number·release metadata

Release Branch 금지 변경:

- 신규 기능
- 대규모 refactoring 또는 구조 변경
- 다음 주 작업과 무관한 정리

## Release Fix와 Hotfix

- `main`과 release에 공통인 일반 버그는 `main`에서 수정한 뒤 release에
  cherry-pick합니다.
- release에서만 발생하거나 긴급한 버그는 release 기준 branch에서 수정한 뒤
  동일 변경을 `main`으로 forward-port합니다.
- Production hotfix는 배포된 tag 또는 해당 release branch에서 시작하며 반드시
  `main`에도 반영합니다.

## GitHub Repository Rules

첫 CI가 실행된 뒤 GitHub의 `main` ruleset에 다음 항목을 설정합니다.

- Pull request 필수
- `Validate Expo app` status check 필수
- 대화 해결 필수
- Force push와 branch 삭제 금지
- Squash merge 사용

`release/*` ruleset에는 직접 push 제한과 force push·삭제 금지를 적용하되, Weekly
Release Cut workflow가 branch를 생성할 수 있도록 `GITHUB_TOKEN` 쓰기 권한을
허용합니다.

## 현재 적용 범위

현재 PR Gate는 빠르고 재현 가능한 JavaScript·TypeScript·Web 검증만 수행합니다.
네이티브 빌드, E2E, 실제 기기, Store 배포 Gate는 기능과 배포 기반이 준비되는 시점에
`docs/process/deferred-capabilities.md` 순서로 추가합니다.
