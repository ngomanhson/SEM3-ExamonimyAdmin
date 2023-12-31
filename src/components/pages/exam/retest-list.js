import Layout from "../../layouts/layouts";
import { Helmet } from "react-helmet";
import api from "../../services/api";
import url from "../../services/url";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { NavLink, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loading from "../../layouts/loading";
import NotFound from "../../pages/other/not-found";
function Retest_List() {
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const [retestExam, setRetestExam] = useState([]);
    const [examName, setExamName] = useState({});
    const [studentName, setStudentName] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    });

    //hiển thị danh sách các kỳ thi
    const loadRetestExams = async () => {
        const userToken = localStorage.getItem("accessToken");
        try {
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            const response = await api.get(url.RETEST.LIST);
            setRetestExam(response.data.data);
        } catch (error) {}
    };

    //hiển thị tên exam
    const fetchExamName = async () => {
        const userToken = localStorage.getItem("accessToken");
        try {
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            const response = await api.get(url.EXAM.LIST);
            const examData = response.data.reduce((acc, curr) => {
                acc[curr.id] = curr.name;
                return acc;
            }, {});
            setExamName(examData);
        } catch (error) {}
    };

    //hien thi ten sinh vien
    const fetchStudentName = async () => {
        try {
            const response = await api.get(url.STUDENT.LIST);
            const studentData = response.data.reduce((acc, curr) => {
                acc[curr.id] = curr.fullname;
                return acc;
            }, {});
            setStudentName(studentData);
        } catch (error) {}
    };

    //xử lý xác nhận thi lại
    const handleConfirmClick = async (selectedItem) => {
        try {
            const userToken = localStorage.getItem("accessToken");

            const config = {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            };

            const isConfirmed = await Swal.fire({
                title: "Reconfirm?",
                text: "Confirmation for students to retake the exam?",
                icon: "info",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirm",
            });

            if (isConfirmed.isConfirmed) {
                api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
                const updateResponse = await api.put(
                    url.RETEST.CONFIRM,
                    {
                        id: selectedItem.id,
                    },
                    config
                );
                toast.success("Confirmation of successful retest.", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
                await api.get(url.RETEST.LIST);
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                toast.error("Your account does not have enough permissions to confirm retest!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
            } else {
                setError(error);
            }
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

                if (userRole === "Teacher") {
                    setError(true);
                }
            } catch (error) {
                console.error("Error loading user role:", error);
            }
        };

        fetchUserRole();
    }, [navigate]);

    useEffect(() => {
        loadRetestExams();
        fetchExamName();
        fetchStudentName();
    }, []);
    return (
        <>
            {loading ? <Loading /> : ""}
            {error ? (
                <NotFound />
            ) : (
                <>
                    <Helmet>
                        <title>Retest | Examonimy</title>
                    </Helmet>
                    <Layout>
                        <div className="page-header">
                            <div className="row align-items-center">
                                <div className="col">
                                    <h3 className="page-title">List of re-exam registrations</h3>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card card-table">
                                    <div className="card-body">
                                        <div className="page-header">
                                            <div className="row align-items-center">
                                                <h5 className="card-title">
                                                    Exam
                                                    <NavLink to={`/test-create`} data-bs-toggle="modal" data-bs-target="#signup-modal" className="btn btn-primary float-sm-end m-l-10">
                                                        Add New Test
                                                    </NavLink>
                                                </h5>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table border-0 star-student table-hover table-center mb-0 datatable table-striped">
                                                <thead className="student-thread">
                                                    <tr>
                                                        <th>Ordinal</th>
                                                        <th>Exam</th>
                                                        <th>Student</th>
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {retestExam.map((item, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{examName[item.exam_id]}</td>
                                                                <td>{studentName[item.student_id]}</td>
                                                                <td>{item.status === 0 ? "Retest has not been confirmed" : "Retest has been confirmed"}</td>
                                                                <td>
                                                                    {item.status === 0 ? (
                                                                        <span className="badge badge-soft-warning" style={{ cursor: "pointer" }} onClick={() => handleConfirmClick(item)}>
                                                                            Unconfimred
                                                                        </span>
                                                                    ) : item.status === 1 ? (
                                                                        <span className="badge badge-soft-info">Confirmed</span>
                                                                    ) : (
                                                                        <span className="badge badge-soft-success">Exam taken</span>
                                                                    )}
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
                                                to="/retest-byhand-create"
                                                style={{
                                                    color: "white",
                                                }}
                                            >
                                                <button class="btn btn-primary" data-bs-dismiss="modal">
                                                    Multiple choice
                                                </button>
                                            </NavLink>
                                            <NavLink
                                                to="/retest-essay-byhand-create"
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
            )}
        </>
    );
}
export default Retest_List;
