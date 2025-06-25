import React, {useContext, useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {RecommendationContext} from '../RecommendationContext.jsx';
import '../styles/Recommendation.css';
import {MemberRecommendApi, timeRecommendApi} from "../api/RecommendApi";

function TimeRecommendation() {
    const {
        activeRecommendation,
        closeRecommendation,
        requestRecommendation,
        setSelectedCategory,
        setIsLoading,
        userId,
        isMemberModeActive,
        selectedMediaType,
        selectedRegion,
        selectedAgeRating
    } = useContext(RecommendationContext);

    const [isClosing, setIsClosing] = useState(false);
    const overlayRef = useRef(null);


    const getTimeSlot = () => {
        const hour = new Date().getHours();
        if (hour >= 0 && hour < 3) return '00-03';
        if (hour >= 3 && hour < 6) return '03-06';
        if (hour >= 6 && hour < 9) return '06-09';
        if (hour >= 9 && hour < 12) return '09-12';
        if (hour >= 12 && hour < 15) return '12-15';
        if (hour >= 15 && hour < 18) return '15-18';
        if (hour >= 18 && hour < 21) return '18-21';
        return '21-24';
    };


    const getGenres = (timeSlot) => {
        const genresMap = {
            '00-03': {
                genresMovie: ['로맨스', '가족'],
                genresTV: ['로맨스', '가족']
            },
            '03-06': {
                genresMovie: ['공포', '미스터리'],
                genresTV: ['미스터리', '범죄']
            },
            '06-09': {
                genresMovie: ['다큐멘터리', '역사'],
                genresTV: ['다큐멘터리', '역사']
            },
            '09-12': {
                genresMovie: ['코미디', '애니메이션'],
                genresTV: ['코미디', 'Animation']
            },
            '12-15': {
                genresMovie: ['모험', '판타지'],
                genresTV: ['Action & Adventure', 'Sci-Fi & Fantasy']
            },
            '15-18': {
                genresMovie: ['드라마', '로맨스'],
                genresTV: ['드라마', '로맨스']
            },
            '18-21': {
                genresMovie: ['스릴러', '범죄'],
                genresTV: ['범죄', '미스터리']
            },
            '21-24': {
                genresMovie: ['액션', 'SF'],
                genresTV: ['액션', 'Sci-Fi & Fantasy']
            }
        };

        return genresMap[timeSlot] || {
            genresMovie: ['기타'],
            genresTV: ['기타']
        };
    };


    const handleSubmit = async () => {
        const timeSlot = getTimeSlot();
        console.log('Fetching time recommendations for:', timeSlot);

        if (isMemberModeActive) {
            if (!selectedMediaType) {
                alert('회원 모드: 미디어 타입을 선택하세요.');
                return;
            }
            if (!selectedRegion) {
                alert('회원 모드: 지역을 선택하세요.');
                return;
            }
            if (!selectedAgeRating) {
                alert('회원 모드: 연령 등급을 선택하세요.');
                return;
            }
        }
        setIsClosing(true);
        try {
            let response;
            const userIdToUse =userId;
            const {genresMovie, genresTV} = getGenres(timeSlot);
            let genresToSend = [];

            if(selectedMediaType === 'movie') {
                genresToSend = genresMovie
            }else if(selectedMediaType === 'tv') {
                genresToSend = genresTV
            }

            if(isMemberModeActive) {

                const payload = {
                    userId: userIdToUse,
                    mediaType: selectedMediaType,
                    region: selectedRegion,
                    ageRating: selectedAgeRating,
                    selectedGenres:genresToSend
                }

                setIsLoading(true);
                response = await MemberRecommendApi(payload);

                requestRecommendation({
                    recommendationId: 'complex',
                    data: response.data,
                    isMemberModeActiveAtCall: isMemberModeActive
                });

            }else{
                setIsClosing(true);
                setIsLoading(true);
                response = await timeRecommendApi(genresMovie, genresTV);

                const data = {
                    domesticMovies: response.data.domesticMovies || [],
                    internationalMovies: response.data.internationalMovies || [],
                    domesticTV: response.data.domesticTV || [],
                    internationalTV: response.data.internationalTV || [],

                };
                requestRecommendation({
                    recommendationId: 'time',
                    data,
                });
            }


            closeRecommendation();
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

    if (activeRecommendation !== 'time') return null;

    return (
        <div className={`recommendation-overlay ${isClosing ? 'closing' : ''}`} ref={overlayRef}>
            <div className="recommendation-section">
                <h2 className="recommendation-title">시간대 기반 추천</h2>
                <div className="recommendation-form">
                    <div className="form-field">
                        <p>현재 시간: {new Date().toLocaleTimeString('ko-KR')}</p>
                        <p>추천
                            시간대: {getTimeSlot() === 'morning' ? '아침' : getTimeSlot() === 'afternoon' ? '점심' : getTimeSlot() === 'evening' ? '저녁' : '새벽'}</p>
                    </div>
                    <div className="form-buttons">
                        <button onClick={closeRecommendation} className="form-button form-button-secondary">
                            취소
                        </button>
                        <button onClick={handleSubmit} className="form-button form-button-primary">
                            확인
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TimeRecommendation;