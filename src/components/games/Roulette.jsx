import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './Roulette.css';
import { useDraftLogic } from '../../hooks/useDraftLogic';

const Roulette = ({ members }) => {
    const { shuffle } = useDraftLogic();

    // --- 상태 관리 ---
    const [gameMembers, setGameMembers] = useState([]);
    const [isRolling, setIsRolling] = useState(false);
    const [results, setResults] = useState(['', '', '']);
    const [resultType, setResultType] = useState(null); // JACKPOT, SEMI_JACKPOT, CHAOS, DIRECT_PICK
    const [finalistInfo, setFinalistInfo] = useState(null);
    const [showFinalPickEffect, setShowFinalPickEffect] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [teamCount, setTeamCount] = useState(4);
    const [itemHeight, setItemHeight] = useState(0);

    const reelRef0 = useRef(null);
    const reelRef1 = useRef(null);
    const reelRef2 = useRef(null);
    const reelRefs = useMemo(() => [reelRef0, reelRef1, reelRef2], [reelRef0, reelRef1, reelRef2]);
    const itemRef = useRef(null);

    // 멤버 데이터 초기화
    useEffect(() => {
        if (members && members.length > 0) {
            setGameMembers(members.map(m => ({ ...m, team: m.team || null })));
        } else {
            setGameMembers([]);
        }
    }, [members]);

    const availableMembers = useMemo(() => gameMembers.filter(m => m.team === null), [gameMembers]);
    const availableMemberNames = useMemo(() => availableMembers.map(m => m.name), [availableMembers]);

    // 릴 표시용 셔플 데이터
    const shuffledMemberNamesForReels = useMemo(() => {
        if (availableMemberNames.length === 0) return [[], [], []];
        return Array.from({ length: 3 }).map(() => shuffle([...availableMemberNames]));
    }, [availableMemberNames, shuffle]);

    // UI 높이 및 변수 설정
    useEffect(() => {
        if (itemRef.current) {
            const currentItemHeight = itemRef.current.offsetHeight;
            setItemHeight(currentItemHeight);
            document.documentElement.style.setProperty('--item-height', `${currentItemHeight}px`);
        }
    }, [availableMemberNames]);

    useEffect(() => {
        document.documentElement.style.setProperty('--member-count', String(availableMemberNames.length));
    }, [availableMemberNames]);

    // --- 핵심 로직 1: 직접 할당 (1~2명 남았을 때) ---
    const performDirectAssignment = useCallback(() => {
        if (availableMembers.length === 0 || availableMembers.length >= 3) return;

        const assignedCount = gameMembers.filter(m => m.team !== null).length;
        const nextTeam = (assignedCount % teamCount) + 1;
        
        let determinedFinalistName;
        if (availableMembers.length === 1) {
            determinedFinalistName = availableMembers[0].name;
        } else {
            determinedFinalistName = availableMembers[Math.floor(Math.random() * 2)].name;
        }

        setResultType('DIRECT_PICK');
        setFinalistInfo({ name: determinedFinalistName, team: nextTeam });
        setGameMembers(prev => prev.map(m => 
            m.name === determinedFinalistName ? { ...m, team: nextTeam } : m
        ));
    }, [availableMembers, gameMembers, teamCount]);

    // --- 핵심 로직 2: 자동 실행 트리거 ---
    useEffect(() => {
        if (!isRolling && !showFinalPickEffect && availableMembers.length > 0 && availableMembers.length < 3) {
            const autoTimer = setTimeout(() => {
                performDirectAssignment();
            }, 1000); // 사용자 인지 시간
            return () => clearTimeout(autoTimer);
        }
    }, [availableMembers.length, isRolling, showFinalPickEffect, performDirectAssignment]);

    // --- 핵심 로직 3: 룰렛 실행 (3인 이상) ---
    const startSlot = useCallback(() => {
        if (isRolling || showFinalPickEffect || availableMembers.length < 3) return;

        setIsRolling(true);
        setResults(['', '', '']);
        setResultType(null);
        setFinalistInfo(null);
        setShowFinalPickEffect(false);

        reelRefs.forEach(ref => {
            if (ref.current) {
                ref.current.style.transition = 'none';
                ref.current.style.transform = `translateY(0)`;
            }
        });

        const selectedNames = Array.from({ length: 3 }, () => 
            availableMemberNames[Math.floor(Math.random() * availableMemberNames.length)]
        );
        
        const assignedCount = gameMembers.filter(m => m.team !== null).length;
        const nextTeam = (assignedCount % teamCount) + 1;

        setTimeout(() => {
            setIsRolling(false);
            setResults(selectedNames);

            const uniqueCount = new Set(selectedNames).size;
            
            if (uniqueCount === 1) { // JACKPOT
                const determinedFinalistName = selectedNames[0];
                setResultType('JACKPOT');
                setFinalistInfo({ name: determinedFinalistName, team: nextTeam });
                setGameMembers(prev => prev.map(m => m.name === determinedFinalistName ? { ...m, team: nextTeam } : m));
            } else { // 2단계 연출
                const currentResultType = uniqueCount === 2 ? 'SEMI_JACKPOT' : 'CHAOS';
                setResultType(currentResultType);
                setShowFinalPickEffect(true);

                let highlightInterval;
                setHighlightedIndex(0);
                highlightInterval = setInterval(() => {
                    setHighlightedIndex(prev => (prev + 1) % 3);
                }, 200);

                setTimeout(() => {
                    clearInterval(highlightInterval);
                    
                    let determinedFinalistName;
                    if (currentResultType === 'SEMI_JACKPOT') {
                        const uniqueNames = Array.from(new Set(selectedNames));
                        determinedFinalistName = uniqueNames[Math.floor(Math.random() * uniqueNames.length)];
                    } else {
                        determinedFinalistName = selectedNames[Math.floor(Math.random() * 3)];
                    }
                    
                    setFinalistInfo({ name: determinedFinalistName, team: nextTeam });
                    setGameMembers(prev => prev.map(m => m.name === determinedFinalistName ? { ...m, team: nextTeam } : m));
                    setHighlightedIndex(selectedNames.indexOf(determinedFinalistName));
                    
                    setTimeout(() => {
                        setShowFinalPickEffect(false);
                        setHighlightedIndex(-1);
                    }, 500);
                }, 1500);
            }
        }, 3000);
    }, [isRolling, showFinalPickEffect, availableMembers, availableMemberNames, gameMembers, teamCount, reelRefs]);

    // 릴 위치 조정
    useEffect(() => {
        if (!isRolling && !showFinalPickEffect && results[0] !== '' && itemHeight > 0 && availableMemberNames.length > 0) {
            results.forEach((resultName, index) => {
                const reelElement = reelRefs[index].current;
                if (reelElement) {
                    const resultIndex = availableMemberNames.indexOf(resultName);
                    if (resultIndex !== -1) {
                        const targetPos = (availableMemberNames.length * itemHeight) + (resultIndex * itemHeight);
                        const translateY = -(targetPos - itemHeight);
                        reelElement.style.transition = 'transform 0.5s cubic-bezier(0.15, 0, 0.15, 1)';
                        reelElement.style.transform = `translateY(${translateY}px)`;
                    }
                }
            });
        }
    }, [isRolling, showFinalPickEffect, results, availableMemberNames, itemHeight, reelRefs]);

    // 안내 문구
    const getRulebookText = useCallback(() => {
        if (availableMembers.length === 0 && gameMembers.length > 0) return "모든 멤버의 팀 배정이 완료되었습니다! 🎉";
        if (gameMembers.length === 0) return "멤버를 추가해주세요!";
        if (isRolling) return "릴이 회전 중입니다...";
        if (showFinalPickEffect) return "최종 후보를 선택 중입니다!";
        if (resultType === 'DIRECT_PICK') return `남은 멤버(${availableMembers.length}명)를 자동으로 배정합니다.`;
        return "레버를 당겨 팀 배정을 시작하세요!";
    }, [gameMembers, availableMembers, isRolling, showFinalPickEffect, resultType]);

    const handleResetGame = useCallback(() => {
        // Reset all relevant state variables
        setGameMembers(members.map(m => ({ ...m, team: null }))); // Reset teams
        setIsRolling(false);
        setResults(['', '', '']);
        setResultType(null);
        setFinalistInfo(null);
        setShowFinalPickEffect(false);
        setHighlightedIndex(-1);
        setTeamCount(4); // Reset team count to default
        // Reset reel positions if necessary (optional, as they will re-render anyway)
        reelRefs.forEach(ref => {
            if (ref.current) {
                ref.current.style.transition = 'none';
                ref.current.style.transform = `translateY(0)`;
            }
        });
    }, [members, reelRefs]);

    return (
        <div className="roulette-wrapper">
            <div className="roulette-container">
                <div className="top-control-area">
                    <label htmlFor="team-count">팀 개수:</label>
                    <input
                        id="team-count"
                        type="number"
                        min="2"
                        max="4"
                        value={teamCount}
                        onChange={(e) => setTeamCount(Math.min(4, Math.max(2, Number(e.target.value))))}
                        disabled={isRolling || showFinalPickEffect}
                    />
                    <button
                        className="reset-button"
                        onClick={handleResetGame}
                        disabled={isRolling || showFinalPickEffect}
                    >
                        reset
                    </button>
                </div>

                <div className="game-area">
                    <div className="reels-wrapper">
                        {Array.from({ length: 3 }).map((_, reelIndex) => (
                            <div className="reel" key={reelIndex}>
                                <ul ref={reelRefs[reelIndex]} className={isRolling ? 'rolling' : ''}>
                                    {shuffledMemberNamesForReels[reelIndex]?.length > 0 ? (
                                        [...Array(3)].map((_, groupIdx) => (
                                            shuffledMemberNamesForReels[reelIndex].map((name, idx) => (
                                                <li key={`${reelIndex}-${groupIdx}-${idx}`} ref={groupIdx === 0 && idx === 0 && reelIndex === 0 ? itemRef : null}>
                                                    <div className="member-ball">{name}</div>
                                                </li>
                                            ))
                                        ))
                                    ) : (
                                        /* [수정] 배정 완료 시 더미 '?' 대신 마지막 당첨자 이름 유지 */
                                        <li>
                                            <div className={`member-ball ${!finalistInfo ? 'empty' : ''}`}>
                                                {finalistInfo ? finalistInfo.name : ""}
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        ))}
                        {showFinalPickEffect && resultType !== 'JACKPOT' && (
                            <div className={`final-pick-overlay ${resultType}`}>
                                {results.map((name, i) => (
                                    <div key={`overlay-${i}`} className="reel-result-item">
                                        <div className={`member-ball ${i === highlightedIndex ? 'active' : ''}`}>
                                            {name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={`lever ${isRolling || showFinalPickEffect || (availableMembers.length > 0 && availableMembers.length < 3) ? 'down' : 'up'}`} onClick={startSlot}>
                        <div className="lever-handle"></div>
                        <div className="lever-knob"></div>
                    </div>
                </div>

                {finalistInfo && (
                    <div className="result-display">
                        <p>🎊 <span className="finalist-name">{finalistInfo.name}</span>님, <span className="finalist-team">{finalistInfo.team}팀</span> 배정! 🎉</p>
                    </div>
                )}

                <div className="rulebook-area">
                    <p className="rulebook-text">{getRulebookText()}</p>
                </div>
            </div>

            <div className="team-display-area">
                <h2>팀 배정 현황</h2>
                <div className="teams-container">
                    {Array.from({ length: teamCount }).map((_, i) => {
                        const teamNum = i + 1;
                        const tMembers = gameMembers.filter(m => m.team === teamNum);
                        return (
                            <div key={teamNum} className="team-card">
                                <h3>Team {teamNum}</h3>
                                {tMembers.length > 0 ? (
                                    <ul className="team-member-list">
                                        {tMembers.map(m => <li key={m.id}>{m.name}</li>)}
                                    </ul>
                                ) : (
                                    <p className="no-members">비어 있음</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Roulette;