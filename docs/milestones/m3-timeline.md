# M3 Timeline

## 목표

저장된 Diary를 월간 달력으로 탐색하고 날짜 하나를 골라 기록을 다시 봅니다.

## 완료 조건

- 현재 월과 오늘을 local calendar 기준으로 표시합니다.
- 이전·다음 월과 연도 경계를 올바르게 이동합니다.
- 보이는 월만 한 번 조회하며 Photo N+1 query가 없습니다.
- 기록 날짜에는 Photo 또는 Mood marker가 나타납니다.
- 선택 날짜에는 Diary preview 또는 빈 상태가 나타납니다.
- loading, error와 빠른 월 이동의 오래된 응답을 안전하게 처리합니다.
- 실제 Android에서 CASE 1~15를 확인합니다.

## 명시적 제외

Diary 상세·수정·삭제, 검색·필터·통계, year view, cloud sync, 공유와 AI는 포함하지
않습니다.
