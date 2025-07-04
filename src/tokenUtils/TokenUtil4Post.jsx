import axios from "axios";

let isRefreshing = false;           // 리프레시 진행 중 여부
let refreshPromise = null;

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
        const status = error.response?.status;
        const code = error.response?.data?.code;

        if (status === 401 && code === "EXPIRED_ACCESS_TOKEN") {
            // 토큰 만료된 경우 리프레시 처리

            if (!isRefreshing) {
                alert("AccessToken 만료됨. 재발급 시도 중...");
                // 첫 번째 요청만 리프레시 시도
                isRefreshing = true;
                refreshPromise = axios.post(
                    "http://localhost:8080/api/auth/refresh",
                    {},
                    { withCredentials: true }
                )
                    .then(refreshRes => {
                        const newToken = refreshRes.headers["authorization"];
                        if (!newToken) throw new Error("재발급 실패");
                        localStorage.setItem("jwt", newToken);
                        return newToken;
                    })
                    .catch(err => {
                        localStorage.removeItem("jwt");
                        alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
                        window.location.href = "/";
                        throw err;
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
            }

            // 다른 요청들은 리프레시 완료까지 대기
                const newToken = await refreshPromise;
                // 리프레시 성공하면 원래 요청 재시도
                return await axios({
                    ...config,
                    headers: {
                        ...config.headers,
                        Authorization: newToken,
                    },
                    withCredentials: true,
                });


        } else {
            // 그 외 에러 처리
            console.log(typeof error.response.data);
            console.log(error.response.data);
            console.log("=== ERROR INFO ===");
            console.log("Status:", status);
            console.log("Code:", code);
            console.log("Data:", error.response?.data);
            console.log("Full error:", error);

            alert("인증 정보가 유효하지 않습니다.");
            // window.location.href = "/";
            throw error;
        }
    }
}