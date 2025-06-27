import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- 컴포넌트 임포트 ---
import MainContent from './components/recommendMain/components/MainContent';

import MovieModal from './components/recommendMain/components/MovieModal.jsx';

// --- Context API 임포트 ---
import { RecommendationContext } from './components/recommendMain/RecommendationContext.jsx';

// --- 스타일 임포트 ---
import './components/recommendMain/styles/RecommendReal.css'; // <<< RecommendReal.css가 전역 스타일을 담당합니다.
import './components/recommendMain/styles/Header.css';
import './components/recommendMain/styles/MovieModal.css';


function RecommendReal() {
    const { selectedMovie, setSelectedMovie } = useContext(RecommendationContext);

    useEffect(() => {
        if (selectedMovie) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedMovie]);

    const closeModal = () => setSelectedMovie(null);
    const goToDetails = (item) => {
        console.log('상세 페이지로 이동:', item.koreanName || item.korean_title || item.name);
        closeModal();
    };

    return (

            <div className="app" style={{ marginTop: "-50px" }}>
                {/* Header는 라우트와 관계없이 항상 화면 상단에 고정됩니다. */}


                {/* Routes 내부에 각 페이지 컴포넌트를 정의합니다. */}
                {/* <main className="main"> 태그를 제거하고, Routes의 결과물에 .page-content 적용 */}

                    {/* 모든 라우트 요소는 .page-content 클래스로 감싸서 일관된 패딩을 가집니다. */}
                {<div className="page-content"><MainContent /></div>}

                    {/* ... (다른 라우트들 - 추후 추가될 경우에도 .page-content로 감싸야 함) ... */}
                    {/* 예: <Route path="/recommendations" element={<div className="page-content"><RecommendationPage /></div>} /> */}


                {/* <main className="main"> 태그가 제거되었으므로 이 닫는 태그도 제거 */}

                {/* MovieModal은 RecommendReal 레벨에서 전역적으로 관리합니다. */}
                {selectedMovie && (
                    <MovieModal
                        movie={selectedMovie}
                        onClose={closeModal}
                        onDetails={goToDetails}
                    />
                )}
            </div>

    );
}

export default RecommendReal;