
import React, { useState, useEffect } from "react";
import SignUP from "../login/SignUp"
import {useNavigate} from "react-router-dom";

function LoginDropdown({ onClose, onLoginSuccess, loginButtonRect }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  //회원가입
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();

  //로그인 부분
  function handleLogin() {
    fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',  // 쿠키 포함 필수!
      body: JSON.stringify({memberId: id, memberPw: password}),
    })
        .then(async res => {
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
            localStorage.setItem("jwt", token);
            alert("로그인 성공! JWT 저장됨\nToken: " + token);
            // await tryInviteFriend();
            // window.location.href = "/";
            // window.location.reload();
            //  로그인 상태 반영
            if (onLoginSuccess) onLoginSuccess();
            //  모달 닫기
            if (onClose) onClose();
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

  //소셜 로그인
  function socialLoginPopup(provider, onSuccess) {

    const url = SOCIAL_LOGIN_URLS[provider];
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;

    const popup = window.open(
        url,
        "SocialLoginPopup",
        `width=${width},height=${height},left=${left},top=${top}`
    );

    const messageHandler = (event) => {
      // 실제 운영 시 event.origin 체크 필수
      if (event.data?.token) {
        localStorage.setItem("jwt", event.data.token);
        //  로그인 상태 반영
        if (onLoginSuccess) onLoginSuccess();

        //  모달 닫기
        if (onClose) onClose();

        //  이벤트 리스너 제거
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
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="아이디를 입력하세요"
            />
          </div>
          <div className="input2-group">
            <label>비밀번호:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
            />
          </div>
          <button className="login-button" onClick={handleLogin}>
            로그인
          </button>
          <button className="signup-button" onClick={handleSignUp}>
            회원가입
          </button>
          {/* 회원가입 모달 */}
          {showSignUp && (
              <div className="modal-overlay">
                <SignUP onClose={() => setShowSignUp(false)} />
              </div>
          )}
        </div>
        <div className="social-login-options">
          <button className="social-button" onClick={() => socialLoginPopup("kakao")}>
            카카오톡 로그인
          </button>
          <button className="social-button" onClick={() => socialLoginPopup("facebook")}>
            페이스북 로그인
          </button>
          <button className="social-button" onClick={() => socialLoginPopup("google")}>
            구글 로그인
          </button>
        </div>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>
    </div>


  );
}

export default LoginDropdown;