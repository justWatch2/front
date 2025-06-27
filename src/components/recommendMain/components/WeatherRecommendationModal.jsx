import React, {useState, useContext, useEffect, useRef} from 'react';
import axios from 'axios';
import { RecommendationContext } from '../RecommendationContext.jsx';
import '../styles/RecommendationModal.css';
import {weatherRecommendApi} from "../api/RecommendApi";

const locations = [
    {do: '서울특별시', si: '서울특별시'},
    {do: '부산광역시', si: '부산광역시'},
    {do: '대구광역시', si: '대구광역시'},
    {do: '인천광역시', si: '인천광역시'},
    {do: '광주광역시', si: '광주광역시'},
    {do: '대전광역시', si: '대전광역시'},
    {do: '울산광역시', si: '울산광역시'},
    {do: '세종특별자치시', si: '세종특별자치시'},
    {do: '경기도', si: '수원시'},
    {do: '경기도', si: '고양시'},
    {do: '경기도', si: '용인시'},
    {do: '경기도', si: '성남시'},
    {do: '경기도', si: '부천시'},
    {do: '경기도', si: '안산시'},
    {do: '경기도', si: '안양시'},
    {do: '경기도', si: '남양주시'},
    {do: '경기도', si: '화성시'},
    {do: '경기도', si: '평택시'},
    {do: '경기도', si: '의정부시'},
    {do: '경기도', si: '시흥시'},
    {do: '경기도', si: '파주시'},
    {do: '경기도', si: '김포시'},
    {do: '경기도', si: '광명시'},
    {do: '경기도', si: '광주시'},
    {do: '경기도', si: '군포시'},
    {do: '경기도', si: '이천시'},
    {do: '경기도', si: '양주시'},
    {do: '경기도', si: '오산시'},
    {do: '경기도', si: '구리시'},
    {do: '경기도', si: '안성시'},
    {do: '경기도', si: '포천시'},
    {do: '경기도', si: '의왕시'},
    {do: '경기도', si: '하남시'},
    {do: '경기도', si: '여주시'},
    {do: '경기도', si: '동두천시'},
    {do: '강원특별자치도', si: '춘천시'},
    {do: '강원특별자치도', si: '원주시'},
    {do: '강원특별자치도', si: '강릉시'},
    {do: '강원특별자치도', si: '동해시'},
    {do: '강원특별자치도', si: '태백시'},
    {do: '강원특별자치도', si: '속초시'},
    {do: '강원특별자치도', si: '삼척시'},
    {do: '충청북도', si: '청주시'},
    {do: '충청북도', si: '충주시'},
    {do: '충청북도', si: '제천시'},
    {do: '충청남도', si: '천안시'},
    {do: '충청남도', si: '공주시'},
    {do: '충청남도', si: '보령시'},
    {do: '충청남도', si: '아산시'},
    {do: '충청남도', si: '서산시'},
    {do: '충청남도', si: '논산시'},
    {do: '충청남도', si: '계룡시'},
    {do: '충청남도', si: '당진시'},
    {do: '전라북도', si: '전주시'},
    {do: '전라북도', si: '군산시'},
    {do: '전라북도', si: '익산시'},
    {do: '전라북도', si: '정읍시'},
    {do: '전라북도', si: '남원시'},
    {do: '전라북도', si: '김제시'},
    {do: '전라남도', si: '목포시'},
    {do: '전라남도', si: '여수시'},
    {do: '전라남도', si: '순천시'},
    {do: '전라남도', si: '나주시'},
    {do: '전라남도', si: '광양시'},
    {do: '경상북도', si: '포항시'},
    {do: '경상북도', si: '경주시'},
    {do: '경상북도', si: '김천시'},
    {do: '경상북도', si: '안동시'},
    {do: '경상북도', si: '구미시'},
    {do: '경상북도', si: '영주시'},
    {do: '경상북도', si: '영천시'},
    {do: '경상북도', si: '상주시'},
    {do: '경상북도', si: '문경시'},
    {do: '경상북도', si: '경산시'},
    {do: '경상남도', si: '창원시'},
    {do: '경상남도', si: '진주시'},
    {do: '경상남도', si: '통영시'},
    {do: '경상남도', si: '사천시'},
    {do: '경상남도', si: '김해시'},
    {do: '경상남도', si: '밀양시'},
    {do: '경상남도', si: '거제시'},
    {do: '경상남도', si: '양산시'},
    {do: '제주특별자치도', si: '제주시'},
    {do: '제주특별자치도', si: '서귀포시'}
]; //지역들

