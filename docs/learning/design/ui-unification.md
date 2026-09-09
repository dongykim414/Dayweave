# Master reference 기반 UI 통일

## 왜 shared-first인가

화면별로 색, padding과 radius를 맞추면 당장은 비슷해 보여도 새 화면에서 다시
갈라집니다. 이번 작업은 reference의 규칙을 Theme token으로 만들고 AppCard, AppButton,
AppTextInput, AppChip, SectionHeader가 이를 소비하게 한 뒤 화면을 조립했습니다.

## 추출한 규칙

- 거의 흰 blue canvas와 선명하지만 부드러운 primary
- display 28px에서 meta 11px까지의 compact typography hierarchy
- 20px screen inset, 24px section rhythm, 18px card padding
- border보다 낮은 shadow를 우선하는 20px rounded card
- large pill CTA, compact pill action, icon+label chip
- 68px bottom navigation과 선택 상태만 강조하는 icon/label

## 화면 적용

Today는 감정·사진·입력을 한 흐름으로 정리하고, Timeline은 원형 날짜 선택과 compact
record preview를 사용합니다. Detail은 사진과 내용 위계를 강화하고, Avatar와 Me는 soft
hero surface 및 horizontal selector를 공유합니다. 기존 hook, repository, SQLite, Photo와
Avatar domain은 변경하지 않았습니다.

## 의도적으로 하지 않은 것

Reference에 보이는 통계, 태그, 일정, 검색, 설정 기능과 새로운 illustration asset은
추가하지 않았습니다. 디자인을 이유로 존재하지 않는 제품 기능을 흉내 내지 않습니다.

자동 검증은 typecheck, lint, 17 suites·56 tests, 12개 Web route export와 네 탭의 HTTP
200까지 통과했습니다. Browser screenshot은 Codex runtime 경로 오류로 수행하지 못해
실제 기기 육안 검증을 후속 확인으로 남겼습니다.
