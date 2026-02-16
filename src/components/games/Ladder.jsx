import React, { useState, useEffect } from 'react';
import { useDraftLogic } from '../../hooks/useDraftLogic'; // 로직 분리 파일
import './Ladder.css'; // 스타일 파일

// [상수 정의] 
// 화면에 그려지는 그림(CSS)과 움직이는 선(JS)의 위치를 정확히 맞추기 위한 설정값입니다.
// 주의: Ladder.css 파일의 픽셀 값과 100% 일치해야 선이 어긋나지 않습니다.
const COLORS = [
    '#E3B5A1', // 부드러운 코랄
    '#A8C8A0', // 세이지
    '#B7D6E2', // 더스티 블루
    '#E8C3AC', // 웜 피치
    '#D4B4CE', // 톤다운 라일락
    '#BBD58E', // 차분한 라임
    '#E7CF98', // 웜 옐로우
    '#B2C4A3', // 모스 그린
    '#D8BFB4', // 베이지 로즈
    '#A4AEC6'  // 그레이시 블루
];



const COL_WIDTH = 80;     // 기둥 하나당 너비 (CSS .ladder-col width)
const ROW_HEIGHT = 40;    // 사다리 한 층의 높이 (가로선 간격)
const NAME_SIZE = 40;     // 상단 이름표 동그라미 크기
const NAME_MARGIN = 5;    // 이름표와 사다리 사이 여백
const TOP_OFFSET = 10;    // 전체 보드 상단 패딩
const REWARD_MARGIN = 5;  // 사다리 끝과 결과 박스 사이 여백

