import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Rating from 'react-rating';
import LoadingPage from "./LoadingPage";
import '../styles/Mypage.css';

const ContentTab = ({ fetchFunction, deleteFunction, contentType }) => {
    // --- State 및 함수 로직은 이전과 동일 ---
    const [items, setItems] = useState([]);
    const [nextCursor, setNextCursor] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [showDelete, setShowDelete] = useState({});
    const [timers, setTimers] = useState({});
    const navigate = useNavigate();

    const loadItems = useCallback(async (cursor) => {
        if (isLoading || (!hasMore && cursor)) return;
        setIsLoading(true);
        try {
            const response = await fetchFunction({ cursor, size: 20 });
            setItems(prev => cursor ? [...prev, ...response.items] : response.items);
            setNextCursor(response.nextCursor);
            setHasMore(response.nextCursor !== null);
        } catch (error) {
            console.error("콘텐츠 로딩 실패:", error);
            alert(error.message || "콘텐츠를 불러오는데 실패했습니다.");
        } finally {
            setIsLoading(false);
            if (initialLoad) setInitialLoad(false);
        }
    }, [fetchFunction, hasMore, initialLoad, isLoading]);

    useEffect(() => {
        setItems([]);
        setHasMore(true);
        setNextCursor(null);
        setInitialLoad(true);
        loadItems(null);
    }, [fetchFunction]);

    const handleDeleteItem = async (itemId) => {
        try {
            const response = await deleteFunction(itemId);
            if (response.success) {
                setItems(prev => prev.filter(item => item.id !== itemId));
                alert("삭제되었습니다.");
            } else {
                alert(response.message || "삭제에 실패했습니다.");
            }
        } catch (error) {
            console.error("아이템 삭제 실패:", error);
            alert(error.message || "삭제 중 오류가 발생했습니다.");
        }
    };

    const handleMouseEnter = (itemId) => {
        const timer = setTimeout(() => { setShowDelete(prev => ({...prev, [itemId]: true}))}, 2000);
        setTimers(prev => ({ ...prev, [itemId]: timer }));
    };

    const handleMouseLeave = (itemId) => {
        clearTimeout(timers[itemId]);
        setShowDelete(prev => ({ ...prev, [itemId]: false }));
    };

    const handleLoadMore = () => { if (nextCursor) loadItems(nextCursor); };
    const handleMovieClick = (item) => { navigate(`/${contentType}/${item.id}`); };

    if (initialLoad) return <LoadingPage />;

    return (
        <div>
            {items.length > 0 ? (
                <div className="content-grid">
                    {items.map((item) => {
                        const itemId = item.id;
                        const displayRating = (item.rating || 0) / 2;

                        return (
                            // --- 수정: JSX 구조 변경 ---
                            <div key={`${item.no}-${itemId}`} className="content-item-container">
                                <div
                                    className="poster-wrapper"
                                    onMouseEnter={() => handleMouseEnter(itemId)}
                                    onMouseLeave={() => handleMouseLeave(itemId)}
                                    onClick={() => handleMovieClick(item)}
                                >
                                    <img
                                        className="poster-image"
                                        src={`https://image.tmdb.org/t/p/w300${item.posterPath}`}
                                        alt={item.title || 'Poster'}
                                        loading="lazy"
                                    />
                                    {showDelete[itemId] && (
                                        <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDeleteItem(itemId); }}>삭제</button>
                                    )}
                                </div>
                                <div className="info-wrapper">
                                    <h3 className="info-title">{item.title || '제목 없음'}</h3>
                                    <div className="info-rating">
                                        <Rating initialRating={displayRating} emptySymbol={<span className="icon-star">☆</span>} fullSymbol={<span className="icon-star">★</span>} readonly />
                                        <span className="rating-score">{item.rating?.toFixed(1)}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="content-placeholder">목록이 비어있습니다.</div>
            )}
            {hasMore && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    {/* --- 수정: 버튼 텍스트 및 스타일 변경 --- */}
                    <button onClick={handleLoadMore} disabled={isLoading} className="btn-load-more-plus">
                        + 더보기
                    </button>
                </div>
            )}
        </div>
    );
};

export default ContentTab;