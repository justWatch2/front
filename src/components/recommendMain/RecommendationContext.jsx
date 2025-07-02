import React, { createContext, useState, useCallback, useEffect } from 'react';
import {autoRefreshCheck} from "../../tokenUtils/TokenUtils";
import {findmemberId} from "./api/UserApi";

export const RecommendationContext = createContext();

export const RecommendationProvider = ({ children }) => {
    // --- 상태 관리 ---
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [isMemberModeActive, setIsMemberModeActive] = useState(false);
    const [userImgUrl, setUserImgUrl] = useState(null);
    const [recommendations, setRecommendations] = useState({});
    const [defaultPosters, setDefaultPosters] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeRecommendation, setActiveRecommendation] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedMediaType, setSelectedMediaType] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedAgeRating, setSelectedAgeRating] = useState('');

    // --- 로직 및 함수 ---

    // 1. 앱 시작 시 localStorage를 확인하여 로그인 상태 복원
    useEffect(() => {
        const token = localStorage.getItem('jwt');
        const storedUserId = localStorage.getItem('userId');
        if (token && storedUserId) {
            setIsLoggedIn(true);
            setUserId(storedUserId);
        }
    }, []);

    // 2. [핵심] 로그인 상태가 '로그아웃'으로 변경되면, 회원 모드도 자동으로 비활성화
    useEffect(() => {
        if (!isLoggedIn) {
            setIsMemberModeActive(false);
        }
    }, [isLoggedIn]);

    // 3. 로그인 성공 시 호출될 함수
    const handleLogin = useCallback(async (token) => {
        localStorage.setItem('jwt', token);
        const response = await  findmemberId();
        console.log(response);
        console.log(response.data);
        if (response) {
            setIsLoggedIn(true);
        }
        localStorage.setItem('userId', response.memberName);
        // localStorage.setItem('userName', response.userId);
        if(response.imgUrl != null){
            localStorage.setItem("img",response.imgUrl);
        }

        setUserId(response.memberName);

    }, []);

    // 4. 로그아웃 시 호출될 함수
    const handleLogout = useCallback(async () => {
        try {
            // 서버에 로그아웃 요청 API 호출
            await autoRefreshCheck({
                method: "POST",
                url: "http://localhost:8080/api/logout",
            });

            alert("로그아웃 되었습니다.");

        } catch (error) {
            console.error("로그아웃 API 호출 실패:", error);
            // API 호출에 실패하더라도 프론트엔드에서는 로그아웃 처리
        } finally {
            // API 성공/실패 여부와 관계없이 항상 실행
            localStorage.removeItem('jwt');
            localStorage.removeItem('userId');
            localStorage.removeItem("img");
            setIsLoggedIn(false);
            setUserId(null);
        }
    }, []);

    // 5. 회원 모드 버튼 클릭 시 호출될 함수
    const toggleMemberMode = useCallback(() => {
        if (isLoggedIn) {
            setIsMemberModeActive(prev => !prev);
        } else {
            alert('로그인이 필요한 기능입니다.');
        }
    }, [isLoggedIn]);

    // 기타 추천 관련 함수들
    const openRecommendation = useCallback((type) => setActiveRecommendation(type), []);
    const closeRecommendation = useCallback(() => setActiveRecommendation(null), []);

    const requestRecommendation = useCallback(({ recommendationId, data, isMemberModeActiveAtCall }) => {
        const processedData = {};
        if (isMemberModeActiveAtCall || recommendationId === 'complex') {
            processedData.complexList = data?.userSelectedList || data?.complexList || (Array.isArray(data) ? data : []);
        } else {
            processedData.domesticMovies = data?.domesticMovies || [];
            processedData.internationalMovies = data?.internationalMovies || [];
            processedData.domesticTV = data?.domesticTV || [];
            processedData.internationalTV = data?.internationalTV || [];
        }
        setRecommendations({ [recommendationId]: processedData });
        setIsLoading(false);
    }, []);
    const clearRecommendations = useCallback(() => {
        setRecommendations({});
        setActiveRecommendation(null);
        setSelectedCategory(null);
        setSelectedMediaType('');
        setSelectedRegion('');
        setSelectedAgeRating('');
    }, []);

    // Provider를 통해 외부로 내보낼 값들
    const contextValue = {
        isLoggedIn, userId, isMemberModeActive,
        recommendations, setRecommendations, defaultPosters, setDefaultPosters,
        isLoading, setIsLoading, activeRecommendation, openRecommendation,
        closeRecommendation, requestRecommendation, clearRecommendations,
        selectedCategory, setSelectedCategory, selectedMediaType, setSelectedMediaType,
        selectedRegion, setSelectedRegion, selectedAgeRating, setSelectedAgeRating,
        handleLogin, handleLogout, toggleMemberMode,userImgUrl,setUserImgUrl
    };

    return (
        <RecommendationContext.Provider value={contextValue}>
            {children}
        </RecommendationContext.Provider>
    );
};