import axios from '../../api/axios';
import React, { useEffect , useState } from 'react'
import "./Row.css";

export default function Row({ isLargeRow, title, id, fetchUrl}){
    const [movies, setMovies] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [movieSelected, setMovieSelected] = useState({});

    useEffect(() => {
        fetchMovieData();
    }, []);

    const fetchMovieData = async () => {
        const request = await axios.get(fetchUrl);
        console.log('request', request);
        setMovies(request.data.results);
    }
    const handleClick = (movie) => {
    setModalOpen(true);
    setMovieSelected(movie);
    console.log(movie);
  };
    
    
    return ( 
    <section className="row2">
        <h2>{title}</h2>

        <div className="slider">
        <div className="slider__arrow-left">
            <span
            className="arrow"
            onClick={() => {
                document.getElementById(id).scrollLeft -= window.innerWidth - 80;
            }}
            >
            {"<"}
            </span>
        </div>
        <div id={id} className="row__posters">
            {movies.map((movie) => (
                <div
                    key={movie.id}
                    className="row-item"
                    onClick={(event) => {
                        // if (onMovieClick) {
                        //     onMovieClick(item, event);
                        // }
                    }}
                >

                <img
                key={movie.id}
                className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                src={`https://image.tmdb.org/t/p/original/${
                 movie.poster_path
                } `}
                alt={movie.name}
                onClick={() => handleClick(movie)}
            />
                    </div>
            ))}
        </div>
        <div className="slider__arrow-right">
            <span
            className="arrow"
            onClick={() => {
                document.getElementById(id).scrollLeft += window.innerWidth - 80;
            }}
            >
            {">"}
            </span>
        </div>
        </div>
    </section>
    )
}
