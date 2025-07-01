import React, { useState, useEffect } from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import Nav from "./components/Nav";
import Banner from "./components/Banner";
import Row from "./components/Row";
import requests from "./api/requests";
import Footer from "./components/Footer";
import FriendRecommend from "./components/recommendFriend/FriendRecommend";
import {Route, BrowserRouter as Router, Routes, useNavigate} from "react-router-dom";
import Main from "./components/Main";
import Home  from "./components/search/Home.jsx";
import Detail from "./components/search/Detail";
import Posts from "./components/board/Posts";
import Write from "./components/board/Write";
import Post from "./components/board/Post";
import RecommendReal from "./recommendReal.jsx";
import MovieModal from "./components/recommendMain/components/MovieModal";



function App() {
  const [isLoggedIn2, setIsLoggedIn2] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);



  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      setIsLoggedIn2(true);
    }
  }, []);

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
            setIsLoggedIn2={setIsLoggedIn2}
        />
        <Routes>
          <Route path="/" element={<Main/>}></Route>

          <Route path="/recommend/main" element={<RecommendReal/>}></Route>
          <Route path="/recommend/friend" element={<FriendRecommend />}></Route>

          <Route path="/posts/:cat" element={<Posts/>}></Route>
          <Route path="/write/:no" element={<Write />} />
          <Route path="/post/:postNo" element={<Post />} />

          {/*<Route path="//detaile/:no" element={<Detail/>}/>*/}

         <Route path="/search" element={<Home/>}></Route>
          <Route path="/detail/:category/:id" element={<Detail/>}></Route>
          <Route path="/mypage" element={""}></Route>

        </Routes>
      </Router>

      {/*{selectedMovie && (*/}
      {/*    <MovieModal*/}
      {/*        movie={selectedMovie}*/}
      {/*        onClose={closeModal}*/}
      {/*        onDetails={goToDetails}*/}
      {/*    />*/}
      {/*)}*/}
    </div>
  );
}

export default App;