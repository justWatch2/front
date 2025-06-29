import React from "react";
import KakaoFriendInvite from "./KakaoInviteButton";
// 기존 CSS 파일을 그대로 사용합니다.

// 부모(Nav)로부터 onLogout 함수를 props로 받습니다.
function ProfileDropdown({ onLogout }) {

    // 내부에 별도의 로그아웃 로직은 없습니다.

    return (
        // [복원] 기존 UI 구조를 그대로 사용합니다.
        <div className="profile-dropdown">
            <button className="dropdown-item" onClick={() => alert("마이페이지로 이동")}>
                마이페이지
            </button>

            <KakaoFriendInvite />

            {/* [핵심] 로그아웃 버튼 클릭 시, props로 받은 onLogout 함수를 실행합니다. */}
            <button className="dropdown-item" onClick={onLogout}>
                로그아웃
            </button>
        </div>
    );
}

export default ProfileDropdown;