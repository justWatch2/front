import main from '../assets/main.png';
import './menu.css';
import {Link} from "react-router-dom";
import './chat.jsx'

function menubar() {
    return (
        <div className="menu">
            <Link to="/"><img src={main} alt="포케몬" /></Link>
            <ul>
                <Link to="/gullist"><li>자유게시판</li></Link>
                <Link to="/contact"><li>boot</li></Link>
                <li>공사중</li>
                <li>공사중</li>
                <li>공사중</li>
            </ul>

        </div>
    );
}

export default menubar;
