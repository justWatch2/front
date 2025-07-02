import React from "react";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Main from "./components/Main";
import Home from "./components/search/Home.jsx";
import Detail from "./components/search/Detail";
import Posts from "./components/board/Posts";
import Write from "./components/board/Write";
import Post from "./components/board/Post";
import RecommendReal from "./recommendReal.jsx";
import FriendRecommend from "./components/recommendFriend/FriendRecommend";
import MyPage from "./components/recommendMain/components/Mypage";



function App() {
  return (
      <div className="App">
        <Router>
          <Nav />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/recommend/main" element={<RecommendReal />} />
            <Route path="/recommend/friend" element={<FriendRecommend />} />
            <Route path="/posts/:cat" element={<Posts />} />
            <Route path="/write/:no" element={<Write />} />
            <Route path="/post/:postNo" element={<Post />} />
            <Route path="/search" element={<Home />} />
            <Route path="/detail/:category/:id" element={<Detail />} />

            {/* 2. '/mypage' 경로에 import한 MyPage 컴포넌트를 연결합니다. */}
            <Route path="/mypage" element={<MyPage />} />

          </Routes>
        </Router>
      </div>
  );
}

export default App;
