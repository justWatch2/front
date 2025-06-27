import {useEffect, useState} from "react";
import axios from "axios";
import {NavLink, useLocation, useNavigate, useParams} from "react-router-dom";
import {Formik, Form, Field, FieldArray} from "formik";
import {
    Box,
    Button,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import {checkToken} from "../../tokenUtils/TokenUtil4Post";

function Write() {
    const {no} = useParams();
    const location = useLocation();
    const postD = location.state?.postDetail;
    const navigate = useNavigate();
    const [fileObjects, setFileObjects] = useState([]); // 실제 파일 객체 저장
    const [post, setPost] = useState({
        title: "",
        category: "선택 필수",
        name: "",
        contents: "",
        fileUrl: [], // 기존 파일과 새 파일
    });

    useEffect(() => {
        if (no !== "new" && postD) {
            const newPost = {
                title: postD.title,
                category: postD.category,
                name: postD.name,
                contents: postD.contents,
                fileUrl: postD.fileUrl.map((file) => ({
                    type: "existing",
                    url: file,
                })),
            };
            setPost(newPost);
            setFileObjects(postD.fileUrl.map(() => null));
        } else {
            checkToken({
                method: 'get',
                url: 'http://localhost:8080/api/non-member/getMemberId'
            }).then(res => {
                const newPost = {
                    title: "",
                    category: "선택 필수",
                    name: res.data.id,
                    contents: "",
                    fileUrl: [],
                }
                setPost(newPost);
            })
        }
    }, [no, postD]);

    const handleFileChange = (e, index) => {
        const newFiles = [...fileObjects];
        newFiles[index] = e.currentTarget.files[0];
        setFileObjects(newFiles);
    };

    const backToList = () => {
        if (no === "new") {
            navigate("/posts/common");
        } else {
            navigate("/post/" + no);
        }
    };

    return (
        <Box sx={{p: 3, backgroundColor: "#121212", minHeight: "100vh"}}>
            <Typography
                variant="h4"
                sx={{color: "#ffffff", fontSize: "2.5rem", fontWeight: "bold", mb: 1}}
            >
                글 작성
            </Typography>
            <Typography sx={{color: "#bbbbbb", fontSize: "1rem", mb: 2}}>
                게시판 &gt; {post.category === "선택 필수" ? "카테고리 선택" : post.category}
            </Typography>
            <Box

                sx={{backgroundColor: "#1e1e1e", p: 2, borderRadius: "4px"}}
            >
                <Formik
                    initialValues={post}
                    enableReinitialize
                    validate={(values) => {
                        const errors = {};
                        if (!values.category || values.category === "선택 필수") {
                            errors.category = "카테고리를 선택하세요.";
                        }
                        return errors;
                    }}
                    onSubmit={(values, {setSubmitting}) => {
                        setSubmitting(true);
                        const formData = new FormData();
                        if (no !== "new") {
                            formData.append("no", Number(no));
                        }
                        formData.append("title", values.title);
                        formData.append("category", values.category);
                        formData.append("name", values.name);
                        formData.append("contents", values.contents);

                        values.fileUrl.forEach((file, idx) => {
                            if (file.type === "existing" && !fileObjects[idx]) {
                                formData.append("existingFileUrl", file.url);
                            } else if (fileObjects[idx]) {
                                formData.append("fileUrl", fileObjects[idx]);
                            }
                        });

                        const url = no === "new" ? "/api/addPost" : "/api/updatePost";
                        const method = no === "new" ? "post" : "put";

                        checkToken({
                            method: method,
                            url: url,
                            data: formData,
                        })
                            .then((res) => {
                                alert(res.data);
                                navigate("/post/"+no);
                            })
                            .catch((err) => {
                                alert(err.response?.data || "에러 발생");
                            })
                            .finally(() => setSubmitting(false));
                    }}
                >
                    {({values, errors, touched, isSubmitting}) => (
                        <Form>
                            <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                <FormControl>
                                    <InputLabel
                                        sx={{color: "#bbbbbb", fontSize: "1.2rem"}}
                                        shrink
                                    >
                                        게시판 분류
                                    </InputLabel>
                                    <Field as={Select} name="category">
                                        <MenuItem value="선택 필수">선택 필수</MenuItem>
                                        <MenuItem value="common">자유</MenuItem>
                                        <MenuItem value="md">영화/드라마</MenuItem>
                                        <MenuItem value="sug">건의</MenuItem>
                                    </Field>
                                    {errors.category && touched.category && (
                                        <Typography sx={{color: "red", fontSize: "1rem", mt: 1}}>
                                            {errors.category}
                                        </Typography>
                                    )}
                                </FormControl>

                                <Field name="title">
                                    {({field}) => (
                                        <TextField
                                            {...field}
                                            label="제목"
                                            variant="outlined"
                                            InputLabelProps={{shrink: true}}
                                            sx={{
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
                                <Field name="name">
                                    {({field}) => (
                                        <TextField
                                            {...field}
                                            label="작성자"
                                            variant="outlined"
                                            InputProps={{readOnly: true}}
                                            InputLabelProps={{shrink: true}}
                                            sx={{
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

                                <Field name="contents">
                                    {({field}) => (
                                        <TextField
                                            {...field}
                                            label="내용"
                                            multiline
                                            rows={4}
                                            variant="outlined"
                                            InputLabelProps={{shrink: true}}
                                            sx={{
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

                                <FieldArray name="fileUrl">
                                    {({insert, remove, push}) => (
                                        <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                            {values.fileUrl.map((file, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{display: "flex", gap: 2, alignItems: "center"}}
                                                >
                                                    <Box sx={{flexGrow: 1}}>
                                                        <Typography
                                                            sx={{color: "#bbbbbb", fontSize: "1.2rem", mb: 1}}
                                                        >
                                                            첨부파일
                                                        </Typography>
                                                        {file.type === "existing" && !fileObjects[index] ? (
                                                            <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                                                                <Typography sx={{color: "#ffffff", fontSize: "1.1rem"}}>
                                                                    {file.url}
                                                                </Typography>
                                                                <Button
                                                                    variant="outlined"
                                                                    onClick={() => {
                                                                        const updated = [...values.fileUrl];
                                                                        updated[index] = {type: "new", url: ""};
                                                                        setPost((prev) => ({
                                                                            ...prev,
                                                                            fileUrl: updated
                                                                        }));
                                                                    }}
                                                                    sx={{
                                                                        color: "#ffffff",
                                                                        borderColor: "#ffffff",
                                                                        fontSize: "1.1rem",
                                                                    }}
                                                                >
                                                                    파일 삭제
                                                                </Button>
                                                            </Box>
                                                        ) : (
                                                            <input
                                                                type="file"
                                                                onChange={(e) => handleFileChange(e, index)}
                                                                style={{color: "#ffffff"}}
                                                            />
                                                        )}
                                                    </Box>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => {
                                                            const updatedFiles = [...fileObjects];
                                                            updatedFiles.splice(index, 1);
                                                            setFileObjects(updatedFiles);
                                                            const updatedUrls = [...values.fileUrl];
                                                            updatedUrls.splice(index, 1);
                                                            setPost((prev) => ({...prev, fileUrl: updatedUrls}));
                                                        }}
                                                        sx={{
                                                            backgroundColor: "#333333",
                                                            color: "#ffffff",
                                                            fontSize: "1.1rem",
                                                        }}
                                                    >
                                                        X
                                                    </Button>
                                                </Box>
                                            ))}
                                            <Button
                                                variant="contained"
                                                onClick={() => {
                                                    push({type: "new", url: ""});
                                                    setFileObjects([...fileObjects, null]);
                                                }}
                                                sx={{
                                                    backgroundColor: "#333333",
                                                    color: "#ffffff",
                                                    fontSize: "1.1rem",
                                                    alignSelf: "flex-start",
                                                }}
                                            >
                                                첨부파일 추가
                                            </Button>
                                        </Box>
                                    )}
                                </FieldArray>

                                <Box sx={{display: "flex", gap: 2, mt: 2}}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={isSubmitting}
                                        sx={{
                                            backgroundColor: "#333333",
                                            color: "#ffffff",
                                            fontSize: "1.1rem",
                                        }}
                                    >
                                        등록
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={backToList}
                                        sx={{
                                            color: "#ffffff",
                                            borderColor: "#ffffff",
                                            fontSize: "1.1rem",
                                        }}
                                    >
                                        뒤로가기
                                    </Button>
                                </Box>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Box>
    );
}

export default Write;