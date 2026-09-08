# Changelog

Dayweave의 사용자 기능, 구조, 개발 환경에서 의미 있는 변경을 버전별로 기록합니다.
버전 선택 기준과 릴리스 절차는 [`docs/VERSIONING.md`](docs/VERSIONING.md)를 따릅니다.

## [Unreleased]

### Added

- semantic Mood Pack registry와 Default Mood Pack
- 감정, 50자 한 줄과 선택적 긴 글을 작성하는 Today 화면
- local calendar date 기반 DiaryEntry domain과 validation
- SQLiteProvider, `PRAGMA user_version` migration과 DiaryRepository persistence
- 공식 Expo Crypto UUID와 Jest 기반 domain 테스트
- Web preview용 `localStorage` DiaryRepository와 platform-specific provider

### Changed

- M1의 하루 한 기록 규칙을 `UNIQUE(entry_date)`와 upsert로 보호
- PR CI에 자동 테스트 단계를 추가

## [0.1.0] - 2026-09-08

### Added

- Expo Router 기반 `오늘`, `타임라인`, `아바타`, `내 정보` 4탭 앱 셸
- Sky Theme, semantic design token과 `ThemeProvider`
- `AppText`, `AppButton`, `AppCard`, `AppScreen`, `AppIconButton` 공용 UI
- 표현 자산과 분리된 semantic Mood ID와 파츠형 Avatar 타입
- 제품, 디자인, 아키텍처, 개발, 로드맵과 Harness 관찰 문서
- pnpm 기반 재현 가능한 설치와 PR 검증 CI
- 매주 수요일 release branch를 만드는 Weekly Release Cut 자동화

### Changed

- Next.js 웹 프로젝트에서 React Native + Expo 모바일 앱 기반으로 전환
- 패키지 관리자를 npm에서 pnpm 11로 통일
- 제품 기준을 일정/Todo 초안에서 개인 모바일 다이어리의 M0 Foundation으로 정리

### Known limitations

- 실제 일기 생성·조회·수정·삭제와 SQLite 저장은 아직 제공하지 않음
- 사진 선택, Mood 자산, Avatar 렌더링·꾸미기는 아직 제공하지 않음
- 로그인, 클라우드 동기화, 결제, AI, 일정·SNS·기기 연결과 공유는 아직 제공하지 않음
- Android 실제 기기와 iOS 네이티브 빌드는 이번 단계에서 검증하지 않음

[Unreleased]: https://github.com/dongykim414/Dayweave/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/dongykim414/Dayweave/releases/tag/v0.1.0
