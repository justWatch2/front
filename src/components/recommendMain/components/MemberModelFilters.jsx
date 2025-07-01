import React, { useContext, useCallback } from 'react';
import { RecommendationContext } from '../RecommendationContext';
import '../styles/MemberModelFilters.css'; // 자신의 CSS 파일을 임포트합니다.

const MemberModelFilters = () => {
    const {
        isMemberModeActive,
        selectedMediaType,
        setSelectedMediaType,
        selectedRegion,
        setSelectedRegion,
        selectedAgeRating,
        setSelectedAgeRating
    } = useContext(RecommendationContext);

    const handleFilterSelect = useCallback((setter) => (value) => {
        setter(prev => (prev === value ? '' : value));
    }, []);

    // 회원 모드가 아니면 아무것도 렌더링하지 않음
    if (!isMemberModeActive) {
        return null;
    }

    return (
        <div className="member-mode-filters">
            <div className="filter-group">
                <label>미디어 타입</label>
                <div className="button-group">
                    <button type="button" className={`filter-button ${selectedMediaType === 'movie' ? 'selected' : ''}`} onClick={() => handleFilterSelect(setSelectedMediaType)('movie')}>영화</button>
                    <button type="button" className={`filter-button ${selectedMediaType === 'tv' ? 'selected' : ''}`} onClick={() => handleFilterSelect(setSelectedMediaType)('tv')}>TV</button>
                </div>
            </div>
            <div className="filter-group">
                <label>지역</label>
                <div className="button-group">
                    <button type="button" className={`filter-button ${selectedRegion === 'domestic' ? 'selected' : ''}`} onClick={() => handleFilterSelect(setSelectedRegion)('domestic')}>국내</button>
                    <button type="button" className={`filter-button ${selectedRegion === 'international' ? 'selected' : ''}`} onClick={() => handleFilterSelect(setSelectedRegion)('international')}>해외</button>
                </div>
            </div>
            <div className="filter-group">
                <label>연령 등급</label>
                <div className="button-group">
                    <button type="button" className={`filter-button ${selectedAgeRating === 'adult' ? 'selected' : ''}`} onClick={() => handleFilterSelect(setSelectedAgeRating)('adult')}>성인</button>
                    <button type="button" className={`filter-button ${selectedAgeRating === 'notadult' ? 'selected' : ''}`} onClick={() => handleFilterSelect(setSelectedAgeRating)('notadult')}>전체</button>
                </div>
            </div>
        </div>
    );
};

export default MemberModelFilters;