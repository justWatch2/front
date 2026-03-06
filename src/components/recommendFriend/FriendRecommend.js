import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // 필요: npm i jwt-decode
import './FriendRecommend.css';
import { autoRefreshCheck } from "../../tokenUtils/TokenUtils";
import { useNavigate } from 'react-router';
import ProfileLogo from './img/ProfileLogo.png';
import { API_BASE_URL } from "../../config/api";

// 친구 목록 아이템 컴포넌트
const FriendListItem = ({ name, numWish, numViewedMovie, icon, isSelected, onSelect }) => {
    return (
        <div className="friend-item">
            <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(name)}
            />
            <img src={icon == null ? ProfileLogo : icon} alt={name} />
            <span className="friend-name">{name}</span>
            <div className="friend-stats">
                <span>{numWish}</span>
                <span>{numViewedMovie}</span>
            </div>
        </div>
    );
};

const FriendRecommend = () => {
    const [myMemberId, setMyMemberId] = useState(null);
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
    const [isFriendListLoaded, setIsFriendListLoaded] = useState(false);

    const TMDB_API_KEY = '3d3c7315778f5fbf4c858608cd6ce78f';
    const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setMyMemberId(decoded.memberId || decoded.id || decoded.sub);
            } catch (e) {
                console.error('Invalid token format', e);
            }
        } else {
            alert("로그인해주세욥!");
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        const fetchFriendsList = async () => {
            setIsLoading(true);
            setError(null);
            setIsFriendListLoaded(false);
            try {
                const url = selectedCategory === '영화'
                    ? `${API_BASE_URL}/friend/getList`
                    : `${API_BASE_URL}/friend/getDramaList`;
                const response = await autoRefreshCheck({
                    method: "GET",
                    url: url,
                    params: { category: selectedCategory },
                });

                const data = response?.data || [];
                setFriendList(data);
                setIsFriendListLoaded(true);
            } catch (err) {
                console.error(`Error fetching ${selectedCategory} friendsList:`, err);
                setError('친구 목록을 가져오지 못했습니다.');
                setFriendList([]);
                setIsFriendListLoaded(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFriendsList();
    }, [selectedCategory]);

    useEffect(() => {
        if (!isFriendListLoaded || !myMemberId) return;

        const memberIdsToSend = selectedFriends.length > 0
            ? Array.from(new Set([...selectedFriends, myMemberId]))
            : [myMemberId];

        const timer = setTimeout(async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await autoRefreshCheck({
                    method: "POST",
                    url: `${API_BASE_URL}/recommend/movies`,
                    data: {
                        memberIds: memberIdsToSend,
                        recommendOption: recommendOption || 'auto',
                        category: selectedCategory,
                    },
                });

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
                            const tmdbResponse = await axios.get(
                                `https://api.themoviedb.org/3/${tmdbType}/${itemId}/videos?api_key=${TMDB_API_KEY}`
                            );
                            const trailer = tmdbResponse.data.results.find(
                                (video) => video.type === 'Trailer' && video.site === 'YouTube'
                            );
                            return {
                                ...item,
                                poster: item.poster?.startsWith('http')
                                    ? item.poster
                                    : `${TMDB_IMAGE_BASE_URL}${item.poster}`,
                                trailer: trailer ? `https://www.youtube.com/embed/${trailer.key}` : null,
                            };
                        } catch {
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
            } catch (err) {
                console.error('Error fetching recommended items:', err);
                setError(`추천 ${selectedCategory}를 가져오지 못했습니다.`);
                setRecommendedMovies([]);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [isFriendListLoaded, myMemberId, selectedFriends, recommendOption, selectedCategory]);

    const handleFriendSelect = (friendName) => {
        setSelectedFriends((prevSelected) => {
            if (prevSelected.includes(friendName)) {
                return prevSelected.filter((f) => f !== friendName);
            } else if (prevSelected.length < 6) {
                return [...prevSelected, friendName];
            }
            return prevSelected;
        });
        setAllSelected(selectedFriends.length === friendList.length - 1);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setSelectedFriends([]);
        setAllSelected(false);
        setRecommendedMovies([]);
    };

    const handleRecommendOption = (option) => {
        setRecommendOption(recommendOption === option ? null : option);
    };

    const filteredFriends = friendList.filter(friend =>
        friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const displayedProfiles = selectedFriends.slice(0, 6);

    const handleMovieClick = (movie) => { setSelectedMovie(movie); };
    const closeModal = () => setSelectedMovie(null);

    const handleAllSelect = () => {
        setAllSelected(false);
        setSelectedFriends([]);
    };

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
                            <span>시청한 작품과 유사한 작품 추천</span>
                        </div>
                    </div>
                </div>

                <h3 className="friends-header">같이 시청할 친구</h3>
                <div className="profile-section">
                    {displayedProfiles.map((name, idx) => {
                        const friend = friendList.find(f => f.name === name);
                        return friend ? (
                            <div key={idx} className="profile">
                                <img src={friend.icon == null ? ProfileLogo : friend.icon} alt={name} />
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
                        recommendedMovies.map((movie, idx) => (
                            <div
                                key={idx}
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
                            친구를 선택하거나 추천 옵션을 변경하세요. 또는 찜/시청 목록이 있어야 추천이 가능합니다.
                        </div>
                    )}
                </div>

                {selectedMovie && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <button className="modal-close" onClick={closeModal}>X</button>
                            {selectedMovie.trailer ? (
                                <iframe
                                    className="modal-video"
                                    src={selectedMovie.trailer}
                                    frameBorder="0"
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
                            <button
                                className="modal-details-btn"
                                onClick={() =>
                                    navigate(`/detail/${selectedCategory === "영화"
                                        ? "movie/" + selectedMovie.movieId
                                        : "tv/" + selectedMovie.tvShowId}`)
                                }
                            >
                                상세페이지
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="right-section">
                <input
                    type="text"
                    placeholder="친구 검색"
                    className="search-bar"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
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
                    {friendList.length === 0 && !isLoading && (
                        <div className="empty-friend-message">친구를 추가하세요</div>
                    )}
                    {filteredFriends.map((friend, idx) => (
                        <FriendListItem
                            key={idx}
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
