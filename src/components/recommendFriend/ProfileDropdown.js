import React from "react";
import {autoRefreshCheck} from "../../tokenUtils/TokenUtils";
import KakaoFriendInvite from "./KakaoInviteButton";

function ProfileDropdown({onLogout}) {

    //로그아웃
    // async function onLogout() {
    //     const token = localStorage.getItem("jwt");

    //     if (!token) {
    //         alert("로그인된 상태가 아닙니다.");
    //         return;
    //     }
    //     try {
    //         await autoRefreshCheck({
    //             method: "POST",
    //             url: "http://localhost:8080/api/logout",
    //         });
    //         localStorage.removeItem("jwt");
    //         alert("로그아웃 완료!");
    //         window.location.href = "/";
    //     } catch (error) {
    //         console.error("로그아웃 실패:", error);
    //         alert("로그아웃 중 오류 발생");
    //     }
    // }


    return (
        <div className="profile-dropdown">
            <button className="dropdown-item" onClick={() => console.log("마이페이지로 이동")}>
                마이페이지
            </button>

            <KakaoFriendInvite/>

            <button className="dropdown-item" onClick={onLogout}>
                로그아웃
            </button>
        </div>
    );
}

export default ProfileDropdown;