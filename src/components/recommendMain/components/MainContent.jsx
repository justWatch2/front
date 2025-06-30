// src/components/MainContent.jsx
import React, { useRef, useContext, useEffect, useState, useCallback } from 'react';
import { RecommendationContext } from '../RecommendationContext';
import Row from './Row.jsx';
import WeatherRecommendation from './WeatherRecommendationModal';
import TimeRecommendation from './TimeRecommendationModal';
import MBTIRecommendation from './MbtiRecommendationModal';
import ComplexRecommendation from './ComplexRecommendationModal';
import DefaultPostersFetcher from './DefaultPostersFetcher';
import MovieModal from './MovieModal.jsx';
import LoadingPage from './LoadingPage';
import ComplexGrid from "./ComplexGrid";
import "../../../App.css"

// MemberModeFilters 컴포넌트 임포트
import MemberModeFilters from './MemberModelFilters';

import '../styles/MainContent.css';

const MainContent = () => {
    const categoriesRef = useRef(null);

    const {
        recommendations,
        defaultPosters,
        setDefaultPosters,
        activeRecommendation,
        openRecommendation,
        clearRecommendations,
        selectedCategory,
        setSelectedCategory,
        isLoading,
        isMemberModeActive,
        // Context에서 가져오던 selectedMediaType, selectedRegion, selectedAgeRating 및 setter 함수들은
        // 이제 MemberModeFilters 컴포넌트 내부에서 직접 사용하므로 MainContent에서는 제거
        // selectedMediaType, setSelectedMediaType, etc.
    } = useContext(RecommendationContext);

    const [selectedMovie, setSelectedMovie] = useState(null);
    const [featuredMovies, setFeaturedMovies] = useState([]);
    const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
    const [isFeaturedFading, setIsFeaturedFading] = useState(false);

    const recommendationCategories = [
        { id: 'weather', label: '오늘같은 날씨엔?', type: 'weather' },
        { id: 'time', label: '이시간엔?', type: 'time' },
        { id: 'mbti', label: '내 MBTI엔?', type: 'mbti' },
        { id: 'complex', label: '이중엔 있겠지?', type: 'complex' },
    ];

    const recommendationComponents = {
        weather: WeatherRecommendation,
        time: TimeRecommendation,
        mbti: MBTIRecommendation,
        complex: ComplexRecommendation,
    };

    const defaultPosterCacheRef = DefaultPostersFetcher();

    useEffect(() => {
        let sourceMovies = [];

        if (Object.keys(recommendations).length > 0) {
            Object.values(recommendations).forEach(data => {
                if (data.complexList && data.complexList.length > 0) {
                    sourceMovies.push(...data.complexList);
                } else if (data.domesticMovies || data.internationalMovies || data.domesticTV || data.internationalTV) {
                    sourceMovies.push(...data.domesticMovies || []);
                    sourceMovies.push(...data.internationalMovies || []);
                    sourceMovies.push(...data.domesticTV || []);
                    sourceMovies.push(...data.internationalTV || []);
                }
            });
        }
        else if (defaultPosters && defaultPosters.length > 0) {
            defaultPosters.forEach(section => {
                if (section.movies) {
                    sourceMovies.push(...section.movies);
                }
            });
        }

        const uniqueSourceMovies = Array.from(new Map(sourceMovies.map(movie => [movie.id, movie])).values()).slice(0, 10);

        if (JSON.stringify(uniqueSourceMovies) !== JSON.stringify(featuredMovies)) {
            setFeaturedMovies(uniqueSourceMovies);
            if (currentFeaturedIndex >= uniqueSourceMovies.length && uniqueSourceMovies.length > 0) {
                setCurrentFeaturedIndex(0);
            }
        }
    }, [defaultPosters, recommendations, featuredMovies, currentFeaturedIndex]);

    useEffect(() => {
        if (!isLoading && defaultPosterCacheRef.current && defaultPosterCacheRef.current.length > 0 && defaultPosters.length === 0) {
            setDefaultPosters(defaultPosterCacheRef.current);
        }
    }, [isLoading, defaultPosterCacheRef, defaultPosters, setDefaultPosters]);

    const changeFeaturedSlide = useCallback((direction) => {
        if (featuredMovies.length === 0) return;

        setIsFeaturedFading(true);

        setTimeout(() => {
            setCurrentFeaturedIndex(prevIndex => {
                if (direction === 'next') {
                    return (prevIndex + 1) % featuredMovies.length;
                } else {
                    return (prevIndex - 1 + featuredMovies.length) % featuredMovies.length;
                }
            });
            setIsFeaturedFading(false);
        }, 500);
    }, [featuredMovies]);

    const nextFeatured = useCallback(() => changeFeaturedSlide('next'), [changeFeaturedSlide]);
    const prevFeatured = useCallback(() => changeFeaturedSlide('prev'), [changeFeaturedSlide]);


    const currentFeaturedMovie = featuredMovies[currentFeaturedIndex];


    const fetchTrailer = async (movieId) => {
        const apiKey = process.env.REACT_APP_TMDB_API_KEY;
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`
            );
            const data = await response.json();
            const trailer = data.results.find(
                (video) => video.type === 'Trailer' && video.site === 'YouTube' && video.official
            );

            return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
        } catch (error) {
            console.error('트레일러 가져오기 실패:', error);
            return null;
        }
    };

    const handleMovieClick = async (movie, event) => {
        console.log('Movie selected:', movie);
        const trailerUrl = await fetchTrailer(movie.id);
        console.log(trailerUrl);
        const clickPosition = {
            y: event.clientY,
        };
        setSelectedMovie({ ...movie, trailerUrl, clickPosition });
    };

    const scrollLeft = useCallback(() => {
        categoriesRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
    }, []);

    const scrollRight = useCallback(() => {
        categoriesRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
    }, []);


    // handleCategoryClick 함수: 모달 열기만 담당. API 요청은 모달 내부 '확인' 버튼에서.
    const handleCategoryClick = useCallback(async (category) => {
        console.log('Category clicked:', category.id);

        if (category.id === selectedCategory) {
            setSelectedCategory(null);
            clearRecommendations();
        } else {
            setSelectedCategory(category.id);
            openRecommendation(category.type); // 모달(오버레이)만 엽니다.
        }
    }, [selectedCategory, setSelectedCategory, openRecommendation, clearRecommendations]);

    // handleMemberFilterSelect 함수는 MemberModeFilters 컴포넌트로 이동
    // const handleMemberFilterSelect = useCallback((setter) => (value) => { ... });


    const getSectionTitle = (id) => {
        switch (id) {
            case 'weather':
                return '오늘 날씨엔?';
            case 'time':
                return '이 시간엔?';
            case 'mbti':
                return '내 MBTI엔?';
            case 'complex':
                return '이것저것 추천';
            default:
                return '';
        }
    };

    const getRowTitle = (type, region) => {
        const mediaLabel = type === 'tv' ? '추천드라마' : '추천영화';
        const regionLabel = region === 'domestic' ? '국내' : '해외';
        return `${regionLabel} ${mediaLabel} `;
    };

    const renderRows = (data, category = 'default') => {
        return [
            { key: 'domesticMovies', type: 'movies', region: 'domestic', items: data.domesticMovies },
            { key: 'internationalMovies', type: 'movies', region: 'international', items: data.internationalMovies },
            { key: 'domesticTV', type: 'tv', region: 'domestic', items: data.domesticTV },
            { key: 'internationalTV', type: 'tv', region: 'international', items: data.internationalTV },
        ].map(({ key, type, region, items }) => (
            items?.length > 0 && (
                <div key={`${category}-${key}`} className="recommendation-row">
                    <h2 className="row-title">{getRowTitle(type, region)}</h2>
                    <Row
                        movies={items.slice(0, 20)}
                        onMovieClick={handleMovieClick}
                    />
                </div>
            )
        ));
    };

    const ActiveRecommendationComponent = activeRecommendation ? recommendationComponents[activeRecommendation] : null;

    const closeModal = () => setSelectedMovie(null);

    const goToDetails = (movie) => {
        console.log('상세 페이지로 이동:', movie.title || movie.name);
        closeModal();
    };

    return (
        <>
            <main className="main-content">
                {isLoading ? (
                    <div className="loading-wrapper">
                        <LoadingPage />
                    </div>
                ) : (
                    <>
                        {currentFeaturedMovie && (
                            <div
                                className={`featured-content ${isFeaturedFading ? 'fading-out' : 'fading-in'}`}
                                key={currentFeaturedMovie.id}
                                style={{
                                    backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.8) 100%), url(https://image.tmdb.org/t/p/original${currentFeaturedMovie.backdrop_path|| currentFeaturedMovie.backdropPath
                                    || currentFeaturedMovie.posterPath || currentFeaturedMovie.poster_path})`,
                                }}
                            >
                                <div className="featured-info">
                                    <h1>{currentFeaturedMovie.koreanName || currentFeaturedMovie.korean_title || currentFeaturedMovie.koreanTitle || currentFeaturedMovie.title || currentFeaturedMovie.name}</h1>
                                    <p>{currentFeaturedMovie.overview || '이 영화/드라마에 대한 설명이 없습니다.'}</p>
                                    <div className="featured-buttons">
                                        <button className="play-button" onClick={() => { /* 재생 로직 */ alert('재생'); }}>
                                            <i className="fas fa-play"></i> 재생
                                        </button>
                                        <button className="info-button" onClick={() => handleMovieClick(currentFeaturedMovie, { clientY: window.innerHeight / 2 })}>
                                            <i className="fas fa-info-circle"></i> 상세 정보
                                        </button>
                                    </div>
                                </div>
                                {featuredMovies.length > 1 && (
                                    <>
                                        <button className="featured-nav-button featured-nav-button-left" onClick={prevFeatured}>
                                            ❮
                                        </button>
                                        <button className="featured-nav-button featured-nav-button-right" onClick={nextFeatured}>
                                            ❯
                                        </button>
                                    </>
                                )}
                            </div>
                        )}

                        {/* 추천 카테고리 바 */}
                        <div className="recommendation-categories">
                            <button
                                onClick={scrollLeft}
                                className="category-nav-button category-nav-button-left"
                                aria-label="Scroll left"
                            >
                                ←
                            </button>
                            <div ref={categoriesRef} className="categories-list">
                                {recommendationCategories.map((category) => (
                                    <div
                                        key={category.id}
                                        className={`category-item ${selectedCategory === category.id ? 'selected' : ''} ${isMemberModeActive ? 'glowing-rainbow-category' : ''}`}
                                        onClick={() => handleCategoryClick(category)}
                                    >
                                        {category.label}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={scrollRight}
                                className="category-nav-button category-nav-button-right"
                                aria-label="Scroll right"
                            >
                                →
                            </button>
                        </div>

                        {/* 회원 모드 추가 선택 UI (MemberModeFilters 컴포넌트로 분리) */}
                        <MemberModeFilters /> {/* 여기에 새로운 컴포넌트를 렌더링 */}

                        {/* 기존 콘텐츠 섹션 (추천 모달 및 포스터 로우) */}
                        <div className="content-sections">
                            {ActiveRecommendationComponent && <ActiveRecommendationComponent />}

                            {featuredMovies.length === 0 && Object.keys(recommendations).length === 0 && defaultPosters.length === 0 && !isLoading ? (
                                <p style={{ textAlign: 'center', color: '#ccc', marginTop: '50px' }}>
                                    아직 표시할 콘텐츠가 없습니다.
                                </p>
                            ) : (
                                Object.keys(recommendations).length === 0 ? (
                                    <section className="recommendation-section">
                                        {defaultPosters.map((section) => (
                                            <section key={section.key} className="recommendation-section">
                                                <h1 className="section-title">{section.label}</h1>
                                                <Row
                                                    movies={section.movies}
                                                    onMovieClick={handleMovieClick}
                                                />
                                            </section>
                                        ))}
                                    </section>
                                ) : (
                                    Object.entries(recommendations).map(([id, data]) => (
                                        <section key={id} className="recommendation-section">
                                            <h1 className="section-title">{getSectionTitle(id)}</h1>

                                            { (isMemberModeActive || id === 'complex') && data.complexList && data.complexList.length > 0 ? (
                                                <ComplexGrid
                                                    key={id}
                                                    items={data.complexList}
                                                    onMovieClick={handleMovieClick}
                                                />
                                            ) : (
                                                renderRows(data, id)
                                            )}
                                        </section>
                                    ))
                                )
                            )}
                        </div>
                    </>
                )}

                <MovieModal
                    movie={selectedMovie}
                    onClose={closeModal}
                    onDetails={goToDetails}
                    clickPosition={selectedMovie?.clickPosition}
                />
            </main>
        </>
    );
};

export default MainContent;