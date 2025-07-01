import React, { useEffect } from "react";
import { autoRefreshCheck } from "../../tokenUtils/TokenUtils";




const KakaoInviteButton = () => {
    useEffect(() => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
            window.Kakao.init("af78237451dac157719c9585af264c58"); // 자신의 JavaScript 키 입력
            console.log("Kakao SDK initialized");
        }

    }, []);

    const sendInviteLink = async () => {
        if (!window.Kakao) {
            alert("카카오 SDK가 로드되지 않았습니다.");
            return;
        }

        //여기서 서버로 보내기
        const res = await autoRefreshCheck({
            method: "post",
            url: "http://localhost:8080/api/invite/create", // 서버 API 주소
        });

        if (res == null){
            return ;
        }
        alert(res.data);
        const inviteUrl = res.data; // 서버가 반환한 UUID 링크

        window.Kakao.Link.sendDefault({
            objectType: "feed",
            content: {
                title: "친구추가 요청입니다!! 이상한거 아닙니다 스펨아니에요 ",
                description: "초대자가 친구추가를 원합니다 로그인해주세요!! ",
                imageUrl: "https://gyu0918.github.io/shareImage/ProfileLogo.png",
                link: {
                    mobileWebUrl: inviteUrl,
                    webUrl: inviteUrl,
                },
            },
            buttons: [
                {
                    title: "초대 링크 열기",
                    link: {
                        mobileWebUrl: inviteUrl,
                        webUrl: inviteUrl,
                    },
                },
            ],
        });
    };

    return (
        <button className="dropdown-item" onClick={sendInviteLink}>
            친구 초대
        </button>
    );
};

export default KakaoInviteButton;