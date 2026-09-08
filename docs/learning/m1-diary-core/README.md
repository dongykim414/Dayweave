# M1 Diary Core 시작 가이드

## 이번 결정

M1을 하나의 긴 branch와 거대한 PR로 구현하지 않고, domain·SQLite·화면 연결의 세
vertical slice로 나눕니다. 세 PR은 모두 같은 GitHub `M1 Diary Core` Milestone에
연결합니다.

## Milestone과 PR이 다른 이유

Milestone은 여러 변경이 도달해야 할 제품 목표입니다. PR은 그 목표를 향한 하나의
독립적으로 리뷰하고 되돌릴 수 있는 변경입니다. 따라서 `M1 = PR 하나`일 필요가
없으며, 오히려 책임이 다른 변경을 분리하는 편이 실패 원인을 찾기 쉽습니다.

첫 PR은 데이터가 무엇을 의미하는지 먼저 결정합니다. SQLite table부터 만들면 저장
기술의 column 형태가 제품의 domain model을 결정하게 됩니다. Domain model과
repository contract를 먼저 만들면 SQLite는 그 계약을 구현하는 교체 가능한
infrastructure가 됩니다.

## 날짜 정책을 먼저 정하는 이유

다이어리에서 “오늘”은 단순한 UTC timestamp가 아닙니다. 사용자의 현지 날짜, 자정,
시간대 변경을 고려하지 않으면 같은 순간이 다른 날짜의 기록으로 보일 수 있습니다.
그래서 표시용 timestamp와 하루를 식별하는 local date key의 역할을 분리하고 테스트로
고정해야 합니다.

## 검토한 대안

### M1 전체를 한 PR에서 구현

- 장점: 겉으로는 한 번에 기능이 완성됩니다.
- 비용: domain, migration, UI 오류가 섞이고 리뷰와 rollback 범위가 커집니다.

### SQLite schema부터 구현

- 장점: 빠르게 데이터를 저장해 볼 수 있습니다.
- 비용: UI와 domain이 특정 database 구조에 결합될 가능성이 큽니다.

### Domain 계약부터 작은 PR로 구현 — 선택

- 장점: 제품 규칙을 빠른 unit test로 확정하고 persistence를 교체 가능하게 둡니다.
- 비용: 첫 PR만 봤을 때는 사용자 화면 변화가 없습니다.

M1은 단기 화면 변화보다 이후 CRUD의 안전한 기반을 우선하므로 세 번째 방식을
선택했습니다.

## Pre-release 번호 이해하기

`0.1.1`은 `0.1.0`의 bug fix입니다. M1 개발 중간본은 새 기능을 향하고 있으므로
필요할 때 `0.2.0-alpha.1`, `0.2.0-alpha.2`처럼 표시하는 편이 의미가 정확합니다.
M1 전체가 완료되면 `0.2.0`을 고정합니다.

## 다음 구현에서 확인할 것

- Diary entry의 필수·선택 필드
- 하루에 기록을 하나만 허용하는지 여부
- local date key 형식과 시간대 책임
- create와 update를 하나의 upsert로 볼지 여부
- repository가 반환할 오류의 종류
- Vitest와 Jest 중 Expo/TypeScript 환경에 맞는 test runner
