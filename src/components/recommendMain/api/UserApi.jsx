import { autoRefreshCheck } from '../../../tokenUtils/TokenUtils';

export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${API_SERVER_HOST}/member`;

export const fetchMyProfile = async () => {
    try {
        const response = await autoRefreshCheck({
            method: 'get',
            url: `${prefix}/profile` // 최종 경로: /api/user/profile
        });
        return response.data;
    } catch (err) {
        console.error("프로필 정보 로딩 실패:", err);
        throw err; // 에러가 발생했음을 호출한 곳에 알립니다.
    }
};

export const updateMyProfile = async (updatedData) => {
    // 파일과 JSON 데이터를 함께 보내기 위해 FormData를 생성합니다.
    const formData = new FormData();

    // 1. 텍스트 데이터(닉네임, 비밀번호)를 JSON 형식으로 만듭니다.
    const profileDto = {
        currentPassword: updatedData.currentPassword,
        memberName:updatedData.memberName,
        password: updatedData.password
    };
    // 'profileDto'라는 이름으로 JSON 데이터를 추가합니다.
    formData.append('profileDto', new Blob([JSON.stringify(profileDto)], { type: "application/json" }));

    // 2. 이미지 파일이 있을 경우에만 'imageFile'이라는 이름으로 추가합니다.
    if (updatedData.imageFile) {
        formData.append('imageFile', updatedData.imageFile);
    }

    try {
        const response = await autoRefreshCheck({
            method: 'put',
            url: `${prefix}/profile`,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (err) {
        const errorMessage = err.response?.data?.message || "프로필 수정에 실패했습니다.";
        alert(errorMessage);
        console.error("프로필 수정 실패:", err);
        throw err;
    }
}

export const getWishlist = async ({ cursor = null, size = 20, type }) => {
    try {
        const response = await autoRefreshCheck({
            method: 'get',
            url: `${prefix}/wishlist`,
            params: { cursor, size, type },
        });
        return response.data;
    } catch (err) {
        const errorMessage = err.response?.data?.message || "찜 목록을 불러오지 못했습니다.";
        throw new Error(errorMessage);
    }
};

export const deleteWishlistItem = async ({ movieId, type }) => {
    try {
        const response = await autoRefreshCheck({
            method: 'delete',
            url: `${prefix}/wishlist/${movieId}`,
            params: { type },
        });
        return response.data;
    } catch (err) {
        const errorMessage = err.response?.data?.message || "항목 삭제에 실패했습니다.";
        throw new Error(errorMessage);
    }
};

export const getFriends = async () => {
    try {
        const response = await autoRefreshCheck({
            method: 'get',
            url: `${prefix}/friends`,
        });
        console.log("getFriends response1321231231231:", response.data);
        return response.data;
    } catch (err) {
        const errorMessage = err.response?.data?.message || "친구 목록을 불러오지 못했습니다.";
        console.error("getFriends error:123123123112312", err.response?.data);
        throw new Error(errorMessage);
    }
};

export const deleteFriend = async ({ friendId }) => {
    try {
        const response = await autoRefreshCheck({
            method: 'delete',
            url: `${prefix}/friends/${friendId}`,
        });
        return response.data;
    } catch (err) {
        const errorMessage = err.response?.data?.message || "친구 삭제에 실패했습니다.";
        throw new Error(errorMessage);
    }
};

export const findmemberId = async ()=>{
    try{
        const reponse = await autoRefreshCheck({
            method: 'get',
            url:`${prefix}/memberName`
        });
        return reponse.data;
    }catch (err){
        throw err;
    }
};

export const getContents = async ({ status, type, cursor, size = 20 }) => {
    try {
        const response = await autoRefreshCheck({
            method: 'get',
            url: `${prefix}/contents`,
            params: { status, type, cursor, size }
        });
        // 성공 시, 서버가 보내준 데이터를 그대로 반환합니다.
        // { items: [...], nextCursor: "..." } 형태를 기대합니다.
        return response.data;
    } catch (err) {
        // Axios 에러 객체에서 서버가 보낸 에러 메시지를 추출합니다.
        // 만약 서버 메시지가 없으면, 일반적인 네트워크 오류 메시지를 사용합니다.
        const errorMessage = err.response?.data?.message || "목록을 불러오는 중 오류가 발생했습니다.";

        // 개발자를 위해 콘솔에 상세 에러를 출력합니다.
        console.error("getContents API Error:", err);

        // 에러가 발생했음을 호출한 컴포넌트(ContentTab)에 알리기 위해 에러를 다시 던집니다.
        // 이렇게 해야 ContentTab에서도 로딩 상태를 false로 바꾸는 등의 후처리가 가능합니다.
        throw new Error(errorMessage);
    }
};

export const deleteContent = async ({ contentId, status, type }) => {
    try {
        const response = await autoRefreshCheck({
            method: 'delete',
            url: `${prefix}/contents/${contentId}`,
            // params에 status를 추가하여 쿼리 스트링으로 함께 보냅니다.
            params: { status, type }
        });
        return response.data;
    } catch (err) {
        const errorMessage = err.response?.data?.message || "항목 삭제에 실패했습니다.";
        console.error("deleteContent API Error:", err);
        throw new Error(errorMessage);
    }
};