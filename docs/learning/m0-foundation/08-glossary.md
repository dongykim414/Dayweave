# 08. M0 용어집

## 제품과 작업 단위

### MVP

사용자가 핵심 가치를 실제로 경험하고 검증할 수 있는 최소 제품입니다. Dayweave의
제품 MVP에는 실제 기록 저장과 조회가 포함됩니다.

### Milestone

큰 제품 목표를 개발 가능한 단계로 나눈 단위입니다. M0 Foundation, M1 Diary Core,
M2 Today처럼 표현합니다.

### Foundation

기능을 쌓기 위한 구조, 공통 규칙과 검증 기반입니다. Foundation 자체가 최종 사용자
기능을 의미하지는 않습니다.

### Scope

이번 작업에서 하기로 합의한 범위입니다. 명시적 제외 항목도 scope의 중요한 일부입니다.

### Acceptance Criteria

요구사항이 완료됐다고 판단할 수 있는 관찰 가능한 조건입니다. 예: 네 탭 route가 Web
export에 생성된다.

### Definition of Done

기능 조건 외에 lint, test, 문서, review 증거 등 팀이 완료로 인정하기 위한 공통 기준입니다.

## React Native와 구조

### React Native

React와 TypeScript를 이용해 Android와 iOS native UI를 만드는 framework입니다.

### Expo

React Native 앱의 개발 server, SDK package, build와 배포 도구를 제공하는 생태계입니다.

### Expo Router

`app/`의 파일 구조를 기반으로 화면 route와 navigation을 구성하는 도구입니다.

### Route

주소 또는 navigation 상태를 특정 화면과 연결하는 진입점입니다.

### Route Group

`(tabs)`처럼 괄호 이름으로 route들을 구조적으로 묶되 URL의 일반 segment로 강제하지
않는 Expo Router 폴더입니다.

### Screen

한 화면의 실제 UI 구성과 화면 수준 상태를 담당하는 component입니다.

### Feature

diary, mood, avatar처럼 하나의 제품 관심사를 중심으로 관련 code를 묶은 영역입니다.

### Shared

특정 feature의 제품 의미를 모르는 재사용 code입니다. AppButton과 AppText가 예입니다.

### Dependency Direction

어느 영역이 어느 영역을 import할 수 있는지 정한 방향입니다. 순환 의존성과 책임
뒤섞임을 줄입니다.

### Repository

화면과 도메인이 SQLite나 Supabase의 구체적인 저장 방식을 직접 알지 않도록 제공하는
저장·조회 경계입니다. M0에는 아직 구현하지 않았습니다.

## Theme과 UI

### Design Token

색상, 간격, radius, typography 같은 디자인 값을 재사용 가능한 이름으로 정의한 것입니다.

### Semantic Token

`#3F79A8` 같은 값이 아니라 `primary`, `danger`, `surface`처럼 역할과 의미를 나타내는
token입니다.

### Theme

같은 semantic token 계약을 실제 색상과 스타일 값으로 채운 묶음입니다. 현재는 Sky만
있습니다.

### Registry

안정적인 ID를 실제 구현이나 metadata와 연결하는 목록입니다. `themeRegistry`는
`sky` ID를 `skyTheme`과 연결합니다.

### Provider

React component tree의 상단에서 theme 같은 공통 값을 하위 component에 전달하는
component입니다.

### Context

props를 여러 단계로 직접 넘기지 않고 Provider 아래 component들이 공통 값을 읽게 하는
React 기능입니다.

### Hook

React component에서 state, context와 lifecycle 기능을 사용하는 함수입니다.
`useTheme()`이 예입니다.

### UI Primitive

AppText, AppButton처럼 여러 화면이 조합해서 사용하는 작은 공용 UI building block입니다.

### Safe Area

노치, 상태 표시줄과 화면 모서리 때문에 내용이 가려지지 않도록 확보하는 영역입니다.

### Accessibility Label

아이콘만 있는 버튼의 목적을 screen reader가 읽을 수 있도록 제공하는 설명입니다.

## 데이터 모델

### Domain

제품이 다루는 업무 개념과 규칙입니다. Dayweave의 DiaryEntry, Mood와 Avatar가
도메인 개념입니다.

### Semantic ID

시각 표현과 관계없이 의미를 안정적으로 나타내는 ID입니다. Mood의 `happy`가 예입니다.

### Union Type

TypeScript 값이 정해진 후보 중 하나임을 표현합니다. `"happy" | "sad"` 같은 형태입니다.

### Catalog

