# Dayweave Architecture

## 구조

```text
app/                         Expo Router route와 navigation 조립
  (tabs)/                    오늘·타임라인·아바타·내 정보
src/
  database/                  플랫폼별 저장소 lifecycle과 repository 주입
  features/                  제품 도메인별 화면·모델·런타임
    diary/
    mood/
    avatar/
    theme/
    profile/
  shared/components/         feature를 모르는 공용 UI
docs/                        제품과 기술 의사결정
```

빈 폴더를 유지하기 위한 placeholder는 만들지 않습니다. `shared/hooks`,
`shared/utils`, `shared/constants`, `src/lib`는 실제 공유 코드가 생길 때 추가합니다.

## 의존성 방향

```text
app routes → feature screens → feature hook → repository interface
                  ↓                              ↑
              shared UI          platform-specific implementation
                  ↓                              ↑
             theme runtime       DatabaseProvider/repository provider
```

- `app/`은 화면 조립과 navigation만 담당합니다.
- 비즈니스 규칙은 `src/features` 안에 둡니다.
- `shared`는 feature를 import하지 않습니다.
- UI가 향후 SQLite, Supabase, RevenueCat 구현을 직접 호출하지 않습니다.
- 인프라가 추가되면 feature가 정의한 repository interface를 구현합니다.

## M1–M2 Diary Persistence

`ThemeProvider → DatabaseProvider → DiaryRepositoryRuntimeProvider → Router` 순서로 앱을
구성합니다. platform extension 파일이 같은 interface를 각 환경에 맞게 연결합니다.

```text
TodayScreen
  → useTodayDiary
    → DiaryRepository
      ├─ Android/iOS: SQLiteDiaryRepository → diary_entries + diary_photos
      └─ Web: LocalStorageDiaryRepository → browser localStorage
```

- Android/iOS의 DatabaseProvider는 Expo SDK 57 `SQLiteProvider`를 사용하며 `onInit`
  migration이 끝나기 전에는 route를 render하지 않습니다.
- Web은 `expo-sqlite`를 import하지 않아 static rendering과 Web bundling을 유지합니다.
- Web `localStorage` adapter는 M1 preview 전용이며 코드의 `TODO(web-storage)` 주석을
  기준으로 IndexedDB 또는 synced storage로 교체합니다.
- Domain은 camelCase만 사용하고 SQLite row의 snake_case는 mapper에서 변환합니다.
- `entry_date`는 device local calendar의 `YYYY-MM-DD`이고 unique constraint를 가집니다.
- `created_at`, `updated_at`은 UTC ISO timestamp입니다.
- migration은 `PRAGMA user_version`을 기준으로 순서대로 적용하며 현재 version은 4입니다.
- UI component에는 SQL이나 DB column 이름이 노출되지 않습니다.

### M2 Photo lifecycle

```text
PhotoPickerField
  → diaryPhotoService.native
    → Gallery permission / ImagePicker
    → ImageManipulator (긴 변 최대 1600px, JPEG 0.8)
    → cache staging preview
  → useTodayDiary save
    → documents/diary/photos/<photo-id>.jpg 준비
    → DiaryEntry + DiaryPhoto SQLite transaction
    → 성공 후 staging 및 이전 persistent file 정리
    → 실패 시 새 persistent file 보상 삭제
```

- `DiaryPhoto`는 `DiaryEntry`와 분리하며 binary 대신 URI, 크기와 생성 시각만 저장합니다.
- `diary_photos.diary_entry_id`는 UNIQUE foreign key이고 `ON DELETE CASCADE`를 사용해
  DiaryEntry당 0~1장을 보장합니다. `PRAGMA foreign_keys = ON`은 DB 초기화마다 적용합니다.
- 별도 thumbnail을 만들지 않고 display-friendly image 하나를 M3에서도 작은 render
  size로 재사용합니다. 파일 duplication보다 현재 MVP 규모의 단순성을 우선한 결정입니다.
- Web preview에는 영구적인 사진 file adapter를 만들지 않습니다. UI는 사진 기능이
  Android/iOS 대상임을 안내하며 기존 텍스트 diary localStorage 동작은 유지합니다.

## M3 Timeline read flow

```text
TimelineScreen
  → useTimeline(visibleYearMonth, selectedDate)
    → DiaryRepository.listRecordsByDateRange(startInclusive, endExclusive)
      ├─ Android/iOS: diary_entries LEFT JOIN diary_photos (1 query)
      └─ Web: localStorage entries/photos 1회 read 후 range filter
  → CalendarGrid + DiaryPreviewCard
```

- 달력 계산은 UI 밖 pure function이며 device local calendar의 `YYYY-MM-DD`를 사용합니다.
- 월 범위는 `[해당 월 1일, 다음 달 1일)`입니다. 고정 30/31일 계산 없이 연도·윤년
  경계를 `Date`의 local calendar 연산으로 처리합니다.
- 월 이동마다 보이는 한 달만 조회하고, 선택 날짜는 이미 읽은 월 data에서 찾습니다.
  Calendar cell별 query나 사진 file existence check를 하지 않습니다.
- Native는 1:0..1 관계에 맞춰 `LEFT JOIN` 한 번으로 Diary와 Photo metadata를 읽어
  N+1을 방지합니다. `diary_entries.entry_date UNIQUE`와 photo foreign key의 UNIQUE
  index가 이미 있으므로 중복 index는 추가하지 않습니다.
