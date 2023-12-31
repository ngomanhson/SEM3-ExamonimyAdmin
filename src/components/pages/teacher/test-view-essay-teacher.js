import { useParams } from "react-router-dom";
import Layout from "../../layouts/layouts";
import { Helmet } from "react-helmet";
import { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import url from "../../services/url";
import Loading from "../../layouts/loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import NotFound from "../../pages/other/not-found";
function Test_View_Essay_Teacher() {
    const { slug } = useParams();
    const [question, setQuestion] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const [studentGrades, setStudentGrades] = useState([]);
    const [studentAnswers, setStudentAnswers] = useState([]);
    const [currentQuestionId, setCurrentQuestionId] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [score, setScore] = useState(0);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [isTestLocked, setIsTestLocked] = useState(false);
    const [userRole, setUserRole] = useState(null);
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
        const userToken = localStorage.getItem("accessToken");
        api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
        api.get(`${url.TEST.DETAIL_TEST_OF_SLUG_TEACHER}?slug=${slug}`)
            .then((response) => {
                setTestData(response.data);
                fetchStudentGrades(response.data.id);
            })
            .catch((error) => {
                if (error.response && error.response.status === 404) {
                    setError(true);
                } else {
                }
            });
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
            toast.success("Score success", {
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

    //xử lý khoá bài test
    const handleLockTest = async () => {
        try {
            const userToken = localStorage.getItem("accessToken");
            const config = {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            };
            const isConfirmed = await Swal.fire({
                title: testData.status === 1 ? "Unlock test?" : "Lock test?",
                text: testData.status === 1 ? "Are you sure you want to unlock the test?" : "Are you sure you want to lock the test?",
                icon: "info",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirm",
            });

            if (isConfirmed.isConfirmed) {
                api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
                const updateResponse = await api.put(testData.status === 1 ? url.LOCKTEST.UNLOCK.replace("{}", slug) : url.LOCKTEST.LOCK.replace("{}", slug), config);
                setIsTestLocked(!isTestLocked);
                toast.success(testData.status === 1 ? "Unlock the test successfully." : "Lock the test successfully.", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
                setTimeout(() => {
                    navigate(`/test-list`); //chuyển đến trang test-list
                }, 3000);
            }
        } catch (error) {
            toast.error(testData.status === 1 ? "Unlock the test failed." : "Lock the test failed.", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
        }
    };

    //kiểm tra role
    useEffect(() => {
        const fetchUserRole = async () => {
            const token = localStorage.getItem("accessToken");
            try {
                const decodedToken = JSON.parse(atob(token.split(".")[1]));
                const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                setUserRole(userRole);

                if (userRole === "Super Admin" || userRole === "Staff") {
                    setError(true);
                }
            } catch (error) {
                console.error("Error loading user role:", error);
            }
        };

        fetchUserRole();
    }, [navigate]);

    useEffect(() => {
        setIsTestLocked(testData.locked);
    }, [testData.locked]);
    return (
        <>
            {loading ? <Loading /> : ""}
            {error ? (
                <NotFound />
            ) : (
                <>
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
                                            <h5>{testData.exam_id}</h5>
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
                                        <div className="row align-items-center">
                                            <h5 className="card-title">
                                                Students
                                                {userRole === "Super Admin" ? (
                                                    <a className="btn btn-primary float-sm-end m-l-10" onClick={handleLockTest}>
                                                        {testData.status === 0 ? "Lock Test" : "Unlock Test"}
                                                    </a>
                                                ) : null}
                                            </h5>
                                        </div>
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
                                                                    <img className="rounded-circle" src={student.avatar} width="40" height="40" alt={student.fullname} />
                                                                    {student.fullname}
                                                                </td>
                                                                <td className="text-nowrap">
                                                                    {grade ? (grade.finishedAt ? formatDateTime(grade.finishedAt) : "This student haven't taken the test!") : "-"}
                                                                </td>
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
            )}
        </>
    );
}
export default Test_View_Essay_Teacher;
