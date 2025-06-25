
import React, { useEffect , useState } from 'react';
import "../css/Row.css";
import LazyYoutube from "./LazyYoutube.jsx";
import poster from "../assets/blank-poster-template-.jpg"

export default function Row({ data,title,fetchUrl}){
    //const [movies, setMovies] = useState(movie);
    const [modalOpen, setModalOpen] = useState(false);
    const [movieSelected, setMovieSelected] = useState({});
    const { isLargeRow, id}={isLargeRow:false,
        id:title,};


    const handleClick = (movie) => {
        setModalOpen(true);
        setMovieSelected(movie);
    };


    return (
        <section className="row">
            <h2>{title}</h2>
            <div className="slider">
                <div className="slider__arrow-left"  onClick={() => {
                    document.getElementById(id).scrollLeft -= window.innerWidth - 80;
                }}>
            <span
                className="arrow"

            >
            {"<"}
            </span>
                </div>
                <div id={id} className="row__posters">
                    {data?.map((movie,index) => (
                        title==="관련 동영상" ? <LazyYoutube key={index} videoId={movie.key} title={movie.name}></LazyYoutube>
                        :movie.known_for_department==="Acting" ? <div key={index}><img
                            key={movie.key}
                            className={`row__poster`}
                            src={movie.profile_path!=null?fetchUrl+movie.profile_path:poster}
                            alt={movie.title}
                            onClick={() => handleClick(movie)}
                            />{movie.name}</div>:<></>
                    ))}
                </div>
                <div className="slider__arrow-right"  onClick={() => {
                    document.getElementById(id).scrollLeft += window.innerWidth - 80;
                }}>
            <span
                className="arrow"

            >
            {">"}
            </span>
                </div>
            </div>
        </section>
    )
}
