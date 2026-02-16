import React, { useState } from 'react';
import './SeatPick.css';

function SeatPick({ members, shuffle }) {
// 상태 관리: 분단 설정 및 배치 결과
    const [numColumns, setNumColumns] = useState(2); // 분단 수
    const [rowsPerColumn, setRowsPerColumn] = useState(3); // 한 분단당 줄 수
    const [maxPerGroup, setMaxPerGroup] = useState(4); // 모둠 최대 인원
    const [seatedMembers, setSeatedMembers] = useState([]);
    const [isGroupMode, setIsGroupMode] = useState(false); // 모둠 설정 on/off

    // 자리 배치 실행
    const handleAssign = () => {
        if (members.length === 0) {
        alert("멤버를 먼저 입력해주세요!");
        return;
        }
        const result = shuffle(members); // 노현님의 shuffle 로직 사용
        setSeatedMembers(result);
    };

    // 설정 변경 함수 (플러스/마이너스)
    const updateConfig = (type, value) => {
        if (type === 'col') setNumColumns(Math.max(1, Math.min(5, numColumns + value))); // 분단 수는 1~5
        if (type === 'row') setRowsPerColumn(Math.max(1, Math.min(10, rowsPerColumn + value))); // 한 분단당 줄 수는 1~10 (임시)
        if (type === 'group') setMaxPerGroup(Math.max(1, maxPerGroup + value));
    };

    // 자리 초기화 함수
    const handleReset = () => {
        setSeatedMembers([]); // Clear the seated members
    };





    return (
        <div className="seat-pick-page">
        {/* 칸 1: 멤버 기입 목록 (조회용) */}
        <section className="section member-list-view">
            <h3>Members</h3>
            <div className="list-content">
            {members.map(m => <div key={m.id} className="name-tag">{m.name}</div>)}
            </div>
        </section>

        {/* 칸 2: 분단 설정 */}
        <section className="section config-panel">
            <h3>Control</h3>
            <div className="config-item toggle-item">
                <label>모둠 설정</label>
                <button 
                    className={`toggle-btn ${isGroupMode ? 'on' : 'off'}`}
                    onClick={() => setIsGroupMode(!isGroupMode)}
                >
                    {isGroupMode ? 'ON' : 'OFF'}
                </button>
            </div>
            <div className="config-item">
                <label>분단 수</label>
                <div className="stepper">
                    <button onClick={() => updateConfig('col', -1)}>-</button>
                    <span>{numColumns}</span>
                    <button onClick={() => updateConfig('col', 1)}>+</button>
                </div>
            </div>
            <div className="config-item">
                <label>한 분단당 줄 수</label>
                <div className="stepper">
                    <button onClick={() => updateConfig('row', -1)}>-</button>
                    <span>{rowsPerColumn}</span>
                    <button onClick={() => updateConfig('row', 1)}>+</button>
                </div>
            </div>
            <div className="config-item">
                <label>모둠 최대 인원</label>
                <div className="stepper">
                    <button onClick={() => updateConfig('group', -1)}>-</button>
                    <span>{maxPerGroup}</span>
                    <button onClick={() => updateConfig('group', 1)}>+</button>
                </div>
            </div>
            <button className="main-assign-btn" onClick={handleAssign}>
                자리 배정 시작
            </button>
            <button className="reset-assign-btn" onClick={handleReset}>
                자리 초기화
            </button>
        </section>

        {/* 칸 3: 결과 창 */}
        <section className="section result-display">
            <h3>Result</h3>
            <div 
                className={`classroom-grid ${isGroupMode ? 'group-mode-grid' : ''}`} 
                style={{ 
                    gridTemplateColumns: isGroupMode ? '1fr' : `repeat(${numColumns}, 1fr)` 
                }}
            >
            {seatedMembers.length === 0 ? (
                <div className="no-results-placeholder">
                    <p>자리 배정 대기 중...</p>
                    <p>'자리 배정 시작' 버튼을 눌러주세요.</p>
                    
                </div>
            ) : (
                isGroupMode ? (
                    // 모둠 모드 렌더링
                    (() => {
                        const groups = [];
                        for (let i = 0; i < seatedMembers.length; i += maxPerGroup) {
                            groups.push(seatedMembers.slice(i, i + maxPerGroup));
                        }
                        return groups.map((group, groupIndex) => (
                            <div
                                key={groupIndex}
                                className="group-box"
                                style={{
                                    gridTemplateColumns: group.length === 1 ? '1fr' : 'repeat(2, 1fr)'
                                }}
                            >
                                {group.map((m, i) => (
                                    <div key={m.id} className="desk group-desk">
                                        <span className="desk-no">{groupIndex * maxPerGroup + i + 1}</span>
                                        <span className="name">{m.name}</span>
                                    </div>
                                ))}
                            </div>
                        ));
                    })()
                ) : (
                    // 분단 모드 렌더링
                    // seatedMembers를 numColumns에 따라 분할
                    (() => {
                        const columnsData = Array.from({ length: numColumns }, () => []);
                        seatedMembers.forEach((member, index) => {
                            columnsData[index % numColumns].push(member);
                        });

                        // Flatten members for overall index
                        const flattenedMembers = seatedMembers;

                        return columnsData.map((columnMembers, colIndex) => (
                            <div key={colIndex} className="column-segment">
                                {columnMembers.map((m) => (
                                    <div key={m.id} className="desk individual-desk">
                                        {/* Use original index from flattenedMembers for desk-no */}
                                        <span className="desk-no">{flattenedMembers.indexOf(m) + 1}</span>
                                        <span className="name">{m.name}</span>
                                    </div>
                                ))}
                            </div>
                        ));
                    })()
                )
            )}
            </div>
        </section>       
        </div>
    );
    }


export default SeatPick;