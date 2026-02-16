import { useState, useEffect, useCallback } from 'react';

/**
 * useDraftLogic Hook (통합 버전)
 * - 멤버 관리 (추가, 삭제, 초기화)
 * - 유틸리티 (셔플, 뽑기) -> CardPick 등에서 사용
 * - 사다리 로직 (생성, 추적, 경로) -> Ladder에서 사용
 */
export const useDraftLogic = () => {
    // [Part 1] 멤버 데이터 관리
    const [members, setMembers] = useState(() => {
        const savedMembers = localStorage.getItem('sylk_members');
        return savedMembers ? JSON.parse(savedMembers) : [];
    });

    useEffect(() => {
        localStorage.setItem('sylk_members', JSON.stringify(members));
    }, [members]);

    // 멤버 추가
    const addMember = useCallback((name) => {
        const trimmedName = name.trim();
        if (!trimmedName) return;

        // 30명 제한 로직 (사용자 코드 기준 유지)
        if (members.length >= 30) {
            alert('최대 30명까지만 추가할 수 있습니다.');
            return;
        }

        // 이름 중복 체크
        if (members.some(member => member.name === trimmedName)) {
            alert('이미 존재하는 이름입니다.');
            return;
        }
        
        // 멤버 추가
        setMembers(prev => [...prev, { id: Date.now(), name: trimmedName }]);
    }, [members]);

    // 멤버 개별 삭제
    const removeMember = useCallback((id) => {
        setMembers(prev => prev.filter(member => member.id !== id));
    }, []);

    // ★ [추가된 기능] 멤버 전체 초기화 (모두 삭제)
    const resetMembers = useCallback(() => {
        if (members.length === 0) return; // 지울 게 없으면 리턴
        
        if (window.confirm('정말 모든 멤버를 삭제하시겠습니까?')) {
            setMembers([]); // 빈 배열로 초기화
        }
    }, [members]);

    // [Part 2] 유틸리티 함수
    // 배열 섞기 (Fisher-Yates Shuffle) - 카드 뽑기에서 사용
    const shuffle = useCallback((array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }, []);

    // 하나 뽑기
    const pickOne = useCallback((array) => {
        if (!array || array.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }, []);


    // [Part 3] 사다리 타기 로직 (Ladder 컴포넌트용)
    // 1. 사다리 구조 생성
    const generateLadder = useCallback((memberCount) => {
        if (memberCount < 2) return [];
        const rows = 8;
        const newLadder = [];

        for (let r = 0; r < rows; r++) {
            const rowData = [];
            for (let c = 0; c < memberCount - 1; c++) {
                let hasBridge = Math.random() < 0.5;
                if (c > 0 && rowData[c - 1]) hasBridge = false;
                rowData.push(hasBridge);
            }
            newLadder.push(rowData);
        }
        return newLadder;
    }, []);

    // 2. 결과 추적
    const tracePath = useCallback((ladderData, startIdx) => {
        let currentIdx = startIdx;
        for (let r = 0; r < ladderData.length; r++) {
            const row = ladderData[r];
            if (currentIdx < row.length && row[currentIdx]) {
                currentIdx++;
            } else if (currentIdx > 0 && row[currentIdx - 1]) {
                currentIdx--;
            }
        }
        return currentIdx;
    }, []);

    // 3. 경로 좌표 계산
    const getLadderPath = useCallback((ladderData, startIdx) => {
        let currentIdx = startIdx;
        const path = []; 
        path.push({ r: -1, c: currentIdx }); 

        for (let r = 0; r < ladderData.length; r++) {
            const row = ladderData[r];
            path.push({ r: r, c: currentIdx }); 

            if (currentIdx < row.length && row[currentIdx]) {
                currentIdx++;
                path.push({ r: r, c: currentIdx }); 
            } else if (currentIdx > 0 && row[currentIdx - 1]) {
                currentIdx--;
                path.push({ r: r, c: currentIdx }); 
            }
        }
        path.push({ r: ladderData.length, c: currentIdx });
        return path;
    }, []);

    // 모든 함수를 반환 (resetMembers 포함됨)
    return {
        members,
        addMember,
        removeMember,
        resetMembers, // 외부에서 쓸 수 있게 반환
        shuffle,      
        pickOne,    
        generateLadder,
        tracePath,
        getLadderPath,
    };
};