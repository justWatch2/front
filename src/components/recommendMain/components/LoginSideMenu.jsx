import React, { useState } from 'react';
import { Button } from '@mui/material';
import '../styles/LoginSideMenu.css';

function LoginSideMenu({ open, onClose }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function testProtectedApi() {
        const token = localStorage.getItem('jwt');
        fetch('http://localhost:8080/api/protected/test', {
            method: 'GET',
            headers: { Authorization: token },
        })
            .then((res) => {
                if (res.status === 401) {
                    console.warn('401 Unauthorized 발생 → 토큰 만료');
                    alert('토큰 만료됨. refresh 요청을 시도합니다.');
                    return fetch('http://localhost:8080/api/auth/refresh', {
                        method: 'POST',
                        credentials: 'include',
                    });
                } else if (res.ok) {
                    alert('정상 응답');
                } else {
                    alert('예상치 못한 오류 발생: ' + res.status);
                }
            })
            .then(async (refreshRes) => {
                if (!refreshRes) return;
                if (refreshRes.ok) {
                    const newToken = refreshRes.headers.get('Authorization');
                    if (newToken) {
                        localStorage.setItem('jwt', newToken);
                        alert('newAccessToken 성공! 새로운 JWT 저장됨');
                    } else {
                        alert('newAccessToken 성공 but 토큰 없음');
                    }
                } else {
                    alert('refresh 실패: ' + refreshRes.status);
                }
            })
            .catch((err) => {
                console.error('오류 발생:', err);
                alert('에러: ' + err.message);
            });
    }

    function login() {
        const memberId = username;
        const memberPw = password;
        fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ memberId, memberPw }),
        })
            .then(async (res) => {
                const token = res.headers.get('Authorization');
                let body = {};
                try {
                    body = await res.json();
                    alert('응답 내용:\n' + JSON.stringify(body, null, 2));
                } catch (e) {
                    console.warn('JSON 파싱 실패 (본문 없음일 수 있음):', e);
                }
                if (res.ok && token) {
                    localStorage.setItem('jwt', token);
                    alert('로그인 성공! JWT 저장됨\nToken: ' + token);
                    window.location.href = '/';
                } else {
                    alert('로그인 실패: ' + (body?.message || '알 수 없는 오류'));
                }
            })
            .catch((err) => alert('에러: ' + err));
    }

    return (
        <div className={`login-side-menu ${open ? 'open' : ''}`}>
            <button onClick={onClose} className="login-side-menu-close">
                X
            </button>
            <ul className="login-side-menu-list">
                <li>
                    <input
                        type="text"
                        placeholder="아이디"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="login-side-menu-input"
                    />
                </li>
                <li>
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-side-menu-input"
                    />
                </li>
                <li>
                    <button
                        className="login-side-menu-button login-side-menu-button-primary"
                        onClick={login}
                    >
                        로그인
                    </button>
                </li>
                <li>
                    <h6 className="login-side-menu-title">소셜 로그인</h6>
                    <a href="/ttt/oauth2/authorization/google" className="login-side-menu-link">
                        Google 로그인
                    </a>
                    <a href="/ttt/oauth2/authorization/facebook" className="login-side-menu-link">
                        Facebook 로그인
                    </a>
                    <a href="/ttt/oauth2/authorization/naver" className="login-side-menu-link">
                        Naver 로그인
                    </a>
                    <a href="/ttt/oauth2/authorization/kakao" className="login-side-menu-link">
                        Kakao 로그인
                    </a>
                </li>
                <li>
                    <button
                        className="login-side-menu-button login-side-menu-button-secondary"
                        onClick={testProtectedApi}
                    >
                        refreshToken확인
                    </button>
                </li>
                <li>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={onClose}
                        className="login-side-menu-button login-side-menu-button-tertiary"
                    >
                        숨기기
                    </Button>
                </li>
            </ul>
        </div>
    );
}

export default LoginSideMenu;