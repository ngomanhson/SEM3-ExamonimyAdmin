import { useEffect, useState } from "react";
import api from "../../services/api";
import url from "../../services/url";
import Layout from "../../layouts/layouts";
import { Helmet } from "react-helmet";
import Loading from "../../layouts/loading";
import { useNavigate } from "react-router-dom";
function Classes_Create() {
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    });

    const [formClass, setFormClass] = useState({
        name: "",
        room: "",
        teacher_id: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        room: "",
        teacher_id: "",
    });

    const [teacher, setTeachers] = useState([]);
    const [nameExistsError, setNameExistsError] = useState("");

    const validateForm = async () => {
        let valid = true;
        const newErrors = {};

        if (formClass.name === "") {
            newErrors.name = "Please enter class name";
            valid = false;
        } else if (formClass.name.length < 3) {
            newErrors.name = "The class name must be at least 3 characters";
            valid = false;
        } else if (formClass.name.length > 50) {
            newErrors.name = "Class name must be less than 50 characters";
            valid = false;
        }

        if (formClass.room === "") {
            newErrors.room = "Please enter room name";
            valid = false;
        } else if (formClass.room.length < 3) {
            newErrors.room = "Room name must have at least 3 characters";
            valid = false;
        } else if (formClass.room.length > 50) {
            newErrors.room = "Room name must be less than 50 characters";
            valid = false;
        }

        if (formClass.teacher_id === "") {
            newErrors.teacher_id = "Please enter teacher";
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const userToken = localStorage.getItem("accessToken");
            try {
                api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
                const rs = await api.post(url.CLASS.CREATE, formClass);
                showNotification("success", "Class created successfully!");
            } catch (error) {
                if (error.response.status === 400 && error.response.data === "Class name already exists") {
                    setNameExistsError("The class name already exists");
                } else {
                    // showNotification("danger", "Failed to create class.");
                }
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormClass({ ...formClass, [name]: value });
        setNameExistsError("");
    };

    //hiển thị select teacher
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await api.get(url.STAFF.LIST);
                setTeachers(response.data);
            } catch (error) {}
        };
        fetchTeachers();
    }, []);

    //kiểm tra role
    useEffect(() => {
        const fetchUserRole = async () => {
            const token = localStorage.getItem("accessToken");
            try {
                const decodedToken = JSON.parse(atob(token.split(".")[1]));
                const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                setUserRole(userRole);

                if (userRole === "Teacher" || userRole === "Staff") {
                    navigate("/404");
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
            <Helmet>
                <title>Class | Examonimy</title>
            </Helmet>
            <Layout>
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="page-title">Add Class</h3>
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
                                            <h5 className="form-title">
                                                <span>Class Information</span>
                                            </h5>
                                        </div>
                                        <div id="notification-container"></div>

                                        <div className="col-12 col-sm-4">
                                            <div className="form-group local-forms">
                                                <label>
                                                    Class Name <span className="login-danger">*</span>
                                                </label>
                                                <input type="text" className="form-control" name="name" value={formClass.name} onChange={handleChange} />
                                                {errors.name && <div className="text-danger">{errors.name}</div>}
                                                {nameExistsError && <div className="text-danger">{nameExistsError}</div>}
                                            </div>
                                        </div>

                                        <div className="col-12 col-sm-4">
                                            <div className="form-group local-forms">
                                                <label>
                                                    Room <span className="login-danger">*</span>
                                                </label>
                                                <input type="text" className="form-control" name="room" value={formClass.room} onChange={handleChange} />
                                                {errors.room && <div className="text-danger">{errors.room}</div>}
                                            </div>
                                        </div>

                                        <div className="col-12 col-sm-4">
                                            <div className="form-group local-forms">
                                                <label>
                                                    Teacher <span className="login-danger">*</span>
                                                </label>
                                                <select className="form-control select" name="teacher_id" value={formClass.teacher_id} onChange={handleChange}>
                                                    <option value="">Please select teacher</option>
                                                    {teacher.map((classItem) => (
                                                        <option key={classItem.id} value={classItem.id}>
                                                            {classItem.fullname}
                                                        </option>
                                                    ))}
                                                </select>

                                                {errors.teacher_id && <div className="text-danger">{errors.teacher_id}</div>}
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
            </Layout>
        </>
    );
}
export default Classes_Create;
