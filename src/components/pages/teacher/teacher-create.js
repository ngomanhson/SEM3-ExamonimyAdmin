import { useEffect, useState } from "react";
import api from "../../services/api";
import url from "../../services/url";
import Layout from "../../layouts/layouts";
import { Helmet } from "react-helmet";
import Loading from "../../layouts/loading";
import { useNavigate } from "react-router-dom";
import NotFound from "../../pages/other/not-found";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Teacher_Create() {
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [staffEmailExistsError, setStaffEmailExistsError] = useState("");

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    });

    const [formTeacher, setFormTeacher] = useState({
        fullname: "",
        avatar: null,
        gender: "",
        birthday: "",
        email: "",
        phone: "",
        address: "",
        role: "",
    });
    const [errors, setErrors] = useState({});
    // tạo các validate cho các input
    const validateForm = () => {
        let valid = true;
        const newErrors = {};
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

        if (formTeacher.role.trim() === "") {
            newErrors.role = "Please choose role";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    //xử lý thêm staff
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the form
        const isFormValid = validateForm();

        if (isFormValid) {
            try {
                const response = await api.post(url.STAFF.CREATE, formTeacher, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                if (response && response.data) {
                    // console.log(response.data);
                    toast.success("Create Staff Successfully", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000,
                    });
                } else {
                }
                setTimeout(() => {
                    navigate("/teacher-list");
                }, 3000);
            } catch (error) {
                if (error.response.status === 400 && error.response.data === "Staff code already exists") {
                    setStaffEmailExistsError("Staff code already exists");
                    toast.error("Staff code already exists", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000,
                    });
                } else {
                }
                toast.error("Unable to create staff, please try again", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
                console.error("Error creating test:", error);
                console.error("Response data:", error.response.data);
            }
        }
    };
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormTeacher({
            ...formTeacher,
            [name]: name === "avatar" ? files[0] : value,
        });
        setStaffEmailExistsError("");
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
                    setError(true);
                }
            } catch (error) {
                console.error("Error loading user role:", error);
            }
        };

        fetchUserRole();
    }, [navigate]);
    return (
        <>
            {error ? (
                <NotFound />
            ) : (
                <>
                    <Helmet>
                        <title>Teacher | Examonimy</title>
                    </Helmet>
                    <Layout>
                        <div className="page-header">
                            <div className="row align-items-center">
                                <div className="col">
                                    <h3 className="page-title">Add Teachers</h3>
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <a href="teachers.html">Teachers</a>
                                        </li>
                                        <li className="breadcrumb-item active">Add Teachers</li>
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
                                                <div className="col-12 col-sm-4">
                                                    <div className="form-group local-forms">
                                                        <label>
                                                            Full Name <span className="login-danger">*</span>
                                                        </label>
                                                        <input type="text" className="form-control" name="fullname" value={formTeacher.fullName} onChange={handleChange} placeholder="Enter Name" />
                                                        {errors.fullname && <div className="text-danger">{errors.fullname}</div>}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-4">
                                                    <div className="form-group local-forms">
                                                        <label>
                                                            Gender <span className="login-danger">*</span>
                                                        </label>
                                                        <select className="form-control select" name="gender" value={formTeacher.gender} onChange={handleChange}>
                                                            <option value="">Please select gender</option>
                                                            <option>Male</option>
                                                            <option>Female</option>
                                                            <option>Others</option>
                                                        </select>
                                                        {errors.gender && <div className="text-danger">{errors.gender}</div>}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-4">
                                                    <div className="form-group local-forms ">
                                                        <label>
                                                            Date Of Birth <span className="login-danger">*</span>
                                                        </label>
                                                        <input className="form-control " type="date" name="birthday" value={formTeacher.birthday} onChange={handleChange} placeholder="YYY-MM-DD" />
                                                        {errors.birthday && <div className="text-danger">{errors.birthday}</div>}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-4">
                                                    <div className="form-group local-forms">
                                                        <label>
                                                            Email <span className="login-danger">*</span>
                                                        </label>
                                                        <input className="form-control" type="email" name="email" value={formTeacher.email} onChange={handleChange} placeholder="Enter Email Address" />
                                                        {errors.email && <div className="text-danger">{errors.email}</div>}
                                                        {staffEmailExistsError && <div className="text-danger">{staffEmailExistsError}</div>}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-4">
                                                    <div className="form-group local-forms">
                                                        <label>
                                                            Phone Number <span className="login-danger">*</span>
                                                        </label>
                                                        <input type="text" className="form-control" name="phone" value={formTeacher.phone} onChange={handleChange} placeholder="Enter Phone" />
                                                        {errors.phone && <div className="text-danger">{errors.phone}</div>}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-4">
                                                    <div className="form-group local-forms">
                                                        <label>
                                                            Address <span className="login-danger">*</span>
                                                        </label>
                                                        <input className="form-control" type="text" name="address" value={formTeacher.address} onChange={handleChange} placeholder="Enter Address" />
                                                        {errors.address && <div className="text-danger">{errors.address}</div>}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-4">
                                                    <div className="form-group local-forms">
                                                        <label>
                                                            Role <span className="login-danger">*</span>
                                                        </label>
                                                        <select className="form-control select" name="role" value={formTeacher.role} onChange={handleChange}>
                                                            <option value="">Please select role</option>
                                                            <option>Staff</option>
                                                            <option>Teacher</option>
                                                        </select>
                                                        {errors.role && <div className="text-danger">{errors.role}</div>}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-4">
                                                    <div className="form-group students-up-files">
                                                        <label>
                                                            Upload Student Photo (150px X 150px) <span className="login-danger">*</span>
                                                        </label>{" "}
                                                        <input type="file" className="form-control" name="avatar" accept="image/*" onChange={handleChange} />{" "}
                                                        {errors.avatar && <div className="text-danger">{errors.avatar}</div>}
                                                    </div>
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
                        <ToastContainer />
                    </Layout>
                </>
            )}
        </>
    );
}
export default Teacher_Create;
