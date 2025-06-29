
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FriendRecommend.css';

// 친구 목록 항목 컴포넌트
const FriendListItem = ({ name, numWish, numViewedMovie, icon, isSelected, onSelect }) => {
    return (
        <div className="friend-item">
            <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(name)}
            />
            <img src={icon} alt={name} />
            <span className="friend-name">{name}</span>
            <div className="friend-stats">
                <span>{numWish}</span>
                <span>{numViewedMovie}</span>
            </div>
        </div>
    );
};

const FriendRecommend = () => {
    // 상태 관리
    const [selectedCategory, setSelectedCategory] = useState('영화');
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [allSelected, setAllSelected] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [recommendOption, setRecommendOption] = useState('auto');
    const [friendList, setFriendList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [recommendedMovies, setRecommendedMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // TMDB API 키 (환경 변수로 대체 권장)
    const TMDB_API_KEY = '3d3c7315778f5fbf4c858608cd6ce78f';
    const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

    // 친구 목록 가져오기
    useEffect(() => {
        const fetchFriendsList = async () => {
            try {
                // *** 수정: 카테고리에 따라 친구 목록 API 호출 ***
                const response = await axios.get('/friend/getList', {
                    params: { category: selectedCategory },
                });
                setFriendList(response.data);
            } catch (error) {
                console.error('Error fetching friendsList:', error);
                setError('친구 목록을 가져오지 못했습니다.');
            }
        };
        fetchFriendsList();
    }, [selectedCategory]); // *** 수정: selectedCategory 의존성 추가 ***

    // 실시간 추천 가져오기
    useEffect(() => {
        const timer = setTimeout(async () => {
            setError(null);
            setIsLoading(true);
            try {
                const memberIds = selectedFriends;

                const response = await axios.post('/recommend/movies', {
                    category: selectedCategory,
                    memberIds,
                    recommendOption: recommendOption || 'auto',
                });

                // TMDB API로 트레일러 및 포스터 URL 가져오기
                const itemsWithTrailers = await Promise.all(
                    response.data.map(async (item) => {
                        const itemId = item.movieId || item.id || item.tmdbId;
                        if (!itemId || isNaN(itemId)) {
                            return {
                                ...item,
                                poster: item.poster?.startsWith('http')
                                    ? item.poster
                                    : `${TMDB_IMAGE_BASE_URL}${item.poster}`,
                                trailer: null,
                            };
                        }

                        try {
                            const tmdbType = selectedCategory === '영화' ? 'movie' : 'tv';
                            // *** 수정: 언어 제한 제거, 디버깅 로그 추가 ***
                            const tmdbResponse = await axios.get(
                                `https://api.themoviedb.org/3/${tmdbType}/${itemId}/videos?api_key=${TMDB_API_KEY}`
                            );
                            console.log(`TMDB response for ${tmdbType} ${itemId}:`, tmdbResponse.data); // 디버깅
                            const trailer = tmdbResponse.data.results.find(
                                (video) => video.type === 'Trailer' && video.site === 'YouTube'
                            );
                            console.log(`Trailer for ${item.title}:`, trailer); // 디버깅
                            return {
                                ...item,
                                poster: item.poster?.startsWith('http')
                                    ? item.poster
                                    : `${TMDB_IMAGE_BASE_URL}${item.poster}`,
                                trailer: trailer ? `https://www.youtube.com/embed/${trailer.key}` : null,
                            };
                        } catch (tmdbError) {
                            return {
                                ...item,
                                poster: item.poster?.startsWith('http')
                                    ? item.poster
                                    : `${TMDB_IMAGE_BASE_URL}${item.poster}`,
                                trailer: null,
                            };
                        }
                    })
                );

                setRecommendedMovies(itemsWithTrailers);
            } catch (error) {
                console.error('Error fetching recommended items:', error);
                setError(`추천 ${selectedCategory}를 가져오지 못했습니다.`);
                setRecommendedMovies([]);
            } finally {
                setIsLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [selectedCategory, selectedFriends, recommendOption]);

    // 카테고리 변경 처리
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setRecommendedMovies([]);
    };

    // 모든 친구 선택 해제
    const handleAllSelect = () => {
        setAllSelected(false);
        setSelectedFriends([]);
    };

    // 친구 선택/해제 처리
    const handleFriendSelect = (friendName) => {
        if (selectedFriends.includes(friendName)) {
            setSelectedFriends(selectedFriends.filter((friend) => friend !== friendName));
        } else if (selectedFriends.length < 6) {
            setSelectedFriends([...selectedFriends, friendName]);
        }
        setAllSelected(selectedFriends.length === friendList.length - 1);
    };

    // 추천 옵션 변경 처리
    const handleRecommendOption = (option) => {
        setRecommendOption(recommendOption === option ? null : option);
    };

    // 아이템 클릭 시 모달 열기
    const handleMovieClick = (movie) => {
        setSelectedMovie(movie);
    };

    // 모달 닫기
    const closeModal = () => {
        setSelectedMovie(null);
    };

    // 친구 검색 필터링
    const filteredFriends = friendList.filter((friend) =>
        friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 선택된 친구 프로필 (최대 6명)
    const displayedProfiles = selectedFriends.slice(0, 6);

    return (
        <div className="container">
            <div className="left-section">
                <div className="category-buttons">
                    <button
                        className={`category-btn ${selectedCategory === '영화' ? 'active' : ''}`}
                        onClick={() => handleCategoryChange('영화')}
                    >
                        영화
                    </button>
                    <button
                        className={`category-btn ${selectedCategory === '드라마' ? 'active' : ''}`}
                        onClick={() => handleCategoryChange('드라마')}
                    >
                        드라마
                    </button>
                    <div className="recommend-options">
                        <div className="recommend-option">
                            <input
                                type="checkbox"
                                checked={recommendOption === 'auto'}
                                onChange={() => handleRecommendOption('auto')}
                            />
                            <span>기본 추천</span>
                        </div>
                        <div className="recommend-option">
                            <input
                                type="checkbox"
                                checked={recommendOption === 'liked'}
                                onChange={() => handleRecommendOption('liked')}
                            />
                            <span>찜 목록과 유사한 작품 추천</span>
                        </div>
                        <div className="recommend-option">
                            <input
                                type="checkbox"
                                checked={recommendOption === 'watched'}
                                onChange={() => handleRecommendOption('watched')}
                            />
                            <span>시청한 목록과 유사한 작품 추천</span>
                        </div>
                    </div>
                </div>
                <h3 className="friends-header">같이 시청할 친구</h3>
                <div className="profile-section">
                    {displayedProfiles.map((name, index) => {
                        const friend = friendList.find((f) => f.name === name);
                        return friend ? (
                            <div key={index} className="profile">
                                <img src={friend.icon} alt={name} />
                                <span className="profile-name">{name}</span>
                            </div>
                        ) : null;
                    })}
                </div>
                <h3 className="recommend-header">추천 {selectedCategory}</h3>
                <div className="movie-list">
                    {isLoading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : recommendedMovies.length > 0 ? (
                        recommendedMovies.map((movie, index) => (
                            <div
                                key={index}
                                className="movie-item"
                                onClick={() => handleMovieClick(movie)}
                            >
                                <img src={movie.poster} alt={movie.title} loading="lazy" />
                                <div className="movie-details">
                                    <div className="movie-info">
                                        <span className="movie-title">{movie.title}</span>
                                    </div>
                                    <span className="movie-rating">평점: {movie.rating}점</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>
                            친구를 선택하거나 추천 옵션을 변경하세요. 또는 찜목록이나 시청한 작품 목록이 너무 적습니다.
                        </div>
                    )}
                </div>
                {selectedMovie && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="modal-close" onClick={closeModal}>×</button>
                            {selectedMovie.trailer ? (
                                <iframe
                                    className="modal-video"
                                    src={selectedMovie.trailer}
                                    frameBorder="0" // *** 수정: iframe 속성 추가 ***
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <img
                                    className="modal-poster"
                                    src={selectedMovie.poster}
                                    alt={selectedMovie.title}
                                />
                            )}
                            <p className="modal-description">{selectedMovie.description}</p>
                            <button className="modal-details-btn">상세페이지</button>
                        </div>
                    </div>
                )}
            </div>
            <div className="right-section">
                <input
                    type="text"
                    placeholder="Search a friend"
                    className="search-bar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="list-header">
                    <span>친구 목록</span>
                    <span>찜</span>
                    <span>시청한 작품</span>
                </div>
                <div className="deselect-all-container">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={handleAllSelect}
                    />
                    <span>모두 해제</span>
                </div>
                <div className="friend-list">
                    {filteredFriends.map((friend, index) => (
                        <FriendListItem
                            key={index}
                            {...friend}
                            isSelected={selectedFriends.includes(friend.name)}
                            onSelect={handleFriendSelect}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FriendRecommend;