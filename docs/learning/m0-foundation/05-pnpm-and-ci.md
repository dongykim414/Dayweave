# 05. pnpm, Lockfile과 CI

## 왜 npm에서 pnpm으로 바꿨는가?

가장 직접적인 이유는 M0 기준 스택이 pnpm을 명시했기 때문입니다. 도구 선택은 여러
package manager를 동시에 유지하는 것보다 팀과 자동화가 한 가지 방식을 일관되게
사용하는 것이 중요합니다.

pnpm을 선택했을 때 얻는 특성은 다음과 같습니다.

- content-addressable store를 이용해 여러 프로젝트가 같은 package 파일을 공유
- 직접 선언하지 않은 dependency import를 더 엄격하게 제한
- install script를 허용한 package만 실행하도록 통제
- lockfile로 해석된 dependency tree를 재현

이것이 npm이 나쁘다는 뜻은 아닙니다. 작은 단일 프로젝트라면 npm도 충분합니다. 이번
프로젝트는 기준 문서, 로컬 명령과 CI를 한 도구로 맞추는 일관성을 선택했습니다.

참고 자료:

- [pnpm 소개](https://pnpm.io/)
- [pnpm build script 승인](https://pnpm.io/cli/approve-builds)
- [GitHub Actions용 pnpm setup](https://github.com/pnpm/setup)

## 바뀐 파일

### package.json

```json
"packageManager": "pnpm@11.19.0"
```

사람과 CI가 같은 pnpm major/minor를 사용하도록 기준을 고정합니다. `dependencies`에는
실제 앱 runtime package가, `devDependencies`에는 TypeScript와 ESLint 같은 개발
도구가 들어갑니다.

### pnpm-lock.yaml

선언된 version 범위가 실제로 어떤 package version과 전이 dependency로 해석됐는지
기록합니다. 사람이 직접 편집하기보다 `pnpm install`로 생성하고 함께 commit합니다.

### pnpm-workspace.yaml

이 프로젝트는 monorepo가 아니지만 pnpm의 프로젝트 정책을 이 파일에 둡니다.

```yaml
autoInstallPeers: false
allowBuilds:
  unrs-resolver: true
peerDependencyRules:
  ignoreMissing:
    - react-native-gesture-handler
    - react-native-reanimated
```

### package-lock.json 삭제

npm lockfile과 pnpm lockfile을 동시에 두면 개발자와 CI가 서로 다른 dependency tree를
사용할 수 있습니다. pnpm을 기준으로 정했으므로 `package-lock.json`을 제거했습니다.

## Peer dependency란?

어떤 library가 직접 포함하지 않고 사용하는 쪽에서 함께 제공되기를 기대하는 package입니다.
예를 들어 plugin이 React를 자체 설치하지 않고 앱의 React version과 함께 동작하는
경우가 있습니다.

pnpm 첫 전환에서는 Expo Router가 포함한 사용하지 않는 Drawer 경로 때문에 다음 peer가
자동으로 설치됐습니다.

- `react-native-gesture-handler`
- `react-native-reanimated`
- Reanimated가 요구하는 `react-native-worklets`

그 결과 Expo SDK 내부 optional peer와 자동으로 선택된 Worklets version 사이에 경고가
생겼습니다. 현재 앱은 Tabs만 사용하고 Drawer나 animation을 사용하지 않으므로 M0에서
이 package들을 직접 추가하지 않았습니다.

`autoInstallPeers: false`는 pnpm이 추측으로 peer를 설치하지 않게 합니다.
`ignoreMissing`은 **현재 사용하지 않는 Drawer 경로의 두 peer가 의도적으로 없다는
결정**을 기록합니다. 나중에 Drawer나 Reanimated를 실제로 사용하면 이 예외를 제거하고
Expo가 권장하는 호환 version을 명시적으로 설치해야 합니다.

경고를 숨기기 위해 아무 package나 추가하는 것과, 사용 경로를 확인하고 의도적인 예외를
기록하는 것은 다릅니다. 후자는 범위와 이유가 문서에 남고 제거 조건도 분명합니다.

## install script allowlist

package 설치 과정에서 임의의 script가 실행되면 개발 환경에서 code가 실행되는 셈입니다.
pnpm 11은 어떤 dependency의 build/postinstall script를 허용할지 기록할 수 있습니다.

이번 dependency tree에서는 ESLint resolver가 사용하는 `unrs-resolver`만 허용했습니다.
모든 package script를 일괄 허용하지 않은 이유는 supply-chain 공격 표면을 줄이기
위해서입니다.

현재 Codex sandbox에서는 하위 process 실행 제한 때문에 이 package의 postinstall이
`spawn EPERM`으로 한 번 실패했습니다. 하지만 이후 frozen install, ESLint, Web export와
GitHub CI가 모두 통과해 저장소 구성 자체의 문제와 sandbox 제한을 구분했습니다.

## CI workflow가 하는 일

`.github/workflows/pr-check.yml`의 순서는 다음과 같습니다.

```text
Checkout
  ↓
pnpm + Node.js 22 설정
  ↓
pnpm install --frozen-lockfile
  ↓
Expo dependency 호환성
  ↓
ESLint
  ↓
TypeScript
  ↓
Web static export
```

### frozen lockfile이 중요한 이유

CI에서 `package.json`과 lockfile이 일치하지 않으면 자동으로 lockfile을 수정하는 대신
실패합니다. 개발자가 commit하지 않은 dependency 변경이 CI에서 조용히 생기는 것을
막습니다.

### 모든 PR에서 실행하도록 바꾼 이유

기존 workflow는 `main` 대상 PR만 검사했습니다. M0 PR은 아직 merge되지 않은 Expo 전환
branch를 base로 하는 stacked PR이므로 그대로 두면 CI가 실행되지 않습니다.

그래서 `pull_request`의 base branch 제한을 제거해 어떤 branch를 대상으로 한 PR이든
검사하고, `push`는 계속 `main`에서만 검사하도록 했습니다.

### Web export를 검사하는 이유

TypeScript가 통과해도 Metro bundling, route discovery 또는 static rendering이 실패할 수
있습니다. Web export는 Native build보다 빠르면서 import와 route 문제를 더 넓게
검사합니다.

다만 Web export가 Android/iOS native module 동작을 보장하지는 않습니다. Native 기능이
생기면 EAS build와 실제 기기 검증을 별도 gate로 추가해야 합니다.

## 고려한 다른 선택지

### npm 유지

Migration 비용이 없습니다. 하지만 기준 스택과 명령이 달라지고 문서·CI를 이중으로
유지하게 됩니다.

### Yarn 또는 Bun 선택

각각 장점이 있지만 현재 요구사항에 없는 도구입니다. package manager 변경 자체보다
일관된 사용이 목적이므로 추가 비교 없이 pnpm으로 맞췄습니다.

### peer package를 모두 설치

경고를 빠르게 없앨 수 있지만 M0에서 사용하지 않는 animation stack이 추가됩니다.
Expo SDK compatibility와 Native 검증 책임도 늘어납니다.

### install script를 전부 허용

설정은 간단하지만 어느 dependency가 local code를 실행하는지 통제하지 못합니다.

### CI에서 일반 `pnpm install` 사용

lockfile 불일치를 CI가 수정할 수 있어 재현성이 떨어집니다. CI는 frozen install을
사용하고 dependency 변경은 개발 branch에서 명시적으로 생성합니다.

## 직접 확인하기

```bash
pnpm install --frozen-lockfile
pnpm peers check
pnpm deps:check
pnpm lint
pnpm typecheck
pnpm build:web
```

확인 포인트:

- `package-lock.json`이 다시 생기지 않는가?
- frozen install이 lockfile을 수정하지 않는가?
- peer issue가 0개인가?
- `package.json`에 M0에서 사용하지 않는 SQLite, Zustand, Reanimated가 없는가?
- GitHub PR의 `Validate Expo app`이 성공하는가?

## 자신의 말로 답해보기

1. `package.json`과 `pnpm-lock.yaml`은 각각 무엇을 기록하나요?
2. 사용하지 않는 peer를 자동 설치하지 않은 이유는 무엇인가요?
3. TypeScript와 Web export를 둘 다 검사하는 이유는 무엇인가요?
