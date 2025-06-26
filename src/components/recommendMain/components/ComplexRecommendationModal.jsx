import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { RecommendationContext } from '../RecommendationContext.jsx';
import '../styles/Recommendation.css';
import {complexRecommendApi} from "../api/RecommendApi";

function ComplexRecommendation() {
    const { activeRecommendation, closeRecommendation, requestRecommendation,setSelectedCategory,setIsLoading } = useContext(RecommendationContext);
    const [mediaType, setMediaType] = useState('movie');
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [releaseYear, setReleaseYear] = useState([2000, 2025]);
    const [rating, setRating] = useState([0, 10]);
    const [ageRating, setAgeRating] = useState('general');
    const [region, setRegion] = useState('domestic');

    const [isClosing, setIsClosing] = useState(false);
    const overlayRef = useRef(null);

    const genresMovie = [
        { display: '코미디', value: '코미디' },
        { display: '드라마', value: '드라마' },
        { display: '로맨스', value: '로맨스' },
        { display: '액션', value: '액션' },
        { display: '범죄', value: '범죄' },
        { display: '스릴러', value: '스릴러' },
        { display: '모험', value: '모험' },
        { display: 'SF', value: 'SF' },
        { display: '다큐멘터리', value: '다큐멘터리' },
        { display: '공포', value: '공포' },
        { display: '애니메이션', value: '애니메이션' },
        { display: '가족', value: '가족' },
        { display: '미스터리', value: '미스터리' },
        { display: '판타지', value: '판타지' },
        { display: '음악', value: '음악' },
        { display: '전쟁', value: '전쟁' },
        { display: '서부', value: '서부' },
        { display: '역사', value: '역사' },
        { display: 'TV 영화', value: 'TV 영화' },
    ];

    const genresTV = [
        { display: '드라마', value: '드라마' },
        { display: '코미디', value: '코미디' },
        { display: '애니메이션', value: '애니메이션' },
        { display: '미스터리', value: '미스터리' },
        { display: 'SF & 판타지', value: 'Sci-Fi & Fantasy' },
        { display: '액션 & 모험', value: 'Action & Adventure' },
        { display: '키즈', value: 'Kids' },
        { display: '리얼리티', value: 'Reality' },
        { display: '가족', value: '가족' },
        { display: '드라마 연속극', value: 'Soap' },
        { display: '범죄', value: '범죄' },
        { display: '토크', value: 'Talk' },
        { display: '전쟁 & 정치', value: 'War & Politics' },
        { display: '뉴스', value: 'News' },
        { display: '서부', value: '서부' },
        { display: '다큐멘터리', value: '다큐멘터리' },
        { display: '로맨스', value: '로맨스' },
        { display: '역사', value: '역사' },
        { display: '뮤지컬', value: '뮤지컬' },
    ];

    const toggleGenre = (genreValue) => {
        setSelectedGenres((prev) =>
            prev.includes(genreValue)
                ? prev.filter((g) => g !== genreValue)
                : [...prev, genreValue]
        );
    };

    const handleYearChange = (e, index) => {
        const value = parseInt(e.target.value);
        const newYear = [...releaseYear];
        newYear[index] = value;
        if (index === 0 && value > newYear[1]) newYear[1] = value;
        if (index === 1 && value < newYear[0]) newYear[0] = value;
        setReleaseYear(newYear);
    };

    const handleRatingChange = (e, index) => {
        const value = parseFloat(e.target.value);
        const newRating = [...rating];
        newRating[index] = value;
        if (index === 0 && value > newRating[1]) newRating[1] = value;
        if (index === 1 && value < newRating[0]) newRating[0] = value;
        setRating(newRating);
    };

    const handleSubmit = async () => {
        console.log('Fetching complex recommendations:', { mediaType, selectedGenres, releaseYear, rating,ageRating,region });
        if (!mediaType || selectedGenres.length === 0) {
            alert('유형과 장르를 선택하세요.');
            return;
        }

        try {
            const payload = {
                mediaType,
                ageRating,
                region,
                selectedGenres,
                releaseYear,
                rating,
            };
            setIsLoading(true);
            const response = await complexRecommendApi(payload);
            console.log(response);
            console.log("배열들"+ response.data.selectedList);
            const data = {
                complexList: response.data.selectedList || [],
            };
            console.log('Constructed Data213233123:', data)

            requestRecommendation({
                recommendationId: 'complex',
                data,
            });
            handleClose();
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            alert('추천 요청 실패');
        }
    };

    const handleClose = () => {
        setIsClosing(true);

        setSelectedCategory(null)
        setTimeout(() => {
            closeRecommendation();
            setIsClosing(false);
        }, 0);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (overlayRef.current && !overlayRef.current.contains(e.target)) {
                handleClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getTrackStyle = (min, max, totalMin, totalMax) => {
        const minPercent = ((min - totalMin) / (totalMax - totalMin)) * 100;
        const maxPercent = ((max - totalMin) / (totalMax - totalMin)) * 100;
        return {
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
        };
    };

    if (activeRecommendation !== 'complex') return null;

    return (
        <div className={`recommendation-overlay ${isClosing ? 'closing' : ''}`} ref={overlayRef}>
            <div className="recommendation-section">
                <h2 className="recommendation-title">복합 기반 추천</h2>
                <div className="recommendation-form">
                    <div className="form-field">
                        <label>연령</label>
                        <select value={ageRating} onChange={(e) => setAgeRating(e.target.value)}>
                            {/*<option value="all">전체</option>*/}
                            <option value="general">일반 연령</option>
                            <option value="adult">성인(19+)</option>

                        </select>
                    </div>

                    <div className="form-field">
                        <label>국가</label>
                        <select value={region} onChange={(e) => setRegion(e.target.value)}>
                            {/*<option value="all">전체</option>*/}
                            <option value="domestic">국내</option>
                            <option value="international">해외</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label>유형:</label>
                        <select
                            value={mediaType}
                            onChange={(e) => {
                                setMediaType(e.target.value);
                                setSelectedGenres([]);
                            }}
                        >

                            <option value="movie">영화</option>
                            <option value="tv">드라마</option>
                        </select>
                    </div>
                    <div className="form-field">
                        <label>장르:</label>
                        <div className="genre-list">
                            {(mediaType === 'movie' ? genresMovie : genresTV).map(({ display, value }) => (
                                <div
                                    key={value}
                                    className={`genre-item ${selectedGenres.includes(value) ? 'selected' : ''}`}
                                    onClick={() => toggleGenre(value)}
                                >
                                    {display}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="form-field">
                        <label>개봉 년도: {releaseYear[0]} - {releaseYear[1]}</label>
                        <div className="range-container">
                            <div className="range-track" />
                            <div
                                className="range-selected"
                                style={getTrackStyle(releaseYear[0], releaseYear[1], 1900, 2025)}
                            />
                            <input
                                type="range"
                                min="1900"
                                max="2025"
                                value={releaseYear[0]}
                                onChange={(e) => handleYearChange(e, 0)}
                            />
                            <input
                                type="range"
                                min="1900"
                                max="2025"
                                value={releaseYear[1]}
                                onChange={(e) => handleYearChange(e, 1)}
                            />
                        </div>
                    </div>
                    <div className="form-field">
                        <label>평점: {rating[0]} - {rating[1]}</label>
                        <div className="range-container">
                            <div className="range-track" />
                            <div
                                className="range-selected"
                                style={getTrackStyle(rating[0], rating[1], 0, 10)}
                            />
                            <input
                                type="range"
                                min="0"
                                max="10"
                                step="0.1"
                                value={rating[0]}
                                onChange={(e) => handleRatingChange(e, 0)}
                            />
                            <input
                                type="range"
                                min="0"
                                max="10"
                                step="0.1"
                                value={rating[1]}
                                onChange={(e) => handleRatingChange(e, 1)}
                            />
                        </div>
                    </div>
                    <div className="form-buttons">
                        <button onClick={handleClose} className="form-button form-button-secondary">
                            취소
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="form-button form-button-primary"
                            disabled={!mediaType || selectedGenres.length === 0}
                        >
                            확인
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ComplexRecommendation;