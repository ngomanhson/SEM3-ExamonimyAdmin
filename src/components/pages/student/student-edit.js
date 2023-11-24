import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../services/api";
import url from "../../services/url";
import { format } from "date-fns";
import Layout from "../../layouts/layouts";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Loading from "../../layouts/loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Student_Edit() {
    const { student_code } = useParams();
    const [studentData, setStudentData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    });
    const navigate = useNavigate();
    useEffect(() => {
        api.get(`${url.STUDENT.DETAIL}?code_student=${student_code}`)
            .then((response) => {
                const initialStudentData = {
                    ...response.data,
                    birthday: format(new Date(response.data.birthday), "yyyy-MM-dd"),
                };
                setStudentData(initialStudentData);
            })
            .catch((error) => {
                console.error("Error fetching student details:", error);
            });
    }, [student_code]);

    const [errors, setErrors] = useState({});

    const [classes, setClasses] = useState([]);
    const [studentCodeExistsError, setStudentCodeExistsError] = useState("");

    const validateForm = async () => {
        let valid = true;
        const newErrors = {};

        if (studentData.student_code.trim() === "") {
            newErrors.student_code = "Please enter student code";
            valid = false;
        } else if (studentData.student_code.length < 3) {
            newErrors.student_code = "The student code must be at least 3 characters";
            valid = false;
        } else if (studentData.student_code.length > 100) {
            newErrors.student_code = "Student code must be less than 100 characters";
            valid = false;
        }

        if (studentData.fullname.trim() === "") {
            newErrors.fullname = "Please enter full name";
            valid = false;
        } else if (studentData.fullname.length < 3) {
            newErrors.fullname = "The fullname must be at least 3 characters";
            valid = false;
        } else if (studentData.fullname.length > 255) {
            newErrors.fullname = "Fullname must be less than 255 characters";
            valid = false;
        }

        if (studentData.avatar === "") {
            newErrors.avatar = "Please choose avatar";
            valid = false;
        }

        if (studentData.birthday.trim() === "") {
            newErrors.birthday = "Please enter birthday";
            valid = false;
        }

        if (studentData.email.trim() === "") {
            newErrors.email = "Please enter email address";
            valid = false;
        }

        if (studentData.phone.trim() === "") {
            newErrors.phone = "Please enter phone number";
            valid = false;
        } else if (studentData.phone.length < 10) {
            newErrors.phone = "Enter at least 10 characters";
            valid = false;
        } else if (studentData.phone.length > 12) {
            newErrors.phone = "Enter up to 12 characters";
            valid = false;
        }

        if (studentData.gender.trim() === "") {
            newErrors.gender = "Please choose a gender";
            valid = false;
        }

        if (studentData.address.trim() === "") {
            newErrors.address = "Please enter address";
            valid = false;
        }

        if (typeof studentData.class_id === "string" && studentData.class_id.trim() === "") {
            newErrors.class_id = "Please enter class";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    // hiển thị thông báo suawr sinh viên thành công
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

    //xử lý sửa sinh viên
    const handleSubmit = async (e) => {
        e.preventDefault();
        const isFormValid = await validateForm();

        if (isFormValid) {
            const userToken = localStorage.getItem("accessToken");
            try {
                const formData = new FormData();
                for (const key in studentData) {
                    formData.append(key, studentData[key]);
                }
                api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
                const response = await api.put(url.STUDENT.EDIT, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Update Student Successfuly", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 5000,
                });
                showNotification("success", "Successfully edited student information!");
                // Sử dụng navigate để chuyển hướng đến "/student-list"
                navigate("/student-list");
            } catch (error) {
                if (error.response) {
                    const { status, data } = error.response;
                    if (status === 400) {
                        if (data === "Student code already exists") {
                            setStudentCodeExistsError("Student code already exists"); // Kiểm tra mã sinh viên
                        } else {
                            setErrors(data);
                        }
                    } else {
                        console.error("Student information cannot be edited:", error);
                    }
                }
                showNotification(
                    "danger",
                    "Student information cannot be edited, please check the information again. This student code may overlap with another student code or the information you entered is incorrect."
                );
            }
        }
    };

    //hiển thị select lớp học
    useEffect(() => {
        const fetchClasses = async () => {
            const userToken = localStorage.getItem("accessToken");
            try {
                api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
                const response = await api.get(url.CLASS.LIST);
                setClasses(response.data);
            } catch (error) {}
        };
        fetchClasses();
    }, []);

    //con mắt hiển thị passwor
    const renderStudentImage = () => {
        return (
            <img
                src={studentData.avatar instanceof Blob ? URL.createObjectURL(studentData.avatar) : studentData.avatar} // Hiển thị tệp mới nếu có, hoặc URL hình ảnh đã có sẵn
                alt="Student Avatar"
                width="150"
                height="150"
            />
        );
    };

    return (
        <>
            {loading ? <Loading /> : ""}
            <Helmet>
                <title>Student | Examonimy</title>
            </Helmet>
            <Layout>
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="page-title">Edit Student</h3>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12">
                        <div className="card comman-shadow">
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-12">
                                            <h5 className="form-title student-info">
                                                Student Information
                                                <span>
                                                    <a href="javascript:;">
                                                        <i className="feather-more-vertical"></i>
                                                    </a>
                                                </span>
                                            </h5>
                                        </div>
                                        <div id="notification-container"></div>

                                        <div className="col-12 col-sm-4">
                                            <div className="form-group local-forms">
                                                <label>
                                                    Student Code <span className="login-danger">*</span>
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    value={studentData.student_code}
                                                    onChange={(e) =>
                                                        setStudentData({
                                                            ...studentData,
                                                            student_code: e.target.value,
                                                        })
                                                    }
                                                />
                                                {errors.student_code && <div className="text-danger">{errors.student_code}</div>}
                                                {studentCodeExistsError && <div className="text-danger">{studentCodeExistsError}</div>}
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-4">
                                            <div className="form-group local-forms">
                                                <label>
                                                    Full Name <span className="login-danger">*</span>
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    value={studentData.fullname}
                                                    onChange={(e) =>
                                                        setStudentData({
                                                            ...studentData,
                                                            fullname: e.target.value,
                                                        })
                                                    }
                                                />
                                                {errors.fullname && <div className="text-danger">{errors.fullname}</div>}
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-4">
                                            <div className="form-group local-forms">
                                                <label>
                                                    Gender <span className="login-danger">*</span>
                                                </label>
                                                <select
                                                    className="form-control select"
                                                    value={studentData.gender}
                                                    onChange={(e) =>
                                                        setStudentData({
                                                            ...studentData,
                                                            gender: e.target.value,
                                                        })
                                                    }
                                                >
                                                    <option>Male</option>
                                                    <option>Female</option>
                                                    <option>Others</option>
                                                </select>
                                                {errors.gender && <div className="text-danger">{errors.gender}</div>}
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-4">
                                            <div className="form-group local-forms">
                                                <label>
                                                    Date Of Birth <span className="login-danger">*</span>
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="date"
                                                    value={studentData.birthday}
                                                    onChange={(e) =>
                                                        setStudentData({
                                                            ...studentData,
                                                            birthday: e.target.value,
                                                        })
                                                    }
                                                />
                                                {errors.birthday && <div className="text-danger">{errors.birthday}</div>}
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-4">
                                            <div className="form-group local-forms">
                                                <label>
                                                    Email <span className="login-danger">*</span>
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="email"
                                                    value={studentData.email}
                                                    onChange={(e) =>
                                                        setStudentData({
                                                            ...studentData,
                                                            email: e.target.value,
                                                        })
                                                    }
                                                />
                                                {errors.email && <div className="text-danger">{errors.email}</div>}
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-4">
                                            <div className="form-group local-forms">
                                                <label>
                                                    Phone Number <span className="login-danger">*</span>
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="number"
                                                    value={studentData.phone}
                                                    onChange={(e) =>
                                                        setStudentData({
                                                            ...studentData,
                                                            phone: e.target.value,
                                                        })
                                                    }
                                                />
                                                {errors.phone && <div className="text-danger">{errors.phone}</div>}
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-4">
                                            <div className="form-group local-forms">
                                                <label>
                                                    Address <span className="login-danger">*</span>
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    value={studentData.address}
                                                    onChange={(e) =>
                                                        setStudentData({
                                                            ...studentData,
                                                            address: e.target.value,
                                                        })
                                                    }
                                                />
                                                {errors.address && <div className="text-danger">{errors.address}</div>}
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-4">
                                            <div className="form-group local-forms">
                                                <label>
                                                    Class Name <span className="login-danger">*</span>
                                                </label>
                                                <select
                                                    className="form-control select"
                                                    value={studentData.class_id}
                                                    onChange={(e) =>
                                                        setStudentData({
                                                            ...studentData,
                                                            class_id: e.target.value,
                                                        })
                                                    }
                                                >
                                                    {classes.map((classItem) => (
                                                        <option key={classItem.id} value={classItem.id}>
                                                            {classItem.name}
                                                        </option>
                                                    ))}
                                                </select>

                                                {errors.class_id && <div className="text-danger">{errors.class_id}</div>}
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-4">
                                            <div className="form-group students-up-files">
                                                <label>
                                                    Update Student Photo (150px X 150px)
                                                    <span className="login-danger">*</span>
                                                </label>
                                                {renderStudentImage()}
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        setStudentData({
                                                            ...studentData,
                                                            avatar: file, // Update the avatar with the selected file
                                                        });
                                                    }}
                                                />
                                                {errors.avatar && <div className="text-danger">{errors.avatar}</div>}
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <h5 className="form-title">
                                                <span>Updated login accounts for students</span>
                                            </h5>
                                        </div>

                                        <div className="col-12">
                                            <div className="student-submit">
                                                <button type="submit" className="btn btn-primary">
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
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
export default Student_Edit;
