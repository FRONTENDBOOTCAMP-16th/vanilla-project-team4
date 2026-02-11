# vanilla-project-team4(SCRIPT DIRECTORS)

## 🎬 영화 정보 시스템 (Movie Info System)
영화에 대한 평점 및 상세 정보를 손쉽게 검색하고 발견할 수 있는 서비스

## 📅 프로젝트 기간
2026.02.09 ~ 2026.03.04 (주말 및 공휴일 제외 20일)

## 👥 팀원 소개 (Team Members)

이름,담당 개발 범위 (Frontend),부가 역할 (Collaboration & Design)
박성윤,메인 페이지 개발,"Team Lead: 프로젝트 전체 일정 수립, 리스크 관리 및 주요 의사결정 조율"
이주연,영화 리스트 페이지 개발,UI System Designer: Figma 기반 와이어프레임 설계 및 공통 UI 컴포넌트·상태 패턴 정의
이정론,영화 상세 페이지 개발,"Collaboration Manager: GitHub 이슈/PR 관리, 브랜치 전략(Git-flow) 및 코드 리뷰 프로세스 운영"
정인우,헤더 및 푸터 개발,Documentation Manager: Notion 기반 데일리 스크럼 기록 및 프로젝트 기획 문서·커뮤니케이션 허브 관리

저희 팀은 모든 팀원이 **프론트엔드 개발(API 연동 및 기능 구현)**을 핵심 업무로 수행합니다. 
효율적인 협업을 위해 각 영역별 담당자를 지정하여 모든 팀원과 함께 업무를 수행하고 
담당자는 해당 업무를 주도적으로 관리하고 최종 검토하는 역할을 수행했습니다.

## 🛠 기술 스택 (Tech Stack)

### 개발 언어
HTML, CSS, JAVASCRIPT
### 데이터 소스
TMDB (The Movie Database) API: 영화 상세 정보 및 실시간 평점 데이터 활용

## 🏗 협업 및 개발 환경 (Engineering Culture)
저희 팀은 단순한 기능 구현을 넘어, 지속 가능한 코드 품질을 위해 다음과 같은 환경을 구축했습니다.

- Vite: 빠른 번들링과 Hot Module Replacement(HMR)를 통한 효율적인 개발 환경 구축
- Linting & Formatting: ESLint를 설정하여 코드의 문법 오류를 방지하고 팀원 간 코딩 스타일을 통일했습니다.
- Git Hooks (Husky & Commitlint): Commitlint를 통해 팀 내 약속된 커밋 컨벤션을 강제하여 히스토리 가독성을 높였습니다.
- Husky를 이용해 커밋 전 Lint 검사를 자동화하여 결함 있는 코드가 레포지토리에 올라가지 않도록 방지했습니다.

## 🚀 주요 기능 (Key Features)

1. 영화 탐색 및 검색
- 영화 리스트 & 개봉 예정 정보: TMDB API를 연동하여 현재 상영 중인 영화 및 개봉 예정인 영화 정보를 제공합니다.
- 장르별 필터링: 다양한 영화 장르별로 리스트를 필터링하여 사용자의 취향에 맞는 영화를 빠르게 찾을 수 있습니다.
- 통합 검색 기능: 영화 제목 키워드 검색을 통해 원하는 영화의 정보를 즉시 확인할 수 있습니다.
- 연관 콘텐츠 추천: 사용자가 선택한 영화와 유사한 장르나 테마의 추천 영화 목록을 제시하여 탐색 경험을 확장합니다.

2. 인터랙티브 UI/UX
- 마우스 드래그/클릭 캐러셀: 메인 페이지 상단에 마우스를 이용한 슬라이드 기능을 구현하여 시각적으로 다채로운 영화 큐레이션을 제공합니다.

## 💻 실행 방법 (Getting Started)
프로젝트를 로컬 환경에서 실행하는 방법입니다.

```
// 1. 저장소 복제 (Clone the repo)
git clone https://github.com/your-repo-url/movie-info-system.git
// 2. 의존성 설치 (Install dependencies)
npm i
// 3. 개발 서버 실행 (Run the project)
npm run dev
```

API관련은 추후에 업데이트 예정입니다
