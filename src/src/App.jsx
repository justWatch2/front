import { BrowserRouter as Router, Routes, Route,Link } from "react-router-dom";
import Detail from "./component/Detail.jsx";
import Home from "./component/Home.jsx";
import React, {useEffect, useState} from "react";
import axios from "axios";
import logo from "./assets/content.png";
import Header from "./component/Movie_Loginbar.jsx";
import Gullist from "./component/Gullist.jsx";
import Gullwrite from "./component/Gullwrite.jsx";
import {Gullview} from "./component/Gullview.jsx";



function App() {
    // const [data,setData] = useState(null);
    // useEffect(()=>{
    //     setData([1,2,3,4,5])
    //     alert(data);
    // },[]);

    // useEffect(() => {
    //     for(let i=0;i<100;i++){
    //
    //         const options = {
    //             method: 'GET',
    //             url: 'https://api.themoviedb.org/3/discover/movie',
    //             params: {
    //                 include_adult: 'true',
    //                 include_video: 'true',
    //                 language: 'en-US',
    //                 page: i,
    //                 sort_by: 'popularity.desc'
    //             },
    //             headers: {
    //                 accept: 'application/json',
    //                 Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YjA3MGM5ODk0MTY0MTFhNTEzYzRjNmM3OGFmMDc2OSIsIm5iZiI6MTc0NzIxODk4NS44Miwic3ViIjoiNjgyNDcyMjk0OTMzZmUxNDU1MzMzZjM4Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.rBrd8bY3jM-JG5YfEsj_A6ApxP3KpzZQpw9yyGnRuUw'
    //             }
    //         };
    //
    //         axios
    //             .request(options)
    //             .then(res => console.log(res.data))
    //             .catch(err => console.error(err));
    //     }
    // }, []);
    const [results, setResults] = useState(null);
    return (
        <Router>
            <div className="header bg-black border-bottom text-white d-flex justify-content-between align-items-center p-3">
                <div style={{ display: "flex"}}>
                    <Link to={'/'}>
                        <img onClick={()=>{setResults(null)}} src={logo} alt="Waffle Logo" style={{height:'100px', margin:-15 }} />
                    </Link>
                    <Link to={'/gullist'}>
                        <div style={{lineHeight:'70px' ,width:'100px', textAlign:'center'}} className="border text-white">게시판</div>
                    </Link>
                </div>
                <Header/>
            </div>
            <Routes>
                <Route path="/" element={<Home results={results} setResults={setResults}/>} />
                <Route path="detail/:category/:id" element={<Detail />} />
                <Route path="/gullist" element={<Gullist />} />
                <Route path="/gullwrite" element={<Gullwrite />} />
                <Route path="/gullview/:no" element={<Gullview />} />
            </Routes>
        </Router>
    );
}

export default App
