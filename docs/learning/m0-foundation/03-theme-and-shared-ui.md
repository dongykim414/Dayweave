# 03. Theme 시스템과 공용 UI

## 문제: 화면마다 색상을 직접 쓰면 무엇이 어려운가?

기존 단일 화면은 다음처럼 StyleSheet 안에서 색상 값을 직접 사용했습니다.

```tsx
backgroundColor: "#F6F4EF"
color: "#17201C"
```

한 화면만 있을 때는 가장 빠른 방법입니다. 하지만 화면이 늘고 Sky, Night, Mint 같은
테마가 생기면 모든 파일에서 같은 색을 찾아 바꿔야 합니다. 어떤 파란색이 “주요 행동”을
뜻하고 어떤 파란색이 단순 장식인지도 코드만 보고 알기 어렵습니다.

그래서 M0에서는 색상 값 대신 색상의 **역할**을 이름으로 사용합니다.

```tsx
theme.colors.background
theme.colors.textPrimary
theme.colors.primary
theme.colors.danger
```

이것이 semantic token입니다. `primary`는 특정 HEX가 아니라 “제품에서 가장 중요한
행동과 강조에 쓰는 색”이라는 의미입니다.

## ThemeDefinition

`src/features/theme/theme.types.ts`는 모든 테마가 제공해야 하는 계약입니다.

```ts
interface ThemeDefinition {
  id: ThemeId;
  name: string;
  colors: ThemeColors;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  typography: ThemeTypography;
}
```

이 타입 덕분에 새 테마가 `danger`나 `textSecondary`를 빼먹으면 TypeScript가 오류를
발견합니다. 화면은 어떤 테마가 선택되더라도 같은 token이 존재한다고 믿을 수 있습니다.

## Sky Theme

실제 HEX 값은 `src/features/theme/themes/sky.ts` 한 곳에만 있습니다.

- 밝은 blue-gray 배경
- white surface
- 진한 blue primary
- 본문과 보조 본문의 명확한 대비
- `xs`부터 `xl`까지 반복 가능한 간격
- card와 pill에 사용할 radius
- title부터 caption까지 typography 단계

M0에서 실제로 등록한 테마는 Sky 하나뿐입니다. `ThemeId`에는 미래 ID를 정의했지만
존재하지 않는 테마를 가짜 데이터로 만들지는 않았습니다.

## Primary 색상을 더 진하게 조정한 이유

초기 powder blue 후보 `#5F9FD3` 위에 흰 글자를 쓰면 계산된 명암비가 약 2.84:1로
일반 텍스트의 WCAG AA 기준에 부족했습니다. `#3F79A8`로 조정하면 약 4.65:1이 되어
흰 버튼 글자의 가독성이 좋아집니다.

이 결정에서 배울 점은 “예쁜 색상”과 “읽을 수 있는 색상”을 함께 검증해야 한다는
것입니다. 테마를 추가할 때도 primary/background 조합만 보는 것이 아니라 실제로
위에 올라가는 text token과의 대비를 확인해야 합니다.

## Theme Registry

`themeRegistry`는 Theme ID와 실제 ThemeDefinition을 연결합니다.

```text
"sky"
  ↓
themeRegistry
  ↓
skyTheme
  ↓
colors / spacing / radius / typography
```

`resolveTheme()`은 ID를 받아 테마를 반환하고, 아직 등록되지 않은 ID라면 Sky를 안전한
기본값으로 사용합니다.

Registry가 필요한 이유는 화면이 `skyTheme` 파일을 직접 import하지 않게 하기
위해서입니다. 화면은 현재 테마만 알면 되고, 어떤 테마들이 존재하는지는 registry가
관리합니다.

## ThemeProvider

ThemeProvider는 앱 트리 상단에서 현재 테마를 공급합니다.

```text
RootLayout
└─ ThemeProvider
   └─ Router / Screens
      └─ useTheme()
```

화면이나 AppButton은 `useTheme()`으로 현재 토큰을 읽습니다. M0는 설정 저장 기능이
없으므로 `DEFAULT_THEME_ID`인 Sky만 제공합니다. M4에서 선택 기능을 붙일 때 Provider의
입력과 persistence를 확장하면 되고, feature screen의 색상 코드는 바꿀 필요가 없습니다.

