import axios from "axios";

export async function checkToken(config) {
    try {
        const token = localStorage.getItem("jwt");
        if (!token) {
            return await axios({
                ...config,
                headers: {
                    ...config.headers,
                    Authorization: null,
                }
            });
        }
        const res = await axios({
            ...config,
            headers: {
                ...config.headers,
                Authorization: token,
            },
            withCredentials: true,
        });
        return res;
    } catch (error) {
        if (error.response?.status == 401) {
            alert("AccessToken 만료됨");
            try {
                const refreshRes = await axios.post(
                    "http://localhost:8080/api/auth/refresh",
                    {},
                    {withCredentials: true}
                );

                const newToken = refreshRes.headers["authorization"];
                if (!newToken) throw new Error("재발급 실패");

                localStorage.setItem("jwt", newToken);

                // 원래 요청 다시 시도
                const retryRes = await axios({
                    ...config,
                    headers: {
                        ...config.headers,
                        Authorization: newToken,
                    },
                    withCredentials: true,
                });

                return retryRes;
            } catch (refreshError) {
                // 재발급 실패 시 처리
                localStorage.removeItem("jwt");
                alert("세션이 만료되어 자동 로그아웃 되었습니다.");
                window.location.href = "/";
                throw refreshError;
            }
        } else {
            throw error;
        }
    }
}