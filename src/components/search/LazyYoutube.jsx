import { useState } from "react";
import YouTube from "react-youtube";
import { Modal, Box, Button, Typography } from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: 800,
  bgcolor: "#111",
  border: "2px solid #b31f2b",
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
  color: "#fff",
};

function LazyYoutube({ videoId, title }) {
  const [show, setShow] = useState(false);

  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <>
      <img
        src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
        alt="Video thumbnail"
        style={{ cursor: "pointer", width: "300px" }}
        onClick={handleOpen}
      />

      <Modal open={show} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" gutterBottom>
            {title}
          </Typography>

          <YouTube
            videoId={videoId}
            opts={{
              width: "100%",
              height: "400",
              playerVars: { autoplay: 1 },
            }}
            onEnd={(e) => e.target.stopVideo(0)}
          />

          <Box mt={3} textAlign="right">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#b31f2b",
                "&:hover": { backgroundColor: "#a61c27" },
              }}
              onClick={handleClose}
            >
              닫기
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default LazyYoutube;
