import { NavLink } from "react-router-dom";
import Select from "react-select";
import api from "../../services/api";
import url from "../../services/url";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../../layouts/layouts";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
function Exam_Create() {
    const [userRole, setUserRole] = useState(null);
    const [isSearchable, setIsSearchable] = useState(true);
    const [isClearable, setIsClearable] = useState(true);
    const [courses, setCourses] = useState([]);
    const [creator, setCreator] = useState([]);
    const [nameExistsError, setNameExistsError] = useState("");
    const today = new Date().toISOString().split("T")[0];
    const navigate = useNavigate();
    const [formExam, setFormExam] = useState({
        name: "",
        start_date: "",
        courseClass_id: "",
        created_by: "",
    });
    const [errors, setErrors] = useState({
        name: "",
        start_date: "",
        courseClass_id: "",
        created_by: "",
    });

    //validate
    const validateForm = async () => {
        let valid = true;
        const newErrors = {};

        if (formExam.name === "") {
            newErrors.name = "Please enter name";
            valid = false;
        } else if (formExam.name.length < 3) {
            newErrors.name = "Enter at least 3 characters";
            valid = false;
        } else if (formExam.name.length > 255) {
            newErrors.name = "Enter up to 255 characters";
            valid = false;
        }

        if (formExam.courseClass_id === "") {
            newErrors.courseClass_id = "Please enter course";
            valid = false;
        }

        if (formExam.start_date === "") {
            newErrors.start_date = "Please enter start date";
            valid = false;
        }

        if (formExam.created_by === "") {
            newErrors.created_by = "Please enter creator";
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
                const rs = await api.post(url.EXAM.CREATE, formExam);
                toast.success("Create Exam Successfully", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
            } catch (error) {
                if (error.response.status === 400 && error.response.data === "Exam name already exists") {
                    setNameExistsError("This exam name already exists");
                } else {
                    // showNotification("danger", "Failed to create exam.");
                }
            }
        }
    };

    //hiển thị select course
    useEffect(() => {
        const fetchCourses = async () => {
            const userToken = localStorage.getItem("accessToken");
            try {
                api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
                const response = await api.get(url.ClassCourse.LIST);
                const courseData = response.data.data.map((course) => ({
                    value: course.id,
                    label: course.courseName,
                }));
                setCourses(courseData);
            } catch (error) {}
        };
        fetchCourses();
    }, []);

    //hiển thị select creator
    useEffect(() => {
        const fetchCreators = async () => {
            try {
                const response = await api.get(url.STAFF.LIST);
                const creatorData = response.data.map((creator) => ({
                    value: creator.id,
                    label: creator.fullname,
                }));
                setCreator(creatorData);
            } catch (error) {}
        };
        fetchCreators();
    }, []);
    const optionsCreator = creator;
    const handleChangeCreator = (selectedOption) => {
        setFormExam({ ...formExam, created_by: selectedOption.value });
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
        setFormExam({ ...formExam, [name]: value });
        setNameExistsError("");
    };
    return (
        <>
            <Helmet>
                <title>Exam | Examonimy</title>
            </Helmet>
            <Layout>
                <div className="page-header">
                    <div className="row">
                        <div className="col">
                            <h3 className="page-title">Create Exam</h3>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-12">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title">Exam Information</h5>
                            </div>
                            <div class="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label>
                                            Exam Name
                                            <span className="login-danger">*</span>
                                        </label>
                                        <input className="form-control" type="text" name="name" value={formExam.name} onChange={handleChange} placeholder="Enter Exam Name" />
                                        {errors.name && <div className="text-danger">{errors.name}</div>}
                                        {nameExistsError && <div className="text-danger">{nameExistsError}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            Exam Day
                                            <span className="login-danger">*</span>
                                        </label>
                                        <input className="form-control" type="date" name="start_date" value={formExam.start_date} onChange={handleChange} min={today} />
                                        {errors.start_date && <div className="text-danger">{errors.start_date}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            Course
                                            <span className="login-danger">*</span>
                                        </label>
                                        <Select
                                            options={courses}
                                            isSearchable={isSearchable}
                                            isClearable={isClearable}
                                            name="courseClass_id"
                                            value={courses.find((option) => option.value === formExam.courseClass_id)}
                                            onChange={(selectedOption) => {
                                                setFormExam({
                                                    ...formExam,
                                                    courseClass_id: selectedOption.value,
                                                });
                                            }}
                                            placeholder="Select Course"
                                        />
                                        {errors.courseClass_id && <div className="text-danger">{errors.courseClass_id}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            Creator
                                            <span className="login-danger">*</span>
                                        </label>
                                        <Select
                                            options={optionsCreator}
                                            isSearchable={isSearchable}
                                            isClearable={isClearable}
                                            name="created_by"
                                            value={optionsCreator.find((option) => option.value === formExam.created_by)}
                                            onChange={handleChangeCreator}
                                            placeholder="Select Creator"
                                        />
                                        {errors.created_by && <div className="text-danger">{errors.created_by}</div>}
                                    </div>
                                    <div class="form-group"></div>
                                    <div className="text-end">
                                        <button type="submit" className="btn btn-primary">
                                            Create
                                        </button>
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
export default Exam_Create;
