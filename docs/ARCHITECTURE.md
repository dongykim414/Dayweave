# Dayweave Architecture

## 구조

```text
app/                         Expo Router route와 navigation 조립
  (tabs)/                    오늘·타임라인·아바타·내 정보
src/
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
app routes → feature screens → shared UI / feature model
                                 ↓
                          theme runtime
```

- `app/`은 화면 조립과 navigation만 담당합니다.
- 비즈니스 규칙은 `src/features` 안에 둡니다.
- `shared`는 feature를 import하지 않습니다.
- UI가 향후 SQLite, Supabase, RevenueCat 구현을 직접 호출하지 않습니다.
- 인프라가 추가되면 feature가 정의한 repository interface를 구현합니다.

## 확장 경계

### Mood

기록에는 `happy | calm | neutral | sad | stressed` semantic ID만 저장합니다. 이미지,
이모지, 색상은 선택된 Mood Pack이 해석하므로 과거 데이터와 표현을 분리합니다.

### Theme

`ThemeId → themeRegistry → ThemeDefinition` 순서로 현재 토큰을 해석합니다. M0에는
`sky`만 등록하며 다른 ThemeId는 호환 지점만 정의합니다.

### Avatar

Avatar는 `body`, `hair`, `top`, `bottom`, `accessory` part ID로 구성합니다. 한 장의
합쳐진 캐릭터 이미지로 도메인 모델을 대체하지 않습니다.

### 상품화

향후 Theme Pack, Mood Pack, Avatar item은 카탈로그 정의, 사용자 보유 상태, 현재
선택을 서로 다른 모델로 관리합니다. M0에는 이 모델과 결제를 구현하지 않습니다.
