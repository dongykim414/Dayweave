# M5 Avatar Engine

## 목표

새 파츠를 Catalog와 Registry에 추가하면 renderer와 selector 핵심 코드를 바꾸지 않고
사용자가 owned item을 선택·조합하고 재실행 후 복원할 수 있게 합니다.

## 완료 조건

- semantic AvatarConfig와 Catalog·Ownership·Selection이 분리됩니다.
- Hair/Top/Bottom/Accessory와 None accessory를 즉시 선택할 수 있습니다.
- 동일 좌표계 layer가 명시된 z-order로 렌더됩니다.
- invalid ID는 slot default로 fallback합니다.
- Native single-row SQLite와 Web preview 저장이 동작합니다.
- 실제 Android CASE 1~15는 MVP 직전 통합 QA에서 확인합니다.

## 명시적 제외

Store, 구매, 결제, 통화, 잠금 UI, animation, 얼굴·피부·체형, cloud sync와 AI는 포함하지
않습니다.
