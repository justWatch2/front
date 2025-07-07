import React, { useState, useEffect, useContext } from "react";
import { RecommendationContext } from "./recommendMain/RecommendationContext"; // 실제 경로에 맞게 수정해주세요.
import "./Nav.css";
import LoginDropdown from "./recommendFriend/LoginDropdown";
import ProfileDropdown from "./recommendFriend/ProfileDropdown";
import { Link, useNavigate } from "react-router-dom";
import logo from "./search/assets/content.png";
import profileLogo from "./recommendFriend/img/ProfileLogo.png";

export default function Nav() {
    // ✅ 1. Context에서 필요한 모든 상태와 함수를 가져옵니다.
    const { isLoggedIn, userId, userImgUrl, handleLogout } = useContext(RecommendationContext);

    const [show, setShow] = useState(false);
    const [showLoginDropdown, setShowLoginDropdown] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setShow(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // ✅ 2. localStorage를 직접 참조하지 않고, Context의 userImgUrl 상태를 사용합니다.
    const profileImageSrc = userImgUrl ? `http://localhost:8080${userImgUrl}` : profileLogo;

    return (
        <nav className={`nav2 ${show && "nav2__black"}`}>
            <div className="nav__left">
                <img alt="waffle logo" src={logo} className="nav__logo" onClick={() => navigate('/')} />
                <Link style={{ textDecoration: "none" }} to={"/search"}><h2 className="nav__recommend">검색</h2></Link>
                <Link style={{ textDecoration: "none" }} to={"/recommend/main"}><h2 className="nav__recommend">추천</h2></Link>
                <Link style={{ textDecoration: "none" }} to={"/recommend/friend"}><h2 className="nav__recommend">친구 추천</h2></Link>
                <Link style={{ textDecoration: "none" }} to={"/posts/common"}><h2 className="nav__recommend">게시판</h2></Link>
            </div>
            <div className="nav__right">
                {/* ✅ 3. Context의 isLoggedIn 상태에 따라 UI를 렌더링합니다. */}
                {!isLoggedIn ? (
                    <>
                        <button className="nav__login" onClick={() => setShowLoginDropdown(true)}>로그인</button>
                        {showLoginDropdown && <LoginDropdown onClose={() => setShowLoginDropdown(false)} />}
                    </>
                ) : (
                    <>
                        {/* ✅ 4. Context에서 받아온 최신 userId와 프로필 이미지를 사용합니다. */}
                        <span className="nav__user-id">{userId}님</span>
                        <img alt="User profile" src={profileImageSrc} className="nav__avater" onClick={() => setShowProfileDropdown(prev => !prev)} />
                        {showProfileDropdown && <ProfileDropdown onLogout={() => { handleLogout(); setShowProfileDropdown(false); }} />}
                    </>
                )}
            </div>
        </nav>
    );
}