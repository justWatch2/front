import React from "react";
import { autoRefreshCheck } from "../../tokenUtils/TokenUtils";
import { API_BASE_URL } from "../../config/api";

const InviteAcceptModal = ({ invites, onAccept, onClose }) => {

    // ?섎씫 泥섎━
    const handleAccept = async (uuid, key) => {
        try {
            const response = await autoRefreshCheck({
                url: `${API_BASE_URL}/api/friend/invite`, // ?ㅼ젣 ?섎씫 URL
                method: "POST",
                data: { uuid },
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200) {
                alert("移쒓뎄 異붽? ?깃났!");
                localStorage.removeItem(key);

                //?깃났?쒗썑???쒕쾭???덈뵒??吏?곕씪怨??덊븳?댁쑀
                // ?댁감??TTl 1?쒓컙?쇰줈 ?섏뼱 ?덇퀬
                // ?ㅼ떆 留곹겕 ?怨??덊럹?댁? ?ㅼ뼱????대? 移쒓뎄媛 ?섏뼱 ?덉뼱???대?移쒓뎄?쇨퀬 ?щ떎
                onAccept(key);
            } else {
                alert("移쒓뎄 異붽? ?ㅽ뙣");
            }
        } catch (error) {
            if (error.response?.status === 406) {
                if (error.response.data === "reject_uuid"){
                    alert("移쒓뎄珥덈?瑜??대? 嫄곕???珥덈?留곹겕?낅땲??")
                }else{
                    alert("?대? 移쒓뎄?낅땲??");
                }
                localStorage.removeItem(key);
                onAccept(key);
            } else {
                alert("?먮윭媛 諛쒖깮?덉뒿?덈떎.");
            }
        }
    };

    // 嫄곗젅 泥섎━
    const handleReject = async (uuid, key) => {
        try {
            const response = await autoRefreshCheck({
                url: `${API_BASE_URL}/api/friend/reject`,
                method: "POST",
                data: { uuid },
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200) {
                alert("珥덈? 嫄곗젅 ?꾨즺");
                localStorage.removeItem(key);
                onAccept(key); // 由ъ뒪?몄뿉?쒕룄 ?쒓굅
            } else {
                alert("嫄곗젅 ?붿껌 ?ㅽ뙣");
            }
        } catch (error) {
            alert("嫄곗젅 泥섎━ 以??먮윭 諛쒖깮");
            console.error(error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>移쒓뎄 ?붿껌 ?섎씫</h3>
                {invites.map((invite) => (
                    <div key={invite.key} style={{ marginBottom: "10px" }}>
                        <p>
                            <strong>{invite.nickname}</strong>?섏씠 移쒓뎄 ?붿껌??蹂대깉?듬땲?? 
                        </p>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button onClick={() => handleAccept(invite.uuid, invite.key)}>?섎씫</button>
                            <button onClick={() => handleReject(invite.uuid, invite.key)}>嫄곗젅</button>
                        </div>
                    </div>
                ))}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                    <button onClick={onClose}>?リ린</button>
                </div>
            </div>
        </div>
    );
};

export default InviteAcceptModal;
