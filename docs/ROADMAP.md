# Dayweave Roadmap

## M0 Foundation — v0.1.0 완료

문서, 4탭 셸, ThemeProvider, Sky Theme, 공용 UI, strict typecheck와 CI를 준비합니다.
완료 기준은 네 탭이 같은 design token으로 실행되고 범위 밖 기능이 없는 것입니다.

## M1 Diary Core — 완료

Semantic Mood와 Default Pack, Today의 감정·한 줄·긴 글 form, 날짜 정책, SQLite
migration과 repository를 구현합니다. 로컬에서 하루 기록을 저장하고 다시 조회하는
것이 완료 기준입니다. 상세 내용은
[`milestones/m1-diary-core.md`](milestones/m1-diary-core.md)를 따릅니다.

## M2 Photo and Today Polish — 구현 완료, 실제 기기 검증 필요

선택적 사진 0~1장의 Gallery 선택, display image 처리, SQLite metadata, 앱 전용 파일
저장과 교체·제거 lifecycle을 구현합니다. 실제 Android에서 재실행 복원과 DB/file
inspection을 통과하면 단계가 완료됩니다.

## M3 Timeline

월간 조회, 달력, 날짜별 기록 카드, 상세·수정·삭제 흐름을 구현합니다.

## M4 Personalization

Theme, Mood Pack, 기본 Avatar 파츠의 선택과 persistence를 구현합니다.

## M5 Quality

단위·컴포넌트·핵심 E2E, 오류 처리, 접근성, 사진 성능과 실제 기기 QA를 강화합니다.

## M6 이후

Supabase 기반 백업·동기화, Catalog/Ownership/Selection, RevenueCat 결제, 일정·SNS·기기
연동, 선택 일정 공유, AI 보조 기능을 각각 독립적인 검증 단위로 진행합니다.

현재 milestone보다 뒤의 기능은 선행 구조를 고려할 수는 있지만 코드로 미리 구현하지
않습니다.
