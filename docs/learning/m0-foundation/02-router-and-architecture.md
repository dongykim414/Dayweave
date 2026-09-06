# 02. Expo Router와 Feature 구조

## 먼저 알아야 할 세 가지

### Route

사용자가 특정 주소나 탭으로 이동했을 때 어떤 화면을 열지 연결합니다. Expo Router는
파일과 폴더 이름을 route로 사용합니다.

### Screen

사용자가 실제로 보는 화면 구성입니다. 제목, 카드, 버튼과 빈 상태를 조립합니다.

### Feature

하나의 제품 관심사를 묶는 영역입니다. Dayweave의 예는 `diary`, `mood`, `theme`,
`avatar`입니다.

route와 screen은 같은 것이 아닙니다. route는 길을 연결하고, screen은 화면 내용을
소유합니다.

## 현재 route 구조

```text
app/
├─ _layout.tsx
├─ index.tsx
└─ (tabs)/
   ├─ _layout.tsx
   ├─ today.tsx
   ├─ timeline.tsx
   ├─ avatar.tsx
   └─ me.tsx
```

- `app/_layout.tsx`: 앱 전체 Provider와 최상위 Stack
- `app/index.tsx`: 첫 진입을 오늘 탭으로 redirect
- `app/(tabs)/_layout.tsx`: 하단 4탭과 탭 스타일
- 각 탭 route: 해당 feature screen을 export

괄호가 있는 `(tabs)`는 route group입니다. 구조를 묶지만 사용자 URL의 필수 경로
이름으로 사용하지 않는 Expo Router 패턴입니다.

## route를 얇게 만든 이유

`app/(tabs)/today.tsx`는 다음 한 줄만 가집니다.

```tsx
export { default } from "@/features/diary/screens/TodayScreen";
```

이 방식은 처음에는 파일이 하나 더 생겨 번거로워 보입니다. 하지만 다음 장점이 있습니다.

- navigation 구조와 제품 화면 구현을 따로 변경할 수 있습니다.
- screen을 route 밖에서 테스트하거나 preview하기 쉽습니다.
- route 파일에 DB, API, 상태 로직이 쌓이는 것을 막습니다.
- Web과 Native navigation 설정이 바뀌어도 feature 코드의 이동이 줄어듭니다.

향후 `TodayScreen`이 커지면 `features/diary/components`, `model`, `hooks`,
`repository`로 나눌 수 있지만 route 파일은 계속 작게 유지됩니다.

## feature-based 구조를 선택한 이유

현재 구조는 다음과 같습니다.

```text
src/features/
├─ diary/
│  └─ screens/
├─ mood/
├─ theme/
├─ avatar/
└─ profile/

src/shared/
└─ components/
```

기능별로 관련 코드를 가까이 두면 “오늘 기록 기능을 수정하려면 어디를 봐야 하는가?”에
답하기 쉽습니다. 프로젝트가 커졌을 때 diary 관련 screen, model, repository와 test가
한 영역 안에서 함께 진화할 수 있습니다.

`profile`은 네 번째 `내 정보` 화면의 책임을 명확히 하기 위해 추가했습니다. 로그인이나
서버 사용자 계정을 의미하지 않으며, 현재는 개인화 상태를 보여주는 화면 shell입니다.

## 의존성 방향

```text
app route
   ↓
feature screen
   ↓
shared UI + theme runtime
```

허용되는 예:

- `app/(tabs)/today.tsx` → `features/diary/screens/TodayScreen`
- `TodayScreen` → `shared/components`
- `AppButton` → `features/theme`

피해야 하는 예:

- `shared/components/AppButton` → `features/diary`
- `app/(tabs)/today.tsx`에서 SQLite query 실행
- `features/diary`가 특정 Mood 이미지 파일 경로를 직접 import

아래쪽의 공용 계층이 위쪽의 구체적인 feature를 알기 시작하면 순환 의존성과 재사용
문제가 생깁니다. 그래서 `shared는 feature를 import하지 않는다`를 규칙으로 두었습니다.

## `src/app`에서 root `app`으로 옮긴 이유

