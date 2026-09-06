# Dayweave Design System

## 기본 방향

M0는 차분한 하늘색 계열의 `Sky`를 유일한 실행 테마로 사용합니다. 화면과 공용
컴포넌트는 HEX 값을 직접 알지 않고 semantic token만 참조합니다.

## Token

- Colors: `background`, `surface`, `surfaceSoft`, `textPrimary`, `textSecondary`,
  `primary`, `primarySoft`, `border`, `danger`
- Spacing: `xs`, `sm`, `md`, `lg`, `xl`
- Radius: `sm`, `md`, `lg`, `full`
- Typography: `title`, `heading`, `body`, `label`, `caption`

색상 값은 `src/features/theme/themes/sky.ts` 한 곳에서만 정의합니다. 향후
`warm-paper`, `night`, `mint`가 추가되어도 화면 구조와 접근 가능한 hit area는
바뀌지 않아야 합니다.

## Shared UI

- `AppText`: typography와 semantic text color 적용
- `AppButton`: `primary`, `secondary`, `ghost` variant와 disabled 상태
- `AppCard`: surface, border, radius를 적용한 콘텐츠 컨테이너
- `AppScreen`: safe area, 배경, 화면 여백 책임
- `AppIconButton`: 44x44 hit area와 접근성 label 제공

공용 컴포넌트는 React Native primitive만 감싸며 feature 문구나 비즈니스 규칙을
소유하지 않습니다.

## 화면 규칙

- Route 파일은 feature screen을 export하거나 navigation만 조립합니다.
- feature screen은 token으로 간격과 색상을 정합니다.
- 새로운 색이 필요하면 화면에 HEX를 추가하지 말고 의미를 검토한 뒤 token을
  확장합니다.
- 빈 상태와 준비 중 상태는 실패처럼 표현하지 않고 다음 행동 또는 단계만 설명합니다.
