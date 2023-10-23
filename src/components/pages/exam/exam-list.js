import { useEffect, useState } from "react";
import api from "../../services/api";
import url from "../../services/url";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";
function Exam_List() {
    const [exams, setExams] = useState([]);
    const [courseNames, setCourseNames] = useState({});
    const [error, setError] = useState(null);

    //hiển thị danh sách các kỳ thi
    const loadExams = async () => {
        try {
            const response = await api.get(url.EXAM.LIST);
            setExams(response.data);
        } catch (error) {
            setError("Failed to load classes.");
        }
    };

    //hiển thị tên khoá học
    const fetchCourseNames = async () => {
        try {
            const response = await api.get(url.COURSE.LIST);
            const courseNameMap = {};
            response.data.forEach((course) => {
                courseNameMap[course.id] = course.name;
            });
            setCourseNames(courseNameMap);
        } catch (error) {
            setError("Failed to fetch course names.");
        }
    };

    //thông báo
    const showNotification = (type, message) => {
        const notificationContainer = document.getElementById(
            "notification-container"
        );
        const notification = document.createElement("div");
        notification.className = `alert alert-${type}`;
        notification.textContent = message;
        notificationContainer.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    };

    //xử lý xoá kì thi
    const handleDeleteExam = (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this exam?"
        );
        if (confirmed) {
            deleteExam(id);
        }
    };
    const deleteExam = async (id) => {
        try {
            await api.delete(`${url.EXAM.DELETE}?id=${id}`);
            setExams(exams.filter((c) => c.id !== id));
        } catch (error) {
            showNotification(
                "danger",
                "The exam cannot be deleted because this exam has existing tests."
            );
        }
    };

    useEffect(() => {
        loadExams();
        fetchCourseNames();
    }, []);
    return (
        <>
            <div className="page-header">
                <div className="row align-items-center">
                    <div className="col">
                        <h3 className="page-title">Exam List</h3>
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
                                    <div className="col">
                                        <h3 className="page-title">Exam</h3>
                                    </div>
                                    <div className="col-auto text-end float-end ms-auto download-grp">
                                        <a
                                            href="#"
                                            className="btn btn-outline-primary me-2"
                                        >
                                            <i className="fas fa-download"></i>{" "}
                                            Download
                                        </a>
                                        <NavLink
                                            to="/exam-create"
                                            className="btn btn-primary"
                                        >
                                            <i className="fas fa-plus"></i>
                                        </NavLink>
                                    </div>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table border-0 star-student table-hover table-center mb-0 datatable table-striped">
                                    <thead className="student-thread">
                                        <tr>
                                            <th>Ordinal</th>
                                            <th>Name Exam</th>
                                            <th>Course</th>
                                            <th>Date</th>
                                            <th className="text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {exams.map((item, index) => {
                                            return (
                                                <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{item.name}</td>
                                                    <td>
                                                        {
                                                            courseNames[
                                                                item.course_id
                                                            ]
                                                        }
                                                    </td>
                                                    <td>
                                                        {format(
                                                            new Date(
                                                                item.start_date
                                                            ),
                                                            "yyyy-MM-dd"
                                                        )}
                                                    </td>
                                                    <td className="text-end">
                                                        <div className="actions">
                                                            <NavLink
                                                                to={`/test-of-exam-list/${item.id}`}
                                                                className="btn btn-sm bg-success-light me-2"
                                                            >
                                                                <i className="feather-eye"></i>
                                                            </NavLink>
                                                            <NavLink
                                                                to={`/exam-edit/${item.slug}`}
                                                                className="btn btn-sm bg-danger-light"
                                                            >
                                                                <i className="feather-edit"></i>
                                                            </NavLink>
                                                            <NavLink
                                                                onClick={() =>
                                                                    handleDeleteExam(
                                                                        item.id
                                                                    )
                                                                }
                                                                className="btn btn-sm bg-danger-light"
                                                            >
                                                                <i className="feather-trash"></i>
                                                            </NavLink>
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
export default Exam_List;
