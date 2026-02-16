# 🎲 Bang! – 팀 랜덤 뽑기 웹 애플리케이션

🔗 서비스 URL: https://bang.growgardens.app/

**Bang!**은 팀원 구성, 순서 결정, 자리 배치 등  
다양한 상황에서 공정하고 재미있게 결정을 내릴 수 있도록 돕는  
다기능 랜덤 뽑기 웹 애플리케이션입니다.

React 기반으로 개발되었으며,  
직관적인 UI와 게임형 인터랙션을 통해 빠르고 공정한 의사결정을 지원합니다.

---

## ✨ 주요 기능

- 👥 **멤버 관리**
  - 멤버 추가 / 삭제
  - 실시간 상태 반영

- 🪜 **사다리 타기**
  - 벌칙/당첨 설정
  - 애니메이션 결과 확인

- 🎡 **룰렛 뽑기**
  - 팀 배정 또는 1인 선택
  - 랜덤 회전 애니메이션

- 🃏 **카드 뽑기**
  - 멤버별 카드 뒤집기
  - 팀 자동 배정

- 🪑 **자리 뽑기**
  - 분단 / 모둠 형태 랜덤 배치

- 📸 **이미지 캡처**
  - 현재 게임 화면을 PNG 이미지로 저장

- 🌙 **다크 모드**
  - 사용자 선호 테마 전환 지원

---

## 📁 프로젝트 구조

```
SYLK/
├── .github/workflows/    # GitHub Actions 배포 자동화 (deploy.yml)
├── public/               # 정적 자원 (index.html, favicon 등)
├── src/
│   ├── components/
│   │   ├── common/       # 공통 UI (Header, Layout, MemberInput)
│   │   ├── games/        # 게임 컴포넌트 (CardPick, Ladder, Roulette, SeatPick)
│   │   └── utils/        # 유틸리티 (ImageCapture)
│   ├── home/             # Dashboard (메인 화면)
│   ├── hooks/            # 커스텀 훅 (useDraftLogic - 멤버 및 게임 로직 관리)
│   ├── App.js            # 라우팅 및 상태 관리
│   ├── App.css           # 전역 스타일
│   └── index.js          # React 렌더링 진입점
├── Dockerfile            # Docker 배포 설정
└── package.json          # 의존성 및 스크립트
```

---

## 🧠 설계 특징

- **게임 로직과 UI 분리**
  - `useDraftLogic` 커스텀 훅을 통해 상태 및 랜덤 로직 분리
- **컴포넌트 모듈화**
  - 기능별 폴더 구조 분리로 유지보수성 강화
- **자동 배포**
  - GitHub Actions + Docker 기반 CI/CD 구성
- **반응형 UI 설계**
  - 다양한 화면 크기에서 안정적 레이아웃 제공

---

## 🚀 시작하기

### 1️⃣ 저장소 클론

```bash
git clone [Your Repository URL]
cd SYLK
```

### 2️⃣ 의존성 설치

```bash
npm install
# 또는
yarn install
```

### 3️⃣ 개발 서버 실행

```bash
npm start
# 또는
yarn start
```

👉 `http://localhost:3000` 에서 실행됩니다.

---

## 🏗 프로덕션 빌드

```bash
npm run build
# 또는
yarn build
```

빌드 결과는 `build/` 폴더에 생성됩니다.

---

## 🛠 기술 스택

- **React**
- **JavaScript (ES6+)**
- **CSS3**
- **html2canvas**
- **Docker**
- **GitHub Actions (CI/CD)**

---

## 📌 향후 개선 방향

- 애니메이션 고도화
- 팀 저장 기능 추가
- 모바일 UX 최적화
- 접근성 개선

---

## 👨‍💻 Contributors

Team SYLK
