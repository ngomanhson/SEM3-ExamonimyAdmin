import { useParams } from "react-router-dom";
import Layout from "../../../layouts/layouts";
import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import url from "../../../services/url";
function Test_View_Essay() {
    const { slug } = useParams();
    const [examName, setExamName] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const [question, setQuestion] = useState([]);
    const [testData, setTestData] = useState({
        id: "",
        name: "",
        type_test: "",
        exam_id: "",
        startDate: "",
        endDate: "",
        past_marks: "",
    });

    //hien thi chi tiet bai test
    useEffect(() => {
        api.get(`${url.TEST.DETAIL}?slug=${slug}`)
            .then((response) => {
                setTestData(response.data);
                // fetchStudentGrades(response.data.id);
            })
            .catch((error) => {});
    }, [slug]);
    //format ngay gio thi
    const formatDateTime = (dateTimeString) => {
        const optionsDate = {
            month: "short",
            day: "numeric",
            year: "numeric",
        };
        const optionsTime = {
            hour: "numeric",
            minute: "numeric",
        };

        const dateTime = new Date(dateTimeString);
        const formattedDate = dateTime.toLocaleDateString("en-US", optionsDate);
        const formattedTime = dateTime.toLocaleTimeString("en-US", optionsTime);

        return `${formattedDate} | ${formattedTime}`;
    };

    //hien thi ten exam
    useEffect(() => {
        api.get(url.EXAM.LIST)
            .then((response) => {
                setExamName(response.data);
            })
            .catch((error) => {});
    }, []);
    const getExamName = (examId) => {
        const exam = examName.find((exam) => exam.id === examId);
        return exam ? exam.name : "Unknown Exam";
    };

    //lấy danh sách sinh viên của bài test
    const fetchStudentList = async () => {
        try {
            const response = await api.get(
                url.STUDENT.TEST_SLUG.replace("{}", slug)
            );
            setStudentList(response.data);
        } catch (error) {}
    };
    //lấy câu hỏi của bài test
    const fetchQuestion = async () => {
        try {
            const response = await api.get(
                url.TESTQUESTION.LIST.replace("{}", slug)
            );
            setQuestion(response.data);
        } catch (error) {}
    };
    useEffect(() => {
        fetchStudentList();
        fetchQuestion();
    }, [slug]);
    return (
        <>
            <Helmet>
                <title>Test Detail | Examonimy</title>
            </Helmet>
            <Layout>
                <div className="row">
                    <div class="card col-xl-4 d-flex">
                        <div class="card-body">
                            <div class="heading-detail">
                                <h4>Test Detail :</h4>
                            </div>
                            <div class="personal-activity">
                                <div class="personal-icons">
                                    <img
                                        src="assets/img/icons/buliding-icon.svg"
                                        alt
                                    />
                                </div>
                                <div class="views-personal">
                                    <h4>Name Test</h4>
                                    <h5>{testData.name}</h5>
                                </div>
                            </div>
                            <div class="personal-activity"></div>
                            <div class="personal-activity">
                                <div class="personal-icons">
                                    <i class="feather-file-text"></i>
                                </div>
                                <div class="views-personal">
                                    <h4>Type Test</h4>
                                    <h5>
                                        {testData.type_test === 0
                                            ? "Multiple Choice"
                                            : "Essay Test"}
                                    </h5>
                                </div>
                            </div>
                            <div class="personal-activity"></div>
                            <div class="personal-activity">
                                <div class="personal-icons">
                                    <i class="feather-book-open"></i>
                                </div>
                                <div class="views-personal">
                                    <h4>Exam</h4>
                                    <h5>{getExamName(testData.exam_id)}</h5>
                                </div>
                            </div>
                            <div class="personal-activity"></div>
                            <div class="personal-activity">
                                <div class="personal-icons">
                                    <i class="feather-calendar"></i>
                                </div>
                                <div class="views-personal">
                                    <h4>Start Date Time</h4>
                                    <h5>
                                        <ul className="teacher-date-list">
                                            <li>
                                                {formatDateTime(
                                                    testData.startDate
                                                )}
                                            </li>
                                        </ul>
                                    </h5>
                                </div>
                            </div>
                            <div class="personal-activity"></div>
                            <div class="personal-activity">
                                <div class="personal-icons">
                                    <i class="feather-calendar"></i>
                                </div>
                                <div class="views-personal">
                                    <h4>End Date Time</h4>
                                    <h5>
                                        <ul className="teacher-date-list">
                                            <li>
                                                {formatDateTime(
                                                    testData.endDate
                                                )}
                                            </li>
                                        </ul>
                                    </h5>
                                </div>
                            </div>
                            <div class="personal-activity"></div>
                            <div class="personal-activity">
                                <div class="personal-icons">
                                    <i class="feather-check-circle"></i>
                                </div>
                                <div class="views-personal">
                                    <h4>Part Marks</h4>
                                    <h5>{testData.past_marks}/100</h5>
                                </div>
                            </div>
                            <div class="personal-activity"></div>
                            <div class="personal-activity mb-0">
                                <div class="personal-icons">
                                    <i class="fa fa-cloud"></i>
                                </div>
                                <div class="views-personal">
                                    <h4>Status</h4>
                                    <h5>It's not time to take the test yet</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-8">
                        <div class="student-personals-grp">
                            <div class="card mb-0">
                                <div class="card-body">
                                    <div class="heading-detail">
                                        <h4>Question Details</h4>
                                    </div>
                                    <div class="hello-park">
                                        <h5>Content :</h5>
                                        {question.map((q, index) => (
                                            <p
                                                key={index}
                                                dangerouslySetInnerHTML={{
                                                    __html: q.title,
                                                }}
                                            ></p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div class="col-xl-12">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title">Questions</h5>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-hover mb-0">
                                        <thead>
                                            <tr>
                                                <th>Ordinal</th>
                                                <th>Name Question</th>
                                                <th>Answer A</th>
                                                <th>Answer B</th>
                                                <th>Answer C</th>
                                                <th>Answer D</th>
                                                {/* <th>Percent</th> */}
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}
export default Test_View_Essay;
