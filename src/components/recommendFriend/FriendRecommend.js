
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './FriendRecommend.css';
// import {autoRefreshCheck} from "../../tokenUtils/TokenUtils";
//
// // 친구 목록 항목 컴포넌트
// const FriendListItem = ({ name, numWish, numViewedMovie, icon, isSelected, onSelect }) => {
//     return (
//         <div className="friend-item">
//             <input
//                 type="checkbox"
//                 checked={isSelected}
//                 onChange={() => onSelect(name)}
//             />
//             <img src={icon} alt={name} />
//             <span className="friend-name">{name}</span>
//             <div className="friend-stats">
//                 <span>{numWish}</span>
//                 <span>{numViewedMovie}</span>
//             </div>
//         </div>
//     );
// };
//
// const FriendRecommend = () => {
//     // 상태 관리
//     const [selectedCategory, setSelectedCategory] = useState('영화');
//     const [selectedFriends, setSelectedFriends] = useState([]);
//     const [allSelected, setAllSelected] = useState(false);
//     const [selectedMovie, setSelectedMovie] = useState(null);
//     const [recommendOption, setRecommendOption] = useState('auto');
//     const [friendList, setFriendList] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [recommendedMovies, setRecommendedMovies] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);
//
//     // TMDB API 키 (환경 변수로 대체 권장)
//     const TMDB_API_KEY = '3d3c7315778f5fbf4c858608cd6ce78f';
//     const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
//
//     // 친구 목록 가져오기
//     useEffect(() => {
//         const fetchFriendsList = async () => {
//             try {
//                 const response = await autoRefreshCheck({
//                     method: "GET",
//                     url: "/friend/getList",
//                     params: { category: selectedCategory },
//                 });
//
//                 setFriendList(response.data);
//             } catch (error) {
//                 console.error('Error fetching friendsList:', error);
//                 setError('친구 목록을 가져오지 못했습니다.');
//             }
//         };
//         fetchFriendsList();
//     }, [selectedCategory]); // *** 수정: selectedCategory 의존성 추가 ***
//
//     // 실시간 추천 가져오기
//     useEffect(() => {
//         const timer = setTimeout(async () => {
//             setError(null);
//             setIsLoading(true);
//             try {
//                 const memberIds = selectedFriends;
//                 const response = await autoRefreshCheck({
//                     method: "POST",
//                     url: "/recommend/movies",
//                     data: {
//                         memberIds,
//                         recommendOption: recommendOption || 'auto',
//                         category: selectedCategory,
//                     },
//                 });
//
//                 // TMDB API로 트레일러 및 포스터 URL 가져오기
//                 const itemsWithTrailers = await Promise.all(
//                     response.data.map(async (item) => {
//                         const itemId = item.movieId || item.id || item.tmdbId;
//                         if (!itemId || isNaN(itemId)) {
//                             return {
//                                 ...item,
//                                 poster: item.poster?.startsWith('http')
//                                     ? item.poster
//                                     : `${TMDB_IMAGE_BASE_URL}${item.poster}`,
//                                 trailer: null,
//                             };
//                         }
//
//                         try {
//                             const tmdbType = selectedCategory === '영화' ? 'movie' : 'tv';
//                             // *** 수정: 언어 제한 제거, 디버깅 로그 추가 ***
//                             const tmdbResponse = await axios.get(
//                                 `https://api.themoviedb.org/3/${tmdbType}/${itemId}/videos?api_key=${TMDB_API_KEY}`
//                             );
//                             console.log(`TMDB response for ${tmdbType} ${itemId}:`, tmdbResponse.data); // 디버깅
//                             const trailer = tmdbResponse.data.results.find(
//                                 (video) => video.type === 'Trailer' && video.site === 'YouTube'
//                             );
//                             console.log(`Trailer for ${item.title}:`, trailer); // 디버깅
//                             return {
//                                 ...item,
//                                 poster: item.poster?.startsWith('http')
//                                     ? item.poster
//                                     : `${TMDB_IMAGE_BASE_URL}${item.poster}`,
//                                 trailer: trailer ? `https://www.youtube.com/embed/${trailer.key}` : null,
//                             };
//                         } catch (tmdbError) {
//                             return {
//                                 ...item,
//                                 poster: item.poster?.startsWith('http')
//                                     ? item.poster
//                                     : `${TMDB_IMAGE_BASE_URL}${item.poster}`,
//                                 trailer: null,
//                             };
//                         }
//                     })
//                 );
//
//                 setRecommendedMovies(itemsWithTrailers);
//             } catch (error) {
//                 console.error('Error fetching recommended items:', error);
//                 setError(`추천 ${selectedCategory}를 가져오지 못했습니다.`);
//                 setRecommendedMovies([]);
//             } finally {
//                 setIsLoading(false);
//             }
//         }, 500);
//
//         return () => clearTimeout(timer);
//     }, [selectedCategory, selectedFriends, recommendOption]);
//
//     // 카테고리 변경 처리
//     const handleCategoryChange = (category) => {
//         setSelectedCategory(category);
//         setRecommendedMovies([]);
//     };
//
//     // 모든 친구 선택 해제
//     const handleAllSelect = () => {
//         setAllSelected(false);
//         setSelectedFriends([]);
//     };
//
//     // 친구 선택/해제 처리
//     const handleFriendSelect = (friendName) => {
//         if (selectedFriends.includes(friendName)) {
//             setSelectedFriends(selectedFriends.filter((friend) => friend !== friendName));
//         } else if (selectedFriends.length < 6) {
//             setSelectedFriends([...selectedFriends, friendName]);
//         }
//         setAllSelected(selectedFriends.length === friendList.length - 1);
//     };
//
//     // 추천 옵션 변경 처리
//     const handleRecommendOption = (option) => {
//         setRecommendOption(recommendOption === option ? null : option);
//     };
//
//     // 아이템 클릭 시 모달 열기
//     const handleMovieClick = (movie) => {
//         setSelectedMovie(movie);
//     };
//
//     // 모달 닫기
//     const closeModal = () => {
//         setSelectedMovie(null);
//     };
//
//     // 친구 검색 필터링
//     const filteredFriends = friendList.filter((friend) =>
//         friend.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//
//     // 선택된 친구 프로필 (최대 6명)
//     const displayedProfiles = selectedFriends.slice(0, 6);
//
//     return (
//         <div className="container">
//             <div className="left-section">
//                 <div className="category-buttons">
//                     <button
//                         className={`category-btn ${selectedCategory === '영화' ? 'active' : ''}`}
//                         onClick={() => handleCategoryChange('영화')}
//                     >
//                         영화
//                     </button>
//                     <button
//                         className={`category-btn ${selectedCategory === '드라마' ? 'active' : ''}`}
//                         onClick={() => handleCategoryChange('드라마')}
//                     >
//                         드라마
//                     </button>
//                     <div className="recommend-options">
//                         <div className="recommend-option">
//                             <input
//                                 type="checkbox"
//                                 checked={recommendOption === 'auto'}
//                                 onChange={() => handleRecommendOption('auto')}
//                             />
//                             <span>기본 추천</span>
//                         </div>
//                         <div className="recommend-option">
//                             <input
//                                 type="checkbox"
//                                 checked={recommendOption === 'liked'}
//                                 onChange={() => handleRecommendOption('liked')}
//                             />
//                             <span>찜 목록과 유사한 작품 추천</span>
//                         </div>
//                         <div className="recommend-option">
//                             <input
//                                 type="checkbox"
//                                 checked={recommendOption === 'watched'}
//                                 onChange={() => handleRecommendOption('watched')}
//                             />
//                             <span>시청한 목록과 유사한 작품 추천</span>
//                         </div>
//                     </div>
//                 </div>
//                 <h3 className="friends-header">같이 시청할 친구</h3>
//                 <div className="profile-section">
//                     {displayedProfiles.map((name, index) => {
//                         const friend = friendList.find((f) => f.name === name);
//                         return friend ? (
//                             <div key={index} className="profile">
//                                 <img src={friend.icon} alt={name} />
//                                 <span className="profile-name">{name}</span>
//                             </div>
//                         ) : null;
//                     })}
//                 </div>
//                 <h3 className="recommend-header">추천 {selectedCategory}</h3>
//                 <div className="movie-list">
//                     {isLoading ? (
//                         <div>Loading...</div>
//                     ) : error ? (
//                         <div className="error-message">{error}</div>
//                     ) : recommendedMovies.length > 0 ? (
//                         recommendedMovies.map((movie, index) => (
//                             <div
//                                 key={index}
//                                 className="movie-item"
//                                 onClick={() => handleMovieClick(movie)}
//                             >
//                                 <img src={movie.poster} alt={movie.title} loading="lazy" />
//                                 <div className="movie-details">
//                                     <div className="movie-info">
//                                         <span className="movie-title">{movie.title}</span>
//                                     </div>
//                                     <span className="movie-rating">평점: {movie.rating}점</span>
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <div>
//                             친구를 선택하거나 추천 옵션을 변경하세요. 또는 찜목록이나 시청한 작품 목록이 너무 적습니다.
//                         </div>
//                     )}
//                 </div>
//                 {selectedMovie && (
//                     <div className="modal-overlay" onClick={closeModal}>
//                         <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                             <button className="modal-close" onClick={closeModal}>×</button>
//                             {selectedMovie.trailer ? (
//                                 <iframe
//                                     className="modal-video"
//                                     src={selectedMovie.trailer}
//                                     frameBorder="0" // *** 수정: iframe 속성 추가 ***
//                                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                                     allowFullScreen
//                                 />
//                             ) : (
//                                 <img
//                                     className="modal-poster"
//                                     src={selectedMovie.poster}
//                                     alt={selectedMovie.title}
//                                 />
//                             )}
//                             <p className="modal-description">{selectedMovie.description}</p>
//                             <button className="modal-details-btn">상세페이지</button>
//                         </div>
//                     </div>
//                 )}
//             </div>
//             <div className="right-section">
//                 <input
//                     type="text"
//                     placeholder="Search a friend"
//                     className="search-bar"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//                 <div className="list-header">
//                     <span>친구 목록</span>
//                     <span>찜</span>
//                     <span>시청한 작품</span>
//                 </div>
//                 <div className="deselect-all-container">
//                     <input
//                         type="checkbox"
//                         checked={allSelected}
//                         onChange={handleAllSelect}
//                     />
//                     <span>모두 해제</span>
//                 </div>
//                 <div className="friend-list">
//                     {filteredFriends.map((friend, index) => (
//                         <FriendListItem
//                             key={index}
//                             {...friend}
//                             isSelected={selectedFriends.includes(friend.name)}
//                             onSelect={handleFriendSelect}
//                         />
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default FriendRecommend;

