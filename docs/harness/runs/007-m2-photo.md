# Run 007: M2 Photo

## 기본 정보

- 날짜: 2026-09-09
- Harness 버전: M2 Photo rules
- 기준 커밋: `b12de64`
- 작업 요청: 사진 선택부터 로컬 저장, Diary 연결, 복원과 교체·제거 정리까지 구현

## 성공 조건

- [x] 사진 domain과 Diary당 0~1장 DB 제약
- [x] Gallery 선택, resize/compress와 저장 전 preview
- [x] Diary + Photo transaction과 실패 보상 cleanup
- [x] 사진만 있는 Diary validation
- [ ] 실제 Android 재실행·DB row·파일 lifecycle 검증

## 관찰 기록

### 요청 해석

- 카메라·다중 사진·Timeline을 제외하고 Gallery 사진 한 장의 전체 local lifecycle을
  독립적으로 완성하는 작업으로 해석했습니다.

### 탐색

| 순서 | 확인 대상 | 확인 이유 | 발견한 사실 |
| --- | --- | --- | --- |
| 1 | Diary model/repository | 확장 경계 확인 | DiaryEntry와 UI가 SQLite에서 분리됨 |
| 2 | migration | 데이터 보존 방식 확인 | v1, WAL, foreign_keys ON 사용 |
| 3 | Today hook/screen | form 연결 지점 확인 | hook이 load/draft/save를 소유함 |
| 4 | Expo SDK 57 package types | 최신 API 확인 | object File API와 contextual manipulator 사용 가능 |

### 계획

1. Photo domain과 v2 schema를 추가합니다.
2. cache staging과 documents persistence service를 구현합니다.
3. Today form에 선택·교체·제거·저장을 연결합니다.
4. pure logic과 adapter 테스트 후 Expo build를 검증합니다.

### 구현

| 파일 | 변경 목적 |
| --- | --- |
| `src/features/diary/model/diaryPhoto.types.ts` | Photo metadata와 form 상태 정의 |
| `src/features/diary/services/diaryPhotoService.native.ts` | picker, processing, file lifecycle |
| `src/database/migrateDatabase.ts` | data-preserving v2 photo table migration |
| `src/features/diary/data/*Repository.ts` | Diary+Photo read/write 경계 |
| `src/features/diary/hooks/useTodayDiary.ts` | save와 보상 cleanup orchestration |
| `src/features/diary/components/PhotoPickerField.tsx` | Today photo UX |

### 검증

| 명령 또는 확인 | 결과 | 근거 또는 오류 |
| --- | --- | --- |
| `pnpm lint` | PASS | ESLint 오류 없음 |
| `pnpm test` | PASS | 8 suites, 23 tests |
| `pnpm typecheck` | PASS | nullable narrowing 수정 후 통과 |
| `pnpm build:web` | PASS | static routes 11개 export |
| Android bundle | PASS (제한) | Hermes 실행은 환경 EPERM, `--no-bytecode`로 1,302 modules bundle 성공 |
| Expo dev server | PASS (제한) | offline Metro 8083 시작, DevTools spawn EPERM은 앱 server와 별개 |
| Android manual CASE 1~10 | NOT TESTED | 연결된 Android 기기/emulator 없음 |

### 실패 대응

- 실패: Expo dependency cache EPERM, nullable Photo 타입 오류
- 직접적인 단서: `.expo/native-modules-cache` 쓰기 거부, TS2345
- 대응: 필요한 cache 경로만 허용하고 null 존재 조건을 명시
- 재검증: dependency 설치와 typecheck 성공

## 완료 판단

- 완료 근거: version/dependency/lint/test/typecheck/Web 및 Android JS bundle 검증 통과
- 실행하지 않은 검증: 실제 Android DB/file inspection
- 남은 위험: Native picker 및 파일 API는 실제 기기에서 최종 확인 필요

## 하네스 후보

- 반복 여부를 더 관찰할 문제: Native file cleanup 실패의 재시도 필요성
- AGENTS.md 후보 규칙: 사진 binary와 metadata 저장 분리
- 테스트 또는 자동화 후보: Android migration integration test

## 다음 비교 작업

- M3 Timeline에서 display image 한 개 전략의 월간 렌더 성능을 확인합니다.
