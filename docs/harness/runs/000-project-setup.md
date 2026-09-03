# Run 000: 프로젝트 기본 설정

## 기본 정보

- 날짜: 2026-09-03
- Harness 버전: v0 초안
- 작업 요청: Dayweave 폴더에 Next.js 기본 설정과 관찰 문서 구조 만들기

## 성공 조건

- [x] 프로젝트 폴더 이름이 `Dayweave`입니다.
- [x] Next.js App Router와 TypeScript 기본 파일이 존재합니다.
- [x] 관찰 프로토콜과 실행 로그 템플릿이 존재합니다.
- [x] lint와 TypeScript 검사가 통과합니다.
- [ ] production build가 통과합니다.
- [ ] GitHub 원격 저장소에 첫 커밋이 푸시됩니다.

## 관찰 기록

### 탐색과 발견

1. 기존 `schedule-harness-lab` 폴더가 비어 있음을 확인했습니다.
2. Node.js, npm, Git, GitHub CLI 설치를 확인했습니다.
3. GitHub 계정 `dongykim414`의 저장 인증 토큰이 만료된 상태임을 확인했습니다.

### 구현

- 빈 폴더를 `Dayweave`로 변경했습니다.
- create-next-app으로 TypeScript, ESLint, App Router, `src/` 구조를 생성했습니다.
- 제품 MVP, Harness v0, 관찰 프로토콜, 실행 로그 템플릿을 추가했습니다.

### 실패 대응

#### npm 기본 캐시 쓰기 실패

- 오류: npm 기본 캐시에 파일을 열 수 없어 `EPERM`이 발생했습니다.
- 직접적인 단서: 오류 경로가 프로젝트 밖의 사용자 npm 캐시였습니다.
- 대응: 쓰기 가능한 작업공간 안에 전용 npm 캐시를 지정했습니다.

#### 대문자 프로젝트명 거부

- 오류: create-next-app이 `Dayweave`를 npm 패키지명으로 사용해 대문자를 거부했습니다.
- 직접적인 단서: npm 패키지명은 대문자를 허용하지 않는다는 CLI 메시지였습니다.
- 대응: 임시 소문자 폴더에서 생성하고 최종 폴더명을 `Dayweave`로 되돌렸습니다.
- 결과: 폴더명은 `Dayweave`, 패키지명은 `dayweave`로 분리했습니다.

#### 의존성 설치 후처리 실패

- 오류: npm 설치 후처리 중 하위 프로세스 실행에서 `spawn EPERM`이 발생했습니다.
- 대응: 후처리를 생략한 설치로 의존성을 복구했습니다.

#### Next.js 실행 프로세스 제한

- 성공: `npm run lint`와 `npx tsc --noEmit`이 통과했습니다.
- 성공: Turbopack production build의 코드 컴파일 단계가 통과했습니다.
- 오류: build의 후속 단계와 dev 서버 시작이 별도 프로세스를 생성할 때 `spawn EPERM`이 발생했습니다.
- 비교: webpack build에서도 동일한 `spawn EPERM`이 발생해 번들러 문제가 아님을 확인했습니다.
- 판단: 현재 Codex Windows 실행 환경의 프로세스 권한 제한으로 분류하고, 일반 사용자 터미널에서 재검증해야 합니다.

## 완료 판단

- 완료 근거: 프로젝트와 문서 파일 생성, 의존성 설치, lint와 TypeScript 검사를 확인했습니다.
- 남은 검증: 일반 사용자 터미널의 dev/build, GitHub 인증 및 push가 남아 있습니다.
- 남은 위험: 현재 실행 환경에서는 Next.js가 하위 프로세스를 만들 수 없고, GitHub 재로그인에는 사용자의 브라우저 인증이 필요할 수 있습니다.

## 하네스 후보

- 한 번 발생한 환경 오류는 아직 `AGENTS.md`의 영구 규칙으로 승격하지 않습니다.
- 같은 npm 캐시 문제가 반복되면 Windows 작업환경 설정으로 문서화합니다.
