import Menubar from "./components/Menubar.jsx";
import Namebar from "./components/Namebar.jsx";
import Home from "./components/Home.jsx";
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import Gullist from "./components/Gullist.jsx";
import Gullview from "./components/Gullview.jsx";


function Layout() {

    const location = useLocation();

    // 경로별 Namebar 이름 지정
    const getName = () => {
        switch (location.pathname) {
            case '/':
                return '메인화면';
            case '/gullist':
                return '자유 게시판';
            case '/contact':
                return '연락처 페이지';
            default:
                return '페이지';
        }
    };
    return (
        <div>
            <Namebar  name={getName()} />
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/gullist" element={<Gullist/>} />
                <Route path="/contact" element={<Gullview/>} />
            </Routes>
        </div>
    );
}
function App() {

    return (
        <Gullist />
    );
}
export default App
