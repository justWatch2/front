import { useEffect, useState } from "react";
import axios from 'axios';
import { NavLink, useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Chip,
} from "@mui/material";

function Posts() {
    const navigate = useNavigate();
    const [page, setPage] = useState({
        num: 0,
        pageSize: 0,
        totalPages: 0,
        first: false,
        last: false,
    });
    const [category, setCategory] = useState("자유");
    const [posts, setPosts] = useState([]);
    const [tops, setTops] = useState([]);

    useEffect(() => {
        postToplist();
        postlist();
    }, [category, page.num]);

    function postToplist() {
        axios
            .get('/api/getTopPosts?category=' + category)
            .then((res) => {
                const newData = res.data.map((item) => ({
                    no: item.no,
                    title: item.title,
                    name: item.name,
                    indate: new Date(item.indate).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false, // 24시간제
                    }),
                    count: item.count,
                }));
                setTops(newData);
            });
    }

    function postlist() {
        axios
            .get('/api/getPosts?page=' + page.num + '&category=' + category)
            .then((response) => {
                const newData = response.data.list.content.map((item) => ({
                    no: item.no,
                    title: item.title,
                    name: item.name,
                    indate: new Date(item.indate).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false, // 24시간제
                    }),
                    count: item.count,
                }));
                setPosts(newData);
                const newPage = {
                    num: response.data.list.number,
                    pageSize: response.data.list.numberOfElements,
                    totalPages: response.data.list.totalPages,
                    first: response.data.list.first,
                    last: response.data.list.last,
                };
                setPage(newPage);
            })
            .catch((response) => console.log(response));
    }

    function Pagination() {
        const pageMap = [];
        for (let i = 0; i < page.totalPages; i++) {
            pageMap.push(i + 1);
        }
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 1 }}>
                <Button
                    variant="outlined"
                    onClick={moveToPrev}
                    disabled={page.first}
                    sx={{ color: "#ffffff", borderColor: "#ffffff" }}
                >
                    이전
                </Button>
                {pageMap.map((item, index) => (
                    <Button
                        key={index}
                        variant={page.num + 1 === item ? "contained" : "outlined"}
                        onClick={() => moveToPage(item)}
                        sx={{
                            color: "#ffffff",
                            borderColor: "#ffffff",
                            backgroundColor: page.num + 1 === item ? "#333333" : "transparent",
                        }}
                    >
                        {item}
                    </Button>
                ))}
                <Button
                    variant="outlined"
                    onClick={moveToNext}
                    disabled={page.last}
                    sx={{ color: "#ffffff", borderColor: "#ffffff" }}
                >
                    다음
                </Button>
            </Box>
        );
    }

    function Categories() {
        const categories = ['자유', '영화/드라마', '건의'];
        return (
            <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
                {categories.map((cat) => (
                    <Chip
                        key={cat}
                        label={cat}
                        clickable
                        onClick={() => setCategory(cat)}
                        color={category === cat ? "primary" : "default"}
                        sx={{
                            backgroundColor: category === cat ? "#ffffff" : "#333333",
                            color: category === cat ? "#000000" : "#ffffff",
                            fontSize: '1.2rem',
                            padding: '12px 16px',
                            height: '48px',
                            "&:hover": {
                                backgroundColor: category === cat ? "#dddddd" : "#444444",
                            },
                        }}
                    />
                ))}
            </Box>
        );
    }

    function moveToWrite() {
        navigate('/write/new');
    }

    function moveToPage(param) {
        setPage({ ...page, num: param - 1 });
    }

    function moveToPrev() {
        if (!page.first) {
            setPage({ ...page, num: page.num - 1 });
        }
    }

    function moveToNext() {
        if (!page.last) {
            setPage({ ...page, num: page.num + 1 });
        }
    }

    return (
        <Box sx={{ p: 3, backgroundColor: "#121212", minHeight: "100vh" }}>
            <Typography
                variant="h4"
                sx={{ color: "#ffffff", mb: 3, fontSize: '2.5rem', fontWeight: 'bold' }} // 글씨 크기 증가, 볼드
            >
                게시판
            </Typography>
            <Categories />
            <TableContainer component={Paper} sx={{ backgroundColor: "#1e1e1e" }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#2a2a2a", borderBottom: "2px solid #ff9999" }}>
                            <TableCell sx={{ color: "#ff9999", width: "10%", fontSize: '1.2rem', fontWeight: 'bold' }}>
                                No
                            </TableCell>
                            <TableCell sx={{ color: "#ff9999", width: "50%", fontSize: '1.2rem', fontWeight: 'bold' }}>
                                제목
                            </TableCell>
                            <TableCell sx={{ color: "#ff9999", width: "13.33%", fontSize: '1.2rem', fontWeight: 'bold' }}>
                                작성자
                            </TableCell>
                            <TableCell sx={{ color: "#ff9999", width: "13.33%", fontSize: '1.2rem', fontWeight: 'bold' }}>
                                작성일
                            </TableCell>
                            <TableCell sx={{ color: "#ff9999", width: "13.33%", fontSize: '1.2rem', fontWeight: 'bold' }}>
                                조회수
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tops.map((post, index) => (
                            <TableRow key={'top' + index} sx={{ backgroundColor: "#2a2a2a" }}>
                                <TableCell sx={{ color: "#ffffff", fontSize: '1.1rem' }}>[Top]</TableCell>
                                <TableCell sx={{ color: "#ffffff", fontSize: '1.1rem' }}>
                                    <NavLink
                                        to={`/post/${post.no}`}
                                        style={{ color: "#ffffff", textDecoration: "none", fontSize: '1.1rem' }}
                                    >
                                        {post.title}
                                    </NavLink>
                                </TableCell>
                                <TableCell sx={{ color: "#ffffff", fontSize: '1.1rem' }}>{post.name}</TableCell>
                                <TableCell sx={{ color: "#ffffff", fontSize: '1.1rem' }}>{post.indate}</TableCell>
                                <TableCell sx={{ color: "#ffffff", fontSize: '1.1rem' }}>{post.count}</TableCell>
                            </TableRow>
                        ))}
                        {posts.map((post, index) => (
                            <TableRow key={index}>
                                <TableCell sx={{ color: "#ffffff", fontSize: '1.1rem' }}>{post.no}</TableCell>
                                <TableCell sx={{ color: "#ffffff", fontSize: '1.1rem' }}>
                                    <NavLink
                                        to={`/post/${post.no}`}
                                        style={{ color: "#ffffff", textDecoration: "none", fontSize: '1.1rem' }}
                                    >
                                        {post.title}
                                    </NavLink>
                                </TableCell>
                                <TableCell sx={{ color: "#ffffff", fontSize: '1.1rem' }}>{post.name}</TableCell>
                                <TableCell sx={{ color: "#ffffff", fontSize: '1.1rem' }}>{post.indate}</TableCell>
                                <TableCell sx={{ color: "#ffffff", fontSize: '1.1rem' }}>{post.count}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Pagination />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                    variant="contained"
                    onClick={moveToWrite}
                    sx={{ backgroundColor: "#333333", color: "#ffffff" }}
                >
                    글쓰기
                </Button>
            </Box>
        </Box>
    );
}

export default Posts;