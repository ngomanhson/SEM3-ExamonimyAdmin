import Select from "react-select";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import makeAnimated from "react-select/animated";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import url from "../../../services/url";
import Layout from "../../../layouts/layouts";
import { Helmet } from "react-helmet";
import NotFound from "../../../pages/other/not-found";
function TestAvaliable_Create() {
    const [userRole, setUserRole] = useState(null);
    const animatedComponents = makeAnimated();
    const [isClearable, setIsClearable] = useState(true);
    const [isSearchable, setIsSearchable] = useState(true);
    const [exam, setExams] = useState([]);
    const [examName, setExamName] = useState([]);
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    const currentTime = "00:00";
    const todayDateTimeLocal = `${year}-${month}-${day}T${currentTime}`; //chỉ cho người dùng chọn từ ngay hôm nay trở đi
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [nameExistsError, setNameExistsError] = useState("");
    const [studentExistsError, setStudentExistsError] = useState("");
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [formTest, setFormTest] = useState({
        name: "",
        exam_id: "",
        startDate: "",
        endDate: "",
        past_marks: "",
        total_marks: 100,
        created_by: "",
    });
    const clearForm = () => {
        setFormTest({
            name: "",
            exam_id: "",
            startDate: "",
            endDate: "",
            past_marks: "",
            total_marks: 100,
            created_by: "",
        });
    };
    const [errors, setErrors] = useState({});
    const validateForm = () => {
        //validate cho thông tin bài test
        let valid = true;
        const newErrors = {};
        if (formTest.name === "") {
            newErrors.name = "Please enter name test";
            valid = false;
        } else if (formTest.name.length < 3) {
            newErrors.name = "Enter at least 3 characters";
            valid = false;
        } else if (formTest.name.length > 255) {
            newErrors.name = "Enter up to 255 characters";
            valid = false;
        }
        if (formTest.exam_id === "") {
            newErrors.exam_id = "Please choose exam";
            valid = false;
        }
        if (formTest.startDate === "") {
            newErrors.startDate = "Please choose start date";
            valid = false;
        }
        if (formTest.endDate === "") {
            newErrors.endDate = "Please choose end date";
            valid = false;
        }
        const startDate = new Date(formTest.startDate);
        const endDate = new Date(formTest.endDate);

        if (startDate >= endDate) {
            newErrors.startDate = "Start Date must be before End Date";
            valid = false;
        }

        if (formTest.past_marks === "") {
            newErrors.past_marks = "Please choose past marks";
            valid = false;
        }
        setErrors(newErrors);
        return valid;
    };

    //hiển thị select exam
    useEffect(() => {
        const fetchexamName = async () => {
            const userToken = localStorage.getItem("accessToken");
            try {
                api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
                const response = await api.get(url.EXAM.LIST);
                setExamName(response.data);
            } catch (error) {}
        };
        fetchexamName();
    }, []);
    useEffect(() => {
        const fetchExams = async () => {
            const userToken = localStorage.getItem("accessToken");
            try {
                api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
                const response = await api.get(url.RETEST.LIST);
                const examData = response.data.data.map((exam) => ({
                    value: exam.exam_id,
                    label: exam.exam_id,
                    examName: examName.find((e) => e.id === exam.exam_id)?.name || "Unknown Exam",
                }));

                //kiểm tra nếu trùng exam thì hiển thị 1 cái
                const uniqueExams = examData.filter((exam, index, self) => index === self.findIndex((e) => e.label === exam.label));
                setExams(uniqueExams);
            } catch (error) {}
        };
        fetchExams();
    }, [examName]);
    const optionsExam = exam;
    const handleChangeExam = (selectedOption) => {
        setFormTest({ ...formTest, exam_id: selectedOption.value });
    };

    //xử lý tạo bài thi lại
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formValidationResult = validateForm();

        if (!formValidationResult) {
            toast.error("You have not completely filled in the Test information", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
            return;
        }
        const userToken = localStorage.getItem("accessToken");
        try {
            //kiểm tra nếu bài test chính là tự luận thì không được taoj
            const examTestsResponse = await api.get(url.TEST.ALL, {
                params: { exam_id: formTest.exam_id },
            });
            const examTests = examTestsResponse.data;
            const mainTest = examTests.find((test) => test.retakeTestId === null);
            if (mainTest && mainTest.type_test === 1) {
                toast.error("Cannot create a test because the main test is an essay test!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
                return;
            }
            const data = {
                name: formTest.name,
                exam_id: formTest.exam_id,
                startDate: formTest.startDate,
                endDate: formTest.endDate,
                past_marks: formTest.past_marks,
                total_marks: formTest.total_marks,
                created_by: formTest.created_by,
            };
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            const updatedFormExam = {
                ...data,
                created_by: loggedInUser || "",
            };
            const rs = await api.post(url.TEST.CREATE_MULTIPLE_AUTO_RETAKE, updatedFormExam);
            const createdExamId = rs.data.exam_id;
            clearForm();
            toast.success("Create Test Successfully", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
            setTimeout(() => {
                navigate(`/test-of-exam-list/${createdExamId}`); //chuyển đến trang test-list
            }, 3000);
        } catch (error) {
            if (error.response.status === 400 && error.response.data.message === "Test name already exists") {
                setNameExistsError("This test name already exists");
                toast.error("This test name already exists", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
            } else {
            }
            if (error.response.status === 400 && error.response.data.message === "No students registered to retake the exam") {
                setStudentExistsError("There are currently no students registered to retake this exam, please choose another exam!");
                toast.error("There are currently no students registered to retake this exam, please choose another exam!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
            } else {
            }
            if (error.response.status === 400 && error.response.data.message === "The number of easy questions is not enough, the exam cannot be created") {
                toast.error("Cannot create test because there are no questions available!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
            } else {
            }
            if (error.response.status === 400 && error.response.data.message === "There is no official test yet") {
                toast.error("Unable to create test, this exam does not have any main tests!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
            } else {
            }
            toast.error("Unable to re-create test, please try again!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
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

    const handleChange = (e, selectedOption) => {
        const { name, value } = e.target;
        setFormTest({ ...formTest, [name]: value });
        setNameExistsError("");
        setStudentExistsError("");
    };

    //created_by
    useEffect(() => {
        const fetchLoggedInUser = async () => {
            const token = localStorage.getItem("accessToken");
            try {
                const decodedToken = JSON.parse(atob(token.split(".")[1]));
                const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
                setLoggedInUser(userId);
            } catch (error) {}
        };

        fetchLoggedInUser();
    }, []);

    useEffect(() => {
        if (loggedInUser) {
            setFormTest((prevFormExam) => ({
                ...prevFormExam,
                created_by: loggedInUser,
            }));
        }
    }, [loggedInUser]);
    return (
        <>
            {error ? (
                <NotFound />
            ) : (
                <>
                    <Helmet>
                        <title>Test | Examonimy</title>
                    </Helmet>
                    <Layout>
                        <div className="page-header">
                            <div className="row align-items-center">
                                <div className="col">
                                    <h3 className="page-title">Create a retest multiple choice</h3>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div class="col-md-9">
                                <ul class="list-links mb-4">
                                    <li>
                                        <NavLink to="/retest-byhand-create">Create your own questions</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/retest-excel-create">With excel files</NavLink>
                                    </li>
                                    <li class="active">
                                        <NavLink to="">With questions available</NavLink>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <form onSubmit={handleSubmit}>
                                    <div class="card">
                                        <div class="card-header">
                                            <h5 class="card-title">Test Information</h5>
                                        </div>
                                        <div class="card-body">
                                            <div className="form-group">
                                                <label>Name Test</label>
                                                <input type="text" name="name" value={formTest.name} onChange={handleChange} class="form-control" placeholder="Enter Test Name" />
                                                {errors.name && <div className="text-danger">{errors.name}</div>}
                                                {nameExistsError && <div className="text-danger">{nameExistsError}</div>}
                                            </div>
                                            <div class="form-group">
                                                <label>Exam</label>
                                                <Select
                                                    options={optionsExam}
                                                    isSearchable={isSearchable}
                                                    value={optionsExam.find((option) => option.value === formTest.exam_id)}
                                                    onChange={handleChangeExam}
                                                    placeholder="Select Exam"
                                                    getOptionLabel={(option) => option.examName}
                                                />
                                                {errors.exam_id && <div className="text-danger">{errors.exam_id}</div>}
                                                {studentExistsError && <div className="text-danger">{studentExistsError}</div>}
                                            </div>
                                            <div class="form-group">
                                                <label>Start Date Time</label>
                                                <input className="form-control" type="datetime-local" name="startDate" value={formTest.startDate} onChange={handleChange} min={todayDateTimeLocal} />
                                                {errors.startDate && <div className="text-danger">{errors.startDate}</div>}
                                            </div>
                                            <div class="form-group">
                                                <label>End Date Time</label>
                                                <input className="form-control" type="datetime-local" name="endDate" value={formTest.endDate} onChange={handleChange} min={formTest.startDate} />
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
                                                <select className="form-control" name="past_marks" value={formTest.past_marks} onChange={handleChange}>
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
                                                    Create Test
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="col-xl-6">
                                <div className="card bg-white">
                                    <div class="card-header">
                                        <h5 class="card-title">Test Question</h5>
                                    </div>
                                    <div className="card-body">
                                        <div class="row">
                                            <div class="col-md-10">
                                                <h5>Question</h5>
                                            </div>
                                            <div class="col-md-2"></div>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="vertical-scroll scroll-demo">
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        height: "100%",
                                                    }}
                                                >
                                                    <p
                                                        style={{
                                                            fontSize: "20px",
                                                            color: "#8F9BBA",
                                                        }}
                                                    >
                                                        Questions will be added randomly from the system !!!
                                                    </p>
                                                </div>
                                                {/* <div className="row">
                                        <div className="col-md-10">
                                            <div className="invoice-terms">
                                                <h6>
                                                    1.
                                                    <span>
                                                        Ten cua cau hoi
                                                    </span>{" "}
                                                    <span
                                                        style={{
                                                            fontSize: "15px",
                                                            color: "#8F9BBA",
                                                        }}
                                                    >
                                                        (Easy, 4.5 score)
                                                    </span>
                                                </h6>
                                                <p className="mb-1">
                                                    A - <span>dap an a</span>
                                                </p>
                                                <p className="mb-1 text-primary">
                                                    B - <span>dap an b</span>
                                                    <i className="fa fa-check"></i>
                                                </p>
                                                <p className="mb-1">
                                                    C - <span>dap an c</span>
                                                </p>
                                                <p className="mb-1">
                                                    D - <span>dap an d</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-md-2"></div>
                                    </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <ToastContainer />
                        </div>
                    </Layout>
                </>
            )}
        </>
    );
}
export default TestAvaliable_Create;
