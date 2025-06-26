import React, {useState, useContext, useRef, useEffect} from 'react';

import { RecommendationContext } from '../RecommendationContext.jsx';
import '../styles/Recommendation.css';
import {mbtiRecommendApi} from "../api/RecommendApi";

function MBTIRecommendation() {
    const { activeRecommendation, closeRecommendation, requestRecommendation,setSelectedCategory,setIsLoading } = useContext(RecommendationContext);
    const [mbti, setMbti] = useState('');

    const [isClosing, setIsClosing] = useState(false);
    const overlayRef = useRef(null);

    const mbtiOptions = [
        'INFP', 'INFJ', 'INTP', 'INTJ', 'ENFP', 'ENFJ', 'ENTP', 'ENTJ',
        'ISFP', 'ISFJ', 'ISTP', 'ISTJ', 'ESFP', 'ESFJ', 'ESTP', 'ESTJ',
    ];

    const getGenres = (mbti) => {
        const genresMap = {
            INFP: {
                genresMovie: ['로맨스', '판타지'],
                genresTV: ['로맨스', '드라마']
            },
            INFJ: {
                genresMovie: ['드라마', '미스터리'],
                genresTV: ['드라마', '미스터리']
            },
            INTP: {
                genresMovie: ['SF', '다큐멘터리'],
                genresTV: ['Sci-Fi & Fantasy', '다큐멘터리']
            },
            INTJ: {
                genresMovie: ['스릴러', '범죄'],
                genresTV: ['범죄', '미스터리']
            },
            ENFP: {
                genresMovie: ['코미디', '모험'],
                genresTV: ['코미디', 'Action & Adventure']
            },
            ENFJ: {
                genresMovie: ['드라마', '로맨스'],
                genresTV: ['로맨스', '드라마']
            },
            ENTP: {
                genresMovie: ['코미디', 'SF'],
                genresTV: ['코미디', 'Sci-Fi & Fantasy']
            },
            ENTJ: {
                genresMovie: ['액션', '스릴러'],
                genresTV: ['Action & Adventure', '범죄']
            },
            ISFP: {
                genresMovie: ['로맨스', '모험'],
                genresTV: ['로맨스', '가족']
            },
            ISFJ: {
                genresMovie: ['가족', '드라마'],
                genresTV: ['가족', '드라마']
            },
            ISTP: {
                genresMovie: ['액션', '모험'],
                genresTV: ['Action & Adventure', 'Reality']
            },
            ISTJ: {
                genresMovie: ['다큐멘터리', '역사'],
                genresTV: ['다큐멘터리', '역사']
            },
            ESFP: {
                genresMovie: ['코미디', '음악'],
                genresTV: ['코미디', '뮤지컬']
            },
            ESFJ: {
                genresMovie: ['가족', '로맨스'],
                genresTV: ['가족', '로맨스']
            },
            ESTP: {
                genresMovie: ['액션', '스릴러'],
                genresTV: ['Action & Adventure', '스릴러']
            },
            ESTJ: {
                genresMovie: ['범죄', '드라마'],
                genresTV: ['범죄', '드라마']
            },
        };

        return genresMap[mbti] || { genresMovie: ['다양한 장르'], genresTV: ['다양한 장르'] };
    };



    const handleSubmit = async () => {
        console.log('Fetching MBTI recommendations:', mbti);
        if (!mbti) {
            alert('MBTI를 선택하세요.');
            return;
        }

        try {
            const { genresMovie, genresTV } = getGenres(mbti);
            console.log(genresMovie);
            console.log(genresTV);

            setIsClosing(true);
            setIsLoading(true);

            const response =await mbtiRecommendApi(genresMovie,genresTV)
            const data = {
                domesticMovies: response.data.domesticMovies || [],
                internationalMovies: response.data.internationalMovies || [],
                domesticTV: response.data.domesticTV || [],
                internationalTV: response.data.internationalTV || [],
            };

            requestRecommendation({
                recommendationId: 'mbti',
                data,
            });
            resetForm();
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            alert('추천 요청 실패');
        }
    };

    const resetForm = () => {
        setMbti('');
        closeRecommendation();
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

    if (activeRecommendation !== 'mbti') return null;

    return (
        <div className={`recommendation-overlay ${isClosing ? 'closing' : ''}`} ref={overlayRef}>
        <div className="recommendation-section">
            <h2 className="recommendation-title">MBTI 기반 추천</h2>
            <div className="recommendation-form">
                <div className="form-field">
                    <label htmlFor="mbti">MBTI:</label>
                    <select id="mbti" value={mbti} onChange={(e) => setMbti(e.target.value)}>
                        <option value="">MBTI 선택</option>
                        {mbtiOptions.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div className="form-buttons">
                    <button onClick={resetForm} className="form-button form-button-secondary">
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="form-button form-button-primary"
                        disabled={!mbti}
                    >
                        확인
                    </button>
                </div>
            </div>
         </div>
        </div>
    );

}

export default MBTIRecommendation;