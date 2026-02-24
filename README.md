<div align="center">
  <h1>🎬 SCRIPT DIRECTORS</h1>
  <p>
    Script Directors는 영화 정보를 직관적인 UI와 인터랙션으로 제공하는
    바닐라 자바스크립트 기반 콘텐츠 탐색 웹 서비스입니다.
  </p>
</div>

<br>

## ⚒️ 기술 스택 (Tech Stack)

| 분류       | 기술                                                                |
| ---------- | ------------------------------------------------------------------- |
| 프론트엔드 | ![HTML][html-url] ![CSS][css-url] ![JavaScript][js-url]             |
| 협업 도구  | ![GitHub][github-url] ![Discord][discord-url] ![Notion][notion-url] |
| 디자인     | ![Figma][figma-url]                                                 |

<br>

## 📡 데이터 소스 (Data Source)

- **TMDB (The Movie Database) API**
  - 영화 상세 정보 및 실시간 평점 데이터 활용
  - 현재 상영작 / 개봉 예정작 / 추천 콘텐츠 데이터 제공

<br>

## 🚀 주요 기능 (Key Features)

### 🔎 영화 탐색 및 검색

- 영화 리스트 & 개봉 예정 정보: TMDB API를 연동하여 현재 상영 중인 영화 및 개봉 예정인 영화 정보를 제공합니다.
- 장르별 필터링: 다양한 영화 장르별로 리스트를 필터링하여 사용자의 취향에 맞는 영화를 빠르게 찾을 수 있습니다.
- 통합 검색 기능: 영화 제목 키워드 검색을 통해 원하는 영화의 정보를 즉시 확인할 수 있습니다.
- 연관 콘텐츠 추천: 사용자가 선택한 영화와 유사한 장르나 테마의 추천 영화 목록을 제시하여 탐색 경험을 확장합니다.

### 🎨 인터랙티브 UI/UX

- 마우스 드래그/클릭 캐러셀: 메인 페이지 상단에 마우스를 이용한 슬라이드 기능을 구현하여 시각적으로 다채로운 영화 큐레이션을 제공합니다.

<br>

## 🏗 개발 환경 및 협업 방식

- **Vite**: 빠른 번들링과 HMR을 통한 효율적인 개발 환경 구축
- **ESLint**: 코드 문법 오류 방지 및 팀 내 코딩 스타일 통일
- **Prettier**: 자동 코드 포맷팅을 통해 일관된 코드 스타일 유지
- **Husky & Commitlint**: 커밋 컨벤션 강제 및 Lint 자동 검사를 통한 코드 품질 유지
- **GitHub Milestone & Issue 기반 협업 관리**
  > 단순 기능 구현을 넘어,
  > 코드 품질과 협업 기록을 중시하는 개발 문화를 지향합니다.

## 👥 팀원 소개 및 역할 분담 (Team Members)

| <img src="https://github.com/psy0821-k.png" width="120"> | <img src="https://github.com/jyeonleee.png" width="120"> | <img src="https://github.com/holymolyRon.png" width="120"> | <img src="https://github.com/baakainu.png" width="120"> |
| :------------------------------------------------------: | :------------------------------------------------------: | :--------------------------------------------------------: | :-----------------------------------------------------: |
|                            🎬                            |                            🎥                            |                             🎞                             |                           🧩                            |
|          [박성윤](https://github.com/psy0821-k)          |          [이주연](https://github.com/jyeonleee)          |          [이정론](https://github.com/holymolyRon)          |          [정인우](https://github.com/baakainu)          |
|                        Main Page                         |                     Movie List Page                      |                     Movie Detail Page                      |                Header / Footer / Search                 |
|                        Team Lead                         |                     Figma Management                     |                     GitHub Management                      |                  Notion Documentation                   |

<br>

## 🗂 폴더 구조

```bash
project-name/
├── public/              # 정적 파일 (빌드 시 루트로 복사됨, favicon 등)
│   └── favicon.svg
├── src/                 # 소스 코드 (실제 개발 작업 공간)
│   ├── assets/          # 이미지, 폰트 등 정적 리소스
│   │   ├── images/
│   │   └── icons/
│   ├── components/      # 재사용 가능한 UI 컴포넌트
│   ├── styles/          # 스타일 시트
│   │   ├── components/
│   │   ├── base.css
│   │   ├── theme.css
│   │   └── main.css
│   ├── utils/           # 공통 유틸 함수
│   ├── api/             # API 호출 로직
│   └── main.js          # JS 진입점 (Entry Point)
├── index.html           # 메인 HTML
├── package.json         # 의존성 관리
├── .gitignore           # Git 제외 파일 목록
└── vite.config.js       # Vite 설정 파일
```

<br>

[html-url]: https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white
[css-url]: https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white
[js-url]: https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[github-url]: https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white
[discord-url]: https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white
[notion-url]: https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white
[figma-url]: https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white
