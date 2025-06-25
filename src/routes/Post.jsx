import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Field, Form, Formik } from "formik";
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

function Post() {
    const navigate = useNavigate();
    const { postNo } = useParams();
    const [post, setPost] = useState({
        title: "",
        category: "",
        name: "",
        contents: "",
        count: 0,
        indate: "",
        fileUrl: [],
    });
    const [likeCount, setLikeCount] = useState({
        flag: false,
        count: 0,
    });
    const [replys, setReplys] = useState([]);

    useEffect(() => {
        axios
            .get(`/api/getPost?no=${postNo}&id=1111`)
            .then((res) => {
                console.log(res.data.replys);
                const newPost = {
                    title: res.data.post.title,
                    category: res.data.post.category,
                    name: res.data.post.name,
                    contents: res.data.post.contents,
                    count: res.data.post.count,
                    indate: new Date(res.data.post.indate).toLocaleString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                    }),
                    fileUrl: res.data.post.fileUrllist,
                };
                setPost(newPost);
                setLikeCount({ flag: res.data.likePost, count: res.data.post.likeCount });
                const updatedReplys = res.data.replys.map((rep) => ({
                    ...rep,
                    likeFlag: rep.liked,
                }));
                setReplys(updatedReplys);
            })
            .catch((err) => console.log(err));
    }, [postNo]);

    function updateReplys() {
        axios
            .get(`/api/getReplys?no=${postNo}`)
            .then((res) => {
                const updatedReplys = res.data.map((rep) => ({
                    ...rep,
                    likeFlag: rep.liked,
                }));
                setReplys(updatedReplys);
            })
            .catch((err) => console.log(err));
    }

    function handleReplyLike(replyNum, currentFlag) {
        const formData = new FormData();
        formData.append("replyNo", replyNum);
        formData.append("param", !currentFlag);
        formData.append("memberId", "1111");
        console.log("currentFlag"+ !currentFlag);

        axios
            .put("/api/likeReply", formData)
            .then((res) => {
                if (res.data === "success") {
                    setReplys(
                        replys.map((rep) =>
                            rep.num === replyNum
                                ? {
                                    ...rep,
                                    likeFlag: !currentFlag,
                                    likeCount: currentFlag ? rep.likeCount - 1 : rep.likeCount + 1,
                                }
                                : rep
                        )
                    );
                } else {
                    alert(res.data);
                }
            })
            .catch((err) => console.log(err));
    }

    function ReplyReturn() {
        return (
            <Box sx={{ mt: 3 }}>
                <Typography
                    variant="h6"
                    sx={{ color: "#ffffff", fontSize: "1.5rem", fontWeight: "bold", mb: 1 }}
                >
                    댓글
                </Typography>
                <List sx={{ backgroundColor: "#1e1e1e", borderRadius: "4px" }}>
                    {replys.map((rep, index) => (
                        <Box key={index}>
                            <ListItem>
                                <ListItemText
                                    primary={
                                        <Typography sx={{ color: "#ffffff", fontSize: "1.1rem" }}>
                                            {rep.num} - {rep.name} - {rep.contents}
                                        </Typography>
                                    }
                                    secondary={
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Typography sx={{ color: "#bbbbbb", fontSize: "1rem" }}>
                                                {new Date(rep.time).toLocaleString("ko-KR", {
                                                    year: "numeric",
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    second: "2-digit",
                                                    hour12: false,
                                                })}
                                            </Typography>
                                            <IconButton
                                                onClick={() => handleReplyLike(rep.num, rep.likeFlag)}
                                                sx={{ color: rep.likeFlag ? "#ff9999" : "#ffffff", padding: 0 }}
                                            >
                                                <ThumbUpIcon sx={{ fontSize: "1rem" }} />
                                                <Typography sx={{ ml: 0.5, fontSize: "1rem", color: "#bbbbbb" }}>
                                                    {rep.likeCount}
                                                </Typography>
                                            </IconButton>
                                        </Box>
                                    }
                                />
                            </ListItem>
                            {index < replys.length - 1 && <Divider sx={{ backgroundColor: "#333333" }} />}
                        </Box>
                    ))}
                </List>
            </Box>
        );
    }

    function Reply({ id }) {
        return (
            <Box sx={{ mt: 3 }}>
                <Typography
                    variant="h6"
                    sx={{ color: "#ffffff", fontSize: "1.5rem", fontWeight: "bold", mb: 1 }}
                >
                    댓글 작성
                </Typography>
                <Formik
                    initialValues={{
                        postNo: postNo,
                        name: id,
                        contents: "",
                    }}
                    validate={(values) => {
                        const errors = {};
                        if (!values.contents) {
                            errors.contents = "내용을 입력하세요";
                        }
                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        setSubmitting(true);
                        const formData = new FormData();
                        formData.append("postNo", values.postNo);
                        formData.append("name", values.name);
                        formData.append("contents", values.contents);
                        axios
                            .post("/api/saveReply", formData)
                            .then((res) => {
                                alert(res.data);
                                updateReplys();
                                resetForm();
                            })
                            .catch((err) => {
                                alert(err);
                            })
                            .finally(() => {
                                setSubmitting(false);
                            });
                    }}
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Form>
                            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                                <Field name="name">
                                    {({ field }) => (
                                        <TextField
                                            {...field}
                                            label="작성자"
                                            value={id}
                                            InputProps={{ readOnly: true }}
                                            variant="outlined"
                                            InputLabelProps={{ shrink: true }}
                                            sx={{
                                                width: "150px",
                                                "& .MuiInputBase-input": { color: "#ffffff", fontSize: "1.1rem" },
                                                "& .MuiInputLabel-root": { color: "#bbbbbb", fontSize: "1.2rem" },
                                                "& .MuiOutlinedInput-root": {
                                                    "& fieldset": { borderColor: "#ffffff" },
                                                    "&:hover fieldset": { borderColor: "#dddddd" },
                                                },
                                            }}
                                        />
                                    )}
                                </Field>
                                <Field name="contents">
                                    {({ field }) => (
                                        <TextField
                                            {...field}
                                            label="댓글 내용"
                                            multiline
                                            rows={1}
                                            error={touched.contents && !!errors.contents}
                                            helperText={touched.contents && errors.contents}
                                            variant="outlined"
                                            InputLabelProps={{ shrink: true }}
                                            sx={{
                                                flexGrow: 1,
                                                "& .MuiInputBase-input": { color: "#ffffff", fontSize: "1.1rem" },
                                                "& .MuiInputLabel-root": { color: "#bbbbbb", fontSize: "1.2rem" },
                                                "& .MuiOutlinedInput-root": {
                                                    "& fieldset": { borderColor: "#ffffff" },
                                                    "&:hover fieldset": { borderColor: "#dddddd" },
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
                                        height: "56px",
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

    function updateLikeCountPost(b) {
        const formData = new FormData();
        formData.append("postNo", postNo);
        formData.append("param", b);
        formData.append("memberId", "1111");

        axios
            .put("/api/likePost", formData)
            .then((res) => {
                if (res.data === "success") {
                    setLikeCount({
                        flag: !likeCount.flag,
                        count: likeCount.flag ? likeCount.count - 1 : likeCount.count + 1,
                    });
                } else {
                    alert(res.data);
                }
            })
            .catch((err) => console.log(err));
    }

    function HandlerPostEdit() {
        if ("1111" === post.name) {
            return (
                <Button
                    variant="outlined"
                    sx={{ color: "#ffffff", borderColor: "#ffffff", fontSize: "1.1rem" }}
                >
                    <NavLink
                        to={`/write/${postNo}`}
                        state={{ postDetail: post }}
                        style={{ color: "#ffffff", textDecoration: "none" }}
                    >
                        글 수정
                    </NavLink>
                </Button>
            );
        }
        return null;
    }

    return (
        <Box sx={{ p: 3, backgroundColor: "#121212", minHeight: "100vh" }}>
            <Typography
                variant="h4"
                sx={{ color: "#ffffff", fontSize: "2.5rem", fontWeight: "bold", mb: 1 }}
            >
                글 상세
            </Typography>
            <Typography
                sx={{ color: "#bbbbbb", fontSize: "1rem", mb: 2 }}
            >
                게시판 &gt; {post.category}
            </Typography>
            <Box
                component={Paper}
                sx={{ p: 2, backgroundColor: "#1e1e1e", borderRadius: "4px", mb: 3 }}
            >
                <Typography sx={{ color: "#ff9999", fontSize: "1.5rem", fontWeight: "bold" }}>
                    {post.title}
                </Typography>
                <Box sx={{ mt: 1, display: "flex", gap: 2, color: "#ffffff", fontSize: "1.2rem" }}>
                    {/*<Typography sx={{ fontSize: "1.2rem" }}>카테고리: {post.category}</Typography>*/}
                    <Typography sx={{ fontSize: "1.2rem" }}>작성자: {post.name}</Typography>
                    <Typography sx={{ fontSize: "1.2rem" }}>작성일: {post.indate}</Typography>
                    <Typography sx={{ fontSize: "1.2rem" }}>조회수: {post.count}</Typography>
                </Box>
                <Typography sx={{ mt: 2, color: "#ffffff", fontSize: "1.1rem" }}>
                    {post.contents}
                </Typography>
                {/* {post.fileUrl.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <img
              src={`/api/download?filename=${post.fileUrl[0]}`}
              alt="첨부 이미지"
              style={{ maxWidth: "100%", borderRadius: "4px" }}
            />
          </Box>
        )} */}
            </Box>
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <IconButton
                    onClick={() => updateLikeCountPost(!likeCount.flag)}
                    sx={{ color: likeCount.flag ? "#ff9999" : "#ffffff" }}
                >
                    <ThumbUpIcon />
                    <Typography sx={{ ml: 1, fontSize: "1.1rem" }}>{likeCount.count}</Typography>
                </IconButton>
                <HandlerPostEdit />
            </Box>
            <ReplyReturn />
            <Reply id="1111" />
        </Box>
    );
}

export default Post;