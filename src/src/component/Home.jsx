import React, {useEffect, useState} from "react";
import { LoadMovie } from "../service/LoadMovie.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import MOVIE_GENRES from "../data/MovieGenre.js"
import TV_GENRES from "../data/TVGenre.js"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios'
import {Modal} from "./Modal.jsx";
import Result from "./Result.jsx";
import Years from "../data/Years.js";

const darkTheme = createTheme({
    palette: {
        mode: 'light',
    },
});
function App({ results, setResults }) {
    const [inputValue, setInputValue] = useState('');
    const [saveValue, setSaveValue] = useState('');
    const [movieToggle, setMovieToggle] = useState(false);
    const [filterState, setFilterState] = useState({
        genres: MOVIE_GENRES,
        adult: false,
        years: Years,
        korea: true,
        page:0
    });
    const [searchList, setSearchList] = useState([]);
    const [showSearchList, setShowSearchList] = useState(false);
    const [isLogin,setIsLogin] = useState(true);
    const controllerRef = React.useRef(null);


    const getSearchList =()=>{

        if (isLogin) {
            // 서버에서 검색기록 가져오기 (예: 10개)
            axios.get('/api/searchlist',{params:{
                    memberId: "a"
                }}).then((res)=>{setSearchList(res.data);});
            // list=["a","b","c","d","e"];

        } else {
            // 로컬스토리지에서 가져오기
            const localData = localStorage.getItem('searchHistory');
            setSearchList( localData ? JSON.parse(localData) : []);
        }

    }
    useEffect(()=>{
        getSearchList();
    },[]);


    useEffect(()=>{
        if(filterState.page>0)
            handleSearch();
    },[filterState.page]);

    const handleChange = (e) => {

        setInputValue(e.target.value);
    };

    const handleSearch = async () => {
        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        const nextGenres = filterState.genres.slice();


        for (let i = 0; i < nextGenres.length; i++){
            if(!nextGenres[i].select){
                nextGenres.splice(i,1);
                i--;
            }
        }

        const nextYears = filterState.years.slice();
        for (let i = 0; i < nextYears.length; i++){
            if(!nextYears[i].select){
                nextYears.splice(i,1);
                i--;
            }
        }
        const search={genres: nextGenres.length===filterState.genres.length ? null:nextGenres,
            adult: filterState.adult,
            years: nextYears,
            korea: filterState.korea,
            page:filterState.page};
        const keyword=inputValue.replace(/[^a-zA-Z0-9가-힣 ]/g, '');
        setSaveValue(keyword);

        const response = await LoadMovie(movieToggle,search,keyword,signal);
        await setResults(response);
        await saveSearchHistory(keyword,signal);
    };

    const saveSearchHistory = (keyword,signal) => {
        if (!keyword) return;
        if (isLogin) {
            axios.post("/api/searchlist",{title:keyword, memberId:'a'},{signal})
                .then(res=>setSearchList(res.data))
                .catch((err)=>console.log(err));
        }else{
            // 로컬스토리지에 저장
            let localData = localStorage.getItem('searchHistory');
            let list = localData ? JSON.parse(localData) : [];
            // 중복 제거
            list = list.filter(item => item !== keyword);
            list.unshift(keyword);
            // 최대 10개 저장
            if (list.length > 5) list = list.slice(0, 5);
            localStorage.setItem('searchHistory', JSON.stringify(list));
            getSearchList();
        }

    };

    const movieChange =()=>{
        if(movieToggle){
            setMovieToggle(false);
            setFilterState({...filterState,genres: MOVIE_GENRES});
        }else{
            setMovieToggle(true);
            setFilterState(prevState => ({...prevState,genres: TV_GENRES}));
        }
        // alert(JSON.stringify(filterState));

    }

    const searchListOn=()=>{
        setShowSearchList(true);

    }
    const searchListOff=()=>{
        setTimeout(() => setShowSearchList(false), 100)
    }
    return (
        <form onSubmit={(e) => {
            e.preventDefault(); // 페이지 이동 막기

            filterState.page = 1;
            handleSearch();     // 검색 실행
        }} className="bg-black min-vh-100 py-5">
            <ThemeProvider theme={darkTheme}>

                <div className="container">
                <div className="text-center mb-5">
                    <h1 className="text-light display-4 fw-bold">🎥 영화 검색기</h1>
                    <p className="text-secondary">원하는 영화를 입력하고 정보를 확인해보세요!</p>
                </div>
                    <CssBaseline />
                    <main>This app is using the dark mode</main>

                <div className="position-relative input-group input-group-lg mb-5 shadow-sm">
                    <select className="form-select-sm bg-dark text-light group" onChange={movieChange}>
                        <option value={1}>영화</option>
                        <option value={0}>드라마</option>
                    </select>
                    <Modal filterState={filterState} setFilterState={setFilterState}
                    />

                        <input
                            type="text"
                            name="movieTitle"
                            autoComplete="off"
                            className="form-control bg-dark text-light border-secondary"
                            placeholder="영화 제목 입력"
                            value={inputValue}
                            onChange={handleChange}
                            onClick={searchListOn}
                            onBlur={searchListOff}
                        />
                    {showSearchList && searchList.length > 0 && (
                        <div className="position-absolute bg-dark text-light border mt-1 rounded w-100" style={{top:'100%', zIndex: 10 }}>
                            {searchList.map((item, index) => (
                                <div key={index}
                                     className="p-2 border-bottom hover-bg"
                                     onClick={() => {
                                         setInputValue(item);
                                     }}>
                                    {item}
                                </div>
                            ))}
                        </div>
                    )}
                        <button className="btn btn-outline-info" type="submit">
                            검색
                        </button>


                </div>

                {saveValue && (
                    <h4 className="text-light mb-4">🔍 "{saveValue}"의 검색 결과</h4>
                )}

                <Result list={results} setFilter={setFilterState}/>
            </div>
            </ThemeProvider>
        </form>
    );
}

export default App;
