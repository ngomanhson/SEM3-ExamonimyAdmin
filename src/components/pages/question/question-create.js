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
function Question_Create_Multiple() {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState("");
    const [course, setCourse] = useState([]);
    const [questionErrors, setQuestionErrors] = useState({});
    const [questionData, setQuestionData] = useState({
        title: "",
        level: "",
        course_id: "",
        answers: [
            { content: "", status: 0 },
            { content: "", status: 0 },
            { content: "", status: 0 },
            { content: "", status: 0 },
        ],
    });

    const validateQuestion = () => {
        // validate cho các câu hỏi
        let valid = true;
        const newQuestionErrors = {};

        if (!questionData.title) {
            newQuestionErrors.title = "Please enter question title";
            valid = false;
        } else if (questionData.title.length < 3) {
            newQuestionErrors.title = "Enter at least 3 characters";
            valid = false;
        } else if (questionData.title.length > 255) {
            newQuestionErrors.title = "Enter up to 255 characters";
            valid = false;
        }

        questionData.answers.forEach((answer, index) => {
            if (!answer.content) {
                newQuestionErrors[`answer${String.fromCharCode(65 + index)}`] = `Please enter choice ${String.fromCharCode(65 + index)}`;
                valid = false;
            }
        });

        const hasCorrectAnswer = questionData.answers.some((answer) => answer.status === 1);
        if (!hasCorrectAnswer) {
            newQuestionErrors.correctAnswer = "Please select correct answer";
            valid = false;
        }

        if (!questionData.level) {
            newQuestionErrors.level = "Please select level of question";
            valid = false;
        }

        if (!questionData.course_id) {
            newQuestionErrors.course_id = "Please select course";
            valid = false;
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

        const hasCorrectAnswer = questionData.answers.some((answer) => answer.status === 1);

        if (isFormValid && hasCorrectAnswer) {
            try {
                const response = await api.post(url.QUESTION.CREATE_MULTIPLE_QUESTION, questionData);
                toast.success("Create Question Successfully", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
                setTimeout(() => {
                    navigate(`/question-list`);
                }, 3000);
            } catch (error) {
                toast.error("Create Question Failed", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
                console.error("Error creating question:", error);
                console.error("Response data:", error.response.data);
            }
        } else {
            toast.error("Haven't chosen the correct answer!", {
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

    const handleAnswerChange = (index, content) => {
        setQuestionData((prevData) => ({
            ...prevData,
            answers: prevData.answers.map((answer, i) => (i === index ? { ...answer, content } : answer)),
        }));
    };

    const handleCorrectAnswerChange = (index) => {
        setQuestionData((prevData) => ({
            ...prevData,
            answers: prevData.answers.map((answer, i) => ({
                ...answer,
                status: i === index ? 1 : 0,
            })),
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
                                    <li class="active">
                                        <NavLink to="">Add Question Multiple</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/student-excel-create">Add Queston Essay</NavLink>
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
                                                    <input type="text" value={questionData.title} onChange={(e) => handleInputChange("title", e.target.value)} className="form-control" />
                                                    {questionErrors.title && <div className="text-danger">{questionErrors.title}</div>}
                                                </div>

                                                {questionData.answers.map((answer, index) => (
                                                    <div key={index} className="form-group">
                                                        <label>{`Choice ${String.fromCharCode(65 + index)}`}</label>
                                                        <input type="text" value={answer.content} onChange={(e) => handleAnswerChange(index, e.target.value)} className="form-control" />
                                                        {questionErrors[`answer${String.fromCharCode(65 + index)}`] && (
                                                            <div className="text-danger">{questionErrors[`answer${String.fromCharCode(65 + index)}`]}</div>
                                                        )}
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="radio" checked={answer.status === 1} onChange={() => handleCorrectAnswerChange(index)} />
                                                            <label className="form-check-label">Correct Answer</label>
                                                        </div>
                                                    </div>
                                                ))}

                                                <div className="form-group">
                                                    <label>Level of difficulty</label>
                                                    <select
                                                        className="form-control"
                                                        value={selectedLevel}
                                                        onChange={(e) => {
                                                            setSelectedLevel(e.target.value);
                                                            handleInputChange("level", e.target.value);
                                                        }}
                                                    >
                                                        <option value="">Select level question...</option>
                                                        <option value="1">Easy</option>
                                                        <option value="2">Medium</option>
                                                        <option value="3">Difficult</option>
                                                    </select>
                                                    {questionErrors.level && <div className="text-danger">{questionErrors.level}</div>}
                                                </div>

                                                <div className="form-group local-forms">
                                                    <label>
                                                        Course Name <span className="login-danger">*</span>
                                                    </label>
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
export default Question_Create_Multiple;
