import { useEffect, useState } from "react";
import api from "../../services/api";
import url from "../../services/url";
import Layout from "../../layouts/layouts";
import { Helmet } from "react-helmet";
import { NavLink, useNavigate } from "react-router-dom";
import Loading from "../../layouts/loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "../../pages/other/not-found";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
function Question_Create_Essay() {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [course, setCourse] = useState([]);
    const [questionErrors, setQuestionErrors] = useState({});
    const [editorError, setEditorError] = useState("");
    const [questionData, setQuestionData] = useState({
        title: "",
        course_id: "",
    });

    const validateQuestion = () => {
        // validate cho các câu hỏi
        let valid = true;
        const newQuestionErrors = {};

        if (!questionData.course_id) {
            newQuestionErrors.course_id = "Please select course";
            valid = false;
        }

        const editorContent = questionData.title.trim();
        if (editorContent.length < 3 || editorContent.length > 1000) {
            setEditorError("Question must be between 3 and 1000 characters");
            valid = false;
        } else {
            setEditorError("");
        }

        setQuestionErrors(newQuestionErrors);
        return valid;
    };

    //hiển thị select course
    useEffect(() => {
        const fetchCourse = async () => {
            const userToken = localStorage.getItem("accessToken");
            try {
                api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
                const response = await api.get(url.COURSE.LIST);
                setCourse(response.data.data);
            } catch (error) {}
        };
        fetchCourse();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isFormValid = validateQuestion();
        const userToken = localStorage.getItem("accessToken");
        if (isFormValid) {
            try {
                api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
                const response = await api.post(url.QUESTION.CREATE_ESSAY_QUESTION, questionData);
                toast.success("Create Question Successfully", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
                setTimeout(() => {
                    navigate(`/question-list-essay`);
                }, 3000);
            } catch (error) {
                toast.error("Create Question Failed!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
                console.error("Error creating question:", error);
                console.error("Response data:", error.response.data);
            }
        } else {
            toast.error("Please complete all information!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
        }
    };

    const handleInputChange = (field, value) => {
        setQuestionData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleChangeEditor = (content, delta, source, editor) => {
        setQuestionData((prevData) => ({
            ...prevData,
            title: content,
        }));
    };

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    });
    return (
        <>
            {loading ? <Loading /> : ""}
            {error ? (
                <NotFound />
            ) : (
                <>
                    <Helmet>
                        <title>Question | Examonimy</title>
                    </Helmet>
                    <Layout>
                        <div className="page-header">
                            <div className="row align-items-center">
                                <div className="col-sm-12">
                                    <div className="page-sub-header">
                                        <h3 className="page-title">Add Question</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div class="col-md-9">
                                <ul class="list-links mb-4">
                                    <li>
                                        <NavLink to="/question-create-multiple">Add Question Multiple</NavLink>
                                    </li>
                                    <li class="active">
                                        <NavLink to="">Add Queston Essay</NavLink>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card comman-shadow">
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-12">
                                                    <h5 className="form-title student-info">
                                                        Question Information
                                                        <span>
                                                            <a href="javascript:;">
                                                                <i className="feather-more-vertical"></i>
                                                            </a>
                                                        </span>
                                                    </h5>
                                                </div>
                                                <div className="form-group">
                                                    <label>Question Name</label>
                                                    {editorError && <div className="text-danger">{editorError}</div>}
                                                    <ReactQuill
                                                        value={questionData.title}
                                                        onChange={handleChangeEditor}
                                                        modules={{
                                                            toolbar: [
                                                                [
                                                                    {
                                                                        header: "1",
                                                                    },
                                                                    {
                                                                        header: "2",
                                                                    },
                                                                    {
                                                                        font: [],
                                                                    },
                                                                ],
                                                                ["bold", "italic", "underline", "strike", "blockquote"],
                                                                [
                                                                    "link",
                                                                    // "image",
                                                                    "video",
                                                                ],
                                                                [
                                                                    {
                                                                        list: "ordered",
                                                                    },
                                                                    {
                                                                        list: "bullet",
                                                                    },
                                                                    {
                                                                        indent: "-1",
                                                                    },
                                                                    {
                                                                        indent: "+1",
                                                                    },
                                                                ],
                                                            ],
                                                        }}
                                                        style={{
                                                            height: "300px",
                                                        }}
                                                    />
                                                </div>{" "}
                                                <div
                                                    className="form-group"
                                                    style={{
                                                        marginTop: "40px",
                                                    }}
                                                >
                                                    <label>Course Name</label>
                                                    <select
                                                        className="form-control select"
                                                        name="course_id"
                                                        value={questionData.course_id}
                                                        onChange={(e) => handleInputChange("course_id", e.target.value)}
                                                    >
                                                        <option value="">Please select course</option>{" "}
                                                        {course.map((courseIem) => (
                                                            <option key={courseIem.id} value={courseIem.id}>
                                                                {courseIem.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {questionErrors.course_id && <div className="text-danger">{questionErrors.course_id}</div>}
                                                </div>
                                                <div className="col-12">
                                                    <div className="student-submit">
                                                        <button type="submit" className="btn btn-primary">
                                                            Submit
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ToastContainer />
                    </Layout>
                </>
            )}
        </>
    );
}
export default Question_Create_Essay;
