import React, { useState, useEffect, useCallback } from 'react';
import './CardPick.css';
import { useDraftLogic } from '../../hooks/useDraftLogic';

const CardPick = ({ members }) => {
  const [cards, setCards] = useState([]);
  const [teamCount, setTeamCount] = useState(2);
  const [showResultModal, setShowResultModal] = useState(false); // 모달 표시 상태
  
  const { shuffle } = useDraftLogic();

  // 1. 초기화 및 셔플
  useEffect(() => {
    if (members && members.length > 0) {
      const initialCards = members.map(member => ({
        id: member.id,
        name: member.name,
        isFlipped: false,
        team: null,
      }));
      const shuffledCards = shuffle(initialCards);
      setCards(shuffledCards);
    } else {
      setCards([]);
    }
  }, [members, shuffle]);

  // 2. 다시 섞기 (Reset)
  const shuffleCards = useCallback(() => {
    setCards(prevCards => {
      const resetCards = prevCards.map(card => ({ ...card, isFlipped: false, team: null }));
      return shuffle(resetCards);
    });
    setShowResultModal(false); // 모달 닫기
  }, [shuffle]);

  // 3. 카드 개별 클릭 (팀 할당 로직 유지)
  const handleCardClick = useCallback((id) => {
    setCards(prevCards => {
      const clickedCard = prevCards.find(card => card.id === id);
      if (clickedCard && clickedCard.isFlipped) return prevCards;

      const effectiveTeamCount = Math.max(1, teamCount);
      // 현재 뒤집힌 카드 수 기반으로 팀 배정 (1팀 -> 2팀 -> 1팀...)
      const currentFlipped = prevCards.filter(card => card.isFlipped).length;
      const nextTeam = (currentFlipped % effectiveTeamCount) + 1;

      return prevCards.map(card =>
        card.id === id
          ? { ...card, isFlipped: true, team: nextTeam }
          : card
      );
    });
  }, [teamCount]);

  // 4. 모두 뒤집기 (애니메이션 효과)
  const handleFlipAll = useCallback(() => {
    // 이미 다 뒤집혔으면 중단
    if (cards.every(c => c.isFlipped)) return;

    // 뒤집히지 않은 카드들만 찾아서 팀 배정 로직 적용
    let currentFlippedCount = cards.filter(c => c.isFlipped).length;
    const effectiveTeamCount = Math.max(1, teamCount);

    const newCards = cards.map(card => {
      if (card.isFlipped) return card;
      
      // 순차적으로 팀 배정
      const nextTeam = (currentFlippedCount % effectiveTeamCount) + 1;
      currentFlippedCount++;
      
      return { ...card, isFlipped: true, team: nextTeam };
    });

    setCards(newCards);
  }, [cards, teamCount]);

  // 5. 전체 결과 데이터 가공
  const getGroupedResults = () => {
    const results = {};
    // 팀별로 그룹화
    for (let i = 1; i <= teamCount; i++) {
      results[i] = cards.filter(c => c.team === i);
    }
    // 팀 미배정(아직 안 뒤집음) 처리
    const unassigned = cards.filter(c => c.team === null);
    if (unassigned.length > 0) results['미배정'] = unassigned;

    return results;
  };

  // 6. 결과 버튼 클릭
  const handleShowResults = () => {
    const allFlipped = cards.every(c => c.isFlipped);
    if (!allFlipped) {
      alert("아직 확인하지 않은 카드가 있습니다! 모든 카드를 뒤집어 주세요.");
      return;
    }
    setShowResultModal(true);
  };

  if (!members || members.length === 0) {
    return (
      <div className="card-pick-container">
        <p>멤버를 먼저 등록해주세요!</p>
      </div>
    );
  }

  return (
    <div className="card-pick-container">
      <h2>🃏 카드 뽑기 게임</h2>
      
      {/* 설정 영역 */}
      <div className="team-setting">
        <label>팀 개수: </label>
        <input
          type="number"
          min="2"
          value={teamCount}
          onChange={(e) => setTeamCount(Math.max(2, parseInt(e.target.value) || 2))}
        />
      </div>

      {/* 카드 그리드 */}
      <div className="cards-grid">
        {cards.map(card => (
          <div 
            key={card.id} 
            className={`card ${card.isFlipped ? 'flipped' : ''}`} 
            onClick={() => handleCardClick(card.id)}
          >
            <div className="card-inner">
              <div className="card-front">?</div>
              <div className="card-back">
                <span className="card-name">{card.name}</span>
                {card.team && <span className="team-badge">{card.team}팀</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 버튼 3개 */}
      <div className="button-group">
        <button className="action-btn retry" onClick={shuffleCards}>🔄 다시 섞기</button>
        <button className="action-btn flip-all" onClick={handleFlipAll}>⚡ 모두 뒤집기</button>
        <button className="action-btn result" onClick={handleShowResults}>📊 전체 결과</button>
      </div>

      {/* 전체 결과 모달 */}
      {showResultModal && (
        <div className="modal-overlay">
          <div className="result-modal">
            <h3 className="modal-title">전체 결과</h3>
            <div className="result-content">
              {Object.entries(getGroupedResults()).map(([teamName, members]) => (
                <div key={teamName} className="team-row">
                  <div className="team-header">
                    {teamName === '미배정' ? '❓ 미배정' : `🚩 ${teamName}팀`}
                  </div>
                  <div className="team-members">
                    {members.map(m => (
                      // ★ 여기를 "member-tag" -> "modal-member-tag"로 수정!
                      <span key={m.id} className="modal-member-tag">{m.name}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button className="modal-close-btn" onClick={() => setShowResultModal(false)}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardPick;