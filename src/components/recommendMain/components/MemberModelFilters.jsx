// src/components/MemberModeFilters.jsx
import React, { useContext, useCallback } from 'react';
import { RecommendationContext } from '../RecommendationContext';
import '../styles/MemberModelFilters.css'; // 새로 생성한 CSS 파일 임포트

const MemberModeFilters = () => {
    const {
        selectedMediaType,
        setSelectedMediaType,
        selectedRegion,
        setSelectedRegion,
        selectedAgeRating,
        setSelectedAgeRating,
        isMemberModeActive,
    } = useContext(RecommendationContext);

    const handleFilterSelect = useCallback((setter) => (value) => {
        setter(prev => (prev === value ? '' : value));
    }, []);

    if (!isMemberModeActive) {
        return null;
    }

    return (
        <div className="member-mode-filters">
            {/* 미디어 타입 필터 그룹 */}
            <div className="filter-group">
                <label>미디어 타입:</label>
                <div className="button-group">
                    <button
                        type="button"
                        className={`genre-item ${selectedMediaType === 'movie' ? 'selected' : ''}`}
                        onClick={() => handleFilterSelect(setSelectedMediaType)('movie')}
                    >
                        영화
                    </button>
                    <button
                        type="button"
                        className={`genre-item ${selectedMediaType === 'tv' ? 'selected' : ''}`}
                        onClick={() => handleFilterSelect(setSelectedMediaType)('tv')}
                    >
                        TV
                    </button>
                </div>
            </div>

            {/* 지역 필터 그룹 */}
            <div className="filter-group">
                <label>지역:</label>
                <div className="button-group">
                    <button
                        type="button"
                        className={`genre-item ${selectedRegion === 'domestic' ? 'selected' : ''}`}
                        onClick={() => handleFilterSelect(setSelectedRegion)('domestic')}
                    >
                        국내
                    </button>
                    <button
                        type="button"
                        className={`genre-item ${selectedRegion === 'international' ? 'selected' : ''}`}
                        onClick={() => handleFilterSelect(setSelectedRegion)('international')}
                    >
                        해외
                    </button>
                </div>
            </div>

            {/* 연령 등급 필터 그룹 */}
            <div className="filter-group">
                <label>연령 등급:</label>
                <div className="button-group">
                    <button
                        type="button"
                        className={`genre-item ${selectedAgeRating === 'adult' ? 'selected' : ''}`}
                        onClick={() => handleFilterSelect(setSelectedAgeRating)('adult')}
                    >
                        성인
                    </button>
                    <button
                        type="button"
                        className={`genre-item ${selectedAgeRating === 'notadult' ? 'selected' : ''}`}
                        onClick={() => handleFilterSelect(setSelectedAgeRating)('notadult')}
                    >
                        전체이용가
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MemberModeFilters;