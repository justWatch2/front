import React, { useState, useEffect, useContext } from "react";
import { RecommendationContext } from "../recommendMain/RecommendationContext";
import "./Nav.css";
import LoginDropdown from "./LoginDropdown";
import ProfileDropdown from "./ProfileDropdown";
import { Link, useNavigate } from "react-router-dom";
import logo from "../search/assets/waffle.png";
import profileLogo from "./img/ProfileLogo.png";

export default function Nav() {
    // 1. Context에서 모든 로그인/유저 정보를 가져옵니다.
    const { isLoggedIn, userId, handleLogout } = useContext(RecommendationContext);

    // 2. Nav 컴포넌트 자체의 UI 상태만 관리합니다.
    const [show, setShow] = useState(false);
    const [showLoginDropdown, setShowLoginDropdown] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setShow(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    const storedImgUrl = localStorage.getItem("img");

    const profileImageSrc = storedImgUrl ? "http://localhost:8080" + storedImgUrl : profileLogo;

    return (
        <nav className={`nav2 ${show && "nav2__black"}`}>
            <div className="nav__left">
                <img alt="waffle logo" src={logo} className="nav__logo" onClick={() => navigate('/')} />
                <Link style={{ textDecoration: "none" }} to={"/search"}><h2 className="nav__recommend">검색</h2></Link>
                <Link style={{ textDecoration: "none" }} to={"/recommend/main"}><h2 className="nav__recommend">추천</h2></Link>
                <Link style={{ textDecoration: "none" }} to={"/recommend/friend"}><h2 className="nav__recommend">친구 추천</h2></Link>
                <Link style={{ textDecoration: "none" }} to={"/post"}><h2 className="nav__recommend">게시판</h2></Link>
            </div>
            <div className="nav__right">
                {/* 3. Context의 isLoggedIn 상태에 따라 UI를 분기합니다. */}
                {!isLoggedIn ? (
                    <>
                        <button className="nav__login" onClick={() => setShowLoginDropdown(true)}>로그인</button>
                        {showLoginDropdown && <LoginDropdown onClose={() => setShowLoginDropdown(false)} />}
                    </>
                ) : (
                    <>
                        {/* 4. Context의 userId를 표시합니다. */}
                        <span className="nav__user-id">{userId}님</span>
                        <img alt="User profile" src={profileImageSrc} className="nav__avater" onClick={() => setShowProfileDropdown(prev => !prev)} />
                        {/* 5. 로그아웃 버튼에 Context의 handleLogout 함수를 연결합니다. */}
                        {showProfileDropdown && <ProfileDropdown onLogout={() => { handleLogout(); setShowProfileDropdown(false); }} />}
                    </>
                )}
            </div>
        </nav>
    );
}