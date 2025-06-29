import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import './Movie_Loginbar.css';
import {Button} from "@mui/material";  // 추가 스타일은 여기에 작성
import axios from 'axios';

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
            console.log(token);

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
                    let errorBody = null;
                    try {
                        const text = await refreshRes.text();  // 먼저 텍스트로 받아서
                        errorBody = JSON.parse(text);  // JSON으로 변환 시도
                    } catch (e) {
                        console.warn("401 응답 본문 파싱 실패:", e);
                    }

                    const message = errorBody?.message || "로그인 실패";
                    alert(message);
                }
            })
            .catch(err => {
                console.error("오류 발생:", err);
                alert("에러: " + err.message);
            });
    }

    async function logout() {
        const token = localStorage.getItem("jwt");

        if (!token) {
            alert("로그인된 상태가 아닙니다.");
            return;
        }

        try {
            // 1차 로그아웃 시도
            await axios.post("http://localhost:8080/api/logout", {}, {
                headers: {
                    Authorization: token
                },
                withCredentials: true  // axios에서는 이렇게 쿠키저장 옵션을 넣어야된다.
            });

            // 로그아웃 성공 처리
            localStorage.removeItem("jwt");
            alert("로그아웃 완료!");
            window.location.href = "/";

        } catch (error) {
            if (error.response?.status === 401) {
                console.warn("AccessToken 만료됨. 재발급 시도 중...");

                try {
                    // AccessToken 재발급 시도
                    const refreshRes = await axios.post("http://localhost:8080/api/auth/refresh", {}, {
                        withCredentials: true // refreshToken 쿠키 포함
                    });

                    const newToken = refreshRes.headers["authorization"];
                    if (newToken) {
                        // AccessToken 갱신
                        localStorage.setItem("jwt", newToken);

                        // 다시 로그아웃 시도
                        await axios.post("http://localhost:8080/api/logout", {}, {
                            headers: {
                                Authorization: newToken
                            },
                            withCredentials: true
                        });

                        localStorage.removeItem("jwt");
                        alert("토큰 만료되고 나서 로그아웃 완료!");
                        window.location.href = "/";
                    } else {
                        throw new Error("토큰 재발급 실패");
                    }
                } catch (refreshErr) {
                    alert("세션이 만료되어 자동 로그아웃 되었습니다.");
                    localStorage.removeItem("jwt");
                    window.location.href = "/";
                }
            } else {
                console.error("로그아웃 중 오류:", error);
                alert("로그아웃 실패: 서버 오류");
            }
        }
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
                console.log("응답 상태 코드:", res.status);  // 👈 여기에 찍히는 값이 401인가요?
                const token = res.headers.get("Authorization");
                console.log("res.ok:", res.ok);
                console.log("Authorization 토큰:", token);
                let body = {};
                try {
                    body = await res.json();  // 응답 body가 없으면 여기서 오류 발생함
                    // JSON 응답 내용을 alert로 보기 좋게 출력
                    alert("응답 내용:\n" + JSON.stringify(body, null, 2));
                } catch (e) {
                    console.warn("JSON 파싱 실패 (본문 없음일 수 있음):", e);
                }
                if (res.ok && token) {
                    localStorage.setItem("jwt", token);
                    alert("로그인 성공! JWT 저장됨\nToken: " + token);
                    window.location.href = "/";
                } else {
                    if (res.status === 401) {
                        let errorBody = null;
                        try {
                            const text = await res.text();  // 먼저 텍스트로 받아서
                            errorBody = JSON.parse(text);  // JSON으로 변환 시도
                        } catch (e) {
                            console.warn("401 응답 본문 파싱 실패:", e);
                        }

                        const message = errorBody?.message || "로그인 실패";
                        console.log(message);
                        console.log(errorBody);

                        if (message.includes("이미 로그인된 계정")) {
                            alert("이미 로그인된 계정입니다. 다른 아이디로 로그인해주세요.");
                        } else {
                            alert(message);
                        }
                    }
                }
            })
            .catch(error => {

            });
    }

    function join() {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        axios.post("http://localhost:8080/api/join", {
            memberId:  username,
            memberPw:  password
        })
            .then(res => {
                alert("회원가입 성공!");
            })
            .catch(err => {
                if (err.response) {
                    alert("회원가입 실패: " + err.response.data);
                } else {
                    alert("에러: " + err.message);
                }
            });
    }

    return (
        <div className="header bg-dark text-white d-flex justify-content-between align-items-center p-3">
            <h5 className="m-0">My Movie App</h5>

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
                <li className="py-2 border-bottom px-3"><button onClick={logout}>로그아웃</button></li>
                <li className="py-2 border-bottom px-3"><button onClick={join}>회원가입</button></li>
                <h2>2. 소셜 로그인</h2>
                <a href="http://localhost:8080/oauth2/authorization/google">Google 로그인</a><br />
                <a href="http://localhost:8080/oauth2/authorization/facebook">Facebook 로그인</a><br />
                <a href="http://localhost:8080/oauth2/authorization/naver">Naver 로그인</a><br />
                <a href="http://localhost:8080/oauth2/authorization/kakao">kakao 로그인</a><br />
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
