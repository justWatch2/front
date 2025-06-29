import {Field, Form, Formik} from "formik";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    Box,
    Button,
    TextField,
    Typography,
    InputLabel,
    Stack,
    ThemeProvider,
    createTheme,
    CssBaseline,
    IconButton,
} from "@mui/material";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";

function SignUp({onClose}) {
    const navigate = useNavigate();
    const [img, setImg] = useState(null);
    const [preview, setPreview] = useState(null);

    const signForm = {
        id: "",
        flag: false,
        pass: "",
        passR: "",
        img: "",
    };

    function checkId(values, setFieldValue) {
        axios.get("/api/checkId?id=" + values.id).then((res) => {
            if (res.data === "success") {
                setFieldValue("flag", true);
                alert("사용 가능한 아이디입니다.");
            } else {
                setFieldValue("flag", false);
                alert("이미 사용 중인 아이디입니다.");
            }
        });
    }

    // 다크 테마 정의
    const darkTheme = createTheme({
        palette: {
            mode: "dark",
            background: {
                default: "#121212",
                paper: "#1e1e1e",
            },
            text: {
                primary: "#ffffff",
            },
            primary: {
                main: "#b31f2b", // 빨강 강조 색
            },
        },
    });

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 400,
                    backgroundColor: "#1e1e1e", // 회색 배경
                    boxShadow: 3,
                    borderRadius: 2,
                    p: 3,
                    mx: "auto",
                    position: "relative",
                }}
            >
                {/* 닫기 버튼 */}
                <IconButton
                    onClick={() => {
                        if (onClose) onClose();
                    }}
                    sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        color: "#ffffff",
                        zIndex: 1,
                    }}
                >
                    <CloseIcon/>
                </IconButton>

                <Typography variant="h5" mt={5} mb={3} align="center" color="primary">
                    회원가입
                </Typography>

                <Formik
                    initialValues={signForm}
                    validate={(values) => {
                        const errors = {};
                        if (!values.flag) {
                            errors.id = "아이디 중복 확인이 필요합니다.";
                        }
                        if (values.pass !== values.passR) {
                            errors.passR = "비밀번호가 일치하지 않습니다.";
                        }
                        return errors;
                    }}
                    onSubmit={(values, {setSubmitting}) => {
                        setSubmitting(true);
                        const formData = new FormData();
                        formData.append("id", values.id);
                        formData.append("pass", values.pass);
                        formData.append("img", img);

                        axios
                            .post("/api/signUp", formData)
                            .then((res) => {
                                alert(res.data);
                                if (onClose) onClose();
                            })
                            .catch((err) => {
                                alert(err.response?.data || "에러 발생");
                            })
                            .finally(() => setSubmitting(false));
                    }}
                >
                    {({values, errors, touched, isSubmitting, setFieldValue}) => (
                        <Form>
                            <Stack spacing={2}>
                                {/* 아이디 필드 + 중복확인 버튼 */}
                                <Box display="flex" gap={1} alignItems="center">
                                    <Field name="id">
                                        {({field}) => (
                                            <TextField
                                                {...field}
                                                label="아이디"
                                                variant="outlined"
                                                fullWidth
                                                error={touched.id && Boolean(errors.id)}
                                                helperText={
                                                    touched.id && errors.id ? (
                                                        <span style={{fontSize: "0.9rem"}}>
                                                            {errors.id}
                                                        </span>
                                                    ) : null
                                                }
                                            />
                                        )}
                                    </Field>
                                    <Button
                                        variant="contained"
                                        onClick={() => checkId(values, setFieldValue)}
                                        sx={{
                                            backgroundColor: "primary.main",
                                            color: "#fff",
                                            whiteSpace: "nowrap",
                                            "&:hover": {
                                                backgroundColor: "#8d1a24", // 약간 더 어두운 빨강
                                            },
                                        }}
                                    >
                                        중복확인
                                    </Button>
                                </Box>

                                {/* 비밀번호 */}
                                <Field name="pass">
                                    {({field}) => (
                                        <TextField
                                            {...field}
                                            type="password"
                                            label="비밀번호"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    )}
                                </Field>

                                {/* 비밀번호 확인 */}
                                <Field name="passR">
                                    {({field}) => (
                                        <TextField
                                            {...field}
                                            type="password"
                                            label="비밀번호 확인"
                                            variant="outlined"
                                            fullWidth
                                            error={touched.passR && Boolean(errors.passR)}
                                            helperText={
                                                touched.passR && errors.passR ? (
                                                    <span style={{fontSize: "0.9rem"}}>
                                                        {errors.passR}
                                                    </span>
                                                ) : null
                                            }/>
                                    )}


                                </Field>

                                {/* 이미지 업로드 */}
                                <Box>
                                    <InputLabel sx={{color: "text.primary", mb: 1}}>
                                        이미지 등록
                                    </InputLabel>
                                    {preview && (
                                        <Box mt={1}>
                                            <img
                                                src={preview}
                                                alt="미리보기"
                                                style={{
                                                    width: "100px",
                                                    height: "100px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                    border: "1px solid #444",
                                                }}
                                            />
                                        </Box>
                                    )}
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <input
                                            type="file"
                                            id="file-upload"
                                            onChange={(e) => {
                                                const file = e.currentTarget.files[0];
                                                setImg(file);
                                                if (file) {
                                                    setPreview(URL.createObjectURL(file));
                                                } else {
                                                    setPreview(null);
                                                }
                                            }}
                                            style={{ display: "none" }}
                                        />
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            htmlFor="file-upload"
                                            sx={{
                                                // backgroundColor: "#fff",
                                                color: "primary.main",
                                                "&:hover": {
                                                    backgroundColor: "#616161",
                                                    color: "#fff",
                                                    borderColor: "#fff"
                                                },
                                            }}
                                        >
                                            파일 선택
                                        </Button>
                                        <Typography variant="body2" color="text.secondary">
                                            {img ? img.name : "선택된 파일 없음"}
                                        </Typography>
                                    </Box>

                                </Box>

                                {/* 제출 버튼 */}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={isSubmitting}
                                    fullWidth
                                >
                                    등록
                                </Button>
                            </Stack>
                        </Form>
                    )}
                </Formik>
            </Box>
        </ThemeProvider>
    );
}

export default SignUp;
