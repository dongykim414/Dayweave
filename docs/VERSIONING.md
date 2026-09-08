# Dayweave Versioning and Release Records

## 네 가지 기록은 서로 다른 질문에 답한다

| 기록 | 답하는 질문 | Dayweave에서의 위치 |
| --- | --- | --- |
| Milestone | 여러 Issue와 PR이 어떤 목표를 함께 완성하는가? | GitHub Milestone |
| Version | 사용자가 받는 결과물이 어느 호환 단계인가? | `package.json`, `app.json` |
| Changelog | 각 버전에서 무엇이 추가·변경·수정됐는가? | `CHANGELOG.md` |
| Release | 특정 commit과 배포 설명을 어떻게 고정하는가? | Git tag와 GitHub Release |

Milestone은 작업 묶음이고 Version은 결과물의 식별자입니다. 둘은 관련 있지만 같은
개념이 아닙니다. 현재 GitHub Milestone은 `MVP v1 — Personal Diary & Schedule` 하나로
운영하며, `M0`~`M7`은 그 안의 세부 단계입니다. 예를 들어 `M1 Diary Core`에 여러 PR이
포함될 수 있고, 그 단계가 완료되어 검증 가능한 기준선이 만들어질 때 하나의 minor
version을 낼 수 있습니다.

## SemVer 규칙

Dayweave는 `MAJOR.MINOR.PATCH` 형식의 Semantic Versioning을 사용합니다.

- **MAJOR**: 기존 사용 방식이나 데이터 계약을 호환되지 않게 바꾸는 큰 변경
- **MINOR**: 기존 기능을 깨지 않으면서 새로운 사용자 기능 또는 검증 가능한 제품
  단계를 완성한 변경
- **PATCH**: 현재 기능과 호환되는 버그 수정, 작은 UX 개선, 문서·설정 보정

현재는 `1.0.0` 이전의 초기 개발 단계입니다. 따라서 다음 기준을 적용합니다.

- `0.1.0`: M0 Foundation의 최초 기준선
- `0.1.1`: M0 기준선의 버그, 문서 오류, 작은 호환 개선
- `0.2.0`: 여러 PR을 통해 다음 의미 있는 제품 단계가 완성된 경우
- `1.0.0`: 핵심 다이어리 경험, 데이터 안정성, 배포·운영 기준이 공개 제품 수준으로
  준비된 경우

모든 PR이나 commit마다 버전을 올리지 않습니다. MVP Milestone 안의 미완성 작업은
`Unreleased`에 모으고, 실제로 검토·사용 가능한 기준선이 될 때 한 번 version을
결정합니다.

## 버전이 저장되는 곳

- `package.json`의 `version`: JavaScript 프로젝트와 tooling이 읽는 버전
- `app.json`의 `expo.version`: Expo 앱 사용자에게 표시되는 버전
- Git tag `vX.Y.Z`: 해당 버전의 정확한 source commit
- GitHub Release: 사람이 읽는 배포 설명과 관련 자료

`package.json`과 `app.json`의 version은 항상 같게 유지합니다. App Store와 Play Store
배포를 시작하면 iOS `buildNumber`와 Android `versionCode`도 추가합니다. 이 두 값은
같은 사용자 버전의 재빌드를 구분하는 별도 증가 번호이므로 SemVer와 역할이 다릅니다.
두 설정의 일치 여부와 SemVer 형식은 `pnpm version:check`가 확인하며 PR CI에서도
자동으로 실행됩니다.

## 릴리스 절차

1. MVP Milestone과 현재 세부 단계의 목표·완료 조건을 확인합니다.
2. 다음 version이 patch인지 minor인지 결정합니다.
3. `package.json`과 `app.json`의 version을 같은 값으로 변경합니다.
4. `CHANGELOG.md`의 `Unreleased` 항목을 날짜가 있는 version 항목으로 옮깁니다.
5. `docs/releases/vX.Y.Z.md`에 범위, 주요 변경, 검증, 제외 사항을 기록합니다.
6. `pnpm version:check`를 포함한 PR CI와 리뷰를 통과한 뒤 squash merge합니다.
7. 성공한 `main` commit에 annotated tag `vX.Y.Z`를 만들고 push합니다.
8. 같은 tag로 GitHub Release를 만듭니다. MVP Milestone은 `v1.0.0` 완료 시 닫습니다.

Tag는 움직이지 않는 버전 증거이므로 CI를 통과한 `main`에만 만듭니다. 초기 기반처럼
아직 실제 사용자 배포물이 아닌 버전은 GitHub에서 **pre-release**로 표시할 수 있습니다.

## 개발 중 Pre-release 번호

MVP의 다음 세부 단계를 개발하는 중간 결과까지 GitHub Release로 확인하고 싶다면 patch
번호를 연속으로 올리지 않고, 목표 minor version에 pre-release 식별자를 붙입니다.

- `0.2.0-alpha.1`: M1의 첫 통합 미리보기
- `0.2.0-alpha.2`: M1의 다음 통합 미리보기
- `0.2.0-beta.1`: 기능 범위가 완성되어 사용성 검증을 시작한 버전
- `0.2.0-rc.1`: 최종 release candidate
- `0.2.0`: M1 완료 기준선

반면 `0.1.1`은 이미 고정된 `0.1.0` 기반의 호환 가능한 버그 수정이라는 뜻입니다.
따라서 “PR을 한 번 합칠 때마다 patch 증가”가 아니라 변경의 목적과 안정화 단계에
따라 번호를 선택합니다. 모든 중간 merge를 반드시 release할 필요는 없으며, 실제로
설치하거나 비교할 가치가 있는 통합 지점만 pre-release로 고정합니다.

## 변경 유형별 예시

| 변경 | 예상 version 영향 | 이유 |
| --- | --- | --- |
| 오탈자나 링크 수정 | 없음 또는 patch | 배포 결과에 미치는 영향에 따라 선택 |
| 저장 버튼 crash 수정 | patch | 기존 기능의 호환 가능한 결함 수정 |
| 로컬 Diary CRUD 완성 | minor | 새로 사용할 수 있는 제품 능력 추가 |
| 저장 데이터 형식을 호환 불가하게 교체 | major 후보 | 기존 데이터·계약을 깨는 변경 |

Version 영향은 PR 템플릿에 기록하지만, 최종 숫자는 merge 수가 아니라 release 범위와
호환성으로 판단합니다.
