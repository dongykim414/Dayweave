# M4 Diary Detail

## 목표

Timeline에서 Diary를 열어 전체 내용을 보고, 기존 데이터를 안전하게 수정하거나
확인 후 삭제합니다.

## 완료 조건

- Entry ID route로 Diary와 선택적 Photo를 한 번에 조회합니다.
- Mood·한 줄·긴 글·사진 수정이 기존 validation과 lifecycle을 사용합니다.
- 취소와 back에서 미저장 변경을 확인하고 prepared file을 정리합니다.
- 삭제는 DB 성공 뒤 사진 파일을 정리하고 Timeline으로 복귀합니다.
- Timeline이 복귀 시 보이는 월을 다시 읽어 최신 상태를 표시합니다.
- 실제 Android에서 CASE 1~20과 DB/file inspection을 수행합니다.

## 명시적 제외

날짜 변경, 다중 사진, 검색·태그·공유·export, Cloud Sync, 상품과 AI는 포함하지 않습니다.
