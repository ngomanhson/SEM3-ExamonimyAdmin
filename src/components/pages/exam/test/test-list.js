import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import url from "../../../services/url";
import { format } from "date-fns";
function Test_List() {
    const [tests, setTests] = useState([]);
    const [studentNames, setStudentNames] = useState({});
    const [exams, setExams] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [testsPerPage] = useState(15);
    //in ra danh sách bài thi theo kì thi
    const loadTestList = async (examId) => {
        try {
            const response = await api.get(url.TEST.LIST);
            setTests(response.data);
        } catch (error) {}
    };

    useEffect(() => {
        const fetchTestList = async () => {
            try {
                const response = await api.get(url.TEST.LIST);
                setTests(response.data);
                const examResponse = await api.get(url.EXAM.LIST);
                setExams(examResponse.data);
            } catch (error) {
                console.error("Error loading data: ", error);
            }
        };
        fetchTestList();
    }, []);

    const getExamName = (examId) => {
        //hien thi ten exam
        const exam = exams.find((exam) => exam.id === examId);
        return exam ? exam.name : "";
    };
    const indexOfLastTest = currentPage * testsPerPage;
    const indexOfFirstTest = indexOfLastTest - testsPerPage;
    const currentTests = tests.slice(indexOfFirstTest, indexOfLastTest);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        loadTestList();
    });
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
                                        Test List
                                        <NavLink
                                            to={`/test-create`}
                                            data-bs-toggle="modal"
                                            data-bs-target="#signup-modal"
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
                                            <th>Status</th>
                                            <th className="text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentTests.map((item, index) => {
                                            return (
                                                <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{item.name}</td>
                                                    <td>
                                                        {getExamName(
                                                            item.exam_id
                                                        )}
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
                                                    <td>{item.past_marks}</td>
                                                    <td>{item.total_marks}</td>
                                                    <td>
                                                        {item.status === 0
                                                            ? "It's not time yet"
                                                            : "Test time is over"}
                                                    </td>
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

            <div className="row">
                <div className="col">
                    <ul className="pagination mb-4">
                        <li className="page-item">
                            <button
                                className="page-link"
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                        </li>

                        {Array.from(
                            {
                                length: Math.ceil(tests.length / testsPerPage),
                            },
                            (_, i) => (
                                <li
                                    key={i}
                                    className={`page-item ${
                                        i + 1 === currentPage ? "active" : ""
                                    }`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => paginate(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                </li>
                            )
                        )}
                        <li className="page-item">
                            <button
                                className="page-link"
                                onClick={() => paginate(currentPage + 1)}
                                disabled={
                                    currentPage ===
                                    Math.ceil(tests.length / testsPerPage)
                                }
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <div
                id="signup-modal"
                class="modal fade"
                tabindex="-1"
                role="dialog"
                aria-hidden="true"
            >
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-body">
                            <div class="text-center mt-2 mb-4">
                                <div class="auth-logo">
                                    <a href="index.html" class="logo logo-dark">
                                        <span class="logo-lg">
                                            <img
                                                src="assets/img/logo.png"
                                                alt
                                                height="42"
                                            />
                                        </span>
                                    </a>
                                </div>
                            </div>
                            <div class="text-center mt-2 mb-4">
                                <h6>
                                    Do you want to create a multiple choice or
                                    essay test?
                                </h6>
                            </div>
                            <div class="text-center mt-2 mb-4">
                                <NavLink
                                    to="/test-create"
                                    style={{
                                        color: "white",
                                    }}
                                >
                                    <button
                                        class="btn btn-primary"
                                        data-bs-dismiss="modal"
                                    >
                                        Multiple choice
                                    </button>
                                </NavLink>
                                <NavLink
                                    to="/test-essay-create"
                                    style={{
                                        color: "white",
                                    }}
                                >
                                    {" "}
                                    <button
                                        class="btn btn-primary"
                                        data-bs-dismiss="modal"
                                        style={{
                                            color: "white",
                                            marginLeft: "10px",
                                        }}
                                    >
                                        Essay test
                                    </button>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Test_List;
