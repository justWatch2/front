import React from "react";
import KakaoFriendInvite from "./KakaoInviteButton";
// 1. react-router-dom에서 useNavigate를 import 합니다.
import { useNavigate } from "react-router-dom";

// 기존 CSS 파일을 그대로 사용합니다.

// 부모(Nav)로부터 onLogout 함수를 props로 받습니다.
function ProfileDropdown({ onLogout }) {
    // 2. navigate 함수를 초기화합니다.
    const navigate = useNavigate();

    // 3. 마이페이지로 이동하는 함수를 만듭니다.
    const goToMyPage = () => {
        navigate('/mypage');
    };

    return (
        // 기존 UI 구조를 그대로 사용합니다.
        <div className="profile-dropdown">
            {/* 4. '마이페이지' 버튼 클릭 시 goToMyPage 함수를 실행합니다. */}
            <button className="dropdown-item" onClick={goToMyPage}>
                마이페이지
            </button>

            <KakaoFriendInvite />

            {/* 로그아웃 버튼은 기존과 동일합니다. */}
            <button className="dropdown-item" onClick={onLogout}>
                로그아웃
            </button>
        </div>
    );
}

export default ProfileDropdown;
