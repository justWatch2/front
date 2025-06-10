import React, {useEffect, useState} from "react";
import { LoadMovie } from "../service/LoadMovie.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import {useNavigate} from "react-router";
import MOVIE_GENRES from "../data/MovieGenre.js"
import TV_GENRES from "../data/TVGenre.js"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from "./Movie_Loginbar.jsx";
import {Modal} from "./Modal.jsx";
import Result from "./Result.jsx";
import Years from "../data/Years.js";
import  logo from "../assets/content.png"
import result from "./Result.jsx";

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
        korea: true
    });

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSearch = async () => {
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
            korea: filterState.korea};

        setSaveValue(inputValue);

        const response = await LoadMovie(movieToggle,search,inputValue);
        setResults(response);
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

    return (
        <div className="bg-black min-vh-100 py-5">
            <ThemeProvider theme={darkTheme}>

                <div className="container">
                <div className="text-center mb-5">
                    <h1 className="text-light display-4 fw-bold">🎥 영화 검색기</h1>
                    <p className="text-secondary">원하는 영화를 입력하고 정보를 확인해보세요!</p>
                </div>
                    <CssBaseline />
                    <main>This app is using the dark mode</main>
                <div className="input-group input-group-lg mb-5 shadow-sm">
                    <select className="form-select-sm bg-dark text-light group" onChange={movieChange}>
                        <option value={1}>영화</option>
                        <option value={0}>드라마</option>
                    </select>
                    <Modal filterState={filterState} setFilterState={setFilterState}
                    />
                    <input
                        type="text"
                        className="form-control bg-dark text-light border-secondary"
                        placeholder="영화 제목 입력"
                        value={inputValue}
                        onChange={handleChange}
                    />
                    <button className="btn btn-outline-info" onClick={handleSearch}>
                        검색
                    </button>

                </div>

                {saveValue && (
                    <h4 className="text-light mb-4">🔍 "{saveValue}"의 검색 결과</h4>
                )}

                <Result list={results}/>
            </div>
            </ThemeProvider>
        </div>
    );
}

export default App;
