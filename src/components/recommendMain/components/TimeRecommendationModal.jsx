import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { RecommendationContext } from '../RecommendationContext.jsx';
import '../styles/Recommendation.css';
import { MemberRecommendApi, timeRecommendApi } from "../api/RecommendApi";

function TimeRecommendation() {
    const {
        activeRecommendation,
        closeRecommendation,
        requestRecommendation,
        setIsLoading,
        // userId는 payload에 직접 담지 않으므로 여기서 받아올 필요가 없습니다.
        isMemberModeActive,
        selectedMediaType,
        selectedRegion,
        selectedAgeRating
    } = useContext(RecommendationContext);

    const [isClosing, setIsClosing] = useState(false);
    const overlayRef = useRef(null);

    const getTimeSlot = () => {
        const hour = new Date().getHours();
        if (hour < 3) return '00-03'; if (hour < 6) return '03-06';
        if (hour < 9) return '06-09'; if (hour < 12) return '09-12';
        if (hour < 15) return '12-15'; if (hour < 18) return '15-18';
        if (hour < 21) return '18-21'; return '21-24';
    };

    const getGenres = (timeSlot) => {
        const genresMap = { /* ... (장르 맵핑은 그대로) ... */ };
        return genresMap[timeSlot] || { genresMovie: [], genresTV: [] };
    };

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            closeRecommendation();
            setIsClosing(false);
        }, 400);
    }, [closeRecommendation]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (overlayRef.current && !overlayRef.current.contains(e.target)) handleClose();
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [handleClose]);

    const handleSubmit = async () => {
        const timeSlot = getTimeSlot();
        if (isMemberModeActive) {
            if (!selectedMediaType || !selectedRegion || !selectedAgeRating) {
                alert('회원 모드에서는 미디어 타입, 지역, 연령 등급을 모두 선택해야 합니다.');
                return;
            }
        }

        setIsLoading(true);

        try {
            const { genresMovie, genresTV } = getGenres(timeSlot);
            let responseData;

            if (isMemberModeActive) {
                const genresToSend = selectedMediaType === 'movie' ? genresMovie : genresTV;

                // [최종 수정] payload에서 userId를 완전히 제거합니다.
                const payload = {
                    mediaType: selectedMediaType,
                    region: selectedRegion,
                    ageRating: selectedAgeRating,
                    selectedGenres: genresToSend,
                    timeSlot: timeSlot
                };

                responseData = await MemberRecommendApi(payload);
                requestRecommendation({
                    recommendationId: 'user',
                    data: responseData.data,
                    isMemberModeActiveAtCall: true
                });

            }else {
                // 1. API 응답을 response 변수에 저장
                const response = await timeRecommendApi(genresMovie, genresTV);

                // 2. MBTI 컴포넌트처럼, 응답 데이터를 가공하여 새로운 data 객체 생성
                const data = {
                    domesticMovies: response.data.domesticMovies || [],
                    internationalMovies: response.data.internationalMovies || [],
                    domesticTV: response.data.domesticTV || [],
                    internationalTV: response.data.internationalTV || [],
                };

                // 3. 가공된 data 객체를 전달
                requestRecommendation({
                    recommendationId: 'time',
                    data: data, // <-- 가공된 데이터를 전달
                    isMemberModeActiveAtCall: false
                });
            }
            handleClose();
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            alert('추천 요청에 실패했습니다.');
            setIsLoading(false);
        }
    };

    if (activeRecommendation !== 'time') return null;

    return (
        <div className={`recommendation-overlay ${isClosing ? 'closing' : ''}`} ref={overlayRef}>
            <div className="recommendation-section">
                <h2 className="recommendation-title">시간대 기반 추천</h2>
                <div className="recommendation-form">
                    <div className="form-field">
                        <p>현재 시간: {new Date().toLocaleTimeString('ko-KR')}</p>
                    </div>
                    <div className="form-buttons">
                        <button onClick={handleClose} className="form-button form-button-secondary">취소</button>
                        <button onClick={handleSubmit} className="form-button form-button-primary">확인</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TimeRecommendation;