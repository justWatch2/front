import React from 'react';
import '../styles/LoadingPage.css';

const LoadingPage = () => {
    return (
        <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p className="loading-text">로딩 중입니다...</p>
        </div>
    );
};

export default LoadingPage;
