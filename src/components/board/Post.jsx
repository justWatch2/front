import {useEffect, useState} from "react";
import axios from "axios";
import {NavLink, useNavigate, useParams} from "react-router-dom";
import {Field, Form, Formik} from "formik";
import {
    Box,
    Button,
    Typography,
    TextField,
    List,
    ListItem,
    ListItemText,
    Divider,
    IconButton,
    Paper,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import {checkToken} from "../../tokenUtils/TokenUtil4Post";

// key2 브랜치

function Post() {
    const navigate = useNavigate();
    const {postNo} = useParams();
    const [id, setId] = useState(null);
    const [name, setName] = useState(null);
    const [categoryName, setCategoryName] = useState("");
    const [post, setPost] = useState({
        title: "",
        category: "",
        id: "",
        name: "",
        contents: "",
        count: 0,
        indate: "",
        fileUrl: [],
    });
    const [likeCount, setLikeCount] = useState({flag: false, count: 0});
    const [replys, setReplys] = useState([]);

    function handleCategoryName(contents) {
        const cat = {
            common: "자유",
            md: "영화/드라마",
            sug: "건의",
        }
        setCategoryName(cat[contents]);
    }

    useEffect(() => {
        checkToken({
            method: "get",
            url: `/api/non-member/getPost?no=${postNo}`
        })
            .then((res) => {
                const newPost = {
                    title: res.data.post.title,
                    category: res.data.post.category,
                    id: res.data.post.id,
                    name: res.data.post.name,
                    contents: res.data.post.contents,
                    count: res.data.post.count,
                    indate: new Date(res.data.post.indate).toLocaleString("ko-KR", {
                        year: "numeric", month: "2-digit", day: "2-digit",
                        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
                    }),
                    fileUrl: res.data.post.fileUrllist || [],
                };
                setPost(newPost);
                setLikeCount({flag: res.data.likePost, count: res.data.post.likeCount});
                const updatedReplys = res.data.replys.map((rep) => ({
                    ...rep, likeFlag: rep.liked,
                }));
                setReplys(updatedReplys);
                setId(res.data.id);
                setName(res.data.name);
                handleCategoryName(res.data.post.category);
            })
            .catch((err) => console.log(err));
    }, [postNo]);

    function updateReplys() {
        axios.get(`/api/non-member/getReplys?no=${postNo}`)
            .then((res) => {
                const updatedReplys = res.data.map((rep) => ({
                    ...rep, likeFlag: rep.liked,
                }));
                setReplys(updatedReplys);
            })
            .catch((err) => console.log(err));
    }

    function handleReplyLike(replyNum, currentFlag) {
        if (id === "none") {
            alert("로그인이 필요한 기능입니다.");
            return;
        }
        const formData = new FormData();
        formData.append("replyNo", replyNum);
        formData.append("param", !currentFlag);
        formData.append("memberId", id);
        checkToken({
            method: "put",
            url: "/api/likeReply",
            data: formData,
        }).then((res) => {
            if (res.data === "success") {
                setReplys(replys.map((rep) =>
                    rep.num === replyNum ? {
                        ...rep,
                        likeFlag: !currentFlag,
                        likeCount: currentFlag ? rep.likeCount - 1 : rep.likeCount + 1
                    } : rep
                ));
            } else {
                alert(res.data);
            }
        }).catch(console.log);
    }

    function updateLikeCountPost(b) {
        if (id === "none") {
            alert("로그인이 필요한 기능입니다.");
            return;
        }
        const formData = new FormData();
        formData.append("postNo", postNo);
        formData.append("param", b);
        formData.append("memberId", id);
        checkToken({
            method: "put",
            url: "/api/likePost",
            data: formData,
        }).then((res) => {
            if (res.data === "success") {
                setLikeCount({
                    flag: !likeCount.flag,
                    count: likeCount.flag ? likeCount.count - 1 : likeCount.count + 1,
                });
            } else {
                alert(res.data);
            }
        }).catch(console.log);
    }

    function HandlerPostEdit() {
        if (id === post.id) {
            return (
                <Button variant="outlined" sx={{
                    color: "#ffffff",
                    borderColor: "#ffffff",
                    fontSize: "1.1rem",
                    '&:hover': {
                        backgroundColor: "#ffffff !important",
                        color: "#000000 !important",
                        borderColor: "#ffffff !important",
                        '& a': {
                            color: "#000000 !important",
                        },
                    },
                }}>
                    <NavLink to={`/write/${postNo}`} state={{postDetail: post}}
                             style={{color: "#ffffff", textDecoration: "none",}}>
                        글 수정
                    </NavLink>
                </Button>
            );
        }
        return null;
    }

    function ReplyReturn() {
        if (replys != null && replys.length > 0) {
            return (
                <Box sx={{mt: 3}}>

                    <List sx={{backgroundColor: "#1e1e1e", borderRadius: "4px", border: "1px solid #ffffff", p: 2}}>
                        {replys.map((rep, index) => (
                            <Box key={index} sx={{mb: 2, '&:last-child': {mb: 0}}}>
                                <Box sx={{display: "flex", gap: 2, mb: 1, alignItems: "flex-start"}}>
                                    <Box>
                                        <Typography sx={{color: "#ffffff", fontSize: "1.2rem", fontWeight: "bold"}}>
                                            {rep.name}
                                        </Typography>
                                    </Box>
                                    <Divider orientation="vertical" flexItem sx={{
                                        borderWidth: 1,
                                        borderStyle: "solid",
                                        borderColor: "#6e6e6e",
                                        height: "auto"
                                    }}/>
                                    <Box>
                                        <Typography sx={{
                                            color: "#ffffff",
                                            fontSize: "1.1rem",
                                            whiteSpace: "pre-wrap",
                                            flexGrow: 1
                                        }}>
                                            {rep.contents}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{display: "flex", alignItems: "center", gap: 1, ml: 2}}>
                                    <Typography sx={{color: "#bbbbbb", fontSize: "0.9rem"}}>
                                        {new Date(rep.time).toLocaleString("ko-KR", {
                                            year: "numeric", month: "2-digit", day: "2-digit",
                                            hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
                                        })}
                                    </Typography>
                                    <IconButton
                                        onClick={() => handleReplyLike(rep.num, rep.likeFlag)}
                                        sx={{color: rep.likeFlag ? "#ff9999" : "#ffffff", padding: 0}}
                                    >
                                        <ThumbUpIcon sx={{fontSize: "1rem"}}/>
                                        <Typography sx={{ml: 0.5, fontSize: "0.9rem", color: "#bbbbbb"}}>
                                            {rep.likeCount}
                                        </Typography>
                                    </IconButton>
                                </Box>
                                {index < replys.length - 1 && <Divider sx={{backgroundColor: "#5e5e5e", my: 2}}/>}
                            </Box>
                        ))}
                    </List>
                </Box>
            );
        }
        return null;
    }

    function Reply({id, name}) {
        return (
            <Box sx={{mt: 3}}>
                {/*<Typography variant="h6" sx={{ color: "#ffffff", fontSize: "1.5rem", fontWeight: "bold", mb: 1 }}>*/}
                {/*    댓글 작성*/}
                {/*</Typography>*/}
                <Formik
                    initialValues={{postNo, id: id, contents: "", name: name}}
                    validate={(values) => {
                        const errors = {};
                        if (!values.contents) errors.contents = "내용을 입력하세요";
                        return errors;
                    }}
                    onSubmit={(values, {setSubmitting, resetForm}) => {
                        setSubmitting(true);
                        const formData = new FormData();
                        formData.append("postNo", values.postNo);
                        formData.append("id", values.id);
                        formData.append("contents", values.contents);
                        checkToken({
                            method: 'post',
                            url: '/api/saveReply',
                            data: formData
                        }).then((res) => {
                            alert(res.data);
                            updateReplys();
                            resetForm();
                        }).catch((err) => alert(err)).finally(() => setSubmitting(false));
                    }}
                >
                    {({errors, touched, isSubmitting}) => (
                        <Form>
                            <Box sx={{display: "flex", gap: 2, alignItems: "flex-start"}}>
                                <Field name="name">
                                    {({field}) => (
                                        <TextField
                                            {...field}
                                            label="작성자"
                                            value={name === "noName"? "":name}
                                            InputProps={{readOnly: true}}
                                            variant="outlined"
                                            InputLabelProps={{shrink: true}}
                                            sx={{
                                                width: "150px",
                                                "& .MuiInputBase-input": {color: "#ffffff", fontSize: "1.1rem"},
                                                "& .MuiInputLabel-root": {color: "#ffffff", fontSize: "1.2rem"},
                                                "& .MuiOutlinedInput-root": {
                                                    "& fieldset": {borderColor: "#ffffff"},
                                                    "&:hover fieldset": {borderColor: "#dddddd"},
                                                },
                                            }}
                                        />
                                    )}
                                </Field>
                                <Field name="contents">
                                    {({field}) => (
                                        <TextField
                                            {...field}
                                            label="댓글 내용"
                                            multiline
                                            rows={1}
                                            error={touched.contents && !!errors.contents}
                                            helperText={touched.contents && errors.contents}
                                            variant="outlined"
                                            InputLabelProps={{shrink: true}}
                                            sx={{
                                                flexGrow: 1,
                                                "& .MuiInputBase-input": {color: "#ffffff", fontSize: "1.1rem"},
                                                "& .MuiInputLabel-root": {color: "#bbbbbb", fontSize: "1.2rem"},
                                                "& .MuiOutlinedInput-root": {
                                                    "& fieldset": {borderColor: "#ffffff"},
                                                    "&:hover fieldset": {borderColor: "#dddddd"},
                                                },
                                            }}
                                        />
                                    )}
                                </Field>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isSubmitting}
                                    sx={{
                                        backgroundColor: "#333333",
                                        color: "#ffffff",
                                        fontSize: "1.2rem",
                                        height: "56px",
                                        '&:hover': {
                                            backgroundColor: "#ffffff",
                                            color: "#000000",
                                        }
                                    }}
                                >
                                    등록
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>
        );
    }

    return (
        <Box sx={{
            p: 3, minHeight: "100vh",
            width: "80%",
            mx: "auto",
            color: "#ffffff",
        }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                border: '2px solid #ffffff',
                mb: 2,
                borderRadius: '4px'
            }}>
                <Typography variant="h4" sx={{color: "#ffffff", padding: '10px', display: 'inline-block'}}>
                    {categoryName}게시판
                </Typography>
            </Box>
            <Paper
                elevation={0}
                sx={{
                    backgroundColor: "#1e1e1e",
                    border: "1px solid #ffffff",
                    borderRadius: "4px",
                    p: 3,
                    mb: 3,
                }}
            >
                <Typography sx={{color: "#bbbbbb", fontSize: "1rem", mb: 2}}>
                    게시판 &gt; {categoryName}
                </Typography>
                <Typography sx={{fontSize: "1.8rem", fontWeight: "bold", color: "#ffffff", mb: 2}}>
                    {post.title}
                </Typography>
                <Box sx={{display: "flex", gap: 3, mb: 1, fontSize: "1.1rem", color: "#ffffff"}}>
                    <Typography>작성자: {post.name}</Typography>
                    <Typography>작성일: {post.indate}</Typography>
                    <Typography>조회수: {post.count}</Typography>
                </Box>
                <Divider sx={{backgroundColor: "#5e5e5e", my: 2}}/>
                {post.fileUrl.length > 0 && (
                    <Box sx={{mt: 2, display: 'flex', flexDirection: 'column', gap: 2}}>
                        {post.fileUrl.map((file, index) => (
                            <Box
                                key={index}
                                sx={{
                                    padding: "2px",
                                    border: "2px solid #ffffff",
                                    borderRadius: "4px",
                                    display: "inline-block",
                                    lineHeight: 0,
                                    boxSizing: "border-box",
                                    width: "fit-content",
                                    height: "fit-content",
                                }}
                            >
                                <img
                                    src={file}
                                    alt={index}
                                    style={{
                                        width: "auto",
                                        height: "auto",
                                        objectFit: "contain",
                                        display: "block",
                                        verticalAlign: "middle",
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>
                )}
                <br/>
                <Typography sx={{fontSize: "1.2rem", whiteSpace: "pre-wrap", mb: 2, color: "#ffffff"}}>
                    {post.contents}
                </Typography>

            </Paper>
            <Box sx={{display: "flex", gap: 2, mb: 3}}>
                <IconButton
                    onClick={() => updateLikeCountPost(!likeCount.flag)}
                    sx={{color: likeCount.flag ? "#ff9999" : "#ffffff"}}
                >
                    <ThumbUpIcon/>
                    <Typography sx={{ml: 1, fontSize: "1.1rem"}}>{likeCount.count}</Typography>
                </IconButton>
                <Button variant="outlined" sx={{
                    color: "#ffffff",
                    borderColor: "#ffffff",
                    fontSize: "1.1rem",
                    '&:hover': {
                        backgroundColor: "#ffffff !important",
                        color: "#000000 !important",
                        borderColor: "#ffffff !important",
                        '& a': {
                            color: "#000000 !important",
                        },
                    },
                }}>
                    <NavLink to={`/posts/${post.category}`} style={{color: "#ffffff", textDecoration: "none"}}>
                        목록
                    </NavLink>
                </Button>
                <HandlerPostEdit/>
            </Box>
            <Typography variant="h6" sx={{color: "#ffffff", fontSize: "1.5rem", fontWeight: "bold", mb: 1}}>
                댓글
            </Typography>
            <ReplyReturn/>
            <Reply id={id} name={name}/>
        </Box>
    );
}

export default Post;
