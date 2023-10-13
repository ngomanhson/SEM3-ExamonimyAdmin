import { useEffect, useState } from "react";
import api from "../../services/api";
import url from "../../services/url";
function Teacher_Create() {
    const [formTeacher,setFormTeacher]=useState({
        staff_code: "",
        fullname: "",
        avatar: null,
        gender: "",
        birthday: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        role: 1,
    });
    const [errors,setErrors]=useState({
   
    });
    const [teacherCodeExistsError, setTeacherCodeExistsError] = useState("");
    // tạo các validate cho các input
    const validateForm =  () => {
        let valid = true;
        const newErrors = {};

        if (formTeacher.staff_code.trim() === "") {
            newErrors.staff_code = "Please enter Teacher code";
            valid = false;
        } else if (formTeacher.staff_code.length < 3) {
            newErrors.staff_code =
                "The Teacher code must be at least 3 characters";
            valid = false;
        } else if (formTeacher.staff_code.length > 100) {
            newErrors.staff_code =
                "Teacher code must be less than 100 characters";
            valid = false;
        }

        if (formTeacher.fullname.trim() === "") {
            newErrors.fullname = "Please enter full name";
            valid = false;
        } else if (formTeacher.fullname.length < 3) {
            newErrors.fullname = "The fullname must be at least 3 characters";
            valid = false;
        } else if (formTeacher.fullname.length > 255) {
            newErrors.fullname = "Fullname must be less than 255 characters";
            valid = false;
        }

        if (!formTeacher.avatar) {
            newErrors.avatar = "Please choose avatar";
            valid = false;
        }

        if (formTeacher.birthday.trim() === "") {
            newErrors.birthday = "Please enter birthday";
            valid = false;
        }

        if (formTeacher.email.trim() === "") {
            newErrors.email = "Please enter email address";
            valid = false;
        }

        if (formTeacher.phone.trim() === "") {
            newErrors.phone = "Please enter phone number";
            valid = false;
        } else if (formTeacher.phone.length < 10) {
            newErrors.phone = "Enter at least 10 characters";
            valid = false;
        } else if (formTeacher.phone.length > 12) {
            newErrors.phone = "Enter up to 12 characters";
            valid = false;
        }

        if (formTeacher.gender.trim() === "") {
            newErrors.gender = "Please choose a gender";
            valid = false;
        }

        if (formTeacher.address.trim() === "") {
            newErrors.address = "Please enter address";
            valid = false;
        }

        

        if (formTeacher.password.trim() === "") {
            newErrors.password = "Please enter password";
            valid = false;
        } else if (formTeacher.password.length < 6) {
            newErrors.password = "Enter at least 6 characters";
            valid = false;
        } else if (formTeacher.password.length > 255) {
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
    //xử lý thêm 
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     if (validateForm()) {
    //         try {
    //             const response = await api.post(
    //                 url.STAFF.CREATE,
    //                 formTeacher
    //             );
            
    //             if (response && response.data) {
    //                 // Access the data property here
    //                 console.log(response.data);
    //                 showNotification("success", "Teacher created successfully!");
    //             } else {
    //                 // Handle the case where response or response.data is undefined
    //                 console.error("Response or response.data is undefined.");
    //             }
    //         } catch (error) {
    //             if (error.response && error.response.data === "Code student already exists") {
    //                 setTeacherCodeExistsError("Student code already exists");
    //             } else {
    //                 // Handle other errors as needed
    //                 console.error("An error occurred:", error);
    //             }
    //         }
    //     }
    // };
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validate the form
        const isFormValid = validateForm();
    
        if (isFormValid) {
            try {
                const response = await api.post(url.STAFF.CREATE, formTeacher, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
    
                // Show a success notification
                if (response && response.data) {
                    // Access the data property here
                    console.log(response.data);
                    showNotification("success", "Teacher created successfully!");
                } else {
                    // Handle the case where response or response.data is undefined
                    console.error("Response or response.data is undefined.");
                }
            } catch (error) {
                if (error.response) {
                    const { status, data } = error.response;
                    if (status === 400) {
                      if (data === "Student code already exists") {
                        setTeacherCodeExistsError("Student code already exists");
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
        setFormTeacher({
          ...formTeacher,
          [name]: name === "avatar" ? files[0] : value,
        });
        setTeacherCodeExistsError("");
      };
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
                    <div className="col">
                        <h3 className="page-title">Add Teachers</h3>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="teachers.html">Teachers</a>
                            </li>
                            <li className="breadcrumb-item active">
                                Add Teachers
                            </li>
                        </ul>
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
                                        <h5 className="form-title ">
                                            Teacher Information
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
                                                Teacher ID{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="staff_code"
                                                value={formTeacher.staff_code}
                                                onChange={handleChange}
                                                placeholder="Teacher ID"
                                            />
                                            {errors.staff_code && (
                                                <div className="text-danger">
                                                    {errors.staff_code}
                                                </div>
                                            )}
                                            {teacherCodeExistsError && (
                                                <div className="text-danger">
                                                    {teacherCodeExistsError}
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
                                                type="text"
                                                className="form-control"
                                                name="fullname"
                                                value={formTeacher.fullName}
                                                onChange={handleChange}
                                                placeholder="Enter Name"
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
                                            <select className="form-control select"
                                            name="gender"
                                            value={formTeacher.gender}
                                            onChange={handleChange}>
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
                                        <div className="form-group local-forms ">
                                            <label>
                                                Date Of Birth{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                className="form-control "
                                                type="date"
                                                name="birthday"
                                                value={formTeacher.birthday}
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
                                                value={formTeacher.email}
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
                                                type="text"
                                                className="form-control"
                                                name="phone"
                                                value={formTeacher.phone}
                                                onChange={handleChange}
                                                placeholder="Enter Phone"
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
                                                value={formTeacher.address}
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
                                                accept="image/*"
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
                                                teacher
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
                                                    value={formTeacher.password}
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
export default Teacher_Create;
