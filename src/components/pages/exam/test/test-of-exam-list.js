import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import url from "../../../services/url";
import { format } from "date-fns";
function Test_Of_Exam_List() {
    const { id } = useParams();
    const [tests, setTests] = useState([]);
    const [examNames, setExamNames] = useState({});
    const [studentNames, setStudentNames] = useState({});
    const [examName, setExamName] = useState("");

    //in ra danh sách bài thi theo kì thi
    const loadTestForExam = async (examId) => {
        try {
            const response = await api.get(
                `${url.TEST.EXAM_ID}?examId=${examId}`
            );
            setTests(response.data);
        } catch (error) {}
    };

    // hiển thị tên kì thi
    const fetchExamNames = async () => {
        try {
            const response = await api.get(url.EXAM.LIST);
            const examData = response.data.reduce((acc, curr) => {
                acc[curr.id] = curr.name;
                return acc;
            }, {});
            setExamNames(examData);
            if (examData[id]) {
                setExamName(examData[id]);
            }
        } catch (error) {}
    };

    // hiển thị tên học sinh
    const fetchStudentNames = async () => {
        try {
            const response = await api.get(url.STUDENT.LIST);
            const studentData = response.data.reduce((acc, curr) => {
                acc[curr.id] = curr.fullname;
                return acc;
            }, {});
            setStudentNames(studentData);
        } catch (error) {}
    };

    useEffect(() => {
        loadTestForExam(id);
        fetchExamNames();
        fetchStudentNames();
    }, [id]);
    return (
        <>
            <div className="page-header">
                <div className="row align-items-center">
                    <div className="col">
                        <h3 className="page-title">Test List</h3>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-sm-12">
                    <div className="card card-table">
                        <div className="card-body">
                            <div id="notification-container"></div>

                            <div className="page-header">
                                <div className="row align-items-center">
                                    <h5 class="card-title">
                                        Test of exam {examName}
                                        <NavLink
                                            to={`/test-submit`}
                                            className="btn btn-primary float-sm-end m-l-10"
                                        >
                                            Add New Test
                                        </NavLink>
                                    </h5>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table border-0 star-student table-hover table-center mb-0 datatable table-striped">
                                    <thead className="student-thread">
                                        <tr>
                                            <th>Ordinal</th>
                                            <th>Name Test</th>
                                            <th>Exam</th>
                                            <th>Student List</th>
                                            <th>Start Date Time</th>
                                            <th>End Date Time</th>
                                            <th>Past Marks</th>
                                            <th>Total Marks</th>
                                            <th className="text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tests.map((item, index) => {
                                            return (
                                                <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{item.name}</td>
                                                    <td>
                                                        {
                                                            examNames[
                                                                item.exam_id
                                                            ]
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            studentNames[
                                                                item.student_id
                                                            ]
                                                        }
                                                    </td>
                                                    <td>
                                                        {format(
                                                            new Date(
                                                                item.startDate
                                                            ),
                                                            "yyyy-MM-dd HH:mm"
                                                        )}
                                                    </td>
                                                    <td>
                                                        {format(
                                                            new Date(
                                                                item.endDate
                                                            ),
                                                            "yyyy-MM-dd HH:mm"
                                                        )}
                                                    </td>

                                                    <td>{item.past_marks}%</td>
                                                    <td>{item.total_marks}%</td>
                                                    <td className="text-end">
                                                        <div className="actions">
                                                            <a
                                                                href="javascript:;"
                                                                className="btn btn-sm bg-success-light me-2"
                                                            >
                                                                <i className="feather-eye"></i>
                                                            </a>
                                                            <a className="btn btn-sm bg-danger-light">
                                                                <i className="feather-edit"></i>
                                                            </a>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Test_Of_Exam_List;
