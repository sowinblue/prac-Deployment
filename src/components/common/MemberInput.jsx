// src/components/common/MemberInput.jsx 전체 덮어쓰기

import React, { useState, useEffect } from 'react';

const MemberInput = ({ members, onAddMember, onRemoveMember, onResetMembers }) => {
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        let currentError = '';
        if (inputValue) {
            if (/^[0-9]/.test(inputValue)) currentError = '이름은 숫자로 시작할 수 없습니다.';
            else if ((inputValue.match(/[0-9]/g) || []).length > 8) currentError = '숫자가 너무 많습니다.';
        }
        setError(currentError);
    }, [inputValue]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
            
            {/* 제목 */}
            <h2 className="member-input-title" style={{ textAlign: 'center', marginBottom: '20px', color: '#4e342e' }}>
                멤버 입력 ({members.length}명)
            </h2>
            
            {/* 입력창 + 버튼 (가로 꽉 채움) */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', width: '100%' }}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onAddMember(inputValue);
                            setInputValue(''); // 입력값 초기화
                        }
                    }}
                    placeholder="이름 입력"
                    className="member-input-field"
                    style={{ 
                        flex: 1, 
                        borderRadius: '12px', 
                        padding: '12px 20px', 
                        border: '1px solid #d7ccc8',
                        fontSize: '15px',
                        outline: 'none'
                    }}
                />
                <button 
                    onClick={() => { onAddMember(inputValue); setInputValue(''); }}
                    className="add-member-button"
                    style={{ 
                        borderRadius: '12px', 
                        padding: '0 24px', 
                        fontWeight: 'bold',
                        backgroundColor: '#6d4c41',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    추가
                </button>
                <button 
                    onClick={onResetMembers}
                    style={{ 
                        borderRadius: '12px', 
                        padding: '0 16px', 
                        border: '1px solid #ffcdd2', 
                        background: '#ffebee', 
                        color: '#c62828', 
                        fontWeight: 'bold', 
                        cursor: 'pointer' 
                    }}
                >
                    초기화
                </button>
            </div>

            {error && <p style={{ color: '#d32f2f', fontSize: '13px', marginLeft: '10px', marginTop: '0' }}>{error}</p>}

            {/* 멤버 리스트 박스 (App.css에서 스타일 제어됨) */}
            <div className="member-list-wrapper">
                {members.length === 0 ? (
                    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#a1887f' }}>
                        참여할 멤버를 추가해주세요!
                    </div>
                ) : (
                    members.map(m => (
                        <div key={m.id} className="member-tag">
                            <span>{m.name}</span>
                            <button onClick={() => onRemoveMember(m.id)} className="remove-member-button">×</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MemberInput;