function WeatherRecommendation() {
    const [isClosing, setIsClosing] = useState(false);
    const overlayRef = useRef(null);

    const { activeRecommendation, closeRecommendation, requestRecommendation,setSelectedCategory,setIsLoading } = useContext(RecommendationContext);
    const [selectedDo, setSelectedDo] = useState('');
    const [selectedSi, setSelectedSi] = useState('');
    const doList = [...new Set(locations.map((loc) => loc.do))];
    const siList = locations.filter((loc) => loc.do === selectedDo).map((loc) => loc.si);

    const getWeatherGenres = (weather) => {
        const genresMap = {
            Clear: {
                genresMovie: ['코미디', '로맨스','가족'],
                genresTV: ['가족', 'Kids']
            },
            Rain: {
                genresMovie: ['드라마', '로맨스'],
                genresTV: ['드라마', '로맨스']
            },
            Snow: {
                genresMovie: ['가족', '로맨스'],
                genresTV: ['가족', 'Kids']
            },
            Clouds: {
                genresMovie: ['드라마', '미스터리'],
                genresTV: ['드라마', '미스터리']
            },
            Drizzle: {
                genresMovie: ['미스터리', '스릴러'],
                genresTV: ['미스터리', '드라마']
            },
            Thunderstorm: {
                genresMovie: ['액션', '스릴러'],
                genresTV: ['범죄', '미스터리']
            },
            Mist: {
                genresMovie: ['미스터리', '공포'],
                genresTV: ['미스터리', 'Sci-Fi & Fantasy']
            },
            Smoke: {
                genresMovie: ['범죄', '스릴러'],
                genresTV: ['범죄', 'Thriller']
            },
            Haze: {
                genresMovie: ['SF', '드라마'],
                genresTV: ['Sci-Fi & Fantasy', '드라마']
            },
            Dust: {
                genresMovie: ['서부', '모험'],
                genresTV: ['서부', 'Adventure']
            },
            Fog: {
                genresMovie: ['미스터리', '드라마'],
                genresTV: ['미스터리', '드라마']
            },
            Sand: {
                genresMovie: ['모험', '서부'],
                genresTV: ['Adventure', 'Action & Adventure']
            },
            Ash: {
                genresMovie: ['SF', '판타지'],
                genresTV: ['Sci-Fi & Fantasy', 'Thriller']
            },
            Squall: {
                genresMovie: ['액션', '모험'],
                genresTV: ['Action & Adventure', 'Thriller']
            },
            Tornado: {
                genresMovie: ['전쟁', '스릴러'],
                genresTV: ['Action & Adventure', 'Thriller']
            },
        };

        return genresMap[weather] || { genresMovie: ['다양한'], genresTV: ['Various'] };
    };

    const handleSubmit = async () => {
        console.log('Fetching weather recommendations for:', { selectedDo, selectedSi });
        if (!selectedDo || !selectedSi) {
            alert('모든 필수 항목을 선택하세요.');
            return;
        }

        try {
            const query = `${selectedSi}, ${selectedDo}, South Korea`;
            setIsLoading(true);
            const nominatimResponse = await axios.get(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=kr`
            );
            if (!nominatimResponse.data.length) {
                alert('위치를 찾을 수 없습니다.');
                return;
            }

            const { lat, lon } = nominatimResponse.data[0];
            const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`;
            const weatherResponse = await axios.get(weatherUrl);
            const weather = weatherResponse.data.list[0].weather[0].main;

            const { genresMovie, genresTV } = getWeatherGenres(weather);
            console.log('Weather recommendations:', weather);
            console.log("genresMovie:", genresMovie);
            console.log("genresTV:", genresTV);
/////////////////////////////////////////////////////////////////

            const response =  await weatherRecommendApi(genresMovie, genresTV);



            const data = {
                domesticMovies: response.data.domesticMovies || [],
                internationalMovies: response.data.internationalMovies || [],
                domesticTV: response.data.domesticTV || [],
                internationalTV: response.data.internationalTV || [],
            };

            requestRecommendation({
                recommendationId: 'weather',
                data,
            });
            resetForm();
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            alert('추천 요청 실패');
        }
    };

    const resetForm = () => {
        setSelectedDo('');
        setSelectedSi('');
        closeRecommendation();
    };

    const handleClose = () => {
        setIsClosing(true);
        setSelectedCategory(null);
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

    if (activeRecommendation !== 'weather') return null;

    return (
        <div className={`recommendation-overlay ${isClosing ? 'closing' : ''}`} ref={overlayRef}>
        <div className="recommendation-section">
            <h2 className="recommendation-title">날씨 기반 추천</h2>
            <div className="recommendation-form">
                <div className="form-field">
                    <label htmlFor="do">도:</label>
                    <select
                        id="do"
                        value={selectedDo}
                        onChange={(e) => {
                            setSelectedDo(e.target.value);
                            setSelectedSi('');
                        }}
                    >
                        <option value="">도를 선택하세요</option>
                        {doList.map((doName) => (
                            <option key={doName} value={doName}>{doName}</option>
                        ))}
                    </select>
                </div>
                <div className="form-field">
                    <label htmlFor="si">시:</label>
                    <select
                        id="si"
                        value={selectedSi}
                        onChange={(e) => setSelectedSi(e.target.value)}
                        disabled={!selectedDo}
                    >
                        <option value="">시를 선택하세요</option>
                        {siList.map((siName) => (
                            <option key={siName} value={siName}>{siName}</option>
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
                        disabled={!selectedDo || !selectedSi}
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
        </div>
    );
}

export default WeatherRecommendation;