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
function Test_View_Teacher() {
    const { slug } = useParams();
    const [studentList, setStudentList] = useState([]);
    const [questionList, setQuestionList] = useState([]);
    const [studentGrades, setStudentGrades] = useState([]);
    const [isTestLocked, setIsTestLocked] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [testData, setTestData] = useState({
        id: "",
        name: "",
        type_test: "",
        exam_id: "",
        startDate: "",
        endDate: "",
        past_marks: "",
    });

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
    //lấy danh sách câu hỏi của bài test
    const fetchQuestionList = async () => {
        try {
            const response = await api.get(url.TESTQUESTION.LIST.replace("{}", slug));
            setQuestionList(response.data);
        } catch (error) {}
    };
    //lấy điểm của sinh viên
    const fetchStudentGrades = async (testId) => {
        try {
            const response = await api.get(url.GRADE.LIST, {
                params: { test_id: testId },
            });
            setStudentGrades(response.data);
        } catch (error) {}
    };
    useEffect(() => {
        fetchStudentList();
        fetchQuestionList();
    }, [slug]);

    //pa gi nết
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 8;
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
            // console.log(error);
            // console.error("Response data:", error.response.data);
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

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);
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

                            <div className="col-xl-8 d-flex">
                                <div className="card flex-fill student-space comman-shadow">
                                    <div className="card-header d-flex align-items-center">
                                        <h5 className="card-title">List Students</h5>
                                        <ul className="chart-list-out student-ellips">
                                            {/* <li className="star-menus"> */}
                                            {userRole === "Super Admin" ? (
                                                <a className="btn btn-primary float-sm-end m-l-10" onClick={handleLockTest}>
                                                    {testData.status === 0 ? "Lock Test" : "Unlock Test"}
                                                </a>
                                            ) : null}
                                            {/* </li> */}
                                        </ul>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table star-student table-hover table-center table-borderless table-striped">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th>ST Code</th>
                                                        <th>Name</th>
                                                        <th className="text-center">Finished At</th>
                                                        <th className="text-center">Marks</th>
                                                        <th className="text-center">Status</th>
                                                        <th className="text-end">Detail</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentStudents.map((student) => {
                                                        const grade = studentGrades.find((grade) => grade.student_id === student.id && grade.test_id === testData.id);
                                                        return (
                                                            <tr key={student.id}>
                                                                <td className="text-nowrap">
                                                                    <div>{student.student_code}</div>
                                                                </td>
                                                                <td className="text-nowrap">
                                                                    <img className="rounded-circle" src={student.avatar} width="25" alt={student.fullname} />
                                                                    {student.fullname}
                                                                </td>
                                                                <td className="text-center">
                                                                    {grade ? (grade.finishedAt ? formatDateTime(grade.finishedAt) : "This student haven't taken the test!") : "-"}
                                                                </td>
                                                                <td className="text-center">{grade && grade.score !== null ? grade.score.toFixed(2) : "No data"}</td>
                                                                <td className="text-center">{grade ? (grade.status === 1 ? "Passed" : "Fail") : "-"}</td>
                                                                <td className="text-end">
                                                                    <span className="badge badge-soft-info">View</span>
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

                        <div className="row">
                            <div class="col-xl-12">
                                <div class="card">
                                    <div class="card-header">
                                        <h5 class="card-title">Questions</h5>
                                    </div>
                                    <div class="card-body">
                                        <div class="table-responsive">
                                            <table class="table table-hover mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Ordinal</th>
                                                        <th>Name Question</th>
                                                        <th>Answer A</th>
                                                        <th>Answer B</th>
                                                        <th>Answer C</th>
                                                        <th>Answer D</th>
                                                        {/* <th>Percent</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {questionList.map((item, index) => {
                                                        const truncatedTitle = item.title.length > 20 ? `${item.title.substring(0, 20)}...` : item.title;

                                                        return (
                                                            <tr key={item.id}>
                                                                <td>{index + 1}</td>
                                                                <td className="line-clamp" data-fulltext={item.title}>
                                                                    {truncatedTitle}
                                                                </td>
                                                                {item.answers.map((answer) => {
                                                                    const truncatedContent = answer.content.length > 10 ? `${answer.content.substring(0, 10)}...` : answer.content;

                                                                    return (
                                                                        <td key={answer.id} className="line-clamp" data-fulltext={answer.content}>
                                                                            {truncatedContent}
                                                                            {answer.status === 1 && (
                                                                                <i
                                                                                    className="feather-check-circle"
                                                                                    style={{
                                                                                        marginLeft: "5px",
                                                                                        color: "green",
                                                                                    }}
                                                                                ></i>
                                                                            )}
                                                                        </td>
                                                                    );
                                                                })}
                                                                {/* <td>%</td> */}
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Layout>
                </>
            )}
        </>
    );
}
export default Test_View_Teacher;
