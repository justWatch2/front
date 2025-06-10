import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import '../css/Movie_Loginbar.css';
import {Button} from "@mui/material";  // 추가 스타일은 여기에 작성
import { useEffect } from "react";

const Header = () => {
    const [isOpen, setMenu] = useState(false);

    const toggleMenu = () => {
        setMenu(prev => !prev);
    };
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (token) {
            localStorage.setItem("jwt", token);
            alert("소셜 로그인 성공 (JWT 저장됨)");

        }
    }, []);
    // // OAuth2 로그인 후 리디렉션으로 받은 JWT 저장 (예: /oauth2/success?token=xxx)
    // window.onload = function () {
    //     const urlParams = new URLSearchParams(window.location.search);
    //     const token = urlParams.get("token");
    //     if (token) {
    //         localStorage.setItem("jwt", token);
    //         alert("소셜 로그인 성공 (JWT 저장됨)");
    //         window.history.replaceState({}, document.title, "/"); // URL 정리
    //     }
    // };

    function testProtectedApi() {
        const token = localStorage.getItem("jwt");

        fetch("http://localhost:8080/api/protected/test", {
            method: "GET",
            headers: {
                "Authorization": token
            },
        })
            .then(res => {
                if (res.status === 401) {
                    console.warn("401 Unauthorized 발생 → 토큰 만료");
                    alert("토큰 만료됨. refresh 요청을 시도합니다.");

                    // accessToken이 만료되었으니 refreshToken 요청
                    return fetch("http://localhost:8080/api/auth/refresh", {
                        method: "POST",
                        credentials: "include"  // 쿠키 포함 필수!
                    });
                } else if (res.ok) {
                    alert("정상 응답");
                } else {
                    alert("예상치 못한 오류 발생: " + res.status);
                }
            })
            .then(async refreshRes => {
                if (!refreshRes) return;

                if (refreshRes.ok) {
                    const newToken = refreshRes.headers.get("Authorization");
                    if (newToken) {
                        localStorage.setItem("jwt", newToken);
                        alert("newAccessToken 성공! 새로운 JWT 저장됨");
                    } else {
                        alert("newAccessToken 성공 but 토큰 없음");
                    }
                } else {
                    alert("refresh 실패: " + refreshRes.status);
                }
            })
            .catch(err => {
                console.error("오류 발생:", err);
                alert("에러: " + err.message);
            });
    }


    function login() {
        const memberId = document.getElementById("username").value;
        const memberPw = document.getElementById("password").value;

        fetch("http://localhost:8080/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',  // 쿠키 포함 필수!
            body: JSON.stringify({ memberId, memberPw })
        })
            .then(async res => {
                const token = res.headers.get("Authorization");
                console.log("res.ok:", res.ok);
                console.log("Authorization 토큰:", token);
                let body = {};
                try {
                    body = await res.json();  // 응답 body가 없으면 여기서 오류 발생함
                    // JSON 응답 내용을 alert로 보기 좋게 출력
                    alert("응답 내용:\n" + JSON.stringify(body, null, 2));
                } catch (e) {
                    alert(e);
                    console.warn("JSON 파싱 실패 (본문 없음일 수 있음):", e);
                }

                if (res.ok && token) {
                    localStorage.setItem("jwt", token);
                    alert("로그인 성공! JWT 저장됨\nToken: " + token);
                    window.location.href = "/";
                } else {
                    alert("로그인 실패: " + (body?.message || "알 수 없는 오류"));
                }
            })
            .catch(err => alert("에러: " + err));
    }

    return (
        <div>


            {/* 메뉴 아이콘 오른쪽 */}
            <MenuIcon
                onClick={toggleMenu}
                style={{ cursor: 'pointer', color: 'white' }}
            />

            {/* 오른쪽 사이드 메뉴 */}
            <ul className={`side-menu ${isOpen ? 'show-menu' : 'hide-menu'} bg-secondary text-white`}>
                <li className="py-2 border-bottom px-3"><input type="text" id="username" placeholder="아이디" /></li>
                <li className="py-2 border-bottom px-3"><input type="password" id="password" placeholder="비밀번호" /></li>
                <li className="py-2 border-bottom px-3"><button onClick={login}>로그인</button></li>
                <h2>2. 소셜 로그인</h2>
                <a href="/ttt/oauth2/authorization/google">Google 로그인</a><br />
                <a href="/ttt/oauth2/authorization/facebook">Facebook 로그인</a><br />
                <a href="/ttt/oauth2/authorization/naver">Naver 로그인</a><br />
                <a href="/ttt/oauth2/authorization/kakao">kakao 로그인</a><br />
                <li className="py-2 border-bottom px-3">
                    <button onClick={testProtectedApi}>refreshToken확인</button>
                </li>
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={toggleMenu}
                >숨기기</Button>
            </ul>
        </div>
    );
};

export default Header;
