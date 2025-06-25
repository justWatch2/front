// // src/components/RecommendationPage.jsx
// import React, { useContext, useEffect, useState } from 'react';
// import { RecommendationContext } from '../RecommendationContext';
// import LoadingPage from './LoadingPage';
// import Background from './Background'; // 배경 컴포넌트
// import Row from './Row.jsx'; // 추천 결과 Row
// import ComplexGrid from './ComplexGrid'; // 복합 추천 Grid
//
// // 각 추천 유형의 입력 폼 컴포넌트 임포트
// import WeatherRecommendation from './WeatherRecommendationModal'; // 이제 모달로 띄워질 것
// import TimeRecommendation from './TimeRecommendationModal'; // 이제 즉시 추천 (컴포넌트 자체는 간단)
// import MBTIRecommendation from './MbtiRecommendationModal'; // 이제 모달로 띄워질 것
// import ComplexRecommendation from './ComplexRecommendationModal'; // 이제 인라인 폼
//
// import '../styles/RecommendationPage.css';
// import {fetchTrailer} from "../api/RecommendApi"; // 이 페이지 전용 스타일
//
//
// const RecommendationPage = () => {
//     const {
//         recommendations,
//         openRecommendation, // UI 활성화 함수 (Context에서 activeRecommendation 업데이트)
//         submitRecommendationRequest, // API 호출 및 로딩 관리 함수
//         selectedCategory,
//         setSelectedCategory,
//         isLoading,
//         setSelectedMovie, // MovieModal을 띄우기 위해 필요
//         clearRecommendations // 필요시 사용
//     } = useContext(RecommendationContext);
//
//     const [backgroundImage, setBackgroundImage] = useState('');
//     const [isMemberMode, setIsMemberMode] = useState(false); // 회원모드 상태
//
//     // --- 모달 폼의 가시성을 제어하는 상태 (날씨, MBTI 전용) ---
//     const [showWeatherModal, setShowWeatherModal] = useState(false);
//     const [showMbtiModal, setShowMbtiModal] = useState(false);
//
//     // --- TMDB 스타일 필터 상태 관리 (복합 추천 시 활용될 공통 필터들) ---
//     const [sortBy, setSortBy] = useState('popularity'); // 정렬 기준
//     const [viewingStatus, setViewingStatus] = useState('all'); // 시청 여부
//     const [releaseDateRange, setReleaseDateRange] = useState({ start: null, end: null }); // 개봉일 범위
//     const [selectedGenres, setSelectedGenres] = useState([]); // 선택된 장르 목록
//     const [isGenreFilterOpen, setIsGenreFilterOpen] = useState(true); // 장르 필터 드롭다운 열림/닫힘
//     const [voteAverageRange, setVoteAverageRange] = useState([0, 10]); // 평점 범위
//     const [showAdult, setShowAdult] = useState(false); // 성인 콘텐츠 포함 여부
//     const [isDomestic, setIsDomestic] = useState(true); // 국내/해외 여부
//
//     // TMDB 이미지에 있는 장르 목록 예시 (실제 DB 데이터와 일치시켜야 함)
//     const allGenres = [
//         { id: 28, name: '액션', key: 'Action' }, { id: 12, name: '모험', key: 'Adventure' }, { id: 16, name: '애니메이션', key: 'Animation' },
//         { id: 35, name: '코미디', key: 'Comedy' }, { id: 80, name: '범죄', key: 'Crime' }, { id: 99, name: '다큐멘터리', key: 'Documentary' },
//         { id: 18, name: '드라마', key: 'Drama' }, { id: 10751, name: '가족', key: 'Family' }, { id: 14, name: '판타지', 'key': 'Fantasy' },
//         { id: 36, name: '역사', key: 'History' }, { id: 27, name: '공포', key: 'Horror' }, { id: 10402, name: '음악', 'key': 'Music' },
//         { id: 9648, name: '미스터리', key: 'Mystery' }, { id: 10749, name: '로맨스', key: 'Romance' }, { id: 878, name: 'SF', key: 'Science Fiction' },
//         { id: 10770, name: 'TV 영화', key: 'TV Movie' }, { id: 53, name: '스릴러', key: 'Thriller' }, { id: 10752, name: '전쟁', key: 'War' },
//         { id: 37, name: '서부', key: 'Western' }
//     ];
//
//     // 사이드바 메뉴 정의 (각 카테고리에 연결될 입력 폼 컴포넌트, UX 행동 명시)
//     const recommendationCategories = [
//         { id: 'weather', label: '오늘 같은 날씨엔?', type: 'weather', component: WeatherRecommendation, behavior: 'modal' },
//         { id: 'time', label: '이 시간엔?', type: 'time', component: TimeRecommendation, behavior: 'instant' }, // <<< 바로 추천
//         { id: 'mbti', label: '내 MBTI에는?', type: 'mbti', component: MBTIRecommendation, behavior: 'modal' },
//         { id: 'complex', label: '이중엔 있겠지?', type: 'complex', component: ComplexRecommendation, behavior: 'inline_form' }, // <<< 인라인 폼
//     ];
//
//     // 페이지 로드 시 기본 카테고리 설정 및 폼 활성화
//     useEffect(() => {
//         if (!selectedCategory) {
//             setSelectedCategory('weather'); // '날씨'를 기본 선택 상태로 설정
//             openRecommendation('weather'); // '날씨' 폼이 보이도록 활성화 (API 호출 아님)
//         } else {
//             // 페이지 새로고침 등 시점에 이미 선택된 카테고리가 있다면, 그 폼을 다시 활성화
//             openRecommendation(selectedCategory);
//         }
//         setBackgroundImage(''); // 페이지 진입 시 배경 이미지 초기화
//     }, [selectedCategory, setSelectedCategory, openRecommendation]);
//
//
//     const handleCategoryClick = (category) => {
//         console.log('Recommendation Category clicked:', category.id);
//         if (category.id !== selectedCategory) { // 현재 선택된 카테고리가 아니면
//             setSelectedCategory(category.id); // 새 카테고리 선택
//             setBackgroundImage(''); // 배경 초기화 (선택 사항)
//
//             // 카테고리 변경 시 기존 필터 상태 초기화 (필터는 각 폼이 받아가므로 여기서는 공통 필터만 초기화)
//             setSortBy('popularity');
//             setViewingStatus('all');
//             setReleaseDateRange({ start: null, end: null });
//             setSelectedGenres([]);
//             setIsGenreFilterOpen(true);
//             setVoteAverageRange([0, 10]);
//             setShowAdult(false);
//             setIsDomestic(true);
//
//             // === 각 추천 유형의 행동(behavior)에 따른 분기 처리 ===
//             if (category.behavior === 'modal') {
//                 // 모달 형태의 추천 (날씨, MBTI)
//                 // 현재 activeRecommendation이 설정되면 RecommendationPage의 CurrentRecommendationFormComponent가 렌더링되는데,
//                 // 이들은 이제 모달 내부에 있을 것입니다.
//                 if (category.id === 'weather') setShowWeatherModal(true);
//                 else if (category.id === 'mbti') setShowMbtiModal(true);
//                 // openRecommendation('weather')는 해당 폼 컴포넌트를 활성화하기 위한 것.
//             } else if (category.behavior === 'instant') {
//                 // 즉시 추천 (시간대 추천)
//                 // TODO: 사용자 ID, 기본 장르 등 TimeRecommendationApi에 필요한 파라미터 정의
//                 const userId = "crazyman"; // 임시 사용자 ID (로그인된 사용자의 ID로 교체 필요)
//                 const defaultTimeGenresMovie = ["드라마", "코미디"]; // 예시
//                 const defaultTimeGenresTV = ["액션", "SF"]; // 예시
//
//                 submitRecommendationRequest(category.id, {
//                     userId: userId,
//                     genresMovies: defaultTimeGenresMovie,
//                     genresTV: defaultTimeGenresTV,
//                     // 공통 필터도 함께 전달 (백엔드 API가 받지 않아도 무방)
//                     sortBy: sortBy,
//                     viewingStatus: viewingStatus,
//                     releaseDateStart: releaseDateRange.start ? releaseDateRange.start.toISOString().split('T')[0] : null,
//                     releaseDateEnd: releaseDateRange.end ? releaseDateRange.end.toISOString().split('T')[0] : null,
//                     selectedGenres: selectedGenres,
//                     voteAverageMin: voteAverageRange[0],
//                     voteAverageMax: voteAverageRange[1],
//                     adult: showAdult,
//                     isDomestic: isDomestic,
//                     isMemberMode: isMemberMode,
//                 });
//                 openRecommendation(category.id); // UI도 활성화 (결과 표시를 위해)
//             } else if (category.behavior === 'inline_form') {
//                 // 인라인 폼 (복합 추천)
//                 openRecommendation(category.id); // 해당 폼 컴포넌트가 인라인으로 보이도록 활성화
//             }
//         }
//     };
//
//     // 장르 체크박스 변경 핸들러
//     const handleGenreChange = (genreKey) => {
//         setSelectedGenres((prevSelected) => {
//             if (prevSelected.includes(genreKey)) {
//                 return prevSelected.filter((key) => key !== genreKey);
//             } else {
//                 return [...prevSelected, genreKey];
//             }
//         });
//     };
//
//     // Poster hover 시 배경 이미지 변경
//     const handleItemHover = (imageUrl) => { setBackgroundImage(imageUrl); };
//
//     // 영화/TV 클릭 시 모달 띄우기 (utils/api.js에서 분리된 fetchTrailer 사용)
//     const handleItemClick = async (item) => { // event 파라미터 제거
//         console.log('Item selected on RecommendationPage:', item);
//         const mediaType = item.korean_title ? 'movie' : 'tv'; // DTO에 media_type이 없으면 제목으로 판단
//         const trailerUrl = await fetchTrailer(item.id, mediaType);
//         setSelectedMovie({ ...item, trailerUrl }); // MovieModal에 clickPosition은 더 이상 전달하지 않습니다.
//     };
//
//     // 추천 결과 섹션의 제목을 생성
//     const getRowTitle = (type, region) => { /* ... */
//         const mediaLabel = type === 'tv' ? '추천드라마' : '추천영화';
//         const regionLabel = region === 'domestic' ? '국내' : '해외';
//         return `${regionLabel} ${mediaLabel} `;
//     };
//
//     // 실제 추천 결과를 렌더링하는 함수
//     const renderRecommendationResults = (data, categoryId) => { /* ... */
//         if (!isLoading && selectedCategory && (!data || Object.keys(data).length === 0)) {
//             return <p className="no-results-message">선택하신 조건에 맞는 추천 결과를 찾을 수 없습니다.<br/>추천 조건을 입력하고 '추천받기' 버튼을 눌러주세요!</p>;
//         }
//         if (isLoading) return null; // 로딩 중이면 메시지 안 띄움
//         if (!selectedCategory) return null; // 초기 선택 안 됐으면 아무것도 안 띄움
//
//         // 복합 추천은 ComplexGrid로 렌더링
//         if (categoryId === 'complex' && data.complexList && data.complexList.length > 0) {
//             return (
//                 <div key={`${categoryId}-complex`} className="recommendation-row-section">
//                     <h2 className="section-title">복합 추천 결과</h2>
//                     <ComplexGrid
//                         items={data.complexList}
//                         onMovieClick={handleItemClick}
//                     />
//                 </div>
//             );
//         }
//
//         // 일반적인 영화/TV 추천 (날씨, 시간, MBTI)은 Row 컴포넌트 사용
//         const itemsToRender = [];
//         if (data.domesticMovies && data.domesticMovies.length > 0) {
//             itemsToRender.push({ key: `${categoryId}-domesticMovies`, type: 'movies', region: 'domestic', items: data.domesticMovies });
//         }
//         if (data.internationalMovies && data.internationalMovies.length > 0) {
//             itemsToRender.push({ key: `${categoryId}-internationalMovies`, type: 'movies', region: 'international', items: data.internationalMovies });
//         }
//         if (data.domesticTV && data.domesticTV.length > 0) {
//             itemsToRender.push({ key: `${categoryId}-domesticTV`, type: 'tv', region: 'domestic', items: data.domesticTV });
//         }
//         if (data.internationalTV && data.internationalTV.length > 0) {
//             itemsToRender.push({ key: `${categoryId}-internationalTV`, type: 'tv', region: 'international', items: data.internationalTV });
//         }
//
//         if (itemsToRender.length === 0) { // 이 시점에도 데이터가 없다면 (예: API에서 빈 배열 옴)
//             return <p className="no-results-message">선택하신 조건에 맞는 추천 결과를 찾을 수 없습니다.</p>;
//         }
//
//         return itemsToRender.map(({ key, type, region, items }) => (
//             <div key={key} className="recommendation-row-section">
//                 <h2 className="section-title">{getRowTitle(type, region)}</h2>
//                 <Row
//                     movies={items}
//                     onHoverPoster={handleItemHover}
//                     onMovieClick={handleItemClick}
//                 />
//             </div>
//         ));
//     };
//
//
//     // 현재 선택된 카테고리의 입력 폼 컴포넌트
//     const CurrentRecommendationFormComponent = selectedCategory ? recommendationCategories.find(cat => cat.id === selectedCategory)?.component : null;
//     const currentCategoryBehavior = selectedCategory ? recommendationCategories.find(cat => cat.id === selectedCategory)?.behavior : null;
//
//     return (
//         <>
//             <div className="background">
//                 <Background image={backgroundImage} />
//             </div>
//
//             <main className="recommendation-page-main">
//                 {/* 왼쪽 사이드바 (추천 카테고리 목록 및 공통 필터) */}
//                 <aside className="recommendation-sidebar">
//                     <h3 className="sidebar-title">추천 종류</h3>
//                     <ul>
//                         {recommendationCategories.map((category) => (
//                             <li
//                                 key={category.id}
//                                 className={`sidebar-item ${selectedCategory === category.id ? 'selected' : ''}`}
//                                 onClick={() => handleCategoryClick(category)}
//                             >
//                                 {category.label}
//                             </li>
//                         ))}
//                     </ul>
//
//                     {/* <<< 회원모드 버튼 >>> */}
//                     <div className="member-mode-section filter-section">
//                         <button
//                             className={`member-mode-button ${isMemberMode ? 'selected' : ''}`}
//                             onClick={() => setIsMemberMode(!isMemberMode)}
//                         >
//                             <i className={`fas ${isMemberMode ? 'fa-check-circle' : 'fa-user-circle'}`}></i>
//                             회원모드 {isMemberMode ? '활성화됨' : '비활성화됨'}
//                         </button>
//                     </div>
//
//                     {/* --- TMDB 스타일 공통 필터 섹션 (복합 추천 시 활용) --- */}
//                     {/* selectedCategory가 'complex'이거나 'inline_form'을 사용하는 경우에만 공통 필터 표시 */}
//                     {(currentCategoryBehavior === 'inline_form') && ( // <<< behavior === 'inline_form'
//                         <div className="tmdb-filter-group">
//                             <div className="filter-section">
//                                 <h4 className="filter-section-title">정렬</h4>
//                                 <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
//                                     <option value="popularity">인기순</option>
//                                     <option value="release_date">최신순</option>
//                                     <option value="vote_average">평점순</option>
//                                 </select>
//                             </div>
//
//                             <div className="filter-section">
//                                 <h4 className="filter-section-title">필터</h4>
//                                 {/* 시청 여부 */}
//                                 <div className="filter-radio-group">
//                                     <label className="filter-radio-label">
//                                         <input type="radio" name="viewingStatus" value="all" checked={viewingStatus === 'all'} onChange={(e) => setViewingStatus(e.target.value)} />
//                                         <span>전체</span>
//                                     </label>
//                                     <label className="filter-radio-label">
//                                         <input type="radio" name="viewingStatus" value="unseen" checked={viewingStatus === 'unseen'} onChange={(e) => setViewingStatus(e.target.value)} />
//                                         <span>안 본 콘텐츠</span>
//                                     </label>
//                                     <label className="filter-radio-label">
//                                         <input type="radio" name="viewingStatus" value="seen" checked={viewingStatus === 'seen'} onChange={(e) => setViewingStatus(e.target.value)} />
//                                         <span>본 콘텐츠</span>
//                                     </label>
//                                 </div>
//
//                                 {/* 개봉일 검색 */}
//                                 <div className="filter-date-range">
//                                     <h5 className="filter-subsection-title">개봉일</h5>
//                                     <input
//                                         type="date"
//                                         className="filter-date-input"
//                                         value={releaseDateRange.start ? releaseDateRange.start.toISOString().split('T')[0] : ''}
//                                         onChange={(e) => setReleaseDateRange(prev => ({ ...prev, start: e.target.value ? new Date(e.target.value) : null }))}
//                                     />
//                                     <span> ~ </span>
//                                     <input
//                                         type="date"
//                                         className="filter-date-input"
//                                         value={releaseDateRange.end ? releaseDateRange.end.toISOString().split('T')[0] : ''}
//                                         onChange={(e) => setReleaseDateRange(prev => ({ ...prev, end: e.target.value ? new Date(e.target.value) : null }))}
//                                     />
//                                 </div>
//
//                                 {/* 장르 선택 */}
//                                 <div className="filter-genre-select">
//                                     <h5 className="filter-subsection-title" onClick={() => setIsGenreFilterOpen(!isGenreFilterOpen)}>
//                                         장르 <i className={`fas ${isGenreFilterOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
//                                     </h5>
//                                     {isGenreFilterOpen && (
//                                         <div className="genre-checkbox-list">
//                                             {allGenres.map((genre) => (
//                                                 <label key={genre.id} className="filter-checkbox-label">
//                                                     <input
//                                                         type="checkbox"
//                                                         value={genre.key}
//                                                         checked={selectedGenres.includes(genre.key)}
//                                                         onChange={() => handleGenreChange(genre.key)}
//                                                     />
//                                                     <span>{genre.name}</span>
//                                                 </label>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//
//                                 {/* 평점 범위 */}
//                                 <div className="filter-rating-range">
//                                     <h5 className="filter-subsection-title">평점 ({voteAverageRange[0]} - {voteAverageRange[1]})</h5>
//                                     <input
//                                         type="range"
//                                         min="0" max="10" step="0.5"
//                                         value={voteAverageRange[0]}
//                                         onChange={(e) => setVoteAverageRange([Number(e.target.value), voteAverageRange[1]])}
//                                         className="rating-slider"
//                                     />
//                                     <input
//                                         type="range"
//                                         min="0" max="10" step="0.5"
//                                         value={voteAverageRange[1]}
//                                         onChange={(e) => setVoteAverageRange([voteAverageRange[0], Number(e.target.value)])}
//                                         className="rating-slider"
//                                     />
//                                     <p className="slider-values">최소: {voteAverageRange[0]} / 최대: {voteAverageRange[1]}</p>
//                                 </div>
//
//                                 {/* 성인 여부 / 국내 해외 */}
//                                 <div className="filter-checkbox-group">
//                                     <label className="filter-checkbox-label">
//                                         <input type="checkbox" checked={showAdult} onChange={(e) => setShowAdult(e.target.checked)} />
//                                         <span>성인 콘텐츠 포함</span>
//                                     </label>
//                                     <label className="filter-checkbox-label">
//                                         <input type="checkbox" checked={isDomestic} onChange={(e) => setIsDomestic(e.target.checked)} />
//                                         <span>국내 콘텐츠만</span>
//                                     </label>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </aside>
//
//                 {/* 메인 추천 콘텐츠 영역 */}
//                 <section className="recommendation-content-area">
//                     {/* 로딩 중일 때 로딩 페이지 표시 */}
//                     {isLoading ? (
//                         <div className="loading-wrapper">
//                             <LoadingPage />
//                         </div>
//                     ) : (
//                         <>
//                             {/* 선택된 추천 유형의 입력 폼 렌더링 */}
//                             {CurrentRecommendationFormComponent && currentCategoryBehavior !== 'instant' && ( // instant는 폼 없음
//                                 // 모달 형태로 띄울 컴포넌트들은 RecommendationPage 밖에서 관리 (showWeatherModal 등)
//                                 // 여기에 CurrentRecommendationFormComponent를 렌더링하는 것은 'inline_form' 전용
//                                 currentCategoryBehavior === 'inline_form' && ( // <<< inline_form 일 때만 여기에 폼 렌더링
//                                     <div className="recommendation-input-form">
//                                         {React.createElement(CurrentRecommendationFormComponent, {
//                                             onFormSubmit: submitRecommendationRequest,
//                                             selectedCategory: selectedCategory,
//                                             // 공통 필터 상태들을 인라인 폼 컴포넌트로 전달
//                                             commonFilters: { sortBy, viewingStatus, releaseDateRange, selectedGenres, voteAverageRange, showAdult, isDomestic, isMemberMode }
//                                         })}
//                                     </div>
//                                 )
//                             )}
//
//                             {/* 추천 결과 표시 영역 */}
//                             <div className="recommendation-results">
//                                 {selectedCategory && (
//                                     <h1 className="recommendation-section-title">
//                                         {recommendationCategories.find(cat => cat.id === selectedCategory)?.label} 결과
//                                     </h1>
//                                 )}
//                                 {renderRecommendationResults(recommendations[selectedCategory], selectedCategory)}
//                             </div>
//                         </>
//                     )}
//                 </section>
//             </main>
//
//             {/* <<< 모달 형태로 띄워질 추천 폼 컴포넌트들 >>> */}
//             {showWeatherModal && (
//                 <WeatherRecommendation
//                     onFormSubmit={submitRecommendationRequest}
//                     selectedCategory="weather"
//                     commonFilters={{ sortBy, viewingStatus, releaseDateRange, selectedGenres, voteAverageRange, showAdult, isDomestic, isMemberMode }}
//                     onCloseModal={() => setShowWeatherModal(false)} // 모달 닫기 함수 전달
//                 />
//             )}
//             {showMbtiModal && (
//                 <MBTIRecommendation
//                     onFormSubmit={submitRecommendationRequest}
//                     selectedCategory="mbti"
//                     commonFliters={{ sortBy, viewingStatus, releaseDateRange, selectedGenres, voteAverageRange, showAdult, isDomestic, isMemberMode }}
//                     onCloseModal={() => setShowMbtiModal(false)} // 모달 닫기 함수 전달
//                 />
//             )}
//         </>
//     );
// };
//
// export default RecommendationPage;