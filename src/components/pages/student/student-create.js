import { useEffect, useState } from "react";
import api from "../../services/api";
import url from "../../services/url";
import Layout from "../../layouts/layouts";
import { Helmet } from "react-helmet";
function Student_Create() {
    const [formStudent, setFormStudent] = useState({
        student_code: "",
        fullname: "",
        avatar: null,
        gender: "",
        birthday: "",
        email: "",
        phone: "",
        address: "",
        class_id: "",
        password: "",
    });

    const [errors, setErrors] = useState({});

    const [classes, setClasses] = useState([]);
    const [studentCodeExistsError, setStudentCodeExistsError] = useState("");

    // tạo các validate cho các input
    const validateForm = () => {
        let valid = true;
        const newErrors = {};

        if (formStudent.student_code.trim() === "") {
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

        if (formStudent.fullname.trim() === "") {
            newErrors.fullname = "Please enter full name";
            valid = false;
        } else if (formStudent.fullname.length < 3) {
            newErrors.fullname = "The fullname must be at least 3 characters";
            valid = false;
        } else if (formStudent.fullname.length > 255) {
            newErrors.fullname = "Fullname must be less than 255 characters";
            valid = false;
        }

        if (!formStudent.avatar) {
            newErrors.avatar = "Please choose avatar";
            valid = false;
        }

        if (formStudent.birthday.trim() === "") {
            newErrors.birthday = "Please enter birthday";
            valid = false;
        }

        if (formStudent.email.trim() === "") {
            newErrors.email = "Please enter email address";
            valid = false;
        }

        if (formStudent.phone.trim() === "") {
            newErrors.phone = "Please enter phone number";
            valid = false;
        } else if (
            formStudent.phone.length < 10 ||
            formStudent.phone.length > 12
        ) {
            newErrors.phone =
                "Phone number should be between 10 and 12 characters";
            valid = false;
        }

        if (formStudent.gender.trim() === "") {
            newErrors.gender = "Please choose a gender";
            valid = false;
        }

        if (formStudent.address.trim() === "") {
            newErrors.address = "Please enter address";
            valid = false;
        }

        if (formStudent.class_id.trim() === "") {
            newErrors.class_id = "Please enter class";
            valid = false;
        }

        if (formStudent.password.trim() === "") {
            newErrors.password = "Please enter password";
            valid = false;
        } else if (
            formStudent.password.length < 6 ||
            formStudent.password.length > 255
        ) {
            newErrors.password =
                "Password should be between 6 and 255 characters";
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

        // Validate the form
        const isFormValid = validateForm();

        if (isFormValid) {
            try {
                const response = await api.post(
                    url.STUDENT.CREATE,
                    formStudent,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );

                // Show a success notification
                if (response && response.data) {
                    // Access the data property here
                    console.log(response.data);
                    showNotification(
                        "success",
                        "Student created successfully!"
                    );
                } else {
                    // Handle the case where response or response.data is undefined
                    console.error("Response or response.data is undefined.");
                }
            } catch (error) {
                if (error.response) {
                    const { status, data } = error.response;
                    if (status === 400) {
                        if (data === "Student code already exists") {
                            setStudentCodeExistsError(
                                "Student code already exists"
                            );
                        } else {
                            setErrors(data); // Update errors state with validation errors
                        }
                    } else {
                        console.error("Failed to create student:", error);
                    }
                }
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormStudent({
            ...formStudent,
            [name]: name === "avatar" ? files[0] : value,
        });
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
    // hien thi avata sinh vien
    const renderStudentImage = () => {
        if (formStudent.avatar instanceof Blob) {
            return (
                <img
                    src={URL.createObjectURL(formStudent.avatar)}
                    alt="Student Avatar"
                    width="150"
                    height="150"
                />
            );
        } else if (formStudent.avatar) {
            // Nếu formStudent.avatar không phải là Blob, bạn có thể xử lý theo cách khác, ví dụ:
            // Trường hợp này, bạn có thể hiển thị thông báo hoặc hiện tượng khác để báo hiệu lỗi.
            return <p className="text-danger">Invalid avatar data</p>;
        } else {
            return null;
        }
    };
    return (
        <>
            <Helmet>
                <title>Student | Examonimy</title>
            </Helmet>
            <Layout>
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
                                                    value={
                                                        formStudent.student_code
                                                    }
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
                                                    {classes.map(
                                                        (classItem) => (
                                                            <option
                                                                key={
                                                                    classItem.id
                                                                }
                                                                value={
                                                                    classItem.id
                                                                }
                                                            >
                                                                {classItem.name}
                                                            </option>
                                                        )
                                                    )}
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
                                                    Upload Student Photo (150px
                                                    X 150px){" "}
                                                    <span className="login-danger">
                                                        *
                                                    </span>
                                                </label>{" "}
                                                {renderStudentImage()}
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    name="avatar"
                                                    onChange={handleChange}
                                                    accept="image/*"
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
                                                        value={
                                                            formStudent.password
                                                        }
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
            </Layout>
        </>
    );
}
export default Student_Create;
