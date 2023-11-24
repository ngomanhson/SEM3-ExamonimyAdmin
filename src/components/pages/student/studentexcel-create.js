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
function StudentExcel_Create() {
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const [error, setError] = useState(false);
    const [fileTypeError, setFileTypeError] = useState("");
    const [excelFileExistsError, setExcelFileExistsError] = useState("");

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    });

    const [formStudent, setFormStudent] = useState({
        excelFile: null,
        class_id: "",
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const [classes, setClasses] = useState([]);

    // tạo các validate cho các input
    const validateForm = () => {
        let valid = true;
        const newErrors = {};

        if (!formStudent.excelFile) {
            newErrors.excelFile = "Please choose excel file";
            valid = false;
        }

        if (formStudent.class_id.trim() === "") {
            newErrors.class_id = "Please choose class";
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
                const response = await api.post(url.STUDENT.CREATE_EXCEL, formStudent, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                if (response && response.data) {
                    console.log(response.data);
                    toast.success("Create Student With Excel File Successfully", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000,
                    });
                } else {
                }
                setTimeout(() => {
                    navigate("/student-list");
                }, 3000);
            } catch (error) {
                if (error.response.status === 400 && error.response.data.message === "Object reference not set to an instance of an object.") {
                    setExcelFileExistsError("The format of the excel file is incorrect");
                    toast.error("Select another excel file again", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000,
                    });
                } else {
                }
                toast.error("Unable to create student excel file, please try again", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
                // console.error("Error creating test:", error);
                // console.error("Response data:", error.response.data);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormStudent({
            ...formStudent,
            [name]: name === "excelFile" ? files[0] : value,
        });
        setExcelFileExistsError("");
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
                                    <li>
                                        <NavLink to="/student-create">Add Student</NavLink>
                                    </li>
                                    <li class="active">
                                        <NavLink to="">With excel files</NavLink>
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
                                                    <div className="form-group students-up-files">
                                                        <label>Upload File Excel Student List</label>
                                                        <input type="file" className="form-control" name="excelFile" onChange={handleChange} accept=".xlsx" />
                                                        {errors.excelFile && <div className="text-danger">{errors.excelFile}</div>}
                                                        {fileTypeError && <div className="text-danger">{fileTypeError}</div>}
                                                        {excelFileExistsError && <div className="text-danger">{excelFileExistsError}</div>}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-4">
                                                    <div className="form-group students-up-files">
                                                        <label>
                                                            Class Name <span className="login-danger">*</span>
                                                        </label>
                                                        <select className="form-control" name="class_id" value={formStudent.class_id} onChange={handleChange}>
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
export default StudentExcel_Create;
