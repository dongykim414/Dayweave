# Avatar Asset Guide

## 목적과 현재 상태

M5는 320×320 좌표계의 code-native placeholder로 layer engine을 검증합니다. 이는 최종
디자인 asset이 아닙니다. 최종 PNG로 교체할 때도 아래 좌표·이름·순서를 유지합니다.

## Canvas와 정렬

- 기준 canvas: 320×320 px 또는 정확히 같은 비율의 배수(예: 640×640)
- 배경: 완전 투명
- origin: 좌상단 `(0, 0)`
- 모든 part는 body와 동일한 전체 canvas로 export
- body 중심선: x=160
- 개별 item 때문에 screen/renderer에 top/left 보정 조건을 추가하지 않음

Hair는 사용자 선택 ID 하나를 유지하되 필요하면 같은 canvas의 `hairBack`과
`hairFront` 두 파일로 export합니다. Top·Bottom·Accessory도 body 위치를 포함한 전체
canvas 기준이어야 합니다.

## Export와 이름

- Format: transparent PNG
- Color space: sRGB
- 권장 크기: 640×640 source, 앱용 크기는 실제 성능 측정 뒤 결정
- 파일명: `<semantic-item-id>-<layer>.png`
- 예: `hair_soft_bob-back.png`, `hair_soft_bob-front.png`
- runtime 문자열을 사용한 dynamic `require()` 금지; registry에서 static mapping

## Z-order

1. `hairBack`
2. `body`
3. `bottom`
4. `top`
5. `hairFront`
6. `accessory`

새 item은 Catalog와 visual registry에 추가합니다. 구매 가격·상품 ID·보유 상태는 asset
definition에 넣지 않고 별도 Store/Catalog metadata와 Ownership에서 관리합니다.
