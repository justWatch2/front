import React, { createContext, useState, useCallback, useEffect } from 'react';
import { autoRefreshCheck } from "../../tokenUtils/TokenUtils";
import { findmemberId } from "./api/UserApi";
import InviteModal from "../recommendFriend/InviteModal";

export const RecommendationContext = createContext();

export const RecommendationProvider = ({ children }) => {
    // --- 상태 관리 ---
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userImgUrl, setUserImgUrl] = useState(null); // ✅ 이미지 URL 상태
    const [isMemberModeActive, setIsMemberModeActive] = useState(false);
    // ... (기타 상태는 그대로)
    const [recommendations, setRecommendations] = useState({});
    const [defaultPosters, setDefaultPosters] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeRecommendation, setActiveRecommendation] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedMediaType, setSelectedMediaType] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedAgeRating, setSelectedAgeRating] = useState('');
    const [invites, setInvites] = useState([]);
    const [showInviteModal, setShowInviteModal] = useState(false);


    // --- 로직 및 함수 ---

    // 1. 앱 시작 시 localStorage를 확인하여 로그인 상태 복원
    useEffect(() => {
        const token = localStorage.getItem('jwt');
        const storedUserId = localStorage.getItem('userId');
        const storedImgUrl = localStorage.getItem('img'); // ✅ 로컬스토리지에서 이미지 URL도 가져옵니다.

        const urlParams = new URLSearchParams(window.location.search);
        const uuidFromUrl = urlParams.get("uuid");

        if (token && storedUserId) {
            setIsLoggedIn(true);
            setUserId(storedUserId);
            setUserImgUrl(storedImgUrl); // ✅ 가져온 이미지 URL을 Context 상태에 저장합니다.
        }

        if (uuidFromUrl) {
            localStorage.setItem(urlParams, urlParams);
            alert("uuid 초대 저장");
            alert(urlParams);
        }
    }, []);

    // 2. 로그인 상태가 '로그아웃'으로 변경되면, 회원 모드도 자동으로 비활성화
    useEffect(() => {
        if (!isLoggedIn) {
            setIsMemberModeActive(false);
        }
    }, [isLoggedIn]);

    // 3. 로그인 성공 시 호출될 함수
    const handleLogin = useCallback(async (token) => {
        localStorage.setItem('jwt', token);
        const response = await findmemberId();
        if (response) {
            setIsLoggedIn(true);
            setUserId(response.memberName);
            setUserImgUrl(response.imgUrl); // ✅ Context 상태 업데이트

            localStorage.setItem('userId', response.memberName);
            if (response.imgUrl) {
                localStorage.setItem("img", response.imgUrl);
            } else {
                localStorage.removeItem("img"); // 이미지가 없는 경우 로컬스토리지에서도 제거
            }
        }
        await tryInviteFriend();
    }, []);

    // 4. 로그아웃 시 호출될 함수
    const handleLogout = useCallback(async () => {
        try {
            await autoRefreshCheck({
                method: "POST",
                url: "http://localhost:8080/api/logout",
            });
            alert("로그아웃 되었습니다.");
        } catch (error) {
            console.error("로그아웃 API 호출 실패:", error);
        } finally {
            localStorage.removeItem('jwt');
            localStorage.removeItem('userId');
            localStorage.removeItem("img");
            setIsLoggedIn(false);
            setUserId(null);
            setUserImgUrl(null); // ✅ Context 상태도 초기화
        }
    }, []);

    // ✅ 5. [핵심] 프로필 수정 시 호출될 함수
    const updateUserInfo = useCallback(({ memberName, imgUrl }) => {
        // Context 상태 업데이트
        if (memberName) {
            setUserId(memberName);
            localStorage.setItem('userId', memberName);
        }
        // imgUrl은 null일 수도 있으므로 분기 처리
        setUserImgUrl(imgUrl);
        if (imgUrl) {
            localStorage.setItem('img', imgUrl);
        } else {
            localStorage.removeItem('img');
        }
    }, []);


    //초대받는 코드 실행 부분
    const tryInviteFriend = async () => {
        const uuidTokens = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("uuid")) {
                uuidTokens.push({
                    key: key,
                    value: localStorage.getItem(key),
                });
            }
        }
        if (uuidTokens.length < 1) {
            return;
        }
        try {
            const response = await autoRefreshCheck({
                url: "http://localhost:8080/api/friend/nicknameByUuids",
                method: "POST",
                data: {
                    uuids: uuidTokens.map((item) => item.value),
                },
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const enriched = uuidTokens.map((item) => ({
                key: item.key,
                uuid: item.value,
                nickname: response.data[item.value],
            }));
            setInvites(enriched);
            setShowInviteModal(true);
        } catch (error) {
            console.error("초대 닉네임 로드 실패:", error);
        }
    };

    const toggleMemberMode = useCallback(() => {
        if (isLoggedIn) {
            setIsMemberModeActive(prev => !prev);
        } else {
            alert('로그인이 필요한 기능입니다.');
        }
    }, [isLoggedIn]);

    // 기타 추천 관련 함수들... (생략)
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
        isLoggedIn, userId, userImgUrl, // ✅ userImgUrl 추가
        isMemberModeActive,
        recommendations, setRecommendations, defaultPosters, setDefaultPosters,
        isLoading, setIsLoading, activeRecommendation, openRecommendation,
        closeRecommendation, requestRecommendation, clearRecommendations,
        selectedCategory, setSelectedCategory, selectedMediaType, setSelectedMediaType,
        selectedRegion, setSelectedRegion, selectedAgeRating, setSelectedAgeRating,
        handleLogin, handleLogout, toggleMemberMode,
        updateUserInfo // ✅ updateUserInfo 함수 추가
    };

    return (
        <RecommendationContext.Provider value={contextValue}>
            {children}
            {showInviteModal && (
                <InviteModal
                    invites={invites}
                    onAccept={(acceptedKey) => {
                        setInvites((prev) => prev.filter((inv) => inv.key !== acceptedKey));
                    }}
                    onClose={() => {
                        setShowInviteModal(false);
                    }}
                />
            )}
        </RecommendationContext.Provider>
    );
};