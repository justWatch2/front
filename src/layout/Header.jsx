import logo from "../assets/content.png";
import { Link as RouterLink } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

function Header() {
    return (
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
            </Toolbar>
        </AppBar>
    );
}

export default Header;