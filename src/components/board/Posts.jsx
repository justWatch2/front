import {useEffect, useState} from "react";
import axios from 'axios';
import {NavLink, useNavigate, useParams} from "react-router-dom";
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
    Chip,
    Typography,
} from "@mui/material";

function Posts() {
    const {cat} = useParams();
    const navigate = useNavigate();
    const [page, setPage] = useState({
        num: 0,
        pageSize: 0,
        totalPages: 0,
        first: false,
        last: false,
    });
    const [category, setCategory] = useState(cat);
    const [posts, setPosts] = useState([]);
    const [tops, setTops] = useState([]);

    useEffect(() => {
        console.log("Category:", cat);
        postToplist();
        postlist();
    }, [category, page.num]);

    function postToplist() {
        axios
            .get(`/api/non-member/getTopPosts?category=${category}`)
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
                        hour12: false,
                    }),
                    count: item.count,
                }));
                setTops(newData);
            });
    }

    function postlist() {
        axios
            .get(`/api/non-member/getPosts?page=${page.num}&category=${category}`)
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
                        hour12: false,
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
                console.log("Page state updated:", newPage);
                setPage(newPage);
            })
            .catch((error) => console.error("Error fetching posts:", error));
    }

    function Pagination() {
        const pageMap = [];
        for (let i = 0; i < page.totalPages; i++) {
            pageMap.push(i + 1);
        }
        return (
            <Box sx={{display: "flex", justifyContent: "center", mt: 2, gap: 1}}>
                <Button
                    variant="outlined"
                    onClick={moveToPrev}
                    disabled={page.first}
                    sx={{
                        color: "#ffffff",
                        borderColor: "#ffffff",
                        '&.Mui-disabled': {color: "#888888", borderColor: "#888888", opacity: 0.6},
                    }}
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
                    sx={{
                        color: "#ffffff",
                        borderColor: "#ffffff",
                        '&.Mui-disabled': {color: "#888888", borderColor: "#888888", opacity: 0.6},
                    }}
                >
                    다음
                </Button>
            </Box>
        );
    }

    function Categories() {
        const categories = [
            {name: '자유', value: 'common'},
            {name: '영화/드라마', value: 'md'},
            {name: '건의', value: 'sug'},
        ];

        return (
            <Box sx={{display: "flex", gap: 1.5, mb: 2}}>
                {categories.map((cat, index) => (
                    <Chip
                        key={index}
                        label={cat.name}
                        clickable
                        onClick={() => setCategory(cat.value)}
                        color={category === cat.value ? "primary" : "default"}
                        sx={{
                            backgroundColor: category === cat.value ? "#ffffff" : "#2e2e2e",
                            color: category === cat.value ? "#000000" : "#ffffff",
                            fontSize: '1.1rem',
                            padding: '12px 12px',
                            fontWeight: "bold",
                            height: '40px',
                            borderRadius: '4px',
                            border: '1px solid #1e1e1e',
                            "&:hover": {
                                backgroundColor: category === cat.value ? "#dddddd" : "#1a1a1a",
                            },
                        }}
                    />
                ))}
            </Box>
        );
    }

    function moveToWrite() {
        const token = localStorage.getItem("jwt");
        if (!token) {
            alert("로그인해주세요");
            return null;
        }
        navigate('/write/new');
    }

    function moveToPage(param) {
        setPage({...page, num: param - 1});
    }

    function moveToPrev() {
        if (!page.first) {
            setPage({...page, num: page.num - 1});
        }
    }

    function moveToNext() {
        if (!page.last) {
            setPage({...page, num: page.num + 1});
        }
    }

    const categoryNames = {
        common: '자유',
        md: '영화/드라마',
        sug: '건의',
    };

    return (
        <Box
            sx={{
                p: 3,
                // backgroundColor: "#000000",
                minHeight: "100vh",
                width: "80%",
                mx: "auto",
                color: "#ffffff",
            }}
        >
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                border: '2px solid #ffffff',
                mb: 2,
                borderRadius: '4px'
            }}>
                <Typography variant="h4" sx={{color: "#ffffff", padding: '10px', display: 'inline-block'}}>
                    {categoryNames[category || 'common']}게시판
                </Typography>
            </Box>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0}}>
                <Categories/>
                <Button
                    variant="contained"
                    onClick={moveToWrite}
                    sx={{
                        backgroundColor: "#2e2e2e",
                        color: "#ffffff",
                        fontSize: '0.9rem',
                        padding: '12px 16px',
                        height: '40px',
                        border: '1px solid #1e1e1e',
                        mr: 0,
                        "&:hover": {
                            backgroundColor: "#1a1a1a",
                        },
                    }}>
                    글쓰기
                </Button>
            </Box>
            <TableContainer component={Paper} sx={{
                backgroundColor: "#000000",
                width: "100%",
                borderRadius: '4px',
                border: '1px solid #ffffff'

            }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{
                            backgroundColor: "#000000",
                            borderBottom: "2px solid #ffffff",
                            borderRadius: '4px 4px 0 0'
                        }}>
                            <TableCell sx={{
                                color: "#ffffff",
                                width: "10%",
                                fontSize: '1.2rem',
                                fontWeight: 'bold'
                            }}>No</TableCell>
                            <TableCell sx={{
                                color: "#ffffff",
                                width: "50%",
                                fontSize: '1.2rem',
                                fontWeight: 'bold'
                            }}>제목</TableCell>
                            <TableCell sx={{
                                color: "#ffffff",
                                width: "13.33%",
                                fontSize: '1.2rem',
                                fontWeight: 'bold'
                            }}>작성자</TableCell>
                            <TableCell sx={{
                                color: "#ffffff",
                                width: "13.33%",
                                fontSize: '1.2rem',
                                fontWeight: 'bold'
                            }}>작성일</TableCell>
                            <TableCell sx={{
                                color: "#ffffff",
                                width: "13.33%",
                                fontSize: '1.2rem',
                                fontWeight: 'bold'
                            }}>조회수</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tops.map((post, index) => (
                            <TableRow key={'top' + index}
                                      sx={{backgroundColor: "#292929", borderTop: '2px solid #ffffff'}}>
                                <TableCell sx={{color: "#f44336", fontWeight: 'bold'}}>[Top]</TableCell>
                                <TableCell sx={{color: "#ffffff", fontWeight: 'bold'}}>
                                    <NavLink to={`/post/${post.no}`} style={{color: "#ffffff", textDecoration: "none"}}>
                                        {post.title}
                                    </NavLink>
                                </TableCell>
                                <TableCell sx={{color: "#ffffff", fontWeight: 'bold'}}>{post.name}</TableCell>
                                <TableCell sx={{color: "#ffffff", fontWeight: 'bold'}}>{post.indate}</TableCell>
                                <TableCell sx={{color: "#ffffff", fontWeight: 'bold'}}>{post.count}</TableCell>
                            </TableRow>
                        ))}
                        {posts.map((post, index) => (
                            <TableRow key={index} sx={{backgroundColor: "#3e3e3e"}}>
                                <TableCell sx={{color: "#ffffff"}}>{post.no}</TableCell>
                                <TableCell sx={{color: "#ffffff"}}>
                                    <NavLink to={`/post/${post.no}`} style={{color: "#ffffff", textDecoration: "none"}}>
                                        {post.title}
                                    </NavLink>
                                </TableCell>
                                <TableCell sx={{color: "#ffffff"}}>{post.name}</TableCell>
                                <TableCell sx={{color: "#ffffff"}}>{post.indate}</TableCell>
                                <TableCell sx={{color: "#ffffff"}}>{post.count}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Pagination/>
        </Box>
    );
}

export default Posts;