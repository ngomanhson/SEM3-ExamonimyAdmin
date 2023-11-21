import { NavLink, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import api from "../../../services/api";
import url from "../../../services/url";
import makeAnimated from "react-select/animated";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Layout from "../../../layouts/layouts";
import { Helmet } from "react-helmet";
function Test_Edit() {
    const [userRole, setUserRole] = useState(null);
    const { slug } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const animatedComponents = makeAnimated();
    const [isClearable, setIsClearable] = useState(true);
    const [isSearchable, setIsSearchable] = useState(true);
    const [exam, setExams] = useState([]);
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    const currentTime = "00:00";
    const todayDateTimeLocal = `${year}-${month}-${day}T${currentTime}`; //chỉ cho người dùng chọn từ ngay hôm nay trở đi
    const navigate = useNavigate();
    const [nameExistsError, setNameExistsError] = useState("");
    const [testData, setTestData] = useState({
        name: "",
        exam_id: "",
        startDate: "",
        endDate: "",
        past_marks: "",
    });
    const [errors, setErrors] = useState({
        name: "",
        exam_id: "",
        startDate: "",
        endDate: "",
        past_marks: "",
    });
    const validateForm = () => {
        //validate cho thông tin bài test
        let valid = true;
        const newErrors = {};
        if (testData.name === "") {
            newErrors.name = "Please enter name test";
            valid = false;
        } else if (testData.name.length < 3) {
            newErrors.name = "Enter at least 3 characters";
            valid = false;
        } else if (testData.name.length > 255) {
            newErrors.name = "Enter up to 255 characters";
            valid = false;
        }
        if (testData.exam_id === "") {
            newErrors.exam_id = "Please choose exam";
            valid = false;
        }
        if (testData.startDate === "") {
            newErrors.startDate = "Please choose start date";
            valid = false;
        }
        if (testData.endDate === "") {
            newErrors.endDate = "Please choose end date";
            valid = false;
        }
        const startDate = new Date(testData.startDate);
        const endDate = new Date(testData.endDate);

        if (startDate >= endDate) {
            newErrors.startDate = "Start Date must be before End Date";
            valid = false;
        }
        if (testData.past_marks === "") {
            newErrors.past_marks = "Please choose past marks";
            valid = false;
        }
        setErrors(newErrors);
        return valid;
    };

    //hiển thị select exam
    useEffect(() => {
        const fetchExams = async () => {
            const userToken = localStorage.getItem("accessToken");
            try {
                api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
                const response = await api.get(url.EXAM.LIST);
                const examData = response.data.map((exam) => ({
                    value: exam.id,
                    label: exam.name,
                }));
                setExams(examData);
            } catch (error) {}
        };
        fetchExams();
    }, []);
    const optionsExam = exam;
    const handleChangeExam = (selectedOption) => {
        setTestData({ ...testData, exam_id: selectedOption.value });
    };

    useEffect(() => {
        api.get(`${url.TEST.DETAIL}?slug=${slug}`)
            .then((response) => {
                setTestData(response.data);
                setIsLoading(false);
            })
            .catch((error) => {});
    }, [slug]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const rs = await api.put(`${url.TEST.EDIT}?id=${testData.id}`, testData);
                toast.success("Update Test Successfully", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
                setTimeout(() => {
                    navigate(`/test-list`); //chuyển đến trang test-list
                }, 3000);
            } catch (error) {
                if (error.response.status === 400 && error.response.data === "Class name already exists") {
                    setNameExistsError("This test name already exists");
                } else {
                }
            }
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
            <Helmet>
                <title>Test | Examonimy</title>
            </Helmet>
            <Layout>
                <div className="page-header">
                    <div className="row">
                        <div className="col">
                            <h3 className="page-title">Edit Test Information</h3>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-12">
                        <form onSubmit={handleSubmit}>
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="card-title">Edit Test Information</h5>
                                </div>
                                <div class="card-body">
                                    <div className="form-group">
                                        <label>Name Test</label>
                                        <input
                                            type="text"
                                            value={testData.name}
                                            onChange={(e) =>
                                                setTestData({
                                                    ...testData,
                                                    name: e.target.value,
                                                })
                                            }
                                            class="form-control"
                                        />
                                        {errors.name && <div className="text-danger">{errors.name}</div>}
                                        {nameExistsError && <div className="text-danger">{nameExistsError}</div>}
                                    </div>
                                    <div class="form-group">
                                        <label>Exam</label>
                                        <Select
                                            options={optionsExam}
                                            isSearchable={isSearchable}
                                            isClearable={isClearable}
                                            value={optionsExam.find((option) => option.value === testData.exam_id)}
                                            onChange={handleChangeExam}
                                        />
                                        {errors.exam_id && <div className="text-danger">{errors.exam_id}</div>}
                                    </div>
                                    <div class="form-group">
                                        <label>Start Date Time</label>
                                        <input
                                            className="form-control"
                                            type="datetime-local"
                                            value={testData.startDate}
                                            onChange={(e) =>
                                                setTestData({
                                                    ...testData,
                                                    startDate: e.target.value,
                                                })
                                            }
                                            min={todayDateTimeLocal}
                                        />
                                        {errors.startDate && <div className="text-danger">{errors.startDate}</div>}
                                    </div>
                                    <div class="form-group">
                                        <label>End Date Time</label>
                                        <input
                                            className="form-control"
                                            type="datetime-local"
                                            value={testData.endDate}
                                            onChange={(e) =>
                                                setTestData({
                                                    ...testData,
                                                    endDate: e.target.value,
                                                })
                                            }
                                            min={testData.startDate}
                                        />
                                        {errors.endDate && <div className="text-danger">{errors.endDate}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            Pass Score{" "}
                                            <span
                                                style={{
                                                    color: "#808080",
                                                    fontSize: "13px",
                                                }}
                                            >
                                                (Points to pass the test)
                                            </span>
                                        </label>
                                        <select
                                            className="form-control"
                                            name="past_marks"
                                            value={testData.past_marks}
                                            onChange={(e) =>
                                                setTestData({
                                                    ...testData,
                                                    past_marks: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="">Select pass score...</option>
                                            <option value="50">50</option>
                                            <option value="40">40</option>
                                            <option value="30">30</option>
                                            <option value="20">20</option>
                                        </select>
                                        {errors.past_marks && <div className="text-danger">{errors.past_marks}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label>Total Score</label>
                                        <input type="text" class="form-control" value="100" name="total_marks" disabled />
                                    </div>
                                    <div className="text-end">
                                        <button type="submit" className="btn btn-primary">
                                            Update Test
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <ToastContainer />
                </div>
            </Layout>
        </>
    );
}
export default Test_Edit;
