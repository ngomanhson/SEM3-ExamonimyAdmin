import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../services/api";
import url from "../../services/url";
import Layout from "../../layouts/layouts";
import { Helmet } from "react-helmet";
import Loading from "../../layouts/loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Classes_Edit() {
    const { slug } = useParams();
    const [classData, setClassData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    });
    const [teacher, setTeachers] = useState([]);

    useEffect(() => {
        api.get(`${url.CLASS.DETAIL}?slug=${slug}`)
            .then((response) => {
                setClassData(response.data);
            })
            .catch((error) => {
                console.error("Error fetching class details:", error);
            });
    }, [slug]);

    const [errors, setErrors] = useState({
        name: "",
        room: "",
        teacher_id: "",
    });

    const [nameExistsError, setNameExistsError] = useState("");

    const validateForm = async () => {
        let valid = true;
        const newErrors = {};

        if (classData.name === "") {
            newErrors.name = "Please enter class name";
            valid = false;
        } else if (classData.name.length < 3) {
            newErrors.name = "The class name must be at least 3 characters";
            valid = false;
        } else if (classData.name.length > 50) {
            newErrors.name = "Class name must be less than 50 characters";
            valid = false;
        }

        if (classData.room === "") {
            newErrors.room = "Please enter room name";
            valid = false;
        } else if (classData.room.length < 3) {
            newErrors.room = "Room name must have at least 3 characters";
            valid = false;
        } else if (classData.room.length > 50) {
            newErrors.room = "Room name must be less than 50 characters";
            valid = false;
        }

        if (classData.teacher_id === "") {
            newErrors.teacher_id = "Please enter teacher_id";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const userToken = localStorage.getItem("accessToken");
            try {
                api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
                const rs = await api.put(`${url.CLASS.EDIT}?id=${classData.id}`, classData);
                toast.success("Update Class Successfuly", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 5000,
                });
            } catch (error) {
                if (error.response.status === 400 && error.response.data === "Class name already exists") {
                    setNameExistsError("The class name already exists");
                } else {
                }
                toast.success("Update Class Fail, Please try again", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 5000,
                });
            }
        }
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
                            <h3 className="page-title">Edit Class</h3>
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
                                        <div className="col-12 col-sm-4">
                                            <div className="form-group local-forms">
                                                <label>
                                                    Class Name <span className="login-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={classData.name}
                                                    onChange={(e) =>
                                                        setClassData({
                                                            ...classData,
                                                            name: e.target.value,
                                                        })
                                                    }
                                                />
                                                {errors.name && <div className="text-danger">{errors.name}</div>}
                                                {nameExistsError && <div className="text-danger">{nameExistsError}</div>}
                                            </div>
                                        </div>

                                        <div className="col-12 col-sm-4">
                                            <div className="form-group local-forms">
                                                <label>
                                                    Room <span className="login-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={classData.room}
                                                    onChange={(e) =>
                                                        setClassData({
                                                            ...classData,
                                                            room: e.target.value,
                                                        })
                                                    }
                                                />
                                                {errors.room && <div className="text-danger">{errors.room}</div>}
                                            </div>
                                        </div>

                                        <div className="col-12 col-sm-4">
                                            <div className="form-group local-forms">
                                                <label>
                                                    Teacher <span className="login-danger">*</span>
                                                </label>
                                                <select
                                                    className="form-control select"
                                                    name="teacher_id"
                                                    value={classData.teacher_id}
                                                    onChange={(e) =>
                                                        setClassData({
                                                            ...classData,
                                                            teacher_id: e.target.value,
                                                        })
                                                    }
                                                >
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
                                                    Update
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
export default Classes_Edit;
