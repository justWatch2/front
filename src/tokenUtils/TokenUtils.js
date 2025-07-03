//
// import axios from "axios";
//
// let isRefreshing = false;           // 리프레시 진행 중 여부
// let refreshPromise = null;          // 리프레시 프로미스 공유
//
// export async function autoRefreshCheck(config) {
//     const token = localStorage.getItem("jwt");
//
//     if (!token) {
//         // alert("로그인이 필요합니다. 로그인해주세요!");
//         return null;
//     }
//
//     try {
//         // 원래 요청 시도
//         const res = await axios({
//             ...config,
//             headers: {
//                 ...config.headers,
//                 Authorization: token,
//             },
//             withCredentials: true,
//         });
//         return res;
//
//     } catch (error) {
//         const status = error.response?.status;
//         const code = error.response?.data?.code;
//
//         if (status === 401 && code === "EXPIRED_ACCESS_TOKEN") {
//             // 토큰 만료된 경우 리프레시 처리
//
//             if (!isRefreshing) {
//                 alert("AccessToken 만료됨. 재발급 시도 중...");
//                 // 첫 번째 요청만 리프레시 시도
//                 isRefreshing = true;
//                 refreshPromise = axios.post(
//                     "http://localhost:8080/api/auth/refresh",
//                     {},
//                     { withCredentials: true }
//                 )
//                     .then(refreshRes => {
//                         const newToken = refreshRes.headers["authorization"];
//                         if (!newToken) throw new Error("재발급 실패");
//                         localStorage.setItem("jwt", newToken);
//                         return newToken;
//                     })
//                     .catch(err => {
//                         localStorage.removeItem("jwt");
//                         alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
//                         window.location.href = "/";
//                         throw err;
//                     })
//                     .finally(() => {
//                         isRefreshing = false;
//                     });
//             }
//
//             // 다른 요청들은 리프레시 완료까지 대기
//             try {
//                 const newToken = await refreshPromise;
//                 // 리프레시 성공하면 원래 요청 재시도
//                 return await axios({
//                     ...config,
//                     headers: {
//                         ...config.headers,
//                         Authorization: newToken,
//                     },
//                     withCredentials: true,
//                 });
//             } catch (refreshError) {
//                 // 리프레시 실패 시 에러 전달
//                 throw refreshError;
//             }
//
//         } else {
//             // 그 외 에러 처리
//             console.log(typeof error.response.data);
//             console.log(error.response.data);
//             console.log("=== ERROR INFO ===");
//             console.log("Status:", status);
//             console.log("Code:", code);
//             console.log("Data:", error.response?.data);
//             console.log("Full error:", error);
//
//             alert("인증 정보가 유효하지 않습니다.");
//             window.location.href = "/";
//             throw error;
//         }
//     }
// }
import axios from "axios";

let isRefreshing = false;
let refreshSubscribers = [];

// 토큰 재발급 완료 후 대기 중이던 요청들 재실행
function onRefreshed(newToken) {
    refreshSubscribers.forEach(callback => callback(newToken));
    refreshSubscribers = [];
}

// 재발급이 끝날 때까지 요청을 큐에 넣기
function addRefreshSubscriber(callback) {
    refreshSubscribers.push(callback);
}

export async function autoRefreshCheck(config) {
    const token = localStorage.getItem("jwt");

    if (!token) {
        return ;
    }

    try {
        // 원래 요청 실행
        const response = await axios({
            ...config,
            headers: {
                ...config.headers,
                Authorization: token,
            },
            withCredentials: true,
        });
        return response;

    } catch (error) {
        const status = error.response?.status;
        const code = error.response?.data?.code;

        if (status === 401 && code === "EXPIRED_ACCESS_TOKEN") {
            alert("refreshToen 재발급중 .....");
            return new Promise((resolve, reject) => {
                addRefreshSubscriber(async (newToken) => {
                    try {
                        const retryResponse = await axios({
                            ...config,
                            headers: {
                                ...config.headers,
                                Authorization: newToken,
                            },
                            withCredentials: true,
                        });
                        resolve(retryResponse);
                    } catch (retryError) {
                        reject(retryError);
                    }
                });

                if (!isRefreshing) {
                    isRefreshing = true;

                    axios.post("http://localhost:8080/api/auth/refresh", {}, {
                        withCredentials: true,
                    })
                        .then((refreshRes) => {
                            const newToken = refreshRes.headers["authorization"];
                            if (!newToken) throw new Error("토큰 재발급 실패");

                            localStorage.setItem("jwt", newToken);
                            onRefreshed(newToken); // 대기 요청 모두 실행
                        })
                        .catch((refreshError) => {
                            localStorage.removeItem("jwt");
                            alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
                            refreshSubscribers.forEach(callback => callback(null));
                            refreshSubscribers = [];
                            reject(refreshError);
                        })
                        .finally(() => {
                            isRefreshing = false;
                        });
                }
            });

        } else {
            console.error(" 인증 실패 또는 기타 에러:", error.response?.data || error.message);
            throw error;
        }
    }
}