//-------------------------- 카테고리 드라마냐 영화 에 따라서 친구 목록의 정보가 바뀌는거 추가 부분 ------------------------

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './FriendRecommend.css';
// import { autoRefreshCheck } from "../../tokenUtils/TokenUtils";
//
// // 친구 목록 항목 컴포넌트
// const FriendListItem = ({ name, numWish, numViewedMovie, icon, isSelected, onSelect }) => {
//     return (
//         <div className="friend-item">
//             <input
//                 type="checkbox"
//                 checked={isSelected}
//                 onChange={() => onSelect(name)}
//             />
//             <img src={icon} alt={name} />
//             <span className="friend-name">{name}</span>
//             <div className="friend-stats">
//                 <span>{numWish}</span>
//                 <span>{numViewedMovie}</span>
//             </div>
//         </div>
//     );
// };
//
// const FriendRecommend = () => {
//     // 상태 관리
//     const [selectedCategory, setSelectedCategory] = useState('영화');
//     const [selectedFriends, setSelectedFriends] = useState([]);
//     const [allSelected, setAllSelected] = useState(false);
//     const [selectedMovie, setSelectedMovie] = useState(null);
//     const [recommendOption, setRecommendOption] = useState('auto');
//     const [friendList, setFriendList] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [recommendedMovies, setRecommendedMovies] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);
//
//     // TMDB API 키 (환경 변수로 대체 권장)
//     const TMDB_API_KEY = '3d3c7315778f5fbf4c858608cd6ce78f';
//     const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
//
//     // 카테고리별 친구 목록 가져오기 (임시 URL)
//     useEffect(() => {
//         const fetchFriendsList = async () => {
//             try {
//                 let url = selectedCategory === '영화'
//                     ? '/friend/getList' // 영화용 임시 URL
//                     : '/friend/getDramaList'; // 드라마용 임시 URL (나중에 수정 필요)
//                 const response = await autoRefreshCheck({
//                     method: "GET",
//                     url: url,
//                     params: { category: selectedCategory },
//                 });
//
//                 setFriendList(response.data);
//             } catch (error) {
//                 console.error(`Error fetching ${selectedCategory} friendsList:`, error);
//                 setError(`친구 목록을 가져오지 못했습니다.`);
//             }
//         };
//         fetchFriendsList();
//     }, [selectedCategory]); // selectedCategory에 따라 호출
//
//     // 실시간 추천 가져오기
//     useEffect(() => {
//         const timer = setTimeout(async () => {
//             setError(null);
//             setIsLoading(true);
//             try {
//                 const memberIds = selectedFriends;
//                 const response = await autoRefreshCheck({
//                     method: "POST",
//                     url: "/recommend/movies", // 드라마용 URL도 나중에 수정 필요
//                     data: {
//                         memberIds,
//                         recommendOption: recommendOption || 'auto',
//                         category: selectedCategory,
//                     },
//                 });
//
//                 // TMDB API로 트레일러 및 포스터 URL 가져오기
//                 const itemsWithTrailers = await Promise.all(
//                     response.data.map(async (item) => {
//                         const itemId = item.movieId || item.id || item.tmdbId;
//                         if (!itemId || isNaN(itemId)) {
//                             return {
//                                 ...item,
//                                 poster: item.poster?.startsWith('http')
//                                     ? item.poster
//                                     : `${TMDB_IMAGE_BASE_URL}${item.poster}`,
//                                 trailer: null,
//                             };
//                         }
//
//                         try {
//                             const tmdbType = selectedCategory === '영화' ? 'movie' : 'tv';
//                             const tmdbResponse = await axios.get(
//                                 `https://api.themoviedb.org/3/${tmdbType}/${itemId}/videos?api_key=${TMDB_API_KEY}`
//                             );
//                             console.log(`TMDB response for ${tmdbType} ${itemId}:`, tmdbResponse.data);
//                             const trailer = tmdbResponse.data.results.find(
//                                 (video) => video.type === 'Trailer' && video.site === 'YouTube'
//                             );
//                             console.log(`Trailer for ${item.title}:`, trailer);
//                             return {
//                                 ...item,
//                                 poster: item.poster?.startsWith('http')
//                                     ? item.poster
//                                     : `${TMDB_IMAGE_BASE_URL}${item.poster}`,
//                                 trailer: trailer ? `https://www.youtube.com/embed/${trailer.key}` : null,
//                             };
//                         } catch (tmdbError) {
//                             return {
//                                 ...item,
//                                 poster: item.poster?.startsWith('http')
//                                     ? item.poster
//                                     : `${TMDB_IMAGE_BASE_URL}${item.poster}`,
//                                 trailer: null,
//                             };
//                         }
//                     })
//                 );
//
//                 setRecommendedMovies(itemsWithTrailers);
//             } catch (error) {
//                 console.error('Error fetching recommended items:', error);
//                 setError(`추천 ${selectedCategory}를 가져오지 못했습니다.`);
//                 setRecommendedMovies([]);
//             } finally {
//                 setIsLoading(false);
//             }
//         }, 500);
//
//         return () => clearTimeout(timer);
//     }, [selectedCategory, selectedFriends, recommendOption]);
//
//     // 카테고리 변경 처리
//     const handleCategoryChange = (category) => {
//         setSelectedCategory(category);
//         setRecommendedMovies([]);
//     };
//
//     // 모든 친구 선택 해제
//     const handleAllSelect = () => {
//         setAllSelected(false);
//         setSelectedFriends([]);
//     };
//
//     // 친구 선택/해제 처리
//     const handleFriendSelect = (friendName) => {
//         if (selectedFriends.includes(friendName)) {
//             setSelectedFriends(selectedFriends.filter((friend) => friend !== friendName));
//         } else if (selectedFriends.length < 6) {
//             setSelectedFriends([...selectedFriends, friendName]);
//         }
//         setAllSelected(selectedFriends.length === friendList.length - 1);
//     };
//
//     // 추천 옵션 변경 처리
//     const handleRecommendOption = (option) => {
//         setRecommendOption(recommendOption === option ? null : option);
//     };
//
//     // 아이템 클릭 시 모달 열기
//     const handleMovieClick = (movie) => {
//         setSelectedMovie(movie);
//     };
//
//     // 모달 닫기
//     const closeModal = () => {
//         setSelectedMovie(null);
//     };
//
//     // 친구 검색 필터링
//     const filteredFriends = friendList.filter((friend) =>
//         friend.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//
//     // 선택된 친구 프로필 (최대 6명)
//     const displayedProfiles = selectedFriends.slice(0, 6);
//
//     return (
//         <div className="container">
//             <div className="left-section">
//                 <div className="category-buttons">
//                     <button
//                         className={`category-btn ${selectedCategory === '영화' ? 'active' : ''}`}
//                         onClick={() => handleCategoryChange('영화')}
//                     >
//                         영화
//                     </button>
//                     <button
//                         className={`category-btn ${selectedCategory === '드라마' ? 'active' : ''}`}
//                         onClick={() => handleCategoryChange('드라마')}
//                     >
//                         드라마
//                     </button>
//                     <div className="recommend-options">
//                         <div className="recommend-option">
//                             <input
//                                 type="checkbox"
//                                 checked={recommendOption === 'auto'}
//                                 onChange={() => handleRecommendOption('auto')}
//                             />
//                             <span>기본 추천</span>
//                         </div>
//                         <div className="recommend-option">
//                             <input
//                                 type="checkbox"
//                                 checked={recommendOption === 'liked'}
//                                 onChange={() => handleRecommendOption('liked')}
//                             />
//                             <span>찜 목록과 유사한 작품 추천</span>
//                         </div>
//                         <div className="recommend-option">
//                             <input
//                                 type="checkbox"
//                                 checked={recommendOption === 'watched'}
//                                 onChange={() => handleRecommendOption('watched')}
//                             />
//                             <span>시청한 목록과 유사한 작품 추천</span>
//                         </div>
//                     </div>
//                 </div>
//                 <h3 className="friends-header">같이 시청할 친구</h3>
//                 <div className="profile-section">
//                     {displayedProfiles.map((name, index) => {
//                         const friend = friendList.find((f) => f.name === name);
//                         return friend ? (
//                             <div key={index} className="profile">
//                                 <img src={friend.icon} alt={name} />
//                                 <span className="profile-name">{name}</span>
//                             </div>
//                         ) : null;
//                     })}
//                 </div>
//                 <h3 className="recommend-header">추천 {selectedCategory}</h3>
//                 <div className="movie-list">
//                     {isLoading ? (
//                         <div>Loading...</div>
//                     ) : error ? (
//                         <div className="error-message">{error}</div>
//                     ) : recommendedMovies.length > 0 ? (
//                         recommendedMovies.map((movie, index) => (
//                             <div
//                                 key={index}
//                                 className="movie-item"
//                                 onClick={() => handleMovieClick(movie)}
//                             >
//                                 <img src={movie.poster} alt={movie.title} loading="lazy" />
//                                 <div className="movie-details">
//                                     <div className="movie-info">
//                                         <span className="movie-title">{movie.title}</span>
//                                     </div>
//                                     <span className="movie-rating">평점: {movie.rating}점</span>
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <div>
//                             친구를 선택하거나 추천 옵션을 변경하세요. 또는 찜목록이나 시청한 작품 목록이 너무 적습니다.
//                         </div>
//                     )}
//                 </div>
//                 {selectedMovie && (
//                     <div className="modal-overlay" onClick={closeModal}>
//                         <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                             <button className="modal-close" onClick={closeModal}>×</button>
//                             {selectedMovie.trailer ? (
//                                 <iframe
//                                     className="modal-video"
//                                     src={selectedMovie.trailer}
//                                     frameBorder="0"
//                                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                                     allowFullScreen
//                                 />
//                             ) : (
//                                 <img
//                                     className="modal-poster"
//                                     src={selectedMovie.poster}
//                                     alt={selectedMovie.title}
//                                 />
//                             )}
//                             <p className="modal-description">{selectedMovie.description}</p>
//                             <button className="modal-details-btn">상세페이지</button>
//                         </div>
//                     </div>
//                 )}
//             </div>
//             <div className="right-section">
//                 <input
//                     type="text"
//                     placeholder="Search a friend"
//                     className="search-bar"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//                 <div className="list-header">
//                     <span>친구 목록</span>
//                     <span>찜</span>
//                     <span>시청한 작품</span>
//                 </div>
//                 <div className="deselect-all-container">
//                     <input
//                         type="checkbox"
//                         checked={allSelected}
//                         onChange={handleAllSelect}
//                     />
//                     <span>모두 해제</span>
//                 </div>
//                 <div className="friend-list">
//                     {filteredFriends.map((friend, index) => (
//                         <FriendListItem
//                             key={index}
//                             {...friend}
//                             isSelected={selectedFriends.includes(friend.name)}
//                             onSelect={handleFriendSelect}
//                         />
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default FriendRecommend;

