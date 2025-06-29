import React, { useContext } from 'react';
import WeatherRecommendationModal from './WeatherRecommendationModal.jsx';
import MbtiRecommendationModal from './MbtiRecommendationModal.jsx';
import TimeRecommendationModal from './TimeRecommendationModal.jsx';
import ComplexRecommendationModal from './ComplexRecommendationModal.jsx';
import { RecommendationContext } from '../RecommendationContext.jsx';

function RecommendationModal({ mediaType, isDomestic }) {
    const { modalType } = useContext(RecommendationContext);

    return (
        <>
            {modalType === 'weather' && <WeatherRecommendationModal />}
            {modalType === 'mbti' && <MbtiRecommendationModal />}
            {modalType === 'time' && <TimeRecommendationModal />}
            {modalType === 'complex' && <ComplexRecommendationModal />}
        </>
    );
}

export default RecommendationModal;