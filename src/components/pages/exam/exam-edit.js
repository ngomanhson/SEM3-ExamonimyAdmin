import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../services/api";
import url from "../../services/url";
import Select from "react-select";
import { format } from "date-fns";

function Exam_Edit() {
    const { slug } = useParams();
    const [isSearchable, setIsSearchable] = useState(true);
    const [isClearable, setIsClearable] = useState(true);
    const [examData, setExamData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [creator, setCreator] = useState([]);
    const [nameExistsError, setNameExistsError] = useState("");
    const today = new Date().toISOString().split("T")[0];

    const [errors, setErrors] = useState({
        name: "",
        room: "",
        teacher_id: "",
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

        if (examData.course_id === "") {
            newErrors.course_id = "Please enter course";
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
        const notificationContainer = document.getElementById(
            "notification-container"
        );
        const notification = document.createElement("div");
        notification.className = `alert alert-${type}`;
        notification.textContent = message;
        notificationContainer.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    };

    useEffect(() => {
        api.get(`${url.EXAM.DETAIL}?slug=${slug}`)
            .then((response) => {
                const initialExamData = {
                    ...response.data,
                    start_date: format(
                        new Date(response.data.start_date),
                        "yyyy-MM-dd"
                    ),
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
            try {
                const rs = await api.put(
                    `${url.EXAM.EDIT}?id=${examData.id}`,
                    examData
                );
                showNotification("success", "Exam updated successfully!");
            } catch (error) {
                if (
                    error.response.status === 400 &&
                    error.response.data === "Exam name already exists"
                ) {
                    setNameExistsError("This exam name already exists");
                } else {
                }
            }
        }
    };

    //hiển thị select course
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get(url.COURSE.LIST);
                const courseData = response.data.map((courses) => ({
                    value: courses.id,
                    label: courses.name,
                }));
                setCourses(courseData);
            } catch (error) {}
        };
        fetchCourses();
    }, []);
    const optionsCourse = courses;
    const handleChangeCourse = (selectedOption) => {
        setExamData({ ...examData, course_id: selectedOption.value });
    };

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
        setExamData({ ...examData, created_by: selectedOption.value });
    };
    return (
        <>
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
                                    {errors.name && (
                                        <div className="text-danger">
                                            {errors.name}
                                        </div>
                                    )}
                                    {nameExistsError && (
                                        <div className="text-danger">
                                            {nameExistsError}
                                        </div>
                                    )}
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
                                    {errors.start_date && (
                                        <div className="text-danger">
                                            {errors.start_date}
                                        </div>
                                    )}
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
                                        value={optionsCourse.find(
                                            (option) =>
                                                option.value ===
                                                examData.course_id
                                        )}
                                        onChange={handleChangeCourse}
                                    />
                                    {errors.course_id && (
                                        <div className="text-danger">
                                            {errors.course_id}
                                        </div>
                                    )}
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
                                        value={optionsCreator.find(
                                            (option) =>
                                                option.value ===
                                                examData.created_by
                                        )}
                                        onChange={handleChangeCreator}
                                        placeholder="Select Creator"
                                    />
                                    {errors.created_by && (
                                        <div className="text-danger">
                                            {errors.created_by}
                                        </div>
                                    )}
                                </div>
                                <div class="form-group"></div>
                                <div className="text-end">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Exam_Edit;
