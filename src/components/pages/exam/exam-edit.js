import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../services/api";
import url from "../../services/url";
import Select from "react-select";
import { format } from "date-fns";
import Layout from "../../layouts/layouts";
import { Helmet } from "react-helmet";
function Exam_Edit() {
    const { slug } = useParams();
    const [isSearchable, setIsSearchable] = useState(true);
    const [isClearable, setIsClearable] = useState(true);
    const [examData, setExamData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [nameExistsError, setNameExistsError] = useState("");
    const today = new Date().toISOString().split("T")[0];

    const [errors, setErrors] = useState({
        name: "",
        start_date: "",
        courseClass_id: "",
        created_by: "",
    });

    const validateForm = async () => {
        let valid = true;
        const newErrors = {};

        if (examData.name === "") {
            newErrors.name = "Please enter exam name";
            valid = false;
        } else if (examData.name.length < 3) {
            newErrors.name = "Enter at least 3 characters";
            valid = false;
        } else if (examData.name.length > 255) {
            newErrors.name = "Enter up to 255 characters";
            valid = false;
        }

        if (examData.courseClass_id === "") {
            newErrors.courseClass_id = "Please enter course";
            valid = false;
        }

        if (examData.start_date === "") {
            newErrors.start_date = "Please enter start date";
            valid = false;
        }

        if (examData.created_by === "") {
            newErrors.created_by = "Please enter creator";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const showNotification = (type, message) => {
        const notificationContainer = document.getElementById("notification-container");
        const notification = document.createElement("div");
        notification.className = `alert alert-${type}`;
        notification.textContent = message;
        notificationContainer.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    };

    useEffect(() => {
        const userToken = localStorage.getItem("accessToken");
        api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
        api.get(`${url.EXAM.DETAIL}?slug=${slug}`)
            .then((response) => {
                const initialExamData = {
                    ...response.data,
                    start_date: format(new Date(response.data.start_date), "yyyy-MM-dd"),
                };
                setExamData(initialExamData);
                setIsLoading(false);
            })
            .catch((error) => {});
    }, [slug]);

    //xử lý sửa kì thi
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const userToken = localStorage.getItem("accessToken");
            try {
                api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
                const updatedFormExam = {
                    ...examData,
                    created_by: loggedInUser || "",
                };
                const rs = await api.put(`${url.EXAM.EDIT}?id=${examData.id}`, updatedFormExam);
                showNotification("success", "Exam updated successfully!");
            } catch (error) {
                if (error.response.status === 400 && error.response.data === "Exam name already exists") {
                    setNameExistsError("This exam name already exists");
                } else {
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
    const optionsCourse = courses;
    const handleChangeCourse = (selectedOption) => {
        setExamData({ ...examData, courseClass_id: selectedOption.value });
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
            setExamData((prevFormExam) => ({
                ...prevFormExam,
                created_by: loggedInUser,
            }));
        }
    }, [loggedInUser]);
    return (
        <>
            <Helmet>
                <title>Exam | Examonimy</title>
            </Helmet>
            <Layout>
                <div className="page-header">
                    <div className="row">
                        <div className="col">
                            <h3 className="page-title">Edit Exam</h3>
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
                                    <div id="notification-container"></div>

                                    <div className="form-group">
                                        <label>
                                            Exam Name
                                            <span className="login-danger">*</span>
                                        </label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={examData.name}
                                            onChange={(e) =>
                                                setExamData({
                                                    ...examData,
                                                    name: e.target.value,
                                                })
                                            }
                                        />
                                        {errors.name && <div className="text-danger">{errors.name}</div>}
                                        {nameExistsError && <div className="text-danger">{nameExistsError}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            Exam Day
                                            <span className="login-danger">*</span>
                                        </label>
                                        <input
                                            className="form-control"
                                            type="date"
                                            value={examData.start_date}
                                            onChange={(e) =>
                                                setExamData({
                                                    ...examData,
                                                    start_date: e.target.value,
                                                })
                                            }
                                            min={today}
                                        />
                                        {errors.start_date && <div className="text-danger">{errors.start_date}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            Course
                                            <span className="login-danger">*</span>
                                        </label>
                                        <Select
                                            options={optionsCourse}
                                            isSearchable={isSearchable}
                                            isClearable={isClearable}
                                            value={optionsCourse.find((option) => option.value === examData.courseClass_id)}
                                            onChange={handleChangeCourse}
                                        />
                                        {errors.courseClass_id && <div className="text-danger">{errors.courseClass_id}</div>}
                                    </div>
                                    <div class="form-group"></div>
                                    <div className="text-end">
                                        <button type="submit" className="btn btn-primary">
                                            Update
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}
export default Exam_Edit;
