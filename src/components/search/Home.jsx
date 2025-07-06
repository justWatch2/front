import React, { useEffect, useState } from "react";
import { LoadMovie } from "./LoadMovie.jsx";
import MOVIE_GENRES from "./data/MovieGenre.js";
import TV_GENRES from "./data/TVGenre.js";
import { Modal } from "./Modal.jsx";
import Result from "./Result.jsx";
import Years from "./data/Years.js";
import styles from "./Home.module.css";
import {autoRefreshCheck} from "../../tokenUtils/TokenUtils.js"

function App() {
    const [inputValue, setInputValue] = useState('');
    const [saveValue, setSaveValue] = useState('');
    const [movieToggle, setMovieToggle] = useState(false);
    const [filterState, setFilterState] = useState({
        genres: MOVIE_GENRES,
        adult: false,
        years: Years,
        korea: true,
        page: 1
    });
    const [results, setResults] = useState(null);
    const [searchList, setSearchList] = useState([]);
    const [showSearchList, setShowSearchList] = useState(false);
    const controllerRef = React.useRef(null);
    const [loading, setLoading] = useState(false);

    const getSearchList = async() => {
        const config={method: "GET",
                url: "http://localhost:8080/api/searchlist",};
        const res= await autoRefreshCheck(config);
        if (res) {
            setSearchList(res.data);
            // console.log("res:", res); // 전체 응답
            // console.log("res.data:", res.data); // 실제 데이터
        } else {
            const localData = localStorage.getItem('searchHistory');
            setSearchList(localData ? JSON.parse(localData) : []);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        getSearchList();
    }, []);

    useEffect(() => {
        if (filterState.page > 0)
            handleSearch();
    }, [filterState.page]);

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSearch = async () => {
        if(inputValue.length==0){
            return;
        }
        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        const nextGenres = filterState.genres.slice();
        for (let i = 0; i < nextGenres.length; i++) {
            if (!nextGenres[i].select) {
                nextGenres.splice(i, 1);
                i--;
            }
        }

        const nextYears = filterState.years.slice();
        for (let i = 0; i < nextYears.length; i++) {
            if (!nextYears[i].select) {
                nextYears.splice(i, 1);
                i--;
            }
        }
        const search = {
            genres: nextGenres.length === filterState.genres.length ? null : nextGenres,
            adult: filterState.adult,
            years: nextYears,
            korea: filterState.korea,
            page: filterState.page
        };
        const keyword = inputValue.replace(/[^a-zA-Z0-9가-힣 ]/g, '');
        setSaveValue(keyword);

        setLoading(true);
        const response = await LoadMovie(movieToggle, search, keyword, signal);
        setLoading(false);
        if (!response) return; // 요청이 취소된 경우 아무 작업 안 함
        await setResults(response);
        await saveSearchHistory(keyword, signal);
    };

    const saveSearchHistory = async (keyword, signal) => {
        if (!keyword) return;
        const config= { method: "POST",
                url: "http://localhost:8080/api/searchlist",
                signal,
                data:{ title: keyword},};

        const res= await autoRefreshCheck(config);

        if (res!=null) {
            setSearchList(res.data);
            // alert(JSON.stringify(res));
        } else {
            let localData = localStorage.getItem('searchHistory');
            let list = localData ? JSON.parse(localData) : [];
            list = list.filter(item => item !== keyword);
            list.unshift(keyword);
            if (list.length > 5) list = list.slice(0, 5);
            localStorage.setItem('searchHistory', JSON.stringify(list));
            getSearchList();
        }
    };

    const movieChange = () => {
        if (movieToggle) {
            setMovieToggle(false);
            setFilterState({ ...filterState, genres: MOVIE_GENRES });
        } else {
            setMovieToggle(true);
            setFilterState(prevState => ({ ...prevState, genres: TV_GENRES }));
        }
    };

    const searchListOn = () => {
        setShowSearchList(true);
    };

    const searchListOff = () => {
        setTimeout(() => setShowSearchList(false), 100);
    };

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            filterState.page = 1;
            handleSearch();
        }} className={styles.searchform}>
            <div className={styles.container}>
                <div className={styles.textCenter}>
                    <h1 className={styles.display4}>상세 검색</h1>
                </div>

                <div className={styles.inputGroup}>
                    <select className={styles.selectBox} onChange={movieChange}>
                        <option value={1}>영화</option>
                        <option value={0}>드라마</option>
                    </select>
                    <Modal filterState={filterState} setFilterState={setFilterState} />
                    <input
                        type="text"
                        name="movieTitle"
                        autoComplete="off"
                        className={styles.inputBox}
                        placeholder="영화 제목 입력"
                        value={inputValue}
                        onChange={handleChange}
                        onClick={searchListOn}
                        onBlur={searchListOff}
                    />
                    {/* {JSON.stringify(searchList)} */}
                    {showSearchList && searchList?.length > 0 && (
                        <div className={styles.searchDropdown} style={{ top: '100%', zIndex: 10 }}>
                            {searchList?.map((item, index) => (
                                <div key={index}
                                     className={styles.searchDropdownItem}
                                     onClick={() => {
                                         setInputValue(item);
                                     }}>
                                    {item}
                                </div>
                            ))}
                        </div>
                    )}
                    <button className={styles.searchButton} type="submit">
                        검색
                    </button>
                </div>
                
                {results? saveValue &&!loading ?
                <div><h4 className={styles.resultTitle}>🔍 &quot;{saveValue}&quot;의 검색 결과. </h4>
                <Result list={results} setFilter={setFilterState} /></div>:<span>검색중..{saveValue}.</span>:<></>}
            </div>
        </form>
    );
}

export default App;