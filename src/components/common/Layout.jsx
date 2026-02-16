import React, { forwardRef } from 'react';

const Layout = forwardRef(({ children }, ref) => { 
    return (
        /* 1. 전체 통 잡기: App.css에서 설정한 중앙 정렬 적용 */
        <div className="layout-container" ref={ref}>
            {/* 2. 역할: App.js에서 감싼 내용물(children)들을 여기에 뿌려줌 */}
            {children}
        </div>
    );
});

export default Layout;
