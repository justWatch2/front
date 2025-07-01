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
import "../../../App.css";

import MemberModeButton from './MemberModeButton';
import MemberModeFilters from './MemberModelFilters';

import '../styles/MainContent.css';

const MainContent = () => {
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
        userId,
        isMemberModeActive,
    } = useContext(RecommendationContext);

    const categoriesRef = useRef(null);

    // MovieModal을 위한 상태와 함수들 (생략되었던 부분)
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [featuredMovies, setFeaturedMovies] = useState([]);
    const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
    const [isFeaturedFading, setIsFeaturedFading] = useState(false);

    const recommendationCategories = [
        { id: 'weather', label: '오늘같은 날씨엔?', type: 'weather' },
        { id: 'time', label: '이시간엔?', type: 'time' },
        { id: 'mbti', label: '내 MBTI엔?', type: 'mbti' },
        { id: 'complex', label: '이중엔 있겠지?', type: 'complex' }

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
                } else {
                    sourceMovies.push(...(data.domesticMovies || []), ...(data.internationalMovies || []), ...(data.domesticTV || []), ...(data.internationalTV || []));
                }
            });
        } else if (defaultPosters && defaultPosters.length > 0) {
            defaultPosters.forEach(section => {
                if (section.movies) sourceMovies.push(...section.movies);
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
            setCurrentFeaturedIndex(prevIndex => (direction === 'next' ? (prevIndex + 1) % featuredMovies.length : (prevIndex - 1 + featuredMovies.length) % featuredMovies.length));
            setIsFeaturedFading(false);
        }, 500);
    }, [featuredMovies]);

    const nextFeatured = useCallback(() => changeFeaturedSlide('next'), [changeFeaturedSlide]);
    const prevFeatured = useCallback(() => changeFeaturedSlide('prev'), [changeFeaturedSlide]);
    const currentFeaturedMovie = featuredMovies[currentFeaturedIndex];

    const handleMovieClick = (movie, event) => {
        const clickPosition = { y: event.clientY };
        setSelectedMovie({ ...movie, clickPosition });
    };

    const scrollLeft = useCallback(() => categoriesRef.current?.scrollBy({ left: -200, behavior: 'smooth' }), []);
    const scrollRight = useCallback(() => categoriesRef.current?.scrollBy({ left: 200, behavior: 'smooth' }), []);

    const handleCategoryClick = useCallback(async (category) => {
        if (category.id === selectedCategory) {
            setSelectedCategory(null);
            clearRecommendations();
        } else {
            setSelectedCategory(category.id);
            openRecommendation(category.type);
        }
    }, [selectedCategory, openRecommendation, clearRecommendations, setSelectedCategory]);

    const getSectionTitle = (id) => {
        // 회원 추천의 경우 (id가 'user'일 때) 동적으로 제목을 생성합니다.
        if (isMemberModeActive) {
            return `${userId || '회원'}님을 위한 맞춤 추천`;
        }

        // 기존의 일반 추천 제목들입니다.
        const titles = {
            weather: '오늘같은 날씨엔?',
            time: '이시간엔?',
            mbti: '내 MBTI엔?',
            complex: '이중엔 있겠지?'
        };
        return titles[id] || ''; // id가 일치하지 않을 경우 빈 문자열을 반환합니다.
    };

    const getRowTitle = (key) => {
        const type = key.includes('TV') ? 'tv' : 'movies';
        const region = key.includes('domestic') ? 'domestic' : 'international';
        return `${region === 'domestic' ? '국내' : '해외'} ${type === 'tv' ? '추천드라마' : '추천영화'}`;
    };

    const ActiveRecommendationComponent = activeRecommendation ? recommendationComponents[activeRecommendation] : null;

    // MovieModal을 위한 함수들 (생략되었던 부분)
    const closeModal = () => setSelectedMovie(null);
    const goToDetails = (movie) => {
        console.log('상세 페이지로 이동:', movie.title || movie.name);
        closeModal();
    };

    return (
        <main className="main-content">
            {isLoading ? <div className="loading-wrapper"><LoadingPage /></div> : (
                <>
                    {currentFeaturedMovie && (
                        <div className={`featured-content ${isFeaturedFading ? 'fading-out' : 'fading-in'}`} key={currentFeaturedMovie.id} style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.8) 100%), url(https://image.tmdb.org/t/p/original${currentFeaturedMovie.backdrop_path || currentFeaturedMovie.poster_path})` }}>
                            <div className="featured-info">
                                <h1>{currentFeaturedMovie.title || currentFeaturedMovie.name}</h1>
                                <p>{currentFeaturedMovie.overview || '설명이 없습니다.'}</p>
                                <div className="featured-buttons">
                                    <button className="play-button"><i className="fas fa-play"></i> 재생</button>
                                    <button className="info-button" onClick={(e) => handleMovieClick(currentFeaturedMovie, e)}><i className="fas fa-info-circle"></i> 상세 정보</button>
                                </div>
                            </div>
                            {featuredMovies.length > 1 && (<><button className="featured-nav-button featured-nav-button-left" onClick={prevFeatured}>❮</button><button className="featured-nav-button featured-nav-button-right" onClick={nextFeatured}>❯</button></>)}
                        </div>
                    )}
                    <div className="member-mode-button-container"><MemberModeButton /></div>
                    <div className="recommendation-categories">
                        <button onClick={scrollLeft} className="category-nav-button">←</button>
                        <div ref={categoriesRef} className="categories-list">
                            {recommendationCategories.map((category) => (
                                <div key={category.id} className={`category-item ${selectedCategory === category.id ? 'selected' : ''}`} onClick={() => handleCategoryClick(category)}>{category.label}</div>
                            ))}
                        </div>
                        <button onClick={scrollRight} className="category-nav-button">→</button>
                    </div>
                    <MemberModeFilters />
                    <div className="content-sections">
                        {ActiveRecommendationComponent && <ActiveRecommendationComponent />}
                        {Object.keys(recommendations).length === 0 ? (
                            defaultPosters.map((section) => (
                                <section key={section.key} className="recommendation-section">
                                    <h2 className="row-title">{section.label}</h2>
                                    <Row movies={section.movies} onMovieClick={handleMovieClick} />
                                </section>
                            ))
                        ) : (
                            Object.entries(recommendations).map(([id, data]) => (
                                <section key={id} className="recommendation-section">
                                    <h2 className="section-title">{getSectionTitle(id)}</h2>
                                    {(isMemberModeActive || id === 'complex') && (data.complexList || data.userSelectedList )?.length > 0 ? (
                                        <ComplexGrid items={data.complexList ||data.userSelectedList} onMovieClick={handleMovieClick} />
                                    ) : (
                                        Object.keys(data).map(key => data[key]?.length > 0 && (
                                            <div key={key}><h3 className="row-title">{getRowTitle(key)}</h3>
                                                <Row movies={data[key]} onMovieClick={handleMovieClick} />
                                            </div>
                                        ))
                                    )}
                                </section>
                            ))
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
    );
};
export default MainContent;