//----------------------------------------------------------------------------------

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './FriendRecommend.css';
// import { autoRefreshCheck } from "../../tokenUtils/TokenUtils";
//
// // 친구 목록 항목 컴포넌트
// const FriendListItem = ({ name, numWish, numViewedMovie, icon, isSelected, onSelect }) => {
//     return (
//         <div className="friend-item">
//             <input
//                 type="checkbox"
//                 checked={isSelected}
//                 onChange={() => onSelect(name)}
//             />
//             <img src={icon} alt={name} />
//             <span className="friend-name">{name}</span>
//             <div className="friend-stats">
//                 <span>{numWish}</span>
//                 <span>{numViewedMovie}</span>
//             </div>
//         </div>
//     );
// };
//
// const FriendRecommend = () => {
//     // 상태 관리
//     const [selectedCategory, setSelectedCategory] = useState('영화');
//     const [selectedFriends, setSelectedFriends] = useState([]);
//     const [allSelected, setAllSelected] = useState(false);
//     const [selectedMovie, setSelectedMovie] = useState(null);
//     const [recommendOption, setRecommendOption] = useState('auto');
//     const [friendList, setFriendList] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [recommendedMovies, setRecommendedMovies] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);
//
//     // TMDB API 키 (환경 변수로 대체 권장)
//     const TMDB_API_KEY = '3d3c7315778f5fbf4c858608cd6ce78f';
//     const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
//
//     // 카테고리별 친구 목록 가져오기
//     useEffect(() => {
//         const fetchFriendsList = async () => {
//             setIsLoading(true);
//             setError(null);
//             try {
//                 const url = selectedCategory === '영화' ? '/friend/getList' : '/friend/getDramaList';
//                 const response = await autoRefreshCheck({
//                     method: "GET",
//                     url: url,
//                     params: { category: selectedCategory },
//                 });
//
//                 // 백엔드에서 반환하는 데이터가 { name, icon, numWish, numViewedMovie } 형식을 따른다고 가정
//                 setFriendList(response.data);
//             } catch (error) {
//                 console.error(`Error fetching ${selectedCategory} friendsList:`, error);
//                 setError(`친구 목록을 가져오지 못했습니다.`);
//                 setFriendList([]);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchFriendsList();
//     }, [selectedCategory]);
//
//     // 실시간 추천 가져오기
//     useEffect(() => {
//         //구조 유지하면서 pending문제 해결을 위해서 실행순서를 지정해준다. 이런식으로
//         // if (friendList.length === 0) return;
//
//         const timer = setTimeout(async () => {
//             setError(null);
//             setIsLoading(true);
//             try {
//                 const memberIds = selectedFriends;
//                 // const memberIds = selectedFriends.length > 0 ? selectedFriends : [myMemberId];
//                 const response = await autoRefreshCheck({
//                     method: "POST",
//                     url: "/recommend/movies", // 드라마 합본
//                     data: {
//                         memberIds,
//                         recommendOption: recommendOption || 'auto',
//                         category: selectedCategory,
//                     },
//                 });
//
//                 // TMDB API로 트레일러 및 포스터 URL 가져오기
//                 const itemsWithTrailers = await Promise.all(
//                     response.data.map(async (item) => {
//                         const itemId = item.movieId || item.id || item.tmdbId;
//                         if (!itemId || isNaN(itemId)) {
//                             return {
//                                 ...item,
//                                 poster: item.poster?.startsWith('http')
//                                     ? item.poster
//                                     : `${TMDB_IMAGE_BASE_URL}${item.poster}`,
//                                 trailer: null,
//                             };
//                         }
//
//                         try {
//                             const tmdbType = selectedCategory === '영화' ? 'movie' : 'tv';
//                             const tmdbResponse = await axios.get(
//                                 `https://api.themoviedb.org/3/${tmdbType}/${itemId}/videos?api_key=${TMDB_API_KEY}`
//                             );
//                             const trailer = tmdbResponse.data.results.find(
//                                 (video) => video.type === 'Trailer' && video.site === 'YouTube'
//                             );
//                             return {
//                                 ...item,
//                                 poster: item.poster?.startsWith('http')
//                                     ? item.poster
//                                     : `${TMDB_IMAGE_BASE_URL}${item.poster}`,
//                                 trailer: trailer ? `https://www.youtube.com/embed/${trailer.key}` : null,
//                             };
//                         } catch (tmdbError) {
//                             return {
//                                 ...item,
//                                 poster: item.poster?.startsWith('http')
//                                     ? item.poster
//                                     : `${TMDB_IMAGE_BASE_URL}${item.poster}`,
//                                 trailer: null,
//                             };
//                         }
//                     })
//                 );
//
//                 setRecommendedMovies(itemsWithTrailers);
//             } catch (error) {
//                 console.error('Error fetching recommended items:', error);
//                 setError(`추천 ${selectedCategory}를 가져 contacts오지 못했습니다.`);
//                 setRecommendedMovies([]);
//             } finally {
//                 setIsLoading(false);
//             }
//         }, 300);
//
//         return () => clearTimeout(timer);
//     }, [selectedCategory, selectedFriends, recommendOption]);
//
//     // 카테고리 변경 처리
//     const handleCategoryChange = (category) => {
//         setSelectedCategory(category);
//         setSelectedFriends([]); // 카테고리 변경 시 선택된 친구 초기화
//         setAllSelected(false);
//         setRecommendedMovies([]); // 추천 목록 초기화
//     };
//
//     // 모든 친구 선택 해제
//     const handleAllSelect = () => {
//         setAllSelected(false);
//         setSelectedFriends([]);
//     };
//
//     // 친구 선택/해제 처리
//     const handleFriendSelect = (friendName) => {
//         if (selectedFriends.includes(friendName)) {
//             setSelectedFriends(selectedFriends.filter((friend) => friend !== friendName));
//         } else if (selectedFriends.length < 6) {
//             setSelectedFriends([...selectedFriends, friendName]);
//         }
//         setAllSelected(selectedFriends.length === friendList.length - 1);
//     };
//
//     // 추천 옵션 변경 처리
//     const handleRecommendOption = (option) => {
//         setRecommendOption(recommendOption === option ? null : option);
//     };
//
//     // 아이템 클릭 시 모달 열기
//     const handleMovieClick = (movie) => {
//         setSelectedMovie(movie);
//     };
//
//     // 모달 닫기
//     const closeModal = () => {
//         setSelectedMovie(null);
//     };
//
//     // 친구 검색 필터링
//     const filteredFriends = friendList.filter((friend) =>
//         friend.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//
//     // 선택된 친구 프로필 (최대 6명)
//     const displayedProfiles = selectedFriends.slice(0, 6);
//
//     return (
//         <div className="container">
//             <div className="left-section">
//                 <div className="category-buttons">
//                     <button
//                         className={`category-btn ${selectedCategory === '영화' ? 'active' : ''}`}
//                         onClick={() => handleCategoryChange('영화')}
//                     >
//                         영화
//                     </button>
//                     <button
//                         className={`category-btn ${selectedCategory === '드라마' ? 'active' : ''}`}
//                         onClick={() => handleCategoryChange('드라마')}
//                     >
//                         드라마
//                     </button>
//                     <div className="recommend-options">
//                         <div className="recommend-option">
//                             <input
//                                 type="checkbox"
//                                 checked={recommendOption === 'auto'}
//                                 onChange={() => handleRecommendOption('auto')}
//                             />
//                             <span>기본 추천</span>
//                         </div>
//                         <div className="recommend-option">
//                             <input
//                                 type="checkbox"
//                                 checked={recommendOption === 'liked'}
//                                 onChange={() => handleRecommendOption('liked')}
//                             />
//                             <span>찜 목록과 유사한 작품 추천</span>
//                         </div>
//                         <div className="recommend-option">
//                             <input
//                                 type="checkbox"
//                                 checked={recommendOption === 'watched'}
//                                 onChange={() => handleRecommendOption('watched')}
//                             />
//                             <span>시청한 목록과 유사한 작품 추천</span>
//                         </div>
//                     </div>
//                 </div>
//                 <h3 className="friends-header">같이 시청할 친구</h3>
//                 <div className="profile-section">
//                     {displayedProfiles.map((name, index) => {
//                         const friend = friendList.find((f) => f.name === name);
//                         return friend ? (
//                             <div key={index} className="profile">
//                                 <img src={friend.icon} alt={name} />
//                                 <span className="profile-name">{name}</span>
//                             </div>
//                         ) : null;
//                     })}
//                 </div>
//                 <h3 className="recommend-header">추천 {selectedCategory}</h3>
//                 <div className="movie-list">
//                     {isLoading ? (
//                         <div>Loading...</div>
//                     ) : error ? (
//                         <div className="error-message">{error}</div>
//                     ) : recommendedMovies.length > 0 ? (
//                         recommendedMovies.map((movie, index) => (
//                             <div
//                                 key={index}
//                                 className="movie-item"
//                                 onClick={() => handleMovieClick(movie)}
//                             >
//                                 <img src={movie.poster} alt={movie.title} loading="lazy" />
//                                 <div className="movie-details">
//                                     <div className="movie-info">
//                                         <span className="movie-title">{movie.title}</span>
//                                     </div>
//                                     <span className="movie-rating">평점: {movie.rating}점</span>
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <div>
//                             친구를 선택하거나 추천 옵션을 변경하세요. 또는 찜목록이나 시청한 작품 목록이 너무 적습니다.
//                         </div>
//                     )}
//                 </div>
//                 {selectedMovie && (
//                     <div className="modal-overlay" onClick={closeModal}>
//                         <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                             <button className="modal-close" onClick={closeModal}>×</button>
//                             {selectedMovie.trailer ? (
//                                 <iframe
//                                     className="modal-video"
//                                     src={selectedMovie.trailer}
//                                     frameBorder="0"
//                                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                                     allowFullScreen
//                                 />
//                             ) : (
//                                 <img
//                                     className="modal-poster"
//                                     src={selectedMovie.poster}
//                                     alt={selectedMovie.title}
//                                 />
//                             )}
//                             <p className="modal-description">{selectedMovie.description}</p>
//                             <button className="modal-details-btn">상세페이지</button>
//                         </div>
//                     </div>
//                 )}
//             </div>
//             <div className="right-section">
//                 <input
//                     type="text"
//                     placeholder="친구 검색"
//                     className="search-bar"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//                 <div className="list-header">
//                     <span>친구 목록</span>
//                     <span>찜</span>
//                     <span>시청한 작품</span>
//                 </div>
//                 <div className="deselect-all-container">
//                     <input
//                         type="checkbox"
//                         checked={allSelected}
//                         onChange={handleAllSelect}
//                     />
//                     <span>모두 해제</span>
//                 </div>
//                 <div className="friend-list">
//                     {filteredFriends.map((friend, index) => (
//                         <FriendListItem
//                             key={index}
//                             {...friend}
//                             isSelected={selectedFriends.includes(friend.name)}
//                             onSelect={handleFriendSelect}
//                         />
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default FriendRecommend;
//

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';  // 설치 필요: npm i jwt-decode
import './FriendRecommend.css';
import { autoRefreshCheck } from "../../tokenUtils/TokenUtils";
import  {useNavigate} from 'react-router';



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

    // 1. 토큰에서 내 멤버 아이디 추출
    useEffect(() => {

        const token = localStorage.getItem('jwt');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // 토큰 구조에 맞게 키 조정
                setMyMemberId(decoded.memberId || decoded.id || decoded.sub);
            } catch (e) {
                console.error('Invalid token format', e);
            }
        }
    }, []);

    // 2. 친구 목록 불러오기 (카테고리 변경 시)
    useEffect(() => {
        const fetchFriendsList = async () => {
            setIsLoading(true);
            setError(null);
            setIsFriendListLoaded(false);
            try {
                const url = selectedCategory === '영화' ? '/friend/getList' : '/friend/getDramaList';
                const response = await autoRefreshCheck({
                    method: "GET",
                    url: url,
                    params: { category: selectedCategory },
                });
                setFriendList(response.data);
                setIsFriendListLoaded(true);
            } catch (err) {
                console.error(`Error fetching ${selectedCategory} friendsList:`, err);
                setError('친구 목록을 가져오지 못했습니다.');
                setFriendList([]);
                setIsFriendListLoaded(false);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFriendsList();
    }, [selectedCategory]);

    // 3. 추천 요청: 친구 목록 로드 완료, 내 ID 있고, selectedFriends/옵션 변경 시 실행
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
                    url: "/recommend/movies",
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

    // 친구 선택/해제 처리
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

    // 카테고리 변경 처리
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setSelectedFriends([]);
        setAllSelected(false);
        setRecommendedMovies([]);
    };

    // 추천 옵션 변경 처리
    const handleRecommendOption = (option) => {
        setRecommendOption(recommendOption === option ? null : option);
    };

    // 친구 검색 필터링
    const filteredFriends = friendList.filter(friend =>
        friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 선택된 친구 프로필 (최대 6명)
    const displayedProfiles = selectedFriends.slice(0, 6);

    // 모달 열기/닫기
    const handleMovieClick = (movie) => {console.log(movie); setSelectedMovie(movie)};
    const closeModal = () => setSelectedMovie(null);

    // 모두 해제
    const handleAllSelect = () => {
        setAllSelected(false);
        setSelectedFriends([]);
    };

    const navigate = useNavigate();

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
                    {displayedProfiles.map((name, idx) => {
                        const friend = friendList.find(f => f.name === name);
                        return friend ? (
                            <div key={idx} className="profile">
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
                            친구를 선택하거나 추천 옵션을 변경하세요. 또는 찜목록이나 시청한 작품 목록이 너무 적습니다.
                        </div>
                    )}
                </div>

                {selectedMovie && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <button className="modal-close" onClick={closeModal}>×</button>
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
                            <button className="modal-details-btn" onClick={()=> navigate(`/detail/${selectedCategory  === "영화" ? "movie/" + selectedMovie.movieId : "tv/" + selectedMovie.tvShowId} `)}>상세페이지</button>
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