Expo Router는 root `app/`과 `src/app/` 구성을 지원하지만 이번 M0 기준 구조는 root
`app/`을 명시했습니다. 문서와 실제 구조를 일치시키고, `src/`에는 제품 구현을 두는
경계를 더 눈에 띄게 만들기 위해 root `app/`을 선택했습니다.

여기서 실제 오류가 한 번 발생했습니다.

1. Git으로 `src/app`의 파일을 삭제했습니다.
2. 로컬에는 빈 `src/app` 폴더가 남았습니다.
3. 첫 Web export가 빈 `src/app`을 route root로 선택했습니다.
4. export 결과에 새 탭 route가 없었습니다.
5. 빈 폴더임을 확인하고 제거한 뒤 다시 export했습니다.
6. `/today`, `/timeline`, `/avatar`, `/me` route가 생성됐습니다.

이 사례는 “빌드 명령이 종료 코드 0이다”만으로 충분하지 않다는 것을 보여줍니다.
성공 로그의 **내용**도 기대한 결과와 일치하는지 확인해야 합니다.

## 빈 폴더를 미리 만들지 않은 이유

설계서에는 `shared/hooks`, `shared/utils`, `src/lib` 같은 미래 폴더가 있습니다. 하지만
실제 코드가 없는 폴더를 placeholder 파일로 유지하면 다음 문제가 생깁니다.

- 현재 존재하는 기능처럼 오해할 수 있습니다.
- 어디에 넣어야 할지 충분히 검토하지 않고 폴더 이름을 따르게 됩니다.
- 탐색 결과에 의미 없는 파일이 늘어납니다.

따라서 계획된 경로는 `docs/ARCHITECTURE.md`에 설명하고 실제 책임이 생길 때 만듭니다.

## 고려한 다른 선택지

### route 안에 화면을 전부 작성

작은 앱에서는 빠릅니다. 그러나 route가 스타일, 상태, 저장 로직까지 소유하기 쉬워
기능이 커질수록 테스트와 이동이 어렵습니다.

### 파일 종류별 구조

```text
src/components
src/hooks
src/services
src/types
```

초기에는 익숙하지만 diary 한 기능을 바꿀 때 여러 최상위 폴더를 오가야 합니다.
공통 코드와 특정 기능 코드의 경계도 흐려집니다.

### 모든 것을 `shared`에 배치

재사용 가능해 보이지만 실제로는 feature 문구와 정책이 공용 코드에 섞입니다. 두 곳에서
사용됐다는 이유만으로 곧바로 shared로 옮기지 말고, 제품 의미가 없는 진짜 공통 책임인지
확인해야 합니다.

### navigation을 수동 설정

React Navigation을 직접 구성할 수도 있습니다. Expo Router를 이미 선택했고 파일 기반
route가 현재 규모와 Expo 생태계에 잘 맞으므로 별도의 navigation 체계를 추가하지
않았습니다.

## M1에서 파일을 추가하는 사고 과정

예를 들어 Diary 저장을 추가한다고 가정합니다.

1. route가 아니라 diary feature가 저장 규칙을 소유합니다.
2. `features/diary/model`에 DiaryEntry 타입과 날짜 규칙을 둡니다.
3. `features/diary/repository`에 UI가 필요한 저장 interface를 둡니다.
4. SQLite 구현은 infrastructure 역할로 분리합니다.
5. TodayScreen은 repository의 구체적인 SQL을 몰라야 합니다.
6. 공용 버튼은 저장 성공 여부나 diary 문구를 몰라야 합니다.

## 직접 확인하기

```bash
pnpm build:web
```

로그의 `Static routes`에서 다음 경로를 찾습니다.

- `/today`
- `/timeline`
- `/avatar`
- `/me`

그다음 각 `app/(tabs)/*.tsx`와 연결된 `src/features/**/screens/*.tsx`를 나란히 열어
route에 제품 로직이 없는지 확인합니다.

## 자신의 말로 답해보기

1. route와 screen을 분리하면 테스트에 어떤 도움이 되나요?
2. `AppButton`이 diary feature를 import하면 왜 문제가 되나요?
3. 빌드가 성공했는데도 첫 export를 실패로 판단한 근거는 무엇이었나요?
