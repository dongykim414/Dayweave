# 04. Mood와 Avatar의 도메인 경계

## 데이터와 표현을 분리한다는 뜻

Dayweave는 미래에 Mood Pack, Theme Pack과 Avatar item을 확장하려고 합니다. 이때
사용자의 기록 데이터가 현재 이미지 파일이나 판매 상품에 직접 묶이면 확장이 매우
어려워집니다.

예를 들어 오늘 기분을 다음처럼 저장했다고 가정합니다.

```text
assets/cat-pack/happy-v2.png
```

이 파일명이 바뀌거나 Cat Pack을 제거하면 기록의 의미도 읽기 어려워집니다. 사용자가
Rabbit Pack으로 바꿔도 과거 기록은 계속 고양이 이미지에 묶여 있습니다.

그래서 기록에는 시각 자산이 아니라 의미를 저장합니다.

```text
DiaryEntry.mood = "happy"
```

화면에 그릴 때만 현재 선택된 Mood Pack이 `happy`를 이미지, 이모지 또는 animation으로
해석합니다.

## Semantic Mood ID

M0에서 정의한 Mood ID는 다음 다섯 개입니다.

```ts
type MoodId =
  | "happy"
  | "calm"
  | "neutral"
  | "sad"
  | "stressed";
```

이 ID의 역할은 감정의 의미를 안정적으로 표현하는 것입니다.

- label이 한국어에서 영어로 바뀌어도 ID는 유지
- 이미지 파일이 바뀌어도 ID는 유지
- Mood Pack이 바뀌어도 ID는 유지
- DB와 API는 UI 자산 경로를 몰라도 됨

M0에서는 ID만 정의했습니다. MoodSelector, 기본 Mood Pack, 이미지와 renderer는 실제
사용 흐름을 만드는 후속 마일스톤에서 구현합니다.

## 왜 enum 대신 문자열 union을 썼는가?

TypeScript enum도 가능합니다. 문자열 literal union은 다음 이유로 현재 규모에
적합합니다.

- 저장되는 실제 문자열을 타입에서 바로 볼 수 있습니다.
- 별도의 runtime enum object가 필요하지 않습니다.
- `MOOD_IDS` 배열로 runtime 목록과 타입을 함께 만들 수 있습니다.
- JSON, DB와 API에 자연스럽게 전달됩니다.

Mood별 metadata가 많아지면 registry object를 추가할 수 있지만 저장 값은 계속 MoodId를
사용합니다.

## Avatar를 파츠 ID로 표현하는 이유

한 장의 완성된 캐릭터 이미지는 구현이 쉽습니다. 하지만 사용자가 옷과 머리를 바꾸려면
가능한 모든 조합의 이미지를 만들어야 합니다.

파츠 구조는 다음처럼 선택을 따로 저장합니다.

```ts
interface AvatarConfig {
  bodyId: string;
  hairId: string;
  topId: string;
  bottomId: string;
  accessoryId: string | null;
}
```

렌더링할 때 같은 canvas 기준에 파츠를 순서대로 겹칩니다.

```text
body
  + hair
  + bottom
  + top
  + accessory
  = 현재 Avatar
```

M0는 `AvatarPartSlot`과 `AvatarConfig` 타입만 정의했습니다. 이미지 registry, layer
renderer와 customization UI는 아직 없습니다. 구조를 준비하는 것과 기능을 미리
구현하는 것을 구분한 결정입니다.

## hair를 하나의 slot으로 둔 이유

기준 설계에는 향후 `hairBack`, `hairFront`처럼 rendering layer를 더 세밀하게 나누는
방향도 있습니다. M0 타입은 사용자 선택 단위인 `hairId`를 하나로 두었습니다.

하나의 Hair item이 renderer 내부에서 back/front 두 asset을 제공할 수 있으므로,
사용자 설정이 rendering 세부사항을 모두 저장할 필요는 없습니다. 실제 asset 제작과
renderer를 구현할 때 layer 모델을 확정합니다.

## Catalog, Ownership, Selection

상품화를 준비할 때 세 개념을 분리해야 합니다.

### Catalog

앱에 어떤 item이 존재하는가?

```text
Night Theme
Cat Mood Pack
Blue Hoodie
```

### Ownership

사용자가 어떤 item을 사용할 권한이 있는가?

```text
Sky Theme 보유
Night Theme 보유
```

### Selection

보유한 것 중 지금 실제로 무엇을 적용했는가?

```text
selectedThemeId = "night"
```

이 세 가지를 합치면 “구매하자마자 원치 않는 테마로 자동 변경”, “판매 종료 후 기존
구매자가 사용하지 못함”, “보유하지 않은 item 적용” 같은 문제가 생깁니다.

M0에서는 이 원칙을 문서에만 남겼습니다. 실제 모델은 상점이 아니라 개인화 기능을
구현할 때 필요한 최소 형태부터 결정합니다.

## 고려한 다른 선택지

### 감정을 이미지 파일명으로 저장

화면 구현은 쉽지만 기록 데이터가 특정 Pack과 asset version에 종속됩니다.

### 감정을 사용자 표시 문구로 저장

`행복`, `Happy`, `기분 좋음`처럼 번역과 문구 변경에 따라 같은 의미가 다른 값이
됩니다. 저장 값과 번역 label을 분리하는 편이 안전합니다.

### Avatar 전체 이미지만 저장

빠른 prototype에는 좋지만 파츠 판매와 조합 확장 시 데이터 구조를 다시 만들어야
합니다. 다만 social share용 snapshot은 나중에 별도 cache로 만들 수 있습니다.

### 지금 Catalog와 결제 모델까지 구현

미래 확장에는 도움이 될 것 같지만 실제 Store 정책과 상품 요구가 없는 상태에서는
추측이 많습니다. 현재는 경계와 용어만 합의하고 구현은 미뤘습니다.

### 자유로운 string으로 Mood 저장

새 감정을 쉽게 추가할 수 있지만 오타와 지원하지 않는 값이 DB에 들어갈 수 있습니다.
좁은 union으로 시작하고 감정 체계를 변경할 때 migration을 명시적으로 검토합니다.

## M1과 M4에서 이어지는 방식

### M1 Diary Core

- DiaryEntry가 `MoodId | null`을 사용
- SQLite에는 semantic string 저장
- 지원하지 않는 mood 값에 대한 validation 결정

### M4 Personalization

- Mood Pack registry 추가
- selectedMoodPackId 저장
- MoodId + selectedMoodPackId를 화면 asset으로 resolve
- Avatar part registry와 renderer 추가
- Theme 선택 persistence 추가

## 직접 확인하기

다음 파일에는 이미지 import가 없어야 합니다.

- `src/features/mood/mood.types.ts`
- `src/features/avatar/avatar.types.ts`

그리고 `package.json`에는 image picker, SQLite, RevenueCat 같은 후속 dependency가 없어야
합니다.

확인 질문:

- MoodId가 label 또는 asset path를 포함하고 있지 않은가?
- AvatarConfig가 화면 좌표나 PNG 경로를 저장하고 있지 않은가?
- 문서가 미래 구조를 설명한다는 이유로 아직 필요 없는 runtime 코드가 추가되지 않았는가?

## 자신의 말로 답해보기

1. 사용자가 Mood Pack을 바꿔도 과거 기록을 다시 표현할 수 있는 이유는 무엇인가요?
2. Catalog와 Selection을 같은 값으로 관리하면 어떤 문제가 생길까요?
3. 미래를 고려하면서도 M0에서 과도한 설계를 피한 부분은 무엇인가요?
