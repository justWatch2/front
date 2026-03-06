import React, { useEffect } from "react";
import { autoRefreshCheck } from "../../tokenUtils/TokenUtils";
import { API_BASE_URL } from "../../config/api";

const KakaoInviteButton = () => {
    useEffect(() => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
            window.Kakao.init("af78237451dac157719c9585af264c58"); // ?먯떊??JavaScript ???낅젰
            console.log("Kakao SDK initialized");
        }

    }, []);

    const sendInviteLink = async () => {
        if (!window.Kakao) {
            alert("移댁뭅??SDK媛 濡쒕뱶?섏? ?딆븯?듬땲??");
            return;
        }

        //?ш린???쒕쾭濡?蹂대궡湲?
        const res = await autoRefreshCheck({
            method: "post",
            url: `${API_BASE_URL}/api/invite/create`, // ?쒕쾭 API 二쇱냼
        });

        if (res == null){
            return ;
        }
        alert(res.data);
        const inviteUrl = res.data; // ?쒕쾭媛 諛섑솚??UUID 留곹겕

        window.Kakao.Link.sendDefault({
            objectType: "feed",
            content: {
                title: "移쒓뎄異붽? ?붿껌?낅땲??! ?댁긽?쒓굅 ?꾨떃?덈떎 ?ㅽ렓?꾨땲?먯슂 ",
                description: "珥덈??먭? 移쒓뎄異붽?瑜??먰빀?덈떎 濡쒓렇?명빐二쇱꽭??! ",
                imageUrl: "https://gyu0918.github.io/shareImage/ProfileLogo.png",
                link: {
                    mobileWebUrl: inviteUrl,
                    webUrl: inviteUrl,
                },
            },
            buttons: [
                {
                    title: "珥덈? 留곹겕 ?닿린",
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
            移쒓뎄 珥덈?
        </button>
    );
};

export default KakaoInviteButton;