ThemeProvider 밖에서 `useTheme()`을 호출하면 명확한 오류를 던지도록 했습니다. 조용히
undefined가 퍼지게 두는 것보다 설정 누락을 개발 중에 바로 발견하기 좋습니다.

## 공용 UI Primitive

Primitive는 제품 화면을 만들 때 반복되는 가장 작은 UI 규칙입니다.

### AppText

- title, heading, body, label, caption 적용
- semantic text color 적용
- React Native Text의 나머지 props는 그대로 전달

### AppButton

- `label`, `onPress`, `disabled`, `variant` 제공
- primary, secondary, ghost 스타일 제공
- pressed와 disabled feedback 제공
- 최소 높이를 token 조합으로 유지

### AppCard

- surface, border, radius, padding을 통일
- 카드 안의 실제 제품 내용은 소유하지 않음

### AppScreen

- Safe Area 처리
- 전체 화면 배경과 좌우·상하 기본 여백 적용
- 각 screen이 같은 시작 위치와 여백을 갖게 함

### AppIconButton

- 44x44 터치 영역
- `accessibilityLabel` 필수
- icon 자체는 호출한 feature가 전달

`AppIconButton`이 특정 icon library에 의존하지 않는 이유는 M0에서 라이브러리 선택을
서두르지 않기 위해서입니다.

## Shared UI가 하지 않는 일

AppButton은 다음 내용을 알면 안 됩니다.

- 다이어리를 저장하는 방법
- 저장 성공 문구
- SQLite table 이름
- 로그인 여부
- Mood 이미지 경로

공용 UI는 모양과 기본 상호작용만 책임집니다. 제품 의미와 상태는 feature가 소유해야
다른 화면에서도 안전하게 재사용할 수 있습니다.

## 고려한 다른 선택지

### 화면별 StyleSheet와 HEX 유지

초기 속도는 가장 빠릅니다. 하지만 테마 교체와 일관성 검사가 파일 수에 비례해
어려워집니다. Theme Pack이 장기 제품 방향이므로 M0에서 token 경계를 만들었습니다.

### Tailwind 계열 도구 도입

빠른 조합과 익숙한 utility class가 장점입니다. 하지만 새 의존성, 별도 설정과 class
규칙이 생깁니다. M0는 React Native primitive와 StyleSheet만으로 요구사항을 충족할 수
있어 도입하지 않았습니다.

### 완성형 UI library 도입

접근성과 다양한 컴포넌트를 빠르게 얻을 수 있습니다. 반면 Dayweave의 Theme Pack
구조가 library theme 모델에 종속될 수 있습니다. 컴포넌트 요구가 충분히 쌓인 뒤 비교하는
편이 합리적입니다.

### Zustand로 테마 상태 관리

전역 상태에 편리하지만 M0에는 Sky 하나뿐입니다. Context로 충분한 문제에 상태
library를 추가하면 범위와 학습 비용만 늘어납니다. 실제 사용자 선택과 여러 전역 상태가
생기는 M4에서 다시 판단합니다.

### 모든 스타일을 한 파일에 모으기

색상 값은 한 곳에 두되 component layout까지 거대한 theme 파일에 넣으면 변경 영향이
커집니다. token은 theme이, 각 component의 구조적 스타일은 component가 소유하도록
나눴습니다.

## 직접 확인하기

다음 검색 결과가 Sky Theme 파일만 가리켜야 합니다.

```bash
rg "#[0-9A-Fa-f]{3,8}" app src
```

그다음 아래 흐름을 따라가 보세요.

1. `app/_layout.tsx`에서 ThemeProvider 확인
2. `ThemeProvider.tsx`에서 현재 theme 결정 방식 확인
3. `themeRegistry.ts`에서 ID → Theme 연결 확인
4. `themes/sky.ts`에서 실제 token 확인
5. `TodayScreen.tsx`와 `AppButton.tsx`에서 token 사용 확인

## 자신의 말로 답해보기

1. semantic token과 HEX 값은 무엇이 다른가요?
2. 새 Night Theme를 추가할 때 TodayScreen을 수정하지 않아도 되는 이유는 무엇인가요?
3. AppButton에 “일기 저장” 로직을 넣으면 어떤 문제가 생기나요?
