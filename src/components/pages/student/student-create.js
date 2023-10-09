import { useEffect, useState } from "react";
import api from "../../services/api";
import url from "../../services/url";
function Student_Create() {
    const [formStudent, setFormStudent] = useState({
        student_code: "",
        fullname: "",
        avatar: "",
        gender: "",
        birthday: "",
        email: "",
        phone: "",
        address: "",
        class_id: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        student_code: "",
        fullname: "",
        avatar: "",
        gender: "",
        birthday: "",
        email: "",
        phone: "",
        address: "",
        class_id: "",
        password: "",
    });

    const [classes, setClasses] = useState([]);
    const [studentCodeExistsError, setStudentCodeExistsError] = useState("");

    // tạo các validate cho các input
    const validateForm = async () => {
        let valid = true;
        const newErrors = {};

        if (formStudent.student_code === "") {
            newErrors.student_code = "Please enter student code";
            valid = false;
        } else if (formStudent.student_code.length < 3) {
            newErrors.student_code =
                "The student code must be at least 3 characters";
            valid = false;
        } else if (formStudent.student_code.length > 100) {
            newErrors.student_code =
                "Student code must be less than 100 characters";
            valid = false;
        }

        if (formStudent.fullname === "") {
            newErrors.fullname = "Please enter full name";
            valid = false;
        } else if (formStudent.fullname.length < 3) {
            newErrors.fullname = "The fullname must be at least 3 characters";
            valid = false;
        } else if (formStudent.fullname.length > 255) {
            newErrors.fullname = "Fullname must be less than 255 characters";
            valid = false;
        }

        if (formStudent.avatar === "") {
            newErrors.avatar = "Please choose avatar";
            valid = false;
        }

        if (formStudent.birthday === "") {
            newErrors.birthday = "Please enter birthday";
            valid = false;
        }

        if (formStudent.email === "") {
            newErrors.email = "Please enter email address";
            valid = false;
        }

        if (formStudent.phone === "") {
            newErrors.phone = "Please enter phone number";
            valid = false;
        } else if (formStudent.phone.length < 10) {
            newErrors.phone = "Enter at least 10 characters";
            valid = false;
        } else if (formStudent.phone.length > 12) {
            newErrors.phone = "Enter up to 12 characters";
            valid = false;
        }

        if (formStudent.gender === "") {
            newErrors.gender = "Please choose a gender";
            valid = false;
        }

        if (formStudent.address === "") {
            newErrors.address = "Please enter address";
            valid = false;
        }

        if (formStudent.class_id === "") {
            newErrors.class_id = "Please enter class";
            valid = false;
        }

        if (formStudent.password === "") {
            newErrors.password = "Please enter password";
            valid = false;
        } else if (formStudent.password.length < 6) {
            newErrors.password = "Enter at least 6 characters";
            valid = false;
        } else if (formStudent.password.length > 255) {
            newErrors.password = "Enter up to 255 characters";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    // hiển thị thông báo thêm sinh viên thành công
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

    //xử lý thêm sinh viên
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await api.post(
                    url.STUDENT.CREATE,
                    formStudent
                );
                showNotification("success", "Student created successfully!");
            } catch (error) {
                if (
                    error.response.status === 400 &&
                    error.response.data === "Code student already exists" //kiểm tra trùng mã sinh viên
                ) {
                    setStudentCodeExistsError("Student code already exists");
                } else {
                    // showNotification("danger", "Failed to create student.");
                }
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormStudent({ ...formStudent, [name]: value });
        setStudentCodeExistsError("");
    };

    //hiển thị select lớp học
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await api.get(url.CLASS.LIST);
                setClasses(response.data);
            } catch (error) {}
        };
        fetchClasses();
    }, []);

    //con mắt hiển thị password
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const passwordInputType = showPassword ? "text" : "password";

    return (
        <>
            <div className="page-header">
                <div className="row align-items-center">
                    <div className="col-sm-12">
                        <div className="page-sub-header">
                            <h3 className="page-title">Add Student</h3>
                        </div>
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
                                                Student Code{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="student_code"
                                                value={formStudent.student_code}
                                                onChange={handleChange}
                                                placeholder="Enter Student Code"
                                            />
                                            {errors.student_code && (
                                                <div className="text-danger">
                                                    {errors.student_code}
                                                </div>
                                            )}
                                            {studentCodeExistsError && (
                                                <div className="text-danger">
                                                    {studentCodeExistsError}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <div className="form-group local-forms">
                                            <label>
                                                Full Name{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="fullname"
                                                value={formStudent.fullname}
                                                onChange={handleChange}
                                                placeholder="Enter Full Name"
                                            />
                                            {errors.fullname && (
                                                <div className="text-danger">
                                                    {errors.fullname}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <div className="form-group local-forms">
                                            <label>
                                                Gender{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <select
                                                className="form-control select"
                                                name="gender"
                                                value={formStudent.gender}
                                                onChange={handleChange}
                                            >
                                                <option value="">
                                                    Please select gender
                                                </option>
                                                <option>Male</option>
                                                <option>Female</option>
                                                <option>Others</option>
                                            </select>
                                            {errors.gender && (
                                                <div className="text-danger">
                                                    {errors.gender}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <div className="form-group local-forms">
                                            <label>
                                                Date Of Birth{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                className="form-control"
                                                type="date"
                                                name="birthday"
                                                value={formStudent.birthday}
                                                onChange={handleChange}
                                                placeholder="YYY-MM-DD"
                                            />
                                            {errors.birthday && (
                                                <div className="text-danger">
                                                    {errors.birthday}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <div className="form-group local-forms">
                                            <label>
                                                Email{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                className="form-control"
                                                type="email"
                                                name="email"
                                                value={formStudent.email}
                                                onChange={handleChange}
                                                placeholder="Enter Email Address"
                                            />
                                            {errors.email && (
                                                <div className="text-danger">
                                                    {errors.email}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <div className="form-group local-forms">
                                            <label>
                                                Phone Number{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                className="form-control"
                                                type="number"
                                                name="phone"
                                                value={formStudent.phone}
                                                onChange={handleChange}
                                                placeholder="Enter Phone Number"
                                            />
                                            {errors.phone && (
                                                <div className="text-danger">
                                                    {errors.phone}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <div className="form-group local-forms">
                                            <label>
                                                Address{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="address"
                                                value={formStudent.address}
                                                onChange={handleChange}
                                                placeholder="Enter Address"
                                            />
                                            {errors.address && (
                                                <div className="text-danger">
                                                    {errors.address}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <div className="form-group local-forms">
                                            <label>
                                                Class Name{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <select
                                                className="form-control select"
                                                name="class_id"
                                                value={formStudent.class_id}
                                                onChange={handleChange}
                                            >
                                                <option value="">
                                                    Please select class
                                                </option>{" "}
                                                {classes.map((classItem) => (
                                                    <option
                                                        key={classItem.id}
                                                        value={classItem.id}
                                                    >
                                                        {classItem.name}
                                                    </option>
                                                ))}
                                            </select>

                                            {errors.class_id && (
                                                <div className="text-danger">
                                                    {errors.class_id}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <div className="form-group students-up-files">
                                            <label>
                                                Upload Student Photo (150px X
                                                150px){" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>{" "}
                                            <input
                                                type="file"
                                                className="form-control"
                                                name="avatar"
                                                value={formStudent.avatar}
                                                onChange={handleChange}
                                            />{" "}
                                            {errors.avatar && (
                                                <div className="text-danger">
                                                    {errors.avatar}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <h5 className="form-title">
                                            <span>
                                                Create login accounts for
                                                students
                                            </span>
                                        </h5>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <div className="form-group local-forms password-input-container">
                                            <label>
                                                Password{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <div className="password-input">
                                                <input
                                                    type={passwordInputType}
                                                    className="form-control"
                                                    name="password"
                                                    value={formStudent.password}
                                                    onChange={handleChange}
                                                    placeholder="Enter Password"
                                                />
                                                <span
                                                    className={`password-toggle-icon ${
                                                        showPassword
                                                            ? "show"
                                                            : "hide"
                                                    }`}
                                                    onClick={
                                                        togglePasswordVisibility
                                                    }
                                                >
                                                    {showPassword ? (
                                                        <i className="fa fa-eye-slash"></i>
                                                    ) : (
                                                        <i className="fa fa-eye"></i>
                                                    )}
                                                </span>
                                            </div>
                                            {errors.password && (
                                                <div className="text-danger">
                                                    {errors.password}
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
        </>
    );
}
export default Student_Create;
