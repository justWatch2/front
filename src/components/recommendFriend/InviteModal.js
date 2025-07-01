import React from "react";
import { autoRefreshCheck } from "../../tokenUtils/TokenUtils";

const InviteAcceptModal = ({ invites, onAccept, onClose }) => {

    // 수락 처리
    const handleAccept = async (uuid, key) => {
        try {
            const response = await autoRefreshCheck({
                url: "http://localhost:8080/api/friend/invite", // 실제 수락 URL
                method: "POST",
                data: { uuid },
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200) {
                alert("친구 추가 성공!");
                localStorage.removeItem(key);
                onAccept(key);
            } else {
                alert("친구 추가 실패");
            }
        } catch (error) {
            if (error.response?.status === 406) {
                if (error.response.data === "reject_uuid"){
                    alert("친구초대를 이미 거부한 초대링크입니다.")
                }else{
                    alert("이미 친구입니다!");
                }
                localStorage.removeItem(key);
                onAccept(key);
            } else {
                alert("에러가 발생했습니다.");
            }
        }
    };

    // 거절 처리
    const handleReject = async (uuid, key) => {
        try {
            const response = await autoRefreshCheck({
                url: "http://localhost:8080/api/friend/reject",
                method: "POST",
                data: { uuid },
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200) {
                alert("초대 거절 완료");
                localStorage.removeItem(key);
                onAccept(key); // 리스트에서도 제거
            } else {
                alert("거절 요청 실패");
            }
        } catch (error) {
            alert("거절 처리 중 에러 발생");
            console.error(error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>친구 요청 수락</h3>
                {invites.map((invite) => (
                    <div key={invite.key} style={{ marginBottom: "10px" }}>
                        <p>
                            <strong>{invite.nickname}</strong>님이 친구 요청을 보냈습니다.
                        </p>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button onClick={() => handleAccept(invite.uuid, invite.key)}>수락</button>
                            <button onClick={() => handleReject(invite.uuid, invite.key)}>거절</button>
                        </div>
                    </div>
                ))}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                    <button onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    );
};

export default InviteAcceptModal;
