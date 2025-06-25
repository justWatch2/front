// src/components/Header.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginSideMenu from './LoginSideMenu';
import { RecommendationContext } from '../RecommendationContext.jsx';
import '../styles/Header.css'; // Header.css 임포트 유지

const Header = () => {
    const [showBackground, setShowBackground] = useState(false);
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const {
        clearRecommendations,
        isLoggedIn,
        setIsLoggedIn,
        userId,
        setUserId,
        isMemberModeActive,
        setIsMemberModeActive
    } = useContext(RecommendationContext);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setShowBackground(true);
            } else {
                setShowBackground(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearchClick = () => {
        setShowSearchInput(!showSearchInput);
        setSearchTerm('');
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
            setShowSearchInput(false);
            setSearchTerm('');
        }
    };

    const toggleSidebar = () => {
        console.log('Hamburger menu clicked (Header)');
        setIsSidebarOpen((prev) => !prev);
    };

    const handleHomeClick = () => {
        clearRecommendations();
        console.log('Home button clicked');
        navigate('/');
    };

    const toggleMemberMode = () => {
        if (isLoggedIn) {
            setIsMemberModeActive(prev => !prev);
            clearRecommendations();
        } else {
            alert('테스트를 위해 로그인 및 회원 모드를 활성화합니다.');
            setIsLoggedIn(true);
            setUserId('crazyman'); // 임시 사용자 ID 'crazyman'
            setIsMemberModeActive(true);
            clearRecommendations();
        }
    };

    return (
        <header className={`header ${showBackground ? 'header-scrolled' : ''}`}>
            <div className="header-left">
                <Link to="/" className="netflix-logo" onClick={handleHomeClick}>
                    <img src="https://assets.nflxext.com/ffe/siteui/common/icons/nficon2023.ico" alt="Netflix Logo" />
                </Link>
                <nav className="main-nav">
                    <ul>
                        <li><Link to="/" onClick={handleHomeClick}>홈</Link></li>
                        <li><Link to="/recommendations">추천</Link></li>
                        <li><Link to="/series">시리즈</Link></li>
                        <li><Link to="/movies">영화</Link></li>
                        <li><Link to="/new-popular">NEW! 요즘 대세 콘텐츠</Link></li>
                        <li><Link to="/my-list">내가 찜한 콘텐츠</Link></li>
                        <li><Link to="/board">게시판</Link></li>
                    </ul>
                </nav>
            </div>
            <div className="header-right">
                <div className="search-container">
                    <button className="search-icon-button" onClick={handleSearchClick}>
                        <i className="fas fa-search"></i>
                    </button>
                    {showSearchInput && (
                        <form onSubmit={handleSearchSubmit} className="search-form">
                            <input
                                type="text"
                                placeholder="검색"
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                        </form>
                    )}
                </div>
                <button className="header-icon-button"><i className="fas fa-bell"></i></button>

                {/* 회원 모드 토글 버튼 */}
                <button
                    className={`header-icon-button member-mode-toggle ${isMemberModeActive ? 'active glowing-rainbow' : ''}`}
                    onClick={toggleMemberMode}
                    title={isMemberModeActive ? '회원 모드 활성화됨' : '회원 모드 비활성화됨'}
                >
                    <i className={`fas ${isMemberModeActive ? 'fa-user-check' : 'fa-user'}`}></i>
                    {isLoggedIn && <span className="member-mode-text">{isMemberModeActive ? '회원 모드' : '일반 모드'}</span>}
                    {!isLoggedIn && <span className="member-mode-text">로그인</span>}
                </button>


                <button className="header-icon-button" onClick={toggleSidebar}>
                    <i className="fas fa-bars"></i>
                </button>
            </div>
            <LoginSideMenu open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </header>
    );
};

export default Header;