앱에 존재하는 모든 상품·아이템의 정의입니다.

### Ownership

사용자가 어떤 item을 사용할 권한이 있는지 나타냅니다.

### Selection

보유 item 중 현재 실제로 적용한 것을 나타냅니다.

### Persistence

앱을 종료하고 다시 실행해도 data나 설정이 남도록 저장하는 것입니다.

### Migration

앱 version이 바뀌며 DB schema가 달라질 때 기존 사용자 data를 새 구조로 안전하게
옮기는 작업입니다.

## Package와 검증

### Package Manager

JavaScript dependency를 설치하고 script를 실행하는 도구입니다. 이 프로젝트는 pnpm을
사용합니다.

### Dependency

프로젝트가 실행 또는 개발에 사용하는 외부 package입니다.

### Transitive Dependency

직접 설치한 package가 내부적으로 사용하는 또 다른 package입니다.

### Peer Dependency

library가 자신이 포함하지 않고 사용하는 앱이나 상위 package가 함께 제공하기를
기대하는 dependency입니다.

### Lockfile

dependency version과 전체 해석 결과를 고정해 다른 환경에서도 같은 tree를 설치하게
하는 파일입니다.

### Frozen Install

package 선언과 lockfile이 다르면 lockfile을 자동 수정하지 않고 실패하는 설치 방식입니다.

### Lint

code pattern, style와 일부 오류를 정적 분석하는 검사입니다.

### Typecheck

TypeScript 타입 계약이 맞는지 code를 실행하지 않고 검사합니다.

### Bundle

앱에서 실행할 여러 module과 asset을 플랫폼이 읽을 수 있는 결과로 묶는 과정 또는
그 결과입니다.

### Metro

React Native와 Expo가 사용하는 JavaScript bundler와 개발 server입니다.

### Static Export

Web route를 미리 rendering 가능한 파일로 생성하는 과정입니다. Native build와 같은
검사는 아니지만 import와 route 문제를 찾는 데 유용합니다.

### CI

GitHub Actions처럼 clean environment에서 install, lint, typecheck와 build를 자동 실행해
변경을 검사하는 시스템입니다.

## Git과 협업

### Branch

main에 영향을 주지 않고 독립적으로 변경을 작업하는 Git history의 갈래입니다.

### Commit

관련 변경과 설명을 하나의 Git 기록으로 저장한 단위입니다.

### Pull Request

한 branch의 변경을 다른 branch에 합치기 전에 diff, 자동 검사와 review를 모으는 단위입니다.

### Base Branch

PR이 최종적으로 변경을 합치려는 대상 branch입니다.

### Head Branch

PR에서 검토할 변경이 들어 있는 작업 branch입니다.

### Stacked PR

아직 merge되지 않은 다른 작업 branch를 base로 하는 의존 PR입니다.

### Squash Merge

PR의 여러 commit을 대상 branch에 하나의 commit으로 합쳐 넣는 방식입니다.

### Rebase

작업 commit들을 다른 최신 base 위에 다시 적용해 history의 시작점을 바꾸는 작업입니다.

### Force With Lease

rebase 후 feature branch history를 갱신하되, 원격 branch가 예상과 다르면 덮어쓰지 않고
실패하게 하는 보호된 force push 방식입니다.

### Merge Conflict

두 branch가 같은 부분을 서로 다르게 변경해 Git이 자동으로 합칠 방법을 결정하지 못한
상태입니다.

### Release Branch

특정 배포 후보를 안정화하기 위해 main의 한 시점을 고정한 branch입니다. Dayweave는
`release/YYYY-Www` 형식을 사용합니다.

## AI와 Harness

### Coding Agent

저장소를 읽고 계획, 파일 변경, 명령 실행과 검증까지 수행할 수 있는 AI 작업자입니다.

### Harness Engineering

Agent가 반복해서 안전하고 검증 가능하게 일하도록 문서, 규칙, 도구, test와 workflow를
설계하고 개선하는 작업입니다.

### AGENTS.md

Agent가 저장소 작업 전에 읽고 지속적으로 지켜야 하는 프로젝트 규칙입니다.

### Run Log

한 AI 작업에서 요청, 계획, 관찰한 사실, 실패, 회복, 검증과 남은 위험을 기록한 문서입니다.

### Evidence

완료 주장을 뒷받침하는 명령 결과, CI status, screenshot, test 결과와 diff 같은 검증
자료입니다.

### Inference

관찰된 사실을 바탕으로 내린 해석이나 예상입니다. 사실과 구분해서 표현해야 합니다.
