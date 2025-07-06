import React, { useState, useEffect, useContext } from "react"; // useContext 추가
import { RecommendationContext } from '../recommendMain/RecommendationContext'; // Context 경로 추가
import SignUP from "../login/SignUp";
import {jwtDecode} from "jwt-decode";


function LoginDropdown({ onClose, loginButtonRect }) {
  // 1. Context에서 로그인 처리 함수를 가져옵니다.
  const { handleLogin: handleLoginContext } = useContext(RecommendationContext);

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);

  // 로그인 부분 (사용자님의 기존 로직을 기반으로 수정)
  function handleLogin() {
    fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ memberId: id, memberPw: password }),
    })
        .then(async res => {
          // [유지] 요청하신 console.log는 그대로 둡니다.
          console.log("응답 상태 코드:", res.status);
          const token = res.headers.get("Authorization");
          console.log("res.ok:", res.ok);
          console.log("Authorization 토큰:", token);
          let body = {};
          try {
            body = await res.json();
            alert("응답 내용:\n" + JSON.stringify(body, null, 2));
          } catch (e) {
            console.warn("JSON 파싱 실패 (본문 없음일 수 있음):", e);
          }

          if (res.ok && token) {
            // [유지] 로그인 성공 alert는 그대로 둡니다.
            alert("로그인 성공! JWT 저장됨\nToken: " + token);

            // [핵심 변경] localStorage 직접 조작 대신, Context의 함수를 호출합니다.
            // 이 함수가 localStorage 저장과 상태 변경을 모두 처리합니다.
            handleLoginContext(token);

            // 로그인 성공 후 드롭다운을 닫습니다.
            if (onClose) onClose();

            // window.location.href = "/"; // 페이지를 새로고침하는 대신 상태 변경으로 UI가 업데이트되도록 합니다.
          } else {
            if (res.status === 401) {
              let errorBody = null;
              try {
                const text = await res.text();
                errorBody = JSON.parse(text);
              } catch (e) {
                console.warn("401 응답 본문 파싱 실패:", e);
              }
              const message = errorBody?.message || "로그인 실패";
              if (message.includes("이미 로그인된 계정")) {
                alert("이미 로그인된 계정입니다. 다른 아이디로 로그인해주세요.");
              } else {
                alert(message);
              }
            }
          }
        })
        .catch(error => {
          console.error("Login fetch error:", error);
        });
  };

  const handleSignUp = () => {
    setShowSignUp(true);
  };

  const SOCIAL_LOGIN_URLS = {
    google: "http://localhost:8080/oauth2/authorization/google",
    facebook: "http://localhost:8080/oauth2/authorization/facebook",
    kakao: "http://localhost:8080/oauth2/authorization/kakao",
  };

  // 소셜 로그인 (Context와 연동되도록 수정)
  function socialLoginPopup(provider) {
    const url = SOCIAL_LOGIN_URLS[provider];
    const width = 500, height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;
    const popup = window.open(url, "SocialLoginPopup", `width=${width},height=${height},left=${left},top=${top}`);

    const messageHandler = (event) => {
      // 보안을 위해 origin 체크 (개발 환경과 서버 환경 모두 허용)
      if (event.origin !== "http://localhost:8080" && event.origin !== "http://localhost:3000") return;

      // 백엔드에서 token과 userId를 함께 보내준다고 가정합니다.
      if (event.data?.token) {

        // 소셜 로그인 성공 시에도 Context 함수를 호출하여 상태를 일관되게 관리합니다.
        handleLoginContext(event.data.token);
        if (onClose) onClose();
        window.removeEventListener("message", messageHandler);
      }
    };
    window.addEventListener("message", messageHandler);
  }

  // 로그인 버튼의 위치에 따라 드롭다운 위치 동적 설정
  useEffect(() => {
    if (loginButtonRect) {
      const dropdown = document.querySelector(".login-dropdown");
      if (dropdown) {
        dropdown.style.left = `${loginButtonRect.left}px`;
        dropdown.style.top = `${loginButtonRect.top}px`;
      }
    }
  }, [loginButtonRect]);

  return (
      <div className="login-dropdown">
        <div className="dropdown-content">
          <div className="login-form">
            <div className="input2-group">
              <label>아이디:</label>
              <input type="text" value={id} onChange={(e) => setId(e.target.value)} placeholder="아이디를 입력하세요" />
            </div>
            <div className="input2-group">
              <label>비밀번호:</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력하세요" />
            </div>
            <button className="login-button" onClick={handleLogin}>로그인</button>
            <button className="signup-button" onClick={handleSignUp}>회원가입</button>
            {showSignUp && (
                <div className="modal-overlay">
                  <SignUP onClose={() => setShowSignUp(false)} />
                </div>
            )}
          </div>
          <div className="social-login-options">
            <button className="social-button" onClick={() => socialLoginPopup("kakao")}>카카오톡 로그인</button>
            <button className="social-button" onClick={() => socialLoginPopup("facebook")}>페이스북 로그인</button>
            <button className="social-button" onClick={() => socialLoginPopup("google")}>구글 로그인</button>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
      </div>
  );
}

export default LoginDropdown;