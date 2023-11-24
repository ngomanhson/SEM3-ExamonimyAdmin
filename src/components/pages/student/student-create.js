import { useEffect, useState } from "react";
import api from "../../services/api";
import url from "../../services/url";
import Layout from "../../layouts/layouts";
import { Helmet } from "react-helmet";
import { NavLink, useNavigate } from "react-router-dom";
import Loading from "../../layouts/loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "../../pages/other/not-found";
function Student_Create() {
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    });

    const [formStudent, setFormStudent] = useState({
        fullname: "",
        avatar: null,
        gender: "",
        birthday: "",
        email: "",
        phone: "",
        address: "",
        class_id: "",
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const [classes, setClasses] = useState([]);
    const [studentEmailExistsError, setStudentEmailExistsError] = useState("");

    // tạo các validate cho các input
    const validateForm = () => {
        let valid = true;
        const newErrors = {};

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
        } else if (formStudent.phone.length < 10 || formStudent.phone.length > 12) {
            newErrors.phone = "Phone number should be between 10 and 12 characters";
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

        setErrors(newErrors);
        return valid;
    };

    //xử lý thêm sinh viên
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the form
        const isFormValid = validateForm();

        if (isFormValid) {
            const userToken = localStorage.getItem("accessToken");
            try {
                api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
                const response = await api.post(url.STUDENT.CREATE, formStudent, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                if (response && response.data) {
                    console.log(response.data);
                    toast.success("Create Student Successfully", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000,
                    });
                } else {
                    console.error("Response or response.data is undefined.");
                }
                setTimeout(() => {
                    navigate("/student-list");
                }, 3000);
            } catch (error) {
                if (error.response.status === 400 && error.response.data.message === "Student email already exists") {
                    setStudentEmailExistsError("Student email already exists");
                    toast.error("Student email already exists", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000,
                    });
                } else {
                }
                toast.error("Unable to create student, please try again", {
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
        setFormStudent({
            ...formStudent,
            [name]: name === "avatar" ? files[0] : value,
        });
        setStudentEmailExistsError("");
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

    // hien thi avata sinh vien
    const renderStudentImage = () => {
        if (formStudent.avatar instanceof Blob) {
            return <img src={URL.createObjectURL(formStudent.avatar)} alt="Student Avatar" width="150" height="150" />;
        } else if (formStudent.avatar) {
            return <p className="text-danger">Invalid avatar data</p>;
        } else {
            return null;
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

                if (userRole === "Teacher") {
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
            {loading ? <Loading /> : ""}
            {error ? (
                <NotFound />
            ) : (
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
                            <div class="col-md-9">
                                <ul class="list-links mb-4">
                                    <li class="active">
                                        <NavLink to="">Add Student</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/student-excel-create">With excel files</NavLink>
                                    </li>
                                </ul>
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
                                                <div className="col-12 col-sm-4">
                                                    <div className="form-group local-forms">
                                                        <label>
                                                            Full Name <span className="login-danger">*</span>
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            name="fullname"
                                                            value={formStudent.fullname}
                                                            onChange={handleChange}
                                                            placeholder="Enter Full Name"
                                                        />
                                                        {errors.fullname && <div className="text-danger">{errors.fullname}</div>}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-4">
                                                    <div className="form-group local-forms">
                                                        <label>
                                                            Gender <span className="login-danger">*</span>
                                                        </label>
                                                        <select className="form-control select" name="gender" value={formStudent.gender} onChange={handleChange}>
                                                            <option value="">Please select gender</option>
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
                                                        <input className="form-control" type="date" name="birthday" value={formStudent.birthday} onChange={handleChange} placeholder="YYY-MM-DD" />
                                                        {errors.birthday && <div className="text-danger">{errors.birthday}</div>}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-4">
                                                    <div className="form-group local-forms">
                                                        <label>
                                                            Email <span className="login-danger">*</span>
                                                        </label>
                                                        <input className="form-control" type="email" name="email" value={formStudent.email} onChange={handleChange} placeholder="Enter Email Address" />
                                                        {errors.email && <div className="text-danger">{errors.email}</div>}
                                                        {studentEmailExistsError && <div className="text-danger">{studentEmailExistsError}</div>}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-4">
                                                    <div className="form-group local-forms">
                                                        <label>
                                                            Phone Number <span className="login-danger">*</span>
                                                        </label>
                                                        <input className="form-control" type="number" name="phone" value={formStudent.phone} onChange={handleChange} placeholder="Enter Phone Number" />
                                                        {errors.phone && <div className="text-danger">{errors.phone}</div>}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-4">
                                                    <div className="form-group local-forms">
                                                        <label>
                                                            Address <span className="login-danger">*</span>
                                                        </label>
                                                        <input className="form-control" type="text" name="address" value={formStudent.address} onChange={handleChange} placeholder="Enter Address" />
                                                        {errors.address && <div className="text-danger">{errors.address}</div>}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-4">
                                                    <div className="form-group local-forms">
                                                        <label>
                                                            Class Name <span className="login-danger">*</span>
                                                        </label>
                                                        <select className="form-control select" name="class_id" value={formStudent.class_id} onChange={handleChange}>
                                                            <option value="">Please select class</option>{" "}
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
                                                            Upload Student Photo (150px X 150px) <span className="login-danger">*</span>
                                                        </label>{" "}
                                                        {renderStudentImage()}
                                                        <input type="file" className="form-control" name="avatar" onChange={handleChange} accept="image/*" />{" "}
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
export default Student_Create;
