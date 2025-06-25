import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./layout/Header.jsx";
import Home from "./routes/Home.jsx";
import Posts from "./routes/Posts.jsx";
import Write from "./routes/Write.jsx";
import Post from "./routes/Post.jsx";
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
// import './App.css';

// 블랙 테마 생성
const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#ffffff",
        },
        background: {
            default: "#121212",
            paper: "#1e1e1e",
        },
    },
});

function App() {
    const [count, setCount] = useState(0);

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
                <Header />
                <div>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/posts" element={<Posts />} />
                        <Route path="/write/:id" element={<Write />} />
                        <Route path="/post/:postNo" element={<Post />} />
                    </Routes>
                </div>
                {/* 원본의 주석 처리된 코드 유지 */}
                {/*<div>*/}
                {/*  <a href="https://vite.dev" target="_blank">*/}
                {/*    <img src={viteLogo} className="logo" alt="Vite logo" />*/}
                {/*  </a>*/}
                {/*  <a href="https://react.dev" target="_blank">*/}
                {/*    <img src={reactLogo} className="logo react" alt="React logo" />*/}
                {/*  </a>*/}
                {/*</div>*/}
                {/*<h1>Vite + React</h1>*/}
                {/*<div className="card">*/}
                {/*  <button onClick={() => setCount((count) => count + 1)}>*/}
                {/*    count is {count}*/}
                {/*  </button>*/}
                {/*  <p>*/}
                {/*    Edit <code>src/App.jsx</code> and save to test HMR*/}
                {/*  </p>*/}
                {/*</div>*/}
                {/*<p className="read-the-docs">*/}
                {/*  Click on the Vite and React logos to learn more*/}
                {/*</p>*/}

        </ThemeProvider>
    );
}

export default App;