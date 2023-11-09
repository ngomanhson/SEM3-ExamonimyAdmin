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
    const { slug } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const animatedComponents = makeAnimated();
    const [isClearable, setIsClearable] = useState(true);
    const [isSearchable, setIsSearchable] = useState(true);
    const [exam, setExams] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [isClassEdited, setIsClassEdited] = useState(false);
    const [students, setStudents] = useState([]);
    const [testStudents, setTestStudents] = useState([]);
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    const currentTime = "00:00";
    const todayDateTimeLocal = `${year}-${month}-${day}T${currentTime}`; //chỉ cho người dùng chọn từ ngay hôm nay trở đi
    const navigate = useNavigate();
    const [nameExistsError, setNameExistsError] = useState("");
    const selectAllOption = {
        value: "select_all",
        label: "Select All Students",
    };
    const [testData, setTestData] = useState({
        name: "",
        exam_id: "",
        startDate: "",
        endDate: "",
        studentTds: [],
        past_marks: "",
    });
    const allStudentsOptions = [selectAllOption, ...students];
    const [errors, setErrors] = useState({
        name: "",
        exam_id: "",
        startDate: "",
        endDate: "",
        studentTds: "",
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
        if (selectedStudents.length === 0) {
            newErrors.studentTds = "Please choose students";
            valid = false;
        } else {
            const selectedStudentIds = selectedStudents.map(
                (option) => option.value
            );
            setTestData({ ...testData, studentTds: selectedStudentIds });
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
            try {
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

    //hiển thị danh sách lớp học
    useEffect(() => {
        const fetchClasses = async () => {
            try {
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
                    const response = await api.get(
                        `${url.STUDENT.CLASS_ID}?classId=${selectedClass.value}`
                    );
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
        setIsClassEdited(true);
    };

    const handleStudentChange = (selectedOption) => {
        if (selectedOption.some((option) => option.value === "select_all")) {
            const allStudents = students.map((student) => ({
                value: student.value,
                label: student.label,
            }));
            setSelectedStudents(allStudents);
        } else {
            setSelectedStudents(selectedOption);
        }
        const selectedStudentIds = selectedStudents.map(
            (option) => option.value
        );
        setTestData({ ...testData, studentTds: selectedStudentIds });
    };
    const studentOptions = isClassEdited ? allStudentsOptions : testStudents;
    const studentValue = isClassEdited ? selectedStudents : testStudents;
    useEffect(() => {
        const fetchTestStudents = async () => {
            try {
                const response = await api.get(
                    url.STUDENT.TEST_SLUG.replace("{}", slug)
                );
                const studentData = response.data.map((std) => ({
                    value: std.id,
                    label: std.fullname,
                }));
                setTestStudents(studentData);
            } catch (error) {}
        };
        fetchTestStudents();
    }, [slug]);

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
                const rs = await api.put(
                    `${url.TEST.EDIT}?id=${testData.id}`,
                    testData
                );
                toast.success("Update Test Successfully", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
                setTimeout(() => {
                    navigate(`/test-list`); //chuyển đến trang test-list
                }, 3000);
            } catch (error) {
                if (
                    error.response.status === 400 &&
                    error.response.data === "Class name already exists"
                ) {
                    setNameExistsError("This test name already exists");
                } else {
                }
            }
        }
    };
    return (
        <>
            <Helmet>
                <title>Test | Examonimy</title>
            </Helmet>
            <Layout>
                <div className="page-header">
                    <div className="row">
                        <div className="col">
                            <h3 className="page-title">
                                Edit Test Information
                            </h3>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-12">
                        <form onSubmit={handleSubmit}>
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="card-title">
                                        Edit Test Information
                                    </h5>
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
                                        {errors.name && (
                                            <div className="text-danger">
                                                {errors.name}
                                            </div>
                                        )}
                                        {nameExistsError && (
                                            <div className="text-danger">
                                                {nameExistsError}
                                            </div>
                                        )}
                                    </div>
                                    <div class="form-group">
                                        <label>Exam</label>
                                        <Select
                                            options={optionsExam}
                                            isSearchable={isSearchable}
                                            isClearable={isClearable}
                                            value={optionsExam.find(
                                                (option) =>
                                                    option.value ===
                                                    testData.exam_id
                                            )}
                                            onChange={handleChangeExam}
                                        />
                                        {errors.exam_id && (
                                            <div className="text-danger">
                                                {errors.exam_id}
                                            </div>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label>Class</label>
                                        <Select
                                            isSearchable={isSearchable}
                                            isClearable={isClearable}
                                            options={OptionsClasses}
                                            onChange={handleClassChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Student</label>
                                        <Select
                                            closeMenuOnSelect={false}
                                            components={animatedComponents}
                                            isMulti
                                            options={studentOptions}
                                            onChange={(selectedOption) => {
                                                if (isClassEdited) {
                                                    handleStudentChange(
                                                        selectedOption
                                                    );
                                                } else {
                                                    setTestStudents(
                                                        selectedOption
                                                    );
                                                }
                                            }}
                                            value={studentValue}
                                        />
                                        {errors.studentTds && (
                                            <div className="text-danger">
                                                {errors.studentTds}
                                            </div>
                                        )}
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
                                        {errors.startDate && (
                                            <div className="text-danger">
                                                {errors.startDate}
                                            </div>
                                        )}
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
                                        {errors.endDate && (
                                            <div className="text-danger">
                                                {errors.endDate}
                                            </div>
                                        )}
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
                                            <option value="">
                                                Select pass score...
                                            </option>
                                            <option value="50">50</option>
                                            <option value="40">40</option>
                                            <option value="30">30</option>
                                            <option value="20">20</option>
                                        </select>
                                        {errors.past_marks && (
                                            <div className="text-danger">
                                                {errors.past_marks}
                                            </div>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label>Total Score</label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            value="100"
                                            name="total_marks"
                                            disabled
                                        />
                                    </div>
                                    <div className="text-end">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                        >
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
