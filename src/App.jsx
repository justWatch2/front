import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- 컴포넌트 임포트 ---
import MainContent from './components/MainContent';
import Header from './components/Header';
import MovieModal from './components/MovieModal.jsx';

// --- Context API 임포트 ---
import { RecommendationContext } from './RecommendationContext.jsx';

// --- 스타일 임포트 ---
import './styles/App.css'; // <<< App.css가 전역 스타일을 담당합니다.
import './styles/Header.css';
import './styles/MovieModal.css';


function App() {
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
        <Router>
            {/* 앱의 최상위 컨테이너에 .app 클래스 적용 */}
            <div className="app">
                {/* Header는 라우트와 관계없이 항상 화면 상단에 고정됩니다. */}
                <Header />

                {/* Routes 내부에 각 페이지 컴포넌트를 정의합니다. */}
                {/* <main className="main"> 태그를 제거하고, Routes의 결과물에 .page-content 적용 */}
                <Routes>
                    {/* 모든 라우트 요소는 .page-content 클래스로 감싸서 일관된 패딩을 가집니다. */}
                    <Route path="/" element={<div className="page-content"><MainContent /></div>} />

                    {/* ... (다른 라우트들 - 추후 추가될 경우에도 .page-content로 감싸야 함) ... */}
                    {/* 예: <Route path="/recommendations" element={<div className="page-content"><RecommendationPage /></div>} /> */}

                    <Route path="*" element={
                        <div className="page-content" style={{textAlign: 'center', paddingTop: '100px', color: 'white'}}>
                            <h2>404 Page Not Found</h2>
                            <p>페이지를 찾을 수 없습니다.</p>
                        </div>
                    } />
                </Routes>
                {/* <main className="main"> 태그가 제거되었으므로 이 닫는 태그도 제거 */}

                {/* MovieModal은 App 레벨에서 전역적으로 관리합니다. */}
                {selectedMovie && (
                    <MovieModal
                        movie={selectedMovie}
                        onClose={closeModal}
                        onDetails={goToDetails}
                    />
                )}
            </div> {/* .app 닫는 태그 */}
        </Router>
    );
}

export default App;