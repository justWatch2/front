import React, { useState, useEffect, useContext, useCallback } from 'react';
import { RecommendationContext } from '../RecommendationContext'; // 실제 경로에 맞게 수정해주세요.
import {fetchMyProfile, updateMyProfile, getFriends, deleteFriend, getContents, deleteContent} from '../api/UserApi';
import LoadingPage from "./LoadingPage";
import '../styles/Mypage.css';
import {jwtDecode} from "jwt-decode";
import ProfileLogo from "../../recommendFriend/img/ProfileLogo.png";
import ContentTab  from "./ContentTab";

// --- '프로필 수정' 모달 컴포넌트 (변경 없음) ---
const ProfileEditModal = ({ user, displayImageUrl, onClose, onSave }) => {
    // ... (기존 코드와 동일)
    const [memberId, setMemberId] = useState(user.memberId);
    const [memberName, setMemberName] = useState(user.memberName);
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(displayImageUrl);
    const decode = jwtDecode(localStorage.getItem('jwt'))? jwtDecode(localStorage.getItem('jwt')) : null;

    const isSocialLogin = decode && ['google', 'kakao', 'facebook'].includes(decode.provider);

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
        if (isSocialLogin) {
            onSave({ memberId, memberName, imageFile });
        } else {
            if (password && password !== confirmPassword) {
                alert('새 비밀번호가 일치하지 않습니다.');
                return;
            }
            if (!currentPassword) {
                alert('프로필 변경을 위해 기존 비밀번호를 입력해주세요.');
                return;
            }
            onSave({ memberId, memberName, currentPassword, password, imageFile });
        }
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
                        placeholder={isSocialLogin ? "소셜 로그인은 비밀번호 변경 불가" : "기존 비밀번호 입력"}
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        disabled={isSocialLogin}
                    />
                </div>
                <div className="modal-input-group">
                    <label>새 비밀번호</label>
                    <input
                        type="password"
                        placeholder={isSocialLogin ? "소셜 로그인은 비밀번호 변경 불가" : "변경할 경우에만 입력"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        disabled={isSocialLogin}
                    />
                </div>
                <div className="modal-input-group">
                    <label>새 비밀번호 확인</label>
                    <input
                        type="password"
                        placeholder={isSocialLogin ? "소셜 로그인은 비밀번호 변경 불가" : "비밀번호 확인"}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        disabled={isSocialLogin}
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

// --- FriendsTab 컴포넌트 (변경 없음) ---
const FriendsTab = ({ userId }) => {
    // ... (기존 코드와 동일)
    const [friends, setFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDelete, setShowDelete] = useState({});


    const loadFriends = useCallback(async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const response = await getFriends();
            if(response.length === 0) {
                console.log(response)
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
                            src={friend.imgUrl ? `http://localhost:8080${friend.imgUrl}` : ProfileLogo}
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
    // ✅ Context에서 userId와 새로 만든 updateUserInfo 함수를 가져옵니다.
    const { userId, updateUserInfo } = useContext(RecommendationContext);
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('');
    const [displayImageUrl, setDisplayImageUrl] = useState('');
    const [randomDefaultImage] = useState('https://placehold.co/100x100/e50914/ffffff?text=W');

    const loadProfile = useCallback(async () => {
        if (!userId) { // userId가 없으면 프로필 로드 시도 안함
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const profileData = await fetchMyProfile();
            setProfile(profileData);
            // ✅ API 응답의 img_url을 사용하고, 없으면 기본 이미지를 사용합니다.
            if (profileData && profileData.img_url) {
                setDisplayImageUrl(`http://localhost:8080${profileData.img_url}`);
            } else {
                setDisplayImageUrl(ProfileLogo); // 기본 로고 이미지로 설정
            }
        } catch (error) {
            console.error("프로필 정보를 불러오는 데 실패했습니다:", error);
            setProfile(null);
        } finally {
            setIsLoading(false);
        }
    }, [userId]); // userId가 변경될 때마다 프로필을 다시 로드

    const handleSaveProfile = async (updatedData) => {
        setIsEditModalOpen(false);
        setIsLoading(true);
        try {
            const response = await updateMyProfile(updatedData);
            alert(response.message);

            if (response.success) {
                // ✅ [핵심] Context의 함수를 호출하여 전역 상태와 localStorage를 업데이트
                updateUserInfo({
                    memberName: updatedData.memberName,
                    imgUrl: response.imgUrl // 백엔드 응답에 새 이미지 URL이 포함되어야 함
                });
                // ✅ 상태 업데이트 후, 프로필 정보를 다시 불러와 화면을 갱신
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
    // ✅ userId가 아닌 profile 객체로 로그인 여부 판단
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
                        {/* ... (탭 관련 코드는 변경 없음) ... */}
                        <div className="tab-navigation">
                            <button className={`tab-button ${activeTab === 'friends' ? 'active' : ''}`} onClick={() => setActiveTab('friends')}>친구 목록</button>
                            <button className={`tab-button ${activeTab === 'wish_movies' ? 'active' : ''}`} onClick={() => setActiveTab('wish_movies')}>찜한 영화</button>
                            <button className={`tab-button ${activeTab === 'wish_tv' ? 'active' : ''}`} onClick={() => setActiveTab('wish_tv')}>찜한 TV</button>
                            <button className={`tab-button ${activeTab === 'watched_movies' ? 'active' : ''}`} onClick={() => setActiveTab('watched_movies')}>시청한 영화</button>
                            <button className={`tab-button ${activeTab === 'watched_tv' ? 'active' : ''}`} onClick={() => setActiveTab('watched_tv')}>시청한 TV</button>
                        </div>

                        <div className="tab-content-display">
                            {activeTab === 'friends' && <FriendsTab userId={userId} />}

                            {activeTab === 'wish_movies' && (
                                <ContentTab
                                    key="wish-movies"
                                    fetchFunction={(params) => getContents({ ...params, status: 'wish', type: 'movie' })}
                                    deleteFunction={(itemId) => deleteContent({ contentId: itemId, status: 'wish', type: 'movie' })}
                                    contentType="movie"
                                />
                            )}

                            {activeTab === 'wish_tv' && (
                                <ContentTab
                                    key="wish-tv"
                                    fetchFunction={(params) => getContents({ ...params, status: 'wish', type: 'tv' })}
                                    deleteFunction={(itemId) => deleteContent({ contentId: itemId, status: 'wish', type: 'tv' })}
                                    contentType="tv"
                                />
                            )}

                            {activeTab === 'watched_movies' && (
                                <ContentTab
                                    key="watched-movies"
                                    fetchFunction={(params) => getContents({ ...params, status: 'watched', type: 'movie' })}
                                    deleteFunction={(itemId) => deleteContent({ contentId: itemId, status: 'watched', type: 'movie' })}
                                    contentType="movie"
                                />
                            )}

                            {activeTab === 'watched_tv' && (
                                <ContentTab
                                    key="watched-tv"
                                    fetchFunction={(params) => getContents({ ...params, status: 'watched', type: 'tv' })}
                                    deleteFunction={(itemId) => deleteContent({ contentId: itemId, status: 'watched', type: 'tv' })}
                                    contentType="tv"
                                />
                            )}
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