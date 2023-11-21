import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import url from "../../../services/url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import Layout from "../../../layouts/layouts";
import { useJwt } from "react-jwt";
import Loading from "../../../layouts/loading";
import { Helmet } from "react-helmet";
function Test_Of_Exam_List() {
    const { id } = useParams();
    const [tests, setTests] = useState([]);
    const [examNames, setExamNames] = useState({});
    const [studentAvatars, setStudentAvatars] = useState({});
    const maxInitialStudents = 2;
    const [examName, setExamName] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [testsPerPage] = useState(10);
    const [userRole, setUserRole] = useState(null);
    const { isExpired, isInvalid } = useJwt();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);
    //in ra danh sách bài thi theo kì thi
    const loadTestForExam = async (examId) => {
        try {
            const response = await api.get(`${url.TEST.EXAM_ID}?examId=${examId}`);
            //lấy ảnh của sinh viên qua slug của bài test
            const studentAvatarData = {};
            for (const test of response.data) {
                const slug = test.slug; // Lấy slug của bài test từ dữ liệu
                const studentListResponse = await api.get(url.STUDENT.TEST_SLUG.replace("{}", slug));
                studentAvatarData[slug] = studentListResponse.data;
            }
            setStudentAvatars(studentAvatarData);
            setTests(response.data);
        } catch (error) {}
    };

    // hiển thị tên kì thi
    const fetchExamNames = async () => {
        const userToken = localStorage.getItem("accessToken");
        try {
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            const response = await api.get(url.EXAM.LIST);
            const examData = response.data.reduce((acc, curr) => {
                acc[curr.id] = curr.name;
                return acc;
            }, {});
            setExamNames(examData);
            if (examData[id]) {
                setExamName(examData[id]);
            }
        } catch (error) {}
    };

    const canEditTest = (startDate) => {
        // So sánh startDate với thời gian hiện tại
        const currentDate = Date.now();
        return startDate > currentDate;
    };

    const indexOfLastTest = currentPage * testsPerPage;
    const indexOfFirstTest = indexOfLastTest - testsPerPage;
    const currentTests = tests.slice(indexOfFirstTest, indexOfLastTest);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const fetchUserRole = async () => {
        const token = localStorage.getItem("accessToken");
        try {
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            setUserRole(userRole);
        } catch (error) {
            console.error("Error loading user role:", error);
        }
    };

    useEffect(() => {
        loadTestForExam(id);
        fetchExamNames();
        fetchUserRole();
    }, [id]);
    return (
        <>
            {loading ? <Loading /> : ""}
            <Helmet>
                <title>Blog | Examonimy</title>
            </Helmet>
            <Layout>
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="page-title">Test List</h3>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12">
                        <div className="card card-table">
                            <div className="card-body">
                                <div id="notification-container"></div>

                                <div className="page-header">
                                    <div className="row align-items-center">
                                        <h5 class="card-title">
                                            {userRole === "Exam Administrator" || userRole === "Super Admin" ? (
                                                <NavLink to={`/test-create`} data-bs-toggle="modal" data-bs-target="#signup-modal" className="btn btn-primary float-sm-end m-l-10">
                                                    Add New Test
                                                </NavLink>
                                            ) : null}
                                        </h5>
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table className="table border-0 star-student table-hover table-center mb-0 datatable table-striped">
                                        <thead className="student-thread">
                                            <tr>
                                                <th>Ordinal</th>
                                                <th>Name Test</th>
                                                <th>Type Test</th>
                                                <th>Exam</th>
                                                <th>Student List</th>
                                                <th>Start Date Time</th>
                                                <th>End Date Time</th>
                                                <th>Past Marks</th>
                                                <th className="text-end">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentTests.map((item, index) => {
                                                const isEditable = canEditTest(new Date(item.startDate));
                                                const testViewLink = item.type_test === 0 ? `/test-view/${item.slug}` : `/test-view-essay/${item.slug}`;
                                                return (
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{item.name}</td>
                                                        <td>{item.type_test === 0 ? "Multiple Choice" : "Essay Test"}</td>
                                                        <td>{examNames[item.exam_id]}</td>
                                                        <td>
                                                            <div className="avatar-group">
                                                                {studentAvatars[item.slug] &&
                                                                    studentAvatars[item.slug].slice(0, maxInitialStudents).map((student) => (
                                                                        <div className="avatar" key={student.id}>
                                                                            <img className="avatar-img rounded-circle border border-white" src={student.avatar} />
                                                                        </div>
                                                                    ))}
                                                                {studentAvatars[item.slug] && studentAvatars[item.slug].length > maxInitialStudents && (
                                                                    <div className="avatar">
                                                                        <span className="avatar-title rounded-circle border border-white">
                                                                            +{studentAvatars[item.slug].length - maxInitialStudents}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td>{format(new Date(item.startDate), "yyyy-MM-dd HH:mm")}</td>
                                                        <td>{format(new Date(item.endDate), "yyyy-MM-dd HH:mm")}</td>

                                                        <td>
                                                            {item.past_marks}
                                                            /100
                                                        </td>
                                                        <td className="text-end">
                                                            <div className="actions">
                                                                <NavLink to={testViewLink} className="btn btn-sm bg-success-light me-2">
                                                                    <i className="feather-eye"></i>
                                                                </NavLink>
                                                                {isEditable ? (
                                                                    <NavLink to={`/test-edit/${item.slug}`} className="btn btn-sm bg-danger-light">
                                                                        <i className="feather-edit"></i>
                                                                    </NavLink>
                                                                ) : (
                                                                    <NavLink
                                                                        onClick={() =>
                                                                            toast.warning("This test cannot be edited because this test is being taken or has already been taken!", {
                                                                                position: toast.POSITION.TOP_RIGHT,
                                                                                autoClose: 3000,
                                                                            })
                                                                        }
                                                                        className="btn btn-sm bg-danger-light"
                                                                    >
                                                                        <i className="feather-edit"></i>
                                                                    </NavLink>
                                                                )}
                                                            </div>
                                                        </td>
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

                <div className="row">
                    <div className="col">
                        <ul className="pagination mb-4">
                            <li className="page-item">
                                <button className="page-link" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                                    Previous
                                </button>
                            </li>

                            {Array.from(
                                {
                                    length: Math.ceil(tests.length / testsPerPage),
                                },
                                (_, i) => (
                                    <li key={i} className={`page-item ${i + 1 === currentPage ? "active" : ""}`}>
                                        <button className="page-link" onClick={() => paginate(i + 1)}>
                                            {i + 1}
                                        </button>
                                    </li>
                                )
                            )}
                            <li className="page-item">
                                <button className="page-link" onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(tests.length / testsPerPage)}>
                                    Next
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div id="signup-modal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-body">
                                <div class="text-center mt-2 mb-4">
                                    <div class="auth-logo">
                                        <a href="index.html" class="logo logo-dark">
                                            <span class="logo-lg">
                                                <img src="assets/img/logo.png" alt height="42" />
                                            </span>
                                        </a>
                                    </div>
                                </div>
                                <div class="text-center mt-2 mb-4">
                                    <h6>Do you want to create a multiple choice or essay test?</h6>
                                </div>
                                <div class="text-center mt-2 mb-4">
                                    <NavLink
                                        to="/test-create"
                                        style={{
                                            color: "white",
                                        }}
                                    >
                                        <button class="btn btn-primary" data-bs-dismiss="modal">
                                            Multiple choice
                                        </button>
                                    </NavLink>
                                    <NavLink
                                        to="/test-essay-create"
                                        style={{
                                            color: "white",
                                        }}
                                    >
                                        {" "}
                                        <button
                                            class="btn btn-primary"
                                            data-bs-dismiss="modal"
                                            style={{
                                                color: "white",
                                                marginLeft: "10px",
                                            }}
                                        >
                                            Essay test
                                        </button>
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}
export default Test_Of_Exam_List;
