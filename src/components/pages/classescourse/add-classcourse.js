import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import api from "../../services/api";
import url from "../../services/url";
import Layout from "../../layouts/layouts";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Loading from "../../layouts/loading";
function Add_ClassCourse() {
    const [userRole, setUserRole] = useState(null);
    const animatedComponents = makeAnimated();
    const [isClearable, setIsClearable] = useState(true);
    const [isSearchable, setIsSearchable] = useState(true);
    const [course, setCourses] = useState([]);
    const [classes, setClasses] = useState([]);
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    const currentTime = "00:00";
    const todayDateTimeLocal = `${year}-${month}-${day}T${currentTime}`; //chỉ cho người dùng chọn từ ngay hôm nay trở đi
    const navigate = useNavigate();
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    });

    const [formCourseClass, setFormCourseClass] = useState({
        course_id: "",
        class_id: "",
        start_date: "",
        end_date: "",
        created_by: "",
    });
    const [errors, setErrors] = useState({});
    const validateForm = () => {
        //validate cho thông tin bài test
        let valid = true;
        const newErrors = {};
        if (formCourseClass.course_id === "") {
            newErrors.course_id = "Please choose course";
            valid = false;
        }
        if (formCourseClass.class_id === "") {
            newErrors.class_id = "Please choose class";
            valid = false;
        }
        if (formCourseClass.start_date === "") {
            newErrors.start_date = "Please choose start date";
            valid = false;
        }
        if (formCourseClass.end_date === "") {
            newErrors.end_date = "Please choose end date";
            valid = false;
        }
        const start_date = new Date(formCourseClass.start_date);
        const end_date = new Date(formCourseClass.end_date);
        if (start_date >= end_date) {
            newErrors.start_date = "Start Date must be before End Date";
            valid = false;
        }
        setErrors(newErrors);
        return valid;
    };
    //hiển thị select course
    useEffect(() => {
        const fetchCourses = async () => {
            const userToken = localStorage.getItem("accessToken");
            try {
                api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
                const response = await api.get(url.COURSE.LIST);
                const courseData = response.data.data.map((course) => ({
                    value: course.id,
                    label: course.name,
                }));
                setCourses(courseData);
            } catch (error) {}
        };
        fetchCourses();
    }, []);
    const optionsCourse = course;
    const handleChangeCourse = (selectedOption) => {
        if (selectedOption) {
            setFormCourseClass({
                ...formCourseClass,
                course_id: selectedOption.value,
            });
        } else {
            setFormCourseClass({
                ...formCourseClass,
                course_id: "",
            });
        }
    };

    //hiển thị select classes
    useEffect(() => {
        const fetchClasses = async () => {
            const userToken = localStorage.getItem("accessToken");
            try {
                api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
                const response = await api.get(url.CLASS.LIST);
                const classData = response.data.map((classes) => ({
                    value: classes.id,
                    label: classes.name,
                }));
                setClasses(classData);
            } catch (error) {}
        };
        fetchClasses();
    }, []);
    const optionsClasses = classes;
    const hanldeChangeClasses = (selectedOption) => {
        if (selectedOption) {
            setFormCourseClass({
                ...formCourseClass,
                class_id: selectedOption.value,
            });
        } else {
            setFormCourseClass({
                ...formCourseClass,
                class_id: "",
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const userToken = localStorage.getItem("accessToken");
            try {
                api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
                const updatedFormExam = {
                    ...formCourseClass,
                    created_by: loggedInUser || "",
                };
                const rs = await api.post(url.ClassCourse.CREATE, updatedFormExam);
                toast.success("Add course with class successful.", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 5000,
                });
                // setTimeout(() => {
                //     navigate(`/courseclass-list`);
                // }, 5000);
            } catch (error) {
                // console.error("Error creating test:", error);
                // console.error("Response data:", error.response.data);
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
        setFormCourseClass({ ...formCourseClass, [name]: value });
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
            setFormCourseClass((prevFormExam) => ({
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
                            <h3 className="page-title">Add Course For Class</h3>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="card-title">Information Course Of Class</h5>
                                </div>
                                <div class="card-body">
                                    <div className="row">
                                        <div class="form-group col-12 col-sm-6">
                                            <label>Course</label>
                                            <Select
                                                options={optionsCourse}
                                                isSearchable={isSearchable}
                                                isClearable={isClearable}
                                                value={optionsCourse.find((option) => option.value === formCourseClass.course_id)}
                                                onChange={handleChangeCourse}
                                                name="course_id"
                                                placeholder="Select Course"
                                            />
                                            {errors.course_id && <div className="text-danger">{errors.course_id}</div>}
                                        </div>
                                        <div className="form-group col-12 col-sm-6">
                                            <label>Class</label>
                                            <Select
                                                options={optionsClasses}
                                                isSearchable={isSearchable}
                                                isClearable={isClearable}
                                                value={optionsClasses.find((option) => option.value === formCourseClass.classes_id)}
                                                onChange={hanldeChangeClasses}
                                                name="class_id"
                                                placeholder="Select Class..."
                                            />
                                            {errors.class_id && <div className="text-danger">{errors.class_id}</div>}
                                        </div>
                                        <div class="form-group col-12 col-sm-6">
                                            <label>Start Date Time</label>
                                            <input
                                                className="form-control"
                                                type="datetime-local"
                                                name="start_date"
                                                value={formCourseClass.start_date}
                                                onChange={handleChange}
                                                min={todayDateTimeLocal}
                                            />
                                            {errors.start_date && <div className="text-danger">{errors.start_date}</div>}
                                        </div>
                                        <div class="form-group col-12 col-sm-6">
                                            <label>End Date Time</label>
                                            <input
                                                className="form-control"
                                                type="datetime-local"
                                                name="end_date"
                                                value={formCourseClass.end_date}
                                                onChange={handleChange}
                                                min={formCourseClass.start_date}
                                            />
                                            {errors.end_date && <div className="text-danger">{errors.end_date}</div>}
                                        </div>
                                        <div className="text-end">
                                            <button type="submit" className="btn btn-primary">
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ToastContainer />
                    </div>
                </form>
            </Layout>
        </>
    );
}
export default Add_ClassCourse;
