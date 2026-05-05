# 🎲 Bang! – 팀 랜덤 뽑기 웹 애플리케이션

🔗 서비스 URL: https://prac-deploy.pages.dev/

**Bang!**은 팀원 구성, 순서 결정, 자리 배치 등  
다양한 상황에서 공정하고 재미있게 결정을 내릴 수 있도록 돕는다.**

```
SYLK/
├── .github/workflows/    # GitHub Actions 배포 자동화 (deploy.yml)
├── public/               # 정적 자원 (index.html, favicon 등)
├── src/
│   ├── components/
│   ├── App.js            # 라우팅 및 상태 관리
│   ├── App.css           # 전역 스타일
│   └── index.js          # React 렌더링 진입점
├── Dockerfile            # Docker 배포 설정
└── package.json          # 의존성 및 스크립트
```

- `useDraftLogic` 커스텀 훅을 통해 상태 및 랜덤 로직 분리
- **컴포넌트 모듈화**
- 기능별 폴더 구조 분리로 유지보수성 강화
- **자동 배포**
  - GitHub Actions + Docker 기반 CI/CD 구성
- **반응형 UI 설계**
- 다양한 화면 크기에서 안정적 레이아웃 제공


- **JavaScript (ES6+)**
- **CSS3**
- **html2canvas**
- **Docker**
- **GitHub Actions (CI/CD)**
