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

## Diary Photo

- 사진이 없으면 보조 버튼 하나로 Gallery 선택을 시작합니다.
- 사진이 있으면 4:3 display preview 아래에 교체와 제거 동작을 나란히 둡니다.
- 제거는 저장 전 form 상태만 바꾸며, 기존 파일 삭제는 저장 성공 뒤에 확정합니다.
- 원본 비율은 처리 단계에서 유지하고 화면에서는 `cover`로 일관된 preview 영역을
  제공합니다. 누락 파일은 crash 대신 `surfaceSoft` 안내 영역으로 표시합니다.

## Timeline Calendar

- 달력은 일요일부터 토요일까지 7열이고, 현재 월에 따라 5주 또는 6주를 표시합니다.
- 선택 날짜는 `primary`, 오늘은 `primarySoft`, 다른 달 overflow 날짜는
  `textSecondary`를 사용해 기존 semantic token만으로 구분합니다.
- 한 셀의 기록 표시는 `사진 thumbnail → Mood visual → record dot` 순서로 하나만
  노출합니다. 사진과 감정과 점을 동시에 보여 주지 않아 작은 화면의 밀도를 낮춥니다.
- Timeline 사진은 M2 display image를 작은 render size와 `cover`로 재사용합니다.
  Timeline만을 위한 중복 image pipeline은 만들지 않습니다.
- 선택 날짜 preview는 날짜, Mood label, 선택적 사진, 한 줄과 최대 3줄 본문을 보여
  주며 상세 보기 버튼으로 stable-ID route를 엽니다.

## Diary Detail

- View mode는 날짜, 선택적 사진, Mood, 한 줄과 전체 본문을 여백이 넓은 한 흐름으로
  표시합니다. 없는 영역을 빈 placeholder로 유지하지 않습니다.
- Edit mode는 Today와 같은 Mood·사진·한 줄·긴 글 field를 사용하며 저장과 취소를
  명확히 분리합니다.
- 삭제는 primary CTA와 분리된 `danger` outline button으로 화면 하단에 둡니다.
- 삭제와 미저장 이탈은 Native `Alert` 확인을 거치며 screen reader에도 동작의 의미가
  전달되는 label을 사용합니다.
- 작은 화면에서 상세와 editor 전체에 접근할 수 있도록 하나의 세로 ScrollView와
  `KeyboardAvoidingView`를 사용합니다.

## Avatar

- Preview는 고정 비율 320×320 좌표계의 파츠를 한 화면에 합성합니다.
- layer 순서는 `hairBack → body → bottom → top → hairFront → accessory`입니다.
- 카테고리는 가로 scroll pill, owned item은 가로 card로 표시해 작은 화면에서도
  Preview와 selector를 세로로 탐색할 수 있게 합니다.
- 선택 card는 `primarySoft` 배경과 `primary` border를 사용하며 UI에 직접 HEX를
  작성하지 않습니다. 코드 기반 placeholder의 색은 asset 역할을 하는 registry 한 곳에
  정의합니다.
- 현재 placeholder는 구조 검증용이며 최종 캐릭터 디자인으로 간주하지 않습니다.
