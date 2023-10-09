import { useEffect, useState } from "react";
import api from "../../services/api";
import url from "../../services/url";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";
function Student_List() {
    const [students, setStudents] = useState([]);
    const [classNames, setClassNames] = useState({});
    const [error, setError] = useState(null);

    const loadStudents = async () => {
        try {
            const response = await api.get(url.STUDENT.LIST);
            setStudents(response.data);
        } catch (error) {
            setError("Failed to load students.");
        }
    };

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
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="students.html">Student</a>
                                </li>
                                <li className="breadcrumb-item active">
                                    All Students
                                </li>
                            </ul>
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
                                        <h3 className="page-title">Students</h3>
                                    </div>
                                    <div className="col-auto text-end float-end ms-auto download-grp">
                                        <a
                                            href="students.html"
                                            className="btn btn-outline-gray me-2 active"
                                        >
                                            <i className="feather-list"></i>
                                        </a>
                                        <a
                                            href="students-grid.html"
                                            className="btn btn-outline-gray me-2"
                                        >
                                            <i className="feather-grid"></i>
                                        </a>
                                        <a
                                            href="#"
                                            className="btn btn-outline-primary me-2"
                                        >
                                            <i className="fas fa-download"></i>{" "}
                                            Download
                                        </a>
                                        <a
                                            href="add-student.html"
                                            className="btn btn-primary"
                                        >
                                            <i className="fas fa-plus"></i>
                                        </a>
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
                                        {students.map((item, index) => {
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
                                                                    src="assets/img/profiles/avatar-01.jpg"
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
                                                                to={`/student-edit/${item.id}`}
                                                                className="btn btn-sm bg-danger-light"
                                                            >
                                                                <i className="feather-edit"></i>
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
export default Student_List;
