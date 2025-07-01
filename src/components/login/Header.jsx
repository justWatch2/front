import logo from "../assets/content.png";
import {Link as RouterLink} from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Modal,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {useState} from "react";
import SignUp from "../login/SignUp";

function Header() {
    const [open, setOpen] = useState(false);

    const handleModalOpen = () => setOpen(true);
    const handleModalClose = () => setOpen(false);

    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: "#121212" }}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Box component={RouterLink} to="/" sx={{ textDecoration: "none" }}>
                        <img
                            src={logo}
                            alt="로고"
                            style={{ height: "60px", width: "120px" }}
                        />
                    </Box>
                    <Typography
                        component={RouterLink}
                        to="/posts"
                        variant="h6"
                        sx={{
                            color: "#ffffff",
                            textDecoration: "none",
                            "&:hover": {
                                color: "#bbbbbb",
                            },
                        }}
                    >
                        게시판
                    </Typography>
                    <Typography
                        variant="h6"
                        onClick={handleModalOpen}
                        sx={{
                            color: "#ffffff",
                            textDecoration: "none",
                            cursor: "pointer",
                            "&:hover": {
                                color: "#bbbbbb",
                            },
                        }}
                    >
                        회원가입
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* 회원가입 모달 (Modal + Box 조합) */}
            <Modal
                open={open}
                onClose={handleModalClose}
                aria-labelledby="signup-modal"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.3)", // 어두운 반투명 배경
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        zIndex: 10,
                        outline: "none",
                    }}
                >
                    <SignUp onClose={handleModalClose} />
                </Box>
            </Modal>
        </>
    );
}

export default Header;