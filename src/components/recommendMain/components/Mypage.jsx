import React, { useState, useEffect, useContext, useCallback } from 'react';
import { RecommendationContext } from '../RecommendationContext';
import { fetchMyProfile, updateMyProfile, getFriends, deleteFriend } from '../api/UserApi';
import LoadingPage from "./LoadingPage";
import WishlistTab from './WishlistTab';
import '../styles/Mypage.css';

// --- '프로필 수정' 모달 컴포넌트 ---
const ProfileEditModal = ({ user, displayImageUrl, onClose, onSave }) => {
    const [memberId, setMemberId] = useState(user.memberId);
    const [memberName, setMemberName] = useState(user.memberName);
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(displayImageUrl);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => { setImagePreview(reader.result); };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (password && password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        if (!currentPassword) {
            alert('기존 비밀번호를 입력해주세요.');
            return;
        }
        onSave({ memberId, memberName, currentPassword, password, imageFile });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">프로필 수정</h2>
                <div className="modal-profile-image-section">
                    <img src={imagePreview} alt="Preview" className="modal-profile-image-preview"/>
                    <input type="file" id="imageUpload" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                    <label htmlFor="imageUpload" className="modal-image-upload-btn">이미지 선택</label>
                </div>
                <div className="modal-input-group">
                    <label>아이디</label>
                    <input type="text" value={memberId} disabled />
                </div>
                <div className="modal-input-group">
                    <label>닉네임</label>
                    <input type="text" value={memberName} onChange={e => setMemberName(e.target.value)} />
                </div>
                <div className="modal-input-group">
                    <label>기존 비밀번호</label>
                    <input
                        type="password"
                        placeholder="기존 비밀번호 입력"
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                    />
                </div>
                <div className="modal-input-group">
                    <label>새 비밀번호</label>
                    <input
                        type="password"
                        placeholder="변경할 경우에만 입력"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div className="modal-input-group">
                    <label>새 비밀번호 확인</label>
                    <input
                        type="password"
                        placeholder="비밀번호 확인"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                </div>
                <div className="modal-buttons">
                    <button onClick={onClose} className="btn btn-secondary">취소</button>
                    <button onClick={handleSave} className="btn btn-primary">저장</button>
                </div>
            </div>
        </div>
    );
};

