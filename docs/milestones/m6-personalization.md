# M6 Personalization

## 목표

Theme과 Mood Pack을 Catalog·Ownership·Selection으로 분리하고, Me에서 선택하면 앱 전체
표현이 즉시 바뀌며 재실행 후 복원되는 구조를 만듭니다.

## 완료 조건

- Sky, Warm Paper, Night와 Default, Cat을 보유 항목으로 선택할 수 있습니다.
- ThemeProvider와 MoodPackProvider가 모든 화면에 active selection을 제공합니다.
- Me에서 Avatar 요약과 Avatar 탭 진입을 제공합니다.
- Native SQLite v4와 Web localStorage가 한 설정만 유지합니다.
- invalid selection은 Sky와 Default로 fallback합니다.

Android 수동 CASE 1~20은 MVP 통합 QA에서 수행합니다.
