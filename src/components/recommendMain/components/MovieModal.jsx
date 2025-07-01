import React, { useRef, useEffect, useState } from 'react'; // useRef, useEffect, useState
import '../styles/MovieModal.css';
import Rating from 'react-rating'; // react-rating 라이브러리 임포트 (별점용)
// calculateRating 함수는 더 이상 사용하지 않습니다.

// clickPosition prop을 받습니다.
const MovieModal = ({ movie, onClose, onDetails, clickPosition }) => {
    // === 1. 모든 Hooks 호출은 컴포넌트 함수의 가장 상단에 위치해야 합니다! ===
    const modalContentRef = useRef(null); // useRef 훅 호출

    const [modalTop, setModalTop] = useState('50%'); // useState 훅 호출
    const [modalTransform, setModalTransform] = useState('translate(-50%, -50%)'); // useState 훅 호출

    // 2. useEffect 훅 호출 (Hooks의 규칙에 따라 모든 useState, useRef 호출 바로 뒤에)
    useEffect(() => {
        // 이 useEffect는 movie prop의 값이 null이든 아니든 항상 호출됩니다.
        // 따라서, useEffect 내부에서 movie가 null일 경우를 처리해야 합니다.
        if (!movie || !clickPosition || !modalContentRef.current) {
            // movie가 없거나, 클릭 위치 정보 또는 DOM 요소가 없으면 기본 위치로 설정
            setModalTop('50%');
            setModalTransform('translate(-50%, -50%)');
            return; // 이후 계산 로직을 건너뜜
        }

        const modalHeight = modalContentRef.current.offsetHeight; // 모달의 실제 높이
        const viewportHeight = window.innerHeight; // 현재 브라우저 뷰포트의 높이

        // 클릭 지점 (뷰포트 기준 Y 좌표)
        const clickYInViewport = clickPosition.y;

        // 모달을 뷰포트 내의 클릭 지점 (뷰포트 기준)에 수직 중앙 정렬
        let desiredTopInViewport = clickYInViewport - (modalHeight / 2);

        // 모달이 뷰포트 상단/하단으로 벗어나지 않도록 클램핑(Clamping)
        const minTopInViewport = 20; // 뷰포트 상단에서 최소 20px 여백
        const maxTopInViewport = viewportHeight - modalHeight - 20; // 뷰포트 하단에서 최소 20px 여백

        let finalTopInViewport = Math.max(minTopInViewport, desiredTopInViewport);
        finalTopInViewport = Math.min(finalTopInViewport, maxTopInViewport);

        setModalTop(`${finalTopInViewport}px`);
        setModalTransform('translateX(-50%)'); // 가로 중앙 정렬만 남김
    }, [movie, clickPosition]); // movie나 clickPosition이 변경될 때마다 이 효과를 재실행


    const displayRating = (movie?.averageRating || movie?.vote_average || 0) / 2;

    // 4. movie가 없으면 여기서 일찍 리턴합니다. (모든 Hooks 호출이 완료된 후에!)
    if (!movie) return null;

    // --- 이후의 비즈니스 로직 및 JSX 렌더링은 이 지점부터 시작합니다 ---
    const absoluteString = movie.koreanName || movie.koreanTitle ||movie.korean_title|| movie.title || movie.name || '제목 없음';

    const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : (movie.firstAirDate ? new Date(movie.firstAirDate).getFullYear() : 'N/A');
    const matchPercentage = movie.keywordsRanking ? Math.min(movie.keywordsRanking * 10, 98) : 85;
    const ageRating = movie.adult ? '18+' : '모든 연령';
    const overviewText = movie.overview || '이 영화에 대한 줄거리가 없습니다.';

    return (
        <div className="movie-modal-overlay" onClick={onClose}>
            <div
                ref={modalContentRef} // 모달 콘텐츠 DIV에 ref 연결
                className="movie-modal-content"
                style={{ top: modalTop, transform: modalTransform }}
                onClick={(e) => e.stopPropagation()}
            >
                <button className="movie-modal-close-button" onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>

                <div className="movie-modal-media-area">
                    {movie.trailerUrl ? (
                        <iframe
                            className="movie-modal-trailer"
                            src={movie.trailerUrl}
                            title={`${absoluteString} 트레일러`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-in; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <img
                            className="movie-modal-poster-large"
                            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path || 
                            movie.backdropPath || movie.poster_path}`}
                            alt={absoluteString}
                        />
                    )}
                    <div className="movie-modal-overlay-buttons">
                        <h2 className="movie-modal-title">{absoluteString}</h2>
                        <div className="modal-buttons-group">
                            <button className="modal-play-button">
                                <i className="fas fa-play"></i> 재생
                            </button>
                            <button
                                className="modal-info-button"
                                onClick={() => onDetails(movie)}
                            >
                                <i className="fas fa-info-circle"></i> 상세 정보
                            </button>
                        </div>
                    </div>
                </div>

                <div className="movie-modal-details-area">
                    <div className="movie-modal-meta">
                        <span className="match-percentage">{matchPercentage}% 일치</span>
                        <span className="release-year">{releaseYear}</span>
                        <span className="age-rating">{ageRating}</span>
                        <span className="hd-badge">HD</span>
                    </div>

                    <div className="movie-modal-overview-section">
                        <p className="movie-modal-overview">{overviewText}</p>
                        <div className="movie-modal-genre-rating">
                            {movie.keywordsRaw && movie.keywordsRaw.length > 0 && (
                                <p className="modal-genres">
                                    장르: {movie.keywordsRaw.split(',').slice(0, 3).join(', ')}
                                </p>
                            )}
                            {/* 별점 표시 (react-rating) */}
                            <div className="modal-rating-stars">
                                <Rating
                                    initialRating={displayRating} // displayRating 변수 사용
                                    emptySymbol={<span className="icon-star">☆</span>}
                                    fullSymbol={<span className="icon-star">★</span>}
                                    halfSymbol={<span className="icon-star">★</span>}
                                    fractions={2}
                                    readonly
                                    className="react-rating-modal-stars"
                                />
                                <span className="modal-rating-score">
                                    {(movie.averageRating || movie.vote_average || 0).toFixed(1)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieModal;