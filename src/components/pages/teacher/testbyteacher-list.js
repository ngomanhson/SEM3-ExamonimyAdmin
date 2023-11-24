import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import url from "../../services/url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import { useJwt } from "react-jwt";
import Layout from "../../layouts/layouts";
import Loading from "../../layouts/loading";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import NotFound from "../../pages/other/not-found";
function TestByTeacher_List() {
    const [tests, setTests] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    //in ra danh sách bài test theo teacher
    const loadTestList = async () => {
        const userToken = localStorage.getItem("accessToken");
        try {
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            const response = await api.get(url.TEST.TESTOFTEACHER);
            setTests(response.data);
        } catch (error) {
            if (error.response.status === 403) {
                setError(true);
                return;
            }
        }
    };

    useEffect(() => {
        loadTestList();
    }, []);

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
    return (
        <>
            {loading ? <Loading /> : ""}
            {error ? (
                <NotFound />
            ) : (
                <>
                    <Helmet>
                        <title>Test | Examonimy</title>
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
                                        <div className="table-responsive">
                                            <table className="table border-0 star-student table-hover table-center mb-0 datatable table-striped">
                                                <thead className="student-thread">
                                                    <tr>
                                                        <th>Ordinal</th>
                                                        <th>Name Test</th>
                                                        <th>Name Class</th>
                                                        <th>Start Date Time</th>
                                                        <th>End Date Time</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {tests.map((item, index) => {
                                                        return (
                                                            <tr>
                                                                <td>{index + 1}</td>
                                                                <td>{item.testName}</td>
                                                                <td>{item.className}</td>
                                                                <td>{format(new Date(item.startDate), "yyyy-MM-dd HH:mm")}</td>
                                                                <td>{format(new Date(item.endDate), "yyyy-MM-dd HH:mm")}</td>
                                                                <td>
                                                                    <span className="badge badge-soft-info">View</span>
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
                        <ToastContainer />
                    </Layout>
                </>
            )}
        </>
    );
}
export default TestByTeacher_List;
