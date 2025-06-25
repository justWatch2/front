import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
// import './index.css'
import App from './App.jsx'
import Header from "./layout/Header.jsx";
import Footer from "./layout/Footer.jsx";
import {BrowserRouter} from "react-router-dom";

createRoot(document.getElementById('root')).render(
    // <StrictMode>
        <BrowserRouter>

            <App/>
            <Footer/>
        </BrowserRouter>
    // </StrictMode>,
)
