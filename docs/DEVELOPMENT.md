# Dayweave Development

## 환경

- Node.js 22
- pnpm 11 (`package.json`의 `packageManager`가 기준)
- Expo SDK 57
- TypeScript strict mode

`pnpm-workspace.yaml`은 자동 peer 설치를 끕니다. Expo Router의 사용하지 않는 Drawer
경로가 요구하는 Reanimated와 Gesture Handler는 M0에 설치하지 않으며, 실제 Drawer나
animation을 도입하는 작업에서 Expo 호환 버전으로 명시적으로 추가합니다.

## 설치와 실행

```bash
pnpm install
pnpm dev
```

플랫폼별 실행은 `pnpm android`, `pnpm ios`, `pnpm web`을 사용합니다. Windows에서
iOS 시뮬레이터 실행은 지원하지 않으므로 실제 iPhone의 Expo Go 또는 macOS CI/장비로
검증합니다.

## 변경 전 확인

1. `AGENTS.md`와 관련 `docs/`를 읽습니다.
2. 한 PR의 범위와 제외 범위를 적습니다.
3. 기존에 같은 책임을 가진 파일을 먼저 찾습니다.
4. route에는 navigation과 screen 조립만 둡니다.

## 검증

```bash
pnpm version:check
pnpm deps:check
pnpm lint
pnpm test
pnpm typecheck
pnpm build:web
```

M1부터 Jest와 `jest-expo`로 순수 domain, 날짜, Mood registry와 DB row mapping을
테스트합니다. Native SQLite integration은 실제 Android/iOS 기기나 emulator에서
검증하며 대량의 native mock으로 통과를 흉내 내지 않습니다. UI 변경 PR은 가능한
플랫폼의 스크린샷 또는 실행 증거를 첨부합니다.

## 저장소와 플랫폼별 개발

- Android/iOS DB 이름: `dayweave.db`
- Android/iOS schema version: `PRAGMA user_version = 3`
- Expo CLI에서 `Shift + M` 후 expo-sqlite inspector를 선택하면 연결된 앱 DB를
  확인할 수 있습니다.
- Web은 `LocalStorageDiaryRepository`를 사용합니다. 이는 브라우저 미리보기용
  persistence이며 Web Browser 데이터를 지우면 함께 삭제됩니다.
- `LocalStorageDiaryRepository`의 `TODO(web-storage)` 주석은 Web이 정식 제품 대상이
  될 때 IndexedDB 또는 sync storage로 교체할 위치입니다.
- `pnpm web`은 static rendering 설정을 유지한 상태로 Web UI를 확인합니다. Android/iOS
  persistence 합격 기준은 실제 SQLite database입니다.
- Native 사진은 cache staging 후 `document/diary/photos/<UUID>.jpg`로 저장합니다.
  사진 선택·재실행 복원·교체·제거의 최종 합격 기준은 실제 Android 기기 또는
  emulator에서 DB row와 파일 개수를 함께 확인하는 것입니다.
- Web preview에서는 M2 사진 선택을 지원하지 않으며 base64나 picker 임시 URI를
  localStorage에 저장하지 않습니다.
- Timeline 월 조회는 `>= YYYY-MM-01`과 `< 다음 달 YYYY-MM-01` 범위를 사용합니다.
  Native는 한 번의 `LEFT JOIN`, Web preview는 한 번씩 읽은 entry/photo collection의
  범위 filter로 같은 repository contract를 구현합니다.
- 달력·월 경계·윤년·범위 query는 `pnpm test`로 검증합니다. 실제 사진 marker,
  작은 화면과 앱 재실행은 Android 기기 또는 emulator에서 별도로 확인합니다.
- Detail은 `/diary/<entry-id>` route를 사용합니다. ID 조회·수정·삭제는 repository를
  통해 실행하며 screen에서 SQL이나 file system을 직접 호출하지 않습니다.
- Photo 교체·제거는 Today와 Detail이 같은 `diaryRecordLifecycle`을 사용합니다. 실제
  Android에서는 수정 전후 DB row 수와 `documents/diary/photos` 파일 수를 함께
  확인해야 합니다.
- 삭제 검증은 Diary row와 cascade된 Photo row가 사라진 뒤 사진 파일도 정리되는지
  확인합니다. DB 성공 후 파일 cleanup 실패는 orphan 파일을 남길 수 있으며 현재는
  오류 기록만 하고 background cleanup은 구현하지 않습니다.
- Avatar selection은 `avatar_config`의 `singleton_key = 'current'` 한 row로 저장합니다.
  Web preview는 `dayweave:avatar-config:v1` localStorage key를 사용합니다.
- 새 Avatar item은 domain ID, Catalog definition과 visual registry만 추가합니다.
  screen이나 renderer에 item ID 조건문을 추가하지 않습니다.
- Placeholder/최종 asset 제작 규칙과 layer order는 `AVATAR_ASSET_GUIDE.md`를 따릅니다.
- 실제 Android DB row·재실행·layer 육안 검증은 요청에 따라 MVP 통합 QA 때 수행합니다.

## PR과 Release

일반 PR은 `main`을 대상으로 하고 squash merge합니다. 선행 PR이 아직 merge되지
않은 의존 작업은 일시적으로 선행 branch를 base로 하는 stacked PR을 허용하며,
선행 PR merge 직후 `main`으로 rebase 또는 retarget합니다.

기능·아키텍처·도구 선택이 있는 PR은 `docs/learning`의 관련 문서를 추가하거나
갱신합니다. 무엇을 했는지뿐 아니라 선택 이유, 대안, 비용과 직접 확인 방법을 남깁니다.

상세한 branch 규칙, CI gate와 주간 release cut은
[`process/development-and-release.md`](process/development-and-release.md)에 있습니다.
Version을 언제 올리고 changelog, tag와 GitHub Release를 어떻게 연결하는지는
[`VERSIONING.md`](VERSIONING.md)를 따릅니다.
