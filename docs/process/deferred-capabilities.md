# Deferred Development and Release Capabilities

이 문서는 최종 모바일 Release Process에는 필요하지만 Dayweave의 현재 MVP 시작
단계에서는 아직 실행하지 않는 항목을 보존합니다. 조건을 충족할 때 한 항목씩 활성
프로세스로 옮깁니다.

| 우선순위 | 보류 항목 | 도입 조건 | 예정 방식 |
| --- | --- | --- | --- |
| 1 | Unit·Component Test | 첫 일정 도메인 로직 또는 상태 컴포넌트 구현 | Jest + React Native Testing Library를 PR Gate에 추가 |
| 2 | PR E2E Smoke | 일정 생성·조회·수정 핵심 흐름 안정화 | Maestro로 Android 우선 Critical Path 실행 |
| 3 | 조건부 Native Build | 네이티브 모듈, plugin, `app.json` 또는 EAS 설정 변경 | 변경 경로·fingerprint에 따라 Android/iOS EAS Build |
| 4 | Main Regression | 여러 기능 간 통합 테스트가 생김 | `main` merge 후 또는 nightly 실행 |
| 5 | PR Preview | `expo-updates`와 Development Build 구성 | EAS Update 링크·QR을 PR에 자동 첨부 |
| 6 | Release Validation | TestFlight·Play 테스트 계정 준비 | Full E2E, exploratory QA, release checklist |
| 7 | Real Device Matrix | 지원 OS 범위와 사용 기기 데이터 확보 | 대표 iPhone·Galaxy·Pixel 조합부터 시작 |
| 8 | Build Once, Promote | Store 첫 배포 준비 | 검증한 production RC를 TestFlight·Play track에서 그대로 승격 |
| 9 | OTA Release Model | EAS Update 사용 결정 | preview·staging·production channel과 runtimeVersion 정책 |
| 10 | Storybook·Visual Regression | 재사용 컴포넌트와 상태 조합 증가 | 컴포넌트 문서·접근성·시각 회귀 검사 |
| 11 | Monitoring·Gradual Rollout | Production 사용자 발생 | crash, ANR, 오류율, 성능을 확인하며 플랫폼별 단계 배포 |
| 12 | Merge Queue | 동시에 merge되는 PR과 개발자가 증가 | 최신 `main` 조합으로 필수 CI를 재검증 |

## 활성화 원칙

- 도구를 먼저 설치하지 않고 실제 위험과 반복 비용이 나타났을 때 도입합니다.
- 한 번에 한 계층을 추가하고 CI 시간, 실패율, 발견한 결함을 기록합니다.
- 빠른 검사는 PR에, 느리고 비싼 검사는 `main`·Release에 가깝게 배치합니다.
- 활성화한 항목은 이 표에서 제거하고 `development-and-release.md`, `AGENTS.md`, CI와
  Harness Run을 함께 갱신합니다.
