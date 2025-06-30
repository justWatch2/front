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
    InputLabel, Divider,
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
        newFiles[index] = e.target.files[0]; // 파일 객체 저장
        setFileObjects(newFiles);
        console.log("Selected file:", newFiles[index]); // 디버깅용
    };

    const backToList = () => {
        if (no === "new") {
            navigate("/posts/common");
        } else {
            navigate("/post/" + no);
        }
    };

    return (
        <Box sx={{
            p: 3, minHeight: "100vh",
            width: "80%",
            mx: "auto",
            color: "#ffffff"
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
                    글 작성
                </Typography>
            </Box>
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
                        if (!values.title || values.title.trim() === "") {
                            errors.title = "제목을 입력하세요.";
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
                                navigate("/post/" + no);
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
                                        sx={{
                                            backgroundColor: "#1e1e1e",
                                            color: "#bbbbbb",
                                            fontSize: "1.2rem",
                                            transform: "translate(14px, 12px) scale(1)",
                                            "&.Mui-focused": {
                                                color: "#bbbbbb",
                                                transform: "translate(14px, -6px) scale(0.75)",
                                            },
                                            "&.MuiInputLabel-shrink": {
                                                transform: "translate(14px, -10px) scale(0.75)",
                                            },
                                            zIndex: 1,
                                        }}
                                        shrink
                                    >
                                        게시판 분류
                                    </InputLabel>
                                    <Field
                                        as={Select}
                                        name="category"
                                        sx={{
                                            "& .MuiSelect-select": {
                                                color: "#ffffff !important",
                                                padding: "16px 14px",
                                            },
                                            "& .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "#ffffff !important",
                                            },
                                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "#dddddd !important",
                                            },
                                            "& .MuiSvgIcon-root": {
                                                color: "#ffffff !important",
                                            },
                                            "& .MuiOutlinedInput-root": {
                                                paddingTop: "12px",
                                                paddingBottom: "12px",
                                            },
                                        }}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    backgroundColor: "#1e1e1e",
                                                    "& .MuiMenuItem-root": {
                                                        color: "#ffffff",
                                                        backgroundColor: "#1e1e1e",
                                                        "&:hover": {
                                                            backgroundColor: "#333333", // 호버 시 배경색 (선택적)
                                                        },
                                                        "&.Mui-selected": {
                                                            backgroundColor: "#333333", // 선택된 항목 배경색 (선택적)
                                                            color: "#ffffff",
                                                        },
                                                    },
                                                },
                                            },
                                        }}
                                    >
                                        <MenuItem value="선택 필수">선택 필수</MenuItem>
                                        <MenuItem value="common">자유</MenuItem>
                                        <MenuItem value="md">영화/드라마</MenuItem>
                                        <MenuItem value="sug">건의</MenuItem>
                                    </Field>
                                    {errors.category && touched.category && (
                                        <Typography sx={{color: "#ff4444", fontSize: "1rem", mt: 1}}>
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
                                            error={touched.title && !!errors.title}
                                            helperText={touched.title && errors.title && (
                                                <Typography sx={{color: "#ff4444", fontSize: "1rem"}}>
                                                    {errors.title}
                                                </Typography>
                                            )}
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
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: 2,
                                                flexDirection: "column",
                                                border: "1px solid #ffffff",
                                                borderRadius: "4px",
                                                padding: "4px 8px",
                                            }}
                                        >

                                            <InputLabel
                                                sx={{
                                                    display: "block",
                                                    backgroundColor: "#1e1e1e",
                                                    // backgroundColor: "transparent",
                                                    color: "#bbbbbb",
                                                    fontSize: "1.2rem",
                                                    width: "75px",
                                                    transform: "translate(14px, 12px) scale(1)",
                                                    "&.Mui-focused": {
                                                        color: "#bbbbbb",
                                                        transform: "translate(14px, -6px) scale(0.75)",
                                                    },
                                                    "&.MuiInputLabel-shrink": {
                                                        transform: "translate(2px, -15px) scale(0.75)",
                                                        maxWidth: "calc(100% - 20px)",
                                                    },
                                                    zIndex: 1,
                                                }}
                                                shrink
                                            >
                                                첨부파일
                                            </InputLabel>

                                            {values.fileUrl.map((file, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{display: "flex", gap: 2, alignItems: "center", ml: "10px",}}
                                                >
                                                    <Box sx={{flexGrow: 1, maxWidth: "300px"}}>

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
                                                                        backgroundColor: "#333333",
                                                                        color: "#ffffff",
                                                                        fontSize: "0.9rem",
                                                                        padding: "4px 8px",
                                                                        borderRadius: "4px",
                                                                        minWidth: "30px",
                                                                        height: "40px",
                                                                    }}
                                                                >
                                                                    X
                                                                </Button>
                                                            </Box>
                                                        ) : (
                                                            <Box sx={{position: "relative", width: "100%"}}>
                                                                <input
                                                                    type="file"
                                                                    onChange={(e) => handleFileChange(e, index)}
                                                                    style={{
                                                                        opacity: 0,
                                                                        position: "absolute",
                                                                        top: 0,
                                                                        left: 0,
                                                                        width: "100%",
                                                                        height: "100%",
                                                                        cursor: "pointer",
                                                                        zIndex: 1,
                                                                    }}
                                                                />
                                                                <TextField
                                                                    variant="outlined"
                                                                    placeholder="파일 선택"
                                                                    value={fileObjects[index]?.name || ""}
                                                                    InputProps={{
                                                                        readOnly: true,
                                                                        sx: {
                                                                            color: "#ffffff",
                                                                            fontSize: "1.1rem",
                                                                            "& .MuiOutlinedInput-notchedOutline": {
                                                                                borderColor: "#ffffff",
                                                                            },
                                                                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                                                                borderColor: "#dddddd",
                                                                            },
                                                                        },
                                                                    }}
                                                                    InputLabelProps={{shrink: true}}
                                                                    sx={{
                                                                        width: "100%",
                                                                        "& .MuiInputLabel-root": {
                                                                            color: "#bbbbbb",
                                                                            fontSize: "1.2rem"
                                                                        },
                                                                    }}
                                                                />
                                                                <Button
                                                                    variant="contained"
                                                                    onClick={() => {
                                                                        const updatedFiles = [...fileObjects];
                                                                        updatedFiles.splice(index, 1);
                                                                        setFileObjects(updatedFiles);
                                                                        const updatedUrls = [...values.fileUrl];
                                                                        updatedUrls.splice(index, 1);
                                                                        setPost((prev) => ({
                                                                            ...prev,
                                                                            fileUrl: updatedUrls
                                                                        }));
                                                                    }}
                                                                    sx={{
                                                                        backgroundColor: "#333333",
                                                                        color: "#ffffff",
                                                                        fontSize: "0.9rem",
                                                                        padding: "4px 8px",
                                                                        borderRadius: "4px",
                                                                        minWidth: "30px",
                                                                        height: "40px",
                                                                        position: "absolute",
                                                                        right: "8px",
                                                                        top: "50%",
                                                                        transform: "translateY(-50%)",
                                                                    }}
                                                                >
                                                                    X
                                                                </Button>
                                                            </Box>
                                                        )}
                                                        <Divider sx={{backgroundColor: "#5e5e5e", my: 1}}/>

                                                    </Box>

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
                                            <br />
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
                                            '&:hover': {
                                                backgroundColor: "#ffffff",
                                                color: "#000000",
                                            }
                                        }}

                                    >
                                        {no === "new" ? '등록' : '수정'}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={backToList}
                                        sx={{
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