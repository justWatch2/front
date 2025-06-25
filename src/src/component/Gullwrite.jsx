
import axios from "axios";
import {ErrorMessage, Field, Formik,Form} from "formik";
import {useState} from "react";
import {forEach} from "react-bootstrap/ElementChildren";
import {useNavigate} from "react-router";
import {Link} from "react-router-dom";

function Gullwrite() {
    const navigate = useNavigate();
    return (
        <main>
            <Formik
                initialValues={{ title: "", content: "" ,category: "" ,memberId:"a" ,fileUrl:null}}
                validate={(values) => {
                    const errors = {};
                    if (!values.title) {
                        errors.title = "제목을 입력해 주세요";
                    }
                    if (!values.category || values.category==="none") {
                        errors.category = "게시판을 선택해 주세요";
                    }
                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    //alert(values.title+values.content+values.category+values.fileUrl);
                    const formData = new FormData();
                    formData.append('title', values.title);
                    formData.append('contents', values.content);
                    formData.append('category', values.category);
                    formData.append('memberId', values.memberId);

                    if (values.fileUrl && values.fileUrl.length > 0) {
                        for (let i = 0; i < values.fileUrl.length; i++) {
                            formData.append('fileUrl', values.fileUrl[i]); // 배열 아님! 하나씩 넣음
                        }
                    }


                        axios.post('/api/posts', formData, {
                            headers: { 'Content-Type': 'multipart/form-data' },
                        }).then(res=>{
                            alert('등록 성공');
                            navigate('/gullist');
                        }).catch ((err)=> {
                        console.error(err);
                        alert('등록 실패');
                    }) .finally (()=>
                        setSubmitting(false)
                    )
                }}
            >
                {({ isSubmitting ,setFieldValue }) => (
                    <Form>
                        <h2>글쓰기</h2>
                        <div className="form-control">
                            <Field className="form-select" as="select" name="category">
                                <option value="none">게시판 선택</option>
                                <option value="자유">자유게시판</option>
                                <option value="영화">영화게시판</option>
                                <option value="건의">건의게시판</option>
                            </Field>
                            <ErrorMessage name="category" component="div" />
                        </div>
                        <div className="form-control" >
                            <label className="form-label">제목</label><br/>
                            <Field className="form-text" name="title"/>
                            <ErrorMessage name="title" component="div" />
                        </div>
                        <div className="form-control">
                            <label className="form-label">본문</label><br/>
                            <Field as="textarea" name="content" className="input-group-text"/>
                            <ErrorMessage name="content" component="div" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="file">이미지 업로드</label>
                            <input
                                type="file" multiple
                                name="fileUrl"
                                accept="image/*"
                                className="form-control"
                                onChange={(event) => {
                                    setFieldValue('fileUrl',event.target.files);
                                }}
                            />
                        </div>

                        <div className="d-flex justify-content-between align-items-center p-3">
                            <button type="submit" disabled={isSubmitting}>
                                Submit
                            </button>
                            <input type="Button" value="뒤로가기" onClick={()=>navigate('/gullist')}/>
                        </div>
                    </Form>
                )}
            </Formik>
        </main>
    );
}

export default Gullwrite;
