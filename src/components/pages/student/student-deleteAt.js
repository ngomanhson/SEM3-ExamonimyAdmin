import { useEffect, useState } from "react";
import api from "../../services/api";
import url from "../../services/url";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";
function Student_DeleteAt() {
    const [students, setStudents] = useState([]);
    const [classNames, setClassNames] = useState({});
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [studentsPerPage] = useState(20);
    //hiển thị danh sách sinh viên
    const loadStudents = async () => {
        try {
            const response = await api.get(url.STUDENT.LIST);
            // Filter out students with deleteAt not equal to null
            const filteredStudents = response.data.filter((student) => student.deleteAt !== null);
            setStudents(filteredStudents);
        } catch (error) {
            setError("Failed to load students.");
        }
    };

    //hiển thị tên lớp học
    const fetchClassNames = async () => {
        try {
            const response = await api.get(url.CLASS.LIST);
            const classData = response.data.reduce((acc, curr) => {
                acc[curr.id] = curr.name;
                return acc;
            }, {});
            setClassNames(classData);
        } catch (error) {
            setError("Failed to load class names.");
        }
    };

    //xử lý xoá sinh viên
    const handleDeleteStudent = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to permanently delete this student?"
        );
        if (confirmed) {
            try {
                await api.delete(`${url.STUDENT.DELETE_FOREVER}/${id}`);
                setStudents((prevStudents) =>
                    prevStudents.filter((student) => student.id !== id)
                );
            } catch (error) {
                console.error("Failed to delete student:", error);
            }
        }
    };

    //paginate
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = students.slice(
        indexOfFirstStudent,
        indexOfLastStudent
    );

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        loadStudents();
        fetchClassNames();
    }, []);
    return (
        <>
            <div className="page-header">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="page-sub-header">
                            <h3 className="page-title">Students</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="student-group-form">
                <div className="row">
                    <div className="col-lg-3 col-md-6">
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by ID ..."
                            />
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by Name ..."
                            />
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by Phone ..."
                            />
                        </div>
                    </div>
                    <div className="col-lg-2">
                        <div className="search-student-btn">
                            <button type="btn" className="btn btn-primary">
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12">
                    <div className="card card-table comman-shadow">
                        <div className="card-body">
                            <div className="page-header">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <h3 className="page-title">Students history</h3>
                                    </div>
                                    <div className="col-auto text-end float-end ms-auto download-grp">
                                        <a
                                            href=""
                                            className="btn btn-outline-gray me-2 active"
                                        >
                                            <i className="feather-list"></i>
                                        </a>
                                        <a
                                            href=""
                                            className="btn btn-outline-gray me-2"
                                        >
                                            <i className="feather-grid"></i>
                                        </a>
                                        <a
                                            href=""
                                            className="btn btn-outline-primary me-2"
                                        >
                                            <i className="fas fa-download"></i>{" "}
                                            Download
                                        </a>
                                        <NavLink
                                            to="/student-create"
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
                                            <th>
                                                <div className="form-check check-tables">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        value="something"
                                                    />
                                                </div>
                                            </th>
                                            <th>Student Code</th>
                                            <th>Full Name</th>
                                            <th>Birth Day</th>
                                            <th>Email</th>
                                            <th>Phone Number</th>
                                            <th>Gender</th>
                                            <th>Address</th>
                                            <th>Class</th>
                                            <th className="text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentStudents.map((item, index) => {
                                            return (
                                                <tr>
                                                    <td>
                                                        <div className="form-check check-tables">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                value="something"
                                                            />
                                                        </div>
                                                    </td>
                                                    <td>{item.student_code}</td>
                                                    <td>
                                                        <h2 className="table-avatar">
                                                            <a
                                                                href="student-details.html"
                                                                className="avatar avatar-sm me-2"
                                                            >
                                                                <img
                                                                    className="avatar-img rounded-circle"
                                                                    src={
                                                                        item.avatar
                                                                    }
                                                                    alt="User Image"
                                                                />
                                                            </a>
                                                            <a href="student-details.html">
                                                                {item.fullname}
                                                            </a>
                                                        </h2>
                                                    </td>
                                                    <td>
                                                        {format(
                                                            new Date(
                                                                item.birthday
                                                            ),
                                                            "yyyy-MM-dd"
                                                        )}
                                                    </td>
                                                    <td>{item.email}</td>
                                                    <td>{item.phone}</td>
                                                    <td>{item.gender}</td>
                                                    <td>{item.address}</td>
                                                    <td>
                                                        {
                                                            classNames[
                                                                item.class_id
                                                            ]
                                                        }
                                                    </td>
                                                    <td className="text-end">
                                                        <div className="actions">
                                                            <a
                                                                href="javascript:;"
                                                                className="btn btn-sm bg-success-light me-2"
                                                            >
                                                                <i className="feather-eye"></i>
                                                            </a>
                                                            <NavLink
                                                                to={`/student-edit/${item.student_code}`}
                                                                className="btn btn-sm bg-danger-light"
                                                            >
                                                                <i className="feather-edit"></i>
                                                            </NavLink>
                                                            <NavLink
                                                                onClick={() =>
                                                                    handleDeleteStudent(
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
                                length: Math.ceil(
                                    students.length / studentsPerPage
                                ),
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
                                    Math.ceil(students.length / studentsPerPage)
                                }
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}
export default Student_DeleteAt;
