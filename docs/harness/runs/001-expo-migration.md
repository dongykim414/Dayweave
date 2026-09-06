# Run 001: React Native + Expo 마이그레이션

## 기본 정보

- 날짜: 2026-09-06
- Harness 버전: v0
- 기준 커밋: `0493e29`
- 작업 요청: Next.js 기본 프로젝트를 React Native + Expo 앱 프로젝트로 전환

## 성공 조건

- [x] Harness 문서와 Git 이력을 유지한다.
- [x] Next.js 전용 코드와 설정을 제거한다.
- [x] Expo SDK 57, React Native, Expo Router와 TypeScript strict mode를 구성한다.
- [x] 의존성 설치 후 lint, typecheck, Web export를 통과한다.

## 관찰 기록

### 요청 해석

- Dayweave의 제품 방향을 웹 다이어리에서 Android·iOS 중심 모바일 앱으로 변경한다.
- 아직 MVP 기능은 구현하지 않고, 후속 작업의 기준이 될 실행 가능한 기본 앱까지만 만든다.

### 탐색

| 순서 | 확인 대상 | 확인 이유 | 발견한 사실 |
| --- | --- | --- | --- |
| 1 | Git 상태와 루트 파일 | 안전한 전환 가능 여부 확인 | `main`이 깨끗하고 Next.js 16 기본 코드만 존재 |
| 2 | `AGENTS.md`, 제품·Harness 문서 | 기존 규칙과 목적 보존 | CSS Modules·웹 빌드 등 Next.js 전용 규칙이 존재 |
| 3 | Expo 공식 문서와 npm 템플릿 | 최신 호환 버전 확인 | SDK 57은 React Native 0.86, React 19.2.3, Node 22.13 이상 사용 |

### 계획

1. 별도 마이그레이션 브랜치를 만든다.
2. Next.js 전용 파일과 생성물을 제거한다.
3. Expo Router 최소 앱과 플랫폼별 실행 명령을 구성한다.
4. 문서와 Agent 규칙을 모바일 앱 기준으로 갱신한다.
5. 의존성을 설치하고 Expo 진단, lint, typecheck, Web export를 실행한다.

### 구현

| 파일 | 변경 목적 |
| --- | --- |
| `package.json`, `app.json`, `tsconfig.json` | Expo SDK 57 앱 실행·라우팅·타입 설정 |
| `src/app/_layout.tsx`, `src/app/index.tsx` | 최소 Expo Router 앱 진입점과 설정 확인 화면 |
| `eslint.config.js`, `.gitignore` | Expo lint와 생성물·비밀정보 제외 규칙 |
| `README.md`, `AGENTS.md`, `docs/product/mvp.md` | 모바일 앱 기준 명령·규칙·제품 범위 반영 |

### 검증

| 명령 또는 확인 | 결과 | 근거 또는 오류 |
| --- | --- | --- |
| `npm install` | 성공 | Expo 패키지 500개 추가, Next 패키지 36개 제거, 종료 코드 0 |
| `npm ls --depth=0` | 성공 | Expo 57.0.20, React Native 0.86.3, React 19.2.3 확인 |
| `npm ls next --depth=0` | 성공 | 루트 Next 의존성이 없음을 확인 |
| `npx expo config --json` | 성공 | SDK 57.0.0 및 iOS·Android·Web 플랫폼 설정 확인 |
| `npx expo-doctor` | 미완료 | 패키지 설치 후 샌드박스의 자식 프로세스 생성에서 `spawn EPERM` |
| `npm run lint` | 성공 | 종료 코드 0; `npx eslint src --max-warnings=0`도 성공 |
| `npm run typecheck` | 성공 | `tsc --noEmit` 종료 코드 0 |
| `npm run build:web` | 성공 | Metro 775개 모듈 번들링, 정적 라우트 3개를 `dist`에 생성 |
| `npm audit --omit=dev` | 주의 | 중간 등급 13건, high·critical 0건; 모두 Expo 계열 전이 의존성 경로 |

### 실패 대응

- 실패: `create-expo-app`가 `C:\Users\DongYoung\.expo` 생성 중 `EPERM` 발생
- 직접적인 단서: CLI 오류에 거부된 절대 경로가 표시됨
- 대응: `EXPO_NO_TELEMETRY=1`로 사용자 설정 쓰기를 피함
- 재검증: 사용자 폴더 오류는 사라졌으나 CLI 4.0.0의 템플릿 추출 오류가 별도로 발생

- 실패: `default@sdk-57` 템플릿 추출 중 `Cannot read properties of undefined (reading 'match')`
- 직접적인 단서: 공식 npm 템플릿 조회는 성공하고 CLI 래퍼의 추출 단계만 실패함
- 대응: 공식 `expo-template-default@57.0.22` 패키지를 직접 확인해 동일 버전 구성을 적용
- 재검증: 설치된 SDK·React Native·React 버전과 lint, typecheck, Web export 호환성 확인

- 실패: `expo-doctor` 실행 중 `spawn EPERM`
- 직접적인 단서: `npx`를 우회해 Doctor 스크립트를 직접 실행해도 동일한 자식 프로세스 생성 오류 발생
- 대응: Expo 패키지 트리, TypeScript, ESLint, Metro Web export를 각각 독립 검증
- 재검증: 일반 PowerShell 환경에서 `npx expo-doctor`를 한 번 더 실행해야 함

## 완료 판단

- 완료 근거: Next 루트 의존성 제거, Expo SDK 57 패키지 정렬, lint·typecheck·Web export 성공
- 실행하지 않은 검증: Android·iOS 실제 기기 실행과 Expo Doctor는 사용자의 일반 환경에서 확인 필요
- 남은 위험: `node_modules`에 Windows가 삭제하지 못한 과거 Next SWC 파일 하나와 `.next` 캐시가 로컬에 남아 있으나 의존성·Git 결과물에는 포함되지 않음
- 남은 위험: npm audit 중간 등급 13건은 Expo 계열 전이 의존성에서 발생하며 제시된 강제 수정은 SDK를 비호환 버전으로 내리므로 적용하지 않음

## 하네스 후보

- 반복 여부를 더 관찰할 문제: Windows 샌드박스의 사용자 홈 설정 폴더 쓰기 제한
- AGENTS.md 후보 규칙: 현재 한 번만 관찰되어 추가하지 않음
- 테스트 또는 자동화 후보: CI에서 lint, typecheck, Web export 실행

## 다음 비교 작업

- 첫 캘린더 화면의 디자인 시안 선택과 앱 셸 구현
