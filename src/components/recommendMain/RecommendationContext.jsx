import React, { createContext, useState, useCallback, useEffect } from 'react';
import {autoRefreshCheck} from "../../tokenUtils/TokenUtils";
import {findmemberId} from "./api/UserApi"; // 실제 경로에 맞게 수정해주세요.

export const RecommendationContext = createContext();

export const RecommendationProvider = ({ children }) => {
    // --- 상태 관리 ---
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userImgUrl, setUserImgUrl] = useState(null); // 이미지 URL 상태
    const [isMemberModeActive, setIsMemberModeActive] = useState(false);
    const [recommendations, setRecommendations] = useState({});
    const [defaultPosters, setDefaultPosters] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeRecommendation, setActiveRecommendation] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedMediaType, setSelectedMediaType] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedAgeRating, setSelectedAgeRating] = useState('');

    // --- 로직 및 함수 ---

    // 1. 앱 시작 시 localStorage에서 모든 사용자 정보 복원
    useEffect(() => {
        const token = localStorage.getItem('jwt');
        const storedUserId = localStorage.getItem('userId');
        const storedImgUrl = localStorage.getItem('img'); // 이미지 URL도 가져오기

        if (token && storedUserId) {
            setIsLoggedIn(true);
            setUserId(storedUserId);
            setUserImgUrl(storedImgUrl); // 이미지 URL 상태 설정
        }
    }, []);

    // 2. [핵심] 로그인 상태가 '로그아웃'으로 변경되면, 회원 모드도 자동으로 비활성화
    useEffect(() => {
        if (!isLoggedIn) {
            setIsMemberModeActive(false);
        }
    }, [isLoggedIn]);

    // 3. 로그인 성공 시 모든 정보 저장
    const handleLogin = useCallback(async (token) => {
        localStorage.setItem('jwt', token);

        // 로그인 성공 후 서버에서 최신 프로필 정보(닉네임, 이미지 URL)를 가져옵니다.
        const profileInfo = await findmemberId();
        if (profileInfo) {
            localStorage.setItem('userId', profileInfo.memberName);
            localStorage.setItem('img', profileInfo.imgUrl || ''); // 이미지가 없으면 빈 문자열 저장

            setIsLoggedIn(true);
            setUserId(profileInfo.memberName);
            setUserImgUrl(profileInfo.imgUrl);
        }
    }, []);

    // 4. 로그아웃 시 모든 정보 제거
    const handleLogout = useCallback(async () => {
        try {
            await autoRefreshCheck({ method: "POST", url: "http://localhost:8080/api/logout" });
            alert("로그아웃 되었습니다.");
        } catch (error) {
            console.error("로그아웃 API 호출 실패:", error);
        } finally {
            localStorage.removeItem('jwt');
            localStorage.removeItem('userId');
            localStorage.removeItem('img'); // 이미지 URL 제거
            setIsLoggedIn(false);
            setUserId(null);
            setUserImgUrl(null); // 이미지 URL 상태 초기화
        }
    }, []);

    // 5. 프로필 정보 업데이트를 위한 함수 추가
    const updateUserInfo = useCallback((newInfo) => {
        if (newInfo.memberName) {
            localStorage.setItem('userId', newInfo.memberName);
            setUserId(newInfo.memberName);
        }
        // imgUrl은 null일 수도 있으므로 undefined가 아닐 때만 업데이트
        if (typeof newInfo.imgUrl !== 'undefined') {
            localStorage.setItem('img', newInfo.imgUrl || '');
            setUserImgUrl(newInfo.imgUrl);
        }
    }, []);

    // 6. 회원 모드 버튼 클릭 시 호출될 함수
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

    // Provider를 통해 내보낼 값들
    const contextValue = {
        isLoggedIn, userId, userImgUrl, isMemberModeActive,
        recommendations, setRecommendations, defaultPosters, setDefaultPosters,
        isLoading, setIsLoading, activeRecommendation, openRecommendation,
        closeRecommendation, requestRecommendation, clearRecommendations,
        selectedCategory, setSelectedCategory, selectedMediaType, setSelectedMediaType,
        selectedRegion, setSelectedRegion, selectedAgeRating, setSelectedAgeRating,
        handleLogin, handleLogout, toggleMemberMode, updateUserInfo
    };

    return (
        <RecommendationContext.Provider value={contextValue}>
            {children}
        </RecommendationContext.Provider>
    );
};