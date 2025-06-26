import { useState } from "react";
import YouTube from "react-youtube";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";


function LazyYoutube({ videoId ,title}) {

    const [show, setShow] = useState(false);

    const handleOpen = () => setShow(true);
    const handleClose = () => setShow(false);

    return (
        <>
            {/* 썸네일 or 재생 버튼 */}
            <img
                src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                alt="Video thumbnail"
                style={{ cursor: "pointer", width: "300px" }}
                onClick={handleOpen}
            />

            {/* 모달 */}
            <Modal show={show} onHide={handleClose} size="lg" centered contentClassName="bg-dark text-light">
                <Modal.Header closeButton>
                    <Modal.Title> {title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {show && (
                        <YouTube
                            videoId={videoId}
                            opts={{
                                width: "100%",
                                height: "400",
                                playerVars: { autoplay: 1 },
                            }}
                            onEnd={(e)=>{e.target.stopVideo(0);}}
                        />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        닫기
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default LazyYoutube;