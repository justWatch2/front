// src/components/ComplexGrid.jsx
import React from 'react';
import '../styles/ComplexGrid.css'; // CSS 파일 임포트 유지
// import { calculateRating } from '../function/ratingCalculateRating'; // <<< 이 줄 제거!
import Rating from 'react-rating'; // react-rating 라이브러리 임포트 유지

const ComplexGrid = ({ items, onHoverPoster, onMovieClick }) => {

    return (
        <div className="complex-grid">

            {items.map((item) => {
                // averageRating 또는 vote_average를 10점 만점에서 5점 만점으로 변환
                // calculateRating 함수 없이 직접 계산합니다.
                const displayRating = (item.averageRating || item.vote_average || 0) / 2;

                return (
                    <div
                        key={item.id}
                        className="complex-grid-item"
                        onMouseEnter={() => {
                            if (onHoverPoster) {
                                onHoverPoster(`https://image.tmdb.org/t/p/original${item.backdrop_path || item.backdropPath ||
                                item.poster_path || item.posterPath }`);

                            }
                        }}
                        onClick={(event) => {
                            if (onMovieClick) {
                                onMovieClick(item, event);
                            }
                        }}
                    >
                        <img
                            className="complex-grid-poster"
                            src={`https://image.tmdb.org/t/p/w200${item.poster_path || item.posterPath}`}
                            alt={item.koreanName || item.korean_title||item.koreanTitle|| item.name || 'Poster'}
                            loading="lazy"
                        />
                        <div className="complex-grid-info">
                            <h3>{item.koreanName ||item.korean_title ||item.koreanTitle || item.name || '제목 없음'}</h3>
                            <div className="complex-grid-rating">
                                {/* react-rating 컴포넌트와 유니코드 별표를 함께 사용합니다. */}
                                <Rating
                                    initialRating={displayRating} // 5점 만점 기준의 별점
                                    emptySymbol={<span className="icon-star">☆</span>} // 비어있는 별 (유니코드 U+2606)
                                    fullSymbol={<span className="icon-star">★</span>}   // 채워진 별 (유니코드 U+2605)
                                    halfSymbol={<span className="icon-star">★</span>} // 반쪽 별

                                    fractions={2} // 반쪽 별 (0.5 단위) 허용
                                    readonly // 읽기 전용으로 설정 (클릭 불가)
                                    className="react-rating-stars" // CSS 스타일을 위한 클래스
                                />
                                {/* 평점 숫자는 그대로 표시 */}
                                <span className="rating-score">
                                    {(item.averageRating || item.vote_average || 0).toFixed(1)} {/* 10점 만점 그대로 표시 */}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ComplexGrid;