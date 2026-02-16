import { useState } from "react";
import "./Header.css";

// ★ 수정: App.js에서 보내준 '정확한 이름들'을 중괄호 안에 다 적어줘야 합니다.
function Header({ activeGame, onGameChange, onCaptureClick }) { 
    const [isDark, setIsDark] = useState(false);

    const toggleTheme = () => {
        setIsDark((prev) => !prev);
        document.body.classList.toggle("dark-mode");
    };

    return (
        <header className="header">
            <div className="header-left">
                {/* 로고 누르면 홈으로 */}
                <span 
                    className="logo" 
                    onClick={() => onGameChange('home')} // onMenuClick -> onGameChange
                    style={{cursor: 'pointer'}}
                >
                    BANG!
                </span>
                <nav className="menu">
                    <button className="menu-btn" onClick={() => onGameChange('ladder')}>
                        사다리 타기
                    </button>
                    
                    <button className="menu-btn" onClick={() => onGameChange('roulette')}>
                        룰렛 뽑기
                    </button>
                    
                    <button className="menu-btn" onClick={() => onGameChange('CardPick')}>
                        카드 뽑기
                    </button>
                    
                    <button className="menu-btn" onClick={() => onGameChange('seat')}>
                        자리 뽑기
                    </button>
                </nav>
            </div>

            {/* 이제 onCaptureClick이 정의되어 에러가 사라집니다. */}
            <button className="capture-btn" onClick={onCaptureClick} style={{marginRight: '10px'}}>
                📸 이미지 저장
            </button>

            <button className="theme-btn" onClick={toggleTheme}>
                {isDark ? "🌙" : "😎"}
            </button>
        </header>
    );
}

export default Header;