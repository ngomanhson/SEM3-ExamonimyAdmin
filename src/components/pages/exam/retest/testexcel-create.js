import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import makeAnimated from "react-select/animated";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import url from "../../../services/url";
import Layout from "../../../layouts/layouts";
import { Helmet } from "react-helmet";
function TestExcel_Create() {
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
    const [nameExistsError, setNameExistsError] = useState("");
    const [studentExistsError, setStudentExistsError] = useState("");
    const [formTest, setFormTest] = useState({
        name: "",
        exam_id: "",
        startDate: "",
        endDate: "",
        past_marks: "",
        total_marks: 100,
        created_by: 1,
        excelFile: null,
    });
    const clearForm = () => {
        setFormTest({
            name: "",
            exam_id: "",
            startDate: "",
            endDate: "",
            past_marks: "",
            total_marks: 100,
            created_by: 1,
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
        if (!formTest.excelFile) {
            newErrors.excelFile = "Please choose a file";
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
            try {
                const response = await api.get(url.EXAM.LIST);
                setExamName(response.data);
            } catch (error) {}
        };
        fetchexamName();
    }, []);
    useEffect(() => {
        const fetchExams = async () => {
            try {
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
        try {
            const data = {
                name: formTest.name,
                exam_id: formTest.exam_id,
                startDate: formTest.startDate,
                endDate: formTest.endDate,
                past_marks: formTest.past_marks,
                total_marks: formTest.total_marks,
                created_by: formTest.created_by,
                excelFile: formTest.excelFile,
            };
            const rs = await api.post(url.TEST.CREATE_MULTIPLE_EXCEL_RETAKE, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            // console.log("Response data:", rs.data);
            const createdExamId = rs.data.exam_id;
            clearForm();
            toast.success("Created a retake test successfully", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
            setTimeout(() => {
                navigate(`/test-of-exam-list/${createdExamId}`);
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
            toast.error("Unable to re-create test, please try again!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
        }
    };
    const handleFileUpload = (e) => {
        //xu ly upload file excel
        const file = e.target.files[0];
        if (file) {
            setFormTest({ ...formTest, excelFile: file });
        }
    };

    const handleChange = (e, selectedOption) => {
        const { name, value } = e.target;
        setFormTest({ ...formTest, [name]: value });
        setNameExistsError("");
        setStudentExistsError("");
    };
    return (
        <>
            <Helmet>
                <title>Retest | Examonimy</title>
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
                            <li class="active">
                                <NavLink to="">With excel files</NavLink>
                            </li>
                            <li>
                                <NavLink to="/retest-avaliable-create">With questions available</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-12">
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
                                    <div className="form-group">
                                        <label>Upload Excel File</label>
                                        <input type="file" name="excelFile" accept=".xlsx" onChange={handleFileUpload} className="form-control" />
                                        {errors.excelFile && <div className="text-danger">{errors.excelFile}</div>}
                                    </div>
                                    <div class="form-group">
                                        <label>Exam</label>
                                        <Select
                                            options={optionsExam}
                                            isSearchable={isSearchable}
                                            isClearable={isClearable}
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
                    <ToastContainer />
                </div>
            </Layout>
        </>
    );
}
export default TestExcel_Create;
