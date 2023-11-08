import { useEffect, useState } from "react";
import api from "../../services/api";
import url from "../../services/url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function Course_Create() {
    const navigate = useNavigate();
    const [formCourse, setFormCourse] = useState({
        name: "",
        course_code: "",
        created_by: 1,
    });

    const [errors, setErrors] = useState({
        name: "",
        course_code: "",
        created_by: 1,
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
            newErrors.course_code =
                "course_code must have at least 3 characters";
            valid = false;
        } else if (formCourse.course_code.length > 50) {
            newErrors.course_code =
                "course_code must be less than 50 characters";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const rs = await api.post(url.COURSE.CREATE, formCourse);
                toast.success(
                    "To successfully create a course, continue to choose the class for the course.",
                    {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 5000,
                    }
                );
                setTimeout(() => {
                    navigate(`/course-class-create`); //chuyển đến trang course-class
                }, 5000);
            } catch (error) {
                if (
                    error.response.status === 400 &&
                    error.response.data === "Course code already exists"
                ) {
                    setCourseCodeExistsError("The course code already exists");
                } else {
                }
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormCourse({ ...formCourse, [name]: value });
        setCourseCodeExistsError("");
    };

    return (
        <>
            <div className="page-header">
                <div className="row align-items-center">
                    <div className="col">
                        <h3 className="page-title">Add Course</h3>
                    </div>
                </div>
            </div>

            <div className="row">
                <div class="col-md-9">
                    <ul class="list-links mb-4">
                        <li className="active">
                            <NavLink to="">Create Course</NavLink>
                        </li>
                        <li>
                            <NavLink to="/course-class-create">
                                Create Course with Class
                            </NavLink>
                        </li>
                    </ul>
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
                                                Course Name{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="name"
                                                value={formCourse.name}
                                                onChange={handleChange}
                                            />
                                            {errors.name && (
                                                <div className="text-danger">
                                                    {errors.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <div className="form-group local-forms">
                                            <label>
                                                Course Code{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="course_code"
                                                value={formCourse.course_code}
                                                onChange={handleChange}
                                            />
                                            {errors.course_code && (
                                                <div className="text-danger">
                                                    {errors.course_code}
                                                </div>
                                            )}
                                            {courseCodeExistsError && (
                                                <div className="text-danger">
                                                    {errors.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="student-submit">
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                            >
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
        </>
    );
}
export default Course_Create;
