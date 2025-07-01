import React, {useContext, useEffect, useState} from "react";
import "./Nav.css";
import LoginDropdown from "./recommendFriend/LoginDropdown";
import ProfileDropdown from "./recommendFriend/ProfileDropdown";
import {Link, useNavigate} from "react-router-dom";
import logo from "./search/assets/waffle.png";
import {RecommendationContext} from "./recommendMain/RecommendationContext";
import "./recommendMain/styles/Header.css";
import profileLogo from "./recommendFriend/img/ProfileLogo.png";
import InviteModal from "./recommendFriend/InviteModal";
import {autoRefreshCheck} from "../tokenUtils/TokenUtils";

export default function Nav({
                                onClickRecommend,
                                isLoggedIn2,
                                onLoginClick,
                                onLogout,
                                onProfileClick,
                                showProfileDropdown,
                            }) {
    const [search, setSearch] = useState("");
    const [show, setShow] = useState(false);
    const [showLoginDropdown, setShowLoginDropdown] = useState(false);
    const navigate = useNavigate();
// 자동 친구 추가 기능 state 추가
    const [invites, setInvites] = useState([]);
    const [showInviteModal, setShowInviteModal] = useState(false);

    const {
        clearRecommendations,
        isLoggedIn,
        setIsLoggedIn,
        userId,
        setUserId,
        isMemberModeActive,
        setIsMemberModeActive
    } = useContext(RecommendationContext);

    const toggleMemberMode = () => {
        if (isLoggedIn) {
            setIsMemberModeActive(prev => !prev);
            clearRecommendations();
        } else {
            alert('테스트를 위해 로그인 및 회원 모드를 활성화합니다.');
            setIsLoggedIn(true);
            setUserId('crazyman'); // 임시 사용자 ID 'crazyman'
            setIsMemberModeActive(true);
            clearRecommendations();
        }
    };

     function handleProfileImg() {
        if (isLoggedIn2) {
            checkToken({
                method: "get",
                url: "http://localhost:8080/api/getProfileImg",
            }).then(res => {
                console.log(res.data);
                if (res.data != null) {
                    setProfileImg(res.data);
                }
            })
        }
    }

    useEffect(() => {
        handleProfileImg();
    }, [isLoggedIn2]);


    useEffect(() => {
        const handleScroll = () => {
            setShow(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // 로그인 후 드롭다운 닫기와 상태 변경을 한 번에 처리

    const handleLoginSuccess = async () => {
        onLoginClick(); // RecommendReal 상태 변경
        setShowLoginDropdown(false); // 드롭다운 닫기

        await tryInviteFriend()
    };

    const tryInviteFriend = async () => {
        // uuid로 시작하는 토큰들 싸그리 모아서 확인한다.
        const uuidTokens = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("uuid")) {
                uuidTokens.push({
                    key: key,
                    value: localStorage.getItem(key),
                });
            }
        }
        if (uuidTokens.length < 1) {

            return;
        }
        try {
            const response = await autoRefreshCheck({
                url: "http://localhost:8080/api/friend/nicknameByUuids",
                method: "POST",
                data: {
                    uuids: uuidTokens.map((item) => item.value),
                },
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const enriched = uuidTokens.map((item) => ({
                key: item.key,
                uuid: item.value,
                nickname: response.data[item.value] || "알 수 없음",
            }));


            setInvites(enriched);
            setShowInviteModal(true);

        } catch (error) {
            console.error("초대 닉네임 로드 실패:", error);
        }
    };

    function handleRecommend() {
        const jwt = localStorage.getItem("jwt");
        if (jwt) {
            navigate("/recommend/friend");
        } else {
            alert("로그인이 필요합니다.")
        }
    }

    return (
        <nav className={`nav2 ${show && "nav2__black"}`}>
            <div className="nav__left">
                <img
                    alt="waffle logo"
                    src={logo}
                    className="nav__logo"
                    onClick={() => navigate('/')}
                />
                <Link style={{textDecoration: "none"}} to={"/search"}><h2 className="nav__recommend">
                    검색
                </h2></Link>
                <Link style={{textDecoration: "none"}} to={"/recommend/main"}><h2 className="nav__recommend">
                    추천
                </h2></Link>
                <h2 className="nav__recommend" onClick={handleRecommend}>
                    추천 with Friends
                </h2>

                <Link style={{textDecoration: "none"}} to={"/post"}><h2 className="nav__recommend">
                    게시판
                </h2></Link>
            </div>

            {/*자동 친구 추가 모달 창 부분*/}
            {showInviteModal && (
                <InviteModal
                    invites={invites}
                    onAccept={(acceptedKey) => {
                        setInvites((prev) => prev.filter((inv) => inv.key !== acceptedKey));
                    }}
                    onClose={() => {
                        setShowInviteModal(false);

                    }}
                />
            )}
            <button
                className={`header-icon-button member-mode-toggle ${isMemberModeActive ? 'active glowing-rainbow' : ''}`}
                onClick={toggleMemberMode}
                title={isMemberModeActive ? '회원 모드 활성화됨' : '회원 모드 비활성화됨'}
            >
                <i className={`fas ${isMemberModeActive ? 'fa-user-check' : 'fa-user'}`}></i>
                {isLoggedIn && <span className="member-mode-text">{isMemberModeActive ? '회원 모드' : '일반 모드'}</span>}
                {!isLoggedIn && <span className="member-mode-text">로그인</span>}
            </button>

            <div className="nav__right">
                {!isLoggedIn2 ? (
                    <>
                        <button
                            className="nav__login"
                            onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                        >
                            로그인
                        </button>
                        {showLoginDropdown && (
                            <LoginDropdown
                                onClose={() => setShowLoginDropdown(false)}
                                onLoginSuccess={handleLoginSuccess}
                            />
                        )}
                    </>
                ) : (
                    <>
                        <img
                            alt="User profile"
                            src={profileImg !== "" ? profileImg : profileLogo}
                            className="nav__avater"
                            onClick={onProfileClick}
                        />
                        {showProfileDropdown && <ProfileDropdown onLogout={onLogout}/>}
                    </>
                )}
            </div>
        </nav>
    );
}
