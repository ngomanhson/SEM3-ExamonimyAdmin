import { useEffect, useState } from "react";
import api from "../../services/api";
import url from "../../services/url";
import { format } from "date-fns";
import Layout from "../../layouts/layouts";
import { Helmet } from "react-helmet";
import Loading from "../../layouts/loading";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import NotFound from "../../pages/other/not-found";
function Course_List() {
    const [courses, setCourses] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    });
    //hiển thị danh sách lớp
    const loadCourses = async () => {
        const userToken = localStorage.getItem("accessToken");
        try {
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            const response = await api.get(url.COURSE.LIST);
            setCourses(response.data.data);
        } catch (error) {}
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
        loadCourses();
    }, []);
    return (
        <>
            {loading ? <Loading /> : ""}
            {error ? (
                <NotFound />
            ) : (
                <>
                    <Helmet>
                        <title>Course | Examonimy</title>
                    </Helmet>
                    <Layout>
                        <div className="page-header">
                            <div className="row align-items-center">
                                <div className="col">
                                    <h3 className="page-title">Courses List</h3>
                                </div>
                            </div>
                        </div>

                        <div className="student-group-form">
                            <div className="row">
                                <div className="col-lg-3 col-md-6">
                                    <div className="form-group">
                                        <input type="text" className="form-control" placeholder="Search by ID ..." />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6">
                                    <div className="form-group">
                                        <input type="text" className="form-control" placeholder="Search by Name ..." />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div className="form-group">
                                        <input type="text" className="form-control" placeholder="Search by className ..." />
                                    </div>
                                </div>
                                <div className="col-lg-2">
                                    <div className="search-student-btn">
                                        <button type="btn" className="btn btn-primary">
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card card-table">
                                    <div className="card-body">
                                        <div className="page-header">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <h3 className="page-title">Courses</h3>
                                                </div>
                                                <div className="col-auto text-end float-end ms-auto download-grp">
                                                    <a href="#" className="btn btn-outline-primary me-2">
                                                        <i className="fas fa-download"></i> Download
                                                    </a>
                                                    {userRole === "Super Admin" ? (
                                                        <NavLink to="/course-create" className="btn btn-primary">
                                                            <i className="fas fa-plus"></i>
                                                        </NavLink>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="table-responsive">
                                            <table className="table border-0 star-student table-hover table-center mb-0 datatable table-striped">
                                                <thead className="student-thread">
                                                    <tr>
                                                        <th>
                                                            <div className="form-check check-tables">
                                                                <input className="form-check-input" type="checkbox" value="something" />
                                                            </div>
                                                        </th>
                                                        <th>Ordinal</th>
                                                        <th>Name Course</th>
                                                        <th>Code Course</th>
                                                        <th className="text-end">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {courses.map((item, index) => {
                                                        return (
                                                            <tr>
                                                                <td>
                                                                    <div className="form-check check-tables">
                                                                        <input className="form-check-input" type="checkbox" value="something" />
                                                                    </div>
                                                                </td>
                                                                <td>{index + 1}</td>
                                                                <td>{item.name}</td>
                                                                <td>{item.course_code}</td>
                                                                <td className="text-end">
                                                                    <div className="actions">
                                                                        <a href="javascript:;" className="btn btn-sm bg-success-light me-2">
                                                                            <i className="feather-eye"></i>
                                                                        </a>
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
                    </Layout>
                </>
            )}
        </>
    );
}
export default Course_List;
