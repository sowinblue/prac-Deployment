import React from 'react';
import './Dashboard.css';

const games = [
    { id: 'ladder', name: '사다리 타기', icon: '🪜' },
    { id: 'roulette', name: '룰렛 돌리기', icon: '🕹' },
    { id: 'CardPick', name: '카드 뽑기', icon: '🃏' },
    { id: 'seat', name: '자리 배치', icon: '🪑' },
];

const Dashboard = ({ onSelectGame }) => {
    return (
        // ★ 중요: 디자인을 위해 감싸는 태그 추가
        <div className="dashboard-content-wrapper">
            <h3 className="dashboard-title">게임 선택</h3>
            
            <div className="dashboard-grid">
                {games.map((game) => (
                    <div 
                        key={game.id} 
                        className="game-card" 
                        onClick={() => onSelectGame(game.id)}
                    >
                        <span className="game-icon">{game.icon}</span>
                        <span className="game-name">{game.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;