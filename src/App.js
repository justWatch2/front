import React, { useState, useEffect } from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import Nav from "./components/Nav";
import FriendRecommend from "./components/recommendFriend/FriendRecommend";
import {Route, BrowserRouter as Router, Routes, useNavigate} from "react-router-dom";
import Main from "./components/Main";
import Home  from "./components/search/Home.jsx";
import Detail from "./components/search/Detail";
import Posts from "./components/board/Posts";
import Write from "./components/board/Write";
import Post from "./components/board/Post";
import RecommendReal from "./recommendReal.jsx";
import {autoRefreshCheck} from "./tokenUtils/TokenUtils";



function App() {
  const [isLoggedIn2, setIsLoggedIn2] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);



  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const urlParams = new URLSearchParams(window.location.search);

    if (token) {
      setIsLoggedIn2(true);
      tryInviteFriend();
    }
    const inviteUuid = urlParams.get("uuid");
    if (inviteUuid) {
      localStorage.setItem("uuid", inviteUuid);
      alert("uuid 초대 저장");
      alert(inviteUuid);
    }

  }, []);

  const tryInviteFriend = async () => {
    const inviteUuid = localStorage.getItem("uuid");
    if (!inviteUuid) return;

    try {
      const response = await autoRefreshCheck({
        url: "http://localhost:8080/api/friend/invite",
        method: "POST",
        data: { uuid: inviteUuid },
        headers: { "Content-Type": "application/json" }
      });

      if (response.status === 200) {
        alert("친구 추가 성공!");
        localStorage.removeItem("uuid");
      } else {
        alert("친구 추가 실패");
      }
    } catch (error) {
      console.error("친구 초대 에러:", error);
      if (error.response?.status === 406) {
        alert("이미 친구입니다! 또는 탈퇴한 id입니다.");
        localStorage.removeItem("uuid");
      } else {
        alert("친구 추가 중 에러가 발생했습니다.");
      }
    }
  };



  const handleLoginClick = () => {
    setIsLoggedIn2(true); // 임시로 로그인 상태 변경
    localStorage.setItem("isLoggedIn2", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn2(false);
    setShowProfileDropdown(false);
    localStorage.removeItem("isLoggedIn2");
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  return (
    <div className="App">

      <Router>
        <Nav
            isLoggedIn2={isLoggedIn2}
            onLoginClick={handleLoginClick}
            onLogout={handleLogout}
            onProfileClick={handleProfileClick}
            showProfileDropdown={showProfileDropdown}
        />
        <Routes>
          <Route path="/" element={<Main/>}></Route>

          <Route path="/recommend/main" element={<RecommendReal/>}></Route>
          <Route path="/recommend/friend" element={<FriendRecommend />}></Route>

          <Route path="/post" element={<Posts/>}></Route>
          <Route path="/write/:id" element={<Write />} />
          <Route path="/post/:postNo" element={<Post />} />

          <Route path="/post/detaile/:no" element={""}></Route>

          <Route path="/search" element={<Home/>}></Route>
          <Route path="/search/detail/:category/:id" element={<Detail/>}></Route>
          <Route path="/mypage" element={""}></Route>

        </Routes>
      </Router>
    </div>
  );
}

export default App;