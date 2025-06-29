import React, { useContext } from 'react';
import { RecommendationContext } from '../RecommendationContext';
import '../styles/MemberModeButton.css';

const MemberModeButton = () => {
    const { isLoggedIn, isMemberModeActive, toggleMemberMode } = useContext(RecommendationContext);

    return (
        <button
            className={`member-mode-button ${isMemberModeActive ? 'active' : ''}`}
            onClick={toggleMemberMode}
            disabled={!isLoggedIn}
            title={isLoggedIn ? (isMemberModeActive ? '회원 모드 활성화됨' : '일반 모드') : '로그인 후 사용 가능'}
        >
            {isLoggedIn ? (isMemberModeActive ? '✨ 회원 추천 모드' : '일반 추천 모드') : '🔒 일반 추천 모드'}
        </button>
    );
};

export default MemberModeButton;