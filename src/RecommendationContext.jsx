// src/RecommendationContext.jsx
import React, { createContext, useState, useCallback } from 'react';

export const RecommendationContext = createContext();

export const RecommendationProvider = ({ children }) => {
    const [recommendations, setRecommendations] = useState({});
    const [defaultPosters, setDefaultPosters] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeRecommendation, setActiveRecommendation] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [isMemberModeActive, setIsMemberModeActive] = useState(false);

    const [selectedMediaType, setSelectedMediaType] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedAgeRating, setSelectedAgeRating] = useState('');


    const openRecommendation = useCallback((type) => {
        console.log('[Context] Opening recommendation:', type);
        setActiveRecommendation(type);
    }, []);

    const closeRecommendation = useCallback(() => {
        console.log('[Context] Closing recommendation');
        setActiveRecommendation(null);
    }, []);

    // requestRecommendation 함수: 백엔드에서 받은 data를 컨텍스트에 저장, 추천 ID에 따라 가공
    const requestRecommendation = useCallback(({ recommendationId, data, isMemberModeActiveAtCall }) => {
        console.log('[Context] Requesting recommendation to set state:', { recommendationId, data, isMemberModeActiveAtCall });
        console.log('[Context] Raw data received for processing:', data); // 원본 데이터 구조 확인

        const processedData = {};

        // --- 핵심 로직 변경 시작 ---
        // 1. 회원 모드이거나, complex 추천 타입인 경우 (ComplexGrid로 렌더링)
        if (isMemberModeActiveAtCall || recommendationId === 'complex') {
            let itemsForComplexGrid = [];

            // 백엔드 응답에서 complexList 아이템을 추출
            if (data.userSelectedList && Array.isArray(data.userSelectedList)) {
                itemsForComplexGrid = data.userSelectedList;
                console.log("[Context] Processed as complexGrid (from 'selectedList' key).");
            } else if (data.complexList && Array.isArray(data.complexList)) {
                itemsForComplexGrid = data.complexList;
                console.log("[Context] Processed as complexGrid (from 'complexList' key).");
            } else if (Array.isArray(data)) {
                itemsForComplexGrid = data;
                console.log("[Context] Processed as complexGrid (from array data).");
            } else {
                console.warn(`[Context] Unexpected data structure for ComplexGrid type (ID: ${recommendationId}):`, data);
                itemsForComplexGrid = [];
            }
            processedData.complexList = itemsForComplexGrid; // ComplexGrid에 최종 할당

        }
        // 2. 일반 모드인 경우 (Row 컴포넌트로 렌더링)
        else {
            console.log("dldldldldlddldlaweqwwdadawdwa")
            console.log("sssss"+data)
            // 백엔드 응답이 domesticMovies, internationalMovies 등을 담고 있다고 가정
            processedData.domesticMovies = data.domesticMovies || [];
            processedData.internationalMovies = data.internationalMovies || [];
            processedData.domesticTV = data.domesticTV || [];
            processedData.internationalTV = data.internationalTV || [];
            console.log("[Context] Processed as Row type.");
        }
        // --- 핵심 로직 변경 끝 ---

        setRecommendations(() => ({

            [recommendationId]: processedData,
        }));

        setIsLoading(false);
    }, []);


    const clearRecommendations = useCallback(() => {
        console.log('[Context] Clearing recommendations');
        setRecommendations({});
        setActiveRecommendation(null);
        setSelectedCategory(null);
        setSelectedMediaType('');
        setSelectedRegion('');
        setSelectedAgeRating('');
    }, []);


    const contextValue = {
        recommendations,
        setRecommendations,
        defaultPosters,
        setDefaultPosters,
        isLoading,
        setIsLoading,
        activeRecommendation,
        openRecommendation,
        closeRecommendation,
        requestRecommendation,
        clearRecommendations,
        selectedCategory,
        setSelectedCategory,
        isLoggedIn,
        setIsLoggedIn,
        userId,
        setUserId,
        isMemberModeActive,
        setIsMemberModeActive,
        selectedMediaType,
        setSelectedMediaType,
        selectedRegion,
        setSelectedRegion,
        selectedAgeRating,
        setSelectedAgeRating,
    };

    return (
        <RecommendationContext.Provider value={contextValue}>
            {children}
        </RecommendationContext.Provider>
    );
};