// --- FriendsTab 컴포넌트 (인라인 정의, 친구 목록 및 삭제 기능 포함) ---
const FriendsTab = ({ userId }) => {
    const [friends, setFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDelete, setShowDelete] = useState({});

    const loadFriends = useCallback(async () => {
        if (!userId || isLoading) return;
        setIsLoading(true);
        try {
            const response = await getFriends();
            if(response.length === 0) {
                setFriends(response);
                alert("친구가 없습니다.")
            }else{
                setFriends(response);
                console.log(response);
            }
        } catch (error) {
            console.error("친구 목록 불러오기 실패:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        loadFriends();
    }, [userId]);

    const handleDeleteFriend = async (friendId) => {
        try {
            const response = await deleteFriend({ friendId });
            if (response.success) {
                setFriends(prev => prev.filter(friend => friend.memberId !== friendId));
                alert('친구가 삭제되었습니다.');
            } else {
                alert(response.message);
            }
        } catch (error) {
            console.error('친구 삭제 실패:', error);
            alert('친구 삭제에 실패했습니다.');
        }
        loadFriends();
    };

    const handleMouseEnter = (id) => {
        const timer = setTimeout(() => setShowDelete(prev => ({ ...prev, [id]: true })), 1000);
        return () => clearTimeout(timer);
    };

    const handleMouseLeave = (id) => {
        setShowDelete(prev => ({ ...prev, [id]: false }));
    };

    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>친구 목록</h2>
            <div className="friends-grid">
                {friends.map(friend => (
                    <div
                        key={friend.memberId}
                        className="friend-item"
                        onMouseEnter={() => handleMouseEnter(friend.memberId)}
                        onMouseLeave={() => handleMouseLeave(friend.memberId)}
                    >
                        <img
                            src={"http://localhost:8080"+friend.imgUrl || 'https://placehold.co/50x50/e50914/ffffff?text=F'}
                            alt={friend.memberId}
                            className="friend-image"
                        />
                        <span className="friend-name">{friend.memberName}</span>
                        {showDelete[friend.memberId] && (
                            <button
                                className="friend-delete-btn"
                                onClick={() => handleDeleteFriend(friend.memberId)}
                            >
                                삭제
                            </button>
                        )}
                    </div>
                ))}
            </div>
            {friends.length === 0 && !isLoading && <div className="content-placeholder">친구가 없습니다.</div>}
        </div>
    );
};

// --- 마이페이지 메인 컴포넌트 ---
export default function MyPage() {
    const { userId } = useContext(RecommendationContext);
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(''); // 초기값을 빈 문자열로 설정
    const [displayImageUrl, setDisplayImageUrl] = useState('');

    const defaultProfileImages = [
        'https://placehold.co/100x100/e50914/ffffff?text=W',
        'https://placehold.co/100x100/333333/ffffff?text=A',
    ];
    const [randomDefaultImage] = useState(defaultProfileImages[Math.floor(Math.random() * defaultProfileImages.length)]);

    const loadProfile = useCallback(async () => {
        if (!userId) {
            setIsLoading(false);
            setProfile(null);
            return;
        }
        setIsLoading(true);
        try {
            const profileData = await fetchMyProfile();
            setProfile(profileData);
            if (profileData && profileData.img_url) {
                setDisplayImageUrl(`http://localhost:8080${profileData.img_url}`);
            } else {
                setDisplayImageUrl(randomDefaultImage);
            }
        } catch (error) {
            console.error("프로필 정보를 불러오는 데 실패했습니다:", error);
            setProfile(null);
        } finally {
            setIsLoading(false);
        }
    }, [userId, randomDefaultImage]);

    const handleSaveProfile = async (updatedData) => {
        setIsEditModalOpen(false);
        setIsLoading(true);
        try {
            const response = await updateMyProfile(updatedData);
            alert(response.message);
            if (response.success) {
                await loadProfile();
            }
        } catch (error) {
            alert(error.message || "프로필 수정에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    if (isLoading) return <LoadingPage />;
    if (!profile) {
        return (
            <div className="mypage-wrapper" style={{ textAlign: 'center', paddingTop: '10rem' }}>
                <h2>로그인이 필요합니다.</h2>
            </div>
        );
    }

    return (
        <>
            <div className="mypage-wrapper">
                <div className="mypage-container">
                    <section className="profile-header">
                        <div className="profile-details">
                            <img src={displayImageUrl} alt="Profile" className="profile-image"/>
                            <div className="profile-info-text">
                                <h1>{profile.memberName}</h1>
                                <p>{profile.memberId}</p>
                            </div>
                        </div>
                        <div className="profile-actions">
                            <button className="btn btn-edit" onClick={() => setIsEditModalOpen(true)}>프로필 수정</button>
                            <button className="btn btn-delete" onClick={() => alert('회원 탈퇴 기능 구현 예정')}>회원 탈퇴</button>
                        </div>
                    </section>

                    <section className="content-section">
                        <div className="tab-navigation" style={{ overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: '10px' }}>
                            <button
                                className={`tab-button ${activeTab === 'friends' ? 'active' : ''}`}
                                onClick={() => setActiveTab(activeTab === 'friends' ? '' : 'friends')}
                            >
                                친구 목록
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'liked_movies' ? 'active' : ''}`}
                                onClick={() => setActiveTab(activeTab === 'liked_movies' ? '' : 'liked_movies')}
                            >
                                찜한 영화
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'liked_tvs' ? 'active' : ''}`}
                                onClick={() => setActiveTab(activeTab === 'liked_tvs' ? '' : 'liked_tvs')}
                            >
                                찜한 TV
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'watched_movies' ? 'active' : ''}`}
                                onClick={() => setActiveTab(activeTab === 'watched_movies' ? '' : 'watched_movies')}
                            >
                                시청 영화
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'watched_tvs' ? 'active' : ''}`}
                                onClick={() => setActiveTab(activeTab === 'watched_tvs' ? '' : 'watched_tvs')}
                            >
                                시청 TV
                            </button>
                        </div>

                        <div className="tab-content-display">
                            {activeTab === 'friends' && <FriendsTab userId={userId} />}
                            {activeTab === 'liked_movies' && <WishlistTab type="liked_movies" title="찜한 영화" userId={userId} />}
                            {activeTab === 'liked_tvs' && <WishlistTab type="liked_tvs" title="찜한 TV" userId={userId} />}
                            {activeTab === 'watched_movies' && <WishlistTab type="watched_movies" title="시청 영화" userId={userId} />}
                            {activeTab === 'watched_tvs' && <WishlistTab type="watched_tvs" title="시청 TV" userId={userId} />}
                        </div>
                    </section>
                </div>
            </div>

            {isEditModalOpen && (
                <ProfileEditModal
                    user={profile}
                    displayImageUrl={displayImageUrl}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSaveProfile}
                />
            )}
        </>
    );
}