- 빠른 월 이동에서는 request sequence가 지난 응답을 무시해 표시 월과 data가 엇갈리지
  않게 합니다.

## M4 Diary Detail lifecycle

```text
Timeline Preview
  → /diary/[entryId]
    → DiaryDetailScreen
      → useDiaryDetail
        → DiaryRepository.getRecordById
        → saveDiaryRecord → repository.upsertRecord
        → deleteDiaryRecord → repository.deleteById
```

- Route는 param 전달만 하고 SQL과 file API는 feature screen 밖에 둡니다.
- Native ID 조회는 Diary와 Photo를 한 번의 `LEFT JOIN`으로 읽습니다.
- 수정은 M1 `buildDiaryEntry`와 validation을 재사용해 ID·날짜·생성 시각을 보존합니다.
- `diaryRecordLifecycle`은 Today와 Detail의 `새 파일 준비 → DB transaction → 이전 파일
  cleanup` 순서를 하나로 통일합니다. DB 실패 시 새 파일을 보상 삭제하고 기존 파일은
  유지합니다.
- 삭제는 transaction에서 record를 읽고 Diary row를 삭제합니다. `foreign_keys = ON`과
  `ON DELETE CASCADE`가 Photo metadata를 정리하며, 반환된 URI의 실제 파일은 DB 성공
  뒤에 삭제합니다. 파일 cleanup 실패는 기록하고 orphan cleanup은 후속 과제로 둡니다.
- Timeline은 focus될 때 visible month를 다시 조회하므로 전역 cache나 invalidation
  library 없이 수정·삭제 결과를 반영합니다.

## M5 Avatar engine

```text
AvatarScreen
  → useAvatar
    ├─ Catalog → default Ownership → Selection
    └─ AvatarRepository
       ├─ Android/iOS: SQLiteAvatarRepository → avatar_config
       └─ Web: LocalStorageAvatarRepository
  → AvatarRenderer → Avatar Visual Registry
```

- `AvatarConfig`에는 `bodyId`, `hairId`, `topId`, `bottomId`, nullable
  `accessoryId`만 저장합니다. visual color, primitive 또는 미래 asset URI는 저장하지
  않습니다.
- Catalog는 앱에 존재하는 item, Ownership은 사용 가능한 ID 집합, Selection은 현재
  config입니다. M5에서는 모든 기본 Catalog item을 static ownership으로 제공합니다.
- Renderer는 repository와 ownership을 모르며 registry에서 config를 layer 목록으로
  해석합니다. 현재 320×320 code-native placeholder는 같은 registry 자리를 미래의
  static PNG mapping으로 교체할 수 있습니다.
- Native schema v3는 `singleton_key = 'current'` CHECK와 primary key로 현재 config
  한 row만 유지합니다. Web은 localStorage의 단일 key로 같은 contract를 구현합니다.
- 선택은 즉시 preview에 반영되고 write queue가 순서대로 저장합니다. 실패 시 마지막으로
  성공한 persisted config로 rollback해 빠른 연속 선택에도 DB와 UI가 엇갈리지 않습니다.
- 저장 ID가 Catalog에서 사라지면 resolver가 해당 slot만 default로 복구하고, 초기 load가
  복구된 config를 다시 저장합니다.

## M6 Personalization bootstrap

```text
DatabaseProvider
  → PersonalizationRepository → PersonalizationProvider
    → ThemeProvider(selectedThemeId)
      → MoodPackProvider(selectedMoodPackId)
        → Router와 feature screens
```

- Native는 `personalization_settings`의 `singleton_key = 'current'` 한 행에 Theme과 Mood
  Pack semantic ID를 저장하고 Web은 하나의 localStorage key를 사용합니다.
- 초기 설정을 resolve하기 전에는 Router를 렌더하지 않습니다. 잘못된 ID는 Sky와
  Default Pack으로 독립 fallback됩니다.
- 선택은 optimistic apply 후 순차 저장하며 최신 저장 실패 시 마지막 persisted
  settings로 rollback합니다.
- MoodPackProvider만 active pack을 알고 화면은 semantic Mood ID를 그대로 전달합니다.
  Diary row는 pack 변경과 무관합니다.

## 확장 경계

### Mood

기록에는 `happy | calm | neutral | sad | stressed` semantic ID만 저장합니다. 이미지,
이모지, 색상은 선택된 Mood Pack이 해석하므로 과거 데이터와 표현을 분리합니다.

### Theme

`ThemeId → themeRegistry → ThemeDefinition` 순서로 현재 토큰을 해석합니다. M0에는
`sky`만 등록하며 다른 ThemeId는 호환 지점만 정의합니다.

### Avatar

Avatar는 `body`, `hair`, `top`, `bottom`, `accessory` part ID로 구성합니다. Hair
선택 하나가 registry에서 back/front layer로 분리되며 한 장의 합쳐진 캐릭터 이미지로
도메인 모델을 대체하지 않습니다.

### 상품화

향후 Theme Pack, Mood Pack, Avatar item은 카탈로그 정의, 사용자 보유 상태, 현재
선택을 서로 다른 모델로 관리합니다. M0에는 이 모델과 결제를 구현하지 않습니다.
