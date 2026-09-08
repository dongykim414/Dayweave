# M2 Photo

## 목표

Today 기록에 선택적 사진 한 장을 연결하고 앱 재실행 뒤에도 Diary와 함께 복원합니다.

## 완료 조건

- Gallery 선택과 권한 거부가 crash 없이 처리됩니다.
- 원본은 긴 변 최대 1600px, JPEG 0.8 display image로 변환됩니다.
- 사진 binary는 documents file system, metadata는 `diary_photos`에 저장됩니다.
- 사진만 있는 Diary도 저장할 수 있습니다.
- 교체·제거·DB 실패 시 기존 사진 유실과 새 orphan 파일을 방지합니다.
- 실제 Android에서 CASE 1~10과 DB/file inspection을 수행합니다.

## 명시적 제외

카메라, 다중 사진, crop UI, Timeline, cloud upload, 공유와 AI vision은 포함하지 않습니다.
