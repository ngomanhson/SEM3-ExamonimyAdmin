import { useEffect, useState } from "react";
import api from "../../services/api";
import url from "../../services/url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Layout from "../../layouts/layouts";
import { Helmet } from "react-helmet";
import Loading from "../../layouts/loading";
function Course_Create() {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    });

    const [formCourse, setFormCourse] = useState({
        name: "",
        course_code: "",
        created_by: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        course_code: "",
        created_by: "",
    });

    const [courseCodeExistsError, setCourseCodeExistsError] = useState("");

    const validateForm = async () => {
        let valid = true;
        const newErrors = {};

        if (formCourse.name === "") {
            newErrors.name = "Please enter course name";
            valid = false;
        } else if (formCourse.name.length < 3) {
            newErrors.name = "The class name must be at least 3 characters";
            valid = false;
        } else if (formCourse.name.length > 50) {
            newErrors.name = "Class name must be less than 50 characters";
            valid = false;
        }

        if (formCourse.course_code === "") {
            newErrors.course_code = "Please enter course code ";
            valid = false;
        } else if (formCourse.course_code.length < 3) {
            newErrors.course_code = "course_code must have at least 3 characters";
            valid = false;
        } else if (formCourse.course_code.length > 50) {
            newErrors.course_code = "course_code must be less than 50 characters";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const userToken = localStorage.getItem("accessToken");
            try {
                api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
                const updatedFormExam = {
                    ...formCourse,
                    created_by: loggedInUser || "",
                };
                const rs = await api.post(url.COURSE.CREATE, updatedFormExam);
                toast.success("To successfully create a course, continue to choose the class for the course.", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 5000,
                });
                setTimeout(() => {
                    navigate(`/course-list`); //chuyển đến trang course-class
                }, 5000);
            } catch (error) {
                if (error.response.status === 400 && error.response.data === "Course code already exists") {
                    setCourseCodeExistsError("The course code already exists");
                } else {
                }
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

                if (userRole === "Teacher" || userRole === "Staff") {
                    navigate("/404");
                }
            } catch (error) {
                console.error("Error loading user role:", error);
            }
        };

        fetchUserRole();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormCourse({ ...formCourse, [name]: value });
        setCourseCodeExistsError("");
    };

    //created_by
    useEffect(() => {
        const fetchLoggedInUser = async () => {
            const token = localStorage.getItem("accessToken");
            try {
                const decodedToken = JSON.parse(atob(token.split(".")[1]));
                const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
                setLoggedInUser(userId);
            } catch (error) {}
        };

        fetchLoggedInUser();
    }, []);

    useEffect(() => {
        if (loggedInUser) {
            setFormCourse((prevFormExam) => ({
                ...prevFormExam,
                created_by: loggedInUser,
            }));
        }
    }, [loggedInUser]);

    return (
        <>
            {loading ? <Loading /> : ""}
            <Helmet>
                <title>Course | Examonimy</title>
            </Helmet>
            <Layout>
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="page-title">Add Course</h3>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-12">
                                            <h5 className="form-title">
                                                <span>Course Information</span>
                                            </h5>
                                        </div>
                                        <div className="col-12 col-sm-4">
                                            <div className="form-group local-forms">
                                                <label>
                                                    Course Name <span className="login-danger">*</span>
                                                </label>
                                                <input type="text" className="form-control" name="name" value={formCourse.name} onChange={handleChange} />
                                                {errors.name && <div className="text-danger">{errors.name}</div>}
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-4">
                                            <div className="form-group local-forms">
                                                <label>
                                                    Course Code <span className="login-danger">*</span>
                                                </label>
                                                <input type="text" className="form-control" name="course_code" value={formCourse.course_code} onChange={handleChange} />
                                                {errors.course_code && <div className="text-danger">{errors.course_code}</div>}
                                                {courseCodeExistsError && <div className="text-danger">{errors.name}</div>}
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="student-submit">
                                                <button type="submit" className="btn btn-primary">
                                                    Create Course
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
    );
}
export default Course_Create;