const Ladder = ({ members }) => {
    // [Hooks] useDraftLogic에서 핵심 기능(함수)만 꺼내옵니다.
    const { 
        generateLadder, // 사다리 가로줄(구조) 랜덤 생성 함수
        tracePath,      // 특정 멤버의 도착 결과를 계산하는 함수
        getLadderPath   // 애니메이션을 위해 이동 경로 좌표를 계산하는 함수
    } = useDraftLogic();
    

    // [State] 화면의 상태를 관리하는 변수들
   // 1. 사다리 구조 데이터 (True면 가로줄 있음, False면 없음)
    const [ladderData, setLadderData] = useState(null);
    
    // 2. 사용자가 입력한 벌칙/당첨 내용 리스트
    const [rewards, setRewards] = useState(Array(members.length).fill(''));
    
    // 3. 현재 클릭해서 사다리를 타고 있는 멤버의 인덱스 (선 색깔 결정용)
    const [activeMemberIdx, setActiveMemberIdx] = useState(null);
    
    // 4. SVG 애니메이션 선이 그려질 좌표 문자열 ("x1,y1 x2,y2 ...")
    const [pathCoords, setPathCoords] = useState([]);
    
    // 5. 애니메이션을 강제로 다시 재생하기 위한 키 (클릭할 때마다 1씩 증가)
    const [animKey, setAnimKey] = useState(0);
    
    // 6. '전체 결과 보기' 모달창을 띄울지 말지 결정하는 스위치
    const [showResultModal, setShowResultModal] = useState(false);

    // [Effect] 데이터 동기화 (안전장치)
    // 멤버 수가 바뀌면(예: 2명 -> 5명), 벌칙 입력칸(rewards) 개수도 자동으로 맞춰줍니다.
    // 이게 없으면 멤버는 늘어났는데 입력칸이 부족해서 에러가 날 수 있습니다.
    useEffect(() => {
        setRewards(Array(members.length).fill(''));
    }, [members]);

    // [Handler 1] 게임 시작 버튼 클릭
    const handleStart = () => {
        // 예외 처리: 혼자서는 게임 못 함
        if (members.length < 2) {
            alert("최소 2명 이상이어야 합니다!");
            return;
        }
        // 1. 사다리 구조(가로줄)를 랜덤으로 만듭니다.
        const newLadder = generateLadder(members.length);
        setLadderData(newLadder);
        
        // 2. 게임 상태를 깨끗하게 초기화합니다.
        setActiveMemberIdx(null);
        setPathCoords([]);
        setShowResultModal(false);
    };

    // [Handler 2] 상단 캐릭터(이름) 클릭 -> 애니메이션 시작!
    const handleMemberClick = (startIdx) => {
        // 사다리가 없으면 아무것도 안 함
        if (!ladderData) return;
        
        // 1. 현재 주인공 설정 (선 색깔을 이 사람 색으로 바꾸기 위해)
        setActiveMemberIdx(startIdx);
        
        // 2. 애니메이션 키 업데이트 -> React가 <polyline> 태그를 새로 만들어서 선이 다시 그려짐
        setAnimKey(prev => prev + 1); 
        
        // 3. 로직 Hook을 이용해 "논리적 경로(몇 층, 몇 번째 칸)"를 받아옴
        const path = getLadderPath(ladderData, startIdx);
        
        // 4. 논리적 좌표를 -> 화면의 "픽셀 좌표(px)"로 변환하는 과정
        const svgPoints = path.map(p => {
            // X좌표: (기둥 순서 * 기둥 폭) + (기둥 폭의 절반 = 중앙 정렬)
            const x = p.c * COL_WIDTH + (COL_WIDTH / 2); 
            
            let y;
            // 출발점 (사다리 맨 위보다 조금 더 위)
            if (p.r === -1) {
                y = TOP_OFFSET + (NAME_SIZE / 2); // 이름표 정중앙
            } 
            // 도착점 (사다리 맨 아래보다 조금 더 아래)
            else if (p.r === ladderData.length) {
                // 사다리 전체 높이 = (층수 * 층높이)
                const ladderHeight = ladderData.length * ROW_HEIGHT;
                // 이름표 + 여백 + 사다리높이 + 여백 = 결과 박스 바로 위
                y = TOP_OFFSET + NAME_SIZE + NAME_MARGIN + ladderHeight + REWARD_MARGIN; 
            } 
            // 중간 지점 (사다리 타는 중)
            else {
                y = TOP_OFFSET + NAME_SIZE + NAME_MARGIN + ((p.r + 1) * ROW_HEIGHT);
            }
            
            return `${x},${y}`;
        }).join(" "); // 좌표들을 공백으로 연결해서 문자열로 만듦 ("10,10 50,50 ...")

        // 5. 변환된 좌표를 상태에 저장 -> 화면에 선이 그려짐
        setPathCoords(svgPoints);
    };


    // [Handler 3] 벌칙 입력칸 내용 변경
    const handleRewardChange = (i, val) => {
        const newArr = [...rewards]; // 기존 배열 복사 (불변성 유지)
        newArr[i] = val;             // 값 수정
        setRewards(newArr);          // 상태 업데이트
    };

    // [Handler 4] 다시 설정하기 (리셋)
    const handleReset = () => {
        setLadderData(null); // 사다리 데이터 삭제 -> 입력 화면으로 돌아감
        setRewards(Array(members.length).fill('')); // 벌칙 초기화
        setActiveMemberIdx(null);
        setPathCoords([]);
        setShowResultModal(false);
    };





    // [Helper] 전체 결과 리스트 만들기 (모달창용 데이터)
    const getAllResults = () => {
        if (!ladderData) return [];
        // 모든 멤버에 대해 반복문을 돌며 도착지를 미리 계산합니다.
        return members.map((member, idx) => {
            const endIdx = tracePath(ladderData, idx); // 도착 인덱스 계산
            return {
                member: member.name,
                reward: rewards[endIdx] || "꽝", // 입력값이 없으면 '꽝'
                color: COLORS[idx % COLORS.length] // 멤버 고유 색상
            };
        });
    };

    return (
        <div className="ladder-container">
            <h2 style={{margin:'10px 0'}}>🪜 사다리 타기</h2>
            
            {/* 1. 사다리 생성 전: 입력 화면 (ladderData가 없을 때) */}
            {!ladderData && (
                <div className="input-section">
                    <p style={{marginBottom:'10px', color:'#666', fontSize:'14px'}}>벌칙/당첨 내용을 적어주세요</p>
                    <div style={{display:'flex', gap:'5px', justifyContent:'center', flexWrap:'wrap', marginBottom:'15px'}}>
                        {members.map((m, i) => (
                            <div key={m.id} style={{textAlign:'center', margin:'2px'}}>
                                {/* 멤버 이름 */}
                                <div style={{fontWeight:'bold', fontSize:'12px', marginBottom:'2px', color: COLORS[i % COLORS.length]}}>
                                    {m.name}
                                </div>
                                {/* 벌칙 입력창 */}
                                <input 
                                    style={{width:'50px', padding:'5px', border:'1px solid #ccc', borderRadius:'4px', textAlign:'center', fontSize:'12px'}} 
                                    placeholder="?" 
                                    value={rewards[i] || ''} 
                                    onChange={(e) => handleRewardChange(i, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                    <button onClick={handleStart} style={{padding:'8px 25px', background:'#8d6e63', color:'white', border:'none', borderRadius:'20px', cursor:'pointer', fontWeight:'bold'}}>
                        게임 시작
                    </button>
                </div>
            )}

            {/* 2. 사다리 생성 후: 게임 화면 (ladderData가 있을 때) */}
            {ladderData && (
                <div className="game-wrapper" style={{width: '100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
                    <p style={{color:'#888', fontSize:'12px', marginBottom:'5px'}}>이름을 클릭하면 내려갑니다! 👇</p>
                    
                    {/* 사다리 전체 보드 (너비는 인원수에 맞춰 자동 조절) */}
                    <div className="ladder-board" style={{ width: members.length * COL_WIDTH }}>
                        
                        {/* [Layer 1] SVG 애니메이션 선 (제일 위에 덮어씌움) */}
                        <svg className="ladder-svg">
                            {pathCoords.length > 0 && activeMemberIdx !== null && (
                                <polyline 
                                    key={animKey} // ★ 키가 바뀌면 컴포넌트가 재생성되어 애니메이션이 다시 실행됨
                                    points={pathCoords}
                                    className="path-line"
                                    stroke={COLORS[activeMemberIdx % COLORS.length]} // 클릭한 사람 색상 적용
                                />
                            )}
                        </svg>

                        {/* [Layer 2] 사다리 구조물 (HTML 요소들) */}
                        {members.map((member, colIdx) => (
                            <div key={member.id} className="ladder-col">
                                {/* 이름표 (클릭 버튼 역할) */}
                                <div 
                                    className="member-name"
                                    onClick={() => handleMemberClick(colIdx)}
                                    style={{
                                        // 클릭된 상태면 배경색을 채워줌
                                        borderColor: COLORS[colIdx % COLORS.length],
                                        backgroundColor: activeMemberIdx === colIdx ? COLORS[colIdx % COLORS.length] : '#fff',
                                        color: activeMemberIdx === colIdx ? '#fff' : '#333'
                                    }}
                                >
                                    {member.name}
                                </div>

                                {/* 세로줄 (사다리 기둥) */}
                                <div 
                                    className="vertical-line" 
                                    style={{ height: ladderData.length * ROW_HEIGHT }}
                                >
                                    {/* 가로줄 (연결된 곳만 그림) */}
                                    {ladderData.map((row, rowIdx) => {
                                        if (row[colIdx]) {
                                            return (
                                                <div 
                                                    key={rowIdx} 
                                                    className="horizontal-line"
                                                    style={{ top: `${(rowIdx + 1) * ROW_HEIGHT}px` }} 
                                                />
                                            );
                                        }
                                        return null;
                                    })}
                                </div>

                                {/* 결과 박스 (도착지점) */}
                                <div className="reward-box">
                                    {rewards[colIdx] || "꽝"}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 하단 버튼들 (전체 결과 보기 / 리셋) */}
                    <div style={{marginTop: '15px', display: 'flex', gap: '10px'}}>
                        <button 
                            onClick={() => setShowResultModal(true)} 
                            style={{padding:'8px 25px', background:'#8d6e63', color:'white', border:'none', borderRadius:'20px', cursor:'pointer', fontWeight:'bold', fontSize:'13px', display:'flex', alignItems:'center', gap:'5px'}}
                        >
                            📊 전체 결과
                        </button>
                        <button 
                            onClick={handleReset} 
                            style={{padding:'8px 25px', background:'#fff', border:'1px solid #8d6e63', borderRadius:'20px', cursor:'pointer', color:'#555', fontWeight:'bold', fontSize:'13px'}}
                        >
                            다시 설정
                        </button>
                    </div>
                </div>
            )}

            {/* 3. 모달창: 전체 결과 보기 (showResultModal이 true일 때만 뜸) */}
            {showResultModal && (
                <div className="result-modal-overlay">
                    <div className="result-modal">
                        <h3 style={{marginBottom:'15px', fontSize:'20px', color:'#8d6e63'}}>전체 결과</h3>
                        <ul className="result-list">
                            {/* getAllResults 함수로 결과를 계산해서 리스트로 뿌려줌 */}
                            {getAllResults().map((res, idx) => (
                                <li key={idx} className="result-row">
                                    <div className="result-member">
                                        <span style={{color: res.color, fontSize:'16px'}}>●</span>
                                        <span style={{fontSize:'14px'}}>{res.member}</span>
                                    </div>
                                    <div className="result-arrow"></div>
                                    <div className="result-value" style={{fontSize:'14px'}}>
                                        {res.reward}
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <button className="modal-close-btn" onClick={() => setShowResultModal(false)}>
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ladder;