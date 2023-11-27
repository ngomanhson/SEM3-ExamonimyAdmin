import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import url from "../../../services/url";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Question_Create from "./question-create";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Layout from "../../../layouts/layouts";
import { Helmet } from "react-helmet";
import NotFound from "../../../pages/other/not-found";
function Test_Create() {
    const [userRole, setUserRole] = useState(null);
    const animatedComponents = makeAnimated();
    const [isClearable, setIsClearable] = useState(true);
    const [isSearchable, setIsSearchable] = useState(true);
    const [exam, setExams] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [isQuestionsAdded, setIsQuestionsAdded] = useState(false);
    const [questionCount, setQuestionCount] = useState(0);
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    const currentTime = "00:00";
    const todayDateTimeLocal = `${year}-${month}-${day}T${currentTime}`; //chỉ cho người dùng chọn từ ngay hôm nay trở đi
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [nameExistsError, setNameExistsError] = useState("");
    const [examExistsError, setExamExistsError] = useState("");
    const [loggedInUser, setLoggedInUser] = useState(null);
    const selectAllOption = {
        value: "select_all",
        label: "Select All Students",
    };
    const allStudentsOptions = [selectAllOption, ...students];
    const [formTest, setFormTest] = useState({
        name: "",
        exam_id: "",
        startDate: "",
        endDate: "",
        past_marks: "",
        total_marks: 100,
        studentTds: [],
        questions: [],
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
            studentTds: [],
            questions: [],
            created_by: "",
        });
        setSelectedStudents([]);
    };
    const clearQuestionsInLocalStorage = () => {
        //xoá câu hỏi trong localStorage khi thêm bài thi thành công
        localStorage.removeItem("questions");
    };
    //XỬ LÝ XOÁ CÂU HỎI KHI NGƯỜI DÙNG LOAD LẠI TRANG HOẶC CHUYỂN SANG COMPONENT KHÁC
    useEffect(() => {
        window.addEventListener("beforeunload", handlePageUnload);
        return () => {
            window.removeEventListener("beforeunload", handlePageUnload);
            if (isQuestionsAdded) {
                clearQuestionsInLocalStorage();
            }
        };
    }, [isQuestionsAdded]);
    const handlePageUnload = () => {
        localStorage.removeItem("questions");
    };
    const updateFormTestWithQuestions = (updatedQuestions) => {
        setFormTest({ ...formTest, questions: updatedQuestions });
        setQuestionCount(updatedQuestions.length);
        setIsQuestionsAdded(true);
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
        if (selectedStudents.length === 0) {
            newErrors.studentTds = "Please choose students";
            valid = false;
        } else {
            const selectedStudentIds = selectedStudents.map((option) => option.value);
            setFormTest({ ...formTest, studentTds: selectedStudentIds });
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
        setFormTest({ ...formTest, exam_id: selectedOption.value });
    };

    //hiển thị danh sách lớp học
    useEffect(() => {
        const fetchClasses = async () => {
            const userToken = localStorage.getItem("accessToken");
            try {
                api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
                const response = await api.get(url.CLASS.LIST);
                const classData = response.data.map((cls) => ({
                    value: cls.id,
                    label: cls.name,
                }));
                setClasses(classData);
            } catch (error) {}
        };
        fetchClasses();
    }, []);
    const OptionsClasses = classes;
    //hiển thị danh sách sinh viên theo lớp học đã được chọn
    useEffect(() => {
        if (selectedClass) {
            const fetchStudentsByClass = async () => {
                try {
                    const response = await api.get(`${url.STUDENT.CLASS_ID}?classId=${selectedClass.value}`);
                    const studentData = response.data.map((std) => ({
                        value: std.id,
                        label: std.fullname,
                    }));
                    setStudents(studentData);
                } catch (error) {}
            };
            fetchStudentsByClass();
        }
    }, [selectedClass]);
    const handleClassChange = (selectedOption) => {
        setSelectedClass(selectedOption);
        setSelectedStudents([]);
    };
    const handleStudentChange = (selectedOption) => {
        //xử lý các phần chọn sinh viên bao gồm cả select all
        if (selectedOption.some((option) => option.value === "select_all")) {
            const allStudents = students.map((student) => ({
                value: student.value,
                label: student.label,
            }));
            setSelectedStudents(allStudents);
        } else {
            setSelectedStudents(selectedOption);
        }
        setFormTest({ ...formTest, studentTds: selectedOption.value });
    };

    //xử lý tạo bài thi
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
        if (!isQuestionsAdded) {
            //kiểm tra nếu chưa thêm câu hỏi nào
            toast.error("You must add questions before creating a test", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
            return;
        }
        if (questionCount < 16) {
            //kiểm tra phải thêm đủ 16 câu hỏi
            toast.error("You need to add at least 16 questions", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
            return;
        }
        const userToken = localStorage.getItem("accessToken");
        try {
            const data = {
                name: formTest.name,
                exam_id: formTest.exam_id,
                startDate: formTest.startDate,
                endDate: formTest.endDate,
                past_marks: formTest.past_marks,
                total_marks: formTest.total_marks,
                created_by: formTest.created_by,
                studentIds: selectedStudents.map((student) => student.value),
                questions: formTest.questions,
            };
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            const updatedFormExam = {
                ...data,
                created_by: loggedInUser || "",
            };
            const rs = await api.post(url.TEST.CREATE_MULTIPLE, updatedFormExam);
            const createdExamId = rs.data.exam_id;
            clearForm();
            clearQuestionsInLocalStorage();
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
            if (error.response.status === 400 && error.response.data.message === "Test already exists") {
                setExamExistsError("This exam has enough tests, please choose another exam!");
                toast.error("Choose the exam again!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
            } else {
            }
            // console.error("Error creating test:", error);
            // console.error("Response data:", error.response.data);
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
        setExamExistsError("");
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
                            <div className="row">
                                <div className="col">
                                    <h3 className="page-title">Create Test Multiple Choice</h3>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div class="col-md-9">
                                <ul class="list-links mb-4">
                                    <li class="active">
                                        <NavLink to="">Create your own questions</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/test-excel">With excel files</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/test-available">With questions available</NavLink>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div class="row">
                                <div class="col-md-6">
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
                                                />
                                                {errors.exam_id && <div className="text-danger">{errors.exam_id}</div>}
                                                {examExistsError && <div className="text-danger">{examExistsError}</div>}
                                            </div>
                                            <div className="form-group">
                                                <label>Class</label>
                                                <Select
                                                    isSearchable={isSearchable}
                                                    isClearable={isClearable}
                                                    options={OptionsClasses}
                                                    onChange={handleClassChange}
                                                    placeholder="Select class to select students"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Student</label>
                                                <Select
                                                    closeMenuOnSelect={false}
                                                    components={animatedComponents}
                                                    isMulti
                                                    options={allStudentsOptions}
                                                    onChange={handleStudentChange}
                                                    value={selectedStudents}
                                                    name="studentIds"
                                                    placeholder="Select Student..."
                                                />
                                                {errors.studentTds && <div className="text-danger">{errors.studentTds}</div>}
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
                                </div>

                                <Question_Create onQuestionAdded={updateFormTestWithQuestions} />
                                <ToastContainer />
                            </div>
                        </form>
                    </Layout>
                </>
            )}
        </>
    );
}
export default Test_Create;
