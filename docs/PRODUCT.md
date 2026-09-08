# Dayweave Product

## 한 문장 정의

Dayweave는 10~30초 안에 감정과 한 줄, 선택적 사진으로 오늘을 남기고 원할 때 긴
글로 깊이를 더하는 개인 모바일 다이어리입니다.

## 해결하려는 문제

- 긴 글만 요구하는 다이어리는 기록 피로도가 높습니다.
- 감정만 고르는 앱은 자세히 남기고 싶은 날의 표현력이 부족합니다.
- 시각 자산과 기록 데이터가 결합되면 테마와 감정팩 확장이 어려워집니다.

## 제품 원칙

- **Capture Fast**: 기본 기록은 감정 + 한 줄 + 선택적 사진입니다.
- **Depth on Demand**: 긴 글은 기본 흐름을 막지 않는 선택적 확장입니다.
- **Data is not Presentation**: 감정 의미와 표현 자산을 분리합니다.
- **Local First**: 초기에는 로그인 없이 시작하고 동기화는 후속으로 둡니다.
- **MVP Before Store**: 상품 구조는 고려하되 상점과 결제는 핵심 기록 경험 뒤에 둡니다.

## 제품 MVP

MVP가 완성되면 사용자는 오늘의 감정, 한 줄, 선택적 사진을 기록하고 필요한 날에는
긴 글을 추가하며, 타임라인에서 날짜별 기록을 확인하고 수정·삭제할 수 있습니다.
기본 Sky Theme, 기본 Mood Pack과 파츠형 Avatar 구조가 동작해야 합니다.

## 현재 구현 범위: M4 Diary Detail

- Expo Router 기반 4탭 셸
- Sky Theme, ThemeProvider, theme registry
- 공용 UI primitive
- semantic Mood ID, Default Mood Pack과 MoodSelector
- 감정, 50자 한 줄과 선택적 긴 글로 구성된 Today 작성 흐름
- local calendar date 기준 하루 한 DiaryEntry
- SQLite migration, repository와 앱 재실행 후 local persistence
- Gallery에서 선택한 사진 0~1장, display image 처리와 앱 전용 local persistence
- local-calendar 월간 달력과 이전·다음 월 탐색
- 기록 날짜의 Photo 또는 Mood marker와 선택 날짜 read-only preview
- Timeline Preview에서 Entry ID 기반 상세 화면 이동
- 전체 Diary 조회, Mood·텍스트·사진 수정과 확인 후 삭제
- 수정·삭제 후 Timeline focus reload
- domain test, lint, typecheck와 Expo Web export

## M4에서 하지 않는 것

카메라 촬영·다중 사진·cloud upload, 날짜 변경, 검색·필터·통계·공유, 실제 Avatar 커스터마이징, Theme 또는
Mood Pack 선택, Supabase, 로그인, Zustand, TanStack Query, RevenueCat, 상점·결제,
AI, 일정·SNS 연동, 공유와 푸시 알림은 구현하지 않습니다.

## 장기 확장

Theme Pack, Mood Pack과 Avatar 파츠를 `Catalog → Ownership → Selection`으로
분리합니다. 이후 클라우드 백업, 여러 기기 동기화, 선택 일정 공유, SNS·기기 연결,
AI 보조 기능을 독립 마일스톤으로 검증합니다.
