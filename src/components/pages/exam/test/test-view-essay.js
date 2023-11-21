import { useParams } from "react-router-dom";
import Layout from "../../../layouts/layouts";
import { Helmet } from "react-helmet";
import { useEffect, useState, useRef } from "react";
import api from "../../../services/api";
import url from "../../../services/url";
import Loading from "../../../layouts/loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Test_View_Essay() {
    const { slug } = useParams();
    const [examName, setExamName] = useState([]);
    const [question, setQuestion] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const [studentGrades, setStudentGrades] = useState([]);
    const [studentAnswers, setStudentAnswers] = useState([]);
    const [currentQuestionId, setCurrentQuestionId] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [score, setScore] = useState(0);
    const [initialScore, setInitialScore] = useState(0);
    const [testData, setTestData] = useState({
        id: "",
        name: "",
        type_test: "",
        exam_id: "",
        startDate: "",
        endDate: "",
        past_marks: "",
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    //hien thi chi tiet bai test
    useEffect(() => {
        api.get(`${url.TEST.DETAIL}?slug=${slug}`)
            .then((response) => {
                setTestData(response.data);
                fetchStudentGrades(response.data.id);
            })
            .catch((error) => {});
    }, [slug]);
    //format ngay gio thi
    const formatDateTime = (dateTimeString) => {
        const optionsDate = {
            month: "short",
            day: "numeric",
            year: "numeric",
        };
        const optionsTime = {
            hour: "numeric",
            minute: "numeric",
        };
        const dateTime = new Date(dateTimeString);
        const formattedDate = dateTime.toLocaleDateString("en-US", optionsDate);
        const formattedTime = dateTime.toLocaleTimeString("en-US", optionsTime);
        return `${formattedDate} | ${formattedTime}`;
    };

    //hien thi ten exam
    useEffect(() => {
        const userToken = localStorage.getItem("accessToken");
        api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
        api.get(url.EXAM.LIST)
            .then((response) => {
                setExamName(response.data);
            })
            .catch((error) => {});
    }, []);
    const getExamName = (examId) => {
        const exam = examName.find((exam) => exam.id === examId);
        return exam ? exam.name : "Unknown Exam";
    };

    //lấy danh sách sinh viên của bài test
    const fetchStudentList = async () => {
        try {
            const response = await api.get(url.STUDENT.TEST_SLUG.replace("{}", slug));
            setStudentList(response.data);
        } catch (error) {}
    };

    //lấy câu hỏi của bài test
    const fetchQuestion = async () => {
        try {
            const response = await api.get(url.TESTQUESTION.LIST.replace("{}", slug));
            setQuestion(response.data);

            // Lấy question_id từ danh sách câu hỏi
            const firstQuestion = response.data[0];
            if (firstQuestion) {
                setCurrentQuestionId(firstQuestion.id);
            }
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    };

    //lấy điểm của sinh viên
    const fetchStudentGrades = async (testId) => {
        try {
            const response = await api.get(url.GRADE.LIST, {
                params: { test_id: testId },
            });
            setStudentGrades(response.data);
            const currentStudentGrade = response.data.find((grade) => grade.student_id === selectedStudent?.id && grade.test_id === testId); //lấy điểm của sinh viên hiển thị vào model
            if (currentStudentGrade) {
                setInitialScore(currentStudentGrade.score);
                setScore(currentStudentGrade.score);
            } else {
                setInitialScore(0);
                setScore(0);
            }
        } catch (error) {
            console.error("Error fetching grades:", error);
        }
    };

    //lấy câu trả lời của sinh viên
    const fetchStudentAnswers = async () => {
        try {
            const response = await api.get(url.ANSWER.ANSWERFORSTUDENT);
            setStudentAnswers(response.data.data);
            // console.log(response.data.data);
        } catch (error) {}
    };

    //xem chi tiết bài thi
    const handleViewButtonClick = (student) => {
        setSelectedStudent(student);
    };

    //xử lý chấm điểm sinh viên
    const submitScore = async () => {
        const adminToken = localStorage.getItem("accessToken");
        const userToken = localStorage.getItem("accessToken");
        try {
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            const response = await api.post(
                url.ANSWER.SCORING,
                {
                    test_id: testData.id,
                    student_id: selectedStudent.id,
                    score: score,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${adminToken}`,
                    },
                }
            );
            toast.success("Cham diem thanh cong", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                if (status === 400) {
                    toast.error("Unable to score, please try again", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000,
                    });
                } else if (status === 401) {
                    toast.error("Only the teacher who teaches this class can grade!", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000,
                    });
                } else {
                    console.error("Error submitting score:", error);
                    toast.error("An error occurred. Try again later!", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000,
                    });
                }
            } else {
                console.error("Error submitting score:", error);
                toast.error("An error occurred. Try again later!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
            }
        }
    };
    const handleScoreChange = (event) => {
        setScore(event.target.value);
    };

    useEffect(() => {
        fetchStudentList();
        fetchQuestion();
        fetchStudentAnswers();
    }, [slug]);

    useEffect(() => {
        fetchStudentGrades(testData.id);
    }, [selectedStudent, testData.id]);

    //pa gi nết
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 10;
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = studentList.slice(indexOfFirstStudent, indexOfLastStudent);
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    return (
        <>
            {loading ? <Loading /> : ""}
            <Helmet>
                <title>Test Detail | Examonimy</title>
            </Helmet>
            <Layout>
                <div className="row">
                    <div class="card col-xl-4 d-flex">
                        <div class="card-body">
                            <div class="heading-detail">
                                <h4>Test Detail :</h4>
                            </div>
                            <div class="personal-activity">
                                <div class="personal-icons">
                                    <img src="assets/img/icons/buliding-icon.svg" alt />
                                </div>
                                <div class="views-personal">
                                    <h4>Name Test</h4>
                                    <h5>{testData.name}</h5>
                                </div>
                            </div>
                            <div class="personal-activity"></div>
                            <div class="personal-activity">
                                <div class="personal-icons">
                                    <i class="feather-file-text"></i>
                                </div>
                                <div class="views-personal">
                                    <h4>Type Test</h4>
                                    <h5>{testData.type_test === 0 ? "Multiple Choice" : "Essay Test"}</h5>
                                </div>
                            </div>
                            <div class="personal-activity"></div>
                            <div class="personal-activity">
                                <div class="personal-icons">
                                    <i class="feather-book-open"></i>
                                </div>
                                <div class="views-personal">
                                    <h4>Exam</h4>
                                    <h5>{getExamName(testData.exam_id)}</h5>
                                </div>
                            </div>
                            <div class="personal-activity"></div>
                            <div class="personal-activity">
                                <div class="personal-icons">
                                    <i class="feather-calendar"></i>
                                </div>
                                <div class="views-personal">
                                    <h4>Start Date Time</h4>
                                    <h5>
                                        <ul className="teacher-date-list">
                                            <li>{formatDateTime(testData.startDate)}</li>
                                        </ul>
                                    </h5>
                                </div>
                            </div>
                            <div class="personal-activity"></div>
                            <div class="personal-activity">
                                <div class="personal-icons">
                                    <i class="feather-calendar"></i>
                                </div>
                                <div class="views-personal">
                                    <h4>End Date Time</h4>
                                    <h5>
                                        <ul className="teacher-date-list">
                                            <li>{formatDateTime(testData.endDate)}</li>
                                        </ul>
                                    </h5>
                                </div>
                            </div>
                            <div class="personal-activity"></div>
                            <div class="personal-activity">
                                <div class="personal-icons">
                                    <i class="feather-check-circle"></i>
                                </div>
                                <div class="views-personal">
                                    <h4>Part Marks</h4>
                                    <h5>{testData.past_marks}/100</h5>
                                </div>
                            </div>
                            <div class="personal-activity"></div>
                            <div class="personal-activity mb-0">
                                <div class="personal-icons">
                                    <i class="fa fa-cloud"></i>
                                </div>
                                <div class="views-personal">
                                    <h4>Status</h4>
                                    <h5>It's not time to take the test yet</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-8">
                        <div class="student-personals-grp">
                            <div class="card mb-0">
                                <div class="card-body">
                                    <div class="heading-detail">
                                        <h4>Question Details</h4>
                                    </div>
                                    <div class="hello-park">
                                        <h5>Content :</h5>
                                        {question.map((q, index) => (
                                            <p
                                                key={index}
                                                dangerouslySetInnerHTML={{
                                                    __html: q.title,
                                                }}
                                            ></p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div class="col-xl-12">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title">Students</h5>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-hover mb-0">
                                        <thead>
                                            <tr>
                                                <th>Student Code</th>
                                                <th>Name</th>
                                                <th>Finished At</th>
                                                <th>Marks</th>
                                                <th>Status</th>
                                                <th>Student Answers</th>
                                                <th>Grade</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {" "}
                                            {currentStudents.map((student) => {
                                                const grade = studentGrades.find((grade) => grade.student_id === student.id && grade.test_id === testData.id);
                                                const studentAnswer = studentAnswers.find((answer) => answer.student_id === student.id && answer.question_id === currentQuestionId);
                                                return (
                                                    <tr key={student.id}>
                                                        <td className="text-nowrap">
                                                            <div>{student.student_code}</div>
                                                        </td>
                                                        <td className="text-nowrap">
                                                            <img className="rounded-circle" src={student.avatar} width="25" alt={student.fullname} />
                                                            {student.fullname}
                                                        </td>
                                                        <td className="text-nowrap">{grade ? (grade.finishedAt ? formatDateTime(grade.finishedAt) : "This student haven't taken the test!") : "-"}</td>
                                                        <td className="text-nowrap">{grade && grade.score !== null ? grade.score.toFixed(2) : "No data"}</td>
                                                        <td className="text-nowrap">{grade ? (grade.status === 1 ? "Passed" : "Fail") : "-"}</td>
                                                        <td>
                                                            {studentAnswer ? (
                                                                <a href={studentAnswer.content} target="_blank" rel="noopener noreferrer">
                                                                    {studentAnswer.content}
                                                                </a>
                                                            ) : (
                                                                "No answer"
                                                            )}
                                                        </td>
                                                        <td>
                                                            {studentAnswers.some((answer) => answer.student_id === student.id && answer.question_id === currentQuestionId) ? (
                                                                <span
                                                                    className="badge badge-soft-info"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#bs-example-modal-lg"
                                                                    style={{
                                                                        cursor: "pointer",
                                                                    }}
                                                                    onClick={() => handleViewButtonClick(student)}
                                                                >
                                                                    View
                                                                </span>
                                                            ) : (
                                                                <span
                                                                    className="badge badge-soft-info"
                                                                    style={{
                                                                        cursor: "pointer",
                                                                    }}
                                                                    onClick={() => {
                                                                        toast.info("This student doesn't have an answer yet so he can't mark it!", {
                                                                            position: toast.POSITION.TOP_RIGHT,
                                                                            autoClose: 3000,
                                                                        });
                                                                    }}
                                                                >
                                                                    View
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="row">
                                    <div className="col d-flex justify-content-end" style={{ marginTop: "10px" }}>
                                        <ul className="pagination mb-4">
                                            <li className="page-item">
                                                <button className="page-link" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                                                    Previous
                                                </button>
                                            </li>
                                            <button className="page-link" onClick={() => paginate(currentPage + 1)} disabled={indexOfLastStudent >= studentList.length}>
                                                Next
                                            </button>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* model chấm điểm */}
                <div class="modal fade" id="bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title" id="myLargeModalLabel">
                                    Grading for students
                                </h4>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <h6>Test Info:</h6>
                                <p>
                                    {testData.name} ({testData.type_test === 0 ? "Multiple Choice" : "Essay Test"})
                                </p>
                                <hr />
                                <h6>Student Info:</h6>
                                <p>
                                    {selectedStudent?.fullname} ({selectedStudent?.student_code})
                                </p>
                                <hr />
                                <h6>Student answers:</h6>
                                <p>
                                    {studentAnswers
                                        .filter((answer) => answer.student_id === selectedStudent?.id && answer.question_id === currentQuestionId)
                                        .map((answer) => (
                                            <a key={answer.id} href={answer.content} target="_blank" rel="noopener noreferrer">
                                                {answer.content}
                                            </a>
                                        ))}
                                </p>
                                <hr />
                                <h6>Marks (50/100 points to pass):</h6>
                                <div class="col-md-6">
                                    <input type="number" min={0} max={100} value={score} className="form-control" onChange={handleScoreChange} required />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Close
                                </button>
                                <button type="button" className="btn btn-primary" onClick={submitScore}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </Layout>
        </>
    );
}
export default Test_View_Essay;
