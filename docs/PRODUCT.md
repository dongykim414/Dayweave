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

## 현재 M0 범위

- Expo Router 기반 4탭 셸
- Sky Theme, ThemeProvider, theme registry
- 공용 UI primitive
- semantic Mood ID와 Avatar part 타입
- 제품·디자인·아키텍처·개발·로드맵 문서
- lint, typecheck, Expo 실행 기반

## M0에서 하지 않는 것

SQLite, 다이어리 CRUD, 사진 선택·업로드, MoodSelector와 이미지 자산, 실제 Avatar
커스터마이징, Supabase, 로그인, Zustand, TanStack Query, RevenueCat, 상점·결제,
AI, 캘린더·SNS 연동, 공유, 푸시 알림은 구현하지 않습니다.

## 장기 확장

Theme Pack, Mood Pack과 Avatar 파츠를 `Catalog → Ownership → Selection`으로
분리합니다. 이후 클라우드 백업, 여러 기기 동기화, 선택 일정 공유, SNS·기기 연결,
AI 보조 기능을 독립 마일스톤으로 검증합니다.
