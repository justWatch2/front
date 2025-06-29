import React, { useRef } from 'react';
import '../styles/App.css';

function Row({ movies, onHoverPoster, onMovieClick }) {
    const rowRef = useRef(null);
    const scrollLeft = () => rowRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
    const scrollRight = () => rowRef.current?.scrollBy({ left: 300, behavior: 'smooth' });

    return (
        <div className="row-container">
            <button
                onClick={scrollLeft}
                className="row-nav-button row-nav-button-left"
                aria-label="Scroll left"
            >
                ←
            </button>
            <div className="row" ref={rowRef}>
                {movies.map((item) => (
                    <div
                        key={item.id}
                        className="row-item"
                        onMouseEnter={() => {
                            if (onHoverPoster) {
                                onHoverPoster(`https://image.tmdb.org/t/p/original${item.backdrop_path || item.poster_path}`);
                            }
                        }}
                        onClick={(event) => {
                            if (onMovieClick) {
                                onMovieClick(item, event);
                            }
                        }}
                    >
                        <img
                            className="row-poster"
                            src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                            alt={item.title || item.name || 'Poster'}
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>
            <button
                onClick={scrollRight}
                className="row-nav-button row-nav-button-right"
                aria-label="Scroll right"
            >
                →
            </button>
        </div>
    );
}

export default Row;