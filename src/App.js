import React, { useState, useRef } from 'react'; // ★ useState 정의됨
import './App.css';
import Header from './components/common/Header'; // ★ Header 정의됨
import Layout from './components/common/Layout'; // ★ Layout 정의됨
import MemberInput from './components/common/MemberInput'; // ★ MemberInput 정의됨
import Ladder from './components/games/Ladder'; // ★ Ladder 정의됨
import { useDraftLogic } from './hooks/useDraftLogic'; // ★ useDraftLogic 정의됨
import SeatPick from './components/games/SeatPick';
import CardPick from './components/games/CardPick';
import Roulette from './components/games/Roulette';
import Dashboard from './home/Dashboard';
import ImageCapture from './components/utils/ImageCapture'; // ★ ImageCapture 임포트

function App() {
  const { members, addMember, removeMember, shuffle, pickOne, resetMembers } = useDraftLogic();
  
  const [activeGame, setActiveGame] = useState('home');
  const contentRef = useRef(null); // 콘텐츠 영역을 위한 ref 생성

  const handleCapture = async () => {
    // 현재 활성화된 게임 이름으로 파일명 설정
    const filename = activeGame === 'home' ? 'dashboard' : activeGame.toLowerCase();
    await ImageCapture.captureAndDownload(contentRef.current, filename);
  };

  return (
    <div className="App">
      <Header 
        activeGame={activeGame}         // 현재 게임 상태 전달
        onGameChange={setActiveGame}    // 게임 변경 함수 전달
        onCaptureClick={handleCapture}  // ★ 이 이름이 Header.jsx의 44라인과 연결됩니다!
      />
      <Layout ref={contentRef}>
        {activeGame === 'home' && (
          <div className="main-wrapper">
          <div className="member-input-container">
            <MemberInput
              members={members}
              onAddMember={addMember}
              onResetMembers={resetMembers}  // ★ onResetMembers 전달됨
              onRemoveMember={removeMember}
            />

          </div>
          <div className="dashboard-container">
            <Dashboard onSelectGame={setActiveGame}/>
          </div>
            </div>
        )}

        {activeGame === 'ladder' && (
          <Ladder members={members} />
        )}

        {activeGame === 'CardPick' && (
          <CardPick 
            members={members} 
            shuffle={shuffle} 
            pickOne={pickOne} 
          />
        )}

        {activeGame === 'seat' && (
          <SeatPick members={members} shuffle={shuffle} />
        )}

        {activeGame === 'roulette' && (
          <Roulette members={members} />
        )}
      </Layout>
    </div>
  );
}

export default App;